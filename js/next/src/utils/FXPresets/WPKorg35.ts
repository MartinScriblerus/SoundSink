export const stkVariableWPKorg35 = "wpkorg35";
export const stkIdentifierWPKorg35 = "WPKorg35";

const wpKorg35Presets = {
    cutoff: {
        name: "cutoff",
        label: "Cutoff",
        value: 1,
        min: 0,
        max: 20000,
        screenInterface: "knob",
        type: "float_float",
        group: 5,
    },
    nonLinear: {
        name: "nonLinear",
        label: "NonLinear",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "intspinner",
        type: "int_int",
        group: 5,
    },
    resonance: {
        name: "resonance",
        label: "Resonance",
        value: 1.99999,
        min: 0,
        max: 2,
        screenInterface: "knob",
        type: "float_float",
        group: 5,
    },
    saturation: {
        name: "saturation",
        label: "Saturation",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 5,
    },
};

export default wpKorg35Presets;