const brick_types = [
    {note: "0 Gold",   type: 0, h:  55, s: 100, l:  50, hits: -1, bevel: .5},
    {note: "1 Silver", type: 1, h:   0, s:   0, l:  50, hits:  2, bevel: .5},
    {note: "2 Red",    type: 2, h:   0, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "3 Orange", type: 3, h:  40, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "4 Yellow", type: 4, h:  60, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "5 Green",  type: 5, h: 120, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "6 Cyan",   type: 6, h: 180, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "7 Blue",   type: 7, h: 220, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "8 Purple", type: 8, h: 290, s: 100, l:  50, hits:  1, bevel: .125},
    {note: "9 White",  type: 9, h:   0, s:   0, l:  90, hits:  1, bevel: .125},
]

class Brick {
    constructor(ctx, ctx_shadow, x, y, style) {
        this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

	this.type = style.type;

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

        this.drop_chance = .1;
        if (this.type <= 1)
            this.drop_chance = 0;
        this.hits = style.hits;
    }

    hit() {
        this.hits--;

        if (this.hits === 0 && Math.random() <= this.drop_chance)
            pills.push(new Pill(ctx_dynamic, ctx_shadow,  this.pos.x, this.pos.y + this.height, pill_types[Math.floor(Math.random() * pill_types.length)]));
    }

    render() {
        // Shadow
        this.ctx_shadow.fillStyle = "#000";
        this.ctx_shadow.fillRect(this.pos.x+sizes.shadow_offset.horizontal, this.pos.y+sizes.shadow_offset.vertical, this.width, this.height);

        // Fill in background color
        this.ctx.fillStyle = this.colors[2];
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        // North edge
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.lineTo(this.pos.x + this.bevel, this.pos.y + this.bevel);
        this.ctx.lineTo(this.pos.x + this.width - this.bevel, this.pos.y + this.bevel);
        this.ctx.lineTo(this.pos.x + this.width, this.pos.y);
        this.ctx.fillStyle = this.colors[4];
        this.ctx.fill();

        // East edge
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x + this.width, this.pos.y);
        this.ctx.lineTo(this.pos.x + this.width - this.bevel, this.pos.y + this.bevel);
        this.ctx.lineTo(this.pos.x + this.width - this.bevel, this.pos.y + this.height - this.bevel);
        this.ctx.lineTo(this.pos.x + this.width, this.pos.y + this.height);
        this.ctx.fillStyle = this.colors[1];
        this.ctx.fill();

        // South edge
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y + this.height);
        this.ctx.lineTo(this.pos.x + this.bevel, this.pos.y  + this.height - this.bevel);
        this.ctx.lineTo(this.pos.x + this.width - this.bevel, this.pos.y + this.height - this.bevel);
        this.ctx.lineTo(this.pos.x + this.width, this.pos.y + this.height);
        this.ctx.fillStyle = this.colors[0];
        this.ctx.fill();

        // West edge
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.lineTo(this.pos.x + this.bevel, this.pos.y + this.bevel);
        this.ctx.lineTo(this.pos.x + this.bevel, this.pos.y + this.height - this.bevel);
        this.ctx.lineTo(this.pos.x, this.pos.y + this.height);
        this.ctx.fillStyle = this.colors[3];
        this.ctx.fill();
    }
}
