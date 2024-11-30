import BaseScene from "./BaseScene";
import gameMap from "../GameMap";
import Inventory from "../Inventory";

export default class TallmanLakeScene extends BaseScene {
    constructor() {
        super("TallmanLakeScene");
        this.totalItems = 3;
        this.tackleboxUnlocked = false;
        this.draggingHook = null;
    }

    create() {
        super.create();

        this.background = this.add.image(0, 0, "tallman").setOrigin(0);

        this.tacklebox = this.add.zone(950, 720, 200, 200).setDropZone();

        const items = [
            {
                key: "cabin-key",
                x: this.tacklebox.x - 100,
                y: this.tacklebox.y + 60,
                name: "Cabin Key",
                description: "An old key, labeled Cabin.",
                infoImageKey: "cabin-key-clue",
                clue: "An old key.",
            },
            {
                key: "photo-cabin",
                x: this.tacklebox.x - 280,
                y: this.tacklebox.y - 220,
                name: "Cabin Photo",
                description: "A photo of Grandpa in front of an old cabin.",
                infoImageKey: "photo-cabin-clue",
                clue: "A photo of grandpa Rick in front of a cabin.",
            },

            {
                key: "can-opener",
                x: this.tacklebox.x + 100,
                y: this.tacklebox.y - 170,
                name: "Can Opener",
                description: "A can opener.",
                infoImageKey: "can-opener-clue",
                clue: "A can opener. Grandpa loved using canned worms for bait.",
            },
        ];

        this.draggingHook = this.add
            .image(0, 0, "hook")
            .setVisible(false)
            .setScale(0.3);

        this.dialogueManager.addToQueue(
            "Wow, this things been here a while. A tackle box? It's screwed to the post, I need to open it here. I should try that hook key."
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

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.tacklebox &&
                gameObject.texture.key === "hook"
            ) {
                this.background.setTexture("tallman-open");
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
    collectItem(gameObject, item) {
        this.audioManager.playSound("pickup", {
            loop: false,
            volume: 0.1,
        });
        if (this.inventoryManager) {
            this.inventoryManager.showInfoCard(item);
        }

        Inventory.addItem(item);

        gameObject.destroy();

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
            "I should check the map for the cabin."
        );
    }
}
