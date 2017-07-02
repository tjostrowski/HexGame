module Logic {

    export class Consts {
        public static get minNumPlayers() : number {
            return 2;
        }

        public static get maxNumPlayers() : number {
            return 4;
        }

        public static get minSizeX() : number {
            return 20;
        }

        public static get maxSizeX() : number {
            return 100;
        }

        public static get minSizeY() : number {
            return 20;
        }

        public static get maxSizeY() : number {
            return 100;
        }
    }

    export enum ControlledBy {
        HUMAN,
        AI,
        LAN
    }

    export class GameConfiguration {
        private _numPlayers : number;

        private _playerConfigurations : PlayerConfiguration[] = [];

        private _terrainSpritesheetConf : Graphics.TerrainSpritesheetConfiguration;

        private _players : Player[] = [];

        private _level : Level;

        private _mapSizeX : number;
        private _mapSizeY : number;

        constructor(mapSizeX : number, mapSizeY : number, level : Level, numPlayers : number, players : Player[]) {
            this._mapSizeX = mapSizeX;
            this._mapSizeY = mapSizeY;

            this._level = level;

            this._numPlayers = numPlayers;
            if (this._numPlayers < Consts.minNumPlayers) {
                throw "There should be at least " + Consts.minNumPlayers + " players for this game";
            }
            if (this._numPlayers > Consts.maxNumPlayers) {
                throw "Maximum " + Consts.maxNumPlayers + " players are allowed";
            }

            for (var playerIdx = 1; playerIdx <= numPlayers; ++playerIdx) {
                var player = (playerIdx - 1 < players.length)
                    ? players[playerIdx-1]
                    : new Player(playerIdx, "Player" + playerIdx);

                this._players.push(player);
            }

            this._terrainSpritesheetConf = Graphics.DefaultTerrainSpritesheetConfiguration.of();

            this.initPlayerConfigurations();
        }

        public getPlayer(playerIdx : number) : Player {
            return this._players[playerIdx-1];
        }

        public getPlayerConfiguration(playerIdx : number) : PlayerConfiguration {
            return this._playerConfigurations[playerIdx-1];
        }

        public getPlayerConfigurations() : PlayerConfiguration[] {
            return this._playerConfigurations;
        }

        public get numPlayers() : number {
            return this._numPlayers;
        }

        public get staticConf() : Logic.StaticConfiguration {
            return
        }

        public get level() : Level {
            return this._level;
        }

        public get terrainConf() : Graphics.TerrainSpritesheetConfiguration {
            return this._terrainSpritesheetConf;
        }

        public getDistinctSpritesheetConfigurations() : Graphics.SpritesheetConfiguration[] {
            var allConfigurations : Graphics.SpritesheetConfiguration[] = [
                Graphics.SnopplersBuildingsSpritesheetConfiguration.of(),
                Graphics.SnopplersSoldiersSpritesheetConfiguration.of(),

                Graphics.TopplersBuildingsSpritesheetConfiguration.of(),
                Graphics.TopplersSoldiersSpritesheetConfiguration.of(),

                Graphics.DefaultTerrainSpritesheetConfiguration.of()
            ];

            var confDict : DictionaryTyped<string, Graphics.SpritesheetConfiguration>
                = new DictionaryTyped<string, Graphics.SpritesheetConfiguration>();

            for (var conf of allConfigurations) {
                confDict.overwrite(conf.assetFileName, conf);
            }

            return confDict.values;
        }

        private initPlayerConfigurations() {
            var sizeX = this._mapSizeX,
                sizeY = this._mapSizeY;

            if (sizeX < Consts.minSizeX || sizeX > Consts.maxSizeX
                || sizeY < Consts.minSizeY || sizeY > Consts.maxSizeY) {
                throw Utils.format("Invalid world size: sizeX={1} sizeY={2} " +
                    " sizeX=[{3} - {4}] sizeY=[{5} - {6}]",
                    sizeX, sizeY, Consts.minSizeX, Consts.maxSizeX, Consts.minSizeY, Consts.maxSizeY);
            }

            // simple order: left-top, right-bottom, right-top, left-bottom
            var initRadius = Utils.randomRange(5, 15);
            var initPointsPerTurn = Utils.randomRange(30, 40);

            var player1Conf = new PlayerConfiguration(
                new Phaser.Point(0, 0).add(Utils.randomRange(initRadius, initRadius+5), Utils.randomRange(initRadius, initRadius+5)),
                initRadius,
                initPointsPerTurn + Utils.randomTo(5));
            this.setSpritesheetConfigurations(player1Conf, Race.SNOPPLERS);
            this._playerConfigurations.push(player1Conf);

            var player2Conf = new PlayerConfiguration(
                new Phaser.Point(sizeX, sizeY).subtract(Utils.randomRange(initRadius, initRadius+5), Utils.randomRange(initRadius, initRadius+5)),
                initRadius,
                initPointsPerTurn + Utils.randomTo(5)
            );
            this.setSpritesheetConfigurations(player2Conf, Race.TOPPLERS);
            this._playerConfigurations.push(player2Conf);

            if (this._numPlayers >= 3) {
                var player3Conf = new PlayerConfiguration(
                    new Phaser.Point(sizeX, 0).add(-Utils.randomRange(initRadius, initRadius+5), Utils.randomRange(initRadius, initRadius+5)),
                    initRadius,
                    initPointsPerTurn + Utils.randomTo(5)
                );
                this.setSpritesheetConfigurations(player3Conf, Race.SNOPPLERS);
                this._playerConfigurations.push(player3Conf);
            }

            if (this._numPlayers >= 4) {
                var player4Conf = new PlayerConfiguration(
                    new Phaser.Point(0, sizeY).add(Utils.randomRange(initRadius, initRadius+5), -Utils.randomRange(initRadius, initRadius+5)),
                    initRadius,
                    initPointsPerTurn + Utils.randomTo(5)
                );
                this.setSpritesheetConfigurations(player4Conf, Race.TOPPLERS);
                this._playerConfigurations.push(player4Conf);
            }
        }

        private setSpritesheetConfigurations(playerConf : PlayerConfiguration, race : Race) {
            switch (race) {
                case Race.SNOPPLERS:
                    playerConf.buildingsConf = Graphics.SnopplersBuildingsSpritesheetConfiguration.of();
                    playerConf.soldiersConf = Graphics.SnopplersSoldiersSpritesheetConfiguration.of();
                    break;
                case Race.TOPPLERS:
                default:
                    playerConf.buildingsConf = Graphics.TopplersBuildingsSpritesheetConfiguration.of();
                    playerConf.soldiersConf = Graphics.TopplersSoldiersSpritesheetConfiguration.of();
                    break;
            }
        }

        public controlledBy(playerIdx : number) : ControlledBy {
            // TODO: default implementation
            // perhaps later could be changed to LAN
            return (playerIdx === 1) ? ControlledBy.HUMAN : ControlledBy.AI;
        }

        public toString = () : string => {
            var str = Utils.format('Map size X={1} Y={2} numPlayers={3} level={4} ',
                this._mapSizeX, this._mapSizeY, this._numPlayers, Level[this._level]);

            for (var player of this._players) {
                str += player.toString() + " ";
            }

            return str;
        }
    }

}
