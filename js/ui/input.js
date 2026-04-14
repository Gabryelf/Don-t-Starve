//--------------------------------------
// Обработка ввода
//--------------------------------------
class InputHandler {
    constructor(canvas, camera, coreGame) {
        this.canvas = canvas;
        this.camera = camera;
        this.coreGame = coreGame;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");
    }
    
    setupEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        window.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Проверка кнопок UI
        if (x > 20 && x < 110 && y > 545 && y < 580) {
            this.coreGame.gather();
        } else if (x > 120 && x < 210 && y > 545 && y < 580) {
            this.coreGame.attack();
        } else if (x > 690 && x < 780 && y > 545 && y < 580) {
            this.coreGame.restart();
        } else {
            window.gameState.setPlayerTarget(x, y, this.camera.x, this.camera.y);
        }
    }
    
    handleContextMenu(e) {
        e.preventDefault();
        this.coreGame.attack();
        return false;
    }
    
    handleKeydown(e) {
        if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            this.coreGame.gather();
        }
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.coreGame.restart();
        }
    }
}