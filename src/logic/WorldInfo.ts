module Logic {

    export class WorldInfo {
        private _tileInfos : TileInfo[] = [];

        private _worldSizeX : number;
        private _worldSizeY : number;

        private _tilemap : Phaser.Tilemap;

        private _tilemapCache : number[][] = [];    // cache with tile indexes

        constructor(tilemap : Phaser.Tilemap) {
            this.initFromTilemap(tilemap);
            All.registerWorldInfo(this);
        }

        private initFromTilemap(tilemap : Phaser.Tilemap) : Logic.WorldInfo {
            this.clearAll();

            this._tilemap = tilemap;
            this._worldSizeX = tilemap.width;
            this._worldSizeY = tilemap.height;

            this._tilemapCache = [];

            var data = this.pickData();
            for (var y = 0; y < this._worldSizeY; ++y) {

                this._tilemapCache[y] = [];

                for (var x = 0; x < this._worldSizeX; ++x) {
                    var tile : Phaser.Tile = data[y][x],
                        tileInfo : Logic.TileInfo = this.pickTileInfo(tile);

                    this._tilemapCache[y][x] = tile.index;

                    this._tileInfos.push(tileInfo);
                }
            }

            return this;
        }

        private pickTileInfo(tile : Phaser.Tile) : TileInfo {
            let tileType : TileType;
            let resourceEntities : ResourceEntity[] = [];
            let building : BuildingType;

            if (tile.properties) {
                for (var prop in tile.properties) {
                    var propVal = tile.properties[prop];

                    if (prop === 'name') {
                        // we have a tile type
                        switch (propVal) {
                            case 'grass':
                                tileType = TileType.GRASS;
                                break;
                            case 'forest':
                                tileType = TileType.FOREST;
                                break;
                            case 'rocks':
                                tileType = TileType.ROCKS;
                                break;
                            case 'mountains':
                                tileType = TileType.MOUNTAINS;
                                break;
                            case 'hard_desert':
                            case 'low_desert':
                            case 'desert':
                                tileType = TileType.DESERT;
                                break;
                            default:
                                console.warn('Unknown tile type: ' + propVal);
                        }

                    } else if (prop.substr(0, 3) === 'res') {
                        // we have a resource
                        var res : ResourceType;
                        switch (prop) {
                            case 'resCoal':
                                res = ResourceType.COAL;
                                break;
                            case 'resIron':
                                res = ResourceType.IRON_ORE;
                                break;
                            case 'resWood':
                                res = ResourceType.WOOD;
                                break;
                            default:
                                console.warn('Unknown resource: ' + prop);
                        }

                        if (res) {
                            resourceEntities.push(new ResourceEntity(
                                new ResourceQuantity(res, parseInt(propVal)),
                                ResourceLocalizationType.ON_HEX,
                                new Phaser.Point(tile.x, tile.y)
                            ));
                        }

                    }
                    // assume no buildings, skipping
                    // else if (prop.substr(0, 5) === 'build') {
                    //     // we have a building
                    //     switch (prop) {
                    //         case 'buildTreeHut':
                    //             building = BuildingType.TREE_HUT;
                    //             break;
                    //         case 'buildCoalMine':
                    //             building = BuildingType.COAL_MINE;
                    //             break;
                    //         case 'buildIronMine':
                    //             building = BuildingType.IRON_MINE;
                    //             break;
                    //         case 'buildArmory':
                    //             building = BuildingType.ARMORY;
                    //             break;
                    //         default:
                    //             console.warn('Unknown building type: ' + building);
                    //     }
                    //
                    // }
                }
            }

            var tileInfo = new Logic.TileInfo(tile.x, tile.y, tileType,
                resourceEntities);

            this.applyRandomNoise(tile, tileInfo);

            return tileInfo;
        }

        public get sizeX() : number {
            return this._worldSizeX;
        }

        public get sizeY() : number {
            return this._worldSizeY;
        }

        public getTileInfo(x : number, y : number) {
            return this._tileInfos[y * this._worldSizeX + x];
        }

        public get tilemap() : Phaser.Tilemap {
            return this._tilemap;
        }

        public getPhaserTiles() : Phaser.Tile[][] {
            return <Phaser.Tile[][]>this._tilemap.layers[0].data;
        }

        public getResourceEntitiesOn(cell : Phaser.Point) {
            var tileInfo : TileInfo = this.getTileInfo(cell.x, cell.y);
            return (tileInfo) ? tileInfo.resources : null;
        }

        public getCachedIndex(x : number, y : number) {
            return this._tilemapCache[y][x];
        }

        public removeResourceOn(cell : Phaser.Point, resType : ResourceType) : boolean { // <=== isRemoved
            var tileInfo : TileInfo = this.getTileInfo(cell.x, cell.y);
            var resources : ResourceEntity[] = tileInfo.resources;
            for (var i = 0; i < resources.length; ++i) {
                if (resources[i].resourceQuantity.resource === resType) {
                    resources.splice(i, 1);
                    return true;
                }
            }
            return false;
        }

        public clearAll() {
            this._tileInfos = [];
            this._worldSizeX = -1;
            this._worldSizeY = -1;
        }

        private applyRandomNoise(tile : Phaser.Tile, tileInfo : TileInfo) {
            var tileType = tileInfo.tileType;
            if ((tileType === TileType.FOREST || tile.index === 61 || tile.index === 69)
                && tileInfo.resources.length === 0) {

                tileInfo.resources.push(new ResourceEntity(
                    new ResourceQuantity(ResourceType.WOOD, 10 + Math.ceil(Math.random()*100)),
                    ResourceLocalizationType.ON_HEX,
                    tileInfo.pos
                ));
            }
        }

        private pickData() : Array<Phaser.Tile> {
            if (this._tilemap.layers && this._tilemap.layers[0]) {
                return this._tilemap.layers[0].data;
            }
            throw "Invalid tilemap data!";
        }

    }

}
