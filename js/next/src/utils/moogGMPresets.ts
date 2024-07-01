const moogGMPresets = {
    // lfoGain: {
    //     name: "lfoGain",
    //     label: "Lfo Gn",
    //     value: 0.50,
    //     min: 0,
    //     max: 4,
    //     screenInterface: "knob",
    // }, // lfo gain 
    // lfoPitch: {
    //     name: "lfoPitch",
    //     label: "Lfo Pit",
    //     value: 0.5,
    //     min: 0,
    //     max: 1000,
    //     screenInterface: "knob",
    // }, // lfo pitch
    lfoVoice: {
        name: "lfoVoice",
        label: "Lfo Voc",
        value: 2,
        min: 0,
        max: 3,
        fxType: "default",
        screenInterface: "switch_4_disabled_sine_saw_square",
    }, // lfo voice 
    offset: {
        name: "offset",
        label: "Offset",
        value: 24,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // offset (controls note offset in semitones)
    cutoff: {
        name: "cutoff",
        label: "Cutoff",
        value: 30,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // filter cutoff amount (0-100)
    rez: {
        name: "rez",
        label: "Rez",
        value: 72,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // filter resonance (0-100)
    env: {
        name: "env",
        label: "Env",
        value: 36,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // filter ASDR tracking (0-100)
    oscType1: {
        name: "oscType1",
        label: "Osc1",
        value: 1,
        min: 0,
        max: 3,
        fxType: "default",
        screenInterface: "switch_4_disabled_tri_saw_square",
    }, // select osc type (0-3) => (silence, tri, saw, square)
    oscType2: {
        name: "oscType2",
        label: "Osc2",
        value: 1,
        min: 0,
        max: 3,
        fxType: "default",
        screenInterface: "switch_4_disabled_tri_saw_square",
    }, // select osc type (0-3) => (silence, tri, saw, square)
    detune: {
        name: "detune",
        label: "Detune",
        value: 0,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // detune the two voice oscs (1-100)
    oscOffset: {
        name: "oscOffset",
        label: "Oscs Off",
        value: 12,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // offset the two voice oscs (in semitones)
    noise: {
        name: "noise",
        label: "Noise",
        value: 0.1,
        min: 0.001,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // noise level (0-100)
    // syncMode: {
    //     name: "syncMode",
    //     label: "Sync Mode",
    //     value: 2,
    //     min: 0,
    //     max: 2,
    //     screenInterface: "switch_3_1_2_3",
    // },  // 0 = sync freq to input, 1 = sync phase to input, 2 = fm synth
    adsrAttack: {
        name: "adsrAttack",
        label: "Attack",
        value: 1,
        min: 0,
        max: 2000,
        fxType: "default",
        screenInterface: "knob",
    }, // adsr attack (0-100) amount over time
    adsrDecay: {
        name: "adsrDecay",
        label: "Decay",
        value: 100,
        min: 0,
        max: 500,
        fxType: "default",
        screenInterface: "knob",
    }, // adsr decay (0-100)
    adsrSustain: {
        name: "adsrSustain",
        label: "Sustain",
        value: 0.01, // should this be a float?
        min: 0,
        max: 1,
        fxType: "default",
        screenInterface: "knob",
    }, // adsr sustain (0-100)
    adsrRelease: {
        name: "adsrRelease",
        label: "Release",
        value: 400,
        min: 0,
        max: 2000,
        fxType: "default",
        screenInterface: "knob",
    }, // adsr release (0-100)
    limiterAttack: {
        name: "limiterAttack",
        label: "Limit Attack",
        value: 0,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // limiter attack (0-100)
    limiterThreshold: {
        name: "limiterThreshold",
        label: "Limit Thresh",
        value: 0.8,
        min: 0.0,
        max: 1.0,
        fxType: "default",
        screenInterface: "knob",
    }, // hard limiter threshold (0-1)
    lfoFreq: {
        name: "lfoFreq",
        label: "Lfo Freq",
        value: 320,
        min: 0,
        max: 1000,
        fxType: "default",
        screenInterface: "knob",
    }, // lfo frequency amounnt? (0-100) TEST W CAUTION!
    pitchMod: {
        name: "pitchMod",
        label: "Pitch Mod",
        value: 0.5,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // pitch modulation (0-100)
    cutoffMod: {
        name: "cutoffMod",
        label: "Cutoff Mod",
        value: 5,
        min: 0,
        max: 100,
        fxType: "default",
        screenInterface: "knob",
    }, // cutoff modulation (0-100)
    // filterEnv: {
    //     name: "filterEnv",
    //     label: "Filt Env",
    //     value: 0,
    //     min: 0,
    //     max: 3200,
    //     screenInterface: "knob",
    // }, // controls filter envelope in Hz (NEEDS TESTING!)
    highPassFreq: {
        name: "highPassFreq",
        label: "HP Freq",
        value: 120,
        min: 1,
        max: 1000,
        fxType: "default",
        screenInterface: "knob",
    }, // high pass filter frequency in hZ (NEEDS TESTING!)
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
};

export default moogGMPresets;