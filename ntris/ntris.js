const sound_definitions = {
    "SLIDE"     : { volume: .5, path: "sounds/short_click.mp3"},
    "ROTATE"    : { volume: .5, path: "sounds/rotate.mp3"},
    "TETRIS"    : { volume: .5, path: "sounds/electricity.mp3"},
    "LEVEL_UP"  : { volume: .5, path: "sounds/level_up.mp3"},
    "GAME_OVER" : { volume: .5, path: "sounds/record_scratch.mp3"},
}

let sounds = {};
async function load_sound(audioCtx, name, definition) {
    const response = await fetch(definition.path);
    const arrayBuffer = await response.arrayBuffer();
    sounds[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

class tetris {
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

	// Setup Audio
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	// Load Sound Effects
	for (let name in sound_definitions)
	    load_sound(this.audioCtx, name, sound_definitions[name]);

        // Game dimensions
        this.dimension = {
            game_width           : 10,
            game_height          : 20,
            square_size          : 20,
            square_min_size      : 5,  // Minimum size
            block_chisled_ratio  : .25,
            block_outline_ratio  : .1,
            block_min_edge_size  : 1,
            starting_square_size : 20, // Starting size for scaling fonts/graphics
            top_buffer           : 5,  // Space for spawning new blocks
            left_buffer          : 7,  // Space for next block
            right_buffer         : 7,  // Space for next block
            game_border          : 1,  // Border width around play area
            em                   : 1,  // Font scaling constant
        }

        // Game variables
        this.state = {
            game_array      : [],                   // Play field
            game_active     : false,
            game_paused     : null,
            game_overlay    : null,
            lines           : 0,
            level           : 0,
            score           : 0,
            block_upcoming  : [],                   // Next chosen blocks
            block_history   : [],                   // History of blocks chosen
            block_position  : [null, null, null, null], // Block x, y, rotation, points
            timer           : null,                 // Main loop timer
            animation_timer : [null, null, null],   // Timer for animations
            blockset        : [],
            imacheater      : false,
        };

        // Settings/Toggles
        this.settings = {
            useExtraPieces : true,
            showGhostBlock : true,
            debug          : false,
            cheat          : false,
	    music          : false,
	    sounds         : false,
        };

        // Definitions
        this.direction = {
            up    : 1,
            right : 2,
            down  : 3,
            left  : 4,
            drop  : 5,
            cw    : 6,
            ccw   : 7
        };

        // Key Codes
        this.key = {
            space       : 32,
            left_arrow  : 37,
            up_arrow    : 38,
            right_arrow : 39,
            down_arrow  : 40,
            c           : 67,
            d           : 68,
            e           : 69,
            g           : 71,
            i           : 73,
            j           : 74,
            k           : 75,
            l           : 76,
            m           : 77,
            n           : 78,
            o           : 79,
            p           : 80,
            q           : 81,
            s           : 83,
            x           : 88,
            plus        : 61,
            minus       : 173,
        };

        this.EMPTY  = -2;

        this.colors = {
            background : "#222222",
            black      : "#000000",
            red        : "#CC0000",
            amber      : "#CCBB00",
            green      : "#00CC00",
            light_grey : "#CCCCCC",
            white      : "#FFFFFF",
        };

        this.level_colors = [
            "#888888",
            "#FF0000",
            "#FFFF00",
            "#00FF00",
            "#00FFFF",
            "#0000FF",
            "#FF00FF",
        ];

        this.overlays = {
            firstrun : [{color  : "white",
                         size   : 28,
                         font   : "SegmentedAlpha",
                         align  : "center",
                         y      : 170,
                         x      : null,
                         string : "Click to start!"}],
            paused   : [{color  : "white",
                         size   : 48,
                         font   : "SegmentedAlpha",
                         align  : "center",
                         y      : 170,
                         x      : null,
                         string : "PAUSED"},
                        {color  : "white",
                         size   : 20,
                         font   : "Arial",
                         align  : "center",
                         y      : 200,
                         x      : null,
                         string : "Click to resume."}],
            gameover : [{color  : "white",
                         size   : 40,
                         font   : "SegmentedAlpha",
                         align  : "center",
                         y      : 170,
                         x      : null,
                         string : "GAME OVER"},
                        {color  : "white",
                         size   : 20,
                         font   : "Arial",
                         align  : "center",
                         y      : 200,
                         x      : null,
                         string : "Click to play again!"}],
        }

        this.rules = {
            startingBlocks     : ['I', 'L', 'J', 'T'],
            tetrominoes        : ['I', 'L', 'J', 'T', 'S', 'Z', 'O'],
            line_scores        : [null, 40, 100, 300, 1200, 2600], // score value per lines cleared
            base_speed         : 890,
            speedup_multiplier : .86,
            max_speed          : 50,
        };

	this.music = new sound("music/8bit_march.mp3");
	this.music.sound.loop = true;

        this.block_defs = {
            // Tetrominoes
            I : {
                shape : [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
                rotations : 2,
                color : { r:0xFF, g:0x00, b:0x00 }, // Red
            },
            Z : {
                shape : [[1,1,0], [0,1,1], [0,0,0]],
                rotations : 2,
                color : { r:0xFF, g:0x92, b:0x00 }, // Orange
            },
            J : {
                shape : [[0,0,0], [1,1,1], [0,0,1]],
                rotations : 4,
                color : { r:0xDB, g:0xB6, b:0x00 }, // Yellow
            },
            T : {
                shape : [[0,0,0], [1,1,1], [0,1,0]],
                rotations : 4,
                color : { r:0x49, g:0xB6, b:0x00 }, // Green
            },
            S : {
                shape : [[0,1,1], [1,1,0], [0,0,0]],
                rotations : 2,
                color : { r:0x00, g:0xB6, b:0xAA }, // Cyan
            },
            O: {
                shape : [[0,0,0,0], [0,1,1,0], [0,1,1,0], [0,0,0,0]],
                rotations : 1,
                color : { r:0x00, g:0x49, b:0xFF }, // Blue
            },
            L : {
                shape : [[0,0,0], [1,1,1], [1,0,0]],
                rotations : 4,
                color : { r:0xDB, g:0x00, b:0xFF }, // Purple
            },

            // Pentominoes
            LongJ : {
                shape : [[0,0,0,0], [1,0,0,0], [1,1,1,1], [0,0,0,0]],
                rotations : 4,
                color : { r:0xcc, g:0x83, b:0x00 }, // Red-Orange
            },
            LongL : {
                shape : [[0,0,0,0], [0,0,0,1], [1,1,1,1], [0,0,0,0]],
                rotations : 4,
                color : { r:0xa0, g:0x00, b:0xff }, // Light BLue
            },
            IL : {
                shape : [[0,0,0,0], [0,0,1,0], [1,1,1,1], [0,0,0,0]],
                rotations : 4,
                color : { r:0xff, g:0xbb, b:0x00 }, // Orange Yellow
            },
            JI : {
                shape : [[0,0,0,0], [0,1,0,0], [1,1,1,1], [0,0,0,0]],
                rotations : 4,
                color : { r:0x98, g:0x68, b:0x08 }, // Yellow Green
            },
            BigS : {
                shape : [[1,0,0], [1,1,1], [0,0,1]],
                rotations : 4,
                color : { r:0x00, g:0xbb, b:0x88 }, // Teal
            },
            BigZ : {
                shape : [[0,0,1], [1,1,1], [1,0,0]],
                rotations : 4,
                color : { r:0x00, g:0xbd, b:0xff }, // Cyan-light blue
            },
            JT : {
                shape : [[0,1,0], [1,1,1], [0,0,1]],
                rotations : 4,
                color : { r:0x00, g:0x91, b:0xff }, // Lighter Blue
            },
            TL : {
                shape : [[0,1,0], [1,1,1], [1,0,0]],
                rotations : 4,
                color : { r:0xff, g:0x00, b:0x83 }, // Dark Orange
            },
            LongS : {
                shape : [[0,0,0,0], [0,0,1,1], [1,1,1,0], [0,0,0,0]],
                rotations : 4,
                color : { r:0x00, g:0x80, b:0x80 }, // Purple
            },
            LongZ : {
                shape : [[0,0,0,0], [1,1,0,0], [0,1,1,1], [0,0,0,0]],
                rotations : 4,
                color : { r:0xff, g:0x57, b:0x00 }, // Fuscia
            },
            P : {
                shape : [[0,0,0], [1,1,0], [1,1,1]],
                rotations : 4,
                color : { r:0x4c, g:0x00, b:0x99 }, // Brown
            },
            b : {
                shape : [[0,0,0], [0,1,1], [1,1,1]],
                rotations : 4,
                color : { r:0x6B, g:0x49, b:0x04 }, // Lime
            },
            BigL : {
                shape : [[1,0,0], [1,0,0], [1,1,1]],
                rotations : 4,
                color : { r:0x5C, g:0x5C, b:0x5C }, // Dark Grey
            },
            W : {
                shape : [[0,0,1], [0,1,1], [1,1,0]],
                rotations : 4,
                color : { r:0x00, g:0x00, b:0x99 }, // Tan
            },
            Plus : {
                shape : [[0,1,0], [1,1,1], [0,1,0]],
                rotations : 1,
                color : { r:0xa0, g:0xff, b:0x00 }, // Dark Cyan
            },
            U : {
                shape : [[0,0,0], [1,0,1], [1,1,1]],
                rotations : 4,
                color : { r:0xAA, g:0xDD, b:0x77 }, // Light Grey
            },
            LongI : {
                shape : [[0,0,0,0,0], [0,0,0,0,0], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0]],
                rotations : 2,
                color : { r:0x99, g:0x00, b:0x00 }, // Dark Green
            },
            BigT : {
                shape : [[0,1,0], [0,1,0], [1,1,1]],
                rotations : 4,
                color : { r:0x00, g:0x66, b:0x00 }, // Light Green
            },

            /*
              Ethan : {
              shape : [[1,0,1,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]],
              rotations : 4,
              color : { r:0xdd, g:0xdd, b:0xdd }, // Dark Green
              },
            */

            // Triominoes
            SmallL : {
                shape : [[0,1], [1,1]],
                rotations : 4,
                color : { r:0xC0, g:0xC0, b:0xC0 }, // Pink
            },
            SmallI : {
                shape : [[0,0,0], [1,1,1], [0,0,0]],
                rotations : 2,
                color : { r:0xA1, g:0x12, b:0x12 }, // Dark Red

            },

            // Diominoe
            TinyI : {
                shape : [[0,0], [1,1]],
                rotations : 2,
                color : { r:0xFF, g:0x66, b:0xB2 }, // Dark Blue

            },

            // Monominoe
            Dot : {
                shape : [[1]],
                rotations : 1,
                color : { r:0xDA, g:0xBB, b:0x7E }, // Dark Purple
            },
        };
    }

    currentStackHeight() {
        for (var y=this.state.game_array.length; y>0; y--) {
            let empty = true;
            for (var x=0; x<this.state.game_array[y-1].length; x++) {
                if (this.state.game_array[y-1][x] != this.EMPTY) {
                    empty = false;
                    break;
                }
            }
            if (empty) {
                return this.state.game_array.length - y;
            }
        }
        return this.state.game_array.length - 1;
    }

    isGameOver() {
        if (this.currentStackHeight() > 20)
            return true;
        return false;
    }

    clearAndShift(l){
        for (var i=l.length-1; i>=0; i--){
            var y = l[i];
            for (var y2=y; y2>=1; y2--){
                for (var x=0; x<this.dimension.game_width; x++){
                    this.state.game_array[y2][x] = this.state.game_array[y2-1][x];
                }
            }
        }
    }

    animateLineClear(l, n){
        this.clearAnimationTimer(1)

        if (n > 0) {
            let clearLineBlock = { shape : [[1,2,1,2,1,2,1,2,1,2]],
                                   color : [{r:0xff,g:0,b:0}, {r:0,g:0xff,b:0}, {r:0,g:0,b:0xff}][ n%3 ]
                                 }
            if (n < 8)
                clearLineBlock.shape = [[1, 2, 1, 2,-2,-2, 1, 2, 1, 2]]
            if (n < 6)
                clearLineBlock.shape = [[1, 2, 1,-2,-2,-2,-2, 2, 1, 2]]
            if (n < 4)
                clearLineBlock.shape = [[1, 2,-2,-2,-2,-2,-2,-2, 1, 2]]
            if (n < 2)
                clearLineBlock.shape = [[1,-2,-2,-2,-2,-2,-2,-2,-2, 2]]
            for (var i=0; i<l.length; i++){
                this.drawBlock(this.ctx,
                               clearLineBlock,
                               this.dimension.left_buffer + this.dimension.game_border,
                               l[i],
                               0)
            }
            this.state.animation_timer[1] = setTimeout(() => this.animateLineClear(l, n-1), 20);
        } else {
            this.clearAndShift(l);
            // Check if game over because we have a conflict with checking in main loop and animations
            if (this.isGameOver() == true && lines_cleared == 0){
                this.endGame();
            }
        }
    }

    lookForLines(){
        var lines_cleared = [];
        for (var y=this.state.game_array.length-1; y>=this.dimension.top_buffer; y--){
            // Look at line
            var lineFull = true;
            for (var x=0; x<this.dimension.game_width; x++){
                if (this.state.game_array[y][x] == this.EMPTY){
                    lineFull = false;
                    break;
                }
            }

            // If full lines exist, start animation
            if (lineFull == true) {
                lines_cleared.push(y);
            }
        }

        if (lines_cleared.length > 0) {
            this.play_sound("TETRIS");
            this.animateLineClear(lines_cleared, 8*lines_cleared.length);
        }

        return lines_cleared.length;
    }

    placeBlock(block, pos){
        var pos_x = pos[0];
        var pos_y = pos[1];
        var rot   = pos[2];
        var block_number = this.state.block_history.length-1;

        block = this.rotateArray(block, rot);

        for (var y=0; y<block.length; y++) {
            for (var x=0; x<block[y].length; x++) {
                if (block[y][x] == 1) {
                    this.state.game_array[pos_y + y][pos_x + x] = block_number;
                }
            }
        }
    }

    canMove(block, pos, dir){
        var pos_x = pos[0];
        var pos_y = pos[1];
        var rot   = pos[2];

        // Move position
        if (dir == this.direction.down)  pos_y++;
        if (dir == this.direction.left)  pos_x--;
        if (dir == this.direction.right) pos_x++;
        if (dir == this.direction.ccw)   rot++;
        if (dir == this.direction.cw)    rot--;

        // Rotate
        var block_array = this.rotateArray(block, rot);

        for (var y=0; y<block_array.length; y++) {
            for (var x=0; x<block_array[y].length; x++) {
                if (block_array[y][x] != 0){
                    // Check for out of bounds
                    if (pos_x + x < 0 || pos_x + x >= this.dimension.game_width)
                        return false;
                    if (pos_y + y >= this.dimension.game_height + this.dimension.top_buffer)
                        return false;
                    // Compare against game array
                    if (this.state.game_array[pos_y + y][pos_x + x] != this.EMPTY)
                        return false;
                }
            }
        }

        // Can move!
        return true;
    }

    isAnimating(){
        for (var i=0; i<this.state.animation_timer.length; i++)
            if (this.state.animation_timer[i] != null) return true;
        return false;
    }

    clearAnimationTimer(n=-1){
        // Clear all timers
        if (n == -1) {
            for (var i=0; i<this.state.animation_timer.length; i++){
                clearTimeout(this.state.animation_timer[i]);
                this.state.animation_timer[i] = null;
            }
        } else {
            clearTimeout(this.state.animation_timer[n]);
            this.state.animation_timer[n] = null;
        }
    }

    animateDrop(block){
        this.clearAnimationTimer(3);

        if (this.canMove(block, this.state.block_position, this.direction.down) == true){
            this.move(this.direction.down);
            this.state.block_position[3] += 1; // Bonus point per square for dropping fast
            this.state.animation_timer[3] = setTimeout(() => this.animateDrop(block), 5);
        }
    }

    resetMainLoopTimeout(){
        clearTimeout(this.state.timer);
        this.state.timer = setTimeout(() => this.main_loop(), this.speed);
        return;
    }

    move(dir, usermove=false){
        // Get shape template
        var thisBlock = this.state.block_history[this.state.block_history.length-1];

        // Is valid move?
        if (this.canMove(thisBlock, this.state.block_position, dir) == false)
            return;

        // Actually move block
        if (dir == this.direction.down){
            this.state.block_position[1] = this.state.block_position[1] + 1;
            this.state.block_position[3] += 1 // Get point per step for slow dropping
            /* There's a bug here. The timer should reset when a user pressed the down arrow.
               But this code isn't doing the trick. Debug this when you have time...
            */
            if (usermove == true) {
                this.redraw();
                this.resetMainLoopTimeout();
            }
        }

        if (dir == this.direction.drop){
            this.play_sound("SLIDE");
            this.state.block_position[3] = 0; // only get points from where it was fast dropped
            this.animateDrop(thisBlock);
            // Call mainloop now so it registers the block
            clearTimeout(this.state.timer)
            this.main_loop();
        }

        if (dir == this.direction.left){
            this.play_sound("SLIDE");
            this.state.block_position[3] = 0; // only get points for how far it dropped without shifting
            this.state.block_position[0] = this.state.block_position[0] - 1;
        }

        if (dir == this.direction.right){
            this.play_sound("SLIDE");
            this.state.block_position[3] = 0; // only get points for how far it dropped without shifting
            this.state.block_position[0] = this.state.block_position[0] + 1;
        }

        if (dir == this.direction.ccw){
            this.play_sound("ROTATE");
            this.state.block_position[3] = 0; // only get points for how far it dropped without shifting
            this.state.block_position[2] = this.state.block_position[2] + 1;
        }

        if (dir == this.direction.cw){
            this.play_sound("ROTATE");
            this.state.block_position[3] = 0; // only get points for how far it dropped without shifting
            this.state.block_position[2] = this.state.block_position[2] + 3;
        }

        // Redraw
        this.redrawGameField();
        this.redrawCurrentBlock();
    }

    toggleDebugMode(){
        if (this.settings.debug == true)
            this.settings.debug = false;
        else
            this.settings.debug = true;
    }

    toggleCheatMode(){
        if (this.settings.cheat == true) {
            this.settings.cheat = false;
            this.rules.base_speed = 890;
            this.colors.black = "#000000";
        } else {
            this.settings.cheat = true;
            this.rules.base_speed = 8900;
            this.colors.black = "#AA0000";
            this.state.imacheater = true;
        }
        if (this.state.game_active == true){
            this.redrawGameField();
            this.redrawCurrentBlock();
        }
    }

    toggleGhostMode(){
        if (this.settings.showGhostBlock == true)
            this.settings.showGhostBlock = false;
        else
            this.settings.showGhostBlock = true;
        this.redraw();
    }

    toggleExtraPieces() {
        if (this.state.game_active == true)
            return;
        if (this.settings.useExtraPieces == true)
            this.settings.useExtraPieces = false;
        else
            this.settings.useExtraPieces = true;
        this.redraw();
    }

    select_button() {
	if (this.state.game_active == true) {
	    this.toggleMusicSetting();
	    this.toggleSoundSetting();
	} else
	    this.toggleExtraPieces();
    }

    toggleMusicSetting() {
	if (this.settings.music == true) {
	    this.settings.music = false
	    this.stopMusic();
	} else {
	    this.settings.music = true;
	    this.startMusic();
	}
    }

    toggleSoundSetting() {
	if (this.settings.sounds == true) {
	    this.settings.sounds = false
	} else {
	    this.settings.sounds = true;
	}
    }

    startMusic(reset = false) {
        if (reset) {
            // Reset to normal speed and start from beginning
            this.music.sound.playbackRate = 1;
            this.music.sound.fastSeek(0);
        }

	if (this.state.game_active && this.state.game_paused == false && this.settings.music == true) {
	    this.music.play();
	}
    }

    stopMusic() {
	this.music.stop();
    }

    onscreen_gamepad_move(d) {
	if (this.state.game_active == true && this.isAnimating() == false && this.state.game_paused == false) {
	    this.move(d, true);
	}
    }

    user_move(e){
        // Switch for general commands
        switch (e.keyCode){
        case this.key.n:
            if (this.state.game_active == false)
                this.start();
            break;

        case this.key.g:
            this.toggleGhostMode();
            break;

        case this.key.d:
            this.toggleDebugMode();
            break

        case this.key.c:
            this.toggleCheatMode();
            break

        case this.key.e:
            this.toggleExtraPieces();
            break;

        case this.key.p:
            if (this.state.game_active == true)
                this.togglePause();
            break;

	case this.key.m:
	    this.toggleMusicSetting();
	    break;

	case this.key.s:
	    this.toggleSoundSetting();
	    break;

        case this.key.q:
            this.endGame();
            break;
        }

        // Switch for movement commands
        if (this.state.game_active == true && this.isAnimating() == false && this.state.game_paused == false) {
            var direction = null;
            switch(e.keyCode){
            case this.key.space:
                direction = this.direction.drop;
                e.preventDefault();
                break;

            case this.key.left_arrow:
            case this.key.j:
                direction = this.direction.left;
                break;

            case this.key.up_arrow:
            case this.key.i:
                direction = this.direction.ccw;
                break;

            case this.key.o:
                direction = this.direction.cw;
                break;

            case this.key.right_arrow:
            case this.key.l:
                direction = this.direction.right;
                break;

            case this.key.down_arrow:
            case this.key.k:
                direction = this.direction.down;
                break;

            case this.key.plus:
                this.state.level += 1;
                this.redrawFrame();
                this.drawGameInformation();
                break;

            case this.key.minus:
                if (this.settings.cheat == true) {
                    this.state.level -= 1;
                    this.drawGameInformation();
                }
                break;

            case this.key.x:
                if (this.settings.cheat == true) {
                    // Replace current block definition with an empty block
                    this.state.block_history[this.state.block_history.length-1] = {
                        shape : [[-1]],
                        rotations : 1,
                        color : { r:0x00, g:0x00, b:0x00 },
                    };
                    // Drop it like it's hot
                    direction = this.direction.drop;
                }
                break;

            default:
                return;
            }
            this.move(direction, true);
        }
    }

    check_high_score() {
	// Don't check when there is no score
	if (this.state.score <= 0) return;

        // Retrieve Scores
        var high_scores = localStorage.getItem("ntris");

        // Retrieve scores from previous location if null
        if (high_scores == null) {
            high_scores = localStorage.getItem("scores");
            localStorage.setItem("ntris", high_scores);
        }

        // Convert from JSON
        if (high_scores)
            high_scores = JSON.parse(high_scores);
        else
            high_scores = [];

        // Go through each and see if it's in the top ten
        var i     = 0;
        var place = 0;
        for (i=0; i<high_scores.length; i++){
            // Check to see if extras is there. If not, assume old scores were extras = false
            if (! high_scores[i].hasOwnProperty('extra')){
                high_scores[i]['extra'] = false;
            }

            if (this.settings.useExtraPieces == high_scores[i].extra) {
                place += 1;

                if (this.state.score > high_scores[i].score) {
                    break;
                }
            }
        }

        // Record new score
        if (place <= 10) {
            const nth = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh"]
            var user_name = null;

            if (this.state.imacheater == true){
                alert("You would have gotten a high score, but you're a cheater!");
                return;
            } else {
                user_name = prompt("New high score! You got "+nth[i]+" place. Enter name", "Anonymous");
            }

            if (user_name != null){
                high_scores.splice(i, 0, {
                    name  : user_name,
                    level : this.state.level,
                    score : this.state.score,
                    extra : this.settings.useExtraPieces,
                    lines : this.state.lines,
                    date  : new Date().toString()
                });

                localStorage.ntris = JSON.stringify(high_scores);
            }

            // Update overlay with new high score!
            this.redraw();
        }
    }

    game_over_overlay(printed_score=0){
        var wait = 25; // miliseconds

        if (printed_score < this.state.score || this.state.score == 0) {
            printed_score = Math.floor(printed_score * 1.6);
            printed_score += Math.floor(Math.random() * 5);
            if (printed_score > this.state.score) {
                printed_score = this.state.score;
                wait = 1000;
            }
            this.state.game_overlay = [
                {color  : "white",
                 size   : 40,
                 font   : "SegmentedAlpha",
                 align  : "center",
                 y      : 170,
                 x      : null,
                 string : "GAME OVER"},
                {color  : "white",
                 size   : 20,
                 font   : "Arial",
                 align  : "left",
                 y      : 200,
                 x      : (this.dimension.left_buffer + 2) * this.dimension.starting_square_size,
                 string : "SCORE: "},
                {color  : "white",
                 size   : 20,
                 font   : "Segmented",
                 align  : "right",
                 y      : 200,
                 x      : (this.dimension.left_buffer + this.dimension.game_width) * this.dimension.starting_square_size,
                 string : printed_score}
            ],

            this.redraw();
	    if (this.state.score != 0)
                this.state.timer = setTimeout(() => this.game_over_overlay(printed_score), wait);
        } else {
            this.check_high_score();
        }
    }

    endGame(){
        if (this.state.game_active == false) return;
        clearTimeout(this.state.timer);
        this.clearAnimationTimer();
        this.state.game_active = false;
        this.stopMusic();
        this.play_sound("GAME_OVER");
        this.game_over_overlay();
    }

    main_loop(){
        // See if we are paused
        if (this.state.game_paused == true) return;

        if (this.settings.debug == true){
            this.ctx.fillStyle = this.colors.background;
            this.ctx.fillRect(this.canvas.width-(this.dimension.right_buffer*this.dimension.square_size), this.canvas.height-20, this.dimension.right_buffer*this.dimension.square_size, this.canvas.height);
        }
        // See if animations are going, and wait for them to finish
        if (this.isAnimating() == true){
            if (this.settings.debug == true){
                this.ctx.font = "12px SegmentedAlpha";
                this.ctx.fillStyle = this.colors.red;
                this.ctx.fillText("animating", this.canvas.width - 10, this.canvas.height-10);
            }
            clearTimeout(this.state.timer);
            this.state.timer = setTimeout(() => this.main_loop(), 10);
            return;
        }

        // Get shape template
        var block = this.state.block_history[this.state.block_history.length-1];

        // Set timeout for next cycle
        this.speed = this.rules.base_speed * Math.pow(this.rules.speedup_multiplier, this.state.level -1);
        this.speed = this.speed < this.rules.max_speed ? this.rules.max_speed : this.speed;

        // See if a block has been placed
        if (this.canMove(block, this.state.block_position, this.direction.down) == false){
            // Set speed to 0 so we don't wait for an entire cycle to show new block
            this.speed = 0;

            // Add block array to array
            this.placeBlock(block, this.state.block_position);

            // Look for lines to clear, Update Scores and Counts
            var lines_cleared = this.lookForLines();
            this.state.score += this.rules.line_scores[lines_cleared] * this.state.level;
            if (Math.floor(this.state.lines / 10) < Math.floor((this.state.lines + lines_cleared) / 10)){
                this.state.level += 1;
                this.play_sound("LEVEL_UP");
                this.redrawFrame();
            }
            this.state.lines += lines_cleared;

            // 1 point per block for distance fallen, double for fast drop
            this.state.score += this.state.block_position[3] > 40 ? 40 : this.state.block_position[3];
            this.drawGameInformation();

            // Animate blocks scrolling up
            this.animateUpcomingBlocks(0);

	    // See how many blocks high current state is. Change music temp if above 15 lines
            if (this.currentStackHeight() >= 17)
                this.music.sound.playbackRate = 1.5;
            else
                this.music.sound.playbackRate = 1;

            // See if game is over
            if (this.isGameOver() == true && lines_cleared == 0){
                this.endGame();
                return;
            }
        }

        // Move current block down
        this.move(this.direction.down);

        // See if window/game lost focus, and pause
        if(!document.hasFocus()) this.pause();

        // Set timer
        this.state.timer = setTimeout(() => this.main_loop(), this.speed);
    }

    shuffle(array) {
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

    add_block(){
        // Make sure first block of game is from more restrictive set
        if (this.state.block_upcoming.length == 0){
            var t = this.rules.startingBlocks[Math.floor(Math.random() * this.rules.startingBlocks.length)];
            this.state.block_upcoming.push(this.block_defs[t]);
        }

        // If there are fewer than 8 pieces, add a whole set of pieces in random order
        while (this.state.block_upcoming.length < 8){
            for (var t of this.shuffle(this.state.blockset))
                this.state.block_upcoming.push(this.block_defs[t]);
        }

        // Move next block from block_upcoming array to block_history array
        this.state.block_history.push(this.state.block_upcoming[0]);
        this.state.block_upcoming = this.state.block_upcoming.slice(1);

        // Set position of previous 'next' block to top, center
        var this_block = this.state.block_history[this.state.block_history.length-1];
        this.state.block_position = [(this.dimension.game_width/2) - 1,
                                     this.dimension.top_buffer - this_block.shape.length - 1,
                                     0,
                                     0];
    }

    play_sound(name) {
	if (!this.settings.sounds) return;

	const source = this.audioCtx.createBufferSource();
	const gain = this.audioCtx.createGain();

	source.buffer = sounds[name];
	gain.gain.value = sound_definitions[name].volume;

	source.connect(gain);
	gain.connect(this.audioCtx.destination);

	source.start(0);
    }


    resizeCanvas(width, height){
        this.canvas.height = width * this.dimension.square_size;
        this.canvas.width  = height * this.dimension.square_size;
        document.getElementById("content").setAttribute("style", "width: " + this.canvas.width + "px;");
    }

    clearScreen(){
        // Setup Game field
        var total_height = this.dimension.game_height + this.dimension.top_buffer + this.dimension.game_border;
        var total_width  = this.dimension.game_width + this.dimension.left_buffer + this.dimension.right_buffer + (2*this.dimension.game_border);
        this.resizeCanvas(total_width, total_height);

        // Setup Array
        this.state.game_array = [];
        for (var y=0; y<this.dimension.game_height+this.dimension.top_buffer; y++){
            var temp = [];
            for (var x=0; x<this.dimension.game_width; x++){
                temp.push(this.EMPTY);
            }
            this.state.game_array.push(temp);
        }

        this.redraw();
        return;
    }

    pause(){
        if (this.state.game_active == true && this.state.game_paused == false){
            this.state.game_paused = true;
            this.state.game_overlay = this.overlays.paused;
            this.redraw();
            clearTimeout(this.state.timer);
	    this.stopMusic();
        }
    }

    unpause(){
        if (this.state.game_active == true && this.state.game_paused == true){
            this.state.game_paused = false;
            this.state.game_overlay = null;
            this.redraw();
            this.main_loop();
	    this.startMusic();
        }
    }

    togglePause(){
        if (this.state.game_active == true){
            if (this.state.game_paused == false){
                this.pause();
            } else {
                this.unpause();
            }
        }
    }

    start(){
        this.state.game_overlay = null; // Clear text overlays
        this.togglePause();  // Toggle pause

        // Start game
        if (this.state.game_active == false) {
            this.clearScreen();      // Clear the screen
            this.state.lines = 0;
            this.state.level = 1;
            this.state.score = 0;
            this.state.block_history = [];
            this.state.block_upcoming = []; // Clear next blocks

            // Reset cheating...
            this.state.imacheater = false;
            if (this.settings.cheat == true)
                this.toggleCheatMode();

            // Set which type of blocks for game
            this.state.blockset = this.rules.tetrominoes;
            if (this.settings.useExtraPieces == true)
                this.state.blockset = Object.keys(this.block_defs);
            this.add_block();         // Populate upcoming blocks
            this.state.game_active = true;
            this.state.game_paused = false;
            this.redraw();            // Draw the screen
            this.main_loop();
        }

	this.startMusic(true);
    }

    drawUpcomingBlocks(offset=0){
        // Clear left section
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.dimension.left_buffer * this.dimension.square_size, this.canvas.height);

        for (var i=0; i<7; i++){
            var next_block        = this.state.block_upcoming[i];
            var next_block_height = next_block.shape.length;
            var next_block_width  = next_block.shape[0].length;
            var next_block_left   = Math.floor((this.dimension.left_buffer / 2) - (next_block_width / 2));
            this.drawBlock(this.ctx,
                           next_block,
                           next_block_left,
                           this.dimension.top_buffer - next_block_height + (4 * i) + offset,
                           0);
        }
    }

    animateUpcomingBlocks(n){
        this.clearAnimationTimer(2);

        if (n > -5){
            this.drawUpcomingBlocks(n);
            n--;
            this.state.animation_timer[2] = setTimeout(() => this.animateUpcomingBlocks(n), 20);
        } else {
            // Finally, add a block
            this.add_block();
            // and redraw to remove the added block from left side
            this.drawUpcomingBlocks(0);
        }
    }

    redrawGameField(){
        this.ctx.fillStyle = this.colors.black;
        this.ctx.fillRect(
            this.dimension.square_size * (this.dimension.left_buffer + this.dimension.game_border),
            0,
            this.dimension.square_size * (this.dimension.game_width),
            this.dimension.square_size * (this.dimension.top_buffer + this.dimension.game_height)
        );

        for (var y=0; y<this.state.game_array.length; y++){
            for (var x=0; x<this.state.game_array[y].length; x++){
                if (this.state.game_array[y][x] == this.EMPTY) continue;
                this.drawChisledBrick(this.ctx, x + this.dimension.left_buffer + this.dimension.game_border, y, this.dimension.square_size,
                                      this.state.block_history[this.state.game_array[y][x]].color,
                                      y > 0                 ? this.state.game_array[y][x] == this.state.game_array[y-1][x] : false,
                                      x < this.state.game_array[0].length-1 ? this.state.game_array[y][x] == this.state.game_array[y][x+1] : false,
                                      y < this.state.game_array.length-1    ? this.state.game_array[y][x] == this.state.game_array[y+1][x] : false,
                                      x > 0                 ? this.state.game_array[y][x] == this.state.game_array[y][x-1] : false,
                                     );
            }
        }
    }

    redrawCurrentBlock(){
        var this_block = this.state.block_history[this.state.block_history.length-1];

        // Ghost block
        if (this.settings.showGhostBlock == true){
            // Get lowest it can go
            var ghost_pos = this.state.block_position.slice();

            while (this.canMove(this_block, ghost_pos, this.direction.down) == true)
                ghost_pos[1]++;
            this.drawBlockInGameField(this.ctx, this_block, this.state.block_position[0], ghost_pos[1], this.state.block_position[2], true);
        }

        // Draw current block last so it's always on top
        this.drawBlockInGameField(this.ctx, this_block, this.state.block_position[0], this.state.block_position[1], this.state.block_position[2]);
    }

    redrawBackground(){
        // Draw black background
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.colors.black;
        this.ctx.fillRect((this.dimension.left_buffer + this.dimension.game_border)*this.dimension.square_size, 0, this.dimension.game_width*this.dimension.square_size, this.canvas.height);
    }

    redrawFrame() {
        // Draw border around game field
        for (var y=0; y<=this.dimension.game_height + this.dimension.game_border; y++)
            for (var x=0; x<this.dimension.game_width + (2 * this.dimension.game_border); x++)
                if (y == this.dimension.game_height || (x == 0 || x == this.dimension.game_width + 1))
                    this.drawChisledBrick(this.ctx, x + this.dimension.left_buffer, y + this.dimension.top_buffer, this.dimension.square_size,
                                          this.hexToRGB(this.level_colors[this.state.level % this.level_colors.length]), //{r:0x88, g:0x88, b:0x88}, // Color here?
                                          y == 0 || y == this.dimension.game_height && x != 0 && x != this.dimension.game_width + 1 ? false : true,
                                          y <  this.dimension.game_height || y == this.dimension.game_height && x == this.dimension.game_width + 1 ? false : true,
                                          y == this.dimension.game_height ? false : true,
                                          y <  this.dimension.game_height || y == this.dimension.game_height && x == 0 ? false : true,
                                         );
    }

    redraw(){
        // Redraw background
        this.redrawBackground();
        this.redrawFrame();

        // Draw each block in game field
        this.redrawGameField();

        // Draw upcoming blocks
        if (this.state.block_upcoming.length > 0)
            this.drawUpcomingBlocks();

        // Draw current block
        if (this.state.game_active == true) {
            this.redrawCurrentBlock();
        }

        // Draw right hand side
        this.drawGameInformation();

        // Draw game overlay
        if (this.state.game_overlay != null){
            this.text_overlay(this.state.game_overlay);
        }
    }

    drawGameInformation(){
        // Clear section and Draw black background
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(this.canvas.width-(this.dimension.right_buffer*this.dimension.square_size), 0, this.dimension.right_buffer*this.dimension.square_size, this.canvas.height);

        // Right align everything
        var ralign = this.canvas.width - (this.dimension.square_size * 1);
        this.ctx.textAlign = "right";

        // Draw Game Name
        this.ctx.fillStyle = this.colors.light_grey;
        var title_size = Math.floor(this.canvas.width / 13);
        this.ctx.font = "Bold " + title_size + "px Arial";
        this.ctx.fillText("N-tris", ralign, 0 + (title_size * 1.3));

        // Set up spacing based on this.canvas size
        var label_size = Math.floor(this.canvas.width / 28);
        var digit_size = Math.floor(this.canvas.width / 18);
        var alpha_size = Math.floor(this.canvas.width / 21);
        var line_spacing = Math.floor(this.canvas.width / 18);

        // Draw game information
        var y = this.dimension.top_buffer * this.dimension.square_size + label_size;
        this.ctx.fillStyle = this.colors.light_grey;
        this.ctx.font = label_size + "px Arial";
        this.ctx.fillText("Score",         ralign, y + (0 * line_spacing));
        this.ctx.fillText("Lines",         ralign, y + (2 * line_spacing));
        this.ctx.fillText("Level",         ralign, y + (4 * line_spacing));
        this.ctx.fillText("Extra Pieces", ralign, y + (6 * line_spacing));
        this.ctx.fillText("Ghost Block",   ralign, y + (8 * line_spacing));
        this.ctx.fillStyle = this.colors.green;
        this.ctx.font = digit_size + "px Segmented";
        this.ctx.fillText(this.state.score,                ralign, y + (1 * line_spacing));
        this.ctx.fillText(this.state.lines,                ralign, y + (3 * line_spacing));
        this.ctx.fillText(this.state.level, ralign, y + (5 * line_spacing));
        this.ctx.font = alpha_size + "px SegmentedAlpha";
        this.ctx.fillStyle = this.state.game_active == true ? this.colors.amber : this.colors.green;
        this.ctx.fillText(this.settings.useExtraPieces == true ? "Enabled" : "Disabled", ralign, y + (7 * line_spacing));
        this.ctx.fillStyle = this.colors.green;
        this.ctx.fillText(this.settings.showGhostBlock == true ? "Enabled" : "Disabled", ralign, y + (9 * line_spacing));

        // Draw help information
        y = this.canvas.height - this.dimension.square_size;
        var note_spacing = this.canvas.width / 45;
        this.ctx.fillStyle = this.colors.light_grey;
        this.ctx.font = "Italic " + this.canvas.width / 50 + "px Arial";
        var notes = [
            "(n) New Game",
            "(arrows) Move",
            "(up arrow) Rotate",
            "(space) Drop",
            "(p) Pause",
            "(q) Quit Game",
            "(e) Extra Pieces",
            "(g) Ghost Mode",
            //"(m) Music",
            //"(s) Sounds"
        ];
        for (var i=0; i<notes.length; i++)
            this.ctx.fillText(notes[i], ralign, y - ((notes.length - i) * note_spacing));
    }

    rotateArray(a, n){
        var rotated = a.shape.slice(); // Copies the array
        const height = rotated[0].length;;
        const width = rotated.length;
        const rotation = n % a.rotations;

        for (var rotate=0; rotate<rotation; rotate++){
            // Create new array of the same size
            var tmp = [];
            for (var y=0; y<height; y++){
                var t_row = [];
                for (var x=0; x<width; x++){
                    t_row.push(0);
                }
                tmp.push(t_row);
            }

            // Copy data to new, empty array
            for (var y=0; y<height; y++){
                for (var x=0; x<width; x++){
                    tmp[y][x] = rotated[x][height-y-1];
                }
            }

            // Overwrite rotated array
            rotated = tmp.slice();
        }

        return rotated;
    }

    drawBlockInGameField(ctx, def, bx, by, r, outline=false){
        // offset so it draws on the game board
        this.drawBlock(ctx, def, this.dimension.left_buffer + this.dimension.game_border + bx, by, r, outline);
    }

    drawBlock(ctx, def, bx, by, r, outline=false){
        // rotate block array
        var block = this.rotateArray(def, r);;
        var width = def.shape[0].length;
        var height = def.shape.length;
        var color = def.color;

        for (var y=0; y<height; y++){
            for (var x=0; x<width; x++){
                if (block[y][x] > 0){
                    this.drawChisledBrick(ctx,
                                          (bx + x),
                                          (by + y),
                                          this.dimension.square_size,
                                          color,
                                          y > 0                 ? block[y][x] == block[y-1][x] : false,
                                          x < block[0].length-1 ? block[y][x] == block[y][x+1] : false,
                                          y < block.length-1    ? block[y][x] == block[y+1][x] : false,
                                          x > 0                 ? block[y][x] == block[y][x-1] : false,
                                          outline,
                                         )
                } else if (block[y][x] == -2) {
                    // Draw background where empty blocks are
                    this.ctx.fillStyle = this.colors.black;
                    this.ctx.fillRect((bx + x) * this.dimension.square_size,
                                      (by + y) * this.dimension.square_size,
                                      this.dimension.square_size,
                                      this.dimension.square_size
                                     );
                }
            }
        }

    }

    hexToRGB(s) {
        return {
            r: parseInt(s.slice(1,3), 16),
            g: parseInt(s.slice(3,5), 16),
            b: parseInt(s.slice(5,7), 16),
        };
    }

    shiftColor(c, d){
        var r = c.r - d;
        var g = c.g - d;
        var b = c.b - d;

        r = r < 0 ? 0 : r;
        g = g < 0 ? 0 : g;
        b = b < 0 ? 0 : b;
        r = r > 0xff ? 0xff : r;
        g = g > 0xff ? 0xff : g;
        b = b > 0xff ? 0xff : b;

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    drawChisledBrick(ctx, x, y, l, c, n, e, s, w, outline=false){
        // Define Chisledness
        var edge = Math.floor(this.dimension.square_size * this.dimension.block_chisled_ratio);
        if (outline == true)
            edge = Math.floor(this.dimension.square_size * this.dimension.block_outline_ratio);
        if (edge < this.dimension.block_min_edge_size)
            edge = this.dimension.block_min_edge_size;

        // Adjust x, y coordinates
        x *= l;
        y *= l;

        // Define colors
        var c_lightest = this.shiftColor(c, -0x64);;
        var c_light    = this.shiftColor(c, -0x32);
        var c_normal   = this.shiftColor(c, 0x0);
        var c_dark     = this.shiftColor(c, 0x32);
        var c_darkest  = this.shiftColor(c, 0x64);
        if (outline == true){
            var c_lightest = this.shiftColor(c, 0x0);
            var c_light    = this.shiftColor(c, 0x0);
            var c_normal   = "rgba(0,0,0,0)";
            var c_dark     = this.shiftColor(c, 0x0);
            var c_darkest  = this.shiftColor(c, 0x0);
        }

        // Fill in background color
        ctx.fillStyle = c_normal;
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
            ctx.fillStyle = c_lightest;
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
            ctx.fillStyle = c_light;
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
            ctx.fillStyle = c_dark;
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
            ctx.fillStyle = c_darkest;
            ctx.fill();
        }

        // NW Corner
        if (n == true && w == true){
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x+edge, y);
            ctx.lineTo(x+edge, y+edge);
            ctx.fillStyle = c_light;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y+edge);
            ctx.lineTo(x+edge, y+edge);
            ctx.fillStyle = c_lightest;
            ctx.fill();
        }

        // NE Corner
        if (n == true && e == true){
            ctx.beginPath();
            ctx.moveTo(x+l, y);
            ctx.lineTo(x+l-edge, y);
            ctx.lineTo(x+l-edge, y+edge);
            ctx.fillStyle = c_dark;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x+l, y);
            ctx.lineTo(x+l, y+edge);
            ctx.lineTo(x+l-edge, y+edge);
            ctx.fillStyle = c_lightest;
            ctx.fill();
        }

        // SW Corner
        if (s == true && w == true){
            ctx.beginPath();
            ctx.moveTo(x, y+l);
            ctx.lineTo(x+edge, y+l);
            ctx.lineTo(x+edge, y+l-edge);
            ctx.fillStyle = c_light;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y+l);
            ctx.lineTo(x, y+l-edge);
            ctx.lineTo(x+edge, y+l-edge);
            ctx.fillStyle = c_darkest;
            ctx.fill();
        }

        // SE Corner
        if (s == true && e == true){
            ctx.beginPath();
            ctx.moveTo(x+l, y+l);
            ctx.lineTo(x+l-edge, y+l);
            ctx.lineTo(x+l-edge, y+l-edge);
            ctx.fillStyle = c_dark;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x+l, y+l);
            ctx.lineTo(x+l, y+l-edge);
            ctx.lineTo(x+l-edge, y+l-edge);
            ctx.fillStyle = c_darkest;
            ctx.fill();
        }
    }

    font_sizer(pixels, font){
        return (pixels * this.dimension.em) + "px " + font;
    }

    text_overlay(string_array){
        // Black out playing field
        this.ctx.fillStyle = "rgba(0,0,0,.7)";
        this.ctx.fillRect((this.dimension.left_buffer + this.dimension.game_border) * this.dimension.square_size,
                          0,
                          this.dimension.game_width * this.dimension.square_size,
                          (this.dimension.top_buffer + this.dimension.game_height) * this.dimension.square_size);

        // Print desired message in upper section
        for (var string of string_array){
            this.ctx.fillStyle = this.colors[string.color];
            this.ctx.font      = this.font_sizer(string.size, string.font);
            this.ctx.textAlign = string.align;
            var y              = string.y * this.dimension.em;
            if (string.y == null) y = this.canvas.height/2;
            var x              = string.x * this.dimension.em;
            if (string.x == null) x = this.canvas.width/2;
            this.ctx.fillText(string.string, x, y);
        }

        // Print high scores in remaining portion
        var high_scores = localStorage.getItem("ntris");
        var high_score_size = 14;
        var high_score_spacing = this.dimension.em * 22;

        // Convert from JSON
        if (high_scores){
            high_scores = JSON.parse(high_scores);
            var y = this.canvas.height/2;

            // Header
            this.ctx.font = this.font_sizer(18, "SegmentedAlpha");
            this.ctx.textAlign = "center";
            this.ctx.fillText("High Scores", this.canvas.width/2, y);
            y += high_score_spacing;

            var scores_printed = 0;
            for(var i=0; i<high_scores.length; i++){
                var score = high_scores[i];

                if (score.extra != this.settings.useExtraPieces)
                    continue;

                if (scores_printed == 10)
                    break;

                scores_printed += 1;

                // Name
                this.ctx.font = this.font_sizer(high_score_size, "SegmentedAlpha");
                this.ctx.textAlign = "left";
                this.ctx.fillText(score.name, (this.dimension.left_buffer + 2) * this.dimension.square_size, y);

                // Score
                this.ctx.font = this.font_sizer(high_score_size, "Segmented");
                this.ctx.textAlign = "right";
                this.ctx.fillText(score.score, (this.dimension.left_buffer + this.dimension.game_width - 1) * this.dimension.square_size, y);

                // Level
                this.ctx.font = this.font_sizer(high_score_size, "Segmented");
                this.ctx.textAlign = "right";
                this.ctx.fillText(score.level, (this.dimension.left_buffer + this.dimension.game_width) * this.dimension.square_size, y);

                y += high_score_spacing;
            }
        }
    }

    resizeGame(){
        var windowWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        var windowHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        var maxWindowSize = Math.min(windowHeight, windowWidth);

        var gameWidth = this.dimension.left_buffer + this.dimension.right_buffer + this.dimension.game_width + (this.dimension.game_border * 2);
        var gameHeight = this.dimension.top_buffer + this.dimension.game_height + this.dimension.game_border;
        var minGameArea = Math.max(gameWidth, gameHeight);

        // Set new square size
        this.dimension.square_size = Math.floor(maxWindowSize / minGameArea);
        if (this.dimension.square_size < this.dimension.square_min_size)
            this.dimension.square_size = this.dimension.square_min_size;

        // Set new font scaling
        this.dimension.em = this.dimension.square_size / this.dimension.starting_square_size;

        // Redraw everything
        this.resizeCanvas(gameWidth, gameHeight);
        this.redraw();
    }

    firstRun(){
        this.state.game_overlay = this.overlays.firstrun;
        this.resizeGame();
    }

}

class button {
    constructor(element, can_repeat, action) {
        this.action = action;
        this.element = element;
        this.can_repeat = can_repeat;

        this.intervalId;

        this.element.addEventListener("mousedown",  (event) => this.repeat(event) );
        this.element.addEventListener("mouseup",    (event) => clearInterval(this.intervalId) );
        this.element.addEventListener("mouseout",   (event) => clearInterval(this.intervalId) );

        this.element.addEventListener("touchstart", (event) => this.repeat(event) );
        this.element.addEventListener("touchend",   (event) => clearInterval(this.intervalId) );
    }

    repeat(e) {
        e.preventDefault();
        //navigator.vibrate(200);

        if (this.can_repeat)
            this.intervalId = setInterval(e => this.do_action(), 70);
        else
            this.do_action();
    }

    do_action(){
        this.action()
    }
}

let tetris_instance;

window.onload = function () {
    const canvas = document.getElementById("canvas");

    tetris_instance = new tetris(canvas);

    window.onresize = function () {
        tetris_instance.resizeGame();
    }

    canvas.onclick = function () {
        tetris_instance.start();
    }

    // Keyboard listeners
    //document.addEventListener('keyup', function(e) {});
    document.addEventListener('keydown', function(e) {
        tetris_instance.user_move(e);
    });

    // Redraw once fonts have loaded!
    document.fonts.ready.then(function () {
        tetris_instance.redraw();
    });

    // Gamepad Button Definitions
    const svg = document.getElementById("controller");
    const svg_document = svg.contentDocument;

    let up_button     = new button(svg_document.getElementById("up_button"),     true,  () => tetris_instance.toggleGhostMode());
    let down_button   = new button(svg_document.getElementById("down_button"),   true,  () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.down));
    let left_button   = new button(svg_document.getElementById("left_button"),   true,  () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.left));
    let right_button  = new button(svg_document.getElementById("right_button"),  true,  () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.right))
    let cw_button     = new button(svg_document.getElementById("cw_button"),     false, () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.cw));
    let ccw_button    = new button(svg_document.getElementById("ccw_button"),    false, () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.ccw));
    let drop_button   = new button(svg_document.getElementById("drop_button"),   false, () => tetris_instance.onscreen_gamepad_move(tetris_instance.direction.drop));
    let start_button  = new button(svg_document.getElementById("start_button"),  false, () => tetris_instance.start(focus=false));
    let select_button = new button(svg_document.getElementById("select_button"), false, () => tetris_instance.select_button());

    tetris_instance.firstRun();
}
