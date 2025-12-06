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

        for (const pill of pills)
            pill.move(elapsed);

	// Paddle Lights
	paddle.pulse(elapsed);

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

        // Remove pills
        for (let i=0; i<pills.length; i++) {
            if (pills[i].remove == true) {
                pills.splice(i, 1);
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
	if (level_cleared()) {
	    advance_level();
	}

        // Render
        clear_context(ctx_shadow);
        clear_context(ctx_dynamic);

	draw_frame_shadow(ctx_shadow);

        for (const pill of pills)
	    pill.render();

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

function level_cleared() {
    for (let brick of bricks)
	if (brick.type > 0)
	    return false;
    return true;
}

function advance_level() {
    level++;
    populate_level(level);
    paddle.reset();
    reset_ball();
    pills = [];

    document.getElementById("canvases").style = `background: radial-gradient( circle at 50%, #000, ${["#f00", "#00f", "#0f0"][level % 3]})`;

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
    paddle.reset();

    lives = 5;
    level = 0;

    // Set up level information
    advance_level();

    // TEST
    // pills.push(new Pill(ctx_dynamic, ctx_shadow,  50, 500, pill_types[0]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 100, 480, pill_types[1]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 150, 460, pill_types[2]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 200, 440, pill_types[3]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 250, 420, pill_types[4]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 300, 400, pill_types[5]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 350, 380, pill_types[6]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 400, 360, pill_types[7]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 450, 340, pill_types[8]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 500, 320, pill_types[9]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 550, 300, pill_types[10]));
    // pills.push(new Pill(ctx_dynamic, ctx_shadow, 600, 280, pill_types[11]));

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
let particles = [];

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
    },
    paddle: {
	width: 1/7,
	height: 1/28,
	side_width: 1/45,
	middle_width: 1/10,
    },
    pill: {
        radius: 1/112,
    }
}

let sizes = {};

let active;
let level;
let bricks;
let pills;
let paddle;
let balls;
let paused;
let lives;

let mouse_down = false;
let touch_start = false;
let touch_end;

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
	    radius: size_ratios.ball.diameter * width / 2,
	},
	shadow_offset: {
	    vertical: 12,
	    horizontal: 12,
	},
	paddle: {
	    width: size_ratios.paddle.width * width,
	    height: size_ratios.paddle.height * width,
	    side_width: size_ratios.paddle.side_width * width,
	    middle_width: size_ratios.paddle.middle_width * width,
	},
        pill: {
	    width: size_ratios.brick.width * width,
	    height: size_ratios.brick.height * width,
	    edge: size_ratios.brick.edge * width,
	    radius: size_ratios.pill.radius * width,
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

    // Input Listeners
    canvas_overlay.addEventListener('touchstart', function(e) {
        e.preventDefault();
	touch_start = getTouchPosition(e);
    });

    canvas_overlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
	touch_end = getTouchPosition(e);
        paddle.move(touch_end.x);
    });

    canvas_overlay.addEventListener('touchend', function(e) {
        e.preventDefault();
	if (touch_start == false) return;

	const distance = Math.abs(Math.hypot(touch_start.x - touch_end.x, touch_start.y - touch_end.y));
	if (distance < 50 || touch_end == false)
	    for (let ball of balls)
		ball.is_caught = false;

	touch_start = false;
	touch_end = false;
    });

    canvas_overlay.addEventListener('mousedown', function(e) {
	mouse_down = getCursorPosition(canvas_overlay, e);
    });

    canvas_overlay.addEventListener('mousemove', function(e) {
        paddle.move(getCursorPosition(canvas_overlay, e).x);
    });

    canvas_overlay.addEventListener('mouseup', function(e) {
	if (mouse_down == false) return;

	const pos = getCursorPosition(canvas_overlay, e);
	const distance = Math.abs(Math.hypot(mouse_down.x - pos.x, mouse_down.y - pos.y));
	if (distance < 10)
	    for (let ball of balls)
		ball.is_caught = false;

	mouse_down = false;
    });

    document.getElementById("pause").onclick = function(e) {
        paused = !paused;
    }
    document.getElementById("newgame").onclick = function(e) {
        new_game();
    }

    // Calculate sizes
    resize(canvas_overlay);

    // Define paddle
    paddle = new Paddle(ctx_dynamic, ctx_shadow);
}

window.onload = function() {
    firstLoad();
};
