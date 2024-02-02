"use client"

import Image from 'next/image'
import styles from './page.module.css';
import { Box, Button, FormControl, TextField } from '@mui/material';
import React, { useState, useEffect, useDeferredValue, useRef } from 'react'
import BabylonLayer from './BabylonLayer';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Chuck } from 'webchuck';

import moogGMPresets from '../../utils/moogGMPresets';
import serverFilesToPreload from '../../utils/serverFilesToPreload';
import MoogGrandmotherEffects from '../../interfaces/audioInterfaces';
import {BabylonGame} from '../../interfaces/gameInterfaces';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import axios from 'axios';
import ControlPopup from './ControlPopup';
import FixedOptionsDropdown from './FixedOptionsSelect';
// interface InitializationComponentProps {
//     res:Response,
// }

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<any>({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
       
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default function InitializationComponent() {
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const aChuck: Chuck | undefined = useDeferredValue(chuckHook);
    const [lastChuckMessage, setLastChuckMessage] = useState<string>("");
    const moogGrandmotherEffects = useRef<MoogGrandmotherEffects | any>(moogGMPresets);
    const [cameraCount, setCameraCount] =useState<number | undefined>(25);
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(60.00);
    const [beatsNumerator, setBeatsNumerator] = useState(4);
    const [beatsDenominator, setBeatsDenominator] = useState(4);
    // const isLocal = process.env.NEXT_PUBLIC_BASE_URL_LOCAL; 
    // const baseUrl = isLocal ? process.env.NEXT_PUBLIC_BASE_URL_LOCAL : window.location.href; // start creating variables for envs
    // const preloadedFiles: any = new Promise((resolve, reject) => {
    //   try {
    //     resolve(axios.get(`${baseUrl}/api/preloadedFiles`, {
    //       headers: {
    //           'Content-Type': 'application/json',
    //       },
    //     }));
    //   } catch (error) {
    //     console.log('error in axios get: ', error);
    //     reject(error);
    //   }
    // });
  
    // console.log('preloadedFiles on PAGE: ', preloadedFiles);
  

    const babylonGame = useRef<BabylonGame | any>();
    babylonGame.current = babylonGame.current || {
        canvas: undefined,
        engine: undefined,
        scene: undefined,
        camera: [],
        light: [],
        gui: undefined,
        advancedTexture: undefined,
        panel: {},
        header: {},
        slider: {},
        meshes: [],
        knob: undefined,
    } as BabylonGame;
    const size = useWindowSize();
    const windowListenerRef = useRef<any>();
    windowListenerRef.current = window;

    const theme = useTheme();

    const initChuck = async () => {
        if(typeof window === 'undefined') return;
        const theChuck: any = await Chuck.init(serverFilesToPreload, undefined, 2);  
        if (theChuck.context?.state === "suspended") {
            const theChuckContext: any = theChuck.context;
            theChuckContext.resume();
        }
        setChuckHook(theChuck);
    };

    const createEffectsButtons = (moogGMEffects: MoogGrandmotherEffects) => {
        console.log("moogGMEffects: ", moogGMEffects); 
    };

    useEffect(() => {
        if (Object.keys(moogGrandmotherEffects).length > 0) {
            createEffectsButtons(moogGrandmotherEffects.current);
        }
    }, [moogGrandmotherEffects])

    const runChuck = async () => {
        if(typeof window === 'undefined') return;
        if (!aChuck) return;
        console.log("aChuck!?!?!?!?!?!? : ", await aChuck);
        try {
            await aChuck.loadChugin('chugins/AmbPan.chug.wasm');
        } catch (err) {
            console.log(err);
        }
        console.log('ANY LOADED CHUGINS? ', aChuck.loadedChugins());
        
        // ****************************************************************
        // Props for main ChucK file
        // ****************************************************************
        // gather an object with effects settings
        // gather timing information & parameters
        // gather score information & instruments
        // get an array of all files we want to load
        // ****************************************************************
        aChuck.chuckPrint = (message) => setLastChuckMessage(message)
        console.log("running chuck now... ", chuckUpdateNeeded);

        const stk1Code = `
            if(note > 127)
            {
                127 => note;
            }
            if(note < 0)
            {
                0 => note;
            }
            me.dir() + "ByronGlacier.wav" => string filePathIR;
            filePathIR => man.bodyIR;
            0.2 => man.bodySize;
            0.7 => man.pluckPos;
   
            0.2 => man.stringDamping;
            0.0 => man.stringDetune;
            0.2 => man.pluck; 
            Std.mtof(60 + note) => man.freq;
        `;

            const test = 'clair';

        const stk2Code = `
            if(note > 127)
            {
                127 => note;
            }
            if(note < 0)
            {
                0 => note;
            }
            0.9 => ${test}.reed;
            0.5 => ${test}.noiseGain;
            0.5 => clair.pressure;
            0.2 => clair.rate;
            0.1 => clair.vibratoFreq;
            0.5 => clair.vibratoGain;
            0.3 => clair.startBlowing;
            0.6 => clair.stopBlowing;
            Std.mtof(60 + note) => clair.freq;
            1.0 => clair.noteOn;
        `;

        if (chuckUpdateNeeded === false) {
            const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            try {
                if (shredCount > 3) {
                    aChuck.runCode(`Machine.removeAllShreds();`);
                    aChuck.runCode(`Machine.resetShredID();`);
                }
            } catch (e) {
                console.log('Err removing shreds: ', e);
            }

            aChuck.runCode(`
            
            ((60.0 / ${bpm})) => float secLenBeat;
            secLenBeat::second => dur beat;

            class SynthVoice extends Chugraph
                {
                    SawOsc saw1 => Mandolin man => LPF lpf => ADSR adsr => Dyno limiter => NRev rev => outlet;
                    SawOsc saw2 => Clarinet clair => lpf;
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
                    ${moogGrandmotherEffects.current.lfoGain.value} => filterLfo.gain;
                    ${parseFloat(moogGrandmotherEffects.current.lfoPitch.value).toFixed(2)} => pitchLfo.gain;


                    ${parseInt(moogGrandmotherEffects.current.syncMode.value)} => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;
                    pitchLfo => saw1;
                    pitchLfo => saw2;
                    pitchLfo => tri1;
                    pitchLfo => tri2;
                    pitchLfo => sqr1;
                    pitchLfo => sqr2;

                    ${parseInt(moogGrandmotherEffects.current.limiterAttack.value)}::ms => limiter.attackTime;
                    ${parseFloat(moogGrandmotherEffects.current.limiterThreshold.value).toFixed(2)} => limiter.thresh;

                    0.1 => saw1.gain => saw2.gain;
                    0.1 => tri1.gain => tri2.gain;
                    0.1 => sqr1.gain => sqr2.gain;

                    10.0 => float filterCutoff;
                    filterCutoff => lpf.freq;


                    ${parseInt(moogGrandmotherEffects.current.adsrAttack.value)}::ms => adsr.attackTime;
                
                    ${parseInt(moogGrandmotherEffects.current.adsrDecay.value)}::ms => adsr.decayTime;
                    ${moogGrandmotherEffects.current.adsrSustain.value} => float susLevel; 
                    (susLevel) => adsr.sustainLevel;
                    ${parseInt(moogGrandmotherEffects.current.adsrRelease.value)}::ms => adsr.releaseTime;

                    ${parseInt(moogGrandmotherEffects.current.offset.value)} => int offset;
                    ${parseInt(moogGrandmotherEffects.current.filterEnv.value)} => float filterEnv;

                    1 => float osc2Detune;
                    0 => int oscOffset;

                    fun void SetOsc1Freq(float frequency)
                    {
                        frequency => tri1.freq => sqr1.freq => saw1.freq; 
                    }

                    fun void SetOsc2Freq(float frequency)
                    {
                        frequency => tri2.freq => sqr2.freq => saw2.freq; 
                    }

                    fun void keyOn(int noteNumber)
                    {
                        Std.mtof(offset + noteNumber) => SetOsc1Freq;
                        Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;
                        1 => adsr.keyOn;
                        spork ~ filterEnvelope();
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

                    fun void keyOff(int noteNumber)
                    {
                        noteNumber => adsr.keyOff;
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

                    fun void stk1(float note)
                    {
                       ${stk1Code}
                    }

                    fun void stk2(float note)
                    {
                        ${stk2Code}
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
                }

                SynthVoice voice => HPF hpf => dac;

                ${moogGrandmotherEffects.current.highPassFreq.value} => hpf.freq;

                [0,1,2,3,4,5,6,7] @=> int notes[];
                
                ${parseInt(moogGrandmotherEffects.current.cutoff.value)} => voice.cutoff;
                ${moogGrandmotherEffects.current.rez.value} => voice.rez;
                ${parseInt(moogGrandmotherEffects.current.env.value)} => voice.env;
                ${parseInt(moogGrandmotherEffects.current.oscType1.value)} => voice.ChooseOsc1;
                ${parseInt(moogGrandmotherEffects.current.oscType2.value)} => voice.ChooseOsc2;
                ${moogGrandmotherEffects.current.detune.value} => voice.detune;
                ${parseInt(moogGrandmotherEffects.current.oscOffset.value)} => voice.oscOffset;
                ${parseInt(moogGrandmotherEffects.current.pitchMod.value)} => voice.pitchMod;
                ${parseInt(moogGrandmotherEffects.current.lfoVoice.value)} => voice.ChooseLfo;
                ${parseInt(moogGrandmotherEffects.current.lfoGain.value)} => voice.filterLfo.gain;
                ${parseInt(moogGrandmotherEffects.current.offset.value)} => voice.offset;
                ${moogGrandmotherEffects.current.filterEnv.value} => voice.filterEnv;
                ${moogGrandmotherEffects.current.noise.value} => voice.noise;
                ${moogGrandmotherEffects.current.reverb.value} => voice.reverb;

                while(${!chuckUpdateNeeded})
                {
                    ${parseFloat(moogGrandmotherEffects.current.env.value).toFixed(2)} => voice.env;
                    ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice.cutoffMod;
                    notes[Math.random2(0, notes.cap()-1)] + 12 => voice.keyOn; 
                    
                    <<< "call STKs from here", notes[Math.random2(0, notes.cap()-1)] + 12 >>>;
                    
                    notes[Math.random2(0, notes.cap()-1)] + 12 => voice.stk1;
                    notes[Math.random2(0, notes.cap()-1)] + 12 => voice.stk2;

                    beat => now;
                    1 => voice.keyOff;
                }

            `);
            console.log('Shred Count in IF: ', await shredCount);
        } else {
            aChuck.runCode(`Machine.removeAllShreds();`);
            aChuck.runCode(`Machine.resetShredID();`);
            const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            console.log('Shred Count in ELSE: ', await shredCount);
            setChuckUpdateNeeded(false);
        }

    }


    
    useEffect(() => { runChuck()}, [chuckUpdateNeeded]);
    
    const playMicThroughChuck = async () => {
        if(typeof window === 'undefined') return;
        if (!aChuck) return;
        await aChuck.runCode(`
        adc => Gain g => NRev r => dac;
        0.4 => g.gain;
        0.9 => r.mix;
        20 => sat.drive;
        4 => sat.dcOffset;

        while( true )
        {
            100::ms => now;
        }
        `);
    }

    // This mic button should be able to save a file and pass it into ChucK as file and/or stream
    const chuckMicButton = function () {
        console.log('ChucK Mic Button Clicked');
        if(typeof window === 'undefined') return;

        navigator.mediaDevices
            .getUserMedia({
                video: false,
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                },
            })
            .then(async (stream: MediaStream) => {
                console.log('aCHUCK after mediastream: ', aChuck);
                const ctx: any = aChuck?.context;
                const adc = ctx.createMediaStreamSource(stream);
                adc.connect(aChuck);
                micButton.disabled = true;
            })
        const micButton: any = document.querySelector(`#micStartRecordButton`);
        micButton && (micButton.disabled = true);

        playMicThroughChuck();
    };

    useEffect(() => {
        if (babylonGame.current && !babylonGame.current.canvas) {
            babylonGame.current.canvas = document.querySelector(`babylonCanvas`);
        }
        if (babylonGame.current && !babylonGame.current.engine) {
            babylonGame.current.engine = new BABYLON.Engine(
                babylonGame.current.canvas,
                true, // antialias
                {preserveDrawingBuffer: true, stencil: true }, //engineOptions
                false // adaptToDeviceRatio
            );

            babylonGame.current.knob = {};
            babylonGame.current.header = {}; 
        };
        const resize = () => {
            babylonGame.current?.scene?.getEngine().resize();
        };

        if (windowListenerRef.current) {
            windowListenerRef.current.addEventListener("resize", resize);
        }      
        return () => {
            if (windowListenerRef.current) {
                windowListenerRef.current.removeEventListener("resize", resize);
            }
        };
    }, [windowListenerRef]);
    
    const handleUpdateSliderVal = (obj: any, value: any) => {
        moogGrandmotherEffects.current[`${obj.name}`].value = value;
        setChuckUpdateNeeded(true);
    };

    const handleChangeBPM = (newBpm: number) => {
        if (newBpm) {
            setBpm(Number(newBpm));
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsNumerator = (newBpm: number) => {
        if (newBpm) {
            setBeatsNumerator(Number(newBpm));
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsDenominator = (newBpm: number) => {
        if (newBpm) {
            setBeatsDenominator(Number(newBpm));
        }
        setChuckUpdateNeeded(true);
    }

    useEffect(() => {
        console.log("Last ChucK msg: ", lastChuckMessage);
    }, [lastChuckMessage]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{height: size.width, width: size.width, boxSizing: 'border-box', display: 'flex', flexDirection: 'row'}}>
            {typeof window !== 'undefined' && window && (typeof cameraCount !== undefined) && (
                <Box sx={{left: '0'}}>
                    <BabylonLayer 
                        game={babylonGame.current}
                        handleUpdateSliderVal={handleUpdateSliderVal}
                        cameraCount={cameraCount || 25}
                        needsUpdate={needsUpdate}
                        handleResetNeedsUpdate={() => setNeedsUpdate(false)}
                        effects={moogGrandmotherEffects.current}
                        chuckUpdateNeeded={chuckUpdateNeeded} 
                        runChuck={runChuck}
                    />     
                    <Box 
                        sx={{
                            left: '0px', 
                            position: 'absolute',
                            top: '0px',
                            paddingLeft: '12px',
                            width: '100%',
                            paddingTop: '6px',
                            paddingBottom: '12px',
                            background: 'rgba(255,255,255,.07)',
                            display: 'flex',
                        }}
                    >
                        {!chuckHook && (<Button sx={{maxHeight: '40px'}} variant="contained" id="initChuckButton" onClick={initChuck}>Start Chuck</Button>)}
                        {chuckHook && (<Button sx={{maxHeight: '40px'}} variant="contained" id="runChuckButton" onClick={runChuck}>Run Chuck</Button>)}
                        {chuckHook && (<Button sx={{maxHeight: '40px'}} variant="contained" id="micStartRecordButton" onClick={chuckMicButton}>Record</Button>)}
                        <ControlPopup 
                            bpm={bpm} 
                            handleChangeBPM={handleChangeBPM} 
                            handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                            beatsNumerator={beatsNumerator}
                            beatsDenominator={beatsDenominator}
                            handleChangeBeatsDenominator={handleChangeBeatsDenominator}    
                        />
                        {/* <FixedOptionsDropdown/> */}
                        {<FixedOptionsDropdown/>}
                    </Box>
                </Box>
            )}
            </Box>
        </ThemeProvider>
    )
};