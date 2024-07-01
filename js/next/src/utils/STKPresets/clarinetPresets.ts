export const stkVariableClarinet = "clair";
export const stkIdentifierClarinet = "Clarinet";

const clarinetPresets = { // .clair
    reed: {
        name: "reed",
        label: "Reed",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    noiseGain: {
        name: "noiseGain",
        label: "Noise Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.7,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    rate: {
        name: "rate",
        label: "Rate",
        value: 1.0,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, // rate in seconds
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 10,
        min: 0,
        max: 1000,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 1.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.3,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
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

export default clarinetPresets;