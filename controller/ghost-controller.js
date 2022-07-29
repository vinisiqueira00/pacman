import Ghost from "../models/ghost.js";
import Boundary from "../models/boudary.js";

class GhostController {
    constructor(context) {
        this.context = context;
    }

    buildGhosts() {
        const ghosts = [];

        ghosts.push(
            new Ghost({
                position: {
                    x: (2 * Boundary.width + Boundary.width/2),
                    y: (1 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: -Ghost.speed,
                    y: 0,
                },
                color: 'ff0000',
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (3 * Boundary.width + Boundary.width/2),
                    y: (5 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: Ghost.speed,
                    y: 0,
                },
                color: 'ff00ff'
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (6 * Boundary.width + Boundary.width/2),
                    y: (10 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: 0,
                    y: Ghost.speed,
                },
                color: 'fa9b3a'
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (17 * Boundary.width + Boundary.width/2),
                    y: (19 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: 0,
                    y: -Ghost.speed,
                },
                color: '198ba8'
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (3 * Boundary.width + Boundary.width/2),
                    y: (17 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: Ghost.speed,
                    y: 0,
                },
                color: 'baf9a5'
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (17 * Boundary.width + Boundary.width/2),
                    y: (5 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: -Ghost.speed,
                    y: 0,
                },
                color: 'da65f1'
            }, this.context)
        );

        ghosts.push(
            new Ghost({
                position: {
                    x: (12 * Boundary.width + Boundary.width/2),
                    y: (15 * Boundary.height + Boundary.height/2),
                },
                velocity: {
                    x: Ghost.speed,
                    y: 0,
                },
                color: '0fff56'
            }, this.context)
        );

        return { ghosts };
    }
}

export default GhostController;