import { Scene } from "phaser";

export default class GameOverScene extends Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add
            .text(this.cameras.main.width / 2, 200, "Game Over", {
                font: "32px UbuntuMono",
                fill: "#fff",
            })
            .setOrigin(0.5);
        this.add
            .text(this.cameras.main.width / 2, 300, "Thanks for playing!", {
                font: "24px UbuntuMono",
                fill: "#fff",
            })
            .setOrigin(0.5);
        this.add
            .text(this.cameras.main.width / 2, 350, "Credits:", {
                font: "24px UbuntuMono",
                fill: "#fff",
            })
            .setOrigin(0.5);
        this.add
            .text(this.cameras.main.width / 2, 400, "SleepySam", {
                font: "20px UbuntuMono",
                fill: "#fff",
            })
            .setOrigin(0.5);

        const playAgainButton = this.add
            .text(this.cameras.main.width / 2, 500, "Play Again", {
                font: "24px UbuntuMono",
                fill: "#0f0",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playAgainButton.on("pointerdown", () => {
            location.reload();
        });

        playAgainButton.on("pointerover", () => {
            playAgainButton.setStyle({ fill: "#ff0" });
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.setStyle({ fill: "#0f0" });
        });
    }
}
