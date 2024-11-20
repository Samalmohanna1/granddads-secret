export function createDialogue(scene, text) {
    const { dialogueBoxX, dialogueBoxY, textPadding } = scene.game.globals;

    const dialogueBox = scene.add
        .rectangle(dialogueBoxX, dialogueBoxY, 700, 100, 0x000000, 0.7)
        .setOrigin(0);
    const dialogueText = scene.add
        .text(dialogueBoxX + textPadding, dialogueBoxY + textPadding, text, {
            fontSize: "24px",
            fill: "#ffffff",
            wordWrap: { width: 650 },
        })
        .setOrigin(0);

    scene.time.delayedCall(5000, () => {
        dialogueBox.destroy();
        dialogueText.destroy();
    });

    return { dialogueBox, dialogueText };
}
