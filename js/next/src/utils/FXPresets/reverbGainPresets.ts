export const stkVariableJCRev = "jcr";
export const stkIdentifierJCRev = "JCRev";
export const stkVariableNRev = "nr";
export const stkIdentifierNRev = "NRev";
export const stkVariablePCRev = "pcr";
export const stkIdentifierPCRev = "PCRev";
export const stkVariableGVerb = "gverb";
export const stkIdentifierGVerb = "GVerb";
export const stkVariableGain = "g";
export const stkIdentifierGain = "Gain";
export const stkVariableNoise = "noisePresets";
export const stkIdentifierNoise = "Noise";


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

const jcRevPresets = {
    mix: {
        name: "mix",
        label: "JCRev Mix",
        value: 0.00,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 3,
    },
};

export const nRevPresets = {
    mix: {
        name: "mix",
        label: "NRev Mix",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 3,
    },
};

export const pcRevPresets = {
    mix: {
        name: "mix",
        label: "PCRev Mix",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 3,
    },
};

export const gVerbPresets = {
    bandwidth: {
        name: "bandwidth",
        label: "Bandwidth",
        value: 0.50,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
    damping: {
        name: "damping",
        label: "Damping",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
    dry: {
        name: "dry", // dry signal
        label: "Dry",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
    early: {
        name: "early",
        label: "Early",
        value: 0, // default 0.4
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
    revtime: {
        name: "revtime",
        label: "Rev Time",
        value: 0, // default 0.5
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "dur_dur",
        group: 3,
    },
    roomSize: {
        name: "roomSize",
        label: "Room Size",
        value: 30.0,
        min: 1.0,
        max: 300.0,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
    tail: {
        name: "tail",
        label: "Tail",
        value: 0, // default 0.5
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float_float",
        group: 3,
    },
};

export const gainPresets = {
    gain: {
        name: "gain",
        label: "Gain",
        value: 0.25,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "float",
        group: 0,
    },
};

export const noisePresets = {
    name: "noiseSource",
    label: "Noise",
    value: 0,
    min: 0,
    max: 100,
    screenInterface: "knob",
    type: "float",
    group: 0,
} // noise level (0-100)

export default jcRevPresets;