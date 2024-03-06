import { score } from "$stores";
import type { Unsubscriber } from "svelte/store";

export default class UiScene extends Phaser.Scene {
    private scoreText!: Phaser.GameObjects.Text;
    private coinIcon!: Phaser.GameObjects.Image;

    private gameScene!: Phaser.Scene;

    private scoreUnsub: Unsubscriber | undefined;

    constructor() {
        super('ui');
    }

    init() {
        this.gameScene = this.scene.get('main');
    }

    create() {
        this.setupUiElements();
        this.setupEvents();
    }

    setupUiElements() {
        if (this.scoreUnsub) this.scoreUnsub();

        // create the score text game object
        this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', color: '#fff' });

        // create coin icon
        this.coinIcon = this.add.image(15, 15, 'items', 3);
    }

    setupEvents() {
        this.events.on('destroy', () => {
            if (this.scoreUnsub) {
                this.scoreUnsub();
            };
        });

        this.scoreUnsub = score.subscribe(s => {
            this.scoreText.setText(`Coins: ${s}`);
        });
    }
}