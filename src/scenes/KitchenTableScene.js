import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";

export default class KitchenTableScene extends Scene {
    constructor() {
        super("KitchenTableScene");
        this.collectedItems = 0;
        this.totalItems = 4;
        this.inventoryDisplay = null; // Initialize inventory display
    }

    preload() {
        this.load.image("kitchen-table", "assets/scenes/kitchen-table.jpg");
        this.load.image("hook", "assets/items/hook.jpg");
        this.load.image("letter", "assets/items/letter-one.jpg");
        this.load.image("photo", "assets/items/photo-fishing.jpg");
        this.load.image("map", "assets/items/map-icon.jpg");
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

            this.scene.start("LakeScene");
        }

        // Update the global inventory display
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
