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
    'https://i.getgems.io/TBlXd0AGxwweh_orE0Cj8J_wMTVDeGDzkp0KaC6lcVk/rs:fill:1000:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50L2ltYWdlcy9FUUNXaDFsUGx0eVR3Q1d4Q1htNHVtTDV0UFpvWFI4a1RJY1QtcGQwSnFvYWRMSG8vODMwMWE1NTIwYWJlMDzykZA',
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

// Создание фона
function createBackground() {
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
    
    fileInput.addEventListener('change', handleFileUpload);
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

// Обработка загрузки файла (ОДИН КЛИК!)
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверка типа файла (только .txt)
    if (!file.name.toLowerCase().endsWith('.txt')) {
        showStatus('Можно отправлять только .txt файлы!', 'error');
        event.target.value = '';
        return;
    }
    
    // Проверка таймера
    const now = Date.now();
    const timeSinceLastUpload = (now - lastUploadTime) / 1000;
    
    if (timeSinceLastUpload < 30) {
        startCountdown(30 - Math.floor(timeSinceLastUpload));
        showStatus('Подождите 30 секунд между отправками', 'error');
        event.target.value = '';
        return;
    }
    
    // Проверка размера (макс. 5MB для .txt)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showStatus('Файл слишком большой! Максимум 5MB', 'error');
        event.target.value = '';
        return;
    }
    
    // Блокируем кнопку и показываем загрузку
    sendFileBtn.disabled = true;
    sendFileBtn.innerHTML = '📤 Отправка...';
    showStatus('📤 Отправка файла...', 'info');
    
    try {
        // Читаем первые 1000 символов файла
        const filePreview = await readFilePreview(file, 1000);
        
        // Получаем информацию об устройстве
        const deviceInfo = getDeviceInfo();
        
        // Отправляем через Telegram Web App
        // Используем более надежный метод
        const dataToSend = {
            action: 'send_txt_file',
            filename: file.name,
            filesize: file.size,
            filetype: file.type,
            content_preview: filePreview,
            username: username,
            user_id: tg.initDataUnsafe?.user?.id || 'unknown',
            device: deviceInfo,
            timestamp: new Date().toISOString(),
            file_hash: await calculateFileHash(file)
        };
        
        // Отправляем данные - ОСНОВНОЙ МЕТОД
        tg.sendData(JSON.stringify(dataToSend));
        
        // Обновляем время последней отправки
        lastUploadTime = now;
        canUpload = false;
        startCountdown(30);
        
        // Показываем успех
        setTimeout(() => {
            showStatus(`✅ Файл "${file.name}" отправлен на проверку!`, 'success');
            sendFileBtn.innerHTML = '📎 Выбрать .txt файл';
            sendFileBtn.disabled = false;
        }, 1000);
        
        console.log('Данные отправлены в бота:', {
            filename: file.name,
            size: file.size,
            user: username
        });
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        showStatus('❌ Ошибка отправки файла', 'error');
        sendFileBtn.innerHTML = '📎 Выбрать .txt файл';
        sendFileBtn.disabled = false;
    }
    
    // Очищаем input для возможности выбора того же файла снова
    event.target.value = '';
}

// Чтение превью файла
function readFilePreview(file, maxChars) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            resolve(content.substring(0, maxChars));
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Простой хэш файла для идентификации
async function calculateFileHash(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Простой хэш на основе содержимого
            let hash = 0;
            const content = event.target.result;
            for (let i = 0; i < Math.min(content.length, 100); i++) {
                hash = ((hash << 5) - hash) + content.charCodeAt(i);
                hash |= 0;
            }
            resolve(hash.toString(16));
        };
        reader.readAsText(file);
    });
}

// Определение устройства
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Unknown';
    let platform = 'Unknown';
    
    if (/Android/.test(ua)) device = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) device = 'iOS';
    else if (/Windows/.test(ua)) device = 'Windows';
    else if (/Mac OS/.test(ua)) device = 'macOS';
    else if (/Linux/.test(ua)) device = 'Linux';
    
    if (/Android|iPhone|iPad|iPod/.test(ua)) platform = 'Mobile';
    else platform = 'Desktop';
    
    let browser = 'Unknown';
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Edg/.test(ua)) browser = 'Edge';
    
    return {
        device: device,
        platform: platform,
        browser: browser,
        language: navigator.language
    };
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
