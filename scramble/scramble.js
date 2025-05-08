// Touch Functions
function pageCoords(el, stop) {
    let off= { x:0, y:0 };
    for (; el != null && el != stop; el = el.offsetParent) {
        off.x += el.offsetLeft;
        off.y += el.offsetTop;
    }
    return off;
}

function getTouchPosition(overlay, e) {
    let x = null;
    let y = null;

    if(e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            let touch = e.touches[0]; // Get the information for finger #1
            let coords = pageCoords(touch.target);
            x = touch.pageX-coords.x;
            y = touch.pageY-coords.y;
        }
    }

    return {x:x, y:y};
}

function input_down_touch(e) {
    if (game_active == false) return;
    mouse_down = true;
    last_pos = getTouchPosition(overlay, e)
    highlight_selected_tile(last_pos);
    e.preventDefault();
}

function input_move_touch(e) {
    if (mouse_down == true) {
        last_pos = getTouchPosition(overlay, e)
        highlight_selected_tile(last_pos);
        e.preventDefault();
    }
}

function input_up_touch(e) {
    if (game_active == false) return;
    mouse_down = false;
    type_letter(last_pos);
}

//Mouse Functions
function getCursorPosition(overlay, event) {
    // Determine where clicked
    const rect = overlay.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x:x, y:y};
}

function input_down_mouse(e) {
    if (game_active == false) return;
    mouse_down = true;
    highlight_selected_tile(getCursorPosition(overlay, e));
}

function input_move_mouse(e) {
    if (mouse_down == true)
        highlight_selected_tile(getCursorPosition(overlay, e));
}

function input_up(e) {
    if (game_active == false) return;
    mouse_down = false;
    type_letter(getCursorPosition(overlay, e));
}

// Keyboard listener
document.addEventListener('keydown', function(e) {
    user_input(e);
});


function pixels_to_coords(coords) {
    let mouse_x = coords.x - game_border;
    let mouse_y = coords.y - game_border;

    let gridsize = tile_size + spacing;

    let x = Math.floor(mouse_x / (gridsize));
    let y = Math.floor(mouse_y / (gridsize));

    return {x:x, y:y};
}

function highlight_selected_tile(coords) {
    let pos = pixels_to_coords(coords);
    clear_canvas(overlay, overlay_ctx);
    draw_over_tile(pos, "rgba(200, 128, 0, 0.6)");
    highlight_used_tiles(false);
}

function highlight_used_tiles() {
    clear_canvas(overlay, overlay_ctx);

    for (let tile of tiles_used)
        draw_over_tile(tile, 'rgba(0,0,0,.3)');
}

function draw_over_tile(pos, color) {
    overlay_ctx.fillStyle = color;
    canvas_draw_rounded_rectangle(
        overlay_ctx,
        (pos.x * spacing) + (pos.x * tile_size) + game_border,
        (pos.y * spacing) + (pos.y * tile_size) + game_border,
        tile_size,
        tile_size,
        tile_radius,
    );
    overlay_ctx.fill();
}

function type_letter(coords) {
    clear_canvas(overlay, overlay_ctx);
    update_user_input_field(pixels_to_coords(coords));
}

function render_score(words) {
    this_score = 0;
    for (let w of words) {
        if (! w.duplicate) {
            this_score += w.score;
        }
    }
    document.getElementById("score").innerHTML = "(Score: " + this_score + ")";
}

function render_found_words(div, words) {
    // Clear out DIV
    div.innerHTML = "";

    // Add each answer to DIV
    for (let w of words) {
        div.appendChild(create_word_element(w));
    }
}

function create_word_element(word) {
    let span = document.createElement('span');
    if (word.duplicate)
        span.className = 'duplicate';
    /*
    if (word.duplicate === undefined)
        span.onclick = () => reveal_word(word.path);
    else
        span.onclick = function() {
            word.duplicate = ! word.duplicate;
            render_found_words(document.getElementById('found_words_div'), words_found);
            render_score(words_found);
        };
    */

    span.appendChild(document.createTextNode(word.word + (word.score != undefined ? " ("+word.score+")": "")));
    span.appendChild(document.createElement('br'));
    return span;
}

function distance(x1, y1, x2, y2) {
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    return Math.sqrt(dx * dx + dy * dy);
}

// Canvas Functions
function clear_canvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvas_draw_rounded_rectangle(c, x, y, width, height, radius) {
    c.beginPath();
    c.moveTo(x, y + radius);
    c.arc(x + radius, y + radius, radius, Math.PI, -1/2 * Math.PI); // Top left

    c.lineTo(x + width - radius, y);
    c.arc(x + width - radius, y + radius, radius, -1/2 * Math.PI, 0); // Top Right

    c.lineTo(x + width, y + height - radius);
    c.arc(x + width - radius, y + height - radius, radius, 0, 1/2 * Math.PI); // Bottom Right

    c.lineTo(x + radius, y + height);
    c.arc(x + radius, y + height - radius, radius, 1/2 * Math.PI, Math.PI); // Bottom Left
    c.lineTo(x, y + radius);
    c.closePath();
}

function canvas_draw_tile(x, y, width, text, center) {
    let size = width/2;

    let colors = {
        corner1 : "#F9F9F9",
        corner2 : "#9F9F9F",
        corner3 : "#CBCED5",
        corner4 : "#C8C9C9",
        circle  : "#EBEBEB",
        text    : "#00177A",
    };
    if (center)
        colors = {
            corner1 : "#0B74FF",
            corner2 : "#0068F1",
            corner3 : "#005FDB",
            corner4 : "#0051BA",
            circle  : "#348CFF",
            text    : "#F9F9F9",
        };


    // Draw shadow
    ctx.fillStyle = "#aaa";
    ctx.filter = "blur(6px)";
    canvas_draw_rounded_rectangle(ctx, x, y+5, size*2, size*2, tile_radius)
    ctx.fill();
    ctx.filter = "none";;

    // Draw beveled edges
    ctx.fillStyle = colors.corner1;
    canvas_draw_rounded_rectangle(ctx, x, y, size, size, tile_radius)
    ctx.fill();

    ctx.fillStyle = colors.corner2;
    canvas_draw_rounded_rectangle(ctx, x+size, y+size, size, size, tile_radius)
    ctx.fill();

    ctx.fillStyle = colors.corner3;
    canvas_draw_rounded_rectangle(ctx, x+size, y, size, size, tile_radius)
    ctx.fill();

    ctx.fillStyle = colors.corner4;
    canvas_draw_rounded_rectangle(ctx, x, y+size, size, size, tile_radius)
    ctx.fill();

    // Draw center
    ctx.fillStyle = colors.circle;
    ctx.beginPath();
    ctx.arc(x+size, y+size, size, 0, 2 * Math.PI);
    ctx.fill();

    // Modify blank text
    if (text == "#")
        text = '\u{25A0}';

    // Draw Letter
    ctx.font = "bold "+(1.5*size)+"px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.text;
    ctx.fillText(text, x+size, y+1.5*size);
}

function canvas_draw_cover() {
    canvas_draw_game([["?", "?", "?"], ["?", "?", "?"], ["?", "?", "?"]]);
}

function canvas_draw_game(game) {
    // Clear out any old game
    clear_canvas(overlay, overlay_ctx);

    for (let x=0; x<num_tiles; x++) {
        for (let y=0; y<num_tiles; y++) {
            canvas_draw_tile(
                (x * spacing) + (x * tile_size) + game_border,
                (y * spacing) + (y * tile_size) + game_border,
                tile_size,
                game[y][x],
                x == 1 && y == 1 ? true : false
            )
        }
    }
}

function create_game_link(game) {
    let c2 = btoa(foundation + ":" + game.map(function(a) { return a.join(',') } ).join(' '));
    //console.log("Encoded", c2);
    document.getElementById("game_link").href = window.location.href.split('?')[0] + "?" + c2;
}

function decode_game_link(c2) {
    //console.log(atob(c2));
    foundation = atob(c2).split(":")[0];
    let game = atob(c2).split(":")[1].split(" ").map(function(r) { return r.split(',') });
    return game;
}

function setup_new_game(state=null) {
    // Clear timer
    clearTimeout(timer);
    document.getElementById('timer').innerHTML = "--:--";

    // Clear old game
    clear_canvas(overlay, overlay_ctx);
    canvas_draw_cover();
    this_score = 0;
    document.getElementById("score").innerHTML = "";
    document.getElementById("all_words").className = "hidden";
    game_active = false;
    game_setup = true;
    document.getElementById("start_stop").innerHTML = "Start";
    document.getElementById("shuffle").disabled = true;
    tiles_used = [];
    highlight_used_tiles();

    if (state == null) {
        // Pick random word
        foundation = nine_letter_words[Math.floor(Math.random() * nine_letter_words.length)];

        // Shuffle word
        let this_shuffle = foundation.split("");

        this_shuffle = shuffle(this_shuffle);

        this_game = [];
        let this_row = [];
        for (let i=0; i<this_shuffle.length; i++) {
            this_row.push(this_shuffle[i]);
            if (this_row.length == game_size) {
                this_game.push(this_row);
                this_row = [];
            }
        }
        central_char = this_shuffle[4];
    } else {
        this_game = state.slice(0);
        central_char = this_game[1][1];
    }

    // Update URL and create link
    create_game_link(this_game);
}

function start_stop() {
    if (game_active) {
        end_game();
    } else {
        if (game_setup)
            start_game();
        else
            setup_new_game();
    }
}

function find_all_words() {
    // Cut dictionary down to words with same letters
    let partial_dictionary = [];
    let pattern = new RegExp("^["+foundation+"]{"+min_word_length+",}$", "i");
    for (let word of dictionary)
        if (word.match(pattern))
            partial_dictionary.push(word.toUpperCase());

    // Cut out words that don't contain central letter
    let words = [];
    for (let word of partial_dictionary)
        if (word.indexOf(central_char) >= 0)
            words.push(word);

    // Create trie from minimized dictionary
    let trie = create_trie(words);

    // Main solving function
    function solve(puzzle, trie) {
        let words = [];
        for (let y in puzzle) {
            let row = puzzle[+y];
            for (let x in row) {
                let letter = row[+x];
                if (trie[letter])
                    words = words.concat(extending(letter, trie[letter], [{x:+x, y:+y}], puzzle));
            }
        }
        return words;
    }

    // Find words from path in dictionary
    function extending(word, node, path, puzzle) {
        let words = [];
        if (node[''])
            words.push({word:word, path:path})

        for (let neighbor of neighbors(path[path.length-1])) {
            if (!contains(path, neighbor)) {
                let letter = puzzle[neighbor.y][neighbor.x].toUpperCase();
                if (node[letter]) {
                    let x=extending(word+letter, node[letter], path.concat(neighbor), puzzle)
                    words = words.concat(x);
                }
            }
        }

        return words;
    }

    // Find wordy tile neighbors
    function neighbors(coord) {
        let neighbors = [];
        for (let x=0; x<game_size; x++) {
            for (let y=0; y<game_size; y++) {
                if (x == coord.x && y == coord.y)
                    continue;
                neighbors.push({x:x, y:y});
            }
        }
        return neighbors;
    }

    // Filter answers so no duplicates or words found by user show up
    let answers = solve(this_game, trie);
    let answers_filtered = []
    answers_filtered.includes = word => !!answers_filtered.find(w => w.word == word);
    for (let w of answers)
        if (!answers_filtered.includes(w.word))
            answers_filtered.push(w);

    //console.log("Narrowed down to ", answers_filtered.length, "words");
    return answers_filtered;
}

function start_game() {
    game_active = true;
    game_setup = false;
    document.getElementById("start_stop").innerHTML = "Give Up";
    document.getElementById("shuffle").disabled = false;
    this_score = 0;
    words_found = [];
    words_found.includes = word => !!words_found.find(w => w.word == word);

    clear_input();

    // get our dictionary for this game
    this_dict = find_all_words();

    // Draw dice to screen
    canvas_draw_game(this_game);

    // Start Timer
    start_timer();

    // Hide words
    document.getElementById("score").innerHTML = "";
    document.getElementById('found_words_div').innerHTML = "";
    document.getElementById("found_words").className = "visible";
    document.getElementById("all_words").className = "hidden";

    // Clear overlay
    tiles_used = [];
    highlight_used_tiles();

}

function update_user_input_field(pos) {
    let c = this_game[pos.y][pos.x];

    // Make sure only valid letters are pressed
    if (foundation.indexOf(c) < 0) {
        highlight_used_tiles();
        return;
    }

    // Verify that the character hasn't been used too many times.
    //if (input.value.split(c).length >= foundation.split(c).length) {
    //    highlight_used_tiles();
    //    return;
    //}

    for (let used of tiles_used)
        if (used.x == pos.x && used.y == pos.y) {
            highlight_used_tiles();
            return;
        }

    // Do it
    input.innerHTML += c;

    // Mark tile as used
    tiles_used.push(pos)
    highlight_used_tiles();
}

function update_user_input(c) {
    // Find corresponding tile for selected letter, (favor center letter)
    for (let y of [1,0,2])
        for (let x of [1,0,2]) {
            let valid = true;
            for (let tile of tiles_used)
                if (tile.x == x && tile.y == y)
                    valid = false;

            if (valid) {
                if (this_game[y][x] == c) {
                    update_user_input_field({x:x, y:y});
                    return;
                }
            }
        }
}

function user_input(e) {
    if (!game_active) return;

    // Alphabet
    if (e.keyCode >= 65 && e.keyCode <= 90)
        update_user_input(String.fromCharCode(e.keyCode));

    // Delete
    if (e.keyCode == 8) {
        input.innerHTML = input.innerHTML.slice(0,input.innerHTML.length-1);
        tiles_used.pop();
        highlight_used_tiles();
    }

    // Clear
    if (e.keyCode == 12) {
        clear_input();
        tiles_used = [];
        highlight_used_tiles();
    }

    // Return
    if (e.keyCode == 13)
        submit_word(input.innerHTML);

    // Stop the event from doing anything automatically
    if ("preventDefault" in e)
        e.preventDefault();
}

function shuffle_tiles() {
    // Do 9 random swaps
    for (let i=0; i<9; i++) {
        let x1 = Math.floor(Math.random() * game_size);
        let x2 = Math.floor(Math.random() * game_size);
        let y1 = Math.floor(Math.random() * game_size);
        let y2 = Math.floor(Math.random() * game_size);

        // Can't swap with self
        if (x1 == x2 && y1 == y2) continue;

        // Can't change center
        if (x1 == 1 && y1 == 1 || x2 == 1 && y2 == 1) continue;

        // Actually do the swap
        let t1 = this_game[y1][x1];
        this_game[y1][x1] = this_game[y2][x2].slice();
        this_game[y2][x2] = t1;

        for (let i=0; i<tiles_used.length; i++) {
            if (tiles_used[i].x == x1 && tiles_used[i].y == y1) {
                tiles_used[i].x = x2;
                tiles_used[i].y = y2;
            } else if (tiles_used[i].x == x2 && tiles_used[i].y == y2) {
                tiles_used[i].x = x1;
                tiles_used[i].y = y1;
            }
        }
    }

    // Redraw everything
    canvas_draw_game(this_game);
    highlight_used_tiles();
}

function animate_feedback(opacity) {
    document.getElementById("feedback").style.opacity = opacity;

    if (opacity > 0)
        feedback_timer = setTimeout(() => animate_feedback(opacity - .05), 15);
}

function feedback_message(message, color) {
    let element = document.getElementById("feedback");
    element.innerHTML = message;
    element.style.opacity = 1;
    element.style.backgroundColor = color;

    clearTimeout(feedback_timer);
    feedback_timer = setTimeout(() => animate_feedback(1), 1500);
}

function animate_shake(times) {
    let element = document.getElementById("user_input");
    let position = Math.floor(5 * Math.sin(.5 * times));
    element.style.left = position + "px";

    if (times == 0)
        element.style.left = null;
    else
        feedback_timer = setTimeout(() => animate_shake(times-1), 20);
}

function submit_word(word) {
    if (this_dict.includes(word) == true) {
        if(words_found.includes(word) == true) {
            // Word already found
            feedback_message("Already found!", "#ffff00");

        } else {
            // New word found!
            let word_score = word.length - min_word_length + 1;
            let message = "Nice";
            if (word.length > 4)
                message = "Great!"
            if (word.length > 6)
                message = "Awesome!"
            if (word.length == 9)
                message = "Pangram!"
            feedback_message("+"+word_score+" "+message, "#00ee00");

            // Save word to word found list
            words_found.push({word:word, score:word_score, duplicate:false, path:[]});
            render_found_words(document.getElementById('found_words_div'), words_found);

            render_score(words_found);
        }
    } else {
        if (word.length < min_word_length)
            feedback_message("Word is too short!", "#dd0000");
        else if (word.indexOf(central_char) >= 0)
            feedback_message("Not in word list", "#dd0000");
        else
            feedback_message("Missing required letter, "+central_char, "#dd0000");
        animate_shake(20);
    }

    clear_input();

    // remove used letters
    tiles_used = [];
    highlight_used_tiles();
}

function clear_input() {
    input.innerHTML = "";
}

function end_game() {
    game_active = false;
    document.getElementById("start_stop").innerHTML = "New Game";
    document.getElementById("shuffle").disabled = true;

    // Clear time remaining text
    document.getElementById('timer').innerHTML = "--:--";

    // Stop timer
    stop_timer();

    // Find and show words
    find_solutions(this_game, this_dict);
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function nextLoop() {
    let refresh = 250;
    let time_left = duration - (new Date().getTime() - timer_start) / 1000;

    // keep track of time, update colors, etc.
    let minutes = Math.floor(time_left/60);
    let seconds = Math.floor(time_left) % 60;
    if (seconds < 10) { seconds = "0" + seconds; }
    if (minutes < 10) { minutes = "0" + minutes; }
    time_left_string = minutes + ":" + seconds
    timer = setTimeout(function() { nextLoop() }, refresh);

    if (time_left < 1) {
        time_left_string = "00:00";
    }

    if (time_left < 0) {
        end_game();
    }

    document.getElementById('timer').innerHTML = time_left_string;

}

function start_timer() {
    timer_start = new Date().getTime();
    nextLoop();
}

function stop_timer() {
    clearTimeout(timer);
}

// Custom includes function because built in doesn't work for multidimensional arrays???
function contains(a, coord) {
    return !!a.find(a => a.x == coord.x && a.y == coord.y);
}

// Cheap and dirty Set function
function set(a) {
    let r = [];
    for (let i=0; i<a.length; i++)
        if (r.includes(a[i]) == false)
            r.push(a[i]);
    return r;
}

function create_trie(dict) {
    let trie = {};

    for (let i=0; i<dict.length; i++) {
        let word = dict[i];
        let path = trie;
        for (let n=0; n<word.length; n++) {
            let letter = word[n];
            if (!(letter in path)) {
                path[letter] = { '_': word.slice(0,n+1)};
            }
            path = path[letter];
            if (n == word.length -1) {
                path[''] = {word:word}
            }
        }
    }

    return trie;
}

function find_solutions(puzzle, dictionary) {
    // Go through dictionary and find words that user didn't find
    let answers_filtered = [];
    for (let w of this_dict)
        if (!words_found.includes(w.word))
            answers_filtered.push(w);

    render_found_words(document.getElementById("all_words_div"), answers_filtered);

    // Unhide DIV
    document.getElementById("all_words").className = "visible";
}

function first_load() {
    // Check for URL to see if there is existing game
    let game_id = window.location.href.split('?')[1];
    let game_state;
    if (game_id)
        game_state = decode_game_link(game_id);

    // Set up canvas
    canvas = document.getElementById("canvas");
    width   = canvas.width;
    height  = canvas.height;
    ctx     = canvas.getContext("2d");

    overlay = document.getElementById('overlay');
    overlay_ctx = overlay.getContext("2d");

    input   = document.getElementById('user_input');

    // Calculate Dimensions based on Canvas
    spacing = (canvas.width - (2 * game_border) - (tile_size * num_tiles)) / (num_tiles - 1);

    // Touch listeners
    overlay.addEventListener('touchstart', input_down_touch, false);
    overlay.addEventListener('touchmove',  input_move_touch, false);
    overlay.addEventListener('touchend',   input_up_touch, false);

    // Mouse listeners
    overlay.addEventListener('mousedown',  input_down_mouse);
    overlay.addEventListener('mousemove',  input_move_mouse);
    overlay.addEventListener('mouseup',    input_up);

    // Link up HTML elements
    document.getElementById("start_stop").onclick = function () { start_stop() };
    document.getElementById("shuffle").onclick = function () { shuffle_tiles() };
    document.getElementById("clear").onclick = function () { user_input({keyCode:12}) };
    document.getElementById("delete").onclick = function () { user_input({keyCode:8}) };
    document.getElementById("enter").onclick = function () { user_input({keyCode:13}) };

    // Let's go!
    setup_new_game(game_state);
}

// Game Rules
let game_size   = 3;
let min_word_length = 4;
let duration    = 3 * 60;

// Game State
let timer_start = null;
let timer       = null;
let this_game   = null;
let this_dict   = null;
let this_score  = 0;
let words_found = null;
let game_active = false;
let game_setup  = false;
let foundation  = ""; // 9 letter word which puzzle is built from
let central_char= ""; // Required character that appears in middle block
let tiles_used  = [];

// User input variables
let mouse_down      = false;
let mouse_selection = [];
let last_pos        = null;

// Canvas
let canvas;
let width;
let height;
let ctx;

// overlay
let overlay;
let overlay_ctx;

// Input
let input;

// Animation
let feedback_timer  = null;
let animation_timer = null;

// Figure out tile sizes
let tile_size   = 130;
let game_border = 30;
let num_tiles   = game_size;
let spacing;
let tile_radius = 10;

window.onload = function () { first_load() };
