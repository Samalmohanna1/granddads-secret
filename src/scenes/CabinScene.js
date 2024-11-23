import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";
import gameMap from "../GameMap"; // Import GameMap instance

export default class CabinScene extends Scene {
    constructor() {
        super("CabinScene");
        this.collectedItems = 0;
        this.totalItems = 1; // Total items to collect
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.isMapDisplayed = false; // Track if map is displayed
        this.mapLocations = []; // Store map location icons if needed
    }

    create() {
        this.dialogueManager = new DialogueManager(this);
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
        // Add dialogue for collecting the item
        this.dialogueManager.addToQueue(item.description);

        // Destroy the collectible item
        gameObject.destroy();

        this.collectedItems++;

        // Check if all items have been collected
        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;

            // Trigger final dialogue and transition to GameOver scene
            this.dialogueManager.addToQueue(
                "You've collected everything! The adventure ends here."
            );

            // Wait for a moment before transitioning to GameOverScene
            this.time.delayedCall(3000, () => {
                // Wait for 3 seconds
                this.scene.start("GameOverScene");
            });
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    displayMap() {
        if (this.isMapDisplayed) return;

        // Set flag to indicate map is displayed
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

        // Create map locations based on GameMap
        const locations = gameMap.getAllLocations();
        locations.forEach((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2) // Set scale for location icons
                .setInteractive({ useHandCursor: true });

            if (
                gameMap
                    .getAvailableLocations()
                    .some((loc) => loc.key === location.key)
            ) {
                locationIcon.on("pointerdown", () => {
                    gameMap.markLocationVisited(location.key);
                    // Transition to the selected scene
                    this.scene.start(location.scene);
                });
            } else {
                locationIcon.setAlpha(0.5); // Adjust alpha for visited locations instead of tinting
                locationIcon.setInteractive({ useHandCursor: false }); // Make them unclickable
            }

            // Store reference to location icon for later destruction
            this.mapLocations.push(locationIcon);
        });

        mapDisplay.on("pointerdown", () => {
            // Close the map when clicked anywhere on it
            mapDisplay.destroy();
            this.isMapDisplayed = false; // Reset flag when closed

            // Destroy all location icons when closing the map
            this.mapLocations.forEach((location) => location.destroy());
            // Clear the array of map locations
            this.mapLocations.length = 0;
        });
    }
}
