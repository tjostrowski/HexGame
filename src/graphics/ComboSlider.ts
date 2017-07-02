module Graphics {

    export class ComboSlider {

        private _texts: string[];
        private _width : number;
        private _height : number;

        private _comboBg : Fabrique.NineSlice;
        private _upSlider : Phaser.Button;
        private _downSlider : Phaser.Button;

        private _textIndex : number;
        private _phaserTexts : Phaser.Text[] = [];

        private _onChangedCallbacks : Function[] = [];

        private _editable : boolean;

        constructor(x : number, y : number, texts : string[], width? : number, height? : number) {
            this._texts = texts;
            this._width = width ? width : 150;
            this._height = height ? height : 50;

            if (this._texts.length === 0) {
                throw "There should be at least one text in combo";
            }

            this._textIndex = 0;
            this._editable = true;
        }

        public add() {
            var game = All.game;

            this._comboBg = (<any>game.add).nineSlice(0, 0, Assets.comboSliderBackgroundRes, null, this._width, this._height);
            this._comboBg.anchor.set(0.5);

            for (var text of this._texts) {
                var phaserText = game.add.text(0, 0, text, Graphics.Text.sized(24));
                phaserText.x = -phaserText.width * 0.5;
                phaserText.y = -phaserText.height * 0.5;
                phaserText.parent = this._comboBg;
                phaserText.visible = false;
                this._phaserTexts.push(phaserText);
            }

            this._phaserTexts[this._textIndex].visible = true;

            var sliderWidth = 15,
                sliderHeight = this._height * 0.5;

            var onSliderUp = function() {
                if (this._editable && this._textIndex > 0) {
                    var currentIndex = this._textIndex;
                    this._phaserTexts[currentIndex].visible = false;
                    this._phaserTexts[currentIndex-1].visible = true;
                    this.forEachCallback(this._texts[currentIndex], this._texts[currentIndex-1]);
                    this._textIndex--;
                }
            }

            this._upSlider = game.add.button(this._width*0.5 - sliderWidth, -this._height*0.5,
                Assets.comboSliderUpRes, onSliderUp, this);
            this._upSlider.scale.setTo(sliderWidth/this._upSlider.width, sliderHeight/this._upSlider.height);
            this._upSlider.parent = this._comboBg;

            var onSliderDown = function() {
                if (this._editable && this._textIndex < this._texts.length - 1) {
                    var currentIndex = this._textIndex;
                    this._phaserTexts[this._textIndex].visible = false;
                    this._phaserTexts[this._textIndex+1].visible = true;
                    this.forEachCallback(this._texts[currentIndex], this._texts[currentIndex+1]);
                    this._textIndex++;
                }
            }

            this._downSlider = game.add.button(this._width*0.5 - sliderWidth, 0,
                Assets.comboSliderDownRes, onSliderDown, this);
            this._downSlider.scale.setTo(sliderWidth/this._downSlider.width, sliderHeight/this._downSlider.height);
            this._downSlider.parent = this._comboBg;
        }

        public get bgSprite() : Phaser.Sprite {
            return this._comboBg;
        }

        public get selectedText() : string {
            return this._texts[this._textIndex];
        }

        public addOnChanged(callback : Function) {
            this._onChangedCallbacks.push(callback);
        }

        public set editable(editable : boolean) {
            if (this._editable !== editable) {
                this.handleEditableChanged(editable);
            }
            this._editable = editable;
        }

        public addToGroup(group : Phaser.Group) {
            group.add(this._comboBg);
            // this._phaserTexts.forEach(text => group.add(text));
            // group.add(this._downSlider);
            // group.add(this._upSlider);
        }

        private handleEditableChanged(editable : boolean) {
            if (!editable) {
                SpriteUtils.greyOutLightly(this._comboBg);
                SpriteUtils.greyOutLightly(this._upSlider);
                SpriteUtils.greyOutLightly(this._downSlider);
            } else {
                SpriteUtils.undoGreyOut(this._comboBg);
                SpriteUtils.undoGreyOut(this._upSlider);
                SpriteUtils.undoGreyOut(this._downSlider);
            }
        }

        private forEachCallback(prevValue : number, newValue : number) {
            for (var func of this._onChangedCallbacks) {
                func(prevValue, newValue);
            }
        }
    }
}
