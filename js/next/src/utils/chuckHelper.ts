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
    resetNotes: string,
    mTFreqs: number[],
    activeSTKDeclarations: any,
    activeSTKSettings: any,
    activeSTKPlayOn: any,
    activeSTKPlayOff: any,
    selectedChordScaleOctaveRange: any, // key: 'C', scale: 'Diatonic', chord: 'M', octaveMax: '4', octaveMin: '3'
    maxMinFreq: any,
) => {

    console.log("JUST PRIOR TO CHUCK HERE IS selectedChordScaleOctaveRange: ", selectedChordScaleOctaveRange);

    console.log("JUST PRIOR TO CHUCK HERE IS mTFreqs: ", mTFreqs,);
    console.log("MAX MINNING! ", maxMinFreq, mTFreqs.filter((f: any) => f >= parseFloat(maxMinFreq.minFreq) && f <= parseFloat(maxMinFreq.maxFreq)) )
    console.log("JUST PRIOR TO CHUCK HERE IS isTestingChord: ", isTestingChord);
    console.log("JUST PRIOR TO CHUCK HERE IS resetNotes: ", resetNotes);

    const beatInMilliseconds = (60000 / bpm) / masterFastestRate * 2;

    const newChuckCode = `
    "" => global string currentSrc;
    // SAFER DYNAMIC FILES
    [${filesArray}] @=> string files[];

    // Global variables and events
    global Event playNote;
    global Event startMeasure;
    global Event playAudioIn;

    0 => global int arpeggiatorOn;

    ${beatInMilliseconds} => float beatInt;

    (beatInt)::ms => dur beat;
    ${numeratorSignature} => global int numeratorSignature;
    ${denominatorSignature} => global int denominatorSignature;

    beat * numeratorSignature => dur whole;
    whole * denominatorSignature => dur measure;



    // Number of voices for polyphony
    8 => global int numVoices;
    global float NOTES_SET[0];
    ${currentNoteVals.osc1[0]} => global int fastestRateUpdate;

    SawOsc saw1[numVoices];
    SawOsc saw2[numVoices];
    LPF lpf[numVoices];
    ADSR adsr[numVoices];
    Dyno limiter[numVoices];
    NRev rev[numVoices];
    Noise noiseSource[numVoices];
    Gain pitchLfo[numVoices];
    Gain filterLfo[numVoices];
    TriOsc tri1[numVoices], tri2[numVoices];
    SqrOsc sqr1[numVoices], sqr2[numVoices];
    SinOsc SinLfo[numVoices];
    SawOsc SawLfo[numVoices];
    SqrOsc SqrLfo[numVoices];

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
        int id;
        // Constructor to initialize id
        fun void setId(int newId) {
            newId => id;
        }

        saw1[id] => lpf[id] => adsr[id] => limiter[id] => outlet;

        saw2[id] => lpf[id];
        noiseSource[id] => lpf[id];



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
        beat * atkKnob => adsr[id].attackTime;
        beat * decKnob => adsr[id].decayTime;
        susKnob => adsr[id].sustainLevel;
        beat * relKnob => adsr[id].releaseTime;


        <<< "ADSR STATE KEYON ", adsr[id].state() >>>;
        <<< "ADSR VALUE KEYON ", adsr[id].value() >>>;
        <<< "ADSR LAST KEYON ", adsr[id].last() >>>;

        0 => noiseSource[id].gain;

        SinLfo[id] => pitchLfo[id] => blackhole;
        SinLfo[id] => filterLfo[id] => blackhole;

        fun void SetLfoFreq(float frequency) 
        {
            frequency => SinLfo[id].freq => SawLfo[id].freq => SqrLfo[id].freq;
        }
        // 6.0 => SetLfoFreq; // what is this???
        SetLfoFreq(6.0);
        0.05 => filterLfo[id].gain;
        0.05 => pitchLfo[id].gain;            
        2 => saw1[id].sync => saw2[id].sync => tri1[id].sync => tri2[id].sync => sqr1[id].sync => sqr2[id].sync;

        pitchLfo[id] => saw1[id];
        pitchLfo[id] => saw2[id];
        pitchLfo[id] => tri1[id];
        pitchLfo[id] => tri2[id];
        pitchLfo[id] => sqr1[id];
        pitchLfo[id] => sqr2[id];



        ${moogGrandmotherEffects.current.limiterAttack.value}::ms => limiter[id].attackTime; // can we hardcode these???
        ${moogGrandmotherEffects.current.limiterThreshold.value} => limiter[id].thresh; // can we hardcode these???

        
        // rethink volume when creating a master panel....
        0.06/numVoices => saw1[id].gain => saw2[id].gain;
        0.28/numVoices => tri1[id].gain => tri2[id].gain;
        0.08/numVoices => sqr1[id].gain => sqr2[id].gain;

        // ${moogGrandmotherEffects.current.cutoff.value} => float filterCutoff; // again... why hardcode this???
        // filterCutoff => lpf[id].freq;
        10 => float filterCutoff;
        filterCutoff => lpf[id].freq;

        // moogGrandmotherEffects["offset"] => float offset;
        ${moogGrandmotherEffects.current.offset.value} => float offset; // why are we hardcoding these???
        500.00 => float filterEnv;
        1.0 => float osc2Detune;
        ${moogGrandmotherEffects.current.oscOffset.value} => float oscOffset;

        fun void SetOsc1Freq(float frequency)
        {
            frequency => tri1[id].freq => sqr1[id].freq => saw1[id].freq; 
        }

        fun void SetOsc2Freq(float frequency)
        {
            frequency => tri2[id].freq => sqr2[id].freq => saw2[id].freq; 
        }

        
        fun void keyOn(float noteNumber)
        {
            Std.mtof(offset + Std.ftom(noteNumber)) => SetOsc1Freq;
            Std.mtof(offset + Std.ftom(noteNumber) + oscOffset) - osc2Detune => SetOsc2Freq;
            // Std.mtof(offset + noteNumber) => SetOsc1Freq;
            // Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;

            <<< "FUUUUUUCK 1: ", SetOsc1Freq, "... 2: ", SetOsc2Freq >>>;
            1 => adsr[id].keyOn;            
            spork ~ filterEnvelope();
            // me.yield();
        }

        fun void ChooseOsc1(int oscType)
        {
            if(oscType == 0)
            {
                tri1[id] =< lpf[id];
                saw1[id] =< lpf[id];
                sqr1[id] =< lpf[id];
            }
            if(oscType == 1)
            {
                tri1[id] => lpf[id];
                saw1[id] =< lpf[id];
                sqr1[id] =< lpf[id];
            }
            if(oscType == 2)
            {
                tri1[id] =< lpf[id];
                saw1[id] => lpf[id];
                sqr1[id] =< lpf[id];
            }
            if(oscType == 3)
            {
                tri1[id] =< lpf[id];
                saw1[id] =< lpf[id];
                sqr1[id] => lpf[id];
            }
        }
        fun void ChooseOsc2(int oscType)
        {
            if(oscType == 0)
            {
                tri2[id] =< lpf[id];
                saw2[id] =< lpf[id];
                sqr2[id] =< lpf[id];
            }
            if(oscType == 1)
            {
                tri2[id] => lpf[id];
                saw2[id] =< lpf[id];
                sqr2[id] =< lpf[id];
            }
            if(oscType == 2)
            {
                tri2[id] =< lpf[id];
                saw2[id] => lpf[id];
                sqr2[id] =< lpf[id];
            }
            if(oscType == 3)
            {
                tri2[id] =< lpf[id];
                saw2[id] =< lpf[id];
                sqr2[id] => lpf[id];
            }
            if(oscType == 4)
            {
                tri2[id] =< lpf[id];
                saw2[id] =< lpf[id];
                sqr2[id] =< lpf[id];
            }
        }
        fun void ChooseLfo(int oscType)
        {
            if(oscType == 0)
            {
                SinLfo[id] =< filterLfo[id];
                SinLfo[id] =< pitchLfo[id];
                SawLfo[id] =< filterLfo[id];
                SawLfo[id] =< pitchLfo[id];
                SqrLfo[id] =< filterLfo[id];
                SqrLfo[id] =< pitchLfo[id];
            }
            if(oscType == 1)
            {
                SinLfo[id] => filterLfo[id];
                SinLfo[id] => pitchLfo[id];
                SawLfo[id] =< filterLfo[id];
                SawLfo[id] =< pitchLfo[id];
                SqrLfo[id] =< filterLfo[id];
                SqrLfo[id] =< pitchLfo[id];
            }
            if(oscType == 2)
            {
                SinLfo[id] =< filterLfo[id];
                SinLfo[id] =< pitchLfo[id];
                SawLfo[id] => filterLfo[id];
                SawLfo[id] => pitchLfo[id];
                SqrLfo[id] =< filterLfo[id];
                SqrLfo[id] =< pitchLfo[id];
            }
            if(oscType == 3)
            {
                SinLfo[id] =< filterLfo[id];
                SinLfo[id] =< pitchLfo[id];
                SawLfo[id] =< filterLfo[id];
                SawLfo[id] =< pitchLfo[id];
                SqrLfo[id] => filterLfo[id];
                SqrLfo[id] => pitchLfo[id];
            }
        }



        fun void monitorEnvelope() {
            while (adsr[id].state() != 0 || adsr[id].value() > 0.001) {
                whole / fastestRateUpdate => now;
            }
            // Cleanup or disable this voice if needed
            // Could add back to a voice pool here
        }
        fun void keyOff(int noteNumber) {
            adsr[id].keyOff();
            spork ~ monitorEnvelope();
        }

        fun void filterEnvelope()
        {
            filterCutoff => float startFreq;

            while (adsr[id].state() != 0 || adsr[id].value() > 0.001)
            {
                Std.fabs((filterEnv * adsr[id].value()) + startFreq + filterLfo[id].last()) => lpf[id].freq;
                10::ms => now;
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
                (whole)/numVoices - (now % (whole)/numVoices) => now;
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
            20 * (amount / 100) + 0.3 => lpf[id].Q;
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
            84 * (amount / 100) => pitchLfo[id].gain;
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
            5000 * (amount / 100) => filterLfo[id].gain;
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
            ( 1.0 * (amount / 100) ) => noiseSource[id].gain;
        }            
    }
    SynthVoice voice[numVoices];

    for (0 => int i; i < numVoices; i++) {
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
        ${moogGrandmotherEffects.current.lfoFreq.value} => voice[i].filterEnv;
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
        inlet => achop => LPF lpf_audioin => outlet;
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
        achop.minimumLength(whole/(numeratorSignature * denominatorSignature));

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

        0 => int m_stretching;
        32 => int m_grains;
        1.0 => float m_rate;

        1.0::second => dur m_bufferLength;
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

    AudioIn_EffectsChain audioin_FxChain;


    adc => audioin_SpecialFxChain => audioin_FxChain => Dyno audInDyno => dac;


















/////////////////// NOTE MEASURE
    fun void handlePlayNoteMeasure(int tickCount) {

        ((fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1) % fastestRateUpdate => int masterTick;

        [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => parseFloat(i.note) > 0 ?  parseFloat(i.note) : `9999.0` ) )}] @=> float testNotesArr2[]; 

        [${mTFreqs.filter((f: any) => Math.round(f) < 880).length > 0 ? mTFreqs.filter((f: any) => Math.round(f) < 880) : `0.0`}] @=> float allFreqs[];


        <<< "MAX_MIN: ", ${maxMinFreq.minFreq} >>>;

        // [${mTFreqs.filter((f: any) => f >= maxMinFreq.minFreq && f <= maxMinFreq.maxFreq).filter((f: any) => Math.round(f) < 880).length > 0 ? mTFreqs.filter((f: any) => f >= parseFloat(maxMinFreq.minFreq) && f <= parseFloat(maxMinFreq.maxFreq)).filter((f: any) => Math.round(f) < 880) : `0.0`}] @=> float allFreqs[];
        // [${mTFreqs.filter((f: any) => f >= maxMinFreq.minFreq && f <= maxMinFreq.maxFreq)}] @=> float allFreqs[];

        int recurringTickCount;
        if (tickCount > ${numeratorSignature * masterFastestRate * denominatorSignature}) {
            tickCount % ${numeratorSignature * masterFastestRate * denominatorSignature} => recurringTickCount;
        } else {
            tickCount => recurringTickCount;
        }

        STK_EffectsChain stk_FxChain;
        ${activeSTKDeclarations.current}
        ${activeSTKSettings.current}
    
        ${activeSTKPlayOn.current}
        if (recurringTickCount < allFreqs.size()) {
            for (0 => int i; i < numVoices; i++) {
                <<< "ADSR HELL IN NOTE", allFreqs[recurringTickCount] >>>;
                allFreqs[recurringTickCount] => voice[i].keyOn;
            }
        }


        // --- After triggering all buffers, wait for the length of 1 step
        (whole / ${masterFastestRate}) => now;

        ${activeSTKPlayOff.current}
        for (0 => int i; i < numVoices; i++) {
            <<< "ADSR HELL", allFreqs[recurringTickCount] >>>;
            1 => voice[i].keyOff;
        }

        me.yield();
    }
///////////////////

























    // // SAMPLER
    // ////////////////////////////////////////////////////////////////
    fun void handlePlayDrumMeasure(int tickCount) {

        ((fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1) % fastestRateUpdate => int masterTick;

        [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.fileNums.length > 0 ? `[${i.fileNums}]` : `['9999.0']` ) )}] @=> int filesArr[][]; 

       // [${mTFreqs.filter((f: any) => Math.round(f) < 880).length > 0 ? mTFreqs.filter((f: any) => Math.round(f) < 880) : `0.0`}] @=> float allFreqs[];


        <<< "MAX_MIN: ", ${maxMinFreq.minFreq} >>>;

        int recurringTickCount;
        if (tickCount > ${numeratorSignature * masterFastestRate * denominatorSignature}) {
        tickCount % ${numeratorSignature * masterFastestRate * denominatorSignature} => recurringTickCount;
        } else {
        tickCount => recurringTickCount;
        }

        if (recurringTickCount >= filesArr.size()) return;

        // --- Play all buffers in parallel
        for (0 => int x; x < filesArr[recurringTickCount].size(); x++) {
            if (filesArr[recurringTickCount][x] != 9999.0 && (filesArr[recurringTickCount][x] < files.size())) {
                files[filesArr[recurringTickCount][x]] => buffers[x].read;
                0 => buffers[x].pos;


                // // Start buffer immediately
                // 0 => buffers[x].pos;
            }
        }

        // --- After triggering all buffers, wait for the length of 1 step
        (whole / ${masterFastestRate}) => now;

        me.yield();
    }
    string result[];

    fun string[] splitString(string input, string delimiter ) {
        int startIndex, endIndex;
        
        [""] @=> string strArr[];

        // while (true) {
            input.find(delimiter, startIndex);
            if (startIndex == -1) {
                // No more delimiters, add the remaining string
                result << input;
                // break;
            }

            if (input.substring(0, startIndex).length() > 0) {

            input.substring(0, startIndex) => result[result.size()];
            } else {
                "MOCK" => result[result.size()];
            }

            input.substring(startIndex + delimiter.length(), input.length()) => input;

            strArr << input; 
        // }
        return strArr;
    }


    // REALTIME NOTES (POLY)
    ////////////////////////////////////////////////////////////////
    fun void handlePlayNote(){
        while (false) {
            playNote => now;
            [${resetNotes}] @=> int nts[];

            // 220 => testSin.freq;

            
        }
    }

    fun void playSTK1() {


        me.yield();
    }

    now => time startTimeMeasureLoop;
    beat / fastestRateUpdate => dur step; 

    while(true && ${!isTestingChord})
    {
        if (now >= startTimeMeasureLoop + step) {
            fastestTickCounter + 1 => fastestTickCounter;
            <<< "TICK:", fastestTickCounter >>>;
            // "${Object.values(masterPatternsRef.current).map((i: any) => Object.values(i[1]) ? Object.values(i[1]) : 'SKIP' ).toString()}" => string myString;
            
            // beat / fastestRateUpdate => dur step;
            // beat / fastestRateUpdate => dur step;
            step => now;     
            
        }
        if (now >= startTimeMeasureLoop + beat) {
            tickCounter + 1 => tickCounter;
            spork ~ handlePlayDrumMeasure(tickCounter);
            spork ~ handlePlayNoteMeasure(tickCounter * numeratorSignature * denominatorSignature);
            
            // now => startTimeMeasureLoop;
           // me.yield(); // optional safety to yield to spork
           startTimeMeasureLoop + beat => startTimeMeasureLoop;
        } 
        whole / fastestRateUpdate => now;
        for (0 => int i; i < numVoices; i++) {
            1 => voice[i].keyOff;
        }

    }






    // TESTING CHORDS ONLY
    ////////////////////////////////////////////////////////////////
    if (${!isTestingChord}) {
    } else {

    
        spork ~ handlePlayDrumMeasure(tickCounter);
        spork ~ handlePlayNoteMeasure(tickCounter * numeratorSignature * denominatorSignature);
        me.yield();    
        whole => now;
    }
    ////////////////////////////////////////////////////////////////
    `;
    return newChuckCode;
}