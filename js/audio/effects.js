// js/audio/effects.js
class EffectsManager {
    constructor() {
        // Массив активных эффектов
        this.effects = [];
    }

    addPickupEffect(x, y) {
        this.effects.push({
            x: x,
            y: y,
            lifetime: 0.4,
            maxLifetime: 0.4,
            type: 'pickup'
        });
        if (window.soundManager) {
            window.soundManager.play('gather');
        }
    }

    addHitEffect(x, y) {
        this.effects.push({
            x: x,
            y: y,
            lifetime: 0.3,
            maxLifetime: 0.3,
            type: 'hit'
        });
        if (window.soundManager) {
            window.soundManager.play('hit');
        }
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

            // Конвертируем мировые координаты в экранные
            const screenX = e.x - camera.x;
            const screenY = e.y - camera.y;

            // Пропускаем эффекты, которые находятся за пределами экрана
            if (screenX + radius < 0 || screenX - radius > 800 ||
                screenY + radius < 0 || screenY - radius > 600) {
                continue;
            }

            // Выбор цвета
            if (e.type === 'pickup') {
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;   // золотой
            } else {
                ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`; // красный
            }

            // Рисуем эффект
            ctx.save();
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

// Глобальный экземпляр
window.effectsManager = new EffectsManager();
