import { score } from "$stores";
import Chest from "../Actors/Chest";
import Player from "../Actors/Player";

export default class GameScene extends Phaser.Scene {
    private player!: Player;
    private chest!: Chest;

    private wall!: Phaser.Physics.Arcade.Image;

    private goldPickupAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('main');
    }

    init() {
        // run ui scene in parallel with the Game Scene
        this.scene.launch('ui');
    }

    create() {
        this.createAudio();
        this.createInput();
        this.createPlayer();
        this.createChest();
        this.createWalls();
        this.addCollisions();
    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', {
            loop: false,
            volume: 0.2
        });
    }

    createInput() {
        // create bindings to the arrow keys
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    createPlayer() {
        this.player = new Player(this, 32, 32, 'characters', 0);
    }

    createChest() {
        this.chest = new Chest(this, 300, 300, 'items', 0);
    }

    createWalls() {
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.overlap(this.player, this.chest, this.collectChest, undefined, this);
    }

    update() {
        this.player.update(this.cursors);
    }

    collectChest(_player: any, chest: any) {
        // player gold pickup sound
        this.goldPickupAudio.play();

        // update the score
        score.update(chest.coins);

        // destroy the chest game object
        chest.destroy();
    }
}
