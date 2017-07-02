class LabelButton extends Phaser.Button {

    private label : Phaser.Text;

    private labelText : string;
    private labelTextStyle : Phaser.PhaserTextStyle;

    constructor(game: Phaser.Game, x?: number, y?: number, key?: string, callback?: Function, text?: string, textStyle?: Phaser.PhaserTextStyle,  
                callbackContext?: any, overFrame?: string | number, outFrame?: string | number, downFrame?: string | number, upFrame?: string | number) {
        super(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
        this.labelText = text;
        this.labelTextStyle = textStyle;
        this.label = new Phaser.Text(game, 5, 2, this.labelText, this.labelTextStyle);
        this.anchor.setTo(0.5, 0.5);
        this.label.anchor.setTo(0.5, 0.5);
	    this.addChild(this.label);    
	    game.add.existing(this);
    }

    setText(text : string) {
        this.labelText = text;
    }

    setStyle(textStyle : string) {
        this.labelTextStyle = textStyle;
    }
}