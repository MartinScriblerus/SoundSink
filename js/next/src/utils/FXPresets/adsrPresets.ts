export const stkVariableADSR = "adsr";
export const stkIdentifierADSR = "ADSR";

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

const adsrPresets = {
    attackRate: {
        name: "adsr_attackRate",
        label: "Attack Rate",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 4,
    },
    attackTime: {
        name: "adsr_attackTime",
        label: "Attack Time",
        value: 0,
        min: 0,
        max: 2000,
        screenInterface: "knob",
        type: "dur", 
        group: 4,
    },
    decayRate: {
        name: "adsr_decayRate",
        label: "Decay Rate",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 4,
    },
    decayTime: {
        name: "adsr_decayTime",
        label: "Decay Time",
        value: 0,
        min: 0,
        max: 2000,
        screenInterface: "knob",
        type: "dur",
        group: 4,
    },
    releaseRate: {
        name: "adsr_releaseRate",
        label: "Release Rate",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 4,
    },
    releaseTime: {
        name: "adsr_releaseTime",
        label: "Release Time",
        value: 0,
        min: 0,
        max: 2000,
        screenInterface: "knob",
        type: "dur",
        group: 4,
    },
    sustainLevel: {
        name: "adsr_sustainLevel",
        label: "Sustain Level",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 4,
    },
};

export default adsrPresets;