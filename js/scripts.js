const userName = document.getElementById('user-name');
const userPassword = document.getElementById('user-password');
const userRepeatPassword = document.getElementById('repeat-password') || true;
const message = document.getElementById('message');
const inputDescrition = document.getElementById('input-descrition');
const inputDetailing = document.getElementById('input-detailing');
const messageContent = document.getElementById('content');
let id = 0;

function creatUser(event) {
    event.preventDefault();

    const userValid = validateUser(
        userName.value,
        userPassword.value,
        userRepeatPassword.value
    )
    if (userValid === true) {
        axios.post('https://scrapbook-api-growdev.herokuapp.com/users', {
                name: userName.value,
                password: userPassword.value,
                repeatPassword: userRepeatPassword.value,
                logged: false,
            }).then((response) => {
                console.log(response);
                message.innerHTML = response.data.message;
                userName.value = '';
                userPassword.value = '';
                userRepeatPassword.value = '';
            }).catch((error) => {
                message.innerHTML = 'Usário já cadastrado!';
                console.log(error);
            });
    };
};

function validateUser(name, password, repeatPassword) {

    if (name.length < 3) {
        userName.classList.add('errors');
        message.innerHTML = 'Nome inválida!';
        return false;
    } else {
        message.innerHTML = '';
        userName.classList.remove('errors');
    };

    if (password.length < 3 || password !== repeatPassword) {
        message.innerHTML = 'Senha inválida!';
        userPassword.classList.add('errors');
        userRepeatPassword.classList.add('errors');
        return false;
    } else {
        userPassword.classList.remove('errors');
        userRepeatPassword.classList.remove('errors');
        userName.classList.remove('errors');
        return true;
    };
};

function enterLogin(event) {
    event.preventDefault();

    axios.put(`https://scrapbook-api-growdev.herokuapp.com/users/${userName.value}/password/${userPassword.value}`)
        .then((response) => {
            location.href = 'page-messages.html';
            userName.classList.remove('errors');
            userPassword.classList.remove('errors');
        }).catch((error) => {
            message.innerHTML = 'Nome de usuário ou senha inválido!';
            console.log(error);
            userName.classList.add('errors');
            userPassword.classList.add('errors');
        });
};

function logout(event) {
    event.preventDefault();

    axios.put(`https://scrapbook-api-growdev.herokuapp.com/users`)
        .then((response) => {
            console.log(response);
            location.href = 'page-login.html';
        }).catch((error) => {
            console.log(error);
        });
};

function saveEditMessages(event) {
    event.preventDefault();

    if (id === 0 && validateMessages() === true) {
        message.innerHTML = '';
        axios.post('https://scrapbook-api-growdev.herokuapp.com/users/messages', {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            }).then((response) => {
                console.log(response);
                messageContent.innerHTML = '';
                axios.get('https://scrapbook-api-growdev.herokuapp.com/users/messages')
                    .then(response => {
                        console.log(response);
                        showMessages();
                    }).catch(error => {
                        console.log(error);
                    });
                inputDescrition.value = '';
                inputDetailing.value = '';
            }).catch((error) => {
                console.log(error);
            });        
    } else {
        axios.put(`https://scrapbook-api-growdev.herokuapp.com/users/messages/${id}`, {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            }).then((response) => {
                console.log(response);
                messageContent.innerHTML = '';
                axios.get('https://scrapbook-api-growdev.herokuapp.com/users/messages')
                    .then(response => {
                        console.log(response);
                        showMessages();
                    }).catch(error => {
                        console.log(error);
                    });
                inputDescrition.value = '';
                inputDetailing.value = '';
                id = 0;
            }).catch((error) => {
                console.log(error);
            });   
    };
};

function validateMessages() {

    if (inputDescrition.value === '' || inputDetailing.value === '') {
        inputDescrition.classList.add('errors');
        inputDetailing.classList.add('errors');
        message.innerHTML = 'Recado inválido!';
    } else {
        inputDescrition.classList.remove('errors');
        inputDetailing.classList.remove('errors');
        message.innerHTML = '';
        return true;
    };
};

function showMessages() {
    axios.get('https://scrapbook-api-growdev.herokuapp.com/users/messages')
    .then(response => {
        response.data.forEach(message => {
        messageContent.innerHTML += `
            <tr data-id='${message.id}'>
                <td><span>${message.descrition}</span></td>
                <td><span>${message.detailing}</span></td>
                <td><input type='submit' id='button-enter' class='btn btn-secondary' value='Editar' onclick='getMessages(event)'> 
                <input type='submit' id='button-delete' class='btn btn-secondary' value='Deletar' onclick='deleteMessages(event)'>
                </td> 
            </tr>
        `
        });
    }).catch(error => {
        console.log(error);
    });
};

function getMessages(event) {
    id = event.target.parentNode.parentNode.dataset.id;

    axios.get(`https://scrapbook-api-growdev.herokuapp.com/users/messages/${id}`)
        .then(response => {
            inputDescrition.value = response.data.descrition;
            inputDetailing.value = response.data.detailing;
        }).catch(error => {
            console.log(error);
        });
};

function deleteMessages(event) {
    id = event.target.parentNode.parentNode.dataset.id;

    axios.delete(`https://scrapbook-api-growdev.herokuapp.com/users/messages/${id}`)
        .then(response => {
            console.log(response);
            messageContent.innerHTML = '';
            axios.get('https://scrapbook-api-growdev.herokuapp.com/users/messages')
                .then(response => {
                    console.log(response);
                    showMessages();
                }).catch(error => {
                    console.log(error);
                });
            id = 0;
        }).catch(error => {
            console.log(error);
        });
};
