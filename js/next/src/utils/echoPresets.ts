export const stkVariableEcho = "e";
export const stkIdentifierEcho = "Echo";

const echoPresets = {
    delay: {
        name: "delay",
        label: "Delay",
        value: 0.50,
        min: 0,
        max: 4,
        screenInterface: "knob",
    },
    max: {
        name: "max",
        label: "Max",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    mix: {
        name: "mix",
        label: "Mix",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
};

export default echoPresets;