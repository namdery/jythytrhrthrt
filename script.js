const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Настройка данных пользователя
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('user-greeting').innerText = `Привет, ${user.first_name || 'Тракер'}`;
    if (user.photo_url) {
        document.getElementById('user-avatar').src = user.photo_url;
    } else {
        document.getElementById('user-avatar').style.display = 'none';
    }
}

// Модалки
function showModal(type) {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('instruction-text').classList.add('hidden');
    document.getElementById('faq-text').classList.add('hidden');
    
    if (type === 'instruction') {
        document.getElementById('instruction-text').classList.remove('hidden');
    } else {
        document.getElementById('faq-text').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Загрузка файла
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Имитация отправки данных
    const device = navigator.userAgent;
    const time = new Date().toLocaleString();
    
    tg.showConfirm(`Отправить файл ${file.name} на проверку?`, (confirmed) => {
        if (confirmed) {
            // В Telegram Mini App нельзя напрямую отправить файл через sendData.
            // Мы закрываем приложение и просим пользователя прикрепить файл в чат, 
            // либо используем API метод (нужен полноценный бэкенд).
            
            tg.showAlert("Для завершения отправьте этот файл боту в чат. Мы подготовили систему к приему.");
            tg.close();
        }
    });
}
