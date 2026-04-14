//--------------------------------------
// Визуальные эффекты
//--------------------------------------
class EffectsManager {
    constructor() {
        this.effects = [];
    }
    
    addPickupEffect(x, y) {
        this.effects.push({
            x: x, y: y,
            lifetime: 0.4,
            maxLifetime: 0.4,
            type: 'pickup'
        });
        window.soundManager.play('gather');
    }
    
    addHitEffect(x, y) {
        this.effects.push({
            x: x, y: y,
            lifetime: 0.3,
            maxLifetime: 0.3,
            type: 'hit'
        });
        window.soundManager.play('hit');
    }
    
    update(delta) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].lifetime -= delta;
            if (this.effects[i].lifetime <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    draw(ctx, camera) {
        for (let e of this.effects) {
            const alpha = e.lifetime / e.maxLifetime;
            const radius = 20 * (1 - alpha);
            
            const screenX = e.x - camera.x;
            const screenY = e.y - camera.y;
            
            if (screenX + radius < 0 || screenX - radius > 800 || 
                screenY + radius < 0 || screenY - radius > 600) continue;
            
            if (e.type === 'pickup') {
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            } else {
                ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
            }
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

window.effectsManager = new EffectsManager();