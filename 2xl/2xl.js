let svg;
let mouth;
let eyes;
let rewind_timer;
let svg_document;
let progress;

let track_ids = ["button_track1", "button_track2", "button_track3", "button_track4"];
let track_target_ids = ["target_track1", "target_track2", "target_track3", "target_track4"];
let button_target_ids = ["target_play", "target_rewind", "target_stop"];

let state = {
    tape    : "",
    time    : 0,
    track   : 0,
    stopped : true,
    duration: 0,
};

let default_state = {
    tape    : "World of 2-XL",
    time    : 0,
    track   : 0,
    stopped : true,
    duration: 0,
};

let loaded = 0;

let my_audio = null;
let animation_request = null;
let max_rms_default = .30;
let max_rms = max_rms_default;

// Add our catalog of tapes!
let tapes = [
    "50s and 60s Nostalgia",
    "AYAOTD Tale of the Phantom Manor",
    "Adult Games and Puzzles",
    "African Safari",
    "All Time Top Topics",
    "Amazing Sport Feats",
    "Amazing World Records",
    "Amazing World of the Small",
    "Animal World",
    "Astronomy  2-XL in Space",
    "Batman Carnival Crime",
    "Batman Sizzling Scheme",
    "Believe This or Not",
    "Bet Your Life",
    "Careers And You",
    "Challenges of General Science",
    "Chaos in Jurassic Park",
    "Count On It",
    "Exercise with 2-XL",
    "Fairy Tale Quiz",
    "Fascinating Facts",
    "Food Facts And You",
    "Fun And Games",
    "Fun With Words",
    "Games and Puzzles Number 1",
    "Games and Puzzles",
    "General Information 2",
    "General Information III",
    "General Information Rev B",
    "General Information" ,
    "Geography And You",
    "Guinness World Records",
    "Incredible Sports Feats",
    "Interviews With Great People From History",
    "Jurassic Facts",
    "Letter Perfect",
    "MMPR Attack of the 100 Foot Teenagers",
    "Math and Number Games",
    "Mego Demo",
    "Metric System Education",
    "Monsters Myths And Legends",
    "Monsters Myths and Dinosaurs",
    "Music Maker",
    "Nature And You",
    "Oceans of Fun",
    "Pet Parade",
    "Planet Earth",
    "Pre-School Bed Time Stories",
    "Pre-School Facts and Fantasies",
    "Ripleys Believe It Or Not",
    "Robotrivia Tape 1",
    "Robotrivia Tape 2",
    "Robotstronomy Games One And Two",
    "Robotstronomy Games Three And Four",
    "Safety First",
    "Say Hello to Famous Folks",
    "Science Fiction 2 Rev B",
    "Science Fiction 2",
    "Science Fiction",
    "Spiderman For King and Country",
    "Sports 2",
    "Sports World",
    "Sports",
    "Stars And Planets",
    "Star Trek TNG Blinded by the Light",
    "Storyland 2XL and the Time Machine",
    "Storyland",
    "Storymaker",
    "Strange But Is It True",
    "Super Heroes and Comic Books Cavalcade",
    "Superman A New Hero In Town",
    "Superman Mayhem in Metropolis",
    "Surprise Package",
    "TV and Movie Challenges",
    "Tales If Wishes Were Hornets",
    "Talking Calculator and Number Game",
    "The Basics of ABCs",
    "Tid Bits and Funny Facts",
    "Traffic and Bicycle Safety",
    "Treasure Chest of Facts and Fun",
    "Trilex",
    "Trivia Time",
    "US Presidents and American History",
    "Voyage To Outer Space",
    "Who Said It",
    "Wonders of the World",
    "Word And Sound Games Tape 1",
    "Word and Sound Games Tape 2",
    "World of 2-XL",
    "World of Animals",
    "World of Science",
    "X-Men Deadly Games",
    "X-Men Ghosts That Haunt Us",
    "Test"
];

function input_down(e) {
    // Ignore inputs until all cassette files are loaded
    if (loaded < 4) return;

    if (button_target_ids.includes(e.target.id)) {
        e.preventDefault();
        press_button(e.target.id);
    }

    if (track_target_ids.includes(e.target.id)) {
        e.preventDefault();
        change_track(track_target_ids.indexOf(e.target.id));
    }
}

function input_up(e) {
}

function press_button(b) {
    // Reset visibility of all buttons
    svg_document.getElementById("button_play").classList.remove("pressed");
    svg_document.getElementById("button_rewind").classList.remove("pressed");
    svg_document.getElementById("button_stop").classList.remove("pressed");

    // Stop rewind timeout
    clearTimeout(rewind_timer);

    // Do action
    switch (b) {
    case "target_play":
        play();
        svg_document.getElementById("button_play").classList.add("pressed");
        break;
    case "target_rewind":
        rewind();
        svg_document.getElementById("button_rewind").classList.add("pressed");
        break;
    case null:
    case "target_stop":
        stop();
        svg_document.getElementById("button_stop").classList.add("pressed");
        break;
    }

    // Update URL bar so this spot can be shared
    update_url_bar(state);
}

function change_track(t) {
    // Reset visibility of all buttons
    for (let track_id of track_ids)
	svg_document.getElementById(track_id).classList.remove("pressed");

    // Do action
    state.track = t;
    my_audio.select_track(t);
    svg_document.getElementById(track_ids[t]).classList.add("pressed");

    // Update URL bar so this spot can be shared
    update_url_bar(state);
}

function play() {
    my_audio.play();
}

function rewind() {
    // Get current time for audio track 1
    let ts = my_audio.get_timestamp();

    // Set each track back a couple seconds
    state.time = Math.max(0, ts - 2);
    my_audio.seek(state.time);

    // Call this again in a few seconds unless we switch to play or hit 0
    if (state.time > 0)
        rewind_timer = setTimeout(function() { rewind() }, 500);
}

function stop() {
    my_audio.stop();
}

function seek_time(ts) {
    state.time = ts;
    my_audio.seek(ts);
}

function select_tape_event() {
    press_button(null);
    tape = document.getElementById("tapes").value;
    select_tape(tape);

    update_url_bar(state);
}

function select_tape(tape=null) {
    if (tape == null) return;
    max_rms = max_rms_default;
    state.tape = tape;
    document.getElementById("tapes").value = tape;

    my_audio.select_audio_files (
	"tapes/"+tape+"/Track1.mp3",
	"tapes/"+tape+"/Track2.mp3",
	"tapes/"+tape+"/Track3.mp3",
	"tapes/"+tape+"/Track4.mp3",
    );

    display_cover_artwork(tape);
}

function display_cover_artwork(tape=null) {
    if (tape == null) return;
    let div = document.getElementById("cover");
    div.innerHTML = "";
    let img = document.createElement("img");
    img.src = "tapes/"+tape+"/cover.png";
    img.classList.add("artwork");
    div.appendChild(img);
}

function update_url_bar(state) {
    history.replaceState(
	"",
	state.tape,
	"#" + state.tape.replaceAll(" ", "%20") + "&" + Math.floor(state.time) + "&" + state.track
    );
}

function format_time(t) {
    let minutes = Math.floor(t / 60);
    let seconds = Math.floor(t) % 60;

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
}

function update_progress(t, d) {
    let string = "";
    let current = format_time(t);
    let duration = format_time(d);
    let percent = Math.floor(t / d * 100);
    progress.innerHTML = current + " / " + duration + " (" + percent + "%)";
}

function update_loading_progress(reset=false) {
    if (reset === 4) {
	loaded = 3;
    }

    let loading_div = document.getElementById("loading");
    let loading_progress = document.getElementById("loading_progress");

    // Reset
    if (reset === true) {
        loading_div.classList.remove("hidden");
        loading_progress.innerHTML = "0 / 4";
        loaded = 0;
        return;
    }

    // Otherwise assume another track is loaded
    loaded += 1;
    loading_progress.innerHTML = loaded + " / 4";

    // Close it if we are finished!
    if (loaded >= 4)
        loading_div.classList.add("hidden");
}

function load_from_url_bar() {
    let url = ["", 0, 0];
    if (window.location.href.includes("#"))
	url = window.location.href.split('#')[1].split('&');

    let tape = url[0].replaceAll("%20", " ");
    if (tape == "")
 	tape = default_state.tape;

    let time = Number(url[1]);
    if (time < 0)
	time = default_state.time;

    let track = Number(url[2]);
    if (track < 0 || track > 3)
	track = default_state.track;

    return [tape, time, track];
}

function main_loop(ms) {
    // This loop keeps track of our position and updates the timer
    // This is only necessary because Safari does not support
    // the audio process events

    // Update the timestamp
    state.time = my_audio.get_timestamp();
    update_progress(
	state.time,
	my_audio.duration
    );

    // Animate mouth and attempt to adjust levels
    let rms = my_audio.get_audio_pcm();
    if (rms > max_rms) max_rms = rms;
    let adjusted = Math.max(0.1, (rms) / (max_rms));
    mouth.style.opacity = adjusted;

    // Blink Eyes
    eyes.style.opacity = 0.1;
    if (!my_audio.paused && Math.floor(ms / 400) % 2)
	eyes.style.opacity = 1;

    // Call another animation request
    animation_request = window.requestAnimationFrame(main_loop);
}

function first_run() {
    // Set up list of tapes
    let select = document.getElementById("tapes");
    for (let tape of tapes) {
        let option = document.createElement("option");
        option.value = tape;
        option.innerHTML = tape;
        select.appendChild(option);
    }
    document.getElementById("tapes").onchange = function () { select_tape_event(select.value) }

    // Create main audio class
    if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1)
	my_audio = new audio_helper_safari();
    else
	my_audio = new audio_helper();

    // Get document elements, and save them for interactions
    progress = document.getElementById("progress");
    svg = document.getElementById("svg2xl");
    svg_document = svg.contentDocument;
    mouth = svg_document.getElementById("mouth");
    eyes = svg_document.getElementById("eyes");

    // Get listeners set up
    svg_document.addEventListener("mousedown",  input_down);
    svg_document.addEventListener("mouseup",    input_up);
    svg_document.addEventListener("touchstart", input_down);
    svg_document.addEventListener("touchend",   input_up);

    // Set default tape selection or load from URL bar
    let [tape, time, track] = load_from_url_bar();
    select_tape(tape);
    change_track(track);
    seek_time(time);

    // Start with stop button stopped
    press_button(null);

    // Call our main loop
    main_loop();
}

window.onload = function () { first_run() };
