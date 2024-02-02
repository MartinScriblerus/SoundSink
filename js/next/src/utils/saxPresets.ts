export const stkVariableClarinet = "sax";
export const stkIdentifierClarinet = "Saxofony";

const saxofonyPresets = {
    stiffness: { // if this does not work, try controlChange 1
        name: "stiffness",
        label: "Stiffness",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    aperture: {
        name: "aperture", // if this does not work, try controlChange 2
        label: "Aperture",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibrato Freq",
        value: 10,
        min: 0,
        max: 1000,
        screenInterface: "knob",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibrato Gain",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    noiseGain: {
        name: "noiseGain",
        label: "Noise Gain",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    blowPosition: {
        name: "blowPosition",
        label: "Blow Position",
        value: 0.2,
        min: 0,
        max: 2,
        screenInterface: "knob",
    }, 
    rate: {
        name: "rate",
        label: "Rate",
        value: 0.2,
        min: 0,
        max: 2,
        screenInterface: "knob",
    }, // rate in seconds
    startBlowing: {
        name: "startBlowing",
        label: "Start Blowing",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stop Blowing",
        value: 0.5,
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

export default saxofonyPresets;