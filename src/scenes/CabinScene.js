import BaseScene from "./BaseScene";
import Inventory from "../Inventory";

export default class CabinScene extends BaseScene {
    constructor() {
        super("CabinScene");
        this.totalItems = 0;
        this.doorUnlocked = false;
        this.draggingKey = null;
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
            .zone(
                this.cameras.main.width / 2 + 250,
                this.cameras.main.height / 2 + 200,
                200,
                250
            )
            .setDropZone();

        this.draggingKey = this.add
            .image(0, 0, "cabin-key")
            .setVisible(false)
            .setScale(0.3);

        this.dialogueManager.addToQueue(
            "An old cabin, I wonder if Grandpa used it while out hunting. The door seems to be locked."
        );

        this.input.on("dragstart", (pointer, gameObject) => {
            if (gameObject.texture.key === "cabin-key") {
                this.draggingKey
                    .setPosition(pointer.x, pointer.y)
                    .setVisible(true);
            }
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (gameObject.texture.key === "cabin-key") {
                this.draggingKey.setPosition(pointer.x, pointer.y);
            }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.door &&
                gameObject.texture.key === "cabin-key"
            ) {
                gameObject.destroy();
                this.draggingKey.setVisible(false);
                this.unlockDoor();
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    unlockDoor() {
        if (!this.doorUnlocked) {
            this.doorUnlocked = true;
            Inventory.removeItem("cabin-key");
            this.events.emit("updateInventory");

            this.scene.start("InsideCabinScene");
        }
    }

    update() {
        super.update();
    }
}
