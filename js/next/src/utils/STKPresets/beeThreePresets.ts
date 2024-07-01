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
        fxType: "stk",
    },
    controlTwo: {
        name: "controlTwo", // if this does not work, try controlChange 2
        label: "Operator 3 Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }
};

export default beeThreePresets;