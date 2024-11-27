import { Scene } from "phaser";
import DialogueManager from "../DialogueManager";
import InventoryDisplay from "../InventoryDisplay";
import InventoryManager from "../InventoryManager";
import gameMap from "../GameMap";

export default class BaseScene extends Scene {
    constructor(key) {
        super(key);
        this.collectedItems = 0;
        this.totalItems = 0;
        this.inventoryDisplay = null;
        this.allItemsCollected = false;
        this.isMapDisplayed = false;
        this.mapLocations = [];
    }

    create() {
        this.dialogueManager = new DialogueManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.inventoryDisplay = new InventoryDisplay(this);

        this.setupInventoryDisplay();
    }

    setupInventoryDisplay() {
        const background = this.add
            .rectangle(
                0,
                this.cameras.main.height - 160,
                this.cameras.main.width,
                160,
                0x090909,
                0.7
            )
            .setOrigin(0, 0);

        const label = this.add.text(
            10,
            this.cameras.main.height - 150,
            "Inventory:",
            { font: "18px UbuntuMono", fill: "#e1e1e1" }
        );
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
            this.collectItem(gameObject, outline, item);
        });
    }

    collectItem(gameObject, outline, item) {
        if (this.inventoryManager) {
            this.inventoryManager.showInfoCard(item);
        }

        Inventory.addItem(item);

        gameObject.destroy();
        outline.destroy();

        this.collectedItems++;

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.events.emit("allItemsCollected");
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    displayMap() {
        if (this.isMapDisplayed) return;

        this.isMapDisplayed = true;

        this.mapDisplay = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "map-full"
            )
            .setOrigin(0.5)
            .setScale(0.2)
            .setInteractive();

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
                locationIcon.input.priorityID = 1;
            } else {
                locationIcon.setAlpha(0.5);
                locationIcon.setTint(0x808080);
                locationIcon.disableInteractive();
            }

            return locationIcon;
        });
        if (this.mapDisplay) {
            this.mapDisplay.setInteractive();
            this.mapDisplay.on("pointerdown", this.closeMap, this);
            this.mapDisplay.input.priorityID = 0; // Lower priority
        }
    }

    closeMap() {
        if (this.isMapDisplayed) {
            this.mapLocations.forEach((location) => location.destroy());
            this.mapLocations = [];
            this.mapDisplay.destroy();
            this.isMapDisplayed = false;
        }
    }

    onAllItemsCollected() {
        // To be overridden in child scenes
    }
}
