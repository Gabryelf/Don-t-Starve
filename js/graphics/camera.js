//--------------------------------------
// Камера
//--------------------------------------
class GameCamera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.width = 800;
        this.height = 600;
    }
    
    reset(playerX, playerY) {
        this.x = playerX - this.width / 2;
        this.y = playerY - this.height / 2;
        this.targetX = this.x;
        this.targetY = this.y;
        this.clamp();
    }
    
    update(playerX, playerY, delta) {
        this.targetX = playerX - this.width / 2;
        this.targetY = playerY - this.height / 2;
        this.clamp();
        
        this.x += (this.targetX - this.x) * window.gameConfig.CAMERA_SMOOTH;
        this.y += (this.targetY - this.y) * window.gameConfig.CAMERA_SMOOTH;
    }
    
    clamp() {
        this.targetX = Math.max(0, Math.min(window.gameConfig.WORLD_WIDTH - this.width, this.targetX));
        this.targetY = Math.max(0, Math.min(window.gameConfig.WORLD_HEIGHT - this.height, this.targetY));
    }
    
    worldToScreen(worldX, worldY) {
        return { x: worldX - this.x, y: worldY - this.y };
    }
}