export const stkVariableBeeThree = "bthree";
export const stkIdentifierBeeThree = "BeeThree";

const beeThreePresets = {
    controlOne: {
        name: "controlOne", // if this does not work, try controlChange 2
        label: "Operator 4 Feedback",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    controlTwo: {
        name: "controlTwo", // if this does not work, try controlChange 2
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
    }, // freq in hZ
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.2,
        min: 0,
        max: 1,
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

export default beeThreePresets;