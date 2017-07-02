module Logic {

    export class Player {
        private _index : number;
        private _name : string;
        private _race : Race;

        constructor(index : number, name : string, race : Race = Race.SNOPPLERS) {
            this._index = index;
            this._name = name;
            this._race = race;
        }

        public get index() : number {
            return this._index;
        }

        public set index(index : number) {
            this._index = index;
        }

        public get name() : string {
            return this._name;
        }

        public set name(name : string) {
            this._name = name;
        }

        public get race() : Race {
            return this._race;
        }

        public set race(race : Race) {
            this._race = race;
        }

        public toString = () : string => {
            return Utils.format('Player with index: {1}, name: {2} and race: {3}',
                this._index, this._name, Logic.Race[this._race]);
        }
    }
}
