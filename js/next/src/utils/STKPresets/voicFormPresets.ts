export const stkVariableVoiceForm = "voic";
export const stkIdentifierVoiceForm = "VoicForm";
export const phonemes = ["eee",  "ihh",  "ehh",  "aaa", 
"ahh",  "aww",  "ohh",  "uhh", 
"uuu",  "ooo",  "rrr",  "lll", 
"mmm",  "nnn",  "nng",  "ngg", 
"fff",  "sss",  "thh",  "shh", 
"xxx",  "hee",  "hoo",  "hah", 
"bbb",  "ddd",  "jjj",  "ggg", 
"vvv",  "zzz", "thz",  "zhh" ];

const voicFormPresets = {
    phonemeNum: {
        name: "phonemeNum",
        label: "Phoneme",
        value: 2,
        min: 0,
        max: 128,
        screenInterface: "intSpinner",
    },
    speak: {
        name: "speak",
        label: "Speak",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    quiet: {
        name: "quiet",
        label: "Quiet",
        value: 0.8,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibr Freq",
        value: 440,
        min: 0,
        max: 1200,
        screenInterface: "knob",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibr Gain",
        value: 0.4,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    loudness: {
        name: "loudness",
        label: "Spectral Tilt",
        value: 100,
        min: 0,
        max: 128,
        screenInterface: "intSpinner_128",
    },
};

export default voicFormPresets;