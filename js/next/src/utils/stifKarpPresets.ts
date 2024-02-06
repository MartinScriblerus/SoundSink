export const stkVariableStifKarp = "m";
export const stkIdentifierStifKarp = "StifKarp";

const stifKarpPresets = { // .clair
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

export default stifKarpPresets;