window.Sound = {
    sounds: {},
    
    load: function() {
        let soundFiles = {
            click: "assets/audio/sounds/click.mp3",
            hit: "assets/audio/sounds/click.mp3",
            gather: "assets/audio/sounds/click.mp3"
        };
        
        for(let key in soundFiles) {
            let audio = new Audio();
            audio.src = soundFiles[key];
            audio.volume = 0.3;
            this.sounds[key] = audio;
        }
    },
    
    play: function(name) {
        let sound = this.sounds[name];
        if(sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound error:", e));
        }
    }
};