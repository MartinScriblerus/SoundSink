export function getBaseUrl() {
    return process.env.VERCEL_ENV === "development" || "local"
        ? `http://localhost:3000`
        : process.env.NEXT_PUBLIC_URL
}

export const analysisObjectDefaults = {
    osc: {
        centroid: [],
        flux: [],
        rms: [],
        mfccEnergy: [],
        mfccVals: [],
        rolloff: [],
        dct: [],
        gain: [],
        freq: [],
        kurtosis: [],
    },
    stk: {
        centroid: [],
        flux: [],
        rms: [],
        mfccEnergy: [],
        mfccVals: [],
        rolloff: [],
        dct: [],
        gain: [],
        freq: [],
        kurtosis: [],
    },
    sampler: {
        centroid: [],
        flux: [],
        rms: [],
        mfccEnergy: [],
        mfccVals: [],
        rolloff: [],
        dct: [],
        gain: [],
        freq: [],
        kurtosis: [],
    },
    audioin: {
        centroid: [],
        flux: [],
        rms: [],
        mfccEnergy: [],
        mfccVals: [],
        rolloff: [],
        dct: [],
        gain: [],
        freq: [],
        kurtosis: [],
    },
}

export async function convertFrequency(notefreqchart: any, freq: number, microFreq: any, microMidiNum: any) { 
    console.log("FREQ??? ", freq, "NOTE FREQ CHART??? ", notefreqchart, "MICROFREQ??? ", microFreq, "MICROMIDINUM??? ", microMidiNum);
    const freqLets: string[] = [];
    Object.values(notefreqchart).forEach((val: any, idx: number) => {        
        // console.log("WHAT IS VAL? ", val, Object.keys(notefreqchart)[idx - 1])
        if (!freqLets.includes(
            Object.keys(notefreqchart)[idx - 1])
        ) freqLets.push(Object.keys(notefreqchart)[idx - 1]);
    });
    // console.log("FREQLETS: ", freqLets);
    // console.log("NEW MICRO ARR: ", newMicroTonalArr);
    return freqLets;
}