module Logic {

    export class ResourceManager {
        private _globalResources : DictionaryTyped<ResourceType, ResourceEntity>;

        constructor() {
            this._globalResources = All.staticConf.globalResources.copyOf();
            All.registerResourceManager(this);
        }

        public getBuildTurnCost(buildingType : BuildingType, playerLevel : Level) : number {
            return All.staticConf.getBuildTurnCost(buildingType, playerLevel);
        }

        public getTotalBuildCost(buildingType : BuildingType, playerLevel : Level) : number {
            return All.staticConf.getTotalBuildCost(buildingType, playerLevel);
        }

        public getProductionForAllLevels(buildingType : BuildingType) : DictionaryWithManyKeyValues<Level, ProductionEntity> {
            var productionEntites : DictionaryWithManyKeyValues<Level, ProductionEntity> =
                new DictionaryWithManyKeyValues<Level, ProductionEntity>();

            productionEntites.addAll( Level.SIMPLE, this.getProductionFor(buildingType, Level.SIMPLE) );
            productionEntites.addAll( Level.MEDIUM, this.getProductionFor(buildingType, Level.MEDIUM) );
            productionEntites.addAll( Level.ADVANCED, this.getProductionFor(buildingType, Level.ADVANCED) );

            return productionEntites;
        }

        public getProductionFor(buildingType : BuildingType, playerLevel : Level) : ProductionEntity[] {
            return All.staticConf.getProductionFor(buildingType, playerLevel);
        }

        public isGlobalResource(resType : ResourceType) {
            return All.staticConf.isGlobalResource(resType);
        }

        public isLocalResource(resType : ResourceType) {
            return !this.isGlobalResource(resType);
        }

        public canUseResourceIfGlobal(resQuantity : ResourceQuantity) : boolean {
            return this.getGlobalResourceAmount(resQuantity.resource) >= resQuantity.quantity;
        }

        public canUseResourceIfLocal(resQuantity : ResourceQuantity, cell : Phaser.Point) {
            var resourceEntites = All.worldInfo.getResourceEntitiesOn(cell);
            var matchingEntities = resourceEntites.filter(re => (re.resourceQuantity.resource === resQuantity.resource
                && re.resourceQuantity.quantity >= resQuantity.quantity));

            return matchingEntities.length > 0;
        }

        public useGlobalResource(resQuantity : ResourceQuantity) : boolean {
            var resEntity = this.getGlobalResourceEntity(resQuantity.resource);
            if (resEntity.resourceQuantity.quantity >= resQuantity.quantity) {
                resEntity.resourceQuantity.subtract(resQuantity.quantity);
                return true;
            }
            return false;
        }

        public useLocalResource(resQuantity : ResourceQuantity, cell : Phaser.Point) : boolean {
            var resourceEntites = All.worldInfo.getResourceEntitiesOn(cell);
            var matchingEntities = resourceEntites.filter(re => (re.resourceQuantity.resource === resQuantity.resource
                && re.resourceQuantity.quantity >= resQuantity.quantity));

            if (matchingEntities.length > 0) {
                var bestMatch : ResourceEntity = matchingEntities[0];
                bestMatch.resourceQuantity.subtract(resQuantity.quantity);

                if (bestMatch.resourceQuantity.quantity <= 0) {
                    All.worldInfo.removeResourceOn(cell, resQuantity.resource);
                }

                return true;
            }

            return false;
        }

        public addResource(resQuantity : ResourceQuantity) : boolean { // added
            return false;
        }

        private getGlobalResourceAmount(resType : ResourceType) : number {
            if (this._globalResources.containsKey(resType)) {
                var re : ResourceEntity = this._globalResources.get(resType);
                return re.resourceQuantity.quantity;
            }
            return 0;
        }

        private getGlobalResourceEntity(resType : ResourceType) : ResourceEntity {
            return this._globalResources.get( resType );
        }

        private keyOfR(resType : ResourceType) {
            return resType.toString() + "_";
        }
    }
}
