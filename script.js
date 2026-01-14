const tg = window.Telegram.WebApp;
tg.expand();

// ЗАМЕНИ НА СВОЙ ТОКЕН
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; 
const ADMIN_ID = "7502539081";

const slider = document.getElementById('angle-slider');
const arrow = document.getElementById('arrow-element');
const verifyBtn = document.getElementById('verify-btn');
const fileInput = document.getElementById('file-input');

// Вращение стрелки при движении ползунка
slider.oninput = () => {
    arrow.style.transform = `rotate(${slider.value}deg)`;
};

// Проверка капчи (80-99 градусов)
verifyBtn.onclick = () => {
    const val = parseInt(slider.value);
    if (val >= 80 && val <= 99) {
        document.getElementById('captcha-box').classList.add('hidden');
        document.getElementById('main-box').classList.remove('hidden');
        document.getElementById('user-name').innerText = `Добро пожаловать, ${tg.initDataUnsafe.user?.first_name || 'Пользователь'}!`;
    } else {
        alert("Не попал! Нужно повернуть стрелку в синий сектор (80-99°)");
    }
};

document.getElementById('upload-btn').onclick = () => fileInput.click();

// Загрузка файла
fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // ПРОВЕРКА: Только .txt
    if (!file.name.toLowerCase().endsWith('.txt')) {
        alert("Ошибка: Можно отправлять только текстовые файлы (.txt)");
        return;
    }

    const status = document.getElementById('upload-status');
    status.innerText = "⏳ Отправка...";

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    formData.append('caption', `Документ от: @${tg.initDataUnsafe.user?.username || 'user'}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            status.innerText = "✅ Файл успешно отправлен!";
            status.style.color = "#00ff00";
        } else {
            status.innerText = "❌ Ошибка. Проверьте токен бота.";
        }
    } catch (e) {
        status.innerText = "❌ Ошибка сети.";
    }
};
