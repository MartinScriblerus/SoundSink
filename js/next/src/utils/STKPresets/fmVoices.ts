export const stkVariableFMVoices = "fmVoic";
export const stkIdentifierFMVoices = "FMVoices";

const fmVoicesPresets = {
    vowel: {
        name: "vowel", // if this does not work, try controlChange 2
        label: "Vowel",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    spectralTilt: {
        name: "spectralTilt", // if this does not work, try controlChange 2
        label: "Spectral Tilt",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoSpeed: {
        name: "lfoSpeed",
        label: "LFO Speed",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    lfoDepth: {
        name: "lfoDepth",
        label: "LFO Depth",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
  
    // reverb: {
    //     name: "reverb",
    //     label: "Reverb",
    //     value: 5,
    //     min: 0,
    //     max: 100,
    //     screenInterface: "knob",
    // }, // reverb amount (0-100)
};

export default fmVoicesPresets;