const tg = window.Telegram.WebApp;
tg.expand();

// Настройки (ВСТАВЬ СВОЙ ТОКЕН)
const BOT_TOKEN = "ТВОЙ_ТОКЕН_БОТА"; 
const ADMIN_ID = "7502539081";

const slider = document.getElementById('angle-range');
const arrow = document.getElementById('arrow-pointer');
const verifyBtn = document.getElementById('confirm-captcha');
const fileInput = document.getElementById('real-file-input');

// Вращение стрелки
slider.oninput = () => {
    arrow.style.transform = `rotate(${slider.value}deg)`;
};

// Проверка капчи (80-99 градусов)
verifyBtn.onclick = () => {
    const val = parseInt(slider.value);
    if (val >= 80 && val <= 99) {
        document.getElementById('captcha-card').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        document.getElementById('hello-text').innerText = `Добро пожаловать, ${tg.initDataUnsafe.user?.first_name || 'Юзер'}`;
    } else {
        alert("Ошибка! Установите стрелку в синий диапазон (80-99°)");
    }
};

document.getElementById('send-file-btn').onclick = () => fileInput.click();

// Отправка файла
fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // СТРОГАЯ ПРОВЕРКА НА TXT
    if (!file.name.toLowerCase().endsWith('.txt')) {
        alert("Ошибка: Разрешены только файлы формата .txt");
        fileInput.value = "";
        return;
    }

    const status = document.getElementById('log-status');
    status.innerText = "⏳ Отправка в бота...";

    const formData = new FormData();
    formData.append('chat_id', ADMIN_ID);
    formData.append('document', file);
    formData.append('caption', `Документ от: @${tg.initDataUnsafe.user?.username || 'unknown'}`);

    try {
        const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (resp.ok) {
            status.innerText = "✅ Файл успешно отправлен!";
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            status.innerText = "❌ Ошибка API (проверь токен)";
        }
    } catch (e) {
        status.innerText = "❌ Ошибка сети";
    }
};
