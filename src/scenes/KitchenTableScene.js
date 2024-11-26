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
        this.dialogueManager.addToQueue(item.description);

        Inventory.addItem(item);

        gameObject.destroy();
        outline.destroy();

        this.collectedItems++;

        if (item.key === "map") {
            this.displayMap();
        }

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.events.emit("allItemsCollected");
        }

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
            .setInteractive({ useHandCursor: false });

        this.createMapLocations();

        this.mapDisplay.on("pointerdown", () => {
            this.closeMap();
        });
    }

    createMapLocations() {
        const locations = gameMap.getAllLocations();
        this.mapLocations = locations.map((location) => {
            const locationIcon = this.add
                .image(location.x, location.y, location.imageKey)
                .setScale(0.2)
                .setInteractive({
                    useHandCursor: true,
                });

            if (
                gameMap
                    .getAvailableLocations()
                    .some((loc) => loc.key === location.key)
            ) {
                locationIcon.on("pointerdown", (pointer) => {
                    gameMap.markLocationVisited(location.key);
                    this.scene.start(location.scene);
                });
            } else {
                locationIcon.setTint(0x808080);
                locationIcon.setInteractive({ useHandCursor: false });
            }

            return locationIcon;
        });
    }

    closeMap() {
        if (this.mapDisplay) {
            this.mapDisplay.destroy();
            this.mapDisplay = null;
        }
        this.mapLocations.forEach((location) => location.destroy());
        this.mapLocations = [];
    }

    update() {
        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }
}
