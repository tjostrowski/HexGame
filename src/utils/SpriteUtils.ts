class SpriteUtils {

    public static greyOut(sprite : PIXI.Sprite) {
        sprite.tint = 0x2F4F4F;
    }

    public static greyOutLightly(sprite : PIXI.Sprite) {
        sprite.tint = 0x4F4F4F;
    }

    public static undoGreyOut(sprite : PIXI.Sprite) {
        sprite.tint = 0xFFFFFF;
    }

    public static copy(sprite : Phaser.Sprite) : Phaser.Sprite {
        return All.game.add.sprite(sprite.x, sprite.y, sprite.key, sprite.frame);
    }

    public static setInvisible(sprite : Phaser.Sprite) : Phaser.Sprite {
        sprite.visible = false;
        return sprite;
    }

    public static setVisible(sprite : Phaser.Sprite) : Phaser.Sprite {
        sprite.visible = true;
        return sprite;
    }

    public static markAsUI(sprite : Phaser.Button) {
        sprite.fixedToCamera = true;
    }

    public static destroyAll(sprites : Phaser.Sprite[]) {
        for (var sprite of sprites) {
            sprite.destroy();
        }
    }

    public static simpleBlink(sprite : Phaser.Sprite, repeatDelay : number = 500, repeatCount : number = 3) : Phaser.TimerEvent {
        var timerEvent = All.game.time.events.repeat(repeatDelay, repeatCount*2, function() {
            if (sprite.exists) {
                sprite.kill();
            } else {
                sprite.revive();
            }
        });
        return timerEvent;
    }

    public static blinkWithFading(sprite : Phaser.Sprite, repeatDelay : number = 500, repeatCount : number = 3) : Phaser.TimerEvent {
        var initAlpha = sprite.alpha;
        var timerEvent = All.game.time.events.repeat(repeatDelay, repeatCount*2, function() {
            if (sprite.alpha > 0) {
                All.game.add.tween(sprite).to( {alpha : 0}, repeatDelay - 100, Phaser.Easing.Linear.None, true );
            } else {
                All.game.add.tween(sprite).to( {alpha : initAlpha}, repeatDelay - 100, Phaser.Easing.Linear.None, true );
            }
        });
        return timerEvent;
    }

    public static createRadientBackground(colorFrom : string, colorTo : string) : Phaser.Sprite {
        return this.createGradientRect(0, 0, All.game.width, All.game.height, colorFrom, colorTo);
    }

    public static createGradientRect(
        x : number, y : number,
        width : number, height : number,
        colorFrom : string, colorTo : string) : Phaser.Sprite {

        var bitmapData = All.game.add.bitmapData(width, height);
        var gradient = bitmapData.context.createLinearGradient(
            0, 0, width, height
        );
        gradient.addColorStop(0, colorFrom);
        gradient.addColorStop(1, colorTo);

        bitmapData.context.fillStyle = gradient;
        bitmapData.context.fillRect(0, 0, width, height);

        return All.game.add.sprite(x, y, bitmapData);
    }

    public static addToGroup(group : Phaser.Group, ...sprites : PIXI.Sprite[]) {
        for (var sprite of sprites) {
            group.add(sprite);
        }
    }

    public static roundedRect(ctx: CanvasRenderingContext2D,
        x: number, y: number, w: number, h: number, r: number) : CanvasRenderingContext2D {

        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y,   x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x,   y+h, r);
        ctx.arcTo(x,   y+h, x,   y,   r);
        ctx.arcTo(x,   y,   x+w, y,   r);
        ctx.closePath();

        return ctx;
    }

}
