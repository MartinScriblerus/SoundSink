export const stkVariableModalBar = "mdlbr";
export const stkIdentifierModalBar = "ModalBar";

// - Marimba = 0
// - Vibraphone = 1
// - Agogo = 2
// - Wood1 = 3
// - Reso = 4
// - Wood2 = 5
// - Beats = 6
// - Two Fixed = 7
// - Clump = 8

const modalBarPresets = {
    stickHardness: {
        name: "stickHardness", // if this does not work, try controlChange 2
        label: "Stick Hardness",
        value: 0.8,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    strikePosition: {
        name: "strikePosition", // if this does not work, try controlChange 2
        label: "Strike Position",
        value: 0.1,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 10,
        min: 0,
        max: 60,
        screenInterface: "knob",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.3,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    directGain: {
        name: "directGain",
        label: "Direct Gain",
        value: 0.8,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, 
    masterGain: {
        name: "masterGain",
        label: "Master Gain",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    preset: {
        name: "preset",
        label: "Preset",
        value: 4,
        min: 0,
        max: 8,
        screenInterface: "intSpinner",
    },
    volume: {
        name: "volume",
        label: "Volume",
        value: 0.8,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    strike: {
        name: "strike",
        label: "Strike",
        value: 0.3,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    damp: {
        name: "damp",
        label: "Damp",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    mode: {
        name: "mode",
        label: "Mode",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "intspinner",
    },
    modeRatio: {
        name: "modeRatio",
        label: "Mode Ratio",
        value: 1,
        min: 0.1,
        max: 1,
        screenInterface: "knob",
    },
    modeRadius: {
        name: "modeRadius",
        label: "Mode Radius",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    modeGain: {
        name: "modeGain",
        label: "Mode Gain",
        value: 0.8,
        min: 0,
        max: 1,
        screenInterface: "knob",
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

export default modalBarPresets;