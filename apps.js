const COMPLETE    = 1;
const IDEA        = 2;
const DEVELOPMENT = 3;

const apps = [
    { "name" : "3-Tris",               "location" : "tetriscubed",             "category" : "Games",     "icon" : "icon_3tris",     "status" : COMPLETE,    "description" : "Top-down 3D Tetris-style game. It's very much inspired by the old Macintosh game 3Tris/3Wiz! " },
    { "name" : "3072",                 "location" : "3072",                    "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "A game like 2048, but with hexagons!" },
    { "name" : "8-Ball",               "location" : "8ball/",                  "category" : "Toys",      "icon" : "icon_8ball",     "status" : COMPLETE,    "description" : "Eons ago, I made a digital Magic 8-Ball using Bryce, Photoshop, and Illustrator, then made it work using server-side include commands. This is a re-implementation using SVG and Javascript." },
    { "name" : "Arc",                  "location" : "arc",                     "category" : "Misc",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "Calculate the trajectory of arcs" },
    { "name" : "Arkanoid 2 Editor",    "location" : "arkanoid",                "category" : "Utilities", "icon" : "icon_missing",   "status" : IDEA,        "description" : "Arkanoid level editor" },
    { "name" : "Ball Simulator",       "location" : "balls",                   "category" : "Toys",      "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Ball phsyics simulation" },
    { "name" : "Barcode Generator",    "location" : "barcode",                 "category" : "Utilities", "icon" : "icon_barcode",   "status" : COMPLETE,    "description" : "A simple barcode 128 generator using Javascript and an HTML canvas." },
    { "name" : "Bayes",                "location" : "bayes",                   "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Interactive bayes demonstration for understanding statistics" },
    { "name" : "Bezier",               "location" : "bezier",                  "category" : "Toys",      "icon" : "icon_bezier",    "status" : COMPLETE,    "description" : "Bezier Curve Demo that visually shows how b&eacute; curves are constructed." },
    { "name" : "Binary",               "location" : "binary",                  "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Simple binary converter" },
    { "name" : "Boaty",                "location" : "boaty",                   "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "Guide boats to their docks safely" },
    { "name" : "Boing",                "location" : "boing/",                  "category" : "Toys",      "icon" : "icon_boing",     "status" : COMPLETE,    "description" : "A reimagining of the classic Amiga Boing demo app using SVG. The rotation is done by color cycling just like the original." },
    { "name" : "BoogieBoardy",         "location" : "boogie",                  "category" : "Toys",      "icon" : "icon_boogie",    "status" : COMPLETE,    "description" : "Basic drawing for kids, just like a real Boogie Board" },
    { "name" : "Bricky",               "location" : "bricks/",                 "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "Breakout type game" },
    { "name" : "Bubbly",               "location" : "bubble/",                 "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "Puzzle Bobble style game" },
    { "name" : "CandyRain",            "location" : "candyrain",               "category" : "Games",     "icon" : "icon_candyrain", "status" : COMPLETE,    "description" : "Good and Plenties are so good they deserve their own game" },
    { "name" : "Cheatle",              "location" : "cheatle",                 "category" : "Utilities", "icon" : "icon_cheatle",   "status" : COMPLETE,    "description" : "Tired of not winning at Wordle? Use Cheatle to help suss out the words you just can't get." },
    { "name" : "Circle Illusion",      "location" : "circle",                  "category" : "Toys",      "icon" : "icon_circle",    "status" : COMPLETE,    "description" : "The appearance of a circle generated with only linear motion" },
    { "name" : "CircleMan",            "location" : "circleman",               "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "Move CircleMan around in his circular world" },
    { "name" : "Clue Sheet",           "location" : "clue",                    "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Digital clue sheet for the board game, Clue" },
    { "name" : "Codey",                "location" : "codey/",                  "category" : "Games",     "icon" : "icon_codey",     "status" : COMPLETE,    "description" : "Guess the color code within 10 guesses to win!" },
    { "name" : "Color Survey",         "location" : "color",                   "category" : "Toys",      "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Identify colors to see where you precieve one color to start and the other to end." },
    { "name" : "DNA",                  "location" : "dna",                     "category" : "Toys",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "Simple model of a DNA strand" },
    { "name" : "DTMF Simulator",       "location" : "dtmf",                    "category" : "Toys",      "icon" : "icon_dtmf",      "status" : COMPLETE,    "description" : "Generate dual tone signals like the good old days" },
    { "name" : "DVD Screensaver",      "location" : "dvd",                     "category" : "Toys",      "icon" : "icon_dvd",       "status" : COMPLETE,    "description" : "A reimagining of the classic DVD screensaver" },
    { "name" : "Day Calculator",       "location" : "date",                    "category" : "Misc",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "Calculate the day of the week using Lewis Carrol's method" },
    { "name" : "DecimalTime",          "location" : "decimaltime/",            "category" : "Misc",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "The calendar should be made of 13 28 day months, and days should just have 10 hours. Here's what time it would be." },
    { "name" : "Dicey",                "location" : "dicey",                   "category" : "Games",     "icon" : "icon_dicey",     "status" : COMPLETE,    "description" : "Dicey is a familiar dice game where you score points by rolling various combinations using 5 dice." },
    { "name" : "Dots",                 "location" : "dots",                    "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "The classic game of making squares from dots" },
    { "name" : "Ephemidraw",           "location" : "draw",                    "category" : "Toys",      "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Drawing, but ephemerally" },
    { "name" : "Etchy",                "location" : "etch",                    "category" : "Toys",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "Digital Etch-a-Sketch implementation" },
    { "name" : "Cone Test",            "location" : "eyetest/cone.html",       "category" : "Medical",   "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Eye test that checks for cone sensitivity to red, green, and blue wavelengths. Novelty use only, not to be used as a diagnosis tool." },
    { "name" : "Peripheral Test",      "location" : "eyetest/peripheral.html", "category" : "Medical",   "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Eye test that checks for peripheral vision sensitivity. Novelty use only, not to be used as a diagnosis tool." },
    { "name" : "Ishihara Test",        "location" : "eyetest/color.html",      "category" : "Medical",   "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Randomly generated Ishihara images for testing Red/Green color blindness. Novelty use only, not to be used as a diagnosis tool." },
    { "name" : "Game Of Life",         "location" : "life",                    "category" : "Toys",      "icon" : "icon_gol",       "status" : COMPLETE,    "description" : "Conway's classic game of life built using Javascript and HTML5 canvas." },
    { "name" : "GameBoy",              "location" : "gameboy/",                "category" : "Utilities", "icon" : "icon_missing",   "status" : IDEA,        "description" : "Gameboy emulator (someday)" },
    { "name" : "Groups",               "location" : "groups",                  "category" : "Games",     "icon" : "icon_groups",    "status" : COMPLETE,    "description" : "Find groups of 3 cards whose characterstics are either all the same, or all different. The game ends when all the cards are gone." },
    { "name" : "Hexdoku",              "location" : "hexdoku/",                "category" : "Games",     "icon" : "icon_missing",   "status" : IDEA,        "description" : "Sudoku using hex digits in a 16 x 16 square" },
    { "name" : "Hopeless",             "location" : "hopeless",                "category" : "Games",     "icon" : "icon_hopeless",  "status" : COMPLETE,    "description" : "A puzzle game where you try remove all the blocks by clicking on groups of more than 2. This was an exercize in getting familiar with the canvas." },
    { "name" : "Hue're Adorable",      "location" : "huey/",                   "category" : "Games",     "icon" : "icon_hue",       "status" : COMPLETE,    "description" : "A simple game where you reconstruct a gradient that's been split into pieces and shuffled." },
    { "name" : "Icony",                "location" : "icony/",                  "category" : "Utilities", "icon" : "icon_icony",     "status" : DEVELOPMENT, "description" : "Draw pixelated icons as if you are using ResEdit!" },
    { "name" : "LCARS Clock",          "location" : "lcars",                   "category" : "Utilities", "icon" : "icon_lcars",     "status" : COMPLETE,    "description" : "The LCARS clock is a simple clock and weather viewer using the Star Trek TNG LCARS aesthetic. You can read about building it on my blog." },
    { "name" : "LDS Typing Practice",  "location" : "typing",                  "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Practice typing while learning cripture mastery verses" },
    { "name" : "Lights Out",           "location" : "lightsout",               "category" : "Games",     "icon" : "icon_lightsout", "status" : COMPLETE,    "description" : "The standard puzzle game where you attempt to turn off all the lights by pressing buttons." },
    { "name" : "Mandley",              "location" : "mandelbrot/",             "category" : "Toys",      "icon" : "icon_mandley",   "status" : COMPLETE,    "description" : "A rudimentary Mandelbrot fractal explorer built using the canvas and javascript." },
    { "name" : "Math",                 "location" : "math",                    "category" : "Utilities", "icon" : "icon_math",      "status" : COMPLETE,    "description" : "Math Flashcards for Addition, Subtraction, Division, and Multiplication facts" },
    { "name" : "Maze Generator",       "location" : "maze",                    "category" : "Utilities", "icon" : "icon_maze",      "status" : COMPLETE,    "description" : "A small utility to create mazes of various sizes. Results can be saved as PNGs." },
    { "name" : "Miney",                "location" : "mines",                   "category" : "Games",     "icon" : "icon_miney",     "status" : COMPLETE,    "description" : "A reinvention of the classic Minesweeper. Nothing fancy!" },
    { "name" : "Multiplayer Snakey",   "location" : "snake/snake4.html",       "category" : "Games",     "icon" : "icon_snakey",    "status" : DEVELOPMENT, "description" : "4 Player version fo Snakey" },
    { "name" : "N-Tris",               "location" : "ntris/",                  "category" : "Games",     "icon" : "icon_ntris",     "status" : COMPLETE,    "description" : "Tetris clone that uses all possible shapes using up to 5 blocks." },
    { "name" : "N^2-Tris",             "location" : "nntris",                  "category" : "Games",     "icon" : "icon_ntris",     "status" : DEVELOPMENT, "description" : "Play N-Tris head-to-head locally on the same computer" },
    { "name" : "Nomis",                "location" : "nomis",                   "category" : "Games",     "icon" : "icon_nomis",     "status" : COMPLETE,    "description" : "You had better do what Nomis says in this classic game of repeating button presses" },
    { "name" : "Paint Mixer",          "location" : "paintmixer/",             "category" : "Toys",      "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Mix CMYK paints to make new colors!" },
    { "name" : "Poll",                 "location" : "poll/",                   "category" : "Utilities", "icon" : "icon_missing",   "status" : IDEA,        "description" : "Simple polling with bars that update as you tally votes" },
    { "name" : "Radical",              "location" : "radical",                 "category" : "Games",     "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Space fighting game meant to resemble the 80's game, Awesome" },
    { "name" : "Reflections",          "location" : "reflections",             "category" : "Misc",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "A study in how lines reflect" },
    { "name" : "Runes",                "location" : "runes",                   "category" : "Utilities", "icon" : "icon_runes",     "status" : COMPLETE,    "description" : "Interactive guide for solving the Phasmophobia rune puzzle" },
    { "name" : "SIRDSy",               "location" : "sirdsy",                  "category" : "Utilities", "icon" : "icon_sirdsy",    "status" : COMPLETE,    "description" : "A Single Image Random Dot Stereogram (SIRDS) generator. You can make custom images by uploading black and white depth maps and textures. Results can be saved as PNGs." },
    { "name" : "Saw Display",          "location" : "saw",                     "category" : "Misc",      "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Graphical display for panel saw project." },
    { "name" : "Scattergories",        "location" : "scattergories",           "category" : "Games",     "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Simple method to play Scategories without purchasing the game!" },
    { "name" : "Scramble",             "location" : "scramble",                "category" : "Games",     "icon" : "icon_scramble",  "status" : COMPLETE,    "description" : "A word game based on finding words using 9 tiles. See how many words you can find in 3 minutes!" },
    { "name" : "Signal",               "location" : "signal",                  "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "An attempt at creating a signal generator" },
    { "name" : "Sine",                 "location" : "sine",                    "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "See how a sine relates to a circle" },
    { "name" : "Snakey",               "location" : "snake",                   "category" : "Games",     "icon" : "icon_snakey",    "status" : COMPLETE,    "description" : "Reimplementation of the classic snake game using appropriated sprites in javascript." },
    { "name" : "Sorry Cards",          "location" : "sorry",                   "category" : "Utilities", "icon" : "icon_sorry",     "status" : COMPLETE,    "description" : "Infinite sorry cards so there is no more need to shuffle the deck 20 times per game!" },
    { "name" : "Sorty",                "location" : "sorty",                   "category" : "Toys",      "icon" : "icon_sorty",     "status" : COMPLETE,    "description" : "Demonstration that attempts to animate various methods of sorting arrays." },
    { "name" : "Speech Timer",         "location" : "tmtimer",                 "category" : "Utilities", "icon" : "icon_timer",     "status" : COMPLETE,    "description" : "This is a speech timer made for my local Toastmasters International club. It provides the speaker with a visual indication of when the speech should be completed." },
    { "name" : "Stary",                "location" : "stars",                   "category" : "Toys",      "icon" : "icon_stary",     "status" : COMPLETE,    "description" : "A star simulator that replicates the experience of looking out of a ship's viewport while traveling at warp speed." },
    { "name" : "Sudoku",               "location" : "sudoku",                  "category" : "Utilities", "icon" : "icon_sudoku",    "status" : COMPLETE,    "description" : "A Sudoku puzzle creator and solver utility." },
    { "name" : "Sun and Moon",         "location" : "sunmoon/",                "category" : "Misc",      "icon" : "icon_missing",   "status" : IDEA,        "description" : "Experimental clock that shows sun and moon rises based on your location." },
    { "name" : "Topic Spinner",        "location" : "topicspinners/",          "category" : "Utilities", "icon" : "icon_missing",   "status" : DEVELOPMENT, "description" : "Tool for randomly generating Table Topics for Toastmaster meetings." },
    { "name" : "Word Finder",          "location" : "words",                   "category" : "Utilities", "icon" : "icon_words",     "status" : COMPLETE,    "description" : "Find words based on given letters. Developed to help solve the Spelling Bee" },
    { "name" : "Wordy",                "location" : "wordy",                   "category" : "Games",     "icon" : "icon_wordy",     "status" : COMPLETE,    "description" : "Wordy is a familiar puzzle game where you have to make words by connecting adjacent letters in a grid." },
];

function compare(a, b){
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function populate_apps(div, prefix, show_unreleased=false){
    // Clear out div first
    div.innerHTML = "";

    for (let status of [COMPLETE, DEVELOPMENT, IDEA]) {
        if (status > COMPLETE) {
            if (!show_unreleased)
                break;
            let unreleased_title = document.createElement("h1");
            unreleased_title.innerHTML = status == DEVELOPMENT ? "In Development" : "Ideas";
            div.appendChild(unreleased_title);
        }

        // Find all the populated categories
        let categories = [];
        for (let app of apps) {
            if (status != app.status)
                continue;
            if (!categories.includes(app.category))
                categories.push(app.category);
        }

        for (let category_string of categories){
            let category = document.createElement("div");
            category.classList.add("category");

            let category_title = document.createElement("h2");
            category_title.classList.add("category_title");
            category_title.innerHTML = category_string;
            category.appendChild(category_title);

            apps.sort(compare);

            for (let app of apps){
                if (app.category != category_string)
                    continue;

                if (status != app.status)
                    continue;

                let link = document.createElement("a");
                link.href = prefix+app.location;

                let div = document.createElement("div");
                div.classList.add("app")

                let icon = document.createElement("img");
                icon.classList.add("icon");
                icon.src = prefix+"icons/"+app.icon+"_256.png";

                let title = document.createElement("h2");
                title.classList.add("title");
                title.innerHTML = app.name

                let description = document.createElement("p");
                description.classList.add("description");
                description.innerHTML = app.description;

                link.appendChild(icon);
                link.appendChild(title);
                div.appendChild(link);
                div.appendChild(description);
                category.appendChild(div);
            }

            div.appendChild(category);
        }
    }
}
