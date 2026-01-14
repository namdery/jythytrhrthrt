const tg = window.Telegram.WebApp;
tg.expand();

// --- НАСТРОЙКИ ---
const BOT_TOKEN = "8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I"; // <--- ВСТАВЬТЕ СЮДА ТОКЕН
const TARGET_ID = "7632180689";     // ID получателя
// -----------------

const rotateCircle = document.getElementById('rotateCircle');
const degreeIndicator = document.getElementById('degreeIndicator');
const captchaScreen = document.getElementById('captchaScreen');
const mainScreen = document.getElementById('mainScreen');
const welcomeText = document.getElementById('welcomeText');
const fileInput = document.getElementById('file-input'); // Убедитесь что ID совпадает с HTML
const statusDiv = document.getElementById('status');

let currentAngle = 0;
let isDragging = false;

// Вращение стрелки
function setupRotation() {
    const move = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = rotateCircle.parentElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        currentAngle = Math.round(angle + 90);
        rotateCircle.style.transform = `rotate(${currentAngle}deg)`;
        degreeIndicator.textContent = `${currentAngle}°`;
    };

    rotateCircle.addEventListener('mousedown', () => isDragging = true);
    rotateCircle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, {passive: false});
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
}

// Проверка капчи
document.getElementById('verifyBtn').onclick = () => {
    if (currentAngle >= 80 && currentAngle <= 100) {
        captchaScreen.style.display = 'none';
        mainScreen.style.display = 'flex';
        const name = tg.initDataUnsafe?.user?.first_name || "Пользователь";
        welcomeText.textContent = `Добро пожаловать, ${name}!`;
    } else {
        alert("Поверните стрелку вправо (около 90°)");
    }
};

// Отправка файла
document.getElementById('sendFileBtn').onclick = () => document.getElementById('fileInput').click();

document.getElementById('fileInput').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showStatus(`📤 Отправка: ${file.name}...`, 'info');

    const formData = new FormData();
    formData.append('chat_id', TARGET_ID);
    formData.append('document', file);
    formData.append('caption', `Файл от пользователя: @${tg.initDataUnsafe?.user?.username || 'unknown'}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showStatus("✅ Успешно отправлено администратору!", "success");
        } else {
            showStatus(`❌ Ошибка Telegram: ${result.description}`, "error");
        }
    } catch (err) {
        showStatus(`❌ Ошибка сети: Возможно, CORS блокирует запрос.`, "error");
        console.error(err);
    }
};

function showStatus(text, type) {
    statusDiv.textContent = text;
    statusDiv.className = `status ${type}`;
}

setupRotation();
