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
        screenInterface: "intSpinner_22",
    },
    energy: {
        name: "energy", // if this does not work, try controlChange 2
        label: "Energy",
        value: 0.3,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    decay: {
        name: "decay",
        label: "Decay",
        value: 0.2,
        min: 0,
        max: 1,
        screenInterface: "knob",
    },
    objects: {
        name: "objects",
        label: "Objects",
        value: 1,
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

export default shakersPresets;