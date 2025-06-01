class audio_helper {
    constructor() {
        this.selected_track = -1;
        this.duration = 0;
	this.paused = false;
        this.position = 0;

        this.tracks = [
            null,
            null,
            null,
            null,
        ];

        this.sources = [
            null,
            null,
            null,
            null,
        ];

        this.gains = [
            null,
            null,
            null,
            null,
        ];

        this.audio_context = new AudioContext();
	this.analyserNode = this.audio_context.createAnalyser();
	this.pcmData = new Float32Array(this.analyserNode.fftSize);
    }

    select_track(t) {
        if (this.selected_track === t) return;

        this.selected_track = t;

        // Reset gain to 0
        for (let gain of this.gains)
            gain.gain.setValueAtTime(0.0, this.audio_context.currentTime, 0);

        // Volume up for selected track
        this.gains[this.selected_track].gain.setValueAtTime(1.0, this.audio_context.currentTime, 0);
    }

    select_audio_files(t0, t1, t2, t3) {
        // Load audio files and replace existing audio resources
        this.tracks = [
            new Audio(t0),
            new Audio(t1),
            new Audio(t2),
            new Audio(t3),
        ];

        // Try to keep track of what's loaded
        update_loading_progress(true);
        for (let t of this.tracks) {
            t.addEventListener("canplaythrough", () => {
	        update_loading_progress();
            });
        }

        // Get track duration
        this.tracks[0].addEventListener('loadedmetadata', () => {
	    this.duration = this.tracks[0].duration;
        });

        // Make source and gain nodes and connect together
        for (let i=0; i<this.gains.length; i++) {
            this.gains[i] = this.audio_context.createGain();
            this.sources[i] = this.audio_context.createMediaElementSource(this.tracks[i]);
            this.sources[i].connect(this.gains[i])
            this.gains[i].connect(this.analyserNode);
            this.gains[i].connect(this.audio_context.destination);
        }

        // Select track
        this.select_track(this.selected_track);
        this.stop();
    }

    play() {
	this.paused = false;
        for (let t of this.tracks)
            if (t != null)
                t.play();
    }

    stop() {
	this.paused = true;
        for (let t of this.tracks)
            if (t != null)
                t.pause();
    }

    seek(ts) {
        for (let t of this.tracks)
            if (t != null)
                t.fastSeek(ts);
    }

    debug() {
        for (let i=0; i<this.tracks.length; i++) {
            console.log("Audio Element", i);
            console.log("Audio File URL:", this.tracks[i].src);
            console.log("Playback Position:", this.tracks[i].currentTime);
            console.log("Playback Paused:", this.tracks[i].paused);
            console.log("Gain Value:", this.gains[i].gain.value);
        }
    }

    get_timestamp() {
        return this.tracks[this.selected_track].currentTime;
    }

    get_audio_pcm() {
        this.analyserNode.getFloatTimeDomainData(this.pcmData);
	let sumSquares = 0.0;
	for (const amplitude of this.pcmData) {
	    sumSquares += amplitude*amplitude;
	}

	return (Math.sqrt(sumSquares / this.pcmData.length))
    }
}

class audio_helper_safari {
    constructor() {
        this.selected_track = 0;
        this.duration = 0;
        this.position = 0;
        this.paused = true;

        this.tracks = [
            null,
            null,
            null,
            null,
        ];
    }

    select_track(t) {
        this.selected_track = t;
        this.pause();
        //this.position = this.get_timestamp();
        this.resume();
    }

    select_audio_files(t0, t1, t2, t3) {
        // Load audio files and replace existing audio resources
        this.tracks = [
            new Audio(t0),
            new Audio(t1),
            new Audio(t2),
            new Audio(t3),
        ];

        // Safari doesn't pre-load files, so just skip this step :(
	update_loading_progress(4);

        // Get track duration
        this.tracks[0].addEventListener('loadedmetadata', () => {
	    this.duration = this.tracks[0].duration;
        });

        // Select track
        this.select_track(this.selected_track);
        this.pause();
    }

    play() {
        this.paused = false;
	console.log(this.position, state.time)
        for (let t in this.tracks)
            if (t == this.selected_track) {
                this.tracks[t].play();
		this.tracks[t].fastSeek(state.time);
            }
    }

    stop() {
        this.position = this.get_timestamp();
        this.paused = true;
        this.pause();
    }

    resume() {
        if (this.paused) return;
        this.play()
    }

    pause() {
        for (let t of this.tracks)
            if (t != null)
                t.pause();
    }

    seek(ts) {
        this.pause();
        this.position = ts;
        this.tracks[this.selected_track].fastSeek(ts);
        this.resume();
    }

    debug() {
        for (let i=0; i<this.tracks.length; i++) {
            console.log("Audio Element", i);
            console.log("Audio File URL:", this.tracks[i].src);
            console.log("Playback Position:", this.tracks[i].currentTime);
            console.log("Playback Paused:", this.tracks[i].paused);
        }
    }

    get_timestamp() {
        return this.tracks[this.selected_track].currentTime;
    }

    get_audio_pcm() {
	// Since safari doesn't support any audio processing stuff
	// We'll just pulse the light if we are playing.
	if (this.paused)
	    return 0;
	return Math.sin(this.tracks[this.selected_track].currentTime * 10);
    }
}


