import { score } from "$stores";
import UiButton from "../classes/UiButton";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        score.reset();

        //create title text
        let titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Zenva MMORPG', { fontSize: '64px', color: '#fff' });
        titleText.setOrigin(0.5);

        let startGameButton = new UiButton(
            this,
            this.scale.width / 2,
            this.scale.height * 0.65,
            'button1', 'button2', 'Start',
            this.startScene.bind(this, 'main')
        );
    }

    startScene(targetScene: string) {
        this.scene.start(targetScene);
    }
}