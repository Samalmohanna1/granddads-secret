import globals from "./globals.js";
import { Game, AUTO } from "phaser";
import MenuScene from "./scenes/MenuScene";
import KitchenScene from "./scenes/KitchenScene";
import KitchenTableScene from "./scenes/KitchenTableScene";
import LakeScene from "./scenes/LakeScene.js";
import CabinScene from "./scenes/CabinScene.js";
import Preloader from "./scenes/Preloader.js";

const config = {
    type: AUTO,
    width: 1900,
    height: 900,
    scene: [
        Preloader,
        MenuScene,
        KitchenScene,
        KitchenTableScene,
        LakeScene,
        CabinScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Game(config);
game.globals = globals;
