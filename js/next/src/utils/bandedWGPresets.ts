export const stkVariableClarinet = "wg";
export const stkIdentifierClarinet = "BandedWG";

const bandedWGPresets = {
    bowPressure: {
        name: "bowPressure",
        label: "Bow Pressure",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    bowMotion: {
        name: "bowMotion",
        label: "Bow Motion",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    bowRate: {
        name: "bowRate",
        label: "Bow Rate",
        value: 0.2,
        min: 0,
        max: 2,
        screenInterface: "knob",
    },
    strikePosition: {
        name: "rate",
        label: "Rate",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // rate in seconds
    integrationConstant: {
        name: "integrationConstant",
        label: "Integration Constant",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // freq in hZ
    modesGain: {
        name: "modesGain",
        label: "Modes Gain",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    preset: { // 0 -> uniform bar / 1 -> Tuned Bar / 2 -> Glass Harmonica  3 -> Tibetan Bowl
        name: "preset",
        label: "Preset",
        value: 0,
        min: 0,
        max: 3,
        screenInterface: "switch_4_0_1_2_3",
    },
    pluck: {
        name: "pluck",
        label: "Pluck",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    startBowing: {
        name: "startBowing",
        label: "Start Bowing",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    stopBowing: {
        name: "stopBowing",
        label: "Stop Bowing",
        value: 0.8,
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

export default bandedWGPresets;