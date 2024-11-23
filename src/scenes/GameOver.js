import { Scene } from "phaser";

export default class GameOverScene extends Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add
            .text(400, 200, "Game Over", { fontSize: "32px", fill: "#fff" })
            .setOrigin(0.5);
        this.add
            .text(400, 300, "Thanks for playing!", {
                fontSize: "24px",
                fill: "#fff",
            })
            .setOrigin(0.5);
        this.add
            .text(400, 350, "Credits:", { fontSize: "24px", fill: "#fff" })
            .setOrigin(0.5);
        this.add
            .text(400, 400, "SleepySam", { fontSize: "20px", fill: "#fff" })
            .setOrigin(0.5);

        const playAgainButton = this.add
            .text(400, 500, "Play Again", { fontSize: "24px", fill: "#0f0" })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playAgainButton.on("pointerdown", () => {
            location.reload(); // Refresh the page
        });

        playAgainButton.on("pointerover", () => {
            playAgainButton.setStyle({ fill: "#ff0" }); // Change color on hover
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.setStyle({ fill: "#0f0" }); // Reset color
        });
    }
}
