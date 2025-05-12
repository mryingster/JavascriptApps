let mouth;
let svg;

let audio1;
let audio2;
let audio3;
let audio4;

let rewind_timer;

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

    if (["target_track1", "target_track2", "target_track3", "target_track4"].includes(e.target.id)) {
        e.preventDefault();
        change_track(e.target.id);
    }
}

function input_up(e) {
}

function press_button(b) {
    // Reset visibility of all buttons
    document.getElementById("button_play").classList.remove("pressed");
    document.getElementById("button_rewind").classList.remove("pressed");
    document.getElementById("button_stop").classList.remove("pressed");

    // Stop rewind timeout
    clearTimeout(rewind_timer);

    // Do action
    switch (b) {
    case "target_play":
        play();
        document.getElementById("button_play").classList.add("pressed");
        break;
    case "target_rewind":
        rewind();
        document.getElementById("button_rewind").classList.add("pressed");
        break;
    case "target_stop":
        stop();
        document.getElementById("button_stop").classList.add("pressed");
        break;
    }
}

function change_track(t) {
    // Reset visibility of all buttons
    document.getElementById("button_track1").classList.remove("pressed");
    document.getElementById("button_track2").classList.remove("pressed");
    document.getElementById("button_track3").classList.remove("pressed");
    document.getElementById("button_track4").classList.remove("pressed");

    // Do action
    switch (t) {
    case "target_track1":
        switch_track(1);
        document.getElementById("button_track1").classList.add("pressed");
        break;
    case "target_track2":
        switch_track(2);
        document.getElementById("button_track2").classList.add("pressed");
        break;
    case "target_track3":
        switch_track(3);
        document.getElementById("button_track3").classList.add("pressed");
        break;
    case "target_track4":
        switch_track(4);
        document.getElementById("button_track4").classList.add("pressed");
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
    audio1.pause()
    audio2.pause()
    audio3.pause()
    audio4.pause()
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

function select_tape(t=null) {
    // If no title is passed in, read from selection list
    if (t == null) {
        document.getElementById("tapes").value;
    } else {
        document.getElementById("tapes").value = t
    }

    audio1 = new Audio("tapes/"+t+"/Track1.mp3");
    audio2 = new Audio("tapes/"+t+"/Track2.mp3");
    audio3 = new Audio("tapes/"+t+"/Track3.mp3");
    audio4 = new Audio("tapes/"+t+"/Track4.mp3");

    audio1.volume = 1;
    audio2.volume = 1;
    audio3.volume = 1;
    audio4.volume = 1;

    // Reset buttons and rewind
    rewind();
    change_track("target_track1");
    press_button(null);
}

var audioCtx = new AudioContext();
var processor = audioCtx.createScriptProcessor(512, 1, 1);
var source1, source2, source3, source4;
let max = .5;
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

    // Set default selection
    select_tape("World of 2-XL");

    // Get document elements
    mouth = document.getElementById("mouth");
    svg = document.getElementById("2xl");

    // Get listeners set up
    svg.addEventListener("mousedown",  input_down);
    svg.addEventListener("mouseup",    input_up);
    svg.addEventListener("touchstart", input_down);
    svg.addEventListener("touchend",   input_up);

    // Select track 1 by default
    switch_track(1);
    createAudioListeners();
}

window.onload = function () { first_run() };
