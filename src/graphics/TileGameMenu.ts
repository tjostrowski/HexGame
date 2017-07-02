///<reference path='../logic/WorldDescription.ts' />
///<reference path='../All.ts' />

module Graphics {

    import BuildingType = Logic.BuildingType;
    import GameConfiguration = Logic.StaticConfiguration;

    export class TileGameMenu implements DisplayableElement {

        private _availableBuildingTypes : DictionaryValueTyped<BuildingType> = new DictionaryValueTyped<BuildingType>();
        private _enabledBuildingTypes : DictionaryValueTyped<BuildingType> = new DictionaryValueTyped<BuildingType>();

        private _texts : string[] = [];

        private _assetsManager : AssetsManager;

        private _popup : Popup;

        private _assetResources : AssetResource[] = [];

        constructor(backgroundAssetRes : AssetResource, expandMenuAssetRes : AssetResource) {
            this._popup = new Popup( backgroundAssetRes, expandMenuAssetRes );
        }

        public withAvailableBuildingTypes(buildingTypes : BuildingType[]) : TileGameMenu {
            this._availableBuildingTypes.clearAll();
            this._availableBuildingTypes.addAll(this.keyOfB, buildingTypes);
            return this;
        }

        public withEnabledBuildingTypes(buildingTypes : BuildingType[]) : TileGameMenu {
            this._enabledBuildingTypes.clearAll();
            this._enabledBuildingTypes.addAll(this.keyOfB, buildingTypes);
            return this;
        }

        public isAvailable(btype : BuildingType) {
            return this._availableBuildingTypes.containsKeyStr( this.keyOfB(btype) );
        }

        public isEnabled(btype : BuildingType) {
            return this._enabledBuildingTypes.containsKeyStr( this.keyOfB(btype) );
        }

        public isDisabled(btype : BuildingType) {
            return !this.isEnabled(btype);
        }

        public openTilePopup(cellX : number, cellY : number) {
            var popup = this._popup;

            var tween = popup.openWindow();

            var popupSprite = popup.sprite;

            var that = this;
            tween.onComplete.add(function() {

                var buildingsConf = All.staticConf.buildingsConf,
                    buildingsLayout : GridLayout = new GridLayout(popupSprite, buildingsConf.tileWidth, buildingsConf.tileHeight),
                    buildingTypes = that._availableBuildingTypes.values;

                for (var btype of buildingTypes) {
                    buildingsLayout.addAssetResource(new AssetTileResource( buildingsConf.assetFileName,
                                                                            buildingsConf.resourceName,
                                                                            buildingsConf.getIndex( btype, All.gameCtrl.level ) ) );
                }

                var that2 = that;
                buildingsLayout.addOnSpriteRenderedCallback(function(index : number, sprite : Phaser.Sprite) {
                    var btype : BuildingType = buildingTypes[index];
                    if (that2.isDisabled(btype)) {
                        SpriteUtils.greyOut(sprite);
                    } else {
                        sprite.inputEnabled = true;
                        sprite.events.onInputDown.add(function() {
                            var cursorSprite = SpriteUtils.copy(sprite);
                            All.graphicsCtrl.changeDefaultCursor(cursorSprite);
                        }, that2);
                    }
                });

                buildingsLayout.render();
            });
        }

        public renderTexts(renderArea : Phaser.Rectangle, padding : Padding, horizontalSpace : number, verticalSpace : number, desiredStyle? : any) {
            var textStyle = (desiredStyle) ? desiredStyle : this._conf._textStyle,
                game = All.game;

            var textsGroup = game.add.group();

            // no dimensions checking is done NOW!

            var x = renderArea.left, y = renderArea.top + padding.top;
            this._texts.forEach(text => {
                var textElem : Phaser.Text = game.add.text(x, y, text, textStyle, textsGroup);
                y += textElem.height + verticalSpace;
            });
        }

        addText(text : string) {
            this._texts.push(text);
        }

        clearAllTexts() {
            this._texts = [];
        }

        private keyOfB(type : BuildingType) {
            return type + "_";
        }

    }
}
