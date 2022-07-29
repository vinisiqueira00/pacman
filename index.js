let score = 0;
const scoreElement = document.querySelector('#score');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

class Boundary {
    static width = 40;
    static height = 40;

    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    
    draw() {
        context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
        );
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.08;
        this.rotation = 0;
    }

    draw() {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.translate(-this.position.x, -this.position.y);
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            Math.PI * 2 - this.radians
        );
        context.lineTo(
            this.position.x,
            this.position.y
        )
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
        context.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate;
        }

        this.radians += this.openRate
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 8;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Ghost {
    static speed = 2;

    constructor({ position, velocity, color = 'ff0000' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = this.scared ? 'blue' : `#${this.color}`;
        context.fill();
        context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const ghosts = [
    new Ghost({
        position: {
            x: (6 * Boundary.width + Boundary.width/2),
            y: (1 * Boundary.height + Boundary.height/2),
        },
        velocity: {
            x: Ghost.speed,
            y: 0,
        },
    }),
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
    })
];
const pellets = [];
const boundaries = [];
const powerUps = [];
const player = new Player({
    position: {
        x: (Boundary.width + Boundary.width/2),
        y: (Boundary.height + Boundary.height/2),
    },
    velocity: {
        x: 0,
        y: 0,
    }
});

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

let lastKey = '';

const map = [
    ['1','-','-','-','-','-','-','-','-','d','-','-','-','-','-','-','-','-','2'],
    ['|','p','.','.','.','.','.','.','p','|','p','.','.','.','.','.','.','p','|'],
    ['|','.','x','y','.','x','-','y','.','h','.','x','-','y','.','x','y','.','|'],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],
    ['|','.','x','y','.','w','.','x','-','d','-','y','.','w','.','x','y','.','|'],
    ['|','.','.','.','.','|','.','.','.','|','.','.','.','|','.','.','.','.','|'],
    ['|','.','x','2','.','r','-','y','.','|','.','x','-','l','.','1','y','.','|'],
    ['|','.','.','|','.','|','.','.','.','|','.','.','.','|','.','|','.','.','|'],
    ['r','y','.','h','.','h','.','x','-','t','-','y','.','h','.','h','.','x','l'],
    ['|','p','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','p','|'],
    ['|','.','1','y','.','w','.','b','.','w','.','b','.','w','.','x','2','.','|'],
    ['|','.','|','.','.','|','.','.','.','|','.','.','.','|','.','.','|','.','|'],
    ['|','.','h','.','x','3','.','x','-','c','-','y','.','4','y','.','h','.','|'],
    ['|','.','.','.','.','.','.','.','.','|','.','.','.','.','.','.','.','.','|'],
    ['|','.','x','2','.','x','-','y','.','h','.','x','-','y','.','1','y','.','|'],
    ['|','.','.','|','.','.','.','.','.','.','.','.','.','.','.','|','.','.','|'],
    ['r','y','.','h','.','w','.','x','-','d','-','y','.','w','.','h','.','x','l'],
    ['|','.','.','.','.','|','p','.','.','|','.','.','p','|','.','.','.','.','|'],
    ['|','.','x','-','-','t','-','y','.','h','.','x','-','t','-','-','y','.','|'],
    ['|','p','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','p','|'],
    ['4','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','3'],
];

function createImage(src) {
    const image = new Image();
    image.src = src;

    return image;
}

map.forEach((row, yIdx) => {
    row.forEach((symbol, xIdx) => {
        if (symbol == '-') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeHorizontal.png'),
                })
            );
        }

        if (symbol == '|') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeVertical.png'),
                })
            );
        }

        if (symbol == '1') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeCorner1.png'),
                })
            );
        }

        if (symbol == '2') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeCorner2.png'),
                })
            );
        }

        if (symbol == '3') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeCorner3.png'),
                })
            );
        }

        if (symbol == '4') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeCorner4.png'),
                })
            );
        }

        if (symbol == 'b') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/block.png'),
                })
            );
        }

        if (symbol == 'd') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeConnectorBottom.png'),
                })
            );
        }

        if (symbol == 'l') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeConnectorLeft.png'),
                })
            );
        }

        if (symbol == 'r') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeConnectorRight.png'),
                })
            );
        }

        if (symbol == 't') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeConnectorTop.png'),
                })
            );
        }

        if (symbol == 'x') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/capLeft.png'),
                })
            );
        }

        if (symbol == 'y') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/capRight.png'),
                })
            );
        }

        if (symbol == 'w') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/capTop.png'),
                })
            );
        }

        if (symbol == 'h') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/capBottom.png'),
                })
            );
        }

        if (symbol == 'c') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: xIdx * Boundary.width,
                        y: yIdx * Boundary.height,
                    },
                    image: createImage('./assets/pipeCross.png'),
                })
            );
        }

        if (symbol == '.') {
            pellets.push(
                new Pellet({
                    position: {
                        x: xIdx * Boundary.width + Boundary.width/2,
                        y: yIdx * Boundary.height + Boundary.height/2,
                    },
                })
            );
        }

        if (symbol == 'p') {
            powerUps.push(
                new PowerUp({
                    position: {
                        x: xIdx * Boundary.width + Boundary.width/2,
                        y: yIdx * Boundary.height + Boundary.height/2,
                    },
                })
            );
        }
    });
});

function circleCollidesWithRectangle({ circle, rectangle }) {
    const padding = Boundary.width/2 - circle.radius - 1;
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (keys.w.pressed && lastKey == 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            if (
                circleCollidesWithRectangle({
                    circle: { ...player, velocity: {
                        x: 0,
                        y: -5,
                    }},
                    rectangle: {
                        ...boundaries[i],
                        width: Boundary.width,
                        height: Boundary.height,
                    }
                })
            ) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -5;
            }
        }
    }
    else if (keys.a.pressed && lastKey == 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            if (
                circleCollidesWithRectangle({
                    circle: { ...player, velocity: {
                        x: -5,
                        y: 0,
                    }},
                    rectangle: {
                        ...boundaries[i],
                        width: Boundary.width,
                        height: Boundary.height,
                    }
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -5;
            }
        }
    }
    else if (keys.s.pressed && lastKey == 's') {
        for (let i = 0; i < boundaries.length; i++) {
            if (
                circleCollidesWithRectangle({
                    circle: { ...player, velocity: {
                        x: 0,
                        y: 5,
                    }},
                    rectangle: {
                        ...boundaries[i],
                        width: Boundary.width,
                        height: Boundary.height,
                    }
                })
            ) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = 5;
            }
        }
    }
    else if (keys.d.pressed && lastKey == 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            if (
                circleCollidesWithRectangle({
                    circle: { ...player, velocity: {
                        x: 5,
                        y: 0,
                    }},
                    rectangle: {
                        ...boundaries[i],
                        width: Boundary.width,
                        height: Boundary.height,
                    }
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = 5;
            }
        }
    }

    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i];

        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y,
            ) < ghost.radius + player.radius
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1);
            }
            else {
                cancelAnimationFrame(animationId);
                alert('Você perdeu!');
            }
        }
    }

    if (pellets.length === 0) {
        alert('Você ganhou!');
        cancelAnimationFrame(animationId);
    }

    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i];

        powerUp.draw();

        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y,
            ) < powerUp.radius + player.radius
        ) {
            powerUps.splice(i, 1);

            ghosts.forEach(ghost => {
                ghost.scared = true;

                setTimeout(() => {
                    ghost.scared = false;
                }, 5000);
            })
        }
    }

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        
        pellet.draw();

        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y,
            ) < pellet.radius + player.radius
        ) {
            pellets.splice(i, 1);
            score += 1;
            scoreElement.innerHTML = score;
        }
    }

    boundaries.forEach(boundary => {
        boundary.draw();
        
        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: {
                    ...boundary,
                    width: Boundary.width,
                    height: Boundary.height,
                }
            })
        ) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    ghosts.forEach(ghost => {
        ghost.update();

        const collisions = [];
        boundaries.forEach(boundary => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: {
                        x: ghost.speed,
                        y: 0,
                    }},
                    rectangle: boundary,
                })
            ) collisions.push('right');

            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: {
                        x: -ghost.speed,
                        y: 0,
                    }},
                    rectangle: boundary,
                })
            ) collisions.push('left');

            if (
                !collisions.includes('top') &&
                circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: {
                        x: 0,
                        y: -ghost.speed,
                    }},
                    rectangle: boundary,
                })
            ) collisions.push('top');

            if (
                !collisions.includes('bottom') &&
                circleCollidesWithRectangle({
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

    player.update();

    // player.velocity.x = 0;
    // player.velocity.y = 0;

    if (player.velocity.x > 0) player.rotation = 0;
    else if (player.velocity.x < 0) player.rotation = Math.PI;
    else if (player.velocity.y > 0) player.rotation = Math.PI/2;
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}

animate();

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w': keys.w.pressed = true; lastKey = 'w'; break;
        case 'a': keys.a.pressed = true; lastKey = 'a'; break;
        case 's': keys.s.pressed = true; lastKey = 's'; break;
        case 'd': keys.d.pressed = true; lastKey = 'd'; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w': keys.w.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
        case 's': keys.s.pressed = false; break;
        case 'd': keys.d.pressed = false; break;
    }
});