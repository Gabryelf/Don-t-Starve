//--------------------------------------
// Баланс игры
//--------------------------------------
class GameBalance {
    constructor() {
        this.PLAYER_SPEED = 180;
        this.PLAYER_DAMAGE = 14;
        this.PLAYER_MAX_HP = 100;
        this.PLAYER_MAX_HUNGER = 100;
        
        this.ENEMY_SPEED = 70;
        this.ENEMY_DAMAGE = 8;
        this.ENEMY_BASE_HP = 45;
        
        this.GATHER_RADIUS = 55;
        this.ATTACK_RADIUS = 60;
        this.GATHER_WOOD_AMOUNT = 6;
        this.GATHER_BERRY_AMOUNT = 4;
        this.BERRY_HUNGER_RESTORE = 6;
        
        this.HUNGER_DRAIN_RATE = 0.18;
        this.DAY_DURATION = 30;
        this.ENEMY_SPAWN_DELAY = 12;
        this.MAX_ENEMIES = 12;
    }
}

window.gameBalance = new GameBalance();
console.log("⚖️ Balance loaded");