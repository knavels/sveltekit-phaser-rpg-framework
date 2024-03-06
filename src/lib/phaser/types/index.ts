import type ChestModel from "../game_manager/ChestModel";

export type Location = {
    x: number;
    y: number;
};

// SPAWNER
export type SpawnerAddObjectCallback = (id: string, chest: ChestModel) => void;
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