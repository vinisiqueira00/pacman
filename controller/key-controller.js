class KeyController {
    pressed = {
        w: false,
        a: false,
        s: false,
        d: false,
    }

    lastKey = '';

    constructor(context) {
        this.context = context;
    }

    events() {
        window.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'w': this.pressed.w = true; this.lastKey = 'w'; break;
                case 'a': this.pressed.a = true; this.lastKey = 'a'; break;
                case 's': this.pressed.s = true; this.lastKey = 's'; break;
                case 'd': this.pressed.d = true; this.lastKey = 'd'; break;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'w': this.pressed.w = false; break;
                case 'a': this.pressed.a = false; break;
                case 's': this.pressed.s = false; break;
                case 'd': this.pressed.d = false; break;
            }
        });
    }
}

export default KeyController;