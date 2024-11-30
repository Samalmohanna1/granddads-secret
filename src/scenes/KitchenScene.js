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

        const container = this.add.container(
            this.cameras.main.width - 400,
            this.cameras.main.height - 300,
            [gift]
        );

        gift.on("pointerover", () => {
            gift.setTint(0xccffee);
        });

        gift.on("pointerout", () => {
            gift.clearTint();
        });

        gift.on("pointerdown", () => {
            this.scene.start("KitchenTableScene");
        });

        this.dialogueManager.addToQueue(
            "Happy birthday Ricky, there's a package on the table for you. Not sure who sent it, there's no return address."
        );
    }
}
