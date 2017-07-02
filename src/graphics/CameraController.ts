module Graphics {

    export class CameraController {

        constructor() {
            All.registerCameraCtrl(this);
        }

        public moveCameraToHex(cellX : number, cellY : number) {
            var terrainConf = All.gameConf.terrainConf,
                pos : Phaser.Point = HexUtils.calculatePosition(cellX, cellY,
                    terrainConf.mapTileWidth, terrainConf.mapTileHeight);
            console.debug('Move camera to cell: [' + cellX + ',' + cellY + ']' + ' pos: ['
                + pos.x + ',' + pos.y + ']');
            this.cameraWithCenterAt(pos.x, pos.y);
        }

        public cameraWithCenterAt(x : number, y : number) {
            var game = All.game;
            game.camera.x = x - game.camera.width*0.5;
            game.camera.y = y - game.camera.height*0.5;
        }

        public moveCameraToPos(x : number, y : number) {
            var game = All.game;
            game.camera.x = x;
            game.camera.y = y;
        }
    }
}
