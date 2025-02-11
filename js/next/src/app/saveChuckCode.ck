    //   chuckCode = `
            
    //         [${Object.keys(currNotesHash.current)}] @=> int notes[];
            
    //         ${ary2D} @=> int rhythmicPatterns[][];
  
    //         0 => int device;
            
    //         // Hid hid;
    //         // HidMsg msg;
            
    //         // if( !hid.openKeyboard( device ) ) me.exit();
    //         // <<< "keyboard '" + hid.name() + "' ready", "" >>>;
            
    //         ((60.0 / ${bpm}) * 2) => float secLenBeat;
    //         (secLenBeat * 1000)::ms => dur beat;


    //         Dyno limiter_Sampler;
    //         Dyno limiter_STK;
            
    //         ((secLenBeat * 1000) * 2)::ms => dur whole;
    //         (secLenBeat * ${numeratorSignature} * ${denominatorSignature})::ms => dur bar;
                
    //         MLP model;
            

    //         private class UniversalAnalyzer {
    //             FeatureCollector combo => blackhole;
    //             FFT fft;
    //             Flux flux;
    //             RMS rms;
    //             MFCC mfcc;
    //             Centroid centroid;
    //             RollOff rolloff;
    //             Chroma chroma;
    //             Kurtosis kurtosis;
    //             DCT dct;
    //             Flip flip;
    //             ZeroX zerox;
    //             SFM sfm;
    //             "" => string mfccString;
    //             "" => string chromaString; 
    //             string the_sfm;
                
    //             private class TrackingFile
    //             {
    //                 static float the_freq;
    //                 static float the_gain;
                    
    //                 static float the_kurtosis;
    //                 static Event @ the_event;
    //             }
            
    //             fun void declarationCode(UGen @ source) {
    //                 source => fft;
    //                 fft =^ centroid =^ combo;
    //                 fft =^ flux =^ combo;
    //                 fft =^ rms =^ combo;
    //                 fft =^ mfcc =^ combo;
    //                 fft =^ rolloff =^ combo;
    //                 fft =^ chroma =^ combo;
    //                 fft =^ kurtosis => blackhole;
    //                 source => dct => blackhole;
    //                 source => flip =^ zerox => blackhole;
                
    //                 fft =^ sfm => blackhole;

    //                 int div;

    //                 //-----------------------------------------------------------------------------
    //                 // setting analysis parameters -- also should match what was used during extration
    //                 //-----------------------------------------------------------------------------
    //                 // set flip size (N)
            
    //                 // output in [-1,1]
    //                 // calculate sample rate
    //                 second/samp => float srate;
            
    //                 // set number of coefficients in MFCC (how many we get out)
    //                 // 13 is a commonly used value; using less here for printing
    //                 20 => mfcc.numCoeffs;
    //                 // set number of mel filters in MFCC
    //                 10 => mfcc.numFilters;
            
    //                 // do one .upchuck() so FeatureCollector knows how many total dimension
    //                 combo.upchuck();
            
    //                 // get number of total feature dimensions
    //                 combo.fvals().size() => int NUM_DIMENSIONS;
            
    //                 // set FFT size (do we need 4410 for file?)
    //                 // 4096 => fft.size;
    //                 // 4410 => fft.size;
    //                 44100 => fft.size;
    //                 // set window type and size
    //                 Windowing.hann(fft.size()) => fft.window;
    //                 // our hop size (how often to perform analysis)
    //                 (fft.size()/2)::samp => dur HOP;
    //                 // how many frames to aggregate before averaging?
    //                 // (this does not need to match extraction; might play with this number) ***
    //                 3 => int NUM_FRAMES;
    //                 // how much time to aggregate features for each file
    //                 fft.size()::samp * NUM_FRAMES => dur EXTRACT_TIME;
            
    //                 // initialize separately (due to a bug)
    //                 new Event @=> TrackingFile.the_event;
            
    //                 // analysis
    //                 source => PoleZero dcblock => FFT fftTrack => blackhole;
            
    //                 // set to block DC
    //                 .99 => dcblock.blockZero;

    //                 "" => mfccString;
    //                 for (0 => int i; i < mfcc.fvals().cap(); i++) {
    //                     if (i < mfcc.fvals().cap() - 1) {
    //                         mfcc.fvals()[i] + ", "  +=> mfccString;
    //                     } else {
    //                         mfcc.fvals()[i] +=> mfccString;
    //                     }
    //                 }
                
    //                 "" => chromaString;
    //                 for (0 => int i; i < chroma.fvals().cap() - 1; i++) {
    //                     if (i < chroma.fvals().cap() - 2) {
    //                         chroma.fvals()[i] + ", " +=> chromaString;
    //                     } else {
    //                         chroma.fvals()[i] +=> chromaString;
    //                     }
    //                 }

    //                 fft.upchuck() @=> UAnaBlob blob;
    //                 0 => float max; float where;
    //                 for( int i; i < blob.fvals().size()/8; i++ )
    //                 {
    //                     // compare
    //                     if( blob.fvals()[i] > max )
    //                     {
    //                         // save
    //                         blob.fvals()[i] => max;
    //                         i => where;
    //                     }
    //                 }

    //                 (where / fft.size() * (second / samp)) => this.TrackingFile.the_freq;
    //                 (max / .5) => this.TrackingFile.the_gain;
    //                 if( this.TrackingFile.the_gain > 1 )
    //                     1 => this.TrackingFile.the_gain;
        

    //                 kurtosis.fval(0) => this.TrackingFile.the_kurtosis;
    //                 this.TrackingFile.the_event.broadcast();

    //                 dct.size()/2 %=> div;

    //                 // take dct
    //                 dct.upchuck();

    //                 zerox.upchuck() @=> UAnaBlob blobZero;



    //                 [[0.0]] @=> float singleInputArr[][];
    //                 [[0.0]] @=> float storedInputArr[][];
    //                 [[0.0]] @=> float oldestStoredInputArr[][];



    //                 // <<< "FEATURES: " 
    //                 // + "/centroid: "
    //                 // + centroid.fval(0) + " " 
    //                 // + "/flux: " 
    //                 // + flux.fval(0) + " "
    //                 // + "/rms: " 
    //                 // + rms.fval(0) + " "
    //                 // + "/mfcc: " 
    //                 // + mfccString + " "
    //                 // + "/rolloff: " 
    //                 // + rolloff.fval(0) + " "
    //                 // + "/chroma: " 
    //                 // + chromaString + " "
    //                 // + "/freq: "
    //                 // + this.TrackingFile.the_freq + " "
    //                 // + "/gain: " 
    //                 // + this.TrackingFile.the_gain + " "
    //                 // + "/dct: " 
    //                 // + dct.fval(0) + " "
    //                 // + dct.fval(1) + " "
    //                 // + dct.fval(2) + " "
    //                 // + dct.fval(3) + " "
    //                 // + "/kurtosis: "
    //                 // + this.TrackingFile.the_kurtosis + " "
    //                 // + "/zerox: " 
    //                 // + blobZero.fvals()[0] + " " >>>;

    //                 if(storedInputArr != [[0.0]]) {
    //                     storedInputArr @=> oldestStoredInputArr;
    //                 } 

    //                 if (singleInputArr != [[0.0]]) {
    //                     singleInputArr @=> storedInputArr;
    //                 } 

    //                 [
    //                     [centroid.fval(0)],
    //                     [flux.fval(0)],
    //                     [rms.fval(0)],
    //                     // [mfccString],
    //                     [rolloff.fval(0)],
    //                     // [chromaString],
    //                     [this.TrackingFile.the_freq],
    //                     [this.TrackingFile.the_gain],
    //                     [dct.fval(0)],
    //                     [dct.fval(1)],
    //                     [dct.fval(2)],
    //                     [dct.fval(3)],
    //                     [this.TrackingFile.the_kurtosis],
    //                     [blobZero.fvals()[0]]
    //                 ] @=> singleInputArr;



    //                 if (oldestStoredInputArr != [[0.0]]) {

    //                     model.init([12, 5, 5, 12]);

    //                     oldestStoredInputArr @=> float X[][];
    //                     // output observations
    //                     storedInputArr @=> float Y[][];
    //                     model.train(X,Y,0.1, 100);
    //                     [
    //                         centroid.fval(0),
    //                         flux.fval(0),
    //                         rms.fval(0),
    //                         rolloff.fval(0),
    //                         this.TrackingFile.the_freq,
    //                         this.TrackingFile.the_gain,
    //                         dct.fval(0),
    //                         dct.fval(1),
    //                         dct.fval(2),
    //                         dct.fval(3),
    //                         this.TrackingFile.the_kurtosis,
    //                         blobZero.fvals()[0]
    //                     ] @=> float x[];
    //                     // array to how output
    //                     float y[12];
    //                     // predict output given input
    //                     model.predict(x, y);
    //                     // print the output -- this is the minimal implementation (needs quite a bit of thought & will wait til all sources are in)
    //                     // <<< "PREDICTIONS: ", y[0], y[1], y[2], y[3], y[4], y[5], y[6], y[7], y[8], y[9], y[10], y[11] >>>;
    //                 }

    //                 me.yield();
    //             }
    //             me.yield();
    //         }
            
        

    //         class SynthVoice extends Chugraph
    //         {
    
    //             ${chuckToOutlet.current.osc1}
    
    //             ${chuckToOutlet.current.osc2}
        
    //             // declarations for complex effects
    //             ${WPKorg35Declaration.osc1}          
    //             ${ellipticCodeString.osc1}
    //             ${winFuncCodeString.osc1}
    //             ${powerADSRCodeString.osc1}
    //             ${expEnvCodeString.osc1}
    //             ${wpDiodeLadderCodeString.osc1}
    //             ${wpKorg35CodeString.osc1}
    //             ${expDelayCodeString.osc1}
        
    //             Noise noiseSource => lpf;
    //             0 => noiseSource.gain;
                                
    //             TriOsc tri1, tri2;
    //             SqrOsc sqr1, sqr2;
        
    //             SinOsc SinLfo;
    //             SawOsc SawLfo;
    //             SqrOsc SqrLfo;
    //             SinLfo => Gain pitchLfo => blackhole;
    //             SinLfo => Gain filterLfo => blackhole;
        
    //             fun void SetLfoFreq(float frequency)
    //             {
    //                 frequency => SinLfo.freq => SawLfo.freq => SqrLfo.freq;
    //             }
        
    //             6.0 => SetLfoFreq;
    //             0.5 => filterLfo.gain;
    //             0.5 => pitchLfo.gain;
        
    //             2 => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;
        
    //             pitchLfo => saw1;
    //             pitchLfo => saw2;
    //             pitchLfo => tri1;
    //             pitchLfo => tri2;
    //             pitchLfo => sqr1;
    //             pitchLfo => sqr2;
        
    //             ${parseInt(moogGrandmotherEffects.current.limiterAttack.value)}::ms => limiter.attackTime;
    //             ${parseFloat(moogGrandmotherEffects.current.limiterThreshold.value).toFixed(4)} => limiter.thresh;
        
    //             0.06 => saw1.gain => saw2.gain;
    //             0.28 => tri1.gain => tri2.gain;
    //             0.08 => sqr1.gain => sqr2.gain;
        
    //             10.0 => float filterCutoff;
    //             filterCutoff => lpf.freq;
        
        
    //             ${parseInt(moogGrandmotherEffects.current.adsrAttack.value)}::ms => adsr.attackTime;
    //             ${parseInt(moogGrandmotherEffects.current.adsrDecay.value)}::ms => adsr.decayTime;
    //             ${moogGrandmotherEffects.current.adsrSustain.value} => adsr.sustainLevel;
    //             ${parseInt(moogGrandmotherEffects.current.adsrRelease.value)}::ms => adsr.releaseTime;
    //             ${parseInt(moogGrandmotherEffects.current.offset.value)} => int offset;
    //             880 => float filterEnv;
        
    //             1 => float osc2Detune;
    //             0 => int oscOffset;
        
    //             fun void SetOsc1Freq(float frequency)
    //             {
    //                 frequency => tri1.freq => sqr1.freq => saw1.freq; 
    //             }
        
    //             fun void SetOsc2Freq(float frequency)
    //             {
    //                 frequency => tri2.freq => sqr2.freq => saw2.freq; 
    //             }
        
    //             fun void keyOn(int noteNumber)
    //             {
    //                 Std.mtof(offset + noteNumber) => SetOsc1Freq;
    //                 Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;
    //                 1 => adsr.keyOn;
    //                 spork ~ filterEnvelope();
    //             }
        
    //             fun void ChooseOsc1(int oscType)
    //             {
    //                 if(oscType == 0)
    //                 {
    //                     tri1 =< lpf;
    //                     saw1 =< lpf;
    //                     sqr1 =< lpf;
    //                 }
    //                 if(oscType == 1)
    //                 {
    //                     tri1 => lpf;
    //                     saw1 =< lpf;
    //                     sqr1 =< lpf;
    //                 }
    //                 if(oscType == 2)
    //                 {
    //                     tri1 =< lpf;
    //                     saw1 => lpf;
    //                     sqr1 =< lpf;
    //                 }
    //                 if(oscType == 3)
    //                 {
    //                     tri1 =< lpf;
    //                     saw1 =< lpf;
    //                     sqr1 => lpf;
    //                 }
    //             }
        
    //             fun void ChooseOsc2(int oscType)
    //             {
    //                 if(oscType == 0)
    //                 {
    //                     tri2 =< lpf;
    //                     saw2 =< lpf;
    //                     sqr2 =< lpf;
    //                 }
    //                 if(oscType == 1)
    //                 {
    //                     tri2 => lpf;
    //                     saw2 =< lpf;
    //                     sqr2 =< lpf;
    //                 }
    //                 if(oscType == 2)
    //                 {
    //                     tri2 =< lpf;
    //                     saw2 => lpf;
    //                     sqr2 =< lpf;
    //                 }
    //                 if(oscType == 3)
    //                 {
    //                     tri2 =< lpf;
    //                     saw2 =< lpf;
    //                     sqr2 => lpf;
    //                 }
    //                 if(oscType == 4)
    //                 {
    //                     tri2 =< lpf;
    //                     saw2 =< lpf;
    //                     sqr2 =< lpf;
    //                 }
    //             }
        
    //             fun void ChooseLfo(int oscType)
    //             {
    //                 if(oscType == 0)
    //                 {
    //                     SinLfo =< filterLfo;
    //                     SinLfo =< pitchLfo;
    //                     SawLfo =< filterLfo;
    //                     SawLfo =< pitchLfo;
    //                     SqrLfo =< filterLfo;
    //                     SqrLfo =< pitchLfo;
    //                 }
    //                 if(oscType == 1)
    //                 {
    //                     SinLfo => filterLfo;
    //                     SinLfo => pitchLfo;
    //                     SawLfo =< filterLfo;
    //                     SawLfo =< pitchLfo;
    //                     SqrLfo =< filterLfo;
    //                     SqrLfo =< pitchLfo;
    //                 }
    //                 if(oscType == 2)
    //                 {
    //                     SinLfo =< filterLfo;
    //                     SinLfo =< pitchLfo;
    //                     SawLfo => filterLfo;
    //                     SawLfo => pitchLfo;
    //                     SqrLfo =< filterLfo;
    //                     SqrLfo =< pitchLfo;
    //                 }
    //                 if(oscType == 3)
    //                 {
    //                     SinLfo =< filterLfo;
    //                     SinLfo =< pitchLfo;
    //                     SawLfo =< filterLfo;
    //                     SawLfo =< pitchLfo;
    //                     SqrLfo => filterLfo;
    //                     SqrLfo => pitchLfo;
    //                 }
    //             }
        
    //             fun void keyOff(int noteNumber)
    //             {
    //                 noteNumber => adsr.keyOff;
    //             }
        
    //             fun void filterEnvelope()
    //             {
    //                 filterCutoff => float startFreq;
    //                 while((adsr.state() != 0 && adsr.value() == 0) == false)
    //                 {
    //                     Std.fabs((filterEnv * adsr.value()) + startFreq + filterLfo.last()) => lpf.freq;  
    //                     // <<< "IN HERE" >>>;                      
    //                     adsr.releaseTime() => now;
    //                     1 => adsr.keyOff;
                        
    //                     me.yield();
    //                 }
    //                 me.exit();
    //             }
        
    //             fun void cutoff(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 0)
    //                 {
    //                     0 => amount;
    //                 }
    //                 (amount / 100) * 5000 => filterCutoff;
    //                 // 10::ms => now;
    //                 //   whole/4 => now;
    //                 (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now; 
    //             }
        
    //             fun void rez(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 0)
    //                 {
    //                     0 => amount;
    //                 }
    //                 20 * (amount / 100) + 0.3 => lpf.Q;
    //             }
        
    //             fun void env(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 0)
    //                 {
    //                     0 => amount;
    //                 }
    //                 5000 * (amount / 100) => filterEnv;
    //             }
        
    //             fun void detune(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 0)
    //                 {
    //                     0 => amount;
    //                 }
    //                 5 * (amount / 100) => osc2Detune;
    //             }
        
    //             fun void pitchMod(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 1)
    //                 {
    //                     0 => amount;
    //                 }
    //                 84 * (amount / 100) => pitchLfo.gain;
    //             }
                                
    //             fun void cutoffMod(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 1)
    //                 {
    //                     0 => amount;
    //                 }
    //                 5000 * (amount / 100) => filterLfo.gain;
    //             }
        
    //             fun void noise(float amount)
    //             {
    //                 if(amount > 100)
    //                 {
    //                     100 => amount;
    //                 }
    //                 if(amount < 1)
    //                 {
    //                     0 => amount;
    //                 }
    //                 1.0 * (amount / 100) => noiseSource.gain;
    //             }
        
    //             // fun void reverb(float amount)
    //             // {
    //             //     if(amount > 100)
    //             //     {
    //             //         100 => amount;
    //             //     }
    //             //     if(amount < 1)
    //             //     {
    //             //         0 => amount;
    //             //     }
    //             //     0.02 * (amount / 100) => rev.mix;
    //             // }
    //         }
        
    //         SynthVoice voice[12] ${genericFXStringToChuck.osc1} ${spectacleDeclaration.osc1} => HPF hpf => Gain oscs_masterGain => dac;
            
    //         if (${arpeggiatorOn} == 0 ) {
    //             0.8/(notes.cap()) => oscs_masterGain.gain;
    //         } else {
    //             0.5 => oscs_masterGain.gain;
    //         }
            
    //         <<< "(from ChucK) NOTES: ", notes.cap() >>>;

            

    //         ${modulateDeclaration.osc1}
    //         ${modulateCodeString.osc1}
    //         ${delayDeclaration.osc1}
    //         ${delayADeclaration.osc1}
    //         ${delayLDeclaration.osc1}
    //         ${delayCodeString.osc1}
    //         ${delayACodeString.osc1}
    //         ${delayLCodeString.osc1}
    //         ${spectacleCodeString.osc1}
    //         ${genericFxStringNeedsBlackhole.current.osc1}
        
    //         ${finalFxCode.current.osc1}
        
    //         ${moogGrandmotherEffects.current.highPassFreq.value} => hpf.freq;
            
    //         fun void setFX() {
    //             for (0 => int i; i < voice.cap() - 1; i++) {

    //                 ${parseInt(moogGrandmotherEffects.current.cutoff.value)} => voice[i].cutoff;
    //                 ${moogGrandmotherEffects.current.rez.value} => voice[i].rez;
    //                 ${parseInt(moogGrandmotherEffects.current.env.value)} => voice[i].env;
    //                 ${parseInt(moogGrandmotherEffects.current.oscType1.value)} => voice[i].ChooseOsc1;
    //                 ${parseInt(moogGrandmotherEffects.current.oscType2.value)} => voice[i].ChooseOsc2;
    //                 ${moogGrandmotherEffects.current.detune.value} => voice[i].detune;
    //                 ${parseInt(moogGrandmotherEffects.current.oscOffset.value)} => voice[i].oscOffset;
    //                 ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice[i].cutoffMod;
    //                 ${parseInt(moogGrandmotherEffects.current.pitchMod.value)} => voice[i].pitchMod;
    //                 ${parseInt(moogGrandmotherEffects.current.lfoVoice.value)} => voice[i].ChooseLfo;
    //                 // 0.5 => voice[i].filterLfo.gain;
    //                 ${parseInt(moogGrandmotherEffects.current.offset.value)} => voice[i].offset;
    //                 880 => voice[i].filterEnv;
    //                 ${parseInt(moogGrandmotherEffects.current.noise.value)} => voice[i].noise;
    //             }     
    //         }
    //         spork ~ setFX(); 
    //             0 => int count;
          
            


    //             Event myEvent;
    //             // Event mySampleEvent;
    //             // Event mySTKEvent;
                

    //             class EffectsModuleSTK extends Chugraph
    //             {
                    
    //                 inlet => Gain drySTK => outlet;

    //                 0.1 => limiter_STK.slopeAbove;
    //                 1.0 => limiter_STK.slopeBelow;
    //                 0.5 => limiter_STK.thresh;
    //                 5::ms => limiter_STK.attackTime;
    //                 300::ms => limiter_STK.releaseTime;
    //                 0 => limiter_STK.externalSideInput;

    //                 drySTK => limiter_STK => ${chuckToOutlet.current.stk1} ${spectacleDeclaration.stk1} outlet;
                    
    //                 ${finalFxCode.current.stk1}
                    
    //                 ${winFuncCodeString.stk1}
    //                 ${powerADSRCodeString.stk1}
    //                 ${expEnvCodeString.stk1}
    //                 // ${wpDiodeLadderCodeString.stk1}
                    
    //                 ${ellipticCodeString.stk1}
    //                 ${expDelayCodeString.stk1}
                    

    //                 ${spectacleCodeString.stk1}
    //                 ${genericFxStringNeedsBlackhole.current.stk1}

    //                 ${delayDeclaration.stk1}
    //                 ${delayADeclaration.stk1}
    //                 ${delayLDeclaration.stk1}
    //                 ${delayCodeString.stk1}
    //                 ${delayACodeString.stk1}
    //                 ${delayLCodeString.stk1}



        

    //             }
                

        
                
                
    //             // Start Buffers below
    //             SndBuf buffers[4] => dac;
                
    //             private class EffectsModule extends Chugraph
    //             {
                
    //                 inlet => Gain dry => outlet;
    //                 dry => ${chuckToOutlet.current.sampler} ${spectacleDeclaration.sampler} outlet;

    //                 ${finalFxCode.current.sampler}
                    
    //                 ${winFuncCodeString.sampler}
    //                 ${powerADSRCodeString.sampler}
    //                 ${expEnvCodeString.sampler}
    //                 // ${wpDiodeLadderCodeString.sampler}
    //                 // ${wpKorg35CodeString.sampler}
                    
    //                 ${ellipticCodeString.sampler}
    //                 ${expDelayCodeString.sampler}
                
    //                 ${delayDeclaration.sampler}
    //                 ${delayADeclaration.sampler}
    //                 ${delayLDeclaration.sampler}

    //                 ${delayCodeString.sampler}
    //                 ${delayACodeString.sampler}
    //                 ${delayLCodeString.sampler}
    //                 ${modulateCodeString.sampler}
    //                 ${spectacleCodeString.sampler}
    //                 ${genericFxStringNeedsBlackhole.current.sampler}
                    
                    
    //                 0.1 => limiter_Sampler.slopeAbove;
    //                 1.0 => limiter_Sampler.slopeBelow;
    //                 0.5 => limiter_Sampler.thresh;
    //                 5::ms => limiter_Sampler.attackTime;
    //                 300::ms => limiter_Sampler.releaseTime;
    //                 0 => limiter_Sampler.externalSideInput;
    //             }
                
    //             SndBuf sample1 => EffectsModule effectsModule => Gain sampler_masterGain => dac;
        
    //             0.3 => sampler_masterGain.gain;

                
    //             string files[4];
            
    //             me.dir() + "DR-55Kick.wav" => files[0];
    //             me.dir() + "DR-55Snare.wav" => files[1];
    //             me.dir() + "DR-55Hat.wav" => files[2];
    //             me.dir() + "Conga.wav" => files[3];

    //             files[0] => buffers[0].read;
    //             files[1] => buffers[1].read;
    //             files[2] => buffers[2].read;
    //             files[3] => buffers[3].read;


        
                        
    //             // }
        
    //             fun void SilenceAllBuffers()
    //             {
    //                 buffers[0].samples() => buffers[0].pos;
    //                 buffers[1].samples() => buffers[1].pos;
    //                 buffers[2].samples() => buffers[2].pos;
    //                 buffers[3].samples() => buffers[3].pos;
    //                 sample1.samples() => sample1.pos;
    //             }
                    
    //             fun void playWindow(WinFuncEnv @ win, dur attack, dur release) {
    //                 win.attackTime(attack);
    //                 win.releaseTime(release);
    //                 <<< "PLAYWINDOW_ON" >>>;
    //                 while (true) {
    //                     win.keyOn();
    //                     attack => now;
    //                     win.keyOff();
    //                     release => now;
    //                     me.yield();
    //                 }
    //                 me.exit();
    //             }
            
    //             fun void Drum(int select, dur duration)
    //             {
                
    //                 if(select == 0)
    //                 {
    //                     // buffers[0].samples()/2 => buffers[0].pos; 
    //                     0 => buffers[0].pos; 
    //                     0.8 => buffers[0].gain;
    //                     1.0 => buffers[0].rate;
    //                     me.yield();
    //                 }
    //                 if(select == 1)
    //                 {
    //                     0 => buffers[1].pos;
    //                     0.5 => buffers[1].gain;
    //                     1.0 => buffers[1].rate;
    //                     me.yield();
    //                 }
    //                 if(select == 2)
    //                 {
    //                     0 => buffers[2].pos;
    //                     0.5 => buffers[2].gain;
    //                     1.0 => buffers[2].rate;    
    //                     me.yield();
    //                 }
    //                 if(select == 3)
    //                 {
    //                     0 => buffers[3].pos;
    //                     0.5 => buffers[3].gain;
    //                     1.0 => buffers[3].rate;
    //                     me.yield();
    //                 }
    //                 if (select == 4) {
    //                     "${filesToProcess.current && filesToProcess.current.length > 0 && filesToProcess.current[0].name ? filesToProcess.current[0].name : "Conga.wav"}" => string filename;
    //                     filename => sample1.read;
        
    //                     0.5 => sample1.gain; 
    //                     // sample1.samples()/3 => sample1.pos;
    //                     0 => sample1.pos;
    //                     // Math.random2f(0.98,1.0) => sample1.rate;
    //                     1.0 => sample1.rate;
    //                     me.yield();
    //                 }

            
    //                 // <<< "DRUM_ON" >>>;
    //                 duration - (now % duration)  => now;
    //                 0 => sample1.rate;

    //                 // SilenceAllBuffers();
    //                 // me.exit();
    //                 me.yield();
                    
                    
    //             }
            
    //             SilenceAllBuffers();

    //             UniversalAnalyzer uA;
            
            
    //             fun void PlaySynthNotes(Event myEvent, int notesToPlay[], dur duration, int rhythmicPatterns[][]) {
    //                 // <<< "PLAYSYNTH_ON ", notesToPlay >>>;

    //                 <<< rhythmicPatterns >>>;
    //                 myEvent => now;
                
    //                 0 => int runningShreds;
    //                 0 => int runningSynthShreds;
    //                 0 => int synthNumCount;
                    
    //                 "Osc" => string analysisSource;

    //                 while(true) {
    //                     0 => int synthNumCount;
    //                     // uA.declarationCode(hpf);
                   
    //                     for (0 => int i; i < notes.size(); i++) {                 
    //                         if (${arpeggiatorOn} == 1 & notesToPlay.cap() > 0) {
                                
    //                             notesToPlay[i] => voice[i].keyOn;
    //                             duration - (now % duration)  => now;
                    
    //                             1 => voice[i].keyOff;                                
    //                         } 
    //                         else if (notesToPlay.cap() > 0) {
    //                             notesToPlay[i] => voice[i].keyOn;
    //                         }
    //                         synthNumCount + 1 => synthNumCount;
    //                         // <<< "NUM_COUNT_SYNTH ", synthNumCount >>>;
    //                         me.yield(); 
    //                     }

    //                     // <<< "NOTESDOWN", notesToPlayMsg >>>;

    //                     if (${arpeggiatorOn} == 0) {
                            
    //                         duration - (now % duration)  => now;

    //                         0 => voice[0].gain;

    //                         for (1 => int i; i <= notesToPlay.cap(); i++) {
    //                             1 => voice[i].keyOff;
    //                             // notesToPlay.popOut(i);
    //                         }
    //                     }
    //                     <<< "NumShreds2222: ", Machine.numShreds() >>>;
    //                 }
    //                 me.yield();
    //             }

    //             fun void PlaySTK(Event mySTKEvent, int notesToPlay[], dur duration){
    //                 <<< "HERE in STK!!!" >>>;
    //                 <<< "PLAYSTK_ON ", notesToPlay.cap() >>>;
    //                 mySTKEvent => now;
                    
                    
    //                 ${currStkType || 'UGen'} ${currStkVar || 'ugen'}[12] => EffectsModuleSTK effectsModuleSTK => Gain stk_masterGain => dac;
    //                 0.6/notes.cap() => stk_masterGain.gain; 


    //                 while (true) {
    //                     <<< "NOTES TO PLAAAAAAY ", notesToPlay >>>;
                        
    //                     if (${stkOn.current.length > 0}){
    //                         for (0 => int i; i <= notesToPlay.size(); i++) {
    //                             if (notesToPlay[i] && notesToPlay.size() > 0) {
    //                                 ${stkOn.current}
    //                             } 
    //                             // me.yield();
    //                         }
                            
            
    //                         if (${stkArpeggiatorOn} == 0) {
    //                             // duration - (now % duration)  => now;
    //                             for (1 => int i; i <= notesToPlay.cap(); i++) {
                          
    //                             }
    //                         } else {
    //                             duration - (now % duration) => now;
    //                         }
    //                         (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now;               
    //                     } else {
    //                         me.yield();
    //                     }
    //                 }
    //                 me.exit();
    //             }
            
                

            
    //             fun void PlaySamplePattern(
    //                 Event mySampleEvent, 
    //                 int samplesArrayPos[], 
    //                 int notesToPlay[], 
    //                 dur duration,
    //                 int rhythmicPatterns[][]
    //             ) {                
    //                 count % (notesToPlay.size()) => int sampler1Idx;
                    
    //                 <<< "SAMPLE_ON ", rhythmicPatterns >>>;
    //                 <<< "samples notes/pattern to play ", notesToPlay.cap() >>>; 
    //                 <<< "samples arr pos", samplesArrayPos.cap() >>>;
    //                 mySampleEvent => now;
    //                 0 => int samplerCount;
                    
                                                                       


    //                 while(true) {
              
    //                     count % (notesToPlay.size()) => int sampler1Idx;
    //                     // for (0 => int i; i < notesToPlay.size(); i++) {
    //                     for (0 => int i; i < ${numeratorSignature * denominatorSignature}; i++) {
    //                         // <<< "NOTE IN SAMPLER!!! ", notesToPlay[i] >>>;



    //                         if (i % ${numeratorSignature} == 3) {
    //                             spork ~ Drum(4, duration);    
    //                         } 
    //                         spork ~ Drum(2, duration);
                                
    //                         if (samplerCount % 16 == 0) {
    //                             spork ~ Drum(1, duration);
                                
    //                         }                                                        
    //                     }   

    //                     <<< "I QUIT ALL OF THIS: ", Machine.numShreds() >>>;
    //                     duration - (now % duration) => now;
    //                     <<< "NUM_COUNT_SAMPLER ", samplerCount >>>;
    //                     <<< "NUM SHREDS SHooT ", Machine.numShreds() >>>;
    //                     samplerCount++;
    //                     me.yield();   
    //                 }
    //                     me.exit();
                    
    //             }
            
    //             [[1,3],[2,4]] @=> int notesArr[][];
                
    //             [3] @=> int sample1Notes[];
    //             [1,1,1,1] @=> int sample1TestNotes[];
    //             [1, 4, 1, 3] @=> int sample2Notes[];
    //             [1,4] @=> int sample3Notes[];
    //             [1,2,3,4,5] @=> int stkNotes[];
            
                
    //             private class TimeProvider {
    //                 0 => static int globalCount;
    //             }   

    //             TimeProvider oTp;

    //             private class ChordProvider {
    //                 fun void playNotes(int note) {
    //                     int existingIndex;
    //                     for (0 => int i; i < notes.size(); i++) {
    //                         if (notes[i] == note) {
    //                             i => existingIndex;
    //                             notes.erase(i);
    //                             // break;
    //                         }
    //                     }
    //                     if (!existingIndex) {
    //                     notes << note;
    //                     }
    //                 }
    //                 fun void releaseNotes (int note) {
                        
    //                     <<< "NOTE TO RELEASE: ", note >>>;
    //                     <<< "ALL NOTES: ", notes >>>;

    //                     for (0 => int i; i <= notes.cap(); i++)
    //                     {
    //                         if (note == notes[i] && i > 0) {
    //                             notes.erase(i);                 
    //                         }                    
    //                     }
    //                 }
    //             }
                    
    //             ChordProvider oCp;
                
   
          

                
    //             <<< rhythmicPatterns >>>;

    //             // spork ~ PlaySamplePattern(mySampleEvent, [0], [0,2], whole/${currentNoteVals.samples[0]}, rhythmicPatterns) @=> Shred shredSample;
    //             spork ~ PlaySynthNotes(myEvent, notes, (whole*${denominatorSignature})/${currentNoteVals.oscs[0]}, rhythmicPatterns) @=> Shred shredSynth; 
    //             // spork ~ PlaySTK(mySTKEvent, notes, (whole*${denominatorSignature})/${currentNoteVals.oscs[0]}) @=> Shred shredSTK;  

    //             // spork ~ PlaySynthNotes(myEvent, notes, whole/${currentNoteVals.oscs[0]}) @=> Shred shredSynth; 
                
     
    //             // me.yield();

    //             while (true) {
    //                 spork ~ myEvent.broadcast();
    //                 // spork ~ mySTKEvent.broadcast();
    //                 // spork ~ mySampleEvent.broadcast();
    //                 // (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now;
    //                 whole/${currentNoteVals.oscs[0]} => now;
    //                 // 1::ms=>now;
    //                 me.yield();
    //             }

                
    //             // }                         
    //         `;
