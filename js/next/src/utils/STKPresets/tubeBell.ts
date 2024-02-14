export const stkVariableTubeBell = "tubbl";
export const stkIdentifierTubeBell = "TubeBell";

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
};

export default tubeBellPresets;