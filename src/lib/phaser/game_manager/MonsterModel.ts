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
        this.x = x * 2;
        this.y = y * 2;

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

    move() {
        const randomPosition = Phaser.Math.RND.integerInRange(1, 8);
        const distance = 64;

        switch (randomPosition) {
            case 1:
                this.x += distance;
                break;

            case 2:
                this.x -= distance;
                break;

            case 3:
                this.y += distance;
                break;

            case 4:
                this.y -= distance;
                break;

            case 5:
                this.x += distance;
                this.y += distance;
                break;

            case 6:
                this.x += distance;
                this.y -= distance;
                break;

            case 7:
                this.x -= distance;
                this.y += distance;
                break;

            case 8:
                this.x -= distance;
                this.y -= distance;
                break;

            default:
                break;
        }
    }
}