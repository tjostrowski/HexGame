///<reference path='../All.ts' />
///<reference path='../logic/PlayerView.ts' />

module Graphics {

    import PlayerView = Logic.PlayerView;
    import BuildingType = Logic.BuildingType;
    import SoldierType = Logic.SoldierType;
    import Level = Logic.Level;

    export class Layers {
        private _tileLayer : Phaser.Group;

        private _buildingsLayer : Phaser.Group;

        private _menuLayer : Phaser.Group;

        constructor() {
            this._tileLayer = All.game.add.group();
            this._buildingsLayer = All.game.add.group();
            this._menuLayer = All.game.add.group();

            All.registerLayers(this);
        }

        public get tileLayer() : Phaser.Group {
            return this._tileLayer;
        }

        public get buildingsLayer() : Phaser.Group {
            return this._buildingsLayer;
        }

        public get menuLayer() : Phaser.Group {
            return this._menuLayer;
        }

        public get front() : Phaser.Group {
            return this.menuLayer;
        }

        public get back() : Phaser.Group {
            return this.tileLayer;
        }

        public clearAll() {
            this._tileLayer.removeAll();
            this._buildingsLayer.removeAll();
            this._menuLayer.removeAll();
        }

    }

    export class GraphicsController {

        private _game : Phaser.Game;

        private _tilemapConf : TilemapConfiguration;

        private _terrainSheetConf : TerrainSpritesheetConfiguration;
        private _buildingsSheetConf : BuildingsSpritesheetConfiguration;

        private _cameraCtrl : CameraController;

        private _treeCtrl : TreeController;

        private _cursorSprite : Phaser.Sprite;

        private _layers : Layers;

        private _cachedSprites : DictionaryWithManyKeyValues<Phaser.Point, Phaser.Sprite>
            = new DictionaryWithManyKeyValues<Phaser.Point, Phaser.Sprite>();

        constructor(game : Phaser.Game) {
            this._game = game;
            this._cameraCtrl = new CameraController();
            this._treeCtrl = new TreeController();
            this._layers = new Layers();

            All.registerGraphicsCtrl(this);
        }

        public onGameStateChanged() {
            this._cachedSprites.values().forEach(sprite => sprite.destroy());
            this._layers.clearAll();
            this._layers = new Layers();
        }

        public changeDefaultCursor(cursorSprite : Phaser.Sprite) {
            if (this._cursorSprite) {
                this._cursorSprite.destroy();
            }

            this._cursorSprite = cursorSprite;
            cursorSprite.alpha = 0.5;

            var that = this;
            this._game.input.addMoveCallback(function(pointer : Phaser.Pointer, x : number, y : number) {
                pointer.active = true;
                cursorSprite.position.x = pointer.worldX - cursorSprite.width*0.5;
                cursorSprite.position.y = pointer.worldY - cursorSprite.height*0.5;
            }, null);
        }

        public restoreDefaultCursor() {
            var cursorSprite = this._cursorSprite;
            if (cursorSprite) {
                cursorSprite.destroy();
                this._cursorSprite = null;
            }
        }

        public putBuildingOn(cell : Phaser.Point, type : BuildingType, level : Level) : Phaser.Sprite {
            var buildingsConf = All.gameCtrl.currentPlayerConfiguration.buildingsConf,
                tileIndex = buildingsConf.getIndex(type, level);

            var tilePos = HexUtils.calculatePosition(cell.x, cell.y, buildingsConf.mapTileWidth, buildingsConf.mapTileHeight);

            // var sprite = this._buildingsLayer.create(tilePos.x, tilePos.y, buildingsConf.resourceName, tileIndex);
            var sprite = All.game.add.sprite(tilePos.x, tilePos.y, buildingsConf.resourceName, tileIndex);
            sprite.alpha = 0.9;
            All.layers.tileLayer.add(sprite);

            this._cachedSprites.add(cell, sprite);

            return sprite;
        }

        public putSoldiersOn(cell : Phaser.Point, type : SoldierType, level : Level) : Phaser.Sprite {
            var soldiersConf = All.gameCtrl.currentPlayerConfiguration.soldiersConf,
                tileIndex = soldiersConf.getIndex(type, level);

            var tilePos = HexUtils.calculatePosition(cell.x, cell.y, soldiersConf.mapTileWidth, soldiersConf.mapTileHeight);
            var sprite = All.game.add.sprite(tilePos.x, tilePos.y, soldiersConf.resourceName, tileIndex);
            sprite.alpha = 0.9;
            All.layers.tileLayer.add(sprite);

            this._cachedSprites.add(cell, sprite);

            return sprite;
        }

        public putSoldiersRangeOn(cell : Phaser.Point) : Phaser.Sprite {
            var terrainConf = All.gameConf.terrainConf;

            var tilePos = HexUtils.calculatePosition(cell.x, cell.y, terrainConf.mapTileWidth, terrainConf.mapTileHeight);
            var sprite = All.game.add.sprite(tilePos.x, tilePos.y, terrainConf.resourceName, terrainConf.getNullTileIndex());
            sprite.alpha = 0.6;
            SpriteUtils.greyOutLightly(sprite);
            All.layers.tileLayer.add(sprite);

            this._cachedSprites.add(cell, sprite);

            return sprite;
        }

        public destroyCachedSpritesOn(cell : Phaser.Point) {
            var sprites = this._cachedSprites.get(cell);
            for (var sprite of sprites) {
                sprite.destroy();
            }
        }

        public getCachedSpritesOn(cell : Phaser.Point) : Phaser.Sprite[] {
            return this._cachedSprites.get(cell);
        }

        public getCachedSpriteOn(cell : Phaser.Point) : Phaser.Sprite {
            var cachedSprites = this._cachedSprites.get(cell);
            return cachedSprites ? cachedSprites[0] : null;
        }

        public renderPlayerView(playerView : PlayerView) {
            var world = All.worldInfo;
            for (var y = 0; y < world.sizeY; ++y) {
                for (var x = 0 ; x < world.sizeX; ++x) {
                    var cell = new Phaser.Point(x, y);
                    if (playerView.isInvisible(cell)) {
                        var removedTile : Phaser.Tile = world.tilemap.removeTile(x, y);
                    } else {
                        this.putTile(cell.x, cell.y);
                        var buildingOn = playerView.buildingOn(cell);
                        if (buildingOn) {
                            var recreatedSprite = this.putBuildingOn(cell, buildingOn.buildingType, buildingOn.buildingLevel);
                            if (buildingOn.sprite) {
                                buildingOn.sprite.destroy();
                            }
                            buildingOn.sprite = recreatedSprite;
                            if (buildingOn.isDuringBuild()) {
                                SpriteUtils.greyOut(recreatedSprite);
                            }
                        }
                    }
                }
            }
        }

        public putTile(cellX : number, cellY : number) {
            var index : number = All.worldInfo.getCachedIndex(cellX, cellY);
            All.tilemap.putTile(index, cellX, cellY);
        }

        public get screenWidth() : number {
            return window.innerWidth;
        }

        public get screenHeight() : number {
            return window.innerHeight;
        }

        public get screenCenterX() : number {
            return this.screenWidth / 2;
        }

        public get screenCenterY() : number {
            return this.screenHeight / 2;
        }

        public partOfScreenWidth(percent : number) : number {
            return this.screenWidth * (percent / 100);
        }

        public partOfScreenHeight(percent : number) : number {
            return this.screenHeight * (percent / 100);
        }

        public putOnBottomLeft(sprite : PIXI.Sprite, requiredWidth? : number, requiredHeight? : number) {
            this.scaleTo(sprite, requiredWidth, requiredHeight);

            sprite.x = 0;
            sprite.y = this.screenHeight - (1.0 - sprite.anchor.y) * (requiredHeight ? requiredHeight : sprite.height);
        }

        public putOnTopLeft(sprite : PIXI.Sprite, requiredWidth? : number, requiredHeight? : number) {
            this.scaleTo(sprite, requiredWidth, requiredHeight);

            sprite.x = 0;
            sprite.y = 0;
        }

        public putOnBottomRight(sprite : PIXI.Sprite, requiredWidth? : number, requiredHeight? : number) {
            this.scaleTo(sprite, requiredWidth, requiredHeight);

            sprite.x = this.screenWidth - (1.0 - sprite.anchor.x) * (requiredWidth ? requiredWidth : sprite.width);
            sprite.y = this.screenHeight - (1.0 - sprite.anchor.y) * (requiredHeight ? requiredHeight : sprite.height);

            return sprite;
        }

        public putOnTopRight(sprite : PIXI.Sprite, requiredWidth? : number, requiredHeight? : number) {
            this.scaleTo(sprite, requiredWidth, requiredHeight);

            sprite.x = this.screenWidth - (1.0 - sprite.anchor.x) * (requiredWidth ? requiredWidth : sprite.width);
            sprite.y = 0;
        }

        public scaleTo(sprite : PIXI.Sprite, requiredWidth : number, requiredHeight : number) : PIXI.Sprite {
            var scaleX = (requiredWidth && requiredWidth !== sprite.width) ? (requiredWidth/sprite.width) : 1.0,
                scaleY = (requiredHeight && requiredHeight !== sprite.height) ? (requiredHeight/sprite.height) : 1.0;

            if (scaleX !== 1.0 || scaleY !== 1.0) {
                sprite.scale.x = scaleX;
                sprite.scale.y = scaleY;
            }

            return sprite;
        }

    }
}
