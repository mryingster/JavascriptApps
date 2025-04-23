class die {
    constructor(parent, size, value) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.size = size;
        this.initial_value = value;
        this.value = value;
        this.selected = false;
        this.margin = 5;
        this.max_value = 6;
        this.animation_timer = 0;

        this.canvas.width  = this.size + (this.margin * 2);
        this.canvas.height = this.size + (this.margin * 2);

        // Add listeners
        this.canvas.addEventListener('touchstart', () => this.touch_start(), false);
        this.canvas.addEventListener('mousedown', () => this.toggle_selected(), false);

        this.update();
    }

    reset() {
        this.value = this.initial_value;
        this.selected = false;
        this.update();
    }

    touch_start(e) {
        e.preventDefault();
        this.toggle_selected();
    }

    toggle_selected(e) {
        if (this.selected == false)
            this.selected = true;
        else
            this.selected = false;
        this.update();
    }

    animate(n) {
        if (n <= 0) {
            // Update button status
            update_score_buttons();
            enable_disable_score_buttons();
            return;
        }

        // Select new value
        this.value = Math.floor(Math.random() * this.max_value) + 1;

        // Update drawing
        this.update();

        // Set animation timeout
        this.animation_timer = setTimeout(() => this.animate(n-1), 50);
    }

    roll() {
        this.animate(5);
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

// Global Settings
let num_dice = 6;
let num_rolls = 4;
let start_values = "DICEY!";
let dice = [];

let rolls_left = 0;
let this_score = 0;
let dicies = 0;

const LEFT  = 0;
const RIGHT = 1;
const INPUT = 0;
const COMPUTE = 1;

let scores_layout = [
    {name:"Aces",          column: LEFT,  type: INPUT,   key:"aces", },
    {name:"Twos",          column: LEFT,  type: INPUT,   key:"twos", },
    {name:"Threes",        column: LEFT,  type: INPUT,   key:"threes", },
    {name:"Fours",         column: LEFT,  type: INPUT,   key:"fours", },
    {name:"Fives",         column: LEFT,  type: INPUT,   key:"fives", },
    {name:"Sixes",         column: LEFT,  type: INPUT,   key:"sixes", },

    {name:"Left Subtotal", column: LEFT,  type: COMPUTE, key:"left_sub", },
    {name:"Left Bonus",    column: LEFT,  type: COMPUTE, key:"left_bonus", },
    {name:"Left Total",    column: LEFT,  type: COMPUTE, key:"left_total", },

    {name:"Small Set",     column: RIGHT, type: INPUT,   key:"small_set", },
    {name:"Large Set",     column: RIGHT, type: INPUT,   key:"large_set", },
    {name:"Full House",    column: RIGHT, type: INPUT,   key:"full_house", },
    {name:"Small Straight",column: RIGHT, type: INPUT,   key:"small_str", },
    {name:"Big Straight",  column: RIGHT, type: INPUT,   key:"big_str", },
    {name:"Dicey",         column: RIGHT, type: INPUT,   key:"dicey", },
    {name:"Chance",        column: RIGHT, type: INPUT,   key:"chance", },

    {name:"Dicey Bonus",   column: RIGHT, type: COMPUTE, key:"dicey_bonus", },
    {name:"Right Total",   column: RIGHT, type: COMPUTE, key:"right_total", },
];


function roll_dice() {
    if (rolls_left == 0) return;

    // Cheaters add rolls! Punish them
    if (rolls_left > num_rolls)
	rolls_left = 1;

    // If this is first roll, we have to discount any saved dice
    if (rolls_left == num_rolls)
        for (let die of dice)
            die.selected = false;

    // Roll the dice
    for (let die of dice)
        if (die.selected == false)
            die.roll();

    // Subtract our roll
    rolls_left--;

    // Disable roll button if it's the last roll
    if (rolls_left == 0)
        document.getElementById('roll').disabled = true;

    return;
}

function record_score(field) {
    // Record score
    this_score[field] = Number(document.getElementById(field).innerHTML);

    // See if a bonus dicey was rolled
    let this_roll = [];
    for (let die of dice)
        this_roll.push(die.value)

    if (this_score["dicey"] == 50){
        for (let i of count_occurances(this_roll))
            if (i == num_dice)
                dicies += 1;
        this_score["dicey_bonus"] = (dicies - 1) * 100;
    }

    // Disable score buttons
    enable_disable_score_buttons(true);
    update_score_buttons(true);

    // Enable roll button
    rolls_left = num_rolls;
    document.getElementById('roll').disabled = false;

    // See if game over
    for (let i in this_score)
        if (this_score[i] == null)
            return;

    game_over();
}

function game_over() {
    // Hide roll button
    document.getElementById('controls').classList.add("hidden");

    // Show start button
    document.getElementById('start').classList.remove("hidden");
}

function setup_new_game(size){
    num_dice = size;
    num_rolls = size - 2;

    // Clearout values
    rolls_left = num_rolls;
    dicies = 0;
    this_score = {};
    for (let score of scores_layout)
        this_score[score.key] = null;
    this_score.dicey_bonus = 0;

    // Create DICE and Score Cards
    create_dice(num_dice);
    create_score_card(num_dice);

    // Get rid of old scores
    enable_disable_score_buttons(true);
    update_score_buttons(true);

    // Disable Button
    document.getElementById('controls').classList.remove("hidden");
    document.getElementById('start').classList.add("hidden");
}

function enable_disable_score_buttons(disable_all=false){
    for (let button_name in this_score){
        if (this_score[button_name] != null || disable_all == true)
            document.getElementById(button_name).disabled = true;
        else
            document.getElementById(button_name).disabled = false;
    }
}

function count_occurances(a){
    let count = [0,0,0,0,0,0,0];
    for (let i of a)
        count[i]++;
    return count;
}

function sum_dice(a){
    let sum = 0;
    for (let i of a)
        sum += i;
    return sum;
}

function update_score_buttons(show_score_only=false){
    let this_roll = [];
    for (let die of dice)
        this_roll.push(die.value)

    let dice_count = count_occurances(this_roll);

    document.getElementById("aces").innerHTML   = 1 * dice_count[1];
    document.getElementById("twos").innerHTML   = 2 * dice_count[2];
    document.getElementById("threes").innerHTML = 3 * dice_count[3];
    document.getElementById("fours").innerHTML  = 4 * dice_count[4];
    document.getElementById("fives").innerHTML  = 5 * dice_count[5];
    document.getElementById("sixes").innerHTML  = 6 * dice_count[6];

    let dice_sum        = sum_dice(this_roll);
    let small_set       = 0;
    let large_set       = 0;
    let full_house      = 25;
    let small_straight  = 0;
    let large_straight  = 0;
    let dicey           = 50;
    let straight_count  = 0;
    let left_bonus      = 0;
    let left_total      = 0;

    for (let i of dice_count.slice(1)){
        if (i > 0)
            straight_count++;
        else
            straight_count = 0;
        if (straight_count > num_dice - 2) small_straight = 30;
        if (straight_count > num_dice - 1) large_straight = 40;
        if (i > num_dice - 3)
            small_set = dice_sum;
        if (i > num_dice - 2)
            large_set = dice_sum;
        if (i == 1)
            full_house = 0;
        if (i != 0 && i != num_dice)
            dicey = 0;
    }

    // Only score relavent combinations
    document.getElementById("small_set").innerHTML  = small_set;
    document.getElementById("large_set").innerHTML  = large_set;
    document.getElementById("chance").innerHTML     = dice_sum;
    document.getElementById("full_house").innerHTML = full_house;
    document.getElementById("small_str").innerHTML  = small_straight;
    document.getElementById("big_str").innerHTML    = large_straight;
    document.getElementById("dicey").innerHTML      = dicey;

    // Tabulate left score
    let left_score = 0;
    for (let i of ["aces", "twos", "threes", "fours", "fives", "sixes"])
        if (this_score[i] != null)
            left_score += this_score[i];
    if (left_score >= (1+2+3+4+5+6) * num_rolls)
        left_bonus = 35;
    left_total = left_score + left_bonus;
    document.getElementById("left_sub").innerHTML   = left_score;
    document.getElementById("left_bonus").innerHTML = left_bonus;
    document.getElementById("left_total").innerHTML = left_total;
    this_score["left_sub"]   = left_score;
    this_score["left_bonus"] = left_bonus;
    this_score["left_total"] = left_total;

    // Tabulate right score
    let right_score = 0;
    for (let s of scores_layout)
        if (s.column == RIGHT && s.type == INPUT)
            if (this_score[s.key] != null)
                right_score += this_score[s.key];
    document.getElementById("right_total").innerHTML = right_total;
    this_score["right_total"] = right_score;

    // Tabulate current score
    let total_score = left_total + right_score;
    document.getElementById("score").innerHTML = total_score;

    // Overwrite with actual scores if necessary
    if (show_score_only == true){
        for (let i in this_score)
            if (this_score[i] != null){
                document.getElementById(i).innerHTML = this_score[i];
            } else {
                document.getElementById(i).innerHTML = 0;
            }
    }

    // Override scores for already scored buttons
    for (let button_name in this_score){
        if (this_score[button_name] != null){
	    if (this_score[button_name] == 0)
		document.getElementById(button_name).innerHTML = "&mdash;";
	    else
		document.getElementById(button_name).innerHTML = this_score[button_name];
        }
    }
}

function create_dice(n) {
    // Delete current dice
    dice = [];
    document.getElementById("dice").innerHTML = "";

    // Sizing guide for dice....
    let size = Math.floor(600 / n) - (n);

    // Make new ones!
    for (let i=0; i<n; i++)
        dice.push(new die(document.getElementById("dice"), size, start_values[i]));

}

function create_score_card(n) {
    let scores_div = document.getElementById("scores");

    // Empty out current contents of div
    scores_div.innerHTML = "";

    // Create new score fields
    let left_column = document.createElement("div");
    left_column.id = "left_column";
    let right_column = document.createElement("div");
    right_column.id = "right_column";

    let last_element = INPUT;

    for (let score of scores_layout) {
        let score_group = document.createElement("div");

        let name = document.createElement("span");
        name.innerHTML = score.name;
        name.classList.add("name");
        if (score.type == COMPUTE)
            name.classList.add("compute");
        score_group.appendChild(name);

        // Show the required score for left bonus to be activated
        if (score.key == "left_bonus")
            name.innerHTML = "Left Bonus (>"+(1+2+3+4+5+6) * (n-2)+")";
        // Change the name of sets based on how many dice are being used
        if (score.key == "small_set")
            name.innerHTML = (n-2) + " of a kind";
        if (score.key == "large_set")
            name.innerHTML = (n-1) + " of a kind";

        let button = document.createElement("button");
        button.innerHTML = "0";
        button.classList.add("score_button");
        button.id = score.key;
        if (score.type == INPUT)
            button.onclick = function () { record_score(score.key) };
        if (score.type == COMPUTE) {
            button.disabled = true;
            button.classList.add("compute");
        }
        score_group.appendChild(button);

        if (last_element == INPUT && score.type == COMPUTE)
            score_group.classList.add("underline");
        last_element = score.type;

        if (score.column == LEFT)
            left_column.appendChild(score_group);
        else
            right_column.appendChild(score_group);

    }

    scores_div.appendChild(left_column);
    scores_div.appendChild(right_column);
}

function first_load() {
    // Create Dice
    create_dice(5);

    // Bind Buttons
    document.getElementById("roll").onclick  = function () { roll_dice() };
    document.getElementById("start4").onclick = function () { setup_new_game(4) };
    document.getElementById("start5").onclick = function () { setup_new_game(5) };
    document.getElementById("start6").onclick = function () { setup_new_game(6) };

    // Hide Roll Button
    document.getElementById('controls').classList.add("hidden");

    // Get game ready
    //setup_new_game();
}

window.onload = function () {
    first_load();
}
