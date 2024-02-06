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

import { STKOption } from '../../utils/fixedOptionsDropdownData';
import ToggleFXView from './ToggleFXView';
import { getSTK1Preset, getSTK2Preset } from '@/utils/presetsHelper';

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
    const [fxKnobsCount, setFxKnobsCount] = useState<number>(0);
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(60.00);
    const [beatsNumerator, setBeatsNumerator] = useState(4);
    const [beatsDenominator, setBeatsDenominator] = useState(4);
    const [stkValues, setStkValues] = useState<STKOption[]>();
    const [stk2Values, setStk2Values] = useState<STKOption[]>();

    const currentScreen = useRef<string>('synth');
    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [recreateBabylon, setRecreateBabylon] = useState<boolean>(false)
    
    const [stk1Code, setStk1Code] = useState<string>('');
    const [stk2Code, setStk2Code] = useState<string>('');

    const stkValsRef = useRef<STKOption[]>([]);
    const stkFX = useRef<any>();
    const stkFX2 = useRef<any>();
    const stk1Type = useRef<string | undefined>('');
    const stk1Var = useRef<string | undefined>('');
    const stk2Type = useRef<string | undefined>('');
    const stk2Var = useRef<string | undefined>('');
    
    // currentFX are the ones we are actively editing
    const currentFX = useRef<any>();
    // default to the oscillator FX (default oscillator screen happens above)
    if (!currentFX.current) {
        currentFX.current = moogGrandmotherEffects.current
    }

    const stkFXString = useRef<any>('');
    const stkFX2String = useRef<any>('');
    
    // CURRENT EFFECTS LIST SHOULD PERTAIN TO SCREENS / KNOBS!!!! TODO: CLARIFY NAMING HERE!!!!
    const visibleFXKnobs = useRef<Array<any>>();
    
    console.log('CURRENT EFFECTS LIST: ', currentFX.current);

    visibleFXKnobs.current = !currentFX.current.presets 
        ? 
            Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]) 
        : stkValsRef.current.length > 1 && currentScreen.current === 'stk2' 
            ? Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])
            : Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
    
            // FIGURE OUT WHAT TO DO WITH THIS...
            // catch STKs with ADSR effects
            // const hasOpADSRArray = visibleFXKnobs.current && visibleFXKnobs.current.filter((fx: any) => fx[0].indexOf('_') > 0).length > 0;
            // if (!hasOpADSRArray) {
            // } else {
            //     visibleFXKnobs.current?.forEach((fx: any) => {
            //         if(fx[0].indexOf('_') > 0) {
            //         //     game.header[i][j].text = !prevKnobVals.current.i.j ? `${visibleFXKnobs[effectsIndex][0]}: ${visibleFXKnobs[effectsIndex][1].value.toFixed(2)}` : `${visibleFXKnobs[effectsIndex][0]}: ${game.slider[i][j].value.toFixed(2)}`;
            //         // } else {
            //             fx[0] = `${fx[0].split('_')[1]}`;
            //         }
            //     });
            // }


    const updateStkKnobs = (knobVals: STKOption[]) => {
        stkValsRef.current = [];
        knobVals.forEach((kv:any) => {
            console.log('KV from dropdown selector => ', kv)  
            stkValsRef.current.push(kv);
        })
        console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', stkValsRef.current);
        if (stkValsRef.current && stkValsRef.current.length === 1) stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
        if (stkValsRef.current && stkValsRef.current.length === 2) stkFX2.current = getSTK2Preset(stkValsRef.current[1].value);

        console.log('@@@@@@ WTF IS CURR SCREEN??? ', currentScreen.current);

        let knobsCountTemp;
        if (currentScreen.current === 'stk') {
            knobsCountTemp = stkFX.current.presets;
        } else if (currentScreen.current === 'stk2') {
            knobsCountTemp = stkFX2.current.presets;
        } else {
            knobsCountTemp = currentFX.current.length
        }
        setFxKnobsCount(knobsCountTemp);
        console.log('#### Current FX current: ', currentFX.current);      
    }
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

    useEffect(() => {
        (async() => {

            switch(currentScreen.current) {
                case 'synth': 
                    visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
                    break;
                case 'stk':
                    if (stkFX.current && stkFX.current.presets) {
                        visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
                        currentFX.current = stkFX.current;
                    }
                    break;
                case 'stk2':
                    if (stkFX2.current && stkFX2.current.presets) {
                        visibleFXKnobs.current = Object.values(stkFX2.current.presets).map((i:any) => [i.label, i]);
                        currentFX.current = stkFX2.current;
                    }
                    break;
                default:
                    visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
                    break;
            }
        })();
    }, [currentScreen, currentFX, stkFX])

    const updateCurrentFXScreen = () => {
        console.log('FX SCREEN!: ', currentScreen.current);
        console.log('GANME TO RECREATE! ', babylonGame.current);
        if (!babylonGame.current || !babylonGame.current.engine) {
            return;
        }
        if (currentScreen.current === 'synth') {
            stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
            currentFX.current = stkFX.current;
            currentScreen.current = 'stk';
            visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
        } else if (currentScreen.current === 'stk') {
            if (stkValsRef.current.length < 2) {
                currentScreen.current = 'synth';
                currentFX.current = moogGrandmotherEffects.current;
                visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
            } else {
                stkFX2.current = getSTK2Preset(stkValsRef.current[1].value);
                currentScreen.current = 'stk2';
                visibleFXKnobs.current = Object.values(stkFX2.current.presets).map((i:any) => [i.label, i]);
                currentFX.current = stkFX2.current;
            }
        } else if (currentScreen.current === 'stk2') {
            currentScreen.current = 'synth';
            currentFX.current = moogGrandmotherEffects.current;
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
        } else {
            console.log('@@@INNOSCREEN=>so what are stk vals: ', stkValsRef.current);
        }
        // currentFX.current = stkValsRef.current;
        babylonGame.current.engine.dispose();
        babylonGame.current = undefined;
        setBabylonKey(`${babylonKey}1`);
        setRecreateBabylon(!recreateBabylon);
        babylonGame.current = null;
        
        return currentScreen.current;
    };

    useEffect(() => {
        console.log('BABYLON KEY: ', babylonKey);
        setNeedsUpdate(true);
    }, [babylonKey]);
    
    useEffect(() => {
        setFxKnobsCount(Object.keys(moogGrandmotherEffects.current).length);
    },[moogGrandmotherEffects])


    // THIS METHOD TURNS A PRESET INTO CHUCK CODE (only set up for stk1)
    const stkFXToString = () => {
        console.log('stkFXTo *** STRING ***: ', stkFX.current);
        if (!stkFX.current || !stkFX.current.presets) return '';   
        
        stk1Type.current = stkFX.current.type;
        stk1Var.current = stkFX.current.var;
        // *********************************** STK2 WILL NEED UPDATING!!!
        if (stkFX2.current && stkFX2.current.length > 1) {
            stk2Type.current = stkFX2.current.type;
            stk2Var.current = stkFX2.current.var + '2';
        }

        console.log('????? would this cause a break? ', stkFX.current.var);
        Object.values(stkFX.current.presets).map((preset: any) => {
            const alreadyInChuckDynamicScript: boolean = (stkFXString.current && stkFXString.current.indexOf(`${stkFX.current.var}.${preset.name};`) !== -1);
            stkFXString.current = stkFXString.current && !alreadyInChuckDynamicScript ? `${stkFXString.current} ${preset.value} => ${stkFX.current.var}.${preset.name}; ` : `${preset.value} => ${stkFX.current.var}.${preset.name}; `;
        });

        stkFX2.current && stkFX2.current.presets && Object.values(stkFX2.current.presets).map((preset: any) => {
            const alreadyInChuckDynamicScript: boolean = (stkFX2String.current && stkFX2String.current.indexOf(`${stkFX2.current.var}.${preset.name};`) !== -1);
            stkFX2String.current = stkFX2String.current && !alreadyInChuckDynamicScript ? `${stkFX2String.current} ${preset.value} => ${stkFX2.current.var}.${preset.name}; ` : `${preset.value} => ${stkFX2.current.var}.${preset.name}; `;
            return stkFX2String.current;
        });
        console.log('are we appending to stkFXString? ', stkFXString.current);
        return [stkFXString.current, stkFX.current.type, stkFX.current.var];
    }

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
    }, [moogGrandmotherEffects]);

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
  
        

    



        const getStk1String: any = await stkFXToString();
        // ********************************************** THIS ONE BELOW WILL NEED THE UPDATES TO STK2 
        const getStk2String: any = await stkFXToString();
        console.log('stk string before running chuck: ', getStk1String);

        const bodyIR1 = getStk1String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk1String[2]}.bodyIR;`: '';
        const bodyIR2 = getStk2String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk2String[2]}.bodyIR;` : '';

        const STK_1_Code = getStk1String ? `
            if(note > 127)
            {
                127 => note;
            }
            if(note < 0)
            {
                0 => note;
            }

            ${getStk1String[0]}

            ${bodyIR1}

            Std.mtof(note + 32) => ${getStk1String[2]}.freq;
            1 => ${getStk1String[2]}.noteOn;
        ` : '';
if (stkValsRef.current.length === 2) {
        
        const STK_2_Code = getStk2String ? `
            if(note > 127)
            {
                127 => note;
            }
            if(note < 0)
            {
                0 => note;
            }

            ${bodyIR2}
            ${getStk2String[0]}

            Std.mtof(note + 32) => ${getStk2String[2]}.freq;
            1 => ${getStk2String[2]}.noteOn;
        ` : '';
setStk2Code(STK_2_Code);
}
        setStk1Code(STK_1_Code);
        
        
        console.log('STK_1_Code !!!!!!! ', stk1Code);
        console.log('STK_2_Code %%%%%%% ', stk2Code);
        
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


            const connector1Stk = getStk1String.length ? `=> ${getStk1String[1]} ${getStk1String[2]}` : '';
            const connectorStk1DirectToDac = getStk1String ? `${getStk1String[2]} => dac;` : ``;

            const connectorStk2DirectToDac = getStk2String ? `${getStk2String[1]} ${getStk2String[2]}_ => dac;` : '';
            aChuck.runCode(`
            
            ((60.0 / ${bpm})) => float secLenBeat;
            secLenBeat::second => dur beat;

            class SynthVoice extends Chugraph
                {
                    SawOsc saw1 ${connector1Stk} => LPF lpf => ADSR adsr => Dyno limiter => NRev rev => outlet;
                    SawOsc saw2 => Clarinet clair => lpf;
                    Noise noiseSource => lpf;

                    ${connectorStk1DirectToDac}
                    ${connectorStk2DirectToDac}


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
                    
                    if (Machine.numShreds() < 7) {
                        notes[Math.random2(0, notes.cap()-1)] + 24 => voice.keyOn; 
                        
                        notes[Math.random2(0, notes.cap()-1)] + 24 => voice.stk1;

                        if (Machine.shreds().size() >= 2) {
                            for (0 => int shrds; shrds < Machine.shreds().size() - 1; shrds++) {
                                if (shrds > 2) {
                                    Machine.remove(Machine.shreds()[shrds]);
                                }
                            };
                        }

                        beat => now;
                    } else {
                        if (${bpm} > 300) {
                            Machine.removeAllShreds();
                            Machine.resetShredID();
                        }
                        1::ms => now;
                    }    
                    1 => voice.keyOff;
                    
                }
            `);
            console.log('Shred Count in IF: ', await shredCount);
        } else {
            // aChuck.runCode(`Machine.removeAllShreds();`);
            // aChuck.runCode(`Machine.resetShredID();`);
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
        0.2 => g.gain;
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
        console.log('in useeffect');
        if (babylonGame.current && !babylonGame.current.canvas) {
            console.log('in useeffect getting canvas');
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
    }, [windowListenerRef, recreateBabylon]);
    
    const handleUpdateSliderVal = (obj: any, value: any) => {
        console.log('WHAT IS CURRENT SCREEN? ', currentScreen.current);
        // moogGrandmotherEffects.current[`${obj.name}`].value = value;
        ////// CURRENT SCREEN ISN'T UPDATING FAST ENOUGH!!!!! CAUSING REGRESSION BUGS
        if (currentScreen.current === 'stk') {
            console.log('FUCKING WORK IT OUT OBJ NAME: ', obj.name);
            console.log('FUCKING WORK IT IS ', stkFX.current.presets);
            console.log('FUCKING SHIT ', stkFX.current.presets[`${obj.name}`]);
            stkFX.current.presets[`${obj.name}`].value = value;
        } else if (currentScreen.current === 'stk2') {
            console.log('FUCKING WORK IT OUT OBJ NAME: ', obj.name);
            console.log('FUCKING WORK IT IS ', stkFX2.current.presets);
            console.log('FUCKING SHIT ', stkFX2.current.presets[`${obj.name}`]);
            stkFX2.current.presets[`${obj.name}`].value = value;
        } else if (currentScreen.current === 'synth') {
            console.log('@@@ FUCKING WORK IT OUT OBJ NAME: ', obj.name);
            console.log('@@@ FUCKING WORK IT IS ', currentFX.current);
            console.log('@@@ FUCKING SHIT ', currentFX.current[`${obj.name}`]);
            currentFX.current[`${obj.name}`].value = value;
        }
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

    const handleTurnKnob = () => {
        console.log('WHAT R STKVALS? ', currentFX.current);
        setChuckUpdateNeeded(true);
    }

    useEffect(() => {
        console.log("Last ChucK msg: ", lastChuckMessage);
    }, [lastChuckMessage]);

    useEffect(() => {
        console.log('do we hear FX CHANGE AT ALL? ', currentFX.current);
    }, [currentFX])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{height: size.width, width: size.width, boxSizing: 'border-box', display: 'flex', flexDirection: 'row'}}>
            {typeof window !== 'undefined' && window && (typeof fxKnobsCount !== undefined) && (
                <Box key={babylonKey} sx={{left: '0'}}>
                    <BabylonLayer 
                        game={babylonGame.current}
                        handleUpdateSliderVal={handleUpdateSliderVal}
                        fxKnobsCount={fxKnobsCount}
                        needsUpdate={needsUpdate}
                        handleResetNeedsUpdate={() => setNeedsUpdate(false)}
                        // effects={moogGrandmotherEffects.current}
                        effects={currentFX.current}
                        visibleFXKnobs={visibleFXKnobs.current}
                        chuckUpdateNeeded={chuckUpdateNeeded}
                        handleTurnKnob={handleTurnKnob}
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
                        <ToggleFXView updateCurrentFXScreen={updateCurrentFXScreen}/>
                        {/* <FixedOptionsDropdown/> */}
                        {<FixedOptionsDropdown updateStkKnobs={(e: STKOption[]) => updateStkKnobs(e)} stkValues={stkValues} setStkValues={setStkValues} />}
                    </Box>
                </Box>
            )}
            </Box>
        </ThemeProvider>
    )
};