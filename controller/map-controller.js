import Map from '../models/map.js';
import Boundary from '../models/boudary.js';
import Pellet from '../models/pellet.js';
import PowerUp from '../models/power-up.js';

class MapController {
    constructor(context) {
        this.context = context;

        const map = new Map();
        this.map = map.map;
    }

    createImage(src) {
        const image = new Image();
        image.src = src;
    
        return image;
    }

    buildMap() {
        const pellets = [];
        const boundaries = [];
        const powerUps = [];

        this.map.forEach((row, yIdx) => {
            row.forEach((symbol, xIdx) => {
                if (symbol == '-') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeHorizontal.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '|') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeVertical.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '1') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeCorner1.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '2') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeCorner2.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '3') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeCorner3.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '4') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeCorner4.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'b') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/block.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'd') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeConnectorBottom.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'l') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeConnectorLeft.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'r') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeConnectorRight.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 't') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeConnectorTop.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'x') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/capLeft.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'y') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/capRight.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'w') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/capTop.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'h') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/capBottom.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == 'c') {
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: xIdx * Boundary.width,
                                y: yIdx * Boundary.height,
                            },
                            image: this.createImage('./assets/pipeCross.png'),
                        }, this.context)
                    );
                }
        
                if (symbol == '.') {
                    pellets.push(
                        new Pellet({
                            position: {
                                x: xIdx * Boundary.width + Boundary.width/2,
                                y: yIdx * Boundary.height + Boundary.height/2,
                            },
                        }, this.context)
                    );
                }
        
                if (symbol == 'p') {
                    powerUps.push(
                        new PowerUp({
                            position: {
                                x: xIdx * Boundary.width + Boundary.width/2,
                                y: yIdx * Boundary.height + Boundary.height/2,
                            },
                        }, this.context)
                    );
                }
            });
        });

        return {
            pellets,
            boundaries,
            powerUps,
        }
    }
}

export default MapController;