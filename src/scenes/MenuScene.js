import { Scene } from "phaser"; // Import only the Scene class

export default class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        const buttonText = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "Start Game",
                {
                    font: "32px UbuntuMono",
                    fill: "#090909",
                    backgroundColor: "#e1e1e1",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        buttonText.on("pointerover", () => {
            buttonText.setStyle({ backgroundColor: "pink" });
        });

        buttonText.on("pointerout", () => {
            buttonText.setStyle({ backgroundColor: "#e1e1e1" });
        });

        buttonText.on("pointerdown", () => {
            this.scene.start("KitchenScene");
        });
    }
}
