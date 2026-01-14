* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: white;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    background: linear-gradient(135deg, #001a00 0%, #000000 50%, #000033 100%);
    cursor: default;
}

/* Фоновые вращающиеся фото */
.floating-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
}

.floating-photo {
    position: absolute;
    border-radius: 15px;
    opacity: 0.65;
    transform-origin: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 
        0 0 40px rgba(0, 150, 255, 0.7),
        0 0 80px rgba(0, 100, 255, 0.4),
        inset 0 0 60px rgba(255, 255, 255, 0.1);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

/* Контейнер с контентом */
.content {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    backdrop-filter: blur(3px);
}

/* Экран проверки */
.verification-screen {
    background: rgba(0, 30, 0, 0.85);
    border-radius: 25px;
    padding: 40px 30px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(0, 255, 0, 0.1),
        inset 0 0 30px rgba(0, 255, 0, 0.05);
    border: 1px solid rgba(0, 255, 0, 0.2);
}

.verification-icon {
    font-size: 80px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.verification-text {
    font-size: 24px;
    margin-bottom: 20px;
    color: #00ff00;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.verification-instruction {
    background: rgba(0, 50, 0, 0.5);
    border-radius: 15px;
    padding: 15px;
    margin-bottom: 25px;
    border-left: 4px solid #00ff00;
}

.instruction-text {
    font-size: 18px;
    line-height: 1.5;
    color: #90ff90;
    font-weight: 500;
}

.verify-btn {
    background: linear-gradient(45deg, #009900, #00cc00);
    color: white;
    border: none;
    padding: 20px 50px;
    font-size: 22px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    margin: 10px 0;
    width: 100%;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
    position: relative;
    overflow: hidden;
}

.verify-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 255, 0, 0.5);
    background: linear-gradient(45deg, #00cc00, #00ff00);
}

.verify-btn:active {
    transform: translateY(0);
}

.verification-hint {
    margin-top: 20px;
    font-size: 14px;
    color: #88cc88;
    opacity: 0.8;
    font-style: italic;
}

/* Основной экран */
.main-screen {
    background: rgba(0, 20, 0, 0.85);
    border-radius: 25px;
    padding: 40px 30px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.5),
        inset 0 0 30px rgba(0, 100, 255, 0.1);
    border: 1px solid rgba(0, 100, 255, 0.2);
    display: none;
}

.welcome-title {
    font-size: 32px;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #00ff00, #00ccff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.welcome-subtitle {
    font-size: 18px;
    color: #90ff90;
    margin-bottom: 30px;
    opacity: 0.9;
    line-height: 1.5;
}

.send-file-btn {
    background: linear-gradient(45deg, #0066cc, #0099ff);
    color: white;
    border: none;
    padding: 20px 40px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    margin: 20px 0;
    width: 100%;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 100, 255, 0.3);
    position: relative;
    overflow: hidden;
}

.send-file-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 100, 255, 0.5);
    background: linear-gradient(45deg, #0077ee, #00aaff);
}

.send-file-btn:active {
    transform: translateY(0);
}

.file-input {
    display: none;
}

.status-message {
    background: rgba(0, 50, 100, 0.3);
    border-radius: 10px;
    padding: 15px;
    margin-top: 20px;
    font-size: 16px;
    color: #90ee90;
    display: none;
    border-left: 4px solid #0099ff;
}

.status-message.success {
    background: rgba(0, 100, 0, 0.3);
    border-left-color: #00ff00;
}

.status-message.error {
    background: rgba(100, 0, 0, 0.3);
    border-left-color: #ff0000;
}

.loading-spinner {
    display: none;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 150, 255, 0.3);
    border-top: 4px solid #00aaff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.footer {
    margin-top: 30px;
    font-size: 14px;
    color: #88cc88;
    opacity: 0.7;
    text-align: center;
    line-height: 1.5;
}

/* Анимации для фоновых фото */
@keyframes floatAnimation1 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(80px, 60px) rotate(180deg) scale(1.05);
    }
    100% {
        transform: translate(0, 0) rotate(360deg) scale(1);
    }
}

@keyframes floatAnimation2 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(-60px, 80px) rotate(-180deg) scale(1.05);
    }
    100% {
        transform: translate(0, 0) rotate(-360deg) scale(1);
    }
}

@keyframes floatAnimation3 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(70px, -50px) rotate(180deg) scale(1.1);
    }
    100% {
        transform: translate(0, 0) rotate(360deg) scale(1);
    }
}

@keyframes floatAnimation4 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(-80px, -60px) rotate(180deg) scale(1.05);
    }
    100% {
        transform: translate(0, 0) rotate(360deg) scale(1);
    }
}

@keyframes floatAnimation5 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(60px, 70px) rotate(-180deg) scale(1.05);
    }
    100% {
        transform: translate(0, 0) rotate(-360deg) scale(1);
    }
}

@keyframes floatAnimation6 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(-70px, 60px) rotate(180deg) scale(1.1);
    }
    100% {
        transform: translate(0, 0) rotate(360deg) scale(1);
    }
}

/* Адаптивность */
@media (max-width: 480px) {
    .verification-screen,
    .main-screen {
        padding: 30px 20px;
        width: 95%;
    }
    
    .verification-icon {
        font-size: 60px;
    }
    
    .verification-text {
        font-size: 20px;
    }
    
    .instruction-text {
        font-size: 16px;
    }
    
    .verify-btn,
    .send-file-btn {
        padding: 18px 30px;
        font-size: 18px;
    }
    
    .welcome-title {
        font-size: 26px;
    }
    
    .welcome-subtitle {
        font-size: 16px;
    }
}
