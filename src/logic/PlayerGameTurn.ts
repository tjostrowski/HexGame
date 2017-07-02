module Logic {

    export class PlayerGameTurn {
        protected _playerView : PlayerView;
        protected _turnPoints : number;
        protected _forceFinished : boolean;

        constructor(playerView : PlayerView) {
            this._playerView = playerView;
            this._turnPoints = playerView.initialPointsPerTurn;
        }

        ///////////////////////////////////////////////////////////////////
        /////////////////// BASIC LOGIC ///////////////////////////////////
        ///////////////////////////////////////////////////////////////////

        public startTurn() {
            this._turnPoints = this._playerView.initialPointsPerTurn;
            this.startPlayerMove();
        }

        public finishTurn() {
        }

        public startPlayerMove() {
            this._turnPoints = this._playerView.initialPointsPerTurn;
            var center = this._playerView.center;
            All.cameraCtrl.moveCameraToHex(center.x, center.y);
        }

        private allZeros(soldiersQuantities : SoldiersQuantity[]) {
            return soldiersQuantities.filter(quantity => quantity.quantity > 0)
                .length === 0;
        }

        public showTileInfo(selectedCell : Phaser.Point) : boolean {
            if ( !this._playerView.isTileVisible(selectedCell) ) {
                return false;
            }

            All.tileGameMenu.openTilePopup(selectedCell.x, selectedCell.y);
        }

        public dispatchGameEvent(selectedCell : Phaser.Point) : boolean {
            return false;
        }

        protected dispatchNewBuilding(selectedCell : Phaser.Point, buildingType : BuildingType) : boolean {
            if (this._playerView.hasBuildingOn(selectedCell)) {
                return false;
            }

            var level = this._playerView.playerLevel;

            var buildingTurnCost = All.staticConf.getBuildTurnCost(buildingType, level);
            if (buildingTurnCost > this._turnPoints) {
                return false;
            }

            var newBuilding = this._playerView.addBuildingOn(selectedCell, buildingType, level);
            var createdSprite = All.graphicsCtrl.putBuildingOn(selectedCell, buildingType, level);
            SpriteUtils.greyOut(createdSprite); // building firstly
            newBuilding.sprite = createdSprite;

            var eatenPoints = newBuilding.makeBuildProgress();
            console.debug('Eaten points by building: ' + eatenPoints);
            this.eatPoints(eatenPoints);

            if (newBuilding.isBuilt()) {
                SpriteUtils.undoGreyOut(newBuilding.sprite);
            }

            All.graphicsCtrl.restoreDefaultCursor();
            All.context.pop();

            return true;
        }

        protected eatPoints(points : number) {
            this._turnPoints -= points;
            if (this._turnPoints <= 0) {
                All.gameCtrl.finishTurn();
                All.gameCtrl.switchPlayer();
            }
        }

        protected endTurn() {
            this.forceFinished = this._turnPoints > 0;
            All.gameCtrl.finishTurn();
            All.gameCtrl.switchPlayer();
        }

        protected makeBuildProgress(buildingOn : BuildingEntity, onFinished : Function = null) : boolean {
            console.debug('Build progress=' + buildingOn.buildProgress);
            var sprite = buildingOn.sprite;
            var buildTurnCost = buildingOn.buildTurnCost;
            if (buildTurnCost <= this._turnPoints && !buildingOn.blocked) {
                var timerEvent = SpriteUtils.blinkWithFading(sprite);
                buildingOn.blocked = true;
                var that = this;
                timerEvent.timer.onComplete.addOnce(function() {
                    buildingOn.makeBuildProgress();
                    that.eatPoints(buildTurnCost);
                    if (buildingOn.isBuilt()) {
                        SpriteUtils.undoGreyOut(sprite);
                    }
                    buildingOn.blocked = false;
                    if (onFinished) {
                        onFinished();
                    }
                });
                return true;
            }
            return false;
        }

        public get playerView() : PlayerView {
            return this._playerView;
        }

        public set forceFinished(setFinished : boolean) {
            this._forceFinished = setFinished;
        }

        public get forceFinished() : boolean {
            return this._forceFinished;
        }

        public get turnPoints() : number {
            return this._turnPoints;
        }

        public isFinished() : boolean {
            return this._turnPoints <= 0;
        }

        public isActive() : boolean {
            return !this.isFinished();
        }

        public canFinish() {
            return this.isFinished() || this._forceFinished;
        }
    }
}

class MoveSoldiersAction extends Logic.Action {
    public static NAME = "MoveSoldiers";

    private _moveWindowOpened : boolean;
    private _moveWindowCommitted : boolean;

    constructor() {
        super(MoveSoldiersAction.NAME);
        this._moveWindowOpened = false;
        this._moveWindowCommitted = false;
    }

    public get moveWindowOpened() : boolean {
        return this._moveWindowOpened;
    }

    public set moveWindowOpened(opened : boolean) {
        this._moveWindowOpened = opened;
    }

    public get moveWindowCommitted() : boolean {
        return this._moveWindowCommitted;
    }

    public set moveWindowCommitted(committed : boolean) {
        this._moveWindowCommitted = committed;
    }
}
