import Player from ".";

export default class PlayerContainer extends Phaser.GameObjects.Container {
    public velocity!: number;

    private player!: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y);

        // store a reference to the scene
        this.scene = scene;
        this.velocity = 160; // the velocity player container is moving

        // set a size on the container
        this.setSize(64, 64);

        // enable physics
        this.scene.physics.world.enable(this);

        // collide with world bounds
        this.getBody().setCollideWorldBounds(true);

        // add the player container to the existing scene
        this.scene.add.existing(this);

        // have the camera follow the player container
        this.scene.cameras.main.startFollow(this);

        // create the player
        this.player = new Player(this.scene, 0, 0, texture, frame);
        this.add(this.player);
    }

    getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.getBody().setVelocity(0);

        if (cursors.left.isDown) {
            this.getBody().setVelocityX(-this.velocity);
        } else if (cursors.right.isDown) {
            this.getBody().setVelocityX(this.velocity);
        }

        if (cursors.up.isDown) {
            this.getBody().setVelocityY(-this.velocity);
        } else if (cursors.down.isDown) {
            this.getBody().setVelocityY(this.velocity);
        }
    }
}