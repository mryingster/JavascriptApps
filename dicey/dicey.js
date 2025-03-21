// Game State
var this_roll       = [1, 2, 3, 4, 5];
var selected_dice   = [0, 0, 0, 0, 0];
var rolls_left      = null;
var this_score      = null;
var animation_timer = null;
var dicies          = null;

// Canvas
var canvas  = document.getElementById("canvas");
var width   = canvas.width;
var height  = canvas.height;
var ctx     = canvas.getContext("2d");

// Figure out dice sizes
var dice_size         = 120;
var dice_spacing      = 128;
var num_dice          = 5;
var dice_left_padding = (dice_spacing - dice_size) / 2;

// Touch listeners
canvas.addEventListener('touchstart', input_down_touch, false);
canvas.addEventListener('touchend',   input_up_touch, false);

function getTouchPosition(canvas, event){
    if (!e)
        var e = event;

    var x = null;
    var y = null;

    if(e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            x = touch.pageX-touch.target.offsetLeft;
            y = touch.pageY-touch.target.offsetTop;// - (dice_size / 2); // Adjust y because apple messes things up!
        }
    }

    return {x:x, y:y};
}

function input_down_touch(e){
    var pos = getTouchPosition(canvas, e);
    var dice_index = Math.floor(pos.x / dice_spacing);
    selected_dice[dice_index] ^= 1;
    canvas_draw_game();
    e.preventDefault();
}

function input_up_touch(e){
    e.preventDefault();
}

// Mouse listeners
canvas.addEventListener('mousedown', input_down_mouse);
canvas.addEventListener('mouseup',   input_up_mouse);

function getCursorPosition(canvas, event){
    // Determine where clicked
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x:x, y:y};
}

function input_down_mouse(e){
    return;
}

function input_up_mouse(e){
    var pos = getCursorPosition(canvas, e);
    var dice_index = Math.floor(pos.x / dice_spacing);
    selected_dice[dice_index] ^= 1;
    canvas_draw_game();
}

// Canvas Functions
function clear_canvas(canvas, ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvas_draw_rounded_rectangle(x, y, width, height, radius){
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, -1/2 * Math.PI); // Top left

    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, -1/2 * Math.PI, 0); // Top Right

    ctx.lineTo(x + width, y + height - radius);
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 1/2 * Math.PI); // Bottom Right

    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + height - radius, radius, 1/2 * Math.PI, Math.PI); // Bottom Left
    ctx.lineTo(x, y + radius);
}

function canvas_draw_circle(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function canvas_draw_background(){
    clear_canvas(canvas, ctx);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003294";
    ctx.fillStyle = "#003FBD";
    canvas_draw_rounded_rectangle(5, 5, width-10, height-10, 20);
    ctx.fill();
    ctx.stroke();
}

function canvas_draw_dice(x, y, width, n, selected){
    x += dice_left_padding;
    const die_size = width/2;

    // Draw shadows
    ctx.fillStyle = "#AAA";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#AAA";
    canvas_draw_rounded_rectangle(x, y+1, width, width, 5);
    ctx.fill();
    //ctx.fillRect(x, y+1, width, width);
    ctx.shadowBlur = 0;
    //ctx.filter = 'blur(10px)';

    // Draw bevels
    ctx.fillStyle = "#F9F9F9";
    canvas_draw_rounded_rectangle(x, y, die_size, die_size, 5);
    ctx.fill();
    //ctx.fillRect(x, y, die_size, die_size);
    ctx.fillStyle = "#9F9F9F";
    canvas_draw_rounded_rectangle(x+die_size, y+die_size, die_size, die_size, 5);
    ctx.fill();
    //ctx.fillRect(x+die_size, y+die_size, die_size, die_size);
    ctx.fillStyle = "#CbCeD5";
    canvas_draw_rounded_rectangle(x+die_size, y, die_size, die_size, 5);
    ctx.fill();
    //ctx.fillRect(x+die_size, y, die_size, die_size);
    ctx.fillStyle = "#C8C9C9";
    canvas_draw_rounded_rectangle(x, y+die_size, die_size, die_size, 5);
    ctx.fill();
    //ctx.fillRect(x, y+die_size, die_size, die_size);

    // Draw center
    canvas_draw_circle(x+die_size, y+die_size, die_size, "#EBEBEB");

    // Draw pips
    const pip_size    = width/12;
    const pip_spacing = width/5;
    if (n == 1 || n == 3 || n == 5)
	canvas_draw_circle(x+die_size,             y+die_size,             pip_size, "#000000"); // Center Middle
    if (n > 1) {
	canvas_draw_circle(x+die_size-pip_spacing, y+die_size-pip_spacing, pip_size, "#000000"); // Left Top
	canvas_draw_circle(x+die_size+pip_spacing, y+die_size+pip_spacing, pip_size, "#000000"); // Right Bottom
    }
    if (n == 6) {
	canvas_draw_circle(x+die_size-pip_spacing, y+die_size,             pip_size, "#000000"); // Left Middle
	canvas_draw_circle(x+die_size+pip_spacing, y+die_size,             pip_size, "#000000"); // Right Middle
    }
    if (n > 3) {
	canvas_draw_circle(x+die_size-pip_spacing, y+die_size+pip_spacing, pip_size, "#000000"); // Left Bottom
	canvas_draw_circle(x+die_size+pip_spacing, y+die_size-pip_spacing, pip_size, "#000000"); // Right Top
    }

    // Draw Letter... If there's a letter?
    if (typeof n == "string") {
        ctx.font = "bold "+(1.5 * die_size)+"px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#991700";
        ctx.fillText(n, x + die_size, y+1.5 * die_size);
        // Don't highlight letters! Exit early
        return;
    }

    // Draw highlight around selected die
    if (selected == 1){
        canvas_draw_rounded_rectangle(x, y, width, width, 5);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#991700";
        ctx.stroke();
    }
    return;
}

function first_load(){
    setup_new_game();
}

function canvas_draw_game(game){
    // Clear out any old game
    clear_canvas(canvas, ctx);

    // Draw new dice
    for (let i=0; i<this_roll.length; i++){
	canvas_draw_dice(dice_spacing * i, 4, dice_size, this_roll[i], selected_dice[i]);
    }
}

function setup_new_game(state=null){
    // Clear old game
    clear_canvas(canvas, ctx);
    this_score = {
        'aces'       : null,
        'twos'       : null,
        'threes'     : null,
        'fours'      : null,
        'fives'      : null,
        'sixes'      : null,
        '3oak'       : null,
        '4oak'       : null,
        'full_house' : null,
        'small_str'  : null,
        'big_str'    : null,
        'dicey'      : null,
        'chance'     : null,
        'left_sub'   : null,
        'left_bonus' : null,
        'left_total' : null,
        'right_total': null,
        'dicey_bonus': 0,
    };

    this_roll     = ["D","I","C","E","Y"];
    selected_dice = [ 0, 0, 0, 0, 0];
    dicies        = 0;
    canvas_draw_game();
    rolls_left = 3;

    // Disable Button
    enable_disable_score_buttons(true);
    update_score_buttons(true);

    // Get rid of old scores
    document.getElementById('roll').disabled = false;
    document.getElementById('reset').style = "display:none;";

}

function roll_dice(animation = false){
    if (rolls_left == 0) return;

    // Cheaters add rolls! Punish them
    if (rolls_left > 3)
	rolls_left = 1;

    // If this is first roll, we have to discount any saved dice
    if (rolls_left == 3)
        selected_dice = [0,0,0,0,0];

    let new_roll = [];
    for (let i=0; i<num_dice; i++)
        if (selected_dice[i] == 1) {
            new_roll.push(this_roll[i]);
        } else {
            new_roll.push(Math.floor(Math.random() * 6) + 1);
        }
    this_roll = new_roll.slice();
    canvas_draw_game();

    // Bail if this is an animation
    if (animation == true) return;

    rolls_left -= 1;

    // Disable roll button if it's the last roll
    if (rolls_left == 0)
        document.getElementById('roll').disabled = true;

    // Update button status
    update_score_buttons();
    enable_disable_score_buttons();

    return;
}

function animate_roll(n){
    let animation = false
    clearTimeout(animation_timer);
    document.getElementById('roll').disabled = false;
    if (n>0){
        document.getElementById('roll').disabled = true;
        animation = true
        animation_timer = setTimeout(() => animate_roll(n-1), 50);
    }

    roll_dice(animation);
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
    let dice_count = count_occurances(this_roll);

    document.getElementById("aces").innerHTML   = 1 * dice_count[1];
    document.getElementById("twos").innerHTML   = 2 * dice_count[2];
    document.getElementById("threes").innerHTML = 3 * dice_count[3];
    document.getElementById("fours").innerHTML  = 4 * dice_count[4];
    document.getElementById("fives").innerHTML  = 5 * dice_count[5];
    document.getElementById("sixes").innerHTML  = 6 * dice_count[6];

    let dice_sum        = sum_dice(this_roll);
    let three_of_a_kind = 0;
    let four_of_a_kind  = 0;
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
        if (straight_count > 3) small_straight = 30;
        if (straight_count > 4) large_straight = 40;
        if (i > 2)
            three_of_a_kind = dice_sum;
        if (i > 3)
            four_of_a_kind = dice_sum;
        if (i != 0 && i != 2 && i != 3 && i != 5)
            full_house = 0;
        if (i != 0 && i != 5)
            dicey = 0;
    }

    document.getElementById("3oak").innerHTML       = three_of_a_kind;
    document.getElementById("4oak").innerHTML       = four_of_a_kind;
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
    if (left_score >= 63)
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
    for (let i of ['3oak', '4oak', 'full_house', 'small_str', 'big_str', 'dicey', 'chance', 'dicey_bonus'])
        if (this_score[i] != null)
            right_score += this_score[i];
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

function record_score(field){
    // Record score
    this_score[field] = Number(document.getElementById(field).innerHTML);

    // See if a bonus dicey was rolled
    if (this_score["dicey"] == 50){
        for (let i of count_occurances(this_roll))
            if (i == 5)
                dicies += 1;
        this_score["dicey_bonus"] = (dicies - 1) * 100;
    }

    // Disable score buttons
    enable_disable_score_buttons(true);
    update_score_buttons(true);

    // Enable roll button
    rolls_left = 3;
    document.getElementById('roll').disabled = false;

    // See if game over
    let game_over = true;
    for (let i in this_score)
        if (this_score[i] == null)
            game_over = false;
    if (game_over == true) {
        document.getElementById('roll').disabled = true;
        document.getElementById('reset').style = "";
    }
}

function enable_disable_score_buttons(disable_all=false){
    for (let button_name in this_score){
        if (this_score[button_name] != null || disable_all == true)
            document.getElementById(button_name).disabled = true;
        else
            document.getElementById(button_name).disabled = false;
    }
}


document.getElementById("roll").onclick  = function () { animate_roll(5) };
document.getElementById("reset").onclick = function () { setup_new_game() };
document.getElementById("aces").onclick=function () { record_score('aces') };
document.getElementById("twos").onclick=function () { record_score('twos') };
document.getElementById("threes").onclick=function () { record_score('threes') };
document.getElementById("fours").onclick=function () { record_score('fours') };
document.getElementById("fives").onclick=function () { record_score('fives') };
document.getElementById("sixes").onclick=function () { record_score('sixes') };
document.getElementById("3oak").onclick=function () { record_score('3oak') };
document.getElementById("4oak").onclick=function () { record_score('4oak') };
document.getElementById("full_house").onclick=function () { record_score('full_house') };
document.getElementById("small_str").onclick=function () { record_score('small_str') };
document.getElementById("big_str").onclick=function () { record_score('big_str') };
document.getElementById("dicey").onclick=function () { record_score('dicey') };
document.getElementById("chance").onclick=function () { record_score('chance') };

window.onload = function () {
    first_load();
}
