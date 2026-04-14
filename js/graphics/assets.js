//--------------------------------------
// Загрузчик ресурсов
//--------------------------------------
class AssetLoader {
    constructor() {
        this.images = new Map();
        this.loadedCount = 0;
        this.totalImages = 0;
        this.onComplete = null;
    }
    
    loadAll(imagesList, callback) {
        this.onComplete = callback;
        const entries = Object.entries(imagesList);
        this.totalImages = entries.length;
        this.loadedCount = 0;
        
        for (const [name, path] of entries) {
            this.loadImage(name, path);
        }
    }
    
    loadImage(name, path) {
        const img = new Image();
        img.onload = () => {
            this.images.set(name, img);
            this.loadedCount++;
            console.log(`✅ Loaded: ${name} (${this.loadedCount}/${this.totalImages})`);
            if (this.loadedCount === this.totalImages && this.onComplete) {
                console.log("🎉 All assets loaded!");
                this.onComplete();
            }
        };
        img.onerror = () => {
            console.error(`❌ Failed to load: ${name} from ${path}`);
            this.loadedCount++;
            if (this.loadedCount === this.totalImages && this.onComplete) {
                this.onComplete();
            }
        };
        img.src = path;
    }
    
    getImage(name) {
        return this.images.get(name) || null;
    }
}

window.assetLoader = new AssetLoader();
console.log("🎨 AssetLoader ready");