// Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы
const captchaScreen = document.getElementById('captchaScreen');
const mainScreen = document.getElementById('mainScreen');
const floatingBg = document.getElementById('floatingBg');
const captchaGrid = document.getElementById('captchaGrid');
const verifyCaptchaBtn = document.getElementById('verifyCaptchaBtn');
const selectedCount = document.getElementById('selectedCount');
const welcomeText = document.getElementById('welcomeText');
const userInfo = document.getElementById('userInfo');
const sendFileBtn = document.getElementById('sendFileBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');

// Фоновые фото
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
let selectedItems = [];

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
    
    // Создаем капчу с 3 подарками
    createCaptcha();
    
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
        const size = 100 + Math.random() * 100;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.top = `${Math.random() * 85}%`;
        img.style.left = `${Math.random() * 85}%`;
        img.style.backgroundImage = `url('${url}')`;
        
        // Скорость 0.6x
        const duration = 30 / 0.6;
        img.style.animationDuration = `${duration + (index * 5)}s`;
        
        floatingBg.appendChild(img);
    });
}

// Создание капчи с 3 подарками (из 9 иконок)
function createCaptcha() {
    const icons = [
        { emoji: '🎁', isGift: true },
        { emoji: '🎁', isGift: true },
        { emoji: '🫂', isGift: false },
        { emoji: '⭐', isGift: false },
        { emoji: '🎁', isGift: true },  // 3-й подарок
        { emoji: '🍎', isGift: false },
        { emoji: '⚽️', isGift: false },
        { emoji: '🔔', isGift: false },
        { emoji: '🕯️', isGift: false }
    ];
    
    // Перемешиваем массив
    const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);
    
    captchaGrid.innerHTML = '';
    
    shuffledIcons.forEach((icon, index) => {
        const item = document.createElement('div');
        item.className = `captcha-item ${icon.isGift ? 'gift' : ''}`;
        item.dataset.index = index;
        item.dataset.isGift = icon.isGift;
        item.textContent = icon.emoji;
        
        item.addEventListener('click', () => {
            if (icon.isGift) {
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                    const idx = selectedItems.indexOf(index);
                    if (idx > -1) selectedItems.splice(idx, 1);
                } else {
                    if (selectedItems.length < 3) {
                        item.classList.add('selected');
                        selectedItems.push(index);
                    }
                }
                
                // Обновляем счетчик
                selectedCount.textContent = selectedItems.length;
                
                // Активируем кнопку, когда выбрано 3 подарка
                verifyCaptchaBtn.disabled = selectedItems.length !== 3;
                
                if (selectedItems.length === 3) {
                    verifyCaptchaBtn.innerHTML = '✅ Продолжить (3/3)';
                } else {
                    verifyCaptchaBtn.innerHTML = `🔓 Продолжить (${selectedItems.length}/3)`;
                }
            } else {
                showStatus('Это не подарок! Выберите только подарки 🎁', 'error');
            }
        });
        
        captchaGrid.appendChild(item);
    });
}

// Настройка обработчиков
function setupEventListeners() {
    // Проверка капчи
    verifyCaptchaBtn.addEventListener('click', () => {
        if (selectedItems.length === 3) {
            showMainScreen();
        } else {
            showStatus('Выберите все 3 подарка 🎁', 'error');
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
    
    // Анимация появления
    mainScreen.style.opacity = '0';
    mainScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        mainScreen.style.transition = 'opacity 0.5s, transform 0.5s';
        mainScreen.style.opacity = '1';
        mainScreen.style.transform = 'scale(1)';
    }, 100);
}

// Обработка загрузки файла
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверка размера (макс. 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
        showStatus('Файл слишком большой! Максимум 20MB', 'error');
        return;
    }
    
    showStatus(`📤 Отправка "${file.name}"...`, 'info');
    
    // Симуляция отправки (2 секунды)
    setTimeout(() => {
        showStatus(
            `✅ Файл "${file.name}" (${formatSize(file.size)}) отправлен администратору!`,
            'success'
        );
        
        // Логирование
        console.log('Файл отправлен администратору:', {
            filename: file.name,
            size: file.size,
            type: file.type,
            to: 7502539081,
            from: username,
            timestamp: new Date().toISOString()
        });
        
        // В реальном приложении раскомментируйте:
        // tg.sendData(JSON.stringify({
        //     action: 'send_file',
        //     filename: file.name,
        //     filesize: file.size,
        //     filetype: file.type,
        //     username: username,
        //     adminId: 7502539081
        // }));
        
    }, 2000);
    
    // Сброс input
    event.target.value = '';
}

// Показать статус
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    
    // Автоскрытие для error/info
    if (type !== 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

// Форматирование размера файла
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
