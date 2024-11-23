class GameMap {
    constructor() {
        this.availableLocations = [];
        this.visitedLocations = [];
    }

    addLocation(locationKey, sceneName, x, y, imageKey) {
        this.availableLocations.push({
            key: locationKey,
            scene: sceneName,
            x,
            y,
            imageKey,
        });
    }

    getAvailableLocations() {
        return this.availableLocations;
    }

    markLocationVisited(locationKey) {
        const index = this.availableLocations.findIndex(
            (loc) => loc.key === locationKey
        );
        if (index !== -1) {
            const location = this.availableLocations.splice(index, 1)[0];
            this.visitedLocations.push(location);
        }
    }

    getAllLocations() {
        return [...this.availableLocations, ...this.visitedLocations];
    }
}

const gameMap = new GameMap();
export default gameMap;
