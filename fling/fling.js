class fling_instance {
    constructor(parent, width, board, interactive) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = Math.floor(width / 1536 * 1768);
        this.interactive = interactive;

	// Overlay info
	this.mousedown = false;
	this.highlight = null;

        // Size and spacing info
        this.ratio = width / 1536;
        this.left_padding = 70 * this.ratio;
        this.square_size = 200 * this.ratio;

	// Images that need to be loaded
        this.background = new Image();
        this.background.src = "images/Fling_Background.jpg";
        this.background.onload = () => { this.update(); };

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
            for (let y=0; y<8; y++) {
                let row = [];
                for (let x=0; x<7; x++) {
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
        var sy = Math.floor(y / this.square_size);

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
	    console.log("test");
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

    place_furry(x, y, c) {
	let x1 = x * this.square_size + this.left_padding;
	let y1 = y * this.square_size;

	this.place_image(this.furries[c], x1, y1, this.square_size, this.square_size);
    }

    draw_highlight(c) {
        this.ctx.beginPath();

        if (this.highlight.x > 6 || this.highlight.x < 0 ||
	    this.highlight.y > 7 || this.highlight.y < 0)
            return;
        let x = this.highlight.x * this.square_size + this.left_padding;
        let y = this.highlight.y * this.square_size;

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
		if (this.board[y][x] > -1)
		    this.place_furry(x, y, this.board[y][x]);

	// Highlight
	if (this.highlight)
	    this.draw_highlight();
    }
}

let input;
let solution_steps = [];

function solve() {
}

function reset() {
    // Remove solution
    document.getElementById("fling_output").innerHTML = "";
    solution_steps = [];

    // Erase board
    input.reset();
}

function first_load() {
    // Create input
    input = new fling_instance(document.getElementById("fling_input"), 512, null, true);

    // Test solve formatting
    input = new fling_instance(document.getElementById("fling_output"), 250, [[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,1,-1,-1],[-1,-1,5,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,3,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1]], false);
    input = new fling_instance(document.getElementById("fling_output"), 250, [[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,5,-1,3,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1]], false);
    input = new fling_instance(document.getElementById("fling_output"), 250, [[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,3,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1]], false);
}

document.getElementById("solve").onclick  = function () { solve() };
document.getElementById("reset").onclick  = function () { reset() };

window.onload = function () {
    first_load();
}
