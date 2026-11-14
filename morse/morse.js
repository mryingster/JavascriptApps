const morseCodes = {
    // Letters
    A: { code: ".-",    id: "A" },
    B: { code: "-...",  id: "B" },
    C: { code: "-.-.",  id: "C" },
    D: { code: "-..",   id: "D" },
    E: { code: ".",     id: "E" },
    F: { code: "..-.",  id: "F" },
    G: { code: "--.",   id: "G" },
    H: { code: "....",  id: "H" },
    I: { code: "..",    id: "I" },
    J: { code: ".---",  id: "J" },
    K: { code: "-.-",   id: "K" },
    L: { code: ".-..",  id: "L" },
    M: { code: "--",    id: "M" },
    N: { code: "-.",    id: "N" },
    O: { code: "---",   id: "O" },
    P: { code: ".--.",  id: "P" },
    Q: { code: "--.-",  id: "Q" },
    R: { code: ".-.",   id: "R" },
    S: { code: "...",   id: "S" },
    T: { code: "-",     id: "T" },
    U: { code: "..-",   id: "U" },
    V: { code: "...-",  id: "V" },
    W: { code: ".--",   id: "W" },
    X: { code: "-..-",  id: "X" },
    Y: { code: "-.--",  id: "Y" },
    Z: { code: "--..",  id: "Z" },

    // Numbers
    0: { code: "-----", id: "_0" },
    1: { code: ".----", id: "_1" },
    2: { code: "..---", id: "_2" },
    3: { code: "...--", id: "_3" },
    4: { code: "....-", id: "_4" },
    5: { code: ".....", id: "_5" },
    6: { code: "-....", id: "_6" },
    7: { code: "--...", id: "_7" },
    8: { code: "---..", id: "_8" },
    9: { code: "----.", id: "_9" },

    // Punctuation
    ".": { code: ".-.-.-",  id: "_PERIOD" },
    ",": { code: "--..--",  id: "_COMMA" },
    "?": { code: "..--..",  id: "_QUESTION" },
    "'": { code: ".----.",  id: "_APOSTROPHE" },
    "!": { code: "-.-.--",  id: "_EXCLAMATION" },
    "/": { code: "-..-.",   id: "_SLASH" },
    "(": { code: "-.--.-",  id: "_PAREN" },
    "&": { code: ".-...",   id: "_AMPERSAND" },
    ":": { code: "---...",  id: "_COLON" },
    ";": { code: "-.-.-.",  id: "_SEMICOLON" },
    "=": { code: "-...-",   id: "_EQUALS" },
    "+": { code: ".-.-.",   id: "_PLUS" },
    "-": { code: "-....-",  id: "_HYPHEN" },
    "_": { code: "..--.-",  id: "_UNDERSCORE" },
    '"': { code: ".-..-.",  id: "_QUOTE" },
    "$": { code: "...-..-", id: "_DOLLAR" },
    "@": { code: ".--.-.",  id: "_AT" },

    // Empty Placeholders
    "NOOP1": { code: "---.", id: "UNUSED8" },
    "NOOP2": { code: "----", id: "UNUSED90" },
    "NOOP3": { code: "..--", id: "UNUSED2" },
};

function createNode() {
    return {
        letter: null,
        id: null,
        representation: "",
        dot: null,
        dash: null
    };
}

function buildTrie(codes) {
    const root = createNode();

    for (const [letter, entry] of Object.entries(codes)) {
        let node = root;

        for (const symbol of entry.code) {
            const branch = symbol === "." ? "dot" : "dash";

            if (!node[branch]) {
                node[branch] = createNode();
            }

            node = node[branch];
        }

        node.letter = letter;
        node.id = entry.id;
    }

    // Populate representations, including intermediate nodes
    function populate(node, path = "") {
        if (!node) return;

        node.representation = path.replaceAll(".", "•");

        populate(node.dot, path + ".");
        populate(node.dash, path + "-");
    }

    populate(root);

    return root;
}


// --------------------------------------------------
// Morse input processing
// --------------------------------------------------

function processSymbol(symbol) {
    // A new symbol means we're continuing, not ending a word.
    clearTimeout(letterTimer);
    clearTimeout(wordTimer);

    letterTimer = null;
    wordTimer = null;

    const branch = symbol === "." ? "dot" : "dash";
    currentNode = currentNode[branch];

    if (!currentNode) {
        resetInput();
        return;
    }

    if (currentNode.id) {
        const light = svgDocument.getElementById(currentNode.id);

        if (light) {
            light.classList.remove("hidden");
            activeLights.push(light);
        }
    }

    // Three units of silence ends a letter.
    letterTimer = setTimeout(finishLetter, TIME_UNIT * 3);
}

function finishLetter() {
    const letter = currentNode.letter;

    if (letter) {
        output.textContent += letter;
    }

    // Reset the current letter, but don't cancel the word timer.
    resetInput(false);

    if (letter) {
        wordTimer = setTimeout(() => {
            output.textContent += " ";
            wordTimer = null;
        }, TIME_UNIT * 4);
    }
}

function resetInput(clearWordTimer = true) {
    clearTimeout(letterTimer);
    letterTimer = null;

    if (clearWordTimer) {
        clearTimeout(wordTimer);
        wordTimer = null;
    }

    for (const light of activeLights) {
        light.classList.add("hidden");
    }

    activeLights = [];
    currentNode = morseTree;
}

function resetLights() {
    for (const entry of Object.values(morseCodes)) {
        const light = svgDocument.getElementById(entry.id);

        if (light) {
            light.classList.add("hidden");
        } else {
            console.warn("No SVG element:", entry.id);
        }
    }
}


// --------------------------------------------------
// Audio
// --------------------------------------------------

let audioContext = null;
let oscillator = null;
let gainNode = null;


function initializeAudio() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 550;

    // Start silent
    gainNode.gain.value = 0;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
}

function startTone() {
    initializeAudio();

    // Browsers require audio to be resumed through user interaction
    audioContext.resume().then(() => {
        // The user might have released the button while resuming
        if (pressStart === null) return;

        gainNode.gain.cancelScheduledValues(audioContext.currentTime);

        gainNode.gain.setTargetAtTime(
            0.12,
            audioContext.currentTime,
            0.015
        );
    });
}

function stopTone() {
    if (!audioContext || !gainNode) return;

    gainNode.gain.cancelScheduledValues(audioContext.currentTime);

    gainNode.gain.setTargetAtTime(
        0,
        audioContext.currentTime,
        0.015
    );
}


// --------------------------------------------------
// Initialization and event handling
// --------------------------------------------------

const morseTree = buildTrie(morseCodes);

let svg;
let svgDocument;
let button;
let output;


let TIME_UNIT = 250; // milliseconds
const speedSettings = {
    fast:   180,
    normal: 250,
    slow:   350
};

let pressStart = null;
let activePointerId = null;
let currentNode = morseTree;
let activeLights = [];

let letterTimer = null;
let wordTimer = null;


function firstLoad() {
    svg = document.getElementById("tree");
    svgDocument = svg.contentDocument;

    if (!svgDocument) {
        console.error("Unable to access SVG document");
        return;
    }

    // Inject shared stylesheet into SVG
    const link = svgDocument.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "link"
    );

    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "../style.css");

    svgDocument.documentElement.appendChild(link);

    output = document.getElementById("output");

    // Clear output
    document.getElementById("clear").addEventListener("click", () => {
        output.textContent = "";
    });

    // Input speed settings
    const speedSelect = document.getElementById("speed");

    speedSelect.addEventListener("change", () => {
        TIME_UNIT = speedSettings[speedSelect.value];
    });

    // Connect button
    button = document.getElementById("input");

    // Input listeners
    button.addEventListener("pointerdown", (event) => {
        event.preventDefault();

        clearTimeout(letterTimer);
        clearTimeout(wordTimer);

        letterTimer = null;
        wordTimer = null;

        if (pressStart !== null) return;

        pressStart = performance.now();
        activePointerId = event.pointerId;

        // Capture pointer so release outside button is detected
        button.setPointerCapture(event.pointerId);

        startTone();
    });

    button.addEventListener("pointerup", (event) => {
        if (pressStart === null) return;
        if (event.pointerId !== activePointerId) return;

        const duration = performance.now() - pressStart;

        pressStart = null;
        activePointerId = null;

        stopTone();

        const symbol = duration < TIME_UNIT * 2 ? "." : "-";

        processSymbol(symbol);
    });

    button.addEventListener("pointercancel", () => {
        pressStart = null;
        activePointerId = null;

        stopTone();
    });

    // Initialize SVG lights
    resetLights();
}


// The window load event waits for the embedded SVG to load too.
window.addEventListener("load", firstLoad, {
    once: true
});
