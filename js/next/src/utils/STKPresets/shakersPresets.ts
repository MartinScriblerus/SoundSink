export const stkVariableShakers = "shak";
export const stkIdentifierShakers = "Shakers";

//  - Maraca = 0
//  - Cabasa = 1
//  - Sekere = 2
//  - Guiro = 3
//  - Water Drops = 4
//  - Bamboo Chimes = 5
//  - Tambourine = 6
//  - Sleigh Bells = 7
//  - Sticks = 8
//  - Crunch = 9
//  - Wrench = 10
//  - Sand Paper = 11
//  - Coke Can = 12
//  - Next Mug = 13
//  - Penny + Mug = 14
//  - Nickle + Mug = 15
//  - Dime + Mug = 16
//  - Quarter + Mug = 17
//  - Franc + Mug = 18
//  - Peso + Mug = 19
//  - Big Rocks = 20
//  - Little Rocks = 21
//  - Tuned Bamboo Chimes = 22

const shakersPresets = {
    preset: {
        name: "preset",
        label: "Preset",
        value: 1,
        min: 0,
        max: 22,
        screenInterface: "intSpinner",
        fxType: "stk",
    },
    energy: {
        name: "energy", // if this does not work, try controlChange 2
        label: "Energy",
        value: 1,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    decay: {
        name: "decay",
        label: "Decay",
        value: 0.7,
        min: 0,
        max: 1,
        screenInterface: "knob",
        fxType: "stk",
    },
    objects: {
        name: "objects",
        label: "Objects",
        value: 100,
        min: 0,
        max: 128,
        screenInterface: "intSpinner_128",
        fxType: "stk",
    },
    gain: {
        name: "gain",
        label: "Gain",
        value: 3,
        min: 0,
        max: 6,
        screenInterface: "knob",
        fxType: "stk",
    },
};

export default shakersPresets;