/// <reference path="../logic/GameContext.ts"/>

module Graphics {

    import PlayerView = Logic.PlayerView;
    import BuildingType = Logic.BuildingType;
    import ContextFrame = Logic.ContextFrame;
    import ContextAction = Logic.ContextAction;
    import ContextActionParam = Logic.ContextActionParam;
    import ParamKey = Logic.ContextActionParamKey;

    export class GameMenu extends BasicDisplayableElement {

        private _window : PopupExpandedWithButton;
        private _playerView : PlayerView;

        private _availableBuildingTypes : DictionaryValueTyped<BuildingType>;
        private _enabledBuildingTypes : DictionaryValueTyped<BuildingType>;

        constructor(playerView : PlayerView) {
            super();
            this._playerView = playerView;
            var assets = All.assets;
            this._window = new Graphics.PopupExpandedWithButton(Graphics.Position.ENTIRE_BOTTOM,
                assets.find(Assets.popupOpenButtonRes),
                assets.find(Assets.popupCloseButtonRes),
                assets.find(Assets.popupBackgroundRes)
            );

            var key = this.keyOfB;
            this._availableBuildingTypes = Utils.toDictionary<BuildingType>( key, playerView.getAvailableBuildingTypes() );
            this._enabledBuildingTypes = Utils.toDictionary<BuildingType>( key, playerView.getEnabledBuildingTypes() );
        }

        public init() {
        }

        public render() {
            var slider = this._window,
                that = this;
            slider.render();

            var buildingsGroup = All.game.add.group();

            slider.addWhenMaximized(
                function(backWindow : SpritedWindow, backSprite : Phaser.Sprite, closeButton : Phaser.Button) {
                    var buildingsConf = All.gameCtrl.currentPlayerConfiguration.buildingsConf;
                    let prevContainer : Phaser.Button | Phaser.Sprite = closeButton;
                    var spriteWidth = prevContainer.width,
                        spriteHeight = prevContainer.height;
                    var x = closeButton.width + 16,
                        y = All.graphicsCtrl.screenHeight - spriteHeight;
                    for (let btype of that._availableBuildingTypes.values) {
                        let sprite = All.game.add.sprite(x, y, buildingsConf.resourceName,
                                                         buildingsConf.getIndex(btype, All.gameCtrl.level));
                        x += spriteWidth + 16;
                        All.graphicsCtrl.scaleTo(sprite, spriteWidth, spriteHeight);
                        // sprite.alignTo(prevContainer, Phaser.RIGHT_CENTER, 16);
                        sprite.fixedToCamera = true;
                        // backSprite.addChild(sprite);
                        prevContainer = sprite;

                        if ( ! that._enabledBuildingTypes.containsKeyStr(that.keyOfB(btype)) ) {
                            SpriteUtils.greyOut(sprite);
                        } else {
                            sprite.inputEnabled = true;
                            var that2 = that;
                            sprite.events.onInputDown.add(function(pointer : Phaser.Pointer) {
                                console.debug('Dragging building! pointer=' + pointer.x + ' ' + pointer.y);
                                let cursorSprite = SpriteUtils.copy(sprite);
                                All.graphicsCtrl.changeDefaultCursor(cursorSprite);
                                All.context.push( ContextFrame.of(
                                    ContextAction.ACTION_HOLDING,
                                    ContextActionParam.of(ParamKey.ACTION_PARAM_BUILDING),
                                    btype) );
                            }, that2, 100);
                        }

                        buildingsGroup.add(sprite);
                    }
                }
            );

            this._window.addWhenStartMinimizing(
                function(backWindow : SpritedWindow, backSprite : Phaser.Sprite, button : Phaser.Button) {
                    while (buildingsGroup.length > 0) {
                        var child = buildingsGroup.getAt(0);
                        buildingsGroup.remove(child);
                        if (child instanceof Phaser.Text) {
                            child.destroy();
                        }
                    }
                }
            );
        }

        private keyOfB(type : BuildingType) {
            return type + "_";
        }

    }

}
