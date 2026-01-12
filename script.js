// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Получаем информацию о пользователе
let user = tg.initDataUnsafe.user;
let userName = "Пользователь";

if (user) {
    userName = user.first_name || "Пользователь";
    document.getElementById('userName').textContent = userName;
}

// Элементы DOM
const avatar = document.getElementById('avatar');
const sendFileBtn = document.getElementById('sendFileBtn');
const instructionBtn = document.getElementById('instructionBtn');
const faqBtn = document.getElementById('faqBtn');
const instructionModal = document.getElementById('instructionModal');
const faqModal = document.getElementById('faqModal');
const closeBtns = document.querySelectorAll('.close-btn, .close-faq-btn, .close-modal-btn');
const understandBtn = document.getElementById('understandBtn');

// Анимация аватара при наведении
if (avatar) {
    avatar.addEventListener('mouseenter', () => {
        avatar.style.transform = 'scale(1.1)';
        avatar.style.transition = 'transform 0.3s ease';
    });

    avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'scale(1)';
    });
}

// Функция для отправки файла через Telegram
function sendFileToBot(file) {
    if (!file) return;
    
    // Показываем уведомление об отправке
    showNotification(`📤 Отправляем файл: ${file.name}`);
    
    // Здесь будет реальная отправка файла через Telegram Bot API
    // В реальном приложении нужно использовать tg.sendData() или другие методы
    
    // Временное решение - пересылка через бота
    setTimeout(() => {
        showNotification(`✅ Файл "${file.name}" отправлен на проверку!`);
        
        // Отправляем данные в Telegram
        const data = {
            action: 'send_file',
            file_name: file.name,
            file_size: file.size,
            user_id: user?.id || 'unknown',
            user_name: userName
        };
        
        // Отправляем данные в Telegram WebApp
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify(data));
        }
        
        // Закрываем приложение через 2 секунды
        setTimeout(() => {
            if (tg && tg.close) {
                tg.close();
            }
        }, 2000);
        
    }, 1500);
}

// Отправка файла
if (sendFileBtn) {
    sendFileBtn.addEventListener('click', () => {
        // Используем Telegram API для отправки файлов
        if (tg && tg.showScanQrPopup) {
            // Показываем сообщение
            showNotification("📁 Выберите TXT файл для отправки");
            
            // Для отправки файла в WebApp можно использовать несколько подходов:
            // 1. Через Telegram Cloud (рекомендуется)
            // 2. Через создание временной ссылки
            // 3. Через пересылку в основной чат
            
            // Временное решение - показываем инструкцию
            setTimeout(() => {
                instructionModal.style.display = 'flex';
            }, 500);
        }
    });
}

// Открытие инструкции
if (instructionBtn) {
    instructionBtn.addEventListener('click', () => {
        instructionModal.style.display = 'flex';
    });
}

// Открытие FAQ
if (faqBtn) {
    faqBtn.addEventListener('click', () => {
        faqModal.style.display = 'flex';
    });
}

// Закрытие модальных окон
closeBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            instructionModal.style.display = 'none';
            faqModal.style.display = 'none';
        });
    }
});

// Кнопка "Понятно"
if (understandBtn) {
    understandBtn.addEventListener('click', () => {
        instructionModal.style.display = 'none';
        showNotification("Отлично! Теперь вы можете отправить файл");
    });
}

// Закрытие по клику вне окна
window.addEventListener('click', (e) => {
    if (e.target === instructionModal) {
        instructionModal.style.display = 'none';
    }
    if (e.target === faqModal) {
        faqModal.style.display = 'none';
    }
});

// Закрытие по клавише ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        instructionModal.style.display = 'none';
        faqModal.style.display = 'none';
    }
});

// Функция показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #2196F3, #21CBF3);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация анимации аватара
    if (avatar) {
        avatar.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Показываем приветственное сообщение
    setTimeout(() => {
        showNotification(`Добро пожаловать, ${userName}!`);
    }, 1000);
});
