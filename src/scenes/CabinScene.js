import BaseScene from "./BaseScene";
import DialogueManager from "../DialogueManager";
import InventoryDisplay from "../InventoryDisplay";
import InventoryManager from "../InventoryManager";

export default class CabinScene extends BaseScene {
    constructor() {
        super("CabinScene");
    }
    create() {
        super.create();

        this.add
            .image(0, 0, "cabin")
            .setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.scene.start("InsideCabinScene");
            });

        this.dialogueManager.addToQueue(
            "An old cabin, I wonder if Grandpa used it while out hunting."
        );

        this.inventoryDisplay = new InventoryDisplay(this);
    }

    update() {
        super.update();
    }
}
