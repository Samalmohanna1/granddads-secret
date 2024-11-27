import { Scene } from "phaser";

export default class GameOverScene extends Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        const audioManager = this.game.registry.get("audioManager");

        audioManager.stopAmbientSound();

        this.add.image(0, 0, "gameover").setOrigin(0);

        const playAgainBtn = this.add
            .image(110, 650, "playAgainBtn")
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        playAgainBtn.on("pointerdown", () => {
            location.reload();
        });
    }
}
