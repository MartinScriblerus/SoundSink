export const stkVariableBlowBotl = "blwbtl";
export const stkIdentifierBlowBotl = "Bottle";

const blowBotlPresets = {
    noiseGain: {
        name: "noiseGain", // if this does not work, try controlChange 2
        label: "Noise Gain",
        value: 0.2,
        min: 0.01,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 11,
        min: 0,
        max: 2000,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.01,
        min: 0.01,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    rate: {
        name: "rate",
        label: "Rate",
        value: 0.2,
        min: 0.01,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, // rate in seconds
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 1.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
        value: 0.5,
        min: 0.01,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 3,
        min: 0,
        max: 6,
        screenInterface: "knob",
        fxType: "stk",
    },
};

export default blowBotlPresets;