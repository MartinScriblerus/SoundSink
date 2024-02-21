export const stkVariableElliptic = "elliptic";
export const stkIdentifierElliptic = "Elliptic";

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

const ellipticPresets = {
    atten: {
        name: "atten",
        label: "Attenuation",
        value: 0,
        min: 0,
        max: 100,
        screenInterface: "knob",
        type: "float_float",
        group: 5,
    },
    bpfStop: {
        name: "bpfStop",
        label: "Bpf Stop",
        value: 0,
        min: 0,
        max: 500,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    bpfHip: {
        name: "bpfHip",
        label: "Bpf Hip",
        value: 0,
        min: 0,
        max: 600,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    bpfLop: {
        name: "bpfLop",
        label: "Bpf Lop",
        value: 0,
        min: 0,
        max: 650,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    bypass: {
        name: "bypass",
        label: "Bypass",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "intspinner",
        type: "dur",
        group: 5,
    },
    hpfStop: {
        name: "hpfStop",
        label: "Hpf Stop",
        value: 0,
        min: 0,
        max: 400,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    hpfPass: {
        name: "hpfPass",
        label: "Hpf Pass",
        value: 0,
        min: 0,
        max: 500,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    lpfStop: {
        name: "lpfStop",
        label: "Lpf Stop",
        value: 0,
        min: 0,
        max: 650,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    lpfPass: {
        name: "lpfPass",
        label: "Lpf Pass",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "knob",
        type: "void_float",
        group: 5,
    },
    ripple: {
        name: "ripple",
        label: "Ripple",
        value: 0, // measured in dB—default 0.2
        min: 0,
        max: 10,
        screenInterface: "knob",
        type: "float_float",
        group: 5,
    },
};

export default ellipticPresets;