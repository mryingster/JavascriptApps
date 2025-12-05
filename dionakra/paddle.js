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

    move(x) {
        this.pos.x = x - (this.width / 2);
        this.collide();
        return;
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

    render() {
	// Draw Shadow
        canvas_draw_rounded_rectangle(this.ctx_shadow, this.pos.x+sizes.shadow_offset.horizontal, this.pos.y+sizes.shadow_offset.vertical, this.width, this.height, this.radius);
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fill();

	this.ctx_shadow.moveTo(this.pos.x, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fill();

	this.ctx_shadow.moveTo(this.pos.x + this.width, this.light_vertical_center);
        this.ctx_shadow.beginPath();
        this.ctx_shadow.arc(this.pos.x + this.width, this.light_vertical_center, sizes.ball.radius, 0, 2*Math.PI);
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fill();

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
	this.ctx.fillStyle = this.gradient_grey;
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x + (this.width/2) - (sizes.paddle.middle_width / 2), this.pos.y, sizes.paddle.middle_width, this.height, this.radius);
        this.ctx.fill();

	// Red edges
	this.ctx.fillStyle = this.gradient_red;
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();
	canvas_draw_rounded_rectangle(this.ctx, this.pos.x + this.width - sizes.paddle.side_width, this.pos.y, sizes.paddle.side_width, this.height, this.radius);
        this.ctx.fill();
    }
}
