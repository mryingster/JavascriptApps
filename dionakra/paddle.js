class Paddle {
    constructor(ctx, ctx_shadow) {
	this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

        this.width = this.ctx.canvas.width / 7;
        this.height = this.ctx.canvas.height / 28;

	this.pos = {
	    x: this.ctx.canvas.width / 2,
	    y: this.ctx.canvas.height - this.ctx.canvas.height / 14 - this.height,
	};


        this.color_outer = "#ffffff";
        this.color_inner = "#00ffff";
        this.color_shadow = "rgba(0, 0, 0, .5)";
        this.radius = 5;
        this.border = 2;

	this.curve_height = .25;
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

    collide() {
        if (this.pos.x < sizes.arena.left)
            this.pos.x = sizes.arena.left;

        if (this.pos.x + this.width > sizes.arena.right)
            this.pos.x = sizes.arena.right - this.width;
    }

    render() {
        canvas_draw_rounded_rectangle(this.ctx_shadow, this.pos.x+sizes.shadow_offset.horizontal, this.pos.y+sizes.shadow_offset.vertical, this.width, this.height, this.radius);
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fill();

        canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y, this.width, this.height, this.radius);
        this.ctx_shadow.fillStyle = "#f00";
        this.ctx.fill();
    }
}
