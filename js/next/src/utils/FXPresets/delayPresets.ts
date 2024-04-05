export const stkVariableDelay = "delay";
export const stkIdentifierDelay = "Delay";
export const stkVariableDelayA = "delayA";
export const stkIdentifierDelayA = "DelayA";
export const stkVariableDelayL = "delayL";
export const stkIdentifierDelayL = "DelayL";
export const stkVariableEcho = "echo";
export const stkIdentifierEcho = "Echo";

// Establishing PATTERNS here... 
    // 1.) types split by *** snake case *** require function syntax for getter
    // 2.) types split by *** array -> snake case *** will be followed by array item types (multiple types are allowed)
    // 3.) interface with *** Reverse *** will subtract val from max (thus val 2 === max - 2)
    // 4.) interface intspinner converts to floats ints (already implemented)
    // 5.) knobspinner handles floats (already implemented)
    // 6.) dur values are measured in milliseconds
    // 7.) group name (int -> string) will be used for styling and layout
        // FX Groups Int #s
            // 0. Gain / Distortion
            // 1. Delays / Echos
            // 2. Chorus / Mods / Pans
            // 3. Reverbs
            // 4. ADSRs
            // 5. Filters
            // 6. Pitch Trackers
            // 7. Envelopes

const delayPresets = {
    delay: {
        name: "delay",
        label: "Delay",
        value: 500,
        min: 1,
        max: 6000,
        screenInterface: "intspinner",
        type: "dur_needsFun_delay_",
        group: 1,
    },
    // max: {
    //     name: "max",
    //     label: "Delay Max",
    //     value: 500,
    //     min: 1,
    //     max: 6000,
    //     screenInterface: "intspinner",
    //     type: "dur_needsFun_Delay",
    //     group: 1,
    // },
    lines: {
        name: "lines",
        label: "Delay Lines",
        value: 3,
        min: 1,
        max: 12,
        screenInterface: "intspinner",
        type: "int_needsFun_delay_delayLines",
        group: 1,
    },
};

export const delayLPresets = {
    delay: {
        name: "delay",
        label: "Delay",
        value: 500,
        min: 1,
        max: 6000,
        screenInterface: "intspinner",
        type: "dur_needsFun_delayL",
        group: 1,
    },
    // max: {
    //     name: "max",
    //     label: "Delay Max",
    //     value: 500,
    //     min: 1,
    //     max: 6000,
    //     screenInterface: "intspinner",
    //     type: "dur_needsFun_DelayL",
    //     group: 1,
    // },
    lines: {
        name: "lines",
        label: "Delay Lines",
        value: 3,
        min: 0,
        max: 12,
        screenInterface: "intspinner",
        type: "int_needsFun_delayL_delayLines",
        group: 1,
    },
};

export const delayAPresets = {
    delay: {
        name: "delay",
        label: "Delay",
        value: 500,
        min: 1,
        max: 6000,
        screenInterface: "intspinner",
        type: "dur_needsFun_delayA",
        group: 1,
    },
    // max: {
    //     name: "max",
    //     label: "Delay Max",
    //     value: 500,
    //     min: 1,
    //     max: 6000,
    //     screenInterface: "intspinner",
    //     type: "dur_needsFun_DelayA",
    //     group: 1,
    // },
    lines: {
        name: "lines",
        label: "Delay Lines",
        value: 3,
        min: 0,
        max: 12,
        screenInterface: "intspinner",
        type: "int_needsFun_delayA_delayLines",
        group: 1,
    },
};

export const echoPresets = {
    delay: {
        name: "delay",
        label: "Echo",
        value: 10,
        min: 0,
        max: 6000,
        screenInterface: "intspinner",
        type: "dur",
        group: 1,
    },
    max: {
        name: "max",
        label: "Max",
        value: 10,
        min: 1,
        max: 6000,
        screenInterface: "intspinner",
        type: "dur",
        group: 1,
    },
    mix: {
        name: "mix",
        label: "Mix",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 1,
    },
    // gain: {
    //     name: "gain",
    //     label: "Gain",
    //     value: 1.0,
    //     min: 0.0,
    //     max: 1.0,
    //     screenInterface: "knob",
    //     type: "float",
    //     group: 1,
    // },
};

export default delayPresets;