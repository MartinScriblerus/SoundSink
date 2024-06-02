export const stkVariableFlute = "flut";
export const stkIdentifierFlute = "Flute";

const flutePresets = {
    jetDelay: {
        name: "jetDelay", // if this does not work, try controlChange 2
        label: "Jet Delay",
        value: 0.1,
        min: 0.1,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    jetReflection: {
        name: "jetReflection", // if this does not work, try controlChange 2
        label: "Jet Reflection",
        value: 0.35,
        min: 0.32,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    endReflection: {
        name: "endReflection", // if this does not work, try controlChange 2
        label: "End Reflection",
        value: 0.5,
        min: 0.5,
        max: 0.8,
        screenInterface: "knob",
        fxType: "stk",
    },
    noiseGain: {
        name: "noiseGain", // if this does not work, try controlChange 2
        label: "Noise Gain",
        value: 0.6,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 1,
        min: 0,
        max: 11,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.9,
        min: 0.88,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 0.9,
        min: 0.88,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    rate: {
        name: "rate",
        label: "Rate",
        value: 1.0,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, // rate in seconds
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.3,
        min: 0,
        max: 2,
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

export default flutePresets;