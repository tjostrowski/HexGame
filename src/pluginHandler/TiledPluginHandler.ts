class TiledPluginHandler implements PluginHandler {

    private game : Phaser.Game;
    private tiledPlugin : Phaser.Plugin.Tiled;

    constructor(game : Phaser.Game) {
        this.game = game;
    }

    onInit() {
        this.tiledPlugin = new Phaser.Plugin.Tiled(this.game, this.game.stage);
    }

    onPreload() {
        this.game.add.plugin(this.tiledPlugin);
    }

    onCreate() {
    }

    onUpdate() {
    }

    getPlugin() : Phaser.Plugin {
        return this.tiledPlugin;
    }
}