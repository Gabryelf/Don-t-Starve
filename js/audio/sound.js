class SoundManager {
    constructor() {
        // Хранилище звуков
        this.sounds = new Map();
        // Счетчики загрузки
        this.loadedCount = 0;
        this.totalSounds = 0;
        // Колбэк завершения загрузки
        this.onComplete = null;
        // Текущая фоновая музыка
        this.currentMusic = null;
    }

    loadAll(soundsList, callback) {
        this.onComplete = callback;
        const entries = Object.entries(soundsList);
        this.totalSounds = entries.length;
        this.loadedCount = 0;

        if (this.totalSounds === 0) {
            if (callback) callback();
            return;
        }

        for (let [name, path] of entries) {
            this.loadSound(name, path);
        }
    }

    loadSound(name, path) {
        const audio = new Audio();
        const self = this;

        audio.addEventListener('canplaythrough', function () {
            self.loadedCount++;
            console.log(`✅ Sound loaded: ${name} (${self.loadedCount}/${self.totalSounds})`);

            if (self.loadedCount === self.totalSounds && self.onComplete) {
                console.log("🔊 All sounds ready!");
                self.onComplete();
            }
        });

        audio.onerror = function () {
            console.error(`❌ Failed to load sound: ${name}`);
            self.loadedCount++;
            // Даже при ошибке считаем как загруженный, чтобы не зависнуть
            if (self.loadedCount === self.totalSounds && self.onComplete) {
                self.onComplete();
            }
        };

        audio.src = path;
        audio.load();
        this.sounds.set(name, audio);
    }

    play(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;  // перематываем в начало
            sound.play().catch(e => {
                console.log(`Audio play error for "${name}":`, e);
            });
        } else {
            console.warn(`⚠️ Sound not found: ${name}`);
        }
    }

    playMusic(name, volume = 0.3) {
        // Останавливаем текущую музыку
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        const music = this.sounds.get(name);
        if (music) {
            music.loop = true;
            music.volume = volume;
            music.play().catch(e => {
                console.log(`Music play error for "${name}":`, e);
            });
            this.currentMusic = music;
        } else {
            console.warn(`⚠️ Music track not found: ${name}`);
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
}

// Глобальный экземпляр
window.soundManager = new SoundManager();
