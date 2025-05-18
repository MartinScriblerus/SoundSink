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
        0 => noiseSource[id].gain;

        SinLfo[id] => pitchLfo[id] => blackhole;
        SinLfo[id] => filterLfo[id] => blackhole;

        fun void SetLfoFreq(float frequency) 
        {
            frequency => SinLfo[id].freq => SawLfo[id].freq => SqrLfo[id].freq;
        }
        6.0 => SetLfoFreq; // what is this???
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

        ${moogGrandmotherEffects.current.cutoff.value} => float filterCutoff; // again... why hardcode this???
        filterCutoff => lpf[id].freq;

        // moogGrandmotherEffects["offset"] => float offset;
        ${moogGrandmotherEffects.current.offset.value} => float offset; // why are we hardcoding these???
        880 => float filterEnv;
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
            1 => adsr[id].keyOn;
            ${moogGrandmotherEffects.current.adsrAttack.value}::ms => adsr[id].attackTime; // FIX NUM HERE!!!
            ${moogGrandmotherEffects.current.adsrDecay.value}::ms => adsr[id].decayTime; // FIX NUM HERE!!!
            ${moogGrandmotherEffects.current.adsrSustain.value} => adsr[id].sustainLevel; // FIX NUM HERE!!!
            ${moogGrandmotherEffects.current.adsrRelease.value}::ms => adsr[id].releaseTime; // FIX NUM HERE!!!


            spork ~ filterEnvelope();
            me.yield();
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
        fun void keyOff(int noteNumber) {
            noteNumber => adsr[id].keyOff;
            // Wait for the envelope to fully release
            while (adsr[id].state() != 0) {
                adsr[id].releaseTime() => now;
            }
        }
        fun void filterEnvelope()
        {
            filterCutoff => float startFreq;
            while((adsr[id].state() != 0 && adsr[id].value() == 0) == false)
            {
                1 => adsr[id].keyOn;
                Std.fabs((filterEnv * adsr[id].value()) + startFreq + filterLfo[id].last()) => lpf[id].freq;                     
                adsr[id].releaseTime() => now;
                1 => adsr[id].keyOff;
                me.yield();
            }
            // me.exit();
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
            5000 * (amount / 100) => filterEnv;
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
            1.0 * (amount / 100) => noiseSource[id].gain;
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
            0.6 => voice[i].gain;
    }

    voice[numVoices - 1] => Osc1_EffectsChain osc1_FxChain => Dyno osc1_Dyno => dac;




