export const stkVariableRhodey = "rod";
export const stkIdentifierRhodey = "Rhodey";

const rhodeyPresets = { // .clair
    controlOne: { // Make sure to SET on code side (see ChucK reference)
        name: "controlOne",
        label: "Control One",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    controlTwo: { // Make sure to SET on code side (see ChucK reference)
        name: "controlTwo",
        label: "Control Two",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 11.0,
        min: 0.0,
        max: 12.0,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 1.0,
        min: 0.0,
        max: 12.0,
        screenInterface: "knob",
        fxType: "stk",
    },
    // opADSR_op: {
    //     name: "opADSR_op",
    //     label: "ADSR Op",
    //     value: 2,
    //     min: 0,
    //     max: 4,
    //     screenInterface: "interface_5",
    // },
    // attackTime: {
    //     name: "attackTime",
    //     label: "Attack",
    //     value: 0.01,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "knob",
    // },
    // opADSR_decay: {
    //     name: "opADSR_decay",
    //     label: "Decay",
    //     value: 1.00,
    //     min: 0,
    //     max: 4,
    //     screenInterface: "knob",
    // },
    // opADSR_sustain: {
    //     name: "opADSR_sustain",
    //     label: "Sustain",
    //     value: 0,
    //     min: 0,
    //     max: 4,
    //     screenInterface: "knob",
    // },
    // opADSR_release: {
    //     name: "opADSR_release",
    //     label: "Release",
    //     value: 0.04,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "knob",
    // },
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
    gain: {
        name: "gain",
        label: "Gain",
        value: 1.5,
        min: 0.0,
        max: 3.0,
        screenInterface: "knob",
        fxType: "stk",
    }
};

export default rhodeyPresets;