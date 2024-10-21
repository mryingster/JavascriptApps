class Mandelbrot {
    constructor(canvas, depth_selection, scale_selection, coord_display, preview_cb) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.coords = {x:0, y:0};

        this.depth_selection = depth_selection;
        this.depth = 32;

        this.scale_selection = scale_selection;
        this.scale = 1;

        this.preview_cb = preview_cb;

        this.zoom = .004;

        this.mandelbrot_color = {r:0, g:0, b:0, a:255};
        this.gradient = [{r:0,g:0,b:0,a:1}, {r:255,g:255,b:255,1:1}];
        this.proportional_color = false;
        this.clear_canvas_on_redraw = false;

        this.coord_display = coord_display;
        this.mouse_down = false;
        this.mouse_start_pos;
        this.touch_end_pos
        this.touch_pinch = false;
        this.touch_pinch_start;
        this.touch_zoom_start;

        this.final_render_timer;
        this.requests = [];
        this.render_start_time;

        // Mouse listeners
        this.canvas.addEventListener('mousedown',  (event) => this.input_mouse_down(event));
        this.canvas.addEventListener('mousemove',  (event) => this.input_mouse_move(event));
        this.canvas.addEventListener('mouseup',    (event) => this.input_mouse_up(event));
        this.canvas.addEventListener('mouseout',   (event) => this.input_mouse_up(event));
        this.canvas.addEventListener('wheel',      (event) => this.input_mouse_wheel(event));

        // Touch Listeners
        this.canvas.addEventListener('touchstart', (event) => this.input_touch_start(event), false);
        this.canvas.addEventListener('touchmove',  (event) => this.input_touch_move(event), false);
        this.canvas.addEventListener('touchend',   (event) => this.input_touch_end(event), false);

    }

    // Mouse Input
    input_mouse_down(e) {
        // Ignore right clicks
        if (e.button > 1)
            return;
        this.mouse_start_pos = this.get_cursor_position(e);
        this.mouse_down = true;
    }

    input_mouse_move(e) {
        if (this.mouse_down == true) {
	    // Get current coords
	    let current_pos = this.get_cursor_position(e);

 	    // Find difference
	    let x_diff = current_pos.x - this.mouse_start_pos.x;
	    let y_diff = current_pos.y - this.mouse_start_pos.y;

	    this.render(true, x_diff, y_diff);
        } else {
	    this.update_coords(this.get_cursor_coordinates(e));
        }
    }

    input_mouse_up(e) {
        if (this.mouse_down) {
            this.mouse_down = false;

	    let current_pos = this.get_cursor_position(e);

 	    // Find difference
	    let x_diff = current_pos.x - this.mouse_start_pos.x;
	    let y_diff = current_pos.y - this.mouse_start_pos.y;

            // Recenter!
            if (x_diff == 0 && y_diff == 0) {
                this.coords = this.get_cursor_coordinates(e);
            } else {
                this.coords.x -= x_diff * this.zoom;
                this.coords.y -= y_diff * this.zoom;
            }

            this.render(true);
        }
    }

    input_mouse_wheel(e) {
        //render_preview = true;
        if (Math.abs(e.deltaY) >= 16)
            this.update_zoom(e.deltaY < 0, this.get_cursor_coordinates(e));
    }

    get_cursor_coordinates(e) {
        let pos = this.get_cursor_position(e);

        // Work out the coordinate system values based on scale and zoom
        let view_left = this.coords.x - (this.canvas.getBoundingClientRect().width  / 2 * this.zoom);
        let view_top  = this.coords.y - (this.canvas.getBoundingClientRect().height / 2 * this.zoom);
        let x_coord = pos.x  * this.zoom + view_left;
        let y_coord = pos.y  * this.zoom + view_top;

        return {x:x_coord, y:y_coord};
    }

    get_cursor_position(e) {
        // Determine pixel location
        const rect = this.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update label
        return {x:x, y:y};
    }

    // Touch Input
    input_touch_start(e) {
        e.preventDefault();
        let current_coords = this.get_touch_position(e);

        // Normal scrolling with one finger
        if (current_coords.length == 1) {
            this.mouse_start_pos = current_coords[0];
            this.mouse_down = true;
        }

        // Pinching
        if (current_coords.length == 2) {
            this.touch_pinch_start = current_coords;
            this.touch_pinch = true;
            this.touch_zoom_start = this.zoom;
        }
    }

    input_touch_move(e) {
        e.preventDefault();

        if (this.mouse_down == true) {
            // Get current coords
            this.touch_end_pos = this.get_touch_position(e)[0]

	    // Find difference
            let x_diff = this.touch_end_pos.x - this.mouse_start_pos.x;
	    let y_diff = this.touch_end_pos.y - this.mouse_start_pos.y;

	    this.render(true, x_diff, y_diff);
        }

        if (this.touch_pinch == true) {
            let current_coords = this.get_touch_position(e);

            // If we are down to 1 finger, dont do anything
            if (current_coords.length < 2) return;

            // Find distance between fingers in start and current positions
            let d_start   = Math.abs(Math.hypot(this.touch_pinch_start[0].x - this.touch_pinch_start[1].x, this.touch_pinch_start[0].y - this.touch_pinch_start[1].y));
            let d_current = Math.abs(Math.hypot(current_coords[0].x - current_coords[1].x, current_coords[0].y - current_coords[1].y));

            // Find how much bigger we should be & zoom
            this.zoom =  this.touch_zoom_start / (d_current / d_start);

            // Maybe guess where we should center eventually?

            this.render();
        }
    }

    input_touch_end(e) {
        e.preventDefault();
        if (this.mouse_down) {
            this.mouse_down = false;

 	    // Find difference
	    let x_diff = this.touch_end_pos.x - this.mouse_start_pos.x;
	    let y_diff = this.touch_end_pos.y - this.mouse_start_pos.y;

            //Recenter!
            this.coords.x -= x_diff * this.zoom;
            this.coords.y -= y_diff * this.zoom;

            this.render();
        }
    }

    get_touch_coordinates(e) {
        let positions = this.get_cursor_position(e);
        let coords = [];

        for (let pos of positions) {
            // Work out the coordinate system values based on scale and zoom
            let view_left = this.coords.x - (this.canvas.width  / 2 * this.zoom * this.scale);
            let view_top  = this.coords.y - (this.canvas.height / 2 * this.zoom * this.scale);
            let x_coord = pos.x * this.scale * this.zoom + view_left;
            let y_coord = pos.y * this.scale * this.zoom + view_top;

            coords.push({x:x_coord, y:y_coord});
        }
        return coords;
    }

    get_touch_position(event) {
        if (!e)
            var e = event;

        let positions=[];

        if(e.touches) {
            for (let i=0; i<e.touches.length; i++) {
                let touch = e.touches[i];
                let x = touch.pageX-touch.target.getBoundingClientRect().left;
                let y = touch.pageY-touch.target.getBoundingClientRect().top;

                positions.push({x:x, y:y});
            }
        }

        return positions;
    }

    update_zoom(zoom_in, coords) {
        if (zoom_in == true) {
            this.zoom /= 2;
            if (coords != null)
                this.recenter((coords.x - this.coords.x) / 2 + this.coords.x, (coords.y - this.coords.y) / 2 + this.coords.y);
            this.render(true);
        } else {
            this.zoom *= 2;
            if (coords != null)
                this.recenter(this.coords.x - (coords.x - this.coords.x), this.coords.y - (coords.y - this.coords.y));
            this.render(true);
        }
    }

    update_coords(coords) {
        let string = ""
        if (coords.x > 0)
	    string += "+"
        string += coords.x.toFixed(5);
        while (string.length < 8)
	    string += "0";
        string += ",";
        if (coords.y < 0)
	    string += "+"
        string += (-1 * coords.y.toFixed(5));
        while (string.length < 17)
	    string += "0";

        this.coord_display.innerHTML = string;
    }

    read_slider() {
        let slider = this.depth_selection;
        let minp = slider.min;
        let maxp = slider.max;

        let minv = Math.log(1);
        let maxv = Math.log(10000);

        let scale = (maxv - minv) / (maxp - minp);

        let value = Math.floor(Math.exp(minv + scale * (slider.value - minp)));
        return value;
    }

    read_settings() {
        this.depth = this.read_slider();
        this.preview_enabled = this.preview_cb.checked;
        this.scale = Number(this.scale_selection.value);
    }

    resize_canvas() {
        // Get image data to save contents before scaling
        let buffer_canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        let buffer_ctx    = buffer_canvas.getContext("2d");
        buffer_ctx.putImageData(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), 0, 0);

        this.canvas.width  = Math.ceil(window.innerWidth  / this.scale);
        this.canvas.height = Math.ceil(window.innerHeight / this.scale);

        // Paste back what we had before (but scaled for the new canvas size)
        this.ctx.drawImage(buffer_canvas, 0, 0, canvas.width, canvas.height);
    }

    render(preview = false, x_offset = 0, y_offset = 0) {
        // Set settings
        this.read_settings();

        // Deal with preview renders
        // Clear existing timeouts (requests for final frames)
        clearTimeout(this.final_render_timer);

        // If preview requested...
        if (preview == true && this.preview_enabled && this.scale != 8) {
	    this.scale = 8;
	    // If there is a render preview request, set a timeout to render actual image after 1/2 second
	    if (this.mouse_down != true) {
	        this.final_render_timer = setTimeout(() => this.render(), 250);
	    }
        }

        // Start timer
        this.render_start_time = new Date().getTime();

        // Resize canvas according to scale
        this.resize_canvas();

        // Split canvas into sections a certain size
        let qwidth  = this.canvas.width;
        let qheight = this.canvas.height;

        if (!preview && this.scale < 8) {
            if (this.depth > 128) {
                qwidth = 512;
                qheight = 512;
            }

            if (this.depth > 512) {
                qwidth = 256;
                qheight = 256;
            }

            if (this.depth > 1024) {
                qwidth = 128;
                qheight = 128;
            }
        }

        let to_render = [];
        for (let qy = 0; qy * qheight<this.canvas.height; qy++)
            for (let qx = 0; qx * qwidth<this.canvas.width; qx++) {
                // Shift x and y so coordinates are centered in window
                let shifted_x = this.coords.x - (this.canvas.width  / 2 * this.zoom * this.scale);
                let shifted_y = this.coords.y - (this.canvas.height / 2 * this.zoom * this.scale);

                // Shift by our offset in case of panning
                shifted_x -= x_offset * this.zoom;
                shifted_y -= y_offset * this.zoom;

                // Cut down to our quadrant
                shifted_x += qx * qwidth  * this.zoom * this.scale;
                shifted_y += qy * qheight * this.zoom * this.scale;

                to_render.push(
                    {
                        x: shifted_x,
                        y: shifted_y,
                        w: qwidth,
                        h: qheight,
                        s: this.zoom * this.scale,
                        fx: qx * qwidth,
                        fy: qy * qheight,
                        fw: qwidth,
                        fh: qheight

                    }
                );
            }

        for (let request of this.requests) {
            cancelAnimationFrame(request);
            this.requests.shift();
        }

        this.requests.push(window.requestAnimationFrame(() => this.animate(to_render)));

        // Update share link
        let url = window.location.href.split('?')[0];
        document.getElementById("share_link").href = url+"?"+this.coords.x+":"+this.coords.y+":"+this.zoom+":"+this.depth;
    }

    animate(quadrants) {
        if (quadrants.length == 0) return;

        let x = quadrants[0].x;
        let y = quadrants[0].y;
        let w = quadrants[0].w;
        let h = quadrants[0].h;
        let s = quadrants[0].s;
        let fx = quadrants[0].fx;
        let fy = quadrants[0].fy;
        let fw = quadrants[0].fw;
        let fh = quadrants[0].fh;

        let buffer_canvas = new OffscreenCanvas(w, h);
        let buffer_ctx    = buffer_canvas.getContext("2d");
        let buffer        = buffer_ctx.getImageData(0, 0, w, h);
        let buffer_index  = 0;

        for (let cy=0; cy<h; cy++) {
            for (let cx=0; cx<w; cx++) {
                let xValue = x + (cx * s);
                let yValue = y + (cy * s);
                let result = this.mandel(xValue, yValue, this.depth);

                // Choose a color
                let finalColor = this.mandelbrot_color;
                if (result != -1)
                    if (this.proportional_color) {
                        finalColor = this.gradient[Math.floor(this.gradient.length / this.depth * result)];
                    } else {
                        finalColor = this.gradient[result % this.gradient.length];
                    }

                // Draw the pixel too all the pixels necessary
                buffer.data[buffer_index + 0] = finalColor.r; // R
                buffer.data[buffer_index + 1] = finalColor.g; // G
                buffer.data[buffer_index + 2] = finalColor.b; // B
                buffer.data[buffer_index + 3] = Math.floor(finalColor.a * 255); // A

                buffer_index += 4;
            }
        }

        // If clear canvas enabled
        //if (this.clear_canvas_on_redraw)
        this.ctx.clearRect(fx, fy, fw, fh);

        // Draw back to the onscreen canvas
        buffer_ctx.putImageData(buffer, 0, 0);
        this.ctx.drawImage(buffer_canvas, fx, fy, fw, fh);

        // End timer
        let duration = (new Date().getTime() - this.render_start_time);
        document.getElementById("elapsed").innerHTML = format_time(duration);

        // Recurse
        quadrants.shift()
        this.requests.shift()
        this.requests.push(window.requestAnimationFrame(() => this.animate(quadrants)));
    }

    mandel(x, y, depth) {
        // Prime Values
        let xP = 0;
        let yP = 0;

        // Temporary Values
        let xT = 0;
        let yT = 0;
        let i  = 0;

        for (i=0; i<depth; i++)
        {
            xT = (Math.pow(xP, 2)) + x - (Math.pow(yP, 2));
            yT = 2 * xP * yP + y;
            if (Math.pow(Math.abs(xT), 2) + Math.pow(Math.abs(yT), 2) > 4)
                return i;
            xP = xT;
            yP = yT;
        }
        return -1;
    }

    recenter(x, y) {
        this.coords.x = x;
        this.coords.y = y;
    }
}
