export const stkVariableSaxofony = "sax";
export const stkIdentifierSaxofony = "Saxofony";

const saxofonyPresets = {
    stiffness: { // if this does not work, try controlChange 1
        name: "stiffness",
        label: "Stiffness",
        value: 0.3,
        min: 0.15,
        max: 0.50,
        screenInterface: "knob",
        fxType: "stk",
    },
    aperture: {
        name: "aperture", // if this does not work, try controlChange 2
        label: "Aperture",
        value: 0.36,
        min: .3,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 440,
        min: 0,
        max: 2000,
        screenInterface: "knob",
        fxType: "stk",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.05,
        min: 0.1,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    noiseGain: {
        name: "noiseGain",
        label: "Noise Gain",
        value: 0.01,
        min: 0.5,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    blowPosition: {
        name: "blowPosition",
        label: "Blow Pos",
        value: 0.6,
        min: 0.1,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, 
    rate: {
        name: "rate",
        label: "Rate",
        value: 1,
        min: 0,
        max: 2,
        screenInterface: "knob",
        fxType: "stk",
    }, // rate in seconds
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 0.96,
        min: 0.9,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
        value: 0.64,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.09,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }
}
export default saxofonyPresets;