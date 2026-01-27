function format_time(d) {
    let minutes = Math.floor(d/1000/60);
    let seconds = Math.floor(d/1000) % 60;
    let miliseconds = (Math.floor(d) % 1000).toString();
    if (seconds < 10) seconds = "0" + seconds;
    if (minutes < 10) minutes = "0" + minutes;
    while (miliseconds.length < 3) miliseconds = "0" + miliseconds;
    return minutes +":"+ seconds +"."+ miliseconds;
}

function zoom(z) {
    mandelbrot.update_zoom(z);
}

function rerender(preview=false) {
    mandelbrot.render(preview);
}

function slide_depth() {
    rerender(true);
    document.getElementById("depth").innerHTML = mandelbrot.depth;
}

function set_slider(value) {
    let slider = document.getElementById("depthSelection");
    let minp = slider.min;
    let maxp = slider.max;

    let minv = Math.log(1);
    let maxv = Math.log(10000);

    let scale = (maxv - minv) / (maxp - minp);

    slider.value = (Math.log(value) - minv) / scale + minp;
    document.getElementById("depth").innerHTML = value;
}

function resize_canvas() {
    mandelbrot.resize(
        window.innerWidth,
        window.innerHeight
    );
    mandelbrot.render();
}

function create_gradient(colors) {
    let gradient = [];
    for (let j=0; j<colors.length-1; j++) {
        for (let i=0; i<255; i++) {
            let color = {a:1}
            for (let component of ["r", "g", "b"]) {
                let d = colors[j][component] - colors[j+1][component];
                color[component] = colors[j][component] - (d / 255 * i);
            }
            gradient.push(color);
        }
    }
    return gradient;
}

function random_color() {
    return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",1)";
}

function update_custom() {
    let colorstops = [];
    let is_gradient = document.getElementById("gradient").checked;

    let is_proportional = false;
    document.getElementById("proportional").disabled = true;
    if (is_gradient) {
        document.getElementById("proportional").disabled = false;
        is_proportional = document.getElementById("proportional").checked;
    }

    let mandelbrot_color;

    for (let stop of document.getElementsByClassName("jscolor")) {
        if (stop.classList.contains("mandelbrot_color"))
            mandelbrot_color = stop.jscolor.channels;
        else
            colorstops.push(stop.jscolor.channels);
    }

    mandelbrot.mandelbrot_color = mandelbrot_color;
    julia.mandelbrot_color = mandelbrot_color;

    if (is_gradient) {
        mandelbrot.gradient = create_gradient(colorstops);
        julia.gradient = create_gradient(colorstops);
    }
    else {
        mandelbrot.gradient = colorstops;
        julia.gradient = colorstops;
    }
    mandelbrot.proportional_color = is_proportional;
    mandelbrot.clear_canvas_on_redraw = false;
    mandelbrot.render(true);

    julia.proportional_color = is_proportional;
    julia.clear_canvas_on_redraw = false;
    julia.render(true);
}

function add_color_stop(divname, color) {
    let div = document.getElementById(divname);

    let stop = document.createElement("button");
    stop.classList.add("jscolor", "{value:'" + color + "',position:'bottom',paletteCols:13,hideOnPaletteClick:true,onInput:'update_custom();'}");
    if (divname == "mandelbrotcolordiv")
        stop.classList.add("mandelbrot_color");

    div.appendChild(stop);

    div.appendChild(document.createElement("br"));

    jscolor.install()

    update_custom();
}

function clear_div(divname) {
    document.getElementById(divname).innerHTML = "";
}

function clear_color_stops() {
    clear_div("mandelbrotcolordiv");
    clear_div("gradientstops");
}

function remove_stop() {
}

function update_gradient() {
    let selection = document.getElementById("scheme").value;
    let mandelcolor;
    let stops = [];
    let proportional_color;
    let graident;
    let clear_canvas = false;

    if (selection == "Spectrum") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(255,0,0,1)","rgba(255,255,0,1)","rgba(0,255,0,1)","rgba(0,255,255,1)","rgba(0,0,255,1)","rgba(255,0,255,1)","rgba(255,0,0,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Red") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,1)","rgba(255,0,0,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Green") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,1)","rgba(0,255,0,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Blue") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,1)","rgba(0,0,255,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "White") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,1)","rgba(255,255,255,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Sunset") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(255,255,0,1)","rgba(255,0,255,1)","rgba(0,0,255,1)"];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Random Gradient") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = [random_color(), random_color()];
        proportional_color = true;
        gradient = true;
    }
    if (selection == "Spectrum Cycle") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(255,0,0,1)","rgba(255,255,0,1)","rgba(0,255,0,1)","rgba(0,255,255,1)","rgba(0,0,255,1)","rgba(255,0,255,1)"];
        proportional_color = false;
        gradient = false;
    }
    if (selection == "Random Colors") {
        mandelcolor = "rgba(0,0,0,1)";
        for (let i=0; i<10; i++)
            stops.push(random_color());
        proportional_color = false;
        gradient = false;
    }
    if (selection == "Zebra") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,1)","rgba(255,255,255,1)"];
        proportional_color = false;
        gradient = false;
    }
    if (selection == "Set Only") {
        mandelcolor = "rgba(0,0,0,1)";
        stops = ["rgba(0,0,0,0)"];
        proportional_color = false;
        gradient = false;
        clear_canvas = true;
    }

    clear_color_stops();
    add_color_stop("mandelbrotcolordiv", mandelcolor);
    for (let stop of stops)
        add_color_stop("gradientstops", stop);
    document.getElementById("proportional").checked = proportional_color;
    document.getElementById("gradient").checked = gradient;

    update_custom();
}

function save_image() {
    let canvas = document.getElementById("mandelbrot_canvas");
    document.getElementById("download_link").download = "image.png";
    document.getElementById("download_link").href = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

function toggle_julia() {
    if (document.getElementById("julia").checked) {
	document.getElementById("julia_canvas").classList.remove("hidden");
	julia.enabled = true;
    } else {
	document.getElementById("julia_canvas").classList.add("hidden");
	julia.enabled = false;
    }
}
