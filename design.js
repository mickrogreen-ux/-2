document.addEventListener('DOMContentLoaded', () => {
    // 1. БОКОВЕ МЕНЮ ТА БУРГЕР
    const burgerBtn = document.querySelector('.burger-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownParent = document.querySelector('.dropdown');

    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownMenu.classList.toggle('active');
                dropdownParent.classList.toggle('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('dropdown-toggle')) return;
            if (burgerBtn && mainNav) {
                burgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // 2. ІНІЦІАЛІЗАЦІЯ КАРТИ
    var map = L.map('map', {
        center: [47.0245, 28.8322], 
        zoom: 15,
        scrollWheelZoom: false 
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    var yellowCircleIcon = L.divIcon({
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([47.0245, 28.8322], { icon: yellowCircleIcon }).addTo(map);
});

// 3. ФУНКЦІЯ КАЛЬКУЛЯТОРА
function calculateCost() {
    const area = document.getElementById('area').value;
    const packagePrice = document.getElementById('package').value;
    const totalPriceElement = document.getElementById('totalPrice');
    const resultBox = document.getElementById('result');

    if (area && area > 0) {
        const total = area * packagePrice;
        totalPriceElement.innerText = total.toLocaleString();
        resultBox.classList.add('active');
    }
}