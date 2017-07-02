class KineticPluginHandler implements PluginHandler {

    private kineticScrolling : Phaser.Plugin.KineticScrolling;
    private game : Phaser.Game;

    constructor(game : Phaser.Game) {
        this.game = game;
    }

    onInit() {
        this.kineticScrolling = new Phaser.Plugin.KineticScrolling(this.game, this.game.plugins);
        this.kineticScrolling.configure({
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            horizontalScroll: true,
            verticalScroll: true,
            horizontalWheel: true,
            verticalWheel: true,
            deltaWheel: 40
        });
    }

    onPreload() {
        this.game.add.plugin(this.kineticScrolling);
    }

    onCreate() {
        this.kineticScrolling.start();
    }

    onUpdate() {

    }

    getPlugin() : Phaser.Plugin {
        return this.kineticScrolling;
    }

}