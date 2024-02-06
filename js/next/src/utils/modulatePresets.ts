export const stkVariableModulate = "mod";
export const stkIdentifierModulate = "Modulate";

const modulatePresets = {
    vibratoRate: {
        name: "vibratoRate",
        label: "Vibrato Rate",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibrato Gain",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // reverb amount (0-100)
    randomGain: {
        name: "randomGain",
        label: "Random Gain",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }
};

export default modulatePresets;