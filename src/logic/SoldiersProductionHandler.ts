module Logic {

    export class SoldiersHandler {

        public static me = new SoldiersHandler();

        public placeProducedSoldiers(playerView : PlayerView, producerBuilding : BuildingEntity,
                                     soldiersQuantity : SoldiersQuantity) : boolean {

            var producerCell = producerBuilding.pos;
            var nearbyCells = HexUtils.getNearbyCells(producerCell, 1, All.worldInfo.sizeX, All.worldInfo.sizeY);

            for (var cell of nearbyCells) {
                var occupiedBySelfSoldiers = playerView.isOccupiedByMySoldiers(cell);
                var addedSoldiersEntity = playerView.tryAddSoldiersOn(cell, soldiersQuantity);
                if (addedSoldiersEntity) {
                    var wasMerged = addedSoldiersEntity.soldiersQuantity.quantity !== soldiersQuantity.quantity;

                    console.debug('Adding new soldiers entity merged = ' + wasMerged
                        + ', num soldiers to add = ' + soldiersQuantity.quantity
                        + ', in group is = ' + addedSoldiersEntity.soldiersQuantity.quantity);

                    if (!occupiedBySelfSoldiers && !wasMerged) {
                        All.graphicsCtrl.putSoldiersOn(cell, soldiersQuantity.soldierType, playerView.playerLevel)
                    }

                    return true;
                }
            }

            return false;
        }

    }
}
