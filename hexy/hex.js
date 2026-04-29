function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const name = file.name;
    const size = file.size;

    var reader = new FileReader();

    reader.onload = function(e) {
        processFile(name, size, reader.result);
    }

    reader.readAsArrayBuffer(file);
}

function processFile(name, size, results) {
    document.getElementById("hextitle").innerHTML = name;
    document.getElementById("hexsize").innerHTML = size;

    buffer = new Uint8Array(results);
    render();
}

function render() {
    const bw = byteWidth.value;
    const gw = groupWidth.value;

    const lineContainer  = document.getElementById("hexline");
    const hexContainer   = document.getElementById("hexdata");
    const asciiContainer = document.getElementById("ascii");

    lineContainer.innerHTML = "";
    hexContainer.innerHTML = "";
    asciiContainer.innerHTML = "";

    let lines = 0;

    let lineLine;
    let hexGroup;
    let hexLine;
    let asciiLine;
    let start = Number(startOffset.value);
    let end = buffer.length - start;

    for (i=0; i<=end; i++) {
        // Handle new lines after appropriate number of bytes
        if (i % bw == 0) {
            if (i != 0) {
		if (hexGroup.innerHTML != "") {
		    hexLine.appendChild(hexGroup);
		}

                lineContainer.appendChild(lineLine);
                hexContainer.appendChild(hexLine);
                asciiContainer.appendChild(asciiLine);

                lines += 1;
            }
            lineLine = document.createElement('p');
            lineLine.innerHTML = "0x"+intToPaddedHex(i, 8)+"  ";

            hexLine = document.createElement('p');
            hexGroup = document.createElement('span');
            hexGroup.classList.add("group");
            asciiLine = document.createElement('p');

	    if (i == end) {
		break;
	    }
        }

	// Get Offset Value
	const offset = i + start;
	const byteValue = buffer[offset];

        // Get our ASCII value
        let asciiChar = ".";
        if (byteValue <= "~".charCodeAt(0) && byteValue >= " ".charCodeAt(0))
            asciiChar = String.fromCharCode(byteValue);

        // Title text
        let byteTitle = formatTitleText(offset, byteValue, asciiChar);

        // Class type
        const byteClass = formatByteClass(byteValue);

        // Create our hex Byte
        let hexElement = document.createElement('span');
        hexElement.innerHTML = intToPaddedHex(byteValue, 2);
        hexElement.title = byteTitle;
	if (colorize.checked == true)
            hexElement.classList.add(byteClass);

        // Group hex bytes into span
        hexGroup.appendChild(hexElement);
        if ((i+1) % gw == 0) {
	    hexLine.appendChild(hexGroup);
            hexGroup = document.createElement('span');
            hexGroup.classList.add("group");
        }

        // Create our ascii element
        const asciiElement = document.createElement('span');
        asciiElement.innerHTML = asciiChar;
        asciiElement.title = byteTitle;
	if (colorize.checked == true)
	    asciiElement.classList.add(byteClass);

        asciiLine.appendChild(asciiElement);
    }

    // Pad remaining data -- Not necessary?
    // while (i % bw != 0) {
    //     hexOutput += "  ";
    //     if ((i+1) % gw == 0)
    //         hexOutput += " ";
    //     i++;
    //        }

    lineContainer.appendChild(lineLine);
    hexContainer.appendChild(hexLine);
    asciiContainer.appendChild(asciiLine);
}

function intToPaddedHex(i, p){
    if (i == undefined) return 0;
    var s = i.toString(16).toUpperCase();
    while (s.length < p)
        s = "0" + s;
    return s;
}

function formatTitleText(i, v, c) {
    let vs = "??";
    if (v != undefined)
	vs = `${v} (0x${v.toString(16)})`;

    let is = "??";
    if (is != undefined)
	is = `${i} (0x${i.toString(16)})`;

    const newline = '\n';

    return `offset: ${is}${newline}value: ${vs}${newline}ascii: "${c}"`;
}

function formatByteClass(v) {
    if (v < 0x10) return "class_00";
    if (v < 0x20) return "class_10";
    if (v < 0x30) return "class_20";
    if (v < 0x40) return "class_30";
    if (v < 0x50) return "class_40";
    if (v < 0x60) return "class_50";
    if (v < 0x70) return "class_60";
    if (v < 0x80) return "class_70";
    if (v < 0x90) return "class_80";
    if (v < 0xA0) return "class_90";
    if (v < 0xB0) return "class_A0";
    if (v < 0xC0) return "class_B0";
    if (v < 0xD0) return "class_C0";
    if (v < 0xE0) return "class_D0";
    if (v < 0xF0) return "class_E0";
    if (v < 0x100) return "class_F0";
}


function populateTestData() {
    const n = "Test Data";
    const s = "1234"

    const results = new Uint8Array([
	0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
	10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
	20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
	30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
	40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
	50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
	60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
	70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
	80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
	90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
	100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
	110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
	120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
	130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
	140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
	150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
	160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
	170, 171, 172, 173, 174, 175, 176, 177, 178, 179,
	180, 181, 182, 183, 184, 185, 186, 187, 188, 189,
	190, 191, 192, 193, 194, 195, 196, 197, 198, 199,
	200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
	210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
	220, 221, 222, 223, 224, 225, 226, 227, 228, 229,
	230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
	240, 241, 242, 243, 244, 245, 246, 247, 248, 249,
	250, 251, 252, 253, 254, 255,
    ]);

    processFile(n, s, results);
}

function verifyInput(element) {
    element.classList.remove("invalid")
    const valueString = element.value;

    // Convert to number
    const valueInteger = Number(valueString);

    // Check if its valid
    if (isNaN(valueInteger)) {
	element.classList.add("invalid")
    } else {
	render();
    }
}

let colorize;
let buffer;
let byteWidth;
let groupWidth;
let startOffset;

function firstLoad() {
    // File Input Support
    const input = document.getElementById("fileInput");
    input.addEventListener("change", handleFileUpload);

    colorize = document.getElementById("colorize");
    colorize.oninput = () => { render(); };

    byteWidth = document.getElementById("byteWidth");
    byteWidth.onchange = () => { render(); };

    groupWidth = document.getElementById("groupWidth");
    groupWidth.onchange = () => { render(); };

    startOffset = document.getElementById("startOffset");
    startOffset.oninput = () => { verifyInput(startOffset); };

    // DEBUG
    populateTestData();
}

window.onload = function() {
    firstLoad();
};
