export const stkVariableWinFuncEnv = "winfuncenv";
export const stkIdentifierWinFuncEnv = "WinFuncEnv";

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

const winFuncEnvPresets = {
    attackTime: {
        name: "attackTime",
        label: "Attack Time",
        value: 0.1,
        min: 0.01,
        max: 1.0,
        screenInterface: "knob",
        type: "dur",
        group: 8,
    },
    releaseTime: {
        name: "releaseTime",
        label: "Release Time",
        value: 0.1,
        min: 0.01,
        max: 1.0,
        screenInterface: "knob",
        type: "dur",
        group: 8,
    },
    setBlackman: {
        name: "setBlackman",
        label: "Blackman On",
        value: 0,
        min: 0,
        max: 1,
        screenInterface: "intspinner",
        type: "bool",
        group: 8,
    },
    // blackmanDerivative_0: {
    //     name: "setBlackmanderivative_0",
    //     label: "Blackman Derivative 0",
    //     value: 0.01,
    //     min: 0.01,
    //     max: 0.25,
    //     screenInterface: "knob",
    //     type: "float",
    //     group: 8,
    // },
    // blackmanDerivative_1: {
    //     name: "setBlackmanderivative_1",
    //     label: "Blackman Derivative 1",
    //     value: 0.01,
    //     min: 0.01,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "float",
    //     group: 8,
    // },
    // blackmanDerivative_2: {
    //     name: "setBlackmanderivative_2",
    //     label: "Blackman Derivative 2",
    //     value: 0.01,
    //     min: 0.01,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "float",
    //     group: 8,
    // },
    // blackmanDerivative_3: {
    //     name: "setBlackmanderivative_3",
    //     label: "Blackman Derivative 3",
    //     value: 0.01,
    //     min: 0.01,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "void_float",
    //     group: 8,
    // },
    // setBlackmanHarris: {
    //     name: "setBlackmanHarris",
    //     label: "Blackman Harris On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setBlackmanNutall: {
    //     name: "setBlackmanNutall",
    //     label: "Blackman Nutall On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setExponential: {
    //     name: "setExponential",
    //     label: "Exponential",
    //     value: (8.69/60),
    //     min: 0.01,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "float",
    //     group: 8,
    // },
    // setHann: {
    //     name: "setHann",
    //     label: "Hanning On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setHannPoisson: {
    //     name: "setHannPoisson",
    //     label: "Hann Poisson",
    //     value: (8.69/60),
    //     min: 0,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "int_float",
    //     group: 8,
    // },
    // setNutall: {
    //     name: "setNutall",
    //     label: "Nutall On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setParzen: {
    //     name: "setParzen",
    //     label: "Parzen On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setPoisson: {
    //     name: "setPoisson",
    //     label: "Poisson On",
    //     value: 0,
    //     min: 0,
    //     max: 12,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setSigmoid: {
    //     name: "setSigmoid",
    //     label: "Sigmoid",
    //     value: 2.0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "knob",
    //     type: "int_float",
    //     group: 8,
    // },
    // setTukey: {
    //     name: "setTukey",
    //     label: "Tukey On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
    // setWelch: {
    //     name: "setWelch",
    //     label: "Welch On",
    //     value: 0,
    //     min: 0,
    //     max: 1,
    //     screenInterface: "intspinner",
    //     type: "bool",
    //     group: 8,
    // },
};

export default winFuncEnvPresets;