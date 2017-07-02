module GameStates {

    export class AbstractState extends Phaser.State {

        init() {
            if (All.graphicsCtrl) {
                All.graphicsCtrl.onGameStateChanged();
            }
        }
    }

    export class AbstractBoardState extends AbstractState {

        private kineticPluginHandler : KineticPluginHandler;
        private tiledPluginHandler : TiledPluginHandler;

        init() {
            super.init();
            this.kineticPluginHandler = <KineticPluginHandler>PluginManager.getPluginHandler(this.game, PluginType.KINETIC);
            this.tiledPluginHandler = <TiledPluginHandler>PluginManager.getPluginHandler(this.game, PluginType.TILED);
            this.kineticPluginHandler.onInit();
            this.tiledPluginHandler.onInit();
        }

        preload() {
            this.kineticPluginHandler.onPreload();
            this.tiledPluginHandler.onPreload();
        }

        create() {
            this.kineticPluginHandler.onCreate();
            this.tiledPluginHandler.onCreate();
        }

        update() {
            this.kineticPluginHandler.onUpdate();
            this.tiledPluginHandler.onUpdate();

        }

        protected getKineticScrollingPlugin() : Phaser.Plugin.KineticScrolling {
            return <Phaser.Plugin.KineticScrolling>this.kineticPluginHandler.getPlugin();
        }

        protected getTiledPlugin() : Phaser.Plugin.Tiled {
            return <Phaser.Plugin.Tiled>this.tiledPluginHandler.getPlugin();
        }

    }

}
