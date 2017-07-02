class Settings {

    public static getGameWidth() : number {
        return window.innerWidth * window.devicePixelRatio;
    }

    public static getGameHeight() : number {
        return window.innerHeight * window.devicePixelRatio;
    }

    public static getScaleRatio() {
        return window.devicePixelRatio / 3;
    }

    public static info() {
        console.log("*** gameWidth=" + Settings.getGameWidth());
		console.log("*** gameHeight=" + Settings.getGameHeight());
		console.log("*** scaleRatio=" + Settings.getScaleRatio());
    }
}
