module Graphics {

    export class SpritesheetConfiguration {
        _assetFileName : string;
        _resourceName : string;
        _tileWidth : number;
        _tileHeight : number;
        _numTiles : number;

        constructor(assetFileName : string, resourceName : string, tileWidth : number, tileHeight : number, numTiles : number) {
            this._assetFileName = assetFileName;
            this._resourceName = resourceName;
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._numTiles = numTiles;
        }

        public get tileWidth() : number {
            return this._tileWidth;
        }

        public get mapTileWidth() : number {
            return this._tileWidth;
        }

        public set tileWidth(tileWidth : number) {
            this._tileWidth = tileWidth;
        }

        public get tileHeight() : number {
            return this._tileHeight;
        }

        public get mapTileHeight() : number {
            return /*Math.ceil(*/0.75 * this._tileHeight/*)*/;
        }

        public set tileHeight(tileHeight : number) {
            this._tileHeight = tileHeight;
        }

        public get numTiles() : number {
            return this._numTiles;
        }

        public set numTiles(numTiles : number) {
            this._numTiles = numTiles;
        }

        public get assetFileName() : string {
            return this._assetFileName;
        }

        public set assetFileName(name : string) {
            this._assetFileName = name;
        }

        public get resourceName() : string {
            return this._resourceName;
        }

        public set resourceName(name: string) {
            this._resourceName = name;
        }

    }

    export abstract class BuildingsSpritesheetConfiguration extends SpritesheetConfiguration {
        public abstract getIndex(type : Logic.BuildingType, level : Logic.Level) : number;
    }

    export abstract class SoldiersSpritesheetConfiguration extends SpritesheetConfiguration {
        public abstract getIndex(type : Logic.SoldierType, level : Logic.Level) : number;
    }

    export abstract class TerrainSpritesheetConfiguration extends SpritesheetConfiguration {
        public abstract getFogTileIndex() : number;

        public abstract getNullTileIndex(): number;

        public abstract getIndexesOf(type : Logic.TileType) : number[];
    }

}
