import CustomEventEmitter from "./CustomEventEmitter";

export default class DialogueManager extends CustomEventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.queue = [];
        this.isDisplaying = false;
        this.currentDialogueText = null;
        this.dismissButton = null;
    }

    addToQueue(text) {
        this.queue.push(text);
        if (!this.isDisplaying) {
            this.displayNext();
        }
    }

    displayNext() {
        if (this.currentDialogueText) {
            this.currentDialogueText.destroy();
            if (this.dismissButton) {
                this.dismissButton.destroy();
            }
        }

        if (this.queue.length > 0) {
            this.isDisplaying = true;
            const text = this.queue.shift();

            const { dialogueBoxX, dialogueBoxY, textPadding } =
                this.scene.game.globals;

            this.currentDialogueText = this.scene.add
                .text(
                    dialogueBoxX + textPadding,
                    dialogueBoxY + textPadding,
                    text,
                    {
                        font: "32px UbuntuMono",
                        fill: "#e1e1e1",
                        wordWrap: { width: 650 },
                    }
                )
                .setBackgroundColor("#000000")
                .setOrigin(0)
                .setDepth(50);

            this.currentDialogueText.setLineSpacing(12);
            this.currentDialogueText.setPadding(60);

            const buttonX = this.currentDialogueText.width - textPadding * 4.5;
            const buttonY = this.currentDialogueText.height + textPadding * 1.2;
            this.dismissButton = this.scene.add
                .text(buttonX, buttonY, "continue", {
                    font: "24px UbuntuMono",
                    fill: "#e1e1e1",
                })
                .setInteractive({ useHandCursor: true })
                .setDepth(51);

            this.dismissButton.setAlpha(0.8);
            this.dismissButton.on("pointerdown", () => {
                this.currentDialogueText.destroy();
                this.currentDialogueText = null;
                this.dismissButton.destroy();
                this.displayNext();
            });
        } else {
            this.isDisplaying = false;
            this.emit("allDialoguesDisplayed");
        }
    }
}
