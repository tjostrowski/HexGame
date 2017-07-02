/// <reference path='../logic/WorldDescription.ts' />

module Graphics {

    import SoldiersEntity = Logic.SoldiersEntity;
    import SoldierType = Logic.SoldierType;

    export class CombatResultPopup {

        private _popup : SimplePopup;

        constructor() {
            this._popup = new SimplePopup(400, 500, SpritedWindowMode.GRADIENT)
                .setGradientColors('#B2BEB5', '#E4E4E4');
        }

        public show() {
            this._popup.show();
        }

        public mockAndShow() {
            var cell1 = Mockers.mockCell(),
                cell2 = Mockers.mockCellNeighbour(cell1);

            var soldierEntities1 : SoldiersEntity[] = Mockers.mockSoldierEntities(cell1),
                soldierEntities2 : SoldiersEntity[] = Mockers.mockSoldierEntities(cell2);

            var soldierTypeCounts1 = this.soldierEntitiesToTypeCountsMap(soldierEntities1),
                soldierTypeCounts2 = this.soldierEntitiesToTypeCountsMap(soldierEntities2);

            All.combatResolver.resolveCombat(cell1, soldierEntities1, cell2, soldierEntities2);

            var soldiersLostCount1 = this.getSoldiersLostMap(soldierEntities1, soldierTypeCounts1),
                soldiersLostCount2 = this.getSoldiersLostMap(soldierEntities2, soldierTypeCounts2);

            this.printSoldiersLostMap(soldiersLostCount1);
            this.printSoldiersLostMap(soldiersLostCount2);

            this._popup.showAndFadeOutAfter(10);

            var uiGroup = this._popup.uiGroup;

            var game = All.game;

            var header = game.add.text(20, 30, 'LOST SOLDIERS', Text.huge());
            var lastText = header;
            uiGroup.add(header);
            soldiersLostCount1.keys.forEach(soldierTypeStr => {

                var lostCount = soldiersLostCount1.getFromKeyString(soldierTypeStr);

                if (lostCount > 0) {
                    var label = game.add.text(0, 0, SoldierType[parseInt(soldierTypeStr)] + ':', Text.big());
                    label.alignTo(lastText, Phaser.BOTTOM_LEFT, 0, 20);

                    var soldiersCount = game.add.text(0, 0, soldiersLostCount1.getFromKeyString(soldierTypeStr).toString(), Text.big());
                    soldiersCount.alignTo(label, Phaser.RIGHT_CENTER, 20);

                    uiGroup.add(label);
                    uiGroup.add(soldiersCount);
                    lastText = label;
                }
            });

            var btnOK = new NineSliceTextButton('OK', 170, 50, Assets.btnOkRes);
            btnOK.add();
            var btnOKSprite = btnOK.bgSprite;
            btnOKSprite.events.onInputDown.add(
                function() {
                    this._popup.closeWindow();
                }, this
            );
            btnOKSprite.alignTo(lastText, Phaser.BOTTOM_CENTER, 50, this._popup.height - lastText.y - lastText.height - 100);
            uiGroup.add(btnOKSprite);
        }

        private soldierEntitiesToTypeCountsMap(soldierEntities : SoldiersEntity[]) : DictionaryTyped<SoldierType, number> {
            var soldierTypeCounts = new DictionaryTyped<SoldierType, number>();
            soldierEntities.forEach(entity => {
                soldierTypeCounts.overwrite(entity.soldierType, entity.numSoldiers);
            });
            return soldierTypeCounts;
        }

        private getSoldiersLostMap(soldierEntities : SoldiersEntity[], initialTypeCounts : DictionaryTyped<SoldierType, number>)
            : DictionaryTyped<SoldierType, number> {

            var soldierTypeCountDiffs = new DictionaryTyped<SoldierType, number>();
            soldierEntities.forEach(entity => {
                soldierTypeCountDiffs.overwrite(entity.soldierType, initialTypeCounts.get(entity.soldierType) - entity.numSoldiers);
            });
            return soldierTypeCountDiffs;
        }

        private printSoldiersLostMap(soldiersLostCount : DictionaryTyped<SoldierType, number>) {
            console.trace("***** LOST *****")
            soldiersLostCount.keys.forEach(soldierTypeStr => {
                console.trace(soldierTypeStr + '=' + soldiersLostCount.getFromKeyString(soldierTypeStr));
            });
            console.trace("****************")
        }
    }
}
