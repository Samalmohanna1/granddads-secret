import globals from "./globals.js";
import { Game, AUTO } from "phaser";
import MenuScene from "./scenes/MenuScene";
import KitchenScene from "./scenes/KitchenScene";
import KitchenTableScene from "./scenes/KitchenTableScene";
import LakeScene from "./scenes/LakeScene.js";
import CabinScene from "./scenes/CabinScene.js";
import Preloader from "./scenes/Preloader.js";
import GameOverScene from "./scenes/GameOver.js";
import TallmanLakeScene from "./scenes/TallmanLakeScene.js";
import InsideCabinScene from "./scenes/InsideCabinScene.js";

const config = {
    type: AUTO,
    width: 1920,
    height: 1080,
    scene: [
        Preloader,
        MenuScene,
        KitchenScene,
        KitchenTableScene,
        LakeScene,
        TallmanLakeScene,
        CabinScene,
        InsideCabinScene,
        GameOverScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    text: {
        style: {
            fontFamily: "UbuntuMono",
        },
    },
    audio: {
        disableWebAudio: false,
    },
};

const game = new Game(config);
game.globals = globals;
