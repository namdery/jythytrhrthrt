// Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы
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

// Ссылки на фото
const photoUrls = [
    'https://yt3.googleusercontent.com/v5uMoct16G7gneNFzOx71EZHam15nxmcxpcovXNMRMM0UtxsGq0IWn5ZcLmQ0pGgOIuGHBSTmFY=s900-c-k-c0x00ffffff-no-rj',
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDkyZA',
    'https://i.getgems.io/FIFF8-gSDSLwn7eJ2h6_Z93zNCrLk_8Mm0DpXS6VJTU/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUQ5aWtacTZ4UGdLanptZEJHMEcwUzgwUnZVSmpid2dIclBaWERLY193c0U4NHcvOTU4NzA1Mjc1OTBiNzJiOQ',
    'https://cache.tonapi.io/imgproxy/emGFD8G3jt41AkBJLS2ygiHlTP20aCPP_tN0O7j_9aA/rs:fill:1500:1500:1/g:no/aHR0cHM6Ly9uZnQuZnJhZ21lbnQuY29tL2dpZnQvY3J5c3RhbGJhbGwtNDk0LndlYnA.webp',
    'https://i.getgems.io/JPLdyQ18jDump5MEqq7XSz-ACNhOIcB3j__Fu4YoBls/rs:fill:500:500:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUURJUmVsZU9rVHhDRDRnX1hFbTh4jBMWU5nNi16TXNUR0FBd0CBLXZFYmtHQnUvOWM4MDk4NjQwNmU4MjFlMg',
    'https://static6.tgstat.ru/channels/_0/7c/7c8536637e62010b627a43f09fe8a469.jpg'
];

// Переменные
let rotationAngle = 0;
let username = 'Гость';

// Инициализация
function init() {
    // Получаем данные пользователя
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        username = user.username || 
                  `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                  'Гость';
    }
    
    // Создаем фон
    createBackground();
    
    // Настраиваем вращение
    setupRotation();
    
    // Настраиваем обработчики
    setupEventListeners();
    
    console.log('Mini App запущен для пользователя:', username);
}

// Создание фона
function createBackground() {
    photoUrls.forEach((url, index) => {
        const img = document.createElement('div');
        img.className = 'floating-photo';
        
        // Размеры и позиции
        const size = 120 + Math.random() * 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.top = `${10 + Math.random() * 80}%`;
        img.style.left = `${10 + Math.random() * 80}%`;
        img.style.backgroundImage = `url('${url}')`;
        
        // Скорость 0.6x
        const duration = 30 / 0.6;
        img.style.animationDuration = `${duration + (index * 5)}s`;
        
        floatingBg.appendChild(img);
    });
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
    
    // Подсвечиваем если близко к 90 градусам
    if (Math.abs(rotationAngle - 90) < 10) {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00ff88)';
        rotateCircle.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.7)';
    } else {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        rotateCircle.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
    }
}

// Настройка обработчиков
function setupEventListeners() {
    // Проверка вращения
    verifyBtn.addEventListener('click', () => {
        if (Math.abs(rotationAngle - 90) < 10) {
            showMainScreen();
        } else {
            showStatus('Поверните стрелку на 90° вправо!', 'error');
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
    userInfo.textContent = 'Теперь вы можете отправить файл';
}

// Обработка загрузки файла
async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    
    // Ограничения
    const maxSize = 20 * 1024 * 1024; // 20MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
        showStatus('Некоторые файлы больше 20MB', 'error');
        return;
    }
    
    showStatus(`📤 Отправка ${files.length} файла(ов)...`, 'info');
    
    // Отправка файлов через Telegram Web App
    try {
        // Отправляем данные о файлах
        const fileData = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        }));
        
        // Отправляем через Telegram Web App API
        tg.sendData(JSON.stringify({
            action: 'send_files',
            files: fileData,
            username: username,
            target: '@rymora' // Отправляем @rymora
        }));
        
        // Показываем успех
        setTimeout(() => {
            showStatus(
                `✅ ${files.length} файл(ов) успешно отправлено!`,
                'success'
            );
            
            console.log('Файлы отправлены @rymora:', {
                count: files.length,
                files: fileData,
                from: username,
                target: '@rymora'
            });
            
        }, 1500);
        
    } catch (error) {
        showStatus('❌ Ошибка отправки файлов', 'error');
        console.error('Ошибка отправки:', error);
    }
    
    // Сброс input
    event.target.value = '';
}

// Показать статус
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    // Автоскрытие
    if (type !== 'info') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', init);
