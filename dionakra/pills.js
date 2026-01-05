const PU_NONE        = 0;
const PU_SLOW        = 1;
const PU_CATCH	     = 2;
const PU_EXPAND	     = 3;
const PU_DISRUPT     = 4;
const PU_LASER	     = 5;
const PU_BREAK	     = 6;
const PU_PLAYER	     = 7;
const PU_TWIN	     = 8;
const PU_MEGABALL    = 9;
const PU_ILLUSION    = 10;
const PU_REDUCE	     = 11;
const PU_NEW_DISRUPT = 12;
const PU_AUTO_PILOT  = 13;

const pill_types = [
    { note: "NONE",        type: PU_NONE,        text: "-", c1: {h:   0, s:  50, l:  50}, c2: "#ff0", weight: 0 },
    { note: "Slow",        type: PU_SLOW,        text: "S", c1: {h:  40, s: 100, l:  50}, c2: "#ff0", weight: 5 },
    { note: "Catch",       type: PU_CATCH,       text: "C", c1: {h: 120, s: 100, l:  50}, c2: "#ff0", weight: 5 },
    { note: "Expand",      type: PU_EXPAND,      text: "E", c1: {h: 240, s: 100, l:  50}, c2: "#ff0", weight: 5 },
    { note: "Disrupt",     type: PU_DISRUPT,     text: "D", c1: {h: 180, s: 100, l:  50}, c2: "#ff0", weight: 5 },
    { note: "Laser",       type: PU_LASER,       text: "L", c1: {h:   0, s: 100, l:  50}, c2: "#ff0", weight: 5 },
    { note: "Break",       type: PU_BREAK,       text: "B", c1: {h: 300, s:  85, l:  85}, c2: "#ff0", weight: 1 },
    { note: "Player",      type: PU_PLAYER,      text: "P", c1: {h:   0, s:   0, l:  50}, c2: "#08f", weight: 2 },
    { note: "Twin",        type: PU_TWIN,        text: "T", c1: {h: 200, s: 100, l:  30}, c2: "#ff0", weight: 4 },
    { note: "Megaball",    type: PU_MEGABALL,    text: "M", c1: {h: 300, s: 100, l:  50}, c2: "#ff0", weight: 3 },
    { note: "Illusion",    type: PU_ILLUSION,    text: "I", c1: {h: 120, s: 100, l:  25}, c2: "#ff0", weight: 4 },
    { note: "Reduce",      type: PU_REDUCE,      text: "R", c1: {h:   0, s:   0, l:  10}, c2: "#ff0", weight: 3 },
    { note: "New Disrupt", type: PU_NEW_DISRUPT, text: "N", c1: {h:   0, s:   0, l:  90}, c2: "#ff0", weight: 3 },
    { note: "Auto Pilot",  type: PU_AUTO_PILOT,  text: "A", c1: {h:  60, s: 100, l:  50}, c2: "#ff0", weight: 7 },
]

let weighted_pills = [];

function drop_pill(x=null, y=null, type=null) {
    if (x === null) x = sizes.canvas.width / 2;
    if (y === null) y = sizes.arena.height / 2;

    if (type == null) {
        // Populate our list if this is first time
        if (weighted_pills.length == 0) {
            for (let type of pill_types)
                for (let i=0; i<type.weight; i++)
                    weighted_pills.push(type.type);
        }

        // Select random powerup
        type = weighted_pills[Math.floor(Math.random() * weighted_pills.length)];
    }

    pills.push(
        new Pill(
            ctx_dynamic,
            ctx_shadow_dynamic,
            x,
            y,
            pill_types[type]
        )
    );
}

function reset_pills() {
    pills = [];
}

function reset_powerups() {
    current_powerup = PU_NONE;

    for (let ball of balls)
	ball.is_mega = false;

    new_disrupt = false;
}

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
        if (this.pos.y > sizes.arena.height)
            this.remove = true;

        // Check if collided with paddle
	const paddle_center = paddle.pos.x + (paddle.width / 2);
	const twin_center = paddle_center + paddle.twin_offset;
	if (this.pos.y + this.height >= paddle.pos.y && this.pos.y <= paddle.pos.y + paddle.height) {
	    let twin_intersect = false;
	    let paddle_intersect = Math.abs(this.pos.x + (this.width / 2) - paddle_center) < paddle.width / 2
	    if (current_powerup == PU_TWIN)
		twin_intersect = Math.abs(this.pos.x + (this.width / 2) - twin_center) < paddle.width / 2
	    if (paddle_intersect || twin_intersect) {
		this.remove = true;

		// Reset things
		reset_powerups();

		current_powerup = this.type;

                switch (this.type) {
                case PU_PLAYER:
                    play_sound("PLAYER_EXTEND");
                    break;
                case PU_EXPAND:
                    play_sound("PADDLE_EXPAND");
                    break;
                case PU_REDUCE:
                    play_sound("PADDLE_SHRINK");
                    break;
                }
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
