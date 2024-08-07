export const stkVariableBrass = "brs";
export const stkIdentifierBrass = "Brass";

const brassPresets = {
    lip: { // if this does not work, try controlChange 1
        name: "lip",
        label: "Lip",
        value: 0.20,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    slide: {
        name: "slide", // if this does not work, try controlChange 2
        label: "Slide",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 0,
        min: 0,
        max: 12,
        screenInterface: "intspinner",
        fxType: "stk",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.6,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    volume: {
        name: "volume",
        label: "Vol Release",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    rate: {
        name: "rate",
        label: "Rate",
        value: 0.02,
        min: 0,
        max: 2,
        screenInterface: "knob",
    }, // rate in seconds
    gain: {
        name: "gain",
        label: "Gain",
        value: 3,
        min: 0,
        max: 6,
        screenInterface: "knob",
        fxType: "stk",
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

export default brassPresets;