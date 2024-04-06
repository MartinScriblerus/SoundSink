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
import { getSTK1Preset, getSTK2Preset, getFX1Preset, tableIntToStringHelper } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import { getBaseUrl } from '@/utils/siteHelpers';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { useForm } from "react-hook-form";
import FileManager from './FileManager';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { convertEnvSetting } from '@/utils/FXHelpers/winFuncEnvHelper';
// import winFuncEnvPresets from '@/utils/FXPresets/winFuncEnv';
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

interface Osc1ToChuck {
    name: string;
    string: string;
}
interface AllFXPersistent {
    Osc1: Array<any>;
    Osc2: Array<any>;
    STK: Array<any>;
    Sampler: Array<any>;
    AudioIn: Array<any>;
}

interface MixingBoard {
    osc1: {},
    osc2: {},
    stk1: {},
    sampler: {},
    audioIn: {},
}
// interface EnvHelper {
//     soundSource: string;
//     effectName: string;
//     attackRateDenominator: any;
//     envSetting: any;
//     releaseRateDenominator: any;
// }

export default function InitializationComponent() {
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const aChuck: Chuck | undefined = useDeferredValue(chuckHook);
    const [lastChuckMessage, setLastChuckMessage] = useState<string>("");

    const osc1WinEnvOn = useRef<any>(false);
    const osc1PowerADSROn = useRef<any>(false);
    const osc1ExpEnvOn = useRef<any>(false);
    const osc1WPDiodeLadderOn = useRef<any>(false);
    const osc1WPKorg35On = useRef<any>(false);
    const osc1ModulateOn = useRef<any>(false);
    const osc1DelayOn = useRef<any>(false);
    const osc1DelayAOn = useRef<any>(false);
    const osc1DelayLOn = useRef<any>(false);
    const osc1ExpDelayOn = useRef<any>(false);
    const osc1EllipticOn = useRef<any>(false);
    const osc1SpectacleOn = useRef<any>(false);

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
    const { register, handleSubmit } = useForm();
    const [datas, setDatas] = useState<any>([]);

    const [stkValues, setStkValues] = useState<STKOption[]>([]);
    const [stk2Values, setStk2Values] = useState<STKOption[]>();
    const [octave, setOctave] = useState('4');
    const [audioKey, setAudioKey] = useState('C');
    const [audioScale, setAudioScale] = useState('Major');
    const [audioChord, setAudioChord] = useState('M');
    const [fxRadioValue, setFxRadioValue] = React.useState('Osc1');
    const [showFiles, setShowFiles] = useState<boolean>(false);
   
    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [recreateBabylon, setRecreateBabylon] = useState<boolean>(false)
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);

    const doReturnToSynth = useRef<boolean>(false);

    const [stk1Code, setStk1Code] = useState<string>('');
    const [stk2Code, setStk2Code] = useState<string>('');
    const [osc1Code, setOsc1Code] = useState<string>('');
    const [osc1CodeToChuck, setOsc1CodeToChuck] = useState<string>('');
    const [lastFileUpload, setLastFileUpload] = useState<any>('');
    const [tActive, setTActive] = useState<any>(false);
    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);

    const [uploadedFile, setUploadedFile] = useState<any>({});

    const filesChuckToSynth = useRef<string>('');
    const filesChuckToDac = useRef<string>('');
    const filesGenericCodeString = useRef<any>('');

    const selectedEffect = useRef<string>('')
    const currentScreen = useRef<string>('synth');
    const [test, setTest] = useState<boolean>(true);
    const [showFX, setShowFX] = useState<boolean>(false);
    const stkValsRef = useRef<STKOption[]>([]);
    const stkFX = useRef<any>([]);
    const stkFX2 = useRef<any>();
    const stk1Type = useRef<string | undefined>('');
    const stk1Var = useRef<string | undefined>('');
    const stk2Type = useRef<string | undefined>('');
    const stk2Var = useRef<string | undefined>('');
    const [useStkDirect, setUseDtkDirect] = useState<boolean>(true);

    const filesToProcess = useRef<Array<any>>([]);
    const uploadedFiles = useRef<Array<any>>([]);

    const fxValsRef = useRef<FXOption[]>([]);
    const fxFX = useRef<any>([]);
    const fx1Type = useRef<string | undefined>('');
    const fx1Var = useRef<string | undefined>('');
    const fx1Group = useRef<string | undefined>('');
    const checkedFXList = useRef<FXOption[]>([]);
   
    const finalOsc1FxStringToChuck = useRef<Osc1ToChuck[]>([]);
    const osc1FxStringNeedsBlackhole = useRef<string>('');
    const osc1FxStringToChuckNeedsBlackhole = useRef<Osc1ToChuck[]>([]);
    const winFuncEnvFinalHelper = useRef<any>({
        osc1: {
            attackTime: 16,
            releaseTime: 16,
            envSetting: 0,
        },
        osc2: '',
        stk1: '',
        sampler: '',
        audioIn: '',
    });
    const powerADSRFinalHelper = useRef<any>({
        osc1: {
            attackTime: 1000,
            attackCurve: 0.5,
            decayTime: 1000,
            decayCurve: 1.25,
            sustainLevel: 0.5,
            releaseTime: 1000,
            releaseCurve: 1.5,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const expEnvFinalHelper = useRef<any>({
        osc1: {
            T60: 3,
            radius: 0.995,
            value: 0,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });  
    const wpDiodeLadderFinalHelper = useRef<any>({
        osc1: {
            cutoff: 1,
            resonance: 17,
            nlp_type: 1,
            nonlinear: 0,
            saturation: 0.1
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const wpKorg35FinalHelper = useRef<any>({
        osc1: {
            cutoff: 1,
            resonance: 2,
            nonlinear: 0,
            saturation: 0.1
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const modulateFinalHelper = useRef<any>({
        osc1: {
            vibratoRate: 6.0,
            vibratoGain: 0.2,
            randomGain: 0.2,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const delayFinalHelper = useRef<any>({
        osc1: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const delayAFinalHelper = useRef<any>({
        osc1: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const delayLFinalHelper = useRef<any>({
        osc1: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const expDelayFinalHelper = useRef<any>({
        osc1: {
            ampcurve: 2.0,
            durcurve: 2.0,
            delay: 0,
            mix: 0.5,
            reps: 4,
            gain: 1.0,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const ellipticFinalHelper = useRef<any>({
        osc1: {
            filterLow: 500,
            filterMid: 600,
            filterHigh: 650,
            atten: 80.0,
            ripple: 10.0,
            filterMode:0
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });
    const spectacleFinalHelper = useRef<any>({
        osc1: {
            bands: 5,
            delay: 3,
            eq: 0,
            feedback: 0,
            fftlen: 3,
            freqMax: 4100,
            freqMin: 100,
            mix: 0.8,
            overlap: 3,
            table: 2,
        },
        osc2: {},
        stk1: {},
        sampler: {},
        audioIn: {},
    });

    const finalSamplerFxStringToChuck = useRef<Osc1ToChuck[]>([]);


    

    const [windowWidth, setWindowWidth] = useState<any>(0);
    const [windowHeight, setWindowHeight] = useState<any>(0);
    
    // currentFX are the ones we are actively editing
    const currentFX = useRef<any>();

    const uploadedFilesToChuckString = useRef<any>('');
    const uploadedFilesCodeString = useRef<string>('');

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

    const finalOsc1Obj = useRef<any>({});
    
    // CURRENT EFFECTS LIST SHOULD PERTAIN TO SCREENS / KNOBS!!!! TODO: CLARIFY NAMING HERE!!!!
    const visibleFXKnobs = useRef<Array<any>>();
    

    const blobURLRef = useRef<any>();


    const testArrBuffFile = useRef<any>();

    const onSubmit = async(files: any) => {
        const file = files.file[0];
        const fileName = file.name;
        const fileDataBuffer: any = await file.arrayBuffer();
        const fileData: any = new Uint8Array(fileDataBuffer);
        const blob = new Blob([fileDataBuffer], {type: "audio/wav"});
        testArrBuffFile.current = fileData;
        const fileBlob = new File( [ blob ], `${file.name.replace(' ','_')}`, { type: "audio/wav"} );
        let arrayBuffer;
        const fileReader = new FileReader();
        fileReader.onload = async function(event: any) {
            arrayBuffer = event.target.result;         
            const formattedName = file.name.replaceAll(' ','_').replaceAll('-','');
            if (filesToProcess.current.map((i:any) => i.name).indexOf(fileName) === -1) {
                filesToProcess.current.push({'name': formattedName, 'data': fileData, 'processed': false})
            }
            // const formData = new FormData();
            // const eightBit: any = new Uint8Array(arrayBuffer) 
            // formData.append(formattedName, eightBit)
            // if (filesToProcess.current.indexOf(formattedName) === -1) {
            //     filesToProcess.current.push(formattedName);
            // }
        }
        fileReader.readAsArrayBuffer(fileBlob);     
    }


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
            currentScreen.current = '';
            updateCurrentFXScreen();
        }

        const gotFX: any = fxFX.current.length > 0 && fxFX.current.filter((fx: any) => fx.visible === true && fx);

        const theFXIdx = gotFX.length > 0 && gotFX.map((f: any) => f.var).indexOf(selectedEffect.current) >= 0 
        ? 
            gotFX.map((f: any) => f.var).indexOf(selectedEffect.current) 
        : 
            gotFX.length - 1;
        // console.log(`theFXIdx ${theFXIdx}`)
        visibleFXKnobs.current = !currentFX.current.presets 
            ? 
                currentFX.current.length > 0 || visibleFXKnobs.current && gotFX
                ?
                Object.values(gotFX[theFXIdx]) && Object.values(gotFX[theFXIdx].presets).map((f: any) => [f.label, f])
                :
                    Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]) 
            : (stkValsRef.current.length > 1 && currentScreen.current === 'stk2')
                ? 
                    Object.values(stkFX2.current.presets).map((i:any) => [i.label, i])
                : 
                    Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]) 
               
    
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


    const updateStkKnobs = (knobVals: STKOption[]) => {
        stkValsRef.current = [];
        console.log("WHAT ARE KNOBVALS? ", stkValsRef.current);
        if (knobVals[0] && Object.values(knobVals[0]).length > 0 && knobVals.length > 1) {
            knobVals.map(
                // (kv: any) => {
                    (kv:any) => { 
                        stkValsRef.current.push(kv);
                    // }
                })
        
        } else {
            knobVals.forEach((kv:any) => { 
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

    const handleReturnToSynth = () => {
        doReturnToSynth.current = true;
        updateCurrentFXScreen();
    }

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
        } else if (currentScreen.current === '') {
            // currentScreen.current = 'stk';
            if (doReturnToSynth.current === true) {
            // currentFX.current = moogGrandmotherEffects.current;
            // visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
            currentScreen.current = 'synth';
            currentFX.current = []; 
            currentFX.current = moogGrandmotherEffects.current;
            fxFX.current = [];
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
            doReturnToSynth.current = false;
            setFxKnobsCount(visibleFXKnobs.current.length);  
            doReturnToSynth.current = false; 
            }             
        }
  
// tk
        if (currentScreen.current === 'synth') {
            try {
                stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
                currentFX.current = stkFX.current;
                currentScreen.current = 'stk';
                visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i:any) => [i.label, i]);
            } catch (e: any) {}
        } 
        else if (currentScreen.current === '') {

            if (doReturnToSynth.current === true) {
                currentScreen.current = 'synth';
                currentFX.current = []; 
                currentFX.current = moogGrandmotherEffects.current;
                fxFX.current = [];
                visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i:any) => [i.label, i]);
                doReturnToSynth.current = false;
            }
        }
        else if (currentScreen.current === 'stk' || currentScreen.current === 'fx_') {
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
        // TODO hate this lack of clarity right here.... fix it.
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
        // ***********************************

        Object.values(stkFX.current.presets).map((preset: any) => {
            console.log('STK PRESET: ', preset); // preset.name
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

    const formerValSub = useRef<string>('');

    const winFuncString = (source: string, attackDenom: number, releaseDenom: number, envSetting: string) => `winfuncenv_${source}.set${envSetting}(); for (int i; i < 250; i++) { spork ~ playWindow(winfuncenv_${source}, whole/${attackDenom}, whole/${releaseDenom}); }`;

    const powerADSRString = (source: string, attackTime: number, attackCurve: number, decayTime: number, decayCurve: number, sustainLevel: number, releaseTime: number, releaseCurve: number) => `

        fun void playPowerADSRWindow(PowerADSR @ win, dur attackTime, float attackCurve, dur decayTime, float decayCurve, float sustainLevel, dur releaseTime, float releaseCurve) {
            win.set(attackTime, decayTime, sustainLevel, releaseTime);
            win.setCurves(attackCurve, decayCurve, releaseCurve);
            while (true) {
                win.keyOn();
                attackTime => now;
                win.keyOff();
                releaseTime => now;
            }
        }
        spork ~ playPowerADSRWindow(poweradsr_${source}, ${attackTime}::ms, ${attackCurve}, ${decayTime}::ms, ${decayCurve}, ${sustainLevel}, ${releaseTime}::ms, ${releaseCurve});

    `;

    const expEnvString = (source: string, T60: number, radius: number, value: number) => `

        fun void playExpEnvWindow(ExpEnv @ win, dur T60, float radius, dur value) {
            radius => win.radius;    
            T60 => win.T60; 
            1 => win.keyOn; 
            value => now;
            while (1)  {
                1.0 => win.gain;
                1 => win.keyOn;
                value => now;
            }
        }
        spork ~ playExpEnvWindow(expenv_${source}, whole/${Math.pow(2, T60)}, ${radius}, whole/${Math.pow(2,value)});
    `;

    const wpDiodeLadderString = (source: string, cutoff: number, resonance: number, nlp_type: number, nonlinear: number, saturation: number) => {
        const nlp_str = nlp_type === 1 ? 'true' : 'false';
        const nonlinear_str = nonlinear === 1 ? 'true' : 'false';
        return `
        fun void playWpDiodeLadderWindow(WPDiodeLadder @ win, float cutoff, int resonance, int nlp_type, int nonlinear, float saturation) {
            saw2 => blackhole;
            SinOsc sinb => blackhole;
      
            0.04 => saw2.gain;
            40 => saw2.freq;
            cutoff => sinb.freq;
            // 0.0125 => sinb.freq;
            resonance => win.resonance;
            nonlinear => win.nonlinear;
            nlp_type => win.nlp_type;
            saturation => win.saturation;
            
            0.3 => win.gain;

            while(true){
                4 * sinb.last() => saw2.freq;
                40 + (Math.pow((sinb.last())/2.0,2) * (resonance * 1000)) => win.cutoff;
                1::samp => now;
            }
        }
   
        spork ~ playWpDiodeLadderWindow(wpdiodeladder_${source}, ${cutoff}, ${resonance}, ${nlp_str}, ${nonlinear_str}, ${saturation});
    `};

    const wpKorg35String = (source: string, cutoff: number, resonance: number, nonlinear: number, saturation: number) => {
        const nonlinear_str = nonlinear === 1 ? 'true' : 'false';
      
        return `
        fun void playWpKorg35Window(WPKorg35 @ win, float cutoff, int resonance, int nonlinear, float saturation) {
            saw2 => blackhole;
            SinOsc sinb => blackhole;
      
            0.004 => saw2.gain;
            40 => saw2.freq;
            cutoff => sinb.freq;
            // 0.0125 => sinb.freq;
            resonance => win.resonance;
            nonlinear => win.nonlinear;
            saturation => win.saturation;
            
            0.1 => win.gain;

            while(true){
                4 * sinb.last() => saw2.freq;
                40 + (Math.pow((sinb.last())/2.0,2) * (resonance * 1000)) => win.cutoff;
                1::samp => now;
            }
        }
   
        spork ~ playWpKorg35Window(wpkorg35_${source}, ${cutoff}, ${resonance}, ${nonlinear_str}, ${saturation});
        `
    };

    const modulateString = (source: string, vibratoRate: number, vibratoGain: number, randomGain: number) => {
        console.log('#### ', source, vibratoRate, vibratoGain, randomGain);
        
        return `

        fun void playModWindow(Modulate @ win, float vibratoRate, float vibratoGain, float randomGain) {
            // multiply
            3 => hpf.op;
    
            // set freq
            // 220 => testSin.freq;
    
            // set rate in hz
            win.vibratoRate( vibratoRate );
            // set gain
            win.vibratoGain( vibratoGain );
            // set random gain
            win.randomGain( randomGain );
    
            // infinite time loop
            while( true )
            {
                1::second => now;
            }
        }
        spork ~ playModWindow(mod_${source}, ${vibratoRate}, ${vibratoGain}, ${randomGain});




        `;
    };

    const ellipticString = (source: string, filterLow: number, filterMid: number, filterHigh: number, atten: number, ripple: number, filterMode: number) => {
        console.log('get elliptic vals: ', source, filterLow, filterMid, filterHigh, ripple, atten, filterMode);
        return `
        fun void playEllipticWindow(Elliptic @ win, float lower, float middle, float upper, float atten, float ripple, int filterMode) {
            
            atten => win.atten;
            ripple => win.ripple;

            if (filterMode == 0) {
                win.bpf(upper,middle,lower);
            } else if (filterMode == 1) {
                win.lpf(lower, upper);
            } else if (filterMode == 2) {
                win.hpf(upper, lower);
            }
            2 :: second => now;
        }
        spork ~ playEllipticWindow(elliptic_${source}, ${filterLow}, ${filterMid}, ${filterHigh}, ${atten}, ${ripple}, ${filterMode});
        `;
    }

    const delayString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        return `
        fun void playDelayWindow(Delay @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            for (0 => int i; i < ${lines}; i++) 
            { 
                hpf => win[i] => dac;  
                win[i] => OneZero filter_delay_${source} => win[i]; 
                zero => filter_delay_${source}.zero;
                b0 => filter_delay_${source}.b0;
                b1 => filter_delay_${source}.b1;
                0.6 => win[i].gain; 
                // (((1 + i*0.3) * 1000)) :: ms => win[i].max => win[i].delay;
                ((whole)/((syncDelay/${numeratorSignature}) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
                
            }
        }
        spork ~ playDelayWindow(delay_${source}, ${delay}, ${lines}, ${convertedSyncDelay }, ${zero}, ${b0}, ${b1});
        `;
    };

    const delayAString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        return `
        fun void playDelayAWindow(DelayA @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            for (0 => int i; i < ${lines}; i++) 
            { 
                hpf => win[i] => dac;  
                win[i] => OneZero filter_delayA_${source} => win[i]; 
                zero => filter_delayA_${source}.zero;
                b0 => filter_delayA_${source}.b0;
                b1 => filter_delayA_${source}.b1;
                0.6 => win[i].gain; 
                // (((1 + i*0.3) * 1000)) :: ms => win[i].max => win[i].delay;
                ((whole)/((syncDelay/${numeratorSignature}) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
            }
        }
        spork ~ playDelayAWindow(delayA_${source}, ${delay}, ${lines}, ${convertedSyncDelay }, ${zero}, ${b0}, ${b1});
        `;
    };

    const delayLString = (source: string, delay: number,lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        return `
        fun void playDelayLWindow(DelayL @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            for (0 => int i; i < ${lines}; i++) 
            { 
                hpf => win[i] => dac;  
                win[i] => OneZero filter_delayL_${source} => win[i];
                zero => filter_delayL_${source}.zero;
                b0 => filter_delayL_${source}.b0;
                b1 => filter_delayL_${source}.b1;
                0.6 => win[i].gain; 
                // (((1 + i*0.3) * 1000)) :: ms => win[i].max => win[i].delay;
                ((whole)/((syncDelay/${numeratorSignature}) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
            }
        }
        spork ~ playDelayLWindow(delayL_${source}, ${delay}, ${lines}, ${convertedSyncDelay }, ${zero}, ${b0}, ${b1});
        `;
    };

    const expDelayString = (source: string, ampcurve: number, durcurve: number, delay: number, mix: number, reps: number, gain: number) => {
        const convertedSyncDelay = Math.pow(2,delay)
        return `
        fun void playExpDelayWindow(ExpDelay @ win, float ampcurve, float durcurve, float delay, float mix, int reps, float gain) {

            while (true)
            {
                whole/delay => win.max => win.delay;

                reps * 0.7 => win.gain;
                durcurve => win.durcurve;
                ampcurve => win.ampcurve;
                reps => win.reps;
                
                6000::ms => now;
            }
        }
        spork ~ playExpDelayWindow(expDelay_${source}, ${ampcurve}, ${durcurve}, ${convertedSyncDelay}, ${mix}, ${reps}, ${gain});
        `;
    };

    const spectacleString = (source: string, bands: number, delay: number, eq: number, feedback: number, fftlen: number, freqMax: number, freqMin: number, mix: number, overlap: number, table: number) => {
        const convertedFFT = Math.pow(2, fftlen);
        const convertedBands = Math.pow(2, bands);
        const convertedDelay = Math.pow(2, bands);
        return `
        fun void playSpectacleWindow(Spectacle @ win, int bands, float delay, float eq, float feedback, int fft, float freqMax, float freqMin, float mix, int overlap, int table) {
            
            0.8 => win.mix;
            win.range(freqMin,freqMax);
            bands => win.bands; 

            1.3 => win.gain;

            if (table == 0) {
                win.table("delay", "descending");
            } else if (table == 1) {
                win.table("eq", "descending");
            } else if (table == 2) {
                win.table("feedback", "descending");
            } else if (table == 3) {
                win.table("delay", "random");
            } else if (table == 4) {
                win.table("eq", "random");
            } else if (table == 5) {
                win.table("feedback", "random");
            } else if (table == 6) {
                win.table("delay", "ascending");
            } else if (table == 7) {
                win.table("eq", "ascending");
            } else if (table == 8) {
                win.table("feedback", "ascending");
            }

            whole * delay => now;
            eq => win.eq;
            feedback => win.feedback;
        }
        spork ~ playSpectacleWindow(spectacle_${source}, ${convertedBands}, ${convertedDelay}, ${eq}, ${feedback}, ${convertedFFT}, ${freqMax}, ${freqMin}, ${mix}, ${overlap}, ${table});
        `;
        
    };

    const osc1FXToString = () => {
    
        // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
        // =================================================================
        Object.values(allFxPersistent.current.Osc1).map((o1: any) => {
            if (osc1FXStringToChuck.current.indexOf(`${o1.var}_o1`) === -1) {
                if (o1.type === "PitchTrack") {
                    if (osc1FxStringToChuckNeedsBlackhole.current.map((i:any) => i.name).indexOf(`${o1.var}`) === -1) {  
                        osc1FxStringToChuckNeedsBlackhole.current.push({name: `${o1.var}`, string: `=> ${o1.type} ${o1.var}_o1 => blackhole;`});
                    }
                    return;
                } else if (o1.type === "WinFuncEnv") {
                    osc1WinEnvOn.current = true;
                 } else if (o1.type === "PowerADSR") {
                    osc1PowerADSROn.current = true;
                 } else if (o1.type === "ExpEnv") {
                    osc1ExpEnvOn.current = true;
                 } else if (o1.type === "WPDiodeLadder") {
                    osc1WPDiodeLadderOn.current = true;
                 } else if (o1.type === "WPKorg35") {
                    osc1WPKorg35On.current = true;
                 } else if (o1.type === "Modulate") {
                    osc1ModulateOn.current = true;
                 } else if (o1.type === "Delay") {
                    osc1DelayOn.current = true;
                 } else if (o1.type === "DelayA") {
                    osc1DelayAOn.current = true;
                 } else if (o1.type === "DelayL") {
                    osc1DelayLOn.current = true;
                 } else if (o1.type === "ExpDelay") {
                    osc1ExpDelayOn.current = true;
                 } else if (o1.type === "Elliptic") {
                    osc1EllipticOn.current = true;
                 } else if (o1.type === "Spectacle") {
                    osc1SpectacleOn.current = true;
                 }
                
                // TODO => Basic Implementation of Sampler Interface / Play Logic
                // TODO => All of SndBuf Implementation
                // TODO => All of Lisa (do we want Stereo or even Lisa10 => Sampler Mixer when patterns are done?)
                // TODO => All of Sigmund
                // TODO => All of Autotune (PitchTrack implelementation)
                // TODO => All of the Gains & Note Swells (create a mixer W PANNING!??)
                // TODO => Add other Osc Ugens to Synthvoice
                // TODO => All of UAna Generics for Analysis Blobs

                // AFTER ALL OF THIS, WE CAN LEVEL OUT (OR MAKE FACTORY OF FX CODE FOR ALL SOURCES)
                // THEN WE DO A FINAL TEST AND MOVE ON TO PATTERNS / NOTES
                 
                 else {
                    osc1FXStringToChuck.current = osc1FXStringToChuck.current.concat(`=> ${o1.type} ${o1.var}_o1 `)
                }
            }
    
            // THIS FIRST OBJECT MAPPING HANDLES OSC1 EFFECTS CODE
            // =================================================================
            Object.values(o1.presets).length > 0 && Object.values(o1.presets).map(async(preset: any, idx: number) => {
           
                // ******** TODO change to read type directly from o1.type
                if (preset.type.includes("_needsFun")) {
                    if (preset.type.includes("_winFuncEnv")) {
                        if (preset.name === "attackTime") {
                            winFuncEnvFinalHelper.current.osc1.attackTime = Math.pow(2, Number(preset.value));
                        } else if (preset.name === "releaseTime") {
                            winFuncEnvFinalHelper.current.osc1.releaseTime = Math.pow(2, Number(preset.value));
                        } else if (preset.name === "envSetting") {
                            winFuncEnvFinalHelper.current.osc1.envSetting = convertEnvSetting(preset.value);
                        } else {
                        }   
                    }
                    if (preset.type.includes("_powerADSR")) {
                        // add quantization / feedback etc later
                        if (preset.name === "attackTime") {
                            powerADSRFinalHelper.current.osc1.attackTime = preset.value;
                        } else if (preset.name === "attackCurve") {
                            powerADSRFinalHelper.current.osc1.attackCurve = preset.value;
                        } else if (preset.name === "releaseTime") {
                            powerADSRFinalHelper.current.osc1.releaseTime = preset.value;
                        } else if (preset.name === "releaseCurve") {
                            powerADSRFinalHelper.current.osc1.releaseCurve = preset.value;
                        }
                    }
                    if (preset.type.includes("_expEnv")) {
                        if (preset.name === "T60") {
                            expEnvFinalHelper.current.osc1.T60 = preset.value;
                        } else if (preset.name === "radius") {
                            expEnvFinalHelper.current.osc1.radius = preset.value;
                        } else if (preset.name === "value") {
                            expEnvFinalHelper.current.osc1.value = preset.value;
                        }
                    }
                    if (preset.type.includes("_diodeladder")) {
                        if (preset.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.osc1.cutoff = preset.value;
                        } else if (preset.name === "nlp_type") {
                            wpDiodeLadderFinalHelper.current.osc1.nlp_type = preset.value;
                        } else if (preset.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.osc1.nonlinear = preset.value;
                        } else if (preset.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.osc1.saturation = preset.value;
                        } else if (preset.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.osc1.resonance = preset.value;
                        }
                    }
                    if (preset.type.includes("_wpkorg35")) {
                        if (preset.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.osc1.cutoff = preset.value;
                        } else if (preset.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.osc1.resonance = preset.value;
                        } else if (preset.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.osc1.nonlinear = preset.value;
                        } else if (preset.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.osc1.saturation = preset.value;
                        }
                    }
                    if (preset.type.includes("mod")) {
                        if (preset.name === "vibratoRate") {
                            modulateFinalHelper.current.osc1.vibratoRate = preset.value;
                        } else if (preset.name === "vibratoGain") {
                            modulateFinalHelper.current.osc1.vibratoGain = preset.value;
                        } else if (preset.name === "randomGain") {
                            modulateFinalHelper.current.osc1.randomGain = preset.value;
                        }
                    }
                    if (o1.type === "Delay") {
                        if (preset.name === "delay") {
                            delayFinalHelper.current.osc1.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayFinalHelper.current.osc1.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayFinalHelper.current.osc1.syncDelay = preset.value;
                        }
                    }
                    if ((o1.type === "DelayA")) {
                        if (preset.name === "delay") {
                            delayAFinalHelper.current.osc1.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayAFinalHelper.current.osc1.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayAFinalHelper.current.osc1.syncDelay = preset.value;
                        }
                    }
                    if ((o1.type === "DelayL")) {
                        if (preset.name === "delay") {
                            delayLFinalHelper.current.osc1.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayLFinalHelper.current.osc1.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayLFinalHelper.current.osc1.syncDelay = preset.value;
                        }
                    }
                    if (o1.type === "ExpDelay") {
                        if (preset.name === "ampcurve") {
                            expDelayFinalHelper.current.osc1.ampcurve = preset.value;
                        } else if (preset.name === "durcurve") {
                            expDelayFinalHelper.current.osc1.durcurve = preset.value;
                        } else if (preset.name === "delay") {
                            delayLFinalHelper.current.osc1.delay = preset.value;
                        } else if (preset.name === "mix") {
                            expDelayFinalHelper.current.osc1.mix = preset.value;
                        } else if (preset.name === "reps") {
                            expDelayFinalHelper.current.osc1.reps = preset.value;
                        } 
                    } 
                    if (o1.type === "Elliptic") {
                        if (preset.name === "lowFilter") {
                            ellipticFinalHelper.current.osc1.lowFilter = preset.value;
                        } else if (preset.name === "midFilter") {
                            ellipticFinalHelper.current.osc1.midFilter = preset.value;
                        } else if (preset.name === "highFilter") {
                            ellipticFinalHelper.current.osc1.highFilter = preset.value;
                        } else if (preset.name === "atten") {
                            ellipticFinalHelper.current.osc1.atten = preset.value;
                        } else if (preset.name === "ripple") {
                            ellipticFinalHelper.current.osc1.ripple = preset.value;
                        } else if (preset.name === "filterMode") {
                            ellipticFinalHelper.current.osc1.filterMode = preset.value;
                        } 
                    }
                    if (o1.type === "Spectacle") {
                        console.log('OY PREET ', preset)
                        if (preset.name === "bands") {
                            spectacleFinalHelper.current.osc1.bands;
                        } else if (preset.name === "delay") {
                            spectacleFinalHelper.current.osc1.delay;
                        } else if (preset.name === "eq") {
                            spectacleFinalHelper.current.osc1.eq;
                        } else if (preset.name === "feedback") {
                            spectacleFinalHelper.current.osc1.feedback;
                        } else if (preset.name === "fftlen") {
                            spectacleFinalHelper.current.osc1.fftlen;
                        } else if (preset.name === "freqMax") {
                            spectacleFinalHelper.current.osc1.freqMax;
                        } else if (preset.name === "freqMin") {
                            spectacleFinalHelper.current.osc1.freqMin;
                        } else if (preset.name === "mix") {
                            spectacleFinalHelper.current.osc1.mix;
                        } else if (preset.name === "overlap") {
                            spectacleFinalHelper.current.osc1.overlap;
                        } else if (preset.name === "table") {
                            spectacleFinalHelper.current.osc1.table;
                        } 
                    }

                    else {
                        // alert('in the else!')
                    }
                } else {
                    const addDurMs = preset.type.indexOf('dur') !== -1 ? '::ms' : '';
                    let formattedValue: any = preset.type.indexOf('dur') !== -1 ? `${preset.value}${addDurMs}`: `${preset.value}`;

                    if (osc1FXString.current !== '') {
                        if (finalOsc1FxStringToChuck.current.map((osc: any) => osc.name).indexOf(preset.name) !== -1) {
                            const theIndex = finalOsc1FxStringToChuck.current.map((osc: any) => osc.name).indexOf(preset.name);
                            finalOsc1FxStringToChuck.current[theIndex].string = `${formattedValue} => ${o1.var}_o1.${preset.name};`;
                        } 
                        else {    
                            finalOsc1FxStringToChuck.current.push({name: preset.name, string: `${formattedValue} => ${o1.var}_o1.${preset.name};`}); 
                        }
                    } else {
                        osc1FXString.current = `${formattedValue} => ${o1.var}_o1.${preset.name};`;
                    }
                    console.log('%cCHECK OSC1 STRING CURRENT: ', 'color: aqua;', osc1FXString.current);
                }
            });
        });
    }

    const osc2FXToString = () => {
        Object.values(allFxPersistent.current.Osc2).map((o2: any) => {
            if (osc2FXStringToChuck.current.indexOf(`${o2.var}_o2`) === -1) {
                osc2FXStringToChuck.current = osc2FXStringToChuck.current.concat(`=> ${o2.type} ${o2.var}_o2 `)
            }
            Object.values(o2.presets).length > 0 && Object.values(o2.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (osc2FXString.current && osc2FXString.current.indexOf(`${o2.var}_o2.${preset.name};`) !== -1);
                osc2FXString.current = !alreadyInChuckDynamicScript ? `${osc2FXString.current} ${preset.value} => ${o2.var}_o2.${preset.name};` : `${preset.value} => ${o2.var}_o2.${preset.name}; `;
                console.log('CHECK OSC2 STRING CURRENT: ', osc2FXString.current);
            });
        });
    }

    const audioInFXToString = () => {
        Object.values(allFxPersistent.current.AudioIn).map((aIn: any) => {
            if (audioInFXStringToChuck.current.indexOf(`${aIn.var}_aIn`) === -1) {
                audioInFXStringToChuck.current = audioInFXStringToChuck.current.concat(`=> ${aIn.type} ${aIn.var}_aIn `)
            }
            Object.values(aIn.presets).length > 0 && Object.values(aIn.presets).map((preset: any) => {
                const alreadyInChuckDynamicScript: boolean = (audioInFXString.current && audioInFXString.current.indexOf(`${aIn.var}_aIn.${preset.name};`) !== -1);
                audioInFXString.current = audioInFXString.current && !alreadyInChuckDynamicScript ? `${audioInFXString.current} ${preset.value} => ${aIn.var}_aIn.${preset.name};` : `${preset.value} => ${aIn.var}_aIn.${preset.name}; `;
                console.log('CHECK Audio In STRING CURRENT: ', audioInFXString.current);
            });
        });
    }

    const samplerFXToString = () => {
        Object.values(allFxPersistent.current.Sampler).map((s1: any) => {
            if (samplerFXStringToChuck.current.indexOf(`${s1.var}_s1`) === -1) {
                samplerFXStringToChuck.current = samplerFXStringToChuck.current.concat(`=> ${s1.type} ${s1.var}_s1 `)
            }
            
            Object.values(s1.presets).length > 0 && Object.values(s1.presets).map((preset: any, idx: number) => {
                const addDurMs = preset.type.indexOf('dur') !== -1 ? '::ms' : '';
                const formattedValue: any = preset.type.indexOf('dur') !== -1 ? `${parseInt(preset.value)}${addDurMs}`: `${preset.value}`;
                // const thePreset: any = Object.values(s1.presets)[idx];
                if (samplerFXString.current !== '') {
                    if (finalSamplerFxStringToChuck.current.map((samp: any) => samp.name).indexOf(preset.name) !== -1) {
                        const theIndex = finalSamplerFxStringToChuck.current.map((samp: any) => samp.name).indexOf(preset.name);
                        finalSamplerFxStringToChuck.current[theIndex].string = `${formattedValue} => ${s1.var}_s1.${preset.name};`;
                    } else {
                        finalSamplerFxStringToChuck.current.push({name: preset.name, string: `${formattedValue} => ${s1.var}_s1.${preset.name};`}); 
                    }
                    samplerFXString.current.indexOf(`${formattedValue} => ${s1.var}_s1.${preset.name};`)
                    const t: string = samplerFXString.current;
                    const sub =  ` => ${s1.var}_s1.${preset.name};`;
                    let lastIndexOfValue: any = t.indexOf(sub);
                    const lastCharOfVal = t[lastIndexOfValue];
                    
                    formerValSub.current = lastCharOfVal;
                    console.log('FORMER VAL SUB: ', formerValSub.current);
                    let chartWindowIndex: any;
                    const readBackwards = samplerFXString.current[lastIndexOfValue - 1] && setInterval(() => {
                        formerValSub.current = formerValSub.current + (osc1FXString.current[lastIndexOfValue])
                        if (lastIndexOfValue && samplerFXString.current && samplerFXString.current[lastIndexOfValue] === ' ') {
                            clearInterval(readBackwards);
                            return;
                        }
                        chartWindowIndex = chartWindowIndex - 1;
                    }, 0);
                    const fullPriorString = `${formerValSub.current}${sub}`;
                    samplerFXString.current.indexOf(fullPriorString) !== -1 && samplerFXString.current.replace(fullPriorString, samplerFXString.current = `${formattedValue} => ${s1.var}_s1.${preset.name};`);
                } else {
                    samplerFXString.current = `${formattedValue} => ${s1.var}_s1.${preset.name};`;
                }
                console.log('CHECK OSC1 STRING CURRENT: ', samplerFXString.current);
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

    const shredCount = useRef<number>(0);

    const runMainChuckCode = async (aChuck: Chuck, getStk1String: any) => {
        if (chuckUpdateNeeded === false) {
            shredCount.current = await aChuck.runCode(`Machine.numShreds();`);

            filesToProcess.current.map((f: any, idx: number)  => {
                if (f.processed === false) {
                    aChuck.createFile("", f.name, f.data);
                    alert(`${f.name} created`);
                    f.processed = true;
                    uploadedFilesToChuckString.current = uploadedFilesToChuckString.current.concat(`SndBuf buf_${idx} => dac; `); // f.name.split('.')[0]
                    uploadedFilesCodeString.current = uploadedFilesCodeString.current.concat(`"${f.name}" => buf_${idx}.read; `); // f.name.split('.')[0]
                }
            });

            const connector1Stk = getStk1String.length ? `=> ${getStk1String[1]} ${getStk1String[2]}` : '';
            // const connector2Stk = getStk2String.length ? `=> ${getStk2String[1]} ${getStk2String[2]}` : '';
            
            const connectorStk1DirectToDac = getStk1String && useStkDirect ? `${getStk1String[2]} => WinFuncEnv winfuncenv_stk1 => dac; winfuncenv_stk1.setHann(); for (int i; i < 250; i++) { spork ~ playWindow(winfuncenv_stk1, whole/${16}, whole/${16}); }` : ``;

            const winFuncDeclarationOsc1 = osc1WinEnvOn.current ? ' WinFuncEnv winfuncenv_o1 =>' : '';
            const powerADSRDeclarationOsc1 = osc1PowerADSROn.current ? ' PowerADSR poweradsr_o1 =>' : '';
            const expEnvDeclarationOsc1 = osc1ExpEnvOn.current ? ' ExpEnv expenv_o1 =>': '';
            const wpDiodeLadderDeclarationOsc1 = osc1WPDiodeLadderOn.current ? ' WPDiodeLadder wpdiodeladder_o1 =>': '';
            const WPKorg35DeclarationOsc1 = osc1WPKorg35On.current ? 'saw2 => WPKorg35 wpkorg35_o1 => dac;' : '';
            const modulateDeclarationOsc1 = osc1ModulateOn.current ? 'hpf => Modulate mod_o1 => dac;' : '';
            const ellipticDeclarationOsc1 = osc1EllipticOn.current ? ' Elliptic elliptic_o1 =>' : '';
            const delayDeclarationOsc1 = osc1DelayOn.current ? `Delay delay_o1[${delayFinalHelper.current.osc1.delay}];` : '';
            const delayADeclarationOsc1 = osc1DelayAOn.current ? `DelayA delayA_o1[${delayAFinalHelper.current.osc1.delay}];`  : '';
            const delayLDeclarationOsc1 = osc1DelayLOn.current ? `DelayL delayL_o1[${delayLFinalHelper.current.osc1.delay}];`  : '';
            const expDelayDeclarationOsc1 = osc1ExpDelayOn.current ? ' ExpDelay expDelay_o1 =>': '';
            const spectacleDeclarationOsc1 = osc1SpectacleOn.current ? ' => Spectacle spectacle_o1 ': '';
            
            const winFuncCodeStringOsc1 = osc1WinEnvOn.current ? winFuncString('o1', winFuncEnvFinalHelper.current.osc1.attackTime, winFuncEnvFinalHelper.current.osc1.releaseTime, winFuncEnvFinalHelper.current.osc1.envSetting) : '';
            const powerADSRCodeStringOsc1 = osc1PowerADSROn.current ? powerADSRString('o1', powerADSRFinalHelper.current.osc1.attackTime, powerADSRFinalHelper.current.osc1.attackCurve, powerADSRFinalHelper.current.osc1.decayTime, powerADSRFinalHelper.current.osc1.decayCurve, powerADSRFinalHelper.current.osc1.sustainLevel, powerADSRFinalHelper.current.osc1.releaseTime, powerADSRFinalHelper.current.osc1.releaseCurve) : '';
            const expEnvCodeStringOsc1 = osc1ExpEnvOn.current ? expEnvString('o1', expEnvFinalHelper.current.osc1.T60, expEnvFinalHelper.current.osc1.radius, expEnvFinalHelper.current.osc1.value) : '';
            const wpDiodeLadderCodeStringOsc1 = osc1WPDiodeLadderOn.current ? wpDiodeLadderString('o1', wpDiodeLadderFinalHelper.current.osc1.cutoff, wpDiodeLadderFinalHelper.current.osc1.resonance, wpDiodeLadderFinalHelper.current.osc1.nlp_type, wpDiodeLadderFinalHelper.current.osc1.nonlinear, wpDiodeLadderFinalHelper.current.osc1.saturation ) : '';
            const wpKorg35CodeStringOsc1 = osc1WPKorg35On.current ? wpKorg35String('o1', wpKorg35FinalHelper.current.osc1.cutoff, wpKorg35FinalHelper.current.osc1.resonance, wpKorg35FinalHelper.current.osc1.nonlinear, wpKorg35FinalHelper.current.osc1.saturation ) : '';
            const modulateCodeStringOsc1 = osc1ModulateOn.current ? modulateString('o1', modulateFinalHelper.current.osc1.vibratoRate, modulateFinalHelper.current.osc1.vibratoGain, modulateFinalHelper.current.osc1.randomGain) : '';
            const ellipticCodeStringOsc1 = osc1EllipticOn.current ? ellipticString('o1', ellipticFinalHelper.current.osc1.filterLow, ellipticFinalHelper.current.osc1.filterMid, ellipticFinalHelper.current.osc1.filterHigh, ellipticFinalHelper.current.osc1.atten, ellipticFinalHelper.current.osc1.ripple, ellipticFinalHelper.current.osc1.filterMode) : '';
            const expDelayCodeStringOsc1 = osc1ExpDelayOn.current ? expDelayString('o1', expDelayFinalHelper.current.osc1.ampcurve, expDelayFinalHelper.current.osc1.durcurve, expDelayFinalHelper.current.osc1.delay, expDelayFinalHelper.current.osc1.mix, expDelayFinalHelper.current.osc1.reps, expDelayFinalHelper.current.osc1.gain) : '';
            const spectacleCodeStringOsc1 = osc1SpectacleOn.current ? spectacleString('o1', spectacleFinalHelper.current.osc1.bands, spectacleFinalHelper.current.osc1.delay, spectacleFinalHelper.current.osc1.eq, spectacleFinalHelper.current.osc1.feedback, spectacleFinalHelper.current.osc1.fftlen, spectacleFinalHelper.current.osc1.freqMax, spectacleFinalHelper.current.osc1.freqMin, spectacleFinalHelper.current.osc1.mix, spectacleFinalHelper.current.osc1.overlap, spectacleFinalHelper.current.osc1.table) : '';

            // DELAY LINES
            const delayCodeStringOsc1 = osc1DelayOn.current ? delayString('o1', delayFinalHelper.current.osc1.delay, delayFinalHelper.current.osc1.lines, delayFinalHelper.current.osc1.syncDelay, delayFinalHelper.current.osc1.zero, delayFinalHelper.current.osc1.b0, delayFinalHelper.current.osc1.b1) : '';
            const delayACodeStringOsc1 = osc1DelayAOn.current ? delayAString('o1', delayAFinalHelper.current.osc1.delay, delayAFinalHelper.current.osc1.lines, delayAFinalHelper.current.osc1.syncDelay, delayAFinalHelper.current.osc1.zero, delayAFinalHelper.current.osc1.b0, delayAFinalHelper.current.osc1.b1) : '';
            const delayLCodeStringOsc1 = osc1DelayLOn.current ? delayLString('o1', delayLFinalHelper.current.osc1.delay, delayLFinalHelper.current.osc1.lines, delayLFinalHelper.current.osc1.syncDelay, delayLFinalHelper.current.osc1.zero, delayLFinalHelper.current.osc1.b0, delayLFinalHelper.current.osc1.b1) : '';

            ////////////////////////////

            const osc1ChuckToOutlet: string = ` SawOsc saw1 ${connector1Stk} => ${wpDiodeLadderDeclarationOsc1} LPF lpf => ADSR adsr => Dyno limiter ${osc1FXStringToChuck.current} => ${winFuncDeclarationOsc1} ${ellipticDeclarationOsc1} ${powerADSRDeclarationOsc1} ${expEnvDeclarationOsc1} ${expDelayDeclarationOsc1} outlet;`;
            
            osc1FxStringNeedsBlackhole.current = osc1FxStringToChuckNeedsBlackhole.current.length > 0 ? `voice ${osc1FxStringToChuckNeedsBlackhole.current[0].string}` : '';

            const osc2ChuckToOutlet: string = ` SawOsc saw2 => lpf;`;
            
            // const winFuncString = (source: string) => `winfuncenv_${source}.setHann(); for (int i; i < 250; i++) { spork ~ playWindow(winfuncenv_${source}, whole/${1}, whole/${1}); }`;

            const finalOsc1Code = Object.values(finalOsc1FxStringToChuck.current).length > 0 ? finalOsc1FxStringToChuck.current.map((i: any) => i.string).join(' ').replace(',','') : '';
         
            // bring back sync mode on this eventually -> // ${parseInt(moogGrandmotherEffects.current.syncMode.value)} => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;

            aChuck.runCode(`
            
            ((60.0 / ${bpm})) => float secLenBeat;
            (secLenBeat * 1000)::ms => dur beat;
            ((secLenBeat * 1000) * 2)::ms => dur whole;
            (secLenBeat * ${numeratorSignature} * ${denominatorSignature})::ms => dur bar;
             

            ${uploadedFilesToChuckString.current}
            // ${uploadedFilesCodeString.current}



            class SynthVoice extends Chugraph
                {
                    // SawOsc saw1 ${connector1Stk} => LPF lpf => ADSR adsr => Dyno limiter => outlet;
                    ${osc1ChuckToOutlet}
       
                    // saw1 ${osc1FXStringToChuck.current} => dac;
                    ${osc2ChuckToOutlet}
                    ${WPKorg35DeclarationOsc1} 
            
                    ${ellipticCodeStringOsc1}
                    ${winFuncCodeStringOsc1}
                    ${powerADSRCodeStringOsc1}
                    ${expEnvCodeStringOsc1}
                    ${wpDiodeLadderCodeStringOsc1}
                    ${wpKorg35CodeStringOsc1}
                    ${expDelayCodeStringOsc1}
                    
                    

                    // 880 => sintest.freq;
                    Noise noiseSource => lpf;
                    0 => noiseSource.gain;
                    
                    ${connectorStk1DirectToDac}
             
              
                    // ${osc1FXStringToChuck.current}
      
                                     
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

                    2 => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;

                    pitchLfo => saw1;
                    pitchLfo => saw2;
                    pitchLfo => tri1;
                    pitchLfo => tri2;
                    pitchLfo => sqr1;
                    pitchLfo => sqr2;

                    ${parseInt(moogGrandmotherEffects.current.limiterAttack.value)}::ms => limiter.attackTime;
                    ${parseFloat(moogGrandmotherEffects.current.limiterThreshold.value).toFixed(4)} => limiter.thresh;

                    0.1 => saw1.gain => saw2.gain;
                    0.45 => tri1.gain => tri2.gain;
                    0.3 => sqr1.gain => sqr2.gain;

                    10.0 => float filterCutoff;
                    filterCutoff => lpf.freq;


                    ${parseInt(moogGrandmotherEffects.current.adsrAttack.value)}::ms => adsr.attackTime;
                    ${parseInt(moogGrandmotherEffects.current.adsrDecay.value)}::ms => adsr.decayTime;
                    ${moogGrandmotherEffects.current.adsrSustain.value} => float susLevel; 
                    susLevel => adsr.sustainLevel;
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
                            adsr.releaseTime() => now;  
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

                SynthVoice voice ${osc1FXStringToChuck.current} ${spectacleDeclarationOsc1} => HPF hpf => dac;
       
                ${modulateDeclarationOsc1}
                ${modulateCodeStringOsc1}

                
                ${delayDeclarationOsc1}
                ${delayADeclarationOsc1}
                ${delayLDeclarationOsc1}

                ${delayCodeStringOsc1}
                ${delayACodeStringOsc1}
                ${delayLCodeStringOsc1}

                ${spectacleCodeStringOsc1}
                
                ${osc1FxStringNeedsBlackhole.current}

                // ${osc1FXString.current}

                ${finalOsc1Code}


                ${moogGrandmotherEffects.current.highPassFreq.value} => hpf.freq;
                
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
                ${parseInt(moogGrandmotherEffects.current.noise.value)} => voice.noise;

                0 => int count;

                 
    
        


                

                SndBuf kick => dac;
                SndBuf snare => dac;
                SndBuf cHat => dac;
                SndBuf oHat => dac;

                me.dir() + "DR-55Kick.wav" => string kickFilename;
                me.dir() + "DR-55Snare.wav" => string snareFilename;
                me.dir() + "DR-55Hat.wav" => string cHatFilename;
                me.dir() + "DR-55Pop.wav" => string oHatFilename;

                kickFilename => kick.read;
                snareFilename => snare.read;
                cHatFilename => cHat.read;
                oHatFilename => oHat.read;

                fun void SilenceAllBuffers()
                {
                    kick.samples() => kick.pos;
                    snare.samples() => snare.pos;
                    oHat.samples() => oHat.pos;
                    cHat.samples() => cHat.pos;
                }

                bar => now;

                fun void playWindow(WinFuncEnv @ win, dur attack, dur release) {
                    win.attackTime(attack);
                    win.releaseTime(release);
                    while (true) {
                        win.keyOn();
                        attack => now;
                        win.keyOff();
                        release => now;
                    }
                }

                fun void Drum(int select, dur duration)
                {
                    if(select == 0)
                    {
                        0 => kick.pos; 
                        0 => cHat.pos;
                    }
                    if(select == 1)
                    {
                        0 => oHat.pos;
                    }
                    if(select == 2)
                    {
                        0 => kick.pos; 
                        0 => cHat.pos;
                        0 => snare.pos;
                    }
                    if(select == 3)
                    {
                        0 => snare.pos;
                    }
                    duration => now;
                    SilenceAllBuffers();
                    me.exit();
                }

                SilenceAllBuffers();




                


                fun void PlaySynthNotes(int notesToPlay[], dur duration) {
                    ${parseFloat(moogGrandmotherEffects.current.env.value).toFixed(4)} => voice.env;
                    ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice.cutoffMod;

    
                    while (true) {
                        // ${parseFloat(moogGrandmotherEffects.current.env.value).toFixed(4)} => voice.env;
                        // ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice.cutoffMod;
                        count % (notesToPlay.size()) => int osc1Idx;
                        <<< notesToPlay[osc1Idx] >>>;
                        for (0 => int i; i < notesToPlay.size(); i++) {
                            if (notesToPlay[i] != -1) {
                                notesToPlay[i] + 24 => voice.keyOn;
                            }
                            duration / notesToPlay.size() => now;
                            1 => voice.keyOff;
                        }
                        duration => now;
                        1 => voice.keyOff;
                    }
                    
                }

                fun void PlaySTK(int notesToPlay[], dur duration){

                    // count % (notesToPlay.size()) => int stk1Idx;
                    while (true) {
                        count % (notesToPlay.size()) => int stk1Idx;
                      
                        for (0 => int i; i < notesToPlay.cap(); i++) {
                            <<< notesToPlay[i] >>>;
                            if (notesToPlay[i] != -1) {
                                notesToPlay[i] + 24 => voice.stk1;
                            }
                            duration / notesToPlay.size() => now;
                        }
                    }
                }

                
                fun void PlaySamples(string codeString) {
                    ${uploadedFilesCodeString.current}
                }

                fun void PlaySamplePattern(int samplesArrayPos, int notesToPlay[], dur duration) {                
                    // count % (notesToPlay.size()) => int sampler1Idx;
                    
                    <<< samplesArrayPos >>>;
                    while (true) {
                        count % (notesToPlay.size()) => int sampler1Idx;
                        for (0 => int i; i < notesToPlay.size(); i++) {
                            <<< "NOTE!!! ", notesToPlay[i] >>>;
                            spork ~ Drum(notesToPlay[i], duration);
                            duration/notesToPlay.size() => now;
                        }   
                    }
                }

                [1] @=> int notes[];
                [1,3,3,1] @=> int sample1Notes[];
                [1, 4, 1, 3] @=> int sample2Notes[];
                [1,4] @=> int sample3Notes[];
                [1,-1,4,-1,5,-1] @=> int stkNotes[];

                            
                  
                <<< count >>>; 
                spork ~ PlaySTK(stkNotes, whole);           
                
                // spork ~ PlaySamplePattern(0, sample1Notes, whole);
                // spork ~ PlaySamplePattern(0, sample2Notes, whole);
                
                spork ~ PlaySynthNotes(notes, whole);
                
                // spork ~ playWindow(winfuncenv_o1, whole/2, whole/2);
                                        
                while(${!chuckUpdateNeeded}) {
                    
                    beat => now; 
                    // 1 => voice.keyOff;
                    <<< "****** ", Machine.numShreds() >>>;
                    count++;
         
                }  
                          
            `);

        } else {
            aChuck.runCode(`Machine.removeAllShreds();`);
            aChuck.runCode(`Machine.resetShredID();`);
            const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            console.log('Shred Count in ELSE: ', await shredCount);
            setChuckUpdateNeeded(false);
        }
    }


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
                    shredCount.current = await aChuck.runCode(`Machine.numShreds();`);
                    console.log('shred count!!!: ', shredCount);
                    if (shredCount.current > 4) {
           
                    }
                })
            }
        }
        
        console.log("running chuck now... ", chuckUpdateNeeded);
        // console.log("CHECK CURRENT FX ************** ", currentFX.current);

        const buffersToChuck: any = {};

        console.log('fucking kill me: ', osc1FXString.current.length);

        const uploadedFilesArrsGenericCode: any = {};
        console.log('GETTING FILES TO PROCESS? ', filesToProcess.current);
        filesToProcess.current.forEach(async(name: any) => {
            console.log("##### ", name);
        });

        Object.keys(uploadedFilesArrsGenericCode).forEach((buf: any, idx: number) => {
            if (idx !== Object.keys(uploadedFilesArrsGenericCode).length - 1) {
                filesChuckToDac.current = filesChuckToDac.current + `SndBuf buffer_${buf} => `;
            } else {
                filesChuckToDac.current = filesChuckToDac.current + `SndBuf buffer_${buf} => dac;`;
            }
        });

        Object.values(uploadedFilesArrsGenericCode).forEach((codeString: any) => {
            filesGenericCodeString.current = filesGenericCodeString.current + codeString;
        });
        // console.log('TO CHUK AUDIO FILE: ', filesChuckToDac.current);
        console.log('%cTO CHUCK AUDIO CODE ', 'color: orange;', filesGenericCodeString.current);
        // console.log('TEST? ', test);
        
        const getStk1String: any = await stkFXToString();
        // const getOsc1String: any = await osc1FXToString();
        // ********************************************** THIS ONE BELOW WILL NEED THE UPDATES TO STK2 
        // const getStk2String: any = await stkFXToString();
        console.log('stk string before running chuck: ', getStk1String);
        // console.log('osc1 string before running chuck!!!! ', getOsc1String);

        const bodyIR1 = getStk1String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk1String[2]}.bodyIR;`: '';
       // const bodyIR2 = getStk2String[2] === 'man' ? `me.dir() + "ByronGlacier.wav" => ${getStk2String[2]}.bodyIR;` : '';
        // const isBowing = getStk1String[2] === 'wg' ? 'wg.startBowing(1);' : '';

        if (osc1FXString.current.length < 1) {
            osc1FXToString();
        }
        // tk tk getOsc1String
        const OSC_1_Code = osc1FXString.current;

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

        // // TODO 2nd STK NOT YET IMPLEMENTED
        // // ++++++++++++++++++++++++++++++++++++++++++++
        // if (stkValsRef.current.length === 2) {                
        //     const STK_2_Code = getStk2String ? `
        //         if(note > 127)
        //         {
        //             127 => note;
        //         }
        //         if(note < 0)
        //         {
        //             0 => note;
        //         }
        //         ${bodyIR2}
        //         ${getStk2String[0]}
        //         Std.mtof(note + 32) => ${getStk2String[2]}.freq;
        //         1 => ${getStk2String[2]}.noteOn;
        //     ` : '';
        //     setStk2Code(STK_2_Code);
        // }
        setStk1Code(STK_1_Code);
        setOsc1Code(OSC_1_Code);
        
        
        // console.log('%cSTK_1_Code !!!!!!! ', 'orange', stk1Code);
        // // console.log('STK_2_Code %%%%%%% ', stk2Code);
        // console.log('%cOSC_1_Code %%%%%%% ', 'color: orange;', osc1Code);

        runMainChuckCode(aChuck, getStk1String);

    }

    useEffect(() => { runChuck()}, [chuckUpdateNeeded]);
    
    useEffect(() => {
        (async() => {
            // await aChuck?.createFile("", uploadedFile[0], uploadedFile[1]);
            await aChuck?.runCode(`SndBuf buffer => NRev nrTest => dac;

            0.8 => nrTest.mix;
            ${uploadedFiles.current[0].name} => buffer;
            buffer.samples() => buffer.pos;
            
            0 => buffer.pos;
            buffer.length() => now;`); 
        })();
    }, [uploadedFile, uploadedFile.length])

    // AUDIO IN
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const playMicThroughChuck = async () => {
        if(typeof window === 'undefined') return;
        if (!aChuck) return;
        await aChuck.runCode(`
        adc => Gain g => NRev r => dac;
        0.2 => g.gain;
        0.9 => r.mix;
        // 20 => sat.drive;
        // 4 => sat.dcOffset;

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
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    useEffect(() => {
        // console.log('in useeffect');
        // console.log('recreating babylon on this screen and with these fx: ', currentScreen.current, currentFX.current)
        if (babylonGame.current && !babylonGame.current.canvas) {
            // console.log('in useeffect getting canvas');
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
    
    // SLIDER CONTROL KNOB
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleUpdateSliderVal = (obj: any, value: any) => {
        if (currentScreen.current === '') {
            // console.log('SANE CHECK ', obj, value);
            let index: any = Object.values(allFxPersistent.current[`${fxRadioValue}`].map((i:any) => i.presets)).filter((i: any, idx: number) => i.var === obj.name && i)[0];
           
            if (!index || index.length < 1) {
                console.log('this should replace... ', allFxPersistent.current[`${fxRadioValue}`].length - 1);
                index = allFxPersistent.current[`${fxRadioValue}`].length - 1;
            }
          
            if (allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`]) {
                allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`].value = value;
            } else {
            }
        }
        
        // moogGrandmotherEffects.current[`${obj.name}`].value = value;
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
        else if (currentScreen.current === '') {
            console.log('curr fx $$$$$$ ', currentFX.current);
            console.log('curr fx obj $$$$$$ ', obj.name);
        }
        else if (currentScreen.current.indexOf(`fx_`) !== -1) {
            console.log('fxFX.current in : ', fxFX.current);
            console.log('SLIDER OBJ NAME: ', obj.name);
            currentFX.current = fxFX.current[0].presets;
            console.log('SYNTH PRESETS FOR OBJ ', currentFX.current[`${obj.name}`]);
            currentFX.current[`${obj.name}`].value = value;
        }
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    // TIMING (BPM / SIGNATURE)
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleChangeBPM = (newBpm: number) => {
        if (newBpm) {
            setBpm(Number(newBpm));
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsNumerator = (newBeatsNumerator: number) => {
        if (newBeatsNumerator) {
            setBeatsNumerator(Number(newBeatsNumerator));
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsDenominator = (newDenominator: number) => {
        if (newDenominator) {
            setBeatsDenominator(Number(newDenominator));
        }
        setChuckUpdateNeeded(true);
    }
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

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

    const updateFileUploads = () => {
        console.log('%cDO WE GET CONTACT HERE ON FILE UPLOOAD? ', 'color: cyan');
        // const test = new Promise((resolve, reject) => {
        //     resolve(axios.post(`${baseUrl}/api/upload_files`, {
        //         // headers: {
        //         //     'Content-Type': 'application/json',
        //         // },
        //       }));
        // });
        // console.log('123411! ', test);
    };

    const playUploadedFile = (e?: any) => {
        if (!chuckHook) {
            return;
        }
        const theFile = e ? e: lastFileUpload;
        // if (!uploadedFileName) return;
        console.log('%cwhat is the uploaded file? ', 'color: beige;', theFile);
        chuckHook.loadFile(`./src/tmp/${theFile}`);
        // chuckHook.loadFile("/readData.ck")
        // if (!tActive) { 
        //     chuckHook.runFileWithArgs("/readData.ck", `${bpm}:${numeratorSignature}:${denominatorSignature}:/${theFile}`);
        //     setTActive(true);
        // } else {
        //     // chuckHook.removeLastCode();
        //     chuckHook.replaceFileWithArgs("/readData.ck", `${bpm}:${numeratorSignature}:${denominatorSignature}:/${theFile}`);
        // }
        // console.log('ran chuck code');
    };

    useEffect(() => {
        console.log("Last ChucK msg: ", lastChuckMessage);
        if (lastChuckMessage.includes('rerunChuck')) {
            setChuckUpdateNeeded(true);
            // runChuck
        }
    }, [lastChuckMessage]);


    const handleShowFiles = (e: any) => {
        setShowFiles(!showFiles);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{height: size.width, width: size.width, boxSizing: 'border-box', display: 'flex', flexDirection: 'row'}}>
            {typeof window !== 'undefined' && window && (typeof fxKnobsCount !== undefined) && (
                <Box key={babylonKey} sx={{left: '0', display: 'flex', flexDirection: 'row'}}>

               
                {/* <Box sx={{height: '100vh', width: '100vw'}}>
                    <LineChartWrapper />
                </Box> */}

       

                    <FXRouting
                        key={fXChainKey + fxRadioValue} 
                        fxChainNeedsUpdate={fxChainNeedsUpdate} 
                        fxData={allFxPersistent.current[`${fxRadioValue}`]} 
                        width={size.width} 
                        height={size.height}
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
                        playUploadedFile={playUploadedFile}
                        lastFileUpload={lastFileUpload}
                        updateFileUploads={updateFileUploads}
                    />
                    <FileManager 
                        onSubmit={onSubmit}
                        
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
                        {!chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(228,225,209,1)'}} sx={{minWidth: '72px', paddingLeft: '24px', maxHeight: '40px'}} variant="contained" id="initChuckButton" onClick={initChuck} endIcon={<PlayArrowIcon/>}>St</Button>)}
                        {chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(228,225,209,1)'}} sx={{minWidth: '72px', paddingLeft: '24px', maxHeight: '40px'}} variant="contained" id="runChuckButton" onClick={runChuck} endIcon={<PlayCircleFilledIcon/>}>Pl</Button>)}
                        {chuckHook && (<Button style={{color: 'rgba(0,0,0,1)', background: 'rgba(232, 82,82, 1)', backgroundColor: 'rgba(232, 82,82, 1)'}} sx={{backgroundColor: 'rgba(232, 82,82, 1)', background: 'rgba(232, 82,82, 1)', minWidth: '72px', marginLeft: '8px', maxHeight: '40px'}} variant="contained" id="micStartRecordButton" onClick={chuckMicButton}>Rc</Button>)}

                        <Button sx={{color: 'rgba(228,225,209,1)', position: 'absolute', borderColor: 'rgba(228,225,209,1)', left: '0px', minWidth: '72px', marginLeft: '12px', top: '232px', maxHeight: '40px'}} variant="outlined" onClick={handleShowFiles} endIcon={<Inventory2Icon />}>FP</Button>
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
                            showFiles={showFiles}
                            handleShowFiles={handleShowFiles}
                            // uploadedFilesCodeString={uploadedFilesCodeString.current} 
                            // uploadedFilesToChuckString={uploadedFilesToChuckString.current} 
                            filesToProcess={filesToProcess.current}
                        />
                        <ToggleFXView handleReturnToSynth={handleReturnToSynth}/> 
                    </Box>
                </Box>
            )}
            </Box>
        </ThemeProvider>
    )
};