class HexUtils {

    public static inRange(val : number, fromIncl : number, toExcl : number) : boolean {
        return val >= fromIncl && val < toExcl;
    }

    public static calculatePosition(hexGridX : number, hexGridY : number, tileWidth : number, tileHeight : number) : Phaser.Point {
        var isOffseted = (hexGridY % 2) === 1,
            offsetX = isOffseted ? tileWidth*0.5 : 0,
            x, y;

        y = tileHeight * hexGridY;
        x = offsetX + tileWidth * hexGridX;

        return new Phaser.Point(x, y);
    }

    public static calculateClickedCell(tileWidth : number, tileHeight : number, pointer : Phaser.Pointer) : Phaser.Point {
        var tw = tileWidth, th = tileHeight,
            x = pointer.worldX, y = pointer.worldY;
        var twDiv2 = tw * 0.5, thDiv4 = th * 0.25;
        var cell : Phaser.Point = new Phaser.Point(Math.floor(x / tw),
                                                    Math.floor(y / th));

        var isOffseted = cell.y % 2 === 1,
            offsetX = isOffseted ? twDiv2 : 0;

        if (isOffseted) {
            cell.x = Math.floor((x-offsetX) / tw);
        }

        var top = cell.y * th;

        if (pointer.worldY - top < thDiv4) {
            var left = cell.x * tw + offsetX,
                localX = x - left, localY = top + thDiv4 - y,
                ratio = th / (2*tw);

            if (localX < twDiv2 && localY > localX * ratio) {
                cell.x = (cell.x > 0 && !isOffseted) ? cell.x-1 : cell.x;
                cell.y = (cell.y > 0) ? cell.y-1 : cell.y;
            } else if (localX >= twDiv2 && localY > -ratio*(localX - twDiv2) + thDiv4) {
                cell.x = (cell.x < All.worldInfo.sizeX - 1 && isOffseted) ? cell.x+1 : cell.x;
                cell.y = (cell.y > 0) ? cell.y-1 : cell.y;
            }
        }

        return cell;
    }

    public static getNearbyCells(center : Phaser.Point, radius : number, sizeX : number, sizeY : number,
                                 includeSelf : boolean = true) : Phaser.Point[] {
        var inRange = HexUtils.inRange;
        var nearbyCells : Phaser.Point[] = [];
        for (var y = center.y - radius; y <= center.y + radius; y++) {
            for (var x = center.x - radius; x <= center.x + radius; x++) {

                if (inRange(y, 0, sizeY) && inRange(x, 0, sizeX)
                    && Math.abs(y - center.y) + Math.abs(x - center.x) <= radius) {

                    if (!includeSelf && x === center.x && y === center.y) {
                        continue;
                    }
                    nearbyCells.push(new Phaser.Point(x, y));
                }
            }
        }

        return nearbyCells;
    }

    public static getNearbyTilesInfo(world : Logic.WorldInfo, center : Phaser.Point, radius : number) : Logic.TileInfo[] {
        var inRange = HexUtils.inRange;
        var nearbyTilesInfo : Logic.TileInfo[] = [];
        for (var y = center.y - radius; y <= center.y + radius; y++) {
            for (var x = center.x - radius; x <= center.x + radius; x++) {

                if (inRange(y, 0, world.sizeY) && inRange(x, 0, world.sizeX)
                    && Math.abs(y - center.y) + Math.abs(x - center.x) <= radius) {

                    nearbyTilesInfo.push(world.getTileInfo(x, y));
                }
            }
        }

        return nearbyTilesInfo;
    }

}
