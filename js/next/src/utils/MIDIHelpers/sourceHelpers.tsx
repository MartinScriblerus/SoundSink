import { Sources } from "@/types/audioTypes";

export const winFuncString = (source: string, attackDenom: number, releaseDenom: number, envSetting: string) => `winfuncenv_${source}.set${envSetting}(); for (int i; i < 250; i++) { spork ~ playWindow(winfuncenv_${source}, whole/${attackDenom}, whole/${releaseDenom}); }`;

export const powerADSRString = (source: string, attackTime: number, attackCurve: number, decayTime: number, decayCurve: number, sustainLevel: number, releaseTime: number, releaseCurve: number) => `

fun void playPowerADSRWindow(PowerADSR @ win, dur attackTime, float attackCurve, dur decayTime, float decayCurve, float sustainLevel, dur releaseTime, float releaseCurve) {
    win.set(attackTime, decayTime, sustainLevel, releaseTime);
    win.setCurves(attackCurve, decayCurve, releaseCurve);
  
    while (true) {
        win.keyOn();
        attackTime => now;
        win.keyOff();
        releaseTime => now;
    }
}
spork ~ playPowerADSRWindow(poweradsr_${source}, ${attackTime}::ms, ${attackCurve}, ${decayTime}::ms, ${decayCurve}, ${sustainLevel}, ${releaseTime}::ms, ${releaseCurve});

`;

export const expEnvString = (source: string, T60: number, radius: number, value: number) => `

    fun void playExpEnvWindow(ExpEnv @ win, dur T60, float radius, dur value) {
        radius => win.radius;    
        T60 => win.T60; 
        1 => win.keyOn; 
        
        value => now;
        while (true)  {
            1.0 => win.gain;
            1 => win.keyOn;
            value => now;
            0 => win.keyOn;
        }
    }
    spork ~ playExpEnvWindow(expenv_${source}, whole/${Math.pow(2, T60)}, ${radius}, whole/${Math.pow(2, value)});
`;

export const wpDiodeLadderString = (source: string, cutoff: number, resonance: number, nlp_type: number, nonlinear: number, saturation: number) => {
    const nlp_str = nlp_type === 1 ? 'true' : 'false';
    const nonlinear_str = nonlinear === 1 ? 'true' : 'false';
    return `
    fun void playWpDiodeLadderWindow(WPDiodeLadder @ win, float cutoff, int resonance,  nlp_type, int nonlinear, float saturation) {
        saw2 => blackhole;
        SinOsc sinb => blackhole;
  
        0.04 => saw2.gain;
        40 => saw2.freq;
        cutoff => sinb.freq;
        // 0.0125 => sinb.freq;
        resonance => win.resonance;
        nonlinear => win.nonlinear;
        nlp_type => win.nlp_type;
        saturation => win.saturation;
        
        0.15 => win.gain;

        while(true){
           
            4 * sinb.last() => saw2.freq;
            40 + (Math.pow((sinb.last())/2.0,2) * (resonance * 1000)) => win.cutoff;
            1::samp => now;
        }
    }

    spork ~ playWpDiodeLadderWindow(wpdiodeladder_${source}, ${cutoff}, ${resonance}, ${nlp_str}, ${nonlinear_str}, ${saturation});
`};

export const wpKorg35String = (source: string, cutoff: number, resonance: number, nonlinear: number, saturation: number) => {
    const nonlinear_str = nonlinear === 1 ? 'true' : 'false';

    return `
    fun void playWpKorg35Window(WPKorg35 @ win, float cutoff, int resonance, int nonlinear, float saturation) {
        saw2 => blackhole;
        SinOsc sinb => blackhole;
  
        0.004 => saw2.gain;
        40 => saw2.freq;
        cutoff => sinb.freq;
        // 0.0125 => sinb.freq;
        resonance => win.resonance;
        nonlinear => win.nonlinear;
        saturation => win.saturation;
        
        0.2 => win.gain;

        while(true){
            4 * sinb.last() => saw2.freq;
            40 + (Math.pow((sinb.last())/2.0,2) * (resonance * 1000)) => win.cutoff;
            1::samp => now;
        }
    }

    spork ~ playWpKorg35Window(wpkorg35_${source}, ${cutoff}, ${resonance}, ${nonlinear_str}, ${saturation});
    `
};

export const modulateString = (source: string, vibratoRate: number, vibratoGain: number, randomGain: number, currentNoteVals: any) => {

    return `

    fun void playModWindow(Modulate @ win, float vibratoRate, float vibratoGain, float randomGain) {
        // multiply
        // 3 => hpf.op;
        if ("${source}" == "osc1") {
            3 => hpf.op;
        } else if ("${source }" == "s1") {
            3 => limiter_Sampler.op;
        } else if ("${source}" == "stk1") {
            3 => limiter_STK.op;
        } 

        // set freq
        // 220 => testSin.freq;

        // set rate in hz
        vibratoRate => win.vibratoRate;
        // set gain
        vibratoGain => win.vibratoGain;
        // set random gain
        randomGain => win.randomGain;

        whole/${currentNoteVals.master[0]} - (now % whole/${currentNoteVals.master[0]}) => now;
  
    }
    spork ~ playModWindow(mod_${source}, ${vibratoRate}, ${vibratoGain}, ${randomGain});
    `;
};

export const ellipticString = (source: string, filterLow: number, filterMid: number, filterHigh: number, atten: number, ripple: number, filterMode: number, currentNoteVals: any) => {
    console.log('get elliptic vals: ', source, filterLow, filterMid, filterHigh, ripple, atten, filterMode);
    return `
    fun void playEllipticWindow(Elliptic @ win, dur beat, float lower, float middle, float upper, float atten, float ripple, int filterMode) {
        
        atten => win.atten;
        ripple => win.ripple;

        if (filterMode == 0) {
            win.bpf(upper,middle,lower);
        } else if (filterMode == 1) {
            win.lpf(lower, upper);
        } else if (filterMode == 2) {
            win.hpf(upper, lower);
        }
        whole/${currentNoteVals.master[0]} - (now % whole/${currentNoteVals.master[0]}) => now;
    }
    spork ~ playEllipticWindow(elliptic_${source}, beat, ${filterLow}, ${filterMid}, ${filterHigh}, ${atten}, ${ripple}, ${filterMode});
    `;
}

export const delayString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number, currentNoteVals: any) => {
    const convertedSyncDelay = Math.pow(2, syncDelay);
    return `
    fun void playDelayWindow(Delay @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
        for (0 => int i; i < ${lines}; i++) 
        { 
            if ("${source}" == "osc1") {
                hpf => win[i] => dac;
            } else if ("${source}" == "s1") {
                limiter_Sampler => win[i] => dac;
            } else if ("${source}" == "stk1") {
                limiter_STK => win[i] => dac;
            }
            win[i] => OneZero filter_delay_${source} => win[i]; 
            zero => filter_delay_${source}.zero;
            b0 => filter_delay_${source}.b0;
            b1 => filter_delay_${source}.b1;
            0.2 => win[i].gain; 
            // (((1 + i*0.3) * 1000)) :: ms => win[i].max => win[i].delay;
            ((whole)/((syncDelay/${currentNoteVals.master[0]}) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
            me.yield();
        }
        me.exit();
    }
    spork ~ playDelayWindow(delay_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
    `;
};

export const delayAString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number, currentNoteVals: any) => {
    const convertedSyncDelay = Math.pow(2, syncDelay);
    return `
    fun void playDelayAWindow(DelayA @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
        for (0 => int i; i < ${lines}; i++) 
        { 
            if ("${source}" == "osc1") {
                hpf => win[i] => dac;  
            } else if ("${source }" == "s1") {
                limiter_Sampler => win[i] => dac;
            } else if ("${source}" == "stk1") {
                limiter_STK => win[i] => dac;
            }
            win[i] => OneZero filter_delayA_${source} => win[i]; 
            zero => filter_delayA_${source}.zero;
            b0 => filter_delayA_${source}.b0;
            b1 => filter_delayA_${source}.b1;
            0.6 => win[i].gain; 
            (whole/${currentNoteVals.master[0]})/((syncDelay) * (1 + i*0.3)) => win[i].max => win[i].delay;
            me.yield();
        }
        me.exit();
    }
    spork ~ playDelayAWindow(delayA_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
    `;
};

export const delayLString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number, currentNoteVals: any, numeratorSignature: number) => {
    const convertedSyncDelay = Math.pow(2, syncDelay);
    console.log("sanity check delayL source: ", source);
    return `
    fun void playDelayLWindow(DelayL @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
        // while (true) {
                for (0 => int i; i < ${lines}; i++) 
                { 
                    if ("${source}" == "osc1") {
                        hpf => win[i] => dac;  
                    } else if ("${source}" == "s1") {
                        limiter_Sampler => win[i] => dac;
                    } else if ("${source}" == "stk1") {
                        limiter_STK => win[i] => dac;
                    }
                    win[i] => OneZero filter_delayL_${source} => win[i];
                    zero => filter_delayL_${source}.zero;
                    b0 => filter_delayL_${source}.b0;
                    b1 => filter_delayL_${source}.b1;
                    0.6 => win[i].gain; 
                    // ((whole * ${numeratorSignature})/((syncDelay) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
                    (whole * ${numeratorSignature})/((syncDelay) * (1/(1 + i*0.7))) => win[i].max => win[i].delay;

                    // me.yield();
                }

            me.exit();
    }
    spork ~ playDelayLWindow(delayL_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
    `;
};

export const expDelayString = (source: string, ampcurve: number, durcurve: number, delay: number, mix: number, reps: number, gain: number, currentNoteVals: any) => {
    const convertedSyncDelay = Math.pow(2, delay);
    console.log("WHAT IS CONVERTED SYNC DELAY? ", convertedSyncDelay);
    console.log("all good???? ", currentNoteVals.master[0]);
    return `
    fun void playExpDelayWindow(ExpDelay @ win, float ampcurve, float durcurve, float delay, float mix, int reps, float gain) {

        while (true)
        {
           (whole/(${currentNoteVals.master[0]}))/delay => win.max => win.delay;

            reps * 0.7 => win.gain;
            durcurve => win.durcurve;
            ampcurve => win.ampcurve;
            reps => win.reps;
            
            (whole/(${currentNoteVals.master[0]}))/delay => now;
            // me.yield();
        }
        me.exit();
    }
    spork ~ playExpDelayWindow(expDelay_${source}, ${ampcurve}, ${durcurve}, ${convertedSyncDelay}, ${mix}, ${reps}, ${gain});
    `;
};

export const spectacleString = (source: string, bands: number, delay: number, eq: number, feedback: number, fftlen: number, freqMax: number, freqMin: number, mix: number, overlap: number, table: number) => {
    const convertedFFT = Math.pow(2, fftlen);
    const convertedBands = Math.pow(2, bands);
    const convertedDelay = Math.pow(2, bands);
    return `
    fun void playSpectacleWindow(Spectacle @ win, int bands, float delay, float eq, float feedback, int fft, float freqMax, float freqMin, float mix, int overlap, int table) {
        
        0.8 => win.mix;
        win.range(freqMin,freqMax);
        bands => win.bands; 

        1.3 => win.gain;

        if (table == 0) {
            win.table("delay", "descending");
        } else if (table == 1) {
            win.table("eq", "descending");
        } else if (table == 2) {
            win.table("feedback", "descending");
        } else if (table == 3) {
            win.table("delay", "random");
        } else if (table == 4) {
            win.table("eq", "random");
        } else if (table == 5) {
            win.table("feedback", "random");
        } else if (table == 6) {
            win.table("delay", "ascending");
        } else if (table == 7) {
            win.table("eq", "ascending");
        } else if (table == 8) {
            win.table("feedback", "ascending");
        }

        whole * delay => now;
        eq => win.eq;
        feedback => win.feedback;
    }
    spork ~ playSpectacleWindow(spectacle_${source}, ${convertedBands}, ${convertedDelay}, ${eq}, ${feedback}, ${convertedFFT}, ${freqMax}, ${freqMin}, ${mix}, ${overlap}, ${table});
    `;

};

export const defaultSources: Sources = {
    osc1: {
        masterVolume: 0.5,
        detune: 0,
        effects: {
            WinEnv: {
                VarName: '',
                On: false,
                Declaration: ' WinFuncEnv winfuncenv_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WinFunc: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => winFuncString('osc1', helper.osc1.attackTime, helper.osc1.releaseTime, helper.osc1.envSetting),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerADSR: {
                VarName: '',
                On: false,
                Declaration: ' PowerADSR poweradsr_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => powerADSRString('osc1', helper.osc1.attackTime, helper.osc1.attackCurve, helper.osc1.decayTime, helper.osc1.decayCurve, helper.osc1.sustainLevel, helper.osc1.releaseTime, helper.osc1.releaseCurve),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpEnv: {
                VarName: '',
                On: false,
                Declaration: ' ExpEnv expenv_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => expEnvString('osc1', helper.osc1.T60, helper.osc1.radius, helper.osc1.value),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPDiodeLadder: {
                VarName: '',
                On: false,
                Declaration: ' WPDiodeLadder wpdiodeladder_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => wpDiodeLadderString('osc1', helper.osc1.cutoff, helper.osc1.resonance, helper.osc1.nlp_type, helper.osc1.nonlinear, helper.osc1.saturation),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPKorg35: {
                VarName: '',
                On: false,
                Declaration: 'saw2 => WPKorg35 wpkorg35_osc1 => dac;',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => wpKorg35String('osc1', helper.osc1.cutoff, helper.osc1.resonance,helper.osc1.nonlinear, helper.osc1.saturation),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Modulate: {
                VarName: '',
                On: false,
                Declaration: 'hpf => Modulate mod_osc1 => dac;',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any, currentNoteVals: any) => modulateString('osc1', helper.osc1.vibratoRate, helper.osc1.vibratoGain, helper.osc1.randomGain, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Delay: {
                VarName: '',
                On: false,
                Declaration: (lines: any) => `Delay delay_osc1[${lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any, currentNoteVals: any) => delayString('osc1', helper.osc1.delay, helper.osc1.lines, helper.osc1.syncDelay, helper.osc1.zero, helper.current.osc1.b0, helper.osc1.b1, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayA: {
                VarName: '',
                On: false,
                Declaration: (lines: any) => `DelayA delayA_osc1[${lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any, currentNoteVals: any) => delayAString('osc1', helper.osc1.delay, helper.osc1.lines, helper.osc1.syncDelay, helper.osc1.zero, helper.osc1.b0, helper.osc1.b1, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayL: {
                VarName: '',
                On: false,
                Declaration: (lines: any) => `DelayL delayL_osc1[${lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any, currentNoteVals: any, numeratorSignature: any) => delayLString('osc1', helper.osc1.delay, helper.osc1.lines, helper.osc1.syncDelay, helper.osc1.zero, helper.osc1.b0, helper.osc1.b1, currentNoteVals, numeratorSignature),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpDelay: {
                VarName: '',
                On: false,
                Declaration: ' ExpDelay expDelay_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals: any) => expDelayString('osc1', helper.osc1.ampcurve, helper.osc1.durcurve, helper.osc1.delay, helper.osc1.mix, helper.osc1.reps, helper.osc1.gain, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Elliptic: {
                VarName: '',
                On: false,
                Declaration: ' Elliptic elliptic_osc1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any, currentNoteVals: any) =>  ellipticString('osc1', helper.osc1.filterLow, helper.osc1.filterMid, helper.osc1.filterHigh, helper.osc1.atten, helper.osc1.ripple, helper.osc1.filterMode, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Spectacle: {
                VarName: '',
                On: false,
                Declaration: ' => Spectacle spectacle_osc1 ',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper: any) => spectacleString('osc1', helper.osc1.bands, helper.osc1.delay, helper.osc1.eq, helper.osc1.feedback, helper.osc1.fftlen, helper.osc1.freqMax, helper.osc1.freqMin, helper.osc1.mix, helper.osc1.overlap, helper.osc1.table),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Gain: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Bitcrusher: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            FoldbackSaturation: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Echo: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Chorus: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitShift: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            AmbPan3: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            JCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            NRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PRCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            GVerb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            KasFilter: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Multicomb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitchTracker: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Sigmund: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            SndBuf: [{
                src: '',
            }],
            LiSa: [{
                src: '',
            }],
        },
        pattern: [{
            time: {
                bpm: 120,
                numerator: 4,
                denominator: 4,
                sequencerRate: 8,
                listenToMidiClock: true,
            },
            patternArr: [

            ],
            patternArrName: ''
        }],
        arpeggiateOn: false
    },
    osc2: {
        masterVolume: 0.5,
        detune: 0,
        effects: {
            WinEnv: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WinFunc: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerADSR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpEnv: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPDiodeLadder: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPKorg35: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Modulate: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Delay: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayA: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayL: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpDelay: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Elliptic: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Spectacle: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Gain: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Bitcrusher: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            FoldbackSaturation: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Echo: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Chorus: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitShift: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            AmbPan3: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            JCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            NRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PRCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            GVerb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            KasFilter: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Multicomb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitchTracker: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Sigmund: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            SndBuf: [{
                src: '',
            }],
            LiSa: [{
                src: '',
            }],
        },
        pattern: [{
            time: {
                bpm: 120,
                numerator: 4,
                denominator: 4,
                sequencerRate: 8,
                listenToMidiClock: true,
            },
            patternArr: [

            ],
            patternArrName: ''
        }],
        arpeggiateOn: false
    },
    stk1: {
            masterVolume: 0.5,
            detune: 0,
            effects: {
                WinEnv: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                WinFunc: {
                    VarName: '',
                    On: false,
                    Declaration: ' WinFuncEnv winfuncenv_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper:any) => winFuncString('stk1', helper.stk.attackTime, helper.stk.releaseTime, helper.stk.envSetting),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                PowerADSR: {
                    VarName: '',
                    On: false,
                    Declaration: ' PowerADSR poweradsr_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper: any) => powerADSRString('stk1', helper.stk.attackTime, helper.stk.attackCurve, helper.stk.decayTime, helper.stk.decayCurve, helper.stk.sustainLevel, helper.stk.releaseTime, helper.stk.releaseCurve),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                ExpEnv: {
                    VarName: '',
                    On: false,
                    Declaration: ' ExpEnv expenv_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper:any) => expEnvString('stk1', helper.stk.T60, helper.stk.radius, helper.stk.value) ,
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                WPDiodeLadder: {
                    VarName: '',
                    On: false,
                    Declaration: ' WPDiodeLadder wpdiodeladder_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper: any) => wpDiodeLadderString('stk1', helper.stk.cutoff, helper.stk.resonance, helper.stk.nlp_type, helper.stk.nonlinear, helper.stk.saturation),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                WPKorg35: {
                    VarName: '',
                    On: false,
                    Declaration: 'limiter_STK => WPKorg35 wpkorg35_stk1 => dac;',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper:any) => wpKorg35String('stk1', helper.stk.cutoff, helper.stk.resonance, helper.stk.nonlinear, helper.stk.saturation),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Modulate: {
                    VarName: '',
                    On: false,
                    Declaration: ' Modulate mod_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper:any, currentNoteVals: any) =>  modulateString('stk1', helper.stk.vibratoRate, helper.stk.vibratoGain, helper.stk.randomGain, currentNoteVals),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Delay: {
                    VarName: '',
                    On: false,
                    Declaration: (helper:any) => `Delay delay_stk1[${helper.stk.lines}];`,
                    presets: [],
                    Type: '',
                    Visible: false,
                   
                    Code: (helper: any, currentNoteVals: any) => delayString('stk1', helper.stk.delay, helper.stk.lines, helper.stk.syncDelay, helper.stk.zero, helper.stk.b0, helper.stk.b1, currentNoteVals),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                DelayA: {
                    VarName: '',
                    On: false,
                    Declaration: (helper:any) => `DelayA delayA_stk1[${helper.stk.lines}];`,
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper: any, currentNoteVals: any) => delayAString('stk1', helper.stk.delay, helper.stk.lines, helper.stk.syncDelay, helper.stk.zero, helper.stk.b0, helper.stk.b1, currentNoteVals),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                DelayL: {
                    VarName: '',
                    On: false,
                    Declaration: (helper:any) => `DelayL delayL_stk1[${helper.stk.lines}];`,
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper: any, currentNoteVals: any, numeratorSignature: number) => delayLString('stk1', helper.stk.delay, helper.stk.lines, helper.stk.syncDelay, helper.stk.zero, helper.stk.b0, helper.stk.b1, currentNoteVals, numeratorSignature),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                ExpDelay: {
                    VarName: '',
                    On: false,
                    Declaration: ' ExpDelay expDelay_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper: any, currentNoteVals: any) => expDelayString('stk1', helper.stk.ampcurve, helper.stk.durcurve, helper.stk.delay, helper.stk.mix, helper.stk.reps, helper.stk.gain, currentNoteVals),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Elliptic: {
                    VarName: '',
                    On: false,
                    Declaration: ' Elliptic elliptic_stk1 =>',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: (helper:any, currentNoteVals:any) => ellipticString('stk1', helper.stk.filterLow, helper.stk.filterMid, helper.stk.filterHigh, helper.stk.atten, helper.stk.ripple, helper.stk.filterMode, currentNoteVals),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Spectacle: {
                    VarName: '',
                    On: false,
               
                    presets: [],
                    Type: '',
                    Visible: false,
                    Declaration: 'Spectacle spectacle_stk1 =>',
                    Code: (helper: any) => spectacleString('stk1', helper.stk.bands, helper.stk.delay, helper.stk.eq, helper.stk.feedback, helper.stk.fftlen, helper.stk.freqMax, helper.stk.freqMin, helper.stk.mix, helper.stk.overlap, helper.stk.table),
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Gain: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Bitcrusher: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                FoldbackSaturation: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Echo: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Chorus: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                PitShift: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                AmbPan3: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                JCRev: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                NRev: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                PRCRev: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                GVerb: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                ASDR: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                PowerASDR: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                KasFilter: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Multicomb: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                PitchTracker: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                Sigmund: {
                    VarName: '',
                    On: false,
                    Declaration: '',
                    presets: [],
                    Type: '',
                    Visible: false,
                    Code: '',
                    EnvSetting: '',
                    ConnectionIn: [],
                    ConnectionOut: []
                },
                SndBuf: [{
                    src: '',
                }],
                LiSa: [{
                    src: '',
                }],
            },
            pattern: [{
                time: {
                    bpm: 120,
                    numerator: 4,
                    denominator: 4,
                    sequencerRate: 8,
                    listenToMidiClock: true,
                },
                patternArr: [
    
                ],
                patternArrName: ''
            }],
            instruments: {
                Clarinet: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Karplus: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Sitar: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                FrencHrn: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Moog: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Rhodey: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Saxofony: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Mandolin: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                BandedWaveGuide: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Bottle: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Blowhole: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Bowed: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Brass: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Flute: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                ModalBar: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Shakers: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                VoiceForm: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                B3: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                ElectricGuitar: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                HonkeyTonk: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                FMVoices: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                ChrystalChoir: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                PercFlute: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                TubeBell: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
                Wurley: {
                    VarName: '',
                    Type: '',
                    On: false,
                    Visible: false,
                    stkFXPresets: [] 
                },
            },
            arpeggiateOn: false
        },
    sampler: {
        masterVolume: 0.5,
        detune: 0,
        effects: {
            WinEnv: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => winFuncString('sampler1', helper.sampler.attackTime, helper.sampler.releaseTime, helper.sampler.envSetting),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WinFunc: {
                VarName: '',
                On: false,
                Declaration: ' WinFuncEnv winfuncenv_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerADSR: {
                VarName: '',
                On: false,
                Declaration: ' PowerADSR poweradsr_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => powerADSRString('sampler1', helper.sampler.attackTime, helper.sampler.attackCurve, helper.sampler.decayTime, helper.sampler.decayCurve, helper.sampler.sustainLevel, helper.sampler.releaseTime, helper.sampler.releaseCurve),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpEnv: {
                VarName: '',
                On: false,
                Declaration: ' ExpEnv expenv_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => expEnvString('sampler1', helper.sampler.T60, helper.sampler.radius, helper.sampler.value),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPDiodeLadder: {
                VarName: '',
                On: false,
                Declaration: ' WPDiodeLadder wpdiodeladder_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => wpDiodeLadderString('sampler1', helper.sampler.cutoff, helper.sampler.resonance, helper.sampler.nlp_type, helper.sampler.nonlinear, helper.sampler.saturation),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPKorg35: {
                VarName: '',
                On: false,
                Declaration: 'limiter_Sampler => WPKorg35 wpkorg35_sampler1 => dac;',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => wpKorg35String('sampler1', helper.sampler.cutoff, helper.sampler.resonance, helper.sampler.nonlinear, helper.sampler.saturation) ,
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Modulate: {
                VarName: '',
                On: false,
                Declaration: ' Modulate mod_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals:any) => modulateString('sampler1', helper.sampler.vibratoRate, helper.sampler.vibratoGain, helper.sampler.randomGain, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Delay: {
                VarName: '',
                On: false,
                Declaration: (helper: any) => `Delay delay_sampler1[${helper.sampler.lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals: any) => delayString('sampler1', helper.sampler.delay, helper.sampler.lines, helper.sampler.syncDelay, helper.sampler.zero, helper.sampler.b0, helper.sampler.b1, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayA: {
                VarName: '',
                On: false,
                Declaration: (helper:any) => `DelayA delayA_sampler1[${helper.sampler.lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals: any) => delayAString('sampler1', helper.sampler.delay, helper.sampler.lines, helper.sampler.syncDelay, helper.sampler.zero, helper.sampler.b0, helper.sampler.b1, currentNoteVals) ,
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayL: {
                VarName: '',
                On: false,
                Declaration: (helper:any) => `DelayL delayL_sampler1[${helper.sampler.lines}];`,
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals: any, numeratorSignature: number) => delayLString('sampler1', helper.sampler.delay, helper.sampler.lines, helper.sampler.syncDelay, helper.sampler.zero, helper.sampler.b0, helper.sampler.b1, currentNoteVals, numeratorSignature),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpDelay: {
                VarName: '',
                On: false,
                Declaration: ' ExpDelay expDelay_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals:any) => expDelayString('sampler1', helper.sampler.ampcurve, helper.sampler.durcurve, helper.sampler.delay, helper.sampler.mix, helper.sampler.reps, helper.sampler.gain, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Elliptic: {
                VarName: '',
                On: false,
                Declaration: ' Elliptic elliptic_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any, currentNoteVals:any) => ellipticString('sampler1', helper.sampler.filterLow, helper.sampler.filterMid, helper.sampler.filterHigh, helper.sampler.atten, helper.sampler.ripple, helper.sampler.filterMode, currentNoteVals),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Spectacle: {
                VarName: '',
                On: false,
                Declaration: 'Spectacle spectacle_sampler1 =>',
                presets: [],
                Type: '',
                Visible: false,
                Code: (helper:any) => spectacleString('sampler1', helper.sampler.bands, helper.sampler.delay, helper.sampler.eq, helper.sampler.feedback, helper.sampler.fftlen, helper.sampler.freqMax, helper.sampler.freqMin, helper.sampler.mix, helper.sampler.overlap, helper.sampler.table),
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Gain: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Bitcrusher: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            FoldbackSaturation: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Echo: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Chorus: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitShift: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            AmbPan3: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            JCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            NRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PRCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            GVerb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            KasFilter: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Multicomb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitchTracker: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Sigmund: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            SndBuf: [{
                src: '',
            }],
            LiSa: [{
                src: '',
            }],
        },
        pattern: [{
            time: {
                bpm: 120,
                numerator: 4,
                denominator: 4,
                sequencerRate: 8,
                listenToMidiClock: true,
            },
            patternArr: [

            ],
            patternArrName: ''
        }],
        arpeggiateOn: false
    },
    audioIn: {
        masterVolume: 0.5,
        detune: 0,
        effects: {
            WinEnv: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WinFunc: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerADSR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpEnv: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPDiodeLadder: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            WPKorg35: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Modulate: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Delay: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayA: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            DelayL: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ExpDelay: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Elliptic: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Spectacle: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Gain: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Bitcrusher: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            FoldbackSaturation: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Echo: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Chorus: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitShift: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            AmbPan3: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            JCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            NRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PRCRev: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            GVerb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            ASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PowerASDR: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            KasFilter: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Multicomb: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            PitchTracker: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            Sigmund: {
                VarName: '',
                On: false,
                Declaration: '',
                presets: [],
                Type: '',
                Visible: false,
                Code: '',
                EnvSetting: '',
                ConnectionIn: [],
                ConnectionOut: []
            },
            SndBuf: [{
                src: '',
            }],
            LiSa: [{
                src: '',
            }],
        },
        pattern: [{
            time: {
                bpm: 120,
                numerator: 4,
                denominator: 4,
                sequencerRate: 8,
                listenToMidiClock: true,
            },
            patternArr: [

            ],
            patternArrName: ''
        }],
        arpeggiateOn: false
    },
}