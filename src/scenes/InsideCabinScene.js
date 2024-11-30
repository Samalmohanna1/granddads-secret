import BaseScene from "./BaseScene";

export default class InsideCabinScene extends BaseScene {
    constructor() {
        super("InsideCabinScene");
    }

    create() {
        super.create();

        this.add
            .image(0, 0, "cabin-inside")
            .setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.scene.start("GameOverScene");
            });

        this.dialogueManager.addToQueue("It's pretty dusty in here.");
    }
}
