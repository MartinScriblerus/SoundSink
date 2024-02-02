export const stkVariableSitar = "sit";
export const stkIdentifierSitar = "Sitar";

const sitarPresets = {
    pluck: {
        name: "pluck",
        label: "Pluck",
        value: 0.50,
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

export default sitarPresets;