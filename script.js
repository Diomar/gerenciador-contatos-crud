// Variáveis para referenciar elementos do formulário
const nome_Input  = document.getElementById('nome');
const cpf_Input   = document.getElementById('cpf');
const tel_Input   = document.getElementById('tel');
const email_Input = document.getElementById('email');

// Referencias para elementos do modal de edição do contato
const edita_Nome  = document.getElementById('edita_Nome')
const edita_Cpf   = document.getElementById('edita_Cpf')
const edita_Tel   = document.getElementById('edita_Tel')
const edita_Email = document.getElementById('edita_Email')

// Variável para acompanhar o índice do contato em edição
let editingContactIndex = -1;

//======================================//
// Funções para formatar e validar campos
//======================================//

function valida_Nome(nome) {
    if (nome.trim() === '') {
        return false;
    }
    return true;
}

function valida_Cpf(cpf) {

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

    return true; 
}

function formata_Cpf(cpf) {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Aplica a máscara do CPF (###.###.###-##)
    if (cpf.length >= 3 && cpf.length < 6) {
        cpf = cpf.replace(/(\d{3})(\d*)/, '$1.$2');
    } else if (cpf.length >= 6 && cpf.length < 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d*)/, '$1.$2.$3');
    } else if (cpf.length >= 9 && cpf.length < 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d*)/, '$1.$2.$3-$4');
    } else if (cpf.length >= 11) {
        // Se o CPF estiver completo, mantenha apenas os primeiros 11 dígitos
        cpf = cpf.slice(0, 11);
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return cpf;
}

function valida_Tel(tel) {
    // Remove todos os caracteres não numéricos
    const numericPhone = tel.replace(/\D/g, '');

    // Verifique se o número de telefone tem pelo menos 8 dígitos
    if (numericPhone.length < 8) {
        return false; // Número de telefone inválido
    }

    // Se necessário, você pode adicionar outras regras de validação aqui

    return true; // Número de telefone válido
}

function formata_Tel(tel_Input) {

    const phoneNumber = tel_Input.value.replace(/\D/g, '');

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

    tel_Input.value = formattedPhoneNumber;
}

function valida_Email(email) {
    // Expressão regular para validar o formato do e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Testa o e-mail em relação à expressão regular
    if (!emailRegex.test(email)) {
        return false; // E-mail inválido
    }

    return true; // E-mail válido
}

//===================================//
// Funções para manipulação dos dados 
//===================================//

function add_Contato(nome, cpf, tel, email) {

     // Realize as validações aqui
     if (!valida_Nome(nome)) {
        alert('Nome inválido.');
        return;
    }

    // Verifique se o CPF é válido
    if (!valida_Cpf(cpf)) {
        alert('CPF inválido.');
        return;
    }

    if (!valida_Tel(tel)) {
        alert('Telefone inválido.');
        return;
    }

    const lista_Ctt_LStorage = JSON.parse(localStorage.getItem('contacts')) || [];

    // Verifique se o CPF já está registrado
    if (lista_Ctt_LStorage.some(contact => contact.cpf === cpf)) {
        alert('CPF já registrado. Não é permitido adicionar CPFs iguais.');
        return;
    }

    lista_Ctt_LStorage.push({ nome, cpf, tel, email });
    localStorage.setItem('contacts', JSON.stringify(lista_Ctt_LStorage));
    listContacts();
    clearForm();
}

// Editar um contato existente *
function editar_Contato(index) {
    
    const lista_Ctt_LStorage = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact     = lista_Ctt_LStorage[index];
    const editModal = document.querySelector('.editModal');

    if (!contact) return;

    edita_Nome.value  = contact.nome;
    edita_Cpf.value   = contact.cpf;
    edita_Tel.value   = contact.tel;
    edita_Email.value = contact.email;

    editingContactIndex = index;
    
    editModal.style.display = 'block';

    const fechaModalElement = document.querySelector('.fechaModal');
    const btnCancelar = document.getElementById('btnCancelar');
    
    // Event listener para formatar o CPF enquanto o usuário digita
    edita_Cpf.addEventListener('input', () => {
        edita_Cpf.value = formata_Cpf(edita_Cpf.value);
    });

    function fechaModal() {
        editModal.style.display = 'none';
    }

    // Adicione eventos de clique para ambos os elementos
    fechaModalElement.addEventListener('click', fechaModal)
    btnCancelar.addEventListener('click', fechaModal);

// Em desenvolvimento========================================================================================================
   
    const salvarAlteracoes = document.getElementById("salvarAlteracoes");

    function onClickSalvarAlteracoes() {
        // Obtém os valores dos campos a serem editados
        const editedName  = edita_Nome.value;
        const editedCpf   = edita_Cpf.value;
        const editedPhone = edita_Tel.value;
        const editedEmail = edita_Email.value;
 
        // Realize as validações aqui
        if (!valida_Nome(editedName)) {
            alert('Nome inválido.');
            return;
        }
    
        if (!valida_Cpf(editedCpf)) {
            alert('CPF inválido.');
            return;
        }
    
        if (!valida_Tel(editedPhone)) {
            alert('Telefone inválido.');
            return;
        }
    
        if (!valida_Email(editedEmail)) {
            alert('Email inválido.');
            return;
        }
    
        // Atualize o contato existente com as informações editadas
        updateContact(editedName, editedCpf, editedPhone, editedEmail);
        
        // Feche o modal de edição
        const editModal = document.querySelector('.editModal');
        editModal.style.display = 'none';
    
        // Remova o ouvinte de evento após a execução bem-sucedida
        salvarAlteracoes.removeEventListener('click', onClickSalvarAlteracoes);
    }

    // Adicione um ouvinte de evento para o clique no botão "Salvar Alterações"
    salvarAlteracoes.addEventListener('click', onClickSalvarAlteracoes);


     // Remova os ouvintes de evento existentes
     salvarAlteracoes.removeEventListener('click', onClickSalvarAlteracoes);

     // Adicione um novo ouvinte de evento para o clique no botão "Salvar Alterações"
     salvarAlteracoes.addEventListener('click', onClickSalvarAlteracoes);
}

// Excluir um contato
function excluir_Contato(index) {
    const lista_Ctt_LStorage = JSON.parse(localStorage.getItem('contacts')) || [];
    lista_Ctt_LStorage.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(lista_Ctt_LStorage));
    listContacts();
}

// Atualizar um contato existente
function updateContact(nome, cpf, tel, email) {
    const lista_Ctt_LStorage = JSON.parse(localStorage.getItem('contacts')) || [];

    if (editingContactIndex >= 0 && editingContactIndex < lista_Ctt_LStorage.length) {
        lista_Ctt_LStorage[editingContactIndex] = { nome, cpf, tel, email };
        localStorage.setItem('contacts', JSON.stringify(lista_Ctt_LStorage));
        listContacts();
        editingContactIndex = -1;
        clearForm();
    }
}

// Listar os contatos na tabela
function listContacts() {
    const lista_Ctt_LStorage = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactTable = document.getElementById('contact-list');

    contactTable.innerHTML = '';

    lista_Ctt_LStorage.forEach((contact, index) => {
        const row = contactTable.insertRow();

        // Crie células para o nome, telefone, e-mail e ações do contato
        const nameCell    = row.insertCell(0);
        const cpfCell     = row.insertCell(1);
        const phoneCell   = row.insertCell(2);
        const emailCell   = row.insertCell(3);
        const actionsCell = row.insertCell(4);

        // Preencha as células com os dados do contato
        nameCell.textContent  = contact.nome;
        cpfCell.textContent   = contact.cpf;
        phoneCell.textContent = contact.tel;
        emailCell.textContent = contact.email;

        // Cria os botões de "Editar" e "Excluir" para cada contato
        const btn_Editar = document.createElement('button');
        btn_Editar.textContent = 'Editar';
        btn_Editar.className   = 'btn_Editar';
        btn_Editar.addEventListener('click', () => editar_Contato(index));

        const btn_Excluir = document.createElement('button');
        btn_Excluir.textContent = 'Excluir';
        btn_Excluir.className   = 'btn_Excluir';
        btn_Excluir.addEventListener('click', () => excluir_Contato(index));

        // Adicione os botões à célula de ações
        actionsCell.appendChild(btn_Editar);
        actionsCell.appendChild(btn_Excluir);
    });
}

// Filtrar contatos com base na pesquisa
function filterContacts() {
    const searchTerm  = document.getElementById('search').value.toLowerCase();
    const contactRows = document.querySelectorAll('#contact-list tr');

    contactRows.forEach((row) => {
        const nome  = row.cells[0].textContent.toLowerCase();
        const cpf   = row.cells[1].textContent.toLowerCase();
        const tel   = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();

        if (nome.includes(searchTerm)  
            || cpf.includes(searchTerm)   
            || tel.includes(searchTerm) 
            || email.includes(searchTerm)) {
            row.style.display = ''; // Exibe a linha se corresponder à pesquisa
        } else {
            row.style.display = 'none'; // Oculta a linha se não corresponder à pesquisa
        }
    });
}


//===================================//
// Eventos 
//==================================//

// EventListener formulário Adicionar contato
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome  = nome_Input.value;
    const cpf   = cpf_Input.value;
    const tel   = tel_Input.value;
    const email = email_Input.value;

    if (editingContactIndex === -1) {

        //Chama a função adicionar contato
        add_Contato(nome, cpf, tel, email);

    } else {
        // Chama a função atualizar contato 
        updateContact(nome, cpf, tel, email); 
    }
});

// EventListener campo de pesquisa
document.getElementById('search').addEventListener('input', filterContacts);

// EventListener campo de telefone
tel_Input.addEventListener('input', () => {
    formata_Tel(tel_Input);
});
// EventListener campo de cpf
cpf_Input.addEventListener('input', () => {
    let cpf = cpf_Input.value;
        cpf = formata_Cpf(cpf);
    cpf_Input.value = cpf;
});

// EventListener campo telefone do modal de edição
edita_Tel.addEventListener('input', () => {
    formata_Tel(edita_Tel);
});

// Funções relacionadas à interface do usuário
//=============================================//

function clearForm() {
    nome_Input.value  = '';
    cpf_Input.value   = '';
    tel_Input.value   = '';
    email_Input.value = '';
    
    // Restaure o botão "Adicionar" após a limpeza
    const addButton = document.querySelector('form button');
    addButton.textContent = 'Adicionar';
}

// Inicializa a lista de contatos ao carregar a página
listContacts();