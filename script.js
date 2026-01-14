const tg = window.Telegram.WebApp;
tg.expand();

// --- НАСТРОЙКИ МИНИ-АПА ---
const BOT_TOKEN = "ТВОЙ_ТОКЕН_БОТА";
const ADMIN_ID = "7632180689";

// Ссылки на фоновые изображения
const BACKGROUND_IMAGES = [
    "https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg",
    "https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp",
    "https://i.getgems.io/cj6OL84WRNDlEU1STgJv-6EComaWdEiyGa3ueSBHvzw/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUURMN0hNYmNhMEZ1ZnJqSEZjUm9pTGtFaU9Ya1hvT192SDJnVlVOOEpOcDRraEsvNjgzMDZjMTkyYWNjMDU3Mw",
    "https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj"
];
// -------------------------

let angle = 0;
let isDragging = false;
let targetAngle = 0;
let targetStart = 0;
let targetEnd = 0;

// Элементы
const circle = document.getElementById('circle');
const degreeTxt = document.getElementById('degree');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');
const deviceInfo = document.getElementById('device-info');
const welcomeUser = document.getElementById('welcome-user');
const degreeMarks = document.getElementById('degree-marks');
const targetHint = document.getElementById('target-hint');

// Создаем циферблат с градусами
function createDegreeMarks() {
    for (let i = 0; i < 360; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'degree-mark';
        mark.textContent = i;
        mark.style.transform = `rotate(${i}deg) translate(115px) rotate(-${i}deg)`;
        degreeMarks.appendChild(mark);
    }
}

// Генерация случайного целевого угла с погрешностью 10°
function generateTargetAngle() {
    // Случайный угол от 0 до 350
    targetAngle = Math.floor(Math.random() * 36) * 10;
    
    // Погрешность ±10°
    targetStart = targetAngle - 10;
    targetEnd = targetAngle + 10;
    
    // Корректировка для перехода через 0°
    if (targetStart < 0) {
        targetStart += 360;
    }
    if (targetEnd > 360) {
        targetEnd -= 360;
    }
    
    // Обновляем подсказку
    let hintText = `Поверните стрелку в диапазон: `;
    
    if (targetStart > targetEnd) {
        // Диапазон проходит через 0°
        hintText += `0°-${targetEnd}° ИЛИ ${targetStart}°-360°`;
    } else {
        // Обычный диапазон
        hintText += `${targetStart}°-${targetEnd}°`;
    }
    
    targetHint.textContent = hintText;
    
    // Подсвечиваем нужные градусы на циферблате
    highlightTargetRange();
}

// Подсветка целевого диапазона
function highlightTargetRange() {
    // Сначала снимаем подсветку со всех меток
    const marks = document.querySelectorAll('.degree-mark');
    marks.forEach(mark => mark.classList.remove('target-range'));
    
    // Подсвечиваем метки в целевом диапазоне
    marks.forEach(mark => {
        const markAngle = parseInt(mark.textContent);
        
        if (targetStart > targetEnd) {
            // Диапазон через 0°
            if (markAngle >= 0 && markAngle <= targetEnd) {
                mark.classList.add('target-range');
            }
            if (markAngle >= targetStart && markAngle <= 360) {
                mark.classList.add('target-range');
            }
        } else {
            // Обычный диапазон
            if (markAngle >= targetStart && markAngle <= targetEnd) {
                mark.classList.add('target-range');
            }
        }
    });
}

// Проверка попадания в целевой диапазон
function isInTargetRange(currentAngle) {
    if (targetStart > targetEnd) {
        // Диапазон проходит через 0°
        return (currentAngle >= 0 && currentAngle <= targetEnd) || 
               (currentAngle >= targetStart && currentAngle <= 360);
    } else {
        // Обычный диапазон
        return currentAngle >= targetStart && currentAngle <= targetEnd;
    }
}

// Создаем плавающие фоновые изображения
function createFloatingImages() {
    const container = document.getElementById('floating-bg');
    
    // Распределяем изображения равномерно по экрану
    const positions = [
        {top: '10%', left: '10%', animationDelay: '0s'},
        {top: '20%', left: '70%', animationDelay: '5s'},
        {top: '60%', left: '20%', animationDelay: '10s'},
        {top: '70%', left: '60%', animationDelay: '15s'}
    ];
    
    BACKGROUND_IMAGES.forEach((src, index) => {
        const img = document.createElement('img');
        img.className = 'floating-img';
        img.src = src;
        img.alt = '';
        
        // Настройка размеров
        const isMobile = window.innerWidth < 480;
        img.style.width = isMobile ? '60px' : '80px';
        img.style.height = isMobile ? '60px' : '80px';
        
        // Позиционирование
        img.style.top = positions[index].top;
        img.style.left = positions[index].left;
        img.style.animationDelay = positions[index].animationDelay;
        
        // Разные скорости анимации
        img.style.animationDuration = (20 + Math.random() * 10) + 's';
        
        container.appendChild(img);
    });
}

// Определение устройства
function detectPlatform() {
    const platform = tg.platform || "Неизвестно";
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    let deviceType = "Неизвестное устройство";
    
    if (/android/i.test(userAgent)) {
        deviceType = "📱 Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        deviceType = "📱 iOS";
    } else if (/windows/i.test(userAgent)) {
        deviceType = "💻 Windows";
    } else if (/mac/i.test(userAgent)) {
        deviceType = "💻 macOS";
    } else if (/linux/i.test(userAgent)) {
        deviceType = "💻 Linux";
    }
    
    deviceInfo.innerHTML = `
        <strong>📱 Устройство:</strong> ${deviceType}<br>
        <strong>🌐 Платформа:</strong> ${platform}
    `;
    
    return { deviceType, platform };
}

// Логика вращения стрелки
function handleRotation(e) {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = circle.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    angle = Math.round(radians * (180 / Math.PI) + 90);
    if (angle < 0) angle += 360;
    
    circle.style.transform = `rotate(${angle}deg)`;
    degreeTxt.textContent = `${angle}°`;
    
    // Подсветка при попадании в диапазон
    if (isInTargetRange(angle)) {
        circle.style.background = 'linear-gradient(135deg, #00aa00, #006600)';
        circle.style.boxShadow = '0 0 25px #00ff00';
        degreeTxt.style.color = '#00ff00';
    } else {
        circle.style.background = 'linear-gradient(135deg, #008800, #004400)';
        circle.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.4)';
        degreeTxt.style.color = '#00ff00';
    }
}

// Инициализация событий вращения
circle.addEventListener('mousedown', () => isDragging = true);
circle.addEventListener('touchstart', () => isDragging = true);
window.addEventListener('mousemove', handleRotation);
window.addEventListener('touchmove', handleRotation, {passive: false});
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('touchend', () => isDragging = false);

// Кнопка подтверждения
document.getElementById('verify-btn').onclick = () => {
    if (isInTargetRange(angle)) {
        // Успешная проверка
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
        
        captchaScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        
        const firstName = tg.initDataUnsafe?.user?.first_name || "Пользователь";
        welcomeUser.textContent = `Добро пожаловать, ${firstName}`;
        
        detectPlatform();
    } else {
        // Неправильный угол
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('heavy');
        }
        alert("❌ Неверно! Поверните стрелку в указанный диапазон.");
    }
};

// Отправка файла
const fileInput = document.getElementById('file-input');
document.getElementById('select-file-btn').onclick = () => fileInput.click();

fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Проверка расширения
    if (!file.name.toLowerCase().endsWith('.txt')) {
        alert("Ошибка: Разрешены только .txt файлы!");
        fileInput.value = "";
        return;
    }

    statusMsg.className = "status active";
    statusMsg.textContent = "⏳ Отправка файла...";

    // Сбор данных
    const user = tg.initDataUnsafe?.user || {};
    const username = user.username ? `@${user.username}` : "Скрыт";
    const firstName = user.first_name || "Пользователь";
    const { deviceType, platform } = detectPlatform();

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    
    const caption = `📄 Файл: ${file.name}\n` +
                   `👤 Юзер: ${username}\n` +
                   `👨 Имя: ${firstName}\n` +
                   `📱 Устройство: ${deviceType}\n` +
                   `🌐 Платформа: ${platform}`;
    
    formData.append('caption', caption);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusMsg.className = "status active success";
            statusMsg.textContent = "✅ Файл успешно доставлен!";
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
        } else {
            const errorData = await response.json();
            statusMsg.className = "status active error";
            statusMsg.textContent = `❌ Ошибка: ${errorData.description || 'Неизвестная ошибка'}`;
        }
    } catch (err) {
        statusMsg.className = "status active error";
        statusMsg.textContent = "❌ Ошибка сети. Проверьте соединение.";
    }
};

// Инициализация при загрузке
window.addEventListener('load', () => {
    tg.ready();
    createDegreeMarks();
    generateTargetAngle();
    createFloatingImages();
    detectPlatform();
    
    console.log(`Бот запущен. Целевой диапазон: ${targetStart}°-${targetEnd}°`);
});

// Адаптация размеров изображений при изменении окна
window.addEventListener('resize', () => {
    const imgs = document.querySelectorAll('.floating-img');
    const isMobile = window.innerWidth < 480;
    
    imgs.forEach(img => {
        img.style.width = isMobile ? '60px' : '80px';
        img.style.height = isMobile ? '60px' : '80px';
    });
});
