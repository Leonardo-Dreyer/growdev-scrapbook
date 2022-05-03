const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerRepeatPassword = document.getElementById(
    'register-repeatpassword'
);
const userEmail = document.getElementById('user-email');
const userPassword = document.getElementById('user-password');
const message = document.getElementById('message');
const messageLog = document.getElementById('message-log');
const messageRegister = document.getElementById('message-register');
const inputDescription = document.getElementById('input-description');
const inputDetailing = document.getElementById('input-detailing');
const messageContent = document.getElementById('content');
const userSession = JSON.parse(localStorage.getItem('logged'));
let idMessage = 0;
axios.defaults.baseURL = 'https://scrapbook-api-growdev.herokuapp.com';

function authentication(event) {
    event.preventDefault();

    axios
        .get('/user', {
            headers: { Authorization: `Bearer ${userSession.token}` }
        })
        .then(() => {
            location.href = 'messages.html';
        })
        .catch((error) => {
            console.log(error);
        });
}

function creatUser(event) {
    event.preventDefault();

    const userValid = validatePassword(
        registerPassword.value,
        registerRepeatPassword.value
    );

    if (userValid) {
        const data = {
            email: registerEmail.value,
            password: registerPassword.value
        };
        axios
            .post('/user', data)
            .then(() => {
                messageRegister.innerHTML = 'Usuário cadastrado com sucesso!';
                registerEmail.value = '';
                registerPassword.value = '';
                registerRepeatPassword.value = '';
            })
            .catch((error) => {
                console.log(error.response);
                messageRegister.innerHTML = error.response.data.message;
                registerEmail.value = '';
                registerPassword.value = '';
                registerRepeatPassword.value = '';
                registerEmail.classList.add('errors');
                registerPassword.classList.add('errors');
                registerRepeatPassword.classList.add('errors');
            });
    }
    setTimeout(() => {
        messageRegister.innerHTML = '';
    }, 4000);
}

function validatePassword(password, repeatPassword) {
    if (password !== repeatPassword) {
        messageRegister.innerHTML = 'Senhas devem ser iguais!';
        registerRepeatPassword.classList.add('errors');
        return false;
    } else {
        registerEmail.classList.remove('errors');
        registerPassword.classList.remove('errors');
        registerRepeatPassword.classList.remove('errors');
        return true;
    }
}

function login(event) {
    event.preventDefault();
    const data = {
        email: userEmail.value,
        password: userPassword.value
    };
    axios
        .post('/auth', data)
        .then((response) => {
            const userSession = {
                token: response.data.token
            };
            localStorage.setItem('logged', JSON.stringify(userSession));
            location.href = 'messages.html';
        })
        .catch((error) => {
            console.log(error.response);
            messageLog.innerHTML = error.response.data.message;
            userEmail.classList.add('errors');
            userPassword.classList.add('errors');
        });
}

function showMessages(event) {
    event.preventDefault();
    messageContent.innerHTML = '';

    if (!userSession) {
        location.href = 'index.html';
    }

    axios
        .get('/message', {
            headers: { Authorization: `Bearer ${userSession.token}` }
        })
        .then((response) => {
            response.data.forEach((message) => {
                messageContent.innerHTML += `
            <tr data-id='${message.uid}'>
                <td>${message.description}</td>
                <td>${message.detailing}</td>
                <td><input type='submit' id='button-enter' class='btn btn-secondary' value='Editar' onclick='getMessages(event)'> 
                <input type='submit' id='button-delete' class='btn btn-secondary' value='Deletar' onclick='deleteMessage(event)'>
                </td> 
            </tr>
        `;
            });
        })
        .catch((error) => {
            console.log(error);
            message.innerHTML = error.response.data.message;
        });
}

function getMessages(event) {
    idMessage = event.target.parentNode.parentNode.dataset.id;

    axios
        .get(`/message/${idMessage}`)
        .then((response) => {
            inputDescription.value = response.data.description;
            inputDetailing.value = response.data.detailing;
        })
        .catch((error) => {
            console.log(error);
        });
}

function saveMessages(event) {
    event.preventDefault();

    const data = {
        description: inputDescription.value,
        detailing: inputDetailing.value
    };
    if (idMessage === 0) {
        message.innerHTML = '';
        axios
            .post('/message', data, {
                headers: { Authorization: `Bearer ${userSession.token}` }
            })
            .then((response) => {
                validateMessage(true);
                messageContent.innerHTML += `
                <tr data-id='${response.data.uid}'>
                    <td>${response.data.description}</td>
                    <td>${response.data.detailing}</td>
                    <td><input type='submit' id='button-enter' class='btn btn-secondary' value='Editar' onclick='getMessages(event)'> 
                    <input type='submit' id='button-delete' class='btn btn-secondary' value='Deletar' onclick='deleteMessage(event)'>
                    </td> 
                </tr>
            `;
            })
            .catch((error) => {
                console.log(error);
                message.innerHTML = error.response.data.message;
                validateMessage(false);
            });
    } else {
        axios
            .put(`/message/${idMessage}`, data)
            .then(() => {
                validateMessage(true);
                showMessages(event);
            })
            .catch((error) => {
                console.log(error);
                message.innerHTML = error.response.data.message;
                validateMessage(false);
            });
    }
}

function validateMessage(data) {
    if (data) {
        inputDescription.classList.remove('errors');
        inputDetailing.classList.remove('errors');
        message.innerHTML = '';
        inputDescription.value = '';
        inputDetailing.value = '';
    } else {
        inputDescription.classList.add('errors');
        inputDetailing.classList.add('errors');
    }
}

function deleteMessage(event) {
    idMessage = event.target.parentNode.parentNode.dataset.id;
    axios
        .delete(`/message/${idMessage}`)
        .then(() => {
            showMessages(event);
            idMessage = 0;
        })
        .catch((error) => {
            console.log(error);
        });
}

function logout(event) {
    event.preventDefault();

    location.href = 'index.html';
    localStorage.removeItem('logged');
}
