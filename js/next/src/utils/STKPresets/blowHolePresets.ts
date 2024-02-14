export const stkVariableBlowHole = "blwhl";
export const stkIdentifierBlowHole = "BlowHole";

const blowHolePresets = {
    reed: { // if this does not work, try controlChange 1
        name: "reed",
        label: "Reed",
        value: 0.50,
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
    tonehole: {
        name: "tonehole",
        label: "Tonehole",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vent: {
        name: "vent",
        label: "Vent",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // freq in hZ
    pressure: {
        name: "pressure",
        label: "Pressure",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    startBlowing: {
        name: "startBlowing",
        label: "Strt Blow",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    stopBlowing: {
        name: "stopBlowing",
        label: "Stp Blow",
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
};

export default blowHolePresets;