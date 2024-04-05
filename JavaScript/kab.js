document.body.removeAttribute('hidden');
loadUserData();
initWallpaperChange();
setSavedWallpaper(); // 1
if (localStorage.getItem('remainingTime')) {
    startTimer();
}
let interval;
let timerButton;

function startTimer() {
    const timerButton = document.querySelector('#changeemail');
    timerButton.disabled = true;

    let remainingTime = localStorage.getItem('remainingTime') || 180;
    remainingTime = parseInt(remainingTime);

    interval = setInterval(() => {
        remainingTime--;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerButton.textContent = `Осталось: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerButton.disabled = false;
            timerButton.textContent = 'CHANGE EMAIL';
            localStorage.removeItem('ChangeCode');
            setTimeout(() => {
                localStorage.removeItem('remainingTime');
            }, 1000);
        }

        localStorage.setItem('remainingTime', remainingTime);
    }, 1000);
}

// Поменять email
document.querySelector('#changeemail').addEventListener('click', function() {
    document.querySelector('#changeEmailModal').classList.add('show');

    let remainingTime = localStorage.getItem('remainingTime') || 180;
    remainingTime = parseInt(remainingTime);

    interval = setInterval(() => {
        remainingTime--;
        localStorage.setItem('remainingTime', remainingTime);

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        this.textContent = `Осталось: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            this.disabled = false;
            this.textContent = 'Change Email';
        }
    }, 1000);

    let changeCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('ChangeCode', changeCode);

    let username = localStorage.getItem('username');
    fetch('/get_user_email?name=' + username)
        .then(response => response.json())
        .then(data => {
            if (data && data.email) {
                let email = data.email;
                fetch('/send_change_code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, ChangeCode: changeCode })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        displaySuccessfullyMessage("Код для смены почты успешно отправлен.");
                    } else {
                        console.error("Ошибка при отправке кода на почту:", result.message);
                    }
                })
                .catch(error => console.error('Ошибка при выполнении запроса:', error));
            } else {
                console.error('Данные о пользователе не найдены');
            }
        })
        .catch(error => console.error('Ошибка загрузки данных о пользователе:', error));
});

document.querySelector('#confirmChangeEmail').addEventListener('click', function() {
    let enteredCode = document.querySelector('#changeEmailCode').value;
    let storedCode = localStorage.getItem('ChangeCode');
    if (enteredCode === storedCode) {
        document.querySelector('#changeEmailModal').classList.remove('show');
        document.querySelector('.newemail').classList.add('show');
        document.querySelector('#confirmEmail').addEventListener('click', function() {
            let newEmail = document.querySelector('#newemail').value;
            fetch('/check_email_usage?email=' + newEmail)
                .then(response => response.json())
                .then(data => {
                    if (data.used) {
                        displayErrorMessage("Этот email уже используется.");
                        document.querySelector('.newemail').classList.remove('show');
                    } else {
                        let username = localStorage.getItem('username');
                        changeEmail(username, newEmail);
                    }
                })
                .catch(error => console.error('Ошибка при проверке использования email:', error));
        });
    } else {
        displayErrorMessage("Введен неверный код, попробуйте еще раз.");
    }
});

function changeEmail(username, newEmail) {
    fetch('/change_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, email: newEmail })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            displaySuccessfullyMessage("Email успешно изменен");
            localStorage.removeItem('ChangeCode');
            localStorage.removeItem('remainingTime');
            document.querySelector('.newemail').classList.remove('show');
        } else {
            alert("Ошибка при изменении email: " + result.message);
        }
    })
    .catch(error => console.error('Ошибка при выполнении запроса:', error));
}

document.querySelector('#cancelChangeEmail').addEventListener('click', function() {
    document.querySelector('#changeEmailModal').style.display = 'none';
    document.querySelector('.modal').style.position = 'static';
});

// МЕНЮШКА

function loadUserData() {
    let username = localStorage.getItem('username'); 

    fetch('/get_user_data?name=' + username)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.querySelector('#hello').textContent = `Приветствую, ${data.name}`;
                document.querySelector('#Email').textContent = `Ваш email: ${data.email}`;
                document.querySelector('#Buys').textContent = `Кол-во покупок: ${data.buys}`;
                document.querySelector('#balance').textContent = `Ваш баланс: ${data.balance} руб`;
            } else {
                console.error('Данные о пользователе не загружены');
            }
        })
        .catch(error => console.error('Ошибка загрузки данных о пользователе:', error));
}

// ВЫХОД ИЗ ЛОГИНА
document.querySelector('#loginout').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = "../html/index.html";
});

// СМЕНА ПАРОЛЯ
document.querySelector('#changepass').addEventListener('click', function() {
    document.querySelector('.newpass').classList.add('show');
});

document.querySelector('#cancelpass').addEventListener('click', function() {
    document.querySelector('.newpass').classList.remove('show');
});


document.querySelector('#confirmpass').addEventListener('click', function() {
    let newPassword = document.querySelector('#newpass').value;
    let repeatNewPassword = document.querySelector('#repeatnewpass').value;

    if (newPassword.length < 8 || newPassword !== repeatNewPassword) {
        displayErrorMessage("Пароли не совпадают или содержат менее 8 символов.");
    } else {
        let username = localStorage.getItem('username');
        let data = { username: username, password: newPassword };

        fetch('/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displaySuccessfullyMessage("Пароль успешно изменен.");
                document.querySelector('.newpass').classList.remove('show');
            } else {
                displayErrorMessage("Ошибка изменения пароля")
                console.error("Ошибка изменения пароля: " + result.message);
            }
        })
        .catch(error => displayErrorMessage('Ошибка при выполнении запроса: ' + error));
    }
});

// СМЕНА ОБОЕВ
function initWallpaperChange() {
    let changeWallpaperButton = document.querySelector('#changewallpaperbutton');
    let closePreviewsButton = document.querySelector('#closePreviewsButton');
    let previewModal = document.querySelector('#previewModal');
    let wallpaperPreviews = document.querySelector('#wallpaperPreviews');

    changeWallpaperButton.addEventListener('click', function() {
        wallpaperPreviews.style.display = 'block';
    });

    closePreviewsButton.addEventListener('click', function() {
        wallpaperPreviews.style.display = 'none';
    });

    document.querySelectorAll('.previewImage').forEach(img => {
        img.addEventListener('click', function() {
            document.querySelector('#previewImage').src = this.src;
            previewModal.style.display = 'block';
        });
    });

    document.querySelector('#confirmButton').addEventListener('click', function() {
        let selectedImage = document.querySelector('#previewImage').src;
        document.body.style.backgroundImage = `url('${selectedImage}')`;
        localStorage.setItem('savedWallpaper', selectedImage); 
        previewModal.style.display = 'none';
    });
    
    document.querySelector('#closeit').addEventListener('click', function() {
        previewModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == previewModal) {
            previewModal.style.display = 'none';
        }
    });
}

function setSavedWallpaper() { 
    const savedWallpaper = localStorage.getItem('savedWallpaper');
    if (savedWallpaper) {
        document.body.style.backgroundImage = `url('${savedWallpaper}')`;
    }
}

// Функция для отображения сообщения об ошибке
function displayErrorMessage(message) {
    let errorMessage = document.querySelector('#error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(function() {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Функция для отображения успешного сообщения
function displaySuccessfullyMessage(message) {
    let SuccessfullyMessage = document.querySelector('#successfully-message');
    SuccessfullyMessage.textContent = message;
    SuccessfullyMessage.style.display = 'block';

    setTimeout(function() {
        SuccessfullyMessage.style.display = 'none';
    }, 5000); 
}


document.addEventListener('DOMContentLoaded', function() {
    let overlay = document.querySelector('#overlay');
    let infous = document.querySelector('#infous');
    let contactinfo = document.querySelector('#contactinfo');
    let aboutUsButton = document.querySelector('#aboutus');
    let contactButton = document.querySelector('#contact');
    let closeInfoWindow = document.querySelector('#closewindow');
    let closeContactWindow = document.querySelector('#closewindow1');

    aboutUsButton.addEventListener('click', function() {
        overlay.style.display = 'block';
        infous.style.display = 'block';
        this.blur();
    });

    contactButton.addEventListener('click', function() {
        overlay.style.display = 'block';
        contactinfo.style.display = 'block';
        this.blur();
    });

    closeInfoWindow.addEventListener('click', function() {
        overlay.style.display = 'none';
        infous.style.display = 'none';
    });

    closeContactWindow.addEventListener('click', function() {
        overlay.style.display = 'none';
        contactinfo.style.display = 'none';
    });

    overlay.addEventListener('click', function() {
        this.style.display = 'none';
        infous.style.display = 'none';
        contactinfo.style.display = 'none';
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            overlay.style.display = 'none';
            infous.style.display = 'none';
            contactinfo.style.display = 'none';
        }
    });
});
