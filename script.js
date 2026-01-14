// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы DOM
const floatingBg = document.getElementById('floatingBg');
const verificationScreen = document.getElementById('verificationScreen');
const mainScreen = document.getElementById('mainScreen');
const verifyBtn = document.getElementById('verifyBtn');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeSubtitle = document.getElementById('welcomeSubtitle');
const sendFileBtn = document.getElementById('sendFileBtn');
const fileInput = document.getElementById('fileInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const statusMessage = document.getElementById('statusMessage');

// Ссылки на фото
const photoUrls = [
    'https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj',
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDkyZA',
    'https://i.getgems.io/FIFF8-gSDSLwn7eJ2h6_Z93zNCrLk_8Mm0DpXS6VJTU/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUQ5aWtacTZ4UGdLanptZEJHMEcwUzgwUnZVSmpid2dIclBaWERLY193c0U4NHcvOTU4NzA1Mjc1OTBiNzJiOQ',
    'https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp',
    'https://i.getgems.io/JPLdyQ18jDump5MEqq7XSz-ACNhOIcB3j__Fu4YoBls/rs:fill:500:500:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUURJUmVsZU9rVHhDRDRnX1hFbTh4ajBMWU5nNi16TXNUR0FBd0CBLXZFYmtHQnUvOWM4MDk4NjQwNmU4MjFlMg',
    'https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg'
];

// Переменные состояния
let username = 'Гость';

// Инициализация
function init() {
    // Получаем данные пользователя из Telegram
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        username = user.username || 
                  `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                  'Гость';
    }
    
    // Создаем фоновые фото
    createFloatingPhotos();
    
    // Назначаем обработчики
    verifyBtn.addEventListener('click', verifyUser);
    sendFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Инициализируем тему
    initTelegramTheme();
    
    // Показываем версию приложения в консоли
    console.log('Telegram Mini App v1.0 запущен');
    console.log('Пользователь:', username);
    console.log('Язык:', tg.initDataUnsafe?.user?.language_code || 'ru');
}

// Создание фоновых фото
function createFloatingPhotos() {
    // Очищаем фон
    floatingBg.innerHTML = '';
    
    // Массив анимаций для разнообразия
    const animations = [
        'floatAnimation1',
        'floatAnimation2', 
        'floatAnimation3',
        'floatAnimation4',
        'floatAnimation5',
        'floatAnimation6'
    ];
    
    // Создаем 6 фото с разными параметрами
    photoUrls.forEach((url, index) => {
        const photo = document.createElement('div');
        photo.className = 'floating-photo';
        
        // Разные размеры
        const sizes = [180, 150, 200, 160, 140, 170];
        const size = sizes[index] || 150;
        photo.style.width = `${size}px`;
        photo.style.height = `${size}px`;
        
        // Позиционируем по кругу
        const angle = (index / photoUrls.length) * 2 * Math.PI;
        const radius = 40; // процент от размера экрана
        photo.style.top = `${50 + Math.sin(angle) * radius}%`;
        photo.style.left = `${50 + Math.cos(angle) * radius}%`;
        
        photo.style.backgroundImage = `url('${url}')`;
        
        // Настройки анимации с скоростью 0.6x
        const baseDuration = 30;
        const speed = 0.6;
        const duration = baseDuration / speed;
        
        // Разные анимации для каждого фото
        const animationName = animations[index % animations.length];
        photo.style.animation = `${animationName} ${duration}s infinite linear`;
        
        // Синее свечение
        photo.style.boxShadow = `
            0 0 40px rgba(0, 150, 255, 0.8),
            0 0 80px rgba(0, 100, 255, 0.5),
            inset 0 0 40px rgba(255, 255, 255, 0.1)
        `;
        
        floatingBg.appendChild(photo);
    });
}

// Проверка пользователя (простая капча)
function verifyUser() {
    // Простая проверка - просто нажатие на кнопку
    // В реальном приложении можно добавить более сложную логику
    
    // Анимация кнопки
    verifyBtn.style.transform = 'scale(0.95)';
    verifyBtn.style.opacity = '0.8';
    
    setTimeout(() => {
        verifyBtn.style.transform = '';
        verifyBtn.style.opacity = '';
        showMainScreen();
    }, 300);
}

// Показать основной экран
function showMainScreen() {
    verificationScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    
    // Обновляем приветствие
    welcomeTitle.textContent = `Добро пожаловать, ${username}!`;
    welcomeSubtitle.textContent = 'Теперь вы можете отправить файл администратору';
    
    // Показываем плавное появление
    mainScreen.style.opacity = '0';
    mainScreen.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainScreen.style.transition = 'opacity 0.5s, transform 0.5s';
        mainScreen.style.opacity = '1';
        mainScreen.style.transform = 'translateY(0)';
    }, 100);
}

// Обработка выбора файла
function handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Показываем загрузку
    loadingSpinner.style.display = 'block';
    statusMessage.style.display = 'none';
    
    // Для каждого файла
    Array.from(files).forEach(file => {
        sendFileToBot(file);
    });
    
    // Сбрасываем input
    event.target.value = '';
}

// Отправка файла в бота
async function sendFileToBot(file) {
    try {
        statusMessage.textContent = `Отправка файла: ${file.name}...`;
        statusMessage.className = 'status-message';
        statusMessage.style.display = 'block';
        
        // В реальном Mini App используем tg.sendData для отправки в бота
        // Для демонстрации симулируем отправку
        
        // Показываем прогресс
        loadingSpinner.style.display = 'block';
        
        // Симуляция отправки (2 секунды)
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            statusMessage.textContent = `✅ Файл "${file.name}" успешно отправлен!`;
            statusMessage.className = 'status-message success';
            
            // Логируем информацию о файле
            console.log('Информация о файле:', {
                name: file.name,
                type: file.type,
                size: formatFileSize(file.size),
                lastModified: new Date(file.lastModified).toLocaleString()
            });
            
            // В реальном приложении:
            // tg.sendData(JSON.stringify({
            //     action: 'upload_file',
            //     filename: file.name,
            //     size: file.size,
            //     username: username
            // }));
            
        }, 2000);
        
    } catch (error) {
        loadingSpinner.style.display = 'none';
        statusMessage.textContent = `❌ Ошибка: ${error.message}`;
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        console.error('Ошибка отправки файла:', error);
    }
}

// Форматирование размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Инициализация Telegram темы
function initTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.style.background = 'linear-gradient(135deg, #001a00 0%, #000000 50%, #000033 100%)';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #003300 0%, #001100 50%, #001133 100%)';
        document.body.style.color = '#e0e0e0';
    }
}

// Назначаем обработчик смены темы
tg.onEvent('themeChanged', initTelegramTheme);

// Добавляем кнопку "Назад" для Telegram
tg.BackButton.show();
tg.BackButton.onClick(() => {
    tg.close();
});

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
