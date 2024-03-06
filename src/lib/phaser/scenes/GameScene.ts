import Chest from "../classes/Chest";
import Map from "../classes/Map";
import Monster from "../classes/Monster";
import { PlayerContainer } from "../classes/Player";
import ChestModel from "../game_manager/ChestModel";
import GameManager from "../game_manager/GameManager";
import type MonsterModel from "../game_manager/MonsterModel";
import type PlayerModel from "../game_manager/PlayerModel";

export default class GameScene extends Phaser.Scene {
    private player!: PlayerContainer;
    private chests!: Phaser.Physics.Arcade.Group;
    private monsters!: Phaser.Physics.Arcade.Group;

    private map!: Map;

    private gameManager!: GameManager;

    private goldPickupAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private enemyDeathAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private playerAttackAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private playerDamageAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private playerDeathAudio!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

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
        this.createGroups();
        this.createMap();

        this.createGameManager();
    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', {
            loop: false,
            volume: 0.3
        });
        this.enemyDeathAudio = this.sound.add('enemyDeath', {
            loop: false,
            volume: 0.2
        });
        this.playerAttackAudio = this.sound.add('playerAttack', {
            loop: false,
            volume: 0.2
        });
        this.playerDamageAudio = this.sound.add('playerDamage', {
            loop: false,
            volume: 0.2
        });
        this.playerDeathAudio = this.sound.add('playerDeath', {
            loop: false,
            volume: 0.4
        });
    }

    createInput() {
        // create bindings to the arrow keys
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    createPlayer(player: PlayerModel) {
        this.player = new PlayerContainer(
            this,
            player.x * 2,
            player.y * 2,
            'characters',
            0,
            player,
            this.playerAttackAudio
        );
    }

    createGroups() {
        // create a chest group
        this.chests = this.physics.add.group();

        // create a monster group
        this.monsters = this.physics.add.group();
        this.monsters.runChildUpdate = true;
    }

    spawnChest(model: ChestModel) {
        let chest = this.chests.getFirstDead() as Chest;

        if (!chest) {
            chest = new Chest(this,
                model.x * 2,
                model.y * 2,
                'items',
                0,
                model
            );

            // add chest to chests group
            this.chests.add(chest);
        } else {
            chest.updateByModel(model);
            chest.makeActive();
        }
    }

    spawnMonster(model: MonsterModel) {
        let monster = this.monsters.getFirstDead() as Monster;

        if (!monster) {
            monster = new Monster(
                this,
                model.x,
                model.y,
                'monsters',
                model
            );

            // add monster to monsters group
            this.monsters.add(monster);
            // monster.setCollideWorldBounds(true);
        } else {
            monster.updateByModel(model);
            monster.makeActive();
        }
    }

    createMap() {
        this.map = new Map(this, 'map', 'background', 'background', 'blocked');
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.map.blockedLayer);
        this.physics.add.collider(this.monsters, this.map.blockedLayer);

        this.physics.add.overlap(this.player, this.chests, this.collectChest, undefined, this);
        this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, undefined, this);
    }

    createGameManager() {
        this.events.on('spawnPlayer', (player: PlayerModel) => {
            this.createPlayer(player);
            this.addCollisions();
        });

        this.events.on('chestSpawned', (chest: ChestModel) => {
            this.spawnChest(chest);
        });

        this.events.on('monsterSpawned', (monster: MonsterModel) => {
            this.spawnMonster(monster);
        });

        this.events.on('chestRemoved', (chestId: string) => {
            this.chests.getChildren().forEach(chest => {
                if ((chest as Chest).id === chestId) {
                    (chest as Chest).makeInactive();
                }
            })
        });

        this.events.on('monsterRemoved', (monsterId: string) => {
            this.monsters.getChildren().forEach(monster => {
                if ((monster as Monster).id === monsterId) {
                    (monster as Monster).makeInactive();
                    this.enemyDeathAudio.play();
                }
            })
        });

        this.events.on('updateMonsterHealth', (monsterId: string, health: number) => {
            this.monsters.getChildren().forEach(monster => {
                if ((monster as Monster).id === monsterId) {
                    (monster as Monster).updateHealth(health);
                }
            })
        });

        this.events.on('updatePlayerHealth', (health: number) => {
            this.player.updateHealth(health);
            if (health < this.player.health) {
                this.playerDamageAudio.play();
            }
        });

        this.events.on('respawnPlayer', (player: PlayerModel) => {
            this.player.respawn(player);
            this.playerDeathAudio.play();
        });

        this.events.on('monsterMovement', (monsters: any) => {
            this.monsters.getChildren().forEach(monster => {
                Object.keys(monsters).forEach(monsterId => {
                    if ((monster as Monster).id === monsterId) {
                        this.physics.moveToObject(monster, monsters[monsterId], 40);
                    }
                })
            })
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }

    update() {
        if (this.player)
            this.player.update(this.cursors);
    }

    collectChest(player: any, chest: any) {
        // player gold pickup sound
        this.goldPickupAudio.play();

        this.events.emit('pickupChest', chest.id, player.id);
    }

    enemyOverlap(_weapon: any, enemy: any) {
        if (this.player.isAttacking && !this.player.swordHit) {
            this.player.swordHit = true;
            this.events.emit('monsterAttacked', enemy.id, this.player.id);
        }
    }
}
