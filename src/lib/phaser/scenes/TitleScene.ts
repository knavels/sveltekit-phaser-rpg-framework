export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        //create title text
        let titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Zenva MMORPG', { fontSize: '64px', color: '#fff' });
        titleText.setOrigin(0.5);
        // position the button below the title
        let button = this.add.image(this.scale.width / 2, this.scale.height * 0.65, 'button1');
        button.setInteractive();

        let buttonText = this.add.text(0, 0, 'Start', { fontSize: '26px', color: '#fff' });
        // position the text inside the game object
        Phaser.Display.Align.In.Center(buttonText, button);

        // listen for events
        button.on('pointerdown', () => {
            // transition to Game Scene
            this.scene.start('main');
        });

        button.on('pointerover', () => {
            button.setTexture('button2');
        });

        button.on('pointerout', () => {
            button.setTexture('button1');
        });
    }
}