import { SpawnerType, type Location, type SpawnerConfig } from "../types";
import type ChestModel from "./ChestModel";
import Spawner from "./Spawner";

export default class GameManager {
    private scene: Phaser.Scene;
    private mapData: Phaser.Tilemaps.ObjectLayer[];

    private chests: any;

    private spawners: any;

    private playerLocations: Location[];
    private chestLocations: any;
    private monsterLocations: any;

    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.ObjectLayer[]) {
        this.chests = {};

        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        // this.chests = {};

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

    }

    setupSpawners() {
        // create chest spawners
        Object.keys(this.chestLocations).forEach(key => {
            const config: SpawnerConfig = {
                spawnInterval: 3000,
                limit: 3,
                spawnerType: SpawnerType.CHEST,
                id: `chest-${key}`
            };

            const spawner = new Spawner(config,
                this.chestLocations[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this)
            );

            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const location = Phaser.Math.RND.pick(this.playerLocations);

        this.scene.events.emit('spawnPlayer', location);
    }

    addChest(chestId: string, chest: ChestModel) {
        this.chests[chestId] = chest;
    }

    deleteChest(chestId: string) {
        delete this.chests[chestId];
    }
}