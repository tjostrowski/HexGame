module Graphics {

    export class TilemapConfiguration {
        _fileName : string;
        _resourceName : string;
        _tileWidth : number;
        _tileHeight : number;
        _numTilesX : number;
        _numTilesY : number;

        _imgFileName : string;
        _imgResourceName : string;

        constructor(fileName : string, resourceName : string, tileWidth? : number, tileHeight? : number, numTilesX? : number, numTilesY? : number) {
            this._fileName = fileName;
            this._resourceName = resourceName;
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._numTilesX = numTilesX;
            this._numTilesY = numTilesY;
        }

        withImageData(imgFileName : string, imgResourceName : string) : TilemapConfiguration {
            this._imgFileName = imgFileName;
            this._imgResourceName = imgResourceName;
            return this;
        }

        getTileLayerNames() : string[] {
            return ['boardLayer'];
        }

        getObjectLayerNames() : string[] {
            return ['objectLayer'];
        }

        getTilesetNames() : string[] {
            return ['hexagonTerrain_sheet'];
        }

        get tileWidth() : number {
            return this._tileWidth;
        }

        set tileWidth(tileWidth : number) {
            this._tileWidth = tileWidth;
        }

        get tileHeight() : number {
            return this._tileWidth;
        }

        set tileHeight(tileHeight : number) {
            this._tileHeight = tileHeight;
        }

        get numTilesX() : number {
            return this._numTilesX;
        }

        set numTilesX(numTilesX : number) {
            this._numTilesX = numTilesX;
        }

        get numTilesY() : number {
            return this._numTilesY;
        }

        set numTilesY(numTilesY : number) {
            this._numTilesY = numTilesY;
        }

        get fileName() : string {
            return this._fileName;
        }

        set fileName(name : string) {
            this._fileName = name;
        }

        get resourceName() : string {
            return this._resourceName;
        }

        set resourceName(name: string) {
            this._resourceName = name;
        }

        get imgFileName() : string {
            return this._imgFileName;
        }

        get imgResourceName() : string {
            return this._imgResourceName;
        }
    }
}