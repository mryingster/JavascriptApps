class joystick {
    constructor(canvas, def_x=0, def_y=0) {
        this.slider_x   = 0;
        this.slider_y   = 1;
        this.joystick   = 2;

        this.canvas     = canvas;
        this.width      = canvas.width;
        this.height     = canvas.height;
        this.ctx        = canvas.getContext("2d");

        this.margin     = .8;
        this.type       = this.joystick;
        this.max_x      = this.width/2;
        this.unit_x     = def_x;
        this.x          = this.unit_x * this.max_x;
        this.max_y      = this.height/2;
        this.unit_y     = def_y;
        this.y          = this.unit_y * this.max_y;
        this.mouse_down = false;

        if (this.width > this.height)
            this.type = this.slider_x;
        if (this.width < this.height)
            this.type = this.slider_y;

        this.canvas.addEventListener('touchstart',  this.input_down_touch.bind(this), false);
        this.canvas.addEventListener('touchmove',   this.input_move_touch.bind(this), false);
        this.canvas.addEventListener('touchend',    this.input_up.bind(this), false);

        this.canvas.addEventListener('mousedown',  this.input_down_mouse.bind(this));
        this.canvas.addEventListener('mousemove',  this.input_move_mouse.bind(this));
        this.canvas.addEventListener('mouseup',    this.input_up.bind(this));

        this.draw();
    }

    track_mouse(coords) {
        if (this.type == this.slider_x || this.type == this.joystick){
            this.x = coords.x - this.width/2;
            this.unit_x = this.x / this.max_x;
        }
        if (this.type == this.slider_y || this.type == this.joystick){
            this.y = coords.y - this.height/2;
            this.unit_y = this.y / this.max_y;
        }
        this.draw();
    }

    get_touch_position(canvas, event) {
        if (!e){
            var e = event;
        }

        var x = null;
        var y = null;

        if(e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                console.log(touch)
                x = touch.pageX-touch.target.getBoundingClientRect().left;
                y = touch.pageY-touch.target.getBoundingClientRect().top;
            }
        }

        return {x:x, y:y};
    }

    input_down_touch(e) {
        e.preventDefault();
        this.mouse_down = true;
        this.track_mouse(this.get_touch_position(this.canvas, e));
    }

    input_move_touch(e) {
        e.preventDefault();
        if (this.mouse_down == true)
            this.track_mouse(this.get_touch_position(this.canvas, e));
    }

    get_cursor_position(canvas, event) {
        // Determine where clicked
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return {x:x, y:y};
    }

    input_down_mouse(e) {
        this.mouse_down = true;
        this.track_mouse(this.get_cursor_position(this.canvas, e));
    }

    input_move_mouse(e) {
        if (this.mouse_down == true)
            this.track_mouse(this.get_cursor_position(this.canvas, e));
    }

    input_up(e) {
        this.mouse_down = false;
    }

    draw_circle(x, y, r, c) {
        this.ctx.fillStyle = c;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    draw_circle_gradient(x, y, r, c1, c2, c3) {
        //this.ctx.fillStyle = c1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        let grdRadial = this.ctx.createRadialGradient(x, y, r*.2, x, y, r);
        grdRadial.addColorStop(0, c1);
        grdRadial.addColorStop(.5, c2);
        grdRadial.addColorStop(1, c3);
        this.ctx.fillStyle = grdRadial;
        this.ctx.fill();
    }

    draw_joystick(){
        let full_radius = this.height / 2;
        let max_radius = full_radius * this.margin;
        let center_x = this.width / 2;
        let center_y = this.height / 2;

        // Draw background
        this.draw_circle(center_x, center_y, full_radius, "#888888");
        this.draw_circle_gradient(center_x, center_y, full_radius-10, "#888888", "#555555", "#333333");

        // Draw current position
        let proportion = 1;
        let actual_radius = Math.sqrt(this.x * this.x + this.y * this.y);
        if (actual_radius > max_radius){
            proportion = max_radius / actual_radius;
        }

        let knob_radius = 15
        let knob_x = center_x + (this.x * proportion);
        let knob_y = center_y + (this.y * proportion);

        this.draw_circle(knob_x, knob_y, knob_radius, "#883333");
    }

    draw_horizontal_slider(){
        // Draw background
        this.ctx.fillStyle = "#888888";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(this.width/2 - 2, 10, 2, this.height - 20);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(10, this.height/2 - 2, this.width - 20, 4);

        // Draw current position
        this.ctx.fillStyle = "#883333";
        let knob_height = this.height * .8;
        let knob_width  = 20;
        let knob_left   = (this.width) / 2 + this.x - (knob_width / 2);

        let max_left    = 0 + this.margin;
        let max_right   = this.width - this.margin - knob_width;

        knob_left = Math.max(knob_left, max_left);
        knob_left = Math.min(knob_left, max_right);

        this.ctx.fillRect(knob_left, this.height/2 - knob_height/2, knob_width, knob_height);
    }

    draw_vertical_slider(){
        // Draw background
        this.ctx.fillStyle = "#888888";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(10, this.height/2 - 2, this.width - 20, 2);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.width/2 - 2, 10, 4, this.height - 20);

        // Draw current position
        this.ctx.fillStyle = "#883333";
        let knob_width  = this.width * .8;
        let knob_height = 20;
        let knob_top    = (this.height) / 2 + this.y - (knob_height / 2);

        let max_top     = 0 + this.margin;
        let max_bottom  = this.height - this.margin - knob_height;

        knob_top = Math.max(knob_top, max_top);
        knob_top = Math.min(knob_top, max_bottom);

        this.ctx.fillRect(this.width/2 - knob_width/2, knob_top, knob_width, knob_height);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.type == this.joystick)
            this.draw_joystick();
        if (this.type == this.slider_x)
            this.draw_horizontal_slider();
        if (this.type == this.slider_y)
            this.draw_vertical_slider();
    }

    reset(){
        this.x = 0;
        this.y = 0;
        this.unit_x = 0;
        this.unit_y = 0;
        this.draw();
    }
}

class star {
    constructor(x, y, z, color){
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
    }
}

class star_field {
    constructor(canvas){
        this.canvas     = canvas;
        this.width      = canvas.width;
        this.height     = canvas.height;
        this.ctx        = canvas.getContext("2d");
        this.timer      = null;
        this.stars      = [];
        this.refresh    = 5;
        this.speed      = 1.09;
        this.elevation  = 0;
        this.sway       = 0;
        this.monochrome = false;
        this.showtrails = true;
        this.roll       = 0;
        this.pitch      = 0;
        this.yaw        = 0;
        this.scale      = 1;
        this.trail      = 0;
        this.full_rotation = Math.PI * 2;

        this.resize_field();
        this.main_loop();
    }

    compare(a, b){
        if (a.z > b.z) return -1;
        if (a.z < b.z) return 1;
        return 0;
    }

    main_loop(){
        // Get settings from controls
        this.max_stars  = document.getElementById("star_max").value;
        this.monochrome = document.getElementById("monochrome").checked;
        this.showtrails = document.getElementById("startrails").checked;
        this.scale      = document.getElementById("star_size").value;

        this.speed      = (speed_slider.unit_y ** 3) * -1500;
        this.trail      = (speed_slider.unit_y);
        this.sway       = translation_joystick.x / -10;
        this.elevation  = translation_joystick.y / -10;

        this.roll       = (roll_slider.unit_x ** 3) / -10;
        this.yaw        = rotation_joystick.x / -1000;
        this.pitch      = rotation_joystick.y / -1000;

        // Add stars
        while (this.stars.length < this.max_stars) {
            let new_star = new star(
                this.random_coord(this.width),
                this.random_coord(this.height),
                this.max_stars - this.stars.length > 5 ? Math.random() * 100 : 100,
                this.random_color(),
            )
            this.stars.push(new_star);
        }

        // Move stars
        for (var i=0; i<this.stars.length; i++) {
            // Move star
            this.stars[i].z -= this.speed / 100;

            // Translation
            this.stars[i].x += this.sway;
            this.stars[i].y += this.elevation;
            // Wrap around the screen
            if (this.stars[i].x > this.width/2  || this.stars[i].x < (-1 * this.width/2))  this.stars[i].x *= -1;
            if (this.stars[i].y > this.height/2 || this.stars[i].y < (-1 * this.height/2)) this.stars[i].y *= -1;

            this.stars[i].x += this.yaw   * this.stars[i].z;
            this.stars[i].y += this.pitch * this.stars[i].z;

            // Rotation
            let x1 = this.stars[i].x * Math.cos(this.roll) - this.stars[i].y * Math.sin(this.roll);
            let y1 = this.stars[i].y * Math.cos(this.roll) + this.stars[i].x * Math.sin(this.roll);
            this.stars[i].x = x1;
            this.stars[i].y = y1;

            // See if it's past us
            if (this.stars[i].z < 0 || this.stars[i].z > 100) {
                this.stars.splice(i, 1);
                i--;
            }
        }

        // Sort stars so closest stars are drawn last
        this.stars.sort(this.compare);

        // Redraw all stars
        this.redraw();

        // Set timer
        this.timer = setTimeout(() => this.main_loop(), this.refresh);
    }

    random_coord(max){
        let coord = Math.random() * max - (max / 2);
        return coord;
    }

    random_color(){
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb("+r+","+g+","+b+")";
    }

    is_star_centered(star){
        // The goal is to prevent stars from spawning too close to
        // center because they grow to large by the time they go off screen
        return (star.x * star.x + star.y * star.y < 500);
    }

    is_star_gone(star){
        return Math.abs(Math.min(star.x, star.y)) * star.z > Math.max(this.width, this.height) / 2;
    }

    draw_trail(x, y, z, s, c){
        let h = Math.sqrt((x ** 2) + (y ** 2));
        let scale = 1 - this.trail**3; //1 - (z/100 * this.trail);

        if (this.showtrails == false)
            scale = 1;

        this.ctx.strokeStyle = c;
        this.ctx.lineWidth = s*2;
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.width  / 2 + x,
            this.height / 2 + y
        );
        this.ctx.lineTo(
            this.width  / 2 + (x * scale),
            this.height / 2 + (y * scale)
        );
        this.ctx.stroke();
    }

    draw_star(star){
        let x = star.x * (100/star.z);
        let y = star.y * (100/star.z);

        //console.log(star.x, star.y, star.z, x, y);
        let radius = this.scale * ((100-star.z) / 100);
        let color  = this.monochrome == true ? "rgb(255,255,255)" : star.color;

        this.draw_trail(x, y, star.z, radius, color);
    }

    redraw(){
        // Clear out the background
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Iterate through each star
        for (var i=0; i<this.stars.length; i++) {
            this.draw_star(this.stars[i]);
        }
    }

    pause(){
        if (this.timer == null)
            this.main_loop();
        else {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    resize_field(){
        this.width  = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.redraw();
    }

    fullscreen(){
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||  // alternative standard method
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {            // current working methods
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
}

