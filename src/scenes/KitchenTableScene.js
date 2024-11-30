import BaseScene from "./BaseScene";
import gameMap from "../GameMap";
import Inventory from "../Inventory";

export default class KitchenTableScene extends BaseScene {
    constructor() {
        super("KitchenTableScene");
        this.totalItems = 4;
    }

    create() {
        super.create();

        this.add.image(0, 0, "kitchen-table").setOrigin(0);

        const items = [
            {
                key: "hook",
                x: this.cameras.main.width - 200,
                y: this.cameras.main.height - 600,
                name: "Fishing Hook",
                description:
                    "A rusty old fishing hook. It looks too big for river fishing.",
                infoImageKey: "hook-clue",
                clue: "You twist the hook and find a hidden key.",
            },
            {
                key: "letter-one",
                x: this.cameras.main.width - 600,
                y: this.cameras.main.height - 600,
                name: "Grandpa's Letter",
                description: "A letter from Grandpa.",
                infoImageKey: "letter-one-open",
                clue: "The letter says my adventure starts at Grandpa's favorite fishing spot.",
            },
            {
                key: "photo",
                x: this.cameras.main.width - 300,
                y: this.cameras.main.height - 300,
                name: "Old Photo",
                description:
                    "A photo of Grandpa and I fishing. He looked so happy.",
                infoImageKey: "photo-fishing-clue",
                clue: "Grandpa's favorite fishing spot. X marks the spot.",
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
    }

    collectItem(gameObject, item) {
        this.audioManager.playSound("pickup", {
            loop: false,
            volume: 0.1,
        });

        if (this.inventoryManager) {
            this.inventoryManager.showInfoCard(item);
        }

        Inventory.addItem(item);

        gameObject.destroy();

        this.collectedItems++;

        if (item.key === "map") {
            this.displayMap();
        }

        if (this.collectedItems === this.totalItems) {
            this.allItemsCollected = true;
            this.onAllItemsCollected();
            this.events.emit("allItemsCollected");
        }

        if (this.inventoryDisplay) {
            this.inventoryDisplay.update();
        }
    }

    onAllItemsCollected() {
        super.onAllItemsCollected();
        this.dialogueManager.addToQueue(
            "I should check the map for the fishing location."
        );
        gameMap.addLocation("lake", "LakeScene", 950, 530, "journey1");

        if (this.isMapDisplayed) {
            this.closeMap();
            this.displayMap();
        }
    }
}
