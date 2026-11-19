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
    ".": { code: ".-.-.-",  id: "PERIOD" },
    ",": { code: "--..--",  id: "COMMA" },
    "?": { code: "..--..",  id: "QUESTION" },
    "'": { code: ".----.",  id: "APOSTROPHE" },
    "!": { code: "-.-.--",  id: "EXCLAMATION" },
    "/": { code: "-..-.",   id: "SLASH" },
    "(": { code: "-.--.-",  id: "PAREN" },
    "&": { code: ".-...",   id: "AMPERSAND" },
    ":": { code: "---...",  id: "COLON" },
    ";": { code: "-.-.-.",  id: "SEMICOLON" },
    "=": { code: "-...-",   id: "EQUALS" },
    "+": { code: ".-.-.",   id: "PLUS" },
    "-": { code: "-....-",  id: "HYPHEN" },
    "_": { code: "..--.-",  id: "UNDERSCORE" },
    '"': { code: ".-..-.",  id: "QUOTE" },
    "$": { code: "...-..-", id: "DOLLAR" },
    "@": { code: ".--.-.",  id: "AT" },

    // Empty Placeholders
    "NOOP1": { code: "---.", id: "UNUSED8" },
    "NOOP2": { code: "----", id: "UNUSED90" },
    "NOOP3": { code: "..--", id: "UNUSED2" },
    "NOOP4": { code: "-----.", id: "NOOP-----." },
    "NOOP5": { code: "------", id: "NOOP------" },
    "NOOP6": { code: ".-----", id: "NOOP.-----" },
    "NOOP7": { code: ".....-", id: "NOOP.....-" },
    "NOOP8": { code: "......", id: "NOOP......" },
    "NOOP9": { code: "-.....", id: "NOOP-....." },
    "NOOP10": { code: "-.---.", id: "NOOP-.---." },
    "NOOP11": { code: "-.----", id: "NOOP-.----" },
    "NOOP12": { code: "--....", id: "NOOP--...." },
    "NOOP13": { code: "--...-", id: "NOOP--...-" },
    "NOOP14": { code: ".-...-", id: "NOOP.-...-" },
    "NOOP15": { code: ".-....", id: "NOOP.-...." },
    "NOOP16": { code: "..----", id: "NOOP..----" },
    "NOOP17": { code: "..---.", id: "NOOP..---." },
    "NOOP18": { code: "--.--.", id: "NOOP--.--." },
    "NOOP19": { code: "--.---", id: "NOOP--.---" },
    "NOOP20": { code: "---..-", id: "NOOP---..-" },
    "NOOP21": { code: "..-..-", id: "NOOP..-..-" },
    "NOOP22": { code: "..-...", id: "NOOP..-..." },
    "NOOP23": { code: "...---", id: "NOOP...---" },
    "NOOP24": { code: "...--.", id: "NOOP...--." },
    "NOOP25": { code: "-..--.", id: "NOOP-..--." },
    "NOOP26": { code: "-..---", id: "NOOP-..---" },
    "NOOP27": { code: "-.-...", id: "NOOP-.-..." },
    "NOOP28": { code: "-.-..-", id: "NOOP-.-..-" },
    "NOOP29": { code: ".--..-", id: "NOOP.--..-" },
    "NOOP30": { code: ".--...", id: "NOOP.--..." },
    "NOOP31": { code: ".-.---", id: "NOOP.-.---" },
    "NOOP32": { code: ".-.--.", id: "NOOP.-.--." },
    "NOOP33": { code: ".---.-", id: "NOOP.---.-" },
    "NOOP34": { code: ".---..", id: "NOOP.---.." },
    "NOOP35": { code: ".--.--", id: "NOOP.--.--" },
    "NOOP36": { code: "-...-.", id: "NOOP-...-." },
    "NOOP37": { code: "-...--", id: "NOOP-...--" },
    "NOOP38": { code: "-..-..", id: "NOOP-..-.." },
    "NOOP39": { code: "-..-.-", id: "NOOP-..-.-" },
    "NOOP40": { code: "--..-.", id: "NOOP--..-." },
    "NOOP41": { code: "--.-..", id: "NOOP--.-.." },
    "NOOP42": { code: "--.-.-", id: "NOOP--.-.-" },
    "NOOP43": { code: "..-.--", id: "NOOP..-.--" },
    "NOOP44": { code: "..-.-.", id: "NOOP..-.-." },
    "NOOP45": { code: "---...", id: "NOOP---..." },
    "NOOP46": { code: "---.--", id: "NOOP---.--" },
    "NOOP47": { code: "----..", id: "NOOP----.." },
    "NOOP48": { code: "----.-", id: "NOOP----.-" },
    "NOOP49": { code: "...-.-", id: "NOOP...-.-" },
    "NOOP50": { code: "...-..", id: "NOOP...-.." },
    "NOOP51": { code: "....--", id: "NOOP....--" },
    "NOOP52": { code: "....-.", id: "NOOP....-." },
    "NOOP53": { code: "-.--..", id: "NOOP-.--.." },
    "NOOP54": { code: ".-.-..", id: "NOOP.-.-.." },
    "NOOP55": { code: ".-..--", id: "NOOP.-..--" },
    "NOOP56": { code: "--.--", id: "NOOP--.--" },
    "NOOP57": { code: "---.-", id: "NOOP---.-" },
    "NOOP58": { code: ".---.", id: "NOOP.---." },
    "NOOP59": { code: ".--.-", id: "NOOP.--.-" },
    "NOOP60": { code: ".--..", id: "NOOP.--.." },
    "NOOP61": { code: ".-.--", id: "NOOP.-.--" },
    "NOOP62": { code: ".-.-", id: "NOOP.-.-" },
    "NOOP63": { code: ".-..-", id: "NOOP.-..-" },
    "NOOP64": { code: "..--.", id: "NOOP..--." },
    "NOOP65": { code: "..-.-", id: "NOOP..-.-" },
    "NOOP66": { code: "..-..", id: "NOOP..-.." },
    "NOOP67": { code: "...-.", id: "NOOP...-." },
    "NOOP68": { code: "-..--", id: "NOOP-..--" },
    "NOOP69": { code: "-.-..", id: "NOOP-.-.." },
    "NOOP70": { code: "-.-.-", id: "NOOP-.-.-" },
    "NOOP71": { code: "-.--.", id: "NOOP-.--." },
    "NOOP72": { code: "-.---", id: "NOOP-.---" },
    "NOOP73": { code: "--..-", id: "NOOP--..-" },
    "NOOP74": { code: "--.-.", id: "NOOP--.-." },
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

    if (letter && !letter.includes("NOOP")) {
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
// Preview lights
// --------------------------------------------------

function clearPreview() {
    if (!previewElement) return;

    previewElement.classList.remove("preview");

    // Don't hide a light that has already been activated.
    if (!activeLights.includes(previewElement)) {
        previewElement.classList.add("hidden");
    }

    previewElement = null;
    previewNode = null;
}

function showPreview(node) {
    if (previewNode === node) return;

    clearPreview();

    if (!node || !node.id) return;

    const element = svgDocument.getElementById(node.id);
    if (!element) return;

    element.classList.remove("hidden");
    element.classList.add("preview");

    previewElement = element;
    previewNode = node;
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
// Visual feedback
// --------------------------------------------------

function setProgress(bar, fraction) {
    if (!bar) return;

    fraction = Math.max(0, Math.min(fraction, 1));
    bar.setAttribute("width", 500 * fraction);
}

function startMeterAnimation() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(animateMeters);
}

function animateMeters() {
    const now = performance.now();

    if (animationMode === "press" && pressStart !== null) {
        const elapsed = now - pressStart;

        setProgress(pressBar, elapsed / (TIME_UNIT * 3));

        // Switch from dot preview to dash preview at 2 units.
        if (elapsed < TIME_UNIT * 2) {
            showPreview(currentNode.dot);
        } else {
            showPreview(currentNode.dash);
        }

    } else if (animationMode === "gap" && gapStart !== null) {
        const elapsed = now - gapStart;
        const duration = TIME_UNIT * 7;

        setProgress(gapBar, elapsed / duration);

        if (elapsed >= duration) {
            setProgress(gapBar, 1);
            animationFrameId = null;
            animationMode = null;
            return;
        }
    } else {
        animationFrameId = null;
        return;
    }

    animationFrameId = requestAnimationFrame(animateMeters);
}

function stopMeterAnimation() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    animationMode = null;
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
let previewElement = null;
let previewNode = null;
let activeLights = [];

let letterTimer = null;
let wordTimer = null;

let animationFrameId = null;
let animationMode = null;
let gapStart = null;

const BAR_WIDTH = 500;
let pressBar;
let gapBar;

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

    // Timer Bars
    pressBar = document.getElementById("press-meter").contentDocument.getElementById("BAR");
    pressBar.setAttribute("width", 0);

    gapBar = document.getElementById("gap-meter").contentDocument.getElementById("BAR");
    gapBar.setAttribute("width", 0);

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
        showPreview(currentNode.dot);
        activePointerId = event.pointerId;

        // Capture pointer so release outside button is detected
        button.setPointerCapture(event.pointerId);

        startTone();

        // Animate bars
        setProgress(pressBar, 0);
        setProgress(gapBar, 0);

        gapStart = null;
        animationMode = "press";
        startMeterAnimation();
    });

    button.addEventListener("pointerup", (event) => {
        if (pressStart === null) return;
        if (event.pointerId !== activePointerId) return;

        const duration = performance.now() - pressStart;

        pressStart = null;
        clearPreview();
        activePointerId = null;

        stopTone();

        // Leave the press meter showing the completed press.
        setProgress(pressBar, duration / (TIME_UNIT * 3));

        const symbol = duration < TIME_UNIT * 2 ? "." : "-";

        processSymbol(symbol);

        // Start measuring silence.
        gapStart = performance.now();
        animationMode = "gap";
        setProgress(gapBar, 0);
        startMeterAnimation();
    });

    button.addEventListener("pointercancel", () => {
        pressStart = null;
        activePointerId = null;

        stopTone();
        clearPreview();

        setProgress(pressBar, 0);
        setProgress(gapBar, 0);
        gapStart = null;

        resetInput();
    });

    // Initialize SVG lights
    resetLights();
}


// The window load event waits for the embedded SVG to load too.
window.addEventListener("load", firstLoad, {
    once: true
});
