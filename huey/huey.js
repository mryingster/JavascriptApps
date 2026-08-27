
let buffer;
let bctx;

let canvas;
let ctx;

let overlay;
let octx;

let width;
let height;

let tiles_wide;
let tiles_high;
let tile_width;
let tile_height;

const activePointers = new Map();

let tiles = [];
let moves = 0;
let timer = null;
let inactive = false;

class Tile {
    constructor(ctx, octx, imageData, stationary, x, y, w, h, i) {
	this.ctx = ctx;
	this.octx = octx;
	this.index = i;

	this.image = imageData;
	this.stationary = stationary;

	this.width = w;
	this.height = h;

	this.correct_grid_coords = {x:x, y:y},
        this.last_grid_coords = {x:x, y:y},
        this.current_grid_coords = {x:x, y:y},
        this.current_pix_coords = {x:x * w, y:y * h},

        this.moves = 0
    }

    normalize() {
	// Reset pixel positions
	this.current_pix_coords = {
            x: this.current_grid_coords.x * this.width,
            y: this.current_grid_coords.y * this.height
	};

	// Reset last positions
	this.last_grid_coords = {
            x: this.current_grid_coords.x,
            y: this.current_grid_coords.y
	};
    }

    renderBlank() {
	this.ctx.globalAlpha = 1;
	this.ctx.fillStyle = "rgb(0,0,0)";
	this.ctx.fillRect(
	    this.last_grid_coords.x * this.width,
	    this.last_grid_coords.y * this.height,
	    this.width,
	    this.height
	);
    }

    renderStatic() {
	this.placeGradient(this.ctx);
    }

    renderMoving() {
	this.placeGradient(this.octx);
    }

    placeGradient(ctx) {
	ctx.putImageData(
	    this.image,
	    this.current_pix_coords.x,
	    this.current_pix_coords.y
	);
    }
}

// Input Functions

function input_down(e) {
    // Don't do anything if we are inactive
    if (inactive) return;

    // Determine selection
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;

    let grid_x = Math.floor(x / tile_width);
    let grid_y = Math.floor(y / tile_height);
    let selected = null;

    for (let i=0; i<tiles.length; i++)
        if (tiles[i].current_grid_coords.x == grid_x &&
	    tiles[i].current_grid_coords.y == grid_y) {
	    selected = i;
        }

    if (selected == null)
	return;

    // If selected tile is stationary, ignore
    if (tiles[selected].stationary == true)
	return;

    // Create pointer
    activePointers.set(e.pointerId, {
        object: tiles[selected],
        offsetX: x - tiles[selected].current_pix_coords.x,
        offsetY: y - tiles[selected].current_pix_coords.y,
    });

    e.preventDefault();
}

function input_move(e) {
    const drag = activePointers.get(e.pointerId);

    if (!drag) return;

    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;

    const { object, offsetX, offsetY } = drag;

    object.current_pix_coords.x = x - offsetX;
    object.current_pix_coords.y = y - offsetY;

    // redraw
    rerenderOverlay();

    e.preventDefault();
}

function input_up(e) {
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;

    // find nearest slot for dragged tile
    const newPosition = find_closest_tile({x:x, y:y});
    const placedTile = activePointers.get(e.pointerId).object.index;

    // Switch tile positions
    let valid = switch_tiles(placedTile, newPosition, false);

    // Check for winning condition
    if (is_solved() && valid){
        document.getElementById("game_over").classList.remove("hidden");
        document.getElementById("go_moves").innerHTML = moves;
        make_confetti();
    }

    // Remove this pointer
    activePointers.delete(e.pointerId);
    e.preventDefault();

    // Rerender
    rerenderBackground();
    rerenderOverlay();
}

function find_closest_tile(p){
    // Find the closest target
    let radius = Math.max(tile_width, tile_height);
    let closest = -1;

    for (let i=0; i<tiles.length; i++){
        const centerX = tiles[i].current_grid_coords.x * tile_width  + (tile_width  / 2);
        const centerY = tiles[i].current_grid_coords.y * tile_height + (tile_height / 2);

        let distance = Math.abs(
	    Math.hypot(
		centerX - p.x,
                centerY - p.y,
	    )
        );

        if (distance < radius){
            radius = distance;
            closest = i;
        }
    }
    return closest;
}

function switch_tiles(a, b, shuffle){
    if ((tiles[a].stationary || tiles[b].stationary) || (a == b)) {
	tiles[a].normalize();
	tiles[b].normalize();
	return false;
    }

    tiles[a].current_grid_coords = tiles[b].last_grid_coords;
    tiles[b].current_grid_coords = tiles[a].last_grid_coords;

    tiles[a].normalize();
    tiles[b].normalize();

    if (!shuffle)
        tiles[a].moves++;
    increment_moves();

    return true;
}

function rerenderBackground() {
    clear_canvas(ctx);

    for (tile of tiles)
	tile.renderStatic();
}

function rerenderOverlay() {
    clear_canvas(octx);

    for (const [pointerId, pointer] of activePointers) {

	// Draw black tile where the tile once was
	pointer.object.renderBlank();

	// Draw moving block
	pointer.object.renderMoving();
    }
}

// Drawing Functions

function calc_gradient(c1, c2, s, l){
    let color = {r:0, g:0, b:0};
    for (let component of ["r", "g", "b"]){
        let d = c1[component] - c2[component];
        color[component] = c1[component] - (d / l * s);
    }
    return color;
}

function create_gradient(w, h, c1, c2, c3, c4){
    let gradient = [];
    for (let y=0; y<h; y++){
        let row = [];
        // Figure out left and right gradients
        let left = calc_gradient(c1, c3, y, h);
        let right = calc_gradient(c2, c4, y, h);
        // Fill in all the horizontal gradients
        for (let x=0; x<w; x++){
            row.push(calc_gradient(left, right, x, w));
        }
        gradient.push(row);
    }
    return gradient;
}

function random_color(){
    return {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
    }
}

function format_rgb(c){
    return "rgb("+c.r+","+c.g+","+c.b+")";
}

function clear_canvas(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_circle(ctx, x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function draw_tile_to_buffer(ctx, x, y, g, s){
    for (let yp=0; yp<g.length; yp++){
        for (let xp=0; xp<g[0].length; xp++){
            ctx.fillStyle = format_rgb(g[yp][xp]);
            ctx.fillRect(x + xp, y + yp, 1, 1);
        }
    }

    //If tile is stationary, draw black circle on it
    if (s){
        draw_circle(
            ctx,
            x + (tile_width/2),
            y + (tile_height/2),
            3,
            "rgb(0,0,0)"
        );
    }

}

function create_tiles(gs=null){
    reset_moves();

    if (gs != null){
	Number(document.getElementById("width").value = gs.w);
	Number(document.getElementById("height").value = gs.h);
    }

    tiles_wide = Number(document.getElementById("width").value);
    tiles_high = Number(document.getElementById("height").value);
    tile_width = Math.floor(canvas.width / tiles_wide);
    tile_height = Math.floor(canvas.height / tiles_high);

    let gradient_width = tiles_wide + 1;
    let gradient_height = tiles_high + 1;
    let gradient_offset = 1

    if (document.getElementById("subgradient").checked){
        gradient_height += 1;
        gradient_width += 1;
        gradient_offset += 1;
    }

    // If we were not provided a game state, make a new one
    if (gs == null)
	gs = {
	    c1:random_color(),
	    c2:random_color(),
	    c3:random_color(),
	    c4:random_color(),
	    w:tiles_wide,
	    h:tiles_high
	};

    create_game_link(gs);

    // calculate gradient for overall puzzle
    let g = create_gradient(
    	gradient_width,
	gradient_height,
	gs.c1,
	gs.c2,
	gs.c3,
	gs.c4,
    );

    // Create tile with gradient for each pair here
    // Draw gradient to "buffer" canvas, then reference that canvas with the tile data
    clear_canvas(bctx);
    tiles = [];
    for (let x=0; x<g[0].length-gradient_offset; x++)
        for (let y=0; y<g.length-gradient_offset; y++){
            let stationary = false
            if ((x==0 || x==g[0].length-1-gradient_offset) &&
                (y==0 || y==g.length-1-gradient_offset))
                stationary = true;

            // Draw gradient to buffer
            draw_tile_to_buffer(
                bctx,
                x * tile_width,
                y * tile_height,
                create_gradient(
                    tile_width,
                    tile_height,
                    g[y][x],
                    g[y][x+gradient_offset],
                    g[y+gradient_offset][x],
                    g[y+gradient_offset][x+gradient_offset],
                ),
                stationary
            );

            // Create tile data
            tiles.push(new Tile(
		ctx,
		octx,
                bctx.getImageData(x * tile_width, y * tile_height, tile_width, tile_height),
                stationary,
                x,
		y,
		tile_width,
		tile_height,
		tiles.length,
	    ));
        }

    rerenderBackground();
}

// Gameplay Functions

function replay(){
    clearTimeout(timer);
    inactive = true;
    for (let i=0; i<tiles.length; i++)
        tiles[i].moves = 0;
    document.getElementById("game_over").classList.add("hidden");
    timer = setTimeout(() => animate_shuffle(octx, 100), 1000);
}

function new_game(gs=null){
    clearTimeout(timer);
    create_tiles(gs);
    inactive = true;
    document.getElementById("game_over").classList.add("hidden");
    timer = setTimeout(() => animate_shuffle(octx, 100), 1000);
}

function animate_shuffle(ctx, f){
    if (f==0){
	clear_canvas(ctx);
	inactive = false;
	clearTimeout(timer);
	return;
    }

    // for 100-50, white out board
    if (f >= 50)
	ctx.globalAlpha = ((100-f)/50.0);

    // shuffle
    if (f == 50)
	shuffle_tiles(50);

    // for 50-0, reveal shuffled board
    if (f < 50)
	ctx.globalAlpha = (f/50.0);

    clear_canvas(ctx);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw stationary tiles though on the overlay
    for (let tile of tiles)
	if (tile.stationary)
	    tile.renderMoving();
    timer = setTimeout(() => animate_shuffle(ctx, f-1), 10);
}

function reset_moves(){
    moves = 0;
    document.getElementById("moves").innerHTML = "0";
}

function increment_moves(){
    document.getElementById("moves").innerHTML = ++moves;
}

function shuffle_tiles(s){
    while (s > 0){
        let a = Math.floor(Math.random() * tiles.length);
        let b = Math.floor(Math.random() * tiles.length);
        if (a == b) continue;
        switch_tiles(a, b, true);
        s--;
    }

    reset_moves();
    rerenderBackground();
}

function stats(){
    let max_moves = 0;

    // Go through tiles once to get move counts for scale
    for (let i=0; i<tiles.length; i++)
        max_moves = Math.max(tiles[i].moves, max_moves);

    // Go through and draw each one's move count to the screen
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    for (let i=0; i<tiles.length; i++){
        if (tiles[i].stationary) continue;

        ctx.lineWidth = 2;
        ctx.strokeStyle = ["#00FF00", "#00FF00", "#88FF00", "#FFFF00", "#FF8800", "#FF0000"][Math.floor(5.0 * tiles[i].moves / max_moves)]

        // Outline block
        ctx.strokeRect(
            Math.floor(tiles[i].current_pix_coords.x) + 1.5,
            Math.floor(tiles[i].current_pix_coords.y) + 1.5,
            tile_width  - 2,
            tile_height - 2,
        );

        // Write move count
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 4;
        ctx.fillStyle = "#000000";
        ctx.strokeText(tiles[i].moves, tiles[i].current_pix_coords.x + (tile_width / 2), tiles[i].current_pix_coords.y + (tile_height / 2) + 15);
        ctx.fillText(tiles[i].moves, tiles[i].current_pix_coords.x + (tile_width / 2), tiles[i].current_pix_coords.y + (tile_height / 2) + 15);
    }
}

function help(){
    ctx.strokeStyle = "#ff0000";
    for (let i=0; i<tiles.length; i++){
        if (tiles[i].current_grid_coords.x != tiles[i].correct_grid_coords.x ||
            tiles[i].current_grid_coords.y != tiles[i].correct_grid_coords.y)
            ctx.strokeRect(tiles[i].current_pix_coords.x, tiles[i].current_pix_coords.y, tile_width, tile_height, 2);
    }
}

function is_solved(){
    for (let i=0; i<tiles.length; i++){
        if (tiles[i].current_grid_coords.x != tiles[i].correct_grid_coords.x ||
            tiles[i].current_grid_coords.y != tiles[i].correct_grid_coords.y)
            return false;
    }
    inactive = true;
    return true;
}

function create_game_link(game){
    var c2 = btoa(JSON.stringify(game));
    document.getElementById("share").href = window.location.href.split('?')[0] + "?" + c2;
}

function decode_game_link(c2){
    var game = JSON.parse(atob(c2));
    return game;
}

function debug(m, reset=false){
    if (reset)
	document.getElementById("debug_msg").innerHTML = "";
    document.getElementById("debug_msg").innerHTML += "<br>"+m;
}

function first_load(){
    // Check for URL to see if there is existing game
    var game_id = window.location.href.split('?')[1];
    if (game_id)
        var game_state = decode_game_link(game_id);

    // Hook up HTML elements
    buffer = document.getElementById("buffer");
    bctx = buffer.getContext("2d");

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    overlay = document.getElementById("overlay");
    octx = overlay.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    tiles_wide = 7;
    tiles_high = 7;
    tile_width = Math.floor(width / tiles_wide);
    tile_height = Math.floor(height / tiles_high);

    document.getElementById("btn_newgame").onclick = () => { new_game() };
    document.getElementById("btn_stats").onclick = () => { stats() };
    document.getElementById("btn_replay").onclick = () => { replay() };
    document.getElementById("btn_newgame2").onclick = () => { new_game() };
    document.getElementById("btn_debug_generate").onclick = () => { create_tiles() };
    document.getElementById("btn_debug_shuffle").onclick = () => { shuffle_tiles(50) };

    // Pointer listeners
    overlay.addEventListener('pointerdown',  input_down, false);
    overlay.addEventListener('pointermove',  input_move, false);
    overlay.addEventListener('pointerup',    input_up, false);
    overlay.addEventListener('pointercancel',input_up, false);

    // Touch cancellers
    overlay.addEventListener('touchstart', (e) => { e.preventDefault(); });
    overlay.addEventListener('touchmove',  (e) => { e.preventDefault(); });

    // Start a new game
    new_game(game_state);
}

window.onload = function () {
    first_load();
};
