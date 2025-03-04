export const stkVariablePercFlut = "percFlut";
export const stkIdentifierPercFlut = "PercFlut";

const percFlutPresets = {
    controlOne: {
        name: "controlOne",
        label: "Modulator Index",
        value: 2,
        min: 0,
        max: 2,
        screenInterface: "intSpinner",
        fxType: "stk",
    },
    controlTwo: {
        name: "controlTwo",
        label: "Modulator Crossfade",
        value: 1,
        min: 0,
        max: 4,
        screenInterface: "intSpinner_5",
        fxType: "stk",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.4,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.18,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: .6,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    },
};

export default percFlutPresets;