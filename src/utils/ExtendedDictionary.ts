class DictionaryWithManyKeyValues<K, V> {
    private _keys : Array<string>;
    private _values : Array<Array<V>>;

    private _keyConvertFunc : Function;

    constructor(keyConvertFunc? : Function) {
        this._keys = new Array<string>();
        this._values = new Array<Array<V>>();
        this._keyConvertFunc = keyConvertFunc;
    }

    public add(key : K, value : V) {
        var keyStr = this.toString(key);

        if ( !this.containsKey(key) ) {
            this._keys.push(keyStr);
            var keyValues : Array<V> = [];
            keyValues.push(value);
            this._values.push(keyValues);
            this[keyStr] = keyValues;
        } else {
            var index = this._keys.indexOf(keyStr);
            var keyValues = this._values[index];
            keyValues.push(value);
        }
    }

    public addAll(key : K, values : V[]) {
        for (var value of values) {
            this.add(key, value);
        }
    }

    public size() {
        return this._keys.length;
    }

    public isEmpty() {
        return this.size() === 0;
    }

    public remove(key : K) {
        var keyStr = this.toString(key);
        this.removeByKeyString(keyStr);
    }

    private removeByKeyString(keyStr : string) {
        var index = this._keys.indexOf(keyStr);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[keyStr];
    }

    public get(key : K) : Array<V> {
        var index = this._keys.indexOf( this.toString(key) );
        if (index !== -1) {
            return this._values[index];
        }
        return [];
    }

    public containsKey(key : K) : boolean {
        if (typeof this[ this.toString(key) ] === "undefined") {
            return false;
        }
        return true;
    }

    public keys() : string[] {
        return this._keys;
    }

    public values() : any[] {
        return this._values;
    }

    public clearAll() {
        for (var keyStr of this._keys) {
            this.removeByKeyString(keyStr);
        }
    }

    private toString(key : K) {
        return this._keyConvertFunc
            ? this._keyConvertFunc(key)
            : key.toString();
    }
}
