import globals from "./globals.js";
import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";
import KitchenScene from "./scenes/KitchenScene";
import KitchenTableScene from "./scenes/KitchenTableScene";

const config = {
    type: Phaser.AUTO,
    width: 1900,
    height: 900,
    scene: [MenuScene, KitchenScene, KitchenTableScene],
};

const game = new Phaser.Game(config);
game.globals = globals;
