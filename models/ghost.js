class Ghost {
    static speed = 2;

    constructor({ position, velocity, color = 'ff0000' }, context) {
        this.context = context;

        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        this.context.fillStyle = this.scared ? 'blue' : `#${this.color}`;
        this.context.fill();
        this.context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export default Ghost;