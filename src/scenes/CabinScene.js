import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import InventoryDisplay from "../InventoryDisplay";
import InventoryManager from "../InventoryManager";
import gameMap from "../GameMap";

export default class CabinScene extends Scene {
    constructor() {
        super("CabinScene");
        this.collectedItems = 0;
        this.totalItems = 1;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.isMapDisplayed = false;
        this.mapLocations = [];
    }

    create() {
        this.dialogueManager = new DialogueManager(this);
        this.inventoryManager = new InventoryManager(this);

        this.add.image(0, 0, "cabin").setOrigin(0);

        const items = [
            {
                key: "letter3",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                description: "Another letter, with a big reveal.",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "An old cabin, I wonder if Grandpa used it while out hunting."
        );

        this.inventoryDisplay = new InventoryDisplay(this);
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

        gameObject.on("pointerdown", () => {
            this.collectItem(gameObject, item);
        });
    }

    collectItem(gameObject, item) {
        this.dialogueManager.addToQueue(item.description);

        gameObject.destroy();

        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;

            this.dialogueManager.addToQueue(
                "You've collected everything! The adventure ends here."
            );

            this.time.delayedCall(3000, () => {
                this.scene.start("GameOverScene");
            });
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
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

        mapDisplay.on("pointerdown", () => {
            mapDisplay.destroy();
            this.isMapDisplayed = false;

            // Destroy all location icons when closing the map
            this.mapLocations.forEach((location) => location.destroy());
            this.mapLocations.length = 0;
        });

        // Create and manage location icons
        const locations = gameMap.getAllLocations();

        locations.forEach((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2);

            if (
                gameMap
                    .getAvailableLocations()
                    .some((loc) => loc.key === location.key)
            ) {
                locationIcon
                    .setInteractive({ useHandCursor: true })
                    .on("pointerdown", (pointer, localX, localY, event) => {
                        event.stopPropagation(); // Prevent map click event
                        gameMap.markLocationVisited(location.key);
                        mapDisplay.destroy(); // Close map before starting new scene
                        this.isMapDisplayed = false;
                        locationIcon.destroy();
                        this.scene.start(location.scene);
                    });
                locationIcon.input.priorityID = 1; // Higher priority for location icons
            } else {
                locationIcon.setAlpha(0.5);
                locationIcon.setTint(0x808080);
                locationIcon.disableInteractive();
            }

            // Add to map locations for management
            this.mapLocations.push(locationIcon);
        });
    }
}
