module GameStates {

    import GraphicsController = Graphics.GraphicsController;
    import GameController = Logic.GameController;
    import TilemapConfiguration = Graphics.TilemapConfiguration;
    import BuildingsSpritesheetConfiguration = Graphics.BuildingsSpritesheetConfiguration;
    import TerrainSpritesheetConfiguration = Graphics.TerrainSpritesheetConfiguration;
    import GameConfiguration = Logic.StaticConfiguration;
    import TileGameMenu = Graphics.TileGameMenu;
    import AS = Graphics.Assets;
    import AssetsManager = Graphics.AssetsManager;
    import AssetResource = Graphics.AssetResource;
    import BuildingType = Logic.BuildingType;
    import Slider = Graphics.ExpandablePopup;
    import Assets = Graphics.Assets;
    import RT = Graphics.ResourceType;
    import GameMenu = Graphics.GameMenu;
    import OverallInfoMenu = Graphics.OverallInfoMenu;

    export class GameBoardState extends AbstractBoardState {

        public static NAME = 'GameBoard';

        _tilemap : Phaser.Tilemap;
        _tileLayers : Phaser.TilemapLayer[] = [];

        _gameCtrl : GameController;

        _tilemapConf : TilemapConfiguration;

        _gamePlayerView : Logic.PlayerView;

        _graphicsCtrl : Graphics.GraphicsController;

        // _assetsManager : AssetsManager;

        _tileGameMenu : TileGameMenu;

        _gameMenu : GameMenu;

        _infoMenu : OverallInfoMenu;

        // using which player we want to play?
        static __chosenPlayerIdx = 0;

        init() {
            super.init();
            this._gameCtrl = new GameController();
        }

        preload() {
            super.preload();

            var timeLog = new TimeMeasure().start();

            this._tilemapConf = new TilemapConfiguration(AS.smallMapFile, AS.gameBoardRes)
                .withImageData(AS.terrainsSheetFile, AS.terrainSheetRes);

            var tilemapConf = this._tilemapConf;

            this.load.tilemap(tilemapConf.resourceName, tilemapConf.fileName, null, Phaser.Tilemap.TILED_JSON);
            this.load.image(tilemapConf.imgResourceName, tilemapConf.imgFileName);

            var distinctSpritesheetConfigs = All.gameConf.getDistinctSpritesheetConfigurations();
            for (var conf of distinctSpritesheetConfigs) {
                this.load.spritesheet(conf.resourceName, conf.assetFileName, conf.tileWidth, conf.tileHeight,
                    conf.numTiles);
            }

            this._tileGameMenu = new TileGameMenu(All.assets.find(AS.menuRes),
                                                  All.assets.find(AS.expandMenuRes) );

            this._tileGameMenu
                .withAvailableBuildingTypes(
                    [BuildingType.TREE_HUT,
                    BuildingType.COAL_MINE,
                    BuildingType.IRON_MINE,
                    BuildingType.ARMORY])
                .withEnabledBuildingTypes(
                    [BuildingType.TREE_HUT]
            );

            timeLog.finishAndLog();
        }

        create() {
            super.create();

            var timeLog = new TimeMeasure().start();

            var chosenPlayerIdx = 0;
            var tilemapConf = this._tilemapConf;

            this._tilemap = this.game.add.tilemap(tilemapConf.resourceName);
            All.registerTilemap(this._tilemap);
            this._tilemap.addTilesetImage(tilemapConf.getTilesetNames()[0], tilemapConf.imgResourceName);

            var layerName : string;
            for (layerName of tilemapConf.getTileLayerNames()) {
                this._tileLayers.push( this._tilemap.createLayer(layerName, null, null, All.layers.tileLayer) );
            }

            var boardTileLayerName = tilemapConf.getTilesetNames()[0];
            var boardTileset : Phaser.Tileset = this.pickTileset(boardTileLayerName);

            tilemapConf.tileWidth = boardTileset.tileWidth;
            tilemapConf.tileHeight = Math.floor(0.75 * boardTileset.tileHeight);
            tilemapConf.numTilesX = this._tilemap.width;
            tilemapConf.numTilesY = this._tilemap.height;

            this._gameCtrl.onTilemapLoaded(this._tilemap);
            this._gamePlayerView = this._gameCtrl.getPlayerView(GameBoardState.__chosenPlayerIdx);

            this.game.world.setBounds(0, 0, tilemapConf.tileWidth * tilemapConf.numTilesX, tilemapConf.tileHeight * tilemapConf.numTilesY);

            All.registerTileGameMenu(this._tileGameMenu);

            this._gameCtrl.startGame();
            this._gameCtrl.enableInput();

            var overallInfoMenu = new Graphics.OverallInfoMenu(this._gamePlayerView);
            overallInfoMenu.render();

            var gameMenu = new Graphics.GameMenu(this._gamePlayerView);
            gameMenu.render();

            new Graphics.CombatResultPopup().mockAndShow();

            timeLog.finishAndLog();
        }

        private pickTileset(tilesetName : string) : Phaser.Tileset {
            for (var tileset of this._tilemap.tilesets) {
                if (tileset.name === tilesetName) {
                    return tileset;
                }
            }
            return null;
        }
    }
}
