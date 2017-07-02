///<reference path='../../logic/WorldDescription.ts' />
///<reference path='SpritesheetConfiguration.ts' />

module Graphics {

    import TerrainType = Logic.TileType;

    export class DefaultTerrainSpritesheetConfiguration extends TerrainSpritesheetConfiguration {
        private static conf : DefaultTerrainSpritesheetConfiguration = new DefaultTerrainSpritesheetConfiguration();

        constructor() {
            super(Assets.terrainsSheetFile, 'terrainSheet', 122, 142, 10);
        }

        public static of() : DefaultTerrainSpritesheetConfiguration {
            return this.conf;
        }

        public getFogTileIndex() : number {
            return 2;
        }

        public getNullTileIndex(): number {
            return 5;
        }

        public getIndexesOf(type : TerrainType) : number[] {
            switch (type) {
                case TerrainType.GRASS:
                    return [5, 12];
                case TerrainType.FOREST:
                    return [8];
                case TerrainType.DESERT:
                    return [3, 10, 17, 24];
                case TerrainType.MOUNTAINS:
                    return [40, 41];
                case TerrainType.ROCKS:
                    return [41];
            }
            return [];
        }
    }

}
