const ENEMY_WANDER = 0;
const ENEMY_DROP = 1;

const enemy_types = [
    {note:"Red Cube",       type:ENEMY_WANDER, spriteRow:0,  spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 1,  indestructible: false, explosionRow:12},
    {note:"Green Pyramid",  type:ENEMY_WANDER, spriteRow:2,  spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 3,  indestructible: false, explosionRow:12},
    {note:"Blue Cone",      type:ENEMY_WANDER, spriteRow:4,  spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 5,  indestructible: false, explosionRow:12},
    {note:"TriColor Balls", type:ENEMY_WANDER, spriteRow:6,  spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 7,  indestructible: false, explosionRow:12},
    {note:"Red Orbiter",    type:ENEMY_WANDER, spriteRow:8,  spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 9,  indestructible: false, explosionRow:12},
    {note:"Blue Saturn",    type:ENEMY_WANDER, spriteRow:10, spriteCols:36, spriteWidth:64, spriteHeight:64, shadowRow: 11, indestructible: false, explosionRow:12},
];

const ENEMY_RANDOM         = -1;
const ENEMY_RED_CUBE       = 0;
const ENEMY_GREEN_PYRAMID  = 1;
const ENEMY_BLUE_CONE      = 2;
const ENEMY_TRICOLOR_BALLS = 3;
const ENEMY_RED_ORBITER    = 4;
const ENEMY_BLUE_SATURN    = 5;
// Placeholders until renders are made
const ENEMY_BLUE_BOUNCER   = 2;

function reset_enemies() {
    enemies = [];
}

function add_enemy(t) {
    let ypos = (sizes.enemy.height + sizes.frame.top) * -1;

    // Randomly choose left/right
    let xpos = sizes.enemy.left_entry;
    if (Math.random() >= .5)
        xpos = sizes.enemy.right_entry;

    if (t == ENEMY_RANDOM) {
	t = Math.floor(Math.random() * 5);
    }
    enemies.push(new Enemy(ctx_dynamic, ctx_shadow_dynamic, xpos, ypos, enemy_types[t]))
}

async function loadImageBitmap(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await createImageBitmap(blob);
}

class Enemy {
    constructor(ctx, ctx_shadow, x, y, style) {
        this.ctx = ctx;
        this.ctx_shadow = ctx_shadow;

        this.type = style.type;

        this.indestructible = style.indestructible;
        this.explosionRow = style.explosionRow;

        this.width  = sizes.enemy.width;
        this.height = sizes.enemy.height;
        this.radius = sizes.enemy.radius;

        this.spriteRow = style.spriteRow;
        this.shadowRow = style.shadowRow
        this.spriteSize = {
            w: style.spriteWidth,
            h: style.spriteHeight,
        };
        this.spriteIndex = 0;
        this.spriteTime = 0;
        this.spriteAnimationSpeed = 100; // ms before updating frame
        this.numberOfSprites = 36;

        this.explosionState = -1;
        this.explosionTime = 0;
        this.explosionAnimationSpeed = 100;

        this.pos = {
            x: x,
            y: y,
        }

        // Enemies start off screen, so the first target destination
        // will be directly down from off-screen

        this.target = {
            x: x,
            y: y + 100,
        }

        this.dir = {
            x: 0,
            y: 0,
        };

        this.speed = .05;

        this.ignore = false;
        this.remove = false;
    }

    hit() {
        if (!this.indestructible) {
	    update_score(100);
            play_sound("ENEMY_HIT");
            this.explosionState = 0;
            this.ignore = true;
        }
    }

    move(ms) {
        if (isNaN(ms))
            return;

        // Update sprite index for animation
        this.spriteTime += ms;
        if (this.spriteTime > this.spriteAnimationSpeed) {
            this.spriteTime -= this.spriteAnimationSpeed;
            this.spriteIndex++;
            this.spriteIndex %= this.numberOfSprites;
        }

        // Update explosion index for animation
        if (this.explosionState > -1) {
            this.explosionTime += ms;
            if (this.explosionTime > this.explosionAnimationSpeed) {
                this.explosionState++;
                if (this.explosionState >= this.numberOfSprites) {
                    this.remove = true;
                }
            }
        }


        const dx = this.target.x - this.pos.x;
        const dy = this.target.y - this.pos.y;

        const dist = Math.hypot(dx, dy);

        // Already at target
        if (dist === 0) return;

        const moveDist = this.speed * ms;

        // If we would overshoot, clamp to target
        if (moveDist >= dist) {
            this.pos.x = this.target.x;
            this.pos.y = this.target.y;
            this.find_new_target();
            return;
        }

        // Normalize direction
        const nx = dx / dist;
        const ny = dy / dist;

        // Store direction so we can bias future movement
        this.dir.x = nx;
        this.dir.y = ny;

        // calc new postion
        const dx2 = nx * moveDist;
        const dy2 = ny * moveDist;;
        const newX = this.pos.x + dx2;
        const newY = this.pos.y + dy2;

        // Look for obstacles and collisions
        const enemy_top    = newY;
        const enemy_bottom = newY + this.height;
        const enemy_left   = newX;
        const enemy_right  = newX + this.width;

        // Walls (Top)
        if (enemy_top <= sizes.arena.top && this.target.y <= sizes.arena.top) {
            this.find_new_target();
            return;
        }

        // Walls (Left/Right)
        if (enemy_right >= sizes.arena.right || enemy_left <= sizes.arena.left) {
            this.find_new_target();
            return;
        }

        // Off the screen bottom - Delete
        if (enemy_top >= sizes.arena.bottom) {
            this.remove = true;
        }

        // Bricks
        for (let brick of bricks) {
            const brick_top    = brick.pos.y;
            const brick_bottom = brick.pos.y + brick.height;
            const brick_left   = brick.pos.x;
            const brick_right  = brick.pos.x + brick.width;

            if (enemy_top < brick_bottom && enemy_bottom > brick_top &&
                enemy_left < brick_right && enemy_right > brick_left) {
                this.find_new_target();
                return;
            }
        }

        // Move
        this.pos.x += dx2;
        this.pos.y += dy2;
    }

    find_new_target() {
        const maxDistance = 100;

        let angle;
        let tries = 0;

        while (true) {
            // Random angle
            angle = Math.random() * Math.PI * 2;

            const dx = Math.cos(angle);
            const dy = Math.sin(angle);

            // Dot product with current direction
            const dot = dx * this.dir.x + dy * this.dir.y;

            // Prefer forward movement (dot > 0 means same hemisphere)
            if (dot > -0.2 || tries > 10) {
                break;
            }

            tries++;
        }

        const distance = Math.random() * maxDistance;

        this.target.x = this.pos.x + Math.cos(angle) * distance;
        this.target.y = this.pos.y + Math.sin(angle) * distance;
    }

    render() {
        if (this.explosionState < 16) {
            // Draw Shadow
            this.ctx_shadow.save();
            this.ctx_shadow.translate(sizes.shadow_offset.horizontal, sizes.shadow_offset.vertical);

            this.ctx_shadow.drawImage(
                enemy_sprites,
                this.spriteSize.w * this.spriteIndex,
                this.shadowRow * this.spriteSize.h,
                this.spriteSize.w,
                this.spriteSize.h,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height,
            );

            this.ctx_shadow.restore();

            // Draw enemy sprite
            this.ctx.drawImage(
                enemy_sprites,
                this.spriteSize.w * this.spriteIndex,
                this.spriteRow * this.spriteSize.h,
                this.spriteSize.w,
                this.spriteSize.h,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height,
            );
        }

        // Draw Explosion
        if (this.explosionState > -1) {
            this.ctx.drawImage(
                enemy_sprites,
                this.spriteSize.w * this.explosionState,
                this.explosionRow * this.spriteSize.h,
                this.spriteSize.w,
                this.spriteSize.h,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height,
            );
        }


        // Draw enemy target DEBUG
        /*
        canvas_draw_rounded_rectangle(this.ctx, this.target.x, this.target.y, 5, 5, 5);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        */
    }
}
