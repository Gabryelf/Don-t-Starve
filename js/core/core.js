//--------------------------------------
// Основной игровой цикл
//--------------------------------------
class CoreGame {
    constructor(gameState, gameBalance, gameAI, effectsManager, soundManager, camera) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameAI = gameAI;
        this.effectsManager = effectsManager;
        this.soundManager = soundManager;
        this.camera = camera;
        this.lastTimestamp = 0;
    }
    
    start() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");
        setTimeout(() => this.soundManager.playMusic('ambient', 0.3), 1000);
    }
    
    update(delta) {
        if (!this.gameState.gameActive) return;
        
        this.gameState.movePlayer(delta, this.gameBalance.PLAYER_SPEED);
        
        // Голод
        this.gameState.player.hunger -= delta * this.gameBalance.HUNGER_DRAIN_RATE;
        if (this.gameState.player.hunger <= 0) {
            this.gameState.damagePlayer(delta * 5);
            this.gameState.player.hunger = 0;
        }
        
        // Дневной цикл
        this.gameState.dayTimer += delta;
        if (this.gameState.dayTimer >= this.gameBalance.DAY_DURATION) {
            this.gameState.dayTimer = 0;
            this.gameState.nextDay();
        }
        
        // Спавн врагов
        this.gameState.spawnTimer += delta;
        if (this.gameState.spawnTimer >= this.gameBalance.ENEMY_SPAWN_DELAY && 
            this.gameState.enemies.length < this.gameBalance.MAX_ENEMIES) {
            this.gameState.spawnTimer = 0;
            this.gameState.spawnEnemy();
        }
        
        this.gameAI.updateEnemies(delta, this.gameState.player.x, this.gameState.player.y);
        
        const attacker = this.gameAI.checkAttack(this.gameState.player.x, this.gameState.player.y);
        if (attacker) this.gameState.damagePlayer(delta * this.gameBalance.ENEMY_DAMAGE);
        
        if (this.camera) this.camera.update(this.gameState.player.x, this.gameState.player.y, delta);
        if (this.effectsManager) this.effectsManager.update(delta);
        
        if (this.gameState.player.hp <= 0) {
            this.gameState.gameActive = false;
            this.soundManager.play('gameover');
            this.soundManager.stopMusic();
        }
    }
    
    gather() {
        if (!this.gameState.gameActive) return false;
        
        const trees = this.gameState.getTreesInRange(this.gameState.player.x, this.gameState.player.y, this.gameBalance.GATHER_RADIUS);
        if (trees.length > 0) {
            const gain = Math.min(trees[0].wood, this.gameBalance.GATHER_WOOD_AMOUNT);
            trees[0].wood -= gain;
            this.gameState.addWood(gain);
            this.effectsManager?.addPickupEffect(trees[0].x, trees[0].y);
            if (trees[0].wood <= 0) this.gameState.removeTree(trees[0]);
            this.soundManager.play('gather');
            return true;
        }
        
        const berries = this.gameState.getBerriesInRange(this.gameState.player.x, this.gameState.player.y, this.gameBalance.GATHER_RADIUS);
        if (berries.length > 0) {
            const gain = Math.min(berries[0].count, this.gameBalance.GATHER_BERRY_AMOUNT);
            berries[0].count -= gain;
            this.gameState.addHunger(gain * this.gameBalance.BERRY_HUNGER_RESTORE);
            this.effectsManager?.addPickupEffect(berries[0].x, berries[0].y);
            if (berries[0].count <= 0) this.gameState.removeBerry(berries[0]);
            this.soundManager.play('gather');
            return true;
        }
        
        return false;
    }
    
    attack() {
        if (!this.gameState.gameActive) return false;
        
        const nearest = this.gameAI.findNearestEnemy(this.gameState.player.x, this.gameState.player.y, this.gameBalance.ATTACK_RADIUS);
        if (nearest) {
            this.gameAI.damageEnemy(nearest, this.gameBalance.PLAYER_DAMAGE);
            this.effectsManager?.addHitEffect(nearest.x, nearest.y);
            this.soundManager.play('hit');
            return true;
        }
        return false;
    }
    
    restart() {
        this.gameState.reset();
        this.gameAI.clearEnemies();
        this.camera?.reset(this.gameState.player.x, this.gameState.player.y);
        if (this.effectsManager) this.effectsManager.effects = [];
        this.soundManager.playMusic('ambient', 0.3);
        console.log("🔄 Game restarted!");
    }
    
    render(renderer) {
        if (!renderer) return;
        
        renderer.drawGround();
        
        for (const tree of this.gameState.world.trees) renderer.drawTree(tree.x, tree.y);
        for (const berry of this.gameState.world.berries) renderer.drawBerry(berry.x, berry.y, berry.count);
        for (const enemy of this.gameState.enemies) renderer.drawEnemy(enemy.x, enemy.y, enemy.hp, enemy.maxHp, enemy.type);
        
        renderer.drawPlayer(this.gameState.player.x, this.gameState.player.y, this.gameState.player.hp);
        
        if (this.effectsManager && renderer.camera) this.effectsManager.draw(renderer.ctx, renderer.camera);
        
        renderer.drawUI();
        
        if (!this.gameState.gameActive) renderer.drawGameOver();
    }
}