module Logic {

    export class GameController {
        private _worldInfo : Logic.WorldInfo;

        private _playerViews : PlayerView[] = [];

        private _gameTurns : PlayerGameTurn[][] = [];

        private _currentGameTurn : PlayerGameTurn;

        private _conf : GameConfiguration;

        private _resManager : ResourceManager;

        private _level : Logic.Level;

        private _game : Phaser.Game;

        private _context : Logic.GameContext;

        private _actionsCtrl : Logic.ActionsController;

        private _numPlayers : number;

        private _combatResolver : CombatResolver;

        constructor() {
            this._resManager = new ResourceManager();
            this._actionsCtrl = new ActionsController();
            this._context = new GameContext();

            this._numPlayers = All.gameConf.numPlayers;

            this._game = All.game;

            this._level = All.gameConf.level;

            this._combatResolver = new CombatResolver();

            All.registerGameCtrl(this);
        }

        public onTilemapLoaded(tilemap : Phaser.Tilemap) : GameController {
            if (this._worldInfo) {
                this._worldInfo.clearAll();
            }
            this._worldInfo = new Logic.WorldInfo(tilemap);
            this.addPlayerViewsFromConf();
            All.registerWorldInfo(this._worldInfo);
            return this;
        }

        private addPlayerViewsFromConf() {
            var gameConf = All.gameConf;
            for (var playerIdx = 1; playerIdx <= this._numPlayers; ++playerIdx) {
                var playerConf = gameConf.getPlayerConfiguration(playerIdx);
                this._playerViews.push(new PlayerView(
                    gameConf.getPlayer(playerIdx),
                    playerConf,
                    playerConf.initialPointsPerTurn,
                    playerConf.initialCenter,
                    playerConf.initialRadius));
            }
        }

        private _mouseDownOnGameArea : Function;
        private _mouseUpOnGameArea : Function;

        public enableInput() {
            var that = this,
                mouseDownOnGameArea = function(pointer : Phaser.Pointer, event : Phaser.Events) {
                    var tc = All.gameConf.terrainConf,
                        selectedCell = HexUtils.calculateClickedCell(tc.mapTileWidth, tc.mapTileHeight, pointer);

                    if (!selectedCell) {
                        return;
                    }

                    console.log('[DOWN] cell[x]=' + selectedCell.x + ' cell[y]=' + selectedCell.y + ' pointer='
                        + pointer.clientX + ' ' + pointer.clientY);

                    if ( Utils.isSingleClick(pointer) ) {
                        that.currentPlayerTurn.dispatchGameEvent(selectedCell);
                    }
                },
                mouseUpOnGameArea = function(pointer : Phaser.Pointer) {
                    var tc = All.gameConf.terrainConf,
                        selectedCell = HexUtils.calculateClickedCell(tc.mapTileWidth, tc.mapTileHeight, pointer);

                    if (!selectedCell) {
                        return;
                    }

                    console.log('[UP] cell[x]=' + selectedCell.x + ' cell[y]=' + selectedCell.y);

                    if ( Utils.isPointerHoldLong(pointer) ) {
                        // that.currentPlayerTurn.showTileInfo(selectedCell);
                    }
                };

            this._mouseDownOnGameArea = mouseDownOnGameArea;
            this._mouseUpOnGameArea = mouseUpOnGameArea;

            this._game.input.onDown.add(mouseDownOnGameArea);
            this._game.input.onUp.add(mouseUpOnGameArea);
        }

        public disableInput() {
            if (this._mouseDownOnGameArea) {
                this._game.input.onDown.remove(this._mouseDownOnGameArea);
            }
            if (this._mouseUpOnGameArea) {
                this._game.input.onUp.remove(this._mouseUpOnGameArea);
            }
        }

        public getPlayerView(playerIdx : number) : PlayerView {
            return (HexUtils.inRange(playerIdx, 0, this._numPlayers))
                ? this._playerViews[playerIdx]
                : null;
        }

        public startGame() {
            this._gameTurns = [];
            this.startTurn();
        }

        public switchPlayer() {
            console.debug('Try to switch player!');
            var currentTurn = this._gameTurns.length;
            var nextPlayerIndex = this._gameTurns[currentTurn - 1].length;
            if (nextPlayerIndex >= this._numPlayers) {
                this.startTurn();
                return;
            }

            if (!this._gameTurns[currentTurn - 1][nextPlayerIndex - 1].canFinish()) {
                return;
            }

            // start next player for this turn
            var playerGameTurn : PlayerGameTurn = this.createPlayerGameTurn(nextPlayerIndex+1, this._playerViews[nextPlayerIndex]);
            this._gameTurns[currentTurn - 1].push(playerGameTurn);
            console.log('Starting turn: ' + currentTurn + ' for player: ' + nextPlayerIndex);
            this._currentGameTurn = playerGameTurn;
            All.graphicsCtrl.renderPlayerView(this._playerViews[nextPlayerIndex]);
            playerGameTurn.startPlayerMove();
        }

        public startTurn() {
            console.debug('Try to start turn!');
            var currentTurn = this._gameTurns.length;
            if (currentTurn > 0) {
                var nextPlayerIndex = this._gameTurns[currentTurn - 1].length;
                if (nextPlayerIndex < this._numPlayers
                    || !this._gameTurns[currentTurn-1][nextPlayerIndex-1].canFinish()) {
                    return;
                }
            }

            // start with first player
            var playerView = this._playerViews[0];
            var playerGameTurn : PlayerGameTurn = this.createPlayerGameTurn(1, playerView);
            this._gameTurns[currentTurn] = [];
            this._gameTurns[currentTurn].push(playerGameTurn);
            this._currentGameTurn = playerGameTurn;
            playerGameTurn.startTurn();
            console.debug('Starting turn: ' + (currentTurn+1) + ' !!!');
            All.graphicsCtrl.renderPlayerView(playerView);
        }

        private createPlayerGameTurn(playerIndex : number, playerView : PlayerView) : PlayerGameTurn {
            var controlledBy = All.gameConf.controlledBy(playerIndex);
            switch (controlledBy) {
                case ControlledBy.HUMAN:
                    return new HumanPlayerGameTurn(playerView);
                case ControlledBy.AI:
                default:
                    return new AIPlayerGameTurn(playerView);
            }
        }

        public finishTurn() {
            this.currentPlayerTurn.finishTurn();
        }

        public dispatchGameEvent(affectedGridCell : Phaser.Point) {
            this.currentPlayerTurn.dispatchGameEvent(affectedGridCell);
        }

        public isOccupied(cell : Phaser.Point) {
            var playerView : PlayerView;
            for (playerView of this._playerViews) {
                if (playerView.isOccupiedByMe(cell)) {
                    return true;
                }
            }
            return false;
        }

        public getOccupyingPlayerView(cell : Phaser.Point) {
            for (var playerView of this._playerViews) {
                if (playerView.isOccupiedByMe(cell)) {
                    return playerView;
                }
            }
            return null;
        }

        public isEmpty(cell : Phaser.Point) {
            return !this.isOccupied(cell);
        }

        public get world() : Logic.WorldInfo {
            return this._worldInfo;
        }

        public get turnPoints() : number {
            return this._currentGameTurn.turnPoints;
        }

        public get level() {
            return this._level;
        }

        public get currentPlayerTurn() : PlayerGameTurn {
            return this._currentGameTurn;
        }

        public get currentPlayer() : Player {
            return All.gameConf.getPlayer(this.getCurrentPlayerIndex());
        }

        public get currentPlayerConfiguration() : PlayerConfiguration {
            return All.gameConf.getPlayerConfiguration(this.getCurrentPlayerIndex());
        }

        private getCurrentPlayerIndex() : number {
            var wholeCurrentTurn : PlayerGameTurn[] = Utils.last(this._gameTurns);
            return wholeCurrentTurn.length;
        }

    }

}
