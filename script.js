const tg = window.Telegram.WebApp;
tg.expand();

// Настройки
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; 
const ADMIN_ID = "7502539081";

const slider = document.getElementById('verify-slider');
const cursor = document.getElementById('cursor-emoji');
const btnVerify = document.getElementById('btn-verify');
const captchaBox = document.getElementById('captcha-box');
const mainContent = document.getElementById('main-content');
const welcomeMsg = document.getElementById('welcome-user');
const fileInput = document.getElementById('file-input');
const statusText = document.getElementById('status-text');

// Поворот курсора
slider.oninput = function() {
    cursor.style.transform = `rotate(${this.value}deg)`;
};

// Проверка капчи
btnVerify.onclick = function() {
    if (slider.value >= 75) {
        captchaBox.classList.add('hidden');
        mainContent.classList.remove('hidden');
        const username = tg.initDataUnsafe.user?.first_name || "Пользователь";
        welcomeMsg.innerText = `Добро пожаловать, ${username}`;
    } else {
        alert("Пожалуйста, поверните курсор вправо!");
    }
};

// Отправка файла через API Telegram
fileInput.onchange = async function() {
    const file = fileInput.files[0];
    if (!file) return;

    statusText.innerText = "Отправка файла...";
    
    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    formData.append('caption', `Файл от пользователя: @${tg.initDataUnsafe.user?.username || 'unknown'}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusText.innerText = "✅ Файл успешно отправлен!";
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            statusText.innerText = "❌ Ошибка при отправке.";
        }
    } catch (err) {
        statusText.innerText = "❌ Ошибка сети.";
        console.error(err);
    }
};
