import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";

export default class LakeScene extends Scene {
    constructor() {
        super("LakeScene");
        this.collectedItems = 0;
        this.totalItems = 1;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
    }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "lake").setOrigin(0);

        const items = [
            {
                key: "boat",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 200,
                description:
                    "Wait, is this the same boat we used on that trip all those years ago?",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "There's something out in the water, I could use this boat to reach it."
        );

        this.inventoryDisplay = new InventoryDisplay(this);

        this.dialogueManager.on("allDialoguesDisplayed", () => {
            if (this.allItemsCollected) {
                this.scene.start("CabinScene");
            }
        });
    }

    update() {
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    createCollectibleItem(item) {
        const gameObject = this.add
            .image(item.x, item.y, item.key)
            .setInteractive();

        // Create the outline
        const outline = this.add.graphics();
        outline.lineStyle(6, 0xf96f28); // 6px wide orange line
        outline.strokeRect(
            item.x - gameObject.width / 2 - 3,
            item.y - gameObject.height / 2 - 3,
            gameObject.width + 6,
            gameObject.height + 6
        );
        outline.setVisible(false);

        gameObject.on("pointerover", () => {
            outline.setVisible(true);
        });

        gameObject.on("pointerout", () => {
            outline.setVisible(false);
        });

        gameObject.on("pointerdown", () => {
            this.scene.start("CabinScene");
        });
    }

    collectItem(gameObject, item) {
        this.dialogueManager.addToQueue(item.description);

        Inventory.addItem(item.key);

        gameObject.destroy();

        this.collectedItems++;

        // Play a sound effect (if you have one)
        // this.sound.play('collect_sound');

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            // this.dialogueManager.addToQueue(
            //     "Looks like I've got everything, better check the map."
            // );
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
