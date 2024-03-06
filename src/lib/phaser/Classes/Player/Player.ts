export default class Player extends Phaser.Physics.Arcade.Image {
    public velocity!: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y, texture, frame);

        // store a reference to the scene
        this.scene = scene;

        // enable physics
        this.scene.physics.world.enable(this);

        // set immovable if another object collides with the player
        this.setImmovable(true);

        // scale the player
        this.setScale(2);

        // add the player to the existing scene
        this.scene.add.existing(this);
    }
}