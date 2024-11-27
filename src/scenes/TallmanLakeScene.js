import BaseScene from "./BaseScene";
import gameMap from "../GameMap";
import Inventory from "../Inventory";

export default class TallmanLakeScene extends BaseScene {
    constructor() {
        super("TallmanLakeScene");
        this.totalItems = 1;
        this.tackleboxUnlocked = false;
    }

    create() {
        super.create();

        this.add.image(0, 30, "lake").setOrigin(0.3).setScale(1.8);

        this.tacklebox = this.add.image(800, 600, "tacklebox").setInteractive({
            dropZone: true,
        });

        this.dialogueManager.addToQueue(
            "Wow, it looks like it's holding something special. A tackle box? I wonder what secrets are inside... But it's locked tight. I'll need to find a way to open it."
        );

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragenter", (pointer, gameObject, dropZone) => {
            if (
                gameObject.texture.key === "hook" &&
                dropZone === this.tacklebox
            ) {
                this.tacklebox.setTint(0x00ff00);
            }
        });

        this.input.on("dragleave", (pointer, gameObject, dropZone) => {
            if (
                gameObject.texture.key === "hook" &&
                dropZone === this.tacklebox
            ) {
                this.tacklebox.clearTint();
            }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                gameObject.texture.key === "hook" &&
                dropZone === this.tacklebox
            ) {
                this.unlockTacklebox();
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.events.on("updateInventory", this.updateDraggableItems, this);
    }

    updateDraggableItems() {
        const items = Inventory.getItems();
        items.forEach((item) => {
            const gameObject = this.children.getByName(item.key);
            if (gameObject) {
                gameObject.setInteractive({ draggable: true });
            }
        });
    }

    unlockTacklebox() {
        if (!this.tackleboxUnlocked) {
            this.tackleboxUnlocked = true;
            this.tacklebox.clearTint();
            this.dialogueManager.addToQueue(
                "The tackle box unlocks with a satisfying click!"
            );
            this.onAllItemsCollected();
        }
    }

    onAllItemsCollected() {
        gameMap.addLocation("cabin", "CabinScene", 955, 540, "journey3");
        this.dialogueManager.addToQueue(
            "I should check the map, maybe the cabin is marked."
        );
    }
}
