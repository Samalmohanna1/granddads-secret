import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";

export default class KitchenScene extends Scene {
    constructor() {
        super("KitchenScene");
    }

    create() {
        this.audioManager = this.game.registry.get("audioManager");
        this.audioManager.playAmbientSound("city", {
            loop: true,
            volume: 0.1,
        });

        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "kitchen").setOrigin(0);

        const gift = this.add.image(0, 0, "gift").setInteractive({
            useHandCursor: true,
        });

        const outline = this.add.graphics();
        outline.lineStyle(6, 0xf96f28);
        outline.strokeRect(
            -gift.width / 2 - 2,
            -gift.height / 2 - 2,
            gift.width + 4,
            gift.height + 4
        );
        outline.visible = false;

        const container = this.add.container(
            this.cameras.main.width - 400,
            this.cameras.main.height - 300,
            [outline, gift]
        );

        gift.on("pointerover", () => {
            outline.visible = true;
        });

        gift.on("pointerout", () => {
            outline.visible = false;
        });

        gift.on("pointerdown", () => {
            this.scene.start("KitchenTableScene");
        });

        this.dialogueManager.addToQueue(
            "Happy birthday Ricky, there's a package on the table for you. Not sure who sent it, there's no return address."
        );
    }
}
