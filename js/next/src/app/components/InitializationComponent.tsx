"use client"

import Image from 'next/image';
import styles from '../page.module.css';
import { Box, Button, FormControl, Grid, TextField, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import React, { useState, useEffect, useDeferredValue, useRef, useMemo } from 'react'
import BabylonLayer from './BabylonLayer';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Chuck, HID } from 'webchuck';
import { Note } from "tonal";
import moogGMPresets from '../../utils/moogGMPresets';
import serverFilesToPreload from '../../utils/serverFilesToPreload';
import MoogGrandmotherEffects from '../../interfaces/audioInterfaces';
import { BabylonGame } from '../../interfaces/gameInterfaces';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import axios from 'axios';
import ControlPopup from './ControlPopup';
import AnimationIcon from '@mui/icons-material/Animation';
import FixedOptionsDropdown from './FixedOptionsSelect';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FXOption, STKOption, fxGroupOptions, fxOptions } from '../../utils/fixedOptionsDropdownData';
import ToggleFXView from './ToggleFXView';
import { getSTK1Preset, getFX1Preset } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import { getBaseUrl } from '@/utils/siteHelpers';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useForm } from "react-hook-form";
import FileManager from './FileManager';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { convertEnvSetting } from '@/utils/FXHelpers/winFuncEnvHelper';
import { LineChartWrapper } from '@/utils/VizHelpers/LineChartWrapper';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { init } from 'node_modules/next/dist/compiled/@vercel/og/satori';
import { virtualKeyMapping } from '@/utils/KeyHelpers/virtualKeyMapping';
import BPMModule from './BPMModule';
import STKManagerDropdown from './STKManagerDropdown';
import DeblurIcon from '@mui/icons-material/Deblur';
import CheckedFXRadioBtns from './CheckedFXRadioBtns';
import build from 'next/dist/build';
import { phonemes } from '@/utils/STKPresets/voicFormPresets';
import ResponsiveAppBar from './ResponsiveAppBar';
import CustomAriaLive from './MicrotonesSearch';
import microtoneDescsData from '../microtone_descriptions.json'; 
import {Tune} from '../../tune';
import Keyboard from './Keyboard'
import { useMingusData } from '@/hooks/useMingusData';
import MicrotonalSearch from './MicrotonalSearch';
import {notefreqchart} from '../../utils//notefreqchart';
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
    const [programIsOn, setProgramIsOn] = useState<boolean>(false);
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const aChuck: Chuck | undefined = useDeferredValue(chuckHook);
    const [lastChuckMessage, setLastChuckMessage] = useState<any>("");
    const [updateUIAfterInit, setUpdateUIAfterInit] = useState<boolean>(false);
    const [microTonalLetters, setMicroTonalLetters] = useState<any>([]);
    const [formats, setFormats] = React.useState<any>(() => []);
    // const [currNotes, setCurrNotes] = useState<any>([]);
    const currNotes = useRef<any>([40]);
    const currNotesHash = useRef<any>({});
    const [notesNeedUpdate, setNotesNeedUpdate] = useState<boolean>(false);
    const [midiAccessHook, setMidiAccessHook] = useState<any>({});
    const lastMidiNote: any = useRef('');
    lastMidiNote.current = '';
    const lastMidiCommand: any = useRef('');

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

    const samplerWinEnvOn = useRef<any>(false);
    const samplerPowerADSROn = useRef<any>(false);
    const samplerExpEnvOn = useRef<any>(false);
    const samplerWPDiodeLadderOn = useRef<any>(false);
    const samplerWPKorg35On = useRef<any>(false);
    const samplerModulateOn = useRef<any>(false);
    const samplerDelayOn = useRef<any>(false);
    const samplerDelayAOn = useRef<any>(false);
    const samplerDelayLOn = useRef<any>(false);
    const samplerExpDelayOn = useRef<any>(false);
    const samplerEllipticOn = useRef<any>(false);
    const samplerSpectacleOn = useRef<any>(false);

    const stkWinEnvOn = useRef<any>(false);
    const stkPowerADSROn = useRef<any>(false);
    const stkExpEnvOn = useRef<any>(false);
    const stkWPDiodeLadderOn = useRef<any>(false);
    const stkWPKorg35On = useRef<any>(false);
    const stkModulateOn = useRef<any>(false);
    const stkDelayOn = useRef<any>(false);
    const stkDelayAOn = useRef<any>(false);
    const stkDelayLOn = useRef<any>(false);
    const stkExpDelayOn = useRef<any>(false);
    const stkEllipticOn = useRef<any>(false);
    const stkSpectacleOn = useRef<any>(false);
    const stkOn = useRef<any>();

    const stkPolyKeyOff = useRef<any>(false);

    const [keysVisible, setKeysVisible] = useState(false);
    const [keysReady, setKeysReady] = useState(false);


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
    const { register, handleSubmit, watch } = useForm();
    const [datas, setDatas] = useState<any>([]);
    // const [numNotesDown, setNumNotesDown] = useState<number>(0);
    // const [theNotesDown, setTheNotesDown] = useState<Array<any>>([]);

    const [stkValues, setStkValues] = useState<STKOption[]>([]);
    const [octave, setOctave] = useState('4');
    const [audioKey, setAudioKey] = useState('C');
    const [audioScale, setAudioScale] = useState('Major');
    const [audioChord, setAudioChord] = useState('M');
    const [fxRadioValue, setFxRadioValue] = React.useState('Osc1');
    const [analysisSourceRadioValue, setAnalysisSourceRadioValue] = React.useState('Osc');
    const [showBPM, setShowBPM] = useState<boolean>(true);
    const [showSTKManager, setShowSTKManager] = useState<boolean>(false);

    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [recreateBabylon, setRecreateBabylon] = useState<boolean>(false)
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);
    const currentNotesDownDisplay = useRef<Array<number | any>>([]);
    const currentNotesKeyValDownDisplay = useRef<Array<number | any>>([]);
    const [arpeggiatorOn, setArpeggiatorOn] = useState<number>(0);
    const [stkArpeggiatorOn, setStkArpeggiatorOn] = useState<number>(0);


    const doReturnToSynth = useRef<boolean>(false);
    const virtualKeyMapDown = useRef<string>("");
    const virtualKeyMapUp = useRef<string>("");

    const hasHexKeys = useRef<boolean>(false);
    
    const [tune, setTune] = useState<any>(null);
    const [mingusKeyboardData, setMingusKeyboardData] = useState<any>([]);
    const [keyBoard, setKeyBoard] = useState<any>();

    const [stk1Code, setStk1Code] = useState<string>('');
    const [osc1Code, setOsc1Code] = useState<string>('');

    const [osc1CodeToChuck, setOsc1CodeToChuck] = useState<string>('');

    const [lastFileUpload, setLastFileUpload] = useState<any>('');
    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);

    const [currentBeatCount, setCurrentBeatCount] = useState<number>(0);
    const [currentBeatSynthCount, setCurrentBeatSynthCount] = useState<number>(0);
    const [currentBeatCountToDisplay, setCurrentBeatCountToDisplay] = useState<number>(0);
    const [currentNumerCount, setCurrentNumerCount] = useState<number>(0);
    const [currentNumerCountColToDisplay, setCurrentNumerCountColToDisplay] = useState<number>(0);

    const [currentDenomCount, setCurrentDenomCount] = useState<number>(0);
    const [currentPatternCount, setCurrentPatternCount] = useState<number>(0);


    const [centroid, setCentroid] = useState<any>([
        {source: "", value: ""}
    ]);
    const [flux, setFlux] = useState<any>([{source: "", value: ""}]);
    const [rMS, setRMS] = useState<any>({source: "", value: ""});
    const [mFCCEnergy, setMFCCEnergy] = useState<any>({source: "", value: ""});
    const [mFCCVals, setMFCCVals] = useState<any>({source: "", value: []});
    const [rollOff50, setRollOff50] = useState<any>({source: "", value: ""});
    const [rollOff85, setRollOff85] = useState<any>({source: "", value: ""});
    const [chroma, setChroma] = useState<any>({source: "", value: []});
    const [xCross, setXCross] = useState<any>({source: "", value: ""});
    const [dct, setDCT] = useState<any>({source: "", value: []});
    const [featureFreq, setFeatureFreq] = useState<any>({source: "", value: ""});
    const [featureGain, setFeatureGain] = useState<any>({source: "", value: ""});
    const [kurtosis, setKurtosis] = useState<any>({source: "", value: ""});
    const [sFM, setSFM] = useState<any>({source: "", value: ""});
    const [sampleRate, setSampleRate] = useState<any>(0);
    const [amplitude, setAmplitude] = useState<any>({source: "", value: ""});
    const [timeNow, setTimeNow] = useState<any>(0);
    const [hold, setHold] = useState<any>(0);
    const [toggleSTKvsFX, setToggleSTKvsFX] = useState<any>(true);
    const [checkedEffectToShow, setCheckedEffectToShow] = useState<any>(true);
    const [microtonalScale, setMicrotonalScale] = useState<string>('05-19');

    useEffect(() => {
        console.log("YO ", currentNumerCountColToDisplay);
        console.log("GABBA: ", currentNumerCount);
        console.log("GABBAX2: ", currentDenomCount);
        console.log("PATTERN ", currentPatternCount);
    }, [currentNumerCountColToDisplay, currentNumerCount, currentPatternCount]);

    const selectRef: any = React.useCallback((selectedMicrotone: string, i: any) => {
        if (selectedMicrotone) {
            console.log('&&&selected microtone: ', selectedMicrotone);
        }
        if (i) {
            console.log('&&&selected microtone::: what is i???? ', i);
        }
    }, []);

    async function convertFrequency(freq: number, microFreq: any, microMidiNum: any) { 

        const freqLets: string[] = [];
        Object.values(notefreqchart).forEach((val: any, idx: number) => {
            if (
                freq < val && 
                newMicroTonalArr.map((i:any) => i.freq).indexOf(microFreq) === -1 && 
                Object.keys(notefreqchart)[idx - 1]
            ) {
                // console.log("WHAT IS VAL? ", val, Object.keys(notefreqchart)[idx - 1])
                // freqLets.push(Object.keys(notefreqchart)[idx - 1])
                newMicroTonalArr.push({
                    freq: microFreq,
                    midiNum: microMidiNum,
                    noteName: Object.keys(notefreqchart)[idx-1],
                })
                // setMicroTonalLetters([...microTonalLetters, microNoteLetter]);
            }
        });
        // console.log("FREQLETS: ", freqLets);
        // console.log("NEW MICRO ARR: ", newMicroTonalArr);
        return freqLets;
    }

    const newMicroTonalArr: any = []

    const currentMicroTonalScale = (scale: any) => {
        let theScale;
        console.log("MICROTONAL SCALE: ", scale);
        if (typeof scale === 'string') {
        
            theScale = '12-19';
        } else {
            console.log('and what is scale??? ', tune.loadScale(scale.value));
            tune.loadScale(scale.value)
            tune.tonicize(220);
            console.log("HEYA ", tune.scale);
          //   tune.mode.output = "MIDI";
            const microtonalFreqs: any[] = []; 
            const microtonalMidiNums: any[] = [];
            
            for(let i = -3; i < 6; i++) {
              // tune.scale.forEach((i: any, idx: number) => {
              for (let j = 0; j < tune.scale.length; j++) {
                  // console.log("OOOF ", tune.note(tune.scale[j], i));
                  tune.mode.output = "frequency";
                  microtonalFreqs.push(tune.note(j, i).toFixed(2));
                  tune.mode.output = "MIDI";
                  microtonalMidiNums.push(tune.note(j, i).toFixed(4));
              }
              // });
            }
            console.log("WOOHA: ", microtonalFreqs);
            console.log("WOOHA2: ", microtonalMidiNums);
            
            

            for (const i in microtonalFreqs) {
                
                (async() => {
                    await convertFrequency(parseFloat(i), microtonalFreqs[i], microtonalMidiNums[i]);
               
                    // newMicroTonalArr.push({
                    //     freq: microtonalFreqs[i],
                    //     midiNum: microtonalMidiNums[i],
                    //     noteName: microNoteLetter,
                    // })
                    // setMicroTonalLetters([...microTonalLetters, microNoteLetter]);
                })();
                
            }

            console.log("CHECK FIRST ARE WE GETTING MICROTONAL ARR??? ", newMicroTonalArr);
            setMicroTonalLetters(newMicroTonalArr);




// *******

            theScale = scale && scale.length > 0 && scale.value && scale.value;
        }
        console.log("have we got the scale? ", scale);
        if (theScale) {
            setMicrotonalScale(theScale);
        }
    };


    interface AllSoundSourcesObject {
        master: Array<any>;
        oscs: Array<any>;
        stks: Array<any>;
        samples: Array<any>;
        linesIn: Array<any>;
    }

    // let midi = null; // global MIDIAccess object
    const midi = useRef<any>(); // global MIDIAccess object
    midi.current = null;
    const nav: any = navigator;

    useEffect(() => {
        midi.current = nav.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
        console.log("M CURR: ", midi.current);
    }, [nav]);

    const [currentNoteVals, setCurrentNoteVals] = useState<AllSoundSourcesObject>(
        {
            // master: ["whole/4"],
            // oscs: ["whole/4"],
            // stks: ["whole/4"],
            // samples: ["whole/4"],
            // linesIn: ["whole/4"]
            master: [4],
            oscs: [8],
            stks: [4],
            samples: [4],
            linesIn: [4]
        }
    )

    const handleOscRateUpdate = (val: any) => {
        console.log("VALLLLLL ", val.target.value);
        setCurrentNoteVals({...currentNoteVals, oscs: [val.target.value]});
        // setChuckUpdateNeeded(true);
    }
    const handleStkRateUpdate = (val: any) => {
        setCurrentNoteVals({...currentNoteVals, stks: [val.target.value]});
        // setChuckUpdateNeeded(true);
    }
    const handleSamplerRateUpdate = (val: any) => {
        setCurrentNoteVals({...currentNoteVals, samples: [val.target.value]});
        // setChuckUpdateNeeded(true);
    }
    const handleAudioInRateUpdate = (val: any) => {
        setCurrentNoteVals({...currentNoteVals, linesIn: [val.target.value]});
        
    }


    const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState<boolean>(false);


    const filesChuckToDac = useRef<string>('');
    const filesGenericCodeString = useRef<any>('');
    const analysisObject = useRef<any>({
        osc: {
            centroid: [],
            flux: [],
            rms: [],
            mfccEnergy: [],
            mfccVals: [],
            rolloff: [],
            dct: [],
            gain: [],
            freq: [],
            kurtosis: [],
        },
        stk: {
            centroid: [],
            flux: [],
            rms: [],
            mfccEnergy: [],
            mfccVals: [],
            rolloff: [],
            dct: [],
            gain: [],
            freq: [],
            kurtosis: [],
        },
        sampler: {
            centroid: [],
            flux: [],
            rms: [],
            mfccEnergy: [],
            mfccVals: [],
            rolloff: [],
            dct: [],
            gain: [],
            freq: [],
            kurtosis: [],
        },
        audioIn: {
            centroid: [],
            flux: [],
            rms: [],
            mfccEnergy: [],
            mfccVals: [],
            rolloff: [],
            dct: [],
            gain: [],
            freq: [],
            kurtosis: [],
        },
    });

    const selectedEffect = useRef<string>('')
    const currentScreen = useRef<string>('synth');
    const [checkedFXUpdating, setCheckedFXUpdating] = useState<boolean>(true);
    const [showFX, setShowFX] = useState<boolean>(false);
    const stkValsRef = useRef<STKOption[]>([]);
    const stkFX = useRef<any>([]);

    const stk1Type = useRef<string | undefined>('');
    const stk1Var = useRef<string | undefined>('');
    const [useStkDirect, setUseDtkDirect] = useState<boolean>(true);

    const filesToProcess = useRef<Array<any>>([]);

    const fxValsRef = useRef<FXOption[]>([]);
    const fxFX = useRef<any>([]);
    const fx1Type = useRef<string | undefined>('');
    const fx1Var = useRef<string | undefined>('');
    const fx1Group = useRef<string | undefined>('');
    const checkedFXList = useRef<FXOption[]>([]);


    const [checkedEffectsListHook, setCheckedEffectsListHook] = useState<Array<any>>([]);

    const finalOsc1FxStringToChuck = useRef<Osc1ToChuck[]>([]);
    const finalSamplerFxStringToChuck = useRef<Osc1ToChuck[]>([]);
    const finalStkFxStringToChuck = useRef<any>([]);

    const osc1FxStringNeedsBlackhole = useRef<string>('');
    const samplerFxStringNeedsBlackhole = useRef<string>('');
    const stkFxStringNeedsBlackhole = useRef<string>('');
    const shredCount = useRef<number>(0);
    
    const osc1FxStringToChuckNeedsBlackhole = useRef<Osc1ToChuck[]>([]);
    const samplerFxStringToChuckNeedsBlackhole = useRef<Osc1ToChuck[]>([]);
    const stkFxStringToChuckNeedsBlackhole = useRef<Osc1ToChuck[]>([]);
    const winFuncEnvFinalHelper = useRef<any>({
        osc1: {
            attackTime: 16,
            releaseTime: 16,
            envSetting: 0,
        },
        osc2: '',
        stk: {
            attackTime: 16,
            releaseTime: 16,
            envSetting: 0,
        },
        sampler: {
            attackTime: 16,
            releaseTime: 16,
            envSetting: 0,
        },
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
        stk: {
            attackTime: 1000,
            attackCurve: 0.5,
            decayTime: 1000,
            decayCurve: 1.25,
            sustainLevel: 0.5,
            releaseTime: 1000,
            releaseCurve: 1.5,
        },
        sampler: {
            attackTime: 1000,
            attackCurve: 0.5,
            decayTime: 1000,
            decayCurve: 1.25,
            sustainLevel: 0.5,
            releaseTime: 1000,
            releaseCurve: 1.5,
        },
        audioIn: {},
    });
    const expEnvFinalHelper = useRef<any>({
        osc1: {
            T60: 3,
            radius: 0.995,
            value: 0,
        },
        osc2: {},
        stk: {
            T60: 3,
            radius: 0.995,
            value: 0,
        },
        sampler: {
            T60: 3,
            radius: 0.995,
            value: 0,
        },
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
        stk: {
            cutoff: 1,
            resonance: 17,
            nlp_type: 1,
            nonlinear: 0,
            saturation: 0.1
        },
        sampler: {
            cutoff: 1,
            resonance: 17,
            nlp_type: 1,
            nonlinear: 0,
            saturation: 0.1
        },
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
        stk: {
            cutoff: 1,
            resonance: 2,
            nonlinear: 0,
            saturation: 0.1
        },
        sampler: {
            cutoff: 1,
            resonance: 2,
            nonlinear: 0,
            saturation: 0.1
        },
        audioIn: {},
    });
    const modulateFinalHelper = useRef<any>({
        osc1: {
            vibratoRate: 6.0,
            vibratoGain: 0.2,
            randomGain: 0.2,
        },
        osc2: {},
        stk: {
            vibratoRate: 6.0,
            vibratoGain: 0.2,
            randomGain: 0.2,
        },
        sampler: {
            vibratoRate: 6.0,
            vibratoGain: 0.2,
            randomGain: 0.2,
        },
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
        stk: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        sampler: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
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
        stk: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        sampler: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
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
        stk: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
        sampler: {
            delay: 500,
            syncDelay: 1,
            lines: 3,
            zero: 0.5,
            b0: 0.5,
            b1: 0.2,
        },
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
        stk: {
            ampcurve: 2.0,
            durcurve: 2.0,
            delay: 0,
            mix: 0.5,
            reps: 4,
            gain: 1.0,
        },
        sampler: {
            ampcurve: 2.0,
            durcurve: 2.0,
            delay: 0,
            mix: 0.5,
            reps: 4,
            gain: 1.0,
        },
        audioIn: {},
    });
    const ellipticFinalHelper = useRef<any>({
        osc1: {
            filterLow: 500,
            filterMid: 600,
            filterHigh: 650,
            atten: 80.0,
            ripple: 10.0,
            filterMode: 0
        },
        osc2: {},
        stk: {
            filterLow: 500,
            filterMid: 600,
            filterHigh: 650,
            atten: 80.0,
            ripple: 10.0,
            filterMode: 0
        },
        sampler: {
            filterLow: 500,
            filterMid: 600,
            filterHigh: 650,
            atten: 80.0,
            ripple: 10.0,
            filterMode: 0
        },
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
        stk: {
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
        sampler: {
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
        audioIn: {},
    });



    const [windowWidth, setWindowWidth] = useState<any>(0);
    const [windowHeight, setWindowHeight] = useState<any>(0);
    const [metronomeOn, setMetronomeOn] = useState<any>(1);

    // currentFX are the ones we are actively editing
    const currentFX = useRef<any>();

    const uploadedFilesToChuckString = useRef<any>('');
    const uploadedFilesCodeString = useRef<string>('');
    const analysisBlocksDeclarations = useRef<string>('');

    // default to the oscillator FX (default oscillator screen happens above)
    if (!currentFX.current) {
        currentFX.current = moogGrandmotherEffects.current
    }

    // currentFX.current = {...currentFX.current, ...fxFX.current.filter((fx: any) => fx.visible === true && fx)}

    const stkFXString = useRef<any>('');
    const osc1FXString = useRef<any>('');
    const osc2FXString = useRef<any>('');
    const audioInFXString = useRef<any>('');
    const samplerFXString = useRef<any>('');
 

    const osc1FXStringToChuck = useRef<any>('');
    const osc2FXStringToChuck = useRef<any>('');
    const audioInFXStringToChuck = useRef<any>('');
    const samplerFXStringToChuck = useRef<any>('');
    const stkFXStringToChuck = useRef<any>('');


    

    // CURRENT EFFECTS LIST SHOULD PERTAIN TO SCREENS / KNOBS!!!! TODO: CLARIFY NAMING HERE!!!!
    const visibleFXKnobs = useRef<Array<any>>();

    const testArrBuffFile = useRef<any>();

    const beginProgram = (val: boolean) => {
        if (val === true) {
          setProgramIsOn(true);
        } else {
          setProgramIsOn(false);
        }
      };


    const onSubmit = async (files: any) => {
        if (files.length === 0) return;
        const file = files.file[0];
        const fileName = file.name;
        const fileDataBuffer: any = await file.arrayBuffer();
        const fileData: any = new Uint8Array(fileDataBuffer);
        const blob = new Blob([fileDataBuffer], { type: "audio/wav" });
        testArrBuffFile.current = fileData;
        const fileBlob = new File([blob], `${file.name.replace(' ', '_')}`, { type: "audio/wav" });
        let arrayBuffer;
        const fileReader = new FileReader();
        fileReader.onload = async function (event: any) {
            arrayBuffer = event.target.result;
            const formattedName = file.name.replaceAll(' ', '_').replaceAll('-', '');
            console.log("FILE NAME: ", formattedName, fileData);
            if (filesToProcess.current.map((i: any) => i.name).indexOf(formattedName) === -1) {                
                filesToProcess.current.push({ 'name': formattedName, 'data': fileData, 'processed': false })
            }
            if (chuckHook) {
                setChuckUpdateNeeded(true);
            }
        }
        fileReader.readAsArrayBuffer(fileBlob);
    }

    const submitMingus = async () => {
        console.log("DO WE HAVE AUDIOKEY??? ", audioKey);
        console.log("TEST HERE 1$");
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, { audioKey, audioScale, octave }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST SCALES HERE 1# ", data);
            //return setMingusKeyboardData(data);
        });
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, { audioChord, audioKey }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST CHORDS 1# ", data);
            // return mingusChordsData.current = data;
            return data;
        });
    }

    const handleClickName = (e: any, op: string) => {
        console.log('TEST CLICK ', e, op);
    };

    useEffect(() => {
        if (!microtonalScale || !tune) return;
        let numVal;
        const num = microtonalScale.split('-')[microtonalScale.split('-').length - 1];
  
        (async()=>{
          const data = [];
          
          tune.loadScale(microtonalScale);
          tune.tonicize(220);
          console.log("HEYA ", tune.scale);
        //   tune.mode.output = "MIDI";
          const microtonalFreqs: any[] = []; 
          const microtonalMidiNums: any[] = [];
          
          for(let i = -3; i < 6; i++) {
            // tune.scale.forEach((i: any, idx: number) => {
            for (let j = 0; j < tune.scale.length; j++) {
                // console.log("OOOF ", tune.note(tune.scale[j], i));
                tune.mode.output = "frequency";
                microtonalFreqs.push(tune.note(j, i).toFixed(2));
                tune.mode.output = "MIDI";
                microtonalMidiNums.push(tune.note(j, i).toFixed(4));
            }
            // });
          }
          console.log("WOOHA: ", microtonalFreqs);
          console.log("WOOHA2: ", microtonalMidiNums);

        })();
    }, [microtonalScale]);

    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    const requestOptions = {                                                                                                                                                                                 
        headers: headerDict,
        params: {
            key: audioKey || 'A',
        }
    };

    const {getMingusData} = useMingusData();


    const noteOnPlay = (theMidiNum: number, theMidiHz: any, mysteryArg=100) => {

        if (currNotes.current.indexOf(theMidiNum) === -1) {
            currNotesHash.current[theMidiNum] = theMidiNum;
            currNotes.current.push(theMidiNum);
            lastMidiNote.current = theMidiNum;

 
            // setNotesNeedUpdate(true);
        } 
        else {
            // const idx = currNotes.current.indexOf(theMidiNum);
            // alert(`GOT IDX: ${idx}`)
            // currNotesHash.current[theMidiNum] = false;
            const temp = currNotes.current.filter((i:any) => i !== theMidiNum && i);
            currNotes.current = temp;
            console.log('IS THIS RIGHT??? ', currNotes.current);
            setNotesNeedUpdate(true);
            // return;
        }   
    }

    const noteOffPlay = (theMidiNum: number) => {
        currNotesHash.current[theMidiNum] = false;

        if (currNotes.current.indexOf(theMidiNum) !== -1) {
            const temp = currNotes.current.filter((i: any) => i.toString() !== theMidiNum);
            currNotes.current = temp;
            // setNotesNeedUpdate(true);
        }
    }

    function onMIDISuccess(midiAccess: any) {
        midi.current = midiAccess;

        setMidiAccessHook(midiAccess);
        const inputs = midiAccess.inputs;
        const outputs = midiAccess.outputs;
        console.log("HOW MANY MIDI ACCESS INPUTS? ", inputs.length, "<<<--", inputs, outputs);
        for (const input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
        }
        return midi;
    };
    
    function onMIDIFailure(msg: any) {
        console.error(`Failed to get MIDI access - ${msg}`);
        return undefined;
    };
      
    function getMIDIMessage(message: any) {
        const command = message.data[0];
        const note = message.data[1];
        const velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
        // console.log("YO MIDI MSG: ", message);
   
            console.log('DOES NOTE === LASTNOTE? ', note, lastMidiNote.current);
 
        switch (command) {
            
            case 248: // midi clock
                // console.log('got clock in here!!! ', message.srcElement.onMessage());
                break;
            // case 144: // noteOn
            case 157: // noteOn
                if (velocity > 20) {
                    if (!note) {
                        return;
                    }
                    console.log("ON command ", command);
                    console.log("ON note ", note);
                    console.log("ON velocity ", velocity);
                    if (currNotes.current.indexOf(note) === -1) {
                        currNotes.current.push(note)
                    }
                    // noteOn(Math.round(note), Math.round(parseInt(velocity)));

                } 
                break;
            // case 128: // noteOff
            case 141: // noteOff
                console.log("OFF command: ", command);
                console.log("OFF note: ", note);
                console.log("OFF velocity: ", velocity);
                noteOffPlay(note);
                currNotes.current.slice(currNotes.current.indexOf(note),1)
                break;
            // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
        }
        // const message = event.data;
        const statusByte = message.data[0] & 0xf0;

        if (statusByte === 0xf8) {
          // Handle incoming MIDI clock
          console.log('Received MIDI clock ', message);
        }
    }
    

    const handleUpdateFXView = (e: any) => {
        console.log("e target: ", e.target.innerText);
        // SAVED STATE HERE ???
        //currentFX.current = allFxPersistent.current[fxRadioValue].find((i: any) => e.target.innerText.toLowerCase() === i.var);
        // const getIndex = allFxPersistent.current[fxRadioValue].map((i: any) => i.var).indexOf(e.target.innerText.toLowerCase());
        selectedEffect.current = e.target.innerText.toLowerCase();
        const theEffect = allFxPersistent.current[fxRadioValue].find((i: any) => e.target.innerText.toLowerCase() === i.var);
        console.log("OOOF MONDAY: ", allFxPersistent.current[fxRadioValue]);
        const knobsCountTemp = currentFX.current = theEffect;
        
        setFxKnobsCount(knobsCountTemp);
        updateCurrentFXScreen();
    };

    useEffect(() => {
        console.log('what is going on w fxFX & currentFX? ', fxFX.current, currentFX.current);
        const stksAndFX: any = (Object.values(fxFX.current).length && (fxFX !== currentFX) ? [stkFX.current, ...Object.values(fxFX.current)] : fxFX.current).filter((fx: any) => Object.values(fx).length > 0 && fx);
        
        let visibleStkAndFX: Array<any>;
        console.log('curr screen ', currentScreen.current, doReturnToSynth.current, checkedFXUpdating, stksAndFX);
        visibleFXKnobs.current = [];
        let gotFX: any;
        let theFXIdx: any;

        if (stksAndFX.length > 0 && currentScreen.current !== "fx_" || selectedEffect.current.length > 0 ) {
        // **** THIS IS WHERE THE ISSUE MAY BE HAPPENING => WHATEVER GETS PASSED INTO VISIBLESTKSANDFX ALWAYS WINS 
            visibleStkAndFX = Array.from(stksAndFX).filter((i: any) => i.visible);
            visibleStkAndFX.map((i: any) => {
                console.log('ARG I! ', i)
                Object.values(i.presets).map((j: any) => {
                    console.log('ARG J! ', [j.label, j]);
                    visibleFXKnobs.current?.push([j.label, j]);
                });
            });

            let newVals: any = [];
    
            visibleFXKnobs.current.map((fxK: any) => newVals.push([fxK, fxK.label]))
    
            const availableFX: any = visibleStkAndFX.filter((i: any) => (i.fxType === 'fx' || i.fxType === 'stk') && i);
            setNeedsUpdate(true);

            if (availableFX.length > 0 && availableFX[0].fxType === 'stk') {
                currentFX.current = [];
                currentFX.current.push(availableFX);
                fxFX.current = [];
                fxFX.current.push(availableFX[availableFX.length - 1]);
                if (availableFX && availableFX.length > 0 && availableFX[0].fxType === "fx") {
                    currentScreen.current = "fx_";
                }
                updateCurrentFXScreen();
            } else if (availableFX.length > 0 && availableFX[0].var) {
                currentFX.current = [];
                currentFX.current.push(availableFX[availableFX.length - 1].presets);
            }

            if (currentScreen.current !== "stk" && availableFX[availableFX.length - 1] && availableFX[availableFX.length - 1].fxType !== 'stk') {     
                if (availableFX.length > 0 && availableFX[0].var) {
    
                    visibleFXKnobs.current = visibleStkAndFX.map((fxFX: any) => currentFX.current.push(Object.values(fxFX).map((i: any) => [i.label, i])));
                    // selectedEffect.current = currentFX.current[currentFX.current.length - 1].var;
                    
                    // this is where we decide which fx get pushed down into the fxChain
                    // console.log("make curr effect visible: ", selectedEffect.current); 
    
                        availableFX.map((fx: any) => {
                            const filteredFX: any = allFxPersistent.current[`${fxRadioValue}`].filter((i: any) => i && i)
                            if (fx.var && filteredFX.map((f: any) => f.var).indexOf(fx.var) === -1) {
                                console.log("need to sanity check fx... ", fx);
                                fxFX.current.push(fx);
                                allFxPersistent.current[`${fxRadioValue}`].push(fx);
                                allFxPersistent.current[`${fxRadioValue}`].filter((v: any) => v.var && v);
                            }
                        })
                        currentScreen.current = '';
            
                    updateCurrentFXScreen();
                }
            }
            
            gotFX= fxFX.current.length > 0 && fxFX.current.filter((fx: any) => (fx.visible === true || fx.fxType === 'stk') && fx);

            theFXIdx = gotFX.length > 0 && gotFX.map((f: any) => f.var).indexOf(selectedEffect.current) >= 0
                ?
                gotFX.map((f: any) => f.var).indexOf(selectedEffect.current)
                :
                gotFX.length - 1;
    
            // console.log(`theFX: ${theFXIdx} // ${visibleFXKnobs.current} // ${currentFX.current}`)
            doReturnToSynth.current = !doReturnToSynth.current;
        } else {
            visibleStkAndFX = Object.values(moogGMPresets);
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            // fxFX.current = moogGrandmotherEffects.current[0];
        }
        // console.log('visibleStkAndFX: ', visibleStkAndFX);
        visibleFXKnobs.current = !currentFX.current.presets
            ?
            currentScreen.current !== 'synth' && 
            currentFX.current && 
            currentFX.current.length > 0 || 
            visibleFXKnobs.current && 
            gotFX && 
            theFXIdx && 
            gotFX[theFXIdx].length > 0 && 
            !doReturnToSynth.current
                ?
                    Object.values(gotFX[theFXIdx]) && 
                    Object.values(gotFX[theFXIdx].presets).map((f: any) => [f.label, f])
                :
                    Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i])
            : 
                Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i])
    }, [checkedFXUpdating]);

    useEffect(() => {
        currentFX.current = [];
        fxFX.current = [];
        // setFXChainKey('');
        checkedFXList.current = [];
        setNeedsUpdate(true);
    }, [fxRadioValue]);

    useEffect(() => {
        console.log(`Analysis Radio Val ${analysisSourceRadioValue.toLowerCase()}`);
    },[analysisSourceRadioValue]);

    const fxChainNeedsUpdate = (msg: any) => {
        console.log("MSG MSG MSG ", msg[0].source);
        selectedEffect.current = msg[0].source;
       
        const effectToSwitchDisplay = allFxPersistent.current[`${fxRadioValue}`].filter((fx: any) => fx.var === msg[0].source && fx);
        if (effectToSwitchDisplay.length > 0) {
            fxFX.current = effectToSwitchDisplay;
        }
        selectedEffect.current = msg[0].source;
        setClickFXChain(true);
        setFXChainKey(msg.map((l: any) => l.source + "_"));
    }

    const handleChangeAnalysisSource = (e: any) => {
        console.log("getting event??? ", e);
        setAnalysisSourceRadioValue(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
    };

    const handleFXGroupChange = (e: any) => {
        console.log("E TARGET VALUE IN GROUP FX CHANGE ", e.target.value);
        if (fxValsRef.current.indexOf(e.target.value) === -1 && fxValsRef.current.indexOf(e.target.value) === -1) {
            fxValsRef.current.push(e.target.value);
            checkedFXList.current.push(e.target.value);
            setCheckedEffectsListHook((x: any) => [...x, e.target.value]);
        } else {
            const index = fxValsRef.current.indexOf(e.target.value);
            fxValsRef.current.splice(index, 1);
            const indexChecked = checkedFXList.current.indexOf(e.target.value);
            checkedFXList.current.slice(indexChecked, 1); 
        }
    };
    
    const handleUpdateHold = () => {
        
        if (hold === 0) {
            setHold(1);
        } else {
            setHold(0);
        }
        setChuckUpdateNeeded(true);
    }

    const updateStkKnobs = (knobVals: STKOption[]) => {
        stkValsRef.current = [];
        stkValsRef.current.push(...knobVals);

        console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', stkValsRef.current);
        if (stkValsRef.current && stkValsRef.current.length > 0) {
            stkFX.current = fxFX.current = getSTK1Preset(stkValsRef.current[stkValsRef.current.length - 1].value);
            currentScreen.current = "stk";
        }

        let knobsCountTemp;
        console.log("what is current screen in update knobs? ", currentScreen.current);
        if (currentScreen.current === 'stk' && stkFX.current && stkFX.current.presets && stkFX.current.presets.length > 0) {
            currentFX.current = stkValsRef.current;
            knobsCountTemp = stkFX.current.presets.length;
        } else {
            knobsCountTemp = currentFX.current.length;
        }
        setFxKnobsCount(knobsCountTemp);
        updateCurrentFXScreen();
    }

    const handleToggleArpeggiator = () => {
        if (arpeggiatorOn === 0) {
            setArpeggiatorOn(1);
        } else {
            setArpeggiatorOn(0);
        }
    }

    const toggleKeyboard = () => {
        if (keysVisible === false) {
            setKeysVisible(true);
        } else {
            setKeysVisible(false);
        }
    }

    const handleToggleStkArpeggiator = () => {
        if (stkArpeggiatorOn === 0) {
            setStkArpeggiatorOn(1);
        } else {
            setStkArpeggiatorOn(0);
        }
    }

    const chuckRunning = useRef<boolean>(false);

    useEffect(() => {
        console.log("SHOW FX CHANGES: ", showFX)
    }, [showFX])

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
        setTune(new Tune());
    }, [])


    const handleReturnToSynth = () => {
        if (currentScreen.current === "stk") {
            currentScreen.current = ""
        } else if (currentScreen.current !== "fx") {
            // doReturnToSynth.current = !doReturnToSynth.current;
            currentScreen.current = "synth";
        }
        updateCurrentFXScreen();
    }

    const updateCurrentFXScreen = () => {

        console.log('FX SCREEN!: ', currentScreen.current);
        console.log('GANME TO RECREATE! ', babylonGame.current);
        if (!babylonGame.current || !babylonGame.current.engine) {
            return;
        }

        if (currentScreen.current === 'stk' || currentScreen.current === 'fx_' || doReturnToSynth.current === true) {
            if (stkFX.current && stkFX.current.length > 0 && (toggleSTKvsFX || visibleFXKnobs.current?.length === 0)) {
                currentScreen.current = 'stk';
                stkFX.current = getSTK1Preset(stkValsRef.current[0].value);
                currentFX.current = stkFX.current;
                visibleFXKnobs.current = Object.values(stkFX.current.presets).map((i: any) => [i.label, i]);  
            } else if (visibleFXKnobs.current && visibleFXKnobs.current.length > 0 && (!toggleSTKvsFX || stkFX.current.length === 0)) {
                currentScreen.current = 'fx_';
                currentFX.current = fxFX.current = allFxPersistent.current[fxRadioValue].filter((i: any) => i.visible === true && i);
                visibleFXKnobs.current = allFxPersistent.current[fxRadioValue] && allFxPersistent.current[fxRadioValue].length > 0 &&  Object.values(allFxPersistent.current[fxRadioValue][allFxPersistent.current[fxRadioValue].length - 1].presets).map((i: any) => [i.label, i]);
            }
        }
        else if (currentScreen.current === 'synth' ) { 
            currentFX.current = [];
            currentFX.current = moogGrandmotherEffects.current;
            fxFX.current = currentFX.current;
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(visibleFXKnobs.current.length);
        } 
        

    
        babylonGame.current.engine.dispose();
        babylonGame.current = undefined;
        setBabylonKey(`${babylonKey}1`);
        setRecreateBabylon(!recreateBabylon);
        babylonGame.current = null;
        setCheckedFXUpdating(!checkedFXUpdating);

        return currentScreen.current;
    };


    const updateCheckedFXList = (e: any) => {

        console.log("sannnne ", e.target.defaultValue);

        if (!e.target.checked) {
            // const index = checkedFXList.current.indexOf(e.target.defaultValue);
            // checkedFXList.current[index];
            // return;
            // fxFX.current.find((i:any) => e.target.defaultValue === i.var).visible = false;
        }

    // else {
        if (!fxFX.current || fxFX.current.length < 1 || (fxFX.current[0] && !fxFX.current[0].visible)) {
            currentScreen.current = 'fx_';
            fxFX.current = allFxPersistent.current[fxRadioValue].filter((i: any) => i.visible === true && i);
        }
        if (checkedFXList.current.indexOf(e.target.value) === -1) {
            checkedFXList.current.push(e.target.value);
            setCheckedEffectsListHook((x: any) => [...x, e.target.value]);
            selectedEffect.current = e.target.value;
        } else {
            const index = checkedFXList.current.indexOf(e.target.value);
            checkedFXList.current.splice(index, 1);
            setCheckedEffectsListHook((x: any) => x.filter((y: any) => y !== e.target.value && y));
        }
    
        console.log("Checked List Current in Update: ", checkedFXList.current);

        const allFx: any = [];
        console.log("what are fx group opts???");
        fxGroupOptions.map((i: any) => {
            if (allFx.indexOf(i.effects) === -1) {
                allFx.push(i.effects);
            }
        });

        console.log("DOES ALLFX DO WHAT WE WANT? ", allFx);
        allFx.flat().forEach((fx: any) => { 
            if (fxFX.current && fxFX.current.filter((fx: any) => fx.visible === true && fx).map((u: any) => u.var).indexOf(fx.effectVar) === -1) {
                fxFX.current.push({
                    presets: getFX1Preset(fx.effectVar)[0].presets,
                    type: fx.effectLabel,
                    var: fx.effectVar,
                    fxType: 'fx',
                    visible: true,
                });
            }
        });

        fxFX.current.forEach((c: any) => {
            const isChecked = checkedFXList.current.indexOf(c.var);
            console.log("YO CVAR: ", c.var);
            console.log("YO CHECKED FX: ", checkedFXList.current);
            if (isChecked !== -1) {
                c.visible = true;
            } else {
                c.visible = false;
            }
        });

    // }

        fxFX.current = fxFX.current.filter((f: any) => f.visible === true && f)

        currentScreen.current = "synth";
        // TODO hate this lack of clarity right here.... fix it.
        setCheckedFXUpdating(!checkedFXUpdating);
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
        submitMingus();
    };

    const handleChangeChord = (event: SelectChangeEvent) => {
        console.log('WHAT IS EVENT IN HANDLECHANNGECHORD? ', event);
        setAudioChord(event.target.value as string);
        submitMingus();
    };


    useEffect(() => {
        console.log('BABYLON KEY: ', babylonKey);
        setNeedsUpdate(true);
    }, [babylonKey]);

    useEffect(() => {
        setFxKnobsCount(Object.keys(moogGrandmotherEffects.current).length);
    }, [moogGrandmotherEffects])

    const stxFXGetVals = () => {
        if (!stkFX.current || stkFX.current.length < 1) return '';
        stk1Type.current = stkFX.current.type;
        stk1Var.current = stkFX.current.var;

        stkFX.current && stkFX.current.presets && Object.values(stkFX.current.presets) && Object.values(stkFX.current.presets).length > 0 && Object.values(stkFX.current.presets).map((preset: any) => {
            console.log('STK PRESET: ', preset); // preset.name
            const alreadyInChuckDynamicScript: boolean = (stkFXString.current && stkFXString.current.indexOf(`${stkFX.current.var}.${preset.name};`) !== -1);
            // stkFXString.current = stkFXString.current && !alreadyInChuckDynamicScript ? `${stkFXString.current} ${preset.value} => ${stkFX.current.var}.${preset.name}; ` : `${preset.value} => ${stkFX.current.var}.${preset.name}; `;
            for (let j = 1; j < currentNotesDownDisplay.current.length; j++) {
                stkFXString.current = stkFXString.current && !alreadyInChuckDynamicScript ? `${stkFXString.current} ${preset.value} => ${stkFX.current.var}[${j-1}].${preset.name}; ` : `${preset.value} => ${stkFX.current.var}[${j-1}].${preset.name}; `;
            }
            // console.log("WHAT IS STKFX CURRENT >?>?>?>? ", stkFXString.current);
            return stkFXString.current;
        });
    }

    // // THIS METHOD TURNS A PRESET INTO CHUCK CODE (only set up for stk1)
    const stkFXToStringPrepare = () => {
        console.log('stkFXTo *** STRING ***: ', stkFX.current);
        if (!stkFX.current || stkFX.current.length < 1) return '';

        stk1Type.current = stkFX.current.type;
        stk1Var.current = stkFX.current.var;

        const isFX = Object.values(stkFX.current).filter((i: any) => i.fxType === "fx");

       isFX && stkFX.current.length > 0 && stkFX.current.presets && Object.values(stkFX.current.presets) && Object.values(stkFX.current.presets).length > 0 && Object.values(stkFX.current.presets).map((preset: any) => {
            console.log('STK PRESET: ', preset); // preset.name
            const alreadyInChuckDynamicScript: boolean = (stkFXString.current && stkFXString.current.indexOf(`${stkFX.current.var}.${preset.name};`) !== -1);
            // stkFXString.current = stkFXString.current && !alreadyInChuckDynamicScript ? `${stkFXString.current} ${preset.value} => ${stkFX.current.var}.${preset.name}; ` : `${preset.value} => ${stkFX.current.var}.${preset.name}; `;
            console.log("WHAT ARE CURRENT NOTES DOWN>??? ", currentNotesDownDisplay.current);

            for (let j = 1; j < 12; j++) {
                stkFXString.current = stkFXString.current && !alreadyInChuckDynamicScript ? `${stkFXString.current} ${preset.value} => ${stkFX.current.var}[${j-1}].${preset.name}; ` : `${preset.value} => ${stkFX.current.var}[${j-1}].${preset.name}; `;
            }
            console.log("WHAT IS STKFX CURRENT >?>?>?>? ", stkFXString.current);
        });

        // stkFX2.current && stkFX2.current.presets && Object.values(stkFX2.current.presets).map((preset: any) => {
        //     const alreadyInChuckDynamicScript: boolean = (stkFX2String.current && stkFX2String.current.indexOf(`${stkFX2.current.var}.${preset.name};`) !== -1);
        //     stkFX2String.current = stkFX2String.current && !alreadyInChuckDynamicScript ? `${stkFX2String.current} ${preset.value} => ${stkFX2.current.var}.${preset.name}; ` : `${preset.value} => ${stkFX2.current.var}.${preset.name}; `;
        //     return stkFX2String.current;
        // });
        // console.log('are we appending to stkFXString? ', stkFXString.current);
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
            while (true)  {
                1.0 => win.gain;
                1 => win.keyOn;
                value => now;
                0 => win.keyOn;
            }
        }
        spork ~ playExpEnvWindow(expenv_${source}, whole/${Math.pow(2, T60)}, ${radius}, whole/${Math.pow(2, value)});
    `;

    const wpDiodeLadderString = (source: string, cutoff: number, resonance: number, nlp_type: number, nonlinear: number, saturation: number) => {
        const nlp_str = nlp_type === 1 ? 'true' : 'false';
        const nonlinear_str = nonlinear === 1 ? 'true' : 'false';
        return `
        fun void playWpDiodeLadderWindow(WPDiodeLadder @ win, float cutoff, int resonance,  nlp_type, int nonlinear, float saturation) {
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
            
            0.15 => win.gain;

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
            
            0.2 => win.gain;

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

        return `

        fun void playModWindow(Modulate @ win, float vibratoRate, float vibratoGain, float randomGain) {
            // multiply
            // 3 => hpf.op;
            if ("${source}" == "o1") {
                3 => hpf.op;
            } else if ("${source }" == "s1") {
                3 => limiter_Sampler.op;
            } else if ("${source}" == "stk1") {
                3 => limiter_STK.op;
            } 
    
            // set freq
            // 220 => testSin.freq;
    
            // set rate in hz
            vibratoRate => win.vibratoRate;
            // set gain
            vibratoGain => win.vibratoGain;
            // set random gain
            randomGain => win.randomGain;
    
            whole/${currentNoteVals.master[0]} - (now % whole/${currentNoteVals.master[0]}) => now;
      
        }
        spork ~ playModWindow(mod_${source}, ${vibratoRate}, ${vibratoGain}, ${randomGain});
        `;
    };

    const ellipticString = (source: string, filterLow: number, filterMid: number, filterHigh: number, atten: number, ripple: number, filterMode: number) => {
        console.log('get elliptic vals: ', source, filterLow, filterMid, filterHigh, ripple, atten, filterMode);
        return `
        fun void playEllipticWindow(Elliptic @ win, dur beat, float lower, float middle, float upper, float atten, float ripple, int filterMode) {
            
            atten => win.atten;
            ripple => win.ripple;

            if (filterMode == 0) {
                win.bpf(upper,middle,lower);
            } else if (filterMode == 1) {
                win.lpf(lower, upper);
            } else if (filterMode == 2) {
                win.hpf(upper, lower);
            }
            whole/${currentNoteVals.master[0]} - (now % whole/${currentNoteVals.master[0]}) => now;
        }
        spork ~ playEllipticWindow(elliptic_${source}, beat, ${filterLow}, ${filterMid}, ${filterHigh}, ${atten}, ${ripple}, ${filterMode});
        `;
    }

    const delayString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        return `
        fun void playDelayWindow(Delay @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            for (0 => int i; i < ${lines}; i++) 
            { 
                if ("${source}" == "o1") {
                    hpf => win[i] => dac;
                } else if ("${source}" == "s1") {
                    limiter_Sampler => win[i] => dac;
                } else if ("${source}" == "stk1") {
                    limiter_STK => win[i] => dac;
                }
                win[i] => OneZero filter_delay_${source} => win[i]; 
                zero => filter_delay_${source}.zero;
                b0 => filter_delay_${source}.b0;
                b1 => filter_delay_${source}.b1;
                0.2 => win[i].gain; 
                // (((1 + i*0.3) * 1000)) :: ms => win[i].max => win[i].delay;
                ((whole)/((syncDelay/${currentNoteVals.master[0]}) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
                me.yield();
            }
            me.exit();
        }
        spork ~ playDelayWindow(delay_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
        `;
    };

    const delayAString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        return `
        fun void playDelayAWindow(DelayA @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            for (0 => int i; i < ${lines}; i++) 
            { 
                if ("${source}" == "o1") {
                    hpf => win[i] => dac;  
                } else if ("${source }" == "s1") {
                    limiter_Sampler => win[i] => dac;
                } else if ("${source}" == "stk1") {
                    limiter_STK => win[i] => dac;
                }
                win[i] => OneZero filter_delayA_${source} => win[i]; 
                zero => filter_delayA_${source}.zero;
                b0 => filter_delayA_${source}.b0;
                b1 => filter_delayA_${source}.b1;
                0.6 => win[i].gain; 
                (whole/${currentNoteVals.master[0]})/((syncDelay) * (1 + i*0.3)) => win[i].max => win[i].delay;
                me.yield();
            }
            me.exit();
        }
        spork ~ playDelayAWindow(delayA_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
        `;
    };

    const delayLString = (source: string, delay: number, lines: number, syncDelay: number, zero: number, b0: number, b1: number) => {
        const convertedSyncDelay = Math.pow(2, syncDelay);
        console.log("sanity check delayL source: ", source);
        return `
        fun void playDelayLWindow(DelayL @ win[], float delay, int lines, float syncDelay, float zero, float b0, float b1) {
            // while (true) {
                    for (0 => int i; i < ${lines}; i++) 
                    { 
                        if ("${source}" == "o1") {
                            hpf => win[i] => dac;  
                        } else if ("${source}" == "s1") {
                            limiter_Sampler => win[i] => dac;
                        } else if ("${source}" == "stk1") {
                            limiter_STK => win[i] => dac;
                        }
                        win[i] => OneZero filter_delayL_${source} => win[i];
                        zero => filter_delayL_${source}.zero;
                        b0 => filter_delayL_${source}.b0;
                        b1 => filter_delayL_${source}.b1;
                        0.6 => win[i].gain; 
                        // ((whole * ${numeratorSignature})/((syncDelay) * (1/(1 + i*0.7)))) => win[i].max => win[i].delay;
                        (whole * ${numeratorSignature})/((syncDelay) * (1/(1 + i*0.7))) => win[i].max => win[i].delay;
   
                        // me.yield();
                    }
    
                me.exit();
        }
        spork ~ playDelayLWindow(delayL_${source}, ${delay}, ${lines}, ${convertedSyncDelay}, ${zero}, ${b0}, ${b1});
        `;
    };

    const expDelayString = (source: string, ampcurve: number, durcurve: number, delay: number, mix: number, reps: number, gain: number) => {
        const convertedSyncDelay = Math.pow(2, delay);
        console.log("WHAT IS CONVERTED SYNC DELAY? ", convertedSyncDelay);
        console.log("all good???? ", currentNoteVals.master[0]);
        return `
        fun void playExpDelayWindow(ExpDelay @ win, float ampcurve, float durcurve, float delay, float mix, int reps, float gain) {

            while (true)
            {
               (whole/(${currentNoteVals.master[0]}))/delay => win.max => win.delay;

                reps * 0.7 => win.gain;
                durcurve => win.durcurve;
                ampcurve => win.ampcurve;
                reps => win.reps;
                
                (whole/(${currentNoteVals.master[0]}))/delay => now;
                // me.yield();
            }
            me.exit();
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

 


    const samplerFXToString = () => {
  
        // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
        // =================================================================
        Object.values(allFxPersistent.current.Sampler).map((s1: any) => {
            if (samplerFXStringToChuck.current.indexOf(`${s1.var}_s1`) === -1) {
                if (s1.type === "PitchTrack") {
                    if (samplerFxStringToChuckNeedsBlackhole.current.map((i: any) => i.name).indexOf(`${s1.var}`) === -1) {
                        samplerFxStringToChuckNeedsBlackhole.current.push({ name: `${s1.var}`, string: `=> ${s1.type} ${s1.var}_s1 => blackhole;` });
                    }
                    return;
                } else if (s1.type === "WinFuncEnv") {
                    samplerWinEnvOn.current = true;
                } else if (s1.type === "PowerADSR") {
                    samplerPowerADSROn.current = true;
                } else if (s1.type === "ExpEnv") {
                    samplerExpEnvOn.current = true;
                } else if (s1.type === "WPDiodeLadder") {
                    samplerWPDiodeLadderOn.current = true;
                } else if (s1.type === "WPKorg35") {
                    samplerWPKorg35On.current = true;
                } else if (s1.type === "Modulate") {
                    samplerModulateOn.current = true;
                } else if (s1.type === "Delay") {
                    samplerDelayOn.current = true;
                } else if (s1.type === "DelayA") {
                    samplerDelayAOn.current = true;
                } else if (s1.type === "DelayL") {
                    samplerDelayLOn.current = true;
                } else if (s1.type === "ExpDelay") {
                    samplerExpDelayOn.current = true;
                } else if (s1.type === "Elliptic") {
                    samplerEllipticOn.current = true;
                } else if (s1.type === "Spectacle") {
                    samplerSpectacleOn.current = true;
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
                    console.log("we should and do hit this for nrev test ", s1, samplerFXStringToChuck.current);
                    samplerFXStringToChuck.current = samplerFXStringToChuck.current.concat(`=> ${s1.type} ${s1.var}_s1 `);
                }
            }
            console.log("Make sure we get into part 2: ", Object.values(s1.presets))
            // THIS FIRST OBJECT MAPPING HANDLES OSC1 EFFECTS CODE
            // =================================================================
            Object.values(s1.presets).length > 0 && Object.values(s1.presets).map(async (preset: any, idx: number) => {

                // ******** TODO change to read type directly from o1.type
                if (preset.type.includes("_needsFun")) {
                    if (preset.type.includes("_winFuncEnv")) {
                        if (preset.name === "attackTime") {
                            winFuncEnvFinalHelper.current.sampler.attackTime = Math.pow(2, Number(preset.value));
                        } else if (preset.name === "releaseTime") {
                            winFuncEnvFinalHelper.current.sampler.releaseTime = Math.pow(2, Number(preset.value));
                        } else if (preset.name === "envSetting") {
                            winFuncEnvFinalHelper.current.sampler.envSetting = convertEnvSetting(preset.value);
                        } else {
                        }
                    }
                    if (preset.type.includes("_powerADSR")) {
                        // add quantization / feedback etc later
                        if (preset.name === "attackTime") {
                            powerADSRFinalHelper.current.sampler.attackTime = preset.value;
                        } else if (preset.name === "attackCurve") {
                            powerADSRFinalHelper.current.sampler.attackCurve = preset.value;
                        } else if (preset.name === "releaseTime") {
                            powerADSRFinalHelper.current.sampler.releaseTime = preset.value;
                        } else if (preset.name === "releaseCurve") {
                            powerADSRFinalHelper.current.sampler.releaseCurve = preset.value;
                        }
                        else if (preset.name === "decayTime") {
                            powerADSRFinalHelper.current.sampler.decayTime = preset.value;
                        }
                        else if (preset.name === "decayCurve") {
                            powerADSRFinalHelper.current.sampler.decayCurve = preset.value;
                        }
                        else if (preset.name === "sustainLevel") {
                            powerADSRFinalHelper.current.sampler.sustainLevel = preset.value;
                        }


                    }
                    if (preset.type.includes("_expEnv")) {
                        if (preset.name === "T60") {
                            expEnvFinalHelper.current.sampler.T60 = preset.value;
                        } else if (preset.name === "radius") {
                            expEnvFinalHelper.current.sampler.radius = preset.value;
                        } else if (preset.name === "value") {
                            expEnvFinalHelper.current.sampler.value = preset.value;
                        }
                    }
                    if (preset.type.includes("_diodeladder")) {
                        if (preset.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.sampler.cutoff = preset.value;
                        } else if (preset.name === "nlp_type") {
                            wpDiodeLadderFinalHelper.current.sampler.nlp_type = preset.value;
                        } else if (preset.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.sampler.nonlinear = preset.value;
                        } else if (preset.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.sampler.saturation = preset.value;
                        } else if (preset.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.sampler.resonance = preset.value;
                        }
                    }
                    if (preset.type.includes("_wpkorg35")) {
                        if (preset.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.sampler.cutoff = preset.value;
                        } else if (preset.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.sampler.resonance = preset.value;
                        } else if (preset.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.sampler.nonlinear = preset.value;
                        } else if (preset.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.sampler.saturation = preset.value;
                        }
                    }
                    if (preset.type.includes("mod")) {
                        if (preset.name === "vibratoRate") {
                            modulateFinalHelper.current.sampler.vibratoRate = preset.value;
                        } else if (preset.name === "vibratoGain") {
                            modulateFinalHelper.current.sampler.vibratoGain = preset.value;
                        } else if (preset.name === "randomGain") {
                            modulateFinalHelper.current.sampler.randomGain = preset.value;
                        }
                    }
                    if (s1.type === "Delay") {
                        if (preset.name === "delay") {
                            delayFinalHelper.current.sampler.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayFinalHelper.current.sampler.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayFinalHelper.current.sampler.syncDelay = preset.value;
                        }
                    }
                    if ((s1.type === "DelayA")) {
                        if (preset.name === "delay") {
                            delayAFinalHelper.current.sampler.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayAFinalHelper.current.sampler.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayAFinalHelper.current.sampler.syncDelay = preset.value;
                        }
                    }
                    if ((s1.type === "DelayL")) {
                        if (preset.name === "delay") {
                            delayLFinalHelper.current.sampler.delay = preset.value;
                        } else if (preset.name === "lines") {
                            delayLFinalHelper.current.sampler.lines = preset.value;
                        } else if (preset.name === "syncDelay") {
                            delayLFinalHelper.current.sampler.syncDelay = preset.value;
                        }
                    }
                    if (s1.type === "ExpDelay") {
                        if (preset.name === "ampcurve") {
                            expDelayFinalHelper.current.sampler.ampcurve = preset.value;
                        } else if (preset.name === "durcurve") {
                            expDelayFinalHelper.current.sampler.durcurve = preset.value;
                        } else if (preset.name === "delay") {
                            expDelayFinalHelper.current.sampler.delay = preset.value;
                        } else if (preset.name === "mix") {
                            expDelayFinalHelper.current.sampler.mix = preset.value;
                        } else if (preset.name === "reps") {
                            expDelayFinalHelper.current.sampler.reps = preset.value;
                        }
                    }
                    if (s1.type === "Elliptic") {
                        if (preset.name === "lowFilter") {
                            ellipticFinalHelper.current.sampler.lowFilter = preset.value;
                        } else if (preset.name === "midFilter") {
                            ellipticFinalHelper.current.sampler.midFilter = preset.value;
                        } else if (preset.name === "highFilter") {
                            ellipticFinalHelper.current.sampler.highFilter = preset.value;
                        } else if (preset.name === "atten") {
                            ellipticFinalHelper.current.sampler.atten = preset.value;
                        } else if (preset.name === "ripple") {
                            ellipticFinalHelper.current.sampler.ripple = preset.value;
                        } else if (preset.name === "filterMode") {
                            ellipticFinalHelper.current.sampler.filterMode = preset.value;
                        }
                    }
                    if (s1.type === "Spectacle") {
                        console.log(`YA WE HIT THIS: `, spectacleFinalHelper.current.sampler);
                        if (preset.name === "bands") {
                            spectacleFinalHelper.current.sampler.bands;
                        } else if (preset.name === "delay") {
                            spectacleFinalHelper.current.sampler.delay;
                        } else if (preset.name === "eq") {
                            spectacleFinalHelper.current.sampler.eq;
                        } else if (preset.name === "feedback") {
                            spectacleFinalHelper.current.sampler.feedback;
                        } else if (preset.name === "fftlen") {
                            spectacleFinalHelper.current.sampler.fftlen;
                        } else if (preset.name === "freqMax") {
                            spectacleFinalHelper.current.sampler.freqMax;
                        } else if (preset.name === "freqMin") {
                            spectacleFinalHelper.current.sampler.freqMin;
                        } else if (preset.name === "mix") {
                            spectacleFinalHelper.current.sampler.mix;
                        } else if (preset.name === "overlap") {
                            spectacleFinalHelper.current.sampler.overlap;
                        } else if (preset.name === "table") {
                            spectacleFinalHelper.current.sampler.table;
                        }
                    }

                    else {
                        // alert('in the else!')
                    }
                } else {
                    const addDurMs = preset.type.indexOf('dur') !== -1 ? '::ms' : '';
                    let formattedValue: any = preset.type.indexOf('dur') !== -1 ? `${preset.value}${addDurMs}` : `${preset.value}`;

                    if (samplerFXString.current !== '') {
                        if (finalSamplerFxStringToChuck.current.map((samp: any) => samp.name).indexOf(preset.name) !== -1) {
                            const theIndex = finalSamplerFxStringToChuck.current.map((samp: any) => samp.name).indexOf(preset.name);
                            console.log("hey the samp index: ", theIndex);
                            finalSamplerFxStringToChuck.current[theIndex].string = `${formattedValue} => ${s1.var}_s1.${preset.name};`;
                            console.log("hey final sampler is here: ", finalSamplerFxStringToChuck.current[theIndex]);
                        }
                        else {
                            // if (preset.visible === true) {
                            finalSamplerFxStringToChuck.current.push({ name: preset.name, string: `${formattedValue} => ${s1.var}_s1.${preset.name};` });
                            // }
                        }
                    } else {
                        samplerFXString.current = `${formattedValue} => ${s1.var}_s1.${preset.name};`;
                    }
                }
            });
        });
    };

    const osc1FXToString = () => {  
   

        // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
        // =================================================================
        Object.values(allFxPersistent.current.Osc1).map((o1: any) => {
            if (osc1FXStringToChuck.current.indexOf(`${o1.var}_o1`) === -1) {
                if (o1.type === "PitchTrack") {
                    if (osc1FxStringToChuckNeedsBlackhole.current.map((i: any) => i.name).indexOf(`${o1.var}`) === -1) {
                        osc1FxStringToChuckNeedsBlackhole.current.push({ name: `${o1.var}`, string: `=> ${o1.type} ${o1.var}_o1 => blackhole;` });
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
            Object.values(o1.presets).length > 0 && Object.values(o1.presets).map(async (preset: any, idx: number) => {
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
                            powerADSRFinalHelper.current.sampler.attackTime = preset.value;
                            powerADSRFinalHelper.current.osc1.attackTime = preset.value;
                        } else if (preset.name === "attackCurve") {
                            powerADSRFinalHelper.current.sampler.attackCurve = preset.value;
                            powerADSRFinalHelper.current.osc1.attackCurve = preset.value;
                        } else if (preset.name === "releaseTime") {
                            powerADSRFinalHelper.current.sampler.releaseTime = preset.value;
                            powerADSRFinalHelper.current.osc1.releaseTime = preset.value;
                        } else if (preset.name === "releaseCurve") {
                            powerADSRFinalHelper.current.sampler.releaseCurve = preset.value;
                            powerADSRFinalHelper.current.osc1.releaseCurve = preset.value;
                        }

                        else if (preset.name === "decayTime") {
                            powerADSRFinalHelper.current.sampler.decayTime = preset.value;
                            powerADSRFinalHelper.current.osc1.decayTime = preset.value;
                        }
                        else if (preset.name === "decayCurve") {
                            powerADSRFinalHelper.current.sampler.decayCurve = preset.value;
                            powerADSRFinalHelper.current.osc1.decayCurve = preset.value;
                        }
                        else if (preset.name === "sustainLevel") {
                            powerADSRFinalHelper.current.sampler.sustainLevel = preset.value;
                            powerADSRFinalHelper.current.osc1.sustainLevel = preset.value;
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
                            expDelayFinalHelper.current.osc1.delay = preset.value;
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
                    let formattedValue: any = preset.type.indexOf('dur') !== -1 ? `${preset.value}${addDurMs}` : `${preset.value}`;

                    if (osc1FXString.current !== '') {
                        if (finalOsc1FxStringToChuck.current.map((osc: any) => osc.name).indexOf(preset.name) !== -1) {
                            const theIndex = finalOsc1FxStringToChuck.current.map((osc: any) => osc.name).indexOf(preset.name);
                            console.log("hey the index: ", theIndex);
                            finalOsc1FxStringToChuck.current[theIndex].string = `${formattedValue} => ${o1.var}_o1.${preset.name};`;
                            console.log("hey final osc1 is here: ", finalOsc1FxStringToChuck.current[theIndex]);
                        }
                        else {
                            finalOsc1FxStringToChuck.current.push({ name: preset.name, string: `${formattedValue} => ${o1.var}_o1.${preset.name};` });
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

    const stkFXToString = () => {
        console.log("AM I SANE? ", allFxPersistent.current.STK);
        // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
        // =================================================================
        
        // allFxPersistent.current.STK.presets && Object.values(allFxPersistent.current.STK.presets).length > 0 && Object.values(allFxPersistent.current.STK.filter((i: any) => i.fxType !== "stk" && i)).map((stk1: any) => {
            allFxPersistent.current.STK.map((i: any) => i.fxType === "fx").length > 0 && allFxPersistent.current.STK.filter((i: any) => i.fxType === "fx" && i).map((stk1: any) => {
            // if ((!stk1.fxType || stk1.fxType !== "stk") && stkFXStringToChuck.current.indexOf(`${stk1.var}_stk1`) !== -1 && stk1.presets && stk1.presets.length > 0) {
            if (stkFXStringToChuck.current.indexOf(`${stk1.var}_stk1`) === -1){
            
                if (stk1.var === "pittrack") {
                    console.log("THIS WOULD DO IT ", stkFxStringToChuckNeedsBlackhole.current);
                    // if (stkFxStringToChuckNeedsBlackhole.current && stkFxStringToChuckNeedsBlackhole.current.length > 0 && stkFxStringToChuckNeedsBlackhole.current.map((i: any) => i.name).indexOf(`${stk1.var}`) === -1) {
                    //     stkFxStringToChuckNeedsBlackhole.current.push({ name: `${stk1.var}`, string: `=> ${stk1.type} ${stk1.var}_stk1 => blackhole;` });
                    // }
                    // // return;
                } else if (stk1.var === "winFuncEnv") {
                    stkWinEnvOn.current = true;
                } else if (stk1.var === "poweradsr") {
                    stkPowerADSROn.current = true;
                } else if (stk1.var === "expEnv") {
                    stkExpEnvOn.current = true;
                } else if (stk1.var === "wpdiodeLadder") {
                    stkWPDiodeLadderOn.current = true;
                } else if (stk1.var === "wpkorg35") {
                    stkWPKorg35On.current = true;
                } else if (stk1.var === "modulate") {
                    // stkModulateOn.current = true;
                } else if (stk1.var === "delay") {
                    stkDelayOn.current = true;
                } else if (stk1.var === "delayA") {
                    stkDelayAOn.current = true;
                } else if (stk1.var === "delayL") {
                    stkDelayLOn.current = true;
                } else if (stk1.var === "expDelay") {
                    stkExpDelayOn.current = true;
                } else if (stk1.var === "elliptic") {
                    stkEllipticOn.current = true;
                } else if (stk1.var === "spectacle") {
                    stkSpectacleOn.current = true;
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
                    // console.log("ARE WE SUPPOSED TO GET NON-COMPLEX EFFECTS HERE? ", stk1);
                    // console.log("we should and do hit this for nrev test ", stk1, stkFXStringToChuck.current);
                    console.log(`YO! ${stk1.var} //// ${samplerFXStringToChuck.current}`)

                            const preventdupes = stkFXStringToChuck.current.includes(stk1.var); 

                    if ( !stkFXStringToChuck.current || stkFXStringToChuck.current.length < 1 && stk1.fxType === "stk") {
                        
                        stkFXStringToChuck.current = `${stk1.type} ${stk1.var}_stk1`
                    } else {
                        
                        stkFXStringToChuck.current = !preventdupes ? stkFXStringToChuck.current.concat(`=> ${stk1.type} ${stk1.var}_stk1 `) : stkFXStringToChuck.current;
                    }
                    // stkFXStringToChuck.current = stkFXStringToChuck.current.concat(`=> ${stk1.type} ${stk1.var}_stk1 `)
                   
                }
            }
            console.log("Make sure we get into part 2: ", Object.values(stk1.presets))
            // THIS FIRST OBJECT MAPPING HANDLES OSC1 EFFECTS CODE
            // =================================================================
            Object.values(stk1.presets).length > 0 && Object.values(stk1.presets).map(async (effect: any, idx: number) => {
        
                // ******** TODO change to read type directly from o1.type
                if (effect && effect.length > 0 && effect.type && effect.type.includes("_needsFun") && effect.fxType !== "stk") {
                    if (effect.type.includes("_winFuncEnv")) {
                        if (effect.name === "attackTime") {
                            winFuncEnvFinalHelper.current.stk.attackTime = Math.pow(2, Number(effect.value));
                        } else if (effect.name === "releaseTime") {
                            winFuncEnvFinalHelper.current.stk.releaseTime = Math.pow(2, Number(effect.value));
                        } else if (effect.name === "envSetting") {
                            winFuncEnvFinalHelper.current.stk.envSetting = convertEnvSetting(effect.value);
                        } else {
                        }
                    }
                    if (effect.type.includes("_powerADSR")) {
                        // add quantization / feedback etc later
                        if (effect.name === "attackTime") {
                            powerADSRFinalHelper.current.stk.attackTime = effect.value;
                        } else if (effect.name === "attackCurve") {
                            powerADSRFinalHelper.current.stk.attackCurve = effect.value;
                        } else if (effect.name === "releaseTime") {
                            powerADSRFinalHelper.current.stk.releaseTime = effect.value;
                        } else if (effect.name === "releaseCurve") {
                            powerADSRFinalHelper.current.stk.releaseCurve = effect.value;
                        }
                        else if (effect.name === "decayTime") {
                            powerADSRFinalHelper.current.stk.decayTime = effect.value;
                        }
                        else if (effect.name === "decayCurve") {
                            powerADSRFinalHelper.current.stk.decayCurve = effect.value;
                        }
                        else if (effect.name === "sustainLevel") {
                            powerADSRFinalHelper.current.stk.sustainLevel = effect.value;
                        }


                    }
                    if (effect.type.includes("_expEnv")) {
                        if (effect.name === "T60") {
                            expEnvFinalHelper.current.stk.T60 = effect.value;
                        } else if (effect.name === "radius") {
                            expEnvFinalHelper.current.stk.radius = effect.value;
                        } else if (effect.name === "value") {
                            expEnvFinalHelper.current.stk.value = effect.value;
                        }
                    }
                    if (effect.type.includes("_diodeladder")) {
                        if (effect.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.stk.cutoff = effect.value;
                        } else if (effect.name === "nlp_type") {
                            wpDiodeLadderFinalHelper.current.stk.nlp_type = effect.value;
                        } else if (effect.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.stk.nonlinear = effect.value;
                        } else if (effect.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.stk.saturation = effect.value;
                        } else if (effect.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.stk.resonance = effect.value;
                        }
                    }
                    if (effect.type.includes("_korg35")) {
                        if (effect.name === "cutoff") {
                            wpDiodeLadderFinalHelper.current.stk.cutoff = effect.value;
                        } else if (effect.name === "resonance") {
                            wpDiodeLadderFinalHelper.current.stk.resonance = effect.value;
                        } else if (effect.name === "nonlinear") {
                            wpDiodeLadderFinalHelper.current.stk.nonlinear = effect.value;
                        } else if (effect.name === "saturation") {
                            wpDiodeLadderFinalHelper.current.stk.saturation = effect.value;
                        }
                    }
                    if (effect.type.includes("mod")) {
                        if (effect.name === "vibratoRate") {
                            modulateFinalHelper.current.stk.vibratoRate = effect.value;
                        } else if (effect.name === "vibratoGain") {
                            modulateFinalHelper.current.stk.vibratoGain = effect.value;
                        } else if (effect.name === "randomGain") {
                            modulateFinalHelper.current.stk.randomGain = effect.value;
                        }
                    }
                    if (effect.type.includes("delay_")) {
                        if (effect.name === "delay") {
                            delayFinalHelper.current.stk.delay = effect.value;
                        } else if (effect.name === "lines") {
                            delayFinalHelper.current.stk.lines = effect.value;
                        } else if (effect.name === "syncDelay") {
                            delayFinalHelper.current.stk.syncDelay = effect.value;
                        }
                    }
                    if (effect.type.includes("delayA")) {
                        if (effect.name === "delay") {
                            delayAFinalHelper.current.stk.delay = effect.value;
                        } else if (effect.name === "lines") {
                            delayAFinalHelper.current.stk.lines = effect.value;
                        } else if (effect.name === "syncDelay") {
                            delayAFinalHelper.current.stk.syncDelay = effect.value;
                        }
                    }

                    if (effect.type.includes("delayL")) {
                        if (effect.name === "delay") {
                            delayLFinalHelper.current.stk.delay = effect.value;
                        } else if (effect.name === "lines") {
                            delayLFinalHelper.current.stk.lines = effect.value;
                        } else if (effect.name === "syncDelay") {
                            delayLFinalHelper.current.stk.syncDelay = effect.value;
                        }
                    }
                    if (effect.type.includes("expDelay")) {
                        if (effect.name === "ampcurve") {
                            expDelayFinalHelper.current.stk.ampcurve = effect.value;
                        } else if (effect.name === "durcurve") {
                            expDelayFinalHelper.current.stk.durcurve = effect.value;
                        } else if (effect.name === "delay") {
                            delayLFinalHelper.current.stk.delay = effect.value;
                        } else if (effect.name === "mix") {
                            expDelayFinalHelper.current.stk.mix = effect.value;
                        } else if (effect.name === "reps") {
                            expDelayFinalHelper.current.stk.reps = effect.value;
                        }
                    }
                    if (effect.type.includes("elliptic")) {
                        if (effect.name === "lowFilter") {
                            ellipticFinalHelper.current.stk.lowFilter = effect.value;
                        } else if (effect.name === "midFilter") {
                            ellipticFinalHelper.current.stk.midFilter = effect.value;
                        } else if (effect.name === "highFilter") {
                            ellipticFinalHelper.current.stk.highFilter = effect.value;
                        } else if (effect.name === "atten") {
                            ellipticFinalHelper.current.stk.atten = effect.value;
                        } else if (effect.name === "ripple") {
                            ellipticFinalHelper.current.stk.ripple = effect.value;
                        } else if (effect.name === "filterMode") {
                            ellipticFinalHelper.current.stk.filterMode = effect.value;
                        }
                    }
                    if (effect.type.includes("spectacle")) {
                        console.log(`YA WE HIT THIS: `, spectacleFinalHelper.current.sampler);
                        if (effect.name === "bands") {
                            spectacleFinalHelper.current.stk.bands = effect.value;
                        } else if (effect.name === "delay") {
                            spectacleFinalHelper.current.stk.delay = effect.value;
                        } else if (effect.name === "eq") {
                            spectacleFinalHelper.current.stk.eq = effect.value;
                        } else if (effect.name === "feedback") {
                            spectacleFinalHelper.current.stk.feedback = effect.value;
                        } else if (effect.name === "fftlen") {
                            spectacleFinalHelper.current.stk.fftlen = effect.value;
                        } else if (effect.name === "freqMax") {
                            spectacleFinalHelper.current.stk.freqMax = effect.value;
                        } else if (effect.name === "freqMin") {
                            spectacleFinalHelper.current.stk.freqMin = effect.value;
                        } else if (effect.name === "mix") {
                            spectacleFinalHelper.current.stk.mix = effect.value;
                        } else if (effect.name === "overlap") {
                            spectacleFinalHelper.current.stk.overlap = effect.value;
                        } else if (effect.name === "table") {
                            spectacleFinalHelper.current.stk.table = effect.value;
                        }
                    }

                    else {
                        // console.log(`in the else! ///+^+^+^ ${effect.type}`)
                        //stkFXStringToChuck.current = stkFXStringToChuck.current.concat(`=> ${effect.type} ${effect.var}_stk1 `)
                    }
                } else {
                    if (!effect.preset) {
                        return '';
                    }
                    const addDurMs = effect.type.indexOf('dur') !== -1 ? '::ms' : '';
                    let formattedValue: any = effect.type.indexOf('dur') !== -1 ? `${effect.value}${addDurMs}` : `${effect.value}`;

                    if (stkFXString.current !== '') {
                        if (effect.fxType === "stk" && finalStkFxStringToChuck.current.map((stk: any) => stk.name).indexOf(effect.name) !== -1) {
                            const theIndex = finalStkFxStringToChuck.current.map((stk: any) => stk.name).indexOf(effect.name);
                            console.log("hey the stk index: ", theIndex);
                            finalStkFxStringToChuck.current[theIndex].string = `${formattedValue} => ${stk1.var}_stk1.${effect.name};`;
                            console.log("hey final stk is here: ", finalStkFxStringToChuck.current[theIndex]);
                        }
                        else {
                            const preventdupes = finalStkFxStringToChuck.current.map((i:any) => i.var).indexOf(effect.var) === -1; 
                            console.log(`PREVENT DUPES??? , ${preventdupes}`);
                            if (effect && effect.length > 0 && effect.visible === true && effect.fxType === "fx") {
                                
                                finalStkFxStringToChuck.current.push({ name: effect.name, string: `${formattedValue} => ${stk1.var}_stk1.${effect.name};` });
                                console.log(`what are we doing with this 1 finalStkFx // ${finalStkFxStringToChuck.current}`);
                                alert(`finalStkFxStringToChuck is nowwww.... ${finalStkFxStringToChuck.current}`);
                            } else {
                            console.log("PREVENTED A DUPE! ", effect.var);
                            }
                        }
                    } else {
                        if (stkFXString.current.fxType === "fx") {
                        //     stkFXString.current = `${formattedValue} => ${stk1.var}_stk1.${effect.name};`;
                            

                        
                            console.log('saniiiiity?? ', `${formattedValue} => ${stk1.var}_stk1.${effect.name};`);
                            stkFXString.current = `${formattedValue} => ${stk1.var}_stk1.${effect.name};`;
                        }
                    }
                    console.log(finalStkFxStringToChuck.current);
                    // alert(`GOT IT! ${finalStkFxStringToChuck.current}`);
                }
            });
        });
    };
    const logOnly: any = [];

    const [notesAddedDetails, setNotesAddedDetails] = useState<any>([])
    
    const organizeRows = async(rowNum: number, note: string) => {
        if (keysReady || !keysVisible) {
            return;
        }
        // noteReady is single note data returned from server
        // const noteReady = await awaitNote(note);
        


        const noteReady = {
            midiNote: undefined,
            midiHz: undefined,
            name: '',    
        };

        
        note = note.replace("♯", "#");
        const getNote: any = Note.get(note);
        noteReady.midiNote = getNote.midi;
        noteReady.midiHz = getNote.freq;
        noteReady.name = note;
        

        // const mingData = getMingusData({...noteReady, note, rowNum}); // <<< redundant
        // console.log("%cNOTEREADY", "color: magenta; ", noteReady);
 

        if (noteReady && notesAddedDetails.filter((i: any) => i.id = noteReady.name && i).length < 1) {
            setNotesAddedDetails((m: any) => [...m, noteReady]);
            setKeysReady(true);
        } else {
            return;
        }

    }

    const organizeLocalStorageRows = async(note: any) => {
        // getMingusData({...theNote});
                        // const tune = new Tune();
                // console.log("YO MICROTONES! ", microtoneDescsData);
       
                const noteReady = {
                    midiNote: undefined,
                    midiHz: undefined,
                    name: '',    
                };
        
                
                note = note.replace("♯", "#");
                // console.log("ROW NUM ", rowNum, "NOTE: ", note);
                const getNote: any = Note.get(note);
                noteReady.midiNote = getNote.midi;
                noteReady.midiHz = getNote.freq;
                noteReady.name = note;
                

        // const parsedNote = theNote.note.charAt(1) === '♯' ? theNote.note.slice(0, 2) + "-" + theNote.note.slice(2) : theNote.note.slice(0, 1) + "-" + theNote.note.slice(1);
        // const el: any = await document.getElementById(parsedNote);
        // if (el && !el['data-midiNote'] && !el['data-midiHz']) {
        //     el.classList.add(`keyRow`);
        //     el.classList.add(`keyRow_${theNote.rowNum}`);
        //     el.setAttribute('data-midiNote', await theNote.midiNote);
        //     el.setAttribute('data-midiHz', await theNote.midiHz);
        //     el.setAttribute('onClick', playChuckNote(theNote.midiHz));
        // }
    }

    function compare( a: any, b: any ) {
        if ( a.midiNote < b.midiNote ){
          return -1;
        }
        if ( a.midiNote > b.midiNote ){
          return 1;
        }
        return 0;
    };
    

    const initChuck = async () => {
        if (typeof window === 'undefined') return;
        const theChuck: any = await Chuck.init(serverFilesToPreload, undefined, 2);
        // const hid = await HID.init(theChuck); // Initialize HID with mouse and keyboard
        // hid.enableKeyboard();
        if (theChuck.context?.state === "suspended") {
            const theChuckContext: any = theChuck.context;
            theChuckContext.resume();
        }
        setChuckHook(theChuck);
        setUpdateUIAfterInit(true);
        beginProgram(true);
    };

    useEffect(()=>{

        console.log("Curr notes down display: ", currentNotesDownDisplay.current);
        console.log("curr virtual key notes display: ", currentNotesKeyValDownDisplay.current);
        
    },[currentNotesDownDisplay, currentNotesKeyValDownDisplay]);

    useEffect(() => {
        console.log('!!!!! ', allFxPersistent.current, Object.values(allFxPersistent.current.Osc1));
        
        if (allFxPersistent.current.Osc1 && allFxPersistent.current.Osc1[0] && Object.values(allFxPersistent.current.Osc1[0].presets).length > 0) {
            osc1FXToString();
        }
        if (allFxPersistent.current.Osc2 && allFxPersistent.current.Osc2[0] && Object.values(allFxPersistent.current.Osc2[0].presets).length > 0) {
            osc2FXToString();
        }
        if (allFxPersistent.current.AudioIn && allFxPersistent.current.AudioIn[0] && Object.values(allFxPersistent.current.AudioIn[0].presets).length > 0) {
            audioInFXToString();
        }
        if (allFxPersistent.current.Sampler && allFxPersistent.current.Sampler[0] && Object.values(allFxPersistent.current.Sampler[0].presets).length > 0) {
            samplerFXToString();
        }
        if (allFxPersistent.current.STK && allFxPersistent.current.STK.map((i:any) => i.fxType === "fx").length > 0 && allFxPersistent.current.STK[0].presets && Object.values(allFxPersistent.current.STK[0].presets).length > 0) {

            stkFXToString();

        }
        if (chuckUpdateNeeded) {setChuckUpdateNeeded(false)}
    }, [chuckUpdateNeeded]) // if there are problems, switch back to [${chuckUpdateNeeded}]



       useEffect(() => {
        const subscription = watch(() => handleSubmit(onSubmit)())
        console.log('SUBSCRIPTION: ', subscription);
        return () => subscription.unsubscribe();
    }, [handleSubmit, watch, register]);


    const stopChuckInstance = () => {
        // chuckHook && chuckHook?.clearChuckInstance();
        chuckHook && chuckHook.runCode(`Machine.removeAllShreds();`);
        chuckHook && chuckHook.runCode(`Machine.resetShredID();`);
        setChuckUpdateNeeded(true)
    }

    let initialShredCount = 0;

    const handleCheckedFXToShow = (msg: any) => {
        console.log("effect to show message: " + msg);
        setCheckedEffectToShow(msg);
    }

    const runMainChuckCode = async (aChuck: Chuck) => {
        if (chuckUpdateNeeded) {
            const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            console.log('Shred Count in ELSE: ', await shredCount);
            Array.from(new Array(shredCount-1)).forEach((s: any, i: number) => {
                const shredActive: any = aChuck.isShredActive(i);
                if (i < shredCount && shredActive) {
                    aChuck.runCode(`${i} => Machine.remove;`);
                }
            });
        }
        // if (chuckUpdateNeeded !== false) {setChuckUpdateNeeded(true)}
        // if (chuckUpdateNeeded === false) {
            shredCount.current = await aChuck.runCode(`Machine.numShreds();`);
            if (initialShredCount === 0) {
                initialShredCount = shredCount.current;

            }
            console.log('WHAT IS SHRED COUNT? ', shredCount.current);
            console.log('FILES TO PROCESS: ', filesToProcess);

            filesToProcess.current && 
            filesToProcess.current.length > 0 && 
            filesToProcess.current.map(async (i: any) => {
                const filename: string = i.name;
                const filedata: Uint8Array | string = i.data;
                aChuck && aChuck?.createFile("", filename, filedata);
            });

            // console.log('STK STRING HERE: ', getStk1String());
//             const connector1Stk = getStk1String && getStk1String.length > 0 ? `=> ${getStk1String[1]} ${getStk1String[2]}[12]` : '';

            // const connectorStk1DirectToDac = getStk1String && getStk1String.length > 0 && useStkDirect ? `
            //     ${getStk1String[2]} => WinFuncEnv winfuncenv_stk1 => dac; 
            //     winfuncenv_stk1.setHann(); 
            //     for (int i; i < 250; i++) { 
            //         spork ~ playWindow(winfuncenv_stk1, ${currentNoteVals.oscs[0]}, ${currentNoteVals.oscs[0]}); 
            //     }` : ``;


            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // HANDLING CHUGINS & COMPLEX TIME-BASED EFFECTS
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            const winFuncDeclarationOsc1 = osc1WinEnvOn.current ? ' WinFuncEnv winfuncenv_o1 =>' : '';

            const powerADSRDeclarationOsc1 = osc1PowerADSROn.current ? ' PowerADSR poweradsr_o1 =>' : '';
            const expEnvDeclarationOsc1 = osc1ExpEnvOn.current ? ' ExpEnv expenv_o1 =>' : '';
            const wpDiodeLadderDeclarationOsc1 = osc1WPDiodeLadderOn.current ? ' WPDiodeLadder wpdiodeladder_o1 =>' : '';
            const WPKorg35DeclarationOsc1 = osc1WPKorg35On.current ? 'saw2 => WPKorg35 wpkorg35_o1 => dac;' : '';
            const modulateDeclarationOsc1 = osc1ModulateOn.current ? 'hpf => Modulate mod_o1 => dac;' : '';
            const ellipticDeclarationOsc1 = osc1EllipticOn.current ? ' Elliptic elliptic_o1 =>' : '';
            const delayDeclarationOsc1 = osc1DelayOn.current ? `Delay delay_o1[${delayFinalHelper.current.osc1.lines}];` : '';
            const delayADeclarationOsc1 = osc1DelayAOn.current ? `DelayA delayA_o1[${delayAFinalHelper.current.osc1.lines}];` : '';
            const delayLDeclarationOsc1 = osc1DelayLOn.current ? `DelayL delayL_o1[${delayLFinalHelper.current.osc1.lines}];` : '';
            const expDelayDeclarationOsc1 = osc1ExpDelayOn.current ? ' ExpDelay expDelay_o1 =>' : '';
            const spectacleDeclarationOsc1 = osc1SpectacleOn.current ? ' => Spectacle spectacle_o1 ' : '';

            const winFuncCodeStringOsc1 = osc1WinEnvOn.current ? winFuncString('o1', winFuncEnvFinalHelper.current.osc1.attackTime, winFuncEnvFinalHelper.current.osc1.releaseTime, winFuncEnvFinalHelper.current.osc1.envSetting) : '';
            const powerADSRCodeStringOsc1 = osc1PowerADSROn.current ? powerADSRString('o1', powerADSRFinalHelper.current.osc1.attackTime, powerADSRFinalHelper.current.osc1.attackCurve, powerADSRFinalHelper.current.osc1.decayTime, powerADSRFinalHelper.current.osc1.decayCurve, powerADSRFinalHelper.current.osc1.sustainLevel, powerADSRFinalHelper.current.osc1.releaseTime, powerADSRFinalHelper.current.osc1.releaseCurve) : '';
            const expEnvCodeStringOsc1 = osc1ExpEnvOn.current ? expEnvString('o1', expEnvFinalHelper.current.osc1.T60, expEnvFinalHelper.current.osc1.radius, expEnvFinalHelper.current.osc1.value) : '';
            const wpDiodeLadderCodeStringOsc1 = osc1WPDiodeLadderOn.current ? wpDiodeLadderString('o1', wpDiodeLadderFinalHelper.current.osc1.cutoff, wpDiodeLadderFinalHelper.current.osc1.resonance, wpDiodeLadderFinalHelper.current.osc1.nlp_type, wpDiodeLadderFinalHelper.current.osc1.nonlinear, wpDiodeLadderFinalHelper.current.osc1.saturation) : '';
            const wpKorg35CodeStringOsc1 = osc1WPKorg35On.current ? wpKorg35String('o1', wpKorg35FinalHelper.current.osc1.cutoff, wpKorg35FinalHelper.current.osc1.resonance, wpKorg35FinalHelper.current.osc1.nonlinear, wpKorg35FinalHelper.current.osc1.saturation) : '';
            const modulateCodeStringOsc1 = osc1ModulateOn.current ? modulateString('o1', modulateFinalHelper.current.osc1.vibratoRate, modulateFinalHelper.current.osc1.vibratoGain, modulateFinalHelper.current.osc1.randomGain) : '';
            const ellipticCodeStringOsc1 = osc1EllipticOn.current ? ellipticString('o1', ellipticFinalHelper.current.osc1.filterLow, ellipticFinalHelper.current.osc1.filterMid, ellipticFinalHelper.current.osc1.filterHigh, ellipticFinalHelper.current.osc1.atten, ellipticFinalHelper.current.osc1.ripple, ellipticFinalHelper.current.osc1.filterMode) : '';
            const expDelayCodeStringOsc1 = osc1ExpDelayOn.current ? expDelayString('o1', expDelayFinalHelper.current.osc1.ampcurve, expDelayFinalHelper.current.osc1.durcurve, expDelayFinalHelper.current.osc1.delay, expDelayFinalHelper.current.osc1.mix, expDelayFinalHelper.current.osc1.reps, expDelayFinalHelper.current.osc1.gain) : '';
            const spectacleCodeStringOsc1 = osc1SpectacleOn.current ? spectacleString('o1', spectacleFinalHelper.current.osc1.bands, spectacleFinalHelper.current.osc1.delay, spectacleFinalHelper.current.osc1.eq, spectacleFinalHelper.current.osc1.feedback, spectacleFinalHelper.current.osc1.fftlen, spectacleFinalHelper.current.osc1.freqMax, spectacleFinalHelper.current.osc1.freqMin, spectacleFinalHelper.current.osc1.mix, spectacleFinalHelper.current.osc1.overlap, spectacleFinalHelper.current.osc1.table) : '';

            // console.log('exp delay: ', expDelayCodeStringOsc1);
            // DELAY LINES
            const delayCodeStringOsc1 = osc1DelayOn.current ? delayString('o1', delayFinalHelper.current.osc1.delay, delayFinalHelper.current.osc1.lines, delayFinalHelper.current.osc1.syncDelay, delayFinalHelper.current.osc1.zero, delayFinalHelper.current.osc1.b0, delayFinalHelper.current.osc1.b1) : '';
            const delayACodeStringOsc1 = osc1DelayAOn.current ? delayAString('o1', delayAFinalHelper.current.osc1.delay, delayAFinalHelper.current.osc1.lines, delayAFinalHelper.current.osc1.syncDelay, delayAFinalHelper.current.osc1.zero, delayAFinalHelper.current.osc1.b0, delayAFinalHelper.current.osc1.b1) : '';
            const delayLCodeStringOsc1 = osc1DelayLOn.current ? delayLString('o1', delayLFinalHelper.current.osc1.delay, delayLFinalHelper.current.osc1.lines, delayLFinalHelper.current.osc1.syncDelay, delayLFinalHelper.current.osc1.zero, delayLFinalHelper.current.osc1.b0, delayLFinalHelper.current.osc1.b1) : '';
            
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            const winFuncDeclarationSampler = samplerWinEnvOn.current ? ' WinFuncEnv winfuncenv_s1 =>' : '';
            const powerADSRDeclarationSampler = samplerPowerADSROn.current ? ' PowerADSR poweradsr_s1 =>' : '';
            const expEnvDeclarationSampler = samplerExpEnvOn.current ? ' ExpEnv expenv_s1 =>' : '';
            const wpDiodeLadderDeclarationSampler = samplerWPDiodeLadderOn.current ? ' WPDiodeLadder wpdiodeladder_s1 =>' : '';
            const WPKorg35DeclarationSampler = samplerWPKorg35On.current ? 'limiter_Sampler => WPKorg35 wpkorg35_s1 => dac;' : '';
            const modulateDeclarationSampler = samplerModulateOn.current ? ' Modulate mod_s1 =>' : '';
            const ellipticDeclarationSampler = samplerEllipticOn.current ? ' Elliptic elliptic_s1 =>' : '';
            const delayDeclarationSampler = samplerDelayOn.current ? `Delay delay_s1[${delayFinalHelper.current.sampler.lines}];` : '';
            const delayADeclarationSampler = samplerDelayAOn.current ? `DelayA delayA_s1[${delayAFinalHelper.current.sampler.lines}];` : '';
            const delayLDeclarationSampler = samplerDelayLOn.current ? `DelayL delayL_s1[${delayLFinalHelper.current.sampler.lines}];` : '';
            const expDelayDeclarationSampler = samplerExpDelayOn.current ? ' ExpDelay expDelay_s1 =>' : '';
            const spectacleDeclarationSampler = samplerSpectacleOn.current ? 'Spectacle spectacle_s1 =>' : '';

            const winFuncCodeStringSampler = samplerWinEnvOn.current ? winFuncString('s1', winFuncEnvFinalHelper.current.sampler.attackTime, winFuncEnvFinalHelper.current.sampler.releaseTime, winFuncEnvFinalHelper.current.sampler.envSetting) : '';
            const powerADSRCodeStringSampler = samplerPowerADSROn.current ? powerADSRString('s1', powerADSRFinalHelper.current.sampler.attackTime, powerADSRFinalHelper.current.sampler.attackCurve, powerADSRFinalHelper.current.sampler.decayTime, powerADSRFinalHelper.current.sampler.decayCurve, powerADSRFinalHelper.current.sampler.sustainLevel, powerADSRFinalHelper.current.sampler.releaseTime, powerADSRFinalHelper.current.sampler.releaseCurve) : '';
            const expEnvCodeStringSampler = samplerExpEnvOn.current ? expEnvString('s1', expEnvFinalHelper.current.sampler.T60, expEnvFinalHelper.current.sampler.radius, expEnvFinalHelper.current.sampler.value) : '';
            const wpDiodeLadderCodeStringSampler = samplerWPDiodeLadderOn.current ? wpDiodeLadderString('s1', wpDiodeLadderFinalHelper.current.sampler.cutoff, wpDiodeLadderFinalHelper.current.sampler.resonance, wpDiodeLadderFinalHelper.current.sampler.nlp_type, wpDiodeLadderFinalHelper.current.sampler.nonlinear, wpDiodeLadderFinalHelper.current.sampler.saturation) : '';
            const wpKorg35CodeStringSampler = samplerWPKorg35On.current ? wpKorg35String('s1', wpKorg35FinalHelper.current.sampler.cutoff, wpKorg35FinalHelper.current.sampler.resonance, wpKorg35FinalHelper.current.sampler.nonlinear, wpKorg35FinalHelper.current.sampler.saturation) : '';
            const modulateCodeStringSampler = samplerModulateOn.current ? modulateString('s1', modulateFinalHelper.current.sampler.vibratoRate, modulateFinalHelper.current.sampler.vibratoGain, modulateFinalHelper.current.sampler.randomGain) : '';
            const ellipticCodeStringSampler = samplerEllipticOn.current ? ellipticString('s1', ellipticFinalHelper.current.sampler.filterLow, ellipticFinalHelper.current.sampler.filterMid, ellipticFinalHelper.current.sampler.filterHigh, ellipticFinalHelper.current.sampler.atten, ellipticFinalHelper.current.sampler.ripple, ellipticFinalHelper.current.sampler.filterMode) : '';
            const expDelayCodeStringSampler = samplerExpDelayOn.current ? expDelayString('s1', expDelayFinalHelper.current.sampler.ampcurve, expDelayFinalHelper.current.sampler.durcurve, expDelayFinalHelper.current.sampler.delay, expDelayFinalHelper.current.sampler.mix, expDelayFinalHelper.current.sampler.reps, expDelayFinalHelper.current.sampler.gain) : '';
            const spectacleCodeStringSampler = samplerSpectacleOn.current ? spectacleString('s1', spectacleFinalHelper.current.sampler.bands, spectacleFinalHelper.current.sampler.delay, spectacleFinalHelper.current.sampler.eq, spectacleFinalHelper.current.sampler.feedback, spectacleFinalHelper.current.sampler.fftlen, spectacleFinalHelper.current.sampler.freqMax, spectacleFinalHelper.current.sampler.freqMin, spectacleFinalHelper.current.sampler.mix, spectacleFinalHelper.current.sampler.overlap, spectacleFinalHelper.current.sampler.table) : '';

            // DELAY LINES
            const delayCodeStringSampler = samplerDelayOn.current ? delayString('s1', delayFinalHelper.current.sampler.delay, delayFinalHelper.current.sampler.lines, delayFinalHelper.current.sampler.syncDelay, delayFinalHelper.current.sampler.zero, delayFinalHelper.current.sampler.b0, delayFinalHelper.current.sampler.b1) : '';
            const delayACodeStringSampler = samplerDelayAOn.current ? delayAString('s1', delayAFinalHelper.current.sampler.delay, delayAFinalHelper.current.sampler.lines, delayAFinalHelper.current.sampler.syncDelay, delayAFinalHelper.current.sampler.zero, delayAFinalHelper.current.sampler.b0, delayAFinalHelper.current.sampler.b1) : '';
            const delayLCodeStringSampler = samplerDelayLOn.current ? delayLString('s1', delayLFinalHelper.current.sampler.delay, delayLFinalHelper.current.sampler.lines, delayLFinalHelper.current.sampler.syncDelay, delayLFinalHelper.current.sampler.zero, delayLFinalHelper.current.sampler.b0, delayLFinalHelper.current.sampler.b1) : '';


            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


            // const newStkFXString = useRef<string>('');
            const winFuncDeclarationStk = stkWinEnvOn.current ? ' WinFuncEnv winfuncenv_stk1 =>' : '';
            const powerADSRDeclarationStk = stkPowerADSROn.current ? ' PowerADSR poweradsr_stk1 =>' : '';
            const expEnvDeclarationStk = stkExpEnvOn.current ? ' ExpEnv expenv_stk1 =>' : '';
            const wpDiodeLadderDeclarationStk = stkWPDiodeLadderOn.current ? ' WPDiodeLadder wpdiodeladder_stk1 =>' : '';
            const WPKorg35DeclarationStk = stkWPKorg35On.current ? 'limiter_STK => WPKorg35 wpkorg35_stk1 => dac;' : '';
            const modulateDeclarationStk = stkModulateOn.current ? ' Modulate mod_stk1 =>' : '';
            const ellipticDeclarationStk = stkEllipticOn.current ? ' Elliptic elliptic_stk1 =>' : '';
            const delayDeclarationStk = stkDelayOn.current ? `Delay delay_stk1[${delayFinalHelper.current.stk.lines}];` : '';
            const delayADeclarationStk = stkDelayAOn.current ? `DelayA delayA_stk1[${delayAFinalHelper.current.stk.lines}];` : '';
            const delayLDeclarationStk = stkDelayLOn.current ? `DelayL delayL_stk1[${delayLFinalHelper.current.stk.lines}];` : '';
            const expDelayDeclarationStk = stkExpDelayOn.current ? ' ExpDelay expDelay_stk1 =>' : '';
            const spectacleDeclarationStk = stkSpectacleOn.current ? 'Spectacle spectacle_stk1 =>' : '';

        
            const winFuncCodeStringStk = stkWinEnvOn.current ? winFuncString('stk1', winFuncEnvFinalHelper.current.stk.attackTime, winFuncEnvFinalHelper.current.stk.releaseTime, winFuncEnvFinalHelper.current.stk.envSetting) : '';
            const powerADSRCodeStringStk = stkPowerADSROn.current ? powerADSRString('stk1', powerADSRFinalHelper.current.stk.attackTime, powerADSRFinalHelper.current.stk.attackCurve, powerADSRFinalHelper.current.stk.decayTime, powerADSRFinalHelper.current.stk.decayCurve, powerADSRFinalHelper.current.stk.sustainLevel, powerADSRFinalHelper.current.stk.releaseTime, powerADSRFinalHelper.current.stk.releaseCurve) : '';
            const expEnvCodeStringStk = stkExpEnvOn.current ? expEnvString('stk1', expEnvFinalHelper.current.stk.T60, expEnvFinalHelper.current.stk.radius, expEnvFinalHelper.current.stk.value) : '';
            const wpDiodeLadderCodeStringStk = stkWPDiodeLadderOn.current ? wpDiodeLadderString('stk1', wpDiodeLadderFinalHelper.current.stk.cutoff, wpDiodeLadderFinalHelper.current.stk.resonance, wpDiodeLadderFinalHelper.current.stk.nlp_type, wpDiodeLadderFinalHelper.current.stk.nonlinear, wpDiodeLadderFinalHelper.current.stk.saturation) : '';
            const wpKorg35CodeStringStk = stkWPKorg35On.current ? wpKorg35String('stk1', wpKorg35FinalHelper.current.stk.cutoff, wpKorg35FinalHelper.current.stk.resonance, wpKorg35FinalHelper.current.stk.nonlinear, wpKorg35FinalHelper.current.stk.saturation) : '';
            const modulateCodeStringStk = stkModulateOn.current ? modulateString('stk1', modulateFinalHelper.current.stk.vibratoRate, modulateFinalHelper.current.stk.vibratoGain, modulateFinalHelper.current.stk.randomGain) : '';
            const ellipticCodeStringStk = stkEllipticOn.current ? ellipticString('stk1', ellipticFinalHelper.current.stk.filterLow, ellipticFinalHelper.current.stk.filterMid, ellipticFinalHelper.current.stk.filterHigh, ellipticFinalHelper.current.stk.atten, ellipticFinalHelper.current.stk.ripple, ellipticFinalHelper.current.stk.filterMode) : '';
            const expDelayCodeStringStk = stkExpDelayOn.current ? expDelayString('stk1', expDelayFinalHelper.current.stk.ampcurve, expDelayFinalHelper.current.stk.durcurve, expDelayFinalHelper.current.stk.delay, expDelayFinalHelper.current.stk.mix, expDelayFinalHelper.current.stk.reps, expDelayFinalHelper.current.stk.gain) : '';
            const spectacleCodeStringStk = stkSpectacleOn.current ? spectacleString('stk1', spectacleFinalHelper.current.stk.bands, spectacleFinalHelper.current.stk.delay, spectacleFinalHelper.current.stk.eq, spectacleFinalHelper.current.stk.feedback, spectacleFinalHelper.current.stk.fftlen, spectacleFinalHelper.current.stk.freqMax, spectacleFinalHelper.current.stk.freqMin, spectacleFinalHelper.current.stk.mix, spectacleFinalHelper.current.stk.overlap, spectacleFinalHelper.current.stk.table) : '';

            // DELAY LINES
            const delayCodeStringStk = stkDelayOn.current ? delayString('stk1', delayFinalHelper.current.stk.delay, delayFinalHelper.current.stk.lines, delayFinalHelper.current.stk.syncDelay, delayFinalHelper.current.stk.zero, delayFinalHelper.current.stk.b0, delayFinalHelper.current.stk.b1) : '';
            const delayACodeStringStk = stkDelayAOn.current ? delayAString('stk1', delayAFinalHelper.current.stk.delay, delayAFinalHelper.current.stk.lines, delayAFinalHelper.current.stk.syncDelay, delayAFinalHelper.current.stk.zero, delayAFinalHelper.current.stk.b0, delayAFinalHelper.current.stk.b1) : '';
            const delayLCodeStringStk = stkDelayLOn.current ? delayLString('stk1', delayLFinalHelper.current.stk.delay, delayLFinalHelper.current.stk.lines, delayLFinalHelper.current.stk.syncDelay, delayLFinalHelper.current.stk.zero, delayLFinalHelper.current.stk.b0, delayLFinalHelper.current.stk.b1) : '';
                    

            let chuckCode = "";

            ////////////////////////////
            console.log("what are STKS? ", stkFX.current);
            ////////////////////////////


            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // HANDLING CHUCK UGEN => DAC DECLARATIONS 
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // NOTE! => I removed ${connector1stk} from between saw1 & diodeladder below... this was breaking longer playing stks (& all else when they were chosen).
            const osc1ChuckToOutlet: string = ` SawOsc saw1 => ${wpDiodeLadderDeclarationOsc1} LPF lpf => ADSR adsr => Dyno limiter ${osc1FXStringToChuck.current} => ${winFuncDeclarationOsc1} ${ellipticDeclarationOsc1} ${powerADSRDeclarationOsc1} ${expEnvDeclarationOsc1} ${expDelayDeclarationOsc1} outlet;`;

            const samplerChuckToOutlet: string = `limiter_Sampler ${samplerFXStringToChuck.current} => ${winFuncDeclarationSampler} ${ellipticDeclarationSampler} ${powerADSRDeclarationSampler} ${expEnvDeclarationSampler} ${expDelayDeclarationSampler} ${modulateDeclarationSampler} `;
            const transitionhandlerSimpleToComplex = stkFXStringToChuck.current.length > 0 ? `=>` : ``;
   
            const stkChuckToOutlet: string = `${stkFXStringToChuck.current} ${transitionhandlerSimpleToComplex} ${winFuncDeclarationStk} ${ellipticDeclarationStk} ${powerADSRDeclarationStk} ${expEnvDeclarationStk} ${expDelayDeclarationStk} ${modulateDeclarationStk} `;
            
            osc1FxStringNeedsBlackhole.current = osc1FxStringToChuckNeedsBlackhole.current.length > 0 ? `voice[i] ${osc1FxStringToChuckNeedsBlackhole.current[0].string}` : '';

            samplerFxStringNeedsBlackhole.current = samplerFxStringToChuckNeedsBlackhole.current.length > 0 ? `sample1 ${samplerFxStringToChuckNeedsBlackhole.current[0].string}` : '';
            stkFxStringNeedsBlackhole.current = stkFxStringToChuckNeedsBlackhole.current.length > 0 ? `sample1 ${stkFxStringToChuckNeedsBlackhole.current[0].string}` : '';

            const osc2ChuckToOutlet: string = ` SawOsc saw2 => lpf;`;

            const finalOsc1Code = finalOsc1FxStringToChuck.current && finalOsc1FxStringToChuck.current.length > 0 ? finalOsc1FxStringToChuck.current.map((i: any) => i.string).join(' ').replace(',', '') : '';
            const finalSamplerCode = finalSamplerFxStringToChuck.current && finalSamplerFxStringToChuck.current.length > 0 ? finalSamplerFxStringToChuck.current.map((i: any) => i.string).join(' ').replace(',', '') : '';
            // const finalStkCode = finalStkFxStringToChuck.current && finalStkFxStringToChuck.current.length > 0 ? finalStkFxStringToChuck.current.map((i: any) => i.string).join(' ').replace(',', '') : '';
            const finalStkCode = finalStkFxStringToChuck.current && finalStkFxStringToChuck.current.length > 0 ? finalStkFxStringToChuck.current.map((i: any) => i.string).join(' ').replace(',', '') : '';

            
            // bring back sync mode on this eventually -> // ${parseInt(moogGrandmotherEffects.current.syncMode.value)} => saw1.sync => saw2.sync => tri1.sync => tri2.sync => sqr1.sync => sqr2.sync;
            //  allAnalysisBlocks.current.forEach((block: any) => allAnalysisBlocksCodeGen.concat(block.code));

       
            const filesArray = filesToProcess.current.map((f: any) => f.name) || [];

        
            // BE SURE TO ADD DURATION DIVISIONS (AND ALSO ELSEWHERE)
            const playSTKOn = () => {
                
                let getFXOnly = allFxPersistent.current.STK.filter((i: any) => i.fxType === "stk" && i);
                if (stkFX.current && stkFX.current.length > 0 || (!getFXOnly || getFXOnly.length < 1) ) {
                        allFxPersistent.current.STK.push(stkFX.current);
                        getFXOnly = [stkFX.current];
                } 
                
                if (getFXOnly && getFXOnly.length > 0 && getFXOnly[0].var) {
                    
                    console.log("getFXOnly_var: ", getFXOnly[0].var);
   
                    if (getFXOnly[0].var === "sit") {                     
                        return `
                    
                            ${stkFX.current.presets.pluck.value} => ${getFXOnly[0].var}[i-1].pluck;
                            notesToPlay[i] + 36 => Std.mtof => ${getFXOnly[0].var}[i-1].freq;
                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].noteOn;  
                            0.01/notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                            
                            if (${stkArpeggiatorOn} == 1) {
                                // duration * ${numeratorSignature} - (now % duration  * ${numeratorSignature} )  => now;
                                duration - (now % duration)  => now;
                                1 =>  ${getFXOnly[0].var}[i-1].noteOff; 
                            }
                        `;
                    } else if (getFXOnly[0].var === "bow") {
                        return `
                        ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                        ${stkFX.current.presets.bowPressure.value} => ${getFXOnly[0].var}[i-1].bowPressure;
                        ${stkFX.current.presets.bowPosition.value} => ${getFXOnly[0].var}[i-1].bowPosition;
                        ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                        ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.startBowing.value} => ${getFXOnly[0].var}[i-1].startBowing;
                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBowing.value} => ${getFXOnly[0].var}[i-1].stopBowing;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }
                        `;
                    } else if (getFXOnly[0].var === "wg") {
                        return `
                            // ${stkFX.current.presets.bowMotion.value} => ${getFXOnly[0].var}[i-1].bowMotion;
                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.strikePosition.value} => ${getFXOnly[0].var}[i-1].strikePosition;
                            ${stkFX.current.presets.gain.value} => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.preset.value} => ${getFXOnly[0].var}[i-1].preset;
                            ${stkFX.current.presets.bowRate.value} => ${getFXOnly[0].var}[i-1].bowRate;
                            ${stkFX.current.presets.pluck.value} => ${getFXOnly[0].var}[i-1].pluck;
                            ${stkFX.current.presets.startBowing.value} => ${getFXOnly[0].var}[i-1].startBowing;
                   
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBowing.value} => ${getFXOnly[0].var}[i-1].stopBowing;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }
                        `;
                    } else if (getFXOnly[0].var === "blwbtl") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.noiseGain.value} => ${getFXOnly[0].var}[i-1].noiseGain;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            
                            notesToPlay[i] + 36 => Std.mtof => ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.startBlowing.value} => ${getFXOnly[0].var}[i-1].startBlowing;
                           
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                            }
                        `;
                    } else if (getFXOnly[0].var === "brs") {
                        return `
                            notesToPlay[i] + 36 => Std.mtof => ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;    
                            ${stkFX.current.presets.startBlowing.value} => ${getFXOnly[0].var}[i-1].startBlowing;    
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;
                            ${stkFX.current.presets.volume.value} => ${getFXOnly[0].var}[i-1].volume;
                            ${stkFX.current.presets.lip.value} => ${getFXOnly[0].var}[i-1].lip;
                            ${stkFX.current.presets.slide.value} => ${getFXOnly[0].var}[i-1].slide;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            
                            ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;

                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }
                        `;
                    } else if (getFXOnly[0].var === "shak") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.energy.value} => ${getFXOnly[0].var}[i-1].energy;
                            ${stkFX.current.presets.preset.value} => ${getFXOnly[0].var}[i-1].preset;
                            ${stkFX.current.presets.objects.value} => ${getFXOnly[0].var}[i-1].objects;
                            ${stkFX.current.presets.decay.value} => ${getFXOnly[0].var}[i-1].decay;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }
                        `;
                    } else if (getFXOnly[0].var === "mdlbr") {
                        return `
                            ${stkFX.current.presets.stickHardness.value} => ${getFXOnly[0].var}[i-1].stickHardness;
                            ${stkFX.current.presets.strikePosition.value} => ${getFXOnly[0].var}[i-1].strikePosition;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            ${stkFX.current.presets.directGain.value} => ${getFXOnly[0].var}[i-1].directGain;
                            ${stkFX.current.presets.masterGain.value} => ${getFXOnly[0].var}[i-1].masterGain;
                            ${stkFX.current.presets.preset.value} => ${getFXOnly[0].var}[i-1].preset;
                            ${stkFX.current.presets.volume.value} => ${getFXOnly[0].var}[i-1].volume;
                            ${stkFX.current.presets.strike.value} => ${getFXOnly[0].var}[i-1].strike;
                            ${stkFX.current.presets.damp.value} => ${getFXOnly[0].var}[i-1].damp;


                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }
                        `;
                    } else if (getFXOnly[0].var === "flut") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.jetDelay.value} => ${getFXOnly[0].var}[i-1].jetDelay;
                            ${stkFX.current.presets.jetReflection.value} => ${getFXOnly[0].var}[i-1].jetReflection;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;

                            ${stkFX.current.presets.noiseGain.value} => ${getFXOnly[0].var}[i-1].noiseGain;
                            ${stkFX.current.presets.pressure.value} => ${getFXOnly[0].var}[i-1].pressure;


                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.startBlowing.value} => ${getFXOnly[0].var}[i-1].startBlowing;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;
                            ${stkFX.current.presets.endReflection.value} => ${getFXOnly[0].var}[i-1].endReflection;
                            
                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "clair") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.reed.value} => ${getFXOnly[0].var}[i-1].reed;
                            ${stkFX.current.presets.noiseGain.value} => ${getFXOnly[0].var}[i-1].noiseGain;
                            ${stkFX.current.presets.pressure.value} => ${getFXOnly[0].var}[i-1].pressure;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;

                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;


                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.startBlowing.value} => ${getFXOnly[0].var}[i-1].startBlowing;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "f") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                           
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "m") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.pickupPosition.value} => ${getFXOnly[0].var}[i-1].pickupPosition;
                            ${stkFX.current.presets.sustain.value} => ${getFXOnly[0].var}[i-1].sustain;
                            ${stkFX.current.presets.stretch.value} => ${getFXOnly[0].var}[i-1].stretch;
                            ${stkFX.current.presets.pluck.value} => ${getFXOnly[0].var}[i-1].pluck;
                            ${stkFX.current.presets.baseLoopGain.value} => ${getFXOnly[0].var}[i-1].baseLoopGain;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "prcflt") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "man") {
                        return `
                            ${stkFX.current.presets.bodySize.value} => ${getFXOnly[0].var}[i-1].bodySize;
                            ${stkFX.current.presets.pluckPos.value} => ${getFXOnly[0].var}[i-1].pluckPos;
                            ${stkFX.current.presets.stringDamping.value} => ${getFXOnly[0].var}[i-1].stringDamping;
                            ${stkFX.current.presets.stringDetune.value} => ${getFXOnly[0].var}[i-1].stringDetune;
                            ${stkFX.current.presets.pluck.value} => ${getFXOnly[0].var}[i-1].pluck;

                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;

                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "tubbl") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 48 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "blwhl") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            
                            ${stkFX.current.presets.reed.value} => ${getFXOnly[0].var}[i-1].reed;
                            ${stkFX.current.presets.noiseGain.value} => ${getFXOnly[0].var}[i-1].noiseGain;
                            ${stkFX.current.presets.tonehole.value} => ${getFXOnly[0].var}[i-1].tonehole;
                            ${stkFX.current.presets.vent.value} => ${getFXOnly[0].var}[i-1].vent;
                            ${stkFX.current.presets.pressure.value} => ${getFXOnly[0].var}[i-1].pressure;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;                                

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } 
                    else if (getFXOnly[0].var === "voic") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.size() => ${getFXOnly[0].var}[i-1].gain;
                            

                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;

                            

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.speak.value} => ${getFXOnly[0].var}[i-1].speak;
                            ${stkFX.current.presets.phonemeNum.value} => ${getFXOnly[0].var}[i-1].phonemeNum;
                            duration - (now % duration)  => now;
                            if (${stkArpeggiatorOn} == 1) {
                                ${stkFX.current.presets.quiet.value} => ${getFXOnly[0].var}[i-1].quiet;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;

                            }`;
                    }
                    else if (getFXOnly[0].var === "sax") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                            
                            ${stkFX.current.presets.stiffness.value} => ${getFXOnly[0].var}[i-1].stiffness;
                            ${stkFX.current.presets.aperture.value} => ${getFXOnly[0].var}[i-1].aperture;
                            ${stkFX.current.presets.pressure.value} => ${getFXOnly[0].var}[i-1].pressure;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            ${stkFX.current.presets.rate.value} => ${getFXOnly[0].var}[i-1].rate;              
                            ${stkFX.current.presets.blowPosition.value} => ${getFXOnly[0].var}[i-1].blowPosition;
                            ${stkFX.current.presets.noiseGain.value} => ${getFXOnly[0].var}[i-1].noiseGain;                  

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;
                            ${stkFX.current.presets.startBlowing.value} => ${getFXOnly[0].var}[i-1].startBlowing;  

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;  
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "bthree") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 12 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                        
                    } else if (getFXOnly[0].var === "fmVoic") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.vowel.value} => ${getFXOnly[0].var}[i-1].vowel;
                            ${stkFX.current.presets.spectralTilt.value} => ${getFXOnly[0].var}[i-1].spectralTilt;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                        
                    } 
                    
                    else if (stkFX.current === "voic") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                    
                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            ${stkFX.current.presets.phonemeNum.value} => ${getFXOnly[0].var}[i-1].phonemeNum;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            ${stkFX.current.presets.quiet.value} => ${getFXOnly[0].var}[i-1].quiet;

                            
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                        }`;
                    } 
                    
                    else if (getFXOnly[0].var === "krstl") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                        
                    } else if (getFXOnly[0].var === "rod") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "wur") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "mog") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.filterQ.value} => ${getFXOnly[0].var}[i-1].filterQ;
                            ${stkFX.current.presets.filterSweepRate.value} => ${getFXOnly[0].var}[i-1].filterSweepRate;
                            ${stkFX.current.presets.vibratoFreq.value} => ${getFXOnly[0].var}[i-1].vibratoFreq;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.vibratoGain.value} => ${getFXOnly[0].var}[i-1].vibratoGain;
                            ${stkFX.current.presets.afterTouch.value} => ${getFXOnly[0].var}[i-1].afterTouch;
                            ${stkFX.current.presets.modDepth.value} => ${getFXOnly[0].var}[i-1].modDepth;
                            ${stkFX.current.presets.modSpeed.value} => ${getFXOnly[0].var}[i-1].modSpeed;

                            notesToPlay[i] + 36 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "hevymetl") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    } else if (getFXOnly[0].var === "hnkytonk") {
                        return `
                            ${stkFX.current.presets.gain.value} / notesToPlay.cap() => ${getFXOnly[0].var}[i-1].gain;
                                
                            ${stkFX.current.presets.controlOne.value} => ${getFXOnly[0].var}[i-1].controlOne;
                            ${stkFX.current.presets.controlTwo.value} => ${getFXOnly[0].var}[i-1].controlTwo;
                            ${stkFX.current.presets.lfoSpeed.value} => ${getFXOnly[0].var}[i-1].lfoSpeed;
                            ${stkFX.current.presets.lfoDepth.value} => ${getFXOnly[0].var}[i-1].lfoDepth;

                            notesToPlay[i] + 24 => Std.mtof =>  ${getFXOnly[0].var}[i-1].freq;
                            1 => ${getFXOnly[0].var}[i-1].noteOn;

                            
                            if (${stkArpeggiatorOn} == 1) {
                                duration - (now % duration)  => now;
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            }`;
                    }


 

  
        // } else if (name === "voic") { // <-- buggy ... needs another look



                }

            }

            const playSTKOff = () => {
                let getFXOnly = allFxPersistent.current.STK.filter((i: any) => i.fxType === "stk" && i);
                if (stkFX.current && stkFX.current.length > 0 || (!getFXOnly || getFXOnly.length < 1) ) {
                    getFXOnly = [stkFX.current];
                }
                if (getFXOnly && getFXOnly.length > 0 && getFXOnly[0].var) {
             
                    if (getFXOnly[0].var === "sit") {                     
                        return `1 =>  ${getFXOnly[0].var}[i-1].noteOff;`;
                    } else if (getFXOnly[0].var === "bow") {
                        return `
                            ${stkFX.current.presets.stopBowing.value} => ${getFXOnly[0].var}[i-1].stopBowing;
                            1 => ${getFXOnly[0].var}[i-1].noteOff;
                        `;
                    } else if (getFXOnly[0].var === "wg") {
                        return `
                            ${stkFX.current.presets.stopBowing.value} => ${getFXOnly[0].var}[i-1].stopBowing;
                            1 => ${getFXOnly[0].var}[i-1].noteOff;
                        `;
                    } else if (getFXOnly[0].var === "blwbtl") {
                        return `
                            ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                        `;
                    } else if (getFXOnly[0].var === "brs") {
                       
                        return `
                            ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                            1 => ${getFXOnly[0].var}[i-1].noteOff;
                        `;
                    } else if (getFXOnly[0].var === "shak") {
                        return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                    } else if (getFXOnly[0].var === "mdlbr") {
                        return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                    } else if (getFXOnly[0].var === "flut") {
                        return `                            
                            ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                            1 => ${getFXOnly[0].var}[i-1].noteOff;
                        `;
                    } else if (getFXOnly[0].var === "clair") {
                        return `                            
                            ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;
                            1 => ${getFXOnly[0].var}[i-1].noteOff;
                        `;
                    } else if (getFXOnly[0].var === "f") {
                        return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "m") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "prcflt") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "man") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "tubbl") {
                            return `                                
                                1 => ${getFXOnly[0].var}[i-1].noteOff;
                            `;
                        } else if (getFXOnly[0].var === "blwhl") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } 
                        else if (getFXOnly[0].var === "voic") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        }
                        else if (getFXOnly[0].var === "sax") {
                            return `                                
                                    ${stkFX.current.presets.stopBlowing.value} => ${getFXOnly[0].var}[i-1].stopBlowing;  
                                    1 => ${getFXOnly[0].var}[i-1].noteOff;
                                `;
                        } else if (getFXOnly[0].var === "bthree") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                          
                        } else if (getFXOnly[0].var === "fmVoic") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                          
                        } 
                        else if (stkFX.current === "voic") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } 
                        
                        else if (getFXOnly[0].var === "krstl") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                          
                        } else if (getFXOnly[0].var === "rod") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "wur") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "mog") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "hevymetl") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        } else if (getFXOnly[0].var === "hnkytonk") {
                            return `1 => ${getFXOnly[0].var}[i-1].noteOff;`;
                        }

                } else {
                    return ``;
                }
            }
            
            
            // virtualKeyMapDown.current = await virtualKeyMapping(48, 1);

            // virtualKeyMapUp.current = currentNotesDownDisplay.current.length > 1 ? await virtualKeyMapping(48, 0) : "";

    
            stkOn.current = await playSTKOn() || '';

            stkPolyKeyOff.current = await playSTKOff(); 
                        
    
            const stkShouldPlay = () => {
                if (stkFX.current && stkFX.current.length > 0 && stkFX.current.filter((i: any) => i.fxType === "stk" && i).length > 0) {
                    return 1;
                } else {
                    return 0;
                };
            } 
            const SHD_STK_PLAY = stkShouldPlay(); 
            console.log("SHOULD STK PLAY??? ", SHD_STK_PLAY);
            console.log("NORMALIZED!! ", normalizedCentroids.current);
            chuckCode = `
            
            [${Object.keys(currNotesHash.current)}] @=> int notes[];
            
            0 => int device;
            
            // Hid hid;
            // HidMsg msg;
            
            // if( !hid.openKeyboard( device ) ) me.exit();
            // <<< "keyboard '" + hid.name() + "' ready", "" >>>;
            
            ((60.0 / ${bpm})) => float secLenBeat;
            (secLenBeat * 1000)::ms => dur beat;


            Dyno limiter_Sampler;
            Dyno limiter_STK;
            
            ((secLenBeat * 1000) * 2)::ms => dur whole;
            (secLenBeat * ${numeratorSignature} * ${denominatorSignature})::ms => dur bar;
                
            MLP model;
            



            private class UniversalAnalyzer {
                FeatureCollector combo => blackhole;
                FFT fft;
                Flux flux;
                RMS rms;
                MFCC mfcc;
                Centroid centroid;
                RollOff rolloff;
                Chroma chroma;
                Kurtosis kurtosis;
                DCT dct;
                Flip flip;
                ZeroX zerox;
                SFM sfm;
                "" => string mfccString;
                "" => string chromaString; 
                string the_sfm;
                
                private class TrackingFile
                {
                    static float the_freq;
                    static float the_gain;
                    
                    static float the_kurtosis;
                    static Event @ the_event;
                }
            
                fun void declarationCode(UGen @ source) {
                    source => fft;
                    fft =^ centroid =^ combo;
                    fft =^ flux =^ combo;
                    fft =^ rms =^ combo;
                    fft =^ mfcc =^ combo;
                    fft =^ rolloff =^ combo;
                    fft =^ chroma =^ combo;
                    fft =^ kurtosis => blackhole;
                    source => dct => blackhole;
                    source => flip =^ zerox => blackhole;
                
                    fft =^ sfm => blackhole;

                    int div;

                    //-----------------------------------------------------------------------------
                    // setting analysis parameters -- also should match what was used during extration
                    //-----------------------------------------------------------------------------
                    // set flip size (N)
            
                    // output in [-1,1]
                    // calculate sample rate
                    second/samp => float srate;
            
                    // set number of coefficients in MFCC (how many we get out)
                    // 13 is a commonly used value; using less here for printing
                    20 => mfcc.numCoeffs;
                    // set number of mel filters in MFCC
                    10 => mfcc.numFilters;
            
                    // do one .upchuck() so FeatureCollector knows how many total dimension
                    combo.upchuck();
            
                    // get number of total feature dimensions
                    combo.fvals().size() => int NUM_DIMENSIONS;
            
                    // set FFT size (do we need 4410 for file?)
                    // 4096 => fft.size;
                    4410 => fft.size;
                    // set window type and size
                    Windowing.hann(fft.size()) => fft.window;
                    // our hop size (how often to perform analysis)
                    (fft.size()/2)::samp => dur HOP;
                    // how many frames to aggregate before averaging?
                    // (this does not need to match extraction; might play with this number) ***
                    3 => int NUM_FRAMES;
                    // how much time to aggregate features for each file
                    fft.size()::samp * NUM_FRAMES => dur EXTRACT_TIME;
            
                    // initialize separately (due to a bug)
                    new Event @=> TrackingFile.the_event;
            
                    // analysis
                    source => PoleZero dcblock => FFT fftTrack => blackhole;
            
                    // set to block DC
                    .99 => dcblock.blockZero;

                    "" => mfccString;
                    for (0 => int i; i < mfcc.fvals().cap(); i++) {
                        if (i < mfcc.fvals().cap() - 1) {
                            mfcc.fvals()[i] + ", "  +=> mfccString;
                        } else {
                            mfcc.fvals()[i] +=> mfccString;
                        }
                    }
                
                    "" => chromaString;
                    for (0 => int i; i < chroma.fvals().cap() - 1; i++) {
                        if (i < chroma.fvals().cap() - 2) {
                            chroma.fvals()[i] + ", " +=> chromaString;
                        } else {
                            chroma.fvals()[i] +=> chromaString;
                        }
                    }

                    fft.upchuck() @=> UAnaBlob blob;
                    0 => float max; float where;
                    for( int i; i < blob.fvals().size()/8; i++ )
                    {
                        // compare
                        if( blob.fvals()[i] > max )
                        {
                            // save
                            blob.fvals()[i] => max;
                            i => where;
                        }
                    }

                    (where / fft.size() * (second / samp)) => this.TrackingFile.the_freq;
                    (max / .5) => this.TrackingFile.the_gain;
                    if( this.TrackingFile.the_gain > 1 )
                        1 => this.TrackingFile.the_gain;
        

                    kurtosis.fval(0) => this.TrackingFile.the_kurtosis;
                    this.TrackingFile.the_event.broadcast();

                    dct.size()/2 %=> div;

                    // take dct
                    dct.upchuck();

                    zerox.upchuck() @=> UAnaBlob blobZero;



                    [[0.0]] @=> float singleInputArr[][];
                    [[0.0]] @=> float storedInputArr[][];
                    [[0.0]] @=> float oldestStoredInputArr[][];



                    <<< "FEATURES: " 
                    + "/centroid: "
                    + centroid.fval(0) + " " 
                    + "/flux: " 
                    + flux.fval(0) + " "
                    + "/rms: " 
                    + rms.fval(0) + " "
                    + "/mfcc: " 
                    + mfccString + " "
                    + "/rolloff: " 
                    + rolloff.fval(0) + " "
                    + "/chroma: " 
                    + chromaString + " "
                    + "/freq: "
                    + this.TrackingFile.the_freq + " "
                    + "/gain: " 
                    + this.TrackingFile.the_gain + " "
                    + "/dct: " 
                    + dct.fval(0) + " "
                    + dct.fval(1) + " "
                    + dct.fval(2) + " "
                    + dct.fval(3) + " "
                    + "/kurtosis: "
                    + this.TrackingFile.the_kurtosis + " "
                    + "/zerox: " 
                    + blobZero.fvals()[0] + " " >>>;

                    if(storedInputArr != [[0.0]]) {
                        storedInputArr @=> oldestStoredInputArr;
                    } 

                    if (singleInputArr != [[0.0]]) {
                        singleInputArr @=> storedInputArr;
                    } 

                    [
                        [centroid.fval(0)],
                        [flux.fval(0)],
                        [rms.fval(0)],
                        // [mfccString],
                        [rolloff.fval(0)],
                        // [chromaString],
                        [this.TrackingFile.the_freq],
                        [this.TrackingFile.the_gain],
                        [dct.fval(0)],
                        [dct.fval(1)],
                        [dct.fval(2)],
                        [dct.fval(3)],
                        [this.TrackingFile.the_kurtosis],
                        [blobZero.fvals()[0]]
                    ] @=> singleInputArr;



                    if (oldestStoredInputArr != [[0.0]]) {

                        model.init([12, 5, 5, 12]);

                        oldestStoredInputArr @=> float X[][];
                        // output observations
                        storedInputArr @=> float Y[][];
                        model.train(X,Y,0.1, 100);
                        [
                            centroid.fval(0),
                            flux.fval(0),
                            rms.fval(0),
                            rolloff.fval(0),
                            this.TrackingFile.the_freq,
                            this.TrackingFile.the_gain,
                            dct.fval(0),
                            dct.fval(1),
                            dct.fval(2),
                            dct.fval(3),
                            this.TrackingFile.the_kurtosis,
                            blobZero.fvals()[0]
                        ] @=> float x[];
                        // array to how output
                        float y[12];
                        // predict output given input
                        model.predict(x, y);
                        // print the output -- this is the minimal implementation (needs quite a bit of thought & will wait til all sources are in)
                        <<< "PREDICTIONS: ", y[0], y[1], y[2], y[3], y[4], y[5], y[6], y[7], y[8], y[9], y[10], y[11] >>>;
                    }

                    // me.yield();
                }
                me.yield();
            }
            
        

            class SynthVoice extends Chugraph
                {
        
                    ${osc1ChuckToOutlet}
            
                    // saw1 ${osc1FXStringToChuck.current} => dac;
                    ${osc2ChuckToOutlet}
            
                    // declarations for complex effects
                    ${WPKorg35DeclarationOsc1}          
                    ${ellipticCodeStringOsc1}
                    ${winFuncCodeStringOsc1}
                    ${powerADSRCodeStringOsc1}
                    ${expEnvCodeStringOsc1}
                    ${wpDiodeLadderCodeStringOsc1}
                    ${wpKorg35CodeStringOsc1}
                    ${expDelayCodeStringOsc1}
            
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
            
                    0.06 => saw1.gain => saw2.gain;
                    0.28 => tri1.gain => tri2.gain;
                    0.12 => sqr1.gain => sqr2.gain;
            
                    10.0 => float filterCutoff;
                    filterCutoff => lpf.freq;
            
            
                    ${parseInt(moogGrandmotherEffects.current.adsrAttack.value)}::ms => adsr.attackTime;
                    ${parseInt(moogGrandmotherEffects.current.adsrDecay.value)}::ms => adsr.decayTime;
                    ${moogGrandmotherEffects.current.adsrSustain.value} => adsr.sustainLevel;
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
                            // <<< "IN HERE" >>>;                      
                            adsr.releaseTime() => now;
                            1 => adsr.keyOff;
                            
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
                        // 10::ms => now;
                        whole/4 => now;
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
                        <<< "hit this stk1" >>>;
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
                        5000 * (amount / 100) => filterLfo.gain;
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
            
                SynthVoice voice[12] ${osc1FXStringToChuck.current} ${spectacleDeclarationOsc1} => HPF hpf => Gain oscs_masterGain => dac;
                
                0.7 => oscs_masterGain.gain;
                
                <<< "(from ChucK) NOTES: ", notes.cap() >>>;

                if (${arpeggiatorOn} == 0 && notes.cap() > 0) {
                    oscs_masterGain.gain() / notes.cap() => oscs_masterGain.gain;
                }

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
            
                ${finalOsc1Code}
            
                ${moogGrandmotherEffects.current.highPassFreq.value} => hpf.freq;
                
            fun void setFX() {
                for (0 => int i; i < voice.cap() - 1; i++) {

                    ${parseInt(moogGrandmotherEffects.current.cutoff.value)} => voice[i].cutoff;
                    ${moogGrandmotherEffects.current.rez.value} => voice[i].rez;
                    ${parseInt(moogGrandmotherEffects.current.env.value)} => voice[i].env;
                    ${parseInt(moogGrandmotherEffects.current.oscType1.value)} => voice[i].ChooseOsc1;
                    ${parseInt(moogGrandmotherEffects.current.oscType2.value)} => voice[i].ChooseOsc2;
                    ${moogGrandmotherEffects.current.detune.value} => voice[i].detune;
                    ${parseInt(moogGrandmotherEffects.current.oscOffset.value)} => voice[i].oscOffset;
                    ${parseInt(moogGrandmotherEffects.current.cutoffMod.value)} => voice[i].cutoffMod;
                    ${parseInt(moogGrandmotherEffects.current.pitchMod.value)} => voice[i].pitchMod;
                    ${parseInt(moogGrandmotherEffects.current.lfoVoice.value)} => voice[i].ChooseLfo;
                    // 0.5 => voice[i].filterLfo.gain;
                    ${parseInt(moogGrandmotherEffects.current.offset.value)} => voice[i].offset;
                    880 => voice[i].filterEnv;
                    ${parseInt(moogGrandmotherEffects.current.noise.value)} => voice[i].noise;
                }     
                      }
            spork ~ setFX(); 
                0 => int count;
          
            


                Event myEvent;
                Event mySampleEvent;
                Event mySTKEvent;
                

                class EffectsModuleSTK extends Chugraph
                {
                    
                    inlet => Gain drySTK => outlet;

                    0.1 => limiter_STK.slopeAbove;
                    1.0 => limiter_STK.slopeBelow;
                    0.5 => limiter_STK.thresh;
                    5::ms => limiter_STK.attackTime;
                    300::ms => limiter_STK.releaseTime;
                    0 => limiter_STK.externalSideInput;

                    drySTK => limiter_STK => ${stkChuckToOutlet} ${spectacleDeclarationStk} outlet;
                    
                    ${finalStkCode}
                    
                    ${winFuncCodeStringStk}
                    ${powerADSRCodeStringStk}
                    ${expEnvCodeStringStk}
                    ${wpDiodeLadderCodeStringStk}
                    
                    ${ellipticCodeStringStk}
                    ${expDelayCodeStringStk}
                    

                    ${spectacleCodeStringStk}
                    ${stkFxStringNeedsBlackhole.current}

                    ${delayDeclarationStk}
                    ${delayADeclarationStk}
                    ${delayLDeclarationStk}
                    ${delayCodeStringStk}
                    ${delayACodeStringStk}
                    ${delayLCodeStringStk}



        

                }
                

        
                
                
                // Start Buffers below
                SndBuf buffers[4] => dac;
                
                private class EffectsModule extends Chugraph
                {
                
                    inlet => Gain dry => outlet;
                    dry => ${samplerChuckToOutlet} ${spectacleDeclarationSampler} outlet;

                    ${finalSamplerCode}
                    
                    ${winFuncCodeStringSampler}
                    ${powerADSRCodeStringSampler}
                    ${expEnvCodeStringSampler}
                    ${wpDiodeLadderCodeStringSampler}
                    ${wpKorg35CodeStringSampler}
                    
                    ${ellipticCodeStringSampler}
                    ${expDelayCodeStringSampler}
                

                    // ${modulateDeclarationSampler}
                    ${delayDeclarationSampler}
                    ${delayADeclarationSampler}
                    ${delayLDeclarationSampler}

                    
                    ${delayCodeStringSampler}
                    ${delayACodeStringSampler}
                    ${delayLCodeStringSampler}
                    ${modulateCodeStringSampler}
                    ${spectacleCodeStringSampler}
                    ${samplerFxStringNeedsBlackhole.current}
                    
                    
                    0.1 => limiter_Sampler.slopeAbove;
                    1.0 => limiter_Sampler.slopeBelow;
                    0.5 => limiter_Sampler.thresh;
                    5::ms => limiter_Sampler.attackTime;
                    300::ms => limiter_Sampler.releaseTime;
                    0 => limiter_Sampler.externalSideInput;
                }
                
                SndBuf sample1 => EffectsModule effectsModule => Gain sampler_masterGain => dac;
        
                0.3 => sampler_masterGain.gain;

                
                string files[4];
            
                me.dir() + "DR-55Kick.wav" => files[0];
                me.dir() + "DR-55Snare.wav" => files[1];
                me.dir() + "DR-55Hat.wav" => files[2];
                me.dir() + "Conga.wav" => files[3];

                files[0] => buffers[0].read;
                files[1] => buffers[1].read;
                files[2] => buffers[2].read;
                files[3] => buffers[3].read;


        
                        
                // }
        
                fun void SilenceAllBuffers()
                {
                    buffers[0].samples() => buffers[0].pos;
                    buffers[1].samples() => buffers[1].pos;
                    buffers[2].samples() => buffers[2].pos;
                    buffers[3].samples() => buffers[3].pos;
                    sample1.samples() => sample1.pos;
                }
                    
                fun void playWindow(WinFuncEnv @ win, dur attack, dur release) {
                    win.attackTime(attack);
                    win.releaseTime(release);
                    <<< "PLAYWINDOW_ON" >>>;
                    while (true) {
                        win.keyOn();
                        attack => now;
                        win.keyOff();
                        release => now;
                        me.yield();
                    }
                    me.exit();
                }
            
                fun void Drum(int select, dur duration)
                {
                
                    if(select == 0)
                    {
                        buffers[0].samples()/2 => buffers[0].pos; 
                        0.5 => buffers[0].gain;
                    }
                    if(select == 1)
                    {
                        0 => buffers[1].pos;
                        0.5 => buffers[0].gain;
                    }
                    if(select == 2)
                    {
                        0 => buffers[2].pos;    
                    }
                    if(select == 3)
                    {
                        0 => buffers[3].pos;
                    }
                    if (select == 4) {
                        "${filesToProcess.current && filesToProcess.current.length > 0 ? filesToProcess.current[0].name : "Conga.wav"}" => string filename;
                        filename => sample1.read;
        
                        0.5 => sample1.gain; 
                        // sample1.samples()/3 => sample1.pos;
                        0 => sample1.pos;
                        // Math.random2f(0.98,1.0) => sample1.rate;
                        1.0 => sample1.rate;
                        me.yield();
                    }

            
                    // <<< "DRUM_ON" >>>;
                    duration - (now % duration)  => now;
                    0 => sample1.rate;

                    SilenceAllBuffers();
                    // me.exit();
                    me.yield();
                    
                    
                }
            
                SilenceAllBuffers();

                UniversalAnalyzer uA;
            
            
                fun void PlaySynthNotes(Event myEvent, int notesToPlay[], dur duration) {
                    <<< "PLAYSYNTH_ON ", notesToPlay >>>;

                    myEvent => now;
                
                    
                    0 => int runningShreds;
                    0 => int runningSynthShreds;

                    
                    "Osc" => string analysisSource;

                    
                    while(true) {
                        "" => string notesToPlayMsg;
                        // Machine.numShreds() => runningShreds;
                        uA.declarationCode(hpf);

                        0 => int synthNumCount;

                        for (0 => int i; i < notes.cap(); i++) {                 
                            if (${arpeggiatorOn} == 1 & notesToPlay.cap() > 0) {
                                
                                notesToPlay[i] => voice[i].keyOn;
                                // duration/${numeratorSignature} => now;
                                // duration => now;
                                duration - (now % duration)  => now;
                    
                                1 => voice[i].keyOff;
                                // if (notesToPlay.size() > 0) {
                                //     notesToPlay.popOut(i);
                                // }
                                // 0 => voice[0].gain;
                                
                            } 
                            else if (notesToPlay.cap() > 0) {
                                notesToPlay[i] => voice[i].keyOn;
                            }
                            notesToPlayMsg + " " + notesToPlay[i] => notesToPlayMsg;
                            synthNumCount + 1 => synthNumCount;
                            <<< "NUM_COUNT_SYNTH ", synthNumCount >>>;
                            me.yield(); 
                        }

                        // <<< "NOTESDOWN", notesToPlayMsg >>>;
                        
                        if (${arpeggiatorOn} == 0) {
                            // duration - (now % duration)  => now;
                            duration - (now % duration)  => now;
                            // duration => now;

                            0 => voice[0].gain;

                            for (1 => int i; i <= notesToPlay.size(); i++) {
                                1 => voice[i].keyOff;
                                // notesToPlay.popOut(i);
                            }
                        }
                        
                        <<< "NumShreds: ", Machine.numShreds() >>>;
                        
                    }
                    
                    me.yield();
                }

                fun void PlaySTK(Event mySTKEvent, int notesToPlay[], dur duration){
                    <<< "PLAYSTK_ON ", notesToPlay.cap() >>>;
                    mySTKEvent => now;
                    
                    
                    ${stkFX.current.type || 'UGen'} ${stkFX.current.var || 'ugen'}[12] => EffectsModuleSTK effectsModuleSTK => Gain stk_masterGain => dac;
                    0.6/notes.cap() => stk_masterGain.gain; 


                    while (true) {
                        // if (${stkFX.current.length} < 1) {
                        //     me.exit();
                        // }
                        <<< "NOTES TO PLAAAAAAY ", notesToPlay >>>;
                        
                        if (${stkFX.current.length > 0 && stkOn.current.length > 0}){
                            for (0 => int i; i <= notesToPlay.size(); i++) {
                                if (notesToPlay[i] && notesToPlay.size() > 0) {
                                    ${stkOn.current}
                                } 
                                // me.yield();
                            }
                            
                            if (${stkArpeggiatorOn} == 0) {
                                // duration - (now % duration)  => now;
                                for (1 => int i; i <= notesToPlay.cap(); i++) {
                                    ${stkPolyKeyOff.current}
                                }
                            } else {
                                duration - (now % duration) => now;
                            }
                                    (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now;               
                        } else {
                            // (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now;
                            me.yield();
                        
                        }
                    }
                    me.exit();
                }
            
                

            
                fun void PlaySamplePattern(
                    Event mySampleEvent, 
                    int samplesArrayPos[], 
                    int notesToPlay[], 
                    dur duration
                ) {                
                    count % (notesToPlay.size()) => int sampler1Idx;
                    // <<< "SAMPLE_ON" >>>;
                    // <<< "samples notes/pattern to play ", notesToPlay.cap() >>>; 
                    // <<< "samples arr pos", samplesArrayPos.cap() >>>;
                    mySampleEvent => now;
                    0 => int samplerCount;
                    
                    while(true) {
                        count % (notesToPlay.size()) => int sampler1Idx;
                        // for (0 => int i; i < notesToPlay.size(); i++) {
                        for (0 => int i; i < ${numeratorSignature * denominatorSignature}; i++) {
                            // <<< "NOTE IN SAMPLER!!! ", notesToPlay[i] >>>;
                            if (i % ${numeratorSignature} == 0) {
                                spork ~ Drum(4, duration);
                                
                            } 
                            if (${metronomeOn} == 1 && samplerCount % 4 == 0) {
                                spork ~ Drum(3, duration);
                                
                            }
                            if (samplerCount % 4 == 2) {
                                spork ~ Drum(1, duration);
                                
                            }                                                        
                        }   

                        duration - (now % duration) => now;
                        <<< "NUM_COUNT_SAMPLER ", samplerCount >>>;
                        
                        samplerCount++;
                        
                    }
                    
                }
            
                [[1,3],[2,4]] @=> int notesArr[][];
                
                [3] @=> int sample1Notes[];
                [1,1,1,1] @=> int sample1TestNotes[];
                [1, 4, 1, 3] @=> int sample2Notes[];
                [1,4] @=> int sample3Notes[];
                [1,2] @=> int stkNotes[];
            
                

                
                private class TimeProvider {
                    0 => static int globalCount;
                }   

                TimeProvider oTp;

                
                private class ChordProvider {
                    
                    
                    fun void playNotes(int note) {
                        int existingIndex;
                        for (0 => int i; i < notes.size(); i++) {
                            if (notes[i] == note) {
                                i => existingIndex;
                                notes.erase(i);
                                // break;
                            }
                        }
                        if (!existingIndex) {
                        notes << note;
                        }
                    }
                    fun void releaseNotes (int note) {
                        
                        <<< "NOTE TO RELEASE: ", note >>>;
                        <<< "ALL NOTES: ", notes >>>;

                        for (0 => int i; i < notes.cap(); i++)
                        {
                            
                            if (note == notes[i] && i > 0) {
                                notes.erase(i);
                                                    
                            }
                            // if (${hold} == 1 && notes.cap() > 2) {
                            //     notes.popFront();
                            // }
                            // if (notes.cap() > 2) {
                            //     notes.popFront();
                            // }
                    
                        }
                    }
                }
                    
                ChordProvider oCp;
                
            
                if (${SHD_STK_PLAY === 1 && stkFX.current.length > 0}) {
                    spork ~ PlaySTK(mySTKEvent, [${currNotes.current}], whole/${currentNoteVals.oscs[0]}) @=> Shred shredSTK;  
                }
                spork ~ PlaySamplePattern(mySampleEvent, [0], [0,2], whole/${currentNoteVals.samples[0]}) @=> Shred shredSample;

                spork ~ PlaySynthNotes(myEvent, notes, whole/${currentNoteVals.oscs[0]}) @=> Shred shredSynth; 
                
                // spork ~ PlaySamplePattern(mySampleEvent, [0], [0,2], whole/${currentNoteVals.samples[0]}) @=> Shred shredSample;


                // me.yield();

                while (true) {
                    spork ~ myEvent.broadcast();
                    spork ~ mySampleEvent.broadcast();
                    // (whole)/${currentNoteVals.master[0]} - (now % (whole)/${currentNoteVals.master[0]}) => now;
                    // whole/${currentNoteVals.oscs[0]} => now;
                    1::ms=>now;
                    me.yield();
                }

                
                // }                         
            `;

            





        console.log("CHUCK CODE!!! ", chuckCode);


        // const shredCountNow = await aChuck.runCode(`Machine.numShreds();`);

        if (chuckCode && chuckCode.length > 0 && !chuckUpdateNeeded) {    
            console.log("run!");
            // chuckRunning.current = true;
            aChuck.runCode(chuckCode);
        } else {
            const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            console.log('Shred Count in ELSE: ', await shredCount);
            Array.from(new Array(shredCount-1)).forEach((s: any, i: number) => {
                const shredActive: any = aChuck.isShredActive(i);
                if (i < shredCount && shredActive) {
                    aChuck.runCode(`${i} => Machine.remove;`);
                }
            });
            aChuck.runCode('Machine.removeAllShreds();')
            aChuck.runCode(`Machine.resetShredID();`);
            // aChuck.replaceCode(chuckCode);
            // aChuck.runCode(chuckCode);
            // runMainChuckCode(aChuck);
            // aChuck.replaceCode(chuckCode);
            // runChuck();
            runMainChuckCode(aChuck);
            
        }
    }

   


    const runChuck = async () => {
        if (typeof window === 'undefined') return;
        console.log("aChuck!?!?!?!?!?!? : ", await aChuck);
        if (!aChuck) return;
      

        // ****************************************************************
        // Props for main ChucK file
        // ****************************************************************
        // gather an object with effects settings
        // gather timing information & parameters
        // gather score information & instruments
        // get an array of all files we want to load
        // ****************************************************************


        aChuck.chuckPrint = (message) => {
            if (message.includes("NUM_COUNT_SAMPLER") || message.includes("NUM_COUNT_SYNTH") && !message.includes("NumShreds")) {
                console.log('WHAT IS MSG? ', message);
            }
            if (message) {
                setLastChuckMessage(message);
            }
            if (aChuck) {
                (async () => {
                    shredCount.current = await aChuck.runCode(`Machine.numShreds();`);
                    console.log('shred count!!!: ', shredCount);
                    if (shredCount.current > 600) {
                        const shredCount = await aChuck.runCode(`Machine.numShreds();`);
            
                        // console.log('Shred Count in ELSE: ', await shredCount);
                        Array.from(new Array(shredCount)).forEach((s: any, i: number) => {
                            const shredActive: any = aChuck.isShredActive(i);
                            if (i < shredCount && shredActive) {
                                aChuck.runCode(`${i} => Machine.remove;`);
                            }
                        });
                    }
                })
            }
        }

        console.log("running chuck now... ", chuckUpdateNeeded);
        if (chuckUpdateNeeded) {
            console.log("just called for chuck update at #1: ");
            setChuckUpdateNeeded(false);
        }

        const buffersToChuck: any = {};

        const uploadedFilesArrsGenericCode: any = {};


        uploadedFilesArrsGenericCode && Object.keys(uploadedFilesArrsGenericCode).length > 0 && Object.keys(uploadedFilesArrsGenericCode).forEach((buf: any, idx: number) => {
            if (idx !== Object.keys(uploadedFilesArrsGenericCode).length - 1) {
                console.log("FILES CHUCK TO DAC 1: ", filesChuckToDac);
                filesChuckToDac.current = filesToProcess.current.length > 0 ? filesChuckToDac.current + `SndBuf buffer_${buf} => ` : filesChuckToDac.current;
            } else {
                console.log("FILES CHUCK TO DAC 2: ", filesChuckToDac);
                filesChuckToDac.current = filesToProcess.current.length > 0 ? filesChuckToDac.current + `SndBuf buffer_${buf} => dac;` : filesChuckToDac.current;
            }
        });

        uploadedFilesArrsGenericCode && Object.keys(uploadedFilesArrsGenericCode).length > 0 && Object.values(uploadedFilesArrsGenericCode).forEach((codeString: any) => {
            filesGenericCodeString.current = filesGenericCodeString.current + codeString;
        });


        const OSC_1_Code = osc1FXString.current;

        if (osc1FXString.current && osc1FXString.current.length < 1) return;

        // const getStk1String: any = stkFX.current && stkFX.current.length > 0 && await stkFXToStringPrepare();

        // const getStk1String: any = await stkFXToStringPrepare();

        // ` : '';
        console.log("GOT HERE!");

        setOsc1Code(OSC_1_Code);

        if (aChuck) {
            if (shredCount.current > 0) {
                aChuck.runCode('Machine.removeAllShreds();')
                aChuck.runCode(`Machine.resetShredID();`);
            }
            runMainChuckCode(aChuck);
        } else {
            console.log("NO aChuck!");
        }


    }

    useEffect(() => { 
        if (!chuckRunning.current) {
            console.log("Calling runChuck")
            // runChuck() 
            chuckRunning.current = true;
        } else {
            chuckRunning.current = false;
        }
    // }, [chuckUpdateNeeded]);
    }, []);


    // AUDIO IN
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const playMicThroughChuck = async () => {
        if (typeof window === 'undefined') return;
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

    const handleClickUploadedFiles = (e: any) => {
        console.log("clicked uploaded file: ", e.target);
      }
    

    // This mic button should be able to save a file and pass it into ChucK as file and/or stream
    const chuckMicButton = function () {
        console.log('ChucK Mic Button Clicked');
        if (typeof window === 'undefined') return;

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
        if (notesNeedUpdate) {
            // setNotesNeedUpdate(false);
            setChuckUpdateNeeded(true);
        }
    }, [currNotes.current.length])

    const playChuckNote = (note: any, idString: string, midiHz: any, midiNote: any) => {  
        console.log("??? ", note, idString, midiHz, midiNote);
        if (!note || !note.target ) { 
            return null;
        }
        // console.log('NOTE TARGET: ', note.target);
        // console.log('ID STRING: ', idString);
        console.log('midiHz: ', midiHz);
        console.log('midiNote*** ', midiNote);  
   
        const noteReady = note.target.attributes[0].value;
        const theNoteLetter = idString.replace('-','');
        const theMidiNum = parseFloat(midiNote);
        const theMidiHz = parseFloat(midiHz).toFixed(2);

        noteOnPlay(theMidiNum, theMidiHz, 100);
        return noteReady;
    };

    useEffect(() => {
        if (!formats || formats.length < 1 || formats.indexOf('tradKey') !== -1) {
            setKeysVisible(true);
        }
        if (formats && formats.length > 0 && keysVisible && formats.indexOf('tradKey') === -1) {
            setKeysVisible(false);
        }
        if (formats && formats.length > 0 && formats.indexOf('hexKey') !== -1) {
            updateHasHexkeys(true);
        }
        if (formats && formats.length > 0 && keysVisible && formats.indexOf('hexKey') === -1) {
            updateHasHexkeys(false);
        }
    }, [formats]);

    useEffect(() => {

        if (babylonGame.current && !babylonGame.current.canvas) {
            // console.log('in useeffect getting canvas');
            babylonGame.current.canvas = document.querySelector(`babylonCanvas`);
        }
        if (babylonGame.current && !babylonGame.current.engine) {
            babylonGame.current.engine = new BABYLON.Engine(
                babylonGame.current.canvas,
                true, // antialias
                { preserveDrawingBuffer: true, stencil: true }, //engineOptions
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
        // if (currentScreen.current === "fx_" || currentScreen.current === "stk") {
        //     currentScreen.current = 'synth';
        // }
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

        if (obj.fxType === "stk") {
            stkFX.current.presets[`${obj.name}`].value = value;
            setToggleSTKvsFX(!toggleSTKvsFX);
        } else if (obj.fxType === 'fx')
        {
            let index: any = Object.values(allFxPersistent.current[`${fxRadioValue}`].map((i: any) => i.presets)).filter((i: any, idx: number) => i && i.length > 0 && i.var === obj.name && i)[0];
      
            if (!index || index.length < 1) {
                console.log('all persistent fx new radio val: ', allFxPersistent.current[`${fxRadioValue}`].length - 1);
                index = allFxPersistent.current[`${fxRadioValue}`].length - 1;
           
                allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`].value = value;
             
            }
            if (allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`]) {
                allFxPersistent.current[`${fxRadioValue}`][index].presets[`${obj.name}`].value = value;
                // SAVED STATE HERE
            }
        }
        else if (obj.fxType === 'default') {
            moogGrandmotherEffects.current[`${obj.name}`].value = value;
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
        console.log("HITTING THIS KNOB STUFF?")
        // console.log('WHAT R STKVALS? ', currentFX.current);
        // setChuckUpdateNeeded(true);
    }

    const handleShowFX = (closeOnly?: boolean) => {
        currentScreen.current = "";
        setShowFX(!showFX);
    };

    const updateFXInputRadio = (value: any) => {
        if (value && value !== fxRadioValue) {
            console.log('VALUE: ', value);
            setFxRadioValue(value);
        }
    }

    const updateFileUploads = (e: any) => {

        console.log('%cDO WE GET CONTACT HERE ON FILE UPLOOAD? ', 'color: cyan ', e);

    };

    const playUploadedFile = (e?: any) => {
        if (!chuckHook) {
            return;
        }
        const theFile = e ? e : lastFileUpload;
        console.log('%cwhat is the uploaded file? ', 'color: beige;', theFile);
    };

    const parsedLastChuckMessage = useRef<any>()

    const initialTimeNow = useRef<number>(0);
    const initialSampNow = useRef<number>(0);

    useEffect(() => {
        if (Math.floor(currentNumerCount/(numeratorSignature)) === 0) return;
        setCurrentDenomCount(Math.floor(currentNumerCount/(numeratorSignature)) % denominatorSignature);
        setCurrentPatternCount(Math.floor(currentNumerCount/(numeratorSignature * denominatorSignature))); //
    }, [currentNumerCount]);

    const centroids = useRef<any>([]);
    const normalizedCentroids = useRef<any>([]);
    const centroidMax = useRef<number>(0);
    const centroidMin = useRef<number>(0);

    useEffect(() => {

        if(lastChuckMessage && lastChuckMessage.includes("VIRTUALKEYUPDATE_")){
            parsedLastChuckMessage.current = lastChuckMessage.split(/[\s,]+/).slice(1);
            console.log('%cParsedLastChuckMessage.current NOTES DOWN: ', 'color: red', parsedLastChuckMessage.current);
            currentNotesDownDisplay.current = [];
            currentNotesDownDisplay.current = parsedLastChuckMessage.current;
            // currentNotesKeyValDownDisplay.current = [];
            if (parsedLastChuckMessage.current) {
                // currentNotesKeyValDownDisplay.current.push(parsedLastChuckMessage.current[2]);
                console.log("KEY VALS DOWN??   ", parsedLastChuckMessage.current);
            } 
            else if (parsedLastChuckMessage.current[1] === 0) {
                const theIndex = currentNotesKeyValDownDisplay.current.indexOf(parsedLastChuckMessage.current[2]);
                currentNotesKeyValDownDisplay.current.slice(theIndex, 1);
            }
        }

        if(lastChuckMessage && lastChuckMessage.includes("UPDATE_NOTE_ON")) {
            const parseString: string = lastChuckMessage.split(/[\s,]+/).slice(1);

            const removeComma: string = parseString[0].replace(/,\s*$/, "");

            const noteOnArr: any[] = removeComma.split(" - ");

            const noteNum: number = +noteOnArr[0] && +noteOnArr[0];
            const noteHz: number = +noteOnArr[1] && +noteOnArr[1];

            if (noteNum > 0 && noteNum < 128) {
                const theNum: number = noteNum;
                const theHz: number = noteHz;
                noteOnPlay(theNum, theHz, 100)
            }
        }

        if(lastChuckMessage && lastChuckMessage.includes("UPDATE_NOTE_OFF")) {
            const parseString: string = lastChuckMessage.split(/[\s,]+/).slice(1);

            const removeComma: string = parseString[0].replace(/,\s*$/, "");
            alert(removeComma);
            const noteOnArr: any[] = removeComma.split(" - ");

            const noteNum: number = +noteOnArr[0] && +noteOnArr[0];
            const noteHz: number = +noteOnArr[1] && +noteOnArr[1];

            if (noteNum > 0 && noteNum < 128) {
                const theNum: number = noteNum;
                const theHz: number = noteHz;
                // noteOnPlay(theNum, theHz, 100)
                noteOffPlay(theNum);
            }
        }





        if (lastChuckMessage && lastChuckMessage.includes("NUM_COUNT_SAMPLER")) {
            const parseString: string = lastChuckMessage.split(/[\s,]+/).slice(1);
            console.log("PARSE STRING SAMPLER: ", parseString);

            const removeComma: string = parseString[0].replace(/,\s*$/, "");
            const countToNum: number = +removeComma && +removeComma;
            setCurrentBeatCount(countToNum);
            setCurrentBeatCountToDisplay(Math.ceil(countToNum) % (numeratorSignature) + 1); //) % (numeratorSignature * denominatorSignature)); //
            if (Math.ceil(countToNum/numeratorSignature) !== 0) {

                setCurrentNumerCount(Math.ceil(countToNum/numeratorSignature)); //
                setCurrentNumerCountColToDisplay(Math.ceil(countToNum/numeratorSignature) % (numeratorSignature * denominatorSignature)); //
            } else {
                setCurrentNumerCount(Math.ceil(countToNum/numeratorSignature)); //
                setCurrentNumerCountColToDisplay(Math.ceil(countToNum/numeratorSignature) % (numeratorSignature * denominatorSignature)); //
            }
        };

        if (lastChuckMessage && lastChuckMessage.includes("NUM_COUNT_SYNTH")) {
            const parseString: string = lastChuckMessage.split(/[\s,]+/).slice(1);
            console.log("PARSE STRING SYNTH: ", parseString);
            const removeComma: string = parseString[0].replace(/,\s*$/, "");
            const countToNum: number = +removeComma && +removeComma;
            setCurrentBeatSynthCount(countToNum);
            // // setCurrentBeatCountToDisplay(Math.ceil(countToNum) % (numeratorSignature) + 1); //) % (numeratorSignature * denominatorSignature)); //
            // if (Math.ceil(countToNum/numeratorSignature) !== 0) {

            //     setCurrentNumerCount(Math.ceil(countToNum/numeratorSignature)); //
            //     // setCurrentNumerCountColToDisplay(Math.ceil(countToNum/numeratorSignature) % (numeratorSignature * denominatorSignature)); //
            // } else {
            //     setCurrentNumerCount(Math.ceil(countToNum/numeratorSignature)); //
            //     // setCurrentNumerCountColToDisplay(Math.ceil(countToNum/numeratorSignature) % (numeratorSignature * denominatorSignature)); //
            // }
        };

        if (lastChuckMessage && lastChuckMessage.includes('NOTESDOWN')) {
            parsedLastChuckMessage.current = lastChuckMessage.split(/[\s,]+/).slice(1);
            parsedLastChuckMessage.current.filter((i:any) => i.length > 0 && i );
            console.log('%cParsedLastChuckMessage.current NOTES DOWN: ', 'color: yellow', parsedLastChuckMessage.current);
            
            currentNotesDownDisplay.current = [];

            // parsedLastChuckMessage.current.filter((i: any) => i && i);
            if (parsedLastChuckMessage.current.length > 1) {
                // parsedLastChuckMessage.current.shift();
                
                // currentNotesDownDisplay.current = [];
                parsedLastChuckMessage.current.forEach((i: any) => {
                    if (i && i !== '' && currentNotesDownDisplay.current.indexOf(i) === -1) {
                        currentNotesDownDisplay.current.push(i);
                    }
                })
                // currentNotesDownDisplay.current.push(parsedLastChuckMessage.current);
            }
        }

        if (lastChuckMessage && lastChuckMessage.includes('FEATURES')) {
            parsedLastChuckMessage.current = lastChuckMessage.split(/[/]+/);
            console.log('parsedLastChuckMessage.current: ', parsedLastChuckMessage.current.filter((i: any, idx: number) => [idx, i]));

            const allFeatures = parsedLastChuckMessage.current.filter((i: any, idx: number) => [idx, i]);

            const centroid = allFeatures.find((i: any) => i.includes("centroid")).split(":")[1];
            centroids.current.push(centroid);
            if (centroid > centroidMax.current) {
                centroidMax.current = centroid;
            }
            if (centroid < centroidMin.current) {
                centroidMin.current = centroid;
            }
            normalizedCentroids.current.push((centroid - centroidMin.current)/(centroidMax.current - centroidMin.current)); 
            
            const flux = allFeatures.find((i: any) => i.includes("flux")).split(":")[1];
            const rms = allFeatures.find((i: any) => i.includes("rms")).split(":")[1];
            const mfcc = allFeatures.find((i: any) => i.includes("mfcc")).split(":")[1].split(" ");
            const mfccEnergy = mfcc.filter((i: any) => parseFloat(i) && parseFloat(i))[0];
            const mfccVals = mfcc.filter((i: any) => parseFloat(i) && parseFloat(i)).slice(1);
            const rolloff = allFeatures.find((i: any) => i.includes("rolloff")).split(":")[1];
            const freq = allFeatures.find((i: any) => i.includes("freq")).split(":")[1];

            const gain = allFeatures.find((i: any) => i.includes("gain")).split(":")[1];

            const dct = allFeatures.find((i: any) => i.includes("dct")).split(":")[1].split(" ").filter((j: any) => parseFloat(j));

            const zerox = allFeatures.find((i: any) => i.includes("zerox")).split(":")[1].replace("/","");

            const chroma = allFeatures.find((i: any) => i.includes("chroma")).split(":")[1].split(" ").filter((j: any) => parseFloat(j));

            const kurtosis = allFeatures.find((i: any) => i.includes("kurtosis")).split(":")[1].replace("/","");

            // console.log("NORMALIZED CENTROIDS: ", normalizedCentroids.current);

    

            // const source = parsedLastChuckMessage.current[35].replace(/\W/g, '');
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].centroid = Number(parseFloat(centroid));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].flux = Number(parseFloat(flux));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].freq = Number(parseFloat(freq));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].gain = Number(parseFloat(gain));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].dct = dct.map((i: any) => Number(parseFloat(i)));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].zerox = Number(parseFloat(zerox));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].rms = Number(parseFloat(rms));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].kurtosis = Number(parseFloat(kurtosis));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].mfccEnergy = Number(parseFloat(mfccEnergy));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].mfccVals = mfccVals.map((i: any) => Number(parseFloat(i)));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].rolloff = Number(parseFloat(rolloff));
            // analysisObject.current[analysisSourceRadioValue.toLowerCase()].rolloff85 = Number(parseFloat(parsedLastChuckMessage.current[25]).toFixed(7));
            analysisObject.current[analysisSourceRadioValue.toLowerCase()].chroma = chroma.map((i: any) => Number(parseFloat(i)));

            // console.log("GOT ANALYSIS OBJ? ", analysisObject);

            




        }

        if (lastChuckMessage && lastChuckMessage.includes('PREDICTIONS')) {
            // console.log("YOOOOOOOOO ", parsedLastChuckMessage.current);
            parsedLastChuckMessage.current = lastChuckMessage.split(/[/]+/);
            console.log('parsedLastPREDICTEDMLP.current: ', parsedLastChuckMessage.current);
        }

        if (lastChuckMessage.includes('TIME')) {
            parsedLastChuckMessage.current = lastChuckMessage.split(/[\s,]+/).slice(1);

            if (!initialTimeNow.current) {
                initialTimeNow.current = Number(parseFloat(parsedLastChuckMessage.current[0]).toFixed(4));
                initialSampNow.current = Number(parseFloat(parsedLastChuckMessage.current[0]).toFixed(4));
                setTimeNow(0);
            } else {
                // setTimeNow(timeNow + (Number(parseFloat(parsedLastChuckMessage.current[0]).toFixed(4)) - initialTimeNow.current) / 44100);
                // initialTimeNow.current = Number(parseFloat(parsedLastChuckMessage.current[0]).toFixed(4));
                setTimeNow((Number(parseFloat(parsedLastChuckMessage.current[0]).toFixed(4)) - initialTimeNow.current) / 44100);
   
            }
        }

    }, [lastChuckMessage]);


    const handleShowBPM = (e: any) => {
        setShowBPM(!showBPM);
    };

    const handleShowSTK = (e: any) => {
        setShowSTKManager(!showSTKManager);
    }

    const closeAnalysisPopup = () => {
        setIsAnalysisPopupOpen(!isAnalysisPopupOpen);
    };
    
    const updateHasHexkeys = (msg: boolean) => {
        hasHexKeys.current = msg;
    }

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {

        console.log("NEW FORMATS ", newFormats);
        if (newFormats.length > 1) {
            setFormats(newFormats.reverse());
        } else {
            setFormats(newFormats);
        }
    };


    return (
     

            <Box>
                <Box sx={{position: "absolute", width: "100vw", maxHeight: "36px" }} >

                    <ResponsiveAppBar 
                        selectRef={selectRef} 
                        tune={tune} 
                        currentMicroTonalScale={currentMicroTonalScale}
                        submitMingus={submitMingus}
                        audioKey={audioKey}
                        octave={octave}
                        audioScale={audioScale}
                        audioChord={audioChord}
                        handleChangeChord={handleChangeChord}
                        handleChangeScale={handleChangeScale}
                        programIsOn={programIsOn}
                        updateHasHexKeys={updateHasHexkeys}
                        handleFormat={handleFormat}
                        formats={formats}
                        chuckHook={chuckHook}
                    />
                </Box>

                <Box sx={{
                    display: "flex", 
                    left: window.innerWidth < 900 ? '140px' : '208px', 
                    top: '50px', 
                    flexDirection: "column"
                }}>
                    {programIsOn && (
                        <Box sx={{
                            position: "relative", 
                            display: "flex", 
                            flexDirection: "column", 
                            textAlign: "center",
                            pointerEvents: "none",
                        }}>
                            <Box 
                                className="countWrapper"
                                sx={{
                                    position: "relative", 
                                    pointerEvents: "none",
                                    display: "flex", 
                                    flexDirection: "row", 
                                    textAlign: "center", 
                                    justifyContent: "center",
                                    background: "transparent",
                                    width: "200px",
                                    // left: "325px",
                                    top: "8px",
                                }}>
                                <Typography sx={{marginLeft: "12px", marginRight: "12px", fontSize: "24px !important"}}>
                                    {currentBeatCountToDisplay} 
                                </Typography>
                                <Typography sx={{marginLeft: "12px", marginRight: "12px", fontSize: "24px !important"}}>
                                    {currentNumerCountColToDisplay} 
                                </Typography>
                                <Typography sx={{marginLeft: "12px", marginRight: "12px", fontSize: "24px !important"}}>
                                    {currentDenomCount}
                                </Typography>
                                <Typography sx={{marginLeft: "12px", marginRight: "12px", fontSize: "24px !important"}}>
                                    {currentPatternCount}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box sx={{position:"absolute", left: 0, bottom: 0, color: "red", fontFamily: "Menlo", height: "50%", width: "80px"}}>
                        <>{currentNotesDownDisplay.current}</>
                        <>{currentNotesKeyValDownDisplay.current}</>
                </Box>

                <Box 
                    sx={{ 
                        bottom: '0px',
                        top: '54px',
                        // height: 'calc(100% - 304px)',
                        left: "146px",
                        width: "calc(100% - 146px)",
                        position: 'absolute',
                        pointerEvents: 'none'
                    }}
                    className="popupAnalysisBox">
 
                    {isAnalysisPopupOpen &&
                        <LineChartWrapper
                            analysisObject={analysisObject}
                            timeNow={timeNow}
                            closeAnalysisPopup={closeAnalysisPopup}
                            handleChangeAnalysisSource={handleChangeAnalysisSource}
                            analysisSourceRadioValue={analysisSourceRadioValue.toLowerCase()}
                        />}
                </Box>

                {typeof window !== 'undefined' && window && (typeof fxKnobsCount !== undefined) && (
                    <Box sx={{width: "100%", height: "100vh", textAlign: "center"}}>
                        {!chuckHook && (
                            <Box
                                className={styles.card}
                                sx={{top: '48px', height: "100%"}}
                            >
                                <Button 
                                    
                                    style={{ 
                                        background: 'rbga(0,0,0,.91)', 
                                        position: "relative",
                                        color: 'rgba(0,0,0,1)', 
                                        zIndex: '9999',
                                    }} 
                                    sx={{ 
                                        minWidth: '200px',
                                        minHeight: '120px', 
                                        top: "40%",
                                        width: programIsOn ? "104px" : "25vw",
                                        height: programIsOn ? "48px" : "8vw",
                                        paddingLeft: '24px',
                                        // maxHeight: '40px',
                                        fontSize: programIsOn ? "16px" : "32px",
                                        color: 'rgba(0,0,0,.98)',
                                        backgroundColor: 'rgba(158, 210, 162, 1)', 
                                        border: '0.5px solid #b2b2b2',
                                        '&:hover': {
                                            color: '#f5f5f5 !important',
                                            border: '1px solid #1976d2',
                                            background: 'rgba(0,0,0,.98)',
                                        }
                                    }} 
                                    variant="contained" 
                                    id="initChuckButton" 
                                    onClick={initChuck} 
                                    endIcon={<PlayArrowIcon
                                    style={{height: '100%', pointerEvents: "none"}} />}
                                    >
                                        Begin
                                </Button>
                            </Box>
                        )}    




                        <Box 
                            key={babylonKey} 
                            sx={{ 
                                left: '0', 
                                display: 'flex', 
                                flexDirection: 'row' 
                            }}>
                
    {/* BABYLON LAYER */}
                            <Box sx={{
                                boxSizing: 'border-box', 
                                width: window.innerWidth, 
                                height: window.innerHeight, 
                                display: !showFX ? "" : "hidden"}}>
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
                                        // runChuck={runChuck}
                                        chuckHook={chuckHook}
                                        hasHexKeys={hasHexKeys.current}
                                        // formats={formats}
                                    showFX={{showFX}}
                                    programIsOn={programIsOn}
                                    microTonalArr={microTonalLetters}
                                    updateHasHexKeys={updateHasHexkeys}
                                />
                            </Box>
                    {programIsOn && (
                            <Box sx={{
                                position: "absolute", 
                                top: "50px"
                            }}>

    {/* PLAY CHUCK */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                {/* {
                                    showBPM && (
                                    <Box sx={{position: "relative", display: "flex", flexDirection: "row"}}>
                                        <BPMModule 
                                            bpm={bpm} 
                                            handleChangeBPM={handleChangeBPM}
                                            beatsNumerator={beatsNumerator}
                                            beatsDenominator={beatsDenominator}
                                            handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                                            handleChangeBeatsDenominator={handleChangeBeatsDenominator}
                                            programIsOn={programIsOn}
                                            handleToggleArpeggiator={handleToggleArpeggiator}
                                            handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                                            handleReturnToSynth={handleReturnToSynth}
                                            checkedFXList={checkedFXList.current}
                                            stkFX={stkFX}
                                            keysVisible={keysVisible}
                                        />
                                    </Box>)
                                } */}

                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        {chuckHook && (
                                            <Button 
                                                style={{ 
                                                    background: 'rbga(0,0,0,0.8)', 
                                                    minWidth: window.innerWidth < 900 ? '140px' : '208px',
                                                    color: 'rgba(0,0,0,1)',
                                                    marginLeft: '0px'      
                                                }} 
                                                sx={{ 
                                                    minWidth: window.innerWidth < 900 ? '140px' : '208px', 
                                                    opacity: '0.8',
                                                    paddingLeft: '24px', 
                                                    maxHeight: '40px',
                                                    border: '0.5px solid #b2b2b2',
                                                    '&:hover': {
                                                        color: '#f5f5f5 !important',
                                                        background: 'rgba(0,0,0,.98)',
                                                        border: 'solid 1px #1976d2',
                                                        }
                                                }} 
                                                variant="contained" 
                                                id="runChuckButton" 
                                                onClick={runChuck} 
                                                endIcon={
                                                    <PlayCircleFilledIcon />
                                                }>
                                                    Play
                                            </Button>
                                        )}
                                    </Box>
                                    
                                </Box>

    {/* STOP CHUCK */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        {chuckHook && (
                                            <Button 
                                                style={{ 
                                                    // background: 'rbga(0,0,0,.91)', 
                                                    minWidth: window.innerWidth < 900 ? '140px' : '208px',
                                                    color: 'rgba(0,0,0,1)',
                                                    marginLeft: '0px' 
                                                }} 
                                                sx={{ 
                                                    minWidth: window.innerWidth < 900 ? '140px' : '208px', 
                                                    paddingLeft: '24px',
                                                    opacity: '0.8', 
                                                    maxHeight: '40px', 
                                                    marginLeft: '8px', 
                                                    border: '0.5px solid #b2b2b2',
                                                    '&:hover': {
                                                        color: '#f5f5f5 !important',
                                                        background: 'rgba(0,0,0,.98)',
                                                        border: '1px solid #1976d2',
                                                    }
                                                }} 
                                                variant="contained" 
                                                id="stopChuckButton" 
                                                onClick={stopChuckInstance} 
                                                endIcon={<StopCircleIcon />}>
                                                Stop
                                            </Button>
                                        )}
                                    </Box>
                                </Box>


    {/* BPM */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                           

        {/* PATTERN CONTROL */}
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Box sx={{display: "flex", flexDirection: "row"}}>
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
                                                showBPM={showBPM}
                                                handleShowBPM={handleShowBPM}
                                                // uploadedFilesCodeString={uploadedFilesCodeString.current} 
                                                // uploadedFilesToChuckString={uploadedFilesToChuckString.current} 
                                                filesToProcess={filesToProcess.current}
                                                programIsOn={programIsOn}
                                                handleOscRateUpdate={handleOscRateUpdate} 
                                                handleStkRateUpdate={handleStkRateUpdate} 
                                                handleSamplerRateUpdate={handleSamplerRateUpdate} 
                                                handleAudioInRateUpdate={handleAudioInRateUpdate}
                                                currentBeatCount={currentBeatCount}
                                                currentBeatSynthCount={currentBeatSynthCount}
                                                currentNumerCount={currentNumerCount}
                                                currentDenomCount={currentDenomCount}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

    {/* ANALYSIS */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        {chuckHook && (<Button 
                                            style={{ 
                                                minWidth: window.innerWidth < 900 ? '140px' : '208px',
                                                color: 'rgba(0,0,0,0.8)', 
                                                background: 'rbga(0,0,0,.7)' 
                                            }} 
                                            sx={{ 
                                                minWidth: '76px', 
                                                paddingLeft: '24px', 
                                                maxHeight: '40px', 
                                                marginLeft: '0px',
                                                border: '0.5px solid #b2b2b2',
                                                backgroundColor: 'rgba(147, 206, 214, 0.8)', 
                                                background: 'rbga(0,0,0,.7)', 
                                                '&:hover': {
                                                    color: '#f5f5f5 !important',
                                                    background: 'rgba(0,0,0,.98)',
                                                    border: '1px solid #1976d2',
                                                } 
                                            }} 
                                            variant="contained" 
                                            id="analyzeChuckButton" 
                                            onClick={closeAnalysisPopup} 
                                            endIcon={<AutoGraphIcon />}>
                                            Analysis
                                        </Button>)}
                                    </Box>
                                </Box>


    {/* STK */}
                                <Box sx={{display: "flex", flexDirection: "row"}}>
                                    <Button 
                                        sx={{                     
                                            color: 'rgba(0,0,0,.98)',
                                            backgroundColor: 'rgba(158, 210, 162, 0.8)', 
                                            background: 'rbga(0,0,0,.7)', 
                                            position: 'relative', 
                                            // border: '0.5px solid #b2b2b2',
                                            marginLeft: '0px', 
                                            minWidth: window.innerWidth < 900 ? '140px' : '208px', 
                                            // marginLeft: '12px', 
                                            // top: '276px', 
                                            maxHeight: '40px',
                                            display: programIsOn ? "flex" : "none",
                                            '&:hover': {
                                                color: '#f5f5f5',
                                                background: 'rgba(0,0,0,.98)',
                                                border: '1px solid #1976d2',
                                            } 
                                        }} 
                                        // variant="outlined" 
                                        onClick={handleShowSTK} 
                                        // className="ui_SynthLayerButton"
                                        endIcon={<DeblurIcon />}>
                                            Instruments
                                    </Button>
                                </Box>


    {/* EFFECTS */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        <FXRouting
                                            key={fXChainKey + fxRadioValue}
                                            fxChainNeedsUpdate={fxChainNeedsUpdate}
                                            fxData={allFxPersistent.current}
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
                                            babylonGame={babylonGame.current}
                                            programIsOn={programIsOn}
                                        />
                                    </Box>
                                </Box>
    {/* FILES */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                    
                                        <FileManager
                                            onSubmit={onSubmit}
                                            handleSubmit={handleSubmit}
                                            register={register}
                                            watch={watch}
                                            beginProgram={beginProgram}
                                            programIsOn={programIsOn}
                                        />     
                                    </Box>
                                </Box> 

    {/* RECORD */}
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        {chuckHook && (
                                            <Button 
                                                style={{ 
                                                    color: 'rgba(0,0,0,1)', 
                                                    background: 'rbga(0,0,0,.91)' 
                                                }} 
                                                sx={{ 
                                                    backgroundColor: 'rgba(232, 82, 82, 0.8)', 
                                                    background: 'rgba(232, 82,82, 0.8)', 
                                                    minWidth: window.innerWidth < 900 ? '140px' : '208px', 
                                                    marginLeft: '0px', 
                                                    maxHeight: '40px', 
                                                    border: '0.5px solid #b2b2b2',
                                                    '&:hover': {
                                                        color: '#f5f5f5 !important',
                                                        background: 'rgba(0,0,0,.98)',
                                                        border: '1px solid #1976d2',
                                                    }
                                                }} 
                                                variant="contained" 
                                                id="micStartRecordButton" 
                                                onClick={chuckMicButton} 
                                                endIcon={<KeyboardVoiceIcon />}>
                                                    Record
                                                </Button>
                                            )
                                        }
                                    </Box>
                                </Box>


                                {
                                    showBPM && (
                                    <Box sx={{position: "relative", display: "flex", flexDirection: window.innerWidth < 900 ? "column" : "row"}}>
                                        <BPMModule 
                                            bpm={bpm} 
                                            handleChangeBPM={handleChangeBPM}
                                            beatsNumerator={beatsNumerator}
                                            beatsDenominator={beatsDenominator}
                                            handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                                            handleChangeBeatsDenominator={handleChangeBeatsDenominator}
                                            programIsOn={programIsOn}
                                            handleToggleArpeggiator={handleToggleArpeggiator}
                                            handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                                            handleReturnToSynth={handleReturnToSynth}
                                            checkedFXList={checkedFXList.current}
                                            stkFX={stkFX}
                                            keysVisible={keysVisible}
                                        />
                                    </Box>)
                                }

                            </Box> )}





{/* ARPS */}
<Box sx={{display: 'flex', flexDirection: 'row', bottom: '204px', right: '0px', position: 'absolute'}}>
                    <Button 
                        sx={{ 
                            color: 'rgba(0,0,0,.98) !important',
                            backgroundColor: 'rgba(219, 230, 161, 0.97)', 
                            marginLeft: '0px', 
                            // maxWidth: '28px',
                            minWidth: '60px',
                            maxWidth: '60px',
                            maxHeight: '40px',
                            display: programIsOn ? "flex" : "none",
                            border: '0.5px solid #b2b2b2',
                            '&:hover': {
                                color: '#f5f5f5 !important',
                                background: 'rgba(0,0,0,.98)',
                                border: '1px solid #1976d2',
                            }
                        }} 
                        variant="outlined" 
                        className="ui_SynthLayerButton"
                        onClick={handleToggleArpeggiator} 
                        // endIcon={<AnimationIcon />}
                        >
                            Arp1
                    </Button>

                    <Button 
                        sx={{ 
                            color: 'rgba(0,0,0,.98) !important',
                            backgroundColor: 'rgba(219, 230, 161, 0.97)', 
                            minWidth: '60px',
                            maxWidth: '60px',
                            maxHeight: '40px',
                            marginLeft: '0px', 
                            border: '0.5px solid #b2b2b2',
                            display: programIsOn ? "flex" : "none",
                            '&:hover': {
                                color: '#f5f5f5 !important',
                                background: 'rgba(0,0,0,.98)',
                                border: '1px solid #1976d2',
                            }
                        }} 
                        variant="outlined" 
                        className="ui_SynthLayerButton"
                        onClick={handleToggleStkArpeggiator} 
                        // endIcon={<AnimationIcon />}
                        >
                            Arp2
                    </Button>

                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Box sx={{display: "flex", flexDirection: "row"}}>
                            <ToggleFXView 
                                stkCount={stkFX.current.length}
                                fxCount={checkedFXList.current.length}
                                handleReturnToSynth={handleReturnToSynth} 
                                programIsOn={programIsOn}
                                handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                                handleToggleArpeggiator={handleToggleArpeggiator}
                                stkFX={stkFX.current}
                                checkedFXList={checkedFXList.current}
                                keysVisible={keysVisible}
                            />
                        </Box>
                    </Box>   

                </Box>







                            
                    </Box>
                </Box>
                )}
                
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "0px",
                        right: "0px",
                    }}
                // width={window.innerWidth} height={window.innerHeight/4}
                >
                        

                            <Keyboard 
                                chuckHook={chuckHook}
                                keysVisible={keysVisible}
                                keysReady={keysReady}
                                organizeRows={organizeRows}
                                organizeLocalStorageRows={organizeLocalStorageRows}
                                playChuckNote={playChuckNote}
                                compare={compare}
                                // keyWid={vizWid}
                                keyWid={`100vw`}
                                notesAddedDetails={notesAddedDetails}
                            />


                </Box> 

                <Box
                    sx={{position: "absolute", display: "flex", color:"white", bottom: 0, left: 0}}
                >
                    
                    <CheckedFXRadioBtns 
                        handleCheckedFXToShow={handleCheckedFXToShow} 
                        checkedEffectsListHook={checkedEffectsListHook}>
                    </CheckedFXRadioBtns>
                </Box>  
                <Box sx={{ position: "absolute", background: "rgba(0,0,0,0.78)", color: "white", top: "60px", right: "12px"}}>

                    {
                        showSTKManager && (
                            <STKManagerDropdown
                            updateStkKnobs={updateStkKnobs}
                            stkValues={stkValues}
                            setStkValues={setStkValues}
                            ></STKManagerDropdown>
                        )
                    }
                    <Box sx={{
                        backgroundColor: 'rgba(30,34,26,0.96)', 
                        width:'100%', 
                        display:'flex', 
                        flexDirection: 'row',
                        minHeight:'100%',
                        // justifyContent: 'center',
                        // alignItems: 'left'
                    }} key={'handleClickUploadedFilesWrapper'}>
                    
                    {filesToProcess.current.map((file: any) => {
                        return <Button sx={{left: '24px'}} key={`handleClickUploadedFilesBtn_${file.name}`} onClick={handleClickUploadedFiles}>{file.name}</Button>
                    })}
                  </Box>
                </Box>
            </Box>
   
    )
};