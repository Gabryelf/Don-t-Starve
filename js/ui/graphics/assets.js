window.Assets = {
    images: {},
    loaded: false,
    callbacks: [],
    
    load: function(onComplete) {
        let paths = CONFIG.PATHS;
        let total = Object.keys(paths).length;
        let loaded = 0;
        
        for(let key in paths) {
            let img = new Image();
            img.onload = () => {
                loaded++;
                if(loaded === total) {
                    this.loaded = true;
                    if(onComplete) onComplete();
                    this.callbacks.forEach(cb => cb());
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load: ${paths[key]}`);
                loaded++;
                if(loaded === total && onComplete) onComplete();
            };
            img.src = paths[key];
            this.images[key] = img;
        }
    },
    
    get: function(name) {
        return this.images[name] || null;
    },
    
    drawGround: function(ctx) {
        let img = this.get('ground');
        if(img && img.complete) {
            ctx.drawImage(img, 0, 0, 800, 600);
        } else {
            ctx.fillStyle = "#2d5a2c";
            ctx.fillRect(0, 0, 800, 600);
        }
    },
    
    drawTree: function(ctx, x, y, wood) {
        let img = this.get('tree');
        if(img && img.complete) {
            ctx.drawImage(img, x - 20, y - 25, 80, 90);
        }
        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.fillText("🌲" + wood, x - 12, y - 30);
    },
    
    drawBerry: function(ctx, x, y, count) {
        let img = this.get('berry');
        if(img && img.complete) {
            ctx.drawImage(img, x - 15, y - 15, 30, 30);
        }
        ctx.fillStyle = "#fff";
        ctx.fillText("🍓" + count, x - 10, y - 20);
    },
    
    drawPlayer: function(ctx, x, y, hp) {
        let img = this.get('player');
        if(img && img.complete) {
            ctx.drawImage(img, x - 18, y - 20, 36, 40);
        }
        
        ctx.fillStyle = "#aa3333";
        ctx.fillRect(x - 20, y - 32, 40, 5);
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(x - 20, y - 32, 40 * (hp / 100), 5);
    },
    
    drawEnemy: function(ctx, x, y, hp) {
        let img = this.get('enemy');
        if(img && img.complete) {
            ctx.drawImage(img, x - 18, y - 18, 36, 36);
        }
        
        ctx.fillStyle = "#aa3333";
        ctx.fillRect(x - 20, y - 28, 40, 5);
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(x - 20, y - 28, 40 * (hp / 50), 5);
    },
    
    drawUI: function(ctx, player, day) {
        let panel = this.get('panel');
        let button = this.get('button');
        
        if(panel && panel.complete) {
            ctx.drawImage(panel, 0, 540, 800, 60);
        } else {
            ctx.fillStyle = "#2c2c1ccc";
            ctx.fillRect(0, 0, 800, 50);
            ctx.fillRect(0, 540, 800, 60);
        }
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px monospace";
        ctx.fillText("❤️ " + Math.floor(player.hp), 20, 32);
        ctx.fillText("🍗 " + Math.floor(player.hunger), 110, 32);
        ctx.fillText("🌳" + player.wood, 200, 32);
        ctx.fillText("🌞 Day " + day, 290, 32);
        
        if(button && button.complete) {
            ctx.drawImage(button, 20, 545, 90, 35);
            ctx.drawImage(button, 120, 545, 90, 35);
            ctx.drawImage(button, 690, 545, 90, 35);
        } else {
            ctx.fillStyle = "#4a3a2a";
            ctx.fillRect(20, 545, 90, 35);
            ctx.fillRect(120, 545, 90, 35);
            ctx.fillRect(690, 545, 90, 35);
        }
        
        ctx.fillStyle = "#ffde9c";
        ctx.font = "bold 14px monospace";
        ctx.fillText("GATHER", 45, 568);
        ctx.fillText("ATTACK", 150, 568);
        ctx.fillText("RESTART", 715, 568);
    }
};