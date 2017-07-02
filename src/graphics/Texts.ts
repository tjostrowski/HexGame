module Graphics {

    export enum Font {
        Kenvector
    }

    export enum TextAlign {
        CENTER,
        LEFT,
        RIGHT
    }

    export class Text {

        private _font : Font;
        private _fontSize : number;
        private _textAlign : TextAlign;

        constructor(font : Font, fontSize : number /*in px*/, textAlign? : TextAlign) {
            this._font = font;
            this._fontSize = fontSize;
            this._textAlign = textAlign;
        }

        public static small() : any {
            return new Text(Font.Kenvector, 8, TextAlign.CENTER).style;
        }

        public static medium() : any {
            return new Text(Font.Kenvector, 13, TextAlign.CENTER).style;
        }

        public static big() : any {
            return new Text(Font.Kenvector, 24, TextAlign.CENTER).style;
        }

        public static huge() : any {
            return new Text(Font.Kenvector, 30, TextAlign.CENTER).style;
        }

        public static sized(size : number) : any {
            return new Text(Font.Kenvector, size, TextAlign.CENTER).style;
        }

        public get font() : string {
            var fontStr = '';
            fontStr += this._fontSize + 'px';
            if (this._font === Font.Kenvector) {
                fontStr += ' kenvector_futureregular';
            }

            return fontStr;
        }

        public get align() : string {
            var alignStr = '';
            switch (this._textAlign) {
                case TextAlign.LEFT:
                    alignStr += 'left';
                    break;
                case TextAlign.RIGHT:
                    alignStr += 'right';
                    break;
                case TextAlign.CENTER:
                default:
                    alignStr += 'center';
                    break;
            }

            return alignStr;
        }

        public get style() : any {
            return {
                font: this.font,
                align: this.align
            };
        }
    }

    export class TextLayout implements DisplayableElement {
        private _parentSprite : Phaser.Sprite;
        private _textStyle : any;

        private _renderArea : Phaser.Rectangle;

        private _texts : string[] = [];

        private _padding : Padding;
        private _verticalSpace : number;

        private static defaultStyle = { font: "12px kenvector_futureregular", align: "center" };

        constructor(parentSprite : Phaser.Sprite, textStyle? : any, padding? : Padding, verticalSpace? : number) {
            this._parentSprite = parentSprite;
            this._textStyle = textStyle ? textStyle : TextLayout.defaultStyle;

            this._padding = padding ? padding : new Padding(10, 10, 10, 10);
            this._verticalSpace = verticalSpace ? verticalSpace : 5;

            parentSprite.anchor.set(0.5);

            this._renderArea = new Phaser.Rectangle(-parentSprite.width/2, -parentSprite.height/2,
                                                    parentSprite.width/2, parentSprite.height/2);
        }

        public init() {
        }

        public render() {
            var textsGroup = All.game.add.group(), renderArea = this._renderArea;

            var x = renderArea.left, y = renderArea.top + this._padding.top;
            this._texts.forEach(text => {
                var textElem : Phaser.Text = All.game.add.text(x, y, text, this._textStyle, textsGroup);
                y += textElem.height + this._verticalSpace;
            });
        }

        public addText(text : string) {
            this._texts.push(text);
        }

        public addTexts(texts : string[]) {
            this._texts.concat(texts);
        }
    }
}
