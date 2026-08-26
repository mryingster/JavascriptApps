function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function find_spiral_segments(cx, cy, n, distance, spacing, reverse, limit, roffset=0) {
    let radians = (Math.PI * 2 / n);
    let segments = [];

    // Iterate the spiral n times in a circle
    for (let i=0; i<n; i++) {
        let arm_segments = [];
        let rotation = radians * i;

        if (reverse)
            rotation += roffset;
        else
            rotation -= roffset;

        let x = cx;
        let y = cy;

        let px = cx;
        let py = cy;

        let j = 0;

        while (Math.abs(Math.hypot(x-cx,y-cy)) < limit) {
            angle = 0.1 * j;
            x = cx + (distance + spacing * angle) * Math.cos(angle + rotation);
            y = cy + (distance + spacing * angle) * Math.sin(angle + rotation);

            // Record segments
            arm_segments.push({
                a : {x:px, y:py},
                b : {x:x,  y:y},
            });

            px = x;
            py = y;

            if (reverse)
                j++;
            else
                j--;
        }

        segments.push(arm_segments);
    }
    return segments;
}

function draw_spiral(segments, color) {
    ctx.moveTo(segments[0].x, segments[0].y);
    ctx.beginPath();
    for (const segment of segments) {
        ctx.lineTo(segment.b.x, segment.b.y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
}

function draw_spirals(segments, color) {
    for (const arm of segments)
        draw_spiral(arm, color);
}

function draw_circle(x, y, r, c) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = c;
    ctx.fill();
}

function draw_intersections(intersections) {
    for (const intersection of intersections)
        if (intersection.d > 0)
            draw_circle(intersection.x, intersection.y, 3, "#000");
}

function get_angle(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const radians = Math.atan(dy, dx);
    let degrees = radians * (180 / Math.PI);
    if (degrees < 0)
        degrees += 360;
    return degrees;
}

function find_intersection(l1, l2) {
    let cx = width / 2;
    let cy = height / 2;
    let x1 = l1.a.x
    let y1 = l1.a.y
    let x2 = l1.b.x
    let y2 = l1.b.y
    let x3 = l2.a.x
    let y3 = l2.a.y
    let x4 = l2.b.x
    let y4 = l2.b.y

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return null
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return null
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return null
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    // Find angle and distance from center so we can use it later for animation
    let d = Math.hypot(cx - x, cy - y);
    let a = get_angle({x:cx, y:cy}, {x, y});

    return {x, y, d, a};
}

function find_intersections(s1, s2) {
    intersections = [];
    for (let segment1 of s1.flat()) {
        for (let segment2 of s2.flat()) {
            let intersection = find_intersection(segment1, segment2);
            if (intersection != null && intersection.d > 0) {
                intersections.push(intersection);
            }
        }
    }
    return intersections;
}

function compare_distance(a, b) {
    if (a.d < b.d)
        return 1;
    else if (a.d > b.d)
        return -1;
    return 0;
}

function calculate_pinecone(roffset=animationLocation) {
    const limit = width / 2;
    const cx = width / 2;
    const cy = height / 2;

    let s1 = Number(document.getElementById("spiral1range").value);
    let r1 = Number(document.getElementById("spiral1replications").value);
    segments1 = find_spiral_segments(cx, cy, r1, 0, s1, true, limit, roffset);

    let s2 = Number(document.getElementById("spiral2range").value);
    let r2 = Number(document.getElementById("spiral2replications").value);
    segments2 = find_spiral_segments(cx, cy, r2, 0, s2, false, limit, roffset);

    intersections = find_intersections(segments1, segments2);
    intersections.sort(compare_distance);

    // Find consecutive intersections and determine angle
    /*
    console.log(intersections[0].a);
    console.log(intersections[1].a);
    console.log(intersections[0].a - intersections[1].a);
    console.log(intersections);
    */

    redraw();
}

function redraw() {
    clear_canvas();

    // rotate canvas
    ctx.save();

    ctx.translate(width/2, height/2);
    ctx.translate(-width/2, -height/2);

    if (document.getElementById("spiral1").checked)
        draw_spirals(segments1, "#00f");
    if (document.getElementById("spiral2").checked)
        draw_spirals(segments2, "#f00");
    draw_intersections(intersections)

    // Unrotate
    ctx.restore();
}

function toggleAnimation(){
    if (document.getElementById("animate_cb").checked)
        animate();
}

function animate(timestamp=0) {
    // See if we should still be animating
    if (!document.getElementById("animate_cb").checked)
        return;

    // Get rotation amount, and speed
    const rotationSpeed = document.getElementById("rotation_speed").value;

    // Calculate how far to rotate
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    const elapsed = timestamp - last_frame;

    animationLocation += rotationSpeed * elapsed / -10000;
    animationLocation %= (Math.PI * 2);

    calculate_pinecone(animationLocation);

    // Call next animation frame
    last_frame = timestamp;
    window.requestAnimationFrame(animate);
}

let canvas;
let ctx;
let width;
let height;

let segments1;
let segments2;
let intersections;

let last_frame;
let animationLocation = 0;

function onLoad() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    document.getElementById("spiral1").oninput                  = function () { calculate_pinecone() };
    document.getElementById("spiral1range").oninput             = function () { calculate_pinecone() };
    document.getElementById("spiral1replications").onchange     = function () { calculate_pinecone() };
    document.getElementById("spiral2").oninput                  = function () { calculate_pinecone() };
    document.getElementById("spiral2range").oninput             = function () { calculate_pinecone() };
    document.getElementById("spiral2replications").onchange     = function () { calculate_pinecone() };
    document.getElementById("animate_cb").onchange              = function () { toggleAnimation() };

    if (document.getElementById("animate_cb").checked) {
        animate();
    } else {
        calculate_pinecone();
    }
}

window.onload = function () {
    onLoad();
};
