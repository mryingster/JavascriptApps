const NOHIT         = 0;
const HORIZONTALHIT = 1;
const VERTICALHIT   = 2;

function reset_ball() {
    document.getElementById("lives").innerHTML = lives;
    balls = []
    balls.push(new Ball(ctx_dynamic, ctx_shadow_dynamic, true));
}

// 26.5, 30, 37, 68 < default?
function bounceArkanoidStyle(ball, paddle, offset=0) {
    // 1. Normalize hit position -1..1
    const paddleCenter = paddle.pos.x + offset + paddle.width / 2;
    let t = (ball.pos.x - paddleCenter) / (paddle.width / 2);

    // Clamp
    t = Math.max(-1, Math.min(1, t));

    // 2. Define Arkanoid angle zones (in radians)
    // degrees relative to vertical
    const angles = [-68, -37, -30, -26.5, 26.5, 30, 37, 68].map(a => (-90 + a) * Math.PI/180); 
    // This maps to "mostly upward" directions.

    // 3. Map t (-1..1) to zone index
    const idx = Math.round((t + 1) * 0.5 * (angles.length - 1));

    const chosenAngle = angles[idx];

    // 4. Keep the original speed
    const speed = ball.v.s; //Math.hypot(ball.v.x, ball.v.y);

    // 5. Convert angle to velocity
    return {
	x : speed * Math.cos(chosenAngle),
	y : speed * Math.sin(chosenAngle),
	s : speed,
    };
}

function sweptBallAABB(ball, brick) {
    const dx = ball.pos.x - ball.prev.x;
    const dy = ball.pos.y - ball.prev.y;

    // Expand brick by ball radius
    const minX = brick.pos.x - ball.radius;
    const maxX = brick.pos.x + brick.width + ball.radius;
    const minY = brick.pos.y - ball.radius;
    const maxY = brick.pos.y + brick.height + ball.radius;

    let txEntry, txExit;
    let tyEntry, tyExit;

    // X axis
    if (dx === 0) {
        if (ball.prev.x < minX || ball.prev.x > maxX) return false;
        txEntry = -Infinity;
        txExit = Infinity;
    } else {
        const invDx = 1 / dx;
        txEntry = (minX - ball.prev.x) * invDx;
        txExit  = (maxX - ball.prev.x) * invDx;
        if (txEntry > txExit) [txEntry, txExit] = [txExit, txEntry];
    }

    // Y axis
    if (dy === 0) {
        if (ball.prev.y < minY || ball.prev.y > maxY) return false;
        tyEntry = -Infinity;
        tyExit = Infinity;
    } else {
        const invDy = 1 / dy;
        tyEntry = (minY - ball.prev.y) * invDy;
        tyExit  = (maxY - ball.prev.y) * invDy;
        if (tyEntry > tyExit) [tyEntry, tyExit] = [tyExit, tyEntry];
    }

    const tEntry = Math.max(txEntry, tyEntry);
    const tExit  = Math.min(txExit, tyExit);

    return !(tEntry > tExit || tEntry < 0 || tEntry > 1);
}

function penetrationInfo(ball, brick) {
    const cx = ball.pos.x;
    const cy = ball.pos.y;

    const closestX = Math.max(
        brick.pos.x,
        Math.min(cx, brick.pos.x + brick.width)
    );
    const closestY = Math.max(
        brick.pos.y,
        Math.min(cy, brick.pos.y + brick.height)
    );

    const dx = cx - closestX;
    const dy = cy - closestY;
    const dist = Math.hypot(dx, dy);

    return {
        depth: ball.radius - dist,
        dx,
        dy
    };
}

function circle_intersect_with_rectangle(cx, cy, cr, rx, ry, rw, rh) {
    let rect_left = rx - cr;
    let rect_right = rx + rw + cr;
    let rect_top = ry - cr;
    let rect_bottom = ry + rh + cr;

    if (cx >= rect_left && cx <= rect_right &&
	cy >= rect_top && cy <= rect_bottom)
	return true;
    return false;
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

        // Collisions with walls
        if (ball_top_edge <= sizes.arena.top) {
	    if (this.v.y < 0)
		horizontal_collision = true;
        }

        if (ball_right_edge >= sizes.arena.right) {
	    if (this.v.x > 0)
		vertical_collision = true;
	}

	if (ball_left_edge <= sizes.arena.left) {
	    if (this.v.x < 0)
		vertical_collision = true;
	}

        // Brick Collisions
        if (this.prev.y != this.pos.y) {

            // Get all candidate bricks that have intersection
            let candidates = [];
            for (const brick of bricks) {
                // Ignore bircks that are too far away
                if (Math.hypot(brick.pos.x - this.pos.x, brick.pos.y - this.pos.y) > 100) continue;
                if (sweptBallAABB(this, brick))
                    candidates.push(brick);
            }

            // If megaball, just erase all of them!
            if (current_powerup == PU_MEGABALL) {
                for (let candidate of candidates)
                    candidate.hit(true);
            } else {

                // Get most overlapped
                let bestBrick = null;
                let bestPenetration = null;

                for (let candidate of candidates) {
                    const p = penetrationInfo(this, candidate);
                    if (p.depth <= 0) continue;

                    if (!bestPenetration || p.depth > bestPenetration.depth) {
                        bestPenetration = p;
                        bestBrick = candidate;
                    }
                }

                if (bestBrick) {
                    // Determine which side is hit, and reflect accordingly
                    bestBrick.hit();

                    let axis;
                    if (Math.abs(bestPenetration.dx) > Math.abs(bestPenetration.dy)) {
                        vertical_collision = true;
                    } else {
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

		    paddle_collision = true;
		}
	    }
	}

	// Collide with illusion
	if (current_powerup == PU_ILLUSION) {
	    const illusion_left = Math.min(paddle.pos.x, paddle.illusion_pos.x);
	    const illusion_width = Math.max(paddle.pos.x, paddle.illusion_pos.x) - illusion_left;
	    if (circle_intersect_with_rectangle(this.pos.x, this.pos.y, this.radius, illusion_left, paddle.pos.y, illusion_width, paddle.height)) {
		if (this.v.y > 0)
		    horizontal_collision = true;
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
