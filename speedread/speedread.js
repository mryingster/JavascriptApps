function firstLoad() {
    // Accordion behavior
    document.querySelectorAll(".accordion-header").forEach(button => {
	button.addEventListener("click", () => {
            const section = button.parentElement;
            section.classList.toggle("open");
	});
    });

    textInput = document.getElementById("text-input");
    textInput.oninput = () => { updateTextBuffer(); };

    // Populate controls
    speedSelect = document.getElementById("speedSelect");
    for (let wpm = 100; wpm <= 1000; wpm += 100) {
	const option = document.createElement("option");
	option.value = wpm;
	option.textContent = wpm;
	speedSelect.appendChild(option);
    }
    speedSelect.oninput = () => { updateSettings(); };

    fontSelect = document.getElementById("fontSelect");
    fonts.forEach(font => {
	const option = document.createElement("option");
	option.value = font;
	option.textContent = font.split(",")[0];
	fontSelect.appendChild(option);
    });
    fontSelect.oninput = () => { updateSettings(); };

    themeSelect = document.getElementById("themeSelect");
    Object.keys(themes).forEach(themeName => {
	const option = document.createElement("option");
	option.value = themeName;
	option.textContent = themeName;
	themeSelect.appendChild(option);
    });
    themeSelect.oninput = () => { updateSettings(); };

    rampSpeedInput = document.getElementById("rampSpeed");
    rampSpeedInput.oninput = () => { updateSettings(); };

    showFocalInput = document.getElementById("showFocalPoint");
    showFocalInput.oninput = () => { updateSettings(); };

    // Live CSS updates
    fontSelect.addEventListener("change", e => {
	document.documentElement.style.setProperty(
            "--font-family",
            e.target.value
	);
    });

    themeSelect.addEventListener("change", e => {
	const theme = themes[e.target.value];
	document.documentElement.style.setProperty("--bg-color", theme.bg);
	document.documentElement.style.setProperty("--text-color", theme.text);
	document.documentElement.style.setProperty("--accent-color", theme.accent);
	document.documentElement.style.setProperty("--border-color", theme.border);
    });

    // Canvas placeholder
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    function resizeCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0,0,0,0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resizeCanvas);


    // Canvas input
    canvas.addEventListener('mousedown', function(e) {
	mouse_down = getCursorPosition(canvas, e);
	renderCanvas();
    });

    canvas.addEventListener('mousemove', function(e) {
	const position = getCursorPosition(canvas, e);

	// On-screen controls
	if (position.x < canvas.width * 1/4) {	// Backwards
	    canvasButtonMode = BACK;
	} else if (position.x > canvas.width * 3/4) { // Forwards
	    canvasButtonMode = SKIP;
	} else if (position.y < canvas.height * 1/4) {
	    canvasButtonMode = ACCEL;
	} else if (position.y > canvas.height * 3/4) {
	    canvasButtonMode = DECEL;
	} else { // Play / Pause
	    canvasButtonMode = PLAY;
	}

	// Control Bar
	if (position.y > canvas.height - controlBar.max) {
	    canvasButtonMode = BAR;
	    if (mouse_down) {
		scrub(position.x);
	    }
	}

	renderCanvas();
    });

    canvas.addEventListener('mouseup', function(e) {
	if (mouse_down == false) return;
	mouse_down = getCursorPosition(canvas, e);

	switch (canvasButtonMode) {
	case BACK:
	    currentWordIndex = Math.max(0, currentWordIndex - 20);
	    break;
	case SKIP:
	    currentWordIndex = Math.min(textBufferLength, currentWordIndex + 20);
	    break;
	case ACCEL:
	    changeSpeed(+100);
	    break;
	case DECEL:
	    changeSpeed(-100);
	    break;
	case PLAY:
	    togglePause();
	    break;
	case BAR:
	    scrub(mouse_down.x);
	    break;
	default:
	    break;
	}
	mouse_down = false;
	renderCanvas();
    });

    canvas.addEventListener('mouseleave', function(e) {
	mouse_down = false;
	canvasButtonMode = NONE;
	renderCanvas();
    });

    updateSettings();
    updateTextBuffer();
    resizeCanvas();
}

function getCursorPosition(canvas, event) {
    // Determine where clicked
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x:x, y:y};
}

function updateTextBuffer() {
    textBuffer = textInput.value.trim().split(/\s+/);
    textBufferLength = textBuffer.length;
    if (currentWordIndex > textBufferLength)
	currentWordIndex = textBufferLength;
}

function changeSpeed(s) {
    settings.targetWpm += s;
    if (settings.targetWpm < 100)
	settings.targetWpm = 100;
    if (settings.targetWpm > 1000)
	settings.targetWpm = 1000;

    settings.targetSpeed = wpmToMs(settings.targetWpm);

    // TODO - Update the interface with new setting
}

function wpmToMs(wpm) {
    return 1000 * 60 / wpm;
}

function updateSettings() {
    settings.targetWpm = Number(speedSelect.value);

    // Convert to MS per word
    settings.targetSpeed = wpmToMs(Number(speedSelect.value));

    settings.font = fontSelect.value;
    settings.theme = themes[themeSelect.value];
    settings.rampSpeed = rampSpeedInput.checked;
    settings.showFocal = showFocalInput.checked;

    if (!settings.rampSpeed)
	settings.currentSpeed = settings.targetSpeed;

    if (textBuffer != undefined)
	renderCanvas();
}

function togglePause() {
    paused = !paused;
    if (!paused) {
	if (settings.rampSpeed)
	    settings.currentSpeed = 100;
	if (currentWordIndex > textBufferLength)
	    currentWordIndex = 0;
	mainLoop(undefined);
    }
}

function scrub(p) {
    let percent = p / canvas.width;
    currentWordIndex = Math.floor(percent * textBufferLength);
}

function renderCanvas() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw word
    ctx.fillStyle = settings.theme.text;
    ctx.font = `50px ${settings.font}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(textBuffer[currentWordIndex], canvas.width/2, canvas.height/2);

    // Draw focal point
    if (settings.showFocal) {
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, canvas.height / 2);
	ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2*Math.PI);
	ctx.fillStyle = settings.theme.accent;
	ctx.fill();
    }

    // Draw control overlays
    ctx.fillStyle = settings.theme.overlay;
    ctx.font = `30px ${settings.font}`;

    switch (canvasButtonMode) {
    case BACK:
	ctx.fillText("-20", canvas.width * 1/8, canvas.height / 2);
	break;
    case SKIP:
	ctx.fillText("+20", canvas.width * 7/8, canvas.height / 2);
	break;
    case ACCEL:
	ctx.fillText("Faster", canvas.width * 1/2, canvas.height * 1/8);
	break;
    case DECEL:
	ctx.fillText("Slower", canvas.width * 1/2, canvas.height * 7/8);
	break;
    case PLAY:
	if (paused) {
	    ctx.moveTo(canvas.width/2, canvas.height/2);
	    ctx.beginPath();
	    ctx.lineTo(canvas.width/2 + 25, canvas.height/2);
	    ctx.lineTo(canvas.width/2 - 25, canvas.height/2 - 25);
	    ctx.lineTo(canvas.width/2 - 25, canvas.height/2 + 25);
	    ctx.fill();
	} else {
	    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 15, 50);
	    ctx.fillRect(canvas.width / 2 + 10, canvas.height / 2 - 25, 15, 50);
	}
	break;
    default:
	break;
    }

    // Draw timer
    let percent = currentWordIndex / textBufferLength;
    ctx.fillStyle = settings.theme.border;
    ctx.fillRect(0, canvas.height - controlBar.current, canvas.width, controlBar.current);
    ctx.fillStyle = settings.theme.accent;
    ctx.fillRect(0, canvas.height - controlBar.current, percent * canvas.width, controlBar.current);
}

function mainLoop(timestamp) {
    if (paused) return;

    // Detrmine how many MS it's been
    if (last_frame === undefined) {
        last_frame = timestamp;
    }

    const elapsed = timestamp - last_frame;
    last_frame = timestamp;

    // Increment word
    if (!isNaN(elapsed))
	elapsedWordDisplay += elapsed;
    if (elapsedWordDisplay > settings.currentSpeed) {
	currentWordIndex++;
	elapsedWordDisplay -= settings.currentSpeed;
    }
    renderCanvas();

    // Ramp speed - (Linear) This should be improved
    if (settings.rampSpeed) {
	if (settings.currentSpeed < settings.targetSpeed)
	    settings.currentSpeed += 5;
	else
	    settings.currentSpeed -= 5;

    } else {
	settings.currentSpeed = settings.targetSpeed;
    }

    if (currentWordIndex >= textBufferLength) {
	togglePause();
	return;
    }

    // Animate control bar
    if (canvasButtonMode == BAR) {
	if (controlBar.current < controlBar.max)
	    controlBar.current = Math.min(controlBar.current + elapsed * .05, controlBar.max);
    } else {
	if (controlBar.current > controlBar.min)
	    controlBar.current = Math.max(controlBar.current - elapsed * .05, controlBar.min);
    }

    // Call next loop
    window.requestAnimationFrame((t) => mainLoop(t));
}

const fonts = [
    "Arial, Helvetica, sans-serif",
    "Verdana, Geneva, sans-serif",
    "Tahoma, Geneva, sans-serif",
    "Trebuchet MS, Helvetica, sans-serif",
    "Times New Roman, Times, serif",
    "Georgia, serif",
    "Courier New, Courier, monospace",
    "Lucida Console, Monaco, monospace"
];

const themes = {
    "High Contrast Light": {
        bg: "#ffffff",
        text: "#000000",
        accent: "#0000ff",
        border: "#000000",
	overlay: "rgba(0, 0, 0, .5)"
    },
    "High Contrast Dark": {
        bg: "#000000",
        text: "#ffffff",
        accent: "#00ffff",
        border: "#ffffff",
	overlay: "rgba(255, 255, 255, .5)"
    },
    "Low Contrast Light": {
        bg: "#f4f4f4",
        text: "#333333",
        accent: "#6666ff",
        border: "#dddddd",
	overlay: "rgba(60, 60, 60, .5)"
    },
    "Low Contrast Dark": {
        bg: "#1e1e1e",
        text: "#cccccc",
        accent: "#8888ff",
        border: "#444444",
	overlay: "rgba(200, 200, 200, .5)"
    },
    "Warm Dark": {
        bg: "#1b1b1b",
        text: "#f2e6d8",
        accent: "#ffb347",
        border: "#5a4a3a",
	overlay: "rgba(200, 200, 100, .5)"
    }
};

let canvas;
let ctx;

let mouse_down = false;
let last_frame;
let paused = true;

let textBuffer;
let currentWordIndex = 0;
let textBufferLength = 1;
let elapsedWordDisplay = 0;
let canvasButtonMode;

const controlBar = {
    max: 20,
    current: 5,
    min: 5,
};
const NONE  = 0;
const BACK  = 1;
const PLAY  = 2;
const SKIP  = 3;
const BAR   = 4;
const ACCEL = 5;
const DECEL = 6;

let settings = {
    targetWpm: 0,
    currentSpeed: 0,
    targetSpeed: 0,
    font: "",
    theme: "",
    rampSpeed: false,
    showFocal: false,
};

let speedSelect;
let fontSelect;
let themeSelect;
let textInput;
let showFocalInput;
let rampSpeedInput;

window.onload = function() {
    firstLoad();
};
