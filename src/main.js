import globals from "./globals.js";
import { Game, AUTO } from "phaser";
import MenuScene from "./scenes/MenuScene";
import KitchenScene from "./scenes/KitchenScene";
import KitchenTableScene from "./scenes/KitchenTableScene";
import LakeScene from "./scenes/LakeScene.js";
import CabinScene from "./scenes/CabinScene.js";

const config = {
    type: AUTO,
    width: 1900,
    height: 900,
    scene: [MenuScene, KitchenScene, KitchenTableScene, LakeScene, CabinScene],
};

const game = new Game(config);
game.globals = globals;
