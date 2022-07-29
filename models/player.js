class Player {
    constructor({ position, velocity }, context) {
        this.context = context;

        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.08;
        this.rotation = 0;
    }

    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.rotation);
        this.context.translate(-this.position.x, -this.position.y);
        this.context.beginPath();
        this.context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            Math.PI * 2 - this.radians
        );
        this.context.lineTo(
            this.position.x,
            this.position.y
        )
        this.context.fillStyle = 'yellow';
        this.context.fill();
        this.context.closePath();
        this.context.restore();
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

export default Player;