class TileUtils {

    public static getObjectsWithType(map : Phaser.Tilemap, objectsLayerName : string, objectType : string) {
        var objects = [];
        map.objects[objectsLayerName].forEach(obj => {
            if (obj.properties.type === objectType) {
                objects.push(obj);
            }
        });
        return objects;
    }

}