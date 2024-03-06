import Phaser from 'phaser';

import LoadingSplash from './scenes/Splash';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';
import UiScene from './scenes/UiScene';

export const gameConfig = {
    width: 800,
    height: 600,
}

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: gameConfig.width,
    height: gameConfig.height,
    title: 'My Game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0,
                x: 0,
            },
        },
    },
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.NONE
    },

    scene: [LoadingSplash, PreloaderScene, TitleScene, GameScene, UiScene]
};
