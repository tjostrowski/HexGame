module GameStates {
    export class CreditsState extends Phaser.State {

        public static NAME = 'Credits';

        mainGroup : Phaser.Group;

        header : Phaser.Text;
        info : Phaser.Text;

        infoText : string = `string text line 1 string text line 1
    string text line 2 string text line 2
    string text line 3 string text line 3
    string text line 4 string text line 4
    string text line 5 string text line 5
    string text line 6 string text line 6
    string text line 7 string text line 7
    string text line 8 string text line 8
    string text line 9 string text line 9
    string text line 10 string text line 10
    string text line 11 string text line 11
    string text line 12 string text line 12
    string text line 13 string text line 13
    string text line 14 string text line 14
    string text line 15 string text line 15`;

        constructor() {
            super();
            console.log('Credits state');
        }

        preload() {

        }

        create() {
            this.game.stage.backgroundColor = "#4488AA";

            this.mainGroup = this.game.add.group();

            var headerStyle = { font: "36px kenvector_futureregular", align: "left" };
            this.header = this.game.add.text(this.game.world.centerX, 50, "Credits", headerStyle, this.mainGroup);

            var infoStyle = { font: "18px kenvector_futureregular", align: "center" };
            // this.info = this.game.add.text(this.game.world.centerX, 50 + this.header.height, this.infoText, infoStyle, this.mainGroup);
            // this.info.lineSpacing = 1;

            // below method works but is weird!
            var y = 50 + this.header.height;
            this.infoText.split("\n").forEach(line => {
                var txt = this.game.add.text(this.game.world.centerX, y, line, infoStyle, this.mainGroup);
                y += txt.height + 1;
            });

            this.mainGroup.forEach(function(item : Phaser.Text) {
                item.anchor.setTo(0.5);
            }, null);
        }

        update() {

        }

    }
}
