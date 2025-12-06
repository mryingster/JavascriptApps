function reset_powerups() {
    current_powerup = PU_NONE;

    for (let ball of balls)
	ball.is_mega = false;

    new_disrupt = false;
}

const pill_types = [
    {note: "Slow",        type: PU_SLOW,        text: "S", c1: {h:  40, s: 100, l:  50}, c2: "#ff0"}, // Working
    {note: "Catch",       type: PU_CATCH,       text: "C", c1: {h: 120, s: 100, l:  50}, c2: "#ff0"}, // Working
    {note: "Expand",      type: PU_EXPAND,      text: "E", c1: {h: 240, s: 100, l:  50}, c2: "#ff0"}, // Working
    {note: "Disrupt",     type: PU_DISRUPT,     text: "D", c1: {h: 180, s: 100, l:  50}, c2: "#ff0"}, // Working
    {note: "Laser",       type: PU_LASER,       text: "L", c1: {h:   0, s: 100, l:  50}, c2: "#ff0"},
    {note: "Break",       type: PU_BREAK,       text: "B", c1: {h: 300, s:  85, l:  85}, c2: "#ff0"},
    {note: "Player",      type: PU_PLAYER,      text: "P", c1: {h:   0, s:   0, l:  50}, c2: "#08f"}, // Working
    {note: "Twin",        type: PU_TWIN,        text: "T", c1: {h: 200, s: 100, l:  30}, c2: "#ff0"},
    {note: "Megaball",    type: PU_MEGABALL,    text: "M", c1: {h: 300, s: 100, l:  50}, c2: "#ff0"}, // Working
    {note: "Illusion",    type: PU_ILLUSION,    text: "I", c1: {h: 120, s: 100, l:  25}, c2: "#ff0"},
    {note: "Reduce",      type: PU_REDUCE,      text: "R", c1: {h:   0, s:   0, l:  10}, c2: "#ff0"}, // Working
    {note: "New Disrupt", type: PU_NEW_DISRUPT, text: "N", c1: {h:   0, s:   0, l:  90}, c2: "#ff0"}, // Working
]

class Pill {
    constructor(ctx, ctx_shadow, x, y, style) {
        this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

	this.type = style.type;

        this.width = sizes.brick.width;
        this.height = sizes.brick.height;
        this.radius = sizes.pill.radius;

        this.letter = style.text;
        this.scroll = 0;

        this.pill_colors = [
            `hsl(${style.c1.h}, ${style.c1.s}%, ${style.c1.l}%)`,
            `hsl(${style.c1.h}, ${style.c1.s}%, ${style.c1.l - 10}%)`,
            `hsl(${style.c1.h}, ${style.c1.s}%, ${style.c1.l + 50}%)`,
        ]

        this.letter_color = style.c2;

        this.pos = {
            x: x,
            y: y,
        }

        this.remove = false;
    }

    move(ms) {
        if (isNaN(ms))
            return;

        // Descend
        this.pos.y += .1 * ms;

        // Check if off the screen
        if (this.pos.y > sizes.canvas.height)
            this.remove = true;

        // Check if collided with paddle
	const paddle_center = paddle.pos.x + (paddle.width / 2);
	if (this.pos.y + this.height >= paddle.pos.y) {
	    if (Math.abs(this.pos.x - paddle_center) < paddle.width / 2) {
		this.remove = true;

		// Reset things
		reset_powerups();

		current_powerup = this.type;
	    }
	}

        // Animate
        this.scroll += .05 * ms;
        if (this.scroll > this.height * 2)
            this.scroll = 0;
    }

    render() {
	// Draw Shadow
        this.ctx_shadow.save();
        this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);

        canvas_draw_rounded_rectangle(this.ctx_shadow, this.pos.x, this.pos.y, this.width, this.height, this.radius);
        this.ctx_shadow.fill();

        this.ctx_shadow.restore();

        // Draw Pill
        canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y, this.width, this.height, this.radius);
        this.ctx.fillStyle = this.pill_colors[0];
        this.ctx.fill();

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = this.pill_colors[1];
        this.ctx.stroke();

        canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y + (this.height * 1/8), this.width, this.height * 2/8, this.radius);
        this.ctx.fillStyle = this.pill_colors[2];
        this.ctx.fill();

        // Draw Text
        this.ctx.save();
        this.ctx.beginPath();
        canvas_draw_rounded_rectangle(this.ctx, this.pos.x, this.pos.y, this.width, this.height, this.radius);
        this.ctx.clip();

        this.ctx.font = "bold 18px Arial";
        this.ctx.textAlign = "center";
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#000";
        this.ctx.strokeText(this.letter, this.pos.x + (this.width / 2), this.pos.y + this.scroll);
        this.ctx.fillStyle = this.letter_color;
        this.ctx.fillText(this.letter, this.pos.x + (this.width / 2), this.pos.y + this.scroll);

        this.ctx.restore()
    }
}
