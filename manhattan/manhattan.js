// Global Variables
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let array = [[-1]];
let results;

let square_size = 0;
let distance = 3;

let mousedown = false;
let highlight;
let debug = false;

let wrap = false;
let skew = {};

// Mouse Listeners and interactions
canvas.addEventListener('mousedown',  () => mouse_down(), false);
canvas.addEventListener('mousemove',  () => mouse_move(), false);
canvas.addEventListener('mouseup',    () => mouse_up(), false);
canvas.addEventListener('mouseleave', () => mouse_leave(), false);

function get_cursor_position(event) {
    // Determine where clicked
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    var sx = Math.floor(x / square_size);
    var sy = Math.floor(y / square_size);

    // Ensure we don't toggle anything outside of the array boundaries
    if (sx >= array[0].length || sy >= array.length)
        return null;

    // Return X, Y coordinates
    return {x:sx, y:sy};
}

function mouse_down() {
    mousedown = true;
    highlight = get_cursor_position(event);
    update_visual();
}

function mouse_move() {
    if (mousedown) {
        highlight = get_cursor_position(event);
        update_visual();
    }
}

function mouse_up() {
    if (mousedown) {
        mousedown = false;
        highlight = null;
        toggle_position(get_cursor_position(event));
        calculate_result();
        update_visual();
    }
}

function mouse_leave() {
    mousedown = false;
    highlight = null;
    update_visual();
}

function toggle_position(c) {
    if (c != null) {
        if (array[c.y][c.x] > 0)
            array[c.y][c.x] = -1;
        else {
            let n = [];
            for (let y=0; y<array.length; y++)
                for (let x=0; x<array[0].length; x++)
                    if (array[y][x] > 0)
                        n.push(array[y][x]);

            // Sort the neighborhood numbers
            n.sort(function(a, b){return a - b});

            // Find missing neighborhood and use it
            for (let i=0; i<n.length; i++) {
                if (n[i] != i+1) {
                    array[c.y][c.x] = i+1;
                    return;
                }
            }

            // Everything is sequential; make a new number!
            array[c.y][c.x] = n.length + 1;
        }
    }
}

// UI functions for Input and Output
function update_settings() {
    // Geometry Settings
    let width = Number(document.getElementById("width").value);
    let height = Number(document.getElementById("height").value);
    distance = Number(document.getElementById("distance").value);
    wrap = document.getElementById("wrap").checked;

    // Skew settings
    skew = {
        up:     document.getElementById("skew_u").checked,
        down:   document.getElementById("skew_d").checked,
        right:  document.getElementById("skew_r").checked,
        left:   document.getElementById("skew_l").checked,
        factor: Number(document.getElementById("skew_factor").value)
    };

    let new_array = [];
    // Adjust array size
    for (let y=0; y<height; y++){
        let new_row = [];
        for (let x=0; x<width; x++){
            if (y < array.length && x < array[y].length)
                new_row.push(array[y][x]);
            else
                new_row.push(-1);
        }
        new_array.push(new_row);
    }
    array = new_array;

    let canvas_width = canvas.width;
    let canvas_height = canvas.height;

    square_size = Math.floor(Math.min(canvas_width/width, canvas_height/height));

    calculate_result();
    update_visual();
}

function update_output(n, m, mm) {
    let output = document.getElementById("output");
    output.innerHTML = "";

    // Show count of neighborhoods
    let neighborhoods = document.createElement("p");
    neighborhoods.innerHTML = "Neighborhoods: " + n;
    output.appendChild(neighborhoods);


    // Show the count of members in a neighborhood
    let members = document.createElement("p");
    members.innerHTML = "Neighborhood Members: " + m;
    output.appendChild(members);

    // Show breakdown of members belonging to multiple neighborhoods
    for (let n in mm) {
        let t = document.createElement("p");
        t.innerHTML = "Members of " + n + " neighborhoods: " + mm[n];
        output.appendChild(t);
    }

    // Output the resulting array just because we can
    if (debug == true) {
        let output_array = document.createElement("pre");
        output_array.innerHTML = "[<br>"
        for (let row of array)
            output_array.innerHTML += " " + JSON.stringify(row) + ",<br>";
        output_array.innerHTML += "]<br>"
        output.appendChild(output_array);
    }
}

// Functions for visualization
function draw_square(x, y, h, l, a) {
    ctx.fillStyle = "hsla("+h+",100%,"+l+"%,"+a+")";
    ctx.fillRect(x*square_size, y*square_size, square_size, square_size);
}

function number_to_hue(n) {
    return ((n-1) * 50) % 360;
}

function update_visual() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(results)
    let width = results.array[0].length;
    let height = results.array.length;

    let neighborhoods = 0;
    let members = 0;
    let multi_members = {};

    for (let y=0; y<height; y++){
        for (let x=0; x<width; x++){
            // If this is a positive number, then it is a neighborhood center; Draw opaque
            if (array[y][x] > 0) {
                neighborhoods++;

                draw_square(x, y, number_to_hue(array[y][x]), 50, 1);
            } else {
                // For everythign else, find out how many neighborhoods it belongs to
                for (let n of results.array[y][x]) {
                    draw_square(x, y, number_to_hue(n), 50, .25);
                }

                if (results.array[y][x].length > 1) {
                    if (multi_members[results.array[y][x].length])
                        multi_members[results.array[y][x].length]++;
                    else
                        multi_members[results.array[y][x].length] = 1;
                }
            }

            // Outline cell
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "black";
            ctx.rect(x*square_size, y*square_size, square_size, square_size);
            ctx.stroke();

        }
    }

    if (highlight != null) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        ctx.rect(highlight.x*square_size, highlight.y*square_size, square_size, square_size);
        ctx.stroke();
    }

    update_output(neighborhoods, results.count, multi_members);
}

// This is a wrapper for the actual calculation function that will use our global array and results used for the GUI
function calculate_result() {
    results = calculate_manhattan(array, distance, wrap);
}

// This is the actual function. You can run it from the console by passing in a 2D array and a distance, N
function calculate_manhattan(a, N, wrap) {
    // Create variables to store our results data
    let result_array = [];
    for (let y=0; y<a.length; y++) {
        let t=[];
        for (let x=0; x<a[0].length; x++) {
            t.push([]);
        }
        result_array.push(t);
    }

    let count = 0;

    // Iterate through array, and look for positive values
    for (let y=0; y<a.length; y++) {
        for (let x=0; x<a[0].length; x++) {
            if (a[y][x] > 0) {
                let neighborhood_identifier = a[y][x];
                // Fill in all the neighboring cells within the specified distance

                // Adjust the distances based on desired skew
                let min_x = N * -1;
                let max_x = N;
                let min_y = N * -1;
                let max_y = N;

                if (skew.up) min_y *= skew.factor;
                if (skew.down) max_y *= skew.factor;
                if (skew.left) min_x *= skew.factor;
                if (skew.right) max_x *= skew.factor;

                // Find valid distance coordiantes
                for (let dx=min_x; dx<=max_x; dx++) {
                    for (let dy=min_y; dy<=max_y; dy++) {
                        let td, td1, td2;

                        // This is standard operation for finding the neighbors within appropriate total distance (td)
                        td = Math.abs(dx) + Math.abs(dy);

                        // For each cardinal direction, treat appropriately for desired skew if applicable
                        if (skew.up && dy < 0 || skew.down && dy > 0)
                            td1 = Math.abs(dx) + Math.abs(dy / skew.factor);
                        if (skew.left && dx < 0 || skew.right && dx > 0)
                            td2 = Math.abs(dx / skew.factor) + Math.abs(dy);

                        // If we can reach any of the squares with any of the skew amounts, then we can proceed
                        if (td <= N || td1 <= N || td2 <= N) {

                            // Make sure these coords are within bounds of array
                            let fx = x + dx;
                            let fy = y + dy;


                            // Wrap around if out of bounds
                            if (wrap) {
                                if (fx < 0) fx += a[0].length;
                                if (fy < 0) fy += a.length;
                                if (fx >= a[0].length) fx -= a[0].length;
                                if (fy >= a.length) fy -= a.length;
                            } else {
                                if (fx < 0 || fx >= a[0].length ||
                                    fy < 0 || fy >= a.length)
                                    continue;
                            }

                            // if this cell hasn't been counted, count it!
                            if (result_array[fy][fx].length == 0) count++;

                            // Mark as members of this neighborhood
                            result_array[fy][fx].push(neighborhood_identifier);
                        }
                    }
                }
            }
        }
    }

    return {
        count: count,
        array: result_array,
    };
}

function run_test(a, N, c) {
    let results = calculate_manhattan(a, N);
    if (results.count != c) {
        console.log("Expected "+c+" but got "+results.count);
        return -1;
    }
    return 0;
}

function unit_tests() {
    let status = 0;

    // Test 1 -- Neighborhood in middle of array
    if (run_test(
        [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ], 3, 25) == 0) {
        console.log("Test 1 Passed");
    } else {
        console.log("Test 1 Failed");
        status = -1;
    }

    // Test 2 -- Neighborhood intersecting with edge of array
    if (run_test(
        [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ], 3, 21) == 0) {
        console.log("Test 2 Passed");
    } else {
        console.log("Test 2 Failed");
        status = -1;
    }

    // Test 3 -- Two neighborhoods
    if (run_test(
        [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ], 2, 26) == 0) {
        console.log("Test 3 Passed");
    } else {
        console.log("Test 3 Failed");
        status = -1;
    }

    // Test 4 -- Overlapping neighborhoods
    if (run_test(
        [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1],
            [-1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ], 2, 22) == 0) {
        console.log("Test 4 Passed");
    } else {
        console.log("Test 4 Failed");
        status = -1;
    }

    // Test 5 -- Odd shape (1 row thick)
    if (run_test(
        [
            [-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1]
        ], 3, 7) == 0) {
        console.log("Test 5 Passed");
    } else {
        console.log("Test 5 Failed");
        status = -1;
    }

    return status;
}

// Set up everything when we first load
function first_run() {
    update_settings();
}

document.getElementById("update").onclick = function () {
    update_settings();
}

window.onload = function () {
    first_run();
}
