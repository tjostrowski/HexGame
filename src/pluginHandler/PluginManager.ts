enum PluginType {
    KINETIC,
    TILED
}

class PluginManager {

    private static kineticPluginHandler : KineticPluginHandler;
    private static tiledPluginHandler : TiledPluginHandler;

    public static getPluginHandler(game : Phaser.Game, pluginType : PluginType) : PluginHandler {
        switch (pluginType) {
            case PluginType.KINETIC: {
                if (!this.kineticPluginHandler) {
                    this.kineticPluginHandler = new KineticPluginHandler(game);
                }
                return this.kineticPluginHandler;
            }    
            case PluginType.TILED: {
                if (!this.tiledPluginHandler) {
                    this.tiledPluginHandler = new TiledPluginHandler(game);
                }
                return this.tiledPluginHandler;
            }        
            default:
                console.log('Plugin: ' + pluginType + ' not handled');    
        }
    }
}