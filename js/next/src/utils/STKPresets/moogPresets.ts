export const stkVariableMoog = "mog";
export const stkIdentifierMoog = "Moog";

const moogPresets = { // .clair
    filterQ: {
        name: "filterQ",
        label: "Filter Q",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    filterSweepRate: {
        name: "filterSweepRate",
        label: "Filter Sweep Rate",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 220,
        min: 0,
        max: 1000,
        screenInterface: "knob",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    afterTouch: {
        name: "afterTouch",
        label: "Aftertouch",
        value: 0.7,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },

    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    modSpeed: {
        name: "modSpeed",
        label: "Mod Speed",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    modDepth: {
        name: "modDepth",
        label: "Mod Depth",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
};

export default moogPresets;