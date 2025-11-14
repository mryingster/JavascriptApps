function compare(a, b){
    if (a.word < b.word)
        return -1;
    if (a.word > b.word)
        return 1;
    return 0;
}

function render_found_words(div, words) {
    // Clear out DIV
    div.innerHTML = "";

    // Sort words
    words.sort(compare);

    // Add each answer to DIV
    for (var w of words){
        div.appendChild(create_word_element(w));
    }
}

function create_word_element(word){
    let span = document.createElement('span');
    if (word.duplicate)
        span.className = 'duplicate';
    if (word.duplicate === undefined)
        span.onclick = () => reveal_word(word.path);
    else
        span.onclick = function() {
            word.duplicate = ! word.duplicate;
            render_found_words(document.getElementById('found_words_div'), words_found);
            render_score(words_found);
        };
    span.appendChild(document.createTextNode(word.word + (word.score != undefined ? " ("+word.score+")": "")));
    span.appendChild(document.createElement('br'));
    return span;
}

// Canvas Functions
function clear_canvas(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw_word_overlay(ctx, path, valid=false, new_word=false, mouse_position=null){
    clear_canvas(ctx);
    if (path.length == 0) return;

    var color = "rgba(200, 128, 0, 0.6)";
    if (valid)
        if (new_word)
            var color = "rgba(50, 200, 0, 0.6)";

    var x = path[0].x;
    var y = path[0].y;

    ctx.beginPath();
    ctx.moveTo(
        (x * spacing) + (spacing / 2),
        (y * spacing) + (spacing / 3),
    );

    for (var i=1; i<path.length; i++){
        x = path[i].x;
        y = path[i].y;
        ctx.lineTo(
            (x * spacing) + (spacing / 2),
            (y * spacing) + (spacing / 3),
        );
    }

    if (mouse_position)
        ctx.lineTo(mouse_position.x, mouse_position.y);

    ctx.lineWidth = 65;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.stroke();

    return;
}

function render_grid(ctx, game){
    clear_canvas(ctx);

    // Draw cursor
    ctx.fillStyle = "#aabbff";
    ctx.fillRect(
    	cursor.x * spacing + spacing * .15,
	cursor.y * spacing,
	spacing * .75,
	spacing * .75
    );

    // Draw letters
    for (let y=0; y<game.length; y++) {
	for (let x=0; x<game[y].length; x++) {
	    let px = (x * spacing) + (spacing / 2);
	    let py = (y * spacing) + (spacing / 2);

	    ctx.font = "bold "+(.5 * spacing)+"px Arial";
	    ctx.textAlign = "center";
	    ctx.fillStyle = "#00177A";
	    ctx.fillText(game[y][x], px, py);
        }
    }
}

function solve() {
    var letters = "";
    for (var i=0; i<this_game.length; i++)
        letters += this_game[i].join("");
    letters = set(letters.toUpperCase()).join("");

    var pattern = new RegExp("^["+letters+"]{"+min_word_length+",}$", "i");
    for (var i=0; i<dictionary.length; i++){
        if (dictionary[i].match(pattern)) {
            this_dict.push(dictionary[i].toUpperCase());
        }
    }

    find_solutions(this_game, this_dict);
}

// Keyboard listener
document.addEventListener('keydown', function(e) {
    user_input(e);
});

function user_input(e) {
    // Alphabet
    if (e.keyCode >= 65 && e.keyCode <= 90) {
	this_game[cursor.y][cursor.x] = e.key.toUpperCase();
	move_cursor(RIGHT);
    }

    // Delete
    if (e.keyCode == 8) {
	this_game[cursor.y][cursor.x] = " ";
	move_cursor(LEFT);
    }

    // Left
    if (e.keyCode == 37) {
	move_cursor(LEFT);
    }

    // Up
    if (e.keyCode == 38) {
	move_cursor(UP);
    }

    // Right
    if (e.keyCode == 39) {
	move_cursor(RIGHT);
    }

    // Down
    if (e.keyCode == 40) {
	move_cursor(DOWN);
    }

    // Stop the event from doing anything automatically
    if ("preventDefault" in e)
        e.preventDefault();

    render_grid(ctx, this_game);
    find_solutions(this_game, dictionary)
}

function move_cursor(d) {
    if (d == UP) {
	cursor.y = Math.max(cursor.y - 1, 0);
    }

    if (d == DOWN) {
	cursor.y = Math.min(cursor.y + 1, game_height - 1);
    }

    if (d == LEFT) {
	cursor.x -= 1;
	if (cursor.x < 0) {
	    if (cursor.y > 0) {
		cursor.x = game_width - 1;
		cursor.y -= 1;
	    } else {
		cursor.x = 0;
	    }
	}
    }

    if (d == RIGHT) {
	cursor.x += 1;
	if (cursor.x > game_width - 1) {
	    if (cursor.y < game_height - 1) {
		cursor.x = 0;
		cursor.y += 1;
	    } else {
		cursor.x = game_width - 1;
	    }
	}
    }

    return;
}

function create_game_link(game){
    var c2 = btoa(game.map(function(a) { return a.join(',') } ).join(' '));
    //console.log("Encoded", c2);
    document.getElementById("game_link").href = window.location.href.split('?')[0] + "?" + c2;
}

function decode_game_link(c2){
    var game = atob(c2).split(" ").map(function(r) { return r.split(',') });
    return game;
}

function load_dict() {
    // Load Binary File
    var req = new XMLHttpRequest();
    req.onload = function(e) {
	var dict_input = req.response;
	parse_dict(dict_input);
        solve();
    }
    req.open("GET", 'words.txt');
    req.responseType = "text";
    req.send();
}

function parse_dict(text){
    var words = text.split('\r');
    for (var i=2; i<words.length; i++){
        var word = words[i];
        if (word.length > 2)
            dictionary.push(word);
    }
}

function word_from_moves(moves){
    var word = "";
    for (var i=0; i<moves.length; i++){
        word += this_game[moves[i].y][moves[i].x].toUpperCase();
    }
    return word
}

// Custom includes function because built in doesn't work for multidimensional arrays???
function contains(a, coord){
    return !!a.find(a => a.x == coord.x && a.y == coord.y);
}

// Cheap and dirty Set function
function set(a){
    var r = [];
    for (var i=0; i<a.length; i++)
        if (r.includes(a[i]) == false)
            r.push(a[i]);
    return r;
}

function create_trie(dict){
    var trie = {};

    for (var i=0; i<dict.length; i++){
	var word = dict[i];
	var path = trie;
	for (var n=0; n<word.length; n++){
	    var letter = word[n];
	    if (!(letter in path)){
                path[letter] = { '_': word.slice(0,n+1)};
	    }
	    path = path[letter];
	    if (n == word.length -1){
                path[''] = {word:word}
	    }
	}
    }
    //console.log('Trie creation done');

    return trie;
}

function find_solutions(puzzle, dictionary){
    var trie = create_trie(dictionary);

    // Main solving function
    function solve(puzzle, trie){
        var words = [];

        for (var y in puzzle){
            var row = puzzle[+y];
            for (var x in row){
                var letter = row[+x].toUpperCase();

                // Special case for words starting with two letter tiles
                if (letter.length == 2){
                    if (trie[letter[0]][letter[1]])
                        words = words.concat(extending(letter, trie[letter[0]][letter[1]], [{x:+x, y:+y}]));
                } else {
                    if (trie[letter])
                        words = words.concat(extending(letter, trie[letter], [{x:+x, y:+y}]));
                }
            }
        }
        return words;
    }

    // Find words from path in dictionary
    function extending(word, node, path){
        var words = [];

        if (node['']){
            words.push({word:word, path:path})
        }

        for (let neighbor of neighbors(path[path.length-1])) {
            if (!contains(path, neighbor)){
		if (puzzle[neighbor.y][neighbor.x] == undefined) continue;
                let letter = puzzle[neighbor.y][neighbor.x].toUpperCase();

                if (letter.length == 2){
                    if (node[letter[0]])
                        if (node[letter[0]][letter[1]])
                            words = words.concat(extending(word+letter, node[letter[0]][letter[1]], path.concat(neighbor)));
                } else {
                    if (node[letter]){
                        words = words.concat(extending(word+letter, node[letter], path.concat(neighbor)));
                    }
                }
            }
        }

        return words;
    }

    // Find wordy tile neighbors
    function neighbors(coord){
        var neighbors = [];
        for (var x=Math.max(coord.x-1, 0); x<=Math.min(coord.x+1, game_width-1); x++){
            for (var y=Math.max(coord.y-1, 0); y<=Math.min(coord.y+1, game_height-1); y++){
                if (x == coord.x && y == coord.y) continue;
                neighbors.push({x:x, y:y});
            }
        }

        return neighbors;
    }

    // Filter answers so no duplicates or words found by user show up
    var answers = solve(puzzle, trie);
    var answers_filtered = []
    answers_filtered.includes = word => !!answers_filtered.find(w => w.word == word);
    for (var w of answers)
        if (!answers_filtered.includes(w.word) && ! words_found.includes(w.word))
            answers_filtered.push(w);

    render_found_words(document.getElementById("all_words_div"), answers_filtered);

    // Unhide DIV
    document.getElementById("all_words").className = "visible";
}

function reveal_word(path){
    //canvas_draw_game(this_game);
    draw_word_overlay(overlay_ctx, path);
}

var dictionary  = [];
var min_word_length = 4;

// Game State
var this_game   = null;
var this_dict   = null;
var words_found = null;

// Canvas
var canvas  = null;
var width   = null;
var height  = null;
var ctx     = null;

//overlay
var overlay     = null;
var overlay_ctx = null;

// Figure out tile sizes
const tile_size   = 120;
const game_border = 30;
const game_width  = 6;
const game_height = 8;
var spacing     = null;

let cursor  = { x:0, y:0 };
const UP    = 1;
const DOWN  = 2;
const LEFT  = 3;
const RIGHT = 4;

window.onload = function () {
    canvas  = document.getElementById("canvas");
    width   = canvas.width;
    height  = canvas.height;
    ctx     = canvas.getContext("2d");

    //overlay
    overlay     = document.getElementById('overlay');
    overlay_ctx = overlay.getContext("2d");

    // Figure out tile sizes
    spacing     = canvas.width / (game_width);

    this_game=[
	["E","R","E","D","E","L"],
	["H","U","N","E","B","T"],
	["N","T","S","R","U","S"],
	["E","Y","T","A","T","E"],
	["B","T","L","S","U","D"],
	["U","N","E","O","E","T"],
	["L","I","A","R","U","N"],
	["O","U","S","F","A","B"],
    ]

    render_grid(ctx, this_game);

    this_dict = [];
    words_found = [];

    if (dictionary.length == 0){
        load_dict(null);
    }
}
