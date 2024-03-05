"use client"

import Image from 'next/image'
import styles from './page.module.css';
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import React, { useState, useEffect, useDeferredValue, useRef, useMemo } from 'react'
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FXOption, STKOption, fxGroupOptions, fxOptions } from '../../utils/fixedOptionsDropdownData';
import ToggleFXView from './ToggleFXView';
import { getSTK1Preset, getSTK2Preset, getFX1Preset } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import { getBaseUrl } from '@/utils/siteHelpers';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

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

interface AllFXPersistent {
    Osc1: Array<any>;
    Osc2: Array<any>;
    STK: Array<any>;
    Sampler: Array<any>;
    AudioIn: Array<any>;
}

export default function InitializationComponent() {
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const aChuck: Chuck | undefined = useDeferredValue(chuckHook);
    const [lastChuckMessage, setLastChuckMessage] = useState<string>("");
    const moogGrandmotherEffects = useRef<MoogGrandmotherEffects | any>(moogGMPresets);
    const allFxPersistent = useRef<AllFXPersistent | any>({
        Osc1: [],
        Osc2: [],
        STK: [],
        Sampler: [],
        AudioIn: [],
    });
    const [fxKnobsCount, setFxKnobsCount] = useState<number>(0);
    const [fxRoutingNeedsUpdate, setFxRoutingNeedsUpdate] = useState<number>(0);
    const [fXChainKey, setFXChainKey] = useState<string>('');
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(60.00);
    const [beatsNumerator, setBeatsNumerator] = useState(4);
    const [beatsDenominator, setBeatsDenominator] = useState(4);
    const [stkValues, setStkValues] = useState<STKOption[]>([]);
    const [stk2Values, setStk2Values] = useState<STKOption[]>();
    const [octave, setOctave] = useState('4');
    const [audioKey, setAudioKey] = useState('C');
    const [audioScale, setAudioScale] = useState('Major');
    const [audioChord, setAudioChord] = useState('M');
    const [fxRadioValue, setFxRadioValue] = React.useState('Osc1');

   
    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [recreateBabylon, setRecreateBabylon] = useState<boolean>(false)
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);

    const [stk1Code, setStk1Code] = useState<string>('');
    const [stk2Code, setStk2Code] = useState<string>('');

    const selectedEffect = useRef<string>('')
    const currentScreen = useRef<string>('synth');
    const [test, setTest] = useState<boolean>(true);
    const [showFX, setShowFX] = useState<boolean>(false)
;
    const stkValsRef = useRef<STKOption[]>([]);
    const stkFX = useRef<any>([]);
    const stkFX2 = useRef<any>();
    const stk1Type = useRef<string | undefined>('');
    const stk1Var = useRef<string | undefined>('');
    const stk2Type = useRef<string | undefined>('');
    const stk2Var = useRef<string | undefined>('');

    const fxValsRef = useRef<FXOption[]>([]);
    const fxFX = useRef<any>([]);
    const fx1Type = useRef<string | undefined>('');
    const fx1Var = useRef<string | undefined>('');
    const fx1Group = useRef<string | undefined>('');
    const checkedFXList = useRef<FXOption[]>([]);

    
    // currentFX are the ones we are actively editing
    const currentFX = useRef<any>();
    // default to the oscillator FX (default oscillator screen happens above)
    if (!currentFX.current) {
        currentFX.current = moogGrandmotherEffects.current
    }

    // currentFX.current = {...currentFX.current, ...fxFX.current.filter((fx: any) => fx.visible === true && fx)}

    const stkFXString = useRef<any>('');
    const stkFX2String = useRef<any>('');
    const osc1FXString = useRef<any>('');
    const osc2FXString = useRef<any>('');
    const audioInFXString = useRef<any>('');
    const samplerFXString = useRef<any>('');

    const osc1FXStringToChuck = useRef<any>('');
    const osc2FXStringToChuck = useRef<any>('');
    const audioInFXStringToChuck = useRef<any>('');
    const samplerFXStringToChuck = useRef<any>('');


    
    // CURRENT EFFECTS LIST SHOULD PERTAIN TO SCREENS / KNOBS!!!! TODO: CLARIFY NAMING HERE!!!!
    const visibleFXKnobs = useRef<Array<any>>();
    
    const submitMingus = async () => {
        console.log("DO WE HAVE AUDIOKEY??? ", audioKey);
        console.log("TEST HERE 1$");
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, {audioKey, audioScale, octave}, {
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(({data}) => {
            console.log("TEST SCALES HERE 1# ", data);
            //return setMingusKeyboardData(data);
        });
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, {audioChord, audioKey}, {
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(({data}) => {
            console.log("TEST CHORDS 1# ", data);
            // return mingusChordsData.current = data;
            return data;
        });
    }

    const handleClickName = (e: any, op: string) => {
        console.log('TEST CLICK ', e, op);
    };

    useEffect(() => {
        const stksAndFX: any = [stkFX.current, ...Object.values(fxFX.current)];
        const visibleStkAndFX: Array<any> = Array.from(stksAndFX).filter((i: any) => i.visible);
        // console.log('???%%%% ', currentFX.current);
        console.log('visibleStkAndFX: ', visibleStkAndFX);

        visibleFXKnobs.current = [];
        visibleStkAndFX.map((i: any) => {
            console.log('ARG I! ', i)
            Object.values(i.presets).map((j: any) => {
                console.log('ARG J! ', [j.label, j]);
                visibleFXKnobs.current?.push([j.label, j]);
            });
        });
        console.log('visibleFXKNOBS: ', visibleFXKnobs.current);
        
        let newVals: any = [];
   
        visibleFXKnobs.current.map((fxK: any) => newVals.push([fxK, fxK.label]))
        
        const availableFX: any =  visibleStkAndFX.filter((i: any) => i.fxType === 'fx');
        setNeedsUpdate(true);
        console.log('ummmmmmm what are availableFX: ', availableFX);
        if (availableFX.length > 0 && availableFX[0].var) {
            currentScreen.current = `fx_${availableFX[0].var}`;
            // currentFX.current = fxFX.current;

            currentFX.current = [];
            visibleFXKnobs.current = availableFX.map((fxFX: any) => currentFX.current.push(Object.values(fxFX).map((i:any) => [i.label, i])));
            selectedEffect.current = currentFX.current[0].var;
            // this is where we decide which fx get pushed down into the fxChain
            availableFX.map((fx: any) => {
                if(fx.var && allFxPersistent.current[`${fxRadioValue}`].map((f:any) => f.var).indexOf(fx.var) === -1) {
                    allFxPersistent.current[`${fxRadioValue}`].push(fx);
                    allFxPersistent.current[`${fxRadioValue}`].filter((v:any) => v.var && v);
                }
            })
            // alert('cha cha checkit: ' + allFxPersistent.current.length);
            // console.log('cha cha checkit: ' + allFxPersistent.current);
            currentScreen.current = '';
            updateCurrentFXScreen();
        }

        const gotFX: any = fxFX.current.length > 0 && fxFX.current.filter((fx: any) => fx.visible === true && fx);
        // console.log('what are visible knobs? ', visibleFXKnobs.current);
        // console.log('what are fxFX? ', fxFX.current.filter((fx: any) => fx.visible === true && fx))
        // console.log("GOT FX?!@!@? ", gotFX.length > 0 && gotFX.map((f: any) => f.var));
        // console.log("SEL FX ", selectedEffect.current);
        // console.log("CURR SCREEN ", currentScreen.current);
    
        const theFXIdx = gotFX.length > 0 && gotFX.map((f: any) => f.var).indexOf(selectedEffect.current) >= 0 
        ? 
            gotFX.map((f: any) => f.var).indexOf(selectedEffect.current) 
        : 
            gotFX.length - 1;
        console.log(`theFXIdx ${theFXIdx}`)
        visibleFXKnobs.current = !currentFX.current.presets 
            ? 
                currentFX.current.length > 0 || visibleFXKnobs.current && gotFX
                ?
                    Object.values(gotFX[theFXIdx].presets).map((f: any) => [f.label, f])
                :
                    Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]) 
            : (stkValsRef.current.length > 1 && currentScreen.current === 'stk2')
                ? 
                    Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])
                : 
                    currentScreen.current !== 'fx_'
                    ?
                        Object.values(stkFX.current.presets).map((i:any) => [i.label, i])
                    : 
                        Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])                
    
        console.log('VIZ FX CURR AT END OF TEST: ', visibleFXKnobs.current);
    }, [test]);

    useEffect(() => {
        currentFX.current = [];
        fxFX.current = [];
        // setFXChainKey('');
        checkedFXList.current = [];
        setNeedsUpdate(true);
    }, [fxRadioValue]);

    const fxChainNeedsUpdate = (msg: any) => {
        console.log("MSG MSG MSG ", msg[0].source);
        selectedEffect.current = msg[0].source;

        const effectToSwitchDisplay = allFxPersistent.current[`${fxRadioValue}`].filter((fx: any) => fx.var === msg[0].source && fx);
        if (effectToSwitchDisplay.length > 0) {
            console.log('12345 ', effectToSwitchDisplay);
            fxFX.current = effectToSwitchDisplay;
            
        }
        selectedEffect.current = msg[0].source;
        setClickFXChain(true);
        setFXChainKey(msg.map((l:any) => l.source + "_"));


        
        // visibleFXKnobs.current = Object.values(fxFX.current).map((i:any) => [i.label, i]);
    //     const theOne = allFxPersistent.current.filter((fx: any) => fx.var === msg[0].source && fx)
    //     console.log('###1: ', theOne[0].label);
    //     console.log('###2: ', visibleFXKnobs.current);
    //     console.log('###3: ', fxFX.current)
    //     const gotIt: any = Array.from(theOne[0].presets);
    //     // visibleFXKnobs.current = [];
    //    const test = gotIt.map((preset: any) => ([preset.label, preset]));
    //     console.log('#### COMPARE TO 2: ', test);
        // updateCurrentFXScreen();
        // setNeedsUpdate(true);
        // setTest(!test);
    }

    const handleFXGroupChange = (e: any) => {        
        if (fxValsRef.current.indexOf(e.target.value) === -1 && fxValsRef.current.indexOf(e.target.value) === -1) { 
            fxValsRef.current.push(e.target.value);
            checkedFXList.current.push(e.target.value);
        } else {
            const index = fxValsRef.current.indexOf(e.target.value);
            fxValsRef.current.splice(index, 1);
            const indexChecked = checkedFXList.current.indexOf(e.target.value);
            checkedFXList.current.slice(indexChecked, 1);
        }
    };

    // console.log('CURRENT EFFECTS LIST: ', currentFX.current);
    // < TODO This File runs constantly... should it!?!?!

    // const gotFX: any = fxFX.current.length > 0 && fxFX.current.filter((fx: any) => fx.visible === true && fx);
    // console.log('what are visible knobs? ', visibleFXKnobs.current);
    // console.log('what are fxFX? ', fxFX.current.filter((fx: any) => fx.visible === true && fx))
    // console.log("GOT FX?!@!@? ", gotFX.length > 0 && gotFX.map((f: any) => f.var).indexOf(selectedEffect));
    // console.log("SEL FX ", selectedEffect);

    // const theFXIdx = gotFX.length > 0 && gotFX.map((f: any) => f.var).indexOf(selectedEffect) >= 0 ? gotFX.map((f: any) => f.var).indexOf(selectedEffect) : gotFX.length - 1;
    // alert(`FUCK ${theFXIdx}`)
    // visibleFXKnobs.current = !currentFX.current.presets 
    //     ? 
    //     currentFX.current.length > 0 || visibleFXKnobs.current && gotFX
    //         ?
    //             Object.values(gotFX[theFXIdx].presets).map((f: any) => [f.label, f])
    //         :
    //             Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]) 
    //     : (stkValsRef.current.length > 1 && currentScreen.current === 'stk2')
    //         ? Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])
    //         : 
    //             currentScreen.current !== 'fx_'
    //             ?
    //                 Object.values(stkFX.current.presets).map((i:any) => [i.label, i])
    //             : 
    //                 Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])                

    const updateStkKnobs = (knobVals: STKOption[]) => {
        stkValsRef.current = [];
        console.log("WHAT ARE KNOBVALS? ", stkValsRef.current);
        if (knobVals[0] && Object.values(knobVals[0]).length > 0 && knobVals.length > 1) {
            knobVals.map((kv: any) => {
                    (kv:any) => {
                        console.log('KV from dropdown selector => ', kv)  
                        stkValsRef.current.push(kv);
                    }
                })
        
        } else {
            knobVals.forEach((kv:any) => {
                console.log('KV from dropdown selector => ', kv)  
                stkValsRef.current.push(kv);
            })
        }
        console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', stkValsRef.current);
        if (stkValsRef.current && stkValsRef.current.length === 1) stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
        if (stkValsRef.current && stkValsRef.current.length === 2) stkFX2.current = getSTK2Preset(stkValsRef.current[1].value);

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
        updateCurrentFXScreen();  
    }
    // const isLocal = process.env.NEXT_PUBLIC_BASE_URL_LOCAL; 
    // const baseUrl = isLocal ? process.env.NEXT_PUBLIC_BASE_URL_LOCAL : window.location.href; // start creating variables for envs

    const baseUrl = getBaseUrl();
    const preloadedFiles: any = new Promise((resolve, reject) => {
        try {
          resolve(axios.get(`${baseUrl}/api/preloadedFiles`, {
            headers: {
                'Content-Type': 'application/json',
            },
          }));
        } catch (error) {
          console.log('error in axios get: ', error);
          reject(error);
        }
    });
  
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

    const updateCurrentFXScreen = () => {
        console.log('FX SCREEN!: ', currentScreen.current);
        console.log('GANME TO RECREATE! ', babylonGame.current);
        if (!babylonGame.current || !babylonGame.current.engine) {
            return;
        }

    
        if (currentScreen.current === 'fx_' && stkValsRef.current.length > 0 ) {
            stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
            currentFX.current = stkFX.current;
            currentScreen.current = 'stk';
            visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
        } else if (currentScreen.current === 'fx_') {
            alert('goddamnit3');
            currentScreen.current = 'stk';
            currentFX.current = moogGrandmotherEffects.current;
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
            setFxKnobsCount(visibleFXKnobs.current.length);                
        }
  
// tk
        if (currentScreen.current === 'synth') {
            alert('goddamnit1');
            try {
                stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
                currentFX.current = stkFX.current;
                currentScreen.current = 'stk';
                visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
            } catch (e: any) {}
        } else if (currentScreen.current === 'stk' || currentScreen.current === 'fx_') {
            alert('goddamnit2');
            // if (stkValsRef.current.length < 2) {
                currentScreen.current = 'synth';
                currentFX.current = []; 
                currentFX.current = moogGrandmotherEffects.current;
                fxFX.current = [];
                visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
                console.log('what are current FX in stk? ', fxFX.current);

        } 
        else {
            console.log('what are current FX in stk? ', fxFX.current);
            currentScreen.current = '';
            currentFX.current = fxFX.current;
            visibleFXKnobs.current = Object.values(fxFX.current).map((i:any) => [i.label, i]);
        }
        babylonGame.current.engine.dispose();
        babylonGame.current = undefined;
        setBabylonKey(`${babylonKey}1`);
        setRecreateBabylon(!recreateBabylon);
        babylonGame.current = null;   
             
        return currentScreen.current;
    };

    const updateCheckedFXList = (e: any) => {
        if (checkedFXList.current.indexOf(e.target.value) === -1) { 
            checkedFXList.current.push(e.target.value);
        } else {
            const index = checkedFXList.current.indexOf(e.target.value);
            checkedFXList.current.splice(index, 1);
        }

        console.log("Checked List Current in Update: ", checkedFXList.current);

        const allFx: any = [];
        fxGroupOptions.map((i: any) => {
            if(allFx.indexOf(i.effects) === -1) {
                allFx.push(i.effects);
            }
        });

        console.log("DOES ALLFX DO WHAT WE WANT? ", allFx);
        allFx.flat().forEach((fx: any) => {
            if (fxFX.current.filter((fx:any) => fx.visible === true && fx).map((u: any) => u.var).indexOf(fx.effectVar) === -1) {
                fxFX.current.push({
                    presets: getFX1Preset(fx.effectVar)[0].presets,
                    type: fx.effectLabel,
                    var: fx.effectVar,
                    fxType: 'fx',
                    visible: false,
                });
            }
        });
        
        fxFX.current.forEach((c: any) => {
            const isChecked = checkedFXList.current.indexOf(c.var); 
            if (isChecked !== -1) {
                c.visible = true;
            } else {
                c.visible = false;
            }
        });

        fxFX.current = fxFX.current.filter((f: any) => f.visible === true && f)
        
        setTest(!test);
    };

    const handleUpdateFXChain = (msg: any) => {
        console.log('MSGMSG: ', msg);
        setFxRoutingNeedsUpdate(fxRoutingNeedsUpdate + 1);
    }

    const handleChangeAudioKey = (key: string) => {
        console.log('ALL GOOD ON KEY ', key);
        setAudioKey(key as string);
    };

    const handleChangeOctave = (octave: string) => {
        console.log('ALL GOOD ON OCTAVE ', octave);
        setOctave(octave);
    };

    const handleChangeScale = (event: SelectChangeEvent) => {
        console.log('WHAT IS EVENT IN HANDLECHANNGESCALE? ', event);
        setAudioScale(event.target.value as string);
    };

    const handleChangeChord = (event: SelectChangeEvent) => {
        console.log('WHAT IS EVENT IN HANDLECHANNGECHORD? ', event);
        setAudioChord(event.target.value as string);
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

        Object.values(stkFX.current.presets).map((preset: any) => {
            console.log('STK PRESET: ', preset);
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

    const osc1FXToString = () => {
        Object.values(allFxPersistent.current.Osc1).map((o1: any) => {
            if (osc1FXStringToChuck.current.indexOf(`${o1.var}_o1`) === -1) {
                osc1FXStringToChuck.current = osc1FXStringToChuck.current.concat(`=> ${o1.type} ${o1.var}_o1`)
            }
            
            Object.values(o1.presets).length > 0 && Object.values(o1.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (osc1FXString.current && osc1FXString.current.indexOf(`${o1.var}_o1.${preset.name};`) !== -1);
                osc1FXString.current = osc1FXString.current && !alreadyInChuckDynamicScript ? `${osc1FXString.current} ${preset.value} => ${o1.var}_o1.${preset.name};` : `${preset.value} => ${o1.var}_o1.${preset.name}; `;
                console.log('CHECK OSC1 STRING CURRENT: ', osc1FXString.current);
            });
        });
    }

    const osc2FXToString = () => {
        Object.values(allFxPersistent.current.Osc2).map((o2: any) => {
            if (osc2FXStringToChuck.current.indexOf(`${o2.var}_o2`) === -1) {
                osc2FXStringToChuck.current = osc2FXStringToChuck.current.concat(`=> ${o2.type} ${o2.var}_o2`)
            }
            Object.values(o2.presets).length > 0 && Object.values(o2.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (osc2FXString.current && osc2FXString.current.indexOf(`${o2.var}_o2.${preset.name};`) !== -1);
                osc2FXString.current = osc2FXString.current && !alreadyInChuckDynamicScript ? `${osc2FXString.current} ${preset.value} => ${o2.var}_o2.${preset.name};` : `${preset.value} => ${o2.var}_o2.${preset.name}; `;
                console.log('CHECK OSC2 STRING CURRENT: ', osc2FXString.current);
            });
        });
    }

    const audioInFXToString = () => {
        Object.values(allFxPersistent.current.AudioIn).map((aIn: any) => {
            if (audioInFXStringToChuck.current.indexOf(`${aIn.var}_aIn`) === -1) {
                audioInFXStringToChuck.current = audioInFXStringToChuck.current.concat(`=> ${aIn.type} ${aIn.var}_aIn`)
            }
            Object.values(aIn.presets).length > 0 && Object.values(aIn.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (audioInFXString.current && audioInFXString.current.indexOf(`${aIn.var}_aIn.${preset.name};`) !== -1);
                audioInFXString.current = audioInFXString.current && !alreadyInChuckDynamicScript ? `${audioInFXString.current} ${preset.value} => ${aIn.var}_aIn.${preset.name};` : `${preset.value} => ${aIn.var}_aIn.${preset.name}; `;
                console.log('CHECK Audio In STRING CURRENT: ', audioInFXString.current);
            });
        });
    }

    const samplerFXToString = () => {
        Object.values(allFxPersistent.current.Osc1).map((samp: any) => {
            if (samplerFXStringToChuck.current.indexOf(`${samp.var}_samp`) === -1) {
                samplerFXStringToChuck.current = samplerFXStringToChuck.current.concat(`=> ${samp.type} ${samp.var}_samp`)
            }
            Object.values(samp.presets).length > 0 && Object.values(samp.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (samplerFXString.current && samplerFXString.current.indexOf(`${samp.var}_samp.${preset.name};`) !== -1);
                samplerFXString.current = samplerFXString.current && !alreadyInChuckDynamicScript ? `${samplerFXString.current} ${preset.value} => ${samp.var}_samp.${preset.name};` : `${preset.value} => ${samp.var}_samp.${preset.name}; `;
                console.log('CHECK sampler STRING CURRENT: ', samplerFXString.current);
            });
        });
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
        if (Object.keys(moogGrandmotherEffects).length > 0 || currentScreen.current === 'fx_') {
            createEffectsButtons(moogGrandmotherEffects.current);
        }
    }, [moogGrandmotherEffects]);

   // console.log('!!!!! ', allFxPersistent.current.length, Object.values(allFxPersistent.current.Osc1[0].presets));
    if (allFxPersistent.current.Osc1[0] && Object.values(allFxPersistent.current.Osc1[0].presets).length > 0) {
        osc1FXToString();
    }
    if (allFxPersistent.current.Osc2[0] && Object.values(allFxPersistent.current.Osc2[0].presets).length > 0) {
        osc2FXToString();
    }
    if (allFxPersistent.current.AudioIn[0] && Object.values(allFxPersistent.current.AudioIn[0].presets).length > 0) {
        audioInFXToString();
    }
    if (allFxPersistent.current.Sampler[0] && Object.values(allFxPersistent.current.Sampler[0].presets).length > 0) {
        samplerFXToString();
    }

    console.log('urrrr OSC1 String ', osc1FXString.current);
    console.log('osc1FXStringToChuck.current ', osc1FXStringToChuck.current);
    console.log('urrrr OSC2 String ', osc2FXString.current);
    console.log('osc2FXStringToChuck.current ', osc2FXStringToChuck.current);

    console.log('urrrr audioIn String ', audioInFXString.current);
    console.log('audioInFXStringToChuck.current ', audioInFXStringToChuck.current);
    console.log('urrrr sampler String ', samplerFXString.current);
    console.log('sampler FXStringToChuck.current ', samplerFXStringToChuck.current);

    const runChuck = async () => {
        if(typeof window === 'undefined') return;
        if (!aChuck) return;
        console.log("aChuck!?!?!?!?!?!? : ", await aChuck);

        // ****************************************************************
        // Props for main ChucK file
        // ****************************************************************
        // gather an object with effects settings
        // gather timing information & parameters
        // gather score information & instruments
        // get an array of all files we want to load
        // ****************************************************************
        aChuck.chuckPrint = (message) => {
            setLastChuckMessage(message);
            if (aChuck) {
                (async () => {
                    const shredCount = await aChuck.runCode(`Machine.numShreds();`);
                    console.log('shred count: ', shredCount);
                })
            }
        }
        console.log("running chuck now... ", chuckUpdateNeeded);
        console.log("CHECK CURRENT FX ************** ", currentFX.current)

        const getStk1String: any = await stkFXToString();
        // ********************************************** THIS ONE BELOW WILL NEED THE UPDATES TO STK2 
        const getStk2String: any = await stkFXToString();
        console.log('stk string before running chuck: ', getStk1String);

        const bodyIR1 = getStk1String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk1String[2]}.bodyIR;`: '';
        const bodyIR2 = getStk2String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk2String[2]}.bodyIR;` : '';
        // const isBowing = getStk1String[2] === 'wg' ? 'wg.startBowing(1);' : '';

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
            const connector2Stk = getStk2String.length ? `=> ${getStk2String[1]} ${getStk2String[2]}` : '';
            
            const connectorStk1DirectToDac = getStk1String ? `${getStk1String[2]} => dac;` : ``;
            const connectorStk2DirectToDac = getStk2String ? `${getStk2String[1]} ${getStk2String[2]}_ => dac;` : '';
            
            // await aChuck.loadFile('Multicomb.chug.wasm');   
            //aChuck.loadFile('multicomb-help.ck'); 
            // aChuck.runFile('pitchtrack-help.ck'); 

            aChuck.runCode(`
            
            ((60.0 / ${bpm})) => float secLenBeat;
            secLenBeat::second => dur beat;

            class SynthVoice extends Chugraph
                {
                    SawOsc saw1 ${connector1Stk} => LPF lpf => ADSR adsr => Dyno limiter => NRev rev => outlet;
                    
                    SawOsc saw2 => SinOsc sintest => lpf;
                    880 => sintest.freq;
                    Noise noiseSource => lpf;

                    // ${connectorStk1DirectToDac}
                    // ${connectorStk2DirectToDac}

                    
                    ///////////////////////////////////
                    // Enter the FX Chain stuff here...
                    0 => rev.mix;
                    ///////////////////////////////////





                    

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
                    0.5 => filterLfo.gain;
                    0.5 => pitchLfo.gain;


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
                    880 => float filterEnv;

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

                    // fun void reverb(float amount)
                    // {
                    //     if(amount > 100)
                    //     {
                    //         100 => amount;
                    //     }
                    //     if(amount < 1)
                    //     {
                    //         0 => amount;
                    //     }
                    //     0.02 * (amount / 100) => rev.mix;
                    // }
                }

                SynthVoice voice => HPF hpf => dac;

                ${moogGrandmotherEffects.current.highPassFreq.value} => hpf.freq;

                [0,5] @=> int notes[];
                
                ${parseInt(moogGrandmotherEffects.current.cutoff.value)} => voice.cutoff;
                ${moogGrandmotherEffects.current.rez.value} => voice.rez;
                ${parseInt(moogGrandmotherEffects.current.env.value)} => voice.env;
                ${parseInt(moogGrandmotherEffects.current.oscType1.value)} => voice.ChooseOsc1;
                ${parseInt(moogGrandmotherEffects.current.oscType2.value)} => voice.ChooseOsc2;
                ${moogGrandmotherEffects.current.detune.value} => voice.detune;
                ${parseInt(moogGrandmotherEffects.current.oscOffset.value)} => voice.oscOffset;
                ${parseInt(moogGrandmotherEffects.current.pitchMod.value)} => voice.pitchMod;
                ${parseInt(moogGrandmotherEffects.current.lfoVoice.value)} => voice.ChooseLfo;
                0.5 => voice.filterLfo.gain;
                ${parseInt(moogGrandmotherEffects.current.offset.value)} => voice.offset;
                880 => voice.filterEnv;
                0 => voice.noise;

                while(${!chuckUpdateNeeded})
                {
                    ${parseFloat(moogGrandmotherEffects.current.env.value).toFixed(2)} => voice.env;
                    ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice.cutoffMod;
                    
                    if (Machine.numShreds() < 10) {

                        if (Machine.shreds().size() >= 0) {
                            for (0 => int shrds; shrds < Machine.shreds().size() - 1; shrds++) {
                                if (shrds > 3) {
                                    Machine.remove(Machine.shreds()[shrds]);
                                }
                            };
                        }

                        notes[Math.random2(0, notes.cap()-1)] + 24 => voice.keyOn; 
                        
                        notes[Math.random2(0, notes.cap()-1)] + 24 => voice.stk1;

                        beat => now;
                        <<< "****** ", Machine.numShreds() >>>;
                        1 => voice.keyOff;
                    } else {
                        // if (${bpm} > 200) {
                            Machine.removeAllShreds();
                            Machine.resetShredID();
                        // }
                        1::ms => now;
                        1 => voice.keyOff;
                    }    
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
        console.log('recreating babylon on this screen and with these fx: ', currentScreen.current, currentFX.current)
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
        console.log('WTF!!! ', obj, value);
        if (currentScreen.current === '') {
            console.log('SANE CHECK ', obj, value);
            let index: any = Object.values(allFxPersistent.current[`${fxRadioValue}`].map((i:any) => i.presets)).filter((i: any, idx: number) => i.var === obj.name && i)[0];
            console.log('fuck index: ', index);
            if (!index) index = allFxPersistent.current[`${fxRadioValue}`].length - 1;
                allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`].value = value;

        }
        
        // moogGrandmotherEffects.current[`${obj.name}`].value = value;
        ////// CURRENT SCREEN ISN'T UPDATING FAST ENOUGH!!!!! CAUSING REGRESSION BUGS
        if (currentScreen.current === 'stk') {
            console.log('SLIDER OBJ NAME: ', obj.name);
            console.log('STK PRESETS FOR OBJ ', stkFX.current.presets[`${obj.name}`]);
            stkFX.current.presets[`${obj.name}`].value = value;
        } else if (currentScreen.current === 'stk2') {
            console.log('SLIDER OBJ NAME: ', obj.name);
            console.log('STK2 PRESETS FOR OBJ ', stkFX2.current.presets[`${obj.name}`]);
            stkFX2.current.presets[`${obj.name}`].value = value;
        } else if (currentScreen.current === 'synth') {
            console.log('SLIDER OBJ NAME: ', obj.name);
            console.log('SYNTH PRESETS FOR OBJ ', currentFX.current[`${obj.name}`]);
            moogGrandmotherEffects.current[`${obj.name}`].value = value;
        } 
        else if (currentScreen.current.indexOf(`fx_`) !== -1) {
  
            console.log('fxFX.current in : ', fxFX.current);
            console.log('SLIDER OBJ NAME: ', obj.name);
            currentFX.current = fxFX.current[0].presets;
            console.log('SYNTH PRESETS FOR OBJ ', currentFX.current[`${obj.name}`]);
            currentFX.current[`${obj.name}`].value = value;
                      
            // IF WE HIT THIS EFFECT, THE CHANGE SEEMS TO BE IN GOOD SHAPE
            console.log('ALL PERSISTENT Inside FX###s ', allFxPersistent.current);
            alert('we should be good to add vals here');
        }
        console.log('ALL PERSISTENT FX###s ', allFxPersistent.current);
        // tk
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

    const handleShowFX = (closeOnly?: boolean) => {
        setShowFX(!showFX);
    };

    const updateFXInputRadio = (value: any) => {
        if (value && value !== fxRadioValue) {
            console.log('VALUE: ', value);
            setFxRadioValue(value);
        }
    }

    useEffect(() => {
        console.log("Last ChucK msg: ", lastChuckMessage);
    }, [lastChuckMessage]);

    useEffect(() => {
        // IF WE HIT THIS EFFECT, THE CHANGE SEEMS TO BE IN GOOD SHAPE
        console.log('do we hear currentFX.current CHANGE? ', currentFX.current);
    }, [currentFX])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{height: size.width, width: size.width, boxSizing: 'border-box', display: 'flex', flexDirection: 'row'}}>
            {typeof window !== 'undefined' && window && (typeof fxKnobsCount !== undefined) && (
                <Box key={babylonKey} sx={{left: '0', display: 'flex', flexDirection: 'row'}}>

               
                {/* <Box sx={{height: '100vh', width: '100vw'}}>
                    <LineChartWrapper />
                </Box> */}

       

{/* <Grid style={{ left: '0px', bottom: '80px', position: 'absolute'}} container spacing={2}>
    {allFxPersisent.current.map((fx:any, i:number) => {
        return <Grid sx={{}} item xs={1}>
            yooo: fx.data.name {i}
        </Grid>
    })}
</Grid> */}


                    <FXRouting
                        key={fXChainKey + fxRadioValue} 
                        fxChainNeedsUpdate={fxChainNeedsUpdate} 
                        fxData={allFxPersistent.current[`${fxRadioValue}`]} 
                        width={useWindowSize().width} 
                        height={useWindowSize().height}
                        handleShowFX={handleShowFX}
                        showFX={showFX}
                        fxValsRef={fxFX.current} 
                        handleFXGroupChange={handleFXGroupChange}
                        updateCheckedFXList={updateCheckedFXList} 
                        fxGroupsArrayList={fxGroupOptions} 
                        checkedFXList={checkedFXList.current}
                        fxFX={fxFX.current}
                        handleClickName={handleClickName}
                        setClickFXChain={setClickFXChain}
                        clickFXChain={clickFXChain}
                        updateFXInputRadio={updateFXInputRadio}
                        fxRadioValue={fxRadioValue}
                        updateStkKnobs={updateStkKnobs}
                        setStkValues={setStkValues}
                        stkValues={stkValues}
                        updateCurrentFXScreen={updateCurrentFXScreen}
                        currentScreen={currentScreen.current}
                    />
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
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            background: 'transparent',
                            display: 'flex',
                        }}
                    >
                        {!chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(228,225,209,1)'}} sx={{minWidth: '76px', paddingLeft: '24px', maxHeight: '40px'}} variant="contained" id="initChuckButton" onClick={initChuck} endIcon={<PlayArrowIcon/>}>St</Button>)}
                        {chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(228,225,209,1)'}} sx={{minWidth: '76px', paddingLeft: '24px', maxHeight: '40px'}} variant="contained" id="runChuckButton" onClick={runChuck} endIcon={<PlayCircleFilledIcon/>}>Pl</Button>)}
                        {chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(232, 82,82, 1)', backgroundColor: 'rgba(232, 82,82, 1)'}} sx={{backgroundColor: 'rgba(232, 82,82, 1)', background: 'rgba(232, 82,82, 1)', minWidth: '76px', marginLeft: '8px', maxHeight: '40px'}} variant="contained" id="micStartRecordButton" onClick={chuckMicButton}>Rc</Button>)}
                        <ControlPopup 
                            bpm={bpm} 
                            handleChangeBPM={handleChangeBPM} 
                            handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                            beatsNumerator={beatsNumerator}
                            beatsDenominator={beatsDenominator}
                            handleChangeBeatsDenominator={handleChangeBeatsDenominator}
                            submitMingus={submitMingus}
                            audioKey={audioKey}
                            octave={octave}
                            audioScale={audioScale}
                            audioChord={audioChord}
                            handleChangeChord={handleChangeChord}
                            handleChangeScale={handleChangeScale}
                            handleShowFX={handleShowFX}
                            showFX={showFX}
                        />

                    {/* {stkValues.length > 0 || currentScreen.current !== 'synth' ?
                        <ToggleFXView updateCurrentFXScreen={updateCurrentFXScreen}/> : <></>
                    } */}

                        {/* <ToggleFXView updateCurrentFXScreen={updateCurrentFXScreen}/> */}
                        {/* <ShowFXView handleShowFX={handleShowFX}/> */}
                        {/* <FixedOptionsDropdown/> */}
                        {/* {<FixedOptionsDropdown 
                            updateStkKnobs={
                                (e: STKOption[]) => updateStkKnobs(e)
                            } 
                            stkValues={stkValues} 
                            setStkValues={setStkValues} 
                        />} */}
                    </Box>
                </Box>
            )}
            </Box>
        </ThemeProvider>
    )
};