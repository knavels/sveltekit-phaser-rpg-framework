import { score } from "$stores";
import Chest from "../Classes/Chest";
import Player from "../Classes/Player";

//create chest positions array
const chestPositions = [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 300 },
    { x: 400, y: 400 },
    { x: 500, y: 500 },
]


export default class GameScene extends Phaser.Scene {
    private player!: Player;
    private chests!: Phaser.Physics.Arcade.Group;

    private map!: Phaser.Tilemaps.Tilemap;
    private tiles!: Phaser.Tilemaps.Tileset;
    private backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
    private blockedLayer!: Phaser.Tilemaps.TilemapLayer;

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
        this.createMap();
        this.createPlayer();
        this.createChest();

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
        this.player = new Player(this, 224, 224, 'characters', 0);
    }

    createChest() {
        // create chest group
        this.chests = this.physics.add.group();

        // scpecity the max number of chest we can have
        const maxNumberOfChests = 3;

        // spawn chest
        for (let i = 0; i < maxNumberOfChests; ++i) {
            this.spawnChest();
        }
    }

    spawnChest() {
        const position = Phaser.Math.RND.pick(chestPositions);

        let chest = this.chests.getFirstDead() as Chest;

        if (!chest) {
            chest = new Chest(this, position.x, position.y, 'items', 0);
        } else {
            chest.setPosition(position.x, position.y);
            chest.makeActive();
        }

        this.chests.add(chest);
    }

    createMap() {
        // create the tile map
        this.map = this.make.tilemap({ key: 'map' });

        // add the tileset image to the map
        this.tiles = this.map.addTilesetImage('background', 'background', 32, 32, 1, 2)!;

        // create the background layer
        this.backgroundLayer = this.map.createLayer('background', this.tiles, 0, 0)!;
        this.backgroundLayer.setScale(2);

        // create the blocked layer
        this.blockedLayer = this.map.createLayer('blocked', this.tiles, 0, 0)!;
        this.blockedLayer.setScale(2);
        this.blockedLayer.setCollisionByExclusion([-1]); // all tiles in this layer will have collision enabled

        // update world bounds
        this.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.physics.world.bounds.height = this.map.heightInPixels * 2;

        // limit the camera to the size of the map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.blockedLayer);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, undefined, this);
    }

    update() {
        this.player.update(this.cursors);
    }

    collectChest(_player: any, chest: any) {
        // player gold pickup sound
        this.goldPickupAudio.play();

        // update the score
        score.update(chest.coins);

        // inactive the chest game object
        chest.makeInactive();

        // spawn a new chest after certain amount of time has passed
        this.time.delayedCall(1000, this.spawnChest, [], this);
    }
}
