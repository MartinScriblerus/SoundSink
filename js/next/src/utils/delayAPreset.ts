export const stkVariableDelayA = "da";
export const stkIdentifierDelayA = "DelayA";

const delayAPresets = {
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
    }, // reverb amount (0-100)
};

export default delayAPresets;