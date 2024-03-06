import { score } from "$stores";
import Chest from "../classes/Chest";
import Map from "../classes/Map";
import Player from "../classes/Player";
import GameManager from "../game_manager/GameManager";
import type { Location } from "../types";

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

    private map!: Map;

    private gameManager!: GameManager;

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
        this.createChest();

        this.createGameManager();
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

    createPlayer(location: Location) {
        this.player = new Player(this, location.x * 2, location.y * 2, 'characters', 0);
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
        this.map = new Map(this, 'map', 'background', 'background', 'blocked');
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.map.blockedLayer);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, undefined, this);
    }

    createGameManager() {
        this.events.on('spawnPlayer', (location: Location) => {
            this.createPlayer(location);
            this.addCollisions();
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();

    }

    update() {
        if (this.player)
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
