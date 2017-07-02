module Logic {

    export enum ContextAction {
        ACTION_HOLDING,
        ACTION_RANGING_SOLDIERS,
    }

    export enum ContextActionParamKey {
        ACTION_PARAM_BUILDING,

        ACTION_PARAM_SOLDIERS_CELL, // Phaser.Point
        ACTION_PARAM_SOLDIERS_RANGE, // Map<Phaser.Point, Sprite>
    }

    export class ContextActionParam {
        private _key : ContextActionParamKey;
        private _value : any;

        constructor(key : ContextActionParamKey, value? : any) {
            this._key = key;
            this._value = value;
        }

        public get key() : ContextActionParamKey {
            return this._key;
        }

        public get value() : any {
            return this._value;
        }

        public static of(key : ContextActionParamKey, value? : any) : ContextActionParam {
            return new ContextActionParam(key, value);
        }
    }

    export class ContextFrame {
        private _action : ContextAction;
        private _baseParam: ContextActionParam;
        private _otherParams : any[] = [];

        constructor(action : ContextAction, baseParam : ContextActionParam, otherParams : any[]) {
            this._action = action;
            this._baseParam = baseParam;
            for (var param of otherParams) {
                this._otherParams.push(param);
            }
        }

        public static of(action : ContextAction, baseParam : ContextActionParam, ...otherParams : any[]) : ContextFrame {
            return new ContextFrame(action, baseParam, otherParams);
        }

        public get action() : ContextAction {
            return this._action;
        }

        public get baseParam() : ContextActionParam {
            return this._baseParam;
        }

        public get otherParams() : any[] {
            return this._otherParams;
        }

        public addOtherParam(param : any) {
            this._otherParams.push(param);
        }
    }

    export class GameContext {

        private _stack : ContextFrame[] = [];

        constructor() {
            All.registerContext(this);
        }

        public push(frame : ContextFrame) {
            this._stack.push(frame);
        }

        public pop() : ContextFrame {
            return this._stack.pop();
        }

        public top() : ContextFrame {
            return (!this.isEmpty()) ? this._stack[ this._stack.length - 1 ] : null;
        }

        public holdingBuilding() : boolean {
            var frame : ContextFrame = this.top();
            return frame && frame.action === ContextAction.ACTION_HOLDING
                && frame.baseParam.key === ContextActionParamKey.ACTION_PARAM_BUILDING;
        }

        public rangingSoldiers() : boolean {
            var frame : ContextFrame = this.top();
            return frame && frame.action === ContextAction.ACTION_HOLDING
                && frame.baseParam.key === ContextActionParamKey.ACTION_PARAM_SOLDIERS_CELL;
        }

        public isEmpty() : boolean {
            return this._stack.length === 0;
        }

    }

}
