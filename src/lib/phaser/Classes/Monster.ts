import type MonsterModel from "../game_manager/MonsterModel";

export default class Monster extends Phaser.Physics.Arcade.Image {
    public id!: string;
    private health!: number;
    private maxHealth!: number;

    private healthBar!: Phaser.GameObjects.Graphics;

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

        // scate the monster game object
        this.setScale(2);

        // add the monster to the existing scene
        this.scene.add.existing(this);

        // update the origin
        this.setOrigin(0);

        this.createHealthBar();
    }

    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x, this.y - 8, 64, 5);

        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4, 4);
        this.healthBar.fillRect(this.x, this.y - 8, 64 * this.health / this.maxHealth, 5);
    }

    updateHealth(health: number) {
        this.health = health;
        this.updateHealthBar();
    }

    updateByModel(model: MonsterModel) {
        this.health = model.data.health;
        this.maxHealth = model.data.maxHealth;
        this.id = model.id;
        this.setTexture(this.texture.key, model.data.frame);
        this.setPosition(model.x, model.y);
    }

    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body!.checkCollision.none = false;
        this.updateHealthBar();
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body!.checkCollision.none = true;
        this.healthBar.clear();
    }

    update() {
        this.updateHealthBar();
    }
}