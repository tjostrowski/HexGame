module Graphics {

    export class Popup {

        private _assetsManager : AssetsManager;
        private _backgroundResource : AssetResource;
        private _closeResource : AssetResource;

        private _graphicsCtrl : GraphicsController;

        private _popupSprite : Phaser.Sprite;

        private _game : Phaser.Game;

        private _tween : Phaser.Tween;

        private _backgroundWidth : number;
        private _backgroundHeight : number;

        private _requiredWidth : number;
        private _requiredHeight : number;

        constructor(backgroundRes : AssetResource, closeRes : AssetResource,
                    requiredWidth? : number, requiredHeight? : number) {
            this._assetsManager = All.assetsManager;
            this._game = All.game;
            this._backgroundResource = backgroundRes;
            this._closeResource = closeRes;
            this._graphicsCtrl = All.graphicsCtrl;
            this._requiredWidth = requiredWidth;
            this._requiredHeight = requiredHeight;
        }

        private init() : Phaser.Sprite {
            this._popupSprite = this._assetsManager.createSimpleSpriteAsset(this._backgroundResource.resourceName).sprite;

            var popup = this._popupSprite;

            this._backgroundWidth = popup.width;
            this._backgroundHeight = popup.height;

            popup.x = this._graphicsCtrl.screenCenterX;
            popup.y = this._graphicsCtrl.screenCenterY;

            popup.fixedToCamera = true;

            popup.alpha = 0.9;
            popup.anchor.set(0.5);
            popup.inputEnabled = true;
            popup.input.disableDrag();

            var pw = (popup.width / 2) - 30;
            var ph = (popup.height / 2) - 8;

            var closeButton = this._game.make.sprite(pw, -ph, this._closeResource.resourceName);
            closeButton.inputEnabled = true;
            closeButton.input.priorityID = 1;
            closeButton.input.useHandCursor = true;
            closeButton.events.onInputDown.add(this.closeWindow, this);

            popup.addChild(closeButton);

            var minScale = this.minBackgroundScale;
            popup.scale.set(minScale.x, minScale.y);

            return popup;
        }

        public openWindow() : Phaser.Tween {
            if (!this._popupSprite) {
                this.init();
            }

            var tween = this._tween, popup = this._popupSprite;

            if ((tween && tween.isRunning) || popup.scale.x === 1) {
                return;
            }

            var maxScale = this.maxBackgroundScale;
            this._tween = this._game.add.tween(popup.scale).to( { x: maxScale.x, y: maxScale.y },
                100, Phaser.Easing.Elastic.Out, true);

            All.gameCtrl.disableInput();

            return this._tween;
        }

        public closeWindow() : Phaser.Tween {
            var tween = this._tween, popup = this._popupSprite;
            if (tween && tween.isRunning || popup.scale.x === this.minBackgroundScale.x) {
                return;
            }

            var minScale = this.minBackgroundScale;
            this._tween = this._game.add.tween(popup.scale).to( { x: minScale.x, y: minScale.y },
                50, Phaser.Easing.Elastic.In, true);

            All.gameCtrl.enableInput();

            return this._tween;
        }

        public get sprite() : Phaser.Sprite {
            return this._popupSprite;
        }

        public get width() : number {
            return this._popupSprite.width;
        }

        public get height() : number {
            return this._popupSprite.height;
        }

        public get minBackgroundWidth() : number {
            return this._backgroundWidth * this.minBackgroundScale.x;
        }

        public get minBackgroundHeight() : number {
            return this._backgroundHeight * this.minBackgroundScale.y;
        }

        public get maxBackgroundWidth() : number {
            return this._backgroundWidth * this.maxBackgroundScale.x;
        }

        public get maxBackgroundHeight() : number {
            return this._backgroundHeight * this.maxBackgroundScale.y;
        }

        private get minBackgroundScale() : Phaser.Point {
            return new Phaser.Point(0.0, 0.0);
        }

        private get maxBackgroundScale() : Phaser.Point {
            var screenWidth = this._graphicsCtrl.screenWidth,
                screenHeight = this._graphicsCtrl.screenHeight;

            if (this._requiredWidth) {
                // adjusting to _requiredWidth
                var scaleX = this._requiredWidth / this._backgroundWidth;
                return new Phaser.Point(scaleX, scaleX);
            } else {

                var maxScaleX = Math.min(1.0, (screenWidth - 100) / this._backgroundWidth),
                    maxScaleY = Math.min(1.0, (screenHeight - 100) / this._backgroundHeight),
                    maxScaleXY = Math.min(maxScaleX, maxScaleY);

                return new Phaser.Point(maxScaleXY, maxScaleXY);
            }
        }

    }
}
