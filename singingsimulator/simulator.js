const soundLookup = {
    "_"  : {x:0, y:0},
    // Vowels
    "OO" : {x:1, y:0},
    "OH" : {x:1, y:0},
    "OY" : {x:1, y:0},
    "EH" : {x:1, y:1},
    "IH" : {x:1, y:1},
    "AY" : {x:1, y:1},
    "AH" : {x:1, y:2},
    "EE" : {x:1, y:3},
    // Consonents
    "Z"  : {x:2, y:0},
    "CH" : {x:2, y:0},
    "J"  : {x:2, y:0},
    "S"  : {x:2, y:0},
    "T"  : {x:2, y:1},
    "D"  : {x:2, y:1},
    "M"  : {x:2, y:2},
    "B"  : {x:2, y:2},
    "P"  : {x:2, y:2},
    "K"  : {x:2, y:3},
    "G"  : {x:2, y:3},
    "V"  : {x:3, y:0},
    "F"  : {x:3, y:0},
    "L"  : {x:3, y:1},
    "N"  : {x:3, y:1},
    "TH" : {x:3, y:2},
    "R"  : {x:3, y:3},
    "H"  : {x:3, y:3},
};

function drawSprite(x, y, spriteWidth, spriteHeight, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        spriteSheet,

        // Source rectangle (sprite sheet)
        x * spriteWidth,
        y * spriteHeight,
        spriteWidth,
        spriteHeight,

        // Destination rectangle (entire canvas)
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function findClosestFrame(ms) {
    let low = 0;
    let high = animation.length - 1;

    while (low < high) {
        const mid = Math.floor((low + high + 1) / 2);

        if (animation[mid].time <= ms) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }

    return animation[low];
}

function animate() {
    const positionMs = audio.currentTime * 1000;

    // Find frame closest to current position
    let currentFrame = findClosestFrame(positionMs);

    // Lookup sprite coords
    let coords = {x:0, y:0};
    if (currentFrame.sound in soundLookup) {
        coords = soundLookup[currentFrame.sound];
    }

    // Draw sprite
    drawSprite(coords.x, coords.y, spriteWidth, spriteHeight, ctx);

    //debug.innerHTML = `${currentFrame.sound} ${currentFrame.word} ${positionMs}`;

    requestAnimationFrame(animate);
}

function switchMusic(e) {
    const selection = document.getElementById("music").value;
    let source = "";
    debugIndex = 0;

    // Set animations and sound source
    switch (selection) {
    case "Oceania":
        source = "music/Oceania.m4a";
        animation = animations["Oceania"];
        break;
    case "Feliz Navidad":
        source = "music/Feliz Navidad.m4a";
        animation = animations["Feliz Navidad"];
        break;
    case "Luna de Xelaju":
    default:
        source = "music/Luna de Xelaju.mp3";
        animation = animations["Luna de Xelaju"];
        break;
    }

    audio.src = source;
}

async function firstRun() {
    audio = document.getElementById("audio");
    debugOutput = document.getElementById("debug");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    spriteSheet.src = "images/jared.png";
    await spriteSheet.decode();

    document.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
            // Only allow tapping out song in debug mode
            if (!DEBUG) return

            event.preventDefault();

            // Exit when we get to the end
            if (debugIndex >= animation.length){
                console.log(animation);
                return;
            }

            // Tap out the timing
            debugOutput.innerHTML = "";
            let t = document.createElement("p");
            t.innerHTML = `${audio.currentTime}`;
            debugOutput.appendChild(t);
            for (let i=debugIndex; i<Math.min(debugIndex+5, animation.length-1); i++) {
                let t = document.createElement("p");
                t.innerHTML = `${animation[i].sound} ${animation[i].word}`;
                if (i==debugIndex) {
                    t.style = "font-weight:1000;";
                }
                debug.appendChild(t);
            }

            animation[debugIndex].time = audio.currentTime * 1000;

            debugIndex++;
	}
    });

    const music = document.getElementById("music");
    animation = animations[music.value];

    music.onchange = (e) => {
        switchMusic(e);
    }

    switchMusic();
    requestAnimationFrame(animate);
}

let audio;
let canvas;
let ctx;

const spriteSheet = new Image();
const spriteWidth = 256;
const spriteHeight = 256;

let animation;

const DEBUG = false;
let debugOutput;
let debugIndex = 0;

window.onload = function () {
    firstRun();
}
