class DictionaryTyped<K, V> {

    protected _keys : Array<string>;
    protected _values : Array<V>;

    protected _keyToStringConvertFunc : Function;

    constructor(keyToStringConvertFunc? : Function) {
        this._keys = new Array<string>();
        this._values = new Array<V>();
        this._keyToStringConvertFunc = keyToStringConvertFunc;
    }

    public add(key : K, value : V) {
        var keyStr = this.toString(key);
        this[keyStr] = value;
        this._keys.push(keyStr);
        this._values.push(value);
    }

    public overwrite(key : K, value : V) {
        var keyStr = this.toString(key);
        if (!this.containsKeyStr(keyStr)) {
            this._keys.push(keyStr);
            this._values.push(value);
        } else {
            var index = this._keys.indexOf(keyStr);
            this._values[index] = value;
        }
        this[keyStr] = value;
    }

    public addIfAbsent(key : K, value : V) {
        var keyStr = this.toString(key);
        if (this.containsKeyStr(keyStr)) {
            return;
        }
        this.add(key, value);
    }

    public addAll(keyFunc : Function, values : V[]) {
        for (var val of values) {
            var key = keyFunc(val);
            this.add(key, val);
        }
    }

    public size() {
        return this._keys.length;
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

    public get(key : K) : V {
        var keyStr = this.toString(key);
        return this.getFromKeyString(keyStr);
    }

    public getFromKeyString(keyStr : string) : V {
        var index = this._keys.indexOf(keyStr);
        if (index !== -1) {
            return this._values[index];
        }
        return null;
    }

    public containsKey(key : K) {
        return this.containsKeyStr(this.toString(key));
    }

    public containsKeyStr(keyStr : string) : boolean {
        if (typeof this[keyStr] === "undefined") {
            return false;
        }
        return true;
    }

    public get keys() : Array<string> {
        return this._keys;
    }

    public get values() : Array<V> {
        return this._values;
    }

    public clearAll() {
        for (var keyStr of this._keys) {
            this.removeByKeyString(keyStr);
        }
    }

    public copyOf() : DictionaryTyped<K,V> { // shallow copy
        var dict = new DictionaryTyped<K,V>();
        dict._keys = [];
        this._keys.forEach(k => dict._keys.push(k));
        dict._values = [];
        this._values.forEach(v => dict._values.push(v));
        return dict;
    }

    private toString(key : K) {
        return this._keyToStringConvertFunc
            ? this._keyToStringConvertFunc(key)
            : key.toString();
    }
}

class DictionaryValueTyped<V> extends DictionaryTyped<string, V> {

    protected _valueToStringConvertFunc : Function;

    constructor(valueToStringConvertFunc? : Function) {
        super();
        this._valueToStringConvertFunc = valueToStringConvertFunc;
    }

    public addValue(value : V) {
        if (this._valueToStringConvertFunc) {
            var key = this._valueToStringConvertFunc(value);
            this.add(key, value);
        }
    }

    public overwriteValue(value : V) {
        if (this._valueToStringConvertFunc) {
            var key = this._valueToStringConvertFunc(value);
            this.overwrite(key, value);
        }
    }
}
