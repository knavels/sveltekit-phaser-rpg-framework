import { score } from "$stores";
import { SpawnerType, type Location, type SpawnerConfig } from "../types";
import type ChestModel from "./ChestModel";
import type MonsterModel from "./MonsterModel";
import PlayerModel from "./PlayerModel";
import Spawner from "./Spawner";

export default class GameManager {
    private scene: Phaser.Scene;
    private mapData: Phaser.Tilemaps.ObjectLayer[];

    private chests: any;
    private monsters: any;

    private spawners: any;

    private players: any;

    private playerLocations: Location[];
    private chestLocations: any;
    private monsterLocations: any;

    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.ObjectLayer[]) {
        this.chests = {};

        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};
        this.players = {};

        this.playerLocations = [];
        this.chestLocations = {};
        this.monsterLocations = {};
    }

    setup() {
        this.parseMapData();
        this.setupEventListeners();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData() {
        this.mapData.forEach(layer => {
            if (layer.name === 'player_locations') {
                layer.objects.forEach(obj => {
                    this.playerLocations.push({ x: obj.x!, y: obj.y! });
                });
            } else if (layer.name === 'chest_locations') {
                layer.objects.forEach(obj => {
                    if (this.chestLocations[obj.properties.spawner]) {
                        this.chestLocations[obj.properties.spawner].push({ x: obj.x!, y: obj.y! });
                    } else {
                        this.chestLocations[obj.properties.spawner] = [{ x: obj.x!, y: obj.y! }];
                    }
                });
            } else if (layer.name === 'monster_locations') {
                layer.objects.forEach(obj => {
                    if (this.monsterLocations[obj.properties.spawner]) {
                        this.monsterLocations[obj.properties.spawner].push({ x: obj.x!, y: obj.y! });
                    } else {
                        this.monsterLocations[obj.properties.spawner] = [{ x: obj.x!, y: obj.y! }];
                    }
                });
            }
        });
    }

    setupEventListeners() {
        this.scene.events.on('pickupChest', (chestId: string, playerId: string) => {
            if (this.chests[chestId]) {
                const { gold } = this.chests[chestId].data;

                // update the score
                score.update(gold);
                this.players[playerId].updateGold(gold);

                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);

                this.scene.events.emit('chestRemoved', chestId);
            }
        });

        this.scene.events.on('monsterAttacked', (monsterId: string, playerId: string) => {
            if (this.monsters[monsterId]) {
                // subtract health from monster model
                this.monsters[monsterId].loseHealth();
                const { gold, attack } = this.monsters[monsterId].data;

                // check the monster health and if dead remove it
                if (this.monsters[monsterId].data.health <= 0) {

                    // update the score
                    score.update(gold);
                    this.players[playerId].updateGold(gold);

                    this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
                    this.scene.events.emit('monsterRemoved', monsterId);

                    // add bonus health to the player
                    this.players[playerId].updateHealth(2);
                    this.scene.events.emit('updatePlayerHealth', this.players[playerId].health);
                } else {
                    // update player health
                    this.players[playerId].updateHealth(-attack);
                    this.scene.events.emit('updatePlayerHealth', this.players[playerId].health);

                    // update monster health
                    this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].data.health);

                    // check player health
                    if (this.players[playerId].health <= 0) {
                        const halfGold = parseInt(`${this.players[playerId].gold / 2}`);
                        this.players[playerId].updateGold(-halfGold);
                        // update the score
                        score.update(-halfGold);

                        // respawn player
                        this.players[playerId].respawn();
                        this.scene.events.emit('respawnPlayer', this.players[playerId]);
                    }
                }
            }
        });
    }

    setupSpawners() {
        let spawner: Spawner;

        // create chest spawners
        Object.keys(this.chestLocations).forEach(key => {
            const config: SpawnerConfig = {
                spawnInterval: 3000,
                limit: 3,
                spawnerType: SpawnerType.CHEST,
                id: `chest-${key}`
            };

            spawner = new Spawner(config,
                this.chestLocations[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this)
            );

            this.spawners[spawner.id] = spawner;
        });

        // create monster spawners
        Object.keys(this.monsterLocations).forEach(key => {
            const config: SpawnerConfig = {
                spawnInterval: 3000,
                limit: 3,
                spawnerType: SpawnerType.MONSTER,
                id: `monster-${key}`
            };

            spawner = new Spawner(config,
                this.monsterLocations[key],
                this.addMonster.bind(this),
                this.deleteMonster.bind(this),
                this.moveMonsters.bind(this)
            );

            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const player = new PlayerModel(this.playerLocations);

        this.players[player.id] = player;

        this.scene.events.emit('spawnPlayer', player);
    }

    addChest(chestId: string, chest: ChestModel) {
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
    }

    deleteChest(chestId: string) {
        delete this.chests[chestId];
    }

    addMonster(monsterId: string, monster: MonsterModel) {
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
    }

    deleteMonster(monsterId: string) {
        delete this.monsters[monsterId];
    }

    moveMonsters() {
        this.scene.events.emit('monsterMovement', this.monsters);
    }
}