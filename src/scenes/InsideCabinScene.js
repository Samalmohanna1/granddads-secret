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
        this.input.setDefaultCursor("default");

        this.add.image(0, 0, "cabin-inside").setOrigin(0);
        this.can = this.add.image(
            this.cameras.main.width / 2 - 180,
            this.cameras.main.height / 2 - 250,
            "can"
        );

        this.canZone = this.add
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

        this.dialogueManager.addToQueue(
            "It's pretty dusty in here. Hmm I wonder where the next clue is."
        );

        this.input.on("dragstart", (pointer, gameObject) => {
            if (gameObject.texture.key === "can-opener") {
                this.draggingOpener
                    .setPosition(pointer.x, pointer.y)
                    .setVisible(true);

                this.input.setDefaultCursor("grabbing");
            }
        });

        this.input.on("drag", (pointer, gameObject) => {
            if (gameObject.texture.key === "can-opener") {
                this.draggingOpener.setPosition(pointer.x, pointer.y);
            }
        });

        this.input.on("drop", (pointer, gameObject, dropZone) => {
            if (
                dropZone === this.canZone &&
                gameObject.texture.key === "can-opener"
            ) {
                gameObject.destroy();
                this.draggingOpener.setVisible(false);

                this.input.setDefaultCursor("");
                this.can.setTexture("can-opened");
                this.openCan();
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

            this.input.setDefaultCursor("");
            if (this.draggingOpener.visible) {
                this.draggingOpener.setVisible(false);
            }
        });
    }

    openCan() {
        if (!this.canOpened) {
            this.canOpened = true;
            Inventory.removeItem("can-opener");
            this.events.emit("updateInventory");

            const finalLetter = this.add
                .image(
                    this.cameras.main.width / 2,
                    this.cameras.main.height / 2,
                    "letter-two-open"
                )
                .setOrigin(0.5);

            finalLetter.setAlpha(0);
            this.tweens.add({
                targets: finalLetter,
                alpha: 1,
                duration: 1000,
                ease: "Power2",
            });

            finalLetter.setInteractive();
            finalLetter.on("pointerdown", () => {
                this.tweens.add({
                    targets: finalLetter,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        finalLetter.destroy();
                        this.scene.start("GameOverScene");
                    },
                });
            });

            this.dialogueManager.addToQueue("I found another letter!");
        }
    }

    update() {
        super.update();
    }
}
