export const stkVariableWurley = "wur";
export const stkIdentifierWurley = "Wurley";

const wurleyPresets = {
    controlOne: {
        name: "controlOne",
        label: "Modulator Index",
        value: 2,
        min: 0,
        max: 2,
        screenInterface: "switch_2_0_1_2",
    },
    controlTwo: {
        name: "controlTwo",
        label: "Modulator Crossfade",
        value: 4,
        min: 0,
        max: 4,
        screenInterface: "intSpinner_5",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.2,
        min: 0,
        max: 2,
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
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
};

export default wurleyPresets;