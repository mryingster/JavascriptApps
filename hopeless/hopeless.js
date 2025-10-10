function recursiveDelete(x, y, c){
    // Add block to explosion list!
    explosions.push ({
	"position": {"x" : x * square_size, "y" : y * square_size},
	"velocity": {"x" : Math.random() * 20 - 10, "y" : -30},
	"color":    colors[c],
    });

    // Delete block
    array[y][x] = 0;

    if (y < array.length-1)
	if (array[y+1][x] == c) recursiveDelete(x, y+1, c);
    if (y > 0)
	if (array[y-1][x] == c) recursiveDelete(x, y-1, c);
    if (x < array[y].length)
	if (array[y][x+1] == c) recursiveDelete(x+1, y, c);
    if (x > 0)
	if (array[y][x-1] == c) recursiveDelete(x-1, y, c);

    return;
}

function isValidMove(x, y, c){
    if (y < array.length-1)
	if (array[y+1][x] == c) return true;
    if (y > 0)
	if (array[y-1][x] == c) return true;
    if (x < array[y].length)
	if (array[y][x+1] == c) return true;
    if (x > 0)
	if (array[y][x-1] == c) return true;
    return false;
}

function isGameOver(){
    for (var y=0; y<array.length; y++){
	for (var x=0; x<array[y].length; x++){
	    if (array[y][x] > 0){
		if (isValidMove(x, y, array[y][x])){
		    return false;
		}
	    }
	}
    }
    return true;
}

function shiftDown(){
    var did_something = false;
    for (var y=array.length-1; y>0; y--){
	for (var x=0; x<array[y].length; x++){
	    if (array[y][x] == 0 && array[y-1][x] != 0){
		array[y][x] = array[y-1][x];
		array[y-1][x] = 0
		did_something = true;
	    }
	}
    }
    return did_something;
}

function shiftLeft(){
    let did_something = false;
    for (var x=0; x<array[0].length-1; x++){
	var column_empty = true;
	for (var y=0; y<array.length; y++){
	    if (array[y][x] != 0){
		column_empty = false;
		break;
	    }
	}
	if (column_empty == true){
	    for (var y=0; y<array.length; y++){
		array[y][x] = array[y][x+1];
		array[y][x+1] = 0;
		if (array[y][x] != 0){
		    did_something = true;
		}
	    }
	}
    }
    return did_something;
}

function makeMove(x, y){
    var this_color = array[y][x];

    // Is valid move?
    if (this_color == 0) return;
    if (isValidMove(x, y, this_color) == false) return;
    moves += 1;

    // Call recursive function to delete touching color
    recursiveDelete(x, y, this_color);

    // Animate
    animate();

    // Check for completion
    return;
}

function getCursorPosition(canvas, event){
    // Determine where clicked
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Determine square size
    var sx = Math.floor(x/square_size);
    var sy = Math.floor(y/square_size);

    // Proceed with our move
    makeMove(sx, sy);
}

function new_game(){
    var num_colors = Number(document.getElementById("numColors").value);
    moves = 0;

    // Shuffle
    array = [];
    for (var y=0; y<height/square_size; y++){
	var temp = [];
	for (var x=0; x<width/square_size; x++){
	    temp.push(Math.floor(Math.random()*num_colors)+1);
	}
	array.push(temp);
    }

    // Draw the screen
    redraw();
}

function moveExplosions(ms) {
    for (let explosion of explosions) {
	// Update downward speed
	explosion.velocity.y += 4;

	// Update x/y coordinates
	if (isNaN(ms))
	    ms = 20;
	multiplier = ms / 20.0;
	explosion.position.x += explosion.velocity.x * multiplier;
	explosion.position.y += explosion.velocity.y * multiplier;

	// Remove if off screen
	if (explosion.position.x < 0 || explosion.position.x > canvas.width) explosion.delete = true;
	if (explosion.position.y > canvas.height) explosion.delete = true;
    }

    // Prune array
    let i = 0;
    while (i < explosions.length) {
	if (explosions[i].delete == true) {
	    explosions.splice(i, 1);
	} else {
	    i++;
	}
    }
    return;
}

function animate(timestamp) {
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    const elapsed = timestamp - last_frame;
    last_frame = timestamp;

    if (!isNaN(elapsed))
	percolation_time += elapsed;
    let didSomething = true;
    if (percolation_time > 70) {
	didSomething = shiftDown() || shiftLeft();
	percolation_time = 0;
    }

    moveExplosions(elapsed);

    redraw();

    if (didSomething || explosions.length > 0) {
	window.requestAnimationFrame(animate);
    }
    else {
	// Once animation is complete, check for end of game
	if (isGameOver())
	    window.alert("Game over!");
    }
}

function redraw(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    // Redraw each block
    for (var y=0; y<array.length; y++){
	for (var x=0; x<array[y].length; x++){
	    drawBlock(ctx, x*square_size, y*square_size, square_size,
		      colors[array[y][x]],
		      y > 0                 ? array[y][x] == array[y-1][x] : false,
		      x < array[0].length-1 ? array[y][x] == array[y][x+1] : false,
		      y < array.length-1    ? array[y][x] == array[y+1][x] : false,
		      x > 0                 ? array[y][x] == array[y][x-1] : false,
		     );
	}
    }

    // Update move and block counts
    document.getElementById("moves").innerHTML = moves;
    var blockcount = 0;
    for (var y=array.length-1; y>0; y--)
	for (var x=0; x<array[y].length; x++)
	    if (array[y][x] > 0)
		blockcount += 1;
    document.getElementById("blocks").innerHTML = blockcount;

    // Draw exploding blocks
    for (let explosion of explosions) {
	drawBlock(
	    ctx,
	    explosion.position.x,
	    explosion.position.y,
	    square_size,
	    explosion.color,
	    false, false, false, false,
	);
    }
}

function drawBlock(ctx, x, y, l, c, n, e, s, w){
    const edge = Math.floor(square_size * .25);;

    // Fill in background color
    ctx.fillStyle = c[2];
    ctx.fillRect(x, y, l, l);

    // North Edge
    if (n == false){
	ctx.beginPath();
	ctx.moveTo(x, y);
	if (w == true)
	    ctx.lineTo(x, y+edge);
	else
	    ctx.lineTo(x+edge, y+edge);
	if (e == true)
	    ctx.lineTo(x+l, y+edge);
	else
	    ctx.lineTo(x+l-edge, y+edge);
	ctx.lineTo(x+l, y);
	ctx.fillStyle = c[4];
	ctx.fill();
    }

    // West Edge
    if (w == false){
	ctx.beginPath();
	ctx.moveTo(x, y);
	if (n == true)
	    ctx.lineTo(x+edge, y);
	else
	    ctx.lineTo(x+edge, y+edge);
	if (s == true)
	    ctx.lineTo(x+edge, y+l);
	else
	    ctx.lineTo(x+edge, y+l-edge);
	ctx.lineTo(x, y+l);
	ctx.fillStyle = c[3];
	ctx.fill();
    }

    // East Edge
    if (e == false){
	ctx.beginPath();
	ctx.moveTo(x+l, y);
	if (n == true)
	    ctx.lineTo(x+l-edge, y);
	else
	    ctx.lineTo(x+l-edge, y+edge);
	if (s == true)
	    ctx.lineTo(x+l-edge, y+l);
	else
	    ctx.lineTo(x+l-edge, y+l-edge);
	ctx.lineTo(x+l, y+l);
	ctx.fillStyle = c[1];
	ctx.fill();
    }

    // South Edge
    if (s == false){
	ctx.beginPath();
	ctx.moveTo(x, y+l);
	if (w == true)
	    ctx.lineTo(x, y+l-edge);
	else
	    ctx.lineTo(x+edge, y+l-edge);
	if (e == true)
	    ctx.lineTo(x+l, y+l-edge);
	else
	    ctx.lineTo(x+l-edge, y+l-edge);
	ctx.lineTo(x+l, y+l);
	ctx.fillStyle = c[0];
	ctx.fill();
    }

    // NW Corner
    if (n == true && w == true){
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x+edge, y);
	ctx.lineTo(x+edge, y+edge);
	ctx.fillStyle = c[3];
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x, y+edge);
	ctx.lineTo(x+edge, y+edge);
	ctx.fillStyle = c[4];
	ctx.fill();
    }

    // NE Corner
    if (n == true && e == true){
	ctx.beginPath();
	ctx.moveTo(x+l, y);
	ctx.lineTo(x+l-edge, y);
	ctx.lineTo(x+l-edge, y+edge);
	ctx.fillStyle = c[1];
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x+l, y);
	ctx.lineTo(x+l, y+edge);
	ctx.lineTo(x+l-edge, y+edge);
	ctx.fillStyle = c[4];
	ctx.fill();
    }

    // SW Corner
    if (s == true && w == true){
	ctx.beginPath();
	ctx.moveTo(x, y+l);
	ctx.lineTo(x+edge, y+l);
	ctx.lineTo(x+edge, y+l-edge);
	ctx.fillStyle = c[3];
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x, y+l);
	ctx.lineTo(x, y+l-edge);
	ctx.lineTo(x+edge, y+l-edge);
	ctx.fillStyle = c[0];
	ctx.fill();
    }

    // SE Corner
    if (s == true && e == true){
	ctx.beginPath();
	ctx.moveTo(x+l, y+l);
	ctx.lineTo(x+l-edge, y+l);
	ctx.lineTo(x+l-edge, y+l-edge);
	ctx.fillStyle = c[1];
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x+l, y+l);
	ctx.lineTo(x+l, y+l-edge);
	ctx.lineTo(x+l-edge, y+l-edge);
	ctx.fillStyle = c[0];
	ctx.fill();
    }

}

let canvas;
let width;
let height;
let square_size = 32;
var array = [];
var moves = 0;

const colors = [
    ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
    ["#BB0000","#DD0000","#FF0000","#FF4444","#FF8888"],
    ["#BB6600","#DD7700","#FF8800","#FFAA44","#FFCC88"],
    ["#BBBB00","#DDDD00","#FFFF00","#FFFF44","#FFFF88"],
    ["#00BB00","#00DD00","#00FF00","#44FF44","#88FF88"],
    ["#00BBBB","#00DDDD","#00FFFF","#44FFFF","#88FFFF"],
    ["#0000BB","#0000DD","#0000FF","#4444FF","#8888FF"],
    ["#BB00BB","#DD00DD","#FF00FF","#FF44FF","#FF88FF"]
];

let timeout;
let explosions = [];
let last_frame;
let percolation_time = 0;

function firstLoad() {
    canvas = document.querySelector('canvas')
    canvas.addEventListener('mousedown', function(e){
	getCursorPosition(canvas, e)
    })

    width = canvas.width;
    height = canvas.height;
    square_size = 32;

    new_game();
}

window.onload = function() {
    firstLoad();
};
