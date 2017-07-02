/// <reference path='../../logic/WorldDescription.ts' />
/// <reference path="./SpritesheetConfiguration.ts"/>

module Graphics {
    import BuildingType = Logic.BuildingType;
    import Level = Logic.Level;

    export class SnopplersBuildingsSpritesheetConfiguration extends BuildingsSpritesheetConfiguration {
        private static snopplersConf : SnopplersBuildingsSpritesheetConfiguration = new SnopplersBuildingsSpritesheetConfiguration();

        constructor() {
            super(Assets.buildingsSheetFile, 'buildingsSheet', 122, 142, 20);
        }

        public static of() : SnopplersBuildingsSpritesheetConfiguration {
            return this.snopplersConf;
        }

        private getIndexOf(type : BuildingType) : number[] { // for all levels
            switch (type) {
                case BuildingType.TREE_HUT:
                    return [7, 7, 7];
                case BuildingType.COAL_MINE:
                    return [4, 4, 4];
                case BuildingType.IRON_MINE:
                    return [6, 6, 6];
                case BuildingType.STEEL_MILL:
                    return [5, 5, 5];
                case BuildingType.ARMORY:
                    return [1, 1, 1];
            }
        }

        public getIndex(type : BuildingType, level : Level) {
            var indexes : number[] = this.getIndexOf(type);
            switch (level) {
                case Level.SIMPLE:
                    return indexes[0];
                case Level.MEDIUM:
                    return indexes[1];
                case Level.ADVANCED:
                    return indexes[2];
            }

            return -1;
        }
    }

    // for now the same as Snopplers*
    export class TopplersBuildingsSpritesheetConfiguration extends SnopplersBuildingsSpritesheetConfiguration {
        private static topplersConf : TopplersBuildingsSpritesheetConfiguration = new TopplersBuildingsSpritesheetConfiguration();

        public static of() : TopplersBuildingsSpritesheetConfiguration {
            return this.topplersConf;
        }
    }
}
