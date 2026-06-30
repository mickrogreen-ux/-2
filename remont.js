document.addEventListener('DOMContentLoaded', () => {
    
    // Блоки мобільного навігатора та бургера
    const burgerBtn = document.querySelector('.burger-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Елементи випадаючого меню «Процесс»
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownParent = document.querySelector('.dropdown');

    // 1. Відкриття/Закриття бургер меню при кліку
    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Забороняє скролити сторінку під меню
        });
    }

    // 2. Логіка кліку по кнопці "Процесс" на смартфонах (екрани <= 768px)
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Скасовує перехід, даючи розкрити список
                dropdownMenu.classList.toggle('active');
                dropdownParent.classList.toggle('active');
            }
        });
    }

    // 3. Автоматичне закриття меню при виборі будь-якої іншої посилання
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('dropdown-toggle')) return; // Не закривати, якщо клікнули на "Процесс"

            if (burgerBtn && mainNav) {
                burgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
});
// ==========================================================================
// ПОВЕРТАЄМО КАРТУ (Додати в кінець файлу .js)
// ==========================================================================
var map = L.map('map', {
    center: [47.0245, 28.8322], 
    zoom: 15,
    scrollWheelZoom: false 
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

// Створення круглої фірмової мітки
var yellowCircleIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

L.marker([47.0245, 28.8322], { icon: yellowCircleIcon }).addTo(map);