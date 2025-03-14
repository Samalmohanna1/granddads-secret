import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: "Loading...",
            style: {
                font: "24px UbuntuMono",
                fill: "#e1e1e1",
            },
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 140,
            text: "0%",
            style: {
                font: "24px UbuntuMono",
                fill: "#e1e1e1",
            },
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on("progress", function (value) {
            percentText.setText(parseInt(value * 100) + "%");
        });

        this.load.on("complete", function () {
            loadingText.destroy();
            percentText.destroy();
        });

        this.loadAssets();
    }

    loadAssets() {
        this.load.setPath("assets");

        this.load.image("studio-logo", "studio-logo.png");

        this.load.image("menu", "scenes/menu.jpg");
        this.load.image("gameover", "scenes/gameover.jpg");
        this.load.image("kitchen", "scenes/kitchen.jpg");
        this.load.image("kitchen-table", "scenes/kitchen-table.jpg");
        this.load.image("lake", "scenes/lake.jpg");
        this.load.image("tallman", "scenes/tallman.jpg");
        this.load.image("tallman-open", "scenes/tallman-open.jpg");
        this.load.image("cabin", "scenes/cabin.jpg");
        this.load.image("cabin-inside", "scenes/cabin-inside.jpg");

        this.load.image("gift", "items/gift.png");
        this.load.image("hook", "items/hook.png");
        this.load.image("hook-clue", "items/hook-clue.png");
        this.load.image("letter-one", "items/letter-one.png");
        this.load.image("letter-one-open", "items/letter-one-open.png");
        this.load.image("letter-two-open", "items/letter-two-open.png");
        this.load.image("photo", "items/photo-fishing.png");
        this.load.image("photo-fishing-clue", "items/photo-fishing-clue.png");
        this.load.image("map", "items/map-icon.png");
        this.load.image("map-full", "items/map-full.png");
        this.load.image("photo-cabin", "items/photo-cabin.png");
        this.load.image("photo-cabin-clue", "items/photo-cabin-clue.png");
        this.load.image("can-opener", "items/can-opener.png");
        this.load.image("can-opener-clue", "items/can-opener-clue.png");
        this.load.image("cabin-key", "items/cabin-key.png");
        this.load.image("cabin-key-clue", "items/cabin-key-clue.png");
        this.load.image("can", "items/can.png");
        this.load.image("can-opened", "items/can-opened.png");
        this.load.image("journey1", "items/journey-1.png");
        this.load.image("journey3", "items/journey-3.png");

        this.load.image("startBtn", "ui/startBtn.png");
        this.load.image("playAgainBtn", "ui/playAgainBtn.png");

        this.load.audio("main-theme", "audio/main-theme.mp3");
        this.load.audio("city", "audio/city.mp3");
        this.load.audio("nature-one", "audio/nature-one.mp3");
        this.load.audio("nature-two", "audio/nature-two.mp3");
        this.load.audio("pickup", "audio/pickup-item.mp3");
    }

    create() {
        const logo = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 100,
            "studio-logo"
        );
        logo.setOrigin(0.5);

        this.tweens.add({
            targets: logo,
            y: "+=10",
            duration: 700,
            yoyo: true,
            repeat: -1,
        });

        this.time.delayedCall(1500, () => {
            this.scene.start("MenuScene");
        });
    }
}
