function decode() {
    let base_canvas = document.getElementById("base_canvas")
    let base_ctx = base_canvas.getContext("2d");

    let combined_canvas = document.getElementById("combined_canvas")
    let combined_ctx = combined_canvas.getContext("2d");

    let hidden_canvas = document.getElementById("hidden_canvas")
    let hidden_ctx = hidden_canvas.getContext("2d");

    // Resize output canvases to match input canvas
    hidden_canvas.width  = combined_canvas.width
    hidden_canvas.height = combined_canvas.height
    base_canvas.width  = combined_canvas.width
    base_canvas.height = combined_canvas.height

    // Get options
    const bits = Number(document.getElementById("bits").value);
    const hiddenMask = (1 << bits) - 1;
    const baseMask = (0xFF << bits) & 0xFF;
    const scale = (0x01 << bits);
    const normalize = 256 / scale;
    const channel = document.getElementById("channel").value.toLowerCase();


    // Read through our input canvas 1 pixel at a time
    let base      = base_ctx.getImageData(0,     0, base_canvas.width,     base_canvas.height);
    let hidden    = hidden_ctx.getImageData(0,   0, hidden_canvas.width,   hidden_canvas.height);
    let input     = combined_ctx.getImageData(0, 0, combined_canvas.width, combined_canvas.height);

    for (let i=0; i<input.data.length; i+=4){
        // determine the brightness of the pixel by averageing the 3 channels
        const r = input.data[i + 0];
        const g = input.data[i + 1];
        const b = input.data[i + 2];
        const a = input.data[i + 3];

        const normalized_r = Math.min(255, Math.floor((r & hiddenMask) * normalize));
        const normalized_g = Math.min(255, Math.floor((g & hiddenMask) * normalize));
        const normalized_b = Math.min(255, Math.floor((b & hiddenMask) * normalize));

        base.data[i + 0] = r;
        base.data[i + 1] = g;
        base.data[i + 2] = b;

        if (i == 0 && DEBUG == true)
            console.log(r, r & hiddenMask, normalize, normalized_r);

	if (channel == "all") {
            hidden.data[i + 0] = normalized_r
            hidden.data[i + 1] = normalized_g
            hidden.data[i + 2] = normalized_b

            base.data[i + 0] = r & baseMask;
            base.data[i + 1] = g & baseMask;
            base.data[i + 2] = b & baseMask;
	} else {
	    let value = 0;
	    if (channel == "red") {
		value = normalized_r;
                base.data[i + 0] = r & baseMask;
            }

	    if (channel == "green") {
		value = normalized_g;
                base.data[i + 1] = g & baseMask;
            }

	    if (channel == "blue") {
		value = normalized_b;
                base.data[i + 2] = b & baseMask;
            }

	    hidden.data[i + 0] = value;
            hidden.data[i + 1] = value;
            hidden.data[i + 2] = value;
	}

        hidden.data[i + 3] = a;
        base.data[i + 3] = a;
    }

    // Write it back out
    hidden_ctx.putImageData(hidden, 0, 0);
    base_ctx.putImageData(base, 0, 0);
}

function encode() {
    let base_canvas = document.getElementById("base_canvas")
    let base_ctx = base_canvas.getContext("2d");

    let hidden_canvas = document.getElementById("hidden_canvas")
    let hidden_ctx = hidden_canvas.getContext("2d");

    let combined_canvas = document.getElementById("combined_canvas")
    let combined_ctx = combined_canvas.getContext("2d");

    // Resize output canvas to match input canvas
    combined_canvas.width  = base_canvas.width
    combined_canvas.height = base_canvas.height

    // Resize hidden image and canvas to match base image
    const temp = document.createElement("canvas");
    temp.width = hidden_canvas.width;
    temp.height = hidden_canvas.height;
    temp.getContext("2d").drawImage(hidden_canvas, 0, 0);

    hidden_canvas.width  = base_canvas.width;
    hidden_canvas.height = base_canvas.height;

    hidden_ctx.drawImage(temp, 0, 0, hidden_canvas.width, hidden_canvas.height);

    // Get options
    const bits = Number(document.getElementById("bits").value);
    const mask = (0xFF << bits) & 0xFF;
    const scale = (0x01 << bits);
    const channel = document.getElementById("channel").value.toLowerCase();

    // Read through our input canvas 1 pixel at a time
    let base      = base_ctx.getImageData(0,     0, base_canvas.width,      base_canvas.height);
    let message   = hidden_ctx.getImageData(0,   0, hidden_canvas.width,    hidden_canvas.height);
    let output    = combined_ctx.getImageData(0, 0, combined_canvas.width,  combined_canvas.height);

    for (let i=0; i<base.data.length; i+=4){
        const br = base.data[i + 0];
        const bg = base.data[i + 1];
        const bb = base.data[i + 2];
        const ba = base.data[i + 3];

        // Normalize message data to number of bits we have
        const mr = Math.floor(scale / 256 * message.data[i + 0]);
        const mg = Math.floor(scale / 256 * message.data[i + 1]);
        const mb = Math.floor(scale / 256 * message.data[i + 2]);

        if (i == 0 && DEBUG == true)
            console.log(br, mr, br & mask, (br & mask) + mr);

	if (channel == "all") {
            output.data[i + 0] = (br & mask) + mr;
            output.data[i + 1] = (bg & mask) + mg;
            output.data[i + 2] = (bb & mask) + mb;
	} else {
	    output.data[i + 0] = br;
            output.data[i + 1] = bg;
            output.data[i + 2] = bb;

	    if (channel == "red")
		output.data[i + 0] = (br & mask) + mr;

	    if (channel == "green")
		output.data[i + 1] = (bg & mask) + mg;

	    if (channel == "blue")
		output.data[i + 2] = (bb & mask) + mb;
	}

        output.data[i + 3] = ba;
    }

    // Write it back out
    combined_ctx.putImageData(output, 0, 0);
}

function save(canvas) {
    window.open(document.getElementById(canvas).toDataURL('image/png'));
}

function update() {
    if (mode == DECODE)
        decode();
    else
        encode();
}

function load(e, canvas_name) {
    // Get image from user & Load it into main canvas
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function() {
            load_image(canvas_name, img);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function load_image(canvas_name, image) {
    let canvas = document.getElementById(canvas_name);
    let ctx = canvas.getContext("2d");

    // Resize
    canvas.width = image.width;
    canvas.height = image.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw!
    ctx.drawImage(image, 0, 0);

    // Try rendering
    update();
}

function toggleMode(m=null) {
    const button = document.getElementById("toggle_mode");

    // if 'm' is set, explicitely go to that mode
    // otherwise toggle based on button state
    if (m == null) {
        if (button.innerHTML == "Encode")
            m = DECODE;
        else
            m = ENCODE;
    }

    if (m == DECODE) {
        button.innerHTML = "Decode";
        mode = DECODE;
        document.getElementById("load_base").classList.add("hidden");
        document.getElementById("load_hidden").classList.add("hidden");
        document.getElementById("load_combined").classList.remove("hidden");
    }
    if (m == ENCODE) {
        button.innerHTML = "Encode";
        mode = ENCODE;
        document.getElementById("load_base").classList.remove("hidden");
        document.getElementById("load_hidden").classList.remove("hidden");
        document.getElementById("load_combined").classList.add("hidden");
    }
    update();
}

const ENCODE = 1;
const DECODE = 2;
const DEBUG = true//false;

let mode = ENCODE;

function first_run() {
    // Connect Inputs
    document.getElementById("toggle_mode").onclick = () => { toggleMode() };

    document.getElementById('load_base').addEventListener('change',     (e) => { load(e, "base_canvas") }, false);
    document.getElementById('load_hidden').addEventListener('change',   (e) => { load(e, "hidden_canvas") }, false);
    document.getElementById('load_combined').addEventListener('change', (e) => { load(e, "combined_canvas") }, false);

    document.getElementById('save_base').onclick = () => { save('base_canvas') };
    document.getElementById('save_hidden').onclick = () => { save('hidden_canvas') };
    document.getElementById('save_combined').onclick = () => { save('combined_canvas') };

    document.getElementById("bits").onchange = () => { update() };
    document.getElementById("channel").onchange = () => { update() };

    // Load sample images
    let imageBase = new Image();
    imageBase.onload = function() {
        load_image("base_canvas", imageBase);
    }
    imageBase.src = "images/sample_image.jpg";

    let imageMessage = new Image();
    imageMessage.onload = function() {
        load_image("hidden_canvas", imageMessage);
    }
    imageMessage.src = "images/sample_message.png";

    // Run
    toggleMode(ENCODE)
    update();
}

document.onLoad = () => { first_run() };
