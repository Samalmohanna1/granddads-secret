import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";

export default class CabinScene extends Scene {
    constructor() {
        super("CabinScene");
        this.collectedItems = 0;
        this.totalItems = 1;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
    }

    // preload() {
    //     this.load.image("letter3", "assets/items/letter-one.jpg");
    // }

    create() {
        this.dialogueManager = new DialogueManager(this);

        this.add.image(0, 0, "cabin").setOrigin(0);

        // const items = [
        //     {
        //         key: "letter3",
        //         x: this.cameras.main.width - 600,
        //         y: this.cameras.main.height - 600,
        //         description: "Another letter, with a big reveal.",
        //     },
        // ];

        // items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "An old cabin, I wonder if Grandpa used it while out hunting."
        );

        this.inventoryDisplay = new InventoryDisplay(this);

        // this.dialogueManager.on("allDialoguesDisplayed", () => {
        //     if (this.allItemsCollected) {
        //         this.scene.start("CabinScene");
        //     }
        // });
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
