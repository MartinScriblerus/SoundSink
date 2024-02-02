export const stkVariableDelay = "d";
export const stkIdentifierDelay = "Delay";

const pitShiftPresets = {
    mix: {
        name: "mix",
        label: "Mix",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    shift: {
        name: "shift",
        label: "Shift",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    }, // reverb amount (0-100)
};

export default pitShiftPresets;