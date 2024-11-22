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
        const gift = this.add
            .image(
                this.cameras.main.width - 400,
                this.cameras.main.height - 300,
                "gift"
            )
            .setInteractive();

        gift.on("pointerdown", () => {
            this.scene.start("KitchenTableScene");
        });

        this.dialogueManager.addToQueue(
            "There's a gift on the table, I wonder who it's from."
        );
    }
}
