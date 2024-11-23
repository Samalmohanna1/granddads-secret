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
        this.isMapDisplayed = false;
    }

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
            .setInteractive({
                useHandCursor: true,
            });

        gameObject.on("pointerdown", () => {
            this.collectItem(gameObject, item);
        });
    }

    collectItem(gameObject, item) {
        this.dialogueManager.addToQueue(item.description);

        Inventory.addItem(item);

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
    displayMap() {
        if (this.isMapDisplayed) return;

        this.isMapDisplayed = true;
        const mapDisplay = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "map-full"
            )
            .setOrigin(0.5)
            .setScale(0.2)
            .setInteractive();

        mapDisplay.on("pointerdown", () => {
            mapDisplay.destroy();
            this.isMapDisplayed = false;
        });
    }
}
