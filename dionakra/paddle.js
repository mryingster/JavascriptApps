class Paddle {
    constructor(ctx, ctx_shadow) {
	this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;
        this.width = sizes.paddle.width;
        this.height = sizes.paddle.height;

	this.pos = {
	    x: sizes.canvas.width / 2 - (this.width / 2),
	    y: sizes.paddle.ypos,
	};

	this.prev = {
	    x: this.pos.x,
	    y: this.pos.y,
	}

        this.color_outer = "#ffffff";
        this.color_inner = "#00ffff";

	this.twin_offset = 0;
	this.illusion_pos = {x: 0};
	this.framebreak = {top:this.pos.y + (this.width / 2), height:0};
        this.radius = 5;
        this.border = 2;

	this.curve_height = .25;

	this.gradient_grey = this.ctx.createLinearGradient(0, this.pos.y, 0, this.pos.y + this.height);
	this.gradient_grey.addColorStop(0,   "#aaa");
	this.gradient_grey.addColorStop(0.2, "#fff");
	this.gradient_grey.addColorStop(1,   "#333");

	this.gradient_red = this.ctx.createLinearGradient(0, this.pos.y, 0, this.pos.y + this.height);
	this.gradient_red.addColorStop(0,   "#fe5d24");
	this.gradient_red.addColorStop(0.2, "#ffffff");
	this.gradient_red.addColorStop(.6,  "#fe5d24");
	this.gradient_red.addColorStop(1,   "#bb2e15");

	this.light_vertical_center = this.pos.y + (this.height / 2)
	this.bulb_color = {h:180, s:95, l:52.94}; //"#15f9f9"
	this.blink = 0;

	this.particles = [];
	this.exploding = false;
    }

    get_pos_center() {
	return this.pos.x + (this.width / 2);
    }

    reset() {
	this.pos = {
	    x: sizes.canvas.width / 2 - (this.width / 2),
	    y: sizes.paddle.ypos,
	};
	this.exploding = false;
    }

    explode() {
	this.exploding = true;
	for (let i=0; i<30; i++) {
	    this.particles.push(new Particle(
		this.ctx,
		Math.random() * this.width + this.pos.x,
		Math.random() * this.height + this.pos.y,
		["#fe5d24", "#fe5d24", "#bb2e15", "#aaa", "#333", "#fff", "#666", "#bbb"][Math.floor(Math.random() * 8)],
	    ));
	}
    }

    set_pos(x) {
	// Don't move if exploding
	if (this.particles.length > 0)
	    return;

	this.prev.x = this.pos.x;
	this.prev.y = this.pos.y;

        this.pos.x = x - (this.width / 2);
        this.collide();
        return;
    }

    move(ms) {
        if (isNaN(ms))
            return;

	// Check for explosion
	if (this.exploding) {
	    if (this.particles.length > 0) {
		for (let i=0; i<this.particles.length; i++) {
		    this.particles[i].move(ms);
		    if (this.particles[i].remove) {
			this.particles.splice(i, 1);
			i--;
		    }
		}
	    } else {
		// Explosion done. Reset
		this.reset();
	    }
	}

	if (current_powerup == PU_EXPAND) { // Expand
	    if (this.width < sizes.paddle.expanded_width) {
		this.width += ms * .1;
	    }
	    if (this.width > sizes.paddle.expanded_width) {
		this.width = sizes.paddle.expanded_width;
	    }
	} else if (current_powerup == PU_REDUCE) { // Reduce
	    if (this.width > sizes.paddle.reduced_width) {
		this.width -= ms * .1;
	    }
	    if (this.width < sizes.paddle.reduced_width) {
		this.width = sizes.paddle.reduced_width;
	    }
	} else { // Normal
	    if (Math.abs(this.width - sizes.paddle.width) < 5) {
		this.width = sizes.paddle.width;
	    }
	    if (this.width < sizes.paddle.width) {
		this.width += ms * .1;
	    }
	    if (this.width > sizes.paddle.width) {
		this.width -= ms * .1;
	    }
	}

	// Twin Paddle Movements
	if (current_powerup == PU_TWIN) {
	    if (this.twin_offset < (this.width * 1.25))
		this.twin_offset += ms * .2;
	    if (this.twin_offset >(this.width * 1.25))
		this.twin_offset = (this.width * 1.25);
	} else {
	    if (this.twin_offset > 0)
		this.twin_offset -= ms * .2;
	}

	// Illusion Movement
	if (current_powerup == PU_ILLUSION) {
	    let illusion_distance = this.illusion_pos.x - this.pos.x;  // - left, + right
	    // Cap distance
	    if (illusion_distance < -1.75 * this.width)
		this.illusion_pos.x = this.pos.x - (this.width * 1.75);
	    if (illusion_distance > 1.75 * this.width + this.width)
		this.illusion_pos.x = this.pos.x + this.width + (this.width * 1.75);
	    // Slowly retract
	    if (illusion_distance < 0)
		this.illusion_pos.x += .1 * ms;
	    if (illusion_distance > 0)
		this.illusion_pos.x -= .1 * ms;
	}

	// Break Movement
	if (current_powerup == PU_BREAK) {
	    // Open break in the wall
	    if (this.framebreak.top > this.pos.y - this.height)
		this.framebreak.top -= .1 * ms;
	    if (this.framebreak.top < this.pos.y - this.height)
		this.framebreak.top = this.pos.y - this.height;

	    if (this.framebreak.height < this.height * 3)
		this.framebreak.height += .2 * ms;
	    if (this.framebreak.height > this.height * 3)
		this.framebreak.height = this.height * 3;
	} else {
	    // Close break in the wall
	    if (this.framebreak.top < this.pos.y + (this.height / 2))
		this.framebreak.top += .1 * ms;
	    if (this.framebreak.top > this.pos.y + (this.height / 2))
		this.framebreak.top = this.pos.y + (this.height / 2);

	    if (this.framebreak.height > 0)
		this.framebreak.height -= .2 * ms;
	    if (this.framebreak.height < 0)
		this.framebreak.height = 0;
	}

	this.collide();
    }

    pulse(ms) {
	if (isNaN(ms))
            return;

	this.blink += ms * .001;
	this.blink %= Math.PI;
    }

    collide() {
        if (this.pos.x < sizes.arena.left)
            this.pos.x = sizes.arena.left;

        if (this.pos.x + this.width + this.twin_offset > sizes.arena.right) {
	    if (current_powerup != PU_BREAK)
		this.pos.x = sizes.arena.right - (this.width + this.twin_offset);
	}

	if (current_powerup == PU_BREAK)
	    if (this.pos.x + this.width/2 >= sizes.arena.right)
		advance_level();
    }

    hsl_to_string(h, s, l) {
	return `hsl(${h}, ${s}%, ${l}%)`
    }

    render_normal_paddle(offset=0) {
	// Draw Shadow
        this.ctx_shadow.save();
        this.ctx_shadow.translate(sizes.shadow_offset.horizontal + offset, sizes.shadow_offset.vertical);

        this.ctx_shadow.fillStyle = "#000000";

        canvas_draw_rounded_rectangle(this.ctx_shadow, this.pos.x, this.pos.y, this.width, this.height, this.radius);
        this.ctx_shadow.fill();

	this.ctx_shadow.moveTo(this.pos.x, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fill();

	this.ctx_shadow.moveTo(this.pos.x + this.width, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x + this.width, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fill();

        this.ctx_shadow.restore();

	// Black sub-frame

	// lights
        this.ctx.save();
        this.ctx.translate(offset, 0);

	const light_color = this.hsl_to_string(
	    this.bulb_color.h,
	    this.bulb_color.s,
	    Math.sin(this.blink) * 100,
	);

	this.ctx.moveTo(this.pos.x, this.light_vertical_center);
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = light_color;
        this.ctx.fill();

	this.ctx.moveTo(this.pos.x + this.width, this.light_vertical_center);
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x + this.width, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = light_color;
        this.ctx.fill();

	// Main body
	let middle_width = this.width - (sizes.paddle.side_width * 2);
	this.ctx.fillStyle = this.gradient_grey;
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x + sizes.paddle.side_width, this.pos.y, middle_width, this.height, this.radius);
        this.ctx.fill();

	// Red edges
	this.ctx.fillStyle = this.gradient_red;
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x + this.width - sizes.paddle.side_width, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();

	this.ctx.restore();
    }

    render_laser_paddle() {
	let middle_width = this.width - (sizes.paddle.side_width * 2);

	// Draw Shadow
        this.ctx_shadow.save();
        this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);
        this.ctx_shadow.fillStyle = "#000000";

	this.ctx_shadow.moveTo(this.pos.x, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x + sizes.ball.radius, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fill();

	this.ctx_shadow.moveTo(this.pos.x + this.width, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x + this.width - sizes.ball.radius, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fill();

	// Main body
	canvas_draw_rounded_rectangle(this.ctx_shadow, this.pos.x + sizes.paddle.side_width, this.pos.y, middle_width, this.height, this.radius);
        this.ctx_shadow.fill();

	// Sides
	canvas_draw_left_laser_paddle(this.ctx_shadow, this.pos.x, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx_shadow.fill();
	canvas_draw_right_laser_paddle(this.ctx_shadow, this.pos.x + this.width - sizes.paddle.side_width, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx_shadow.fill();

        this.ctx_shadow.fill();
        this.ctx_shadow.restore();

	// lights
	const light_color = this.hsl_to_string(
	    this.bulb_color.h,
	    this.bulb_color.s,
	    Math.sin(this.blink) * 100,
	);

	this.ctx.moveTo(this.pos.x, this.light_vertical_center);
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x + sizes.ball.radius, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = light_color;
        this.ctx.fill();

	this.ctx.moveTo(this.pos.x + this.width, this.light_vertical_center);
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x + this.width - sizes.ball.radius, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = light_color;
        this.ctx.fill();

	// Main body
	this.ctx.fillStyle = this.gradient_grey;
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x + sizes.paddle.side_width, this.pos.y, middle_width, this.height, this.radius);
        this.ctx.fill();

	// Sides
	this.ctx.fillStyle = this.gradient_grey;
	canvas_draw_left_laser_paddle(this.ctx, this.pos.x, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();
	canvas_draw_right_laser_paddle(this.ctx, this.pos.x + this.width - sizes.paddle.side_width, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();

	// Stripes
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = "red";
	this.ctx.beginPath();
	this.ctx.moveTo(this.pos.x + sizes.paddle.side_width / 2, this.pos.y + this.height);
	this.ctx.lineTo(this.pos.x + sizes.paddle.side_width, this.pos.y + this.height / 2);
	this.ctx.lineTo(this.pos.x + sizes.paddle.width / 3, this.pos.y + this.height / 2);
	this.ctx.lineTo(this.pos.x + sizes.paddle.width / 3, this.pos.y + this.height);
	this.ctx.stroke();

	this.ctx.beginPath();
	this.ctx.moveTo(this.pos.x + this.width - sizes.paddle.side_width / 2, this.pos.y + this.height);
	this.ctx.lineTo(this.pos.x + this.width - sizes.paddle.side_width, this.pos.y + this.height / 2);
	this.ctx.lineTo(this.pos.x + this.width - sizes.paddle.width / 3, this.pos.y + this.height / 2);
	this.ctx.lineTo(this.pos.x + this.width - sizes.paddle.width / 3, this.pos.y + this.height);
	this.ctx.stroke();

    }

    render_illusion() {
        this.ctx.fillStyle = "rgba(128, 63, 193, .4)";

	let left_edge = Math.min(this.pos.x + (this.width / 2), this.illusion_pos.x);
	let width = Math.abs(this.pos.x + (this.width / 2) - this.illusion_pos.x);

        canvas_draw_rounded_rectangle(
	    this.ctx,
	    left_edge,
	    this.pos.y,
	    width,
	    this.height,
	    this.radius,
	);
        this.ctx.fill();
    }

    render_controller() {
	this.ctx.strokeStyle = "#888";
	this.ctx.fillStyle = "#000";
	canvas_draw_rounded_rectangle(
	    this.ctx,
	    this.pos.x,
	    sizes.controller.ypos,
	    sizes.controller.width,
	    sizes.controller.height,
	    this.radius
	);
        this.ctx.fill();
	this.ctx.stroke();

	let line_spacing = sizes.controller.width/7;
	let center = this.pos.x + sizes.controller.width/2;
	let line_top = sizes.controller.ypos + line_spacing;
	let line_bottom = sizes.controller.ypos + sizes.controller.height - line_spacing;

	this.ctx.beginPath();
	this.ctx.moveTo(center - line_spacing, line_top);
	this.ctx.lineTo(center - line_spacing, line_bottom);
	this.ctx.stroke();

	this.ctx.beginPath();
	this.ctx.moveTo(center, line_top);
	this.ctx.lineTo(center, line_bottom);
	this.ctx.stroke();

	this.ctx.beginPath();
	this.ctx.moveTo(center + line_spacing, line_top);
	this.ctx.lineTo(center + line_spacing, line_bottom);
	this.ctx.stroke();
    }

    render_break() {
	// Create opening door
	this.ctx.beginPath();
        canvas_draw_rounded_rectangle(
	    this.ctx,
	    sizes.arena.right,
	    this.framebreak.top,
	    sizes.frame.right,
	    this.framebreak.height,
	    sizes.frame.right / 4,
	);
	this.ctx.fillStyle = "#333";
        this.ctx.fill();

	// Draw some energy??
	const center = sizes.arena.right + sizes.frame.right / 2;
	let posy = this.framebreak.top
	this.ctx.beginPath();
	this.ctx.moveTo(center, this.framebreak.top);
	while (posy < this.framebreak.top + this.framebreak.height) {
	    posy += 3;
	    this.ctx.lineTo(center + Math.random() * (sizes.frame.right / 2) - (sizes.frame.right / 4), posy);
	}

	this.ctx.lineWidth = 3;
	this.ctx.strokeStyle = "#0bf";
	this.ctx.stroke();

	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = "#fff";
	this.ctx.stroke();
    }

    render() {
	if (this.particles.length > 0) {
	    for (let particle of this.particles) {
		particle.render();
	    }
	    return;
	}

	if (this.framebreak.height != 0)
	    this.render_break();
	if (current_powerup == PU_ILLUSION)
	    this.render_illusion();

	if (this.twin_offset > 0)
	    this.render_normal_paddle(this.twin_offset);

	if (current_powerup == PU_LASER)
	    this.render_laser_paddle();
	else
	    this.render_normal_paddle()

	this.render_controller();

	return;
    }
}

function reset_lasers() {
    lasers = [];
}

class Laser {
    constructor(ctx, ctx_shadow, x, y) {
	this.ctx = ctx;
	this.ctx_shadow = ctx_shadow;

	this.pos = {
	    x: x,
	    y: y,
	};

	this.remove = false;
	this.color = "#FFFF88";

	this.offset = (sizes.paddle.width - sizes.laser.spacing) / 2;
    }

    move(ms) {
	if (isNaN(ms))
            return;

	this.pos.y -= 1.25 * ms;

	// Check for intersection with top
	if (this.pos.y < sizes.frame.top) {
	    this.remove = true;
	}

	// Check for intersection with bricks
	for (let brick of bricks) {
	    // Check left
	    if (this.pos.x + this.offset > brick.pos.x &&
		this.pos.x + this.offset < brick.pos.x + brick.width &&
		this.pos.y > brick.pos.y &&
		this.pos.y < brick.pos.y + brick.height) {
		if (brick.hits != 0) {
		    brick.hit();
		    this.remove = true;
		}
	    }

	    // Check right
	    if (this.pos.x + sizes.laser.spacing + this.offset > brick.pos.x &&
		this.pos.x + sizes.laser.spacing + this.offset < brick.pos.x + brick.width &&
		this.pos.y > brick.pos.y &&
		this.pos.y < brick.pos.y + brick.height) {
		if (brick.hits != 0) {
		    brick.hit();
		    this.remove = true;
		}
	    }
	}
    }

    render() {
	// Draw Shadow
        this.ctx_shadow.save();
        this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);

        this.ctx_shadow.fillStyle = "#000000";

        canvas_draw_rounded_rectangle(
	    this.ctx_shadow,
	    this.pos.x + this.offset,
	    this.pos.y,
	    sizes.laser.width,
	    sizes.laser.height,
	    sizes.laser.width / 2,
	);
        this.ctx_shadow.fill();

        canvas_draw_rounded_rectangle(
	    this.ctx_shadow,
	    this.pos.x + this.offset + sizes.laser.spacing,
	    this.pos.y,
	    sizes.laser.width,
	    sizes.laser.height,
	    sizes.laser.width / 2,
	);
        this.ctx_shadow.fill();

        this.ctx_shadow.restore();

	// Draw Laser
        this.ctx.fillStyle = this.color;

        canvas_draw_rounded_rectangle(
	    this.ctx,
	    this.pos.x + this.offset,
	    this.pos.y,
	    sizes.laser.width,
	    sizes.laser.height,
	    sizes.laser.width / 2,
	);
        this.ctx.fill();

        canvas_draw_rounded_rectangle(
	    this.ctx,
	    this.pos.x + this.offset + sizes.laser.spacing,
	    this.pos.y,
	    sizes.laser.width,
	    sizes.laser.height,
	    sizes.laser.width / 2,
	);
        this.ctx.fill();
    }
}

class Particle{
    constructor(ctx, x, y, c){
        this.ctx = ctx;

        this.pos = {
            x: x,
            y: y,
        };

        this.color = c;

        this.speed = {
            x: Math.random() * 70 - 35,
            y: Math.random() * -300
        };

        this.life = 0;
	this.remove = false;

        this.flip_speed = Math.random() * 10 - 5;
        this.rotation_speed = Math.random() * 10 - 5;
    }

    move(ms){
        if (isNaN(ms))
            return;

        // Gravity
        this.speed.y += 15;

        // Wind resistance
        this.speed.x *= .99;

        // Move
        this.pos.x += this.speed.x * ms / 200;
        this.pos.y += this.speed.y * ms / 5000;

        this.life += ms;

	// Delete
	if (this.pos.y > sizes.arena.height)
	    this.remove = true;
    }

    render(){
        let width = 10;
        let height = 10 * Math.sin(this.flip_speed * this.life);

        this.ctx.save()
        this.ctx.translate(this.pos.x, this.pos.y);
        this.ctx.rotate(this.life * this.rotation_speed / 100);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0 - width/2, 0 - height/2, width, height);
        this.ctx.restore();
    }
}
