export default class Player extends Phaser.Physics.Arcade.Image {
    public velocity!: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y, texture, frame);

        // store a reference to the scene
        this.scene = scene;
        this.velocity = 160;

        // enable physics
        this.scene.physics.world.enable(this);

        // set immovable if another object collides with the player
        this.setImmovable(false);

        // scale the player
        this.setScale(2);

        // collide with world bounds
        this.setCollideWorldBounds(true);

        // add the player to the existing scene
        this.scene.add.existing(this);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);

        if (cursors.left.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-this.velocity);
        } else if (cursors.right.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(this.velocity);
        }

        if (cursors.up.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-this.velocity);
        } else if (cursors.down.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(this.velocity);
        }
    }
}