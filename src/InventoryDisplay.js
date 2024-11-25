import Inventory from "./Inventory";

class InventoryDisplay {
    constructor(scene) {
        this.scene = scene;
        this.inventoryDisplayItems = [];
        this.setupDisplay();
    }

    setupDisplay() {
        const background = this.scene.add.rectangle(
            0,
            this.scene.cameras.main.height - 160,
            this.scene.cameras.main.width,
            160,
            0x090909,
            0.7
        );
        background.setOrigin(0, 0);

        this.scene.add.text(
            10,
            this.scene.cameras.main.height - 150,
            "Inventory:",
            { font: "18px UbuntuMono", fill: "#e1e1e1" }
        );
    }

    update() {
        const items = Inventory.getItems();

        while (this.inventoryDisplayItems.length > items.length) {
            const item = this.inventoryDisplayItems.pop();
            item.destroy();
        }

        items.forEach((item, index) => {
            const x = 50 + index * 100;
            const y = this.scene.cameras.main.height - 80;

            if (index >= this.inventoryDisplayItems.length) {
                const itemDisplay = this.scene.add
                    .image(x, y, item.key)
                    .setScale(0.25)
                    .setInteractive({
                        useHandCursor: true,
                    })
                    .setDepth(10);

                itemDisplay.on("pointerdown", () => {
                    if (item.key === "map") {
                        this.scene.displayMap();
                    } else {
                        this.onItemClick(item);
                    }
                });

                const itemName = this.scene.add.text(x, y + 50, item.key, {
                    fontSize: "18px",
                    fill: "#e1e1e1",
                    align: "center",
                });
                itemName.setOrigin(0.5, 0);
                itemName.setDepth(11);

                this.inventoryDisplayItems.push({
                    display: itemDisplay,
                    text: itemName,
                });
            } else {
                const inventoryItem = this.inventoryDisplayItems[index];
                inventoryItem.display.setTexture(item.key);
                inventoryItem.display.setPosition(x, y);
                inventoryItem.text.setText(item.key);
                inventoryItem.text.setPosition(x, y + 50);
            }
        });
    }

    onItemClick(item) {
        if (this.scene.dialogueManager) {
            this.scene.dialogueManager.addToQueue(item.description);
        } else {
            console.warn("DialogueManager not found in the scene");
        }
    }
}

export default InventoryDisplay;
