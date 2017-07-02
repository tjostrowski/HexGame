module Graphics {

    export enum ResourceType {
        SPRITE,
        BUTTON,
        NINE_SLICE
    }

    export class AssetResource {
        protected _assetFileName : string;
        protected _resourceName : string;
        protected _resourceType : ResourceType;

        constructor(assetFileName : string, resourceName : string, resourceType? : ResourceType, addToManager : boolean = true) {
            this._assetFileName = assetFileName;
            this._resourceName = resourceName;
            this._resourceType = resourceType;
            if (addToManager) {
                All.assetsManager.addAssetResource(this);
            }
        }

        public get assetFileName() : string {
            return this._assetFileName;
        }

        public get resourceName() : string {
            return this._resourceName;
        }

        public get type() : ResourceType {
            return this._resourceType;
        }
    }

    export class AssetResourceInstance {
        protected _assetRes : AssetResource;
        protected _assetSave : AssetSave;

        constructor(assetRes : AssetResource) {
            this._assetRes = assetRes;
        }

        public get assetFileName() : string {
            return this._assetRes.assetFileName;
        }

        public get resourceName() : string {
            return this._assetRes.resourceName;
        }

        public get resourceType() : ResourceType {
            return this._assetRes.type;
        }

        public get assetRes() : AssetResource {
            return this._assetRes;
        }

        public get sprite() : Phaser.Sprite {
            return this._assetSave.sprite;
        }

        public get button() : Phaser.Button {
            return this._assetSave.button;
        }

        public get asset() : any {
            return this._assetSave._asset;
        }

        public savedWith(assetSave : AssetSave) : AssetResourceInstance {
            this._assetSave = assetSave;
            return this;
        }

    }

    export class AssetTileResource extends AssetResource {
        protected _index : number;

        constructor(assetFileName : string, resourceName : string, index : number) {
            super(assetFileName, resourceName, false);
            this._index = index;
        }

        public get index() : number {
            return this._index;
        }

    }

}
