function main_loop(timestamp, refresh=false) {
    // Detrmine how many MS it's been
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    const elapsed = timestamp - last_frame;
    last_frame = timestamp;

    if (!paused) {
        // Do all the movements
        paddle.move(elapsed);

        for (const pill of pills)
            pill.move(elapsed);

	for (const laser of lasers)
	    laser.move(elapsed);

	for (const brick of bricks)
	    brick.move(elapsed);

	// Paddle Lights
	paddle.pulse(elapsed);

        // Remove bricks
	for (const ball of balls) {
            ball.move(elapsed);
            for (let i=0; i<bricks.length; i++) {
		if (bricks[i].remove == true) {
		    score += bricks[i].value;
                    bricks.splice(i, 1);
                    i--;
                    refresh = true;
		}
	    }
        }

        // Remove balls
        for (let i=0; i<balls.length; i++) {
            if (balls[i].remove == true) {
                balls.splice(i, 1);
                i--;
            }
        }

	// Remove lasers
        for (let i=0; i<lasers.length; i++) {
            if (lasers[i].remove == true) {
                lasers.splice(i, 1);
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

	// Do Powerup things
	switch(current_powerup) {
	case PU_SLOW:
	    for (let ball of balls) ball.slow();
	    current_powerup = PU_NONE;
	    break;
	case PU_DISRUPT:
	    disrupt_ball();
	    current_powerup = PU_NONE;
	    break;
	case PU_PLAYER:
	    add_life();
	    current_powerup = PU_NONE;
	    break;
	}

	// New Disrupt
	if (current_powerup == PU_NEW_DISRUPT) {
	    while (balls.length < 3) {
		// if all the balls are beneath the paddle... don't
		let bother = false;
		for (let ball of balls)
		    if (ball.pos.y < paddle.pos.y)
			bother = true;
		if (bother === true)
		    duplicate_ball();
		else
		    break;
	    }
	}

        // No balls on screen? Lose a life and reset
	if (balls.length <= 0) {
	    lives--;
	    paddle.explode();
	    reset_pills();
	    reset_powerups();
	    reset_ball();
	}

	// End game once no lives left, and animations are complete
	if (lives < 0 && paddle.exploding == false) {
	    game_over();
	    return;
	}

	// Check if level cleared
	if (level_cleared()) {
	    advance_level();
            return;
	}

        // Render bricks only when necessary
        if (refresh) {
            clear_context(ctx_shadow_static);
            clear_context(ctx_bricks);

	    draw_frame_shadow(ctx_shadow_static);

            for (const brick of bricks)
	        brick.render();
        }

        // Render Dynamic Things every frame
        clear_context(ctx_dynamic);
        clear_context(ctx_shadow_dynamic);

        for (const brick of bricks)
	    brick.renderShimmer();

	for (const laser of lasers)
	    laser.render();

        for (const pill of pills)
	    pill.render();

        for (const ball of balls)
	    if (!paddle.exploding)
		ball.render();

        paddle.render();

	document.getElementById("score").innerHTML = score;
    }

    // Call next loop
    window.requestAnimationFrame((t) => main_loop(t));
}

function game_over() {
    active = false;
    sounds[GAME_END].play();
    showModal("Game over!");
    return;
}

function level_cleared() {
    for (let brick of bricks)
	if (brick.permanent == false)
	    return false;
    return true;
}

function drop_pill(x, y) {
    pills.push(
        new Pill(
            ctx_dynamic,
            ctx_shadow_dynamic,
            x,
            y,
            pill_types[Math.floor(Math.random() * pill_types.length)]
        )
    );
}

function duplicate_ball() {
    if (balls.length == 0)
	return;

    let new_v = {
	x: balls[0].v.x + (Math.random() * 24) - 12, // Not great, but okay...
	y: balls[0].v.y,
	s: balls[0].v.s,
    };

    balls.push(new Ball(
	balls[0].ctx,
	balls[0].ctx_shadow,
	false,
	balls[0].pos,
	new_v,
    ));
}

function disrupt_ball(n=3) {
    while (balls.length < n)
	duplicate_ball()
}

function advance_level(n=null) {
    level++;
    if (n !== null)
	level = n;

    document.getElementById("level").innerHTML = level;

    // Show modal for now to select level?
    let levelIndicies = []
    for (let i=0; i<levels.length; i++)
	if (levels[i].level == level)
            levelIndicies.push(i);

    showLevelSelection(level, levelIndicies);

    paddle.reset();
    reset_ball();
    reset_pills();
    reset_powerups();
    reset_lasers();
}

function add_life() {
    lives++;
    document.getElementById("lives").innerHTML = lives;
}

function populate_level(l) {
    document.getElementById("canvases").style = `background: radial-gradient( circle at 50%, #000, ${l.background})`;
    bricks = []
    for (let y = 0; y<l.bricks.length; y++)
        for (let x = 0; x<l.bricks[y].length; x++) {
	    const brick_type = l.bricks[y][x];
	    if (brick_type in brick_types)
		bricks.push(new Brick(ctx_bricks, ctx_dynamic, ctx_shadow_static, ctx_shadow_dynamic, x, y, brick_types[brick_type]));
	}

    // Start with a shimmer
    for (let brick of bricks)
	brick.start_shimmer();

    // Sounds!
    sounds[STAGE_START].play();

    // Start loop
    main_loop(undefined, true);
}

function toggle_pause() {
    paused = !paused;

    clear_context(ctx_overlay);
    if (paused) {
	overlay_message("Paused");
    }
}

function overlay_message(m) {
    ctx_overlay.fillStyle = "rgba(0, 0, 0, .5)";
    ctx_overlay.fillRect(0, 0, canvas_overlay.width, canvas_overlay.height);

    ctx_overlay.font = "bold 32px Arial";
    ctx_overlay.textAlign = "center";
    ctx_overlay.lineWidth = 5;
    ctx_overlay.fillStyle = "#fff";
    ctx_overlay.fillText(m, canvas_overlay.width / 2, canvas_overlay.height / 2);

}

function new_game(continued=false, demo=null) {
    if (active) return;

    active = true;

    // Move paddle to default position
    paddle.reset();

    lives = 5;
    if (continued === false)
	level = 1;
    score = 0;

    // Set up ball
    lives--;
    reset_ball();
    reset_pills();
    reset_lasers();

    // Set up level information
    if (demo == null)
	advance_level(level);
    else
	populate_level(demo);

    paused = false;
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

let canvas_bricks;
let ctx_bricks;

let canvas_shadow;
let ctx_shadow;

let canvas_background;
let ctx_background;

let canvas_overlay;
let ctx_overlay;

let width;
let height;

const PU_NONE        = 0;
const PU_SLOW        = 1;
const PU_CATCH	     = 2;
const PU_EXPAND	     = 3;
const PU_DISRUPT     = 4;
const PU_LASER	     = 5;
const PU_BREAK	     = 6;
const PU_PLAYER	     = 7;
const PU_TWIN	     = 8;
const PU_MEGABALL    = 9;
const PU_ILLUSION    = 10;
const PU_REDUCE	     = 11;
const PU_NEW_DISRUPT = 12;

const size_ratios = {
    arena : {
	width: 1,
	height: 15/14,
    }, // 224 x 240
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
	reduced_width: 1/14,
	width: 1/7,
	expanded_width: 3/14,
	height: 1/28,
	side_width: 1/45,
	middle_width: 1/10,
	ypos: 232/240,
    },
    pill: {
        radius: 1/112,
    },
    laser: {
	width: 1/75,
	height: 1/32,
	spacing: 1/17,
    },
    controller: {
	width: 1/7,
	height: 1/14,
	ypos: 31/28,
    },
}

let sizes = {};

let active = false;;
let score;
let level;
let bricks;
let pills;
let paddle;
let balls;
let paused;
let lives;
let lasers;
let sounds = [];
let MUTED = false;
let current_powerup = PU_NONE;

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
	    bottom: size_ratios.arena.height * width,
	    height: size_ratios.arena.height * width,
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
	    reduced_width: size_ratios.paddle.reduced_width * width,
	    width: size_ratios.paddle.width * width,
	    expanded_width: size_ratios.paddle.expanded_width * width,
	    height: size_ratios.paddle.height * width,
	    side_width: size_ratios.paddle.side_width * width,
	    middle_width: size_ratios.paddle.middle_width * width,
	    ypos: size_ratios.paddle.ypos * width,
	},
        pill: {
	    width: size_ratios.brick.width * width,
	    height: size_ratios.brick.height * width,
	    edge: size_ratios.brick.edge * width,
	    radius: size_ratios.pill.radius * width,
        },
	laser: {
	    width: size_ratios.laser.width * width,
	    height: size_ratios.laser.height * width,
	    spacing: size_ratios.laser.spacing * width,
	},
	controller: {
	    width: size_ratios.controller.width * width,
	    height: size_ratios.controller.height * width,
	    ypos: size_ratios.controller.ypos * width,
	},
    }
}

function firstLoad() {
    // Define Canvases
    canvas_dynamic = document.getElementById('canvas_dynamic')
    ctx_dynamic = canvas_dynamic.getContext("2d");

    canvas_bricks = document.getElementById('canvas_bricks')
    ctx_bricks = canvas_bricks.getContext("2d");

    canvas_shadow = document.getElementById('canvas_shadow_dynamic')
    ctx_shadow_dynamic = canvas_shadow.getContext("2d");

    canvas_shadow = document.getElementById('canvas_shadow_static')
    ctx_shadow_static = canvas_shadow.getContext("2d");

    canvas_background = document.getElementById('canvas_background')
    ctx_background = canvas_background.getContext("2d");

    canvas_overlay = document.getElementById('canvas_overlay')
    ctx_overlay = canvas_overlay.getContext("2d");

    // Load Sound Effects
    for (let sound_definition of SOUND_DEFINITIONS)
        sounds.push(new SOUND(sound_definition));

    if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1)
        MUTED = true;

    // Input Listeners
    canvas_overlay.addEventListener('touchstart', function(e) {
        e.preventDefault();
	touch_start = getTouchPosition(e);

	if (current_powerup == PU_LASER) {
            if (lasers.length < 3) {
                sounds[LASER_FIRE].play();
	        lasers.push(new Laser(ctx_dynamic, ctx_shadow_dynamic, paddle.pos.x, paddle.pos.y));
            }
	}
    });

    canvas_overlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
	touch_end = getTouchPosition(e);
        paddle.set_pos(touch_end.x);
    });

    canvas_overlay.addEventListener('touchend', function(e) {
        e.preventDefault();
	if (touch_start == false) return;

	// If game is inactive, lets make this start a new game
	if (active === false) {
	    new_game();

	} else {
	    // If game is active, split the screen into two halves
	    if ( touch_end.y < canvas_overlay.height / 2) {
		toggle_pause();
	    } else {
		//this is going to be a click for releasing the ball
		const distance = Math.abs(Math.hypot(touch_start.x - touch_end.x, touch_start.y - touch_end.y));
		if (distance < 50 || touch_end == false)
		    for (let ball of balls)
			ball.is_caught = false;
	    }
	}

	touch_start = false;
	touch_end = false;
    });

    canvas_overlay.addEventListener('mousedown', function(e) {
	mouse_down = getCursorPosition(canvas_overlay, e);

	if (current_powerup == PU_LASER) {
            if (lasers.length < 3) {
                sounds[LASER_FIRE].play();
	        lasers.push(new Laser(ctx_dynamic, ctx_shadow_dynamic, paddle.pos.x, paddle.pos.y));
	    }
        }
    });

    canvas_overlay.addEventListener('mousemove', function(e) {
        paddle.set_pos(getCursorPosition(canvas_overlay, e).x);
    });

    canvas_overlay.addEventListener('mouseup', function(e) {
	if (mouse_down == false) return;
	const pos = getCursorPosition(canvas_overlay, e);

	// If game is inactive, lets make this start a new game
	if (active === false) {
	    new_game();

	} else {
	    // If game is active, split the screen into two halves
	    if ( pos.y < canvas_overlay.height / 2) {
		toggle_pause();
	    } else {
		//this is going to be a click for releasing the ball
		const distance = Math.abs(Math.hypot(mouse_down.x - pos.x, mouse_down.y - pos.y));
		if (distance < 10)
		    for (let ball of balls)
			ball.is_caught = false;
	    }
	}

	mouse_down = false;
    });

    // Calculate sizes
    resize(canvas_overlay);

    draw_frame_shadow(ctx_shadow_static);

    // Define paddle
    paddle = new Paddle(ctx_dynamic, ctx_shadow_dynamic);

    // Look for editor input from menu bar
    let demo_level_encoded = window.location.href.split('?')[1];
    if (demo_level_encoded) {
        let demo_level = JSON.parse(atob(demo_level_encoded));
	console.log(demo_level);
	new_game(false, demo_level);
    }
}

window.onload = function() {
    firstLoad();
};
