module GameStates {

    import Assets = Graphics.Assets;

    export class PreloadState extends Phaser.State {

        public static NAME = 'Preload';

        constructor() {
            super();
            console.log('Preload state');
        }

        init() {
            this.game.add.plugin(new Fabrique.Plugins.InputField(this.game, this.game.plugins));
            this.game.add.plugin(new Fabrique.Plugins.NineSlice(this.game, this.game.plugins));

            var graphicsCtrl = new Graphics.GraphicsController(this.game);
            var assetsManager = new Graphics.AssetsManager();
        }

        preload() {
            var assets = new Assets();
            All.registerAssets(assets);
            var assetsManager = new Graphics.AssetsManager();
            All.registerAssetsManager(assetsManager);

            (<any>this.game.load).nineSlice(Assets.inputFieldRes, Assets.inputField, 15);
            (<any>this.game.load).nineSlice(Assets.sliderRightRes, Assets.sliderRight, 15);
            this.game.load.image(Assets.fullBackgroundRes, Assets.fullBackground);

            All.assets.loadAll();
        }

        create() {
            this.game.state.start(GameConfigurationState.NAME);
        }

        private customSetDimensions() {
            if (this.game.device.desktop) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.minWidth = 480;
                this.game.scale.minHeight = 260;
                this.game.scale.maxWidth = 1024;
                this.game.scale.maxHeight = 768;
            } else { // mobile
                this.game.scale.forceOrientation(true, false);
                this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
            }
        }
    }
}
