

// Variáveis para referenciar elementos do formulário
const nameInput  = document.getElementById('name');
const cpfInput   = document.getElementById('cpf');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');

// Variável para acompanhar o índice do contato em edição
let editingContactIndex = -1;

// Funções para manipulação dos dados 
//===================================//
// Função para validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) {
        return false; // O CPF deve ter 11 dígitos
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

// Funções para manipulação dos dados 

// Adicionar um novo contato
function addContact(name, cpf, phone, email) {
    // Verifique se o número de telefone tem pelo menos 8 dígitos
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
    contactList.push({ name, cpf, phone, email });
    localStorage.setItem('contacts', JSON.stringify(contactList));
    listContacts();
    clearForm();
}


// Adicionar um novo contato
function addContact(name, cpf, phone, email) {
    // Verifique se o número de telefone tem pelo menos 8 dígitos
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

// Editar um contato existente
function editContact(index) {
    // Obtenha a lista de contatos do armazenamento local ou crie uma lista vazia
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];

    // Obtenha o contato específico com base no índice fornecido
    const contact = contactList[index];

    // Se o contato não existir, saia da função
    if (!contact) return;

    // Preencha os campos de entrada com os valores do contato selecionado
    nameInput.value  = contact.name;
    cpfInput.value   = contact.cpf;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;

    // Defina o índice de edição para o contato em questão
    editingContactIndex = index;

    // Altere o texto do botão de envio do formulário para 'Alterar'
    const addButton = document.querySelector('form button');
    addButton.textContent = 'Alterar';
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
    // Obtenha a lista de contatos do armazenamento local ou crie uma lista vazia
    const contactList = JSON.parse(localStorage.getItem('contacts')) || [];

    // Obtenha uma referência à tabela de contatos no HTML
    const contactTable = document.getElementById('contact-list');

    // Limpe o conteúdo atual da tabela
    contactTable.innerHTML = '';

    // Itere sobre cada contato na lista
    contactList.forEach((contact, index) => {
        // Crie uma nova linha na tabela
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

        // Crie botões de "Editar" e "Excluir" para cada contato
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className   = 'edit';
        editButton.addEventListener('click', () => editContact(index));

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

// Event listener para o campo de telefone
phoneInput.addEventListener('input', () => {
    formatPhoneNumber(phoneInput);
});

// Event listener para o formulário de adicionar contato
// document.getElementById('contact-form').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const name = nameInput.value;
//     const cpf = cpfInput.value;
//     const phone = phoneInput.value;
//     const email = emailInput.value;

//     if (editingContactIndex === -1) {
//         addContact(name, cpf, phone, email); // Chame a função addContact para adicionar um novo contato

//         // Agora, aqui você pode enviar os dados para o serviço de envio de email
//         try {
//             const response = await fetch('https://formspree.io/f/seu_endpoint_aqui', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name,
//                     email,
//                 }),
//             });

//             if (response.ok) {
//                 // Dados enviados com sucesso, você pode mostrar uma mensagem de sucesso aqui
//                 console.log('Dados enviados com sucesso!');
//             } else {
//                 // Algo deu errado no envio, você pode mostrar uma mensagem de erro aqui
//                 console.error('Erro ao enviar os dados.');
//             }
//         } catch (error) {
//             console.error('Erro ao enviar os dados:', error);
//         }
//     } else {
//         updateContact(name, cpf, phone, email); // Chame a função updateContact para atualizar o contato existente
//     }
// });
// Event listener para o formulário de adicionar contato
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const cpf = cpfInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;

    if (editingContactIndex === -1) {
        // Agora, aqui você pode enviar os dados para o serviço de envio de email
        try {
            const emailResponse = await fetch('https://formspree.io/f/seu_endpoint_aqui', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                }),
            });

            if (emailResponse.ok) {
                // Dados de "Nome" e "Email" enviados com sucesso, você pode mostrar uma mensagem de sucesso aqui
                console.log('Dados de "Nome" e "Email" enviados com sucesso!');
            } else {
                // Algo deu errado no envio de "Nome" e "Email", você pode mostrar uma mensagem de erro aqui
                console.error('Erro ao enviar os dados de "Nome" e "Email".');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados de "Nome" e "Email":', error);
        }

        addContact(name, cpf, phone, email); // Chame a função addContact para adicionar um novo contato
    } else {
        updateContact(name, cpf, phone, email); // Chame a função updateContact para atualizar o contato existente
    }
});


// Event listener para o campo de pesquisa
document.getElementById('search').addEventListener('input', filterContacts);

// Funções relacionadas à interface do usuário
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
    // Obtém o valor atual do campo
    let cpf = cpfInput.value;

    // Formata o valor com a máscara
    cpf = formatCPF(cpf);

    // Define o valor formatado de volta no campo
    cpfInput.value = cpf;
});

