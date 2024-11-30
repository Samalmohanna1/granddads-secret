import Inventory from "./Inventory";

class InventoryDisplay {
    constructor(scene) {
        this.scene = scene;
        this.inventoryDisplayItems = [];
        this.background = null;
        this.setupDisplay();
    }

    setupDisplay() {
        this.background = this.scene.add.rectangle(
            0,
            this.scene.cameras.main.height - 130,
            this.scene.cameras.main.width,
            130,
            0x0d1011,
            0.7
        );
        this.background.setOrigin(0, 0);
        this.background.setDepth(9);
        // this.inventoryLabel = this.scene.add.text(
        //     10,
        //     this.scene.cameras.main.height - 150,
        //     "Inventory:",
        //     { font: "18px UbuntuMono", fill: "#0d1011" }
        // );
        // this.inventoryLabel.setDepth(10);
    }

    update() {
        const items = Inventory.getItems();

        this.inventoryDisplayItems = this.inventoryDisplayItems.filter(
            (displayItem) => {
                if (
                    !items.some(
                        (item) => item.key === displayItem.display.texture.key
                    )
                ) {
                    displayItem.display.destroy();
                    displayItem.text.destroy();
                    return false;
                }
                return true;
            }
        );

        items.forEach((item, index) => {
            const x = 80 + index * 115;
            const y = this.scene.cameras.main.height - 80;

            if (index >= this.inventoryDisplayItems.length) {
                const itemDisplay = this.scene.add
                    .image(x, y + 30, item.key)
                    .setScale(0.25)
                    .setInteractive({
                        useHandCursor: true,
                        draggable: true,
                    })
                    .setDepth(10);

                this.setupDragEvents(itemDisplay, item);

                const itemName = this.scene.add.text(x, y - 30, item.key, {
                    fontSize: "16px",
                    fill: "#e1e1e1",
                    align: "center",
                });
                itemName.setOrigin(0.5, 0);
                itemName.setDepth(11);

                this.inventoryDisplayItems.push({
                    display: itemDisplay,
                    text: itemName,
                    originalX: x,
                    originalY: y,
                });
            } else {
                const inventoryItem = this.inventoryDisplayItems[index];
                inventoryItem.display.setTexture(item.key);
                inventoryItem.display.setPosition(x, y + 30);
                inventoryItem.text.setText(item.key);
                inventoryItem.text.setPosition(x, y - 40);
                inventoryItem.originalX = x;
                inventoryItem.originalY = y;
            }
        });
    }

    setupDragEvents(itemDisplay, item) {
        let isDragging = false;
        let dragX = 0;
        let dragY = 0;

        itemDisplay.on("dragstart", (pointer, dragX, dragY) => {
            isDragging = true;
            itemDisplay.setDepth(100);
            this.scene.input.setDefaultCursor("grabbing");
        });

        itemDisplay.on("drag", (pointer, dragX, dragY) => {
            itemDisplay.x = pointer.x;
            itemDisplay.y = pointer.y;
        });

        itemDisplay.on("dragend", (pointer, dragX, dragY, dropped) => {
            isDragging = false;
            if (!dropped) {
                const inventoryItem = this.inventoryDisplayItems.find(
                    (i) => i.display === itemDisplay
                );
                itemDisplay.x = inventoryItem.originalX;
                itemDisplay.y = inventoryItem.originalY;
            }
            itemDisplay.setDepth(20);
            this.scene.input.setDefaultCursor("default");
        });

        itemDisplay.on("pointerup", (pointer) => {
            if (!isDragging) {
                if (item.key === "map") {
                    this.scene.displayMap();
                } else {
                    this.onItemClick(item);
                }
            }
        });

        itemDisplay.on("pointerover", () => {
            this.scene.input.setDefaultCursor("grab");
        });

        itemDisplay.on("pointerout", () => {
            if (!isDragging) {
                this.scene.input.setDefaultCursor("default");
            }
        });
    }

    onItemClick(item) {
        if (this.scene.inventoryManager) {
            this.scene.inventoryManager.showInfoCard(item);
        } else {
            console.warn("InventoryManager not found in the scene");
        }
    }
}

export default InventoryDisplay;
