export const stkVariableMandolin = "man";
export const stkIdentifierMandolin = "Mandolin";

const mandolinPresets = { // .clair
    bodySize: {
        name: "bodySize",
        label: "Body Size",
        value: 0.5,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // lfo gain 
    pluckPos: {
        name: "pluckPos",
        label: "Pluck Position",
        value: 0.7,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // lfo pitch
    stringDamping: {
        name: "stringDamping",
        label: "String Damping",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // lfo voice 
    stringDetune: {
        name: "stringDetune",
        label: "String Detune",
        value: 0.1,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // offset (controls note offset in semitones)
    pluck: {
        name: "pluck",
        label: "Pluck",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    }, // filter cutoff amount (0-100)
//    bodyIR: {
//         name: "bodyIR",
//         label: "Body IR",
//         value: 'me.dir() + "ByronGlacier.wav"',
//         min: 0,
//         max: 1,
//         screenInterface: "none",
//    } // impulse response file source
};

export default mandolinPresets;