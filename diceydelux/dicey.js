class die {
    constructor(parent, size, value) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.size = size;
        this.value = value;
        this.selected = false;
        this.margin = 5;
        this.max_value = 6;
        this.animation_timer = 0;

        this.canvas.width  = this.size + (this.margin * 2);
        this.canvas.height = this.size + (this.margin * 2);

        // Add listeners
        this.canvas.addEventListener('touchstart', () => this.toggle_selected(), false);
        this.canvas.addEventListener('mousedown', () => this.toggle_selected(), false);

        this.update();
    }

    reset() {
        this.value = this.initial_value;
        this.selected = false;
        this.update();
    }

    toggle_selected(e) {
        if (this.selected == false)
            this.selected = true;
        else
            this.selected = false;
        this.update();
    }

    animate(n) {
        if (n <= 0) return;

        // Select new value
        this.value = Math.floor(Math.random() * this.max_value) + 1;

        // Update drawing
        this.update();

        // Set animation timeout
        this.animation_timer = setTimeout(() => this.animate(n-1), 50);
    }

    roll() {
        this.animate(10);
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw_rounded_rectangle(x, y, width, height, radius){
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + radius);
        this.ctx.arc(x + radius, y + radius, radius, Math.PI, -1/2 * Math.PI); // Top left

        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arc(x + width - radius, y + radius, radius, -1/2 * Math.PI, 0); // Top Right

        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arc(x + width - radius, y + height - radius, radius, 0, 1/2 * Math.PI); // Bottom Right

        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arc(x + radius, y + height - radius, radius, 1/2 * Math.PI, Math.PI); // Bottom Left
        this.ctx.lineTo(x, y + radius);
    }

    draw_circle(x, y, radius, color){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    draw_background(){
        clear_canvas();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#003294";
        this.ctx.fillStyle = "#003FBD";
        this.draw_rounded_rectangle(5, 5, width-10, height-10, 20);
        this.ctx.fill();
        this.ctx.stroke();
    }

    update() {
        this.clear();

        const half_size = this.size / 2;

        this.ctx.save();
        this.ctx.translate(this.margin, this.margin);

        // Draw shadows
        this.ctx.fillStyle = "#AAA";
        this.ctx.shadowBlur = this.margin;
        this.ctx.shadowColor = "#AAA";
        this.draw_rounded_rectangle(0, this.margin/2, this.size, this.size, 5);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw bevels
        // Top Left
        this.ctx.fillStyle = "#F9F9F9";
        this.draw_rounded_rectangle(0, 0, half_size, half_size, 5);
        this.ctx.fill();

        // Bottom Right
        this.ctx.fillStyle = "#9F9F9F";
        this.draw_rounded_rectangle(half_size, half_size, half_size, half_size, 5);
        this.ctx.fill();

        // Top Right
        this.ctx.fillStyle = "#CbCeD5";
        this.draw_rounded_rectangle(half_size, 0, half_size, half_size, 5);
        this.ctx.fill();

        // Bottom Left
        this.ctx.fillStyle = "#C8C9C9";
        this.draw_rounded_rectangle(0, half_size, half_size, half_size, 5);
        this.ctx.fill();

        // Draw center
        this.draw_circle(half_size, half_size, half_size, "#EBEBEB");

        // Draw Letter... If there's a letter?
        if (typeof this.value == "string") {
            this.ctx.font = "bold "+(1.5 * half_size)+"px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#991700";
            this.ctx.fillText(this.value, half_size, 1.5 * half_size);
        } else {
            // Draw pips
            const pip_size    = this.size/12;
            const pip_spacing = this.size/5;
            if (this.value == 1 || this.value == 3 || this.value == 5)
	        this.draw_circle(half_size,             half_size,             pip_size, "#000000"); // Center Middle
            if (this.value > 1) {
	        this.draw_circle(half_size-pip_spacing, half_size-pip_spacing, pip_size, "#000000"); // Left Top
	        this.draw_circle(half_size+pip_spacing, half_size+pip_spacing, pip_size, "#000000"); // Right Bottom
            }
            if (this.value == 6) {
	        this.draw_circle(half_size-pip_spacing, half_size,             pip_size, "#000000"); // Left Middle
	        this.draw_circle(half_size+pip_spacing, half_size,             pip_size, "#000000"); // Right Middle
            }
            if (this.value > 3) {
	        this.draw_circle(half_size-pip_spacing, half_size+pip_spacing, pip_size, "#000000"); // Left Bottom
	        this.draw_circle(half_size+pip_spacing, half_size-pip_spacing, pip_size, "#000000"); // Right Top
            }
        }

        // Draw highlight around selected die
        if (this.selected == true){
            this.draw_rounded_rectangle(0, 0, this.size, this.size, 5);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = "#991700";
            this.ctx.stroke();
        }

        this.ctx.restore();
        return;
    }
}

// Create Dice
let num_dice = 6;
let dice = [];
for (let i=0; i<num_dice; i++)
    dice.push(new die(document.getElementById("dice"), 96, 6));

// Bind Buttons
document.getElementById("roll").onclick  = function () { roll_dice() };

function roll_dice() {
    for (let die of dice)
        if (die.selected == false)
            die.roll();
}


