/// <reference path="../PlayerGameTurn.ts"/>

module Logic {

    import MoveSoldiersPopup = Graphics.MoveSoldiersPopup;

    export class HumanPlayerGameTurn extends PlayerGameTurn {

        private _soldiersHandler;

        constructor(playerView : PlayerView) {
            super(playerView);
            this._soldiersHandler = SoldiersHandler.me;
        }

        public dispatchGameEvent(selectedCell : Phaser.Point) : boolean {
            if ( !this._playerView.isTileVisible(selectedCell) ) {
                return false;
            }

            if ( All.context.isEmpty() ) {
                var buildingOn = this._playerView.buildingOn(selectedCell);
                if (buildingOn) {
                    var sprite = buildingOn.sprite;
                    if (buildingOn.isDuringBuild()) {
                        this.makeBuildProgress(buildingOn);
                    } else if (buildingOn.isBuilt()) {

                        if (buildingOn.canProduceSomething()
                            && buildingOn.turnProductionCost <= this._turnPoints
                            && buildingOn.checkProductionPossible()
                            && !buildingOn.blocked) {

                            console.debug('Try to produce something');

                            var timerEvent = SpriteUtils.blinkWithFading(sprite);
                            buildingOn.blocked = true;
                            var that = this;
                            timerEvent.timer.onComplete.addOnce(function() {

                                var producedQuantity = buildingOn.makeProduce();
                                that.eatPoints(buildingOn.turnProductionCost);

                                if (producedQuantity instanceof SoldiersQuantity) {
                                    that._soldiersHandler.placeProducedSoldiers(
                                        that._playerView, buildingOn, <SoldiersQuantity>producedQuantity
                                    );
                                }

                                buildingOn.blocked = false;
                            });
                        }
                    }
                } else {
                    if (this._playerView.hasSoldiersOn(selectedCell)) {
                        var pointsPerMove = All.staticConf.turnPointsPerSoldiersMove();
                        var maxRange = Math.floor(this._turnPoints / pointsPerMove);
                        console.trace('*** RANGING, Max soldiers range : ' + maxRange);
                        var nearbyCells = HexUtils.getNearbyCells(selectedCell, maxRange,
                            All.worldInfo.sizeX, All.worldInfo.sizeY, false);

                        let rangedSpritesInfo : DictionaryTyped<Phaser.Point, Phaser.Sprite> =
                            new DictionaryTyped<Phaser.Point, Phaser.Sprite>();
                        for (var cell of nearbyCells) {
                            if (this._playerView.isVisible(cell)) {
                                var sprite = All.graphicsCtrl.putSoldiersRangeOn(cell);
                                rangedSpritesInfo.add(cell, sprite);
                            }
                        }

                        All.context.push(ContextFrame.of(
                            ContextAction.ACTION_RANGING_SOLDIERS,
                            ContextActionParam.of(ContextActionParamKey.ACTION_PARAM_SOLDIERS_CELL,
                                                    selectedCell),
                            ContextActionParam.of(ContextActionParamKey.ACTION_PARAM_SOLDIERS_RANGE,
                                                    rangedSpritesInfo)));
                    }
                }

                return;
            }

            var contextFrame = All.context.top(),
                contextAction = contextFrame.action;

            if (contextAction === ContextAction.ACTION_HOLDING) {
                var param1 = contextFrame.baseParam;
                if (param1.key === ContextActionParamKey.ACTION_PARAM_BUILDING) {
                    var buildingType : BuildingType = contextFrame.otherParams[0];

                    this.dispatchNewBuilding(selectedCell, buildingType);
                    All.context.pop();
                }
            } else if (contextAction === ContextAction.ACTION_RANGING_SOLDIERS) {
                var param1 = contextFrame.baseParam;
                var param2 = <ContextActionParam>contextFrame.otherParams[0];
                if (param1.key === ContextActionParamKey.ACTION_PARAM_SOLDIERS_CELL
                    && param2.key === ContextActionParamKey.ACTION_PARAM_SOLDIERS_RANGE) {

                    var soldiersCell = <Phaser.Point>param1.value;
                    var rangedSpritesInfo = <DictionaryTyped<Phaser.Point, Phaser.Sprite>>param2.value;

                    if (rangedSpritesInfo.containsKey(selectedCell) && !this._playerView.hasBuildingOn(selectedCell))  {
                        var newSpriteCreated = !this._playerView.hasSoldiersOn(selectedCell);
                        var soldiersSprite = newSpriteCreated
                            ? All.graphicsCtrl.putSoldiersOn(selectedCell,
                                SoldierType.KNIGHT, this._playerView.playerLevel)
                            : All.graphicsCtrl.getCachedSpriteOn(selectedCell);

                        All.actionsCtrl.putAction(new MoveSoldiersAction());

                        var copyOfSoldiersOn : SoldiersQuantity[] = [];
                        var soldiersOn = this._playerView.soldiersOn(soldiersCell);
                        for (var soldiersEntity of soldiersOn) {
                            copyOfSoldiersOn.push(soldiersEntity.soldiersQuantity.copyOf())
                        }

                        var newPosOnClickEvent =
                            function (sprite : Phaser.Sprite, pointer : Phaser.Pointer) {
                                All.actionsCtrl.getAction<MoveSoldiersAction>(MoveSoldiersAction.NAME)
                                    .moveWindowOpened = true;

                                var popup = new MoveSoldiersPopup(copyOfSoldiersOn);
                                popup.add();
                                var that = this;
                                popup.addOnCommittedClose(
                                    function() {
                                        if (that.allZeros(copyOfSoldiersOn)) {
                                            soldiersSprite.destroy();
                                            return;
                                        }

                                        All.context.pop();
                                        var allTransferred = that._playerView.transferSoldiers(
                                            soldiersCell, selectedCell, copyOfSoldiersOn);
                                        if (allTransferred) {
                                            All.graphicsCtrl.destroyCachedSpritesOn(soldiersCell);
                                        }
                                        console.trace('*** Transfer committed ' + (allTransferred ? 'ALL' : 'PARTIALLY')
                                            + ' soldier units to hex: ' + selectedCell + ' from hex: ' + soldiersCell);
                                    }
                                );
                            };

                        if (newSpriteCreated) {
                            soldiersSprite.inputEnabled = true;
                            soldiersSprite.events.onInputDown.add(newPosOnClickEvent, this);
                        }

                        var timerEvent = SpriteUtils.blinkWithFading(soldiersSprite, 500, 2);
                        timerEvent.timer.onComplete.addOnce(
                            function() {
                                soldiersSprite.events.onInputDown.remove(newPosOnClickEvent, this);

                                if (!All.actionsCtrl.getAction<MoveSoldiersAction>(MoveSoldiersAction.NAME)
                                        .moveWindowOpened) {
                                    All.context.pop();
                                    All.graphicsCtrl.destroyCachedSpritesOn(soldiersCell);
                                    this._playerView.transferAllSoldiers(soldiersCell, selectedCell);
                                    console.trace('*** Transfer ALL soldier units to hex: ' + selectedCell
                                        + ' from hex: ' + soldiersCell);
                                }

                                console.trace('DESTROYING all ranged sprites!!!');
                                SpriteUtils.destroyAll(rangedSpritesInfo.values);
                            }, this);
                    }
                }
            }
        }

    }
}
