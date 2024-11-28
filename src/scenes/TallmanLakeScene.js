import BaseScene from "./BaseScene";
import gameMap from "../GameMap";
import Inventory from "../Inventory";

export default class TallmanLakeScene extends BaseScene {
    constructor() {
        super("TallmanLakeScene");
        this.totalItems = 2;
        this.tackleboxUnlocked = false;
        this.draggingHook = null;
    }

    create() {
        super.create();

        this.add.image(0, 30, "lake").setOrigin(0.3).setScale(1.8);

        this.tacklebox = this.add.image(800, 600, "tacklebox").setInteractive({
            dropZone: true,
        });

        const items = [
            {
                key: "cabin-key",
                x: this.tacklebox.x + 20,
                y: this.tacklebox.y,
                name: "Cabin Key",
                description: "An old key, labeled Cabin.",
                infoImageKey: "cabin-key",
                clue: "An old key, labeled Cabin.",
            },
            {
                key: "photo-cabin",
                x: this.tacklebox.x,
                y: this.tacklebox.y + 150,
                name: "Cabin Photo",
                description: "A photo of Grandpa in front of an old cabin.",
                infoImageKey: "photo-cabin",
                clue: "Some clue here.",
            },
        ];

        this.draggingHook = this.add
            .image(0, 0, "hook")
            .setVisible(false)
            .setScale(0.3);

        this.dialogueManager.addToQueue(
            "Wow, it looks like it's holding something special. A tackle box? I wonder what secrets are inside... But it's locked tight. I'll need to find a way to open it."
        );

        this.input.on("dragstart", (pointer, gameObject) => {
            if (gameObject.texture.key === "hook") {
                this.draggingHook
                    .setPosition(pointer.x, pointer.y)
                    .setVisible(true);
            }
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (gameObject.texture.key === "hook") {
                this.draggingHook.setPosition(pointer.x, pointer.y);
            }
        });

        this.input.on("dragenter", (pointer, gameObject, dropZone) => {
            // if (
            //     gameObject.texture.key === "hook" &&
            //     dropZone === this.tacklebox
            // ) {
            // }
        });

        this.input.on("dragleave", (pointer, gameObject, dropZone) => {
            // if (
            //     gameObject.texture.key === "hook" &&
            //     dropZone === this.tacklebox
            // ) {
            //     this.tacklebox.setTexture("tacklebox-open");
            // }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.tacklebox &&
                gameObject.texture.key === "hook"
            ) {
                this.tacklebox.setTexture("tacklebox-open").setScale(3);
                this.unlockTacklebox();

                items.forEach((item) => this.createCollectibleItem(item));
                this.draggingHook.setVisible(false);
                this.input.setDefaultCursor("default");
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (gameObject.texture.key === "hook") {
                this.draggingHook.setVisible(false);
            }
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.events.on("updateInventory", this.updateDraggableItems, this);
    }
    collectItem(gameObject, outline, item) {
        this.audioManager.playSound("pickup", {
            loop: false,
            volume: 0.1,
        });
        if (this.inventoryManager) {
            this.inventoryManager.showInfoCard(item);
        }

        Inventory.addItem(item);

        gameObject.destroy();
        outline.destroy();

        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.onAllItemsCollected();
            this.events.emit("allItemsCollected");
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
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
            this.dialogueManager.addToQueue(
                "The tackle box unlocks with a satisfying click!"
            );
            Inventory.removeItem("hook");
            this.events.emit("updateInventory");
            this.input.setDefaultCursor("default");
        }
    }

    onAllItemsCollected() {
        gameMap.addLocation("cabin", "CabinScene", 955, 540, "journey3");
        this.dialogueManager.addToQueue(
            "I should check the map, maybe the cabin is marked."
        );
    }
}
