module Logic {

    export abstract class Action {
        protected _name : string;

        constructor(name : string) {
            this._name = name;
        }

        public get name() : string {
            return this._name;
        }
    }

    export class ActionsController {
        private _actionMap : DictionaryValueTyped<Action>;

        constructor() {
            this._actionMap = new DictionaryValueTyped<Action>(
                action => action.name
            );
            All.registerActionsCtrl(this);
        }

        public getAction<A extends Action>(actionName : string) : A {
            return this._actionMap.get(actionName);
        }

        public putAction(action : Action) {
            this._actionMap.overwriteValue(action);
        }

        public removeAction(action : Action) {
            this._actionMap.remove(action.name);
        }

    }

}
