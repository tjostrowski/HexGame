module GameStates {
    export class StartScreenState extends Phaser.State {

        public static NAME = 'StartScreen';

        background : Phaser.Sprite;

        newGameButton : Phaser.Button;
        loadGameButton : Phaser.Button;
        scoresButton : Phaser.Button;
        creditsButton : Phaser.Button;

        constructor() {
            super();
            console.log('Main screen state');
        }

        init() {
            // this.input.maxPointers = 1;
            // this.stage.disableVisibilityChange = false;

            // var screenDims = Utils.ScreenUtils.screenMetrics;

            // if (this.game.device.desktop) {
            //     console.log("DESKTOP");
            //     this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            //     this.scale.setUserScale(screenDims.scaleX, screenDims.scaleY);
            //     this.scale.pageAlignHorizontally = true;
            //     this.scale.pageAlignVertically = true;
            // }
            // else {
            //     console.log("MOBILE");
            //     this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            //     this.scale.setUserScale(screenDims.scaleX, screenDims.scaleY);
            //     this.scale.pageAlignHorizontally = true;
            //     this.scale.pageAlignVertically = true;
            //     this.scale.forceOrientation(true, false);
            // }

            // console.log(screenDims);
        }

        preload() {
        }

        create() {
            this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.MAIN_BACKGROUND);
            // this.updateScaleRatio(this.background);
            // this.background.scale.setTo(Settings.getScaleRatio(), Settings.getScaleRatio());
            this.background.anchor.setTo(0.5, 0.5);

            var game = this.game;
            var btnWidth = 190,
                btnHeight = 45,
                space = 30,
                buttonPosStart = game.world.centerY - 2*(btnHeight + space)
                ;

            var btnFontStyle = {font: "24px kenvector_futureregular", align: "center"};
            this.newGameButton = new LabelButton(game, game.world.centerX, buttonPosStart, Assets.MENU_BUTTON, this.onNewGame,
                "New Game", btnFontStyle );
            //  this.newGameButton = this.game.add.button(game.world.centerX - buttonWidth/2, buttonPosStart, 'action_button', this.onNewGame);
            this.loadGameButton = new LabelButton(game, game.world.centerX, buttonPosStart + btnHeight + space, Assets.MENU_BUTTON, this.onLoadGame,
                "Load Game", btnFontStyle);
            // this.loadGameButton = this.game.add.button(game.world.centerX - buttonWidth/2, buttonPosStart + buttonHeight + space, 'action_button', this.onLoadGame);
            this.scoresButton = new LabelButton(game, game.world.centerX, buttonPosStart + 2*(btnHeight + space), Assets.MENU_BUTTON, this.onScores,
                "Scores", btnFontStyle);
            // this.scoresButton = this.game.add.button(game.world.centerX - buttonWidth/2, buttonPosStart + 2*(buttonHeight + space), 'action_button', this.onScores);
            this.creditsButton = new LabelButton(game, game.world.centerX, buttonPosStart + 3*(btnHeight + space), Assets.MENU_BUTTON, this.onCredits,
                "Credits", btnFontStyle);
            // this.creditsButton = this.game.add.button(game.world.centerX - buttonWidth/2, buttonPosStart + 3*(buttonHeight + space), 'action_button', this.onCredits);
        }

        update() {

        }

        onNewGame() {
            console.log('start new game!');
        }

        onLoadGame() {

        }

        onScores() {

        }

        onCredits() {
            console.log('load credits screen!');
            this.game.state.start('Credits');
        }

        private updateScaleRatio(sprite : Phaser.Sprite) : void {
            var width : number = sprite.width;
            var height : number = sprite.height;
            sprite.scale.setTo(window.innerWidth / width, window.innerHeight / height);
        }
    }
}
