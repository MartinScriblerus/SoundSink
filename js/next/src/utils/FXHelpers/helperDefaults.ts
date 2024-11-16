export const defaultNoteVals = {
    // master: ["whole/4"],
    // oscs: ["whole/4"],
    // stks: ["whole/4"],
    // samples: ["whole/4"],
    // linesIn: ["whole/4"]
    master: [4],
    oscs: [4],
    stks: [4],
    samples: [8],
    linesIn: [4]
}

export const winFuncEnvDefault = {
    osc1: {
        attackTime: 16,
        releaseTime: 16,
        envSetting: 0,
    },
    osc2: '',
    stk: {
        attackTime: 16,
        releaseTime: 16,
        envSetting: 0,
    },
    sampler: {
        attackTime: 16,
        releaseTime: 16,
        envSetting: 0,
    },
    audioIn: '',
};

export const powerADSRDefault = {
    osc1: {
        attackTime: 1000,
        attackCurve: 0.5,
        decayTime: 1000,
        decayCurve: 1.25,
        sustainLevel: 0.5,
        releaseTime: 1000,
        releaseCurve: 1.5,
    },
    osc2: {},
    stk: {
        attackTime: 1000,
        attackCurve: 0.5,
        decayTime: 1000,
        decayCurve: 1.25,
        sustainLevel: 0.5,
        releaseTime: 1000,
        releaseCurve: 1.5,
    },
    sampler: {
        attackTime: 1000,
        attackCurve: 0.5,
        decayTime: 1000,
        decayCurve: 1.25,
        sustainLevel: 0.5,
        releaseTime: 1000,
        releaseCurve: 1.5,
    },
    audioIn: {},
};

export const expEnvDefault = {
    osc1: {
        T60: 3,
        radius: 0.995,
        value: 0,
    },
    osc2: {},
    stk: {
        T60: 3,
        radius: 0.995,
        value: 0,
    },
    sampler: {
        T60: 3,
        radius: 0.995,
        value: 0,
    },
    audioIn: {},
};

export const wpDiodeDefault = {
    osc1: {
        cutoff: 1,
        resonance: 17,
        nlp_type: 1,
        nonlinear: 0,
        saturation: 0.1
    },
    osc2: {},
    stk: {
        cutoff: 1,
        resonance: 17,
        nlp_type: 1,
        nonlinear: 0,
        saturation: 0.1
    },
    sampler: {
        cutoff: 1,
        resonance: 17,
        nlp_type: 1,
        nonlinear: 0,
        saturation: 0.1
    },
    audioIn: {},
};

export const korg35Default = {
    osc1: {
        cutoff: 1,
        resonance: 2,
        nonlinear: 0,
        saturation: 0.1
    },
    osc2: {},
    stk: {
        cutoff: 1,
        resonance: 2,
        nonlinear: 0,
        saturation: 0.1
    },
    sampler: {
        cutoff: 1,
        resonance: 2,
        nonlinear: 0,
        saturation: 0.1
    },
    audioIn: {},
};

export const modulateDefault = {
    osc1: {
        vibratoRate: 6.0,
        vibratoGain: 0.2,
        randomGain: 0.2,
    },
    osc2: {},
    stk: {
        vibratoRate: 6.0,
        vibratoGain: 0.2,
        randomGain: 0.2,
    },
    sampler: {
        vibratoRate: 6.0,
        vibratoGain: 0.2,
        randomGain: 0.2,
    },
    audioIn: {},
};

export const delayDefault = {
    osc1: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    osc2: {},
    stk: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    sampler: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    audioIn: {},
};

export const delayADefault = {
    osc1: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    osc2: {},
    stk: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    sampler: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    audioIn: {},
};

export const delayLDefault = {
    osc1: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    osc2: {},
    stk: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    sampler: {
        delay: 500,
        syncDelay: 1,
        lines: 3,
        zero: 0.5,
        b0: 0.5,
        b1: 0.2,
    },
    audioIn: {},
};

export const expDelayDefault = {
    osc1: {
        ampcurve: 2.0,
        durcurve: 2.0,
        delay: 0,
        mix: 0.5,
        reps: 4,
        gain: 1.0,
    },
    osc2: {},
    stk: {
        ampcurve: 2.0,
        durcurve: 2.0,
        delay: 0,
        mix: 0.5,
        reps: 4,
        gain: 1.0,
    },
    sampler: {
        ampcurve: 2.0,
        durcurve: 2.0,
        delay: 0,
        mix: 0.5,
        reps: 4,
        gain: 1.0,
    },
    audioIn: {},
};

export const ellipticDefault = {
    osc1: {
        filterLow: 500,
        filterMid: 600,
        filterHigh: 650,
        atten: 80.0,
        ripple: 10.0,
        filterMode: 0
    },
    osc2: {},
    stk: {
        filterLow: 500,
        filterMid: 600,
        filterHigh: 650,
        atten: 80.0,
        ripple: 10.0,
        filterMode: 0
    },
    sampler: {
        filterLow: 500,
        filterMid: 600,
        filterHigh: 650,
        atten: 80.0,
        ripple: 10.0,
        filterMode: 0
    },
    audioIn: {},
};

export const spectacleDefault = {
    osc1: {
        bands: 5,
        delay: 3,
        eq: 0,
        feedback: 0,
        fftlen: 3,
        freqMax: 4100,
        freqMin: 100,
        mix: 0.8,
        overlap: 3,
        table: 2,
    },
    osc2: {},
    stk: {
        bands: 5,
        delay: 3,
        eq: 0,
        feedback: 0,
        fftlen: 3,
        freqMax: 4100,
        freqMin: 100,
        mix: 0.8,
        overlap: 3,
        table: 2,
    },
    sampler: {
        bands: 5,
        delay: 3,
        eq: 0,
        feedback: 0,
        fftlen: 3,
        freqMax: 4100,
        freqMin: 100,
        mix: 0.8,
        overlap: 3,
        table: 2,
    },
    audioIn: {},
};

