import { v4 as uuid } from 'uuid';
import type { Location } from '../types';

export default class PlayerModel {
    public id: string;
    public health!: number;
    public maxHealth!: number;
    public gold: number;

    public x!: number;
    public y!: number;

    private spawnLocations: Location[];

    constructor(spawnLocations: Location[]) {
        this.id = `player-${uuid()}`;
        this.spawnLocations = spawnLocations;
        this.gold = 0;

        this.respawn();
    }



    updateHealth(health: number) {
        this.health += health;
    }

    updateGold(gold: number) {
        this.gold += gold;
    }

    respawn() {
        this.health = 10;
        this.maxHealth = 10;

        const location = Phaser.Math.RND.pick(this.spawnLocations);
        this.x = location.x;
        this.y = location.y;
    }
}