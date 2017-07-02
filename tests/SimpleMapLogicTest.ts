///<reference path='tsUnit.ts' />

module UnitTests {

    export class SimpleMapLogicTest extends tsUnit.TestClass {

        private mathTarget = new SimpleMath();

        checkTestCanWork() {
            var result = this.mathTarget.add(1, 2, 3);
            this.areIdentical(6, result);
        }

        checkPlayerViewInitialization_1() {
            var tilemap = SimpleMapLogicTest.prepareTestTilemap();
            this.isTruthy(tilemap);
            var world = new Logic.WorldInfo(tilemap);
            var playerView = new Logic.PlayerView(world, 20, new Phaser.Point(5, 5), 1);

            this.areIdentical(20, playerView.initialPointsPerTurn);

            var expectedPositions = [ new Phaser.Point(5,4), new Phaser.Point(4,5), new Phaser.Point(5,5),
                                      new Phaser.Point(6,5), new Phaser.Point(5,6) ];
            var tilesInfo : Logic.TileInfo[] = playerView.visibleTilesInfo,
                ti : Logic.TileInfo;
            if (expectedPositions.length !== tilesInfo.length) {
                throw this.getError("Not matching position sizes: " + expectedPositions.length + " vs " + visibleTilesInfo.length);
            }
            for (var i = 0; i < tilesInfo.length; ++i) {
                this.isTrue( tilesInfo[i].pos.equals(expectedPositions[i]) );
            }
        }

        private static prepareTestTilemap() : Phaser.Tilemap {
            var game = new Phaser.Game();
            game.cache = new Phaser.Cache(game);
            var tilemap : Phaser.Tilemap = new Phaser.Tilemap(game, undefined, 10, 10, 50, 50);
            tilemap.width = 50;
            tilemap.height = 50;
            tilemap.layer = [];
            var tilemapLayer = new Phaser.TilemapLayer(game, tilemap, 13);
            tilemap.layers[0] = tilemapLayer;
            tilemap.layers[0].data = [];
            var data = tilemap.layers[0].data;
            for (var y = 0; y < 50; y++) {
                data[y] = [];
                for (var x = 0; x < 50; x++) {
                    data[y][x] = new Phaser.Tile(tilemap.layer, 1, x, y, 10, 10);
                }
            }

            return tilemap;
        }

    }

    class SimpleMath {

        public add(...values : any[]) {
            var result = 0;
            values.forEach(v => result += v);
            return result;
        }
    }
}
