///<reference path='../All.ts' />
///<reference path='../utils/Dictionary.ts' />

module Graphics {

    export class AssetsManager {
        private _game : Phaser.Game;

        private _assetResources : DictionaryValueTyped<AssetResource> = new DictionaryValueTyped<AssetResource>();

        private _imgResources : Dictionary = new Dictionary();

        private _loadersCache : DictionaryValueTyped<Phaser.Loader> = new DictionaryValueTyped<Phaser.Loader>();

        constructor() {
            this._game = All.game;
        }

        public addAssetResource(assetRes : AssetResource, loadOnDemand : boolean = true) : AssetsManager {
            this._assetResources.add(assetRes.resourceName, assetRes);
            if (loadOnDemand) {
                this.loadIfNeeded(assetRes);
            }
            return this;
        }

        public addAssetResources(...assetResources : AssetResource[]) {
            assetResources.forEach(assetRes => this.addAssetResource(assetRes));
        }

        public removeAssetResource(assetResource: AssetResource) : AssetsManager {
            this._assetResources.remove(assetResource.resourceName);
            return this;
        }

        public getAssetResource(resourceName : string, loadOnDemand : boolean = true) : AssetResource {
            var assetRes : AssetResource = this._assetResources.get(resourceName);
            if (loadOnDemand) {
                this.loadIfNeeded(assetRes);
            }
            return assetRes;
        }

        private loadIfNeeded(assetRes : AssetResource) {
            var resName = assetRes.resourceName,
                imgLoaded = this._game.cache.checkImageKey(resName),
                loader : Phaser.Loader = this._loadersCache.get(resName);

            if ( !(imgLoaded || (loader && !loader.isLoading)) ) {
                console.trace('Loading: ' + assetRes.assetFileName);
                if (assetRes.type === ResourceType.NINE_SLICE) {
                    loader = (<any>this._game.load).nineSlice(assetRes.resourceName, assetRes.assetFileName, 15);
                } else {// BUTTON || SPRITE
                    loader = this._game.load.image(assetRes.resourceName, assetRes.assetFileName);
                }
                if (loader !== undefined) {
                    this._loadersCache.add(resName, loader);
                    var that = this;
                    loader.onLoadComplete.add(function() {
                        that._loadersCache.remove(resName);
                    });
                }    
            }
        }

        public loadAllImageAssets() {
            this._assetResources.values.forEach(assetRes => this.loadIfNeeded(assetRes));
        }

        public getAsSprite(key : string) : Phaser.Sprite {
            return <Phaser.Sprite>this._imgResources.get(key);
        }

        public getAsButton(key : string) : Phaser.Button {
            return <Phaser.Button>this._imgResources.get(key);
        }

        public get(key : string) : any {
            return this._imgResources.get(key);
        }

        public createAndPutOnTopLeft(imgResourceName : string, requiredWidth? : number, requiredHeight? : number, actionOnClick? : Function) : AssetSave {
            if (actionOnClick) {
                return this.createSimpleButtonAsset(imgResourceName, 0, 0, actionOnClick, false, requiredWidth, requiredHeight);
            } else {
                return this.createSimpleSpriteAsset(imgResourceName, 0, 0, false, requiredWidth, requiredHeight);
            }
        }

        public createAndPutOnTopRight(imgResourceName : string, requiredWidth? : number, requiredHeight? : number, actionOnClick? : Function) : AssetSave {
            var img : HTMLImageElement = this._game.cache.getImage(imgResourceName);
            if (actionOnClick) {
                return this.createSimpleButtonAsset(imgResourceName, window.innerWidth - (requiredWidth ? requiredWidth : img.width), 0, actionOnClick,
                    false, requiredWidth, requiredHeight);
            } else {
                return this.createSimpleSpriteAsset(imgResourceName, window.innerWidth - (requiredWidth ? requiredWidth : img.width), 0, false,
                    requiredWidth, requiredHeight);
            }
        }

        public createAndPutOnBottomLeft(imgResourceName : string, requiredWidth? : number, requiredHeight? : number, actionOnClick? : Function) : AssetSave {
            var img : HTMLImageElement = this._game.cache.getImage(imgResourceName);
            if (actionOnClick) {
                return this.createSimpleButtonAsset(imgResourceName, 0, window.innerHeight - (requiredHeight ? requiredHeight : img.height), actionOnClick,
                    false, requiredWidth, requiredHeight);
            } else {
                return this.createSimpleSpriteAsset(imgResourceName, 0, window.innerHeight - (requiredHeight ? requiredHeight : img.height), false,
                    requiredWidth, requiredHeight);
            }
        }

        public createAndPutOnBottomRight(imgResourceName : string, requiredWidth? : number, requiredHeight? : number, actionOnClick? : Function) : AssetSave {
            var img : HTMLImageElement = this._game.cache.getImage(imgResourceName);
            if (actionOnClick) {
                return this.createSimpleButtonAsset(imgResourceName, window.innerWidth - (requiredWidth ? requiredWidth : img.width),
                    window.innerHeight - img.height, actionOnClick, false, requiredWidth, requiredHeight);
            } else {
                return this.createSimpleSpriteAsset(imgResourceName, window.innerWidth - (requiredWidth ? requiredWidth : img.width),
                    window.innerHeight - img.height, false, requiredWidth, requiredHeight);
            }
        }

        public createInstance(assetRes : AssetResource, actionOnClick? : Function, x? : number, y? : number, saveWithRandomName? : boolean,
                              requiredWidth? : number, requiredHeight? : number) : AssetResourceInstance {
            var instance = new AssetResourceInstance(assetRes);
            var save = this.create(instance.assetRes, actionOnClick, x, y, saveWithRandomName, requiredWidth, requiredHeight);
            instance.savedWith(save);
            return instance;
        }

        public create(assetRes : AssetResource, actionOnClick? : Function, x? : number, y? : number, saveWithRandomName? : boolean,
                      requiredWidth? : number, requiredHeight? : number) : AssetSave {

            if ( !saveWithRandomName ) {
                var asset = this.get(assetRes.resourceName);
                if (asset) {
                    return new AssetSave(assetRes.resourceName, asset);
                }
            }

            if (assetRes.type == ResourceType.BUTTON || actionOnClick) {
                return this.createSimpleButtonAsset(assetRes.resourceName, x, y, actionOnClick, saveWithRandomName, requiredWidth, requiredHeight);
            } else {
                return this.createSimpleSpriteAsset(assetRes.resourceName, x, y, saveWithRandomName, requiredWidth, requiredHeight);
            }
        }

        public createSimpleSpriteAsset(imgResourceName : string, x? : number, y? : number, saveWithRandomName? : boolean,
                                        requiredWidth? : number, requiredHeight? : number) : AssetSave {
            var assetResource = this.getAssetResource(imgResourceName);
            if (assetResource) {
                var sprite: Phaser.Sprite = this._game.add.sprite(x? x : 0, y? y : 0, imgResourceName);
                var scaleX = requiredWidth ? requiredWidth/sprite.width : 1.0;
                var scaleY = requiredHeight ? requiredHeight/sprite.height : 1.0;
                sprite.scale.setTo(scaleX, scaleY);
                var imgKey = saveWithRandomName ? Utils.s8() : imgResourceName;
                this._imgResources.add(imgKey, sprite);
                return new AssetSave(imgKey, sprite);
            } else {
                console.error('Cannot find resource with name: ' + imgResourceName);
                return null;
            }
        }

        public createSimpleButtonAsset(imgResourceName : string, x? : number, y? : number, actionOnClick? : Function,
                                       saveWithRandomName? : boolean, requiredWidth? : number, requiredHeight? : number) : AssetSave {
            var assetResource = this.getAssetResource(imgResourceName);
            if (assetResource) {
                var button: Phaser.Button = this._game.add.button(x? x : 0, y? y : 0, imgResourceName, actionOnClick);
                var scaleX = requiredWidth ? requiredWidth/button.width : 1.0;
                var scaleY = requiredHeight ? requiredHeight/button.height : 1.0;
                button.scale.setTo(scaleX, scaleY);
                var imgKey = saveWithRandomName ? Utils.s8() : imgResourceName;
                this._imgResources.add(imgKey, button);
                return new AssetSave(imgKey, button);
            } else {
                console.error('Cannot find resource with name: ' + imgResourceName);
                return null;
            }
        }

    }

    export class AssetSave {
        _spriteKey : string;
        _asset : any;

        constructor(spriteKey : string, asset : any) {
            this._spriteKey = spriteKey;
            this._asset = asset;
        }

        get key() : string {
            return this._spriteKey;
        }

        get sprite() : Phaser.Sprite {
            return <Phaser.Sprite>this._asset;
        }

        get button() : Phaser.Button {
            return <Phaser.Button>this._asset;
        }

    }

}
