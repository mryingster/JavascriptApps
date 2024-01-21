// Globals
let confetti_flakes = [];
let confetti_first_frame;
let confetti_last_frame;

function create_canvas(){
    let canvas = document.createElement("canvas");
    canvas.id = "confetti_canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style = "position:absolute; top:0px; left:0px; pointer-events:none;"
    document.body.appendChild(canvas);
    return canvas;
}

function clean_up(){
    document.getElementById("confetti_canvas").remove()
}

function confetti_loop(timestamp){
    if (confetti_last_frame == undefined) {
        confetti_first_frame = timestamp;
        confetti_last_frame = timestamp;
    }

    let elapsed = timestamp - confetti_last_frame;
    confetti_last_frame = timestamp;

    // Move
    for (let c of confetti_flakes)
        c.move(elapsed);

    // Render
    confetti_flakes[0].clear_canvas()
    for (let c of confetti_flakes)
        c.render();

    // Stop
    if (timestamp - confetti_first_frame >= 4000)
        clean_up()
    else
        window.requestAnimationFrame(confetti_loop);
}

function make_confetti(){
    let canvas = create_canvas();
    let ctx = canvas.getContext("2d");

    // Reset globals
    confetti_flakes = [];
    confetti_first_frame = undefined;
    confetti_last_frame = undefined;

    // Create confetti pieces
    for (let i=0; i<100; i++)
        confetti_flakes.push(new confetti(ctx))

    // Start animation
    window.requestAnimationFrame(confetti_loop);
}

class confetti{
    constructor(ctx){
        this.ctx = ctx;

        this.pos = {
            x: ctx.canvas.width  * .5,
            y: ctx.canvas.height * .25
        };

        this.color = this.random_color();

        this.speed = {
            x: Math.random() * 100 - 50,
            y: Math.random() * -1000// - 500
        };

        this.life = 0;

        this.flip_speed = Math.random() * 10 - 5;
        this.rotation_speed = Math.random() * 10 - 5;
    }

    move(ms){
        // Gravity
        this.speed.y += 9.8;

        // Wind resistance
        this.speed.x *= .99;

        // Move
        this.pos.x += this.speed.x * ms / 200;
        this.pos.y += this.speed.y * ms / 5000;

        // Keep track of life for alpha's sake
        this.life += ms;
        if (this.life > 2500)
            this.color.a -= ms * .001;
    }

    random_color(){
        let color = {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
            a: 1,
        }
        return color;
    }

    convert_color(){
        return "rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.color.a+")"
    }

    clear_canvas(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    render(){
        let width = 10;
        let height = 10 * Math.sin(this.flip_speed * this.life);

        this.ctx.save()
        this.ctx.translate(this.pos.x, this.pos.y);
        this.ctx.rotate(this.life * this.rotation_speed / 100);
        this.ctx.fillStyle = this.convert_color();
        this.ctx.fillRect(0 - width/2, 0 - height/2, width, height);
        this.ctx.restore();

        // Test - draw circles
        /*
          this.ctx.beginPath();
          this.ctx.moveTo(this.pos.x, this.pos.y);
          this.ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
          this.ctx.fillStyle = this.convert_color();
          this.ctx.fill();
        */
    }
}
