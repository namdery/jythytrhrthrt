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
const timer = document.getElementById('timer');
const countdown = document.getElementById('countdown');
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
let lastUploadTime = 0;
let canUpload = true;
let countdownInterval = null;
let selectedFile = null;

// Инициализация
function init() {
    // Получаем данные пользователя
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        username = user.username || user.first_name || 'Гость';
    }
    
    // Создаем фон с правильными позициями
    createBackground();
    
    // Настраиваем вращение
    setupRotation();
    
    // Настраиваем обработчики
    setupEventListeners();
    
    console.log('App запущен для:', username);
}

// Создание фона (уменьшенные фото, не соприкасаются)
function createBackground() {
    // Позиции для 6 фото (чтобы не перекрывались)
    const positions = [
        { top: '10%', left: '15%', animation: 'float1' },
        { top: '20%', left: '75%', animation: 'float2' },
        { top: '45%', left: '10%', animation: 'float3' },
        { top: '55%', left: '80%', animation: 'float4' },
        { top: '75%', left: '20%', animation: 'float5' },
        { top: '85%', left: '70%', animation: 'float6' }
    ];
    
    photoUrls.forEach((url, index) => {
        const img = document.createElement('div');
        img.className = 'floating-photo';
        
        const pos = positions[index] || positions[0];
        img.style.top = pos.top;
        img.style.left = pos.left;
        img.style.backgroundImage = `url('${url}')`;
        img.style.animationName = pos.animation;
        img.style.animationDuration = `${40 + (index * 5)}s`;
        
        floatingBg.appendChild(img);
    });
}

// Настройка вращения
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

// Обновление вращения
function updateRotation() {
    rotationAngle = ((rotationAngle + 180) % 360) - 180;
    rotateCircle.style.transform = `rotate(${rotationAngle}deg)`;
    degreeIndicator.textContent = `${Math.round(rotationAngle)}°`;
    
    if (Math.abs(rotationAngle - 90) < 10) {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00ff88)';
        rotateCircle.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.7)';
    } else {
        rotateCircle.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        rotateCircle.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    }
}

// Настройка обработчиков
function setupEventListeners() {
    verifyBtn.addEventListener('click', () => {
        if (Math.abs(rotationAngle - 90) < 10) {
            showMainScreen();
        } else {
            showStatus('Поверните стрелку на 90° вправо!', 'error');
        }
    });
    
    sendFileBtn.addEventListener('click', () => {
        if (canUpload) {
            fileInput.click();
        } else {
            showStatus('Подождите перед следующей отправкой', 'error');
        }
    });
    
    fileInput.addEventListener('change', handleFileSelect);
}

// Показать главный экран
function showMainScreen() {
    captchaScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
    
    welcomeText.textContent = `Привет, ${username}!`;
    userInfo.textContent = 'Вы можете отправить .txt файл';
    
    mainScreen.style.opacity = '0';
    setTimeout(() => {
        mainScreen.style.transition = 'opacity 0.5s';
        mainScreen.style.opacity = '1';
    }, 100);
}

// Выбор файла
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Сохраняем выбранный файл
    selectedFile = file;
    
    // Проверка типа файла (только .txt)
    if (!file.name.toLowerCase().endsWith('.txt')) {
        showStatus('Можно отправлять только .txt файлы!', 'error');
        event.target.value = '';
        selectedFile = null;
        return;
    }
    
    // Проверка таймера
    const now = Date.now();
    const timeSinceLastUpload = (now - lastUploadTime) / 1000;
    
    if (timeSinceLastUpload < 30) {
        startCountdown(30 - Math.floor(timeSinceLastUpload));
        showStatus('Подождите 30 секунд между отправками', 'error');
        event.target.value = '';
        selectedFile = null;
        return;
    }
    
    // Проверка размера (макс. 5MB для .txt)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showStatus('Файл слишком большой! Максимум 5MB', 'error');
        event.target.value = '';
        selectedFile = null;
        return;
    }
    
    // Спрашиваем подтверждение
    showStatus(`📝 Выбран файл: ${file.name} (${formatSize(file.size)})\nНажмите кнопку для отправки`, 'info');
    
    // Меняем кнопку на "Отправить выбранный файл"
    sendFileBtn.innerHTML = `📤 Отправить: ${file.name}`;
    sendFileBtn.onclick = () => sendSelectedFile();
}

// Отправка выбранного файла
async function sendSelectedFile() {
    if (!selectedFile) {
        showStatus('Сначала выберите файл!', 'error');
        return;
    }
    
    showStatus('📤 Отправка файла...', 'info');
    
    // Определение устройства
    const deviceInfo = getDeviceInfo();
    
    // Отправка через Telegram Web App
    try {
        // Читаем содержимое файла как текст
        const fileContent = await readFileAsText(selectedFile);
        
        // Подготавливаем данные для отправки
        const fileData = {
            action: 'send_txt_file',
            filename: selectedFile.name,
            filesize: selectedFile.size,
            filetype: selectedFile.type,
            content_preview: fileContent.substring(0, 1000), // Первые 1000 символов
            username: username,
            user_id: tg.initDataUnsafe?.user?.id || 'unknown',
            device: deviceInfo,
            timestamp: new Date().toISOString()
        };
        
        // Отправляем через Telegram Web App
        tg.sendData(JSON.stringify(fileData));
        
        // Обновляем время последней отправки
        lastUploadTime = Date.now();
        canUpload = false;
        sendFileBtn.disabled = true;
        startCountdown(30);
        
        showStatus('✅ Файл отправлен на проверку!', 'success');
        
        console.log('Файл отправлен:', fileData);
        
        // Сбрасываем выбранный файл
        selectedFile = null;
        fileInput.value = '';
        sendFileBtn.innerHTML = '📎 Выбрать .txt файл';
        sendFileBtn.onclick = () => fileInput.click();
        
    } catch (error) {
        showStatus('❌ Ошибка отправки файла', 'error');
        console.error('Ошибка отправки:', error);
    }
}

// Чтение файла как текст
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

// Определение устройства
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Неизвестное устройство';
    let platform = 'Неизвестно';
    
    if (/Android/.test(ua)) {
        device = 'Android';
        platform = 'Мобильное';
    } else if (/iPhone|iPad|iPod/.test(ua)) {
        device = 'iOS';
        platform = 'Мобильное';
    } else if (/Windows/.test(ua)) {
        device = 'Windows';
        platform = 'Десктоп';
    } else if (/Mac OS/.test(ua)) {
        device = 'macOS';
        platform = 'Десктоп';
    } else if (/Linux/.test(ua)) {
        device = 'Linux';
        platform = 'Десктоп';
    }
    
    let browser = 'Неизвестный браузер';
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Edg/.test(ua)) browser = 'Edge';
    
    return {
        device: device,
        platform: platform,
        browser: browser,
        userAgent: ua.substring(0, 150)
    };
}

// Форматирование размера
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

// Запуск таймера обратного отсчета
function startCountdown(seconds) {
    timer.style.display = 'block';
    countdown.textContent = seconds;
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            timer.style.display = 'none';
            canUpload = true;
            sendFileBtn.disabled = false;
        }
    }, 1000);
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

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', init);
