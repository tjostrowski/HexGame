class HexGame extends Phaser.Game
{
	constructor()
	{
		var screenDims = ScreenUtils.ScreenUtils.calculateScreenMetrics(800, 600,
                ScreenUtils.Orientation.LANDSCAPE);

		super(window.innerWidth, //window.innerWidth * window.devicePixelRatio, /* width */
			  window.innerHeight, // window.innerHeight * window.devicePixelRatio, /* height */
			  Phaser.AUTO, /* renderer */
			  'gameContent', /* parent */
			  null /* state */);

		this.state.add(GameStates.PreloadState.NAME, GameStates.PreloadState, false);
		this.state.add(GameStates.StartScreenState.NAME, GameStates.StartScreenState, false);
		this.state.add(GameStates.CreditsState.NAME, GameStates.CreditsState, false);
		this.state.add(GameStates.GameBoardState.NAME, GameStates.GameBoardState, false);
		this.state.add(GameStates.GameConfigurationState.NAME, GameStates.GameConfigurationState, false);

		All.registerGame(this);

		this.printDisplayStats();

		// this.state.start('Credits');
		// this.state.start('Preload');
		// this.state.start('GameBoard');
		this.state.start(GameStates.PreloadState.NAME);
	}

	private printDisplayStats() {
		console.trace('window.innerWidth = ' + window.innerWidth);
		console.trace('window.innerHeight = ' + window.innerHeight);
		console.trace('window.devicePixelRatio = ' + window.devicePixelRatio);
		console.trace('game.width = ' + this.width);
		console.trace('game.height = ' + this.height);
		if (this.world) {
			console.trace('world.width = ' + this.world.width);
			console.trace('world.height = ' + this.world.height);
		}
	}
}

// when the page has finished loading, create our game
window.onload = () => {
	// new UnitTests.TestSuite().run();
	var game = new HexGame();

}
