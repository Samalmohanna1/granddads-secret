import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";

export default class KitchenTableScene extends Scene {
    constructor() {
        super("KitchenTableScene");
        this.collectedItems = 0;
        this.totalItems = 4;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
    }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "kitchen-table").setOrigin(0);

        const items = [
            {
                key: "hook",
                x: this.cameras.main.width - 200,
                y: this.cameras.main.height - 600,
                description: "A rusty old fishing hook. It looks well-used.",
            },
            {
                key: "letter",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                description:
                    "A letter from Grandpa. It mentions a secret fishing spot.",
            },
            {
                key: "photo",
                x: this.cameras.main.width - 300,
                y: this.cameras.main.height - 300,
                description: "A photo of Grandpa fishing. He looks so happy!",
            },
            {
                key: "map",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 300,
                description:
                    "An old map with a location marked. Could this be the secret spot?",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "It's a gift from grandpa! Let's see what's inside."
        );

        this.inventoryDisplay = new InventoryDisplay(this);

        this.dialogueManager.on("allDialoguesDisplayed", () => {
            if (this.allItemsCollected) {
                this.scene.start("LakeScene");
            }
        });
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
            this.collectItem(gameObject, outline, item);
        });
    }

    collectItem(gameObject, outline, item) {
        this.dialogueManager.addToQueue(item.description);

        Inventory.addItem(item);

        gameObject.destroy();
        outline.destroy();

        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.dialogueManager.addToQueue(
                "Looks like I've got everything, better check the map."
            );
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    update() {
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
