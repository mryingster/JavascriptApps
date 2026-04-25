function main_loop(timestamp, refresh=false) {
    // Detrmine how many MS it's been
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    let elapsed = timestamp - last_frame;
    if (isNaN(elapsed))
	elapsed = 0;
    last_frame = timestamp;

    // TODO If elapsed is too long, do nothing?
    if (elapsed > 1000) {
	window.requestAnimationFrame((t) => main_loop(t));
	return
    }

    if (input_timeout > 0) {
        if (!isNaN(elapsed)) {
            input_timeout -= elapsed;
            if (input_timeout <= 0) {
                supress_input = false;
            }
        }
    }

    if (!paused) {
        // Do all the movements
        paddle.move(elapsed);

        for (const pill of pills)
            pill.move(elapsed);

	for (const laser of lasers)
	    laser.move(elapsed);

	for (const enemy of enemies)
	    enemy.move(elapsed);

	for (const brick of bricks)
	    brick.move(elapsed);

	// Paddle Lights
	paddle.pulse(elapsed);

        // Remove bricks
	for (const ball of balls) {
            ball.move(elapsed);
            for (let i=0; i<bricks.length; i++) {
		if (bricks[i].remove == true) {
		    if (bricks[i].type == 1)
			// Silvers get 50 * level/stage number
			update_score(bricks[i].value * level);
		    else
			update_score(bricks[i].value);

                    // Remove Brick
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

        // Remove enemies
        for (let i=0; i<enemies.length; i++) {
            if (enemies[i].remove == true) {
                enemies.splice(i, 1);
                i--;
		next_enemy = Math.random() * 10000;
            }
        }

	// Add enemies
	if (enemies.length < max_enemies) {
	    next_enemy -= elapsed;
	    if (next_enemy <= 0) {
		add_enemy(enemy_type);
		next_enemy = Math.random() * 10000;
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
	if (balls.length <= 0 && paddle.animate_break == false) {
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
            // Clear the level befor bringup dialogue
            clear_context(ctx_shadow_static);
            clear_context(ctx_bricks);
            clear_context(ctx_dynamic);
            clear_context(ctx_shadow_dynamic);

            // Stop canvas input
            supress_input = true;

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

	for (const enemy of enemies)
	    enemy.render();

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
    }

    // Call next loop
    window.requestAnimationFrame((t) => main_loop(t));
}

function game_over() {
    active = false;
    play_sound("GAME_END");
    check_high_score(score);
    showModal("Game over!");
    return;
}

function level_cleared() {
    for (let brick of bricks)
	if (brick.permanent == false)
	    return false;
    return true;
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

function update_score(add_to_score) {
    // Double score when reduced
    if (current_powerup == PU_REDUCE)
 	add_to_score *= 2;

    // Check for enough points for extra life (20k, 60k, 60k+)
    if ((score < 20000 && score + add_to_score > 20000) ||
	((score - 20000) % 60000 + add_to_score > 60000)) {
        play_sound("PLAYER_EXTEND");
	add_life();
    }

    score += add_to_score;

    if (score > highscore)
        highscore = score;

    document.getElementById("score").innerHTML = score;
    document.getElementById("highscore").innerHTML = highscore;
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

    // Stop things from moving in background
    reset_pills();
    reset_powerups();
    reset_lasers();
    reset_enemies();

    showLevelSelection(level, levelIndicies);

    // Reset user controlled things
    paddle.reset();
    reset_ball();
}

function add_life() {
    lives++;
    document.getElementById("lives").innerHTML = lives;
}

function populate_level(l) {
    // Clear overlay
    clear_context(ctx_overlay);

    // Update background
    switch (l.background.gradient) {
    case "1":
        document.getElementById("canvases").style = `background: radial-gradient(circle at 50%, ${l.background.color1}, ${l.background.color2})`;
        break;
    case "2":
    default:
        document.getElementById("canvases").style = `background: linear-gradient(${l.background.color1}, ${l.background.color2})`;
        break;
    }

    const texture_list = Object.values(texture_map).sort((a, b) => a.localeCompare(b));
    let selected_texture = texture_list[(level - 1) % texture_list.length]; // Default texture if unspecified
    if (l.background.texture) {
	selected_texture = texture_map[l.background.texture];
    }

    for (let texture of texture_list) {
        document.getElementById(texture).classList.add("hidden");

        if (texture == selected_texture)
	    document.getElementById(texture).classList.remove("hidden");
    }

    // Create bricks
    bricks = []
    for (let y = 0; y<l.bricks.length; y++)
        for (let x = 0; x<l.bricks[y].length; x++) {
	    const brick_type = l.bricks[y][x];
	    if (brick_type in brick_types)
		bricks.push(new Brick(ctx_bricks, ctx_dynamic, ctx_shadow_static, ctx_shadow_dynamic, x, y, brick_types[brick_type]));
	}

    // Set enemy rules
    enemy_type = Math.floor(Math.random() * enemy_types.length);
    max_enemies = 2;
    next_enemy = Math.random() * 10000; // up to 10 seconds
    if (l.enemy) {
	enemy_type = l.enemy.style;
	max_enemies = l.enemy.max;
    }

    // Start with a shimmer
    for (let brick of bricks)
	brick.start_shimmer();

    // Sounds!
    play_sound("STAGE_START");
    input_timeout = 1500; // 1.5 seconds

    // Start loop
    main_loop(undefined, true);
}

function toggle_pause() {
    paused = !paused;

    clear_context(ctx_overlay);
    if (paused) {
	overlay_message("Paused");
    } else {
        just_unpaused = true;
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

    // Setup Audio
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	// Load Sound Effects
	for (let name in SOUND_DEFINITIONS)
	    load_sound(name, SOUND_DEFINITIONS[name]);
    }

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
    reset_enemies();

    // Set up level information
    if (demo == null)
	advance_level(level);
    else
	populate_level(demo);

    paused = false;

    update_score(0);
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
    enemy: {
	width: 1/14,
	height: 1/14,
	left_entry: 5/28,
	right_entry: 19/28,
    }
}

let sizes = {};

let active = false;
let supress_input = false;
let input_timout = 0;
let score;
let highscore = 50000;
let level;
let bricks;
let pills;
let paddle;
let balls;
let paused;
let just_unpaused = false;
let lives;
let lasers;
let enemies = [];
let enemy_sprites;
let max_enemies;
let next_enemy;
let enemy_type;
let sounds = {};
let current_powerup = 0;

let audioCtx;
let muted = false;

let mouse_down = false;
let touch_start = false;
let touch_end;

let last_frame;

const texture_map = {
    "Hexagons"         : "texture1",
    "Diamonds"         : "texture2",
    "Hexagon Donuts"   : "texture3",
    "Circuitry 1"      : "texture4",
    "Circuitry 2"      : "texture5",
    "Rounded Hexagons" : "texture6",
};

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
	enemy: {
	    width: size_ratios.enemy.width * width,
	    height: size_ratios.enemy.height * width,
	    left_entry: size_ratios.enemy.left_entry * width,
	    right_entry: size_ratios.enemy.right_entry * width,
	    radius: size_ratios.enemy.width * width * .5,
	}
    }
}

function interact() {
}

async function firstLoad() {
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

    // Input Listeners
    canvas_overlay.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (supress_input == true) return;
	touch_start = getTouchPosition(e);

        if (active) {
	    // If game is active, split the screen into two halves
	    if ( touch_start.y < canvas_overlay.height / 2) {
                // Top half of screen pauses game
		toggle_pause();
	    } else {
                // Otherwise a tap is fire the lasers
	        if (current_powerup == PU_LASER && paused === false) {
                    if (lasers.length < 3) {
                        play_sound("LASER_FIRE");
	                lasers.push(new Laser(ctx_dynamic, ctx_shadow_dynamic, paddle.pos.x, paddle.pos.y));
                    }
	        }
            }
        }
    });

    canvas_overlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (supress_input == true) return;
	touch_end = getTouchPosition(e);
        paddle.set_pos(touch_end.x);
    });

    canvas_overlay.addEventListener('touchend', function(e) {
        e.preventDefault();
	if (touch_start == false) return;
        if (supress_input == true) return;
        if (paused) return;

	// If game is inactive, lets make this start a new game
	if (active === false) {
	    new_game();
        } else {
	    //this is going to be a click for releasing the ball
	    if (touch_end == false && just_unpaused == false)
		for (let ball of balls)
		    ball.is_caught = false;
	}

        just_unpaused = false;
	touch_start = false;
	touch_end = false;
    });

    canvas_overlay.addEventListener('mousedown', function(e) {
        if (supress_input == true) return;
	mouse_down = getCursorPosition(canvas_overlay, e);

        if (paused) return;

	if (current_powerup == PU_LASER) {
            if (lasers.length < 3) {
                play_sound("LASER_FIRE");
	        lasers.push(new Laser(ctx_dynamic, ctx_shadow_dynamic, paddle.pos.x, paddle.pos.y));
	    }
        }
    });

    canvas_overlay.addEventListener('mousemove', function(e) {
        if (supress_input == true) return;
        paddle.set_pos(getCursorPosition(canvas_overlay, e).x);
    });

    canvas_overlay.addEventListener('mouseup', function(e) {
	if (mouse_down == false) return;
	const pos = getCursorPosition(canvas_overlay, e);
        if (supress_input == true) return;

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

    // Setup Sprites
    enemy_sprites = await loadImageBitmap("images/enemies_64.png");

    // Look for editor input from menu bar
    let demo_level_encoded = window.location.href.split('?')[1];
    if (demo_level_encoded) {
        let demo_level = JSON.parse(atob(demo_level_encoded));
	console.log(atob(demo_level_encoded));
	console.log(demo_level);
	new_game(false, demo_level);
    } else {
	// Show high scores
	check_high_score();
    }
}

window.onload = function() {
    firstLoad();
};
