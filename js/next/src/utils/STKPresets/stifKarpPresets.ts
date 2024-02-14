export const stkVariableStifKarp = "m";
export const stkIdentifierStifKarp = "StifKarp";

const stifKarpPresets = {
    pickupPosition: {
        name: "pickupPosition",
        label: "Pickup Position",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    sustain: {
        name: "sustain",
        label: "Sustain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, 
    stretch: {
        name: "stretch",
        label: "Stretch",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    pluck: {
        name: "pluck",
        label: "Pluck",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    baseLoopGain: {
        name: "baseLoopGain",
        label: "Loop Gain",
        value: 0.9,
        min: 0.8,
        max: 2,
        screenInterface: "knob",
    }, 
};

export default stifKarpPresets;