module Graphics {

    import SoldiersQuantity = Logic.SoldiersQuantity;
    import SoldierType = Logic.SoldierType;

    export class MoveSoldiersPopup {

        private _popup : Popup;

        private _soldierQuantities : SoldiersQuantity[];

        private _textsOfSoldiersTypes : Phaser.Text[] = [];
        private _slidersOfSoldierTypes : Slider[] = [];

        private _btnOk : Graphics.NineSliceTextButton;
        private _btnCancel : Graphics.NineSliceTextButton;

        private _onCommittedCloseCallbacks : Function[] = [];

        constructor(soldiersEntites : SoldiersQuantity[]) {
            this._soldierQuantities = soldiersEntites;
        }

        public add() {
            this._popup = new Popup(All.assets.find(Assets.menuRes),
                                    All.assets.find(Assets.expandMenuRes)
                                /*,400*/);

            var tween = this._popup.openWindow();

            tween.onComplete.add(
                function () {
                    var soldierEntites = this._soldierQuantities;
                    var group = All.game.add.group();

                    group.x = -this._popup.width * 0.5;
                    group.y = -this._popup.height * 0.5;

                    for (var soldiersQuantity of soldierEntites) {
                        var soldiersType = soldiersQuantity.soldierType;

                        var soldiersTypeText = All.game.add.text(0, 0, SoldierType[soldiersType].toString(),
                            Text.big(), group);
                        this._textsOfSoldiersTypes.push(soldiersTypeText);

                        var slider = new Slider(
                            soldiersQuantity.quantity,
                            soldiersQuantity.quantity,
                            200
                        );
                        slider.render();
                        slider.group.alignTo(soldiersTypeText, Phaser.RIGHT_CENTER, 16);
                        group.add(slider.group);
                        this._slidersOfSoldierTypes.push(slider);
                    }

                    var lastText = Utils.last(this._textsOfSoldiersTypes);

                    this._btnOk = new NineSliceTextButton('OK', 170, 50, Assets.btnOkRes);
                    this._btnOk.add();
                    this._btnOk.bgSprite.events.onInputDown.add(
                        function() {
                            for (var i = 0; i < this._slidersOfSoldierTypes.length; ++i) {
                                this._soldierQuantities[i].quantity = this._slidersOfSoldierTypes[i].value;
                            }

                            for (var callback of this._onCommittedCloseCallbacks) {
                                callback();
                            }

                            this._popup.closeWindow();
                        }, this
                    );
                    this._btnOk.bgSprite.alignTo(lastText, Phaser.BOTTOM_LEFT, 32, 30);
                    group.add(this._btnOk.bgSprite);

                    this._btnCancel = new NineSliceTextButton('Cancel', 170, 50, Assets.btnCancelRes);
                    this._btnCancel.add();
                    this._btnCancel.bgSprite.events.onInputDown.add(
                        function() {
                            this._popup.closeWindow();
                        }, this
                    );
                    this._btnCancel.bgSprite.alignTo(this._btnOk.bgSprite, Phaser.RIGHT_CENTER, 2);
                    group.add(this._btnCancel.bgSprite);

                    this._popup.sprite.anchor.setTo(0.5);
                    group.x = -100;
                    group.y = -100;
                    this._popup.sprite.addChild(group);
                }, this
            );

        }

        public addOnCommittedClose(callback : Function) {
            this._onCommittedCloseCallbacks.push(callback);
        }

    }

}
