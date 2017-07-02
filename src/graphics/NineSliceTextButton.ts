module Graphics {

    export class NineSliceTextButton {

        private _nineSliceBtn : Fabrique.NineSlice;
        private _btnText : Phaser.Text;
        private _text : string;

        private _btnRes : string;

        private _width : number;
        private _height : number;

        constructor(btnText : string,  width : number = 100, height : number = 50, btnRes : string = Assets.sliderRightRes, x : number = 0, y : number = 0) {
            this._text = btnText;
            this._width = width;
            this._height = height;
            this._btnRes = btnRes;
        }

        public add() {
            var font = (this._height < 100) ?  Graphics.Text.sized(24).font : Graphics.Text.sized(30).font;
            var game = All.game;
            this._nineSliceBtn = (<any>game.add).nineSlice(0, 0, this._btnRes, null, this._width, this._height);
            this._btnText = game.add.text(0, 0, this._text, {
                font: font,
            });
            this._btnText.parent = this._nineSliceBtn;
            this._nineSliceBtn.anchor.setTo(0.5);
            this._btnText.x = -this._btnText.width * 0.5;
            this._btnText.y = -this._btnText.height * 0.5;
            this._nineSliceBtn.inputEnabled = true;
            this._nineSliceBtn.input.useHandCursor = true;
        }

        public get bgSprite() : Phaser.Sprite {
            return this._nineSliceBtn;
        }

        public get btnText() : Phaser.Text {
            return this._btnText;
        }

    }
}
