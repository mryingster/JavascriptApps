const brick_types = {
    0x10: {note: "Stationary White",  type: 9, h:   0, s:   0, l:  90, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score:  50, bevel: .125},
    0x20: {note: "Stationary Orange", type: 3, h:  35, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score:  60, bevel: .125},
    0x30: {note: "Stationary Cyan",   type: 6, h: 180, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score:  70, bevel: .125},
    0x40: {note: "Stationary Green",  type: 5, h: 120, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score:  80, bevel: .125},
    0x50: {note: "Stationary Red",    type: 2, h:   0, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score:  90, bevel: .125},
    0x60: {note: "Stationary Blue",   type: 7, h: 215, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score: 100, bevel: .125},
    0x70: {note: "Stationary Purple", type: 8, h: 300, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score: 110, bevel: .125},
    0x80: {note: "Stationary Yellow", type: 4, h:  60, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:false, drop_chance: .1, score: 120, bevel: .125},
    0x90: {note: "Stationary Silver", type: 1, h:   0, s:   0, l:  60, hits:  2, required:true,  permanent:false, regenerate:false, mobile:false, shimmers:true,  drop_chance:  0, score:  50, bevel: .5},
    0xA0: {note: "Stationary Gold",   type: 0, h:  55, s: 100, l:  40, hits: -1, required:false, permanent:true,  regenerate:false, mobile:false, shimmers:true,  drop_chance:  0, score: 200, bevel: .5},
    0xB0: {note: "Stationary Regrow" ,type: 10,h:   0, s:   0, l:  50, hits:  2, required:false, permanent:true,  regenerate:true,  mobile:false, shimmers:true,  drop_chance:  0, score:  50, bevel: .5},

    0x11: {note: "Moveable White",  type: 9, h:   0, s:   0, l:  90, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score:  50, bevel: .125},
    0x21: {note: "Moveable Orange", type: 3, h:  35, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score:  60, bevel: .125},
    0x31: {note: "Moveable Cyan",   type: 6, h: 180, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score:  70, bevel: .125},
    0x41: {note: "Moveable Green",  type: 5, h: 120, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score:  80, bevel: .125},
    0x51: {note: "Moveable Red",    type: 2, h:   0, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score:  90, bevel: .125},
    0x61: {note: "Moveable Blue",   type: 7, h: 215, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score: 100, bevel: .125},
    0x71: {note: "Moveable Purple", type: 8, h: 300, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score: 110, bevel: .125},
    0x81: {note: "Moveable Yellow", type: 4, h:  60, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: .1, score: 120, bevel: .125},
    0x91: {note: "Moveable Silver", type: 1, h:   0, s:   0, l:  60, hits:  2, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:true,  drop_chance:  0, score:  50, bevel: .5},
    0xA1: {note: "Moveable Gold",   type: 0, h:  55, s: 100, l:  40, hits: -1, required:false, permanent:true,  regenerate:false, mobile:true, shimmers:true,  drop_chance:  0, score: 200, bevel: .5},

    0x12: {note: "Drop White",  type: 9, h:   0, s:   0, l:  90, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score:  50, bevel: .125},
    0x22: {note: "Drop Orange", type: 3, h:  35, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score:  60, bevel: .125},
    0x32: {note: "Drop Cyan",   type: 6, h: 180, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score:  70, bevel: .125},
    0x42: {note: "Drop Green",  type: 5, h: 120, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score:  80, bevel: .125},
    0x52: {note: "Drop Red",    type: 2, h:   0, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score:  90, bevel: .125},
    0x62: {note: "Drop Blue",   type: 7, h: 215, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score: 100, bevel: .125},
    0x72: {note: "Drop Purple", type: 8, h: 300, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score: 110, bevel: .125},
    0x82: {note: "Drop Yellow", type: 4, h:  60, s: 100, l:  50, hits:  1, required:true,  permanent:false, regenerate:false, mobile:true, shimmers:false, drop_chance: 1, score: 120, bevel: .125},
}

class Brick {
    constructor(ctx, ctx_dynamic, ctx_shadow, ctx_shadow_dynamic, x, y, style) {
        this.ctx = ctx;
        this.ctx_dynamic = ctx_dynamic;
        this.ctx_shadow = ctx_shadow;
	this.ctx_shadow_dynamic = ctx_shadow_dynamic;

	this.type = style.type;
	this.value = style.score;

        this.width = sizes.brick.width;
        this.height = sizes.brick.height;

        this.colors = [
            `hsl(${style.h}, ${style.s}%, ${style.l - 20}%)`,
            `hsl(${style.h}, ${style.s}%, ${style.l - 10}%)`,
            `hsl(${style.h}, ${style.s}%, ${style.l}%)`,
            `hsl(${style.h}, ${style.s}%, ${style.l + 10}%)`,
            `hsl(${style.h}, ${style.s}%, ${style.l + 30}%)`,
        ]

        this.bevel = style.bevel * this.height;

        this.pos = {
            x: x * this.width + sizes.frame.left,
            y: y * this.height + sizes.frame.top,
        }

        this.drop_chance = style.drop_chance;
        this.hits_required = style.hits;

        // Scale silvers to require extra hit for each 8 levels
        if (this.type == 1) {
            this.hits_required += Math.floor(level / 8);
        }

        this.hits = this.hits_required;
	this.required = style.required;
	this.regenerates = style.regenerate;
	this.mobile = style.mobile;
	this.shimmers = style.shimmers;
	this.permanent = style.permanent;

	this.regenerate_timeout = 5000; // 5 seconds
	this.regenerate_timer = 0;

	this.shimmer = 0;
    }

    hit(remove=false) {
	if (remove === true) {
	    this.hits = 0;
	    if (!this.regenerates) {
		this.remove = true;
	    }
	} else {
            this.hits--;
	    if (this.regenerates) {
		this.hits = Math.max(0, this.hits);
	    }
	}

	// Remove blocks that are none permanent, and out of hits
	if (this.hits <= 0 && !this.permanent) {
            sounds[WALL_HIT_2].play();
	    this.remove = true;
        } else {
            if (this.type == 0) {
                sounds[GOLD_HIT].play();
            } else {
                sounds[SILVER_HIT].play();
            }
        }

	// If this shimmers, shimmer!
	this.start_shimmer();

	// Drop a pill?
        if (this.hits === 0 && Math.random() <= this.drop_chance)
            drop_pill(this.pos.x, this.pos.y + this.height);
    }

    start_shimmer() {
	if (this.shimmers)
	    this.shimmer = 500;
    }

    move(ms) {
        if (isNaN(ms))
            return;

	this.shimmer -= ms;
	this.shimmer = Math.max(this.shimmer, 0);

	if (this.regenerates) {
	    if (this.hits == 0) {
		this.regenerate_timer += ms;
		if (this.regenerate_timer > this.regenerate_timeout) {
		    this.regenerate_timer = 0;
		    this.hits = 2;
		}
	    }
	}
    }

    render_bevel(ctx, ctx_shadow, x, y, w, h) {
	// Shadow
        ctx_shadow.fillStyle = "#000";
        ctx_shadow.fillRect(x + sizes.shadow_offset.horizontal, y + sizes.shadow_offset.vertical, w, h);

        // Fill in background color
        ctx.fillStyle = this.colors[2];
        ctx.fillRect(x, y, w, h);

        // North edge
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.bevel, y + this.bevel);
        ctx.lineTo(x + w - this.bevel, y + this.bevel);
        ctx.lineTo(x + w, y);
        ctx.fillStyle = this.colors[4];
        ctx.fill();

        // East edge
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w - this.bevel, y + this.bevel);
        ctx.lineTo(x + w - this.bevel, y + h - this.bevel);
        ctx.lineTo(x + w, y + h);
        ctx.fillStyle = this.colors[1];
        ctx.fill();

        // South edge
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + this.bevel, y  + h - this.bevel);
        ctx.lineTo(x + w - this.bevel, y + h - this.bevel);
        ctx.lineTo(x + w, y + h);
        ctx.fillStyle = this.colors[0];
        ctx.fill();

        // West edge
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.bevel, y + this.bevel);
        ctx.lineTo(x + this.bevel, y + h - this.bevel);
        ctx.lineTo(x, y + h);
        ctx.fillStyle = this.colors[3];
        ctx.fill();
    }

    render() {
	// Bricks that are gone shouldn't be rendered
	if (this.hits == 0) return;

	// Mobile and Regenerative bricks render elsewhere...
	if (this.mobile == true || this.regenerates == true)
	    return;

	// Regular blocks go to static canvas
	this.render_bevel(this.ctx, this.ctx_shadow, this.pos.x, this.pos.y, this.width, this.height);
    }

    renderShimmer() {
	// If there are no hits left, don't render
	if (this.hits == 0)
	    return;

	// If this is a moving block, it renders on the dynamic canvas
	if (this.mobile == true) {
	    this.render_bevel(this.ctx_dynamic, this.ctx_shadow_dynamic, this.pos.x, this.pos.y, this.width, this.height);
	}

	// If this is a regenerating block, it renders on dynamic canvas twice
	if (this.regenerates == true) {
	    this.render_bevel(this.ctx_dynamic, this.ctx_shadow_dynamic, this.pos.x, this.pos.y, this.width / 2, this.height);
	    this.render_bevel(this.ctx_dynamic, this.ctx_shadow_dynamic, this.pos.x + (this.width / 2), this.pos.y, this.width / 2, this.height);
	}

	if (this.shimmer > 0) {
	    let offset = -this.width + ((500 - this.shimmer)/500 * 3 * this.width);
	    this.ctx_dynamic.save();
	    this.ctx_dynamic.rect(this.pos.x, this.pos.y, this.width, this.height);
            this.ctx_dynamic.clip();

	    this.ctx_dynamic.beginPath();
	    this.ctx_dynamic.moveTo(this.pos.x + offset, this.pos.y);
            this.ctx_dynamic.lineTo(this.pos.x + offset + this.width, this.pos.y);
            this.ctx_dynamic.lineTo(this.pos.x + offset + (this.width / 2), this.pos.y + (this.height / 2));
            this.ctx_dynamic.lineTo(this.pos.x + offset + (this.width / 4), this.pos.y + this.height);
            this.ctx_dynamic.lineTo(this.pos.x + offset, this.pos.y + this.height);
            this.ctx_dynamic.lineTo(this.pos.x + offset - (this.width / 2), this.pos.y + this.height);
            this.ctx_dynamic.lineTo(this.pos.x + offset - (this.width / 4), this.pos.y + (this.height / 2));
            this.ctx_dynamic.fillStyle = "rgba(255, 255, 255, .75)";
            this.ctx_dynamic.fill();

	    this.ctx_dynamic.restore();
	}
    }
}
