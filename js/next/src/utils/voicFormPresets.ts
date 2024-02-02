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
    phoneme: {
        name: "phoneme",
        label: "Phoneme",
        value: 2, // NOTE THAT PHONEME TAKES A STRING!!!
        min: 0,
        max: 31,
        screenInterface: "intSpinner_31",
    },
    phonemeNum: {
        name: "phonemeNum",
        label: "Vowel/Phoneme",
        value: 4,
        min: 0,
        max: 128,
        screenInterface: "intSpinner_128",
    },
    speak: {
        name: "speak",
        label: "Speak",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    quiet: {
        name: "quiet",
        label: "Quiet",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    vibratoFreq: {
        name: "vibratoFreq",
        label: "Vibrato Freq",
        value: 10,
        min: 0,
        max: 1000,
        screenInterface: "knob",
    }, // freq in hZ
    vibratoGain: {
        name: "vibratoGain",
        label: "Vibrato Gain",
        value: 0.0,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    loudness: {
        name: "loudness",
        label: "Loudness (Spectral Tilt)",
        value: 4,
        min: 0,
        max: 128,
        screenInterface: "intSpinner_128",
    },
    reverb: {
        name: "reverb",
        label: "Reverb",
        value: 5,
        min: 0,
        max: 100,
        screenInterface: "knob",
    }, // reverb amount (0-100)
};

export default voicFormPresets;