export default class Map {
    public map!: Phaser.Tilemaps.Tilemap;
    public tiles!: Phaser.Tilemaps.Tileset;
    public backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
    public blockedLayer!: Phaser.Tilemaps.TilemapLayer;

    private scene: Phaser.Scene;

    private key: string;
    private tilesetName: string;
    private bgLayerName: string;
    private blockedLayerName: string;

    /**
     * 
     * @param scene Parent scene
     * @param key Tiled JSON file key name
     * @param tilesetName Tiled Tileset image key name
     * @param bgLayerName the name of the layer created in tiled for the map background
     * @param blockedLayerName the name of the layer created for the blocked areas
     */
    constructor(scene: Phaser.Scene, key: string, tilesetName: string, bgLayerName: string, blockedLayerName: string) {
        this.scene = scene;

        this.key = key;
        this.tilesetName = tilesetName;
        this.bgLayerName = bgLayerName;
        this.blockedLayerName = blockedLayerName;

        this.createMap();
    }

    createMap() {
        // create the tile map
        this.map = this.scene.make.tilemap({ key: this.key });

        // add the tileset image to the map
        this.tiles = this.map.addTilesetImage(this.tilesetName, this.tilesetName, 32, 32, 1, 2)!;

        // create the background layer
        this.backgroundLayer = this.map.createLayer(this.bgLayerName, this.tiles, 0, 0)!;
        this.backgroundLayer.setScale(2);

        // create the blocked layer
        this.blockedLayer = this.map.createLayer(this.blockedLayerName, this.tiles, 0, 0)!;
        this.blockedLayer.setScale(2);
        this.blockedLayer.setCollisionByExclusion([-1]); // all tiles in this layer will have collision enabled

        // update world bounds
        this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

        // limit the camera to the size of the map
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    }
}