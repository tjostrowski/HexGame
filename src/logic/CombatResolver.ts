module Logic {

    import SoldierType = Logic.SoldierType;
    import TileType = Logic.TileType;

    export class CombatResolver {

        private static DEFAULT_NUM_ROUNDS = 5;

        private _numRounds : number;

        constructor() {
            All.registerCombatResolver(this);
            this._numRounds = CombatResolver.DEFAULT_NUM_ROUNDS;
        }

        public resolveCombatBetweenCells(cell1 : Phaser.Point, cell2 : Phaser.Point) {
            var playerViewAtCell1 = All.gameCtrl.getOccupyingPlayerView(cell1),
                playerViewAtCell2 = All.gameCtrl.getOccupyingPlayerView(cell2);

            if (!playerViewAtCell1 || !playerViewAtCell2) {
                console.trace('Cell: ' + (!playerViewAtCell1 ? cell1 : cell2) + ' is unoccupied');
                return;
            }

            // soldiers vs soldiers fight
            if (playerViewAtCell1.isOccupiedByMySoldiers(cell1) && playerViewAtCell2.isOccupiedByMySoldiers(cell2)) {

                console.trace('Cell: ' + cell1 + ' is occupied by soldiers of: ' + playerViewAtCell1.player.name);
                console.trace('Cell: ' + cell2 + ' is occupied by soldiers of: ' + playerViewAtCell2.player.name);

                var soldierEntities1 = playerViewAtCell1.soldiersOn(cell1),
                    soldierEntities2 = playerViewAtCell2.soldiersOn(cell2);

                this.resolveCombat(cell1, soldierEntities1, cell2, soldierEntities2);

                soldierEntities1.forEach(newEntity => playerViewAtCell1.updateSoldiersOn(cell1, newEntity));
                soldierEntities2.forEach(newEntity => playerViewAtCell2.updateSoldiersOn(cell2, newEntity));

            } else if (playerViewAtCell1.isOccupiedByMyBuilding(cell1) && playerViewAtCell2.isOccupiedByMySoldiers(cell2)) {

                console.trace('Cell: ' + cell1 + ' is occupied by building of: ' + playerViewAtCell1.player.name);
                console.trace('Cell: ' + cell2 + ' is occupied by soldiers of: ' + playerViewAtCell2.player.name);

                var buildingEntity1 = playerViewAtCell1.buildingOn(cell1),
                    soldierEntities2 = playerViewAtCell2.soldiersOn(cell2);

                this.resolveBuildingDestroy(cell2, soldierEntities2, cell1, buildingEntity1);

                playerViewAtCell1.updateBuildingOn(cell1, buildingEntity1);

            } else if (playerViewAtCell1.isOccupiedByMySoldiers(cell1) && playerViewAtCell2.isOccupiedByMyBuilding(cell2)) {

                console.trace('Cell: ' + cell1 + ' is occupied by soldiers of: ' + playerViewAtCell1.player.name);
                console.trace('Cell: ' + cell2 + ' is occupied by building of: ' + playerViewAtCell2.player.name);

                var soldierEntities1 = playerViewAtCell1.soldiersOn(cell1),
                    buildingEntity2 = playerViewAtCell2.buildingOn(cell2);

                this.resolveBuildingDestroy(cell1, soldierEntities1, cell2, buildingEntity2);

                playerViewAtCell2.updateBuildingOn(cell2, buildingEntity2);

            } else {
                console.trace('Cells: ' + cell1 + ' and ' + cell2 + 'both occupied by buildings, nothing to do');
            }
        }

        public resolveCombat(cell1 : Phaser.Point, soldierEntities1 : SoldiersEntity[],
                             cell2 : Phaser.Point, soldierEntities2 : SoldiersEntity[]) {

            var overallForce1 = this.computeOverallForce(cell1, soldierEntities1),
                overallForce2 = this.computeOverallForce(cell2, soldierEntities2);

            for (var i = 0; i < this._numRounds; ++i) {
                var rnd = Utils.randomTo(overallForce1 + overallForce2);
                if (rnd <= overallForce1) {
                    var entityChosen = Utils.pickRandomElement(soldierEntities2);
                    entityChosen.decrementNumSoldiers();
                } else {
                    var entityChosen = Utils.pickRandomElement(soldierEntities1);
                    entityChosen.decrementNumSoldiers();
                }
            }
        }

        public resolveBuildingDestroy(cell1 : Phaser.Point, soldierEntities1 : SoldiersEntity[],
                                      cell2 : Phaser.Point, building2 : BuildingEntity) {

            var soldiersForce = this.computeOverallForce(cell1, soldierEntities1),
                buildingForce = this.getTerrainMultiplier( All.worldInfo.getTileInfo(cell2.x, cell2.y).tileType );

            var multiplier = Math.max(3, soldiersForce/(4*buildingForce) );
            building2.undoBuildProgress(All.staticConf.buildingUndoPoints(building2.buildingType, All.gameCtrl.level) * multiplier);
        }

        private computeOverallForce(cell : Phaser.Point, soldierEntities: SoldiersEntity[]) {
            var force : number = 0;
            soldierEntities.forEach(soldierEntity => {
                force += (this.getForceMultiplier(soldierEntity.soldierType) * soldierEntity.numSoldiers)
                            * this.getTerrainMultiplier( All.worldInfo.getTileInfo(cell.x, cell.y).tileType );
            });
            return force;
        }

        private getForceMultiplier(soldierType : SoldierType) : number {
            switch (soldierType) {
                case SoldierType.KNIGHT:
                case SoldierType.ARCHER:
                default:
                    return 1;
                case SoldierType.KNIGHT_OFFICER:
                case SoldierType.ARCHER_OFFICER:
                    return 3;
            }
        }

        private getTerrainMultiplier(tileType : TileType) : number {
            switch (tileType) {
                case TileType.GRASS:
                case TileType.LOW_DESERT:
                case TileType.DESERT:
                default:
                    return 1;
                case TileType.FOREST:
                    return 2;
                case TileType.ROCKS:
                case TileType.MOUNTAINS:
                    return 4;
            }

        }

        public set numRounds(numRounds : number) {
            this._numRounds = numRounds;
        }

        public get numRounds() : number {
            return this._numRounds;
        }
    }
}
