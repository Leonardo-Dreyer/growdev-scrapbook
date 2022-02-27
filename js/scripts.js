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
    );
    if (userValid === true) {
        axios.post('http://localhost:8080/users', {
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
    if (!name || name.length < 3) {
        userName.classList.add('errors');
        return false;
    } else {
        userName.classList.remove('errors');
    }

    if (!password || password.length < 3 || password !== repeatPassword) {
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

    axios.get(`http://localhost:8080/users/${userName.value}/password/${userPassword.value}`)
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

    axios.get(`http://localhost:8080/users/logout`)
        .then((response) => {
            location.href = 'page-login.html';
        }).catch((error) => {
            console.log(error);
        });
};

function saveMessage(event) {
    event.preventDefault();

    if (inputDescrition.value === '' || inputDetailing.value === '') {
        inputDescrition.classList.add('errors');
        inputDetailing.classList.add('errors');
        message.innerHTML = 'Recado inválido!';
    }else if (id === 0) {
        message.innerHTML = '';
        axios.post('http://localhost:8080/users/messages', {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            }).then((response) => {
                console.log(response);
                messageContent.innerHTML = '';
                axios.get('http://localhost:8080/users/messages')
                    .then(response => {
                        console.log(response);
                        window.onload();
                    }).catch(error => {
                        console.log(error);
                    });
                inputDescrition.value = '';
                inputDetailing.value = '';
            }).catch((error) => {
                console.log(error);
            });        
    } else {
        axios.put(`http://localhost:8080/users/messages/${id}`, {
                descrition: inputDescrition.value,
                detailing: inputDetailing.value,
            }).then((response) => {
                console.log(response);
                messageContent.innerHTML = '';
                axios.get('http://localhost:8080/users/messages')
                    .then(response => {
                        console.log(response);
                        window.onload();
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

window.onload = function showMessages() {
    axios.get('http://localhost:8080/users/messages')
    .then(response => {
        response.data.forEach(message => {
        messageContent.innerHTML += `
            <tr data-id='${message.id}'>
                <td><span>${message.descrition}</span></td>
                <td><span>${message.detailing}</span></td>
                <td><input type='submit' id='button-enter' class='btn btn-secondary' value='Editar' onclick='editMessage(event)'> 
                <input type='submit' id='button-delete' class='btn btn-secondary' value='Deletar' onclick='deleteMessage(event)'>
                </td> 
            </tr>
        `
        });
    }).catch(error => {
        console.log(error);
    });
};

function editMessage(event) {
    id = event.target.parentNode.parentNode.dataset.id;

    axios.get(`http://localhost:8080/users/messages/${id}`)
        .then(response => {
            inputDescrition.value = response.data.descrition;
            inputDetailing.value = response.data.detailing;
        }).catch(error => {
            console.log(error);
        });
};

function deleteMessage(event) {
    id = event.target.parentNode.parentNode.dataset.id;

    axios.delete(`http://localhost:8080/users/messages/${id}`)
        .then(response => {
            console.log(response);
            messageContent.innerHTML = '';
            axios.get('http://localhost:8080/users/messages')
                .then(response => {
                    console.log(response);
                    window.onload();
                }).catch(error => {
                    console.log(error);
                });
            id = 0;
        }).catch(error => {
            console.log(error);
        });
};
