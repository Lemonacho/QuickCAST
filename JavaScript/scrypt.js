document.addEventListener("DOMContentLoaded", function() {
    let singinupButton = document.querySelector("#singinup");
    let loggedIn = localStorage.getItem('loggedIn');

    if (loggedIn === 'true') {
        singinupButton.textContent = "Your Office";
        singinupButton.parentElement.setAttribute('href', '../html/kab.html');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let overlay = document.querySelector('#overlay');
    let infous = document.querySelector('#infous');
    let contactinfo = document.querySelector('#contactinfo');
    let aboutUsButton = document.querySelector('#aboutus');
    let contactButton = document.querySelector('#contact');
    let closeInfoWindow = document.querySelector('#closewindow');
    let closeContactWindow = document.querySelector('#closewindow1');
    let pricesDiv1 = document.querySelector('.prices1'); // Селектор для prices1
    let pricesDiv2 = document.querySelector('.prices2'); // Добавляем селектор для нового блока prices2
    let pricesDiv3 = document.querySelector('.prices3'); // Добавляем селектор для нового блока prices3
    let pricesDiv4 = document.querySelector('.prices4'); // Добавляем селектор для нового блока prices4
    let infoNav1 = document.querySelector('#infoprice1'); // Селектор для infoprice1
    let infoNav2 = document.querySelector('#infoprice2'); // Добавляем селектор для infoprice2
    let infoNav3 = document.querySelector('#infoprice3'); // Добавляем селектор для infoprice3
    let infoNav4 = document.querySelector('#infoprice4'); // Добавляем селектор для infoprice4

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

    // Обработчик событий для pricesDiv1
    pricesDiv1.addEventListener('click', function() {
        overlay.style.display = 'block';
        infoNav1.style.display = 'block';
    });

    // Добавляем новый обработчик событий для pricesDiv2
    pricesDiv2.addEventListener('click', function() {
        overlay.style.display = 'block';
        infoNav2.style.display = 'block';
    });

    // Добавляем новый обработчик событий для pricesDiv3
    pricesDiv3.addEventListener('click', function() {
        overlay.style.display = 'block';
        infoNav3.style.display = 'block';
    });

    // Обработчик событий для pricesDiv4
    pricesDiv4.addEventListener('click', function() {
        overlay.style.display = 'block';
        infoNav4.style.display = 'block';
    });

    // Обработчик кликов на оверлей для закрытия всех окон
    overlay.addEventListener('click', function() {
        this.style.display = 'none';
        infous.style.display = 'none';
        contactinfo.style.display = 'none';
        infoNav1.style.display = 'none';
        infoNav2.style.display = 'none'; // Добавляем скрытие infoNav2 при клике на оверлей
        infoNav3.style.display = 'none'; // Добавляем скрытие infoNav3 при клике на оверлей
        infoNav4.style.display = 'none'; // Добавляем скрытие infoNav4 при клике на оверлей
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            overlay.style.display = 'none';
            infous.style.display = 'none';
            contactinfo.style.display = 'none';
            infoNav1.style.display = 'none';
            infoNav2.style.display = 'none'; // Добавляем скрытие infoNav2 при нажатии Escape
            infoNav3.style.display = 'none'; // Добавляем скрытие infoNav3 при нажатии Escape
            infoNav4.style.display = 'none'; // Добавляем скрытие infoNav4 при нажатии Escape
        }
    });
});

