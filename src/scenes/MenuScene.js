import { Scene } from "phaser"; // Import only the Scene class
import AudioManager from "../AudioManager";

export default class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        this.audioManager = new AudioManager(this);

        this.audioManager.playBackgroundMusic("main-theme", { volume: 0.15 });

        this.game.registry.set("audioManager", this.audioManager);

        this.add.image(0, 0, "menu").setOrigin(0);
        const startBtn = this.add
            .image(740, 650, "startBtn")
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        startBtn.on("pointerdown", () => {
            this.scene.start("KitchenScene");
        });
    }
}
