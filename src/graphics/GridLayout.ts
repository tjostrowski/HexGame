module Graphics {

    export class GridLayout extends BasicDisplayableElement {

        _parentContainer : PIXI.DisplayObjectContainer;

        _numRequiredTilesInRow : number;
        _numColumns : number;
        _numTilesInRow : number;

        _renderArea : Phaser.Rectangle;

        _assetResources : AssetResource[] = [];

        _sprites : Phaser.Sprite[] = [];

        _padding : Padding;
        _horizontalSpace : number;
        _verticalSpace : number;

        _cellWidth : number;
        _cellHeight : number;

        _onSpriteRenderedCallbacks : Function[] = [];

        constructor(parent : PIXI.DisplayObjectContainer,
                    cellWidth : number, cellHeight : number,
                    renderArea? : Phaser.Rectangle,
                    alignment : Alignment = Alignment.LEFT,
                    padding? : Padding, horizontalSpace? : number, verticalSpace? : number,
                    numRequiredTilesInRow? : number) {
            super();
            this._parentContainer = parent;

            this._numRequiredTilesInRow = numRequiredTilesInRow;

            this._cellWidth = cellWidth;
            this._cellHeight = cellHeight;

            this._padding = padding ? padding : new Padding(5, 5, 5, 5);
            this._horizontalSpace = horizontalSpace ? horizontalSpace : 5;
            this._verticalSpace = verticalSpace ? verticalSpace : 5;

            if (renderArea) {
                this._renderArea = renderArea;
            } else if (parent instanceof Phaser.Sprite) {
                var parentSprite = <Phaser.Sprite>parent;
                parentSprite.anchor.set(0.5);
                this._renderArea = new Phaser.Rectangle(-parentSprite.width/2, -parentSprite.height/2,
                                                        parentSprite.width/2, parentSprite.height/2);
            } else {
                throw "Render area was not specified";
            }
        }

        public render() {

            if (this._assetResources.length === 0) {
                return;
            }

            this._sprites = [];

            var tileWidth = this._cellWidth,
                tileHeight = this._cellHeight,
                renderArea = this._renderArea,
                padding = this._padding;

            var numTilesInRow = this.numRequiredTilesInRow ? this.numRequiredTilesInRow :
                    Math.ceil((renderArea.width - padding.left - padding.right) / (tileWidth + this._horizontalSpace) ),
                numColumns = Math.ceil((renderArea.width - padding.top - padding.bottom) / (tileHeight + this._verticalSpace) );

            var renderArea = this._renderArea, padding = this._padding;

            for (var i = 0, y = renderArea.top + padding.top; i < this.numSprites; i+=numTilesInRow, y+=tileHeight + this._verticalSpace) {

                for (var j = i, x = renderArea.left + padding.left; j < numTilesInRow && j < this.numSprites; j++, x+=tileWidth + this._horizontalSpace) {

                    var assetRes = this._assetResources[j];

                    var sprite = (assetRes instanceof AssetTileResource)
                        ? All.game.add.sprite(x, y, assetRes.resourceName, (<AssetTileResource>assetRes).index, All.layers.menuLayer)
                        : All.game.add.sprite(x, y, assetRes.resourceName);

                    if (this._cellWidth < sprite.width || this._cellHeight < sprite.height) {
                        sprite.scale.setTo((this._cellWidth - 5)/sprite.width, (this._cellHeight - 5)/sprite.height);
                    }

                    for (var callback of this._onSpriteRenderedCallbacks) {
                        callback(j, sprite);
                    }

                    this._sprites.push(sprite);

                    // sprite.scale.setTo(sprite.scale.x / this._parentSprite.scale.x, sprite.scale.y / this._parentSprite.scale.y);
                    this._parentContainer.addChild(sprite);
                }
            }
        }

        public addOnSpriteRenderedCallback(callback : Function) {
            this._onSpriteRenderedCallbacks.push(callback);
        }

        public addAssetResource(assetRes : AssetResource) : GridLayout {
            this._assetResources.push(assetRes);
            return this;
        }

        public get padding() : Padding {
            return this._padding;
        }

        public get horizontalSpace() : number {
            return this._horizontalSpace;
        }

        public get verticalSpace() : number {
            return this._verticalSpace;
        }

        public get numSprites() : number {
            return this._assetResources.length;
        }

        public get numRequiredTilesInRow() : number {
            return this._numRequiredTilesInRow;
        }

        public get cellWidth() : number {
            return this._cellWidth;
        }

        public get cellHeight() : number {
            return this._cellHeight;
        }

        public getSprite(index : number) {
            if (index >= this._sprites.length) {
                throw "Sprite with index :" + index + " does not exist";
            }
            return this._sprites[index];
        }

    }

    export enum Alignment {
        LEFT,
        CENTER,
        RIGHT
    }

}
