module Logic {

    export class TileInfo {
        private _tileType : TileType;

        private _resourceEntities : ResourceEntity[] = [];

        private _position : Phaser.Point;

        constructor(x : number, y: number, tileType : TileType, resourceEntities? : ResourceEntity[]) {
            this._position = new Phaser.Point(x, y);
            this._tileType = tileType;
            this._resourceEntities = resourceEntities;
        }

        public get tileType() : TileType {
            return this._tileType;
        }

        public get resources() : ResourceEntity[] {
            return this._resourceEntities;
        }

        public get x() : number {
            return this._position.x;
        }

        public get y() : number {
            return this._position.y;
        }

        public get pos() : Phaser.Point {
            return this._position;
        }
    }

}
