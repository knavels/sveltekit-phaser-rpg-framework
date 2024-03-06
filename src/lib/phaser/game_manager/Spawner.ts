import { SpawnerType, type Location, type SpawnerAddObjectCallback, type SpawnerConfig, type SpawnerDeleteObjectCallback } from "../types";
import ChestModel from "./ChestModel";

export default class Spawner {
    public id: string;
    public spawnInterval: number;
    public limit: number;
    public spawnerType: SpawnerType;

    public spawnLocations: Location[];

    public addObject: SpawnerAddObjectCallback;
    public deleteObject: SpawnerDeleteObjectCallback;

    public objectsCreated: ChestModel[];

    private interval!: number;

    constructor(config: SpawnerConfig, spawnLocations: Location[], addObject: SpawnerAddObjectCallback, deleteObject: SpawnerDeleteObjectCallback) {
        this.id = config.id;
        this.spawnInterval = config.spawnInterval;
        this.limit = config.limit;
        this.spawnerType = config.spawnerType;

        this.spawnLocations = spawnLocations;

        this.objectsCreated = [];

        this.addObject = addObject;
        this.deleteObject = deleteObject;

        this.start();
    }

    start() {
        this.interval = setInterval(() => {
            if (this.objectsCreated.length < this.limit) {
                this.spawnObject();
            }
        }, this.spawnInterval)
    }

    spawnObject() {
        if (this.spawnerType === SpawnerType.CHEST) {
            this.spawnChest();
        }
    }

    spawnChest() {
        const location = this.pickRandomLocation();
        const gold = Phaser.Math.RND.integerInRange(10, 20);
        const chest = new ChestModel(location.x, location.y, gold, this.id);

        this.objectsCreated.push(chest);

        this.addObject(chest.id, chest);
    }

    pickRandomLocation(): Location {
        const location = Phaser.Math.RND.pick(this.spawnLocations);
        const invalidLocation = this.objectsCreated.some(obj => {
            if (obj.x === location.x && obj.y === location.y) {
                return true;
            }

            return false;
        });

        if (invalidLocation) return this.pickRandomLocation();

        return location;
    }

    removeObject(id: string) {
        this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id);
        this.deleteObject(id);
    }
}