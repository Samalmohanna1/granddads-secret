import BaseScene from "./BaseScene";
import gameMap from "../GameMap";

export default class InsideCabinScene extends BaseScene {
    constructor() {
        super("InsideCabinScene");
    }

    create() {
        super.create();

        this.add
            .image(0, 0, "cabin")
            .setOrigin(0)
            .setScale(2)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.scene.start("GameOverScene");
            });

        this.dialogueManager.addToQueue("It's pretty dusty in here.");
    }
}
