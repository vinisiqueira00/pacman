class PowerUp {
    constructor({ position }, context) {
        this.context = context;

        this.position = position;
        this.radius = 8;
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
        this.context.fillStyle = 'white';
        this.context.fill();
        this.context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export default PowerUp;