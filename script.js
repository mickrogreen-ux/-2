document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. ЛОГИКА ГЕРОЙ-БЛОКА С ЕДИНЫМ КОЛЛАЖЕМ И ХОВЕРАМИ НА СЛОВА
    // ==========================================================================
    const heroLinks = document.querySelectorAll('.hero-link-zone');
    const bgPhotos = document.querySelectorAll('.bg-photo');
    const mainCollage = document.querySelector('.main-collage-bg');

    if (window.innerWidth > 768) {
        heroLinks.forEach(link => {
            // Когда мышка наводится на слово
            link.addEventListener('mouseenter', function() {
                const targetBgClass = this.getAttribute('data-bg');
                if (mainCollage) mainCollage.classList.remove('active-bg');
                
                bgPhotos.forEach(photo => {
                    if (photo.classList.contains(targetBgClass)) {
                        photo.classList.add('active-bg');
                    } else if (photo !== mainCollage) {
                        photo.classList.remove('active-bg');
                    }
                });
            });

            // 当 мышка уходит со слова — плавно возвращаем 1.png (коллаж)
            link.addEventListener('mouseleave', () => {
                bgPhotos.forEach(photo => photo.classList.remove('active-bg'));
                if (mainCollage) mainCollage.classList.add('active-bg');
            });
        });
    }

    // ==========================================================================
    // 2. ОЖИВЛЕННЯ СЛАЙДЕРА «ПОРТФОЛІО» (НЕСКІНЧЕННИЙ РУХ В ОДИН БІК)
    // ==========================================================================
    const track = document.querySelector('.slider-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        let autoPlayTimer = null;
        let isTransitioning = false; // Захист від частих кліків

        // 1. КЛОНУВАННЯ ДЛЯ ЕФЕКТУ НЕСКІНЧЕННОСТІ
        const originalItems = Array.from(track.children);
        const originalLength = originalItems.length;

        // Клонуємо перші кілька карток і додаємо їх у кінець стрічки
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        function getItemsPerView() {
            if (window.innerWidth <= 768) return 1;  // 1 картка на мобільних
            if (window.innerWidth <= 992) return 2;  // 2 картки на планшетах
            return 3;                                // 3 картки на десктопі
        }

        function updateSlider(withAnimation = true) {
            if (originalItems.length === 0) return;
            const itemWidth = originalItems[0].getBoundingClientRect().width + 30; // Ширина + gap

            if (withAnimation) {
                track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }

            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        // Головна функція гортання ВПЕРЕД
        function moveNext() {
            if (isTransitioning) return;
            isTransitioning = true;

            currentIndex++;
            updateSlider(true);

            // Коли анімація переходу на клон завершиться
            track.addEventListener('transitionend', function handleTransitionEnd() {
                track.removeEventListener('transitionend', handleTransitionEnd);
                
                // Якщо ми дійшли до кінця оригінальних карток (перейшли на клони)
                if (currentIndex >= originalLength) {
                    track.style.transition = 'none'; // Вимикаємо анімацію
                    currentIndex = 0;                // Миттєво перестрибуємо на справжній початок
                    updateSlider(false);
                }
                isTransitioning = false;
            });
        }
        // Функція гортання НАЗАД (для лівої стрілочки)
        function movePrev() {
            if (isTransitioning) return;
            isTransitioning = true;

            if (currentIndex <= 0) {
                // Якщо ми на самому початку, спочатку миттєво перестрибуємо на кінець оригінальних карток
                track.style.transition = 'none';
                currentIndex = originalLength;
                updateSlider(false);
                
                // Невеличка затримка, щоб браузер встиг перемкнути позицію без анімації
                setTimeout(() => {
                    currentIndex--;
                    updateSlider(true);
                }, 20);
            } else {
                currentIndex--;
                updateSlider(true);
            }

            track.addEventListener('transitionend', function handleTransitionEnd() {
                track.removeEventListener('transitionend', handleTransitionEnd);
                isTransitioning = false;
            });
        }

        // Швидкий запуск автоплею строго вперед (кожні 2.5 секунди)
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                moveNext();
            }, 2500); 
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        // Кліки по стрілочках
        nextBtn.addEventListener('click', () => {
            moveNext();
            startAutoPlay(); // Скидаємо таймер, щоб не було накладання
        });

        prevBtn.addEventListener('click', () => {
            movePrev();
            startAutoPlay();
        });

        // Запуск роботи з першої ж мілісекунди без пауз
        updateSlider(false);
        startAutoPlay();

        // Адаптація під розміри екрану
        window.addEventListener('resize', () => {
            updateSlider(false);
        });

        // Пауза при наведенні мишки
        const container = document.querySelector('.slider-container');
        if (container) {
            container.addEventListener('mouseenter', stopAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);
        }

        // Мобільні свайпи пальцем
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const swipeThreshold = 50;
            if (startX - endX > swipeThreshold) {
                moveNext();
            } else if (endX - startX > swipeThreshold) {
                movePrev();
            }
            startAutoPlay();
        }, { passive: true });
    }

// ==========================================================================
    // 3. ІНІЦІАЛІЗАЦІЯ СВІТЛОЇ КАРТИ З РАНДОМНИМ МІСЦЕМ У КИШИНЕВІ
    // ==========================================================================
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Задаємо межі центральної частини Кишинева, щоб маркер не полетів у поле
        const latMin = 47.0200, latMax = 47.0320;
        const lngMin = 28.8250, lngMax = 28.8450;

        // Генерація випадкових координат у межах Кишинева
        const randomLat = Math.random() * (latMax - latMin) + latMin;
        const randomLng = Math.random() * (lngMax - lngMin) + lngMin;

        // Створення інтерактивної карти Leaflet
        const map = L.map('map', {
            center: [randomLat, randomLng],
            zoom: 17,               // Масштаб великого плану, як на вашому фото-макеті
            zoomControl: false,     // Вимикаємо інтерфейс кнопок +/- ради естетики
            scrollWheelZoom: false  // Вимикаємо зум коліщатком миші, щоб не заважати скролу сайту
        });

        // Підключаємо стильний світло-сірий шар карти CartoDB Positron
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Створюємо красиву круглу іконку за допомогою твого CSS-класу .custom-marker
        const yellowCircleIcon = L.divIcon({
            className: 'custom-marker',
            iconSize: [20, 20], // розмір кружечка (ширина, висота)
            iconAnchor: [10, 10] // центрування іконки строго на точці координат
        });

        // Малюємо маркер із нашою іконкою (це 100% безпечно і не видасть помилок)
        L.marker([randomLat, randomLng], { icon: yellowCircleIcon }).addTo(map);
    }

    // ==========================================================================
    // 4. ЛОГІКА БУРГЕР-МЕНЮ ДЛЯ МОБІЛЬНОЇ ВЕРСІЇ
    // ==========================================================================
    const burgerBtn = document.querySelector('.burger-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (burgerBtn && mainNav) {
        // Відкриття / закриття за кліком на бургер
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Блокуємо скрол сайту на фоні
        });

        // Закриваємо меню, якщо клікнули на будь-яке посилання (якір)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".calc-form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Забороняємо перезавантаження сторінки

            const button = form.querySelector(".btn-submit");
            const messageDiv = form.querySelector(".form-message");
            
            // Захист кнопки під час відправки
            button.disabled = true;
            button.innerText = "ОТПРАВКА...";
            messageDiv.style.display = "none";

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Надсилаємо дані за допомогою API сервісу Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    // Успішно надіслано
                    messageDiv.style.display = "block";
                    messageDiv.style.color = "#d4af37"; // Фірмовий золотий колір тексту
                    messageDiv.innerText = "Спасибо! Заявка успешно отправлена, мы скоро свяжемся с вами.";
                    form.reset(); // Очищаємо всі поля форми
                } else {
                    // Серверна помилка
                    messageDiv.style.display = "block";
                    messageDiv.style.color = "#ff4d4d";
                    messageDiv.innerText = res.message || "Ошибка сервера. Попробуйте позже.";
                }
            })
            .catch(error => {
                // Проблеми з мережею/інтернетом
                messageDiv.style.display = "block";
                messageDiv.style.color = "#ff4d4d";
                messageDiv.innerText = "Ошибка сети. Проверьте интернет-соединение.";
            })
            .then(() => {
                // Повертаємо кнопку в початковий стан
                button.disabled = false;
                button.innerText = "ОТПРАВИТЬ";
            });
        });
    });
});




