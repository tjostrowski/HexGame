module GameStates {

    export class TestBoard extends GameStates.AbstractBoardState {

        rectangles = [];
        index;

        init() {
            // // and it also does not work for hexagonal tilemaps!
            // var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

            // (<any>this.game.load).tiledmap(cacheKey('myGameBoard', 'tiledmap'), 'assets/tilemaps/testSmallMap.json', null, Phaser.Tilemap.TILED_JSON);
            // this.game.load.image(cacheKey('myGameBoard', 'tileset', 'Terrain'), 'assets/PNG/hexagonTerrain_sheet.png');
        }

        create() {
            super.create();

            // // this.tilemap = (<any>this.game.add).tiledmap('myGameBoard');

            this.rectangles = [];

            var initX = 50;

            for (var i = 0; i < 26; i++) {
                this.rectangles.push(this.createRectangle(initX, this.game.world.centerY - 100, 250, 200));
                this.index = this.game.add.text(initX + 125, this.game.world.centerY, "" + (i + 1),
                            { font: 'bold 150px Arial', align: "center" });
                this.index.anchor.set(0.5);
                initX += 300;
            }

            //Changing the world width
            this.game.world.setBounds(0, 0, 320 * this.rectangles.length, this.game.height);
        }

        private createRectangle(x : number, y : number, w : number, h : number) {
            var sprite : Phaser.Graphics = this.game.add.graphics(x, y);
            sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
            sprite.width = w;
            sprite.height = h;
            // sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
            sprite.drawRect(0, 0, w, h);
            return sprite;
        }

        private drawTestBuildings() {
            for (var y = 0; y < 10; ++y) {
                for (var x = 0; x < 10; ++x) {
                    var pos : Phaser.Point = HexUtils.calculatePosition(x, y, GameBoardState.tileWidth, GameBoardState.tileHeight);
                    this.game.add.sprite(pos.x, pos.y, 'buildingTiles', y);
                }
            }
        }

    }
}
