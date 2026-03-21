window.onload = function() {
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    
    UI.init(canvas, ctx);
    Sound.load();
    
    Assets.load(() => {
        Core.init();
        QA.log("Game ready!");
        QA.log("Controls: LEFT CLICK to move | RIGHT CLICK to attack | E to gather | R to restart");
        
        let lastTime = 0;
        
        function gameLoop(currentTime) {
            requestAnimationFrame(gameLoop);
            
            let delta = Math.min(0.033, (currentTime - lastTime) / 1000);
            if(delta > 0.01 && lastTime !== 0) {
                Core.update(delta);
            }
            lastTime = currentTime;
            
            UI.render(Core.getState());
        }
        
        requestAnimationFrame(gameLoop);
    });
};