function main_loop(timestamp) {
    // Detrmine how many MS it's been
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    const elapsed = timestamp - last_frame;
    last_frame = timestamp;

    if (!paused) {
        // Do all the movements
        for (const ball of balls)
            ball.move(elapsed);

        // Remove bricks
        for (let i=0; i<bricks.length; i++) {
            if (bricks[i].hits == 0) {
                bricks.splice(i, 1);
                i--;
            }
        }

        // Remove balls
        for (let i=0; i<balls.length; i++) {
            if (balls[i].remove == true) {
                balls.splice(i, 1);
                i--;
            }
        }

        // No balls on screen? Lose a life and reset
	if (balls.length <= 0) {
	    lives--;
	    if (lives < 0) {
		game_over();
		return;
	    }
	    reset_ball();
	}

	// Check if level cleared
	

        // Render
        clear_context(ctx_shadow);
        clear_context(ctx_dynamic);

	draw_frame_shadow(ctx_shadow);

        for (const ball of balls)
            ball.render();

        for (const brick of bricks)
	    brick.render();

        paddle.render();
    }

    // Call next loop
    window.requestAnimationFrame((t) => main_loop(t));
}

function game_over() {
    active = false;
    return;
}

function populate_level(l) {
    bricks = []
    for (let y = 0; y<levels[l].length; y++)
        for (let x = 0; x<levels[l][y].length; x++)
	    if (levels[l][y][x] > -1)
		bricks.push(new Brick(ctx_dynamic, ctx_shadow, x, y, brick_types[levels[l][y][x]]));
}

function new_game() {
    if (active) return;

    active = true;

    // Move paddle to default position
    paddle.reset()

    lives = 5;

    // Set up level information
    populate_level(0)

    // Set up ball
    reset_ball();

    pause = false;

    // Start loop
    main_loop();
}

function getTouchPosition(event) {
    if (!e)
        var e = event;

    var x = null;
    var y = null;

    if(e.touches[0]) {
        var touch = e.touches[0];
        x = touch.pageX-touch.target.offsetLeft;
        y = touch.pageY-touch.target.offsetTop;

        return {x:x, y:y};
    }

    return -1;
}

// Mouse Listeners
function getCursorPosition(canvas, event) {
    // Determine where clicked
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //document.getElementById("coords").innerHTML = x + ", " + y;

    return {x:x, y:y};
}

let canvas_dynamic;
let ctx_dynamic;

let canvas_static;
let ctx_static;

let canvas_background;
let ctx_background;

let width;
let height;

const size_ratios = {
    frame: {
	left: 1/28,
	right: 1/28,
	top: 1/28,
    },
    brick: {
	width: 1/14,
	height: 1/28,
	edge: 1/224,
	chisel: 1/56,
    },
    ball: {
	diameter: 1/56,
    }
}

let sizes = {};

let active;
let bricks;
let pills;
let paddle;
let balls;
let paused;
let lives;

let last_frame;

function resize(canvas) {
    width = canvas.width;
    height = canvas.height;

    sizes = {
	canvas: {
	    width: canvas.width,
	    height: canvas.height,
	},
	frame: {
	    left: size_ratios.frame.left * width,
	    right: size_ratios.frame.right * width,
	    top: size_ratios.frame.top * width,
	},
	arena: {
	    left: size_ratios.frame.left * width,
	    right: width - (size_ratios.frame.left * width),
	    top: size_ratios.frame.top * width,
	    top_space: size_ratios.brick.height * width * 3,
	    bottom: height,
	},
	brick: {
	    width: size_ratios.brick.width * width,
	    height: size_ratios.brick.height * width,
	    edge: size_ratios.brick.edge * width,
	    chisel: size_ratios.brick.chisel * width,
	},
	ball: {
	    diameter: size_ratios.ball.diameter * width,
	},
	shadow_offset: {
	    vertical: 12,
	    horizontal: 12,
	},
    }
}

function firstLoad() {
    // Define Canvases
    canvas_dynamic = document.getElementById('canvas_dynamic')
    ctx_dynamic = canvas_dynamic.getContext("2d");

    canvas_shadow = document.getElementById('canvas_shadow')
    ctx_shadow = canvas_shadow.getContext("2d");

    canvas_background = document.getElementById('canvas_background')
    ctx_background = canvas_background.getContext("2d");

    canvas_overlay = document.getElementById('canvas_overlay')

    // Define paddle
    paddle = new Paddle(ctx_dynamic, ctx_shadow);

    // Input Listeners
    canvas_overlay.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });

    canvas_overlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
        paddle.move(getTouchPosition(e).x);
    });

    canvas_overlay.addEventListener('touchend', function(e) {
        e.preventDefault();
    });

    canvas_overlay.addEventListener('mousedown', function(e) {
    });

    canvas_overlay.addEventListener('mousemove', function(e) {
        paddle.move(getCursorPosition(canvas_overlay, e).x);
    });

    canvas_overlay.addEventListener('mouseup', function(e) {
    });

    document.getElementById("pause").onclick = function(e) {
        paused = !paused;
    }
    document.getElementById("newgame").onclick = function(e) {
        new_game();
    }

    // Calculate sizes
    resize(canvas_overlay);
}

window.onload = function() {
    firstLoad();
};
