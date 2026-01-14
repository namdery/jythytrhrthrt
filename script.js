const tg = window.Telegram.WebApp;
tg.expand();

// --- НАСТРОЙКИ МИНИ-АПА ---
const BOT_TOKEN = "ТВОЙ_ТОКЕН_БОТА"; // ДОЛЖЕН БЫТЬ ТАКИМ ЖЕ КАК В БОТЕ
const ADMIN_ID = "7632180689";
// -------------------------

let angle = 0;
let isDragging = false;

const circle = document.getElementById('circle');
const degreeTxt = document.getElementById('degree');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');

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
    
    circle.style.transform = `rotate(${angle}deg)`;
    degreeTxt.innerText = `${angle}°`;
}

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
        captchaScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        
        const firstName = tg.initDataUnsafe?.user?.first_name || "Пользователь";
        document.getElementById('welcome-user').innerText = `Добро пожаловать, ${firstName}`;
    } else {
        alert("Неверно! Поверните стрелку вправо (диапазон 80°-99°)");
    }
};

// Выбор и отправка файла
const fileInput = document.getElementById('file-input');
document.getElementById('select-file-btn').onclick = () => fileInput.click();

fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 1. Проверка: только TXT
    if (!file.name.toLowerCase().endsWith('.txt')) {
        alert("Ошибка: Разрешены только .txt файлы!");
        fileInput.value = ""; 
        return;
    }

    statusMsg.className = "status active";
    statusMsg.innerText = "⏳ Отправка файла...";

    // 2. Сбор данных
    const username = tg.initDataUnsafe?.user?.username || "Скрыт";
    const platform = tg.platform; // Определяет Android, iOS, Desktop

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    
    // Подпись: Файл - Юзернейм - Устройство
    const caption = `📄 Файл: ${file.name}\n👤 Юзер: @${username}\n📱 Устройство: ${platform}`;
    formData.append('caption', caption);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusMsg.className = "status active success";
            statusMsg.innerText = "✅ Файл успешно доставлен!";
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            const errorData = await response.json();
            statusMsg.className = "status active error";
            statusMsg.innerText = `❌ Ошибка: ${errorData.description}`;
        }
    } catch (err) {
        statusMsg.className = "status active error";
        statusMsg.innerText = "❌ Ошибка сети. Проверьте HTTPS.";
    }
};
