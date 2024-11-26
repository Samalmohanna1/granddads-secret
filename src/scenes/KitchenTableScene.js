import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import Inventory from "../Inventory";
import InventoryDisplay from "../InventoryDisplay";
import InventoryManager from "../InventoryManager";
import gameMap from "../GameMap";

export default class KitchenTableScene extends Scene {
    constructor() {
        super("KitchenTableScene");
        this.collectedItems = 0;
        this.totalItems = 4;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.mapDisplay = null;
        this.mapLocations = [];
    }

    create() {
        this.dialogueManager = new DialogueManager(this);
        this.inventoryManager = new InventoryManager(this);

        this.add.image(0, 0, "kitchen-table").setOrigin(0);

        const items = [
            {
                key: "hook",
                x: this.cameras.main.width - 200,
                y: this.cameras.main.height - 600,
                name: "Fishing Hook",
                description: "A rusty old fishing hook. It looks well-used.",
                infoImageKey: "hook-clue",
                clue: "This hook might be useful for fishing.",
            },
            {
                key: "letter-one",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                name: "Grandpa's Letter",
                description:
                    "A letter from Grandpa. It mentions a secret fishing spot.",
                infoImageKey: "letter-one-open",
                clue: "The letter suggests checking the map for a fishing spot.",
            },
            {
                key: "photo",
                x: this.cameras.main.width - 300,
                y: this.cameras.main.height - 300,
                name: "Old Photo",
                description: "A photo of Grandpa fishing. He looks so happy!",
                infoImageKey: "photo-fishing-clue", // Key for the photo's detailed image
                clue: "This photo shows Grandpa's favorite fishing spot.",
            },
            {
                key: "map",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 300,
                name: "Marked Map",
                description:
                    "An old map with a location marked. Could this be the secret spot?",
            },
        ];

        items.forEach((item) => this.createCollectibleItem(item));

        this.dialogueManager.addToQueue(
            "I wasn't expecting any packages, let's see what's inside. There's a letter here."
        );

        this.inventoryDisplay = new InventoryDisplay(this);

        this.events.on("allItemsCollected", this.onAllItemsCollected, this);
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
            this.collectItem(gameObject, outline, item);
        });
    }

    collectItem(gameObject, outline, item) {
        // Destroy the game object and outline
        gameObject.destroy();
        outline.destroy();

        // Add item to inventory
        Inventory.addItem(item);

        // Increment collected items count
        this.collectedItems++;

        // Check if the collected item is the map
        if (item.key === "map") {
            // Only display the map, do not show info card
            this.displayMap();
        } else {
            // Show info card for other items
            if (this.inventoryManager) {
                this.inventoryManager.showInfoCard(item);
            } else {
                console.warn("InventoryManager not found in the scene");
            }
        }

        // Check if all items have been collected
        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.events.emit("allItemsCollected");
        }

        // Update inventory display
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    onAllItemsCollected() {
        this.dialogueManager.addToQueue(
            "I've collected everything. I should check the map for the next location."
        );
        gameMap.addLocation("lake", "LakeScene", 950, 530, "journey1");
    }

    displayMap() {
        if (this.mapDisplay) return;

        this.mapDisplay = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "map-full"
            )
            .setOrigin(0.5)
            .setScale(0.2)
            .setInteractive();

        // Add a click event to close the map when clicking anywhere on it
        this.mapDisplay.on("pointerdown", this.closeMap, this);

        this.createMapLocations();
    }

    createMapLocations() {
        const locations = gameMap.getAllLocations();
        this.mapLocations = locations.map((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2);

            if (
                gameMap
                    .getAvailableLocations()
                    .some((loc) => loc.key === location.key)
            ) {
                locationIcon.setInteractive({
                    useHandCursor: true,
                    pixelPerfect: true,
                });
                locationIcon.on("pointerdown", () => {
                    gameMap.markLocationVisited(location.key);
                    this.closeMap();
                    this.scene.start(location.scene);
                });
                locationIcon.input.priorityID = 1; // Higher priority
            } else {
                locationIcon.setTint(0x808080);
            }

            return locationIcon;
        });

        // Ensure the map's click event has lower priority
        if (this.mapDisplay) {
            this.mapDisplay.setInteractive();
            this.mapDisplay.on("pointerdown", this.closeMap, this);
            this.mapDisplay.input.priorityID = 0; // Lower priority
        }
    }

    closeMap() {
        if (this.mapDisplay) {
            this.mapDisplay.destroy();
            this.mapDisplay = null;
        }
        if (this.mapLocations) {
            this.mapLocations.forEach((location) => location.destroy());
            this.mapLocations = [];
        }
    }

    update() {
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
