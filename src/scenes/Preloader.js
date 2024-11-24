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
                fill: "#ffffff",
            },
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 140,
            text: "0%",
            style: {
                font: "24px UbuntuMono",
                fill: "#ffffff",
            },
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on("progress", function (value) {
            percentText.setText(parseInt(value * 100) + "%");
        });

        this.load.on("fileprogress", function (file) {
            loadingText.setText("Loading asset: " + file.key);
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

        this.load.image("kitchen", "scenes/kitchen.jpg");
        this.load.image("kitchen-table", "scenes/kitchen-table.jpg");
        this.load.image("lake", "scenes/lake.jpg");
        this.load.image("cabin", "scenes/cabin.jpg");
        this.load.image("gift", "items/gift.jpg");
        this.load.image("hook", "items/hook.jpg");
        this.load.image("letter", "items/letter-one.jpg");
        this.load.image("photo", "items/photo-fishing.jpg");
        this.load.image("map", "items/map-icon.jpg");
        this.load.image("map-full", "items/map-full.png");
        this.load.image("boat", "items/boat.png");
        this.load.image("journey1", "items/journey-1.png");
        this.load.image("journey2", "items/journey-2.png");
        this.load.image("journey3", "items/journey-3.png");
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

        this.time.delayedCall(2000, () => {
            this.scene.start("MenuScene");
        });
    }
}
