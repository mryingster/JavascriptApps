function check_high_score(score) {
    // Retrieve Scores
    var high_scores = localStorage.getItem("dionakra");

    // Convert from JSON
    if (high_scores)
        high_scores = JSON.parse(high_scores);
    else
        high_scores = [];

    // Don't check when there is no score
    if (score > 0) {

	// Go through each and see if it's in the top ten
	var i     = 0;
	var place = 0;
	for (i=0; i<high_scores.length; i++){
            place += 1;

            if (score > high_scores[i].score) {
		break;
            }
	}

	// Record new score
	if (place <= 10) {
            const nth = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh"]
            var user_name = null;

	    // Start highscore music
	    var audio = document.getElementById("music");
	    audio.currentTime = 0;
	    audio.play();

            user_name = prompt("New high score! You got "+nth[i]+" place. Enter name", "Anonymous");

	    // Stop highscore music
	    audio.pause();

            if (user_name != null){
		high_scores.splice(i, 0, {
                    name  : user_name,
                    level : level,
                    score : score,
                    date  : new Date().toLocaleDateString("en-US"),
		});

		localStorage.dionakra = JSON.stringify(high_scores);
            }
	}
    }

    // Update overlay with new high score!
    draw_highscore_overlay(high_scores);
}

function draw_highscore_overlay(scores) {
    ctx_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);

    ctx_overlay.fillStyle = "rgba(0, 0, 0, .5)";
    ctx_overlay.fillRect(0, 0, canvas_overlay.width, canvas_overlay.height);

    let y = 100;

    ctx_overlay.font = "bold 32px SegmentedAlpha";
    ctx_overlay.textAlign = "center";
    ctx_overlay.lineWidth = 5;
    ctx_overlay.fillStyle = "#fff";
    ctx_overlay.fillText("Click to start", canvas_overlay.width / 2, y);

    y += 75;
    ctx_overlay.fillText("High Scores", canvas_overlay.width / 2, y);

    y += 50;
    for (let i=0; i<=10; i++) {
	let name = "---";
	let date = "--/--/----";
	let score = "---";
	let level = "--";

	if (i === 0) {
	    name = "Name";
	    date = "Date";
	    score = "Score";
	    level = "lv";
	} else if (scores) {
	    if (i <= scores.length) {
		name = scores[i-1].name;
		date = scores[i-1].date;
		score = scores[i-1].score;
		level = scores[i-1].level;
	    }
	}

	ctx_overlay.font = "bold 24px SegmentedAlpha";
	ctx_overlay.textAlign = "right";
	if (i > 0)
	    ctx_overlay.fillText(`${i}.`, 60, y);

	ctx_overlay.textAlign = "left";
	ctx_overlay.fillText(name, 80, y);

	ctx_overlay.font = "bold 24px SegmentedAlpha";
	ctx_overlay.textAlign = "right";
	ctx_overlay.fillText(score, canvas_overlay.width - 40, y);
	ctx_overlay.fillText(level, canvas_overlay.width - 180, y);
	ctx_overlay.fillText(date,  canvas_overlay.width - 220, y);

	y += 47;
    }
}
