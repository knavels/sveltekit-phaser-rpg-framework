import type ChestModel from "../game_manager/ChestModel";
import type MonsterModel from "../game_manager/MonsterModel";

export type Location = {
    x: number;
    y: number;
};

// SPAWNER
export type SpawnerAddObjectCallback = (id: string, data: ChestModel | MonsterModel) => void;
export type SpawnerDeleteObjectCallback = (id: string) => void;
export enum SpawnerType {
    CHEST,
    MONSTER,
}
export type SpawnerConfig = {
    id: string;
    spawnInterval: number;
    limit: number;
    spawnerType: SpawnerType;
};

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}