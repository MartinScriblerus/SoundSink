export const stkVariableFlute = "flut";
export const stkIdentifierFlute = "Flute";

const flutePresets = {
    jetDelay: {
        name: "jetDelay", // if this does not work, try controlChange 2
        label: "Jet Delay",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    jetReflection: {
        name: "jetReflection", // if this does not work, try controlChange 2
        label: "Jet Reflection",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    endReflection: {
        name: "endReflection", // if this does not work, try controlChange 2
        label: "End Reflection",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    noiseGain: {
        name: "noiseGain", // if this does not work, try controlChange 2
        label: "Noise Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibrato Frequency",
        value: 11,
        min: 0,
        max: 1000,
        screenInterface: "knob",
    },
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibrato Gain",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // freq in hZ
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
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
    rate: {
        name: "rate",
        label: "Rate",
        value: 0.2,
        min: 0,
        max: 2,
        screenInterface: "knob",
    }, // rate in seconds
    reverb: {
        name: "reverb",
        label: "Reverb",
        value: 5,
        min: 0,
        max: 100,
        screenInterface: "knob",
    }, // reverb amount (0-100)
};

export default flutePresets;