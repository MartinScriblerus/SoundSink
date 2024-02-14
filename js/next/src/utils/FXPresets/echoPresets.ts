export const stkVariableEcho = "e";
export const stkIdentifierEcho = "Echo";

const echoPresets = {
    delay: {
        name: "delay",
        label: "Echo",
        value: 0,
        min: 0,
        max: 6000,
        screenInterface: "knob",
        type: "dur",
        group: 1,
    },
    max: {
        name: "max",
        label: "Echo Max",
        value: 0,
        min: 0,
        max: 6000,
        screenInterface: "knob",
        type: "dur",
        group: 1,
    },
    mix: {
        name: "mix",
        label: "Echo Mix",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 1,
    },
};

export default echoPresets;