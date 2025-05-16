let mouth;
let svg;

let audio1;
let audio2;
let audio3;
let audio4;

let track_ids = ["target_track1", "target_track2", "target_track3", "target_track4"];

let current_tape;
let current_track;

let rewind_timer;
let svg_document;

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
    if (["target_play", "target_rewind", "target_stop"].includes(e.target.id)) {
        e.preventDefault();
        press_button(e.target.id);
    }

    if (track_ids.includes(e.target.id)) {
        e.preventDefault();
        change_track(e.target.id);
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
}

function change_track(t) {
    // Reset visibility of all buttons
    svg_document.getElementById("button_track1").classList.remove("pressed");
    svg_document.getElementById("button_track2").classList.remove("pressed");
    svg_document.getElementById("button_track3").classList.remove("pressed");
    svg_document.getElementById("button_track4").classList.remove("pressed");

    // Do action
    switch (t) {
    case "target_track1":
	current_track = 1;
        switch_track(1);
        svg_document.getElementById("button_track1").classList.add("pressed");
        break;
    case "target_track2":
	current_track = 2;
        switch_track(2);
        svg_document.getElementById("button_track2").classList.add("pressed");
        break;
    case "target_track3":
	current_track = 3;
        switch_track(3);
        svg_document.getElementById("button_track3").classList.add("pressed");
        break;
    case "target_track4":
	current_track = 4;
        switch_track(4);
        svg_document.getElementById("button_track4").classList.add("pressed");
        break;
    }
}

function play() {
    audio1.play()
    audio2.play()
    audio3.play()
    audio4.play()
}

function rewind() {
    // Get current time for audio track 1
    let ts = audio1.currentTime;

    // Set each track back a couple seconds
    let new_ts = Math.max(0, ts - 2);
    audio1.fastSeek(new_ts);
    audio2.fastSeek(new_ts);
    audio3.fastSeek(new_ts);
    audio4.fastSeek(new_ts);

    // Call this again in a few seconds unless we switch to play or hit 0
    if (new_ts > 0)
        rewind_timer = setTimeout(function() { rewind() }, 500);
}

function stop() {
    // Pause all tracks
    if (audio1 != undefined)
	audio1.pause();
    if (audio2 != undefined)
	audio2.pause();
    if (audio3 != undefined)
	audio3.pause();
    if (audio4 != undefined)
	audio4.pause();

    // Update URL bar so this spot can be shared
    if (audio1 != undefined)
	update_url_bar(current_tape, audio1.currentTime, current_track);
}

function switch_track(n) {
    audio1.muted = true;
    audio2.muted = true;
    audio3.muted = true;
    audio4.muted = true;

    switch (n) {
    case 1:
        audio1.muted = false;
        break;
    case 2:
        audio2.muted = false;
        break;
    case 3:
        audio3.muted = false;
        break;
    case 4:
        audio4.muted = false;
        break;
    }
}

function select_tape(tape=null, time=0, track=1) {
    // If no title is passed in, read from selection list
    if (tape == null) {
        tape = document.getElementById("tapes").value;
    } else {
        document.getElementById("tapes").value = tape;
    }

    current_tape = tape;

    // Stop playback
    stop();

    // Select new tracks
    audio1 = new Audio("tapes/"+tape+"/Track1.mp3");
    audio2 = new Audio("tapes/"+tape+"/Track2.mp3");
    audio3 = new Audio("tapes/"+tape+"/Track3.mp3");
    audio4 = new Audio("tapes/"+tape+"/Track4.mp3");

    createAudioListeners()

    // Reset Volume
    audio1.volume = 1;
    audio2.volume = 1;
    audio3.volume = 1;
    audio4.volume = 1;

    // reset playback position
    audio1.fastSeek(time);
    audio2.fastSeek(time);
    audio3.fastSeek(time);
    audio4.fastSeek(time);

    // Reset buttons
    change_track(track_ids[track-1]);
    press_button(null);
}

var audioCtx = new AudioContext();
var processor = audioCtx.createScriptProcessor(512, 1, 1);
var source1, source2, source3, source4;
let max = .35;
let min = .25;
let resolution = 2;

// loop through PCM data and calculate average volume
processor.onaudioprocess = function(evt){
    let input = evt.inputBuffer.getChannelData(0)

    let len = input.length
    let total = 0
    for (let i=0; i<len; i+=resolution)
        total += Math.abs(input[i]);

    let rms = Math.sqrt(total / (len / resolution));

    let adjusted = Math.max(0, (rms - min) / (max - min));

    mouth.style.opacity = adjusted;
};

function createAudioListeners() {
    // Set up audio listener (not in Safari because this feature doesn't work
    if (window.safari == undefined) {
        audio1.addEventListener('canplaythrough', function(){
            source1 = audioCtx.createMediaElementSource(audio1);
            source1.connect(processor);
            source1.connect(audioCtx.destination);
            processor.connect(audioCtx.destination);
        }, false);

        audio2.addEventListener('canplaythrough', function(){
            source2 = audioCtx.createMediaElementSource(audio2);
            source2.connect(processor);
            source2.connect(audioCtx.destination);
            processor.connect(audioCtx.destination);
        }, false);

        audio3.addEventListener('canplaythrough', function(){
            source3 = audioCtx.createMediaElementSource(audio3);
            source3.connect(processor);
            source3.connect(audioCtx.destination);
            processor.connect(audioCtx.destination);
        }, false);

        audio4.addEventListener('canplaythrough', function(){
            source4 = audioCtx.createMediaElementSource(audio4);
            source4.connect(processor);
            source4.connect(audioCtx.destination);
            processor.connect(audioCtx.destination);
        }, false);
    }
}

function update_url_bar(tape, time, track) {
    history.replaceState(
	"",
	tape,
	"#" + tape.replaceAll(" ", "%20") + "&" + Math.floor(time) + "&" + track
    );
}

function load_from_url_bar() {
    let url = ["", 0, 1];
    if (window.location.href.includes("#"))
	url = window.location.href.split('#')[1].split('&');

    let tape = url[0].replaceAll("%20", " ");
    if (tape == "")
	tape = "World of 2-XL"; // Default selection!

    let time = Number(url[1]);
    if (time < 0)
	time = 0;

    let track = Number(url[2]);
    if (track < 1 || track > 4)
	track = 1; // Default selection!

    return [tape, time, track];
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

    svg = document.getElementById("svg2xl")

    // Get document elements, and set up interactions after SVG is loaded
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
}

window.onload = function () { first_run() };
