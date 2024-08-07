export const stkVariableFrencHrn = "f";
export const stkIdentifierFrencHrn = "FrencHrn";

const frencHrnPresets = {
    controlOne: {
        name: "controlOne",
        label: "Mod Index",
        value: 0.2,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    },
    controlTwo: {
        name: "controlTwo",
        label: "Mod Crossfade",
        value: 0.3,
        min: 0,
        max: 4,
        screenInterface: "knob",
        fxType: "stk",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Rate",
        value: 0.01,
        min: 0.01,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.01,
        min: 0.01,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.5,
        min: 0.01,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    },
};

export default frencHrnPresets;