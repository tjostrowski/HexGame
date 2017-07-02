/// <reference path="../PlayerGameTurn.ts"/>

module Logic {

    export class AIPlayerGameTurn extends PlayerGameTurn {

        constructor(playerView : PlayerView) {
            super(playerView);
        }

        private _finishedProgressingStage : boolean;

        public startPlayerMove() {
            console.trace('AI player starts move!');

            All.gameCtrl.disableInput();
            super.startPlayerMove();

            var unfinishedBuildings = this.getUnfinishedBuildings();
            var visibleTilesInfo : TileInfo[] = this._playerView.visibleTilesInfo;
            var finishedProgressingStage = false;

            this.proceed(unfinishedBuildings, visibleTilesInfo);
        }

        private proceed(unfinishedBuildings : BuildingEntity[], visibleTilesInfo : TileInfo[]) {
            All.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                if (this._turnPoints <= 0) {
                    this.endTurn();
                } else {
                    if (!this._finishedProgressingStage) {
                        var progressDone = this.buildProgressForRandomBuilding(unfinishedBuildings);
                        this._finishedProgressingStage = !progressDone;
                    } else {
                        var buildingDispatched = this.buildNewBuilding(visibleTilesInfo);
                        if (!buildingDispatched) {
                            this.endTurn();
                            return;
                        }
                    }
                    this.proceed(unfinishedBuildings, visibleTilesInfo);
                }
            }, this);
        }

        private buildProgressForRandomBuilding(unfinishedBuildings : BuildingEntity[]) : boolean {
            if (!Utils.isEmpty(unfinishedBuildings)) {
                var pickedBuilding : BuildingEntity = Utils.pickRandomElement(unfinishedBuildings);
                console.trace('[*AI-F] Finishing building at: ' + pickedBuilding.x + ' ' + pickedBuilding.y);
                All.cameraCtrl.moveCameraToHex(pickedBuilding.x, pickedBuilding.y);
                return this.makeBuildProgress(pickedBuilding);
            }
            return false;
        }

        private buildNewBuilding(visibleTilesInfo : TileInfo[]) : boolean {
            var pickedTileInfo : TileInfo = Utils.pickRandomElement(visibleTilesInfo);
            if (All.gameCtrl.isOccupied(pickedTileInfo.pos)) {
                return false;
            }
            var selectedCell = pickedTileInfo.pos;
            console.trace('[*AI-N] Creating new building at: ' + selectedCell.x + ' ' + selectedCell.y);
            All.cameraCtrl.moveCameraToHex(selectedCell.x, selectedCell.y);
            var availableBuildingTypes = this._playerView.getAvailableBuildingTypes();
            return this.dispatchNewBuilding(selectedCell, Utils.pickRandomElement(availableBuildingTypes));
        }

        public finishTurn() {
            All.gameCtrl.enableInput();
            console.trace('AI player finished turn!');
        }

        private getUnfinishedBuildings() : BuildingEntity[]  {
            return this._playerView.buildingEntities.filter(b => b.isDuringBuild());
        }

    }
}
