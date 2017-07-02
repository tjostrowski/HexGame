///<reference path='../../logic/WorldDescription.ts' />
/// <reference path="./SpritesheetConfiguration.ts"/>

module Graphics {

    import SoldierType = Logic.SoldierType;
    import Level = Logic.Level;

    export class SnopplersSoldiersSpritesheetConfiguration extends SoldiersSpritesheetConfiguration {
        private static snopplersConf : SnopplersSoldiersSpritesheetConfiguration = new SnopplersSoldiersSpritesheetConfiguration();

        constructor() {
            // TODO: separate spritesheet for soldiers?
            super(Assets.buildingsSheetFile, 'buildingsSheet', 122, 142, 20);
        }

        public static of() : SnopplersSoldiersSpritesheetConfiguration {
            return this.snopplersConf;
        }

        private getIndexOf(type : SoldierType) : number[] { // for all levels
            switch (type) {
                case SoldierType.KNIGHT:
                case SoldierType.ARCHER:
                case SoldierType.KNIGHT_OFFICER:
                case SoldierType.ARCHER_OFFICER:
                default:
                    return [8, 8, 8];
            }
        }

        public getIndex(type : SoldierType, level : Level) {
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

    export class TopplersSoldiersSpritesheetConfiguration extends SnopplersSoldiersSpritesheetConfiguration {
        private static topplersConf : TopplersSoldiersSpritesheetConfiguration = new TopplersSoldiersSpritesheetConfiguration();

        public static of() : SnopplersSoldiersSpritesheetConfiguration {
            return this.topplersConf;
        }
    }
}
