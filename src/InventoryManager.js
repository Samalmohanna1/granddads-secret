import CustomEventEmitter from "./CustomEventEmitter";

export default class InventoryManager extends CustomEventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.currentInfoCard = null;
        this.dismissButton = null;
    }

    showInfoCard(item) {
        if (this.currentInfoCard) {
            this.hideInfoCard();
        }

        const { width, height } = this.scene.sys.game.config;

        this.currentInfoCard = this.scene.add
            .rectangle(width / 2, height / 2 - 100, 1200, 800, 0x0d1011, 1)
            .setOrigin(0.5);

        const itemImage = this.scene.add
            .image(width / 2 - 600, height / 2 - 540, item.infoImageKey)
            .setScale(0.8)
            .setOrigin(0);

        const itemClue = this.scene.add
            .text(width / 2 + 50, height / 2 - 250, item.clue, {
                font: "24px UbuntuMono",
                fill: "#e1e1e1",
                wordWrap: { width: 350 },
            })
            .setOrigin(0);

        const itemName = this.scene.add
            .text(width / 2 + 50, height / 2 - 300, item.name, {
                font: "32px UbuntuMono",
                fill: "#e1e1e1",
            })
            .setOrigin(0);

        this.dismissButton = this.scene.add
            .text(width / 2 + 300, height / 2 + 200, "Close", {
                font: "24px UbuntuMono",
                fill: "#e1e1e1",
            })
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });
        this.dismissButton.setAlpha(0.8);
        this.dismissButton.on("pointerdown", this.hideInfoCard.bind(this));

        this.currentInfoCard = this.scene.add.group([
            this.currentInfoCard,
            itemImage,
            itemClue,
            itemName,
            this.dismissButton,
        ]);
    }

    hideInfoCard() {
        if (this.currentInfoCard) {
            this.currentInfoCard.destroy(true);
            this.currentInfoCard = null;
        }
        if (this.dismissButton) {
            this.dismissButton.destroy();
            this.dismissButton = null;
        }
    }
}
