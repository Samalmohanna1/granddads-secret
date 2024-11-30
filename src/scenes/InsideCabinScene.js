import BaseScene from "./BaseScene";
import Inventory from "../Inventory";

export default class InsideCabinScene extends BaseScene {
    constructor() {
        super("InsideCabinScene");
        this.totalItems = 0;
        this.canOpened = false;
        this.draggingOpener = null;
    }

    create() {
        super.create();

        this.add.image(0, 0, "cabin-inside").setOrigin(0);

        this.can = this.add
            .zone(
                this.cameras.main.width / 2 - 200,
                this.cameras.main.height / 2 - 300,
                200,
                250
            )
            .setDropZone();

        this.draggingOpener = this.add
            .image(0, 0, "can-opener")
            .setVisible(false)
            .setScale(0.3);

        this.dialogueManager.addToQueue("It's pretty dusty in here.");

        this.input.on("dragstart", (pointer, gameObject) => {
            if (gameObject.texture.key === "can-opener") {
                this.draggingOpener
                    .setPosition(pointer.x, pointer.y)
                    .setVisible(true);
            }
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (gameObject.texture.key === "can-opener") {
                this.draggingOpener.setPosition(pointer.x, pointer.y);
            }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.can &&
                gameObject.texture.key === "can-opener"
            ) {
                this.openCan();
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
    openCan() {
        if (!this.canOpened) {
            this.canOpened = true;
            Inventory.removeItem("can-opener");
            this.events.emit("updateInventory");

            this.scene.start("GameOverScene");
        }
    }

    update() {
        super.update();
    }
}
