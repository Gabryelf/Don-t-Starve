//--------------------------------------
// Главный файл инициализации
//--------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Starting Don't Starve Clone...");
    
    // Инициализация камеры
    const camera = new GameCamera();
    
    // Инициализация игрового состояния
    window.gameState.init();
    camera.reset(window.gameState.player.x, window.gameState.player.y);
    
    // Инициализация AI
    const gameAI = new GameAI(window.gameState, window.gameBalance, window.gameConfig);
    
    // Инициализация звуков
    window.soundManager.loadAll(window.gameConfig.sounds, () => {
        console.log("✅ All sounds loaded!");
    });
    
    // Инициализация изображений
    window.assetLoader.loadAll(window.gameConfig.images, () => {
        console.log("✅ All images loaded!");
    });
    
    // Инициализация рендерера
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(ctx, camera);
    
    // Инициализация основного игрового цикла
    const coreGame = new CoreGame(
        window.gameState, 
        window.gameBalance, 
        gameAI, 
        window.effectsManager, 
        window.soundManager, 
        camera
    );
    
    // Инициализация обработчика ввода
    const inputHandler = new InputHandler(canvas, camera, coreGame);
    
    // Запуск игрового цикла
    coreGame.start();
    
    // Анимационный цикл
    let lastTimestamp = 0;
    
    function animate(timestamp) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
            requestAnimationFrame(animate);
            return;
        }
        
        let delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
        if (delta > 0.01) {
            coreGame.update(delta);
        }
        lastTimestamp = timestamp;
        
        coreGame.render(renderer);
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    console.log("✅ Game initialized successfully!");
});