window.Sound = {
    play: function(name) {
        // Простой звук через Web Audio API
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioCtx.destination);
            
            if(name === 'click') {
                oscillator.frequency.value = 800;
                gain.gain.value = 0.2;
                oscillator.type = 'sine';
            } else if(name === 'hit') {
                oscillator.frequency.value = 200;
                gain.gain.value = 0.3;
                oscillator.type = 'triangle';
            } else if(name === 'gather') {
                oscillator.frequency.value = 500;
                gain.gain.value = 0.2;
                oscillator.type = 'sine';
            }
            
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
            oscillator.stop(audioCtx.currentTime + 0.3);
        } catch(e) {
            console.log("Audio not supported");
        }
    }
};