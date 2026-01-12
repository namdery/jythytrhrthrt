document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    // Получаем данные пользователя
    const user = tg.initDataUnsafe.user;
    const userName = user ? user.first_name : 'Пользователь';
    document.getElementById('userName').textContent = userName;
    
    // Элементы
    const sendFileBtn = document.getElementById('sendFileBtn');
    const instructionBtn = document.getElementById('instructionBtn');
    const faqBtn = document.getElementById('faqBtn');
    const instructionModal = document.getElementById('instructionModal');
    const faqModal = document.getElementById('faqModal');
    const closeInstruction = document.getElementById('closeInstruction');
    const closeFaq = document.getElementById('closeFaq');
    const captchaContainer = document.getElementById('captchaContainer');
    const sliderThumb = document.getElementById('sliderThumb');
    const avatar = document.getElementById('animatedAvatar');
    
    // Анимация аватара
    let animationAngle = 0;
    function animateAvatar() {
        animationAngle += 0.5;
        avatar.style.transform = `translateY(-10px) rotate(${Math.sin(animationAngle * Math.PI / 180) * 5}deg)`;
        requestAnimationFrame(animateAvatar);
    }
    animateAvatar();
    
    // Обработчик кнопки отправки файла
    sendFileBtn.addEventListener('click', function() {
        // Показываем капчу
        captchaContainer.style.display = 'block';
        sendFileBtn.style.display = 'none';
        
        // Настройка слайдера
        let isDragging = false;
        let startX = 0;
        let thumbX = 0;
        
        sliderThumb.addEventListener('mousedown', startDrag);
        sliderThumb.addEventListener('touchstart', startDrag);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            thumbX = parseInt(getComputedStyle(sliderThumb).left);
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const deltaX = clientX - startX;
            const newX = Math.max(5, Math.min(thumbX + deltaX, 355));
            
            sliderThumb.style.left = newX + 'px';
            
            // Если дотянули до конца
            if (newX >= 355) {
                stopDrag();
                captchaContainer.innerHTML = '<div style="color: #4CAF50; font-size: 18px; padding: 20px;">✅ Проверка пройдена!</div>';
                
                // Запрашиваем файл у пользователя
                setTimeout(() => {
                    tg.showPopup({
                        title: 'Отправка файла',
                        message: 'Файл будет отправлен администратору для проверки.',
                        buttons: [
                            {type: 'default', text: 'Выбрать файл', id: 'select_file'},
                            {type: 'cancel', text: 'Отмена'}
                        ]
                    }, function(buttonId) {
                        if (buttonId === 'select_file') {
                            // В реальном приложении здесь нужно использовать Telegram Cloud Storage
                            // или другой метод загрузки файлов
                            tg.sendData(JSON.stringify({
                                action: 'file_ready',
                                user_id: user.id,
                                username: user.username
                            }));
                        }
                    });
                }, 1000);
            }
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    });
    
    // Открытие модальных окон
    instructionBtn.addEventListener('click', () => {
        instructionModal.style.display = 'flex';
    });
    
    faqBtn.addEventListener('click', () => {
        faqModal.style.display = 'flex';
    });
    
    // Закрытие модальных окон
    closeInstruction.addEventListener('click', () => {
        instructionModal.style.display = 'none';
    });
    
    closeFaq.addEventListener('click', () => {
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
});
