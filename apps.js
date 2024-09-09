const apps = [
    { "name" : "3-Tris",               "location" : "tetriscubed",       "category" : "Games",     "icon" : "icon_3tris",     "finished" : true,  "description" : "Top-down 3D Tetris-style game. It's very much inspired by the old Macintosh game 3Tris/3Wiz! ",                                                                                                  },
    { "name" : "3072",                 "location" : "3072",              "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "A game like 2048, but with hexagons!",                                                                                                                                                                  },
    { "name" : "8-Ball",               "location" : "8ball/",            "category" : "Toys",      "icon" : "icon_8ball",     "finished" : true,  "description" : "Eons ago, I made a digital Magic 8-Ball using Bryce, Photoshop, and Illustrator, then made it work using server-side include commands. This is a re-implementation using SVG and Javascript.",        },
    { "name" : "Arc",                  "location" : "arc",               "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "Calculate the trajectory of arcs",                                                                                                                                                                        },
    { "name" : "Arkanoid 2 Editor",    "location" : "arkanoid",          "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Arkanoid level editor",                                                                                                                                                                         },
    { "name" : "Ball Simulator",       "location" : "balls",             "category" : "Toys",      "icon" : "icon_missing",   "finished" : false, "description" : "Ball Simulation",                                                                                                                                                                                     },
    { "name" : "Barcode Generator",    "location" : "barcode",           "category" : "Utilities", "icon" : "icon_barcode",   "finished" : true,  "description" : "A simple barcode 128 generator using Javascript and an HTML canvas.",                                                                                                                   },
    { "name" : "Bayes",                "location" : "bayes",             "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Interactive bayes demonstration for understanding statistics",                                                                                                                                        },
    { "name" : "Bezier",               "location" : "bezier",            "category" : "Toys",      "icon" : "icon_bezier",    "finished" : true,  "description" : "Bezier Curve Demo",                                                                                                                                                                                  },
    { "name" : "Binary",               "location" : "binary",            "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Simple binary converter",                                                                                                                                                                           },
    { "name" : "Boaty",                "location" : "boaty",             "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Guide boats to their docks safely",                                                                                                                                                                   },
    { "name" : "Boing",                "location" : "boing/",            "category" : "Toys",      "icon" : "icon_boing",     "finished" : true,  "description" : "A reimagining of the classic Amiga Boing demo app using SVG. The rotation is done by color cycling just like the original.",                                                                           },
    { "name" : "BoogieBoardy",         "location" : "boogie",            "category" : "Toys",      "icon" : "icon_boogie",    "finished" : true,  "description" : "Basic drawing for kids, just like a real Boogie Board",                                                                                                                                        },
    { "name" : "Bricky",               "location" : "bricks/",           "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Breakout type game" },
    { "name" : "Bubbly",               "location" : "bubble/",           "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Puzzle Bobble style game" },
    { "name" : "CandyRain",            "location" : "candyrain",         "category" : "Games",     "icon" : "icon_candyrain", "finished" : false, "description" : "Good and Plenties are so good they deserve their own game",                                                                                                                                 },
    { "name" : "Cheatle",              "location" : "cheatle",           "category" : "Utilities", "icon" : "icon_cheatle",   "finished" : true,  "description" : "Tired of not winning at Wordle? Use Cheatle to help suss out the words you just can't get.",                                                                                                      },
    { "name" : "Circle Illusion",      "location" : "circle",            "category" : "Toys",      "icon" : "icon_circle",    "finished" : true,  "description" : "The appearance of a circle generated with only linear motion",                                                                                                                              },
    { "name" : "CircleMan",            "location" : "circleman",         "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Move CircleMan around in his circular world",                                                                                                                                                 },
    { "name" : "Clue Sheet",           "location" : "clue",              "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Digital clue sheet for the board game, Clue",                                                                                                                                                     },
    { "name" : "Codey",                "location" : "mastermind/",       "category" : "Games",     "icon" : "icon_codey",     "finished" : true,  "description" : "Guess the color code within 10 guesses to win!",                                                                                                                                                  },
    { "name" : "Color Survey",         "location" : "color",             "category" : "Toys",      "icon" : "icon_missing",   "finished" : false, "description" : "Name the colors",                                                                                                                                                                              },
    { "name" : "DNA",                  "location" : "dna",               "category" : "Toys",      "icon" : "icon_missing",   "finished" : false, "description" : "Simple model of a DNA strand",                                                                                                                                                                            },
    { "name" : "DTFM Simulator",       "location" : "dtfm",              "category" : "Toys",      "icon" : "icon_dtfm",      "finished" : true,  "description" : "Generate dual tone signals like the good old days",                                                                                                                                              },
    { "name" : "DVD Screensaver",      "location" : "dvd",               "category" : "Toys",      "icon" : "icon_dvd",       "finished" : true,  "description" : "A reimagining of the classic DVD screensaver",                                                                                                                                                    },
    { "name" : "Day Calculator",       "location" : "date",              "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "Calculate the day of the week using Lewis Carrol's method",                                                                                                                                   },
    { "name" : "DecimalTime",          "location" : "decimaltime/",      "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "The calendar should be made of 13 28 day months, and days should just have 10 hours. Here's what time it would be." },
    { "name" : "Dicey",                "location" : "dicey",             "category" : "Games",     "icon" : "icon_dicey",     "finished" : true,  "description" : "Dicey is a familiar dice game where you score points by rolling various combinations using 5 dice.",                                                                                                    },
    { "name" : "Dots",                 "location" : "dots",              "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "The classic game of making squares from dots",                                                                                                                                                          },
    { "name" : "Ephemidraw",           "location" : "draw",              "category" : "Toys",      "icon" : "icon_missing",   "finished" : false, "description" : "Drawing, but ephemerally",                                                                                                                                                                        },
    { "name" : "Etchy",                "location" : "etch",              "category" : "Toys",      "icon" : "icon_missing",   "finished" : false, "description" : "Digital Etch-a-Sketch implementation",                                                                                                                                                                 },
    { "name" : "EyeTest",              "location" : "eyetest",           "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Collection of Eye Tests",                                                                                                                                                                         },
    { "name" : "Game Of Life",         "location" : "life",              "category" : "Toys",      "icon" : "icon_gol",       "finished" : true,  "description" : "Conway's classic game of life built using Javascript and HTML5 canvas.",                                                                                                                           },
    { "name" : "GameBoy",              "location" : "gameboy/",          "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "Gameboy emulator (someday)" },
    { "name" : "Groups",               "location" : "groups",            "category" : "Games",     "icon" : "icon_groups",    "finished" : true,  "description" : "Find groups of 3 cards whose characterstics are either all the same, or all different. The game ends when all the cards are gone.",                                                                  },
    { "name" : "Hexdoku",              "location" : "hexdoku/",          "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Sudoku using hex digits in a 16 x 16 square" },
    { "name" : "Hopeless",             "location" : "hopeless",          "category" : "Games",     "icon" : "icon_hopeless",  "finished" : true,  "description" : "A puzzle game where you try remove all the blocks by clicking on groups of more than 2. This was an exercize in getting familiar with the canvas.",                                            },
    { "name" : "Hue're Adorable",      "location" : "gradient",          "category" : "Games",     "icon" : "icon_hue",       "finished" : true,  "description" : "A simple game where you reconstruct a gradient that's been split into pieces and shuffled.",                                                                                                 },
    { "name" : "Icony",                "location" : "resedit",           "category" : "Utilities", "icon" : "icon_icony",     "finished" : false, "description" : "Draw pixelated icons as if you are using ResEdit!",                                                                                                                                                   },
    { "name" : "LCARS Clock",          "location" : "lcars",             "category" : "Utilities", "icon" : "icon_lcars",     "finished" : true,  "description" : "The LCARS clock is a simple clock and weather viewer using the Star Trek TNG LCARS aesthetic. You can read about building it on my blog.",                                                        },
    { "name" : "LDS Typing Practice",  "location" : "typing",            "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Practice typing while learning cripture mastery verses",                                                                                                                               },
    { "name" : "Lights Out",           "location" : "lightsout",         "category" : "Games",     "icon" : "icon_lightsout", "finished" : true,  "description" : "The standard puzzle game where you attempt to turn off all the lights by pressing buttons.",                                                                                               },
    { "name" : "Mandley",              "location" : "mandelbrot/",       "category" : "Toys",      "icon" : "icon_mandley",   "finished" : true,  "description" : "A rudimentary Mandelbrot fractal explorer built using the canvas and javascript.",                                                                                                            },
    { "name" : "Math",                 "location" : "math",              "category" : "Utilities", "icon" : "icon_math",      "finished" : true,  "description" : "Math Flashcards for Addition, Subtraction, Division, and Multiplication facts",                                                                                                                            },
    { "name" : "Maze Generator",       "location" : "maze",              "category" : "Utilities", "icon" : "icon_maze",      "finished" : true,  "description" : "A small utility to create mazes of various sizes. Results can be saved as PNGs.",                                                                                                                },
    { "name" : "Miney",                "location" : "mines",             "category" : "Games",     "icon" : "icon_miney",     "finished" : true,  "description" : "A reinvention of the classic Minesweeper. Nothing fancy!",                                                                                                                                              },
    { "name" : "Multiplayer Snakey",   "location" : "snake/snake4.html", "category" : "Games",     "icon" : "icon_snakey",    "finished" : false, "description" : "4 Player version fo Snakey",                                                                                                                                                  },
    { "name" : "N-Tris",               "location" : "tetris",            "category" : "Games",     "icon" : "icon_ntris",     "finished" : true,  "description" : "Tetris clone that uses all possible shapes using up to 5 blocks.",                                                                                                                                    },
    { "name" : "N^2-Tris",             "location" : "nntris",            "category" : "Games",     "icon" : "icon_ntris",     "finished" : false, "description" : "Play N-Tris head-to-head locally on the same computer",                                                                                                                                             },
    { "name" : "Nomis",                "location" : "simon",             "category" : "Games",     "icon" : "icon_nomis",     "finished" : true,  "description" : "You had better do what Nomis says in this classic game of repeating button presses",                                                                                                                    },
    { "name" : "Poll",                 "location" : "poll/",             "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "Simple polling with bars that update as you tally votes" },
    { "name" : "Radical",              "location" : "radical",           "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Space fighting game meant to resemble the 80's game, Awesome",                                                                                                                                    },
    { "name" : "Reflections",          "location" : "reflections",       "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "A study in how lines reflect",                                                                                                                                                            },
    { "name" : "Runes",                "location" : "runes",             "category" : "Utilities", "icon" : "icon_runes",     "finished" : true,  "description" : "Interactive guide for solving the Phasmophobia rune puzzle",                                                                                                                                            },
    { "name" : "SIRDSy",               "location" : "sirdsy",            "category" : "Utilities", "icon" : "icon_sirdsy",    "finished" : true,  "description" : "A Single Image Random Dot Stereogram (SIRDS) generator. You can make custom images by uploading black and white depth maps and textures. Results can be saved as PNGs.",                             },
    { "name" : "Saw",                  "location" : "saw",               "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "Graphical display for dad's saw.",                                                                                                                                                                        },
    { "name" : "Scattergories",        "location" : "scattergories",     "category" : "Games",     "icon" : "icon_missing",   "finished" : false, "description" : "Simple method to play Scategories without purchasing the game!",                                                                                                                      },
    { "name" : "Scramble",             "location" : "scramble",          "category" : "Games",     "icon" : "icon_scramble",  "finished" : true,  "description" : "A word game based on finding words using 9 tiles. See how many words you can find in 3 minutes! ",                                                                                             },
    { "name" : "Signal",               "location" : "signal",            "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "An attempt at creating a signal generator",                                                                                                                                                         },
    { "name" : "Sine",                 "location" : "sine",              "category" : "Utilities", "icon" : "icon_missing",   "finished" : false, "description" : "See how a sine relates to a circle",                                                                                                                                                                    },
    { "name" : "Snakey",               "location" : "snake",             "category" : "Games",     "icon" : "icon_snakey",    "finished" : true,  "description" : "Reimplementation of the classic snake game using appropriated sprites in javascript.",                                                                                                                },
    { "name" : "Sorry Cards",          "location" : "sorry",             "category" : "Utilities", "icon" : "icon_sorry",     "finished" : true,  "description" : "Infinite sorry cards so there is no more need to shuffle the deck 20 times per game!",                                                                                                            },
    { "name" : "Sorty",                "location" : "sorty",             "category" : "Toys",      "icon" : "icon_sorty",     "finished" : true,  "description" : "Demonstration that attempts to animate various methods of sorting arrays.",                                                                                                                             },
    { "name" : "Speech Timer",         "location" : "tmtimer",           "category" : "Utilities", "icon" : "icon_timer",     "finished" : true,  "description" : "This is a speech timer made for my local Toastmasters International club. It provides the speaker with a visual indication of when the speech should be completed.",                           },
    { "name" : "Stary",                "location" : "stars",             "category" : "Toys",      "icon" : "icon_stary",     "finished" : true,  "description" : "A star simulator that replicates the experience of looking out of a ship's viewport while traveling at warp speed.",                                                                                    },
    { "name" : "Sudoku",               "location" : "sudoku",            "category" : "Utilities", "icon" : "icon_sudoku",    "finished" : true,  "description" : "A Sudoku puzzle creator and solver utility.",                                                                                                                                                        },
    { "name" : "Sun and Moon",         "location" : "sunmoon/",          "category" : "Misc",      "icon" : "icon_missing",   "finished" : false, "description" : "Experimental clock that shows sun and moon rises based on your location" },
    { "name" : "Word Finder",          "location" : "words",             "category" : "Utilities", "icon" : "icon_words",     "finished" : true,  "description" : "Find words based on given letters. Developed to help solve the Spelling Bee",                                                                                                                     },
    { "name" : "Wordy",                "location" : "wordy",             "category" : "Games",     "icon" : "icon_wordy",     "finished" : true,  "description" : "Wordy is a familiar puzzle game where you have to make words by connecting adjacent letters in a grid.",                                                                                                },
];

function compare(a, b){
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function populate_apps(show_unreleased=false){
    // Top level
    let content = document.getElementById("content");

    for (let released of [true, false]) {
        if (released == false) {
            if (!show_unreleased)
                breakl
            let unreleased_title = document.createElement("h1");
            unreleased_title.innerHTML = "In Development";
            content.appendChild(unreleased_title);
        }

        // Find all the populated categories
        let categories = [];
        for (let app of apps) {
            if (released != app.finished)
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

                if (released != app.finished)
                    continue;

                let link = document.createElement("a");
                link.href = app.location;

                let div = document.createElement("div");
                div.classList.add("app")

                let icon = document.createElement("img");
                icon.classList.add("icon");
                icon.src = "icons/"+app.icon+"_256.png";

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

            content.appendChild(category);
        }
    }
}
