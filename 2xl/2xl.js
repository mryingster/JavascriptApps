let mouth;
let svg;
let rewind_timer;
let svg_document;
let progress;

let audio_tracks = [null, null, null, null];

function debug_audio() {
    console.log("-----------");
    console.log(state.time);
    console.log(state.track);
    console.log("-----------");
    for (t of audio_tracks) {
        console.log(t.src);
        console.log("currentTime:", t.currentTime);
        console.log("paused:", t.paused, "muted:", t.muted);
    }
}

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

let animation_request = null;

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
    "X-Men Ghosts That Haunt Us"
];

function input_down(e) {
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
	state.stopped = true;
        svg_document.getElementById("button_stop").classList.add("pressed");
        break;
    }

    // Update URL bar so this spot can be shared
    if (audio_tracks[0] != undefined)
	update_url_bar(state);
}

function change_track(t) {
    // Reset visibility of all buttons
    for (let track_id of track_ids)
	svg_document.getElementById(track_id).classList.remove("pressed");

    // Do action
    state.track = t;
    switch_track();
    svg_document.getElementById(track_ids[t]).classList.add("pressed");

    // Update URL bar so this spot can be shared
    if (audio_tracks[0] != undefined)
	update_url_bar(state);
}

function play() {
    // Start playing all tracks
    all_tracks_play();

    // Unmute selected track
    audio_tracks[state.track].muted = false;
}

function rewind() {
    // Get current time for audio track 1
    let ts = audio_tracks[state.track].currentTime;

    // Set each track back a couple seconds
    state.time = Math.max(0, ts - 2);
    for (let t of audio_tracks)
	if (t != undefined)
	    t.currentTime = state.time;;

    // Call this again in a few seconds unless we switch to play or hit 0
    if (state.time > 0)
        rewind_timer = setTimeout(function() { rewind() }, 500);
}

function stop() {
    // Pause all tracks
    all_tracks_pause();
}

function switch_track() {
    // mute all tracks
    all_tracks_toggle_mute(true);

    // Unmute selected track
    audio_tracks[state.track].muted = false;
}

function all_tracks_play() {
    for (let t of audio_tracks)
	if (t != undefined)
            t.play();
}

function all_tracks_pause() {
    for (let t of audio_tracks)
	if (t != undefined)
	    t.pause();
}

function all_tracks_toggle_mute(mute) {
    for (let t of audio_tracks)
	if (t != undefined)
	    t.muted = mute;
}

function all_tracks_set_to_current_time() {
    for (let t of audio_tracks)
	if (t != undefined)
            t.currentTime = state.time;
}

function select_tape(tape=null, time=0, track=0) {
    // Stop playback
    stop();

    // If no title is passed in, read from selection list
    if (tape == null) {
        tape = document.getElementById("tapes").value;
    } else {
        document.getElementById("tapes").value = tape;
    }

    // Select new tracks
    audio_tracks[0] = new Audio("tapes/"+tape+"/Track1.mp3");
    audio_tracks[1] = new Audio("tapes/"+tape+"/Track2.mp3");
    audio_tracks[2] = new Audio("tapes/"+tape+"/Track3.mp3");
    audio_tracks[3] = new Audio("tapes/"+tape+"/Track4.mp3");

    audio_tracks[0].addEventListener('loadedmetadata', () => {
	state.duration = audio_tracks[0].duration;
    });

    // Reset listeners for mouth animation
    createAudioListeners()
    min = .30;
    max = .30;

    // Update state
    state.tape = tape;
    state.time = time;
    state.track = track;

    // reset playback position
    all_tracks_set_to_current_time();

    // Reset buttons
    change_track(track);
    press_button(null);
}

var audioCtx = new AudioContext();
var processor = audioCtx.createScriptProcessor(512, 1, 1);
var source1, source2, source3, source4;
let max = .30;
let min = .30;
let resolution = 2;

// loop through PCM data and calculate average volume
processor.onaudioprocess = function(evt){
    let input = evt.inputBuffer.getChannelData(0)

    let len = input.length
    let total = 0
    for (let i=0; i<len; i+=resolution)
        total += Math.abs(input[i]);

    let rms = Math.sqrt(total / (len / resolution));

    if (rms > max) max = rms;
    if (rms < min && rms > 10) min = rms;

    let adjusted = Math.max(0, (rms - min) / (max - min));

    mouth.style.opacity = adjusted;
};

function createAudioListeners() {
    // Set up audio listener (not in Safari because this feature doesn't work
    if (window.safari == undefined) {
	for (let audio of audio_tracks) {
            audio.addEventListener('canplaythrough', function(){
		source1 = audioCtx.createMediaElementSource(audio);
		source1.connect(processor);
		source1.connect(audioCtx.destination);
		processor.connect(audioCtx.destination);
            }, false);
	}
    }
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

function update_progress() {
    let string = "";
    let current = format_time(state.time);
    let duration = format_time(state.duration);
    let percent = Math.floor(state.time / state.duration * 100);
    progress.innerHTML = current + " / " + duration + " (" + percent + "%)";
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

function main_loop() {
    // This loop keeps track of our position and updates the timer
    // This is only necessary because Safari does not support
    // the audio process events

    // Update the timestamp
    state.time = audio_tracks[state.track].currentTime;
    update_progress();

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
    document.getElementById("tapes").onchange = function () { select_tape(select.value) }

    // Get document elements, and save them for interactions
    progress = document.getElementById("progress");
    svg = document.getElementById("svg2xl");
    svg_document = svg.contentDocument;
    mouth = svg_document.getElementById("mouth");

    // Get listeners set up
    svg_document.addEventListener("mousedown",  input_down);
    svg_document.addEventListener("mouseup",    input_up);
    svg_document.addEventListener("touchstart", input_down);
    svg_document.addEventListener("touchend",   input_up);

    // Set default tape selection or load from URL bar
    let [tape, time, track] = load_from_url_bar();
    select_tape(tape, time, track);

    // Start with stop button stopped
    press_button(null);

    // Call our main loop
    main_loop();
}

window.onload = function () { first_run() };
