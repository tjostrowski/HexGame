/// <reference path='../../utils/Dictionary.ts' />
/// <reference path='../../utils/ExtendedDictionary.ts' />
/// <reference path='../../utils/DictionaryTyped.ts' />

module Logic {

    import PE = Logic.ProductionEntity;
    import RQ = Logic.ResourceQuantity;
    import RT = Logic.ResourceType;
    import RE = Logic.ResourceEntity;
    import RLT = Logic.ResourceLocalizationType;
    import SQ = Logic.SoldiersQuantity;
    import SE = Logic.SoldiersEntity;
    import ST = Logic.SoldierType;
    import BT = Logic.BuildingType;
    import Point = Phaser.Point;

    export class StaticConfiguration {
        private static conf : StaticConfiguration = new StaticConfiguration();

        private _tilemap : Phaser.Tilemap;

        constructor() {
            this.initAll();
        }

        public static of() : StaticConfiguration {
            return this.conf;
        }

        public initAll() {
            this.initBuildCosts();
            this.initProductions();
            this.initResources();
            this.initViewExtends();
        }

        public get tilemap() : Phaser.Tilemap {
            return this._tilemap;
        }

        private _buildTurnCosts : Dictionary;
        private _totalBuildCosts : Dictionary;

        public initBuildCosts() {
            this._buildTurnCosts = new Dictionary();
            this._totalBuildCosts = new Dictionary();

            var buildTurnCosts = this._buildTurnCosts;
            var totalBuildCosts = this._totalBuildCosts;
            var keyOf = this.keyOfB;

            // turn costs
            buildTurnCosts.add( keyOf(BuildingType.TREE_HUT, Level.SIMPLE), 3 );
            buildTurnCosts.add( keyOf(BuildingType.TREE_HUT, Level.MEDIUM), 4 );
            buildTurnCosts.add( keyOf(BuildingType.TREE_HUT, Level.ADVANCED), 5 );

            buildTurnCosts.add( keyOf(BuildingType.COAL_MINE, Level.SIMPLE), 4 );
            buildTurnCosts.add( keyOf(BuildingType.COAL_MINE, Level.MEDIUM), 5 );
            buildTurnCosts.add( keyOf(BuildingType.COAL_MINE, Level.ADVANCED), 6 );

            buildTurnCosts.add( keyOf(BuildingType.IRON_MINE, Level.SIMPLE), 4 );
            buildTurnCosts.add( keyOf(BuildingType.IRON_MINE, Level.MEDIUM), 5 );
            buildTurnCosts.add( keyOf(BuildingType.IRON_MINE, Level.ADVANCED), 6 );

            buildTurnCosts.add( keyOf(BuildingType.ARMORY, Level.SIMPLE), 4 );
            buildTurnCosts.add( keyOf(BuildingType.ARMORY, Level.MEDIUM), 5 );
            buildTurnCosts.add( keyOf(BuildingType.ARMORY, Level.ADVANCED), 6 );

            // total build costs
            totalBuildCosts.add( keyOf(BuildingType.TREE_HUT, Level.SIMPLE), 10 );
            totalBuildCosts.add( keyOf(BuildingType.TREE_HUT, Level.MEDIUM), 15 );
            totalBuildCosts.add( keyOf(BuildingType.TREE_HUT, Level.ADVANCED), 20 );

            totalBuildCosts.add( keyOf(BuildingType.COAL_MINE, Level.SIMPLE), 15 );
            totalBuildCosts.add( keyOf(BuildingType.COAL_MINE, Level.MEDIUM), 20 );
            totalBuildCosts.add( keyOf(BuildingType.COAL_MINE, Level.ADVANCED), 25 );

            totalBuildCosts.add( keyOf(BuildingType.IRON_MINE, Level.SIMPLE), 15 );
            totalBuildCosts.add( keyOf(BuildingType.IRON_MINE, Level.MEDIUM), 20 );
            totalBuildCosts.add( keyOf(BuildingType.IRON_MINE, Level.ADVANCED), 25 );

            totalBuildCosts.add( keyOf(BuildingType.ARMORY, Level.SIMPLE), 4 );
            totalBuildCosts.add( keyOf(BuildingType.ARMORY, Level.MEDIUM), 25 );
            totalBuildCosts.add( keyOf(BuildingType.ARMORY, Level.ADVANCED), 30 );
        }

        public getBuildTurnCost(buildingType : BuildingType, playerLevel : Level) : number {
            return this._buildTurnCosts.get( this.keyOfB(buildingType, playerLevel) );
        }

        public getTotalBuildCost(buildingType : BuildingType, playerLevel : Level) : number {
            return this._totalBuildCosts.get( this.keyOfB(buildingType, playerLevel) );
        }

        private keyOfB(buildingType : BuildingType, playerLevel : Level) {
            return buildingType.toString() + "_" + playerLevel.toString();
        }

        private _productions : DictionaryWithManyKeyValues< Leveled<BuildingType>, ProductionEntity >;

        public initProductions() {
            this._productions = new DictionaryWithManyKeyValues< Leveled<BuildingType>, ProductionEntity >();

            var productions = this._productions;
            var keyOf = this.keyOfB;

            productions.add( new Leveled<BT>(BuildingType.TREE_HUT, Level.SIMPLE), PE.of( RQ.of(RT.TREE_CUT, 1), RQ.of(RT.WOOD, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.TREE_HUT, Level.MEDIUM), PE.of( RQ.of(RT.TREE_CUT, 2), RQ.of(RT.WOOD, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.TREE_HUT, Level.ADVANCED), PE.of( RQ.of(RT.TREE_CUT, 3), RQ.of(RT.WOOD, 1) ) );

            productions.add( new Leveled<BT>(BuildingType.COAL_MINE, Level.SIMPLE), PE.of( RQ.of(RT.COKE, 3), RQ.of(RT.COAL, 1), RQ.of(RT.TREE_CUT, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.COAL_MINE, Level.MEDIUM), PE.of( RQ.of(RT.COKE, 5), RQ.of(RT.COAL, 2), RQ.of(RT.TREE_CUT, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.COAL_MINE, Level.ADVANCED), PE.of( RQ.of(RT.COKE, 7), RQ.of(RT.COAL, 2), RQ.of(RT.TREE_CUT, 1) ) );

            productions.add( new Leveled<BT>(BuildingType.IRON_MINE, Level.SIMPLE), PE.of( RQ.of(RT.IRON, 3), RQ.of(RT.IRON_ORE, 1), RQ.of(RT.TREE_CUT, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.IRON_MINE, Level.MEDIUM), PE.of( RQ.of(RT.IRON, 5), RQ.of(RT.IRON_ORE, 2), RQ.of(RT.TREE_CUT, 1) ) );
            productions.add( new Leveled<BT>(BuildingType.IRON_MINE, Level.ADVANCED), PE.of( RQ.of(RT.IRON, 7), RQ.of(RT.IRON_ORE, 2), RQ.of(RT.TREE_CUT, 1) ) );

            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.SIMPLE), PE.of( SQ.of(ST.KNIGHT, 1), RQ.of(RT.IRON, 3) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.MEDIUM), PE.of( SQ.of(ST.ARCHER, 1), RQ.of(RT.IRON, 4) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.MEDIUM), PE.of( SQ.of(ST.KNIGHT, 1), RQ.of(RT.IRON, 2) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.ADVANCED), PE.of( SQ.of(ST.KNIGHT_OFFICER, 1), RQ.of(RT.IRON, 4) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.ADVANCED), PE.of( SQ.of(ST.ARCHER_OFFICER, 1), RQ.of(RT.IRON, 4) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.ADVANCED), PE.of( SQ.of(ST.ARCHER, 1), RQ.of(RT.IRON, 2) ));
            productions.add( new Leveled<BT>(BuildingType.ARMORY, Level.ADVANCED), PE.of( SQ.of(ST.KNIGHT, 1), RQ.of(RT.IRON, 1) ));
        }

        public getProductionFor(buildingType : BuildingType, playerLevel : Level) : ProductionEntity[] {
            return this._productions.get( new Leveled<BT>(buildingType, playerLevel) );
        }

        private _globalResources : DictionaryTyped<ResourceType, ResourceEntity>;

        // only global
        public initResources() {
            this._globalResources = new DictionaryTyped<ResourceType, ResourceEntity>();

            var resources = this._globalResources;
            resources.add( RT.IRON, RE.of( RQ.of(RT.IRON, 50), RLT.GLOBAL) );
            resources.add( RT.COKE, RE.of( RQ.of(RT.COKE, 20), RLT.GLOBAL) );
            resources.add( RT.TREE_CUT, RE.of( RQ.of(RT.TREE_CUT, 0), RLT.GLOBAL) );
        }

        public isGlobalResource(resType : ResourceType) {
            return this._globalResources.containsKey( resType );
        }

        public get globalResources() : DictionaryTyped<ResourceType, ResourceEntity> {
            return this._globalResources;
        }

        private _buildingsViewExtends : DictionaryTyped<Leveled<BuildingType>, number>;
        private _soldiersViewExtends : DictionaryTyped<Leveled<SoldierType>, number>;

        public initViewExtends() {
            this._buildingsViewExtends = new DictionaryTyped<Leveled<BuildingType>, number>();
            this._soldiersViewExtends = new DictionaryTyped<Leveled<SoldierType>, number>();

            var buildingsViewExtends = this._buildingsViewExtends,
                soldiersViewExtends = this._soldiersViewExtends;

            buildingsViewExtends.add(Leveled.of(BuildingType.TREE_HUT, Level.SIMPLE), 1);
            buildingsViewExtends.add(Leveled.of(BuildingType.TREE_HUT, Level.MEDIUM), 2);
            buildingsViewExtends.add(Leveled.of(BuildingType.TREE_HUT, Level.ADVANCED), 3);

            buildingsViewExtends.add(Leveled.of(BuildingType.COAL_MINE, Level.SIMPLE), 2);
            buildingsViewExtends.add(Leveled.of(BuildingType.COAL_MINE, Level.MEDIUM), 3);
            buildingsViewExtends.add(Leveled.of(BuildingType.COAL_MINE, Level.ADVANCED), 4);

            buildingsViewExtends.add(Leveled.of(BuildingType.IRON_MINE, Level.SIMPLE), 2);
            buildingsViewExtends.add(Leveled.of(BuildingType.IRON_MINE, Level.MEDIUM), 3);
            buildingsViewExtends.add(Leveled.of(BuildingType.IRON_MINE, Level.ADVANCED), 4);

            buildingsViewExtends.add(Leveled.of(BuildingType.STEEL_MILL, Level.SIMPLE), 2);
            buildingsViewExtends.add(Leveled.of(BuildingType.STEEL_MILL, Level.MEDIUM), 3);
            buildingsViewExtends.add(Leveled.of(BuildingType.STEEL_MILL, Level.ADVANCED), 4);

            buildingsViewExtends.add(Leveled.of(BuildingType.ARMORY, Level.SIMPLE), 3);
            buildingsViewExtends.add(Leveled.of(BuildingType.ARMORY, Level.MEDIUM), 4);
            buildingsViewExtends.add(Leveled.of(BuildingType.ARMORY, Level.ADVANCED), 5);

            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT, Level.SIMPLE), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT, Level.MEDIUM), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT, Level.ADVANCED), 1);

            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER, Level.SIMPLE), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER, Level.MEDIUM), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER, Level.ADVANCED), 1);

            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT_OFFICER, Level.SIMPLE), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT_OFFICER, Level.MEDIUM), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.KNIGHT_OFFICER, Level.ADVANCED), 1);

            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER_OFFICER, Level.SIMPLE), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER_OFFICER, Level.MEDIUM), 1);
            soldiersViewExtends.add(Leveled.of(SoldierType.ARCHER_OFFICER, Level.ADVANCED), 1);
        }

        public getBuildingViewExtend(buildingType : BuildingType, playerLevel : Level) {
            return this._buildingsViewExtends.get(Leveled.of(buildingType, playerLevel));
        }

        public getSoldiersViewExtend(soldiersType : SoldierType, playerLevel : Level) {
            return this._soldiersViewExtends.get(Leveled.of(soldiersType, playerLevel));
        }

        public turnPointsPerSoldiersMove() {
            return 2;
        }

        public buildingUndoPoints(buildingType : BuildingType, playerLevel : Level) {
            return this.getBuildTurnCost(buildingType, playerLevel);
        }
    }
}
