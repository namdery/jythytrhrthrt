// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

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
const closeBtns = document.querySelectorAll('.close-btn');
const closeFaqBtn = document.querySelector('.close-faq-btn');

// Анимация аватара при наведении
avatar.addEventListener('mouseenter', () => {
    avatar.style.animation = 'float 1s ease-in-out infinite';
});

avatar.addEventListener('mouseleave', () => {
    avatar.style.animation = 'float 3s ease-in-out infinite';
});

// Отправка файла
sendFileBtn.addEventListener('click', () => {
    // В реальном приложении здесь был бы код для выбора файла
    // Для демонстрации просто показываем сообщение
    
    // Создаем временный input для выбора файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,text/plain';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Проверяем формат файла
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                // В реальном приложении здесь будет отправка файла через Telegram Bot API
                // Для демонстрации просто показываем сообщение
                alert(`Файл "${file.name}" будет отправлен на проверку.`);
                
                // Здесь должен быть код отправки файла боту
                // Пример:
                // tg.sendData(JSON.stringify({
                //     action: 'send_file',
                //     file: file
                // }));
            } else {
                alert('Пожалуйста, выберите только TXT файлы.');
            }
        }
    };
    
    input.click();
});

// Открытие инструкции
instructionBtn.addEventListener('click', () => {
    instructionModal.style.display = 'flex';
});

// Открытие FAQ
faqBtn.addEventListener('click', () => {
    faqModal.style.display = 'flex';
});

// Закрытие модальных окон
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        instructionModal.style.display = 'none';
        faqModal.style.display = 'none';
    });
});

closeFaqBtn.addEventListener('click', () => {
    faqModal.style.display = 'none';
});

// Закрытие по клику вне окна
window.addEventListener('click', (e) => {
    if (e.target === instructionModal) {
        instructionModal.style.display = 'none';
    }
    if (e.target === faqModal) {
        faqModal.style.display = 'none';
    }
});

// Отправка данных боту
function sendToBot(data) {
    tg.sendData(JSON.stringify(data));
}
