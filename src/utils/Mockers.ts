class Mockers {

    public static mockDefaultGameConf() {
        return new Logic.GameConfiguration(
            50, 50, Logic.Level.SIMPLE, 2, [
                new Logic.Player(1, 'Player1', Logic.Race.SNOPPLERS),
                new Logic.Player(2, 'Player2', Logic.Race.TOPPLERS)
            ]
        );
    }

    public static mockSoldierEntities(cell : Phaser.Point, maxEntities : number = 10, maxSoldiersInEntity : number = 10) {
        var entities : Logic.SoldiersEntity[] = [],
            numEntites = Utils.randomRange(1, maxEntities);

        for (var i = 0; i < numEntites; ++i) {
            var entity = Logic.SoldiersEntity.of( Logic.SoldiersQuantity.of(
                this.chooseRandomSoldiersType(), Utils.randomRange(1, maxSoldiersInEntity)
            ), cell );
            entities.push(entity);
        }

        return entities;
    }

    public static mockCell() {
        return new Phaser.Point( Utils.randomTo(All.worldInfo.sizeX-1),
                                 Utils.randomTo(All.worldInfo.sizeY-1) );
    }

    public static mockCellNeighbour(cell : Phaser.Point) : Phaser.Point {
        return HexUtils.getNearbyTilesInfo(All.worldInfo, cell, 1)[0].pos;
    }

    private static chooseRandomSoldiersType() : Logic.SoldierType {
        var rnd = Utils.randomTo(4 - 1);
        switch (rnd) {
            case 0:
                return Logic.SoldierType.KNIGHT;
            case 1:
                return Logic.SoldierType.ARCHER;
            case 2:
                return Logic.SoldierType.KNIGHT_OFFICER;
            case 3:
                return Logic.SoldierType.ARCHER_OFFICER;
        }
    }
}
