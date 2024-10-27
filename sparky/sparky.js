const STOP  = -1;
const LEFT  = 0;
const RIGHT = 1;
const UP    = 2;
const DOWN  = 3;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(pt) {
        return new Point(this.x - pt.x, this.y - pt.y);
    }

    add(pt) {
        return new Point(this.x + pt.x, this.y + pt.y);
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

function random_color() {
        let color = "#"
        for (let c=0; c<3; c++){
            let t = Math.floor(Math.random() * 255);
            t = t.toString(16);
            if (t.length < 2) t = "0" + t;
            color += t;
        }
        return color;
}

function draw_circle(ctx, x, y, r, c1, c2, l=0){
    ctx.save()
    ctx.fillStyle = c1;
    ctx.lineWidth = l;
    ctx.strokeStyle = c2;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);

    ctx.fill();
    if (l>0)
        ctx.stroke();
    ctx.restore()
}

class Player {
    constructor(ctx, starting_segment, starting_pos) {
        this.ctx = ctx;
        this.color = "#00ff00";
        this.size = "3"
        this.pos = starting_pos;
        this.segment = starting_segment;

        this.path = [];

        this.dir = -1;
        this.last_dir = -1;

        this.speed = .2;
    }

    move(ms, edges) {
        if (this.up && this.down) return;
        if (this.left && this.right) return;

        let line1 = edges.get(this.segment);
        let diff = line1.p1.sub(line1.p2);

        let horizontal = diff.y == 0;

        // let minx = Math.min(line1.x, pt2.x),
        //     maxx = Math.max(line1.x, pt2.x),
        //     miny = Math.min(line1.y, pt2.y),
        //     maxy = Math.max(line1.y, pt2.y);

        // Corner Cases
        if (horizontal &&
            (this.pos.x == line1.p1.x || // start of current segment
             this.pos.x == line1.p2.x)) { // end of current segment
            let [next_line, next_idx] = this.pos.x == line1.p1.x ? edges.prev(this.segment) : edges.next(this.segment);
            let next_line_diff = this.pos.x == line1.p1.x ? next_line.p2.sub(next_line.p1) : next_line.p1.sub(next_line.p2);
            if (next_line_diff.y < 0 && this.dir == DOWN) {
                this.pos.y += this.speed * ms;
                this.segment = next_idx;
            } else if (next_line_diff.y > 0 && this.dir == UP) {
                this.pos.y -= this.speed * ms;
                this.segment = next_idx;
            }
        }

        if (!horizontal &&
            (this.pos.y == line1.p1.y || // start of current segment
             this.pos.y == line1.p2.y)) { // end of current segment
            let [next_line, next_idx] = this.pos.y == line1.p1.y ? edges.prev(this.segment) : edges.next(this.segment);
            let next_line_diff = this.pos.y == line1.p1.y ? next_line.p2.sub(next_line.p1) : next_line.p1.sub(next_line.p2);
            if (next_line_diff.x < 0 && this.dir == RIGHT) {
                this.pos.x += this.speed * ms;
                this.segment = next_idx;
            } else if (next_line_diff.x > 0 && this.dir == LEFT) {
                this.pos.x -= this.speed * ms;
                this.segment = next_idx;
            }
        }

        // // Keep track of our path
        // if (this.dir != this.last_dir) {
        //     if (this.pos.x != margin && this.pos.x != this.ctx.canvas.width - margin &&
        //         this.pos.y != margin && this.pos.y != this.ctx.canvas.height - margin)
        //         this.path.push({x:this.pos.x, y:this.pos.y});
        //     else {
        //         if (this.path.length > 0) {
        //             // Close our shape - Not working yet
        //             if (this.path[0].x != this.path[this.path.length-1].x)
        //                 this.path.push({x:this.path[0].x, y:this.path[this.path.length-1].y});
        //             if (this.path[0].y != this.path[this.path.length-1].y)
        //                 this.path.push({x:this.path[this.path.length-1].x, y:this.path[0].y});
        //             shapes.push({c: random_color(), p: this.path})
        //         }
        //         this.path = [];
        //     }
        // }

        if (horizontal && this.dir == LEFT)
            this.pos.x -= this.speed * ms;
        if (horizontal && this.dir == RIGHT)
            this.pos.x += this.speed * ms;
        if (!horizontal && this.dir == UP)
            this.pos.y -= this.speed * ms;
        if (!horizontal && this.dir == DOWN)
            this.pos.y += this.speed * ms;

        this.pos.x = clamp(this.pos.x, Math.min(line1.p1.x, line1.p2.x), Math.max(line1.p1.x, line1.p2.x))
        this.pos.y = clamp(this.pos.y, Math.min(line1.p1.y, line1.p2.y), Math.max(line1.p1.y, line1.p2.y))

        // if (this.pos.x < margin) this.pos.x = margin;
        // if (this.pos.x > this.ctx.canvas.width - margin) this.pos.x = this.ctx.canvas.width - margin;
        // if (this.pos.y < margin) this.pos.y = margin;
        // if (this.pos.y > this.ctx.canvas.height - margin) this.pos.y = this.ctx.canvas.height - margin;
    }

    render() {
        // // Draw path if we are out and about
        // if (this.path.length > 0) {
        //     this.ctx.beginPath()
        //     this.ctx.moveTo(this.path[0].x, this.path[0].y);
        //     for (let point of this.path)
        //         ctx.lineTo(point.x, point.y);
        //     ctx.strokeStyle = "#00ffff";
        //     ctx.stroke();
        // }

        // Draw player
        draw_circle(this.ctx, this.pos.x, this.pos.y, this.size, this.color, this.color, 0);
    }
}

function clamp(v, min, max) {
    return Math.min(Math.max(min, v), max);
}

class Edges {
    constructor(edges) {
        this.edges = edges
    }

    get(index) {
        return new Line(this.edges[index], this.edges[this.next_index(index)]);
    }

    next_index(index) {
        return (index+1) % this.edges.length;
    }
    next(index) {
        index = this.next_index(index);
        return [this.get(index), index]
    }

    prev_index(index) {
        if (index == 0)
            return this.edges.length-1;
        else
            return index-1;
    }
    prev(index) {
        index = this.prev_index(index);
        return [this.get(index), index];
    }

    len() {
        return this.edges.length;
    }
}

class Enemy {
    constructor(ctx) {
        this.ctx = ctx;
    }

    move(ms) {
    }

    render() {
    }
}

class Game {
    constructor(canvas) {
        this.margin = 5;
        this.last_frame;

        this.ctx = canvas.getContext("2d");
        canvas.width  = 1024;
        canvas.height = 768;

        this.game = { width: canvas.width - this.margin * 2,
                      height: canvas.height - this.margin * 2 };

        // Keyboard listeners
        document.addEventListener('keydown', (e) => {
            //console.log(e);
            if (e.keyCode == 37) {e.preventDefault(); this.player1.dir = LEFT};
            if (e.keyCode == 38) {e.preventDefault(); this.player1.dir = UP};
            if (e.keyCode == 39) {e.preventDefault(); this.player1.dir = RIGHT};
            if (e.keyCode == 40) {e.preventDefault(); this.player1.dir = DOWN};
        });

        document.addEventListener('keyup', (e) => {
            if (e.keyCode == 37) {e.preventDefault(); if (this.player1.dir == LEFT)  this.player1.dir = STOP};
            if (e.keyCode == 38) {e.preventDefault(); if (this.player1.dir == UP)    this.player1.dir = STOP};
            if (e.keyCode == 39) {e.preventDefault(); if (this.player1.dir == RIGHT) this.player1.dir = STOP};
            if (e.keyCode == 40) {e.preventDefault(); if (this.player1.dir == DOWN)  this.player1.dir = STOP};
        });
    }

    reset_canvas() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    start_game() {
        this.edges = new Edges([
            new Point(0,0),
            new Point(this.game.width,0),
            new Point(this.game.width, this.game.height),
            new Point(0, this.game.height),
        ]);
        this.enemy1  = new Enemy(this.ctx);
        this.player1 = new Player(this.ctx, 0, new Point(0,0));

        this.shapes = [];

        this.main_loop(document.timeline.currentTime);
    }

    main_loop(timestamp) {
        if (this.last_frame === undefined) {
            this.last_frame = timestamp;
        }
        const elapsed = timestamp - this.last_frame;

        // Clear canvas
        this.reset_canvas();

        this.ctx.save();
        this.ctx.translate(this.margin, this.margin);

        this.ctx.strokeStyle = "#fff";
        this.ctx.strokeRect(0, 0, this.game.width, this.game.height);

        // Redraw cleared spaces
        for (let shape of this.shapes.slice().reverse()) {
            this.ctx.save();
            this.ctx.beginPath()
            this.ctx.moveTo(shape.p[0].x, shape.p[0].y);
            for (let point of shape.p)
                this.ctx.lineTo(point.x, point.y);
            this.ctx.fillStyle = shape.c;
            this.ctx.fill();
            this.ctx.strokeStyle = "#fff";
            this.ctx.stroke();
            this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.strokeStyle = "#f00";
        for (let i=0; i<this.edges.len(); i++) {
            let pt = this.edges.get(i);
            this.ctx.moveTo(pt.x, pt.y);
            let [next] = this.edges.next(i);
            this.ctx.lineTo(next.x, next.y);
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Move player
        this.player1.move(elapsed, this.edges);

        // Redraw player
        this.player1.render();

        this.ctx.restore();

        // Loop!
        this.last_frame = timestamp;
        window.requestAnimationFrame((timestamp) => this.main_loop(timestamp));
    }
}

function main(canvas) {
    let game = new Game(canvas);
    game.start_game();
}

main(document.getElementById("canvas"));

