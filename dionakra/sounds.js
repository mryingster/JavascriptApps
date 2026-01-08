const SOUND_DEFINITIONS = {
    "BALL_CATCH"     : { volume: .25, path: "sounds/effects/ball_catch.wav" },
    "GOLD_HIT"       : { volume: .25, path: "sounds/effects/gold_block_hit.wav" },
    "SILVER_HIT"     : { volume: .25, path: "sounds/effects/silver_block_hit.wav" },
    "WALL_HIT_1"     : { volume: .25, path: "sounds/effects/wallhit1.wav" },
    "WALL_HIT_2"     : { volume: .25, path: "sounds/effects/wallhit2.wav" },
    "WALL_HIT_3"     : { volume: .25, path: "sounds/effects/wallhit3.wav" },
    "ILLUSION_HIT"   : { volume: .25, path: "sounds/effects/illusion.wav" },
    "LASER_FIRE"     : { volume: .25, path: "sounds/effects/shot.wav" },
    "PLAYER_EXTEND"  : { volume: .25, path: "sounds/effects/player_extend.wav" },
    "PADDLE_EXPLODE" : { volume: .25, path: "sounds/effects/vaus_exp.wav" },
    "PADDLE_EXPAND"  : { volume: .25, path: "sounds/effects/vaus_long.wav" },
    "PADDLE_SHRINK"  : { volume: .25, path: "sounds/effects/vaus_short.wav" },
    "STAGE_START"    : { volume: .75, path: "sounds/effects/stage_start.wav" },
    "GAME_END"       : { volume: .75, path: "sounds/effects/game_over.wav" },
    "SFX_BREAK"      : { volume: .75, path: "sounds/effects/break.wav" },
    // { volume:  .5, replicas: 2, path: "sounds/effects/boss_shot_new.wav" },
};

async function load_sound(name, definition) {
    const response = await fetch(definition.path);
    const arrayBuffer = await response.arrayBuffer();
    sounds[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

function play_sound(name) {
    if (muted) return;

    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();

    source.buffer = sounds[name];
    gain.gain.value = SOUND_DEFINITIONS[name].volume;

    source.connect(gain);
    gain.connect(audioCtx.destination);

    source.start(0);
}
