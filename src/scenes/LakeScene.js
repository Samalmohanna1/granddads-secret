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

    // preload() {
    //     this.load.image("kitchen", "assets/scenes/kitchen.jpg");
    //     this.load.image("letter2", "assets/items/letter-one.jpg");
    // }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "kitchen").setOrigin(0);

        const items = [
            {
                key: "letter2",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                description:
                    "A letter from Grandpa. It mentions a secret fishing spot.",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "It's the lake from the photo, where he took me fishing."
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

        gameObject.on("pointerdown", () => {
            this.collectItem(gameObject, item);
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
            this.dialogueManager.addToQueue(
                "Looks like I've got everything, better check the map."
            );
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
