window.Core = {
    state: null,
    
    init: function() {
        this.state = GameState;
        this.state.init();
        QA.log("Core initialized - Click to move, Right-click/E to attack/gather");
    },
    
    setPlayerTarget: function(x, y) {
        this.state.setPlayerTarget(x, y);
    },
    
    gather: function() {
        if(!this.state.gameActive) return;
        
        let player = this.state.player;
        let nearestTree = AI.findNearestResource(this.state, 'tree', CONFIG.GATHER_RADIUS);
        let nearestBerry = AI.findNearestResource(this.state, 'berry', CONFIG.GATHER_RADIUS);
        
        let treeDist = nearestTree ? Math.hypot(player.x - nearestTree.x, player.y - nearestTree.y) : Infinity;
        let berryDist = nearestBerry ? Math.hypot(player.x - nearestBerry.x, player.y - nearestBerry.y) : Infinity;
        
        if(nearestTree && treeDist <= berryDist) {
            for(let i = 0; i < this.state.trees.length; i++) {
                if(this.state.trees[i] === nearestTree) {
                    let gain = Math.min(nearestTree.wood, 6);
                    nearestTree.wood -= gain;
                    this.state.addWood(gain);
                    Sound.play('gather');
                    QA.log(`Gathered ${gain} wood`);
                    if(nearestTree.wood <= 0) this.state.removeTree(i);
                    return;
                }
            }
        } else if(nearestBerry && berryDist < treeDist) {
            for(let i = 0; i < this.state.berries.length; i++) {
                if(this.state.berries[i] === nearestBerry) {
                    let gain = Math.min(nearestBerry.count, 4);
                    nearestBerry.count -= gain;
                    this.state.addHunger(gain * 6);
                    Sound.play('gather');
                    QA.log(`Ate ${gain} berries`);
                    if(nearestBerry.count <= 0) this.state.removeBerry(i);
                    return;
                }
            }
        } else {
            QA.log("Nothing to gather nearby");
        }
    },
    
    attack: function() {
        if(!this.state.gameActive) return;
        
        let player = this.state.player;
        let nearest = AI.findNearestEnemy(this.state, CONFIG.ATTACK_RADIUS);
        
        if(nearest) {
            for(let i = 0; i < this.state.enemies.length; i++) {
                if(this.state.enemies[i] === nearest) {
                    nearest.hp -= CONFIG.PLAYER_DAMAGE;
                    Sound.play('click');
                    QA.log(`Enemy hit! HP: ${Math.max(0, nearest.hp)}`);
                    
                    if(nearest.hp <= 0) {
                        this.state.removeEnemy(i);
                        Sound.play('hit');
                        QA.log("Enemy defeated!");
                    }
                    return;
                }
            }
        } else {
            QA.log("No enemy nearby");
        }
    },
    
    attackNearest: function() {
        this.attack();
    },
    
    update: function(delta) {
        if(!this.state.gameActive) return;
        
        this.state.movePlayer(delta);
        
        this.state.player.hunger -= delta * CONFIG.HUNGER_RATE;
        if(this.state.player.hunger <= 0) {
            this.state.damagePlayer(delta * 5);
            this.state.player.hunger = 0;
        }
        
        this.state.dayTimer += delta;
        if(this.state.dayTimer >= CONFIG.DAY_DURATION) {
            this.state.dayTimer = 0;
            this.state.nextDay();
            QA.log(`Day ${this.state.day}`);
        }
        
        this.state.spawnTimer += delta;
        if(this.state.spawnTimer >= 10 && this.state.enemies.length < 3) {
            this.state.spawnTimer = 0;
            let side = Math.random() > 0.5 ? 50 : 750;
            let y = 150 + Math.random() * 350;
            this.state.addEnemy(side, y, 40 + Math.random() * 15);
            QA.log("Enemy appeared");
        }
        
        this.state.enemies = AI.updateEnemies(this.state, delta);
        
        let attacker = AI.checkAttack(this.state);
        if(attacker) {
            this.state.damagePlayer(delta * 10);
        }
        
        if(this.state.player.hp <= 0) {
            this.state.gameActive = false;
            QA.log("GAME OVER");
        }
    },
    
    restart: function() {
        this.state.reset();
        QA.log("Game restarted");
        Sound.play('click');
    },
    
    getState: function() {
        return this.state.getState();
    }
};