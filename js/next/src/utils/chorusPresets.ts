export const stkVariableChorus = "chor";
export const stkIdentifierChorus = "Chorus";

const chorusPresets = {
    modFreq: {
        name: "modFreq",
        label: "Modulation Frequency",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    modDepth: {
        name: "modDepth",
        label: "Modulation Depth",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    mix: {
        name: "mix",
        label: "Modulation Mix",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
};

export default chorusPresets;