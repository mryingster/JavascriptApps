const BALL_CATCH     = 0;
const GOLD_HIT       = 1;
const SILVER_HIT     = 2;
const WALL_HIT_1     = 3;
const WALL_HIT_2     = 4;
const WALL_HIT_3     = 5;
const ILLUSION_HIT   = 6;
const LASER_FIRE     = 7;
const PLAYER_EXTEND  = 8;
const PADDLE_EXPLODE = 9;
const PADDLE_EXPAND  = 10;
const PADDLE_SHRINK  = 11;
const STAGE_START    = 12;
const GAME_END       = 13;
const SFX_BREAK      = 14;

const SOUND_DEFINITIONS = [
    { volume: .25, replicas: 2, path: "sounds/effects/ball_catch.wav" },
    { volume: .25, replicas: 4, path: "sounds/effects/gold_block_hit.wav" },
    { volume: .25, replicas: 4, path: "sounds/effects/silver_block_hit.wav" },
    { volume: .25, replicas: 2, path: "sounds/effects/wallhit1.wav" },
    { volume: .25, replicas: 2, path: "sounds/effects/wallhit2.wav" },
    { volume: .25, replicas: 2, path: "sounds/effects/wallhit3.wav" },
    { volume: .25, replicas: 1, path: "sounds/effects/illusion.wav" },
    { volume: .25, replicas: 2, path: "sounds/effects/shot.wav" },
    { volume: .25, replicas: 1, path: "sounds/effects/player_extend.wav" },
    { volume: .25, replicas: 1, path: "sounds/effects/vaus_exp.wav" },
    { volume: .25, replicas: 1, path: "sounds/effects/vaus_long.wav" },
    { volume: .25, replicas: 1, path: "sounds/effects/vaus_short.wav" },
    { volume:  .5, replicas: 1, path: "sounds/effects/stage_start.wav" },
    { volume:  .5, replicas: 1, path: "sounds/effects/game_over.wav" },
    { volume:  .5, replicas: 1, path: "sounds/effects/break.wav" },
    // { volume:  .5, replicas: 2, path: "sounds/effects/boss_shot_new.wav" },
];

class SOUND {
    constructor(definition) {
        this.sounds = [];
        for (let i=0; i<definition.replicas; i++) {
            // Create new sound object
            this.sounds.push(document.createElement("audio"));

            this.sounds[i].src = definition.path;
            this.sounds[i].setAttribute("preload", "auto");
            this.sounds[i].setAttribute("controls", "none");
            this.sounds[i].style.display = "none";
            this.sounds[i].volume = definition.volume;

            document.body.appendChild(this.sounds[i]);
        }
        this.index = 0;
    }

    play() {
        if (MUTED) return;

        this.sounds[this.index].play();

        this.index++;
        this.index %= this.sounds.length;
    }
}
