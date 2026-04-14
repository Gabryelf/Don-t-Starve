//--------------------------------------
// Рендерер игры
//--------------------------------------
class GameRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }
    
    worldToScreen(worldX, worldY) {
        return this.camera.worldToScreen(worldX, worldY);
    }
    
    drawGround() {
        const img = window.assetLoader.getImage('ground');
        if (img && img.complete) {
            this.ctx.drawImage(img, 0, 0, 800, 600);
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, 600);
            gradient.addColorStop(0, '#2d5a2c');
            gradient.addColorStop(1, '#1a3a1a');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, 800, 600);
            
            this.ctx.strokeStyle = '#3a6a3a';
            this.ctx.lineWidth = 0.5;
            for (let i = 0; i < 800; i += 50) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, 600);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(800, i);
                this.ctx.stroke();
            }
        }
    }
    
    drawPlayer(x, y, hp) {
        const screen = this.worldToScreen(x, y);
        if (!this.isVisible(screen)) return;
        
        const img = window.assetLoader.getImage('player');
        if (img && img.complete) {
            this.ctx.drawImage(img, screen.x - 24, screen.y - 24, 48, 48);
        } else {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, 18, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(screen.x - 6, screen.y - 5, 3, 0, Math.PI * 2);
            this.ctx.arc(screen.x + 6, screen.y - 5, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawHealthBar(screen.x, screen.y - 38, hp, 100, 56);
    }
    
    drawEnemy(x, y, hp, maxHp, type) {
        const screen = this.worldToScreen(x, y);
        if (!this.isVisible(screen)) return;
        
        const img = window.assetLoader.getImage('enemy');
        if (img && img.complete) {
            this.ctx.drawImage(img, screen.x - 24, screen.y - 24, 48, 48);
        } else {
            const colors = { guard: "#883333", patrol: "#336688", wander: "#668833" };
            this.ctx.fillStyle = colors[type] || "#668833";
            this.ctx.beginPath();
            this.ctx.ellipse(screen.x, screen.y, 16, 20, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(screen.x - 8, screen.y - 5, 4, 4);
            this.ctx.fillRect(screen.x + 4, screen.y - 5, 4, 4);
        }
        
        this.drawHealthBar(screen.x - 28, screen.y - 38, hp, maxHp, 56);
        this.ctx.fillStyle = "white";
        this.ctx.font = "8px monospace";
        this.ctx.fillText(type, screen.x - 12, screen.y - 42);
    }
    
    drawTree(x, y) {
        const screen = this.worldToScreen(x, y);
        if (!this.isVisible(screen, 50)) return;
        
        const img = window.assetLoader.getImage('tree');
        if (img && img.complete) {
            this.ctx.drawImage(img, screen.x - 32, screen.y - 48, 64, 64);
        } else {
            this.ctx.fillStyle = "#5d3a1a";
            this.ctx.fillRect(screen.x - 8, screen.y - 30, 16, 50);
            this.ctx.fillStyle = "#2d5a2c";
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y - 25, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawBerry(x, y, count) {
        const screen = this.worldToScreen(x, y);
        if (!this.isVisible(screen, 30)) return;
        
        const img = window.assetLoader.getImage('berry');
        if (img && img.complete) {
            this.ctx.drawImage(img, screen.x - 16, screen.y - 16, 32, 32);
        } else {
            this.ctx.fillStyle = "#cc3366";
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(screen.x - 3, screen.y - 12, 6, 4);
        }
        
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px monospace";
        this.ctx.shadowBlur = 2;
        this.ctx.fillText("🍓" + count, screen.x - 10, screen.y - 20);
        this.ctx.shadowBlur = 0;
    }
    
    drawUI() {
        this.drawUIPanel();
        this.drawUIButtons();
    }
    
    drawUIPanel() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, 800, 55);
        
        // Здоровье
        const heartImg = window.assetLoader.getImage('heart');
        if (heartImg && heartImg.complete) {
            this.ctx.drawImage(heartImg, 10, 8, 28, 28);
        } else {
            this.ctx.fillStyle = "#ff3366";
            this.ctx.fillRect(10, 8, 28, 28);
        }
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 18px monospace";
        this.ctx.fillText(Math.floor(window.gameState.player.hp), 50, 35);
        
        // Голод
        const meatImg = window.assetLoader.getImage('meat');
        if (meatImg && meatImg.complete) {
            this.ctx.drawImage(meatImg, 100, 8, 28, 28);
        } else {
            this.ctx.fillStyle = "#ffaa33";
            this.ctx.fillRect(100, 8, 28, 28);
        }
        this.ctx.fillText(Math.floor(window.gameState.player.hunger), 140, 35);
        
        // Древесина
        this.ctx.fillStyle = "#ffde9c";
        this.ctx.fillText("🪵", 210, 35);
        this.ctx.fillText(window.gameState.player.wood, 235, 35);
        
        // День
        this.ctx.fillStyle = "#ffaa66";
        this.ctx.fillText("Day " + window.gameState.day, 700, 35);
        
        this.drawHealthBars();
    }
    
    drawHealthBars() {
        const x = 10, y = 65, gap = 25;
        this.drawBar(x, y, window.gameState.player.hp, 100, "red", "#4caf50", "HP");
        this.drawBar(x, y + gap, window.gameState.player.hunger, 100, "red", "#4caf50", "Hunger");
    }
    
    drawBar(x, y, current, max, bgColor, fillColor, label) {
        const w = 200, h = 20;
        const percent = (current / max) * w;
        
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(x, y, percent, h);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, w, h);
        
        this.ctx.font = "14px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`${label}: ${Math.floor(current)}`, x + 210, y + 15);
    }
    
    drawUIButtons() {
        const buttons = [
            { x: 20, y: 545, text: "GATHER" },
            { x: 120, y: 545, text: "ATTACK" },
            { x: 690, y: 545, text: "RESTART" }
        ];
        
        const buttonImg = window.assetLoader.getImage('button');
        buttons.forEach(btn => {
            if (buttonImg && buttonImg.complete) {
                this.ctx.drawImage(buttonImg, btn.x, btn.y, 90, 35);
            } else {
                this.ctx.fillStyle = "#4a3a2a";
                this.ctx.fillRect(btn.x, btn.y, 90, 35);
            }
            
            this.ctx.fillStyle = "#ffde9c";
            this.ctx.font = "bold 14px monospace";
            this.ctx.fillText(btn.text, btn.x + 15, btn.y + 23);
        });
    }
    
    drawHealthBar(x, y, current, max, width) {
        this.ctx.fillStyle = "#aa3333";
        this.ctx.fillRect(x, y, width, 6);
        this.ctx.fillStyle = "#4caf50";
        this.ctx.fillRect(x, y, width * (current / max), 6);
    }
    
    isVisible(screen, margin = 40) {
        return !(screen.x + margin < 0 || screen.x - margin > 800 || 
                 screen.y + margin < 0 || screen.y - margin > 600);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, 0, 800, 600);
        this.ctx.fillStyle = "#ff6666";
        this.ctx.font = "bold 32px monospace";
        this.ctx.fillText("GAME OVER", 310, 300);
        this.ctx.font = "14px monospace";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("Press RESTART or R", 340, 360);
    }
}