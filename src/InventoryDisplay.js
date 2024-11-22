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
            this.scene.cameras.main.height - 100,
            this.scene.cameras.main.width,
            100,
            0x090909,
            0.7
        );
        background.setOrigin(0, 0);

        // Add inventory title
        this.scene.add.text(
            10,
            this.scene.cameras.main.height - 90,
            "Inventory:",
            { fontSize: "24px", fill: "#ffffff" }
        );
    }

    update() {
        // Clear existing inventory display
        this.inventoryDisplayItems.forEach((item) => item.destroy());
        this.inventoryDisplayItems = [];

        // Get items from global inventory
        const items = Inventory.getItems();

        // Display each item in the inventory
        items.forEach((itemKey, index) => {
            const x = 150 + index * 150;
            const y = this.scene.cameras.main.height - 120;

            const itemDisplay = this.scene.add
                .image(x, y, itemKey)
                .setScale(0.5);
            this.inventoryDisplayItems.push(itemDisplay);

            // Add item name below the icon
            const itemName = this.scene.add.text(x, y + 50, itemKey, {
                fontSize: "16px",
                fill: "#090909",
                align: "center",
            });
            itemName.setOrigin(0.5, 0);
            this.inventoryDisplayItems.push(itemName);
        });
    }
}

export default InventoryDisplay;
