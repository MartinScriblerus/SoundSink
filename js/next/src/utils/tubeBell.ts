export const stkVariableClarinet = "tubbl";
export const stkIdentifierClarinet = "TubeBell";

const tubeBellPresets = {
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
    opADSR: {
        name: "ADSR",
        label: "ADSR 1",
        value: [2, 0.001, 3.00, 0.0, 0.04],
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    reverb: {
        name: "reverb",
        label: "Reverb",
        value: 5,
        min: 0,
        max: 100,
        screenInterface: "knob",
    }, // reverb amount (0-100)
};

export default tubeBellPresets;