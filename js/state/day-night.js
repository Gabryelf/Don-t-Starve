class DayNightSystem {
    constructor() {
        this.nightAlpha = 0;
        this.torchActive = false;
        this.torchDuration = 0;
        this.torchRadius = 150;
    }
    
    update(dayTimer, dayDuration) {
        // В методе update:
        const nightStart = dayDuration * 0.65;  // Ночь начинается позже
        const isNight = dayTimer > nightStart;
        if (isNight && !this.torchActive) {
            const progress = (dayTimer - nightStart) / (dayDuration - nightStart);
            this.nightAlpha = Math.min(0.85, progress * 0.85);
        } else if (this.torchActive) {
            this.nightAlpha = 0.2;  // Факел уменьшает темноту
            this.torchDuration -= 1/60;  // Тикает каждую секунду
            if (this.torchDuration <= 0) {
                this.torchActive = false;
            }
        } else {
            this.nightAlpha = 0;
        }
    }
    
    activateTorch(duration = 30) {
        this.torchActive = true;
        this.torchDuration = duration;
    }
    
    draw(ctx, camera, playerX, playerY) {
        // Затемнение экрана
        if (this.nightAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 20, ${this.nightAlpha})`;
            ctx.fillRect(0, 0, 800, 600);
            
            // Свет от факела (если активен)
            if (this.torchActive) {
                const screenX = playerX - camera.x;
                const screenY = playerY - camera.y;
                
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.torchRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
                
                // Свечение
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.torchRadius - 20, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 150, 50, 0.3)`;
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    }

    drawUI(ctx) {
        // Иконка времени суток
        const isNight = this.nightAlpha > 0.3;
        ctx.font = "24px monospace";
        ctx.fillStyle = isNight ? "#aaaaff" : "#ffaa44";
        ctx.fillText(isNight ? "🌙" : "☀️", 150, 30);
        
        // Полоска времени суток
        ctx.fillStyle = isNight ? "#334466" : "#cc8844";
        ctx.fillRect(450, 20, 100, 8);
        
        // Прогресс
        ctx.fillStyle = isNight ? "#88aaff" : "#ffcc88";
        // Здесь нужен прогресс от gameState
    }
}