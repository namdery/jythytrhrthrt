document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
    
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
    const sliderTrack = document.querySelector('.slider-track');
    const avatar = document.getElementById('animatedAvatar');
    const successMessage = document.getElementById('successMessage');
    const fileUpload = document.getElementById('fileUpload');
    
    // Переменные для файла
    let selectedFile = null;
    let isCaptchaCompleted = false;
    
    // Анимация аватара
    function animateAvatar() {
        requestAnimationFrame(animateAvatar);
    }
    animateAvatar();
    
    // Обработчик кнопки "Отправить файл"
    sendFileBtn.addEventListener('click', function() {
        if (!isCaptchaCompleted) {
            // Показываем капчу
            captchaContainer.style.display = 'block';
            sendFileBtn.style.display = 'none';
            setupCaptcha();
        } else if (selectedFile) {
            // Если капча пройдена и файл выбран - отправляем
            sendFileToAdmin();
        } else {
            // Если капча пройдена, но файл не выбран - показываем загрузку
            triggerFileInput();
        }
    });
    
    // Настройка капчи
    function setupCaptcha() {
        let isDragging = false;
        let startX = 0;
        let thumbX = 0;
        const maxX = 266; // Максимальное значение для слайдера
        
        sliderThumb.addEventListener('mousedown', startDrag);
        sliderThumb.addEventListener('touchstart', startDrag);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            thumbX = parseInt(getComputedStyle(sliderThumb).left) || 4;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            
            sliderThumb.style.cursor = 'grabbing';
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const deltaX = clientX - startX;
            let newX = Math.max(4, Math.min(thumbX + deltaX, maxX));
            
            // Обновляем позицию слайдера
            sliderThumb.style.left = newX + 'px';
            
            // Обновляем заполнение трека
            const fillPercent = (newX / maxX) * 100;
            sliderTrack.style.setProperty('--fill-width', fillPercent + '%');
            
            // Если дотянули до конца
            if (newX >= maxX - 10) {
                completeCaptcha();
                stopDrag();
            }
        }
        
        function stopDrag() {
            isDragging = false;
            sliderThumb.style.cursor = 'grab';
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
            
            // Если не дошли до конца - возвращаем в начало
            if (parseInt(sliderThumb.style.left) < maxX - 20) {
                sliderThumb.style.left = '4px';
                sliderTrack.style.setProperty('--fill-width', '0%');
            }
        }
        
        function completeCaptcha() {
            isCaptchaCompleted = true;
            
            // Анимация успеха
            sliderThumb.style.left = maxX + 'px';
            sliderTrack.style.setProperty('--fill-width', '100%');
            sliderThumb.style.background = '#4CAF50';
            
            // Показываем сообщение об успехе
            captchaContainer.innerHTML = `
                <div style="color: #4CAF50; text-align: center; padding: 15px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">✓</div>
                    <div style="font-weight: 600;">Проверка пройдена!</div>
                    <div style="font-size: 14px; margin-top: 5px; color: #666;">
                        Теперь вы можете отправить файл
                    </div>
                </div>
            `;
            
            // Показываем кнопку загрузки файла
            setTimeout(() => {
                sendFileBtn.textContent = '📎 Выберите файл для отправки';
                sendFileBtn.style.display = 'block';
                sendFileBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
            }, 1000);
        }
    }
    
    // Обработчик загрузки файла
    function triggerFileInput() {
        // В реальном приложении здесь был бы input type="file"
        // Для демо просто создаем фиктивный файл
        simulateFileSelection();
    }
    
    function simulateFileSelection() {
        // Симуляция выбора файла
        selectedFile = {
            name: 'export_data.json',
            size: '245 KB',
            type: 'application/json'
        };
        
        // Показываем информацию о файле
        sendFileBtn.innerHTML = `
            <div style="text-align: left; width: 100%;">
                <div style="font-weight: 600; font-size: 16px;">✓ Файл выбран</div>
                <div style="font-size: 14px; color: #666; margin-top: 4px;">
                    ${selectedFile.name} (${selectedFile.size})
                </div>
            </div>
        `;
        sendFileBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        
        // Добавляем кнопку отправки
        setTimeout(() => {
            const sendBtn = document.createElement('button');
            sendBtn.className = 'btn-send';
            sendBtn.innerHTML = '🚀 Отправить файл администратору';
            sendBtn.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
            sendBtn.style.marginTop = '10px';
            sendBtn.onclick = sendFileToAdmin;
            
            sendFileBtn.parentNode.insertBefore(sendBtn, sendFileBtn.nextSibling);
        }, 500);
    }
    
    // Отправка файла администратору
    async function sendFileToAdmin() {
        if (!selectedFile) {
            alert('Пожалуйста, сначала выберите файл');
            return;
        }
        
        try {
            // Показываем загрузку
            sendFileBtn.disabled = true;
            sendFileBtn.innerHTML = '⏳ Отправка...';
            
            // В реальном приложении здесь будет отправка файла через Telegram API
            // Для демо симулируем отправку
            
            // Отправляем данные в Telegram бота
            const dataToSend = {
                action: 'send_file',
                user_id: user?.id,
                username: user?.username,
                first_name: user?.first_name,
                file_name: selectedFile.name,
                file_size: selectedFile.size,
                timestamp: new Date().toISOString()
            };
            
            // Отправляем данные в бот
            tg.sendData(JSON.stringify(dataToSend));
            
            // Показываем успешное сообщение
            showSuccessMessage();
            
            // Симулируем задержку отправки
            setTimeout(() => {
                // Здесь в реальном приложении будет обработка ответа от бота
                console.log('Файл отправлен админу:', dataToSend);
                
                // Можно также показать уведомление в Telegram
                tg.showAlert('✅ Файл успешно отправлен администратору!');
                
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            tg.showAlert('❌ Ошибка при отправке файла. Попробуйте снова.');
        }
    }
    
    function showSuccessMessage() {
        // Показываем сообщение об успешной отправке
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-text">Файл отправлен!</div>
            <div class="success-subtext">
                Администратор получил ваш файл.<br>
                Проверка займет 3-5 минут.
            </div>
        `;
        
        // Прячем кнопки
        sendFileBtn.style.display = 'none';
        captchaContainer.style.display = 'none';
        
        // Прокручиваем к сообщению
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
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
    
    // Закрытие по клику на кнопки в модалках
    document.querySelectorAll('.btn-understand, .btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            instructionModal.style.display = 'none';
            faqModal.style.display = 'none';
        });
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
