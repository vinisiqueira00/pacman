class Boundary {
    static width = 40;
    static height = 40;

    constructor({ position, image }, context) {
        this.context = context;

        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    
    draw() {
        this.context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
        );
    }
}

export default Boundary;