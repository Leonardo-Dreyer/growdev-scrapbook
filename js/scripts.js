const registerName = document.getElementById('register-name');
const registerPassword = document.getElementById('register-password');
const registerRepeatPassword = document.getElementById('register-repeatpassword');
const userName = document.getElementById('user-name');
const userPassword = document.getElementById('user-password');
const message = document.getElementById('message');
const messageLog = document.getElementById('message-log');
const messageRegister = document.getElementById('message-register');
const inputDescrition = document.getElementById('input-descrition');
const inputDetailing = document.getElementById('input-detailing');
const messageContent = document.getElementById('content');
axios.defaults.baseURL = 'https://scrapbook-api-growdev.herokuapp.com';
const myModal = new bootstrap.Modal('#register-modal');

function creatUser(event) {
    event.preventDefault();

    const userValid = validateUser(
        registerName.value,
        registerPassword.value,
        registerRepeatPassword.value
    );

    if (userValid === true) {
        axios
            .post('/users', {
                name: registerName.value,
                password: registerPassword.value,
                repeatPassword: registerRepeatPassword.value,
                logged: false,
            })
            .then((response) => {
                messageRegister.innerHTML = response.data.message;
                registerName.value = '';
                registerPassword.value = '';
                registerRepeatPassword.value = '';

            })
            .catch(() => {
                messageRegister.innerHTML = 'Usuário já cadastrado!';
                registerName.value = '';
                registerPassword.value = '';
                registerRepeatPassword.value = '';
            });
        };
        setTimeout(() => {
            messageRegister.innerHTML = '';
        }, 2000);
};

function validateUser(name, password, repeatPassword) {
    if (name.length < 3) {
        registerName.classList.add('errors');
        messageRegister.innerHTML = 'Nome inválida!';
        return false;
    } else {
        messageRegister.innerHTML = '';
        registerName.classList.remove('errors');
    }

    if (password.length < 3 || password !== repeatPassword) {
        messageRegister.innerHTML = 'Senha inválida!';
        registerPassword.classList.add('errors');
        registerRepeatPassword.classList.add('errors');
        return false;
    } else {
        registerPassword.classList.remove('errors');
        registerRepeatPassword.classList.remove('errors');
        registerName.classList.remove('errors');
        return true;
    }
}

function showMessages() {
    messageContent.innerHTML = '';
    inputDescrition.value = '';
    inputDetailing.value = '';
    idMessages = 0;

    axios
        .get('/users/messages')
        .then((response) => {
            response.data.forEach((message) => {
                messageContent.innerHTML += `
            <tr data-id='${message.id}'>
                <td>${message.descrition}</td>
                <td>${message.detailing}</td>
                <td><input type='submit' id='button-enter' class='btn btn-secondary' value='Editar' onclick='getMessages(event)'> 
                <input type='submit' id='button-delete' class='btn btn-secondary' value='Deletar' onclick='deleteMessages(event)'>
                </td> 
            </tr>
        `;
            });
        })
        .catch();
}

function getMessages(event) {
    idMessages = event.target.parentNode.parentNode.dataset.id;

    axios
        .get(`/users/messages/${idMessages}`)
        .then((response) => {
            inputDescrition.value = response.data.descrition;
            inputDetailing.value = response.data.detailing;
        })
        .catch((error) => {
            console.log(error);
        });
}

function enterLogin(event) {
    event.preventDefault();

    axios
        .put(`/users/${userName.value}/password/${userPassword.value}`)
        .then(() => {
            location.href = 'page-messages.html';
            userName.classList.remove('errors');
            userPassword.classList.remove('errors');
        })
        .catch(() => {
            messageLog.innerHTML = 'Nome de usuário ou senha inválido!';
            userName.classList.add('errors');
            userPassword.classList.add('errors');
        });
}

function logout(event) {
    event.preventDefault();

    axios
        .put(`/users`)
        .then(() => {
            location.replace('index.html');
        })
        .catch();
}

function saveEditMessages(event) {
    event.preventDefault();

    if (idMessages === 0 && validateMessages() === true) {
        message.innerHTML = '';
        axios
            .post('/users/messages', {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            })
            .then(() => {
                showMessages();
            })
            .catch(() => {
                message.innerHTML = 'Recado inválido!';
            });
    } else {
        axios
            .put(`/users/messages/${idMessages}`, {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            })
            .then(() => {
                showMessages();
            })
            .catch();
    }
}

function validateMessages() {
    if (!inputDescrition.value || !inputDetailing.value) {
        inputDescrition.classList.add('errors');
        inputDetailing.classList.add('errors');
        message.innerHTML = 'Recado inválido!';
    } else {
        inputDescrition.classList.remove('errors');
        inputDetailing.classList.remove('errors');
        message.innerHTML = '';
        return true;
    }
}

function deleteMessages(event) {
    idMessages = event.target.parentNode.parentNode.dataset.id;

    axios
        .delete(`/users/messages/${idMessages}`)
        .then(() => {
            showMessages();
        })
        .catch();
}
