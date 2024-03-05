export default class UiButton extends Phaser.GameObjects.Container {
    private button!: Phaser.GameObjects.Image;
    private normal!: string;
    private hover!: string;
    private text!: string;
    private targetCallback!: () => void;

    constructor(scene: Phaser.Scene, x: number, y: number, normal: string, hover: string, text: string, targetCallback: () => void) {
        super(scene, x, y);

        // store a reference to the scene
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.normal = normal;
        this.hover = hover;
        this.text = text;
        this.targetCallback = targetCallback;

        // create the Ui Button
        this.createButton();

        // add the player to the existing scene
        this.scene.add.existing(this);
    }

    private createButton() {
        // create play game button
        this.button = this.scene.add.image(0, 0, 'button1');
        // make button interactive
        this.button.setInteractive();
        // scale the button
        this.button.setScale(1.4);

        // create the button text
        let buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', color: '#fff' });
        // center the button text inside the Ui button
        Phaser.Display.Align.In.Center(buttonText, this.button);

        // add the two game objects to our container
        this.add(this.button);
        this.add(buttonText);

        // listen for events
        this.button.on('pointerdown', () => {
            this.targetCallback();
        });

        this.button.on('pointerover', () => {
            this.button.setTexture(this.hover);
        });

        this.button.on('pointerout', () => {
            this.button.setTexture(this.normal);
        });
    }
}