export const stkVariableStifKarp = "m";
export const stkIdentifierStifKarp = "StifKarp";

const stifKarpPresets = {
    pickupPosition: {
        name: "pickupPosition",
        label: "Pickup Position",
        value: 0.20,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    sustain: {
        name: "sustain",
        label: "Sustain",
        value: 0.76,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, 
    stretch: {
        name: "stretch",
        label: "Stretch",
        value: 0.49,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    pluck: {
        name: "pluck",
        label: "Pluck",
        value: 0.15,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    baseLoopGain: {
        name: "baseLoopGain",
        label: "Loop Gain",
        value: 0.97,
        min: 0.8,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, 
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.8,
        min: 0.01,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, 
};

export default stifKarpPresets;