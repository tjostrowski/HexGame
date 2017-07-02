module GameStates {

    import Assets = Graphics.Assets;
    import Level = Logic.Level;

    export class GameConfigurationState extends AbstractState {

        public static NAME = 'GameConfiguration';

        public init() {
            super.init();
        }

        public preload() {
        }

        public create() {
            var kenvector18 = Graphics.Text.sized(18).font,
                kenvector24 = Graphics.Text.sized(24).font;
            var game = this.game;

            // background
            var background = SpriteUtils.createRadientBackground('#66d973', '#40b54d');
            All.layers.back.add(background);

            var uiGroup = All.game.add.group();
            All.layers.back.add(uiGroup);

            // header
            var header = game.add.text(game.width / 2, 100, 'Start this awesome game!', {
                font: Graphics.Text.huge().font,
                fill: '#000000'
            });
            header.anchor.set(0.5);
            uiGroup.add(header);

            //Player name
            var playerTitle = game.add.text(game.width / 2 - 200, header.y + header.height+50, 'Player name:', Graphics.Text.sized(24));
            var playerBg : Fabrique.NineSlice = (<any>game.add).nineSlice(0, 0, Assets.inputFieldRes, null, 200, 50);
            playerBg.anchor.set(0.5);
            playerBg.alignTo(playerTitle, Phaser.RIGHT_CENTER, 15);
            var playerInput : Fabrique.InputField = (<any>game.add).inputField(-100, -20, {
                font: kenvector18,
                fill: '#212121',
                fillAlpha: 0,
                fontWeight: 'bold',
                width: 150,
                max: 20,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: 'Username',
                textAlign: 'center',
                zoom: true
            });
            playerInput.parent = playerBg;
            playerInput.setText('Player1');
            playerInput.blockInput = false;
            // SpriteUtils.addToGroup(uiGroup, playerTitle, playerInput);

            //Num players
            var numPlayersTitle = game.add.text(0, 0, 'Players number:', Graphics.Text.sized(24));
            numPlayersTitle.alignTo(playerTitle, Phaser.BOTTOM_RIGHT, 0, 20);

            var numPlayersCombo = new Graphics.ComboSlider(0, 0,
                Utils.rangeOf(Logic.Consts.minNumPlayers, Logic.Consts.maxNumPlayers),
                60, 50);
            numPlayersCombo.add();
            numPlayersCombo.bgSprite.alignTo(numPlayersTitle, Phaser.RIGHT_CENTER, 15);
            uiGroup.add(numPlayersTitle);
            numPlayersCombo.addToGroup(uiGroup);

            //Level
            var levelTitle = game.add.text(0, 0, 'Level:', Graphics.Text.sized(24));
            levelTitle.alignTo(numPlayersTitle, Phaser.BOTTOM_RIGHT, 0, 20);

            var levelCombo = new Graphics.ComboSlider(0, 0,
                EnumEx.getNames(Logic.Level),
                190, 50);
            levelCombo.add();
            levelCombo.bgSprite.alignTo(levelTitle, Phaser.RIGHT_CENTER, 15);
            uiGroup.add(levelTitle);
            levelCombo.addToGroup(uiGroup);

            // Map size:
            var mapSizeTitle = game.add.text(0, 0, 'Map size:', Graphics.Text.sized(24));
            mapSizeTitle.alignTo(levelTitle, Phaser.BOTTOM_RIGHT, 0, 20);

            var mapSizes = ['50-50', '100-100', '150-150'];
            var mapSizesCombo = new Graphics.ComboSlider(0, 0, mapSizes, 150, 50);
            mapSizesCombo.add();
            mapSizesCombo.bgSprite.alignTo(mapSizeTitle, Phaser.RIGHT_CENTER, 15);

            uiGroup.add(mapSizeTitle);
            mapSizesCombo.addToGroup(uiGroup);

            // Players
            var textUnder = mapSizeTitle,
                playerNTitles : Phaser.Text[] = [],
                playerNCombos : Graphics.ComboSlider[] = [];

            for (var i = 1; i <= Logic.Consts.maxNumPlayers; ++i) {

                var playerNTitle = game.add.text(0, 0, 'Player' + i + ':', Graphics.Text.sized(24));
                playerNTitle.alignTo(textUnder, Phaser.BOTTOM_RIGHT, 0, 20);
                playerNTitles.push(playerNTitle);

                var playerNTypeCombo = new Graphics.ComboSlider(0, 0,
                    EnumEx.getNames(Logic.Race),
                    220, 50);
                playerNTypeCombo.add();
                playerNTypeCombo.bgSprite.alignTo(playerNTitle, Phaser.RIGHT_CENTER, 15);
                playerNCombos.push(playerNTypeCombo);

                if (i > Logic.Consts.minNumPlayers) {
                    SpriteUtils.greyOutLightly(playerNTitle);
                    playerNTypeCombo.editable = false;
                }

                uiGroup.add(playerNTitle);
                playerNTypeCombo.addToGroup(uiGroup);

                textUnder = playerNTitle;
            }

            numPlayersCombo.addOnChanged(
                function (prevValue, newValue) {
                    console.trace('Changed num players from: ' + prevValue + ' to: ' + newValue);
                    var expectedNumPlayers = parseInt(newValue);

                    for (var i = Logic.Consts.minNumPlayers; i <= Logic.Consts.maxNumPlayers+1; ++i) {
                        var arrIdx = i-Logic.Consts.minNumPlayers;
                        if (i-1 <= expectedNumPlayers) {
                            SpriteUtils.undoGreyOut(playerNTitles[arrIdx]);
                            playerNCombos[arrIdx].editable = true;
                        } else {
                            SpriteUtils.greyOutLightly(playerNTitles[arrIdx]);
                            playerNCombos[arrIdx].editable = false;
                        }
                    }
                }
            );

            //Start game
            var startGameBtn = (<any>game.add).nineSlice(0, 0, Assets.sliderRightRes, null, 250, 70);
            var startGame = game.add.text(0, 0, 'Start game', {
                font: kenvector24,
            });
            startGame.parent = startGameBtn;
            startGame.x = -100;
            startGame.y = -18;
            startGameBtn.anchor.setTo(0.5);
            startGameBtn.inputEnabled = true;
            startGameBtn.input.useHandCursor = true;
            startGameBtn.alignTo(Utils.last(playerNCombos).bgSprite, Phaser.BOTTOM_RIGHT, 0, 20);
            uiGroup.add(startGameBtn);

            startGameBtn.events.onInputDown.add(function() {
                console.trace('Starting game!');

                var mapSizeStr = mapSizesCombo.selectedText;
                var sizes : string[] = mapSizeStr.split('-');

                var mapSizeX = parseInt(sizes[0]),
                    mapSizeY = parseInt(sizes[1]);

                var level : Level = Level[levelCombo.selectedText];

                var numPlayers = parseInt(numPlayersCombo.selectedText);

                var selectedRaces : Logic.Race[] = [],
                    players : Logic.Player[] = [];
                for (var i = 0; i < Logic.Consts.maxNumPlayers; ++i) {
                    selectedRaces[i] = Logic.Race[playerNCombos[i].selectedText];
                    players[i] = new Logic.Player(
                        i+1,
                        (i === 0) ? playerInput.value : 'Player' + (i+1),
                        selectedRaces[i]
                    );
                }

                var gameConf = new Logic.GameConfiguration(
                    mapSizeX,
                    mapSizeY,
                    level,
                    numPlayers,
                    players
                );
                console.trace(gameConf.toString());

                All.registerGameConf(gameConf);

                this.game.state.start(GameStates.GameBoardState.NAME);
            }, this);
        }

        public update() {
        }
    }
}
