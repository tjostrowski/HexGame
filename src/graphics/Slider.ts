module Graphics {

    export class Slider {

        private _range : number;
        private _value : number;

        private _requiredSliderWidth : number;

        private _sliderGroup : Phaser.Group;

        private _sliderSprite : Phaser.Sprite;
        private _sliderShifterSprite : Phaser.Sprite;

        private _sliderStep : number;

        private _valueText : Phaser.Text;

        private _x : number;
        private _y : number;

        constructor(range : number, initial : number = 0,
                    requiredSliderWidth : number,
                    x? : number, y? : number) {
            this._range = Math.max(range, 1);
            this._value = Math.min(initial, range);
            this._requiredSliderWidth = requiredSliderWidth;
            this._x = x ? x : null;
            this._y = y ? y : null;
        }

        public render() {
            this._sliderGroup = All.game.add.group();

            this._sliderShifterSprite = All.game.add.sprite(0, 0, Assets.sliderShifterRes);
            this._valueText = All.game.add.text(0, 0, this._value.toString(), Text.big());

            this._sliderStep = (this._requiredSliderWidth - this._sliderShifterSprite.width) / this._range;

            var bitmapData = All.game.add.bitmapData(this._requiredSliderWidth, this._sliderShifterSprite.height);
            bitmapData.copy(Assets.sliderHorizontalRes, 0, 0, null, null, 0, Math.floor(this._sliderShifterSprite.height * 0.5));
            this._sliderSprite = All.game.add.sprite(0, 0, bitmapData);

            this._sliderSprite.inputEnabled = true;
            var that = this;
            this._sliderSprite.events.onInputDown.add(function(sprite : Phaser.Sprite, pointer : Phaser.Pointer) {
                var x = pointer.worldX - sprite.world.x;
                var estimatedValue = Math.floor(x / that._sliderStep);
                that.moveShifterTo(estimatedValue);
            });
            this._sliderGroup.add(this._sliderSprite);

            this._sliderShifterSprite.y = this._sliderSprite.y;
            this.moveShifterTo(this._value);
            this._sliderGroup.add(this._sliderShifterSprite);

            this._valueText.alignTo(this._sliderSprite, Phaser.RIGHT_CENTER, 5);
            this._sliderGroup.add(this._valueText);

            if (this._x) {
                this._sliderGroup.x = this._x;
            }
            if (this._y) {
                this._sliderGroup.y = this._y;
            }
        }

        private moveShifterTo(value : number) {
            if (value >= 0 && value <= this._range) {
                this._value = value;
                this._sliderShifterSprite.x = value * this._sliderStep;
                this._valueText.setText(value.toString());
            }
        }

        public get range() : number {
            return this._range;
        }

        public get value() : number {
            return this._value;
        }

        public get group() : Phaser.Group {
            return this._sliderGroup;
        }
    }

}
