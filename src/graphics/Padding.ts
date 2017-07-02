module Graphics {

    export class Padding {
        _left : number;
        _right : number;
        _top : number;
        _bottom : number;

        constructor(left : number, right : number, top : number, bottom : number) {
            this._left = left;
            this._right = right;
            this._top = top;
            this._bottom = bottom;
        }

        get left() {
            return this._left;
        }

        get right() {
            return this._right;
        }

        get top() {
            return this._top;
        }

        get bottom() {
            return this._bottom;
        }

    }
}