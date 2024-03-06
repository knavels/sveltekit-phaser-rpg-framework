import type MonsterModel from "../game_manager/MonsterModel";

export default class Monster extends Phaser.Physics.Arcade.Image {
    public health!: number;
    public maxHealth!: number;
    public id!: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, model: MonsterModel) {

        super(scene, x, y, texture, model.data.frame);

        // store a reference to the scene
        this.scene = scene;

        this.updateByModel(model);

        // enable physics
        this.scene.physics.world.enable(this);

        // set immovable if another object collides with our monster
        this.setImmovable(false);

        // collide with world bounds
        this.setCollideWorldBounds(true);

        // add the monster to the existing scene
        this.scene.add.existing(this);

        // scate the monster game object
        this.setScale(2);
    }

    updateByModel(model: MonsterModel) {
        this.health = model.data.health;
        this.maxHealth = model.data.maxHealth;
        this.id = model.id;
        this.setTexture(this.texture.key, model.data.frame);
        this.setPosition(model.x * 2, model.y * 2);
    }

    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body!.checkCollision.none = false;
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body!.checkCollision.none = true;
    }
}