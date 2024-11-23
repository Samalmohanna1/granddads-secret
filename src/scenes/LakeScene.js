import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";
import gameMap from "../GameMap"; // Import GameMap instance

export default class LakeScene extends Scene {
    constructor() {
        super("LakeScene");
        this.collectedItems = 0;
        this.totalItems = 1; // Total items to collect
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.isMapDisplayed = false; // Track if map is displayed
        this.mapLocations = []; // Store map location icons
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

        // Listen for when all dialogues are displayed
        this.dialogueManager.on("allDialoguesDisplayed", () => {
            if (this.allItemsCollected) {
                // Instead of transitioning directly, show the map
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

        // Create the outline
        const outline = this.add.graphics();
        outline.lineStyle(6, 0xf96f28); // 6px wide orange line
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

        // When the boat is clicked, unlock the next location and show the map
        gameObject.on("pointerdown", () => {
            // Instead of collecting it, just unlock the next location
            this.unlockNextLocation();
            // Optionally display a message or dialogue
            this.dialogueManager.addToQueue(
                "I should check the map for my next destination."
            );
            this.displayMap(); // Show the map immediately after clicking the boat
        });
    }

    unlockNextLocation() {
        // Unlocking the next location by adding it to the GameMap
        gameMap.addLocation("cabin", "CabinScene", 1220, 420, "journey3");

        // Increment collected items count (if necessary)
        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            // You can add any additional logic here if needed
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
            .setScale(0.2) // Set scale to 0.2 as per your requirement
            .setInteractive();

        // Create map locations based on GameMap
        const locations = gameMap.getAllLocations();
        locations.forEach((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2) // Set scale to 0.2 for location icons as well
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
