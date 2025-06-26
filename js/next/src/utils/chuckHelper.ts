import { useEffect } from "react";
import { HID } from "webchuck";

export const getChuckCode = (
    isTestingChord: number | undefined,
    filesArray: string,
    currentNoteVals: any,
    masterPatternsRef: any,
    masterFastestRate: number,
    numeratorSignature: number,
    denominatorSignature: number,
    bpm: number,
    moogGrandmotherEffects: any,
    signalChain: string[],
    signalChainSampler: string[],
    signalChainSTK: string[],
    signalChainAudioIn: string[],
    valuesReadout: any,
    valuesReadoutSampler: any,
    valuesReadoutSTK: any,
    valuesReadoutAudioIn: any,
    getSourceFX: any,
    mTFreqs: number[],
    activeSTKDeclarations: any,
    activeSTKSettings: any,
    activeSTKPlayOn: any,
    activeSTKPlayOff: any,
    selectedChordScaleOctaveRange: any, // key: 'C', scale: 'Diatonic', chord: 'M', octaveMax: '4', octaveMin: '1'
    maxMinFreq: any,
    hid: HID | null,
) => {

    console.log("HID? ", hid);
    console.log("JUST PRIOR TO CHUCK HERE IS selectedChordScaleOctaveRange: ", selectedChordScaleOctaveRange);
    console.log("JUST PRIOR TO CHUCK HERE IS mTFreqs: ", mTFreqs);
    console.log("MAX MINNING! ", maxMinFreq, mTFreqs.filter((f: any) => f >= parseFloat(maxMinFreq.minFreq) && f <= parseFloat(maxMinFreq.maxFreq)) )
    console.log("JUST PRIOR TO CHUCK HERE IS isTestingChord: ", isTestingChord);
    console.log("MASTER FASTEST RATE IS ", masterFastestRate);
    console.log("HEY_YO FILES ARRAY! ", filesArray);


    console.log("CHECK SIGNAL CHAIN, EFFECTS READOUTS, and STK SETUP: ", signalChain, signalChainSTK, valuesReadout, valuesReadoutSTK, activeSTKDeclarations, activeSTKSettings);
 
    console.log("MASTERPATTERNSREF IN CHUCK HELPER: ", Object.values(masterPatternsRef.current));

    const beatInMilliseconds = (60000 / bpm) / masterFastestRate * 2;

    console.log("BEAT LENGTH IN MILLISECONDS >>> ", beatInMilliseconds);

    type NoteEvent = {
        freq: number;
        startTime: number; // in beats or seconds
        duration: number; // in beats or seconds
        velocity: number;
      };
      
    console.log("*STK SANITY 1 -- declarations ", activeSTKDeclarations);
    console.log("*STK SANITY 2 -- settings ", activeSTKSettings);

    console.log("&* VALUES READOUT TEST ", valuesReadout);
    console.log("&* GET SOURCE TEST ",getSourceFX('osc1'));
    // console.log("*STK SANITY 3 -- playOn ", activeSTKPlayOn);
    // console.log("*STK SANITY 4 -- playOff ", activeSTKPlayOff);


    const newChuckCode = `
    
    "" => global string currentSrc;
    // SAFER DYNAMIC FILES
    [${filesArray}] @=> string files[];

    
    // Global variables and events
    global Event playNote;
    global Event playSingleNote;
    global Event playSingleNoteOff;
    global Event playSTK;
    global Event startMeasure;
    global Event playAudioIn;
    global float bpm; bpm => float bpmInit;
    global float testNotesArr[0];
    global float chuckNotesOff[0];

    global float moogGMDefaults[0]; 
    global float effectsDefaults[0];  
    global float stkEffectsDefaults[0];  

    ${hid} => Hid hi;                

    HidMsg msg;             


    ${numeratorSignature} => global int numeratorSignature;
    ${denominatorSignature} => global int denominatorSignature;

    // Initial settings
    ${bpm} => bpmInit;

    1 => global int arpeggiatorOn;

    ${beatInMilliseconds} => float beatInt;

    beatInt / 1000 => float beatSeconds;
    beatSeconds :: second => dur quarterNote;

    ${numeratorSignature.toFixed(2)} / denominatorSignature => float beatFactor;
    quarterNote * beatFactor => dur adjustedBeat;
    adjustedBeat => dur beat;

    beat * numeratorSignature => dur whole;
    whole * denominatorSignature => dur measure;

    // Number of voices for polyphony
    8 => global int numVoices;
    global float NOTES_SET[0];
    ${currentNoteVals.osc1[0]} => global int fastestRateUpdate;

    SawOsc saw1;
    SawOsc saw2;
    LPF lpf;
    ADSR adsr;
    Dyno limiter;
    NRev rev;
    Noise noiseSource;
    Gain pitchLfo;
    Gain filterLfo;
    TriOsc tri1, tri2;
    SqrOsc sqr1, sqr2;
    SinOsc SinLfo;
    SawOsc SawLfo;
    SqrOsc SqrLfo;

    0 => global int tickCounter;
    0 => global int fastestTickCounter;

    class Osc1_EffectsChain extends Chugraph
    { 
        inlet => ${signalChain.join(' ')} outlet;
        ${Object.values(valuesReadout).map((value: any) => value).join(' ')}
        ${getSourceFX('osc1')}
    }

    class Sampler_EffectsChain extends Chugraph
    {
        inlet => ${signalChainSampler.join(' ')} outlet;
        ${Object.values(valuesReadoutSampler).map((value: any) => value).join(' ')}
        ${getSourceFX('sampler')}
    }

    class STK_EffectsChain extends Chugraph {
        inlet => ${signalChainSTK.join(' ')} outlet;
        ${Object.values(valuesReadoutSTK).map((value: any) => value).join(' ')}
        ${getSourceFX('stk')}
    }

    class AudioIn_EffectsChain extends Chugraph {
        inlet => ${signalChainAudioIn.join(' ')} outlet;
        ${Object.values(valuesReadoutAudioIn).map((value: any) => value).join(' ')}
        ${getSourceFX('audioin')}
    }

    SndBuf buffers[5] => Sampler_EffectsChain sampler_FxChain => Dyno audInDynoSampler => dac;
    
    fun void SilenceAllBuffers()
    {
        buffers[0].samples() => buffers[0].pos;
        buffers[1].samples() => buffers[1].pos;
        buffers[2].samples() => buffers[2].pos;
        buffers[3].samples() => buffers[3].pos;
        buffers[4].samples() => buffers[4].pos;
    }


    // BEGIN SYNTH VOICE DEFAULTS
    class SynthVoice extends Chugraph
    {
        saw1 => lpf => adsr => limiter => outlet;

        saw2 => lpf;
        noiseSource => lpf;


        ${moogGrandmotherEffects.current.adsrAttack.value} => float atkKnob;
        ${moogGrandmotherEffects.current.adsrDecay.value} => float decKnob;
        ${moogGrandmotherEffects.current.adsrSustain.value} => float susKnob;
        ${moogGrandmotherEffects.current.adsrRelease.value} => float relKnob;


        // Normalize time knobs
        atkKnob + decKnob + relKnob => float total;
        if (total == 0.0) {
            0.33 => atkKnob;
            0.33 => decKnob;
            0.34 => relKnob;
        } else {
            atkKnob / total => atkKnob;
            decKnob / total => decKnob;
            relKnob / total => relKnob;
        }

        // Apply scaled durations
        beat * atkKnob => adsr.attackTime;
        beat * decKnob => adsr.decayTime;
        // susKnob => adsr.sustainLevel;
        Math.min(1.0, Math.max(0.0, susKnob)) => adsr.sustainLevel;
        beat * relKnob => adsr.releaseTime;

        // configureADSR(adsr, beat, atkKnob, decKnob, susKnob, relKnob);

        <<< "ADSR STATE KEYON ", adsr.state() >>>;
        <<< "ADSR VALUE KEYON ", adsr.value() >>>;
        <<< "ADSR LAST KEYON ", adsr.last() >>>;

        0 => noiseSource.gain;

        SinLfo => pitchLfo => blackhole;
        SinLfo => filterLfo => blackhole;

        fun void SetLfoFreq(float frequency) 
        {
            frequency => SinLfo.freq => SawLfo.freq => SqrLfo.freq;
        }
        // 6.0 => SetLfoFreq; // what is this???
        SetLfoFreq(6.0);
        0.05 => filterLfo.gain;
        0.05 => pitchLfo.gain;            
        2 => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;

        pitchLfo => saw1;
        pitchLfo => saw2;
        pitchLfo => tri1;
        pitchLfo => tri2;
        pitchLfo => sqr1;
        pitchLfo => sqr2;



        ${moogGrandmotherEffects.current.limiterAttack.value}::ms => limiter.attackTime; // can we hardcode these???
        ${moogGrandmotherEffects.current.limiterThreshold.value} => limiter.thresh; // can we hardcode these???

        // 0::ms => limiter.attackTime; // can we hardcode these???
        // 0.8 => limiter.thresh; // can we hardcode these???
        
        // rethink volume when creating a master panel....
        0.56 => saw1.gain => saw2.gain;
        0.86 => tri1.gain => tri2.gain;
        0.56 => sqr1.gain => sqr2.gain;

        // ${moogGrandmotherEffects.current.cutoff.value} => float filterCutoff; // again... why hardcode this???
        // filterCutoff => lpf.freq;
        10.0 => float filterCutoff;
        filterCutoff => lpf.freq;

        configureADSR(adsr, beat, atkKnob, decKnob, susKnob, relKnob);


        // moogGrandmotherEffects["offset"] => float offset;
        ${moogGrandmotherEffects.current.offset.value} => float offset; // why are we hardcoding these???
        0 => int filterEnv;
        1.0 => float osc2Detune;
        ${moogGrandmotherEffects.current.oscOffset.value} => float oscOffset;



        fun void configureADSR(ADSR adsr, dur dur, float atkRatio, float decRatio, float sus, float relRatio) {
            dur * atkRatio => adsr.attackTime;
            dur * decRatio => adsr.decayTime;
            sus => adsr.sustainLevel;
            dur * relRatio => adsr.releaseTime;
        }

        fun void SetOsc1Freq(float frequency)
        {
            frequency => tri1.freq => sqr1.freq => saw1.freq; 
        }

        fun void SetOsc2Freq(float frequency)
        {
            frequency => tri2.freq => sqr2.freq => saw2.freq; 
        }

        
        fun void keyOn(float noteNumber)
        {
            <<< "CALLED KEYON WITH ", noteNumber >>>;
            Std.mtof(offset + Std.ftom(noteNumber)) => SetOsc1Freq;
            Std.mtof(offset + Std.ftom(noteNumber) + oscOffset) - osc2Detune => SetOsc2Freq;
            // Std.mtof(offset + noteNumber) => SetOsc1Freq;
            // Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;

            1 => adsr.keyOn;            
            spork ~ filterEnvelope();
            // me.yield();
        }

        fun void ChooseOsc1(int oscType)
        {
            if(oscType == 0)
            {
                tri1 =< lpf;
                saw1 =< lpf;
                sqr1 =< lpf;
            }
            if(oscType == 1)
            {
                tri1 => lpf;
                saw1 =< lpf;
                sqr1 =< lpf;
            }
            if(oscType == 2)
            {
                tri1 =< lpf;
                saw1 => lpf;
                sqr1 =< lpf;
            }
            if(oscType == 3)
            {
                tri1 =< lpf;
                saw1 =< lpf;
                sqr1 => lpf;
            }
        }
        fun void ChooseOsc2(int oscType)
        {
            if(oscType == 0)
            {
                tri2 =< lpf;
                saw2 =< lpf;
                sqr2 =< lpf;
            }
            if(oscType == 1)
            {
                tri2 => lpf;
                saw2 =< lpf;
                sqr2 =< lpf;
            }
            if(oscType == 2)
            {
                tri2 =< lpf;
                saw2 => lpf;
                sqr2 =< lpf;
            }
            if(oscType == 3)
            {
                tri2 =< lpf;
                saw2 =< lpf;
                sqr2 => lpf;
            }
            if(oscType == 4)
            {
                tri2 =< lpf;
                saw2 =< lpf;
                sqr2 =< lpf;
            }
        }
        fun void ChooseLfo(int oscType)
        {
            if(oscType == 0)
            {
                SinLfo =< filterLfo;
                SinLfo =< pitchLfo;
                SawLfo =< filterLfo;
                SawLfo =< pitchLfo;
                SqrLfo =< filterLfo;
                SqrLfo =< pitchLfo;
            }
            if(oscType == 1)
            {
                SinLfo => filterLfo;
                SinLfo => pitchLfo;
                SawLfo =< filterLfo;
                SawLfo =< pitchLfo;
                SqrLfo =< filterLfo;
                SqrLfo =< pitchLfo;
            }
            if(oscType == 2)
            {
                SinLfo =< filterLfo;
                SinLfo =< pitchLfo;
                SawLfo => filterLfo;
                SawLfo => pitchLfo;
                SqrLfo =< filterLfo;
                SqrLfo =< pitchLfo;
            }
            if(oscType == 3)
            {
                SinLfo =< filterLfo;
                SinLfo =< pitchLfo;
                SawLfo =< filterLfo;
                SawLfo =< pitchLfo;
                SqrLfo => filterLfo;
                SqrLfo => pitchLfo;
            }
        }



        fun void monitorEnvelope() {
            while (adsr.state() != 0 || adsr.value() > 0.001) {
                whole => now;
            }
            // Cleanup or disable this voice if needed
            // Could add back to a voice pool here
        }
        fun void keyOff(int noteNumber) {
            <<< "CALLED KEYOFF WITH ", noteNumber >>>;
             
            noteNumber => adsr.keyOff;
            spork ~ monitorEnvelope();
        }

        fun void filterEnvelope()
        {
            // filterCutoff => float startFreq;

            // while ((adsr.state() != 0 && adsr.value() == 0) == false)
            // {
            //     // Std.fabs((filterEnv * adsr.value()) + startFreq + filterLfo.last()) => lpf.freq;
            //      (filterEnv * adsr.value()) + startFreq + filterLfo.last() => lpf.freq;   
            //     beat => now;
            // }
            filterCutoff => float startFreq;
            while((adsr.state() != 0 && adsr.value() == 0) == false)
            {
                Std.fabs((filterEnv * adsr.value()) + startFreq + filterLfo.last()) => lpf.freq;  
                
                // <<< "IN HERE" >>>;                      
                adsr.releaseTime() => now;
                1 => adsr.keyOff;
                
                me.yield();
            }
        }

        fun void cutoff(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 0)
            {
                0 => amount;
            }
            (amount / 100) * 5000 => filterCutoff;
            ////////////////////////////////////////////////////////
            // is this fix ok?
            // 10::ms => now;
            //   whole/4 => now;
            // if (arpeggiatorOn == 1) {
                // (whole)/numVoices - (now % (whole)/numVoices) => now;
                beat => now;
            // } else {
            //     (whole) - (now % (whole)) => now;
            // } 
            ////////////////////////////////////////////////////////
        }

        fun void rez(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 0)
            {
                0 => amount;
            }
            20 * (amount / 100) + 0.3 => lpf.Q;
        }

        fun void env(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 0)
            {
                0 => amount;
            }
            Std.ftoi(5000 * (amount / 100)) => filterEnv;
        }

        fun void detune(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 0)
            {
                0 => amount;
            }
            5 * (amount / 100) => osc2Detune;
        }

        fun void pitchMod(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 1)
            {
                0 => amount;
            }
            84 * (amount / 100) => pitchLfo.gain;
        }   

        fun void cutoffMod(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 1)
            {
                0 => amount;
            }
            500 * (amount / 100) => filterLfo.gain;
        }
            
        fun void noise(float amount)
        {
            if(amount > 100)
            {
                100 => amount;
            }
            if(amount < 1)
            {
                0 => amount;
            }
            ( 1.0 * (amount / 100) ) => noiseSource.gain;
        }            
    }
    SynthVoice voice[numVoices];

      

    // for (0 => int i; i < numVoices; i++) {
    for (0 => int i; i < testNotesArr.size(); i++) {
        ${moogGrandmotherEffects.current.cutoff.value} => voice[i].cutoff;
        ${moogGrandmotherEffects.current.rez.value} => voice[i].rez;
        ${moogGrandmotherEffects.current.env.value} => voice[i].env;
        Std.ftoi(${moogGrandmotherEffects.current.oscType1.value}) => voice[i].ChooseOsc1;
        Std.ftoi(${moogGrandmotherEffects.current.oscType2.value}) => voice[i].ChooseOsc2;
        ${moogGrandmotherEffects.current.detune.value} => voice[i].detune;
        Std.ftoi(${moogGrandmotherEffects.current.oscOffset.value}) => voice[i].oscOffset;
        ${moogGrandmotherEffects.current.cutoffMod.value} => voice[i].cutoffMod;
        ${moogGrandmotherEffects.current.pitchMod.value} => voice[i].pitchMod;
        Std.ftoi(${moogGrandmotherEffects.current.lfoVoice.value}) => voice[i].ChooseLfo; // Lfo Voc
        // 0.5 => voice[i].filterLfo.gain;
        ${moogGrandmotherEffects.current.offset.value} => voice[i].offset;
        Std.ftoi(${moogGrandmotherEffects.current.lfoFreq.value}) => voice[i].filterEnv;
        ${moogGrandmotherEffects.current.noise.value} => voice[i].noise;
            0.6 / numVoices => voice[i].gain;
    }

    voice[numVoices - 1] => Osc1_EffectsChain osc1_FxChain => Dyno osc1_Dyno => dac;






















    LisaTrigger lisaTrigger; 
    GrainStretch grain;
    Tape t;
    RandomReverse rr; 
    Reich rei;
    AsymptopicChopper achop;
    NRev rev_audioin;
    NRev rev_sampler;


    class AudioIn_SpecialEffectsChain extends Chugraph
    {
        inlet => rr => LPF lpf_audioin => outlet;
        0.8 => rev_audioin.mix;

        t.gain(1.0);
        t.delayLength(whole / (numeratorSignature / denominatorSignature));
        t.loop(1);

        grain.stretch(1);
        grain.rate(0.1);
        grain.length(whole/(numeratorSignature * denominatorSignature));
        grain.grains(8);

        rr.setInfluence(1.0);
        rr.listen(1);

        achop.listen(1);
        achop.length(whole);
        achop.minimumLength(beat/16);

        lisaTrigger.listen(1);
        lisaTrigger.length(whole);
        lisaTrigger.minimumLength(whole/(numeratorSignature * denominatorSignature));


    }
    AudioIn_SpecialEffectsChain audioin_SpecialFxChain;




    class GrainStretch extends Chugraph {

        LiSa mic[2];
        ADSR env;

        inlet => mic[0] => env => outlet;
        inlet => mic[1] => env => outlet;

        10 => int m_stretching;
        32 => int m_grains;
        0.5 => float m_rate;

        whole / (numeratorSignature / denominatorSignature)=> dur m_bufferLength;
        maxLength(8::second);

        fun void stretch(int s) {
            if (s == 1) {
                1 => m_stretching;
                spork ~ stretching();
            }
            else {
                0 => m_stretching;
            }
        }

        fun void maxLength(dur m) {
            mic[0].duration(m);
            mic[1].duration(m);
        }

        fun void length(dur l) {
            l => m_bufferLength;
        }

        fun void rate(float r) {
            r => m_rate;
        }

        fun void grains(int g) {
            g => m_grains;
        }

        fun void stretching() {
            0 => int idx;

            recordVoice(mic[idx], m_bufferLength);

            // switches between audio buffers, ensuring a constant processed signal
            while (m_stretching) {
                spork ~ recordVoice(mic[(idx + 1) % 2], m_bufferLength);
                (idx + 1) % 2 => idx;
                stretchVoice(mic[idx], m_bufferLength, m_rate, m_grains);
            }
        }

        fun void recordVoice(LiSa mic, dur bufferLength) {
            mic.clear();
            mic.recPos(0::samp);
            mic.record(1);
            bufferLength => now;
            mic.record(0);
        }

        // all the sound stuff we're doing
        fun void stretchVoice(LiSa mic, dur duration, float rate, int grains) {
            (duration * 1.0/rate)/grains => dur grain;
            grain/32.0 => dur grainEnv;
            grain * 0.5 => dur halfGrain;

            // for some reason if you try to put a sample
            // at a fraction of samp, it will silence ChucK
            // but not crash it?
            if (halfGrain < samp) {

                return;
            }

            // envelope parameters
            env.attackTime(grainEnv);
            env.releaseTime(grainEnv);

            halfGrain/samp => float halfGrainSamples;
            ((duration/samp)$int)/grains=> int sampleIncrement;

            mic.play(1);

            // bulk of the time stretching
            for (0 => int i; i < grains; i++) {
                mic.playPos((i * sampleIncrement)::samp);
                (i * sampleIncrement)::samp + grain => dur end;

                // only fade if there will be no discontinuity errors
                if (duration > end) {
                    env.keyOn();
                    halfGrain => now;
                    env.keyOff();
                    halfGrain - grainEnv => now;
                }
                else {
                    (grain - (end - duration)) => dur endGrain;
                    env.keyOn();
                    endGrain * 0.5 => now;
                    env.keyOff();
                    endGrain * 0.5 - grainEnv => now;
                }
            }
            mic.play(0);
        }
    }

    class Tape extends Chugraph {
        inlet => NRev nRA => Delay del => ADSR env => Gain g => outlet;
        g => del;

        nRA.mix(0.1);

        env.set(0::ms, 100::ms, 0.75, 10::ms);
        delayLength(whole);

        0 => int m_loop;

        fun void delayLength(dur d) {
            del.max(d);
            del.delay(d);
        }

        fun void loop(int l) {
            if (l) {
                1 => m_loop;
                spork ~ looping();
            }
            if (l == 0) {
                0 => m_loop;
            }
        }

        fun void looping() {
            env.keyOn();
            while (m_loop) {
                1::samp => now;
            }
            env.keyOff();
        }
    }

    class RandomReverse extends Chugraph {

        inlet => LiSa mic => Gain r => outlet;
        inlet => Gain g => ADSR env => outlet;

        0 => int m_listen;
        2::second => dur m_maxBufferLength;
        2::second => dur m_bufferLength;
        0.5 => float m_influence;
        100::ms => dur m_envDuration;
        5::second => dur m_maxTimeBetween;

        // envelope
        env.attackTime(m_envDuration);
        env.releaseTime(m_envDuration);
        env.keyOn();

        fun void listen(int l) {
            if (l == 1) {
                1 => m_listen;
                spork ~ listening();
            }
            if (l == 0) {
                0 => m_listen;
            }
        }

        fun void setInfluence(float i) {
            i => m_influence;
        }

        fun void setReverseGain(float g) {
            r.gain(g);
        }

        fun void setMaxBufferLength(dur l) {
            l => m_maxBufferLength;
        }

        fun void listening() {
            mic.duration(m_maxBufferLength);
            while (m_listen) {
                if (m_influence >= 0.01) {
                    Math.random2f(0.1, m_influence * 0.75) => float scale;
                    scale * m_bufferLength => dur bufferLength;
                    record(bufferLength);
                    playInReverse(bufferLength);
                    m_maxTimeBetween * Math.fabs(1.0 - m_influence) => now;
                }
                1::samp => now;
            }
        }

        fun void record(dur bufferLength) {
            mic.playPos(0::samp);
            mic.record(1);
            bufferLength => now;
            mic.record(0);
        }

        fun void playInReverse(dur bufferLength) {
            if (bufferLength < m_envDuration) {
                m_envDuration * 2 => bufferLength;
            }
            env.keyOff();
            mic.play(1);
            mic.playPos(bufferLength);
            mic.rate(-1.0);
            mic.rampUp(m_envDuration);
            bufferLength - m_envDuration => now;
            mic.rampDown(m_envDuration);
            env.keyOn();
            m_envDuration => now;
            mic.play(0);
        }
    }

    class Reich extends Chugraph {

        inlet => LiSa mic => outlet;

        0 => int m_record;
        0 => int m_play;

        0::ms => dur m_length;
        4     => int m_voices;
        1.001 => float m_speed;

        false => int m_bi;
        false => int m_random;
        false => int m_spread;

        maxBufferLength(8::second);

        fun void maxBufferLength(dur l) {
            mic.duration(l);
        }

        fun void record(int r) {
            if (r == 1) {
                1 => m_record;
                spork ~ recording();
            }
            if (r == 0) {
                0 => m_record;
            }
        }

        fun void recording() {
            mic.clear();

            mic.recPos(0::samp);
            mic.record(1);

            while (m_record == 1) {
                1::samp => now;
            }

            mic.record(0);
            mic.recPos() => m_length;
        }

        fun void play(int p) {
            if (p == 1) {
                1 => m_play;
                spork ~ playing();
            }
            if (p == 0) {
                0 => m_play;
            }

        }

        fun void playing() {
            m_voices => int numVoices;
            for (int i; i < numVoices; i++) {
                0::ms => dur pos;
                if (m_random) {
                    Math.random2f(0.5,1.0) * m_length => pos;
                } else if (m_spread) {
                    i/(numVoices$float) * m_length => pos;
                }
                mic.playPos(i, pos);

                // set parameters
                mic.bi(i, m_bi);
                mic.rate(i, (m_speed - 1.0) * i + 1);
                mic.loop(i, 1);
                mic.loopEnd(i, m_length);

                mic.play(i, 1);
            }
            while (m_play == 1) {
                samp => now;
            }
            for (int i; i < numVoices; i++) {
                mic.play(i, 0);
            }
        }

        // spreads the initial voices randomly
        // throughout the record buffer
        fun void random(int r) {
            r => m_random;
        }

        // spreads the initial voices equally
        // throughout the record buffer
        fun void spread(int r) {
            r => m_spread;
        }

        // plays a voice backwards when reaching
        // the end of the buffer, otherwise
        // it will loop from the beginning
        fun void bi(int b) {
            b => m_bi;
        }

        // the number of voices to be played back
        fun void voices(int n) {
            n => m_voices;
        }

        // speed offset for the voices
        fun void speed(float s) {
            s => m_speed;
        }
    }

    class LisaTrigger extends Chugraph {
        inlet => LiSa mic => outlet;
        mic.bi(1);

        0 => int m_listen;
        whole => dur m_bufferLength;
        whole => dur m_maxBufferLength;
        whole / (numeratorSignature) => dur m_minimumLength;
        m_minimumLength * 4 => dur m_envLength;

        fun void listen(int lstn) {
            if (lstn == 1) {
                1 => m_listen;
                spork ~ listening();
            }
            if (lstn == 0) {
                0 => m_listen;
            }
        }

        fun void length(dur l) {
            l => m_bufferLength;
        }

        fun void maxLength(dur l) {
            l => m_maxBufferLength;
        }

        fun void minimumLength(dur l) {
            m_minimumLength;
            l => m_envLength;
        }

        fun void listening() {
            mic.duration(m_maxBufferLength);
            while (m_listen) {
                mic.clear();
                mic.recPos(0::samp);
                mic.record(1);
                m_bufferLength => now;
                mic.record(0);
                lisaTrig(m_bufferLength);
            }
        }

        fun void lisaTrig(dur bufferLength) {
            dur bufferStart;
            m_bufferLength => dur bufferLength;
            mic.play(1);
            while (bufferLength > m_minimumLength) {
                bufferLength * 0.5 => bufferLength;
                0::ms => bufferStart;
                mic.playPos(bufferLength);
                mic.rampUp(m_envLength * 2);
                mic.rate(-1.25);
                bufferLength - m_envLength => now;
                mic.rampDown(m_envLength * 2);
                m_envLength * 2 => now;
            }
            mic.play(0);
        }
    }

    class AsymptopicChopper extends Chugraph {
        inlet => LiSa mic => outlet;
        0 => int m_listen;
        3::second => dur m_bufferLength;
        10::second => dur m_maxBufferLength;
        100::ms => dur m_minimumLength;
        m_minimumLength * 0.5 => dur m_envLength;
        fun void listen(int lstn) {
            if (lstn == 1) {
                1 => m_listen;
                spork ~ listening();
            }
            if (lstn == 0) {
                0 => m_listen;
            }
        }
        fun void length(dur l) {
            l => m_bufferLength;
        }
        fun void maxLength(dur l) {
            l => m_maxBufferLength;
        }
        fun void minimumLength(dur l) {
            m_minimumLength;
            l * 0.5 => m_envLength;
        }
        fun void listening() {
            mic.duration(m_maxBufferLength);
            while (m_listen) {
                mic.clear();
                mic.recPos(0::samp);
                mic.record(1);
                m_bufferLength => now;
                mic.record(0);
                asymptopChop(m_bufferLength);
            }
        }
        fun void asymptopChop(dur bufferLength) {
            dur bufferStart;
            m_bufferLength => dur bufferLength;
            mic.play(1);
            while (bufferLength > m_minimumLength) {
                Math.random2(0, 1) => int which;
                bufferLength * 0.5 => bufferLength;
                bufferLength * which => bufferStart;
                mic.playPos(bufferStart);
                mic.rampUp(m_envLength);
                bufferLength - m_envLength => now;
                mic.rampDown(m_envLength);
                m_envLength => now;
            }
            mic.play(0);
        }
    }

    adc => audioin_SpecialFxChain =>  AudioIn_EffectsChain audioin_FxChain => Dyno audInDyno => dac;

    fun void handlerPlaySingleNoteOff(Event playSingleNoteOff) {
      playSingleNoteOff => now;
      while (true) {
        playSingleNoteOff => now;
            if (testNotesArr.size() > 0) { 
                
                for (0 => int j; j < testNotesArr.size() && j < numVoices; j++) {
                    9999.0 => testNotesArr[j];
                    
                    for (0 => int k; k < chuckNotesOff.size(); k++) {
                        <<< "CHUCK NOTE OFF / TESTNOTESARR ", chuckNotesOff[k], testNotesArr[j] >>>;
                        if (
                            testNotesArr[j] > 0.00 && testNotesArr[j] != 9999.0 &&
                            chuckNotesOff[k] == testNotesArr[j]
                        ) {
                            voice[j].keyOff(1);
                            <<< "BOOM OFF! ",  testNotesArr[j] >>>;
                            9999.0 => testNotesArr[j];
                        }
                    }
                }
            }

      }
    }

    fun void handlerPlaySingleNote(Event playSingleNote) {
        playSingleNote => now;
        while (true) {
            playSingleNote => now;
            if (testNotesArr.size() > 0) { 
                for (0 => int j; j < testNotesArr.size() && j < numVoices; j++) {
 
                    if (testNotesArr[j] > 0.00 && testNotesArr[j] != 9999.0) {

                        testNotesArr[j] => voice[j].keyOn;
                        // if (arpeggiatorOn == 1) {
                            // beat => now;
                        // }
                        // voice[j].keyOff(1);
                    } 
                    // voice[j].keyOff(1);
                }

                beat => now;
                
                for (0 => int j; j < testNotesArr.size() && j < numVoices; j++) {
                    for (0 => int k; k < chuckNotesOff.size(); k++) {
                        if (testNotesArr[j] > 0.00 && testNotesArr[j] != 9999.0 && chuckNotesOff[k] == testNotesArr[j]) {
                            voice[j].keyOff(1);
                        }
                    }
                    // voice[j].keyOff(1);
                }
                [9999.0] @=> testNotesArr;
            }
        }
    }

    fun void handlerPlayNote(Event playANote) {
        playANote => now;
        while (true) {
            playANote => now;
            [${
                // mTFreqs && mTFreqs.length > 0 ? mTFreqs.filter((f: any) => f >= parseFloat(maxMinFreq.minFreq) && f <= parseFloat(maxMinFreq.maxFreq)) : 9999.0
                mTFreqs && mTFreqs.length > 0 ? mTFreqs : '9999.0'
            }] @=> float notesArr[];
            // <<< "NOTES_ARR ", notesArr.string() >>>; 
            [${
                mTFreqs && mTFreqs.length > 0 ? mTFreqs : '9999.0'
            }] @=> float allFreqs[];
            //  <<< "FREQS_ARR ", allFreqs.string() >>>;
            for (0 => int j; j < notesArr.size() && j < numVoices; j++) {
 
                if (notesArr[j] > 0.00 && notesArr[j] != 9999.0) {
                    notesArr[j] => voice[j].keyOn;
                    // notesArr[j] => voice[j].SetOsc1Freq;
                    // beat => now;
                    if (arpeggiatorOn == 1) {
                        beat => now;
                    }
                    // voice[j].keyOff(1);
                }
            }
            if (arpeggiatorOn == 0) {
                beat / ${masterFastestRate} => now;
            }
            // for (0 => int j; j < notesArr.size() && j < numVoices; j++) {
            //     voice[j].keyOff(1);
            // }
        }         
    }

    voice[numVoices - 1] => STK_EffectsChain stk_FxChain => Dyno stk1_Dyno => dac;
    ${activeSTKDeclarations}

    fun void handlerPlaySTK1(Event playASTK) {
        while (true) {
            playASTK => now;

            [${mTFreqs.filter((f: any) => f >= maxMinFreq.minFreq && f <= maxMinFreq.maxFreq).length > 0 ? 
                mTFreqs.filter((f: any) => f >= maxMinFreq.minFreq && f <= maxMinFreq.maxFreq) : 9999.3
            }] @=> float allFreqs[];
            for (0 => int stk_f; stk_f < allFreqs.size() && stk_f < numVoices; stk_f++) {
                ${activeSTKSettings}
                ${activeSTKPlayOn}
                beat => now;
                ${activeSTKPlayOff}
            }
            me.yield();
        }
    }



    // // SAMPLER
    // ////////////////////////////////////////////////////////////////
    fun void handlePlayDrumMeasure(int tickCount) {

        ((fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1) % fastestRateUpdate => int masterTick;

        [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.fileNums.length > 0 ? `[${i.fileNums}]` : `['9999']` ) )}] @=> int filesArr[][]; 

  
        int recurringTickCount;
        if (tickCount > ${numeratorSignature * masterFastestRate * denominatorSignature}) {
            tickCount % ${numeratorSignature * masterFastestRate * denominatorSignature} => recurringTickCount;
        } else {
            tickCount => recurringTickCount;
        }


        if (recurringTickCount >= filesArr.size()) return;

        // --- Play all buffers in parallel
        if (recurringTickCount < filesArr.size()) {
            for (0 => int x; x <= filesArr[recurringTickCount].size() - 1; x++) {
                filesArr[recurringTickCount][x] => int fileIndex;
                if (fileIndex != 9999 && fileIndex < files.size() && x < buffers.size()) {
                    files[fileIndex] => buffers[x].read;
                    0 => buffers[x].pos;
                }
                    
            } 
        }

        // --- After triggering all buffers, wait for the length of 1 step
        // (whole / ${masterFastestRate}) => now;
        beat => now;

        me.yield();
    }
    string result[];



    now => time startTimeMeasureLoop;
    beat / fastestRateUpdate => dur step; 

    spork ~ handlerPlayNote(playNote);
    spork ~ handlerPlaySingleNote(playSingleNote);
    spork ~ handlerPlaySingleNoteOff(playSingleNoteOff);
    spork ~ handlerPlaySTK1(playSTK);


    me.yield(); // <<<<< DO WE WANT THIS HERE? IF SHIT BREAKS... THIS COULD BE WHY???




    




    while(true
    //  && ${!isTestingChord}
     )
    {

        if (testNotesArr.size() > 0) {
            // playNote.broadcast();
            // playSingleNote.broadcast();
        } else {
            playSingleNoteOff.broadcast();
        }


        if (now >= startTimeMeasureLoop + step) {
            fastestTickCounter + 1 => fastestTickCounter;
            <<< "TICK:", fastestTickCounter >>>;
            // "${Object.values(masterPatternsRef.current).map((i: any) => Object.values(i[1]) ? Object.values(i[1]) : 'SKIP' ).toString()}" => string myString;
                        
            step => now;     

        }
        if (now >= startTimeMeasureLoop + ( beat / ${masterFastestRate} )) {
            tickCounter + 1 => tickCounter;
            spork ~ handlePlayDrumMeasure(fastestTickCounter);
            playNote.signal();
            playSTK.signal();
            
           
           // me.yield(); // optional safety to yield to spork
           startTimeMeasureLoop + ( beat / ${masterFastestRate} ) => startTimeMeasureLoop;
        } 
        beat / ${masterFastestRate} => now;
        // for (0 => int i; i < numVoices; i++) {
        // 1 => voice[i].keyOff;
        // }

        

    }






    // TESTING CHORDS ONLY
    //////////////////////////////////////////////////////////////// (we should prob get rid of this shit!!!!)
    // if (${!isTestingChord}) {
    // } else {

    
    //     spork ~ handlePlayDrumMeasure(tickCounter);
   
    //     me.yield();    
    //     whole => now;
    // }
    ////////////////////////////////////////////////////////////////
    `;
    return newChuckCode;
}

export const noteToFreq = (note: string, octave: number): number => {
    const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    const i = names.indexOf(note.toUpperCase());
    if (i === -1) {
        throw new Error(`Invalid note name: ${note}`);
    }

    const midi = (octave + 1) * 12 + i; // MIDI number
    const freq = 440 * Math.pow(2, (midi - 69) / 12); // Convert MIDI to Hz
    return freq;
};

