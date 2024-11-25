import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import InventoryDisplay from "../InventoryDisplay";
import gameMap from "../GameMap";

export default class LakeScene extends Scene {
    constructor() {
        super("LakeScene");
        this.collectedItems = 0;
        this.totalItems = 1;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.isMapDisplayed = false;
        this.mapLocations = [];
    }

    create() {
        this.dialogueManager = new DialogueManager(this);
        this.add.image(0, 0, "lake").setOrigin(0);

        const items = [
            {
                key: "boat",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 200,
                description:
                    "Wait, is this the same boat we used on that trip all those years ago?",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "There's something out in the water, I could use this boat to reach it."
        );

        this.inventoryDisplay = new InventoryDisplay(this);

        this.dialogueManager.on("allDialoguesDisplayed", () => {
            if (this.allItemsCollected) {
                this.displayMap();
            }
        });
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

        const outline = this.add.graphics();
        outline.lineStyle(6, 0xf96f28);
        outline.strokeRect(
            item.x - gameObject.width / 2 - 3,
            item.y - gameObject.height / 2 - 3,
            gameObject.width + 6,
            gameObject.height + 6
        );
        outline.setVisible(false);

        gameObject.on("pointerover", () => {
            outline.setVisible(true);
        });

        gameObject.on("pointerout", () => {
            outline.setVisible(false);
        });

        gameObject.on("pointerdown", () => {
            this.unlockNextLocation();
            this.dialogueManager.addToQueue(
                "I should check the map for my next destination."
            );
            this.displayMap();
        });
    }

    unlockNextLocation() {
        gameMap.addLocation("cabin", "CabinScene", 955, 540, "journey3");

        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
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

        const locations = gameMap.getAllLocations();
        locations.forEach((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2)
                .setInteractive({ useHandCursor: true });

            if (
                gameMap
                    .getAvailableLocations()
                    .some((loc) => loc.key === location.key)
            ) {
                locationIcon
                    .setInteractive({ useHandCursor: true })
                    .on("pointerdown", () => {
                        gameMap.markLocationVisited(location.key);
                        this.scene.start(location.scene);
                    });
            } else {
                locationIcon.setAlpha(0.5);
                locationIcon.disableInteractive();
                locationIcon.input.cursor = "default";
            }

            this.mapLocations.push(locationIcon);
        });

        mapDisplay.on("pointerdown", () => {
            mapDisplay.destroy();
            this.isMapDisplayed = false;

            this.mapLocations.forEach((location) => location.destroy());
            this.mapLocations.length = 0;
        });
    }
}
