import { Scene } from "phaser"; // Import only the Scene class

export default class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
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
