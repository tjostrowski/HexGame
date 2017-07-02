interface PluginHandler {

    onInit();
    onPreload();
    onCreate();
    onUpdate();

    getPlugin() : Phaser.Plugin;
}