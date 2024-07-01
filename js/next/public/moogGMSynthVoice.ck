        // ARGS LIST-COUNT!
        // 0 lfoGain: 0, // lfo gain 
        // 1 lfoPitch: 0,
        // 2 lfoVoice: 1, // select osc type (0-3) => (disabled, sine, saw, square)
        // 3 filterEnv: 1000, // controls filter envelope in Hz
        // 4 offset: 24, // controls note offset in semitones
        // 5 syncMode: 2, // 0 = sync freq to input, 1 = sync phase to input, 2 = fm synth
        // 6 cutoff: 0, // filter cutoff amount (0-100)
        // 7 rez: 1, // filter resonance (0-100)
        // 8 env: 1, // filter ADSR tracking (0-100)
        // 9 oscType1: 2, // select osc type (0-3) => (silence, tri, saw, square)
        // 10 oscType2: 1, // select osc type (0-3) => (silence, tri, saw, square)
        // 11 detune: 0, // detune the two voice oscs (1-100)
        // 12 oscOffset: 0, // offset the two voice oscs (in semitones)
        // 13 adsrAttack: 10, // adsr attack (0-100)
        // 14 adsrDecay: 10, // adsr decay (0-100)
        // 15 adsrSustain: 0, // adsr sustain (0-100)
        // 16 adsrRelease: 0, // adsr release (0-100)
        // 17 limiterAttack: 0, // limiter attack (0-100)
        // 18 limiterThreshold: 0.8, // hard limiter threshold (0-1)
        // 19 lfoFreq: 3, // lfo frequency amounnt? (0-100) TEST W CAUTION!
        // 20 pitchMod: 0, // pitch modulation (0-100)
        // 21 cutoffMod: 0, // cutoff modulation (0-100)
        // 22 noise: 1, // noise level (0-100)
        // 23 highPassFreq: 0, // high pass filter frequency in hZ
        // 24 reverb: 0 // reverb amount (0-100)




class SynthVoice extends Chugraph
{
    SawOsc saw1 => LPF lpf => ADSR adsr => Dyno limiter => NRev rev => outlet;
    SawOsc saw2 => lpf;
    Noise noiseSource => lpf;

    0 => noiseSource.gain;

    TriOsc tri1, tri2;
    SqrOsc sqr1, sqr2;

    SinOsc SinLfo;
    SawOsc SawLfo;
    SqrOsc SqrLfo;
    SinLfo => Gain pitchLfo => blackhole;
    SinLfo => Gain filterLfo => blackhole;

    fun void SetLfoFreq(float frequency)
    {
        frequency => SinLfo.freq => SawLfo.freq => SqrLfo.freq;
    }

    6.0 => SetLfoFreq;
    Std.atoi(me.arg(0)) => filterLfo.gain;
    Std.atoi(me.arg(1)) => pitchLfo.gain;


    Std.atoi(me.arg(5)) => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;
    pitchLfo => saw1;
    pitchLfo => saw2;
    pitchLfo => tri1;
    pitchLfo => tri2;
    pitchLfo => sqr1;
    pitchLfo => sqr2;

    Std.atoi(me.arg(17))::ms => limiter.attackTime;
    Std.atof(me.arg(18)) => limiter.thresh;

    // oscillators
    0.1 => saw1.gain => saw2.gain;
    0.1 => tri1.gain => tri2.gain;
    0.1 => sqr1.gain => sqr2.gain;

    // filter
    500 => float filterCutoff;
    // ??? should filterCutoff be 500 or just 1?
    filterCutoff => lpf.freq;

    // adsr envelope

    // Std.atoi(me.arg(13))::ms => adsr.attackTime;
    0::ms => adsr.attackTime;
    <<< "THERE A VAL BELOW?",  me.arg(13) >>>;
    <<< filterCutoff >>>;
    Std.atoi(me.arg(14))::ms => adsr.decayTime;
    // Std.atof(me.arg(15)) => float susLevel; 
    // (susLevel) => adsr.sustainLevel;
    Std.atof(me.arg(15)) => adsr.sustainLevel;
    Std.atoi(me.arg(16))::ms => adsr.releaseTime;

    Std.atoi(me.arg(4)) => int offset;
    Std.atoi(me.arg(3)) => int filterEnv;

    1 => float osc2Detune;
    0 => int oscOffset;

    fun void processLfo()
    {
        while(true)
        {
            filterCutoff + filterLfo.last() => lpf.freq;
            5::ms => now;
        }
    }
    spork ~ processLfo();

    fun void SetOsc1Freq(float frequency)
    {
        frequency => tri1.freq => sqr1.freq => saw1.freq; 
    }

    fun void SetOsc2Freq(float frequency)
    {
        frequency => tri2.freq => sqr2.freq => saw2.freq; 
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

    fun void keyOn(int noteNumber)
    {
        Std.mtof(offset + noteNumber) => SetOsc1Freq;
        Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;
        1 => adsr.keyOn;
        spork ~ filterEnvelope();
    }

    fun void filterEnvelope()
    {
        filterCutoff => float startFreq;
        while((adsr.state() != 0 && adsr.value() == 0) == false)
        {
            (filterEnv * adsr.value()) + startFreq + filterLfo.last() => lpf.freq;                        
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
        10::ms => now;
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

    fun void env(int amount)
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
        1.0 * (amount / 100) => noiseSource.gain;
    }

    fun void reverb(float amount)
    {
        if(amount > 100)
        {
            100 => amount;
        }
        if(amount < 1)
        {
            0 => amount;
        }
        0.2 * (amount / 100) => rev.mix;
    }

    fun void keyOff(int noteNumber)
    {
        noteNumber => adsr.keyOff;
    }
}

SynthVoice voice => HPF hpf => dac;
Std.atoi(me.arg(23)) => hpf.freq;

[0,0,4,5] @=> int notes[];
Std.atoi(me.arg(6)) => voice.cutoff;
Std.atoi(me.arg(7)) => voice.rez;
Std.atoi(me.arg(8)) => voice.env;
Std.atoi(me.arg(9)) => voice.ChooseOsc1;
Std.atoi(me.arg(10)) => voice.ChooseOsc2;
Std.atoi(me.arg(11)) => voice.detune;
Std.atoi(me.arg(12)) => voice.oscOffset;
Std.atoi(me.arg(20)) => voice.pitchMod;
Std.atoi(me.arg(21)) => voice.cutoffMod;
Std.atoi(me.arg(2)) => voice.ChooseLfo;
Std.atoi(me.arg(19)) => voice.SetLfoFreq;
<<< "Noise: " >>>;
<<< voice.noise >>>;
Std.atoi(me.arg(22)) => voice.noise;
<<< "Noise: " >>>;
<<< voice.noise >>>;
Std.atoi(me.arg(24)) => voice.reverb;
<<< "Reverb: " >>>;
<<< voice.reverb >>>;
// Std.atoi(me.arg(13))::ms => voice.adsr.attackTime;
// Std.atoi(me.arg(14))::ms => voice.adsr.decayTime;

// is this part of the problem?
// Std.atof(me.arg(15)) => float susLevel;
// susLevel => voice.adsr.sustainLevel;
0 => voice.adsr.sustainLevel;
Std.atoi(me.arg(16))::ms => voice.adsr.releaseTime;


// while(Std.atoi(me.arg(25)) == 1)
while(true)
{
    // Math.random2(1,3) => int nextOsc;
    // // nextOsc => voice.ChooseOsc1;
    // // nextOsc => voice.ChooseOsc2;
    // // Math.random2(1, 100) => voice.cutoff;
    // Math.random2(1,10) => voice.SetLfoFreq;
    // Math.random2(1, 25) => voice.rez;
    // Math.random2(1, 25) => voice.env;
    // Std.atoi(me.arg(6)) => voice.cutoff;
    // Std.atoi(me.arg(7)) => voice.rez;
    // Std.atoi(me.arg(8)) => voice.env;
    notes[Math.random2(0, notes.cap()-1)] => voice.keyOn;
    1::second => now;
    1 => voice.keyOff;
}

// if (Std.atoi(me.arg(25)) == 0) {
//     Machine.removeAllShreds();
//     Machine.resetShredID();
// }








    // static void help()
    // {
    //     <<< "Designed by Clint Hoagland (see https://www.youtube.com/watch?v=DzgumU5nSxE)" >>>;
    //     <<< "keyOn: triggers adsr (0-127) in semitones" >>>;
    //     <<< "offset: controls note offset in semitones" >>>;
    //     <<< "cutoff: filter cutoff (0-100)" >>>;
    //     <<< "rez: filter resonance (0-100)" >>>;
    //     <<< "env: filter ADSR tracking (0-100)" >>>;
    //     <<< "ChooseOsc1: select osc type (0-3)" >>>;
    //     <<< "ChooseOsc2: select osc type (0-3)" >>>;
    //     <<< "       (silence, tri, saw, square)" >>>;
    //     <<< "ChooseLFO: triggers adsr (0-127) in semitones" >>>;
    //     <<< "       (disabled, sine, saw, square)" >>>;
    //     <<< "detune: detune the two voice oscs (1-100)" >>>;
    //     <<< "oscOffset: offset the two voice oscs (in semitones)" >>>;
    //     <<< "adsr: works like a standard adsr" >>>;
    //     <<< "limiter: used as a hard limiter dyno" >>>;
    //     <<< "SetLfoFreq: sets the LFO rate in Hz" >>>;
    //     <<< "pitchMod: osc LFO tracking amount (0-100)" >>>;
    //     <<< "cutoffMod: filter LFO tracking amount (0-100)" >>>;
    //     <<< "noise: noise amount (0-100)" >>>;
    //     <<< "reverb: reverb amount (0-100)" >>>;
    // }