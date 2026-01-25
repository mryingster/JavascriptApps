const NOHIT         = 0;
const HORIZONTALHIT = 1;
const VERTICALHIT   = 2;

function reset_ball() {
    document.getElementById("lives").innerHTML = Math.max(0, lives);;
    balls = []
    balls.push(new Ball(ctx_dynamic, ctx_shadow_dynamic, true));
}

class Ball {
    constructor(ctx, ctx_shadow, caught=false, pos=null, v=null) {
	this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

	this.pos = {
	    x: 300,
	    y: 400,
	};
	if (pos !== null) {
	    this.pos.x = pos.x;
	    this.pos.y = pos.y;
	}

        this.prev = {
            x: 0,
            y: 0,
        }
	if (pos !== null) {
	    this.prev.x = pos.x;
	    this.prev.y = pos.y;
	}

	this.v = {
	    x: 16,
	    y: -32,
	    s: 40,
	};
	if (v !== null) {
	    this.v.x = v.x;
	    this.v.y = v.y;
	    this.v.s = v.s
	}

	this.normalizeSpeed();

        this.color_outer = "#ffffff";
        this.color_inner = "#00ffff";

        this.mega_color_outer = "#008800";
        this.mega_color_inner = "#00ff00";

        this.radius = this.ctx.canvas.width / (56 * 2);
        this.border = 2;

        this.hits = 0;
        this.collisions = 0;

	this.is_caught = caught;
	this.catch_offset = 3/4 * sizes.paddle.width;

        this.remove = false;

	this.move(0);
    }

    set_speed(s) {
	this.v.s = s;
	this.normalizeSpeed();
    }

    normalizeSpeed(v) {
	// Current magnitude of vector
	const mag = Math.hypot(this.v.x, this.v.y);

	// Avoid division by zero
	if (mag === 0) {
	    // Give it a tiny upward nudge if needed
	    this.v.x = 0;
	    this.v.y = -v.s;
	}

	const scale = this.v.s / mag;

	this.v.x *= scale;
	this.v.y *= scale;
    }

    slow() {
	this.set_speed(this.v.s * .8);
    }

    speedup() {
	this.set_speed(this.v.s * 1.1);
    }

    collide() {
	let ball_left_edge   = this.pos.x - this.radius;
	let ball_right_edge  = this.pos.x + this.radius;
	let ball_top_edge    = this.pos.y - this.radius;
	let ball_bottom_edge = this.pos.y + this.radius;

	let ball_prev_left_edge   = this.prev.x - this.radius;
	let ball_prev_right_edge  = this.prev.x + this.radius;
	let ball_prev_top_edge    = this.prev.y - this.radius;
	let ball_prev_bottom_edge = this.prev.y + this.radius;


	let vertical_collision   = false;
	let horizontal_collision = false;
	let paddle_collision     = false;

        let collision_sound = null;

        // Collisions with walls
        if (ball_top_edge <= sizes.arena.top) {
	    if (this.v.y < 0) {
		horizontal_collision = true;
                collision_sound = "WALL_HIT_1";
            }
        }

        if (ball_right_edge >= sizes.arena.right) {
	    if (this.v.x > 0) {
		vertical_collision = true;
                collision_sound = "WALL_HIT_1";
	    }
        }

	if (ball_left_edge <= sizes.arena.left) {
	    if (this.v.x < 0) {
		vertical_collision = true;
                collision_sound = "WALL_HIT_1";
	    }
	}

        // Brick Collisions
        if (this.prev.y != this.pos.y) {

            // Get all candidate bricks that have intersection
            let candidates = [];
            for (const brick of bricks) {
                // Ignore bircks that are too far away
                if (Math.hypot(brick.pos.x - this.pos.x, brick.pos.y - this.pos.y) > 100) continue;

		// Ignore bricks we can't interact with
		if (brick.hits == 0) continue;

		let result = sweptCircleVsRect(this, brick);
		if (result.hit) {
		    candidates.push({
			brick: brick,
			result: result,
		    });
		}
            }

            // Only bother with these calculations if we have a candidate!
            if (candidates.length > 0) {

                // If megaball, just erase all of them!
                if (current_powerup == PU_MEGABALL) {
                    for (let candidate of candidates)
                        candidate.brick.hit(true);
                } else {

		    // Find earliest intersection(s) from hit result times
                    const epsilon = 1e-4;
                    let earliestCandidates = partitionEarliestAxisContacts(candidates, epsilon);

                    // If there are multiple candidates for either axis, only select the CLOSEST to original ball position
                    let closestCandidates = determineClosestAxisContact(earliestCandidates);

		    // Allow only 1 horizontal and 1 vertical hit per frame
                    if (closestCandidates.x !== null) {
		        // Remove brick
                        closestCandidates.x.brick.hit();
                        vertical_collision = true;
		    }
                    if (closestCandidates.y !== null) {
		        // Remove brick
                        closestCandidates.y.brick.hit();
                        horizontal_collision = true;
		    }
                }
            }
        }

	// Collide with paddle
	if (circle_intersect_with_rectangle(this.pos.x, this.pos.y, this.radius, paddle.pos.x, paddle.pos.y, paddle.width, paddle.height)) {
	    // Ensure previous frame had no collision
	    if (!circle_intersect_with_rectangle(this.prev.x, this.prev.y, this.radius, paddle.prev.x, paddle.prev.y, paddle.width, paddle.height)) {
		// Arkanoid Style bounce
		this.v = bounceArkanoidStyle(this, paddle);

		if (current_powerup == PU_CATCH) {
		    this.is_caught = true;
		    this.catch_offset = this.pos.x - paddle.pos.x;
		}

                collision_sound = "WALL_HIT_1";
                if (current_powerup == PU_CATCH)
                    collision_sound = "BALL_CATCH";
		paddle_collision = true;
	    }
	}

	// Collide with twin paddle
	if (current_powerup == PU_TWIN) {
	    if (circle_intersect_with_rectangle(this.pos.x, this.pos.y, this.radius, paddle.pos.x + paddle.twin_offset, paddle.pos.y, paddle.width, paddle.height)) {
		// Ensure previous frame had no collision
		if (!circle_intersect_with_rectangle(this.prev.x, this.prev.y, this.radius, paddle.prev.x + paddle.twin_offset, paddle.prev.y, paddle.width, paddle.height)) {
		    // Arkanoid Style bounce
		    this.v = bounceArkanoidStyle(this, paddle, paddle.twin_offset);

                    collision_sound = "WALL_HIT_1";
		    paddle_collision = true;
		}
	    }
	}

	// Collide with illusion
	if (current_powerup == PU_ILLUSION) {
	    const illusion_left = Math.min(paddle.pos.x, paddle.illusion_pos.x);
	    const illusion_width = Math.max(paddle.pos.x, paddle.illusion_pos.x) - illusion_left;
	    if (circle_intersect_with_rectangle(this.pos.x, this.pos.y, this.radius, illusion_left, paddle.pos.y, illusion_width, paddle.height)) {
		if (this.v.y > 0) {
                    collision_sound = "ILLUSION_HIT";
		    horizontal_collision = true;
		}
	    }
	}

        // Collision with bottom
        if (ball_bottom_edge >= sizes.arena.bottom) {
            this.remove = true;
	    return true;
        }

	// Perform collision(s)
	if (horizontal_collision)
	    this.v.y *= -1;

	if (vertical_collision)
	    this.v.x *= -1;

        if (collision_sound != null)
            play_sound(collision_sound);

	return vertical_collision || horizontal_collision || paddle_collision;
    }

    move(ms) {
        if (isNaN(ms))
            return;

	// If caught, we just need to move it with the paddle and do nothing else
	if (this.is_caught) {
	    this.pos.y = paddle.pos.y - this.radius;
	    this.pos.x = paddle.pos.x + this.catch_offset;

            this.prev.x = this.pos.x;
            this.prev.y = this.pos.y;
            return;
	}

        // Check for collisions
        let collided = this.collide();
	if (collided)
	    this.collisions++;

	// Speedup on collisions
	if (this.collisions >= 50) {
	    this.speedup();
	    this.collisions = 0;
	}

        this.prev.x = this.pos.x
        this.prev.y = this.pos.y

        // Move ball
        this.pos.y += this.v.y * ms / 100;
        this.pos.x += this.v.x * ms / 100;

	return;
    }

    render() {
        // Shadow
        this.ctx_shadow.moveTo(this.pos.x+sizes.shadow_offset.horizontal, this.pos.y+sizes.shadow_offset.vertical);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x+sizes.shadow_offset.horizontal, this.pos.y+sizes.shadow_offset.vertical, this.radius, 0, 2*Math.PI);
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fill();

        // Fill
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
	let color = this.color_inner;
	if (current_powerup == PU_MEGABALL)
	    color = this.mega_color_inner;
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Outline
        this.ctx.lineWidth = this.border;
	color = this.color_outer;
	if (current_powerup == PU_MEGABALL)
	    color = this.mega_color_outer;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
	return;
    }
}
