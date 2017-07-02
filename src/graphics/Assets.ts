/// <reference path='../utils/DictionaryTyped.ts' />

module Graphics {
    export class Assets {
        private _assetResources : DictionaryValueTyped<AssetResource> = new DictionaryValueTyped<AssetResource>();

        public loadAll() {
            var assetResources : AssetResource[] = [
                new AssetResource(Assets.menuBackground, Assets.menuRes),
                new AssetResource(Assets.expandMenuButton, Assets.expandMenuRes),

                new AssetResource(Assets.popupOpenButton, Assets.popupOpenButtonRes, ResourceType.BUTTON),
                new AssetResource(Assets.popupCloseButton, Assets.popupCloseButtonRes, ResourceType.BUTTON),
                new AssetResource(Assets.popupFullBackground, Assets.popupBackgroundRes, ResourceType.SPRITE),

                new AssetResource(Assets.endTurnButton, Assets.endTurnButtonRes, ResourceType.BUTTON),

                new AssetResource(Assets.sliderHorizontal, Assets.sliderHorizontalRes, ResourceType.SPRITE),
                new AssetResource(Assets.sliderShifter, Assets.sliderShifterRes, ResourceType.SPRITE),

                new AssetResource(Assets.btnOk, Assets.btnOkRes, ResourceType.NINE_SLICE),
                new AssetResource(Assets.btnCancel, Assets.btnCancelRes, ResourceType.NINE_SLICE),

                new AssetResource(Assets.comboSliderBackground, Assets.comboSliderBackgroundRes, ResourceType.NINE_SLICE),
                new AssetResource(Assets.comboSliderUp, Assets.comboSliderUpRes, ResourceType.BUTTON),
                new AssetResource(Assets.comboSliderDown, Assets.comboSliderDownRes, ResourceType.BUTTON)
            ];

            var keyOf = this.keyOf;
            for (var assetRes of assetResources) {
                this._assetResources.add(keyOf(assetRes), assetRes);
            }
        }

        public find(resourceName : string) : AssetResource {
            return this._assetResources.get(resourceName);
        }

        private keyOf(assetRes : AssetResource) {
            return assetRes.resourceName;
        }

        public static get mainBackgroundFile() : string {
            return "assets/background/full-background.png";
        }

        public static get menuButtonFile() : string {
            return "assets/PNG/blue_button01.png";
        }

        public static get smallMapFile() : string {
            return "assets/tilemaps/testSmallMap.json";
        }

        public static get terrainsSheetFile() : string {
            return "assets/Spritesheet/hexagonTerrain_sheet_ORIG.png";
        }

        public static get buildingsSheetFile() : string {
            return "assets/Spritesheet/hexagonBuildings_sheet_UPDATED.png";
        }

        public static get bluePanel() : string {
            return "assets/PNG/blue_panel.png";
        }

        public static get yellowPanel() : string {
            return "assets/PNG/yellow_panel.png";
        }

        public static get greenPanel() : string {
            return "assets/PNG/green_panel.png";
        }

        public static get menuBackground() : string {
            return "assets/background/menu-background.png"
        }

        public static get expandMenuButton() : string {
            return "assets/PNG/blue_button06.png";
        }

        public static get menuRes() : string {
            return "menu";
        }

        public static get menuBackgroundRes() : string {
            return "menuBackground";
        }

        public static get expandMenuRes() : string {
            return "expandMenuButton";
        }

        public static get gameBoardRes() : string {
            return 'gameBoard';
        }

        public static get terrainSheetRes() : string {
            return "gameBoardTiles";
        }

        public static get closeButton() : string {
            return "assets/PNG/grey_crossGrey.png";
        }

        public static get closeButtonRes() : string {
            return "closeButton";
        }

        public static get popupOpenButton() : string {
            return "assets/PNG/replaceable/rightArrow2.png";
        }

        public static get popupOpenButtonRes() : string {
            return "popupOpenButton";
        }

        public static get popupCloseButton() : string {
            return "assets/PNG/replaceable/leftArrow2.png";
        }

        public static get popupCloseButtonRes() : string {
            return "popupCloseButton";
        }

        public static get popupBackground() : string {
            return "assets/background/horizontal-menu-background.png";
        }

        public static get popupFullBackground() : string {
            return "assets/background/full-background.png";
        }

        public static get fullBackground() : string {
            return "assets/background/full-background.png";
        }

        public static get fullBackgroundRes() : string {
            return "fullBackground";
        }

        public static get popupBackgroundRes() : string {
            return "popupBackground";
        }

        public static get endTurnButton() : string {
            return "assets/PNG/green_button09.png";
        }

        public static get endTurnButtonRes() : string {
            return "endTurnButton";
        }

        public static get sliderHorizontal() : string {
            return "assets/PNG/grey_sliderHorizontal.png";
        }

        public static get sliderHorizontalRes() : string {
            return "sliderHorizontal";
        }

        public static get sliderShifter() : string {
            return "assets/PNG/grey_sliderRight.png";
        }

        public static get sliderShifterRes() : string {
            return "sliderShifter";
        }

        public static get btnOk() : string {
            return "assets/PNG/green_button00.png";
        }

        public static get btnOkRes() : string {
            return "btnOk";
        }

        public static get btnCancel() : string {
            return "assets/PNG/blue_button00.png";
        }

        public static get btnCancelRes() : string {
            return "btnCancel";
        }

        public static get inputField() : string {
            return "assets/PNG/inputfield.png";
        }

        public static get inputFieldRes() : string {
            return "inputField";
        }

        public static get sliderRight() : string {
            return "assets/PNG/blue_sliderRight.png";
        }

        public static get sliderRightRes() : string {
            return "sliderRight";
        }

        // combo slider
        public static get comboSliderBackground() : string {
            return "assets/PNG/grey_button00.png";
        }

        public static get comboSliderBackgroundRes() : string {
            return "comboSliderBackground";
        }

        public static get comboSliderUp() : string {
            return "assets/PNG/blue_sliderUp.png";
        }

        public static get comboSliderUpRes() : string {
            return "comboSliderUp";
        }

        public static get comboSliderDown() : string {
            return "assets/PNG/blue_sliderDown.png";
        }

        public static get comboSliderDownRes() : string {
            return "comboSliderDown";
        }

    }
}
