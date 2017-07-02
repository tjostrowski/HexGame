module Logic {

    export class PlayerView {
        private _worldInfo : WorldInfo;

        private _visibleTilesInfo : DictionaryTyped<Phaser.Point, TileInfo> = new DictionaryTyped<Phaser.Point, TileInfo>();

        private _totalResourcesInfoMap : Dictionary = new Dictionary();

        private _totalNumSoldiers : number;
        private _soldiersEntities : SoldiersEntity[] = []; // TODO: rewrite to DictionaryWithManyKeyValues

        private _buildingEntities : BuildingEntity[] = []; // TODO: rewrite to DictionaryWithManyKeyValues

        private _initialPointsPerTurn : number;

        private _occupiedPositions : DictionaryValueTyped<OccupyType> = new DictionaryValueTyped<OccupyType>();

        private _playerLevel : Level;

        private _center : Phaser.Point;

        private _player : Player;

        private _playerConf : PlayerConfiguration;

        ///////////////////////////////////////////////////////////////////
        /////////////////// JUST VIEW INFO DATA ///////////////////////////
        ///////////////////////////////////////////////////////////////////

        constructor(player : Player, playerConf : PlayerConfiguration, initialPointsPerTurn : number, center : Phaser.Point, radius : number) {
            this._player = player;
            this._playerConf = playerConf;
            this._worldInfo = All.worldInfo;
            this._initialPointsPerTurn = initialPointsPerTurn;
            this.calculateInitiallyVisibleTiles(center, radius);
            this._center = center;
            this._playerLevel = Level.SIMPLE;
            this._totalNumSoldiers = 0;
        }

        private calculateInitiallyVisibleTiles(center : Phaser.Point, radius : number) {
            var nearbyTilesInfo : TileInfo[] = HexUtils.getNearbyTilesInfo(this._worldInfo, center, radius);
            nearbyTilesInfo.forEach(tileInfo =>
                this._visibleTilesInfo.addIfAbsent(tileInfo.pos, tileInfo ) );
        }

        public getAvailableBuildingTypes() : BuildingType[] {
            return [
                BuildingType.TREE_HUT,
                BuildingType.COAL_MINE,
                BuildingType.IRON_MINE,
                BuildingType.STEEL_MILL,
                BuildingType.ARMORY
            ];
        }

        public getEnabledBuildingTypes() : BuildingType[] {
            var types : BuildingType[] = [];
            types.push(BuildingType.TREE_HUT);
            types.push(BuildingType.COAL_MINE);
            types.push(BuildingType.IRON_MINE);
            if ( this.hasBuilt(BuildingType.IRON_MINE) && this.hasBuilt(BuildingType.COAL_MINE) ) {
                types.push(BuildingType.STEEL_MILL);
            }
            // if ( this.hasBuilt(BuildingType.STEEL_MILL) ) {
                types.push(BuildingType.ARMORY);
            // }

            return types;
        }

        public tryAddSoldiersOn(cell: Phaser.Point, soldiersQuantity : SoldiersQuantity) : SoldiersEntity {
            if (All.gameCtrl.isEmpty(cell)) {

                var soldiersEntity = new SoldiersEntity(soldiersQuantity, cell);
                this._soldiersEntities.push(soldiersEntity);
                this.occupyPosition(cell, OccupyType.SOLDIERS);
                this.addVisibleTiles( HexUtils.getNearbyTilesInfo(this._worldInfo, cell,
                    All.staticConf.getSoldiersViewExtend(soldiersQuantity.soldierType, this._playerLevel) ));
                return soldiersEntity;

            } else if ( this.isOccupiedByMySoldiers(cell) ) {

                var mySoldiersOnCell : SoldiersEntity = this.soldiersOn(cell, soldiersQuantity.soldierType)[0];
                mySoldiersOnCell.add(soldiersQuantity.quantity);
                this.addVisibleTiles( HexUtils.getNearbyTilesInfo(this._worldInfo, cell,
                    All.staticConf.getSoldiersViewExtend(soldiersQuantity.soldierType, this._playerLevel) ));
                return mySoldiersOnCell;

            } else {
                console.error('Cannot add soldiers: ' + soldiersQuantity + ' on cell: ' + cell);
            }

            return null;
        }

        public addVisibleTiles(newTilesInfo : TileInfo[]) {
            var keyf = this.tiKey;
            newTilesInfo.forEach(tileInfo => {
                if ( !this._visibleTilesInfo.containsKey(tileInfo.pos) ) {
                    All.graphicsCtrl.putTile(tileInfo.x, tileInfo.y);
                }
                this._visibleTilesInfo.addIfAbsent(tileInfo.pos, tileInfo );
            });
        }

        public isTileVisible(cell : Phaser.Point) : boolean {
            return this._visibleTilesInfo.values.filter(tileInfo => (tileInfo.x === cell.x && tileInfo.y === cell.y)).length > 0;
        }

        public hasBuilt(buildingType : BuildingType) {
            return this._buildingEntities.filter(entity => entity.buildingType === buildingType).length > 0;
        }

        public hasBuildingOn(cell : Phaser.Point) {
            return this._buildingEntities.filter(buildingEntity => (buildingEntity.x === cell.x && buildingEntity.y === cell.y)).length > 0;
        }

        public soldiersOn(cell : Phaser.Point, soldiersType? : SoldierType, minSumSoldiers? : number) : SoldiersEntity[] {
            var soldierEntities : SoldiersEntity[] = this._soldiersEntities.filter(soldierEntity =>
                (   soldierEntity.x === cell.x && soldierEntity.y === cell.y
                    && (!soldiersType || soldierEntity.soldierType === soldiersType)
                    && (!minSumSoldiers || soldierEntity.numSoldiers >= minSumSoldiers) ) );

            return soldierEntities;
        }

        public updateSoldiersOn(cell : Phaser.Point, updatedSoldiersEntity : SoldiersEntity) {
            var newSoldiersType = updatedSoldiersEntity.soldierType,
                newSoldiersNum = updatedSoldiersEntity.numSoldiers;

            var existingSoldierEntitiesOfType = this.soldiersOn(cell, newSoldiersType);
            if (existingSoldierEntitiesOfType.length > 0) {
                if (newSoldiersNum === 0) {
                    this._soldiersEntities.splice(this._soldiersEntities.indexOf(existingSoldierEntitiesOfType[0]), 1);
                } else {
                    existingSoldierEntitiesOfType[0].numSoldiers = updatedSoldiersEntity.numSoldiers;
                }
            } else {
                if (newSoldiersNum > 0) {
                    this._soldiersEntities.push(updatedSoldiersEntity);
                }
            }
        }

        public updateBuildingOn(cell : Phaser.Point, updatedBuildingEntity : BuildingEntity) {
            if (updatedBuildingEntity.buildProgress <= 0) {
                this._buildingEntities.splice(this._buildingEntities.indexOf(updatedBuildingEntity), 1);
            }
        }

        public hasSoldiersOn(cell : Phaser.Point) {
            var soldiersOn = this.soldiersOn(cell);
            return soldiersOn && soldiersOn.length > 0;
        }

        public transferAllSoldiers(fromCell : Phaser.Point, toCell : Phaser.Point) {
            var soldierEntitiesFrom = this.soldiersOn(fromCell);
            var soldierEntitiesTo = this.soldiersOn(toCell) || [];

            for (var soldiersEntityFrom of soldierEntitiesFrom) {
                var soldierTypeFrom = soldiersEntityFrom.soldierType;

                var typeExistsInToCell = false;
                for (var soldierEntityTo of soldierEntitiesTo) {
                    if (soldierEntityTo.soldierType === soldierTypeFrom) {
                        soldierEntityTo.add(soldiersEntityFrom.soldiersQuantity.quantity);
                        typeExistsInToCell = true;
                        break;
                    }
                }

                if (!typeExistsInToCell) {
                    soldiersEntityFrom.localization = toCell;
                } else {
                    var deletedElems = this._soldiersEntities.splice(this._soldiersEntities.indexOf(soldiersEntityFrom), 1);
                }
            }

            this.releasePosition(fromCell);
            this.occupyPosition(toCell, OccupyType.SOLDIERS);
        }

        public transferSoldiers(fromCell : Phaser.Point, toCell : Phaser.Point, soldiersQuantities : SoldiersQuantity[])
            : boolean {
            var soldierEntitiesFrom = this.soldiersOn(fromCell);
            var soldierEntitiesTo = this.soldiersOn(toCell) || [];
            var allDeletedOnFrom = true;

            for (var soldiersEntityFrom of soldierEntitiesFrom) {
                var soldierTypeFrom = soldiersEntityFrom.soldierType;

                var requiredQuantity = 0;
                for (var soldiersQuantity of soldiersQuantities) {
                    if (soldiersQuantity.soldierType === soldierTypeFrom) {
                        requiredQuantity = soldiersQuantity.quantity;
                        break;
                    }
                }

                if (requiredQuantity > 0) {
                    console.debug('Transferring quantity : ' + requiredQuantity);
                    var typeExistsInToCell = false;
                    for (var soldierEntityTo of soldierEntitiesTo) {
                        if (soldierEntityTo.soldierType === soldierTypeFrom) {
                            soldierEntityTo.add(requiredQuantity);
                            typeExistsInToCell = true;
                            break;
                        }
                    }

                    if (!typeExistsInToCell) {
                        console.debug('Creating new entity with quantity : ' + requiredQuantity);
                        var newSoldiersEntity = new SoldiersEntity(
                            new SoldiersQuantity(soldierTypeFrom, requiredQuantity),
                            toCell);
                        this._soldiersEntities.push(newSoldiersEntity);
                    }

                    this.occupyPosition(toCell, OccupyType.SOLDIERS);

                    console.debug('FROM entity has quantity : ' + soldiersEntityFrom.soldiersQuantity.quantity);
                    soldiersEntityFrom.subtract(requiredQuantity);
                    if (soldiersEntityFrom.isEmpty()) {
                        this._soldiersEntities.splice(this._soldiersEntities.indexOf(soldiersEntityFrom), 1);
                    } else {
                        allDeletedOnFrom = false;
                    }
                } else {
                    allDeletedOnFrom = false;
                }
            }

            if (allDeletedOnFrom) {
                this.releasePosition(fromCell);
            }

            return allDeletedOnFrom;
        }

        public get totalResourcesInfoMap() : Dictionary {
            return this._totalResourcesInfoMap;
        }

        public get visibleTilesInfo() : TileInfo[] {
            return this._visibleTilesInfo.values;
        }

        public get initialPointsPerTurn() {
            return this._initialPointsPerTurn;
        }

        public get world() {
            return this._worldInfo;
        }

        public get playerLevel() : Level {
            return this._playerLevel;
        }

        public isVisible(cell : Phaser.Point) : boolean {
            return this._visibleTilesInfo.containsKey(cell);
        }

        public isInFog(cell : Phaser.Point) : boolean {
            return this.isInvisible(cell);
        }

        public isInvisible(cell : Phaser.Point) : boolean {
            return ! this.isVisible(cell);
        }

        public get center() : Phaser.Point {
            return this._center;
        }

        private recomputeCenter() : Phaser.Point {
            // TODO:
            return null;
        }

        public buildingOn(cell : Phaser.Point) : BuildingEntity {
            var entities : BuildingEntity[] = this._buildingEntities.filter(buildingEntity =>
                (buildingEntity.x === cell.x && buildingEntity.y === cell.y));
            return (entities.length > 0) ? entities[0] : null;
        }

        public addBuildingOn(cell : Phaser.Point, type : BuildingType, level : Level) : BuildingEntity {

            if ( All.gameCtrl.isOccupied(cell) ) {
                console.debug("Cannot build on: " + cell + " since it is occupied");
                return null;
            }

            var resManager = All.resourceManager;
            var conf = All.staticConf;

            var buildingEntity = new BuildingEntity(
                type,
                level,
                this.world.getTileInfo(cell.x, cell.y),
                resManager.getBuildTurnCost(type, level),
                resManager.getTotalBuildCost(type, level),
                resManager.getProductionForAllLevels(type) );

            this._buildingEntities.push(buildingEntity);

            this.occupyPosition(cell, OccupyType.BUILDING);

            this.addVisibleTiles( HexUtils.getNearbyTilesInfo(this._worldInfo, cell, conf.getBuildingViewExtend(type, level) ));

            return buildingEntity;
        }

        private occupyPosition(cell : Phaser.Point, type : OccupyType) {
            this._occupiedPositions.addIfAbsent( this.cellKey(cell), type );
        }

        private releasePosition(cell : Phaser.Point) {
            this._occupiedPositions.remove( this.cellKey(cell) );
        }

        public isOccupiedByMe(cell : Phaser.Point) {
            return this._occupiedPositions.containsKeyStr( this.cellKey(cell) );
        }

        public isOccupiedByMyBuilding(cell : Phaser.Point) {
            var occType = this._occupiedPositions.get( this.cellKey(cell) );
            return occType && occType === OccupyType.BUILDING;
        }

        public isOccupiedByMySoldiers(cell : Phaser.Point) {
            var occType = this._occupiedPositions.get( this.cellKey(cell) );
            return occType && occType === OccupyType.SOLDIERS;
        }

        public get totalNumSoldiers() : number {
            var totalNum = 0;
            this._soldiersEntities.forEach(e => {
                totalNum += e.soldiersQuantity.quantity;
            });
            return totalNum;
        }

        public get totalNumBuildings() : number {
            return this._buildingEntities.length;
        }

        public get player() : Player {
            return this._player;
        }

        public get playerConf() : PlayerConfiguration {
            return this._playerConf;
        }

        public get buildingEntities() : BuildingEntity[] {
            return this._buildingEntities;
        }

        private tiKey(tileInfo : TileInfo) {
            return tileInfo.x + "_" + tileInfo.y;
        }

        private cellKey(cell : Phaser.Point) {
            return cell.x + "_" + cell.y;
        }
    }

    export enum OccupyType {
        BUILDING,
        SOLDIERS,
    }
}
