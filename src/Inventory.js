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
}

export default Inventory;
