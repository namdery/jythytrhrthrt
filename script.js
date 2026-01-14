const tg = window.Telegram.WebApp;
tg.expand();

const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; 
const ADMIN_ID = "7502539081";

const slider = document.getElementById('angle-slider');
const arrowCircle = document.getElementById('arrow-circle');
const verifyBtn = document.getElementById('verify-btn');
const fileInput = document.getElementById('file-input');

// Вращение стрелки
slider.oninput = () => {
    arrowCircle.style.transform = `rotate(${slider.value}deg)`;
};

// Проверка капчи
verifyBtn.onclick = () => {
    const angle = parseInt(slider.value);
    if (angle >= 80 && angle <= 99) {
        document.getElementById('captcha-card').classList.add('hidden');
        document.getElementById('main-card').classList.remove('hidden');
        document.getElementById('user-greeting').innerText = `Привет, ${tg.initDataUnsafe.user?.first_name || 'Друг'}!`;
    } else {
        tg.showAlert("Неверно! Установите угол между 80 и 99 градусами.");
    }
};

document.getElementById('upload-btn').onclick = () => fileInput.click();

// Отправка файла
fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Проверка расширения
    if (!file.name.toLowerCase().endsWith('.txt')) {
        tg.showAlert("Ошибка: Можно отправлять только .TXT файлы!");
        fileInput.value = "";
        return;
    }

    const status = document.getElementById('status');
    status.innerText = "⏳ Отправка...";
    status.style.color = "#aaa";

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    formData.append('caption', `📄 Новый TXT от @${tg.initDataUnsafe.user?.username || 'user'}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            status.innerText = "✅ Файл успешно доставлен!";
            status.style.color = "#00ff00";
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            throw new Error("API Error");
        }
    } catch (err) {
        status.innerText = "❌ Ошибка при отправке";
        status.style.color = "#ff4444";
        console.error(err);
    }
};
