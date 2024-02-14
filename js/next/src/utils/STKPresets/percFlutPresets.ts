export const stkVariablePercFlut = "prcflt";
export const stkIdentifierPercFlut = "PercFlut";

const percFlutPresets = {
    controlOne: {
        name: "controlOne",
        label: "Modulator Index",
        value: 2,
        min: 0,
        max: 2,
        screenInterface: "intSpinner",
    },
    controlTwo: {
        name: "controlTwo",
        label: "Modulator Crossfade",
        value: 1,
        min: 0,
        max: 4,
        screenInterface: "intSpinner_5",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.4,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.18,
        min: 0,
        max: 2,
        screenInterface: "knob",
    },
};

export default percFlutPresets;