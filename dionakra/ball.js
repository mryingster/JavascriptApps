function reset_ball() {
    document.getElementById("lives").innerHTML = lives;
    balls = []
    balls.push(new Ball(ctx_dynamic, ctx_shadow, true));
}

// 26.5, 30, 37, 68 < default?
function bounceArkanoidStyle(ball, paddle) {
    // 1. Normalize hit position -1..1
    const paddleCenter = paddle.pos.x + paddle.width / 2;
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

function normalizeSpeed(v) {
  // Current magnitude of vector
  const mag = Math.hypot(v.x, v.y);

  // Avoid division by zero
  if (mag === 0) {
    // Give it a tiny upward nudge if needed
    v.x = 0;
    v.y = -v.s;
    return v;
  }

  const scale = v.s / mag;

  v.x *= scale;
  v.y *= scale;

  return v;
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function sweepAgainstBricks(P0x, P0y, P1x, P1y, radius, bricks) {
    let hit = null;
    let bestT = 1;

    const dx = P1x - P0x;
    const dy = P1y - P0y;

    for (const brick of bricks) {
        const result = sweepCircleAABB(
            P0x, P0y, dx, dy, radius,
            brick.pos.x, brick.pos.y,
            brick.width, brick.height
        );

        if (result && result.t < bestT) {
            bestT = result.t;
            hit = { t: result.t, nx: result.nx, ny: result.ny, brick };
        }
    }

    return hit;
}

function sweepCircleAABB(P0x, P0y, dx, dy, radius, bx, by, bw, bh) {
    // Expand AABB by circle radius
    const minX = bx - radius;
    const maxX = bx + bw + radius;
    const minY = by - radius;
    const maxY = by + bh + radius;

    let tEnter = 0;
    let tExit  = 1;

    let nx = 0, ny = 0;

    // ===== X Axis =====
    if (dx !== 0) {
        let tx1 = (minX - P0x) / dx;
        let tx2 = (maxX - P0x) / dx;

        let tMin = Math.min(tx1, tx2);
        let tMax = Math.max(tx1, tx2);

        if (tMin > tEnter) {
            tEnter = tMin;
            // Normal faces opposite direction of motion
            nx = (tx1 < tx2) ? -1 : 1;
            ny = 0;
        }

        tExit = Math.min(tExit, tMax);
        if (tEnter > tExit) return null;
    } else {
        // No movement along X → must be inside slab
        if (P0x < minX || P0x > maxX) return null;
    }

    // ===== Y Axis =====
    if (dy !== 0) {
        let ty1 = (minY - P0y) / dy;
        let ty2 = (maxY - P0y) / dy;

        let tMin = Math.min(ty1, ty2);
        let tMax = Math.max(ty1, ty2);

        if (tMin > tEnter) {
            tEnter = tMin;
            nx = 0;
            ny = (ty1 < ty2) ? -1 : 1;
        }

        tExit = Math.min(tExit, tMax);
        if (tEnter > tExit) return null;
    } else {
        if (P0y < minY || P0y > maxY) return null;
    }

    // No collision within this movement
    if (tEnter < 0 || tEnter > 1) return null;

    return { t: tEnter, nx, ny };
}

class Ball {
    constructor(ctx, ctx_shadow, caught=false) {
	this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

	this.pos = {
	    x: 300,
	    y: 400,
	};

        this.prev = {
            x: 0,
            y: 0,
        }

	this.v = {
	    x: 16,
	    y: -32,
	    s: 40,
	};

	normalizeSpeed(this.v);

        this.color_outer = "#ffffff";
        this.color_inner = "#00ffff";

        this.radius = this.ctx.canvas.width / (56 * 2);
        this.border = 2;

        this.hits = 0;

        this.is_mega = false;
	this.is_caught = caught;

        this.remove = false;

	this.move(0);
    }

    set_speed(s) {
	this.v.s = s;
	normalizeSpeed(this.v);
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

        // Collisions with walls
        if (ball_top_edge <= sizes.arena.top) {
	    if (this.v.y < 0)
		this.v.y *= -1;
	    return;
        }

        if (ball_right_edge >= sizes.arena.right) {
	    if (this.v.x > 0)
		this.v.x *= -1;
	    return;
	}

	if (ball_left_edge <= sizes.arena.left) {
	    if (this.v.x < 0)
		this.v.x *= -1;
	    return;
	}

        // Brick Collisions
        if (this.prev.y != this.pos.y) {
            const hit = sweepAgainstBricks(
                this.prev.x, this.prev.y,
                this.pos.x, this.pos.y,
                this.radius,
                bricks
            );

            if (hit) {
                if (hit.nx != 0 || hit.ny != 0) {
                    // Move ball to collision point
                    const t = hit.t;
                    const P0x = this.prev.x;
                    const P0y = this.prev.y;
                    const dx = this.pos.x - P0x;
                    const dy = this.pos.y - P0y;

                    this.pos.x = P0x + dx * t;
                    this.pos.y = P0y + dy * t;

                    // Reflect velocity using normal
                    const nx = hit.nx;
                    const ny = hit.ny;
                    const dot = this.v.x * nx + this.v.y * ny;

                    this.v.x = this.v.x - 2 * dot * nx;
                    this.v.y = this.v.y - 2 * dot * ny;

                    // Apply the hit to the brick
                    hit.brick.hit();

                    this.prev.x = this.pos.x;
                    this.prev.y = this.pos.y;

                    return;
                }
            }
        }

        // Collide with paddle
        if (ball_right_edge > paddle.pos.x &&
            ball_left_edge < paddle.pos.x + paddle.width &&
            ball_bottom_edge > paddle.pos.y &&
	    ball_top_edge < paddle.pos.y + paddle.height) {

	    // Make sure for the last frame we were not colliding...
	    if (ball_prev_bottom_edge < paddle.pos.y) {

		// Arkanoid Style bounce
		this.v = bounceArkanoidStyle(this, paddle);
		return;
	    }
        }

        // Collision with bottom
        if (ball_bottom_edge >= sizes.arena.bottom) {
            this.remove = true;
	    return;
        }
    }

    move(ms) {
        if (isNaN(ms))
            return;

	// If caught, we just need to move it with the paddle and do nothing else
	if (this.is_caught) {
	    this.pos.y = paddle.pos.y - this.radius;
	    this.pos.x = paddle.pos.x + 3/4 * paddle.width;

            this.prev.x = this.pos.x;
            this.prev.y = this.pos.y;
            return;
	}

        // Check for collisions
        this.collide();

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
        this.ctx.fillStyle = this.color_inner;
        this.ctx.fill();

        // Outline
        this.ctx.lineWidth = this.border;
        this.ctx.strokeStyle = this.color_outer;
        this.ctx.stroke();
	return;
    }
}
