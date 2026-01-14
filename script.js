const tg = window.Telegram.WebApp;
tg.expand();

// НАСТРОЙКИ
const BOT_TOKEN = "ТВОЙ_ТОКЕН_БОТА"; // Замени на свой!
const ADMIN_ID = "7632180689";

let angle = 0;
let isMoving = false;

const circle = document.getElementById('circle');
const degreeTxt = document.getElementById('degree');

// Логика вращения
function handleMove(e) {
    if (!isMoving) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = circle.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    angle = Math.round(rad * (180 / Math.PI) + 90);
    
    circle.style.transform = `rotate(${angle}deg)`;
    degreeTxt.innerText = `${angle}°`;
}

circle.addEventListener('mousedown', () => isMoving = true);
circle.addEventListener('touchstart', () => isMoving = true);
window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('mouseup', () => isMoving = false);
window.addEventListener('touchend', () => isMoving = false);

// Проверка капчи
document.getElementById('verify-btn').onclick = () => {
    if (angle >= 85 && angle <= 95) {
        document.getElementById('captcha-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        const user = tg.initDataUnsafe?.user?.first_name || "Пользователь";
        document.getElementById('welcome').innerText = `Добро пожаловать, ${user}`;
    } else {
        alert("Поверните стрелку вправо (на 90 градусов)");
    }
};

// Отправка файла
const fileInput = document.getElementById('file-input');
const status = document.getElementById('status-msg');

document.getElementById('select-btn').onclick = () => fileInput.click();

fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    status.className = "status active";
    status.innerText = "⏳ Отправка файла...";

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    formData.append('caption', `Файл от: @${tg.initDataUnsafe?.user?.username || 'unknown'}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        const resData = await response.json();

        if (response.ok) {
            status.className = "status active success";
            status.innerText = "✅ Файл успешно отправлен администратору!";
        } else {
            status.className = "status active error";
            status.innerText = `❌ Ошибка Telegram: ${resData.description}`;
        }
    } catch (err) {
        status.className = "status active error";
        status.innerText = "❌ Ошибка сети: Возможно, нужно использовать HTTPS или проверить токен.";
    }
};
