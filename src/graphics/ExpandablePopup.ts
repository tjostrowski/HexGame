module Graphics {

    export enum SliderType {
        ENTIRE_BOTTOM,
        TOP_RIGHT,
        LEFT,
        RIGHT
    }

    export enum SliderState {
        HIDDEN,
        VISIBLE
    }

    export enum SliderOrientation {
        HORIZONTAL,
        VERTICAL
    }

    export class ExpandablePopup extends ElementWithAssets {

        private _orientation : SliderOrientation;

        private _type : SliderType;
        private _state : SliderState;

        private _openButtonWidth : number;
        private _openButtonHeight : number;

        private _fullWidth : number;
        private _fullHeight : number;

        private _aspectX : number;
        private _aspectY : number;

        private _onVisibleRendered : Function[] = [];

        private _tween : Phaser.Tween;

        private _minBackgroundScale;
        private _maxBackgroundScale;

        constructor(type : SliderType = SliderType.ENTIRE_BOTTOM, orientation : SliderOrientation = SliderOrientation.HORIZONTAL, ...assetResources : AssetResource[]) {
            super(assetResources);

            if (type !== SliderType.ENTIRE_BOTTOM && type !== SliderType.TOP_RIGHT) {
                throw "Unsupported slider type: " + type;
            }

            if (orientation !== SliderOrientation.HORIZONTAL) {
                throw "Only horizontal slider orientation is currently supported";
            }

            this._orientation = orientation;

            this._type = type;

            this._state = SliderState.HIDDEN;
        }

        public init() : void {
            super.simpleCreateSprites();

            var that = this;
            that.createInstance(this.openButtonResource, function() {
                that.openSlider();
            });
            that.createInstance(this.closeButtonResource, function() {
                that.closeSlider();
            });

            if (this._type === SliderType.ENTIRE_BOTTOM) {
                var screenHeightPerc10 = All.graphicsCtrl.partOfScreenHeight(10);

                this._openButtonWidth = screenHeightPerc10;
                this._openButtonHeight = screenHeightPerc10;

                this._fullWidth = All.graphicsCtrl.screenWidth;
                this._fullHeight = screenHeightPerc10;

                this._minBackgroundScale = new Phaser.Point(0.1, 1.0);
                this._maxBackgroundScale = new Phaser.Point(1.0, 1.0);

            } else if (this._type === SliderType.TOP_RIGHT) {
                var screenHeightPerc10 = All.graphicsCtrl.partOfScreenHeight(10);

                this._openButtonWidth = screenHeightPerc10;
                this._openButtonHeight = screenHeightPerc10;

                this._fullWidth = All.graphicsCtrl.partOfScreenWidth(40);
                this._fullHeight = All.graphicsCtrl.partOfScreenHeight(70);

                this._minBackgroundScale = new Phaser.Point(0.1, 0.1);
                this._maxBackgroundScale = new Phaser.Point(1.0, 1.0);
            }

            var backgroundSprite = this.backgroundInstance.sprite;
            this._aspectX = this._fullWidth / backgroundSprite.width;
            this._aspectY = this._fullHeight / backgroundSprite.height;

            this.markAllAsInvisibleUI();
        }

        public render() {
            this.displayOpenButton();
        }

        public openSlider() {
            this.renderVisible();
        }

        public closeSlider() {
            this.renderHidden();
        }

        public addOnVisibleRendered(callback : Function) {
            this._onVisibleRendered.push(callback);
        }

        private renderHidden() {
            var backgroundSprite = this.backgroundInstance.sprite,
                tween = this._tween;

            if ((tween && tween.isRunning) || backgroundSprite.scale.x === this.minBackgroundScale.x) {
                return;
            }

            this.markAsInvisible(this.closeButtonInstance);

            this._tween = All.game.add.tween(backgroundSprite.scale).to({x : this.minBackgroundScale.x, y : this.minBackgroundScale.y},
                200, Phaser.Easing.Linear.None, true);

            var that = this;
            this._tween.onComplete.add(function () {
                that.displayOpenButton();
            });
        }

        private renderVisible() {
            var backgroundSprite = this.backgroundInstance.sprite,
                tween = this._tween;

            if ((tween && tween.isRunning)/* || backgroundSprite.scale.x === this.maxBackgroundScale.x*/) {
                return;
            }

            if (this._type === SliderType.ENTIRE_BOTTOM) {
                backgroundSprite.anchor.set(0.0, 0.0);
                All.graphicsCtrl.putOnBottomLeft(backgroundSprite, this._fullWidth * this.minBackgroundScale.x, this._fullHeight * this.minBackgroundScale.y);
            } else if (this._type === SliderType.TOP_RIGHT) {
                backgroundSprite.anchor.set(1.0, 0.0);
                All.graphicsCtrl.putOnTopRight(backgroundSprite, this._fullWidth * this.minBackgroundScale.x, this._fullHeight * this.minBackgroundScale.y);
            }
            backgroundSprite.alpha = 0.9;

            this.markAsVisibleUI(this.backgroundInstance);

            this._tween = All.game.add.tween(backgroundSprite.scale).to({x : this.maxBackgroundScale.x * this._aspectX, y : this.maxBackgroundScale.y * this._aspectY},
                500, Phaser.Easing.Linear.None, true);

            this.markAsInvisible(this.openButtonInstance);
            var closeButton = this.closeButtonInstance.button;
            if (this._type === SliderType.ENTIRE_BOTTOM) {
                All.graphicsCtrl.putOnBottomLeft(closeButton, this._openButtonWidth, this._openButtonHeight);
            } else if (this._type === SliderType.TOP_RIGHT) {
                All.graphicsCtrl.putOnTopRight(closeButton, this._openButtonWidth, this._openButtonHeight);
            }

            this.markAsVisibleUI(this.closeButtonInstance);

            var that = this;
            this._tween.onComplete.add(function () {
                var renderArea = new Phaser.Rectangle(that._fullHeight, 0, that._fullWidth - that._fullHeight, that._fullHeight);
                for (var callback of that._onVisibleRendered) {
                    callback(backgroundSprite, renderArea);
                }
            });
        }

        private displayOpenButton() {
            this.markAsInvisible(this.closeButtonInstance, this.backgroundInstance);

            var openButton = this.openButtonInstance.button;
            if (this._type === SliderType.ENTIRE_BOTTOM) {
                All.graphicsCtrl.putOnBottomLeft(this.openButtonInstance.button, this._openButtonWidth, this._openButtonHeight);
            } else if (this._type === SliderType.TOP_RIGHT) {
                All.graphicsCtrl.putOnTopRight(this.openButtonInstance.button, this._openButtonWidth, this._openButtonHeight);
            }
            openButton.alpha = 0.9;

            this.markAsVisibleUI(this.openButtonInstance);
        }

        private get minBackgroundScale() : Phaser.Point {
            return this._minBackgroundScale;
        }

        private get maxBackgroundScale() : Phaser.Point {
            return this._maxBackgroundScale;
        }

        private get openButtonResource() : AssetResource {
            return this.getAssetResource(Assets.popupOpenButtonRes);
        }

        private get closeButtonResource() : AssetResource {
            return this.getAssetResource(Assets.popupCloseButtonRes);
        }

        private get openButtonInstance() : AssetResourceInstance {
            return this.getAssetInstance(Assets.popupOpenButtonRes);
        }

        private get closeButtonInstance() : AssetResourceInstance {
            return this.getAssetInstance(Assets.popupCloseButtonRes);
        }

        private get backgroundInstance() : AssetResourceInstance {
            return this.getAssetInstance(Assets.popupBackgroundRes);
        }

        public get tween() : Phaser.Tween {
            return this._tween;
        }

        public get width() : number {
            return this._fullWidth;
        }

        public get height() : number {
            return this._fullHeight;
        }


    }

}
