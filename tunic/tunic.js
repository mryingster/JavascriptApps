class coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class segment {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

class emerald {
    constructor(parent, sibling, interactive, unselected_color, inside_color, outside_color, invalid_color, wordline_color, size, value, show_phoneme, show_wordline) {
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("emerald");
        this.ctx = this.canvas.getContext("2d");

        if (sibling === null)
            parent.appendChild(this.canvas);
        else    
            parent.children[sibling].after(this.canvas);

        this.size = size;
        this.initial_value = value;
        this.value;
        this.inner_value;
        this.outer_value;
        this.set_value(value);

        this.selected = false;
        this.linewidth = size/10;
        this.margin = this.linewidth + 3;

        this.unselected_color = unselected_color;
        this.selected_inside_color = inside_color;
        this.selected_outside_color = outside_color;
        this.invalid_color = invalid_color;
        this.wordline_color = wordline_color;

        this.interactive = interactive;
        this.phoneme = show_phoneme;
        this.wordline = show_wordline;

        this.width = this.size;
        this.height = this.size * 2;

        this.canvas.width = this.width + this.margin * 2;
        this.canvas.height = this.height * 1.2 + this.margin * 2;

        this.segments = [];
        this.circledo = {};
        this.word_segment = null;
        this.change_size();

        this.highlighted_segment = null;
        this.mouse_down = false;

        // Add listeners
        this.canvas.addEventListener(
            "touchstart",
            () => this.touch_start(event),
            false
        );
        this.canvas.addEventListener(
            "mousedown",
            () => this.mouse_start(event),
            false
        );
        this.canvas.addEventListener(
            "mousemove",
            () => this.mouse_move(event),
            false
        );
        this.canvas.addEventListener(
            "mouseup",
            () => this.mouse_up(event),
            false
        );
        this.canvas.addEventListener(
            "mouseleave",
            () => this.mouse_leave(event),
            false
        );

        this.update();
    }

    change_size() {
        this.segments = [];

        // Outer Segments clockwise from bottom, right

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 2, (this.height / 6) * 5),
                new coord((this.width / 2) * 1, (this.height / 6) * 6)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 6),
                new coord((this.width / 2) * 0, (this.height / 6) * 5)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 0, (this.height / 6) * 5),
                new coord((this.width / 2) * 0, (this.height / 6) * 1)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 0, (this.height / 6) * 1),
                new coord((this.width / 2) * 1, (this.height / 6) * 0)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 0),
                new coord((this.width / 2) * 2, (this.height / 6) * 1)
            )
        );

        // Inner segments clockwise from bottom right

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 4),
                new coord((this.width / 2) * 2, (this.height / 6) * 5)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 4),
                new coord((this.width / 2) * 1, (this.height / 6) * 6)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 4),
                new coord((this.width / 2) * 0, (this.height / 6) * 5)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 2),
                new coord((this.width / 2) * 0, (this.height / 6) * 1)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 2),
                new coord((this.width / 2) * 1, (this.height / 6) * 0)
            )
        );

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 2),
                new coord((this.width / 2) * 2, (this.height / 6) * 1)
            )
        );

        // Middle Segment

        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 2),
                new coord((this.width / 2) * 1, (this.height / 6) * 4)
            )
        );

        // Circledo segment (not drawn, but used for indexing)
        this.segments.push(
            new segment(
                new coord((this.width / 2) * 1, (this.height / 6) * 6),
                new coord((this.width / 2) * 1, (this.height / 6) * 7)
            )
        );

        // Word Segment

        this.word_segment = new segment(
            new coord((this.width / 2) * 0, (this.height / 6) * 3),
            new coord((this.width / 2) * 2, (this.height / 6) * 3)
        );

        // Circledo

        this.circledo = {
            center: new coord((this.width / 2) * 1, (this.height / 6) * 6.5),
            radius: this.height / 6 / 2,
        };
    }

    reset() {
        this.value = this.initial_value;
        this.selected = false;
        this.update();
    }

    set_value(v) {
        this.value = v;
        this.inner_value = v & MASK_INNER;
        this.outer_value = v & MASK_OUTER;

    }

    // Input Functions
    getTouchPosition(overlay, event) {
        if (!e) var e = event;

        var x = null;
        var y = null;

        if (e.touches) {
            if (e.touches.length == 1) {
                // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                x = touch.pageX - touch.target.getBoundingClientRect().left;
                y = touch.pageY - touch.target.getBoundingClientRect().top;
            }
        }

        return new coord(x, y);
    }

    touch_start(e) {
        if (this.interactive != true) return;
        e.preventDefault();
        let pos = this.getTouchPosition(this.canvas, e);
        this.toggle_segment(pos);
    }

    getCursorPosition(overlay, event) {
        // Determine where clicked
        const rect = overlay.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return new coord(x - this.margin , y - this.margin);
    }

    mouse_start(e) {
        if (this.interactive != true) return;
        e.preventDefault();
        this.mouse_down = true;
        this.update();
    }

    mouse_move(e) {
        if (this.interactive != true) return;
        e.preventDefault();
        let pos = this.getCursorPosition(this.canvas, e);
        this.highlighted_segment = this.closest_segment(pos);
        this.update();
    }

    mouse_up(e) {
        if (!this.interactive) return;
        if (!this.mouse_down) return
        e.preventDefault();
        this.mouse_down = false;
        let pos = this.getCursorPosition(this.canvas, e);
        this.toggle_segment(this.closest_segment(pos));
        this.update();
    }

    mouse_leave(e) {
        e.preventDefault();
        this.highlighted_segment = null;
        this.mouse_down = false;
        this.update();
    }

    toggle_segment(i) {
        if (i === null) return;
        this.set_value(this.value ^ 1 << i);
        this.update();
    }

    closest_segment(p) {
        let closest = null;
        let distance = 999;

        for (let i = 0; i < this.segments.length; i++) {
            // Find the radius from the center of the line
            let mid_line = this.find_line_midpoint(this.segments[i]);
            let radial_distance = this.distance_from_point(mid_line, p);

            // Find the distance tangentially from line
            let tangent_distance = this.distance_from_line(this.segments[i], p);

            // Find closest tanget within radial bounds
            if (tangent_distance < distance && radial_distance < 30) {
                distance = tangent_distance;
                closest = i
            }
        }

        return closest
    }

    find_line_midpoint(l) {
            return new coord((l.a.x + l.b.x) / 2, (l.a.y + l.b.y) / 2);
    }

    distance_from_line(segment, p) {
        return ((Math.abs((segment.b.y - segment.a.y) * p.x -
                          (segment.b.x - segment.a.x) * p.y +
                          segment.b.x * segment.a.y -
                          segment.b.y * segment.a.x)) /
                (Math.pow((Math.pow(segment.b.y - segment.a.y, 2) +
                           Math.pow(segment.b.x - segment.a.x, 2)),
                          0.5)));
    }

    distance_from_point(a, b) {
        return Math.abs(Math.hypot(a.x - b.x, a.y - b.y));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw_circle(c, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.linewidth;
        this.ctx.beginPath();
        this.ctx.arc(c.center.x, c.center.y, c.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    draw_background() {
        this.clear();
        for (let [i, segment] of this.segments.entries()) {
            if (i + 1 == this.segments.length) break; // Skip the last segment which is the circledo
            this.draw_line(segment, this.unselected_color);
        }

        this.draw_circle(
            this.circledo,
            this.unselected_color
        );
    }

    draw_line(segment, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.linewidth;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(segment.a.x, segment.a.y);
        this.ctx.lineTo(segment.b.x, segment.b.y);
        this.ctx.stroke();
    }

    update() {
        this.clear();

        this.ctx.save();
        this.ctx.translate(this.margin, this.margin);

        this.draw_background();

        // Decide if character is valid or not
        let inner_valid = false;
        if (valid_characters.includes(this.inner_value))
            inner_valid = true;

        let outer_valid = false;
        if (valid_characters.includes(this.outer_value))
            outer_valid = true;

        // Draw highlighted segments
        let i = 0;
        while (this.value >> i > 0) {
            if ((this.value >> i) & (0x1 == 1)) {
                // If we encounter the circledo, do something special
                if (i + 1 == this.segments.length) {
                    this.draw_circle(
                        this.circledo,
                        this.wordline_color,
                    );
                    break;
                }

                let color = this.selected_outside_color;
                if (!outer_valid)
                    color = this.invalid_color;

                if ((1 << i) >= MASK_OUTER) {
                    color = this.selected_inside_color;
                    if (!inner_valid)
                        color = this.invalid_color;
                }

                this.draw_line(this.segments[i], color);
            }
            i++;
        }

        // Highlight where mouse is
        if (this.highlighted_segment !== null) {
            let highlight_color = "rgba(0,0,0,.1)";
            if (this.mouse_down == true)
                highlight_color = "#008800";

            if (this.highlighted_segment + 1 == this.segments.length) {
                this.draw_circle(
                    this.circledo,
                    highlight_color
                );
            }
            else
                this.draw_line(this.segments[this.highlighted_segment], highlight_color);
        }

        // Clear the word space and add line
        if (this.wordline) {
            this.ctx.clearRect(
                -this.margin,
                this.height / 2,
                this.canvas.width,
                this.height / 6
            );
            this.draw_line(this.word_segment, this.wordline_color);
        };

        // Add phonemes in empty space
        if (this.phoneme) {
            this.ctx.font = this.height / 10 + "px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = this.selected_inside_color;
            this.ctx.fillText(
                get_phoneme_string_from_glyph(this.value),
                this.width / 2,
                (this.height / 6) * 3.75
            );
        }

        this.ctx.restore();
    }
}

let emeralds   = [];
let emerald_selection = 0;
let phrases    = [];
let selected_phrase = 0;
let words      = [];
let characters = {};
let word_tree  = {};

let valid_characters = [0, 1, 2, 3, 5, 6, 7, 8, 12, 13, 15, 16, 23, 24, 27, 28, 29, 30, 31, 160, 416, 1280, 2368, 2592, 2624, 2656, 2688, 2720, 2784, 2848, 2880, 2912, 3136, 3168, 3264, 3392, 3552, 3616, 3648, 3776, 3904, 4000, 4064];

const debug = true;

const MASK_INNER       = 4064;
const MASK_OUTER       = 31;
const MASK_LINES       = 4095;
const MASK_CIRCLE      = 4096;
const GLYPH_SIZE_SMALL = 30;
const GLYPH_SIZE_LARGE = 100;

const COLOR_TRANSPARENT  = "rgba(0, 0, 0, 0)"
const COLOR_LIGHT_GREY   = "rgba(230, 230, 230, 1)";
const COLOR_BRIGHT_GREEN = "rgba(0, 200, 0, 1)"
const COLOR_DARK_GREEN   = "rgba(0, 150, 0, 1)";
const COLOR_BROWN        = "rgba(90, 60, 40, 1)";
const COLOR_DARK_RED     = "rgba(200, 0, 0, 1)";

// Add main emerald
function create_emerald(value=0, parent, sibling_index) {
    return new emerald(
        parent,
        sibling_index,
        true,                       // Interactive
        COLOR_LIGHT_GREY,           // Unlit Color
        COLOR_BRIGHT_GREEN,         // Lit Color
        COLOR_DARK_GREEN,           // Lit Color
        COLOR_DARK_RED,             // Invalid Color
        COLOR_BROWN,                // Word Line Color
        GLYPH_SIZE_LARGE,           // Horizontal Size
        value,                      // Initial Value
        true,                       // Enable Phoneme Text
        true,                       // Enable Wordline
    );
}

function add_emerald(value=0) {
    if (typeof value === "string") {
        add_input(value, true);
        return;
    }

    emeralds.push(create_emerald(value, document.getElementById("emeralds"), null));

    emerald_selection++;
    reset_cursor_selection();

    return;
}

function insert_emerald(value=0) {
    if (emerald_selection < 0) {
        add_emerald(value);
        return
    }

    if (typeof value === "string") {
        insert_input(value, true);
        return;
    }

    // Insert after current selection
    let emerald = create_emerald(value, document.getElementById("emeralds"), emerald_selection);
    emeralds.splice(emerald_selection + 1, 0, emerald);

    emerald_selection++;
    reset_cursor_selection();

    return;    
}

function quick_enter_glyph(n) {
    let last_emerald = emeralds[emeralds.length - 1];

    // Check if last entry is a glyph, and if not, add a glyph!
    if (typeof last_emerald.value == "string") {
        add_emerald(Number(n));
        return;
    }

    // Check if this is outer value or inner value and if last
    // emerald already has inner/outer defined, make new emerald
    if (((n & MASK_OUTER) == n && (last_emerald.value & MASK_OUTER) == 0) ||
        ((n & MASK_INNER) == n && (last_emerald.value & MASK_INNER) == 0)) {
        last_emerald.value += n;
        last_emerald.update();
        return;
    }

    // Add a new one!
    add_emerald(Number(n));

    return;
}

function delete_selected_character() {
    let last_character = emeralds[emerald_selection];
    if (last_character.canvas == undefined)
        document.getElementById("emeralds").removeChild(last_character);
    else
        document.getElementById("emeralds").removeChild(last_character.canvas);

    emeralds.splice(emerald_selection, 1);
    move_cursor_left();
    reset_cursor_selection();
}

function create_input(v="", editable=true) {
    let input = document.createElement("span");
    if (editable == true)
        input.contentEditable = true;
    input.classList.add("english_input");
    input.placeholder = "String";
    if (v != "") {
        input.innerHTML = v;
        input.value = v;
    }
    input.oninput = () => { input.value = input.innerHTML; };

    return input;
}

function add_input(v="", editable=true) {
    let input = create_input(v, editable);
    document.getElementById("emeralds").appendChild(input);
    emeralds.push(input);

    emerald_selection++;
    reset_cursor_selection();
    return;
}

function insert_input(v="", editable=true) {
    if (emerald_selection < 0) {
        add_input(v, editable);
        return
    }

    let input = create_input(v, editable);
    document.getElementById("emeralds").children[emerald_selection].after(input); 
    emeralds.splice(emerald_selection + 1, 0, input);

    emeralds[emeralds.length - 1].focus();

    emerald_selection++;
    reset_cursor_selection();
    return;
}

function add_space() {
    add_input("&nbsp;", false);
}

function insert_space() {
    insert_input("&nbsp;", false);
}

function clear_div(div) {
    document.getElementById(div).innerHTML = "";
}

function reset_emeralds() {
    clear_emeralds();
    add_emerald();
}

function clear_emeralds() {
    clear_div("emeralds");
    emeralds = [];
    emerald_selection = -1;
}

function move_cursor_left() {
    if (emeralds.length === 0)
        emerald_selection = -1;
    else
        emerald_selection = Math.max(0, emerald_selection - 1);
    reset_cursor_selection();
}

function move_cursor_right() {
    if (emeralds.length === 0)
        emerald_selection = -1;
    else
        emerald_selection = Math.min(emeralds.length - 1, emerald_selection + 1);
    reset_cursor_selection();
}

function reset_cursor_selection() {
    let emeralds = document.getElementById("emeralds");

    var children = emeralds.children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        child.classList.remove("selected");
        if (i === emerald_selection)
            child.classList.add("selected");
    }
}

function start_add_phrase() {
    document.getElementById("word_builder").classList.remove("hidden");
    document.getElementById("build_controls").classList.remove("hidden");
    document.getElementById("edit_controls").classList.add("hidden");
    document.getElementById("start_add_phrase").disabled = true;
    document.getElementById("comment_input").value = "";
    clear_emeralds();
    add_emerald();
}

function cancel_add_phrase() {
    document.getElementById("word_builder").classList.add("hidden");
    document.getElementById("build_controls").classList.add("hidden");
    document.getElementById("start_add_phrase").disabled = false;
}

function delete_phrase(i) {
    cancel_add_phrase();
    phrases.splice(i, 1);
    populate_phrases_selection();
    populate_phrases_characters();
}

function add_phrase(i=-1) {
    let new_phrase = {
        comment: "",
        characters: [],
    };

    // Create new phrase from phrase!
    for (let e of emeralds) {
        new_phrase.characters.push(e.value);
    }

    // Get the comment
    new_phrase.comment = document.getElementById("comment_input").value;

    // If index is -1, then this is a new phrase!
    if (i === -1)
        phrases.push(new_phrase);
    else
        phrases[i] = new_phrase;

    // Clear out our characters for new words
    clear_emeralds();
    document.getElementById("word_builder").classList.add("hidden");
    document.getElementById("build_controls").classList.add("hidden");
    document.getElementById("start_add_phrase").disabled = false;

    // Update words and characters
    add_words_from_phrase(new_phrase);
    add_characters_from_words();
    populate_phrases_selection();
    populate_phrases_characters();
}

function get_phoneme_string_from_glyph(value) {
    let phonemes =  get_phonemes_from_glyph(value);
    let string = "";
    for (let [i, phoneme] of phonemes.entries()) {
        string += phoneme.text;
        if (i < phonemes.length - 1)
            string += "-";
    }
    return string;
}

function get_phonemes_from_glyph(g) {
    let inner_meaning = "?"
    let inner_glyph = g & MASK_INNER;
    let outer_meaning = "?"
    let outer_glyph = g & MASK_OUTER;

    let meaning = [];

    if (inner_glyph > 0)
        if (characters[inner_glyph] != undefined)
            meaning.push({
                "text": characters[inner_glyph],
                "value": inner_glyph
            });

    if (outer_glyph > 0)
        if (characters[outer_glyph] != undefined)
            meaning.push({
                "text": characters[outer_glyph],
                "value": outer_glyph
            });

    if ((g&MASK_CIRCLE) === MASK_CIRCLE) {
        meaning.reverse();
    }

    return meaning;
}

function add_words_from_phrase(new_phrase) {
    // Create new word from characters
    let new_word = [];
    for (let character of new_phrase.characters) {
        if (character === " ") {
            words.push(new_word);
            new_word = [];
            continue;
        }
        new_word.push(character);
    }
    if (new_word.length > 0)
        words.push(new_word);
}

function add_characters_from_words() {
    // Update our unique characters
    for (let word of words) {
        for (let full_character of word) {
            for (let mask of [MASK_INNER, MASK_OUTER]) {
                let character = full_character & mask;
                if (characters[character] === undefined)
                    characters[character] = "?";
            }
        }
    }
}

function populate_phrases_selection() {
    let select = document.getElementById("phrase_select");
    select.innerHTML = "";
    select.onchange = () => { populate_phrases(select.value) };

    for (let index=0; index < phrases.length; index++) {
        let option = document.createElement("option");
        option.innerHTML = phrases[index].comment;
        option.value = index;
        select.appendChild(option);
    }

    select.value = Math.min(selected_phrase, phrases.length -1 );
}

function lookup_word_meaning(word) {
    let path = word_tree;
    for (let i=0; i<word.length; i++) {
        let character = word[i];
        if (!(character in path))
            return "??";
        path = path[character];
        if (i == word.length - 1 && "word" in path)
            return path['word']
    }

    return "??";
}

function update_word_meaning(word, meaning) {
    let path = word_tree;
    for (let n=0; n<word.length; n++){
        let character = word[n];
        if (!(character in path)){
            path[character] = {};
        }
        path = path[character];
        if (n == word.length -1){
            path['word'] = meaning;
        }
    }

    populate_phrases_characters();
}

function create_word_entry(word) {
    let word_entry = document.createElement("span");
    word_entry.contentEditable = true;
    word_entry.classList.add("english_input");
    word_entry.classList.add("word_input");
    word_entry.word = word;
    word_entry.onblur = () => { update_word_meaning(word_entry.word, word_entry.innerHTML); };
    word_entry.innerHTML = lookup_word_meaning(word);

    return word_entry;
}

function populate_phrases(index=-1) {
    if (index == -1)
        index = selected_phrase;

    index = Number(index);
    if (index < 0) index = 0;
    if (index > phrases.length - 1) index = phrases.length - 1;
    selected_phrase = index;

    clear_div("phrases");

    let phrase = phrases[index];

    let phrase_div = document.createElement("div");
    phrase_div.classList.add("phrase")

    // Create header with edit button and comment
    let phrase_header_div = document.createElement("div");

    let edit = document.createElement("button");
    edit.innerHTML = "✍️";
    edit.classList.add("edit_button")
    edit.onclick = () => load_edit_phrase(phrase, index);
    phrase_header_div.appendChild(edit);

    if (phrase.comment != "") {
        let comment = document.createElement("div");
        comment.innerHTML = phrase.comment;
        comment.classList.add("comment");
        phrase_header_div.appendChild(comment);
    }

    phrase_div.appendChild(phrase_header_div);

    // Create list of characters that make up the phrase
    let word_div = null;
    let word = [];
    for (let character of phrase.characters) {
        if (typeof character === "string") {
            if (word_div != null) {
                let word_entry = create_word_entry(word);
                word_div.appendChild(word_entry);

                phrase_div.appendChild(word_div);
                word_div = null;
                word = [];
            }

            // Strings and Spaces!
            let spacer = document.createElement("div");
            spacer.classList.add("spacer");
            spacer.innerHTML = character;
            phrase_div.appendChild(spacer)

        } else {
            if (word_div == null) {
                word_div = document.createElement("div");
                word_div.classList.add("word_wrapper");
            }

            word.push(character);

            // Glyphs!
            let character_div = document.createElement("div");
            character_div.classList.add("glyph_and_translation");
            new emerald(
                character_div,
                null,
                false,
                COLOR_TRANSPARENT,          // Unlit Color
                COLOR_BRIGHT_GREEN,         // Lit Color
                COLOR_DARK_GREEN,           // Lit Color
                COLOR_DARK_RED,             // Invalid Color
                COLOR_BROWN,
                GLYPH_SIZE_SMALL,
                character,
                false,
                true,
            );

            let text = document.createElement("span");
            text.classList.add("translation");
            for (let [i, phoneme] of get_phonemes_from_glyph(character).entries()) {
                // Add a hyphen between phonemes
                if (i>0) {
                    let hyphen = document.createElement("span");
                    hyphen.innerHTML = "-";
                    text.appendChild(hyphen);
                }

                // Add phoneme
                let sub_text = document.createElement("span");
                sub_text.innerHTML = phoneme.text;
                sub_text.onclick = () => { document.getElementById("character_"+phoneme.value).focus() };
                sub_text.classList.add("clickable");
                text.appendChild(sub_text);
            }
            character_div.appendChild(text);
            word_div.appendChild(character_div);
        }
    }
    if (word_div != null) {
        let word_entry = create_word_entry(word);
        word_div.appendChild(word_entry);

        phrase_div.appendChild(word_div);
        word_div = null;
        word = [];
    }

    document.getElementById("phrases").appendChild(phrase_div);
}

function load_edit_phrase(phrase, index) {
    clear_emeralds();
    document.getElementById("word_builder").classList.remove("hidden");
    document.getElementById("build_controls").classList.add("hidden");
    document.getElementById("edit_controls").classList.remove("hidden");

    document.getElementById("update_phrase_button").onclick = () => { add_phrase(index) };
    document.getElementById("delete_phrase_button").onclick = () => { delete_phrase(index) };

    for (let word of phrase.characters) {
        add_emerald(word);
    }

    document.getElementById("comment_input").value = phrase.comment;
}

function cancel_update_phrase() {
    clear_emeralds();
    document.getElementById("word_builder").classList.add("hidden");
    document.getElementById("build_controls").classList.add("hidden");
    document.getElementById("edit_controls").classList.add("hidden");
}

function populate_characters() {
    clear_div("characters_inner");
    clear_div("characters_outer");
    clear_div("characters_other");

    for (let character in characters) {
        let character_div = document.createElement("div");
        character_div.classList.add("character")
        let this_emerald = new emerald(
            character_div,
            null,
            false,
            COLOR_TRANSPARENT,          // Unlit Color
            COLOR_BRIGHT_GREEN,         // Lit Color
            COLOR_DARK_GREEN,           // Lit Color
            COLOR_DARK_RED,             // Invalid Color
            COLOR_BROWN,
            GLYPH_SIZE_SMALL,
            character,
            false,
            character == 0,
        );

        this_emerald.canvas.onclick = () => { quick_enter_glyph(Number(this_emerald.value)) };
        this_emerald.canvas.classList.add("clickable");

        if (debug)
            this_emerald.canvas.title = character;

        let input = document.createElement("input");
        input.value = characters[character];
        input.classList.add("define_character_input");
        input.id = "character_"+character;
        input.onchange = () => { characters[character] = input.value; populate_phrases_characters(); };
        character_div.appendChild(input);

        if (character == 0)
            document.getElementById("characters_other").appendChild(character_div);
        else if (character > MASK_OUTER)
            document.getElementById("characters_inner").appendChild(character_div);
        else
            document.getElementById("characters_outer").appendChild(character_div);
    }
}

function get_selected_phrase() {
    selected_phrase = document.getElementById("phrase_select").value;
    console.log(selected_phrase);
    return selected_phrase;
}

function populate_phrases_characters() {
    populate_phrases(selected_phrase);
    populate_characters();
    save_to_local_storage();
}

function load_external_phrase(p) {
    phrases.push(p);
    add_words_from_phrase(p);
    add_characters_from_words();
    populate_phrases_selection();
    populate_phrases_characters();
}

function export_json() {
    const filename = 'tunic_data.json';
    const jsonStr = JSON.stringify ({
        "phrases" : phrases,
        "characters" : characters,
        "words" : word_tree,
    }, null, "  ");

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function save_to_local_storage() {
    localStorage.setItem("tunic",
                         JSON.stringify ({
                             "phrases" : phrases,
                             "characters" : characters,
                             "words" : word_tree,
                         })
                        );
}

function load_from_local_storage() {
    let saved_data = localStorage.getItem("tunic");
    let parsed_data = null;

    if (saved_data)
        parsed_data = JSON.parse(saved_data);

    for (let phrase of parsed_data["phrases"]) {
        load_external_phrase(phrase);
    }

    characters = parsed_data.characters;

    if ("words" in parsed_data)
        word_tree = parsed_data.words;

    populate_phrases_characters();
}

function clear_local_data() {
    localStorage.setItem("tunic", "{}");
}

function reset() {
    clear_div("characters_inner");
    clear_div("characters_outer");
    clear_div("characters_other");
    clear_div("phrases");

    clear_emeralds();

    phrases = [];
    words = [];
    characters = {};
    word_tree = {};

    clear_local_data();
}

function first_load() {
    // Setup buttons
    document.getElementById("insert_emerald").onclick = () => { insert_emerald(); };
    document.getElementById("insert_space").onclick = () => { insert_space(); };
    document.getElementById("insert_input").onclick = () => { insert_input(); };
    document.getElementById("delete").onclick = () => { delete_selected_character(); };
    document.getElementById("move_cursor_left").onclick = () => { move_cursor_left(); };
    document.getElementById("move_cursor_right").onclick = () => { move_cursor_right(); };

    document.getElementById("cancel_add_phrase").onclick = () => { cancel_add_phrase(); };
    document.getElementById("reset_emeralds").onclick = () => { reset_emeralds(); };
    document.getElementById("add_phrase").onclick = () => { add_phrase(); };

    document.getElementById("cancel_update_phrase").onclick = () => { cancel_update_phrase(); };
    document.getElementById("delete_phrase_button").onclick = () => { delete_phrase(); };
    document.getElementById("update_phrase_button").onclick = () => { add_phrase(); };

    document.getElementById("start_add_phrase").onclick = () => { start_add_phrase(); };

    document.getElementById("load_manual").onclick = () => { add_manual(); };
    document.getElementById("load_known_characters").onclick = () => { add_phonemes(false); };
    document.getElementById("load_phonemes").onclick = () => { add_phonemes(true); };
    document.getElementById("load_words").onclick = () => { add_words(); };
    document.getElementById("reset").onclick = () => { reset(); };
    document.getElementById("export").onclick = () => { export_json(); };

    // Load previous data
    load_from_local_storage();
}

window.onload = function () {
    first_load();
};
