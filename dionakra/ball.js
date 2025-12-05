function reset_ball() {
    document.getElementById("lives").innerHTML = lives;
    balls = []
    balls.push(new Ball(ctx_dynamic, ctx_shadow, true));
}

function bounceOffEllipticalPaddle(ball_v, ball_p, paddle) {
    // 1. Normalize hit position
    const paddleCenter = paddle.get_pos_center();
    const a = paddle.width / 2;  // ellipse major axis
    const b = paddle.curve_height * a; // Ellipse height

    let t = (ball_p.x - paddleCenter) / a; // -1..1
    t = Math.max(-1, Math.min(1, t));

    // 2. Ellipse point
    const ex = a * t;
    const ey = -b * Math.sqrt(1 - t * t);  // top arc

    // 3. True ellipse normal: (x/a^2, y/b^2)
    let nx = ex / (a * a);
    let ny = ey / (b * b);

    // Normalize the normal
    const len = Math.hypot(nx, ny);
    if (len === 0) {
	nx = 0;
	ny = -1;
    } else {
	nx /= len;
	ny /= len;
    }

    // 4. Incoming vector
    const vx = ball_v.x;
    const vy = ball_v.y;

    // Dot product
    const dot = vx * nx + vy * ny;

    // 5. Perfect geometric reflection
    const rx = vx - 2 * dot * nx;
    const ry = vy - 2 * dot * ny;

    // 6. Assign back
    return {
	x: rx,
	y: ry,
    };
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

function reflectVector(vector, axis) {
    let c = vectorToComponents(vector);

    switch (axis) {
    case "vertical":
	// mirror left/right → flip X
	c.x = -c.x;
	break;

    case "horizontal":
	// mirror up/down → flip Y
	c.y = -c.y;
	break;

    case "diagonal1":
	// reflect across y = x → swap x and y
	[c.x, c.y] = [c.y, c.x];
	break;

    case "diagonal2":
	// reflect across y = -x → swap & flip both
	[c.x, c.y] = [-c.y, -c.x];
	break;

    default:
	throw new Error("Unknown reflection axis: " + axis);
    }

    return componentsToVector(c);
}

function overlapArea(aLeft, aRight, aTop, aBottom,
                     bLeft, bRight, bTop, bBottom) {
    // Compute overlap in X
    const overlapWidth = Math.max(0, Math.min(aRight, bRight) - Math.max(aLeft, bLeft));

    // Compute overlap in Y
    const overlapHeight = Math.max(0, Math.min(aBottom, bBottom) - Math.max(aTop, bTop));

    // If either is zero or negative, there's no overlap
    return overlapWidth * overlapHeight;
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

        // Collide with bricks
	// Find which brick has MOST overlap
	let brick_index = -1;
	let most_overlap = 0;
        for (let i=0; i<bricks.length; i++) {
	    let brick_left_edge   = bricks[i].pos.x;
	    let brick_right_edge  = bricks[i].pos.x + bricks[i].width;
	    let brick_top_edge    = bricks[i].pos.y;
	    let brick_bottom_edge = bricks[i].pos.y + bricks[i].height;

	    const overlap = overlapArea(
		ball_left_edge, ball_right_edge, ball_top_edge, ball_bottom_edge,
		brick_left_edge, brick_right_edge, brick_top_edge, brick_bottom_edge
	    );
	    if (overlap > most_overlap) {
		brick_index = i;
		most_overlap = overlap;
	    }
	}

	// Determine collision for that brick
	if (brick_index > -1) {
	    let brick_left_edge   = bricks[brick_index].pos.x;
	    let brick_right_edge  = bricks[brick_index].pos.x + bricks[brick_index].width;
	    let brick_top_edge    = bricks[brick_index].pos.y;
	    let brick_bottom_edge = bricks[brick_index].pos.y + bricks[brick_index].height;

	    // Choose whichever has smallest overlap and let that one win
	    let bottom_overlap = brick_bottom_edge - ball_top_edge;
	    let top_overlap = ball_bottom_edge - brick_top_edge;
	    let left_overlap = ball_right_edge - brick_left_edge;
	    let right_overlap = brick_right_edge - ball_left_edge;

	    // Ball move right, up: left edge, bottom)
	    if (this.v.x > 0 && this.v.y < 0) {
		if (bottom_overlap < left_overlap)
		    this.v.y *= -1;
		else
		    this.v.x *= -1;
	    }

	    // Ball move left, up: right edge, bottom)
	    else if (this.v.x < 0 && this.v.y < 0) {
		if (bottom_overlap < right_overlap)
		    this.v.y *= -1;
		else
		    this.v.x *= -1;
	    }

	    // Ball move right, down: left edge, top)
	    else if (this.v.x > 0 && this.v.y > 0) {
		if (top_overlap < left_overlap)
		    this.v.y *= -1;
		else
		    this.v.x *= -1;
	    }

	    // Ball move left, down: right edge, top)
	    else if (this.v.x < 0 && this.v.y > 0) {
		if (top_overlap < right_overlap)
		    this.v.y *= -1;
		else
		    this.v.x *= -1;
	    }

            bricks[brick_index].hits--;
	    return;
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
		console.log(this.v)

		// Elliptical Bounce
		//this.v = bounceOffEllipticalPaddle(this.v, this.pos, paddle);

		// Normal Reflective Bounce
		//if (this.v.y > 0)
		//this.v.y *= -1;

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
