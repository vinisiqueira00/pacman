import Player from "../models/player.js";
import Boundary from "../models/boudary.js";

class PlayerController {
    constructor(context) {
        this.context = context;
    }

    buildPlayer() {
        const player = new Player({
            position: {
                x: (9 * Boundary.width + Boundary.width/2),
                y: (3 * Boundary.height + Boundary.height/2),
            },
            velocity: {
                x: 0,
                y: 0,
            }
        }, this.context);

        return { player }
    }
}

export default PlayerController;