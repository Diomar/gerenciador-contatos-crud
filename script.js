

// Variáveis para referenciar elementos do formulário
const nameInput  = document.getElementById('name');
const cpfInput   = document.getElementById('cpf');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');

// Variaveis do modal ediatar 
const editName  = document.getElementById('editName');
const editCpf   = document.getElementById('editCpf');
const editPhone = document.getElementById('editPhone');
const editEmail = document.getElementById('editEmail');

// Variável para acompanhar o índice do contato em edição
let editingContactIndex = -1;


// Funções para manipulação dos dados 
//===================================//

// Adicionar um novo contato
function addContact(name, cpf, phone, email) {

    if (phone.replace(/\D/g, '').length < 8) {
        alert('O número de telefone deve ter pelo menos 8 dígitos.');
        return;
    }

    // Verifique se o CPF é válido
    if (!validateCPF(cpf)) {
        alert('CPF inválido.');
        return;
    }

    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];

    // Verifique se o CPF já está registrado
    if (contactList.some(contact => contact.cpf === cpf)) {
        alert('CPF já registrado. Não é permitido adicionar CPFs iguais.');
        return;
    }

    contactList.push({ name, cpf, phone, email });
    localStorage.setItem('contacts', JSON.stringify(contactList));
    listContacts();
    clearForm();
}


// Atualizar um contato existente
function updateContact(name, cpf, phone, email) {
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];

    if (phone.replace(/\D/g, '').length < 8) {
        alert('O número de telefone deve ter pelo menos 8 dígitos.');
        return;
    }

    if (editingContactIndex >= 0 && editingContactIndex < contactList.length) {
        contactList[editingContactIndex] = { name, cpf, phone, email };
        localStorage.setItem('contacts', JSON.stringify(contactList));
        listContacts();
        editingContactIndex = -1;
        clearForm();
    }
}

// Editar um contato existente *
function editContact(index) {
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];

    const contact = contactList[index];

    if (!contact) return;

    editName.value  = contact.name;
    editCpf.value   = contact.cpf;
    editPhone.value = contact.phone;
    editEmail.value = contact.email;

    editingContactIndex = index;
    const editModal = document.querySelector('.editModal');
    editModal.style.display = 'block';
    
    const closeButton = document.getElementById('closeModal');
    closeButton.addEventListener('click', () => {
        // Feche o modal ao clicar no botão "Fechar"
        editModal.style.display = 'none';
    });
    
    console.log('Botão edidar acionado')
    console.log('modal ligada')

    // Após abrir o modal, atribua um evento de clique ao botão de salvar
    document.getElementById('saveEdit').addEventListener('click', () => {
        
    // Obtém os valores dos campos de edição do modal
    const editedName  = editName.value;
    const editedCpf   = editCpf.value;
    const editedPhone = editPhone.value;
    const editedEmail = editEmail.value;

    // Realize as mesmas validações que você fez para adicionar um novo contato
    if (editedPhone.replace(/\D/g, '').length < 8) {
        alert('O número de telefone deve ter pelo menos 8 dígitos.');
        return;
    }

    // Verifique se o CPF é válido
    if (!validateCPF(editedCpf)) {
        alert('CPF inválido.');
        return;
    }

    // Atualize o contato existente com as informações editadas
    updateContact(editedName, editedCpf, editedPhone, editedEmail);
    
    // Feche o modal de edição
    const editModal = document.querySelector('.editModal');
    editModal.style.display = 'none';
});

}

// Excluir um contato
function deleteContact(index) {
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    contactList.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contactList));
    listContacts();
}

// Listar os contatos na tabela
function listContacts() {
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactTable = document.getElementById('contact-list');

    contactTable.innerHTML = '';

    contactList.forEach((contact, index) => {
        const row = contactTable.insertRow();

        // Crie células para o nome, telefone, e-mail e ações do contato
        const nameCell    = row.insertCell(0);
        const cpfCell     = row.insertCell(1);
        const phoneCell   = row.insertCell(2);
        const emailCell   = row.insertCell(3);
        const actionsCell = row.insertCell(4);

        // Preencha as células com os dados do contato
        nameCell.textContent  = contact.name;
        cpfCell.textContent   = contact.cpf;
        phoneCell.textContent = contact.phone;
        emailCell.textContent = contact.email;

        // Cria os botões de "Editar" e "Excluir" para cada contato
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className   = 'edit';
        editButton.addEventListener('click', () => editContact(index));

        // 
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.className   = 'delete';
        deleteButton.addEventListener('click', () => deleteContact(index));

        // Adicione os botões à célula de ações
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
}

// Filtrar contatos com base na pesquisa
function filterContacts() {
    const searchTerm  = document.getElementById('search').value.toLowerCase();
    const contactRows = document.querySelectorAll('#contact-list tr');

    contactRows.forEach((row) => {
        const name  = row.cells[0].textContent.toLowerCase();
        const cpf   = row.cells[1].textContent.toLowerCase();
        const phone = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();

        if (name.includes(searchTerm)  
            || cpf.includes(searchTerm)   
            || phone.includes(searchTerm) 
            || email.includes(searchTerm)) {
            row.style.display = ''; // Exibe a linha se corresponder à pesquisa
        } else {
            row.style.display = 'none'; // Oculta a linha se não corresponder à pesquisa
        }
    });
}

// Eventos
//===========================================//

// Event listener para o campo de telefone
phoneInput.addEventListener('input', () => {
    formatPhoneNumber(phoneInput);
});

// Event listener para o formulário de adicionar contato
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = nameInput.value;
    const cpf   = cpfInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;

    if (editingContactIndex === -1) {
        addContact(name, cpf, phone, email); // Chame a função addContact para adicionar um novo contato

    }else {
        updateContact(name, cpf, phone, email); // Chame a função updateContact para atualizar o contato existente
    }
});

// Event listener para o campo de pesquisa
document.getElementById('search').addEventListener('input', filterContacts);

// Funções relacionadas à interface do usuário
//=============================================//

function clearForm() {
    nameInput.value = '';
    cpfInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    
    // Restaure o botão "Adicionar" após a limpeza
    const addButton = document.querySelector('form button');
    addButton.textContent = 'Adicionar';
}

// Função para formatar o número de telefone
function formatPhoneNumber(phoneInput) {
    const phoneNumber = phoneInput.value.replace(/\D/g, '');

    let formattedPhoneNumber = '';

    if (phoneNumber.length > 0) {
        formattedPhoneNumber += `(${phoneNumber.substring(0, 2)}`;
    }

    if (phoneNumber.length > 2) {
        formattedPhoneNumber += `) ${phoneNumber.substring(2, 7)}`;
    }

    if (phoneNumber.length > 7) {
        formattedPhoneNumber += `-${phoneNumber.substring(7, 11)}`;
    }

    phoneInput.value = formattedPhoneNumber;
}

// Inicializa a lista de contatos ao carregar a página
listContacts();

// Função para formatar o CPF com uma máscara
function formatCPF(cpf) {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Aplica a máscara do CPF (###.###.###-##)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    return cpf;
}


// Event listener para o campo de CPF
cpfInput.addEventListener('input', () => {

    let cpf = cpfInput.value;

    cpf = formatCPF(cpf);
    cpfInput.value = cpf;
});

// Função para validar CPF
function validateCPF(cpf) {

    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, ''); 

    if (cpf.length !== 11) {
        return false; // 
    }

    // Verifica se todos os dígitos são iguais (números comuns de CPF inválidos)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    let remainder;

    // Calcula o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf[9])) {
        return false;
    }

    sum = 0;

    // Calcula o segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf[i - 1]) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf[10])) {
        return false;
    }

    return true; // CPF válido
}
