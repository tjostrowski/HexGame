class Utils {

    public static s4() : string {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }

    public static s8() : string {
        return this.s4() + this.s4();
    }

    public static listEnum<T>(enumClass: any) {
        var values: T[] = [];
        for (var key in enumClass) {
            values.push(enumClass[key]);
        }
        values.length = values.length / 2;
        return values;
    }

    public static toDictionary<T>(keyFunc : Function, arr : T[]) {
        var dict : DictionaryValueTyped<T> = new DictionaryValueTyped<T>();
        for (var elem of arr) {
            dict.add( keyFunc(elem), elem );
        }
        return dict;
    }

    public static isSingleClick(pointer : Phaser.Pointer) : boolean {
        return pointer.msSinceLastClick >= All.game.input.doubleTapRate;
    }

    public static isDoubleClick(pointer : Phaser.Pointer) : boolean {
        return pointer.msSinceLastClick < All.game.input.doubleTapRate;
    }

    public static longHoldDuration : number = 500;

    public static isPointerHoldLong(pointer : Phaser.Pointer) : boolean {
        return pointer.duration > this.longHoldDuration;
    }

    public static copy(array : any[]) {
        var destArray : any[] = [];
        for (var elem of array) {
            destArray.push(elem);
        }
        return destArray;
    }

    public static shallowCopy(array : any[]) {
        return this.copy(array);
    }

    public static last(array : any[]) : any {
        return (array.length > 0) ? array[array.length - 1] : null;
    }

    public static randomRange(from : number, to : number) : number {
        return from + Math.ceil(Math.random() * (to - from));
    }

    public static randomTo(to : number) : number {
        return this.randomRange(0, to);
    }

    public static pickRandomElement(array : any[]) : any {
        return array[this.randomTo(array.length - 1)];
    }

    public static format(str : string, ...replacements : any[]) {
        return str.replace(/{(\d+)}/g, (match : string, index : number) => {
            return (index <= replacements.length) ? replacements[index-1] : match;
        });
    }

    public static rangeOf(from : number, to : number) : string[] {
        var res : string[] = [];
        for (var i = from; i <= to; ++i) {
            res.push(i.toString());
        }
        return res;
    }

    public static isEmpty(array : any[]) {
        return array.length === 0;
    }

    public static sleepAndFuckApp(milliseconds : number) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
}
