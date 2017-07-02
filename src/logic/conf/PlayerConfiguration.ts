module Logic {

    export class PlayerConfiguration {

        private _initialCenter : Phaser.Point;
        private _initialRadius : number;
        private _initialPointsPerTurn : number;

        private _buildingsConf : Graphics.BuildingsSpritesheetConfiguration;
        private _soldiersConf : Graphics.SoldiersSpritesheetConfiguration;

        constructor(initialCenter : Phaser.Point, initialRadius : number, initialPointsPerTurn : number) {
            this._initialCenter = initialCenter;
            this._initialRadius = initialRadius;
            this._initialPointsPerTurn = initialPointsPerTurn;
        }

        public get initialCenter() : Phaser.Point {
            return this._initialCenter;
        }

        public get initialRadius() : number {
            return this._initialRadius;
        }

        public get initialPointsPerTurn() : number {
            return this._initialPointsPerTurn;
        }

        public get buildingsConf() : Graphics.BuildingsSpritesheetConfiguration {
            return this._buildingsConf;
        }

        public set buildingsConf(buildingsConf : Graphics.BuildingsSpritesheetConfiguration) {
            this._buildingsConf = buildingsConf;
        }

        public get soldiersConf() : Graphics.SoldiersSpritesheetConfiguration {
            return this._soldiersConf;
        }

        public set soldiersConf(soldiersConf : Graphics.SoldiersSpritesheetConfiguration) {
            this._soldiersConf = soldiersConf;
        }

    }

}
