export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.backgroundMusic = null;
        this.currentAmbientSound = null;
    }

    playBackgroundMusic(key, options = { loop: true, volume: 0.5 }) {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        this.backgroundMusic = this.scene.sound.add(key, options);
        this.backgroundMusic.play();
    }

    playSound(key, options = { volume: 1 }) {
        this.scene.sound.play(key, options);
    }

    stopAmbientSound() {
        if (this.currentAmbientSound) {
            this.currentAmbientSound.stop();
            this.currentAmbientSound = null;
        }
    }

    playAmbientSound(key, options = { loop: true, volume: 0.3 }) {
        this.stopAmbientSound();
        this.currentAmbientSound = this.scene.sound.add(key, options);
        this.currentAmbientSound.play();
    }
}
