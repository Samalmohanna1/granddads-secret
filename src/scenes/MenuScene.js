import { Scene } from "phaser"; // Import only the Scene class

export default class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        const buttonText = this.add
            .text(400, 300, "Start Game", {
                fontSize: "32px",
                fill: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        buttonText.on("pointerover", () => {
            buttonText.setStyle({ fill: "pink" });
        });

        buttonText.on("pointerout", () => {
            buttonText.setStyle({ fill: "#ffffff" });
        });

        buttonText.on("pointerdown", () => {
            this.scene.start("KitchenScene");
        });
    }
}
