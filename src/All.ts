class All {

    private static _game : Phaser.Game;
    private static _graphicsCtrl : Graphics.GraphicsController;

    private static _gameCtrl : Logic.GameController;

    private static _world : Logic.WorldInfo;

    private static _resManager : Logic.ResourceManager;

    private static _assetsManager : Graphics.AssetsManager;

    private static _tileMenu : Graphics.TileGameMenu;

    private static _cameraCtrl : Graphics.CameraController;

    private static _assets : Graphics.Assets;

    private static _treeCtrl : Graphics.TreeController;

    private static _context : Logic.GameContext;

    private static _tilemap : Phaser.Tilemap;

    private static _layers : Graphics.Layers;

    private static _actionsCtrl : Logic.ActionsController;

    private static _gameConf : Logic.GameConfiguration;

    private static _combatResolver : Logic.CombatResolver;

    public static registerGame(game : Phaser.Game) {
        this._game = game;
    }

    public static get game() : Phaser.Game {
        return this._game;
    }

    public static registerGraphicsCtrl(graphicsCtrl : Graphics.GraphicsController) {
        this._graphicsCtrl = graphicsCtrl;
    }

    public static get graphicsCtrl() {
        return this._graphicsCtrl;
    }

    public static registerGameCtrl(gameCtrl : Logic.GameController) {
        this._gameCtrl = gameCtrl;
    }

    public static get gameCtrl() : Logic.GameController {
        return this._gameCtrl;
    }

    public static registerWorldInfo(world : Logic.WorldInfo) {
        this._world = world;
    }

    public static get worldInfo() : Logic.WorldInfo {
        return this._world;
    }

    public static registerGameConf(conf : Logic.GameConfiguration) {
        this._gameConf = conf;
    }

    public static get gameConf() : Logic.GameConfiguration {
        return this._gameConf;
    }

    public static get staticConf() : Logic.StaticConfiguration {
        return Logic.StaticConfiguration.of();
    }

    public static registerResourceManager(resManager : Logic.ResourceManager) {
        this._resManager = resManager;
    }

    public static get resourceManager() {
        return this._resManager;
    }

    public static registerAssetsManager(assetsManager : Graphics.AssetsManager) {
        this._assetsManager = assetsManager;
    }

    public static get assetsManager() {
        return this._assetsManager;
    }

    public static registerTileGameMenu(menu : Graphics.TileGameMenu) {
        this._tileMenu = menu;
    }

    public static get tileGameMenu() : Graphics.TileGameMenu {
        return this._tileMenu;
    }

    public static registerCameraCtrl(cameraCtrl : Graphics.CameraController) {
        this._cameraCtrl = cameraCtrl;
    }

    public static get cameraCtrl() : Graphics.CameraController {
        return this._cameraCtrl;
    }

    public static registerAssets(assets : Graphics.Assets) {
        this._assets = assets;
    }

    public static get assets() : Graphics.Assets {
        return this._assets;
    }

    public static registerTreeCtrl(treeCtrl : Graphics.TreeController) {
        this._treeCtrl = treeCtrl;
    }

    public static get treeCtrl() {
        return this._treeCtrl;
    }

    public static registerContext(ctxt : Logic.GameContext) {
        this._context = ctxt;
    }

    public static get context() : Logic.GameContext {
        return this._context;
    }

    public static registerTilemap(tilemap : Phaser.Tilemap) {
        this._tilemap = tilemap;
    }

    public static get tilemap() : Phaser.Tilemap {
        return this._tilemap;
    }

    public static registerLayers(layers : Graphics.Layers) {
        this._layers = layers;
    }

    public static get layers() : Graphics.Layers {
        return this._layers;
    }

    public static registerActionsCtrl(actionsCtrl : Logic.ActionsController) {
        this._actionsCtrl = actionsCtrl;
    }

    public static get actionsCtrl() : Logic.ActionsController {
        return this._actionsCtrl;
    }

    public static registerCombatResolver(combatResolver : Logic.CombatResolver) {
        this._combatResolver = combatResolver;
    }

    public static get combatResolver() : Logic.CombatResolver {
        return this._combatResolver;
    }

}
