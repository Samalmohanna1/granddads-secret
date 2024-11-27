import BaseScene from "./BaseScene";
import gameMap from "../GameMap";

export default class TallmanLakeScene extends BaseScene {
    constructor() {
        super("TallmanLakeScene");
        this.totalItems = 1;
    }

    create() {
        super.create();

        this.add
            .image(0, 30, "lake")
            .setOrigin(0.3)
            .setScale(1.8)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.dialogueManager.addToQueue(
                    "I should check the map for the cabin location."
                );
                gameMap.addLocation(
                    "cabin",
                    "CabinScene",
                    955,
                    540,
                    "journey3"
                );
            });

        this.dialogueManager.addToQueue(
            "Wow, it looks like it’s holding something special. A tackle box? I wonder what secrets are inside... But it’s locked tight. I’ll need to find a way to open it."
        );
    }

    onAllItemsCollected() {
        gameMap.addLocation("cabin", "CabinScene", 955, 540, "journey3");
        this.dialogueManager.addToQueue(
            "I should check the map, maybe the cabin is marked."
        );
    }
}
