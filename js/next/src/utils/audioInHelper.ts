export const audioInHelperString = `
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

        whole / (numeratorSignature / denominatorSignature) => dur m_bufferLength;
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

`;