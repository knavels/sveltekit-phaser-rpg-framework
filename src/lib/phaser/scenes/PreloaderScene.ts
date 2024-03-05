export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // add stuff to load here 👇
        const loaders: (() => void)[] = [
            () => {
                // images
                this.load.image('button1', 'assets/images/ui/blue_button01.png');
                this.load.image('button2', 'assets/images/ui/blue_button02.png');

                // spritesheets
                this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
                this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });

                // sounds
                this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
            }
        ];

        this.loadAndSendUpdates(loaders);
    }

    private loadAndSendUpdates(preloadList: (() => void)[]) {
        const totalToLoad = preloadList.length;
        let loadedCount = 0;

        // Listen for the 'filecomplete' event and update the progress
        this.load.on('filecomplete', () => {
            loadedCount++;
            const percentageComplete = loadedCount / totalToLoad;
            this.scene.get('splash').events.emit('set_loader_progress', percentageComplete);
        });

        // Trigger the load process
        preloadList.forEach((load) => load());
    }

    create() {
        this.scene.get('splash').events.emit('set_loader_progress', 1);
        this.time.delayedCall(50, () => {
            this.scene.stop('splash');
            this.scene.start('title');
        });
    }
}
