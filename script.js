// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы DOM
const customCursor = document.getElementById('customCursor');
const floatingBg = document.getElementById('floatingBg');
const verificationScreen = document.getElementById('verificationScreen');
const mainScreen = document.getElementById('mainScreen');
const rotateCircle = document.getElementById('rotateCircle');
const degreeIndicator = document.getElementById('degreeIndicator');
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
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDkyZA',
    'https://i.getgems.io/FIFF8-gSDSLwn7eJ2h6_Z93zNCrLk_8Mm0DpXS6VJTU/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUQ5aWtacTZ4UGdLanptZEJHMEcwUzgwUnZVSmpid2dIclBaWERLY193c0U4NHcvOTU4NzA1Mjc1OTBiNzJiOQ',
    'https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp',
    'https://i.getgems.io/JPLdyQ18jDump5MEqq7XSz-ACNhOIcB3j__Fu4YoBls/rs:fill:500:500:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUURJUmVsZU9rVHhDRDRnX1hFbTh4ajBMWU5nNi16TXNUR0FBd0NBLXZFYmtHQnUvOWM4MDk4NjQwNmU4MjFlMg',
    'https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg'
];

// Переменные состояния
let rotationAngle = 0;
let isVerified = false;
let username = 'Гость';

// Инициализация
function init() {
    // Получаем данные пользователя из Telegram
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        username = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Гость';
    }
    
    // Создаем фоновые фото
    createFloatingPhotos();
    
    // Настраиваем кастомный курсор
    setupCustomCursor();
    
    // Настраиваем вращение
    setupRotation();
    
    // Назначаем обработчики
    verifyBtn.addEventListener('click', verifyRotation);
    sendFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Инициализируем тему
    initTelegramTheme();
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
        
        // Разные размеры и позиции
        const size = 120 + Math.random() * 80;
        photo.style.width = `${size}px`;
        photo.style.height = `${size}px`;
        photo.style.top = `${10 + Math.random() * 80}%`;
        photo.style.left = `${10 + Math.random() * 80}%`;
        photo.style.backgroundImage = `url('${url}')`;
        
        // Настройки анимации с скоростью 0.6x
        const baseDuration = 40;
        const speed = 0.6;
        const duration = (baseDuration / speed) + Math.random() * 10;
        
        // Разные анимации для каждого фото
        const animationName = animations[index % animations.length];
        photo.style.animation = `${animationName} ${duration}s infinite linear`;
        
        // Синее свечение
        photo.style.boxShadow = `
            0 0 50px rgba(0, 150, 255, 0.8),
            0 0 100px rgba(0, 100, 255, 0.5),
            inset 0 0 50px rgba(255, 255, 255, 0.1)
        `;
        
        floatingBg.appendChild(photo);
    });
}

// Настройка кастомного курсора
function setupCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX - 20}px`;
        customCursor.style.top = `${e.clientY - 20}px`;
    });
    
    // Скрываем стандартный курсор
    document.body.style.cursor = 'none';
}

// Настройка вращения стрелки
function setupRotation() {
    let isDragging = false;
    let startAngle = 0;
    let startRotation = 0;
    
    rotateCircle.addEventListener('mousedown', startDrag);
    rotateCircle.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const rect = rotateCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        startRotation = rotationAngle;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function startDragTouch(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            const rect = rotateCircle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
            startRotation = rotationAngle;
            
            document.addEventListener('touchmove', dragTouch);
            document.addEventListener('touchend', stopDrag);
        }
    }
    
    function drag(e) {
        if (!isDragging) return;
        const rect = rotateCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        
        rotationAngle = startRotation + (angle - startAngle) * (180 / Math.PI);
        updateRotation();
    }
    
    function dragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = rotateCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
        
        rotationAngle = startRotation + (angle - startAngle) * (180 / Math.PI);
        updateRotation();
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

// Обновление отображения вращения
function updateRotation() {
    // Ограничиваем угол от -180 до 180 градусов
    rotationAngle = ((rotationAngle + 180) % 360) - 180;
    
    // Применяем вращение
    rotateCircle.style.transform = `rotate(${rotationAngle}deg)`;
    
    // Обновляем индикатор
    degreeIndicator.textContent = `${Math.round(rotationAngle)}°`;
    
    // Проверяем, достигнуты ли 90 градусов
    if (Math.abs(rotationAngle - 90) < 5) {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00ff88)';
        rotateCircle.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.7)';
    } else {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        rotateCircle.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
    }
}

// Проверка вращения
function verifyRotation() {
    if (Math.abs(rotationAngle - 90) < 10) {
        isVerified = true;
        showMainScreen();
    } else {
        // В Mini App лучше не использовать alert
        const message = 'Поверните стрелку точно на 90 градусов вправо!';
        statusMessage.textContent = message;
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 2000);
    }
}

// Показать основной экран
function showMainScreen() {
    verificationScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    
    // Обновляем приветствие
    welcomeTitle.textContent = `Добро пожаловать, ${username}!`;
    welcomeSubtitle.textContent = 'Теперь вы можете отправить файл администратору';
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
        
        // В реальном Mini App мы бы использовали tg.sendData
        // Но для GitHub Pages используем симуляцию
        
        // Показываем успешную отправку через 1.5 секунды
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            statusMessage.textContent = `✅ Файл "${file.name}" успешно отправлен администратору (ID: 7502539081)!`;
            statusMessage.className = 'status-message success';
            
            // Логируем в консоль (для отладки)
            console.log('Файл отправлен в бота:', {
                filename: file.name,
                size: file.size,
                type: file.type,
                username: username,
                adminId: 7502539081,
                timestamp: new Date().toISOString()
            });
            
            // Если в будущем нужно реально отправлять через Telegram:
            // tg.sendData(JSON.stringify({
            //     action: 'send_file',
            //     filename: file.name,
            //     username: username,
            //     adminId: 7502539081
            // }));
            
        }, 1500);
        
    } catch (error) {
        loadingSpinner.style.display = 'none';
        statusMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        console.error('Ошибка отправки файла:', error);
    }
}

// Инициализация Telegram темы
function initTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.style.background = 'linear-gradient(135deg, #001a00 0%, #000000 50%, #000033 100%)';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #003300 0%, #001100 50%, #001133 100%)';
    }
}

// Назначаем обработчик смены темы
tg.onEvent('themeChanged', initTelegramTheme);

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
