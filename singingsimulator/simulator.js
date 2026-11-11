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

const animation = [
    { "time":0,          "sound":"_",      "word":"STOP"},
    { "time":7400,       "sound":"L",      "word":"Luna"},
    { "time":7558.299,   "sound":"OO",     "word":"Luna"},
    { "time":7800,       "sound":"N",      "word":"Luna"},
    { "time":7889.659,   "sound":"AH",     "word":"Luna"},
    { "time":8250,       "sound":"G",      "word":"gardenia"},
    { "time":8211.563,   "sound":"AR",     "word":"gardenia"},
    { "time":8480,       "sound":"D",      "word":"gardenia"},
    { "time":8573.333,   "sound":"AY",     "word":"gardenia"},
    { "time":8950,       "sound":"N",      "word":"gardenia"},
    { "time":9016.077,   "sound":"AH",     "word":"gardenia"},
    { "time":9650,       "sound":"D",      "word":"de"},
    { "time":9743.492,   "sound":"AY",     "word":"de"},
    { "time":9780,       "sound":"P",      "word":"plata"},
    { "time":9820,       "sound":"L",      "word":"plata"},
    { "time":9863.945,   "sound":"AH",     "word":"plata"},
    { "time":10100,      "sound":"T",      "word":"plata"},
    { "time":10185.691,  "sound":"AH",     "word":"plata"},
    { "time":10400,      "sound":"K",      "word":"Que"},
    { "time":10467.142,  "sound":"AY",     "word":"Que"},
    { "time":10800,      "sound":"M",      "word":"mi"},
    { "time":10874.331,  "sound":"EE",     "word":"mi"},
    { "time":11200,      "sound":"S",      "word":"serenata"},
    { "time":11277.981,  "sound":"EH",     "word":"serenata"},
    { "time":11800,      "sound":"R",      "word":"serenata"},
    { "time":11883.378,  "sound":"EH",     "word":"serenata"},
    { "time":12050,      "sound":"N",      "word":"serenata"},
    { "time":12124.625,  "sound":"AH",     "word":"serenata"},
    { "time":12450,      "sound":"T",      "word":"serenata"},
    { "time":12445.963,  "sound":"AH",     "word":"serenata"},
    { "time":12650,      "sound":"T",      "word":"te"},
    { "time":12767.573,  "sound":"AY",     "word":"te"},
    { "time":13100,      "sound":"V",      "word":"vuelves"},
    { "time":13172.199,  "sound":"EH",     "word":"vuelves"},
    { "time":13450,      "sound":"L",      "word":"vuelves"},
    { "time":13490,      "sound":"V",      "word":"vuelves"},
    { "time":13534.556,  "sound":"EH",     "word":"vuelves"},
    { "time":13850,      "sound":"S",      "word":"vuelves"},
    { "time":13890,      "sound":"K",      "word":"canción"},
    { "time":13936.848,  "sound":"AH",     "word":"canción"},
    { "time":14000,      "sound":"N",      "word":"canción"},
    { "time":14080,      "sound":"S",      "word":"canción"},
    { "time":14138.049,  "sound":"EE",     "word":"canción"},
    { "time":14299.229,  "sound":"OH",     "word":"canción"},
    { "time":14400,      "sound":"N",      "word":"canción"},
    { "time":14600,      "sound":"_",      "word":"STOP"},
    // Verse 2
    { "time":16550,     "sound":"T",             "word":"Tu"},
    { "time":16632.062, "sound":"OO",            "word":"Tu"},
    { "time":16850,     "sound":"K",             "word":"que"},
    { "time":16953.536, "sound":"AY",            "word":""},
    { "time":17250,     "sound":"M",             "word":"me"},
    { "time":17355.668, "sound":"EH",            "word":""},
    { "time":17700,     "sound":"V",             "word":"viste"},
    { "time":17797.459, "sound":"EE",            "word":""},
    { "time":18030,     "sound":"S",             "word":""},
    { "time":18100,     "sound":"T",             "word":""},
    { "time":18159.636, "sound":"AY",            "word":""},
    { "time":18850,     "sound":"K",             "word":"cantando"},
    { "time":18964.103, "sound":"AH",            "word":""},
    { "time":19000,     "sound":"N",             "word":""},
    { "time":19040,     "sound":"T",             "word":""},
    { "time":19084.647, "sound":"AH",            "word":""},
    { "time":19300,     "sound":"N",             "word":""},
    { "time":19350,     "sound":"D",             "word":""},
    { "time":19408.275, "sound":"OH",            "word":""},
    { "time":19690,     "sound":"M",             "word":"Me"},
    { "time":19730.928, "sound":"EH",            "word":""},
    { "time":20080,     "sound":"V",             "word":"ves"},
    { "time":20134.329, "sound":"EH",            "word":""},
    { "time":20400,     "sound":"S",             "word":""},
    { "time":20496.711, "sound":"OY",            "word":"hoy"},
    { "time":21261.858, "sound":"OO",            "word":"llorando"},
    { "time":21380,     "sound":"R",             "word":""},
    { "time":21423.785, "sound":"AH",            "word":""},
    { "time":21650,     "sound":"N",             "word":""},
    { "time":21700,     "sound":"D",             "word":""},
    { "time":21745.441, "sound":"OO",            "word":""},
    { "time":22000,     "sound":"M",             "word":"mi"},
    { "time":22072.81 , "sound":"EE",            "word":""},
    { "time":22400,     "sound":"D",             "word":"desilusión"},
    { "time":22475.577, "sound":"EH",            "word":""},
    { "time":23220,     "sound":"S",             "word":""},
    { "time":23280.882, "sound":"EE",            "word":""},
    { "time":23500,     "sound":"L",             "word":""},
    { "time":23600,     "sound":"OO",            "word":""},
    { "time":23650,     "sound":"S",             "word":""},
    { "time":23723.854, "sound":"OH",            "word":""},
    { "time":23760,     "sound":"N",             "word":""},
    { "time":23800,     "sound":"_",             "word":"STOP"},
    // Verse 3
    { "time":25800,     "sound":"K",             "word":"Calles"},
    { "time":25854.398, "sound":"AY",            "word":""},
    { "time":26175.6,   "sound":"EH",            "word":""},
    { "time":26450,     "sound":"S",             "word":""},
    { "time":26500,     "sound":"B",             "word":"bañadas"},
    { "time":26577.414, "sound":"AH",            "word":""},
    { "time":26900,     "sound":"N",             "word":""},
    { "time":26983.037, "sound":"AH",            "word":""},
    { "time":27300,     "sound":"D",             "word":""},
    { "time":27344.556, "sound":"AH",            "word":""},
    { "time":27850,     "sound":"S",             "word":""},
    { "time":27900,     "sound":"D",             "word":"de"},
    { "time":27950.702, "sound":"EH",            "word":""},
    { "time":28050,     "sound":"L",             "word":"luna"},
    { "time":28113.309, "sound":"OO",            "word":""},
    { "time":28400,     "sound":"N",             "word":""},
    { "time":28474.578, "sound":"AH",            "word":""},
    { "time":28780,     "sound":"K",             "word":"Que"},
    { "time":28838.638, "sound":"EH",            "word":""},
    { "time":29200,     "sound":"F",             "word":"fueron"},
    { "time":29241.11,  "sound":"EH",            "word":""},
    { "time":29600,     "sound":"R",             "word":""},
    { "time":29646.189, "sound":"AH",            "word":""},
    { "time":30280,     "sound":"N",             "word":""},
    { "time":30320,     "sound":"L",             "word":"la"},
    { "time":30372.266, "sound":"AH",            "word":""},
    { "time":30500,     "sound":"K",             "word":"cuna"},
    { "time":30533.355, "sound":"OO",            "word":""},
    { "time":30800,     "sound":"N",             "word":""},
    { "time":30854.693, "sound":"AH",            "word":""},
    { "time":31100,     "sound":"D",             "word":"de"},
    { "time":31176.416, "sound":"EH",            "word":""},
    { "time":31500,     "sound":"M",             "word":"mi"},
    { "time":31578.207, "sound":"EE",            "word":""},
    { "time":31900,     "sound":"J",             "word":"juventud"},
    { "time":31940.225, "sound":"OO",            "word":""},
    { "time":31280,     "sound":"V",             "word":""},
    { "time":32343.173, "sound":"EH",            "word":""},
    { "time":32650,     "sound":"N",             "word":""},
    { "time":32700,     "sound":"T",             "word":""},
    { "time":32749.364, "sound":"OO",            "word":""},
    { "time":33950,     "sound":"D",             "word":""},
    { "time":34000,     "sound":"_",             "word":"STOP"},
    // Verse 4
    { "time":34950,     "sound":"V",             "word":"Vengo"},
    { "time":35045.055, "sound":"EH",            "word":""},
    { "time":35150,     "sound":"N",             "word":""},
    { "time":35300,     "sound":"G",             "word":""},
    { "time":35366.575, "sound":"AH",            "word":""},
    { "time":35929.136, "sound":"AH",            "word":"a"},
    { "time":36000,     "sound":"C",             "word":"cantarle"},
    { "time":36094.829, "sound":"AH",            "word":""},
    { "time":36300,     "sound":"N",             "word":""},
    { "time":36400,     "sound":"T",             "word":""},
    { "time":36496.665, "sound":"AH",            "word":""},
    { "time":36740,     "sound":"R",             "word":""},
    { "time":36800,     "sound":"L",             "word":""},
    { "time":36901.155, "sound":"EH",            "word":""},
    { "time":37262.833, "sound":"AH",            "word":"a"},
    { "time":37580,     "sound":"M",             "word":"mi"},
    { "time":37625.191, "sound":"EE",            "word":""},
    { "time":38268.638, "sound":"AH",            "word":"amada"},
    { "time":38400,     "sound":"M",             "word":""},
    { "time":38471.132, "sound":"AH",            "word":""},
    { "time":38780,     "sound":"D",             "word":""},
    { "time":38833.060, "sound":"AH",            "word":""},
    { "time":38780,     "sound":"M",             "word":"Mi"},
    { "time":39156.484, "sound":"EE",            "word":""},
    { "time":39380,     "sound":"L",             "word":"luna"},
    { "time":39437.618, "sound":"OO",            "word":""},
    { "time":39500,     "sound":"N",             "word":""},
    { "time":39558.094, "sound":"AH",            "word":""},
    { "time":39800,     "sound":"P",             "word":"plateada"},
    { "time":39880,     "sound":"L",             "word":""},
    { "time":39960.974, "sound":"AH",            "word":""},
    { "time":40500,     "sound":"T",             "word":""},
    { "time":40564.216, "sound":"EE",            "word":""},
    { "time":40700,     "sound":"D",             "word":""},
    { "time":40766.302, "sound":"AH",            "word":""},
    { "time":41000,     "sound":"D",             "word":"de"},
    { "time":41087.912, "sound":"EH",            "word":""},
    { "time":41250,     "sound":"M",             "word":"mi"},
    { "time":41300,     "sound":"EE",            "word":""},
    { "time":41420,     "sound":"CH",            "word":"Xelajú"},
    { "time":41489.840, "sound":"EH",            "word":""},
    { "time":41600,     "sound":"L",             "word":""},
    { "time":41750,     "sound":"AH",            "word":""},
    { "time":41851.699, "sound":"OO",            "word":""},
    { "time":43000,     "sound":"_",             "word":"STOP"},
    // Refrain
    { "time":43970,     "sound":"V",             "word":"Vengo"},
    { "time":44026.098, "sound":"EH",            "word":""},
    { "time":44250,     "sound":"N",             "word":""},
    { "time":44300,     "sound":"G",             "word":""},
    { "time":44391.064, "sound":"AH",            "word":""},
    { "time":44980,     "sound":"C",             "word":"cantarle"},
    { "time":45036.212, "sound":"AH",            "word":""},
    { "time":45090,     "sound":"N",             "word":""},
    { "time":45130,     "sound":"T",             "word":""},
    { "time":45197.504, "sound":"AH",            "word":""},
    { "time":45450,     "sound":"R",             "word":""},
    { "time":45500,     "sound":"L",             "word":""},
    { "time":45559.795, "sound":"EH",            "word":""},
    { "time":45921.881, "sound":"AH",            "word":"a"},
    { "time":46200,     "sound":"M",             "word":"mi"},
    { "time":46283.808, "sound":"EE",            "word":""},
    { "time":46685.622, "sound":"AH",            "word":"amada"},
    { "time":47500,     "sound":"M",             "word":""},
    { "time":47531.699, "sound":"AH",            "word":""},
    { "time":47800,     "sound":"D",             "word":""},
    { "time":47893.74 , "sound":"AH",            "word":""},
    { "time":48160,     "sound":"M",             "word":"Mi"},
    { "time":48216.597, "sound":"EE",            "word":""},
    { "time":48400,     "sound":"L",             "word":"luna"},
    { "time":48457.731, "sound":"OO",            "word":""},
    { "time":48580,     "sound":"N",             "word":""},
    { "time":48618.457, "sound":"AH",            "word":""},
    { "time":48750,     "sound":"P",             "word":"plateada"},
    { "time":48800,     "sound":"L",             "word":""},
    { "time":48899.432, "sound":"AH",            "word":""},
    { "time":49400,     "sound":"T",             "word":""},
    { "time":49542.153, "sound":"EE",            "word":""},
    { "time":49620,     "sound":"D",             "word":""},
    { "time":49702.742, "sound":"AH",            "word":""},
    { "time":49800,     "sound":"D",             "word":"de"},
    { "time":49863.854, "sound":"EH",            "word":""},
    { "time":50000,     "sound":"M",             "word":"mi"},
    { "time":50185.214, "sound":"EE",            "word":""},
    { "time":50400,     "sound":"CH",            "word":"Xelajú"},
    { "time":50512.357, "sound":"EH",            "word":""},
    { "time":50700,     "sound":"L",             "word":""},
    { "time":50780,     "sound":"AH",            "word":""},
    { "time":50834.897, "sound":"OO",            "word":""},
    { "time":51200,     "sound":"_",             "word":"STOP"},
];

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

function animate() {
    const positionMs = audio.currentTime * 1000;

    // Find frame closest to current position
    let currentFrame = animation[0];
    for (let i=0; i<animation.length-1; i++) {
	if (animation[i].time < positionMs && animation[i+1].time > positionMs) {
	    currentFrame = animation[i];
	    break;
	}
    }

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

async function firstRun() {
    audio = document.getElementById("audio");
    debug = document.getElementById("debug");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    spriteSheet.src = "images/jared.png";
    await spriteSheet.decode();

    document.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
            event.preventDefault();
            console.log(audio.currentTime * 1000);
	}
    });

    requestAnimationFrame(animate);
}

let audio;
let debug;
let canvas;
let ctx;

const spriteSheet = new Image();
const spriteWidth = 256;
const spriteHeight = 256;

window.onload = function () {
    firstRun();
}
