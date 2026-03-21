window.AI = {
    updateEnemies: function(state, delta) {
        let enemies = state.enemies;
        let playerX = state.player.x;
        let playerY = state.player.y;
        
        for(let i = 0; i < enemies.length; i++) {
            let e = enemies[i];
            let dx = playerX - e.x;
            let dy = playerY - e.y;
            let dist = Math.hypot(dx, dy);
            
            if(dist > 0.01) {
                let move = CONFIG.ENEMY_SPEED * delta;
                e.x += (dx / dist) * move;
                e.y += (dy / dist) * move;
            }
            
            e.x = Math.max(30, Math.min(770, e.x));
            e.y = Math.max(50, Math.min(540, e.y));
        }
        
        return enemies;
    },
    
    checkAttack: function(state) {
        let playerX = state.player.x;
        let playerY = state.player.y;
        
        for(let i = 0; i < state.enemies.length; i++) {
            let e = state.enemies[i];
            if(Math.hypot(playerX - e.x, playerY - e.y) < 42) {
                return e;
            }
        }
        return null;
    },
    
    findNearestEnemy: function(state, range) {
        let playerX = state.player.x;
        let playerY = state.player.y;
        let nearest = null;
        let minDist = range;
        
        for(let e of state.enemies) {
            let dist = Math.hypot(playerX - e.x, playerY - e.y);
            if(dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    },
    
    findNearestResource: function(state, type, range) {
        let playerX = state.player.x;
        let playerY = state.player.y;
        let resources = type === 'tree' ? state.trees : state.berries;
        let nearest = null;
        let minDist = range;
        
        for(let r of resources) {
            let amount = type === 'tree' ? r.wood : r.count;
            if(amount <= 0) continue;
            
            let dist = Math.hypot(playerX - r.x, playerY - r.y);
            if(dist < minDist) {
                minDist = dist;
                nearest = r;
            }
        }
        return nearest;
    }
};