import BaseScene from "./BaseScene";
import Inventory from "../Inventory";
import gameMap from "../GameMap";

export default class CabinScene extends BaseScene {
    constructor() {
        super("CabinScene");
        this.totalItems = 0;
        this.doorUnlocked = false;
    }

    create() {
        super.create();
        const audioManager = this.game.registry.get("audioManager");

        audioManager.stopAmbientSound();
        audioManager.playAmbientSound("nature-two", {
            loop: true,
            volume: 0.1,
        });

        this.add.image(0, 0, "cabin").setOrigin(0);

        this.door = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "cabin-door"
            )
            .setInteractive({ dropZone: true });

        this.dialogueManager.addToQueue(
            "An old cabin, I wonder if Grandpa used it while out hunting. The door seems to be locked."
        );

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragstart", (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on("dragenter", (pointer, gameObject, dropZone) => {
            if (
                gameObject.texture.key === "cabin-key" &&
                dropZone === this.door
            ) {
                // this.door.setTint(0x00ff00);
            }
        });

        this.input.on("dragleave", (pointer, gameObject, dropZone) => {
            if (
                gameObject.texture.key === "cabin-key" &&
                dropZone === this.door
            ) {
                // this.door.clearTint();
            }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.door &&
                gameObject.texture.key === "cabin-key"
            ) {
                this.unlockDoor();
                gameObject.destroy();
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    // collectItem(gameObject, outline, item) {
    //     this.audioManager.playSound("pickup", { loop: false, volume: 0.1 });

    //     if (this.inventoryManager) {
    //         this.inventoryManager.showInfoCard(item);
    //     }

    //     Inventory.addItem(item);
    //     gameObject.destroy();
    //     outline.destroy();

    //     this.collectedItems++;
    //     this.dialogueManager.addToQueue(`I found a ${item.name}. ${item.clue}`);

    //     if (this.inventoryDisplay) {
    //         this.inventoryDisplay.update();
    //     }

    //     const keyObject = this.children.getByName("cabin-key");
    //     if (keyObject) {
    //         keyObject.setInteractive({ draggable: true });
    //     }
    // }

    unlockDoor() {
        if (!this.doorUnlocked) {
            this.doorUnlocked = true;
            // this.dialogueManager.addToQueue(
            //     "The key fits! The cabin door is now unlocked."
            // );
            Inventory.removeItem("cabin-key");
            this.events.emit("updateInventory");

            this.scene.start("InsideCabinScene");
        }
    }

    update() {
        super.update();
    }
}
