class Dictionary {
    private _keys : Array<string>;
    private _values : Array<any>;

    constructor() {
        this._keys = new Array<string>();
        this._values = new Array<any>();
    }

    add(key : string, value : any) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    addIfAbsent(key : string, value : any) {
        if (this.containsKey(key)) {
            return;
        }
        this.add(key, value);
    }

    addAll(keyFunc : Function, values : any[]) {
        for (var val of values) {
            var key = keyFunc(val);
            this.add(key, val);
        }
    }

    size() {
        return this._keys.length;
    }

    remove(key : string) {
        var index = this._keys.indexOf(key);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    }

    get(key : string) : any {
        var index = this._keys.indexOf(key);
        if (index !== -1) {
            return this._values[index];
        }
        return null;
    }

    containsKey(key : string) : boolean {
        if (typeof this[key] === "undefined") {
            return false;
        }
        return true;
    }

    keys() : string[] {
        return this._keys;
    }

    values() : any[] {
        return this._values;
    }

    copyOf() : Dictionary { // shallow copy
        var dict = new Dictionary();
        dict._keys = [];
        this._keys.forEach(k => dict._keys.push(k));
        dict._values = [];
        this._values.forEach(v => dict._values.push(v));
        return dict;
    }

    clearAll() {
        var key : string;
        for (key of this._keys) {
            this.remove(key);
        }
    }
}
