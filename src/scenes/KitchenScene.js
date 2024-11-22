import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";

export default class KitchenScene extends Scene {
    constructor() {
        super("KitchenScene");
    }

    // preload() {
    //     this.load.image("kitchen", "assets/scenes/kitchen.jpg");
    //     this.load.image("gift", "assets/items/gift.jpg");
    // }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "kitchen").setOrigin(0);

        const gift = this.add.image(0, 0, "gift").setInteractive();

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
            "There's a gift on the table, I wonder who it's from."
        );
    }
}
