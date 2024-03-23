export const stkVariableSpectacle= "spectacle";
export const stkIdentifierSpectacle = "Spectacle";

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

const spectaclePresets = {
    bands: {
        name: "bands",
        label: "Bands",
        value: 64, // default 20
        min: 1,
        max: 511,
        screenInterface: "intspinner",
        type: "int",
        group: 7,
    },
    delay: {
        name: "delay",
        label: "Delay",
        value: 1000,
        min: 1,
        max: 4000,
        screenInterface: "intspinner",
        type: "dur",
        group: 7,
    },
    // delayMax: { // # of comb filters (default 5)
    //     name: "delayMax",
    //     label: "Delay Max",
    //     value: 4000,
    //     min: 4000,
    //     max: 4000,
    //     screenInterface: "knob",
    //     type: "dur",
    //     group: 7,
    // },
    // delayMin: { // # of comb filters (default 5)
    //     name: "delayMin",
    //     label: "Delay Min",
    //     value: 1,
    //     min: 1,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "dur",
    //     group: 7,
    // },
    eq: { 
        name: "eq",
        label: "EQ",
        value: 10,
        min: 0.001,
        max: 85,
        screenInterface: "knob",
        type: "float",
        group: 7,
    },
    // feedback: {
    //     name: "feedback",
    //     label: "Feedback",
    //     value: 1, // => this should be 0 for -1 to 1 range
    //     min: 0.001,
    //     max: 2,
    //     screenInterface: "knob", // need a knob for -1 0 1
    //     type: "float",
    //     group: 7,
    // },
    // fftlen: {
    //     name: "fftlen",
    //     label: "FFT Len",
    //     value: 8, // 512 here... see powers of 2
    //     min: 0,
    //     max: 1, // this will be exponent for powers of 2 (0 - 4096)
    //     screenInterface: "exponentialintspinner", // should this be a float knob?
    //     type: "int",
    //     group: 7,
    // },
    freqMax: { 
        name: "freqMax",
        label: "Freq Max",
        value: 1200,
        min: 0.01,
        max: 2000,
        screenInterface: "intspinner",
        type: "int",
        group: 7,
    },
    freqMin: {
        name: "freqMin",
        label: "Freq Min",
        value: 100,
        min: 100,
        max: 1200,
        screenInterface: "intspinner",
        type: "int",
        group: 7,
    },
    hold: { // # of comb filters (default 5)
        name: "hold",
        label: "Hold",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "intspinner", // 1 to hold / 0 to bypass
        type: "int",
        group: 7,
    },
    mix: { // # of comb filters (default 5)
        name: "mix",
        label: "Mix",
        value: 0.01,
        min: 0.01,
        max: 0.5,
        screenInterface: "knob",
        type: "float",
        group: 7,
    },
    overlap: { // # of comb filters (default 5)
        name: "overlap",
        label: "Overlap",
        value: 4,
        min: 2,
        max: 6,
        screenInterface: "intspinner",
        type: "int",
        group: 7,
    },
    // posteq: { // # of comb filters (default 5)
    //     name: "posteq",
    //     label: "Post EQ",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner", // true applies EQ after delay / false(0) applies it before
    //     type: "int",
    //     group: 7,
    // },
    // fftLen: { // # of comb filters (default 5)
    //     name: "fftLen",
    //     label: "FFT Len",
    //     value: 0.2,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "float_float",
    //     group: 7,
    // },
   
   
    // Set "delay", “eq”, or "feedback" tables to the types "random", "ascending", or "descending." Example: table("delay", "random")
    // =================================================================================================
    // table: { // # of comb filters (default 5)
    //     name: "table",
    //     label: "Table",
    //     value: 4,
    //     min: 0, // 0-2 desc / 3 - 5 random / 6 - 8 asc (for all 3 types) 
    //     max: 8,
    //     screenInterface: "stringSpectacleTable",
    //     type: "string_string",
    //     group: 7,
    // },
};

export default spectaclePresets;