export const stkVariableBowed = "bow";
export const stkIdentifierBowed = "Bowed";

const bowedPresets = {
    bowPressure: {
        name: "bowPressure:", // if this does not work, try controlChange 2
        label: "Bow Pressure",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    bowPosition: {
        name: "bowPosition:", // if this does not work, try controlChange 2
        label: "Bow Position",
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
    startBowing: {
        name: "startBowing",
        label: "Start Bowing",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    stopBowing: {
        name: "stopBowing",
        label: "Stop Bowing",
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