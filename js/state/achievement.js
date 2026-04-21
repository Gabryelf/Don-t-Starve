// Система достижений
class AchievementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.achievements = {
            wood: { name: '🌲 Wood Master', required: 50, current: 0, done: false },
            kills: { name: '⚔️ Slayer', required: 10, current: 0, done: false }
        };
        this.notification = null;
        this.notifTimer = 0;
    }
     addWood(amount) {
        if (!this.achievements.wood.done) {
            this.achievements.wood.current += amount;
            if (this.achievements.wood.current >= 50) {
                this.unlock('wood');
            }
        }
    }
    
    addKill() {
        if (!this.achievements.kills.done) {
            this.achievements.kills.current++;
            if (this.achievements.kills.current >= 10) {
                this.unlock('kills');
            }
        }
    }
      unlock(id) {
        const ach = this.achievements[id];
        ach.done = true;
        this.notification = `🏆 ${ach.name}! +20 HP`;
        this.notifTimer = 3;
        this.gameState.healPlayer(20);
    }
    
    update(delta) {
        if (this.notifTimer > 0) {
            this.notifTimer -= delta;
            if (this.notifTimer <= 0) this.notification = null;
        }
    }
    
    draw(ctx) {
        if (this.notification) {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(200, 100, 400, 40);
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 14px monospace";
            ctx.fillText(this.notification, 220, 125);
        }
    }

    drawPanel(ctx) {
        // Панель достижений (нажмите A для открытия)
        if (!this.panelOpen) return;
        
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(200, 100, 400, 250);
        ctx.fillStyle = "#ffde9c";
        ctx.font = "bold 18px monospace";
        ctx.fillText("ACHIEVEMENTS", 320, 140);
        
        ctx.font = "14px monospace";
        let y = 180;
        for (let [id, ach] of Object.entries(this.achievements)) {
            const status = ach.done ? "✓" : "○";
            const color = ach.done ? "#4caf50" : "#888";
            ctx.fillStyle = color;
            ctx.fillText(`${status} ${ach.name} (${ach.current}/${ach.required})`, 230, y);
            y += 30;
        }
        
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.fillText("Press A to close", 340, 330);
    }
    
    togglePanel() {
        this.panelOpen = !this.panelOpen;
    }
}
