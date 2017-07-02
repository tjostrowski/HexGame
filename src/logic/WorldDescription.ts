module Logic {

    export enum Race {
        SNOPPLERS,
        TOPPLERS
    }

    export enum BuildingType {
        TREE_HUT,
        COAL_MINE,
        IRON_MINE,
        STEEL_MILL,
        ARMORY,

        // TODO: maybe later:
        // SNOPPS_SPECIFIC,
        // TOPPS_SPECIFIC
    }

    export enum Level {
        SIMPLE,
        MEDIUM,
        ADVANCED
    }

    export enum TileType {
        GRASS,
        FOREST,
        ROCKS,
        MOUNTAINS,
        LOW_DESERT,
        DESERT,
    }

    export enum ResourceType {
        WOOD,
        COAL,
        IRON,
        TREE_CUT,
        COKE,
        IRON_ORE,
    }

    export enum SoldierType {
        KNIGHT,
        ARCHER,
        KNIGHT_OFFICER,
        ARCHER_OFFICER,
    }

    export class ResourceQuantity {
        private _resource : ResourceType;
        private _quantity : number;

        constructor(res : ResourceType, quantity? : number) {
            this._resource = res;
            this._quantity = quantity;
        }

        get resource() : ResourceType {
            return this._resource;
        }

        set resource(res : ResourceType) {
            this._resource = res;
        }

        get quantity() : number {
            return this._quantity;
        }

        set quantity(quantity : number) {
            this._quantity = quantity;
        }

        add(quantity : number) {
            this._quantity += quantity;
        }

        subtract(quantity : number) {
            this._quantity = Math.max(this._quantity - quantity, 0);
        }

        public copyOf() : ResourceQuantity {
            return new ResourceQuantity(this._resource, this._quantity);
        }

        static of(type : ResourceType, quantity : number) : ResourceQuantity {
            return new ResourceQuantity(type, quantity);
        }

        public toString = () : string => {
            return ResourceType[this._resource] + '=' + this.quantity;
        }
    }

    export enum ResourceLocalizationType {
        GLOBAL,
        ON_HEX
    }

    export class ResourceEntity {
        private _resourceQuantity : ResourceQuantity;
        private _localizationType : ResourceLocalizationType;
        private _localization : Phaser.Point;

        constructor(resourceQuantity : ResourceQuantity, localizationType : ResourceLocalizationType, localization? : Phaser.Point) {
            this._resourceQuantity = resourceQuantity;
            this._localizationType = localizationType;
            this._localization = localization;
        }

        get resourceQuantity() : ResourceQuantity {
            return this._resourceQuantity;
        }

        get localizationType() : ResourceLocalizationType {
            return this._localizationType;
        }

        get localization() : Phaser.Point {
            return this._localization;
        }

        static of(resourceQuantity : ResourceQuantity, localizationType : ResourceLocalizationType, localization? : Phaser.Point) : ResourceEntity {
            return new ResourceEntity(resourceQuantity, localizationType, localization);
        }

    }

    export class SoldiersQuantity {
        private _soldierType : SoldierType;
        private _quantity : number;

        constructor(type : SoldierType, quantity : number) {
            this._soldierType = type;
            this._quantity = quantity;
        }

        public get soldierType() : SoldierType {
            return this._soldierType;
        }

        public set soldierType(type : SoldierType) {
            this._soldierType = type;
        }

        public get quantity() : number {
            return this._quantity;
        }

        public set quantity(quantity : number) {
            this._quantity = quantity;
        }

        public copyOf() {
            return new SoldiersQuantity(this._soldierType, this._quantity);
        }

        public static of(type : SoldierType, quantity : number) : SoldiersQuantity {
            return new SoldiersQuantity(type, quantity);
        }
    }

    export class SoldiersEntity {
        private _soldiersQuantity : SoldiersQuantity;
        private _localization : Phaser.Point;

        constructor(soldiersQuantity : SoldiersQuantity, localization : Phaser.Point) {
            this._soldiersQuantity = soldiersQuantity;
            this._localization = localization;
        }

        public get soldiersQuantity() : SoldiersQuantity {
            return this._soldiersQuantity;
        }

        public set soldiersQuantity(quantity : SoldiersQuantity) {
            this._soldiersQuantity = quantity;
        }

        public get localization() : Phaser.Point {
            return this._localization;
        }

        public set localization(localization : Phaser.Point) {
            this._localization = localization;
        }

        public get soldierType() : SoldierType {
            return this._soldiersQuantity.soldierType;
        }

        public get numSoldiers() : number {
            return this._soldiersQuantity.quantity;
        }

        public set numSoldiers(num : number) {
            this._soldiersQuantity.quantity = num;
        }

        public incrementNumSoldiers() {
            this._soldiersQuantity.quantity++;
        }

        public decrementNumSoldiers() {
            if (this._soldiersQuantity.quantity > 0) {
                this._soldiersQuantity.quantity--;
            }
        }

        public add(numSoldiersToAdd : number) {
            this._soldiersQuantity.quantity += numSoldiersToAdd;
        }

        public subtract(numSoldiersToSubtract : number) {
            this._soldiersQuantity.quantity = Math.max(
                this._soldiersQuantity.quantity - numSoldiersToSubtract, 0);
        }

        public get x() {
            return this._localization.x;
        }

        public get y() {
            return this._localization.y;
        }

        public isEmpty() : boolean {
            return this._soldiersQuantity.quantity === 0;
        }

        public transfer(fromEntity : SoldiersEntity, transferSoldiersNum : number) {
            if (transferSoldiersNum > fromEntity.numSoldiers || fromEntity.soldierType !== this.soldierType) {
                return;
            }

            this.add(transferSoldiersNum);
            fromEntity.subtract(transferSoldiersNum);
        }

        public static of(soldiersQuantity : SoldiersQuantity, localization : Phaser.Point) {
            return new SoldiersEntity(soldiersQuantity, localization);
        }

        public copyOf() : SoldiersEntity {
            return new SoldiersEntity(this._soldiersQuantity.copyOf(), this._localization.clone());
        }

    }

    export class ProductionEntity {
        private _sourceResourceQuantities : ResourceQuantity[] = [];
        private _toEntityQuantity : ResourceQuantity | SoldiersQuantity;

        private _turnPointsConsumed : number;

        constructor(toEntityQuantity : ResourceQuantity | SoldiersQuantity, sourceResourceQuantities : ResourceQuantity[]) {
            this._sourceResourceQuantities = sourceResourceQuantities;
            this._toEntityQuantity = toEntityQuantity;
        }

        public get turnPointsConsumed() : number {
            if (!this._turnPointsConsumed) {
                var pointsConsumed = 0;
                for (var resQuantity of this._sourceResourceQuantities) {
                    pointsConsumed += resQuantity.quantity * 0.5;
                }
                this._turnPointsConsumed = Math.ceil(pointsConsumed);
            }
            console.debug('TURN POINTS IF CONSUMED: ' + this._turnPointsConsumed);
            return this._turnPointsConsumed;
        }

        public get sourceResourceQuantities() {
            return this._sourceResourceQuantities;
        }

        public get toEntity() : ResourceQuantity | SoldiersQuantity {
            return this._toEntityQuantity;
        }

        public get toNum() : number {
            return this._toEntityQuantity.quantity;
        }

        public static of(toEntityQuantity : ResourceQuantity | SoldiersQuantity, ...sourceResourceQuantities : ResourceQuantity[]) {
            return new ProductionEntity(toEntityQuantity, sourceResourceQuantities);
        }

    }

    export class BuildingEntity {
        private _buildingType : BuildingType;
        private _buildingLevel : Level;
        private _onTile : TileInfo;
        private _productionEntities : DictionaryWithManyKeyValues<Level, ProductionEntity> =
            new DictionaryWithManyKeyValues<Level, ProductionEntity>();

        private _buildTurnCost : number;
        private _totalBuildCost : number;
        private _buildProgress;

        private _blocked : boolean;

        private _sprite : Phaser.Sprite;

        constructor(type : BuildingType, level : Level, onTile : TileInfo, buildTurnCost: number,
                    totalBuildCost : number,
                    productionEntities : DictionaryWithManyKeyValues<Level, ProductionEntity>) {
            this._buildingType = type;
            this._buildingLevel = level;
            this._onTile = onTile;
            this._buildTurnCost = buildTurnCost;
            this._totalBuildCost = totalBuildCost;
            this._productionEntities = productionEntities;
            this._buildProgress = 0;
            this._blocked = false;
        }

        public get buildingType() : BuildingType {
            return this._buildingType;
        }

        public get buildingLevel() : Level {
            return this._buildingLevel;
        }

        public get pos() : Phaser.Point {
            return this._onTile.pos;
        }

        public get x() : number {
            return this._onTile.x;
        }

        public get y() : number {
            return this._onTile.y;
        }

        public get buildTurnCost() : number {
            return this._buildTurnCost;
        }

        public get totalBuildCost() : number {
            return this._totalBuildCost;
        }

        public set sprite(sprite : Phaser.Sprite) {
            this._sprite = sprite;
        }

        public get sprite() : Phaser.Sprite {
            return this._sprite;
        }

        public advance() {
            switch (this._buildingLevel) {
                case Level.SIMPLE:
                    this._buildingLevel = Level.MEDIUM;
                    break;
                case Level.MEDIUM:
                    this._buildingLevel = Level.ADVANCED;
                    break;
            }
        }

        public canProduceSomething() : boolean {
            var canProduce = this._productionEntities.containsKey(this._buildingLevel);
            if (canProduce) {
                console.debug('I CAN PRODUCE SOMETHING!');
            }
            return canProduce;
        }

        public canProduceSoldiers() : boolean {
            var productionEntities = this._productionEntities.get(this._buildingLevel);
            for (var prodEntity of productionEntities) {
                if (prodEntity.toEntity instanceof SoldiersEntity) {
                    return true;
                }
            }
            return false;
        }

        public isDuringBuild() : boolean {
            return this._buildProgress < this._totalBuildCost;
        }

        public isBuilt() : boolean {
            return !this.isDuringBuild();
        }

        public get buildProgress() : number {
            return this._buildProgress;
        }

        public makeBuildProgress() : number {
            this._buildProgress += this._buildTurnCost;
            return this._buildTurnCost;
        }

        public undoBuildProgress(points : number) {
            this._buildProgress = Math.max(this._buildProgress - points, 0);
        }

        public get blocked() : boolean {
            return this._blocked;
        }

        public set blocked(blocked : boolean) {
            this._blocked = blocked;
        }

        public get turnProductionCost() : number {
            return this.canProduceSomething()
                ? this.chooseProductionEntity().turnPointsConsumed
                : 0;
        }

        public checkProductionPossible() : boolean {
            var productionEntity = this.chooseProductionEntity();
            var sourceResourceQuantites = productionEntity.sourceResourceQuantities;
            var resManager = All.resourceManager,
                allSourcesOk = true;

            for (var resQuantity of sourceResourceQuantites) {
                var resType = resQuantity.resource;
                if (resManager.isGlobalResource(resType) && resManager.canUseResourceIfGlobal(resQuantity)) {
                    allSourcesOk = false;
                    break;
                } else if (resManager.isLocalResource(resType) && resManager.canUseResourceIfLocal(resQuantity, this._onTile.pos)) {
                    allSourcesOk = false;
                    break;
                }
            }

            console.debug('AND PRODUCTION IS: ' + ((allSourcesOk) ? 'POSSIBLE' : 'IMPOSSIBLE'));

            return allSourcesOk;
        }

        /**
         * returns what was produced
         */
        public makeProduce() : ResourceQuantity | SoldiersQuantity {
            var productionEntity = this.chooseProductionEntity(),
                sourceResourceQuantites = productionEntity.sourceResourceQuantities,
                resManager = All.resourceManager;

            for (var resQuantity of sourceResourceQuantites) {
                var resType = resQuantity.resource;
                if (resManager.isGlobalResource(resType)) {
                    resManager.useGlobalResource(resQuantity);
                } else if (resManager.isLocalResource(resType)) {
                    resManager.useLocalResource(resQuantity, this._onTile.pos);
                }
            }

            console.debug('Produced: ' + productionEntity.toEntity.quantity);

            return productionEntity.toEntity.copyOf();
        }

        private chooseProductionEntity() : ProductionEntity {
            var level = this._buildingLevel;
            return this._productionEntities.get(level)[0];
        }

    }

    export class Leveled<S> {
        private _s : S;
        private _level : Level;

        constructor(s : S, level : Level) {
            this._s = s;
            this._level = level;
        }

        public static of<S>(s : S, level : Level) {
            return new Leveled<S>(s, level);
        }

        public get what() : S {
            return this._s;
        }

        public get level() : Level {
            return this._level;
        }

        public toString = () : string => {
            return this._s.toString() + '_' + this._level.toString();
        }
    }

    // TODO: this way quantities should be implemented
    export class QuantityOf<S> {
        private _s : S;
        private _quantity : number;

        constructor(s : S, quantity : number) {
            this._s = s;
            this._quantity = quantity;
        }

        public static of<S>(s : S, quantity : number) {
            return new QuantityOf<S>(s, quantity);
        }

        public get what() : S {
            return this._s;
        }

        public get quantity() : number {
            return this._quantity;
        }

        public toString = () : string => {
            return this._s.toString() + '_' + this._quantity;
        }
    }

}
