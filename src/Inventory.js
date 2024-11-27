class Inventory {
    static items = [];

    static addItem(item) {
        this.items.push(item);
    }

    static getItems() {
        return this.items;
    }

    static hasItem(key) {
        return this.items.some((item) => item.key === key);
    }

    static removeItem(itemKey) {
        const index = this.items.findIndex((item) => item.key === itemKey);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}

export default Inventory;
