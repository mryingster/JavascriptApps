
class audio_helper {
    constructor() {
        this.selected_track = 0;
        this.duration = 0;

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
        this.pause();
    }

    play() {
        for (let t of this.tracks)
            if (t != null)
                t.play();
    }

    pause() {
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
        this.paused = false;

        this.srcs = [
            null,
            null,
            null,
            null,
        ];

        this.track = new Audio();
        this.audio_context = new AudioContext();
    }

    select_track(t) {
        this.selected_track = t;
        this.position = this.track.currentTime;

        this.track.src = this.srcs[this.selected_track];

        this.track.addEventListener('loadedmetadata', () => {
	    this.duration = this.track.duration;
            this.track.fastSeek(this.position);
            if (!this.paused)
                this.play();
        });
    }

    select_audio_files(t0, t1, t2, t3) {
        // Load audio files and replace existing audio resources
        this.srcs = [t0, t1, t2, t3];

        // Select track
        this.paused = true;
        this.select_track(this.selected_track);
    }

    play() {
        this.track.play();
        this.paused = false;
    }

    pause() {
        this.track.pause();
        this.paused = true;
    }

    seek(ts) {
        this.position = ts;
        this.track.fastSeek(ts);
    }

    debug() {
        console.log("Audio File URL:", this.track.src);
        console.log("Track Playback Position:", this.track.currentTime);
        console.log("Track Playback Paused:", this.track.paused);
        console.log("Class Playback Position:", this.position);
        console.log("Class Playback Paused:", this.paused);
    }

    get_timestamp() {
        return this.track.currentTime;
    }

    get_audio_pcm() {
	// Since safari doesn't support any audio processing stuff
	// We'll just pulse the light if we are playing.
	if (this.track.paused)
	    return 0;
	return Math.sin(this.track.currentTime * 10);
    }
}


