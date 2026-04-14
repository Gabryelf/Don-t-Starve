//--------------------------------------
// Звуковой движок
//--------------------------------------
class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.loadedCount = 0;
        this.totalSounds = 0;
        this.onComplete = null;
        this.currentMusic = null;
    }
    
    loadAll(soundsList, callback) {
        this.onComplete = callback;
        const entries = Object.entries(soundsList);
        this.totalSounds = entries.length;
        this.loadedCount = 0;
        
        for (const [name, path] of entries) {
            this.loadSound(name, path);
        }
    }
    
    loadSound(name, path) {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
            this.loadedCount++;
            console.log(`✅ Sound loaded: ${name} (${this.loadedCount}/${this.totalSounds})`);
            if (this.loadedCount === this.totalSounds && this.onComplete) {
                console.log("🔊 All sounds ready!");
                this.onComplete();
            }
        });
        audio.onerror = () => {
            console.error(`❌ Failed to load sound: ${name}`);
            this.loadedCount++;
        };
        audio.src = path;
        audio.load();
        this.sounds.set(name, audio);
    }
    
    play(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio error:", e));
        } else {
            console.warn(`⚠️ Sound not found: ${name}`);
        }
    }
    
    playMusic(name, volume = 0.3) {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        
        const music = this.sounds.get(name);
        if (music) {
            music.loop = true;
            music.volume = volume;
            music.play().catch(e => console.log("Music error:", e));
            this.currentMusic = music;
        } else {
            console.warn(`⚠️ Music track not found: ${name}`);
        }
    }
    
    stopMusic(name) {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    setVolume(name, volume) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume));
        }
    }
}

window.soundManager = new SoundManager();
console.log("🔊 Sound Manager ready");