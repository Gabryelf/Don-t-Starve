// Система сохранения
class SaveSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
    }

    showMsg(msg) {
        if (this.coreGame.showNotification) this.coreGame.showNotification(msg);
        else console.log(msg);
    }
    save() {
        const data = {
            wood: this.gameState.player.wood,
            day: this.gameState.day,
            hp: this.gameState.player.hp,
            hunger: this.gameState.player.hunger,
            level: this.gameState.experience?.level || 1,
            x: this.gameState.player.x,      // ← ДОБАВИТЬ
            y: this.gameState.player.y,      // ← ДОБАВИТЬ
            dayTimer: this.gameState.dayTimer // ← ДОБАВИТЬ
        };
        localStorage.setItem('gameSave', JSON.stringify(data));
        this.showMsg("💾 Game Saved!");
    }
    
    load() {
        const raw = localStorage.getItem('gameSave');
        if (!raw) { 
            this.showMsg("No save found!"); 
            return false; 
        }
        const data = JSON.parse(raw);
        this.gameState.player.wood = data.wood;
        this.gameState.day = data.day;
        this.gameState.player.hp = data.hp;
        this.gameState.player.hunger = data.hunger;
        this.gameState.player.x = data.x || 1200;      // ← ДОБАВИТЬ
        this.gameState.player.y = data.y || 900;       // ← ДОБАВИТЬ
        this.gameState.dayTimer = data.dayTimer || 0;  // ← ДОБАВИТЬ
        
        if (this.gameState.experience) {
            this.gameState.experience.level = data.level;
        }
        
        // Сброс целевой точки игрока
        this.gameState.player.targetX = null;
        this.gameState.player.targetY = null;
        
        this.showMsg("📀 Game Loaded!");
        return true;
    }
}
