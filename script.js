// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы
const captchaScreen = document.getElementById('captchaScreen');
const mainScreen = document.getElementById('mainScreen');
const background = document.getElementById('background');
const captchaGrid = document.getElementById('captchaGrid');
const verifyCaptchaBtn = document.getElementById('verifyCaptchaBtn');
const welcomeText = document.getElementById('welcomeText');
const userInfo = document.getElementById('userInfo');
const sendFileBtn = document.getElementById('sendFileBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');

// Данные
const photoUrls = [
    'https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj',
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDkyZA',
    'https://i.getgems.io/FIFF8-gSDSLwn7eJ2h6_Z93zNCrLk_8Mm0DpXS6VJTU/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUQ5aWtacTZ4UGdLanptZEJHMEcwUzgwUnZVSmpid2dIclBaWERLY193c0U4NHcvOTU4NzA1Mjc1OTBiNzJiOQ',
    'https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp',
    'https://i.getgems.io/JPLdyQ18jDump5MEqq7XSz-ACNhOIcB3j__Fu4YoBls/rs:fill:500:500:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUURJUmVsZU9rVHhDRDRnX1hFbTh4ajBMWU5nNi16TXNUR0FBd0CBLXZFYmtHQnUvOWM4MDk4NjQwNmU4MjFlMg',
    'https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg'
];

// Переменные
let username = 'Гость';
let selectedCaptchaItems = [];

// Инициализация
function init() {
    // Получаем данные пользователя
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        username = user.username || user.first_name || 'Гость';
    }
    
    // Создаем фон
    createBackground();
    
    // Создаем капчу
    createCaptcha();
    
    // Настраиваем обработчики
    setupEventListeners();
    
    // Показываем информацию в консоли
    console.log('Mini App запущен для:', username);
}

// Создание фона с вращающимися фото
function createBackground() {
    photoUrls.forEach((url, index) => {
        const img = document.createElement('div');
        img.className = 'floating-image';
        
        // Разные размеры и позиции
        const size = 120 + Math.random() * 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.top = `${Math.random() * 80}%`;
        img.style.left = `${Math.random() * 80}%`;
        img.style.backgroundImage = `url('${url}')`;
        
        // Разная скорость анимации (0.6x)
        const duration = 40 / 0.6; // Базовая 40 сек / 0.6x скорость
        img.style.animationDuration = `${duration + Math.random() * 10}s`;
        
        background.appendChild(img);
    });
}

// Создание простой капчи
function createCaptcha() {
    const images = [
        { url: '🎁', isGift: true },
        { url: '🎄', isGift: true },
        { url: '🎅', isGift: false },
        { url: '⭐', isGift: false },
        { url: '🎄', isGift: true },
        { url: '🎁', isGift: true },
        { url: '❄️', isGift: false },
        { url: '🎁', isGift: true },
        { url: '⛄', isGift: false }
    ];
    
    captchaGrid.innerHTML = '';
    
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'captcha-item';
        item.dataset.index = index;
        item.dataset.isGift = image.isGift;
        item.innerHTML = `<div style="font-size: 40px; line-height: 100px;">${image.url}</div>`;
        item.style.background = image.isGift ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        
        item.addEventListener('click', () => {
            if (image.isGift) {
                item.classList.toggle('selected');
                const idx = selectedCaptchaItems.indexOf(index);
                if (idx === -1) {
                    selectedCaptchaItems.push(index);
                } else {
                    selectedCaptchaItems.splice(idx, 1);
                }
            } else {
                showStatus('Это не подарок! Выберите только подарки 🎁', 'error');
            }
        });
        
        captchaGrid.appendChild(item);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Проверка капчи
    verifyCaptchaBtn.addEventListener('click', () => {
        // Всего 4 подарка в капче
        if (selectedCaptchaItems.length === 4) {
            showMainScreen();
        } else {
            showStatus('Выберите все 4 подарка 🎁', 'error');
        }
    });
    
    // Отправка файла
    sendFileBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileUpload);
}

// Показать главный экран
function showMainScreen() {
    captchaScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
    
    welcomeText.textContent = `Добро пожаловать, ${username}!`;
    userInfo.textContent = 'Теперь вы можете отправить файл администратору';
}

// Обработка загрузки файла
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showStatus(`Загружаем файл: ${file.name}...`, 'info');
    
    // Симуляция отправки
    setTimeout(() => {
        showStatus(`✅ Файл "${file.name}" отправлен администратору (ID: 7502539081)`, 'success');
        
        // Логирование для отладки
        console.log('Файл отправлен:', {
            name: file.name,
            size: formatSize(file.size),
            type: file.type,
            to: 'admin@7502539081',
            from: username,
            time: new Date().toLocaleString()
        });
        
        // В реальном приложении здесь будет отправка через Telegram
        // tg.sendData(JSON.stringify({
        //     file: file.name,
        //     user: username,
        //     adminId: 7502539081
        // }));
        
    }, 2000);
}

// Показать статус
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    if (type !== 'info') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

// Форматирование размера файла
function formatSize(bytes) {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Б';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
