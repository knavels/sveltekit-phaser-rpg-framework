export default class UiScene extends Phaser.Scene {
    private scoreText!: Phaser.GameObjects.Text;
    private coinIcon!: Phaser.GameObjects.Image;

    constructor() {
        super('ui');
    }

    create() {
        this.setupUiElements();
        this.setupEvents();
    }

    setupUiElements() {
        // create the score text game object
        this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', color: '#fff' });

        // create coin icon
        this.coinIcon = this.add.image(15, 15, 'items', 3);
    }

    setupEvents() {

    }
}