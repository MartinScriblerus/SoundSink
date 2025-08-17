import { useEffect } from "react";
import { HID } from "webchuck";
import { audioInHelperString } from "./audioInHelper";

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
    signalChainDeclarations: any,
    signalChainSampler: string[],
    signalChainSamplerDeclarations: any,
    signalChainSTK: string[],
    signalChainSTKDeclarations: any,
    signalChainAudioIn: string[],
    signalChainAudioInDeclarations: any,
    valuesReadout: any,
    valuesReadoutSampler: any,
    valuesReadoutSTK: any,
    valuesReadoutAudioIn: any,
    valuesReadoutDeclarations: any,
    valuesReadoutSamplerDeclarations: any,
    valuesReadoutSTKDeclarations: any,
    valuesReadoutAudioInDeclarations: any,
    getSourceFX: any,
    mTFreqs: number[],
    activeSTKDeclarations: any,
    activeSTKSettings: any,
    activeSTKPlayOn: any,
    activeSTKPlayOff: any,
    selectedChordScaleOctaveRange: any, // key: 'C', scale: 'Diatonic', chord: 'M', octaveMax: '4', octaveMin: '1'
    maxMinFreq: any,
    notesHolder: any,
    hid: HID | null,
) => {

    // console.log("HID? ", hid);
    console.log("JUST PRIOR TO CHUCK HERE IS selectedChordScaleOctaveRange: ", selectedChordScaleOctaveRange);
    

    // ** WHY IS MTFREQ NEEDED???  These 2 seem fine but they also don't arrange freq data in object-like manner needed by sequencer... 
    // console.log("JUST PRIOR TO CHUCK HERE IS mTFreqs: ", mTFreqs);
    // console.log("MAX MINNING! ", maxMinFreq, mTFreqs.filter((f: any) => f >= parseFloat(maxMinFreq.minFreq) && f <= parseFloat(maxMinFreq.maxFreq)) )

    
    console.log("MASTER FASTEST RATE IS ", masterFastestRate);
    console.log("HEY_YO FILES ARRAY! ", filesArray);

    // console.log("COULD THIS BE??? ",  Object.values(masterPatternsRef.current).map((i: any) => i.note))
    
    console.log("SANITY NOTESHOLDER: ", notesHolder.current);
    // console.log("GARRRR ", Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.note )));

    // console.log("CHECK SIGNAL CHAIN, EFFECTS READOUTS, and STK SETUP: ", signalChain, signalChainSTK, valuesReadout, valuesReadoutSTK, activeSTKDeclarations, activeSTKSettings);
 
    console.log("VALS DECLARATIONS: ", valuesReadoutDeclarations);

    console.log("MASTERPATTERNSREF IN CHUCK HELPER: ", Object.values(masterPatternsRef.current));

    console.log("MASTERFASTEST RATE: ", masterFastestRate);

    

    const beatInMilliseconds = ((60000 / bpm));

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
    console.log("&* VALUES DECALRATIONS TEST ", valuesReadoutDeclarations);
    console.log("&* GET SOURCE TEST ",getSourceFX('osc1'));
    console.log("AYE! SANITY: ", Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i)));
    // console.log("*STK SANITY 3 -- playOn ", activeSTKPlayOn);
    // console.log("*STK SANITY 4 -- playOff ", activeSTKPlayOff);

    const masterPatternsObj = (Object.values(masterPatternsRef.current).map((i:any)=>Object.values(i))[0])[0];
    // const masterPatternsStr = JSON.stringify(masterPatternsObj);
    console.log("MASTER PATTERNS OBJ ", masterPatternsObj);



    console.log("OH MAN -- STK TO FIX: ", 
        Object.values(valuesReadout).map((value: any) => value).join(' '),
        Object.values(valuesReadoutSampler).map((value: any) => value).join(' '),
        Object.values(valuesReadoutSTK).map((value: any) => value).join(' '),
        Object.values(valuesReadoutAudioIn).map((value: any) => value).join(' ')
    );












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
    global Event fxUpdate;
    global Event stkInstFxUpdate;
    global float bpm; 
    bpm => float bpmInit;
    global float testNotesArr[0];
    global float chuckNotesOff[0];

    global float midiNotesArray[0];
    global float midiFreqsArray[0];
    global float midiLengthsArray[0];
    global float midiVelocitiesArray[0];


    global float moogGMDefaults[0]; 
    global float effectsDefaults[0];  
    global float stkEffectsDefaults[0];  
    global int allFXDynamicInts[0];
    global int allSTKFXDynamicInts[0];
    global int stkInstsInUse;
    global float allFXDynamicFloats[0];
    global float allSTKFXDynamicFloats[0];

    ${signalChainDeclarations.map((value: any) => value).join(' ')}
    ${signalChainSamplerDeclarations.map((value: any) => value).join(' ')}
    ${signalChainSTKDeclarations.map((value: any) => value).join(' ')}
    ${signalChainAudioInDeclarations.map((value: any) => value).join(' ')}

    ${Object.values(valuesReadoutDeclarations).map((value: any) => value).join(' ')}
    ${Object.values(valuesReadoutSamplerDeclarations).map((value: any) => value).join(' ')}
    ${Object.values(valuesReadoutSTKDeclarations).map((value: any) => value).join(' ')}
    ${Object.values(valuesReadoutAudioInDeclarations).map((value: any) => value).join(' ')}


    ${hid} => Hid hi;                

    HidMsg msg;             


    ${numeratorSignature} => global int numeratorSignature;
    ${denominatorSignature} => global int denominatorSignature;

    // Initial settings
    ${bpm} => bpmInit;

    1 => global int arpeggiatorOn;

    ${beatInMilliseconds / numeratorSignature} => float beatInt;

    beatInt / 1000 => float beatSeconds;
    beatSeconds :: second => dur quarterNote;

    <<< "TICK TIMER: ", beatSeconds >>>;

    ${numeratorSignature.toFixed(2)} / denominatorSignature => float beatFactor;
    // quarterNote * beatFactor => dur adjustedBeat;
    quarterNote * beatFactor => dur adjustedBeat;
    adjustedBeat => dur beat;

    // beat * numeratorSignature => dur whole;
    // whole * denominatorSignature => dur measure;
    beat * numeratorSignature => dur whole;
    whole => dur measure;

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



    6.0 => float lfoFreqDefault;

    // BEGIN SYNTH VOICE DEFAULTS
    class SynthVoice extends Chugraph
    {
        saw1 => lpf => adsr => limiter => outlet;
        
        saw2 => lpf;
        noiseSource => lpf;

        moogGMDefaults["noise"] => noiseSource.gain;


 

        SinLfo => pitchLfo => blackhole;
        SinLfo => filterLfo => blackhole;

        fun void SetLfoFreq(float frequency) 
        {
            frequency => SinLfo.freq => SawLfo.freq => SqrLfo.freq;
        }

        
        SetLfoFreq(lfoFreqDefault);
        
        0 => filterLfo.gain;
        0 => pitchLfo.gain; 

        2 => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;

        pitchLfo => saw1;
        pitchLfo => saw2;
        pitchLfo => tri1;
        pitchLfo => tri2;
        pitchLfo => sqr1;
        pitchLfo => sqr2;



        // ${moogGrandmotherEffects.current.limiterAttack.value}::ms => limiter.attackTime; // can we hardcode these???
        // ${moogGrandmotherEffects.current.limiterThreshold.value} => limiter.thresh; // can we hardcode these???

        // 0::ms => limiter.attackTime; // can we hardcode these???
        // 0.8 => limiter.thresh; // can we hardcode these???
        
        // rethink volume when creating a master panel....
        0.10 => saw1.gain => saw2.gain;
        0.10 => tri1.gain => tri2.gain;
        0.10 => sqr1.gain => sqr2.gain;

        // ${moogGrandmotherEffects.current.cutoff.value} => float filterCutoff; // again... why hardcode this???
        // filterCutoff => lpf.freq;
        10.0 => float filterCutoff;
        filterCutoff => lpf.freq;

        ${moogGrandmotherEffects.current.offset.value} => float offset; // why are we hardcoding these???
        0.0 => float filterEnv;
        1.0 => float osc2Detune;
        ${moogGrandmotherEffects.current.oscOffset.value} => float oscOffset;





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

            filterCutoff => float startFreq;
            while((adsr.state() != 0 && adsr.value() == 0) == false)
            {
                Std.fabs((filterEnv * adsr.value()) + startFreq + filterLfo.last()) => lpf.freq;  
                

                (adsr.attackTime() + adsr.decayTime()) => dur hold;
                hold => now;
                                    
                adsr.keyOff();
                adsr.releaseTime() => now;
                3::ms => now;
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

      

    voice[numVoices - 1] => Osc1_EffectsChain osc1_FxChain => Dyno osc1_Dyno => dac;



    ${audioInHelperString}
    
    fun void handlerPlaySingleNoteOff(Event playSingleNoteOff) {
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

    //   }
    }

    fun void handlerPlaySingleNote(Event playSingleNote) {
        // playSingleNote => now;
        // while (true) {
        //     playSingleNote => now;
      
        //     // string keys[0];
        //     // allFXDynamicInts.getKeys(keys);
        //     // for( auto key : keys )
        //     // {
        //     //     <<< "KEY_VAL2", key, allFXDynamicInts[key] >>>;

        //     // }

        //     beat => dur durStep;
        //     adsr.set(durStep * moogGMDefaults["adsrAttack"], durStep * moogGMDefaults["adsrDecay"], moogGMDefaults["adsrSustain"], durStep * moogGMDefaults["adsrRelease"]);


        //     if (testNotesArr.size() > 0) { 
                
        //         for (0 => int j; j < testNotesArr.size() && j < numVoices; j++) {
 
        //             if (testNotesArr[j] > 0.00 && testNotesArr[j] != 9999.0) {
        //                 adsr.keyOn(1);
        //                 testNotesArr[j] => voice[j].keyOn;
        //             } 
        //             // voice[j].keyOff(1);
        //         }

        //         beat => now;
                
        //         for (0 => int j; j < testNotesArr.size() && j < numVoices; j++) {
        //             for (0 => int k; k < chuckNotesOff.size(); k++) {
        //                 if (testNotesArr[j] > 0.00 && testNotesArr[j] != 9999.0 && chuckNotesOff[k] == testNotesArr[j]) {
        //                     voice[j].keyOff(1);
        //                 }
        //             }
        //         }
        //         [9999.0] @=> testNotesArr;
        //         me.yield();
        //     }
        // }
    }

    fun void handlerFXUpdate(Event fxUpdatez) {
        fxUpdatez => now;
        // while (true) {
            // fxUpdate => now;
            string keys[0];
            allFXDynamicInts.getKeys(keys);
            for( auto key : keys )
            {
            <<< "KEY_VAL1", key, allFXDynamicInts[key] >>>;
            }

                   ${Object.values(valuesReadout).map((value: any) => value).join(' ')}
                   ${Object.values(valuesReadoutSampler).map((value: any) => value).join(' ')}
                   ${Object.values(valuesReadoutSTK).map((value: any) => value).join(' ')}
                   ${Object.values(valuesReadoutAudioIn).map((value: any) => value).join(' ')}

        // }
    }




    fun void playProgrammaticNote(int tickCount, float noteLength) {

        // <<< "PLAYING PROGRAMMATIC NOTE AT TICK",  "${Object.values(masterPatternsRef.current).map((i: any) => Object.values(i).map((j:any) => Object.keys(j).toString())) }" >>>;
        // for (0 => int i; i < midiNotesArray.size(); i++) {
            midiNotesArray[tickCount] => float midiNotesToPlay;
            midiFreqsArray[tickCount] => float midiFreqsToPlay;
            midiLengthsArray[tickCount] => float midiLengthsToPlay;
            midiVelocitiesArray[tickCount] => float midiVelocitiesToPlay;
            
            if (midiNotesToPlay != 9999.0 && midiFreqsToPlay > 0.0) {
                // adsr.keyOn(1);
                midiFreqsToPlay => voice[0].keyOn;

                // midiLengthsToPlay * (beat * numeratorSignature) => now;
                midiLengthsToPlay * (beat) => now;
                1 => voice[0].keyOff;
            }

            // <<< "PLAYING PROGRAMMATIC NOTE AT TICK", tickCount, midiNotesToPlay, midiFreqsToPlay, midiLengthsToPlay, midiVelocitiesToPlay, (midiLengthsToPlay * (beat * numeratorSignature) ), midiLengthsArray.size() >>>;
        // }
    }

    voice[numVoices - 1] => STK_EffectsChain stk_FxChain => Dyno stk1_Dyno => dac;
    ${activeSTKDeclarations}

    fun void handlerPlaySTK1(
        int tickCount, float noteLength
        // Event playASTK
    ) {
        // while (true) {
            // playASTK => now;
            midiNotesArray[tickCount] => float midiNotesToPlay;
            midiFreqsArray[tickCount] => float midiFreqsToPlay;
            midiLengthsArray[tickCount] => float midiLengthsToPlay;
            midiVelocitiesArray[tickCount] => float midiVelocitiesToPlay;
            
            [midiFreqsToPlay] @=> float allFreqs[];
            for (0 => int stk_f; stk_f < allFreqs.size() && stk_f < numVoices; stk_f++) {
                ${activeSTKSettings}
                ${activeSTKPlayOn}
                beat => now;
                ${activeSTKPlayOff}
            }
        //     me.yield();
        // }
    }



    fun void handlerPlayNote(Event playANote) {
        playANote => now;

        ${
            
            Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.note && i.note.length > 0 && notesHolder.current[i.note] ? `[${notesHolder.current[i.note].midiNote}]` : `['9999']` ) )} @=> int notesArr[];
        for (0 => int x; x < notesArr.size() && x < numVoices; x++) {
            <<< "TICK TEST for NOTES: ", notesArr[x] >>>;
        }  

        while (true) {


            string keys[0];
            allFXDynamicInts.getKeys(keys);
            for( auto key : keys )
            {
                <<< "KEY_VAL2", key, allFXDynamicInts[key] >>>;

            }


            
            // *** TURN BACK ON LINE BELOW (AUG 15 2025)???
            // playANote => now;

            // <<< "NOTES_ARR ", notesArr.string() >>>; 

            for (0 => int j; j < notesArr.size() && j < numVoices; j++) {
 
                if (notesArr[j] > 0.00 && notesArr[j] != 9999.0) {
                    // notesArr[j] => voice[j].keyOn;
                    // if (arpeggiatorOn == 1) {
                    //     beat => now;
                    // }
                    // voice[j].keyOff(1);
                }
            }
            if (arpeggiatorOn == 0) {
                // beat / ${masterFastestRate} => now;
                beat => now;
            }
        }         
    }



    

    // // SAMPLER
    // ////////////////////////////////////////////////////////////////
    fun void handlePlayDrumMeasure(int recurringTickCount) {

        ((fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1) % fastestRateUpdate => int masterTick;

        [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.fileNums.length > 0 ? `[${i.fileNums}]` : `['9999']` ) )}] @=> int filesArr[][]; 

        ${Object.values(valuesReadoutSampler).map((value: any) => value).join(' ')}
        

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

    // spork ~ handlerPlayNote(playNote);
    // spork ~ handlerPlaySingleNote(playSingleNote);
    // spork ~ handlerPlaySingleNoteOff(playSingleNoteOff);
    // spork ~ handlerPlaySTK1(playSTK);
    spork ~ handlerFXUpdate(fxUpdate);
    // if (stkInstsInUse > 0) {
    
    // }


    me.yield(); 






    while(true)
    {
        ${Object.values(valuesReadout).map((value: any) => value).join(' ')}
        // ${Object.values(valuesReadoutSampler).map((value: any) => value).join(' ')}
        ${Object.values(valuesReadoutSTK).map((value: any) => value).join(' ')}
        ${Object.values(valuesReadoutAudioIn).map((value: any) => value).join(' ')}
 
        /////////////////////////////////////////////////////
        // THIS COULD BE SWITCHED FROM MONO BACK TO POLY...
        // for (0 => int i; i < testNotesArr.size(); i++) {
        for (0 => int i; i < 1; i++) {
        


            beat * numeratorSignature => dur durStep;
            
            0.07 / numVoices => voice[i].gain;
            // 1.0 => adsr.gain;

            adsr.set(durStep * moogGMDefaults["adsrAttack"], durStep * moogGMDefaults["adsrDecay"], moogGMDefaults["adsrSustain"], durStep * moogGMDefaults["adsrRelease"]);

            0.8 => adsr.gain;

            moogGMDefaults["cutoff"] => voice[i].cutoff;
            moogGMDefaults["rez"] => voice[i].rez;
            moogGMDefaults["env"] => voice[i].env;
            Std.ftoi(moogGMDefaults["oscType1"]) => voice[i].ChooseOsc1;
            Std.ftoi(moogGMDefaults["oscType2"]) => voice[i].ChooseOsc2;
            moogGMDefaults["detune"] => voice[i].detune;
            Std.ftoi(moogGMDefaults["oscOffset"]) => voice[i].oscOffset;
            moogGMDefaults["cutoffMod"] => voice[i].cutoffMod;
            moogGMDefaults["pitchMod"] => voice[i].pitchMod;
            Std.ftoi(moogGMDefaults["lfoVoice"]) => voice[i].ChooseLfo; // Lfo Voc
            // 0.5 => voice[i].filterLfo.gain;
            moogGMDefaults["offset"] => voice[i].offset;
            Std.ftoi(moogGMDefaults["lfoFreq"]) => voice[i].filterEnv;
            
            // Std.ftoi(moogGMDefaults["lfoFreq"]) => lfoFreqDefault;
            
            moogGMDefaults["noise"] => voice[i].noise;
            // 0.3 / numVoices => voice[i].gain;
        }
        ///////////////////////////////////////////////////



        (moogGMDefaults["limiterAttack"])::ms => limiter.attackTime; 
        moogGMDefaults["limiterThreshold"] => limiter.thresh;



        // beat => dur durStep;

        // adsr.set(durStep * moogGMDefaults["adsrAttack"], durStep * moogGMDefaults["adsrDecay"], moogGMDefaults["adsrSustain"], durStep * moogGMDefaults["adsrRelease"]);
       
        // <<< "ADSR STUFF: ", durStep, durStep * moogGMDefaults["adsrAttack"], durStep * moogGMDefaults["adsrDecay"], moogGMDefaults["adsrSustain"], durStep * moogGMDefaults["adsrRelease"] >>>;


        int recurringTickCount;
        if (fastestTickCounter > ${numeratorSignature * masterFastestRate * denominatorSignature}) {
            fastestTickCounter % ${numeratorSignature * masterFastestRate * denominatorSignature} => recurringTickCount;
        } else {
            fastestTickCounter => recurringTickCount;
        }
        <<< "SHREDCOUNT: ", Machine.numShreds() >>>;
 

        if (now >= startTimeMeasureLoop + step) {
            
            <<< "TICK:", fastestTickCounter >>>;
       
            tickCounter + 1 => tickCounter;
            if (midiLengthsArray.size() > 0) {
                spork ~ playProgrammaticNote(recurringTickCount, midiLengthsArray[recurringTickCount] );    
                spork ~ handlerPlaySTK1(recurringTickCount, midiLengthsArray[recurringTickCount]);
            }
            spork ~ handlePlayDrumMeasure(recurringTickCount);
  
            fastestTickCounter + 1 => fastestTickCounter;                     
            step => now;     

        } 
        

        // if (now >= startTimeMeasureLoop + ( beat / ${masterFastestRate * numeratorSignature} )) {
        //     tickCounter + 1 => tickCounter;
        //     tickCounter % ${denominatorSignature} => int numerCount;
        //     Std.ftoi(Math.floor(tickCounter / ${denominatorSignature})) => int denomCount;
 
        //     spork ~ handlePlayDrumMeasure(fastestTickCounter);

        //     playNote.signal();
        //     playSTK.signal();
        //     // <<< "KEY_VAL1 ok??? ", moogGMDefaults["offset"] >>>;

           
        // //    me.yield(); // optional safety to yield to spork
        //    startTimeMeasureLoop + ( beat / ${masterFastestRate * numeratorSignature} ) => startTimeMeasureLoop;
        // } 
        // beat / ${masterFastestRate * numeratorSignature} => now;
        me.yield();

    }


    `;
    return newChuckCode;
}

// export const noteToFreq = (note: string, octave: number): number => {
//     const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
//     const i = names.indexOf(note.toUpperCase());
//     if (i === -1) {
//         throw new Error(`Invalid note name: ${note}`);
//     }

//     const midi = (octave + 1) * 12 + i; // MIDI number
//     const freq = 440 * Math.pow(2, (midi - 69) / 12); // Convert MIDI to Hz
//     return freq;
// };

export const noteToFreq = (note: string, octave: number): number => {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Normalize enharmonics and Unicode symbols
  const enharmonics: Record<string, string> = {
    "DB": "C#",
    "EB": "D#",
    "GB": "F#",
    "AB": "G#",
    "BB": "A#",
    "C♯": "C#",
    "D♯": "D#",
    "F♯": "F#",
    "G♯": "G#",
    "A♯": "A#",
    "C♭": "B",
    "D♭": "C#",
    "E♭": "D#",
    "G♭": "F#",
    "A♭": "G#",
    "B♭": "A#"
  };

  const cleanNote = note.toUpperCase().replace(/♯/g, "#").replace(/♭/g, "b");
  const normalized = enharmonics[cleanNote] || cleanNote;

  const index = names.indexOf(normalized);
  if (index === -1) {
    throw new Error(`Invalid note name: ${note}`);
  }

  const midi = (octave + 1) * 12 + index;
  const freq = 440.0 * Math.pow(2, (midi - 69) / 12);
  return freq;
};

export const flatToSharp = (oldKeyId: string) => {

    let newKeyId;

    if (oldKeyId.includes('b')) {
        if (oldKeyId.includes('A')) {
            newKeyId = 'G#'; 
        } else if (oldKeyId.includes('B')) {
            newKeyId = 'A#';
        } else if (oldKeyId.includes('D')) {
            newKeyId = 'C#';
        } else if (oldKeyId.includes('E')) {
            newKeyId = 'D#';
        } else if (oldKeyId.includes('G')) {
            newKeyId = 'F#';
        } else if (oldKeyId) {
            newKeyId = oldKeyId;
            if (oldKeyId !== "F" && oldKeyId !== "C") {
                console.log("what is this key?? ", oldKeyId);
            }
        }        
        console.log("FLAT TO SHARP: ", oldKeyId, "/// ", newKeyId);
    } else {
        newKeyId = oldKeyId;
    }


    return newKeyId;
};
