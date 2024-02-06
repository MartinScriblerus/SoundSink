export const stkVariableFM = "fm";
export const stkIdentifierFM = "FM";

const fmPresets = {
    afterTouch: {
        name: "afterTouch", // if this does not work, try controlChange 2
        label: "Aftertouch",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    controlOne: {
        name: "controlOne",
        label: "Operator 4 Feedback",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    controlTwo: {
        name: "controlTwo",
        label: "Operator 3 Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 1.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opADSR_op: {
        name: "opADSR_op",
        label: "ADSR Op",
        value: 2,
        min: 0,
        max: 4,
        screenInterface: "interface_5",
    },
    opADSR_attack: {
        name: "opADSR_attack",
        label: "Attack",
        value: 0.01,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opADSR_decay: {
        name: "opADSR_decay",
        label: "Decay",
        value: 1.00,
        min: 0,
        max: 4,
        screenInterface: "knob",
    },
    opADSR_sustain: {
        name: "opADSR_sustain",
        label: "Sustain",
        value: 0,
        min: 0,
        max: 4,
        screenInterface: "knob",
    },
    opADSR_release: {
        name: "opADSR_release",
        label: "Release",
        value: 0.04,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opNumber: {
        name: "opNumber",
        label: "Operator Number",
        value: 4,
        min: 1,
        max: 4,
        screenInterface: "knob",
    },
    op4Feedback: {
        name: "op4Feedback",
        label: "Operator 4 Feedback",
        value: 0.3,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opAM: {
        operatorNumber: 4, // NOTE THIS STRATEGY & USE ELSEWHERE
        name: "opAm",
        label: "Operator Amp Mod",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opRatio: {
        operatorNumber: 4, // NOTE THIS STRATEGY & USE ELSEWHERE
        name: "opRatio",
        label: "Op Ratio",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    opWave: {
        operatorWave: 4, // NOTE THIS STRATEGY & USE ELSEWHERE
        name: "opWave",
        label: "Op Wave",
        value: 0.5,
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

export default fmPresets;