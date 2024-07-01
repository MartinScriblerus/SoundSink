export const stkVariableBowed = "bow";
export const stkIdentifierBowed = "Bowed";

const bowedPresets = {
    bowPressure: {
        name: "bowPressure", // if this does not work, try controlChange 2
        label: "Bow Pressure",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    bowPosition: {
        name: "bowPosition", // if this does not work, try controlChange 2
        label: "Bow Position",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 11,
        min: 0,
        max: 1000,
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
    startBowing: {
        name: "startBowing",
        label: "Start Bowing",
        value: 1.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBowing: {
        name: "stopBowing",
        label: "Stop Bowing",
        value: 1.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 3,
        min: 0,
        max: 12,
        screenInterface: "knob",
        fxType: "stk",
    },
    // rate: {
    //     name: "rate",
    //     label: "Rate",
    //     value: 0.2,
    //     min: 0,
    //     max: 2,
    //     screenInterface: "knob",
    // }, // rate in seconds
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
};

export default bowedPresets;