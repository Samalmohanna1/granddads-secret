import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";

export default class LakeScene extends Scene {
    constructor() {
        super("LakeScene");
        this.collectedItems = 0;
        this.totalItems = 4;
        this.inventoryDisplay = null;
    }

    preload() {
        this.load.image("kitchen", "assets/scenes/kitchen.jpg");
        this.load.image("letter", "assets/items/letter-one.jpg");
    }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "kitchen").setOrigin(0);

        const items = [
            {
                key: "letter",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                description: "This letter says I need to get something.",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "I remember this lake, we can fishing here before."
        );

        // Initialize global inventory display
        this.inventoryDisplay = new InventoryDisplay(this);
    }

    update() {
        // Update the inventory display each frame
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

        // Add item to global inventory
        Inventory.addItem(item.key); // Use global inventory

        // Remove the item from the scene
        gameObject.destroy();

        this.collectedItems++;

        // Play a sound effect (if you have one)
        // this.sound.play('collect_sound');

        if (this.collectedItems === this.totalItems) {
            this.dialogueManager.addToQueue(
                "Looks like I've got everything, better check the map."
            );
        }

        // Update the global inventory display
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
