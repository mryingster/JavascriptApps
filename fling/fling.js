class fling_instance {
    constructor(parent, width, board, interactive, arrow) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = Math.floor(width / 1536 * 1968);

	// Rules
        this.interactive = interactive;
	this.arrow_pos = arrow;

	// Overlay info
	this.mousedown = false;
	this.highlight = null;

	// Fling Board Information
	this.width = 7;
	this.height = 9;

        // Size and spacing info
        this.ratio = width / 1536;
        this.left_padding = 70 * this.ratio;
        this.top_padding = 70 * this.ratio;
        this.square_size = 200 * this.ratio;
	this.shadow_size = 300 * this.ratio;;

	// Images that need to be loaded
        this.background = new Image();
        this.background.src = "images/Fling_Background.jpg";
        this.background.onload = () => { this.update(); };

	this.shadow = new Image();
	this.shadow.src = "images/shadow.png"
        this.background.onload = () => { this.update(); };

	this.arrows = {
	    left  : new Image(),
	    right : new Image(),
	    up    : new Image(),
	    down  : new Image(),
	};

	this.arrows.up.src       = "images/arrow_up.png";
	this.arrows.up.onload    = () => { this.update(); };
	this.arrows.right.src    = "images/arrow_right.png";
	this.arrows.right.onload = () => { this.update(); };
	this.arrows.left.src     = "images/arrow_left.png";
	this.arrows.left.onload  = () => { this.update(); };
	this.arrows.down.src     = "images/arrow_down.png";
	this.arrows.down.onload  = () => { this.update(); };

	this.furries = [];
	this.furries_src = [
	    "images/Fling_Blue.png",
	    "images/Fling_Cyan.png",
	    "images/Fling_Green.png",
	    "images/Fling_Orange.png",
	    "images/Fling_Pink.png",
	    "images/Fling_Purple.png",
	    "images/Fling_Red.png",
	    "images/Fling_Yellow.png"
	];
	for (let i of this.furries_src) {
	    this.furries.push(new Image());
	    this.furries[this.furries.length - 1].src = i;
	    this.furries[this.furries.length - 1].onload = () => { this.update(); };
	}

	// The board setup
        this.board = board;
        if (this.board == null) {
            this.board = []
            for (let y=0; y<this.height; y++) {
                let row = [];
                for (let x=0; x<this.width; x++) {
                    row.push(-1);
                }
                this.board.push(row)
            }
        }

        // Add Listeners
        this.canvas.addEventListener('mousedown', () => this.mouse_down(), false);
        this.canvas.addEventListener('mousemove', () => this.mouse_move(), false);
        this.canvas.addEventListener('mouseup', () => this.mouse_up(), false);
        this.canvas.addEventListener('mouseleave', () => this.mouse_leave(), false);
    }

    get_cursor_position(event) {
        // Determine where clicked
        const rect = this.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        var sx = Math.floor((x - this.left_padding) / this.square_size);
        var sy = Math.floor((y - this.top_padding)  / this.square_size);

        // Return X, Y coordinates
        return {x:sx, y:sy};
    }

    mouse_down() {
        if (!this.interactive) return;
	this.mousedown = true;
        this.highlight = this.get_cursor_position(event);
	this.update();
    }

    mouse_move() {
        if (!this.interactive) return;
        this.highlight = this.get_cursor_position(event);
        this.update();
    }

    mouse_up() {
        if (!this.interactive) return;
	if (this.mousedown) {
	    this.mousedown = false;
	    this.toggle_position(this.get_cursor_position(event));
            this.update();
	}
    }

    mouse_leave() {
        if (!this.interactive) return;
	this.mousedown = false;
	this.highlight = null;
        this.update();
    }

    toggle_position(c) {
	if (this.board[c.y][c.x] < 0)
	    this.board[c.y][c.x] = Math.floor(Math.random() * this.furries.length);
	else
	    this.board[c.y][c.x] = -1;
    }

    reset() {
	for (let y=0; y<this.board.length; y++)
	    for (let x=0; x<this.board[y].length; x++)
		this.board[y][x] = -1;
	this.update();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    place_image(i, x, y, w, h) {
        this.ctx.drawImage(i, x, y, w, h);
    }

    place_arrow(x, y, d) {
	let x1 = x * this.square_size + this.left_padding;
	let y1 = y * this.square_size + this.top_padding;
	let arrow;

	if (d == LEFT){
	    x1 -= this.square_size * .5;
	    arrow = this.arrows.left;
	}
	if (d == RIGHT) {
	    x1 += this.square_size * .5;
	    arrow = this.arrows.right;
	}
	if (d == UP) {
	    y1 -= this.square_size * .5;
	    arrow = this.arrows.up;
	}
	if (d == DOWN) {
	    y1 += this.square_size * .5;
	    arrow = this.arrows.down;
	}

	this.place_image(arrow, x1, y1, this.square_size, this.square_size);
    }

    place_furry(x, y, c) {
	let x1 = x * this.square_size + this.left_padding;
	let y1 = y * this.square_size + this.top_padding;

	let x2 = x * this.square_size - (this.square_size / 3) + this.left_padding;
	let y2 = y * this.square_size + (this.square_size * .15) + this.top_padding;

	this.place_image(this.shadow    , x2, y2, this.shadow_size, this.shadow_size);
	this.place_image(this.furries[c], x1, y1, this.square_size, this.square_size);
    }

    draw_highlight(c) {
        this.ctx.beginPath();

        if (this.highlight.x >= this.width || this.highlight.x < 0 ||
	    this.highlight.y >= this.height || this.highlight.y < 0)
            return;
        let x = this.highlight.x * this.square_size + this.left_padding;
        let y = this.highlight.y * this.square_size + this.top_padding;;

	if (this.mousedown) {
	    this.ctx.fillStyle = "rgba(255, 0, 0, .5)";
	    this.ctx.fillRect(x, y, this.square_size, this.square_size);
	} else {
            this.ctx.lineWidth = "6";
            this.ctx.strokeStyle = "red";
            this.ctx.rect(x, y, this.square_size, this.square_size);
            this.ctx.stroke();
	}
    }

    update() {
        this.clear();

        // place background
        this.place_image(this.background, 0, 0, this.canvas.width, this.canvas.height);

	// Go through game board and place furry things
	for (let y=0; y<this.board.length; y++)
	    for (let x=0; x<this.board[y].length; x++)
		if (this.board[y][x] > -1) {
		    this.place_furry(x, y, this.board[y][x]);
		}

	// If there is an arrow, place it too
	if (this.arrow_pos != null)
	    this.place_arrow(this.arrow_pos.x, this.arrow_pos.y, this.arrow_pos.d);

	// Highlight
	if (this.highlight)
	    this.draw_highlight();
    }
}

const LEFT  = 0;
const RIGHT = 1;
const UP    = 2;
const DOWN  = 3;

let input;

function is_solved(b) {
    let c = 0;
    for (let y=0; y<b.length; y++)
	for (let x=0; x<b[0].length; x++)
	    if (b[y][x] > -1) {
		c++;

		if (c > 1)
		    return false;
	    }

    return true;
}

function can_move(b, x, y, d) {
    // Make sure that we are at least 2 away from an edge
    if (d == LEFT && x > 1) {
	// And that there is a gap in the direction we want to go
	if (b[y][x-1] == -1) {
	    // And that there is at least 1 furry to bump into
	    for (let t=0; t<x; t++)
		if (b[y][t] > -1)
		    return true;
	    return false;
	}
    }

    // Do the same for the other directions
    if (d == UP && y > 1) {
	if (b[y-1][x] == -1) {
	    for (let t=0; t<y; t++)
		if (b[t][x] > -1)
		    return true;
	    return false;
	}
    }

    if (d == DOWN && y < b.length-3) {
	if (b[y+1][x] == -1) {
	    for (let t=y+1; t<b.length; t++)
		if (b[t][x] > -1)
		    return true;
	    return false;
	}
    }

    if (d == RIGHT && x < b[0].length-3) {
	if (b[y][x+1] == -1) {
	    for (let t=x+1; t<b[0].length; t++)
		if (b[y][t] > -1)
		    return true;
	    return false;
	}
    }

    return false;
}

function make_move(b, x, y, d) {
    let o = JSON.parse(JSON.stringify(b));

    if (d == LEFT) {
	for (let t=x; t>0; t--) {
	    if (o[y][t-1] == -1) {
		// if the spot to the left is open, move the furry there
		// Otherwise do nothing as it means it's bouncing into something
		o[y][t-1] = o[y][t];
		o[y][t] = -1;
	    }
	}
	// There's never a situation where a furry should stop at the edge
	o[y][0] = -1;
    }

    if (d == RIGHT) {
	for (let t=x; t<b[0].length -1; t++) {
	    if (o[y][t+1] == -1) {
		o[y][t+1] = o[y][t];
		o[y][t] = -1;
	    }
	}
	o[y][b[0].length -1] = -1;
    }

    if (d == UP) {
	for (let t=y; t>0; t--) {
	    if (o[t-1][x] == -1) {
		o[t-1][x] = o[t][x];
		o[t][x] = -1;
	    }
	}
	o[0][x] = -1;
    }

    if (d == DOWN) {
	for (let t=y; t<b.length -1; t++) {
	    if (o[t+1][x] == -1) {
		o[t+1][x] = o[t][x];
		o[t][x] = -1;
	    }
	}
	o[b.length -1][x] = -1;
    }

    return o;
}

function solve_recursively(boards, moves) {
    // Check for solved
    if (is_solved(boards[boards.length - 1]))
	return [boards, moves];

    // Iterate through each square looking for furries, and see if there is a valid move
    for (let y=0; y<boards[boards.length-1].length; y++) {
	for (let x=0; x<boards[boards.length-1][0].length; x++) {

	    if (boards[boards.length-1][y][x] > -1) {
		for (let d of [LEFT, RIGHT, UP, DOWN]) {
		    if (can_move(boards[boards.length-1], x, y, d)) {
			// Make move and recursively check it again
			let new_boards_array = JSON.parse(JSON.stringify(boards));
			new_boards_array.push(make_move(boards[boards.length-1], x, y, d));
			let new_moves_array = moves.slice(0);
			new_moves_array.push({x:x, y:y, d:d});
			let status = solve_recursively(new_boards_array, new_moves_array);
			// If we don't get no-moves-found, then we should have a solution
			if (status != false)
			    return status;
		    }
		}
	    }
	}
    }

    // Means no moves found
    return false;
}

function solve() {
    // Remove solution
    document.getElementById("fling_output").innerHTML = "";

    // Kick off recursive function
    let board = [JSON.parse(JSON.stringify(input.board))];
    let [boards, moves] = solve_recursively(board, []);

    // If moves is false, then no solution was found
    if (moves == false) {
	document.getElementById("fling_output").innerHTML = "No solution found";
	return
    }

    // Display results
    for (let i=0; i<boards.length; i++)
	new fling_instance(document.getElementById("fling_output"), 250, boards[i], false, moves[i]);
}

function reset() {
    // Remove solution
    document.getElementById("fling_output").innerHTML = "";

    // Erase board
    input.reset();
}

function first_load() {
    // Create input
    input = new fling_instance(document.getElementById("fling_input"), 512, null, true, null);

    // Test solve formatting
    /*
    let sample = [
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1, 4,-1,-1],
	[-1,-1,-1,-1, 1,-1,-1],
	[-1,-1, 5,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1, 2],
	[-1,-1,-1, 6, 3,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]
    ];

    let t1 = new fling_instance(document.getElementById("fling_output"), 250, sample, false, {x:4, y:5, d:UP});
    sample = make_move(sample, 4, 5, UP);
    let t2 = new fling_instance(document.getElementById("fling_output"), 250, sample, false, {x:4, y:3, d:LEFT});
    sample = make_move(sample, 4, 3, LEFT);
    let t3 = new fling_instance(document.getElementById("fling_output"), 250, sample, false, {x:3, y:3, d:DOWN});
    sample = make_move(sample, 3, 3, DOWN);
    let t4 = new fling_instance(document.getElementById("fling_output"), 250, sample, false, {x:3, y:4, d:RIGHT});
    sample = make_move(sample, 3, 4, RIGHT);
    let t5 = new fling_instance(document.getElementById("fling_output"), 250, sample, false, null);
    */
}

document.getElementById("solve").onclick  = function () { solve() };
document.getElementById("reset").onclick  = function () { reset() };

window.onload = function () {
    first_load();
}
