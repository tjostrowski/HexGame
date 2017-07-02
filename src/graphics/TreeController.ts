module Graphics {

    export enum TreeEvent {
        HIDE
    }

    export class TreeController {

        constructor() {
            All.registerTreeCtrl(this);
        }

        passEvent(event : TreeEvent, elem : DisplayableElement) {
            var stack : DisplayableElement[] = [];
            stack.push(elem);

            while ( !(stack.length === 0) ) {
                var first : DisplayableElement = stack.shift();

                first.handleEvent(event);

                stack.concat(first.children());
            }
        }

    }
}
