export default class DialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.isDisplaying = false;
        this.currentDialogueBox = null;
        this.currentDialogueText = null;
    }

    addToQueue(text) {
        this.queue.push(text);
        if (!this.isDisplaying) {
            this.displayNext();
        }
    }

    displayNext() {
        if (this.currentDialogueBox) {
            this.currentDialogueBox.destroy();
            this.currentDialogueText.destroy();
        }

        if (this.queue.length > 0) {
            this.isDisplaying = true;
            const text = this.queue.shift();

            const { dialogueBoxX, dialogueBoxY, textPadding } =
                this.scene.game.globals;

            // this.currentDialogueBox = this.scene.add
            //     .rectangle(dialogueBoxX, dialogueBoxY, 700, 100, 0x000000, 1)
            //     .setOrigin(0);

            this.currentDialogueText = this.scene.add
                .text(
                    dialogueBoxX + textPadding,
                    dialogueBoxY + textPadding,
                    text,
                    {
                        fontSize: "32px",
                        fill: "#e1e1e1",
                        wordWrap: { width: 650 },
                    }
                )
                .setBackgroundColor("#000000")
                .setOrigin(0);

            this.currentDialogueText.setLineSpacing(12);
            this.currentDialogueText.setPadding(60);

            this.scene.time.delayedCall(2800, () => {
                this.currentDialogueBox.destroy();
                this.currentDialogueText.destroy();
                this.currentDialogueBox = null;
                this.currentDialogueText = null;
                this.displayNext();
            });
        } else {
            this.isDisplaying = false;
        }
    }
}
