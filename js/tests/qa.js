//-------------------------------------------------------------
//  Global Tests @Gabryelf (Valeev Sergey) 01.03.2026
//-------------------------------------------------------------
class QATests {
    constructor() {
        this.modules = [
            { name: "GameConfig", check: () => window.gameConfig !== undefined },
            { name: "GameBalance", check: () => window.gameBalance !== undefined },
            { name: "GameState", check: () => window.gameState !== undefined },
            { name: "AssetLoader", check: () => window.assetLoader !== undefined },
            { name: "SoundManager", check: () => window.soundManager !== undefined },
            { name: "EffectsManager", check: () => window.effectsManager !== undefined }
        ];
    }
    
    run() {
        console.log("✅ Integration & QA ready");
        
        let allLoaded = true;
        this.modules.forEach(module => {
            if (module.check()) {
                console.log(`✅ ${module.name} module loaded`);
            } else {
                console.error(`❌ ${module.name} module missing`);
                allLoaded = false;
            }
        });
        
        if (allLoaded) {
            console.log("🎉 All systems operational!");
        }
        
        return { allLoaded, modules: this.modules };
    }
}

const qaTests = new QATests();
qaTests.run();