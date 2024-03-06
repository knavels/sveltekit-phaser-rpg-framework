import { v4 as uuid } from 'uuid';

export default class MonsterModel {
    public id: string;
    public spawnerId: string;
    public x: number;
    public y: number;

    public data: any;

    constructor(x: number, y: number, frame: string | number, gold: number, health: number, attack: number, spawnerId: string) {
        this.id = `${spawnerId}-${uuid()}`
        this.spawnerId = spawnerId;
        this.x = x;
        this.y = y;

        this.data = {};
        this.data.frame = frame;
        this.data.gold = gold;
        this.data.health = health;
        this.data.maxHealth = health;
        this.data.attack = attack;
    }

    loseHealth() {
        this.data.health -= 1;
    }
}