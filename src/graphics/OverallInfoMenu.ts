module Graphics {

    import PlayerView = Logic.PlayerView;
    import PlayerGameTurn = Logic.PlayerGameTurn;

    export class OverallInfoMenu extends BasicDisplayableElement {

        private _window : PopupExpandedWithButton;
        private _playerView : PlayerView;

        private _playerGameTurn : PlayerGameTurn;

        private _btnEndTurn : NineSliceTextButton;

        private _timer : Phaser.Timer;

        constructor(playerView : PlayerView) {
            super();

            var assets = All.assets;
            this._window = new Graphics.PopupExpandedWithButton(Graphics.Position.TOP_RIGHT,
                assets.find(Assets.popupOpenButtonRes),
                assets.find(Assets.popupCloseButtonRes),
                assets.find(Assets.popupBackgroundRes)
             );

            this._timer = All.game.time.create(true);
        }

        public init() {
        }

        public render() {
            this._window.render();

            var textGroup = All.game.add.group();
            var that = this;
            var text;
            this._window.addWhenMaximized(
                function(backWindow : SpritedWindow, backSprite : Phaser.Sprite, button : Phaser.Button) {
                    that.createAll(textGroup, backSprite);
                }
            );

            this._window.addWhenMinimized(
                function(backWindow : SpritedWindow, backSprite : Phaser.Sprite, button : Phaser.Button) {
                    that.clearAll(textGroup);
                    that._timer.stop();
                }
            );
        }

        private createAll(textGroup : Phaser.Group, backSprite : Phaser.Sprite) {
            var that = this;

            that._playerGameTurn = All.gameCtrl.currentPlayerTurn;
            that._playerView = that._playerGameTurn.playerView;

            var space = 5;

            var txtTurnPoints = All.game.add.text(-backSprite.width + 10, 0,
                "Turn points: " + that._playerGameTurn.turnPoints, Text.huge());
            textGroup.add(txtTurnPoints);

            var txtNumSoldiers = All.game.add.text(0, 0,
                "Soldiers: " + that._playerView.totalNumSoldiers, Text.huge());
            txtNumSoldiers.alignTo(txtTurnPoints, Phaser.BOTTOM_LEFT);
            textGroup.add(txtNumSoldiers);

            var txtNumBuildings = All.game.add.text(0, 0,
                "Buildings: " + that._playerView.totalNumBuildings, Text.huge());
            txtNumBuildings.alignTo(txtNumSoldiers, Phaser.BOTTOM_LEFT);
            textGroup.add(txtNumBuildings);

            var textAbove = txtNumBuildings,
                globalResources = All.staticConf.globalResources;
            for (var resEntity of globalResources.values) {
                let resText = All.game.add.text(0, 0,
                    resEntity.resourceQuantity.toString(), Text.big());
                resText.alignTo(textAbove, Phaser.BOTTOM_LEFT);
                textGroup.add(resText);
                textAbove = resText;
            }

            this._btnEndTurn = new NineSliceTextButton('End turn', 200, 50);
            this._btnEndTurn.add();
            this._btnEndTurn.bgSprite.alignTo(textAbove, Phaser.BOTTOM_RIGHT, 0, 30);
            this._btnEndTurn.bgSprite.events.onInputDown.add(function() {
                this._playerGameTurn.forceFinished = true;
                All.gameCtrl.finishTurn();
                All.gameCtrl.switchPlayer();
                this.refreshAll(textGroup, backSprite);
            }, this);

            // var btnEndTurn = All.game.add.button(-backSprite.width + 20, textAbove.y + textAbove.height + space, Assets.endTurnButtonRes, endTurnCallback);
            // btnEndTurn.alignIn(txtNumBuildings, Phaser.BOTTOM_CENTER);
            textGroup.add(this._btnEndTurn.bgSprite);
            // textGroup.add(btnEndTurn.btnText);

            backSprite.addChild(textGroup);

            this._timer.loop(Phaser.Timer.SECOND, function() {
                var currentPlayerTurn = All.gameCtrl.currentPlayerTurn;
                txtTurnPoints.setText("Turn points: " + currentPlayerTurn.turnPoints.toString());
                txtNumSoldiers.setText("Soldiers: " + currentPlayerTurn.playerView.totalNumSoldiers);
                txtNumBuildings.setText("Buildings: " + currentPlayerTurn.playerView.totalNumBuildings);
            }, this);
            this._timer.start();
        }

        private clearAll(textGroup : Phaser.Group) {
            while (textGroup.length > 0) {
                var child = textGroup.getAt(0);
                textGroup.remove(child);
                if (child instanceof Phaser.Text/* || child instanceof Phaser.Sprite*/) {
                    child.destroy();
                }
            }
            this._btnEndTurn.btnText.destroy();
        }

        private refreshAll(textGroup : Phaser.Group, backSprite : Phaser.Sprite) {
            this.clearAll(textGroup);
            this.createAll(textGroup, backSprite);
        }
    }
}
