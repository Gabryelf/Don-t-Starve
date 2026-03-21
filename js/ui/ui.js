window.UI = {
    canvas: null,
    ctx: null,
    
    init: function(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.setupEvents();
    },
    
    setupEvents: function() {
        // Клик левой кнопкой - перемещение
        this.canvas.addEventListener('click', (e) => {
            let rect = this.canvas.getBoundingClientRect();
            let x = (e.clientX - rect.left) * (800 / rect.width);
            let y = (e.clientY - rect.top) * (600 / rect.height);
            
            // Проверяем кнопки UI
            if(x > 20 && x < 110 && y > 545 && y < 580) {
                if(window.Core) window.Core.gather();
            } else if(x > 120 && x < 210 && y > 545 && y < 580) {
                if(window.Core) window.Core.attack();
            } else if(x > 690 && x < 780 && y > 545 && y < 580) {
                if(window.Core) window.Core.restart();
            } else {
                // Перемещение персонажа
                if(window.Core) window.Core.setPlayerTarget(x, y);
            }
        });
        
        // Правая кнопка - атака ближайшего врага
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(window.Core) window.Core.attackNearest();
            return false;
        });
        
        // Клавиша E - сбор ресурсов
        window.addEventListener('keydown', (e) => {
            if(e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                if(window.Core) window.Core.gather();
            }
            if(e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                if(window.Core) window.Core.restart();
            }
        });
    },
    
    render: function(state) {
        let ctx = this.ctx;
        
        Assets.drawGround(ctx);
        
        for(let tree of state.trees) {
            Assets.drawTree(ctx, tree.x, tree.y, tree.wood);
        }
        
        for(let berry of state.berries) {
            Assets.drawBerry(ctx, berry.x, berry.y, berry.count);
        }
        
        for(let enemy of state.enemies) {
            Assets.drawEnemy(ctx, enemy.x, enemy.y, enemy.hp);
        }
        
        Assets.drawPlayer(ctx, state.player.x, state.player.y, state.player.hp);
        Assets.drawUI(ctx, state.player, state.day);
        
        // Индикатор цели
        if(state.player.targetX !== null) {
            ctx.beginPath();
            ctx.arc(state.player.targetX, state.player.targetY, 8, 0, Math.PI * 2);
            ctx.strokeStyle = "#ffaa44";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(state.player.targetX - 12, state.player.targetY);
            ctx.lineTo(state.player.targetX + 12, state.player.targetY);
            ctx.moveTo(state.player.targetX, state.player.targetY - 12);
            ctx.lineTo(state.player.targetX, state.player.targetY + 12);
            ctx.stroke();
        }
        
        let logs = QA.getLastLogs();
        ctx.fillStyle = "#ddddaa";
        ctx.font = "9px monospace";
        for(let i = 0; i < Math.min(3, logs.length); i++) {
            ctx.fillText(logs[i].substring(0, 45), 10, 590 - (i * 12));
        }
        
        if(!state.gameActive) {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = "#ff6666";
            ctx.font = "bold 32px monospace";
            ctx.fillText("GAME OVER", 310, 300);
            ctx.font = "14px monospace";
            ctx.fillStyle = "#fff";
            ctx.fillText("Press RESTART or R", 340, 360);
        }
    }
};