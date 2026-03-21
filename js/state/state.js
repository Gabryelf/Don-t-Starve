window.GameState = {
    gameActive: true,
    player: { x: 400, y: 500, hp: 100, hunger: 100, wood: 0, targetX: null, targetY: null },
    enemies: [],
    trees: [],
    berries: [],
    day: 1,
    dayTimer: 0,
    spawnTimer: 0,
    
    init: function() {
        this.reset();
    },
    
    reset: function() {
        this.gameActive = true;
        this.player = { 
            x: 400, y: 500, hp: 100, hunger: 100, wood: 0, 
            targetX: null, targetY: null 
        };
        this.enemies = [{ x: 650, y: 200, hp: 45 }];
        this.trees = [];
        this.berries = [];
        this.day = 1;
        this.dayTimer = 0;
        this.spawnTimer = 0;
        
        for(let i = 0; i < 6; i++) {
            this.trees.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 350,
                wood: 12 + Math.floor(Math.random() * 8)
            });
        }
        
        for(let i = 0; i < 5; i++) {
            this.berries.push({
                x: 120 + Math.random() * 600,
                y: 120 + Math.random() * 350,
                count: 6 + Math.floor(Math.random() * 5)
            });
        }
    },
    
    setPlayerTarget: function(x, y) {
        if(this.gameActive) {
            this.player.targetX = Math.max(30, Math.min(770, x));
            this.player.targetY = Math.max(50, Math.min(540, y));
        }
    },
    
    movePlayer: function(delta) {
        if(!this.gameActive || this.player.targetX === null) return;
        
        let dx = this.player.targetX - this.player.x;
        let dy = this.player.targetY - this.player.y;
        let dist = Math.hypot(dx, dy);
        
        if(dist < 5) {
            this.player.targetX = null;
            this.player.targetY = null;
            return;
        }
        
        let move = CONFIG.PLAYER_SPEED * delta;
        let stepX = (dx / dist) * move;
        let stepY = (dy / dist) * move;
        
        if(Math.abs(stepX) > Math.abs(dx)) stepX = dx;
        if(Math.abs(stepY) > Math.abs(dy)) stepY = dy;
        
        this.player.x += stepX;
        this.player.y += stepY;
        
        this.player.x = Math.max(30, Math.min(770, this.player.x));
        this.player.y = Math.max(50, Math.min(540, this.player.y));
    },
    
    addWood: function(amount) {
        this.player.wood += amount;
    },
    
    addHunger: function(amount) {
        this.player.hunger = Math.min(100, this.player.hunger + amount);
    },
    
    damagePlayer: function(amount) {
        this.player.hp -= amount;
        if(this.player.hp <= 0) this.gameActive = false;
    },
    
    healPlayer: function(amount) {
        this.player.hp = Math.min(100, this.player.hp + amount);
    },
    
    nextDay: function() {
        this.day++;
        this.healPlayer(5);
        this.addHunger(8);
    },
    
    removeTree: function(index) {
        this.trees.splice(index, 1);
    },
    
    removeBerry: function(index) {
        this.berries.splice(index, 1);
    },
    
    removeEnemy: function(index) {
        this.enemies.splice(index, 1);
    },
    
    addEnemy: function(x, y, hp) {
        this.enemies.push({ x: x, y: y, hp: hp });
    },
    
    getState: function() {
        return {
            gameActive: this.gameActive,
            player: { ...this.player },
            enemies: [...this.enemies],
            trees: [...this.trees],
            berries: [...this.berries],
            day: this.day
        };
    }
};