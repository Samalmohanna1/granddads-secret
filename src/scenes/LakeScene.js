import BaseScene from "./BaseScene";

export default class LakeScene extends BaseScene {
    constructor() {
        super("LakeScene");
        this.totalItems = 1;
    }

    create() {
        super.create();
        const audioManager = this.game.registry.get("audioManager");

        audioManager.stopAmbientSound();

        audioManager.playAmbientSound("nature-one", {
            loop: true,
            volume: 0.1,
        });

        this.add.image(0, 0, "lake").setOrigin(0);

        const boat = this.add
            .image(
                this.cameras.main.width - 600,
                this.cameras.main.height - 200,
                "boat"
            )
            .setInteractive({
                useHandCursor: true,
            });

        boat.on("pointerdown", () => {
            this.allItemsCollected = true;
            this.onAllItemsCollected();
            this.events.emit("allItemsCollected");
        });

        this.dialogueManager.addToQueue(
            "There's something tall out in the water, I could use this boat to reach it."
        );
    }

    onAllItemsCollected() {
        this.scene.start("TallmanLakeScene");
    }
}
