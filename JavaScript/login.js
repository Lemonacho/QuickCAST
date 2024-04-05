//ВХОД
document.addEventListener('DOMContentLoaded', function () {
    let signInButton = document.querySelector("#signinbtn");
    signInButton.onclick = function () {
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/check_credentials", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        displaySuccessfullyMessage("Вы успешно вошли!");
                        localStorage.setItem('loggedIn', 'true');
                        localStorage.setItem('username', username);
                        window.location.href = "../html/index.html";
                    } else {
                        displayErrorMessage("Пользователь не найден или неверный пароль!");
                    }
                } else {
                    displayErrorMessage("Ошибка при выполнении запроса.");
                }
            }
        };
        xhr.send(JSON.stringify({ username: username, password: password }));
    };
});

//ФОРГОТ ПАСС
document.querySelector("#Fpass").addEventListener("click", function () {
    let username = document.querySelector("#username").value;
    if (!username) {
        displayErrorMessage("Введите имя пользователя.");
        return;
    }

    let forgotCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("ForgotCode", forgotCode);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/send_forgote_code", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                displaySuccessfullyMessage("Код отправлен на почту");
                document.querySelector(".ForgotPasswordCode").classList.add("show");
            } else {
                displayErrorMessage("Ошибка отправки кода на почту.");
            }
        }
    };
    xhr.send(JSON.stringify({ username: username, ForgotCode: forgotCode }));
});

document.querySelector("#confirmForgotCode").addEventListener("click", function () {
    let enteredCode = document.querySelector("#ForgotPasswordCodeInput").value;
    let storedCode = localStorage.getItem("ForgotCode");
    if (enteredCode === storedCode) {
        document.querySelector(".ForgotPasswordCode").classList.remove("show");
        document.querySelector(".newpass").classList.add("show");
    } else {
        displayErrorMessage("Неверный код подтверждения.");
    }
});

document.querySelector("#confirmpass").addEventListener("click", function () {
    let newPassword = document.querySelector("#newpass").value;
    let repeatNewPassword = document.querySelector("#repeatnewpass").value;
    let username = document.querySelector("#username").value;
    if (!username) {
        displayErrorMessage("Введите имя пользователя.");
        return;
    }
    if (newPassword !== repeatNewPassword) {
        displayErrorMessage("Пароли не совпадают.");
    } else if (newPassword.length < 8) {
        displayErrorMessage("Пароль должен содержать не менее 8 символов.");
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/update_user_password", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        displaySuccessfullyMessage("Пароль успешно изменен!");
                        localStorage.removeItem('ForgotCode');
                        document.querySelector(".newpass").classList.remove("show");
                    } else {
                        displayErrorMessage("Ошибка при смене пароля: " + response.message);
                    }
                } else {
                    displayErrorMessage("Ошибка при смене пароля. Статус: " + xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify({ username: username, new_password: newPassword }));
    }
});

function displayErrorMessage(message) {
    let errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(function () {
        errorMessage.style.display = 'none';
    }, 5000);
}

function displaySuccessfullyMessage(message) {
    let SuccessfullyMessage = document.querySelector('#successfully-message');
    SuccessfullyMessage.textContent = message;
    SuccessfullyMessage.style.display = 'block';

    setTimeout(function () {
        SuccessfullyMessage.style.display = 'none';
    }, 5000);
}
