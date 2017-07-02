module Graphics {

    export interface DisplayableElement {
        render();
        init();

        parent() : DisplayableElement;
        children() : DisplayableElement[];

        addChild(child : DisplayableElement);
        setParent(parent : DisplayableElement);

        handleEvent(event : TreeEvent);
    }

    export class BasicDisplayableElement implements DisplayableElement {
        private _parent : DisplayableElement;
        private _children : DisplayableElement[];

        render() {}
        init() {}

        parent() : DisplayableElement {
            return this._parent;
        }

        children() : DisplayableElement[] {
            return this._children;
        }

        addChild(child : DisplayableElement) {
            this._children.push(child);
        }

        setParent(parent : DisplayableElement) {
            this._parent = parent;
        }

        handleEvent(event : TreeEvent) {}
    }

    export class ElementWithAssets extends BasicDisplayableElement {

        protected _assetResources : DictionaryValueTyped<AssetResource> = new DictionaryValueTyped<AssetResource>();
        protected _assetInstances : DictionaryValueTyped<AssetResourceInstance[]> = new DictionaryValueTyped<AssetResourceInstance[]>();

        constructor(assetResources : AssetResource[]) {
            super();
            for (var assetRes of assetResources) {
                this._assetResources.add( this.resKey(assetRes), assetRes );
            }
        }

        protected simpleCreateSprites() : void {
            for (var assetRes of this._assetResources.values) {
                if (assetRes.type !== ResourceType.SPRITE) {
                    continue;
                }

                var instance = All.assetsManager.createInstance(assetRes);
                this.putToInstances(instance);
            }
        }

        protected markAsUI(...assets : any[]) {
            for (var asset of assets) {
                if (asset instanceof Phaser.Sprite) {
                    (<Phaser.Sprite>asset).fixedToCamera = true;
                } else if (asset instanceof Phaser.Button) {
                    (<Phaser.Button>asset).fixedToCamera = true;
                }
            }
        }

        protected markAllAsUI() {
            var that = this;
            this.executeOnAllAssets(function (asset) {
                that.markAsUI(asset);
            });
        }

        protected markAllAsInvisible() {
            var that = this;
            this.executeOnAllAssets(function (asset) {
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = false;
                }
            });
        }

        protected markAllAsInvisibleUI() {
            var that = this;
            this.executeOnAllAssets(function (asset) {
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = false;
                    that.markAsUI(asset);
                }
            });
        }

        protected markAllAsVisible() {
            var that = this;
            this.executeOnAllAssets(function (asset) {
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = true;
                }
            });
        }

        protected markAsInvisible(...assetResourceInstances : AssetResourceInstance[]) {
            for (var instance of assetResourceInstances) {
                var asset = instance.asset;
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = false;
                }
            }
        }

        protected markAsVisible(...assetResourceInstances : AssetResourceInstance[]) {
            for (var instance of assetResourceInstances) {
                var asset = instance.asset;
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = true;
                }
            }
        }

        protected markAsVisibleUI(...assetResourceInstances : AssetResourceInstance[]) {
            for (var instance of assetResourceInstances) {
                var asset = instance.asset;
                if (asset instanceof PIXI.DisplayObject) {
                    (<PIXI.DisplayObject>asset).visible = true;
                    this.markAsUI(asset);
                }
            }
        }

        protected executeOnAllAssets(callback : Function) {
            for (var instances of this._assetInstances.values) {
                if (instances.length > 0) {

                    for (var instance of instances) {
                        callback(instance.asset);
                    }
                }
            }
        }

        protected createInstance(assetRes : AssetResource, actionOnClick? : Function, x? : number, y? : number, saveWithRandomName? : boolean,
                                 requiredWidth? : number, requiredHeight? : number) {

            var instance = All.assetsManager.createInstance(assetRes, actionOnClick, x, y, saveWithRandomName, requiredWidth, requiredHeight);
            this.putToInstances(instance);
        }

        private putToInstances(instance : AssetResourceInstance) {
            var key = this.resInstanceKey(instance);
            if (this._assetInstances.containsKeyStr(key)) {
                var values : AssetResourceInstance[] = this._assetInstances.get(key);
                values.concat(instance);
            } else {
                var values : AssetResourceInstance[] = [];
                values.push(instance);
                this._assetInstances.add(key, values);
            }
        }

        public getAssetResource(key : string) {
            return this._assetResources.get(key);
        }

        public getAssetInstance(key : string, index : number = 0) {
            var values : AssetResourceInstance[] = this._assetInstances.get(key);
            if (values && values.length >= index+1) {
                return values[index];
            }
            return null;
        }

        private resKey(assetResource : AssetResource) : string {
            return assetResource.resourceName;
        }

        private resInstanceKey(assetResInstance : AssetResourceInstance) : string {
            return assetResInstance.resourceName;
        }

    }

}
