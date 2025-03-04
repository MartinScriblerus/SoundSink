"" => global string currentSrc;

// Global variables and events
global Event playNote;
global Event updateFXEvent;
global Event startMeasure;
global Event playAudioIn;

0 => global int arpeggiatorOn;

250 => int beatInt;

(beatInt)::ms => dur beat;
4 => global int numeratorSignature;
4 => global int denominatorSignature;

beat * numeratorSignature => dur whole;
whole * denominatorSignature => dur measure;

// Number of voices for polyphony
3 => global int numVoices;
global float NOTES_SET[0];
global int moogGrandmotherEffects[0]; //
8 => global int fastestRateUpdate;


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
    string theSrc;
    fun void setSrc(string newSrc) {
        newSrc => theSrc;
    }   
    NRev rev => UGen effectsPatch;  
    inlet => effectsPatch => outlet;
    0.8 => rev.mix;
}
Osc1_EffectsChain osc1_FxChain;

class Osc2_EffectsChain extends Chugraph
{
    string theSrc;
    fun void setSrc(string newSrc) {
        newSrc => theSrc;
    }   
    NRev rev => UGen effectsPatch;  
    inlet => effectsPatch => outlet;
    0.8 => rev.mix;
}
Osc2_EffectsChain osc2_FxChain[numVoices];

class Stk1_EffectsChain extends Chugraph
{
    string theSrc;
    fun void setSrc(string newSrc) {
        newSrc => theSrc;
    }   
    NRev rev => UGen effectsPatch;  
    inlet => effectsPatch => outlet;
    0.8 => rev.mix;
}
Stk1_EffectsChain stk1_FxChain;






LisaTrigger lisaTrigger; 
GrainStretch grain;
Tape t;
RandomReverse rr; 
Reich rei;
AsymptopicChopper achop;
NRev rev_audioIn;
NRev rev_sampler;


class AudioIn_EffectsChain extends Chugraph
{
    inlet => rev_audioIn => LPF lpf_audioIn => outlet;
    0.8 => rev_audioIn.mix;

    t.gain(1.0);
    t.delayLength(whole / (numeratorSignature / denominatorSignature));
    t.loop(1);

    grain.stretch(1);
    grain.rate(0.1);
    grain.length(whole/(numeratorSignature * denominatorSignature));
    grain.grains(5);

    rr.setInfluence(1.0);
    rr.listen(1);

    achop.listen(1);
    achop.length(whole);
    achop.minimumLength(whole/(numeratorSignature * denominatorSignature));

    lisaTrigger.listen(1);
    lisaTrigger.length(whole);
    lisaTrigger.minimumLength(whole/(numeratorSignature * denominatorSignature));


}
AudioIn_EffectsChain audioIn_FxChain;

class Sampler_EffectsChain extends Chugraph
{
    string theSrc;
    fun void setSrc(string newSrc) {
        newSrc => theSrc;
    }   
    rev_sampler => UGen effectsPatch;  
    inlet => effectsPatch => outlet;
    0.8 => rev_sampler.mix;
}
Sampler_EffectsChain sampler_FxChain[numVoices];

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

    // moogGrandmotherEffects["limiterAttack"]::ms => limiter.attackTime;
    // moogGrandmotherEffects["limiterThreshold"]  => limiter.thresh;
    10::ms => limiter[id].attackTime; // can we hardcode these???
    0.5 => limiter[id].thresh; // can we hardcode these???

    
    // rethink volume when creating a master panel....
    0.06/numVoices => saw1[id].gain => saw2[id].gain;
    0.28/numVoices => tri1[id].gain => tri2[id].gain;
    0.08/numVoices => sqr1[id].gain => sqr2[id].gain;

    10.0 => float filterCutoff; // again... why hardcode this???
    filterCutoff => lpf[id].freq;

    // 20::ms => adsr[id].attackTime;
    // 2000::ms => adsr[id].decayTime;
    // 2 => adsr[id].sustainLevel;
    // 2000::ms => adsr[id].releaseTime;

    // moogGrandmotherEffects["offset"] => float offset;
    0.1 => float offset; // why are we hardcoding these???
    880 => float filterEnv;
    1.0 => float osc2Detune;
    0 => int oscOffset;

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
        <<< "NOTE NUM>>>??? ", noteNumber >>>;
        Std.mtof(offset + noteNumber) => SetOsc1Freq;
        Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;
        1 => adsr[id].keyOn;
        Std.ftoi(1.0)::ms => adsr[id].attackTime; // FIX NUM HERE!!!
        Std.ftoi(500.0)::ms => adsr[id].decayTime; // FIX NUM HERE!!!
        0.2 => adsr[id].sustainLevel; // FIX NUM HERE!!!
        Std.ftoi(200.0)::ms => adsr[id].releaseTime; // FIX NUM HERE!!!
        if (adsr[id].state() == 0) {
            adsr[id].set(10::ms, beat, 0.01, 500::ms);
        }
        
        // if (adsr[id].state() == 0) {
        //     1 => adsr[id].keyOn;
        //     20::ms => adsr[id].attackTime;
        //     2000::ms => adsr[id].decayTime;
        //     0.1 => adsr[id].sustainLevel;
        //     2000::ms => adsr[id].releaseTime;
        //     // adsr[id].set(2000::ms, beat, 0.8, 2000::ms);
        // }
         <<< "ADSR State After keyOn CHUCK STYLE: ", adsr[id].state() >>>;

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
    fun void keyOff(int noteNumber)
    {
        noteNumber => adsr[id].keyOff;
    }
    fun void filterEnvelope()
    {
        filterCutoff => float startFreq;
        while((adsr[id].state() != 0 && adsr[id].value() == 0) == false)
        {
            Std.fabs((filterEnv * adsr[id].value()) + startFreq + filterLfo[id].last()) => lpf[id].freq;                     
            adsr[id].releaseTime() => now;
            1 => adsr[id].keyOff;
            me.yield();
        }
        me.exit();
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
    30.0 => voice[i].cutoff;
    72.0 => voice[i].rez;
    36.00 => voice[i].env;
    Std.ftoi(1.0) => voice[i].ChooseOsc1;
    Std.ftoi(1.0) => voice[i].ChooseOsc2;
    0.0 => voice[i].detune;
    Std.ftoi(5.0) => voice[i].oscOffset;
    5.0 => voice[i].cutoffMod;
    0.50 => voice[i].pitchMod;
    Std.ftoi(2.0) => voice[i].ChooseLfo; // Lfo Voc
    // 0.5 => voice[i].filterLfo.gain;
    0.0 => voice[i].offset;
    880 => voice[i].filterEnv;
    0.10 => voice[i].noise;
}

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
            <<< "Your grains are too small to produce audio.", "" >>>;
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
    whole=> dur m_maxBufferLength;
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

fun void updateEffects() {
    while (true) {
        updateFXEvent => now;
        (beatInt)::ms => beat;
        <<< osc1_FxChain >>>;
        me.yield();
    }
}


SndBuf buffers[5] => sampler_FxChain => dac;
adc => audioIn_FxChain => Dyno audInDyno => dac;


fun void SilenceAllBuffers()
{
    buffers[0].samples() => buffers[0].pos;
    buffers[1].samples() => buffers[1].pos;
    buffers[2].samples() => buffers[2].pos;
    buffers[3].samples() => buffers[3].pos;
    buffers[4].samples() => buffers[4].pos;
}


// REALTIME NOTES (POLY)
////////////////////////////////////////////////////////////////
fun void handlePlayNote(){
    while (true) {
        playNote => now;
        for (0 => int i; i < NOTES_SET.size(); i++) {
            voice[i] => dac;

            if (NOTES_SET.size() > 0) {
                voice[i].setId(i);
                voice[i].keyOn(NOTES_SET[i]);
            }
        }
    }
}

// SAMPLER
////////////////////////////////////////////////////////////////
fun void handlePlayMeasure() {
    string files[4]; // Specify size

    me.dir() + "DR-55Kick.wav" => files[0];
    me.dir() + "DR-55Snare.wav" => files[1];
    me.dir() + "DR-55Hat.wav" => files[2];
    me.dir() + "Conga.wav" => files[3];

    (fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1 % fastestRateUpdate => int masterTick;
    [[0],[99999],[99999],[99999],[1],[99999],[99999], [99999],[0],[99999],[99999],[99999],[3, 1],[99999],[99999], [99999]] @=> int testArr[][];

    masterTick % testArr.size() => int currSlot;

    if (currSlot >= 0 && currSlot < testArr.size()) {
        for (0 => int i; i < testArr[currSlot].size(); i++) {
            if (testArr[currSlot][i] != 99999 && testArr[currSlot][i] >= 0 && testArr[currSlot][i] < files.size()) {
                files[testArr[currSlot][i]] => buffers[testArr[currSlot][i]].read;
            }
        }
    } else {
        me.yield();
    }
}

fun void funLoopFX() {
    if (tickCounter % (numeratorSignature) == 0) {
        rei.record(1);

        whole / numeratorSignature => now;
    } else {
        rei.record(0);
        rei.play(1);

        whole / numeratorSignature => now;
    }
    me.yield();
}

spork ~ updateEffects();
spork ~ handlePlayNote();

now => time startTimeMeasureLoop;

while (true) { 
    if (now >= startTimeMeasureLoop + (beat / fastestRateUpdate) ) {
        fastestTickCounter + 1 => fastestTickCounter;
    }
    if (now >= startTimeMeasureLoop + beat) {
         tickCounter + 1 => tickCounter;
         now => startTimeMeasureLoop;
    }
    spork ~ handlePlayMeasure();
    spork ~ funLoopFX();
    whole / fastestRateUpdate => now;
}
