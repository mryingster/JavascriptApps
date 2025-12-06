class Paddle {
    constructor(ctx, ctx_shadow) {
	this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;
        this.width = sizes.paddle.width;
        this.height = sizes.paddle.height;

	this.pos = {
	    x: this.ctx.canvas.width / 2,
	    y: this.ctx.canvas.height - this.ctx.canvas.height / 14 - this.height,
	};


        this.color_outer = "#ffffff";
        this.color_inner = "#00ffff";

	this.current_powerup = null;

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
	this.gradient_red.addColorStop(.6,   "#fe5d24");
	this.gradient_red.addColorStop(1,   "#bb2e15");

	this.light_vertical_center = this.pos.y + (this.height / 2)
	this.bulb_color = {h:180, s:95, l:52.94}; //"#15f9f9"
	this.blink = 0;
    }

    get_pos_center() {
	return this.pos.x + (this.width / 2);
    }

    reset() {
	this.pos.x = this.ctx.canvas.width / 2;
	this.pos.y = this.ctx.canvas.height - this.ctx.canvas.height / 14 - this.height;
    }

    set_pos(x) {
        this.pos.x = x - (this.width / 2);
        this.collide();
        return;
    }

    move(ms) {
        if (isNaN(ms))
            return;

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

        if (this.pos.x + this.width > sizes.arena.right)
            this.pos.x = sizes.arena.right - this.width;
    }

    hsl_to_string(h, s, l) {
	return `hsl(${h}, ${s}%, ${l}%)`
    }

    render_normal_paddle() {
	// Draw Shadow
        this.ctx_shadow.save();
        this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);

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
    }

    render_laser_paddle() {
	// Draw Shadow
        // this.ctx_shadow.save();
        // this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);
        // this.ctx_shadow.fillStyle = "#000000";

        // this.ctx_shadow.fill();
        // this.ctx_shadow.restore();

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
	let middle_width = this.width - (sizes.paddle.side_width * 2);
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

    render() {
	if (current_powerup == PU_LASER)
	    this.render_laser_paddle();
	else
	    this.render_normal_paddle()
	return;;
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
		brick.hit();
		this.remove = true;
	    }

	    // Check right
	    if (this.pos.x + sizes.laser.spacing + this.offset > brick.pos.x &&
		this.pos.x + sizes.laser.spacing + this.offset < brick.pos.x + brick.width &&
		this.pos.y > brick.pos.y &&
		this.pos.y < brick.pos.y + brick.height) {
		brick.hit();
		this.remove = true;
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
