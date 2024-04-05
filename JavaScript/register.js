
let signupButton = document.querySelector("#signupbtn");
signupButton.onclick = function () {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let repeatPassword = document.querySelector("#Repeatpassword").value;
    let email = document.querySelector("#Email").value;
    let verificationCode = document.querySelector("#verificationCode").value;

    // совпадают ли пароли
    if (password !== repeatPassword) {
        displayErrorMessage("Пароли не совпадают!");
        return;
    }

    // длина пароля
    if (password.length < 8) {
        displayErrorMessage("Пароль должен содержать не менее 8 символов!");
        return;
    }

    // формат email
    if (!isValidEmail(email)) {
        displayErrorMessage("Неправильный формат email!");
        return;
    }

    // введен ли код подтверждения
    if (!verificationCode) {
        displayErrorMessage("Пожалуйста, введите код подтверждения!");
        return;
    }

    // доступность имени пользователя и подтверждение кода
    checkUsernameExists(username);
    verifyCode(verificationCode);
};

// "Прислать код"
let verifySendCodeBtn = document.querySelector("#verifySendCodeBtn");
verifySendCodeBtn.onclick = function () {
    let email = document.querySelector("#Email").value;
    checkEmailExists(email);
};

// Валидация email
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// доступность имени пользователя
function checkUsernameExists(username) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/check_username", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.exists) {
                    displayErrorMessage("Это имя пользователя уже используется!");
                }
            } else {
                alert("Ошибка при выполнении запроса.");
            }
        }
    };
    xhr.send(JSON.stringify({ username: username }));
}

// доступность email
function checkEmailExists(email) {
    if (!email) {
        displayErrorMessage("Пожалуйста, введите адрес электронной почты.");
        return;
    }

    let verifySendCodeBtn = document.querySelector("#verifySendCodeBtn");
    verifySendCodeBtn.disabled = true;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/check_email_exists", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.exists) {
                    displayErrorMessage("Почта уже используется для другого аккаунта.");
                    verifySendCodeBtn.disabled = false;
                } else {
                    sendVerificationCode(email);
                    let timer = 180;
                    let interval = setInterval(function () {
                        verifySendCodeBtn.textContent = "Осталось времени: " + timer + " сек";
                        timer--;
                        if (timer < 0) {
                            clearInterval(interval);
                            verifySendCodeBtn.textContent = "Прислать код";
                            verifySendCodeBtn.disabled = false;
                            localStorage.removeItem('verificationCode');
                        }
                    }, 1000);
                }
            } else {
                console.log("Ошибка при выполнении запроса.");
                verifySendCodeBtn.disabled = false;
            }
        }
    };
    xhr.send(JSON.stringify({ email: email }));
}

// Отправка и подтверждение email
function sendVerificationCode(email) {
    let verificationCode = Math.floor(100000 + Math.random() * 900000);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/send_verification_code", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                displaySuccessfullyMessage("Код подтверждения отправлен на почту.");
                localStorage.setItem('verificationCode', verificationCode);
            } else {
                console.error("Ошибка при отправке кода подтверждения.");
            }
        }
    };
    xhr.send(JSON.stringify({ email: email, verificationCode: verificationCode }));
}

// Завершение регистрации
function completeRegistration() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let email = document.querySelector("#Email").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.success) {
                    displaySuccessfullyMessage("Регистрация завершена");
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('username', username);
                    window.location.href = "../html/kab.html";
                } else {
                    console.log("Ошибка регистрации: " + response.message);
                }
            } else {
                console.log("Ошибка при выполнении запроса.");
            }
        }
    };
    xhr.send(JSON.stringify({ username: username, password: password, email: email }));
}

// Проверка введенного кода с почты
function verifyCode(enteredCode) {
    let savedCode = localStorage.getItem('verificationCode');
    if (!savedCode) {
        displayErrorMessage("Сначала отправьте код подтверждения на вашу почту!");
        return;
    }
    if (savedCode === enteredCode) {
        console.log("Регистрация успешно завершена!");
        localStorage.removeItem('verificationCode');
        completeRegistration();
    } else {
        console.error("Неправильный код подтверждения.");
        displayErrorMessage("Неправильный код подтверждения.");
    }
}
(function() {
    let $animate, $container, $message, $paragraph, MESSAGES, animate, initialise, scramble;

    MESSAGES = [];

    MESSAGES.push({
      delay: 0,
      text: "REGISTER"
    });

    MESSAGES.push({
      delay: 1300,
      text: "Hello ! >_<"
    });

    MESSAGES.push({
      delay: 2800,
      text: "We are the best hosting"
    });

    MESSAGES.push({
      delay: 4500,
      text: "Better than our competitors"
    });

    MESSAGES.push({
      delay: 6400,
      text: "Best of all on the Internet"
    });

    MESSAGES.push({
      delay: 8450,
      text: "Fast server responses, Cheap rates, Convenient service"
    });

    MESSAGES.push({
      delay: 11000,
      text: "We are the ones who will provide you with the best hosting"
    });

    MESSAGES.push({
      delay: 13500,
      text: "We are waiting only for you!"
    });

    $container = $("#container");

    $message = $("#message");

    $animate = $("#animate");

    $paragraph = null;

    scramble = function(element, text, options) {
      let $element, addGlitch, character, defaults, ghostCharacter, ghostCharacters, ghostLength, ghostText, ghosts, glitchCharacter, glitchCharacters, glitchIndex, glitchLength, glitchProbability, glitchText, glitches, i, j, letter, object, order, output, parameters, ref, settings, shuffle, target, textCharacters, textLength, wrap;
      defaults = {
        probability: 0.2,
        glitches: '<3>.<\\',
        blank: '',
        duration: text.length * 40,
        ease: 'easeInOutQuad',
        delay: 0.0
      };
      $element = $(element);
      settings = $.extend(defaults, options);
      shuffle = function() {
        if (Math.random() < 0.5) {
          return 1;
        } else {
          return -1;
        }
      };
      wrap = function(text, classes) {
        return `<span class="${classes}">${text}</span>`;
      };
      glitchText = settings.glitches;
      glitchCharacters = glitchText.split('');
      glitchLength = glitchCharacters.length;
      glitchProbability = settings.probability;
      glitches = (function() {
        let j, len, results;
        results = [];
        for (j = 0, len = glitchCharacters.length; j < len; j++) {
          letter = glitchCharacters[j];
          results.push(wrap(letter, 'glitch'));
        }
        return results;
      })();
      ghostText = $element.text();
      ghostCharacters = ghostText.split('');
      ghostLength = ghostCharacters.length;
      ghosts = (function() {
        let j, len, results;
        results = [];
        for (j = 0, len = ghostCharacters.length; j < len; j++) {
          letter = ghostCharacters[j];
          results.push(wrap(letter, 'ghost'));
        }
        return results;
      })();
      textCharacters = text.split('');
      textLength = textCharacters.length;
      order = (function() {
        let results = [];
        for (let j = 0; 0 <= textLength ? j < textLength : j > textLength; 0 <= textLength ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this).sort(this.shuffle);
      output = [];
      for (i = j = 0, ref = textLength; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        glitchIndex = Math.floor(Math.random() * (glitchLength - 1));
        glitchCharacter = glitches[glitchIndex];
        ghostCharacter = ghosts[i] || settings.blank;
        addGlitch = Math.random() < glitchProbability;
        character = addGlitch ? glitchCharacter : ghostCharacter;
        output.push(character);
      }
      object = {
        value: 0
      };
      target = {
        value: 1
      };
      parameters = {
        duration: settings.duration,
        ease: settings.ease,
        step: function() {
          let index, k, progress, ref1;
          progress = Math.floor(object.value * (textLength - 1));
          for (i = k = 0, ref1 = progress; (0 <= ref1 ? k <= ref1 : k >= ref1); i = 0 <= ref1 ? ++k : --k) {
            index = order[i];
            output[index] = textCharacters[index];
          }
          return $element.html(output.join(''));
        },
        complete: function() {
          return $element.html(text);
        }
      };
      return $(object).delay(settings.delay).animate(target, parameters);
    };

    animate = function() {
      let data, element, index, j, len, options;
      for (index = j = 0, len = MESSAGES.length; j < len; index = ++j) {
        data = MESSAGES[index];
        element = $paragraph.get(index);
        element.innerText = '';
        options = {
          delay: data.delay
        };
        scramble(element, data.text, options);
      }
    };

    initialise = function() {
      let index, j, len, text;
      $animate.click(animate);
      for (index = j = 0, len = MESSAGES.length; j < len; index = ++j) {
        text = MESSAGES[index];
        $message.append("<p>");
      }
      $paragraph = $container.find("p");
      animate();
    };

    initialise();

}).call(this);


// Функция для отображения сообщения об ошибке
function displayErrorMessage(message) {
  let errorMessage = document.querySelector('#error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(function () {
      errorMessage.style.display = 'none';
  }, 5000);
}

// Функция для отображения успешного сообщения
function displaySuccessfullyMessage(message) {
  let SuccessfullyMessage = document.querySelector('#successfully-message');
  SuccessfullyMessage.textContent = message;
  SuccessfullyMessage.style.display = 'block';

  setTimeout(function () {
      SuccessfullyMessage.style.display = 'none';
  }, 5000);
}