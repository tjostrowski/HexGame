class TimeMeasure {
    private _startTime;
    private _endTime;

    start() : TimeMeasure {
        this._startTime = new Date();
        return this;
    }

    finishAndLog() {
        this._endTime = new Date();
        console.log('Loading took: ' + (this._endTime - this._startTime) + ' [ms]');
    }

}