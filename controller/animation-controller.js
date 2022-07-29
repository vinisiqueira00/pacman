import Boundary from "../models/boudary.js";

import GhostController from "./ghost-controller.js";
import KeyController from "./key-controller.js";
import MapController from "./map-controller.js";
import PlayerController from "./player-controller.js";

class AnimationController {
    score = 0;
    animationId = 0;
    scoreElement = document.querySelector('#score');

    constructor(canvas) {
        this.canvas = canvas;
        
        this.context = this.canvas.getContext('2d');

        const ghostController = new GhostController(this.context);
        const { ghosts } = ghostController.buildGhosts();
        this.ghosts = ghosts;

        const playerController = new PlayerController(this.context);
        const { player } = playerController.buildPlayer();
        this.player = player;

        const mapController = new MapController(this.context);
        const { pellets, boundaries, powerUps } = mapController.buildMap();
        this.pellets = pellets;
        this.boundaries = boundaries;
        this.powerUps = powerUps;

        this.keyController = new KeyController(this.context);
        this.keyController.events();
    }

    circleCollidesWithRectangle({ circle, rectangle }) {
        const padding = Boundary.width/2 - circle.radius - 1;
        
        return (
            circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
            circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
            circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
            circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
        )
    }

    buildPowerUps() {
        for (let i = this.powerUps.length - 1; 0 <= i; i--) {
            const powerUp = this.powerUps[i];

            powerUp.draw();

            if (
                Math.hypot(
                    powerUp.position.x - this.player.position.x,
                    powerUp.position.y - this.player.position.y,
                ) < powerUp.radius + this.player.radius
            ) {
                this.powerUps.splice(i, 1);

                this.ghosts.forEach(ghost => {
                    ghost.scared = true;

                    setTimeout(() => {
                        ghost.scared = false;
                    }, 5000);
                })
            }
        }
    }

    buildPellets() {
        for (let i = this.pellets.length - 1; 0 <= i; i--) {
            const pellet = this.pellets[i];
            
            pellet.draw();

            if (
                Math.hypot(
                    pellet.position.x - this.player.position.x,
                    pellet.position.y - this.player.position.y,
                ) < pellet.radius + this.player.radius
            ) {
                this.pellets.splice(i, 1);
                this.score += 1;
                this.scoreElement.innerHTML = this.score;
            }
        }
    }

    buildBoundaries() {
        this.boundaries.forEach(boundary => {
            boundary.draw();
            
            if (
                this.circleCollidesWithRectangle({
                    circle: this.player,
                    rectangle: {
                        ...boundary,
                        width: Boundary.width,
                        height: Boundary.height,
                    }
                })
            ) {
                this.player.velocity.x = 0;
                this.player.velocity.y = 0;
            }
        });
    }

    buildGhosts() {
        this.ghosts.forEach(ghost => {
            // Atualização do posicionamento
            ghost.update();

            // Verificação de colisão com os boudaries
            const collisions = [];
            this.boundaries.forEach(boundary => {
                if (
                    !collisions.includes('right') &&
                    this.circleCollidesWithRectangle({
                        circle: { ...ghost, velocity: {
                            x: ghost.speed,
                            y: 0,
                        }},
                        rectangle: boundary,
                    })
                ) collisions.push('right');

                if (
                    !collisions.includes('left') &&
                    this.circleCollidesWithRectangle({
                        circle: { ...ghost, velocity: {
                            x: -ghost.speed,
                            y: 0,
                        }},
                        rectangle: boundary,
                    })
                ) collisions.push('left');

                if (
                    !collisions.includes('top') &&
                    this.circleCollidesWithRectangle({
                        circle: { ...ghost, velocity: {
                            x: 0,
                            y: -ghost.speed,
                        }},
                        rectangle: boundary,
                    })
                ) collisions.push('top');

                if (
                    !collisions.includes('bottom') &&
                    this.circleCollidesWithRectangle({
                        circle: { ...ghost, velocity: {
                            x: 0,
                            y: ghost.speed,
                        }},
                        rectangle: boundary,
                    })
                ) collisions.push('bottom');
            });

            if (collisions.length > ghost.prevCollisions.length) {
                ghost.prevCollisions = collisions;
            }

            if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
                if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
                else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
                else if (ghost.velocity.y > 0) ghost.prevCollisions.push('bottom')
                else if (ghost.velocity.y < 0) ghost.prevCollisions.push('top')

                const pathways = ghost.prevCollisions.filter(collision => !collisions.includes(collision))

                const direction = pathways[Math.floor(
                    Math.random() * pathways.length
                )];

                switch(direction) {
                    case 'right':
                        ghost.velocity.x = ghost.speed;
                        ghost.velocity.y = 0;
                        break;
                    case 'left':
                        ghost.velocity.x = -ghost.speed;
                        ghost.velocity.y = 0;
                        break;
                    case 'bottom':
                        ghost.velocity.x = 0;
                        ghost.velocity.y = ghost.speed;
                        break;
                    case 'top':
                        ghost.velocity.x = 0;
                        ghost.velocity.y = -ghost.speed;
                        break;
                }

                ghost.prevCollisions = [];
            }
        });
    }

    controlRotationForDirection() {
        if (this.player.velocity.x > 0) this.player.rotation = 0;
        else if (this.player.velocity.x < 0) this.player.rotation = Math.PI;
        else if (this.player.velocity.y > 0) this.player.rotation = Math.PI/2;
        else if (this.player.velocity.y < 0) this.player.rotation = Math.PI * 1.5;
    }

    winCondition() {
        if (this.pellets.length === 0) {
            alert('Você ganhou!');
            cancelAnimationFrame(this.animationId);
        }
    }

    colisionPlayerGhost() {
        for (let i = this.ghosts.length - 1; 0 <= i; i--) {
            const ghost = this.ghosts[i];

            if (
                Math.hypot(
                    ghost.position.x - this.player.position.x,
                    ghost.position.y - this.player.position.y,
                ) < ghost.radius + this.player.radius
            ) {
                if (ghost.scared) {
                    this.ghosts.splice(i, 1);
                }
                else {
                    cancelAnimationFrame(this.animationId);
                    alert('Você perdeu!');
                }
            }
        }
    }

    playerMoviment() {
        if (this.keyController.pressed.w && this.keyController.lastKey == 'w') {
            for (let i = 0; i < this.boundaries.length; i++) {
                if (
                    this.circleCollidesWithRectangle({
                        circle: { ...this.player, velocity: {
                            x: 0,
                            y: -5,
                        }},
                        rectangle: {
                            ...this.boundaries[i],
                            width: Boundary.width,
                            height: Boundary.height,
                        }
                    })
                ) {
                    this.player.velocity.y = 0;
                    break;
                } else {
                    this.player.velocity.y = -5;
                }
            }
        }
        else if (this.keyController.pressed.a && this.keyController.lastKey == 'a') {
            for (let i = 0; i < this.boundaries.length; i++) {
                if (
                    this.circleCollidesWithRectangle({
                        circle: { ...this.player, velocity: {
                            x: -5,
                            y: 0,
                        }},
                        rectangle: {
                            ...this.boundaries[i],
                            width: Boundary.width,
                            height: Boundary.height,
                        }
                    })
                ) {
                    this.player.velocity.x = 0;
                    break;
                } else {
                    this.player.velocity.x = -5;
                }
            }
        }
        else if (this.keyController.pressed.s && this.keyController.lastKey == 's') {
            for (let i = 0; i < this.boundaries.length; i++) {
                if (
                    this.circleCollidesWithRectangle({
                        circle: { ...this.player, velocity: {
                            x: 0,
                            y: 5,
                        }},
                        rectangle: {
                            ...this.boundaries[i],
                            width: Boundary.width,
                            height: Boundary.height,
                        }
                    })
                ) {
                    this.player.velocity.y = 0;
                    break;
                } else {
                    this.player.velocity.y = 5;
                }
            }
        }
        else if (this.keyController.pressed.d && this.keyController.lastKey == 'd') {
            for (let i = 0; i < this.boundaries.length; i++) {
                if (
                    this.circleCollidesWithRectangle({
                        circle: { ...this.player, velocity: {
                            x: 5,
                            y: 0,
                        }},
                        rectangle: {
                            ...this.boundaries[i],
                            width: Boundary.width,
                            height: Boundary.height,
                        }
                    })
                ) {
                    this.player.velocity.x = 0;
                    break;
                } else {
                    this.player.velocity.x = 5;
                }
            }
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        // Limpeza do canvas para a renderização do próximo frame
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Controle do movimento do player
        this.playerMoviment();

        // Controle de colisão entre player e ghosts
        this.colisionPlayerGhost();

        // Condição de vitória
        this.winCondition();

        // Renderização dos power-ups e verificação de colisão do player com algum power-up
        this.buildPowerUps();

        // Renderização dos pellets e verificação de colisão do player com algum pellet
        this.buildPellets();

        // Renderização dos boundaries e verificação de colisão do player com algum boundary
        this.buildBoundaries();

        // Atualização dos ghosts
        this.buildGhosts()

        // Atualização do posicionamento do player
        this.player.update();

        // Rotação na posição do player conforme sua direção de movimento
        this.controlRotationForDirection();
    }
}

export default AnimationController;