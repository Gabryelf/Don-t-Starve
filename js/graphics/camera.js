// Камера
window.GameCamera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    width: 800,
    height: 600,
    
    init: function() {
        this.reset();
    },
    reset: function() {
        if(GameState && GameState.player) {
            this.x = GameState.player.x - this.width / 2;
            this.y = GameState.player.y - this.height / 2;
            this.targetX = this.x;
            this.targetY = this.y;
        }
    },
    
    update: function(playerX, playerY, delta) {
        this.targetX = playerX - this.width / 2;
        this.targetY = playerY - this.height / 2;
        
        this.targetX = Math.max(0, Math.min(GameConfig.WORLD_WIDTH - this.width, this.targetX));
        this.targetY = Math.max(0, Math.min(GameConfig.WORLD_HEIGHT - this.height, this.targetY));
        
        this.x += (this.targetX - this.x) * GameConfig.CAMERA_SMOOTH;
        this.y += (this.targetY - this.y) * GameConfig.CAMERA_SMOOTH;
    },
    worldToScreen: function(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
};

// js/graphics/camera.js
class GameCamera {
    constructor() {
        // Текущая позиция камеры
        this.x = 0;
        this.y = 0;
        // Целевая позиция (куда камера стремится)
        this.targetX = 0;
        this.targetY = 0;
        // Размер экрана
        this.width = 800;
        this.height = 600;
    }
    // Добавьте в класс GameCamera
reset(playerX, playerY) {
    // Центрируем камеру на игроке
    this.x = playerX - this.width / 2;
    this.y = playerY - this.height / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.clamp();
}
    // Добавьте в класс GameCamera
clamp() {
    // Не даем камере выйти за границы мира
    this.targetX = Math.max(0, Math.min(window.gameConfig.WORLD_WIDTH - this.width, this.targetX));
    this.targetY = Math.max(0, Math.min(window.gameConfig.WORLD_HEIGHT - this.height, this.targetY));
}
    // Добавьте в класс GameCamera
update(playerX, playerY, delta) {
    // Куда должна смотреть камера
    this.targetX = playerX - this.width / 2;
    this.targetY = playerY - this.height / 2;
    
    // Ограничиваем границами
    this.clamp();
    
    // Плавно перемещаем камеру (0.1 - скорость сглаживания)
    this.x += (this.targetX - this.x) * window.gameConfig.CAMERA_SMOOTH;
    this.y += (this.targetY - this.y) * window.gameConfig.CAMERA_SMOOTH;
}
    // Добавьте в класс GameCamera
worldToScreen(worldX, worldY) {
    return {
        x: worldX - this.x,
        y: worldY - this.y
        };
    }
}
