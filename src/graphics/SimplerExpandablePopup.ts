module Graphics {

    export abstract class SpritedWindow {
        protected _sprite : Phaser.Sprite;

        public abstract render();
        public get sprite() : Phaser.Sprite {
            return this._sprite;
        }
    }

    export enum SpritedWindowMode {
        GRADIENT,
        TEXTURED
    }

    export class SimpleColoredWindow extends SpritedWindow {

        private _x : number;
        private _y : number;

        private _width : number;
        private _height : number;
        private _colorFrom : string;
        private _colorTo : string;

        private _edgeRounding;

        private _bitmapData : Phaser.BitmapData;
        private _gradient : CanvasGradient;

        constructor(width : number, height : number,
                    colorFrom : string, colorTo : string,
                    x : number = 0, y : number = 0, edgeRounding = 10) {
            super();
            this._width = width;
            this._height = height;
            this._colorFrom = colorFrom;
            this._colorTo = colorTo;
            this._x = x;
            this._y = y;
            this._edgeRounding = edgeRounding;
        }

        public render() {
            var width = this._width, height = this._height;

            this._bitmapData = All.game.add.bitmapData(width, height);
            this._gradient = this._bitmapData.context.createLinearGradient(
                0, 0, width, height
            );
            this._gradient.addColorStop(0, this._colorFrom);
            this._gradient.addColorStop(1, this._colorTo);

            this._bitmapData.context.fillStyle = this._gradient;
            if (this._edgeRounding > 0) {
                SpriteUtils.roundedRect(this._bitmapData.context, 0, 0, width, height, 10).fill();
            } else {
                this._bitmapData.context.fillRect(0, 0, width, height);
            }

            this._sprite = All.game.add.sprite(this._x, this._y, this._bitmapData);

            this._sprite.fixedToCamera = true;
            All.layers.front.add(this._sprite);
        }
    }

    export class SimpleTexturedWindow extends SpritedWindow {

        private _x : number;
        private _y : number;

        private _textureName : string;

        private _width : number;
        private _height : number;

        private _bitmapData : Phaser.BitmapData;

        constructor(width : number, height : number,
                    textureName? : string,
                    x : number = 0, y : number = 0) {
            super();
            this._width = width;
            this._height = height;
            this._textureName = textureName;
            this._x = x;
            this._y = y;
        }

        public render() {
            var width = this._width, height = this._height;

            this._bitmapData = All.game.add.bitmapData(width, height);
            this._bitmapData.copy(this._textureName);
            this._sprite = All.game.add.sprite(this._x, this._y, this._bitmapData);

            this._sprite.fixedToCamera = true;
            All.layers.front.add(this._sprite);
        }
    }

    export class VisibilityTweenedWindow {

        private _window : SpritedWindow;

        private _minScale : Phaser.Point;
        private _maxScale : Phaser.Point;

        private _tween : Phaser.Tween;
        private _minimized : boolean;

        constructor(window : SpritedWindow, minScale? : Phaser.Point, maxScale? : Phaser.Point) {
            this._window = window;

            this._minScale = minScale ? minScale : new Phaser.Point(0.1, 0.1);
            this._maxScale = maxScale ? maxScale : new Phaser.Point(1.0, 1.0);

            this._minimized = false;
        }

        public startMinimized() {
            var minScale = this._minScale;
            this._window.sprite.scale.setTo(minScale.x, minScale.y);
            this._window.sprite.visible = false;
            this._minimized = true;
        }

        public startMaximized() {
            var maxScale = this._maxScale;
            this._window.sprite.scale.setTo(maxScale.x, maxScale.y);
            this._window.sprite.visible = true;
            this._minimized = false;
        }

        public minimize() {
            if (!this._minimized && !(this._tween && this._tween.isRunning)) {
                var sprite = this._window.sprite;
                this._tween = All.game.add.tween(sprite.scale).to({x : this._minScale.x, y : this._minScale.y},
                    200, Phaser.Easing.Linear.None, true);

                var that = this;
                this._tween.onComplete.add(function() {
                    that._minimized = true;
                    sprite.visible = false;
                });
            }
        }

        public maximize() {
            if (this._minimized && !(this._tween && this._tween.isRunning)) {
                var sprite = this._window.sprite;
                this._tween = All.game.add.tween(sprite.scale).to({x : this._maxScale.x, y : this._maxScale.y},
                    300, Phaser.Easing.Linear.None, true);

                var that = this;
                this._tween.onStart.add(function() {
                    sprite.visible = true;
                });
                this._tween.onComplete.add(function() {
                    that._minimized = false;
                });
            }
        }

        public get minimized() : boolean {
            return this._minimized;
        }

        public get maximized() : boolean {
            return !this._minimized;
        }

        public get window() : SpritedWindow {
            return this._window;
        }

        public get tween() : Phaser.Tween {
            return this._tween;
        }

    }

    export enum Position {
        ENTIRE_TOP,
        TOP_LEFT,
        TOP_RIGHT,
        ENTIRE_BOTTOM,
        BOTTOM_LEFT,
        BOTTOM_RIGHT,
        USER_DEFINED
    }

    export class SimplePopup {

        private _tweenedWindow : VisibilityTweenedWindow;
        private _spritedWindow : SpritedWindow;

        private _width : number;
        private _height : number;

        private _mode : SpritedWindowMode;

        private _colorFrom : string;
        private _colorTo : string;

        private _textureName : string;

        private _tweenOnStart : boolean;

        private _uiGroup : Phaser.Group;

        constructor(width: number, height : number, mode : SpritedWindowMode = SpritedWindowMode.GRADIENT, tweenOnStart : boolean = false) {
            this._width = width;
            this._height = height;
            this._mode = mode;
            this._tweenOnStart = tweenOnStart;
        }

        public setGradientColors(colorFrom : string, colorTo: string) : SimplePopup {
            if (this._mode !== SpritedWindowMode.GRADIENT) {
                throw "Gradient colors should be set only in color mode";
            }
            this._colorFrom = colorFrom;
            this._colorTo = colorTo;
            return this;
        }

        public setTexture(textureName : string) : SimplePopup {
            if (this._mode !== SpritedWindowMode.TEXTURED) {
                throw "Gradient colors should be set only in textured mode";
            }
            this._textureName = textureName;
            return this;
        }

        private assertValid() {
            return (this._mode === SpritedWindowMode.GRADIENT && this._colorFrom && this._colorTo)
                || (this._mode === SpritedWindowMode.TEXTURED && this._textureName);
        }

        public show() {
            this.assertValid();

            var mode = this._mode,
                pos = new Phaser.Point(
                    All.graphicsCtrl.screenWidth*0.5 - this._width*0.5,
                    All.graphicsCtrl.screenHeight*0.5 - this._height*0.5);

            if (mode === SpritedWindowMode.GRADIENT) {
                this._spritedWindow = new SimpleColoredWindow(this._width, this._height,
                    this._colorFrom, this._colorTo, pos.x, pos.y);
            } else if (mode === SpritedWindowMode.TEXTURED) {
                this._spritedWindow = new SimpleTexturedWindow(this._width, this._height,
                    this._textureName, pos.x, pos.y);
            }

            this._spritedWindow.render();
            // this._spritedWindow.sprite.anchor.setTo(0.5, 0.5);

            this._tweenedWindow = new VisibilityTweenedWindow(this._spritedWindow);
            if (this._tweenOnStart) {
                this._tweenedWindow.startMinimized();
                this._tweenedWindow.maximize();
            } else {
                this._tweenedWindow.startMaximized();
            }

            this._uiGroup = All.game.add.group();
            All.layers.front.add(this._uiGroup);
            this._uiGroup.parent = this._spritedWindow.sprite;
        }

        public showAndFadeOutAfter(seconds : number) {
            this.show();
            var timerEvent = All.game.time.events.add(seconds*1000, function() {
                All.game.add.tween(this._spritedWindow.sprite).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
            }, this);
            timerEvent.timer.onComplete.add(function() {
                this.destroyAll();
            }, this);
        }

        public closeWindow() {
            this._spritedWindow.sprite.alpha = 0;
            this.destroyAll();
        }

        private destroyAll() {
            // FIXME: fix!
            // this._spritedWindow.sprite.destroy();
            // this._uiGroup.destroy();
        }

        public get uiGroup() : Phaser.Group {
            return this._uiGroup;
        }

        public get width() : number {
            return this._width;
        }

        public get height() : number {
            return this._height;
        }
    }

    export class PopupExpandedWithButton {

        private _position : Position;

        private _openButtonRes : AssetResource;
        private _closeButtonRes : AssetResource;
        private _backgroundRes : AssetResource;

        private _openButton : Phaser.Button;
        private _closeButton : Phaser.Button;

        private _tweenedWindow : VisibilityTweenedWindow;

        private _buttonWidth : number;
        private _buttonHeight : number;

        private _backgroundWidth : number;
        private _backgroundHeight : number;

        private _whenStartMaximizingCallbacks : Function[] = [];
        private _whenMaximizedCallbacks : Function[] = [];
        private _whenStartMinimizingCallbacks : Function[] = [];
        private _whenMinimizedCallbacks : Function[] = [];

        constructor(sliderPos : Position,
                    openButtonRes : AssetResource,
                    closeButtonRes : AssetResource,
                    backgroundRes : AssetResource) {
            this._position = sliderPos;
            this._openButtonRes = openButtonRes;
            this._closeButtonRes = closeButtonRes;
            this._backgroundRes = backgroundRes;

            var screenHeightPerc10 = 0.1 * All.graphicsCtrl.screenHeight;

            switch (sliderPos) {
                case Position.ENTIRE_TOP:
                case Position.ENTIRE_BOTTOM:
                    this._buttonWidth = this._buttonHeight = screenHeightPerc10;
                    this._backgroundWidth = All.graphicsCtrl.screenWidth;
                    this._backgroundHeight = screenHeightPerc10;
                    break;
                case Position.TOP_LEFT:
                case Position.TOP_RIGHT:
                case Position.BOTTOM_LEFT:
                case Position.BOTTOM_RIGHT:
                    this._buttonWidth = this._buttonHeight = screenHeightPerc10;
                    this._backgroundWidth = All.graphicsCtrl.screenWidth * 0.4;
                    this._backgroundHeight = All.graphicsCtrl.screenHeight * 0.7;
                    break;
            }
        }

        public render() {
            // open button
            var that = this;
            var openButtonAction = function() {
                that._tweenedWindow.maximize();
                that._tweenedWindow.tween.onStart.add(function() {
                    that._openButton.visible = false;

                    for (var callback of that._whenStartMaximizingCallbacks) {
                        callback(that._tweenedWindow.window,
                                 that._tweenedWindow.window.sprite);
                    }
                });
                that._tweenedWindow.tween.onComplete.add(function() {
                    that._closeButton.visible = true;

                    for (var callback of that._whenMaximizedCallbacks) {
                        callback(that._tweenedWindow.window,
                                 that._tweenedWindow.window.sprite,
                                 that._closeButton);
                    }
                });
            };
            this._openButton = All.game.add.button(0, 0, this._openButtonRes.resourceName,
                openButtonAction);
            this.positionButton(this._openButton);

            // close button
            var closeButtonAction = function() {
                that._tweenedWindow.minimize();
                that._tweenedWindow.tween.onStart.add(function() {
                    that._closeButton.visible = false;

                    for (var callback of that._whenStartMinimizingCallbacks) {
                        callback(that._tweenedWindow.window,
                                 that._tweenedWindow.window.sprite);
                    }
                });
                that._tweenedWindow.tween.onComplete.add(function() {
                    that._openButton.visible = true;

                    for (var callback of that._whenMinimizedCallbacks) {
                        callback(that._tweenedWindow.window,
                                 that._tweenedWindow.window.sprite,
                                 that._openButton);
                    }
                });
            };
            this._closeButton = All.game.add.button(0, 0, this._closeButtonRes.resourceName,
                closeButtonAction);
            this.positionButton(this._closeButton);
            this._closeButton.visible = false;

            // background
            var pos : Phaser.Point, anchor : Phaser.Point;
            switch (this._position) {
                case Position.ENTIRE_BOTTOM:
                    pos = new Phaser.Point(0, All.graphicsCtrl.screenHeight - this._backgroundHeight);
                    anchor = new Phaser.Point(0, 0);
                    break;
                case Position.TOP_RIGHT:
                    pos = new Phaser.Point(All.graphicsCtrl.screenWidth, 0);
                    anchor = new Phaser.Point(1, 0);
                    break;
                default:
                    throw "Not yet specified!";
            }

            var spritedWindow = new SimpleTexturedWindow(this._backgroundWidth,
                this._backgroundHeight, this._backgroundRes.resourceName,
                pos.x, pos.y);

            spritedWindow.render();
            spritedWindow.sprite.anchor.x = anchor.x;
            spritedWindow.sprite.anchor.y = anchor.y;

            this._tweenedWindow = new VisibilityTweenedWindow(spritedWindow);
            this._tweenedWindow.startMinimized();
        }

        public addWhenStartMaximizing(callback : Function) {
            this._whenStartMaximizingCallbacks.push(callback);
        }

        public addWhenMaximized(callback : Function) {
            this._whenMaximizedCallbacks.push(callback);
        }

        public addWhenStartMinimizing(callback : Function) {
            this._whenStartMinimizingCallbacks.push(callback);
        }

        public addWhenMinimized(callback : Function) {
            this._whenMinimizedCallbacks.push(callback);
        }

        public get backgroundSprite() : Phaser.Sprite {
            return this._tweenedWindow.window.sprite;
        }

        public get openButton() : Phaser.Button {
            return this.openButton;
        }

        public get closeButton() : Phaser.Button {
            return this.closeButton;
        }

        public get tweenedWindow() : VisibilityTweenedWindow {
            return this._tweenedWindow;
        }

        private positionButton(button : Phaser.Button) {
            switch (this._position) {
                case Position.ENTIRE_TOP:
                case Position.TOP_LEFT:
                    All.graphicsCtrl.putOnTopLeft(button, this._buttonWidth, this._buttonHeight);
                    break;
                case Position.TOP_RIGHT:
                    All.graphicsCtrl.putOnTopRight(button, this._buttonWidth, this._buttonHeight);
                    break;
                case Position.ENTIRE_BOTTOM:
                case Position.BOTTOM_LEFT:
                    All.graphicsCtrl.putOnBottomLeft(button, this._buttonWidth, this._buttonHeight);
                    break;
                case Position.BOTTOM_RIGHT:
                    All.graphicsCtrl.putOnBottomRight(button, this._buttonWidth, this._buttonHeight);
                    break;
            }
            button.fixedToCamera = true;
        }
    }
}
