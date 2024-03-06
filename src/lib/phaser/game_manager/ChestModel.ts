import { v4 as uuid } from 'uuid';

export default class ChestModel {
    public id: string;
    public spawnerId: string;
    public x: number;
    public y: number;

    public data: any;

    constructor(x: number, y: number, gold: number, spawnerId: string) {
        this.id = `${spawnerId}-${uuid()}`
        this.spawnerId = spawnerId;
        this.x = x;
        this.y = y;

        this.data = {};
        this.data.gold = gold;
    }

    loseHealth() { }

    move() { }
}