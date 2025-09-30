function getTouchPosition(element, event) {
    event = event || window.event;

    // pick the touch point if present, otherwise mouse
    const point = (event.touches && event.touches.length) ? event.touches[0]
          : (event.changedTouches && event.changedTouches.length) ? event.changedTouches[0]
          : event;

    // use clientX/Y so coords are in the same coordinate space as getBoundingClientRect()
    const clientX = point.clientX;
    const clientY = point.clientY;
    if (clientX == null || clientY == null) return { x: null, y: null };

    const rect = element.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // If element is a canvas with a different backing pixel size, map to canvas coords:
    if (element instanceof HTMLCanvasElement) {
	const scaleX = element.width  / rect.width;
	const scaleY = element.height / rect.height;
	x *= scaleX;
	y *= scaleY;
    }

    return { x: x, y: y };
}

function input_start_touch(e){
    last_touch_position = getTouchPosition(overlay, e)
    selected = select_move_tile(last_touch_position);

    if (selected == null) return;

    // Make buttons highlight when clicked
    tiles[selected].clicked = true;;

    mouse_down = true;
    e.preventDefault();
    draw_state();
}

function input_move_touch(e){
    if (mouse_down == true){
	last_touch_position = getTouchPosition(overlay, e)
        move_tile(last_touch_position);
    }
    e.preventDefault();
}

function input_end_touch(e){
    input_up(last_touch_position);
    e.preventDefault();
}

function getCursorPosition(overlay, event){
    // Determine where clicked
    const rect = overlay.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x:x, y:y};
}

function input_down_mouse(e){
    selected = select_move_tile(getCursorPosition(overlay, e));

    // Didn't click on anything
    if (selected == null) return;

    // Make buttons highlight when clicked
    tiles[selected].clicked = true;;

    mouse_down = true;
    draw_state();
}

function input_move_mouse(e){
    if (mouse_down == true)
        move_tile(getCursorPosition(overlay, e));
}

function input_up_mouse(e){
    input_up(getCursorPosition(overlay, e));
}

function input_up(pos){
    if (mouse_down == false) return;
    for (tile of tiles)
	tile.clicked = false;

    let mouse_over = select_move_tile(pos);

    // If mouse wasn't over anything, then nothing to do
    if (mouse_over != null){

        // Reset button
        if (tiles[selected].type == BUTTON){
            if (selected == mouse_over)
                reset_word();
            tiles[selected].state = UNKNOWN;
        }

        if (tiles[mouse_over].type == WORD){

            // Toggling letter in word area
            if (selected == mouse_over){
                if (tiles[mouse_over].letter != ' '){
		    tiles[mouse_over].state += 1;
		    if (tiles[mouse_over].state > RIGHTPOS)
                        tiles[mouse_over].state = NOTUSED;
                }
            } else {

                // Moving letter to word area
                if (tiles[selected].type == KEY) {

                    // Erasing letter with blank tile
                    if (tiles[selected].letter == UNICODE_DELETE) {
                        if (tiles[mouse_over].letter != ' ')
                            for (var i=0; i<tiles.length; i++)
                                if (tiles[i].type == KEY && tiles[i].letter == tiles[mouse_over].letter)
                                    tiles[i].state = UNKNOWN;
                        tiles[mouse_over].letter = ' ';
                        tiles[mouse_over].state = UNKNOWN;
                    } else {

                        // Moving normal letter to word area
                        if (tiles[mouse_over].type == WORD){
                            tiles[mouse_over].letter = tiles[selected].letter;
                            tiles[mouse_over].state = NOTUSED;
                        }
                    }
                } else if (tiles[selected].type == WORD) {

                    // Moving letter from word area to word area
                    let tmp_l = tiles[mouse_over].letter;
                    let tmp_s = tiles[mouse_over].state;
                    tiles[mouse_over].letter = tiles[selected].letter;
                    tiles[mouse_over].state = tiles[selected].state;
                    tiles[selected].letter = tmp_l;
                    tiles[selected].state = tmp_s;
                }
            }

        } else {

            // Clicking letter in alphabet area
            if (selected == mouse_over && tiles[selected].type == KEY){
                if (tiles[selected].letter == UNICODE_DELETE)
		    update_user_input(null);
		else
		    update_user_input(tiles[selected].letter);
	    }
        }
    }

    mouse_down = false;
    selected = null;

    draw_state();
    update_word_list();
}

// Keyboard listeners
document.addEventListener('keydown', function(e) {
    // Alphabet keys
    if (e.keyCode >= 65 && e.keyCode <= 90)
        update_user_input(String.fromCharCode(e.keyCode));

    // Delete
    if (e.keyCode == 8)
	update_user_input(null);

});

function update_user_input(c){
    if (c == null) {
	for (let i=tiles.length - 1; i>=0; i--)
	    if (tiles[i].type == WORD && tiles[i].letter != ' '){
		tiles[i].letter = ' ';
		tiles[i].state = UNKNOWN;
		break;
	    }

    } else {
	for (let tile of tiles)
	    if (tile.type == WORD && tile.letter == ' '){
		tile.letter = c;
		tile.state = NOTUSED;
		break;
	    }
    }

    draw_state();
    update_word_list();
}

function pixels_to_coords(coords){
    var mouse_x = coords.x - game_border;
    var mouse_y = coords.y - game_border;

    var gridsize = tile_height + spacing;

    var x = Math.floor(mouse_x / (gridsize));
    var y = Math.floor(mouse_y / (gridsize));

    return {x:x, y:y};
}

function select_move_tile(pos){
    for (let i=0; i<tiles.length; i++){
        let t = tiles[i];
        if (pos.x >= t.x && pos.x < t.width  + t.x &&
            pos.y >= t.y && pos.y < t.height + t.y){
            return i;
        }
    }

    return null;
}

function move_tile(pos){
    clear_canvas(overlay, overlay_ctx);

    let half = Math.floor(tile_height / 2);
    let tile = tiles[selected];

    if (tile.type == KEY || tile.type == WORD)
        canvas_draw_tile(overlay_ctx, pos.x-half, pos.y-half, tile_width, tile_height, tile);
}

// Canvas Functions
function clear_canvas(canvas, ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvas_draw_rounded_rectangle(ctx, x, y, width, height, radius){
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
    ctx.fill();
}

function darkenHSL(hslString, amount) {
    // Extract h, s, l with regex
    const match = hslString.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
    if (!match) {
	throw new Error("Invalid HSL format");
    }

    let [ , h, s, l ] = match;
    h = Number(h);
    s = Number(s);
    l = Number(l);

    l = l * (1-amount);

    // Clamp between 0–100
    l = Math.max(0, Math.min(100, l));

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function canvas_draw_tile(ctx, x, y, width, height, tile){
    if (tile == null){
        //canvas_draw_area(ctx, x, y, tile_height);
        return;
    }

    // Select color
    let text_color = "#000000";
    let color = 'hsl(0, 0%, 84.71%)';
    if (tile['state'] == NOTUSED){
        text_color = "#ffffff";
        color = 'hsl(210, 1.68%, 53.33%)';
    }
    if (tile['state'] == RIGHTPOS){
        text_color = "#ffffff";
        color = 'hsl(114.86, 29.17%, 52.94%)';
    }
    if (tile['state'] == WRONGPOS){
        text_color = "#ffffff";
        color = 'hsl(48.85, 51.13%, 56.67%)';
    }
    if (tile.clicked)
	color = darkenHSL(color, .25);

    // Draw square
    ctx.fillStyle = color;
    canvas_draw_rounded_rectangle(ctx, x, y, width, height, 5);

    // Draw caption
    ctx.textAlign = "center";
    ctx.fillStyle = text_color;
    if (tile.letter.length > 1){
        ctx.font = "bold "+(.3*tile_height)+"px Arial";
        ctx.fillText(tile.letter, x+.5*width, y+.65*height);
    } else if (tile.letter == UNICODE_DELETE) {
	ctx.font = "bold "+(.4*tile_height)+"px Arial";
	ctx.fillText(tile.letter, x+.5*width, y+.65*height);
    } else {
        ctx.font = "bold "+(.65*tile_height)+"px Arial";
        ctx.fillText(tile.letter, x+.5*width, y+.75*height);
    }
}

function reset_word(){
    // Store all of our buttons and letters in an array
    // Each item contains it's caption and position
    tiles = []

    // First elements are the selected letter spots
    // 1 x 10
    let w=0
    for (let i=0; i<10; i++)
        tiles.push({
	    'letter'   : ' ', // Space means it's blank
	    'state'    : UNKNOWN,
	    'y'        : tile_padding + (w * (tile_padding + tile_width)),
	    'x'        : tile_padding + (i * (tile_padding + tile_width)),
	    'type'     : WORD,
	    'width'    : tile_width,
	    'height'   : tile_height,
	    'position' : i,
        })

    // Next elements are for the keyboard
    let querty_keyboard = [
        'Q','W','E','R','T','Y','U','I','O','P',
        'A','S','D','F','G','H','J','K','L',
        'Z','X','C','V','B','N','M','⌫'];

    let y = (2 * tile_padding) + ((tile_padding + tile_height) * 1);
    let keyboard_width = (key_width + tile_padding) * 10;
    let keyboard_offset = (canvas.width - keyboard_width) / 2;
    let x = keyboard_offset;
    for (i of querty_keyboard){
        if (i == "A"){
            y += tile_height + tile_padding;
            x = keyboard_offset + ((key_width + tile_padding) / 2);
        }
        if (i == "Z"){
            y += tile_height + tile_padding;
            x = keyboard_offset + (key_width + tile_padding);
        }
        tiles.push({ 'letter' : i,
                     'state'  : UNKNOWN,
                     'y'      : y,
                     'x'      : x,
                     'type'   : KEY,
                     'width'  : key_width,
                     'height' : tile_height,
                   });
        x += key_width + tile_padding;
    }

    // Last add button(s)
    tiles.push({ 'letter' : 'Reset',
                 'state'  : UNKNOWN,
                 'y'      : y,
                 'x'      : tile_padding + (9 * (tile_padding + tile_width)),
                 'type'   : BUTTON,
                 'width'  : tile_width,
                 'height' : tile_height,
               });
}


function draw_state(){
    // Clear the canvases
    clear_canvas(overlay, overlay_ctx);
    clear_canvas(canvas, ctx);


    // Make letters in key area match those in word area
    for (let key_tile of tiles){

	if (key_tile.type == KEY){
	    key_tile.state = UNKNOWN;

	    for (let word_tile of tiles)
		if (word_tile.type == WORD && word_tile.letter != ' ')
		    if (key_tile.letter == word_tile.letter)
			key_tile.state = word_tile.state;
	}
    }

    // Draw all the tiles
    for (let i of tiles)
        canvas_draw_tile(ctx, i.x, i.y, i.width, i.height, i);
}

function update_word_list(){
    let short_list = [];

    // Check to see if anything is typed yet...
    let blank = true;
    for (let t of tiles)
	if (t.type == WORD && t.state != UNKNOWN)
	    blank = false;

    if (!blank) {
        // Go through tiles once to get used letters
        let pool = [];
	let must = [];
        for (var tile of tiles)
            if (tile.type == WORD && tile.letter != ' '){
                pool.push(tile.letter);
		if (tile.state == RIGHTPOS || tile.state == WRONGPOS)
		    must.push(tile.letter);
	    }

        // Iterate through each word
        for (let w of dictionary){
            let candidate = true;
	    let pangram = true;
            let warray = w.split('');

	    // Check that it's from the pool of used letters
	    for (let c of warray)
		if (!pool.includes(c)){
		    candidate = false;
		    break;
		}

	    if (candidate == false)
		continue;

	    // Check that it includes the must have letters
	    for (let c of must)
		if (!warray.includes(c)){
		    candidate = false;
		    break;
		}

	    if (candidate == false)
		continue;

	    // Check for positionally specific tiles
            for (var tile of tiles)
                if (tile.type == WORD && tile.letter != ' ')
                    if (tile.state == RIGHTPOS)
                        if (tile.letter != warray[tile.position]){
                            candidate = false;
			    break;
			}

	    if (candidate == false)
		continue;

	    // Check for pangrammedness
	    for (let c of pool)
		if (!warray.includes(c)){
		    pangram = false;
		    break;
		}

            short_list.push({
                "word"        : w,
		"pangram"     : pangram,
		"score"       : w.length <= 4 ? 1 : w.length,
            });
        }
    }

    let words_div = document.getElementById('found_words_div');
    let count_div = document.getElementById('number');
    render_found_words(words_div, count_div, short_list);
}

function hint(n){
    console.log(n)
    hint_length += n;
    hint_length = Math.max(hint_length, 1);
    document.getElementById("hint_length").innerHTML = hint_length;
    update_word_list();
}

function render_found_words(wdiv, cdiv, words) {
    let hint = document.getElementById("hint").checked;

    // Get limits
    let max = Number(document.getElementById("max").value);
    let min = Number(document.getElementById("min").value);

    // Clear out DIV
    wdiv.innerHTML = "";

    cdiv.innerHTML = ": " + words.length;
    if (words.length > 1000){
        cdiv.innerHTML = ": Too Many";
        words = words.slice(0, 1000);
    }

    // Add each answer to DIV
    for (var w of words){
	if (w.word.length < min || w.word.length > max) continue;
        let span = document.createElement('span');
        if (hint)
            span.appendChild(document.createTextNode(w.word.substring(0,hint_length)+".".repeat(Math.max(0, w.word.length-hint_length))));
        else
            span.appendChild(document.createTextNode(w.word));
        span.appendChild(document.createElement('br'));
	if (w.pangram)
	    span.classList.add("pangram");
	span.title = "Score: " + w.score;
        wdiv.appendChild(span);
    }
}

// User input variables
var mouse_down          = false;
let selected            = null;
let last_touch_position = null;

// Canvas
var canvas;
var width;
var height;
var ctx;

// Overlay
var overlay;
var overlay_ctx;

// Defines
const UNKNOWN  = 1;
const NOTUSED  = 2;
const WRONGPOS = 3;
const RIGHTPOS = 4;
const CLICKED  = 5;

const KEY    = 1;
const WORD   = 2;
const BUTTON = 3;

const UNICODE_DELETE = "⌫";

// Settings
let tile_height = 62;
let tile_width = tile_height;
let key_width = 42;
let tile_padding = 10;
let hint_length = 3;

// State
let tiles = []; // All visible tiles

function main() {
    // Canvas
    canvas  = document.getElementById("canvas");
    width   = canvas.width;
    height  = canvas.height;
    ctx     = canvas.getContext("2d");

    // Overlay
    overlay     = document.getElementById("overlay");
    overlay_ctx = overlay.getContext("2d");

    // Touch listeners
    overlay.addEventListener('touchstart', input_start_touch, false);
    overlay.addEventListener('touchmove',  input_move_touch, false);
    overlay.addEventListener('touchend',   input_end_touch, false);

    // Mouse listeners
    overlay.addEventListener('mousedown',  input_down_mouse);
    overlay.addEventListener('mousemove',  input_move_mouse);
    overlay.addEventListener('mouseup',    input_up_mouse);

    reset_word();

    // Draw state
    draw_state();

}

window.onload = function() { main(); };
