"use client"

import { Box, Button, SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect, useRef, useMemo, SetStateAction } from 'react'
import BabylonLayer from './BabylonLayer';
import { Chuck } from 'webchuck';
import { Note } from "tonal";
import moogGMPresets from '../../utils/moogGMPresets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { FXOption, STKOption, fxGroupOptions } from '../../utils/fixedOptionsDropdownData';
import { getSTK1Preset, getFX1Preset } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useForm } from "react-hook-form";
import { convertEnvSetting } from '@/utils/FXHelpers/winFuncEnvHelper';

import BPMModule from './BPMModule';
import ResponsiveAppBar from './ResponsiveAppBar';
import {Tune} from '../../tune';
import Keyboard from './Keyboard'
import { useMingusData } from '@/hooks/useMingusData';
import KeyboardControls from './KeyboardControls';
import Meyda from 'meyda';
import { AllSoundSourcesObject, QueryResponse } from '@/utils/interfaces';
import { defaultNoteVals } from '@/utils/FXHelpers/helperDefaults';
import { defaultSources } from '@/utils/MIDIHelpers/sourceHelpers';
import { Effects, EffectsSettings, Preset, Source, Sources, STKInstruments } from '@/types/audioTypes';
import { getConvertedRadio } from '@/utils/utils';
import GroupToggle from './GroupToggle';
import useUpdatedNeeded from '@/hooks/useUpdateNeeded';
import NotesQuickDash from './NotesQuickDash';
import { calculateDisplayDigits } from '@/utils/time';
import { loadWebChugins } from '@/utils/webChugins';
import ReactDiagramsPedalboard from './ReactDiagramsPedalboard';
import { initialEdgesDefaults, initialNodesDefaults } from '@/utils/FXHelpers/pedalboardHelper';
import setupAudioWorklet from '../../audio/setupAudioWorklet';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import setupAudioAnalysisWorklet from '../../audio/setupAudioAnalysisWorklet';
import { PALE_BLUE } from '@/utils/constants';
import serverFilesToPreload from '../../utils/serverFilesToPreload';
import axios from 'axios';
import MingusPopup from './MingusPopup';
import InstrumentsAndMicrotones from './InstrumentsAndMicrotones';
import { getChuckCode } from '@/utils/chuckHelper';
import { 
    activeSTKDeclarations, 
    activeSTKPlayOff, 
    activeSTKPlayOn, 
    activeSTKSettings, 
    allOctaveMidiFreqs, 
    checkedFXList, 
    chuckRef, 
    clippedDuration, 
    currentEffectType, 
    currentFX, 
    currentHeatmapXY, 
    currentScreen, 
    currentStkTypeVar, 
    currNotes, 
    currNotesHash, 
    delayAFinalHelper, 
    delayFinalHelper, 
    delayLFinalHelper, 
    doReturnToSynth, 
    ellipticFinalHelper, 
    expDelayFinalHelper, 
    expEnvFinalHelper, 
    ffmpegRef, 
    filesToProcess, 
    fxValsRef, 
    initialEdges, 
    initialNodes, 
    initialRun, 
    inputRef, 
    isInPatternEditMode, 
    isSubmitting, 
    keysAndTuneDone, 
    lastFileUploadMeydaData, 
    masterPatternsRef, messageRef, midiAccess, modulateFinalHelper, moogGrandmotherEffects, NOTES_SET_REF, parentDivRef, powerADSRFinalHelper, regionEnd, regionStart, resetHeatmapCell, spectacleFinalHelper, stkKnobValsRef, testArrBuffFile, totalDuration, universalSources, uploadedBlob, visibleFXKnobs, wavesurferRef, winFuncEnvFinalHelper, workerRef, wpDiodeLadderFinalHelper, wpKorg35FinalHelper } from '../state/refs';
import FileWindow from './FileWindow';
import FileManager from './FileManager';
import { handleFXGroupChange, handleReturnToSynth, updateCheckedFXList, updateCurrentFXScreen, updateStkKnobs } from '@/utils/knobsHelper';
import ArrowBack from '@mui/icons-material/ArrowBack';



export default function InitializationComponent() {
    
    const [programIsOn, setProgramIsOn] = useState<boolean>(false);
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const [babylonReady, setBabylonReady] = useState(false);
    const [formats, setFormats] = React.useState<any>(() => []); // ** UNCLEAR VARNAME => WHAT ARE FORMATS?
    // const [currNotes, setCurrNotes] = useState<any>([]);
    // const [wavesurfer, setWavesurfer] = useState<any>(null)

    const [checkedEffectsListHook, setCheckedEffectsListHook] = useState<Array<any>>([]);
    
    // NEEDS WORK (after samples)...
    const [resetNotes, setResetNotes] = useState<any>([0]);
    
    const [keysVisible, setKeysVisible] = useState(false);
    const [keysReady, setKeysReady] = useState(false);
    const [vizSource, setVizSource] = useState<string>('');

    const [selectedChordScaleOctaveRange, setSelectedChordScaleOctaveRange] = useState<any>({

    });

    const [midiData, setMidiData] = useState(null);
    const [meydaData, setMeydaData] = useState(null);
    const [pedalChainNeedsUpdate, setPedalChainNeedsUpdate] = useState<boolean>(false);
    const [initialNodesHook, setInitialNodesHook] = useState<any>();
    const [initialEdgesHook, setInitialEdgesHook] = useState<any>();
    const [keyScaleChord, setKeyScaleChord] = useState<any>({
        octaveMax: '4',
        octaveMin: '3',
        key: 'C',
        scale: 'Diatonic',
        chord: 'Major Triad',
    });

    const [rightPanelOptions, setRightPanelOptions] = useState<any>(['effects', 'pattern']);

    const [fxKnobsCount, setFxKnobsCount] = useState<number>(0);

    const [fXChainKey, setFXChainKey] = useState<string>('');
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(120.00);
    const [beatsNumerator, setBeatsNumerator] = useState(4);
    const [beatsDenominator, setBeatsDenominator] = useState(4);
    const { register, handleSubmit, watch, setValue } = useForm();
    const [clickedBegin, setClickedBegin] = useState<any>(false);
    const [stkValues, setStkValues] = useState<STKOption[]>([]);
    const [midiBPMClockIncoming, setMidiBPMClockIncoming] = useState<any>([]);
    const [fxRadioValue, setFxRadioValue] = React.useState<any>('Osc1'); // ** NEEDS UI RETHINKING
    // const [analysisSourceRadioValue, setAnalysisSourceRadioValue] = React.useState<any>('Osc');
    const [showBPM, setShowBPM] = useState<boolean>(true);
    // const [showSTKManager, setShowSTKManager] = useState<boolean>(false);
    const [octave, setOctave] = useState('4'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioKey, setAudioKey] = useState('C'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);
    const [activeSTKs, setActiveSTKs] = useState<any[]>([]);
    const [arpeggiatorOn, setArpeggiatorOn] = useState<number>(0);
    const [stkArpeggiatorOn, setStkArpeggiatorOn] = useState<number>(0);
    const [cellSubdivisions, setCellSubdivisions] = useState<number>(1);
    const [hideCircularArpBtnsHook, setHideCircularArpBtnsHook] = useState<boolean>(false);
    const [hasHexKeys, setHasHexKeys] = useState<boolean>(false);
    const [tune, setTune] = useState<any>(null);
    const [mingusKeyboardData, setMingusKeyboardData] = useState<any>([]);
    const [mingusChordsData, setMingusChordsData] = useState<any>([]);
    // const [keyBoard, setKeyBoard] = useState<any>();
    const [currentChain, setCurrentChain] = useState<any>();
    // const [meydaNeedsUpdate, setMeydaNeedsUpdate] = useState<boolean>(false);
    const [lastFileUpload, setLastFileUpload] = useState<any>('');
    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);
    // const [osc1NoteNum, setOsc1NoteNum] = useState<number>(0);
    // const [currentBeatCount, setCurrentBeatCount] = useState<number>(0);
    const [currentBeatSynthCount, setCurrentBeatSynthCount] = useState<number>(0);
    const [currentBeatCountToDisplay, setCurrentBeatCountToDisplay] = useState<number>(0);
    const [currentNumerCount, setCurrentNumerCount] = useState<number>(0);
    const [currentNumerCountColToDisplay, setCurrentNumerCountColToDisplay] = useState<number>(0);
    const [currentDenomCount, setCurrentDenomCount] = useState<number>(1);
    const [currentPatternCount, setCurrentPatternCount] = useState<number>(0);
    const [patternsPerCycle, setPatternsPerCycle] = useState<number>(4);
    // const [patternCount, setPatternCount] = useState<number>(0);
    const [masterFastestRate, setMasterFastestRate] = useState<number>(4);
    // const [estimatedMidiClockBpm, setEstimatedMidiClockBpm] = useState<any>();
    // const [keysFullscreen, setKeysFullscreen] = useState<boolean>(false);
    const [masterPatternsHashHook, setPatternsHashHook] = useState<any>({});
    const [masterPatternsHashUpdated, setPatternsHashUpdated] = useState<boolean>(false);
    const [mTFreqs, setMTFreqs] = useState<any>([]);
    const [mTMidiNums, setMTMidiNums] = useState<any>([]);
    const [chuckMsg, setChuckMsg] = useState<string>('');

    isInPatternEditMode.current = isInPatternEditMode.current || false;
    const [hold, setHold] = useState<any>(0);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [updated, markUpdated] = useUpdatedNeeded();
    const [isAudioView, setIsAudioView] = React.useState<boolean>(false);
    const [microtonalScale, setMicrotonalScale] = useState<string>('');
    const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState<boolean>(true);
    const [checkedFXUpdating, setCheckedFXUpdating] = useState<boolean>(false);
    const [showFX, setShowFX] = useState<boolean>(false);

    const [scaleHook, setScaleHook] = useState<any>(null);
    const [invertedScaleHook, setInvertedScaleHook] = useState<any>(null);
    const [chordHook, setChordHook] = useState<QueryResponse | null>(null);

    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS"
    }

    const requestOptions = {                                                                                                                                                                                 
        headers: headerDict,
        params: {
            key: audioKey || 'A',
        }
    };

    resetHeatmapCell.current = false;

    const beatDisplay = useRef<number>(0);
    const numerCount = useRef<number>(0);
    const denomCount = useRef<number>(0);
    const patternCount = useRef<number>(0);

    // useEffect(() => {

    //     let isMounted = true;
    //     const parsedNumbers = chuckMsg.match(/\d+/g) || [];  // Ensure it's always an array
        
    //     const bC = parsedNumbers.length > 0  
    //         ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
    //         : currentBeatCountToDisplay;  // Keep previous value if no valid number found
        
    //     console.log("BC: ", bC);
    //     console.log("chuckMsg: ", chuckMsg);

    //     beatDisplay.current = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
    //     numerCount.current = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
    //     denomCount.current = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
    //     patternCount.current = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;
        
    //     console.log("Beat display: ", beatDisplay);

    //     // setCurrentBeatCountToDisplay(beatDisplay);
    //     // setCurrentNumerCountColToDisplay(numerCount);
    //     // setCurrentDenomCount(denomCount);
    //     // setCurrentPatternCount(patternCount);
        
    //     return () => {
    //         isMounted = false;
    //     }
    // }, [chuckMsg]);

    useEffect(() => {
        // Create a function for setting up MIDI access asynchronously
        const setupMIDI = async () => {
            if (!chuckRef.current || !chuckRef.current.context) return;

            console.log("CHECK CONTEXT: ", chuckRef.current.context);

            try {
                // Request MIDI access
                const midi = await navigator.requestMIDIAccess();
                midiAccess.current = midi;

                // Load the AudioWorklet module
                // await chuckRef.current.context.audioWorklet.addModule('/audio/midiAudioProcessor.js'); 
                console.log("AudioWorklet module loaded!");

                if (!midiAccess.current) return;

                // Setup the Audio Worklet and handle MIDI inputs
                for (const input of midiAccess.current.inputs.values()) {
                    setupAudioWorklet(chuckRef.current.context, setMidiData).then((midiNode: any) => {
                        console.log("Audio Worklet is set up");

                        // Attach MIDI message handler
                        input.onmidimessage = (event) => {
                            midiNode.sendMidiData(event.data);
                        };
                    });
                }
            } catch (error) {
                console.error("Failed to get MIDI access:", error);
            }
        };

        // Call the function to setup MIDI
        setupMIDI();

        // Cleanup function when component unmounts or chuckHook changes
        return () => {
            if (midiAccess.current) {
                for (const input of midiAccess.current.inputs.values()) {
                    input.onmidimessage = null; // Clean up MIDI event listeners
                }
            }
        };
    }, [chuckHook]);

    useEffect(() => {
        if (typeof midiBPMClockIncoming === "number") {
            setBpm(midiBPMClockIncoming);
        }
        return () => {
        };
    }, [midiBPMClockIncoming]);




    const maxX = numeratorSignature * masterFastestRate;
    const maxY = denominatorSignature;
    const maxZ = 8;

    const instrumentMap = new Map<number, string>([
        [5, 'osc1'],
        [6, 'osc2'],
        [7, 'stk1'],
        [8, 'audioin'],
    ]);
    
    const getInstrumentForZ = (z: number): string => {
        return instrumentMap.get(z) || 'sample';
    };




    // const fillHashSlot = (x: number, y: number, z: number, inst: string) => {
    //     if (!masterPatternsRef.current[`${z}`]) {
    //         masterPatternsRef.current[`${z}`] = {};
    //     }

    //     let col;
    //     if (z === 9) {
    //         col = "white"
    //     } else if (z === 8) {
    //         col = "black"
    //     } else if (z === 7) {
    //         col = "yellow"
    //     } else if (z === 6) {
    //         col = "red"
    //     } else if (z === 5) {
    //         col = "pink"
    //     } else if (z === 4) {
    //         col = "brown"
    //     } else if (z === 3) {
    //         col = "limegreen"
    //     } else if (z === 2) {
    //         col = "aqua"
    //     } else if (z === 1) {
    //         col = "maroon"
    //     } else {
    //         col = "blue"
    //     }

    //     masterPatternsRef.current[`${z}`][`${x}`] = 
    //     {
    //         on: true,
    //         note: mTFreqs[x + (x * y) + (x * y * z)] || 0.0,
    //         noteHz: mTMidiNums[x + (x * y) + (x * y * z)] || 0.0,
    //         velocity: 0.9,
    //         color: col,
    //         // fileNums: x % 2 === 0 ? [0, 1, 3, 2] : x % 5 === 0 ? [0] : [9999],
    //         fileNums: !isInPatternEditMode ? [0, 1, 3, 2] : masterPatternsRef.current[`${z}`][`${x}`] && Object.keys(masterPatternsRef.current[`${z}`][`${x}`]).length > 0 && masterPatternsRef.current[`${z}`][`${x}`].fileNums ? masterPatternsRef.current[`${z}`][`${x}`].fileNums : x % 4 === 0 ? [0, 1, 3] : [2], // 9999
    //         subdivisions: cellSubdivisions
    //     }
    // }



      

      useEffect(() => {
        const beatsPerMeasure = numeratorSignature;
        const beatSubdivision = masterFastestRate; // e.g. 4 = 16th notes if quarter note base
        const noteValue = denominatorSignature;
      
        const totalSteps = beatsPerMeasure * beatSubdivision;
      
        const instruments = [
          'sample',   // z = 1
          'sample',   // z = 2
          'sample',   // z = 3
          'sample',   // z = 4
          'osc1',     // z = 5
          'osc2',     // z = 6
          'stk1',     // z = 7
          'audioin'   // z = 8
        ];
      
        const fillHashSlot = (x: number, y: number, z: number, inst: string) => {
            const zKey = `${z}`;
            if (!masterPatternsRef.current[zKey]) {
              masterPatternsRef.current[zKey] = {};
            }

            const zColors = [
                '', 'maroon', 'aqua', 'limegreen', 'brown', 'pink',
                'red', 'yellow', 'black', 'white' // index 1 to 9
              ];
              
          
            const color = zColors[z] || 'blue';
          
            const key = x + (x * y);
          
            const fileNums = !isInPatternEditMode
              ? [0, 1, 3, 2]
              : (
                  masterPatternsRef.current[zKey][`${x}`]?.fileNums ??
                  (x % 4 === 0 ? [0, 1, 3] : [2])
                );
          
            masterPatternsRef.current[zKey][`${x}`] = {
              on: true,
              note: mTFreqs[key] || 0.0,
              noteHz: mTMidiNums[key] || 0.0,
              velocity: 0.9,
              color,
              fileNums,
              subdivisions: cellSubdivisions
            };
        };

        for (let step = 1; step <= totalSteps; step++) {
          for (let beatDivision = 1; beatDivision <= noteValue; beatDivision++) {
            for (let zIndex = 0; zIndex < instruments.length; zIndex++) {
              const z = zIndex + 1; // because your `fillHashSlot` expects 1-based z
              const instrument = instruments[zIndex];
              fillHashSlot(step, beatDivision, z, instrument);
            }
          }
        }
      
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
      
      }, [numeratorSignature, denominatorSignature, masterFastestRate, mTMidiNums, cellSubdivisions, mTFreqs]);
    
    allOctaveMidiFreqs.current = {};

    const selectRef: any = React.useCallback((selectedMicrotone: string, i: any) => {
        if (selectedMicrotone) {
            console.log('&&&selected microtone: ', selectedMicrotone);
        }
        if (i) {
            console.log('&&&selected microtone::: what is i???? ', i);
        }
        setFxKnobsCount(Object.keys(moogGrandmotherEffects.current).length);
    }, []);

    const [newMicroTonalArr, setNewMicroTonalArr] = useState<any>([])//

    const currentMicroTonalScale = (scale: any) => {
        let theScale;
        if (!scale || scale && !scale.name || scale.length < 1) return;
        
        theScale = scale.name;
        tune.loadScale(scale.name);
        tune.tonicize(440);
        const microtonalFreqs: any[] = [];
        const microtonalMidiNums: any[] = [];

        if (!tune.scale) return;

        for (let i = -3; i < 6; i++) {
            for (let j = 0; j < tune.scale.length; j++) {
                tune.mode.output = "frequency";
                microtonalFreqs.push(tune.note(j, i).toFixed(2));
                tune.mode.output = "MIDI";
                microtonalMidiNums.push(tune.note(j, i).toFixed(4));

                if (!allOctaveMidiFreqs.current[`${i + 3}`]) {
                    allOctaveMidiFreqs.current[`${i + 3}`] = {};
                }
                allOctaveMidiFreqs.current[`${i + 3}`][`${j}`] = [microtonalFreqs[microtonalFreqs.length - 1] || 'r1', microtonalMidiNums[microtonalMidiNums.length - 1] || 'r2'];
            }
        }

        const sanityChuck = Object.values(allOctaveMidiFreqs.current).map((i:any, idx: number) => Object.values(i).map((j:any) => [idx, Number(j[0])])).flat();
        setMTFreqs(sanityChuck.map((i:any) => i[1]))


        masterPatternsRef.current = {};
        microtonalFreqs.length && setMTFreqs(microtonalFreqs);
        microtonalMidiNums.length && setMTMidiNums(microtonalMidiNums);
        

        setHasHexKeys(true);

        theScale = scale && scale.length > 0 && scale.value && scale.value;
        console.log("have we got the scale? ", scale);
        if (theScale) {
            setNotesAddedDetails([]);
            setMicrotonalScale(theScale);
            setHasHexKeys(true);
            setKeysVisible(false);
        }
    };

    const [currentNoteVals, setCurrentNoteVals] = useState<AllSoundSourcesObject>(defaultNoteVals)


    const inPatternEditMode = (state: boolean) => {
        isInPatternEditMode.current = true;
    }

    const handleMasterRateUpdate = async () => {
        const fastestRate = Math.max(...Object.values(currentNoteVals).map((i) => i[0]));
                
        setMasterFastestRate(fastestRate);
    }

    const handleOsc1RateUpdate = async (val: any) => {
        const valOscRate = await val.target.value;
        setCurrentNoteVals({ ...currentNoteVals, osc1: [valOscRate] });
        handleMasterRateUpdate();
    }

    const handleOsc2RateUpdate = async (val: any) => {
        const valOscRate = await val.target.value;
        setCurrentNoteVals({ ...currentNoteVals, osc2: [valOscRate] });
        handleMasterRateUpdate();
    }
    
    const handleStkRateUpdate = async (val: any) => {
        const valStkRate = await val.target.value;
        setCurrentNoteVals({ ...currentNoteVals, stks: [valStkRate] });
        handleMasterRateUpdate();
    }
    
    const handleSamplerRateUpdate = async (val: any) => {
        const valSamplerRate = await val.target.value;
        setCurrentNoteVals({ ...currentNoteVals, samples: [valSamplerRate] });
        handleMasterRateUpdate();
    }
    
    const handleAudioInRateUpdate = async (val: any) => {
        const valAudioInRate = await val.target.value;
        console.log("YES AUDIN??? ", valAudioInRate, currentNoteVals);
        setCurrentNoteVals({ ...currentNoteVals, linesIn: [valAudioInRate] });
        handleMasterRateUpdate();
    }
    
    const handleSwitchToggle = () => {
        setIsAudioView(!isAudioView);
    };
    
    if (!currentFX.current && (!masterPatternsRef.current || masterPatternsRef.current.length < 1)) {
        currentFX.current = moogGrandmotherEffects.current;
    }

    const getMeydaData = (fileData: ArrayBuffer) => {
        // WE DOOOO WANT TO USE OFFLINE CONTEXT FOR FILE ANALYSIS (not realtime)
        return Promise.resolve(fileData).then((arrayBuffer) => {
            const offlineAudioContext = chuckRef.current ? chuckRef.current.context : new OfflineAudioContext({
                length: 1,
                sampleRate: 44100
            });

            return offlineAudioContext.decodeAudioData(arrayBuffer);
        })
        .then((audioBuffer) => {
            const signal = new Float32Array(512);

            for (let i = 0; i < audioBuffer.sampleRate * 5; i += 512) {
                audioBuffer.copyFromChannel(signal, 0, i);
                lastFileUploadMeydaData.current = [];
                lastFileUploadMeydaData.current && lastFileUploadMeydaData.current.push(
                    Meyda.extract(
                        [
                            // "pitch",
                            // "onsets",
                            "rms",
                            "mfcc",
                            "chroma",
                            "zcr",
                            "energy",
                            "amplitudeSpectrum",
                            "powerSpectrum",
                            "spectralCentroid",
                            "spectralFlatness",
                            "spectralRolloff",
                            // "spectralFlux",
                            "spectralSlope",
                            "spectralFlatness",
                            "spectralSpread",
                            "spectralSkewness",
                            "spectralKurtosis",
                            "spectralCrest",
                            "loudness",
                            "perceptualSpread",
                            "perceptualSharpness",
                            "complexSpectrum",
                            "buffer"]
                        , signal));
            }
            console.log("HEYA HOLY MOLY IT WORKED ", lastFileUploadMeydaData.current);
            const returnMeyda = lastFileUploadMeydaData.current;
            console.log("RETURN MEYDA: ", returnMeyda);
            return returnMeyda;
        });
    }


    const onSubmit = async (files: any) => {
        if (files.length === 0) return;
        if (isSubmitting.current) {
            console.log("Already submitting, aborting...");
            return;
        }

        if (!files.file || files.file.length === 0) {
            console.log('No file uploaded.');
            return;
        }
        
        console.log("FILE??? : ", files);
        const file = files.file[0];

        isSubmitting.current = true; // LOCK!!!

        const fileDataBuffer: any = await file.arrayBuffer();
        console.log("GOT FILEDATABUFFER?  ", fileDataBuffer);
        const fileData: any = new Uint8Array(fileDataBuffer);
        const blob = new Blob([fileDataBuffer], { type: "audio/wav" });
        console.log("GETTING BLOB?? ", blob, "HAVE UP CURR??? ", uploadedBlob.current);
        if (blob && !uploadedBlob.current) {
            uploadedBlob.current = blob;
        } else {
            return;
        }
        console.log("FILE DATA: ", fileData);
        testArrBuffFile.current = fileData;

        const fileBlob = new File([blob], `${file.name.replace(' ', '_')}`, { type: "audio/wav" });
        let arrayBuffer;
        const fileReader = new FileReader();
        fileReader.onload = async function (event: any) {
            console.log("@@@@ check the event ", event);
            arrayBuffer = event.target.result;
            const formattedName = file.name.replaceAll(' ', '_').replaceAll('-', '');
            console.log("@@@ check the formatted name: ", formattedName);
            if (filesToProcess.current.map((i: any) => i.name).indexOf(formattedName) === -1 &&
                filesToProcess.current.map((i: any) => i.name).indexOf(formattedName) === -1
            ) {
                alert('blam');
                filesToProcess.current.push({ 'name': formattedName, 'data': fileData, 'processed': false });

                filesToProcess.current.push({ 'filename': formattedName, 'data': fileData, 'processed': false }); 
                console.log("FILES TO PROCESS: ", filesToProcess.current);
            } 
     
            
            await getMeydaData(arrayBuffer);
            if (chuckHook) {
                setChuckUpdateNeeded(true);
            }
            isSubmitting.current = false; // UNLOCK
        }
        fileReader.readAsArrayBuffer(fileBlob);
    }

    const handleClickName = (e: any, op: string) => {
        console.log('TEST CLICK ', e, op);
    };

    useEffect(() => {
        let isMounted = true;
        if (!microtonalScale || !tune) return;
        // const num = microtonalScale.split('-')[microtonalScale.split('-').length - 1];
        // const data = [];
        console.log('tune??? ', tune);
        tune.loadScale(microtonalScale);
        tune.tonicize(440);
        const microtonalFreqs: any[] = [];
        const microtonalMidiNums: any[] = [];

        for (let i = -3; i < 6; i++) {
            for (let j = 0; j < tune.scale.length; j++) {
                tune.mode.output = "frequency";

                !microtonalFreqs.includes(tune.note(j, i).toFixed(2)) && microtonalFreqs.push(tune.note(j, i).toFixed(2));
                tune.mode.output = "MIDI";

                microtonalMidiNums.includes(tune.note(j, i).toFixed(4)) && microtonalMidiNums.push(tune.note(j, i).toFixed(4));
            }
        }
        return () => {
            isMounted = false;
        };
    }, [microtonalScale, tune]);

    const convertMicrotonalChord = () => {
        // DEFINITELY DO THIS!!! HERE IS A MICROTONAL TUNING MODE FOR REGULAR KEYBOARD
    }

    const { getMingusData } = useMingusData();


    const noteOnPlay = async (theMidiNum: number, theMidiVelocity: number, theMidiHz?: any) => {
        currNotesHash.current[`${theMidiNum}`] = [theMidiNum, theMidiVelocity];
        currNotes.current = Object.values(currNotesHash.current).map((i: any) => i[0]).filter((i: any) => i);

        currNotes.current.map((note: any) =>
            triggerNote(note));
    }

    const noteOffPlay = (theMidiNum: number) => {
        currNotesHash.current[`${theMidiNum}`] = false;
        delete currNotesHash.current[`${theMidiNum}`];
        console.log('MIDI NUM: ', theMidiNum);
    }


    initialNodes.current = initialNodesDefaults && initialNodesDefaults;

    initialEdges.current = initialEdgesDefaults && initialEdgesDefaults;

    keysAndTuneDone.current = keysAndTuneDone.current || false;


    const initFX = (updateCurrentFXScreen: any) => {
        let visibleStkAndFX: Array<any>;
        if (universalSources.current) {
            console.log('curr screen / doReturnToSynth / checkedFXUpdating: ', currentScreen.current, doReturnToSynth.current, checkedFXUpdating);
            if (doReturnToSynth.current !== true) {
                // **** THIS IS WHERE THE ISSUE MAY BE HAPPENING => WHATEVER GETS PASSED INTO VISIBLESTKSANDFX ALWAYS WINS 
                visibleStkAndFX = Object.entries(universalSources.current).filter(
                    (i: any) => i[0].toLowerCase() === getConvertedRadio(fxRadioValue).toLowerCase()
                        && Object.values(i[1].effects).filter(
                            (j: any) => j));

                if (!currentScreen.current.includes("stk")) {
                    visibleStkAndFX && visibleStkAndFX.length > 0 && visibleStkAndFX.map((i: any) => {
                        i[0].toLowerCase() === getConvertedRadio(fxRadioValue).toLowerCase() && Object.values(i[1].effects).map((j: any) => {
                            if (j.type === currentEffectType.current) {
                                Object.values(j.presets).map((x: any) => {
                                    visibleFXKnobs.current?.push([x.label, x]);
                                })
                            }
                        });
                    });
                }


            } else {
                visibleStkAndFX = Object.values(moogGMPresets);
                visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            }
            visibleFXKnobs.current =
                universalSources.current[`${getConvertedRadio(fxRadioValue)}` as keyof Sources].effects[currentEffectType.current as keyof (Effects)]
                    ?
                    Object.entries(
                        Object.values(
                            Object.entries(
                                universalSources.current[
                                    `${getConvertedRadio(fxRadioValue)}` as keyof Sources]
                                    .effects[currentEffectType.current as keyof (Effects)])
                                .filter((i: any) => i[0] === "presets"
                                    && i[1] && Object.values(i[1])))[0][1]).map((i: any) => [i[1].label, i[1]])
                    :
                    Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i])

            setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);
            updateCurrentFXScreen(setFxKnobsCount, setBabylonKey, babylonKey);
            setNeedsUpdate(true);
        }
        if (initialNodes.current && initialEdges.current) {
            setInitialNodesHook(initialNodes.current.filter((i: any) => i));
            setInitialEdgesHook(initialEdges.current.filter((i: any) => i));
        }        
    };

    useEffect(() => {

        keysAndTuneDone.current = true;
        let isMounted = true;

        initFX(updateCurrentFXScreen);

        const allFx: any = [];

        fxGroupOptions.map((i: any) => {
            if (allFx.indexOf(i.effects) === -1) {
                allFx.push(i.effects);
            }
        });

        Object.keys(defaultSources).map((srcName: string) => {
            allFx.flat().map((fx: any) => {

                const isChecked = (x: any) => checkedFXList.current.length > 0 && checkedFXList.current.indexOf(x) !== -1;

                const src: EffectsSettings = defaultSources[`${srcName as keyof Sources}`] && defaultSources[`${srcName as keyof Sources}`].effects[fx.effectLabel as keyof (Effects)] || {};

                if (!src) return;

                if (
                    getConvertedRadio(fxRadioValue).toLowerCase() === srcName.toLowerCase()
                    ||
                    !defaultSources[`${srcName as keyof Sources}`] && defaultSources[`${srcName as keyof Sources}`].effects[fx.effectLabel as keyof (Effects)].presets
                    ||
                    (defaultSources[`${srcName as keyof Sources}`] && defaultSources[`${srcName as keyof Sources}`].effects[fx.effectLabel as keyof (Effects)] &&
                        Object.values(defaultSources[`${getConvertedRadio(fxRadioValue) as keyof Sources}`] && defaultSources[`${getConvertedRadio(fxRadioValue) as keyof Sources}`].effects[fx.effectLabel as keyof (Effects)]).length > 0 &&
                        defaultSources[`${getConvertedRadio(fxRadioValue) as keyof Sources}`] && defaultSources[`${srcName as keyof Sources}`].effects[fx.effectLabel as keyof (Effects)].presets.length < 1)
                ) {
                    const pre_sets: any = (!src.presets || (src.presets && src.presets.length < 1)) && getFX1Preset(fx.effectVar);

                    if ((!src.presets || (src.presets && src.presets.length < 1))) {
                        src.presets = JSON.parse(JSON.stringify(pre_sets[0].presets));
                        src.Type = fx.effectLabel;
                        src.VarName = fx.effectVar;
                        src.On = isChecked(fx.effectLabel) ? true : false;
                        src.Visible = true;
                    }
                }

                defaultSources.stk1.instruments && Object.values(defaultSources.stk1.instruments).filter(i => i.On).length > 0 && Object.entries(defaultSources.stk1.instruments).map((i: [string, EffectsSettings]) => {
                    if (
                        i.length === 2 &&
                        getSTK1Preset(i[0].toLowerCase()) && getSTK1Preset(i[0].toLowerCase()) &&
                        getSTK1Preset(i[0].toLowerCase()) && Object.values(getSTK1Preset(i[0].toLowerCase())) && Object.values(getSTK1Preset(i[0].toLowerCase())).length > 0
                    ) {
                        i[1].presets = getSTK1Preset(i[0].toLowerCase()) && Object.values(getSTK1Preset(i[0].toLowerCase()).presets)
                        i[1].Type = getSTK1Preset(i[0].toLowerCase()) && getSTK1Preset(i[0].toLowerCase()).type || '';
                        i[1].VarName = getSTK1Preset(i[0].toLowerCase()) && getSTK1Preset(i[0].toLowerCase()).var || '';
                    }
                })

                if (!universalSources.current) {
                    universalSources.current = defaultSources;
                }
                markUpdated();
            });
        });

        if (!tune && Tune) {
            const getTune = new Tune();
            setTune(getTune);
        }
        
        return () => {
            isMounted = false;
        };
    }, [
        fxRadioValue,
        markUpdated,
        tune
    ]);

    useEffect(() => {
        let isMounted = true;
        currentFX.current = [];
        checkedFXList.current = [];
        // setNeedsUpdate(true);
        chuckRef.current && chuckRef.current.setString("currentSrc", getConvertedRadio(fxRadioValue));
        const fastestRate: number[] = Object.values(defaultNoteVals).map((i: any) => i && i[0])
        chuckRef.current && chuckRef.current.setInt("fastestRateUpdate", Math.max(...fastestRate));
        setVizSource(getConvertedRadio(fxRadioValue));
        return () => {
            isMounted = false;
        };
    }, [fxRadioValue]);

    const handleToggleArpeggiator = () => {
        if (arpeggiatorOn === 0) {
            setArpeggiatorOn(1);
        } else {
            setArpeggiatorOn(0);
        }
    };

    const toggleKeyboard = () => {
        if (keysVisible === false) {
            setKeysVisible(true);
        } else {
            setKeysVisible(false);
        }
    };

    const handleToggleStkArpeggiator = () => {
        if (stkArpeggiatorOn === 0) {
            setStkArpeggiatorOn(1);
        } else {
            setStkArpeggiatorOn(0);
        }
    };

    const handleUpdateHold = () => {
        if (hold === 0) {
            setHold(1);
        } else {
            setHold(0);
        }
        setChuckUpdateNeeded(true);
    };


    const updateFlowNodesAndEdges = () => {
        const pedalChain: Source[][] | unknown = universalSources.current && Object.entries(universalSources.current).map((source: any) => {
            return Object.values(source[1].effects).filter((effect: any) => {
                return effect && effect.On
            })
        });

        if (!pedalChain || Object.values(pedalChain).length < 1) return;

        const chain: any = {
            osc1: pedalChain && Object.values(pedalChain).length > 0 && Object.values(pedalChain)[0] ? Object.values(pedalChain)[0].map((i: any) => i.VarName) : [],
            osc2: pedalChain && Object.values(pedalChain).length > 0 && Object.values(pedalChain)[1] ? Object.values(pedalChain)[1].map((i: any) => i.VarName) : [],
            stk: pedalChain && Object.values(pedalChain).length > 0 && Object.values(pedalChain)[2] ? Object.values(pedalChain)[2].map((i: any) => i.VarName) : [],
            sampler: pedalChain && Object.values(pedalChain).length > 0 && Object.values(pedalChain)[3] ? Object.values(pedalChain)[3].map((i: any) => i.VarName) : [],
            audioin: pedalChain && Object.values(pedalChain).length > 0 && Object.values(pedalChain)[4] ? Object.values(pedalChain)[4].map((i: any) => i.VarName) : [],
        }

        const currentInst: any[] = chain[`${getConvertedRadio(fxRadioValue).toLowerCase()}`]
        currentInst && setCurrentChain(currentInst);


    };



    ////////////////////////////////////////////////////////////////
    // WE WANT ONLY ONE LOOP THROUGH WHATEVER OBJECT HOLDS THE SOURCES RIGHT HERE... 
    ////////////////////////////////////////////////////////////////

    const genericFXToString = (sources: Sources) => {
        console.log("S O U R C E S: ", sources);

        if (!sources) return;

        Object.entries(sources).forEach((i: [string, Source]) => { // i[0] sourceKey i[1] sourceValue
            const theSource: string = i[0];
            i[1] && i[1].effects && Object.values(i[1].effects).forEach((eS: EffectsSettings) => {
                const theEffectsSettings = eS;

                // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
                // =================================================================
                Object.values(theEffectsSettings.presets).length > 0 &&
                    Object.values(theEffectsSettings.presets).map((preset: Preset) => {

                        const thePreset = preset;

                        if (!thePreset) return;

                        if (thePreset && thePreset.type && thePreset.type.includes("_needsFun")) {
                            if (thePreset.type.includes("_winFuncEnv")) {
                                if (thePreset.name === "attackTime") {
                                    winFuncEnvFinalHelper.current[theSource].attackTime = Math.pow(2, Number(thePreset.value));
                                } else if (thePreset.name === "releaseTime") {
                                    winFuncEnvFinalHelper.current[theSource].releaseTime = Math.pow(2, Number(thePreset.value));
                                } else if (thePreset.name === "envSetting") {
                                    winFuncEnvFinalHelper.current[theSource].envSetting = convertEnvSetting(thePreset.value);
                                } else {
                                }
                            }
                            if (thePreset.type.includes("_powerADSR")) {
                                // add quantization / feedback etc later
                                if (thePreset.name === "attackTime") {
                                    powerADSRFinalHelper.current[theSource].attackTime = thePreset.value;
                                } else if (thePreset.name === "attackCurve") {
                                    powerADSRFinalHelper.current[theSource].attackCurve = thePreset.value;
                                } else if (thePreset.name === "releaseTime") {
                                    powerADSRFinalHelper.current[theSource].releaseTime = thePreset.value;
                                } else if (thePreset.name === "releaseCurve") {
                                    powerADSRFinalHelper.current[theSource].releaseCurve = thePreset.value;
                                }

                                else if (thePreset.name === "decayTime") {
                                    powerADSRFinalHelper.current[theSource].decayTime = thePreset.value;
                                }
                                else if (thePreset.name === "decayCurve") {
                                    powerADSRFinalHelper.current[theSource].decayCurve = thePreset.value;
                                }
                                else if (thePreset.name === "sustainLevel") {
                                    powerADSRFinalHelper.current[theSource].sustainLevel = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_expEnv")) {
                                if (thePreset.name === "T60") {
                                    expEnvFinalHelper.current[theSource].T60 = thePreset.value;
                                } else if (thePreset.name === "radius") {
                                    expEnvFinalHelper.current[theSource].radius = thePreset.value;
                                } else if (thePreset.name === "value") {
                                    expEnvFinalHelper.current[theSource].value = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_diodeladder")) {
                                if (thePreset.name === "cutoff") {
                                    wpDiodeLadderFinalHelper.current[theSource].cutoff = thePreset.value;
                                } else if (thePreset.name === "nlp_type") {
                                    wpDiodeLadderFinalHelper.current[theSource].nlp_type = thePreset.value;
                                } else if (thePreset.name === "nonlinear") {
                                    wpDiodeLadderFinalHelper.current[theSource].nonlinear = thePreset.value;
                                } else if (thePreset.name === "saturation") {
                                    wpDiodeLadderFinalHelper.current[theSource].saturation = thePreset.value;
                                } else if (thePreset.name === "resonance") {
                                    wpDiodeLadderFinalHelper.current[theSource].resonance = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_wpkorg35")) {
                                if (thePreset.name === "cutoff") {
                                    wpKorg35FinalHelper.current[theSource].cutoff = thePreset.value;
                                } else if (thePreset.name === "resonance") {
                                    wpKorg35FinalHelper.current[theSource].resonance = thePreset.value;
                                } else if (thePreset.name === "nonlinear") {
                                    wpKorg35FinalHelper.current[theSource].nonlinear = thePreset.value;
                                } else if (thePreset.name === "saturation") {
                                    wpKorg35FinalHelper.current[theSource].saturation = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("mod")) {
                                if (thePreset.name === "vibratoRate") {
                                    modulateFinalHelper.current[theSource].vibratoRate = thePreset.value;
                                } else if (thePreset.name === "vibratoGain") {
                                    modulateFinalHelper.current[theSource].vibratoGain = thePreset.value;
                                } else if (thePreset.name === "randomGain") {
                                    modulateFinalHelper.current[theSource].randomGain = thePreset.value;
                                }
                            }
                            if (thePreset.type === "Delay") {
                                if (thePreset.name === "delay") {
                                    delayFinalHelper.current[theSource].delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    delayFinalHelper.current[theSource].lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    delayFinalHelper.current[theSource].syncDelay = thePreset.value;
                                }
                            }
                            if ((thePreset.type === "DelayA")) {
                                if (thePreset.name === "delay") {
                                    delayAFinalHelper.current[theSource].delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    delayAFinalHelper.current[theSource].lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    delayAFinalHelper.current[theSource].syncDelay = thePreset.value;
                                }
                            }
                            if ((thePreset.type === "DelayL")) {
                                if (thePreset.name === "delay") {
                                    delayLFinalHelper.current[theSource].delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    delayLFinalHelper.current[theSource].lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    delayLFinalHelper.current[theSource].syncDelay = thePreset.value;
                                }
                            }
                            if (thePreset.type === "ExpDelay") {
                                if (thePreset.name === "ampcurve") {
                                    expDelayFinalHelper.current[`${theSource}`].ampcurve = thePreset.value;
                                } else if (thePreset.name === "durcurve") {
                                    expDelayFinalHelper.current[`${theSource}`].durcurve = thePreset.value;
                                } else if (thePreset.name === "delay") {
                                    expDelayFinalHelper.current[`${theSource}`].delay = thePreset.value;
                                } else if (thePreset.name === "mix") {
                                    expDelayFinalHelper.current[`${theSource}`].mix = thePreset.value;
                                } else if (thePreset.name === "reps") {
                                    expDelayFinalHelper.current[`${theSource}`].reps = thePreset.value;
                                }
                            }
                            if (thePreset.type === "Elliptic") {
                                if (thePreset.name === "lowFilter") {
                                    ellipticFinalHelper.current[`${theSource}`].lowFilter = thePreset.value;
                                } else if (thePreset.name === "midFilter") {
                                    ellipticFinalHelper.current[`${theSource}`].midFilter = thePreset.value;
                                } else if (thePreset.name === "highFilter") {
                                    ellipticFinalHelper.current[`${theSource}`].highFilter = thePreset.value;
                                } else if (thePreset.name === "atten") {
                                    ellipticFinalHelper.current[`${theSource}`].atten = thePreset.value;
                                } else if (thePreset.name === "ripple") {
                                    ellipticFinalHelper.current[`${theSource}`].ripple = thePreset.value;
                                } else if (thePreset.name === "filterMode") {
                                    ellipticFinalHelper.current[`${theSource}`].filterMode = thePreset.value;
                                }
                            }
                            if (thePreset.type === "Spectacle") {
                                console.log('OY SPECTACLE PRESET ', thePreset)
                                if (thePreset.name === "bands") {
                                    spectacleFinalHelper.current[`${theSource}`].bands;
                                } else if (thePreset.name === "delay") {
                                    spectacleFinalHelper.current[`${theSource}`].delay;
                                } else if (thePreset.name === "eq") {
                                    spectacleFinalHelper.current[`${theSource}`].eq;
                                } else if (thePreset.name === "feedback") {
                                    spectacleFinalHelper.current[`${theSource}`].feedback;
                                } else if (thePreset.name === "fftlen") {
                                    spectacleFinalHelper.current[`${theSource}`].fftlen;
                                } else if (thePreset.name === "freqMax") {
                                    spectacleFinalHelper.current[`${theSource}`].freqMax;
                                } else if (thePreset.name === "freqMin") {
                                    spectacleFinalHelper.current[`${theSource}`].freqMin;
                                } else if (thePreset.name === "mix") {
                                    spectacleFinalHelper.current[`${theSource}`].mix;
                                } else if (thePreset.name === "overlap") {
                                    spectacleFinalHelper.current[`${theSource}`].overlap;
                                } else if (thePreset.name === "table") {
                                    spectacleFinalHelper.current[`${theSource}`].table;
                                }
                            }
                            else {
                                // alert('in the else!')
                            }
                        } else {
                            // if (!thePreset || !thePreset.type) return;
                            // console.log("in the else! ", thePreset);
                        }
                        // console.log("*** THE EFFECT SETTINGS ", theEffectsSettings)
                    })
                // WE HAVE NOW INITIATED THE DEFAULT FX OBJECT (// GENERICFX STRING IS CURRENTLY ONLY GETTING *** LAST *** VALUE........)
            });
            // }             
        });
        console.log("CHECK THAT WE ARE GOOD SO FAR ON DEFAULT SOURCE! ", universalSources.current);
        universalSources.current && 
        universalSources.current.stk1.instruments &&
        setActiveSTKs(
            Object.values(universalSources.current.stk1.instruments).filter((i: any) => i.On)
        )
        setChuckUpdateNeeded(true);
    };

    //////////////////////////////////////////////////////////////////

    const [notesAddedDetails, setNotesAddedDetails] = useState<any>([]);

    const organizeRows = async (rowNum: number, note: string) => {

        await note;
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

        if (noteReady && notesAddedDetails.filter((i: any) => i.id === noteReady.name && i).length < 1) {
        notesAddedDetails.length < 1 && setNotesAddedDetails((m: any) => [...m, noteReady]);
            setKeysReady(true);
            setKeysVisible(true);
        } else {
            return;
        }

    };

    const organizeLocalStorageRows = async (note: any) => {
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
    };

    function compare(a: any, b: any) {
        if (a.midiNote < b.midiNote) {
            return -1;
        }
        if (a.midiNote > b.midiNote) {
            return 1;
        }
        return 0;
    };

    useEffect(() => {

        let isMounted = true;

        if (!chuckRef.current?.context) return;

        const audioContext = chuckRef.current.context;

        setupAudioAnalysisWorklet(chuckRef.current.context, setMeydaData).then(() => {
            console.log("aud analysis made it this far...")
            // const processor = audioContext.createScriptProcessor(512, 1, 1);
            const processor = new AudioWorkletNode(audioContext, 'meyda-audio-processor');
            console.log("processor?????????: ", processor);

            if (!workerRef.current) {
                workerRef.current = new Worker("/workers/meydaWorker.js", { type: 'module' });
                workerRef.current.onmessage = (e) => {
                    console.log("Extracted Features:", e.data);
                };
            }

            processor.port.onmessage = (event) => {
                if (event.data.audioData) {
                    event.data.audioData && workerRef.current?.postMessage({
                        audioData: event.data.audioData,
                        sampleRate: audioContext.sampleRate,
                    });
                }
            };

            const analyzer = audioContext.createAnalyser();

            //chuckRef.current && chuckRef.current.connect(analyzer);  // Connect the source to the analyzer
            analyzer.connect(audioContext.destination);  // Directly connect the analyzer to the destination
            return () => {
                workerRef.current?.terminate();
                processor.disconnect();
            };

        })

        return () => {
            if (isMounted) {
                workerRef.current && workerRef.current.terminate();
                isMounted = false;
            }
        }
    }, [chuckHook]);

    useEffect(() => {
        let isMounted = true;
        if (!chuckUpdateNeeded) {
            return;
        } else {
            chuckRef.current && chuckRef.current.setString("currentSrc", getConvertedRadio(fxRadioValue));

            if (universalSources.current) {
                console.log("updating generic string... ", moogGrandmotherEffects.current);
                // aChuck?.runCode('Machine.removeAllShreds();');
                genericFXToString(universalSources.current);
            }
            setChuckUpdateNeeded(false);

        }
        return () => {
            isMounted = false;
        };
    }, [chuckUpdateNeeded, fxRadioValue]) // if there are problems, switch back to [${chuckUpdateNeeded}]

    const stopChuckInstance = () => {
        chuckRef.current && chuckRef.current.clearChuckInstance();
        chuckRef.current && chuckRef.current.runCode(`Machine.removeAllShreds();`);
        chuckRef.current && chuckRef.current.runCode(`Machine.resetShredID();`);
        setChuckUpdateNeeded(true);
        initialRun.current = true;
    }

    const clickHeatmapCell = (x: number, y: number) => {
        currentHeatmapXY.current = { x, y };
    };

    const triggerNote = (note: any) => {
        console.log('note??? ', note);
        console.log('note sanity??? ', Object.values(currNotesHash.current).map((i: any) => i && i[0]).filter(i => parseFloat(i)) || []);

        NOTES_SET_REF.current = Object.values(currNotesHash.current)
        .map((i: any) => {
          const parsed = parseFloat(i[0]);
          return !isNaN(parsed) ? parsed : null;  // If valid, return the parsed float
        })
        .filter(i => i !== null)  // Filter out any null values
        .map(i => {
          return i % 1 === 0 ? i + 0.0 : i; // Ensure it's a float (even if it's an integer)
        });
        console.log("Notes set ref // curr notes hash :::: ", NOTES_SET_REF.current, currNotesHash.current)

        if (isInPatternEditMode.current === true) {

            console.log("WHAT IS CURR NOTES HASH? ", currNotesHash.current);

            const baseHashCurrNotes: any = Object.values(currNotesHash.current)[0];

            masterPatternsRef.current[currentHeatmapXY.current.y][currentHeatmapXY.current.x].note = baseHashCurrNotes[0];
            masterPatternsRef.current[currentHeatmapXY.current.y][currentHeatmapXY.current.x].noteHz = baseHashCurrNotes[1];

            setPatternsHashUpdated(!masterPatternsHashHook);
            setPatternsHashHook(masterPatternsRef.current);
            setPatternsHashUpdated(masterPatternsRef.current);

        }

        NOTES_SET_REF.current && 
        NOTES_SET_REF.current.length > 0 && 
        chuckRef.current && 
        chuckRef.current.broadcastEvent('playNote');

        // console.log("CHECK HASH!!! ", currNotesHash.current);
        currNotesHash.current = {};
    };

    let initialShredCount = 0;

    const handleCheckedFXToShow = (msg: any) => {
        console.log("effect to show message: " + msg);
        // setCheckedEffectToShow(msg);
    }


    const getSourceFX = (thisSource: string) => {
        if (thisSource === "stk") thisSource = "stk1";
        return `
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.PowerADSR && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.PowerADSR.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.PowerADSR.Code(powerADSRFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WinFuncEnv && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WinFuncEnv.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.WinFuncEnv.Code(winFuncEnvFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpEnv && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpEnv.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.ExpEnv.Code(expEnvFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Elliptic && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Elliptic.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.Elliptic.Code(ellipticFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Spectacle && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Spectacle.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.Spectacle.Code(spectacleFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPDiodeLadder && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPDiodeLadder.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.WPDiodeLadder.Code(wpDiodeLadderFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPKorg35 && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPKorg35.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.WPKorg35.Code(wpKorg35FinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpDelay && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpDelay.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.ExpDelay.Code(expDelayFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Modulate && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Modulate.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.Modulate.Code(modulateFinalHelper.current, currentNoteVals) : ''}

            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Delay && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Delay.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.Delay.Code(delayFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayA && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayA.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.DelayA.Code(delayAFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayL && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayL.On ? universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects.DelayL.Code(delayLFinalHelper.current, currentNoteVals) : ''}
        `;
    };



    const runChuck = async (isTestingChord?: number | undefined) => {
        if (typeof window === 'undefined') return;

        console.log("good so far w/ aChuck... ")
        console.log("running chuck now... ", chuckUpdateNeeded);

        console.log("NOTES SET REF??? ", NOTES_SET_REF.current);

        // setResetNotes(NOTES_SET_REF.current)

        if (chuckRef.current) {
            const getOsc1FX = universalSources.current && Object.values(universalSources.current.osc1.effects).filter(i => i.On);

            const getOsc2FX = universalSources.current && Object.values(universalSources.current.osc2.effects).filter(i => i.On);

            const getSamplerFX = universalSources.current && Object.values(universalSources.current.sampler.effects).filter(i => i.On);

            const getAudioInFX = universalSources.current && Object.values(universalSources.current.audioin.effects).filter(i => i.On);

            const getSTKFX = universalSources.current && Object.values(universalSources.current.stk1.effects).filter(i => i.On);

            const signalChain: any = [];
            const valuesReadout: any = {};
            const signalChainSampler: any = [];
            const valuesReadoutSampler: any = {};
            const signalChainSTK: any = [];
            const valuesReadoutSTK: any = {};
            const signalChainAudioIn: any = [];
            const valuesReadoutAudioIn: any = {};

            getConvertedRadio(fxRadioValue).toLowerCase() === "osc1" && getOsc1FX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                signalChain.indexOf(addedEffect) === -1 && signalChain.push(addedEffect);

                Object.values(fx.presets).map((preset: any) => {
                    const latestValue = `${preset.value}${preset.type.includes('dur') ? '::ms' : ''} => ${varName}.${preset.name};`;
                    if (!fx.Code) valuesReadout[preset.name] = latestValue;
                })
            });

            getConvertedRadio(fxRadioValue).toLowerCase() === "osc2" && getOsc2FX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                signalChain.indexOf(addedEffect) === -1 && signalChain.push(addedEffect);

                Object.values(fx.presets).map((preset: any) => {
                    const latestValue = `${preset.value}${preset.type.includes('dur') ? '::ms' : ''} => ${varName}.${preset.name};`;
                    if (!fx.Code) valuesReadout[preset.name] = latestValue;
                })
            });

            getConvertedRadio(fxRadioValue).toLowerCase() === "sampler" && getSamplerFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                signalChainSampler.indexOf(addedEffect) === -1 && signalChainSampler.push(addedEffect);

                Object.values(fx.presets).map((preset: any) => {
                    const latestValue = `${preset.value}${preset.type.includes('dur') ? '::ms' : ''} => ${varName}.${preset.name};`;
                    if (!fx.Code) valuesReadoutSampler[preset.name] = latestValue;
                })
            });

            getConvertedRadio(fxRadioValue).toLowerCase() === "audioin" && getAudioInFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                signalChainAudioIn.indexOf(addedEffect) === -1 && signalChainAudioIn.push(addedEffect);

                Object.values(fx.presets).map((preset: any) => {
                    const latestValue = `${preset.value}${preset.type.includes('dur') ? '::ms' : ''} => ${varName}.${preset.name};`;
                    if (!fx.Code) valuesReadoutAudioIn[preset.name] = latestValue;
                })
            });

            getConvertedRadio(fxRadioValue).toLowerCase().includes("stk") && getSTKFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                signalChainSTK.indexOf(addedEffect) === -1 && signalChainSTK.push(addedEffect);

                Object.values(fx.presets).map((preset: any) => {
                    const latestValue = `${preset.value}${preset.type.includes('dur') ? '::ms' : ''} => ${varName}.${preset.name};`;
                    if (!fx.Code) valuesReadoutSTK[preset.name] = latestValue;
                })
            });

            console.log("###1 what are stk instruments? ", universalSources.current && universalSources.current.stk1.instruments && universalSources.current.stk1.instruments)
            // const shredCount = chuckHook && await chuckHook.runCode(`Machine.numShreds();`);

            // console.log("Shred Count: ", shredCount);
            console.log("WHAT ARE PATTERNS? ", masterPatternsRef.current)
            console.log("what is alloctavemidifreqs? ", allOctaveMidiFreqs.current);
            console.log("what is masterpatternref??? ", Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.note > 0 ? i.note : 9999.0 ) ) );


            activeSTKDeclarations.current = '';
            activeSTKSettings.current = ''; 
            activeSTKs.map((s: any) => {
                activeSTKDeclarations.current = activeSTKDeclarations.current.concat(`${s.Type} ${s.VarName} => stk_FxChain => Dyno stk_Dyno => dac; `);
                activeSTKPlayOn.current = activeSTKPlayOn.current.concat(`allFreqs[recurringTickCount] => ${s.VarName}.freq; 1 => ${s.VarName}.noteOn; `);
                activeSTKPlayOff.current = activeSTKPlayOff.current.concat(`1 => ${s.VarName}.noteOff; `);
            });

            activeSTKs.map((s_outer: any) => {
                s_outer.presets.map((s: any) => {
                    activeSTKSettings.current = activeSTKSettings.current.concat(`${s.value} => ${s_outer.VarName}.${s.name}; `);
                })
            });

            console.log("###2 what are active stks? ", activeSTKs);

            console.log("WHAT IS MISSING HERE?? ", Object.values(masterPatternsRef.current).map((i: any) => Object.entries(i[1])))

            console.log("wtf??? ", filesToProcess.current);

            const filesArray = filesToProcess.current.map(
                (f: any) => `me.dir() + "${f.filename}"`
              ).join(', ');

            const newChuckCode = getChuckCode(
                isTestingChord,
                filesArray,
                currentNoteVals,
                masterPatternsRef,
                masterFastestRate,
                numeratorSignature,
                denominatorSignature,
                bpm,
                moogGrandmotherEffects,
                signalChain,
                signalChainSampler,
                signalChainSTK,
                signalChainAudioIn,
                valuesReadout,
                valuesReadoutSampler,
                valuesReadoutSTK,
                valuesReadoutAudioIn,
                getSourceFX,
                resetNotes,
                mTFreqs,
                activeSTKDeclarations,
                activeSTKSettings,
                activeSTKPlayOn,
                activeSTKPlayOff,
                selectedChordScaleOctaveRange,
            );

            chuckRef.current.runCode(newChuckCode);
            console.log("ran chuck code!");
  
            console.log("HERE IS CHUCK CODE: ", newChuckCode);
        } else {
            console.log("NO aChuck!");
        }

    }


    // AUDIO IN
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const handleClickUploadedFiles = (e: any) => {
        console.log("CLICKED FILES: ", e.target.innerText);
        if (isInPatternEditMode) {
            // const cellObjToEdit = masterPatternsRef.current[currentHeatmapXY.current.y][currentHeatmapXY.current.x];
            // cellObjToEdit.fileNums.push(e.target.innerText);
        }
    }

    // This mic button should be able to save a file and pass it into ChucK as file and/or stream
    // WE CAN PROBABLY MOVE THIS TO A HELPER FILE, YES?
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
                console.log('aCHUCK after mediastream: ', chuckRef.current);
                const ctx: any = chuckRef.current && chuckRef.current.context;
                const adc = ctx.createMediaStreamSource(stream);
                adc.connect(chuckRef.current);


                micButton.disabled = true;
            })
        const micButton: any = document.querySelector(`#micStartRecordButton`);
        micButton && (micButton.disabled = true);
        console.log("BROADCAST PLAY AUDIO IN ONCE!!!! ");
        chuckRef.current && chuckRef.current.broadcastEvent("playAudioIn");
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================


    const updateKeyScaleChord = (key: string, scale: string, chord: string, octaveMax: string, octaveMin: string) => {
        setSelectedChordScaleOctaveRange({
            key: key,
            scale: scale,
            chord: chord,
            octaveMax: octaveMax,
            octaveMin: octaveMin
        })
        setKeyScaleChord({key: key, scale: scale, chord: chord, octaveMax: octaveMax, octaveMin: octaveMin});
        // const submitMingus = async () => {
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, { audioKey: key, audioScale: scale, octave: octaveMax }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST SCALES HERE 1# ", data);
            setScaleHook([Object.values(data)[0], Object.values(data)[2]]);
            setInvertedScaleHook([Object.values(data)[1], Object.values(data)[3]]);
            // return 
            handleMingusKeyboardData(data);
        });
        console.log("WHAT IS KEY / SCALE / CHORD? ", key, scale, chord);
        axios.post(
            `${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, 
            { audioChord: chord, audioKey: key }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                console.log("TEST CHORDS 1# ", data);
                console.log("TEST CHORDS 2# VALUES ", JSON.parse(data));
                setChordHook( JSON.parse(data));
                // return 
                handleMingusChordsData(data);
                return data;
            });
        // }
    };

    // SLIDER CONTROL KNOB
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleUpdateSliderVal = async (radioVal: string, obj: any, value: any) => {       
        if (obj.fxType !== "stk" && (radioVal.trim() !== fxRadioValue.trim())) {
            alert('returning');
            return;
        }
       

        if (universalSources.current) {
            if (!currentEffectType.current) {
                currentEffectType.current = getConvertedRadio(fxRadioValue);
            }
            if (currentEffectType.current && universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects]) universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].On = true;

        }
        if (obj.fxType === "stk") {
            const currStkType = currentStkTypeVar.current.split("#")[0];        
            obj.value = value;

            if (
                universalSources.current &&
                universalSources.current.stk1.instruments &&
                universalSources.current.stk1.instruments[currStkType as keyof STKInstruments]
            ) {
                Object.values(universalSources.current.stk1.instruments[currStkType.toString() as keyof STKInstruments].presets).filter((i: any) => { if (i.name === obj.name) i.value = value });
                markUpdated()
            }
        } else if (obj.fxType === 'fx') {
            if (
                radioVal.trim() === fxRadioValue.trim() && universalSources.current && universalSources.current[`${getConvertedRadio(fxRadioValue) as keyof Sources}`].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any]
                // universalSources.current[`${getConvertedRadio(radioVal) as keyof Sources}`].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any].value &&
            ) {
                if (universalSources.current && universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources]) {
                    universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any].value = value;
                    markUpdated()
                }
            }

        }
        else if (obj.fxType === 'default') {
            // console.log("DOING THE DEFAULT THING :: ", moogGrandmotherEffects.current);
            moogGrandmotherEffects.current[`${obj.name}`].value = value;
        }
        setChuckUpdateNeeded(true);
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    // // TIMING (BPM / SIGNATURE)
    // // ========================================================
    // // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // const handleChangeBPM = (newBpm: number) => {
    //     if (newBpm) {
    //         setBpm(Number(newBpm));
    //     }
    //     setChuckUpdateNeeded(true);
    // }

    // const handleChangeBeatsNumerator = (newBeatsNumerator: number) => {
    //     if (newBeatsNumerator) {
    //         setBeatsNumerator(Number(newBeatsNumerator));
    //         setNumeratorSignature(Number(newBeatsNumerator));
    //     }
    //     setChuckUpdateNeeded(true);
    // }

    // const handleChangeBeatsDenominator = (newDenominator: number) => {
    //     if (newDenominator) {
    //         setBeatsDenominator(Number(newDenominator));
    //         setDenominatorSignature(Number(newDenominator));
    //     }
    //     setChuckUpdateNeeded(true);
    // }
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    // const handleShowFX = (closeOnly?: boolean) => {
    //     currentScreen.current = "";
    //     setShowFX(!showFX);
    // };

    const updateFXInputRadio = (value: any) => {
        if (value && value !== fxRadioValue) {
            alert(`VALUE: ${value}`);
            setFxRadioValue(value);
        }
        setChuckUpdateNeeded(true);
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

    const closeAnalysisPopup = () => {
        setIsAnalysisPopupOpen(!isAnalysisPopupOpen);
    };

    const updateHasHexkeys = (msg: boolean) => {
        alert(`cannot be true: , ${msg}`)
        setHasHexKeys(msg);
        setKeysVisible(!msg);
    }

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        console.log('YA')
        setHasHexKeys(false);
        setKeysVisible(true);
        setNewMicroTonalArr([])
        // console.log("NEW FORMATS ", newFormats);
        if (newFormats.length > 1) {
            setFormats(newFormats.reverse());
        } else {
            setFormats(newFormats);
        }
    };

    const selectFileForAssignment = (e: any) => {
        console.log("WHAT IS FILE FOR ASSIGNMENT?? ", e.target);
    }

    const handleFXRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateFXInputRadio((event.target as HTMLInputElement).value);
    };

    const resetCellSubdivisionsCounter = (x: number, y: number) => {
        currentHeatmapXY.current = {x: Number(x), y: Number(y)};
        console.log('master patterns ref: ', masterPatternsRef.current[`${y}`][`${x}`]);
        const subdivs: any = masterPatternsRef.current[`${y}`][`${x}`].subdivisions;
        setPatternsHashUpdated(true);
        setCellSubdivisions(subdivs || 1);
    }

    const editPattern = (x: any, y: any, group: any) => {

        // this is called by triggerEditPattern in renderer
        // alert(`Hello!_${x}_${y}_${group}`);
        // X & Y VALS ARE 1-INDEXED!
        // WE NEED ABILITY TO 
        // 1. SEE CLICKED BLOCK'S CURRENT SETTINGS
        // 2. EDIT BLOCK HERE
        // 3. SUBDIVIDE & EDIT SUBDIVISIONS OF BLOCK 
        // 4. REVERT PRIOR SUBDIVISIONS
        // 5. CHANGE BLOCK TO A REST
        // 6. DO NOTHING (DO NOT EDIT & LEAVE BLOCK AS IS...)


        console.log("PATTERNS HASH GENERAL", masterPatternsRef.current)
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
    }

    const handleSourceToggle = (name: string, val: any) => {
        updateFXInputRadio(val);
        setVizSource(val);
        visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);

        setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);
        updateCurrentFXScreen(setFxKnobsCount, setBabylonKey, babylonKey);
        setNeedsUpdate(true);
    };


    // BE SURE TO ADD DURATION DIVISIONS (AND ALSO ELSEWHERE)
    const playSTKOn = () => {
        let allSTKs: any = {}; // ALL STKs ARE STRINGS OF INSTs
        // try {
        const stkInstsHolder: [string, EffectsSettings][] | undefined = universalSources.current &&
            universalSources.current.stk1.instruments &&
            Object.entries(universalSources.current.stk1.instruments).filter((i: any) => i[1].On);

        console.log("insts holder??? ", stkInstsHolder);

        stkInstsHolder && stkInstsHolder.map((stkInsts: [string, EffectsSettings]) => {
            if (stkInsts[1].VarName) {
                // console.log("getFXOnly_var: ", stkInst.VarName);
                const presets: Preset[] | undefined | "" = universalSources.current &&
                    universalSources.current.stk1.instruments &&
                    universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments] &&
                    universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments].presets;


                if (presets && presets.length > 0 && stkInsts[1].VarName === "sit") {
                    allSTKs[`${stkInsts[1].VarName}`] = `                     
                        ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
                        notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].noteOn;  
                        0.01/notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            // duration * ${numeratorSignature} - (now % duration  * ${numeratorSignature} )  => now;
                            duration - (now % duration)  => now;
                            1 =>  ${stkInsts[1].VarName}[i-1].noteOff; 
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bow") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'bowPressure')[0].value} => ${stkInsts[1].VarName}[i-1].bowPressure;
                        ${presets.filter(p => p.name === 'bowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].bowPosition;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wg") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        // ${presets.filter(p => p.name === 'bowMotion')[0].value} => ${stkInsts[1].VarName}[i-1].bowMotion;
                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'strikePosition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
                        ${presets.filter(p => p.name === 'gain')[0].value} => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
                        ${presets.filter(p => p.name === 'bowRate')[0].value} => ${stkInsts[1].VarName}[i-1].bowRate;
                        ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
                        ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwbtl") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
                        notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "brs") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;    
                        ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;    
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
                        ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
                        ${presets.filter(p => p.name === 'lip')[0].value} => ${stkInsts[1].VarName}[i-1].lip;
                        ${presets.filter(p => p.name === 'slide')[0].value} => ${stkInsts[1].VarName}[i-1].slide;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
                        ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;

                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "shak") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'energy')[0].value} => ${stkInsts[1].VarName}[i-1].energy;
                        ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
                        ${presets.filter(p => p.name === 'objects')[0].value} => ${stkInsts[1].VarName}[i-1].objects;
                        ${presets.filter(p => p.name === 'decay')[0].value} => ${stkInsts[1].VarName}[i-1].decay;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mdlbr") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'stickHardness')[0].value} => ${stkInsts[1].VarName}[i-1].stickHardness;
                        ${presets.filter(p => p.name === 'strikePOsition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        ${presets.filter(p => p.name === 'directGain')[0].value} => ${stkInsts[1].VarName}[i-1].directGain;
                        ${presets.filter(p => p.name === 'masterGain')[0].value} => ${stkInsts[1].VarName}[i-1].masterGain;
                        ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
                        ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
                        ${presets.filter(p => p.name === 'strike')[0].value} => ${stkInsts[1].VarName}[i-1].strike;
                        ${presets.filter(p => p.name === 'damp')[0].value} => ${stkInsts[1].VarName}[i-1].damp;


                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }
                    `;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "flut") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'jetDelay')[0].value} => ${stkInsts[1].VarName}[i-1].jetDelay;
                        ${presets.filter(p => p.name === 'jetReflection')[0].value} => ${stkInsts[1].VarName}[i-1].jetReflection;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
                        ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;


                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
                        ${presets.filter(p => p.name === 'endReflection')[0].value} => ${stkInsts[1].VarName}[i-1].endReflection;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "clair") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
                        ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
                        ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;

                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;


                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "f") {
                    console.log("IN FRENCH HORN::: ", presets);
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "m") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'pickupPosition')[0].value} => ${stkInsts[1].VarName}[i-1].pickupPosition;
                        ${presets.filter(p => p.name === 'sustain')[0].value} => ${stkInsts[1].VarName}[i-1].sustain;
                        ${presets.filter(p => p.name === 'stretch')[0].value} => ${stkInsts[1].VarName}[i-1].stretch;
                        ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
                        ${presets.filter(p => p.name === 'baseLoopGain')[0].value} => ${stkInsts[1].VarName}[i-1].baseLoopGain;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "percFlut") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "man") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'bodySize')[0].value} => ${stkInsts[1].VarName}[i-1].bodySize;
                        ${presets.filter(p => p.name === 'pluckPos')[0].value} => ${stkInsts[1].VarName}[i-1].pluckPos;
                        ${presets.filter(p => p.name === 'stringDamping')[0].value} => ${stkInsts[1].VarName}[i-1].stringDamping;
                        ${presets.filter(p => p.name === 'stringDetune')[0].value} => ${stkInsts[1].VarName}[i-1].stringDetune;
                        ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;

                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;

                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "tubbl") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 48 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwhl") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
                        ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
                        ${presets.filter(p => p.name === 'tonehole')[0].value} => ${stkInsts[1].VarName}[i-1].tonehole;
                        ${presets.filter(p => p.name === 'vent')[0].value} => ${stkInsts[1].VarName}[i-1].vent;
                        ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;                                

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        

                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'speak')[0].value} => ${stkInsts[1].VarName}[i-1].speak;
                        ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
                        duration - (now % duration)  => now;
                        if (${stkArpeggiatorOn} == 1) {
                            ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;

                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "sax") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
                        ${presets.filter(p => p.name === 'stiffness')[0].value} => ${stkInsts[1].VarName}[i-1].stiffness;
                        ${presets.filter(p => p.name === 'aperture')[0].value} => ${stkInsts[1].VarName}[i-1].aperture;
                        ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;              
                        ${presets.filter(p => p.name === 'blowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].blowPosition;
                        ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;                  

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;  

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;  
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bthree") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 12 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;

                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "fmVoic") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'vowel')[0].value} => ${stkInsts[1].VarName}[i-1].vowel;
                        ${presets.filter(p => p.name === 'spectralTilt')[0].value} => ${stkInsts[1].VarName}[i-1].spectralTilt;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                }

                else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") { // is this a dupe?? see above
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                                
                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
                        
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                    }`;
                }

                else if (presets && presets.length > 0 && stkInsts[1].VarName === "krstl") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
            
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;

                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "rod") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wur") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mog") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'filterQ')[0].value} => ${stkInsts[1].VarName}[i-1].filterQ;
                        ${presets.filter(p => p.name === 'filterSweepRate')[0].value} => ${stkInsts[1].VarName}[i-1].filterSweepRate;
                        ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        ${presets.filter(p => p.name === 'afterTouch')[0].value} => ${stkInsts[1].VarName}[i-1].afterTouch;
                        ${presets.filter(p => p.name === 'modDepth')[0].value} => ${stkInsts[1].VarName}[i-1].modDepth;
                        ${presets.filter(p => p.name === 'modSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].modSpeed;

                        notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hevyMetl") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hnkytonk") {
                    allSTKs[`${stkInsts[1].VarName}`] = `
                        ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
                        ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
                        ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
                        ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
                        ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

                        notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
                        1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
                        if (${stkArpeggiatorOn} == 1) {
                            duration - (now % duration)  => now;
                            1 => ${stkInsts[1].VarName}[i-1].noteOff;
                        }`;
                }
                else {
                    console.log("why in the else??? ", stkInsts);
                }
                console.log("WHATTTT IS GOING ON? ", allSTKs);
                return Object.values(allSTKs);
                // } else if (name === "voic") { // <-- buggy ... needs another look            
            }
        });
        console.log("RETURNING STKS... ", Object.values(allSTKs));
        return Object.values(allSTKs);
    }

    // useEffect(() => {
    //     console.log("******************************* BAM ----> ", mingusChordsData, "//** ", mingusKeyboardData);
    // }, [mingusChordsData, mingusKeyboardData]);

    // TODO: CONVERT THIS TO A HELPER!!!
    const playSTKOff = () => {

        // const [currStkType, currStkVar] = currentStkTypeVar.current;
        let stkInsts = universalSources.current && universalSources.current.stk1.instruments;
        const presets: Preset[] | undefined | "" =
            universalSources.current &&
            universalSources.current.stk1.instruments &&
            Object.entries(universalSources.current.stk1.instruments)
                .filter((i: any) => i.On)
                .map((i: any) => i[1] &&
                {
                    [i[0]]: i[1].presets.filter((i: Preset) => i)
                });

        presets && Object.entries(presets).map((preset: [string, Preset], idx: number) => {
            if (presets && stkInsts && Object.values(stkInsts).length > 0) {
                Object.values(stkInsts) && Object.values(stkInsts).length > 0 && Object.values(stkInsts).map((stkInst: EffectsSettings) => {
                    if (stkInst.VarName === "sit" && stkInst.Type === preset[0]) {
                        return `1 =>  ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "bow" && stkInst.Type === preset[0]) {
                        return `
                            ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInst.VarName}[i-1].stopBowing;
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "wg" && stkInst.Type === preset[0]) {
                        return `
                            ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInst.VarName}[i-1].stopBowing;
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "blwbtl" && stkInst.Type === preset[0]) {
                        return `
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
                        `;
                    } else if (stkInst.VarName === "brs" && stkInst.Type === preset[0]) {
                        return `
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "shak" && stkInst.Type === preset[0]) {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "mdlbr" && stkInst.Type === preset[0]) {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "flut" && stkInst.Type === preset[0]) {
                        return `                            
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "clair" && stkInst.Type === preset[0]) {
                        return `                            
                            ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "f" && stkInst.Type === preset[0]) {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "m") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "percFlut") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "man") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "tubbl") {
                        return `                                
                                1 => ${stkInst.VarName}[i-1].noteOff;
                            `;
                    } else if (stkInst.VarName === "blwhl") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    }
                    else if (stkInst.VarName === "voic") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    }
                    else if (stkInst.VarName === "sax") {
                        return `                                
                            ${stkInst.presets.filter((i: any) => i.name === "stopBlowing")[0].value} => ${stkInst.VarName}[i-1].stopBlowing;  
                            1 => ${stkInst.VarName}[i-1].noteOff;
                        `;
                    } else if (stkInst.VarName === "bthree") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;

                    } else if (stkInst.VarName === "fmVoic") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`
                    }
                    else if (stkInst.VarName === "voic") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    }
                    else if (stkInst.VarName === "krstl") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "rod") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "wur") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "mog") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "hevyMetl") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    } else if (stkInst.VarName === "hnkytonk") {
                        return `1 => ${stkInst.VarName}[i-1].noteOff;`;
                    }
                })
                return ``;
            }
        })
    }


    const handleMingusKeyboardData = (data: any) => {
        setMingusKeyboardData(data);
    }

    const handleMingusChordsData = (data: any) => {
        setMingusChordsData(data);
    }

    const handleChangeAudioKey = (key: string) => {
        console.log('ALL GOOD ON KEY ', key);
        setAudioKey(key as string);
    };

    const handleChangeOctave = (octave: string) => {
        console.log('ALL GOOD ON OCTAVE ', octave);
        setOctave(octave);
    };

    const exitEditMode = () => {
        isInPatternEditMode.current = false;
    }

    const handleChuckMsg = (chuckMsg: string) => {
        let isMounted = true;
        const parsedNumbers = chuckMsg.match(/\d+/g) || [];  // Ensure it's always an array
        
        const bC = parsedNumbers.length > 0  
            ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
            : currentBeatCountToDisplay;  // Keep previous value if no valid number found
        
        // console.log("BC: ", bC);
        // console.log("chuckMsg: ", chuckMsg);

        const beatDisplay = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
        const numerCount = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
        const denomCount = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
        const patternCount = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;
        
        // console.log("Beat display: ", beatDisplay);

        setCurrentBeatCountToDisplay(beatDisplay);
        setCurrentNumerCountColToDisplay(numerCount);
        setCurrentDenomCount(denomCount);
        setCurrentPatternCount(patternCount);
        
        return () => {
            isMounted = false;
        }
    }

    const newInitChuck = async () => {
        // await initChuck();
        setClickedBegin(true);
        setShowLoader(false);
        (async () => {
            setShowLoader(true);
            const audioContext = new AudioContext();
            audioContext.suspend();
            const sampleRate = audioContext.sampleRate;
            calculateDisplayDigits(sampleRate);

            const chugins: string[] = loadWebChugins();
            chugins.forEach((chuginPath) => Chuck.loadChugin(chuginPath));
            const DEV_CHUCK_SRC = "https://chuck.stanford.edu/webchuck/dev/"; // dev webchuck src
            const PROD_CHUCK_SRC = "https://chuck.stanford.edu/webchuck/src/"; // prod webchuck src
            let whereIsChuck: string =
                localStorage.getItem("chuckVersion") === "dev"
                    ? DEV_CHUCK_SRC
                    : PROD_CHUCK_SRC;
            // Create theChuck
            const theChuck = await Chuck.init(
                serverFilesToPreload,
                audioContext,
                audioContext.destination.maxChannelCount,
                whereIsChuck
            );
            await theChuck.connect(audioContext.destination);
            if (theChuck && theChuck.context.state === "suspended") {
                const theChuckContext: any = theChuck.context;
                theChuckContext.resume();
            }
            let chuckVersion = '';
            
            theChuck.getParamString("VERSION").then((value: string) => {
                chuckVersion = value;
            });

            chuckRef.current = theChuck;
            chuckRef.current && setChuckHook(chuckRef.current);

            chuckRef.current.chuckPrint = (message) => { 
                if (message.includes("TICK: ")) {
                    const parsedMsg = message.split(":")[1].trim();

                    // setChuckMsg(parsedMsg); 
                    handleChuckMsg(parsedMsg)
                } else {
                    console.log("here is log... ", message);
                }
            }

            setBabylonReady(true);
        })();
    }

    const handleButtonClick = () => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      };
    

    const toggleSliderPanelChildren = (panel: string) => {
        const index = rightPanelOptions.indexOf(panel);

        if (index === -1) {
            // String not found, return the array as-is
            return rightPanelOptions;
        }

        // Move the found string to index 0
        setRightPanelOptions([panel, ...rightPanelOptions.slice(0, index), ...rightPanelOptions.slice(index + 1)]);
        console.log("sanity...: ", [panel, ...rightPanelOptions.slice(0, index), ...rightPanelOptions.slice(index + 1)]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const fileList = e.target.files;
          console.log('File selected:', fileList);
    
          // VERY IMPORTANT: Update file value manually
          setValue("file", fileList);
    
          // Now trigger submit
          handleSubmit(onSubmit)();
        }
    };

    const handleLatestSamples = (   
        fileNames: string[],
        xVal: number,
        yVal: number
    ) => {
        const indices = fileNames.map((fileName: string) => filesToProcess.current.map((i: any) => i.filename).indexOf(fileName));
        if (masterPatternsRef.current[yVal] && masterPatternsRef.current[yVal][xVal]) masterPatternsRef.current[yVal][xVal].fileNums = indices;
        setPatternsHashHook(masterPatternsRef.current);
    };

    const handleLatestNotes = (
        notes: any[],
        xVal: number,
        yVal: number
    ) => {
        console.log("WHAT IS HANDLE LATEST NOTES???  ", xVal, yVal, notes); 
    };

  

    useEffect(() => { 
        console.log("WHAT IS THE PATTERNS HASH HOOK ", masterPatternsHashHook);
     }, [masterPatternsHashHook]);

    const testChord = () => {
        // console.log("CHORD PROGS", mingusChordsData[0].progs);
        // console.log("CHORD PROGS NUMS", mingusChordsData[0].progs_nums);
        console.log(
            "CHORDA ", chordHook
        )

        if (chordHook) {
            runChuck(1);
        }

        console.log("SELECTED CHORD: ", keyScaleChord.chord);
        console.log("SELECTED KEY: ", keyScaleChord.key);
        console.log("SELECTED SPEX: ", selectedChordScaleOctaveRange);
    };

    const testScale = () => {
        console.log(
            "SCALA ", scaleHook
        );
        console.log("SELECTED SPEX: ", selectedChordScaleOctaveRange); 
    }

    const handleUpdateCheckedFXList = (e: any) => {
        updateCheckedFXList(
                e,
                setCheckedEffectsListHook,
                doReturnToSynth,
                setFxKnobsCount,
                updateFlowNodesAndEdges,
                initFX,
                getConvertedRadio,
                fxRadioValue,
        );
    }

    return (
        <Box 
            id={'frontendOuterWrapper'}
        >
            
            <Box id={'relativeFrontendWrapper'}>
                {/* RESPONSIVE APP BAR */}
                {/* {chuckHook && */}
                {
                    <Box 
                        sx={{
                            position: "absolute",
                            width: "calc(100% - 140px)",
                            left: '140px'
                        }} 
                    >
                        <ResponsiveAppBar
                            selectRef={selectRef}
                            tune={tune}
                            currentMicroTonalScale={currentMicroTonalScale}
                            programIsOn={programIsOn}
                            formats={formats}
                            chuckHook={chuckHook}
                            stkFX={universalSources.current && universalSources.current.stk1.instruments && currentStkTypeVar.current && currentStkTypeVar.current[0] ? universalSources.current.stk1.instruments[currentStkTypeVar.current[0] as keyof STKInstruments] : []}
                            fxCount={checkedFXList.current.length}
                            checkedFXList={checkedFXList.current}
                            keysVisible={keysVisible}
                            isAnalysisPopupOpen={isAnalysisPopupOpen}
                            hasHexKeys={hasHexKeys}
                            value={fxRadioValue}
                            universalSources={universalSources.current}
                            vizSource={vizSource}
                            stkValues={stkValues}
                            currentBeatCountToDisplay={currentBeatCountToDisplay}
                            currentNumerCountColToDisplay={currentNumerCountColToDisplay}
                            currentDenomCount={currentDenomCount}
                            currentPatternCount={currentPatternCount}
                            updateHasHexKeys={updateHasHexkeys}
                            handleFormat={handleFormat}
                            setStkValues={setStkValues}
                            // handleSourceToggle={handleSourceToggle}
                            updateStkKnobs={updateStkKnobs}
                            handleSwitchToggle={handleSwitchToggle}
                            handleChange={handleFXRadioChange}
                            handleReturnToSynth={handleReturnToSynth}
                            handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                            handleToggleArpeggiator={handleToggleArpeggiator}
                            runChuck={runChuck}
                            stopChuckInstance={stopChuckInstance}
                            chuckMicButton={chuckMicButton}
                        />
                        {
                            uploadedBlob.current && 
                            <FileWindow 
                                uploadedBlob={uploadedBlob}
                                // setWavesurfer={setWavesurfer}
                                getMeydaData={getMeydaData}
                            />
                        }
                    </Box>
                }

                {typeof window !== 'undefined' && window && (typeof fxKnobsCount !== undefined) && (
                    <Box
                        sx={{
                            width: "100%",
                            height: "calc(100vh)",
                            textAlign: "center",
                            color: "rgba(255,255,255,0.78)",
                            // padding: "0 1rem",
                            display: "flex",
                            justifyContent: "stretch",
                            flexDirection: "column",
                            fontFamily: "monospace",
                            fontSize: "1.5em",
                            padding: clickedBegin ? "0%" : "10%",
                            //background: "linear-gradient(45deg, rgba(0,224,205,0.08) 0%, rgba(17,110,224,0.08) 40%)", 
                        }}
                    >
                        {
                            clickedBegin ? 
                            (
                                <>
                                </>
                            ) :
                            (
                                <Box sx={{width: "100%", height: "100%"}}>
                                    <h1 style={{fontSize: "5rem", top: "24px"}}>SoundSink</h1>
                                    <Button
                                        sx={{
                                            width: '160px',
                                            height: '90px',
                                            // top: "200px",
                                            fontFamily: 'monospace',
                                            fontSize: '1em !important',
                                            paddingLeft: '24px',
                                            margin: '16px',
                                            color: 'rgba(255,255,255,0.78)',
                                            // background: 'rgba(0,0,0,0.78)',
                                            // backgroundColor: 'rgba(0,0,0,0.78)',
                                            border: 'rgba(255,255,255,0.78)',
                                            '&:hover': {
                                                color: '#f5f5f5 !important',
                                                border: '1px solid #1976d2',
                                                background: PALE_BLUE,
                                            }
                                        }}
                                        variant="contained"
                                        id="initChuckButton"
                                        onClick={newInitChuck}
                                        endIcon={<PlayArrowIcon
                                        style={{ 
                                            height: '100%', 
                                            pointerEvents: "none" 
                                        }} 
                                    />}
                                >
                                     Launch Studio
                                    </Button>
                                    <h2 style={{background: 'rgba(20,80,160,0.5)', margin: '4px', marginRight: '20%', marginLeft: '20%'}}>🎶 Sample. Synthesis. Sync.</h2>
                                    <p style={{lineHeight: '1.5rem', margin: '32px'}}> Build sounds, bend samples, and break new ground with our revolutionary micro-DAW, which features AI-driven track separation, in-browser synthesis and sampling, MIDI controls, audio analysis tools, 3D embed capabilities, and external hardware connectivity.</p>
                                </Box>
                            )
                        }

                        <Box
                            // key={babylonKey}
                            sx={{
                                left: '0',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            {chuckHook &&
                                <>
                                    <Box id="rightPanelWrapper">
                                        <Box
                                            ref={parentDivRef}
                                        >
                                            <Box id="rightPanelHeader">
                                                <Box className="right-panel-header-wrapper">
                                                    <Button 
                                                        id='toggleSliderPanelChildren_Effects' 
                                                        className='right-panel-header-button'
                                                        sx={{ backgroundColor: rightPanelOptions[0] === 'effects' ? 'rgba(255,255,255,0.178)' : 'transparent' }}
                                                        onClick={(e: any) => toggleSliderPanelChildren('effects')}
                                                    >
                                                            Effects View
                                                    </Button>
                                                    <Button 
                                                        id='toggleSliderPanelChildren_Pattern' 
                                                        className='right-panel-header-button'
                                                        sx={{ backgroundColor: rightPanelOptions[0] !== 'effects' ? 'rgba(255,255,255,0.178)' : 'transparent' }}
                                                        onClick={(e: any) => toggleSliderPanelChildren('pattern')}
                                                    >
                                                        Patterns View
                                                    </Button>
                                                </Box>
                                                {
                                                    universalSources.current && Object.keys(universalSources.current).length > 0 && rightPanelOptions[0] === 'effects' &&
                                                    <GroupToggle
                                                        name={"test name"}
                                                        options={Object.keys(universalSources.current).map(i => i)}
                                                        handleSourceToggle={handleSourceToggle}
                                                    />
                                                }
                                                <br />
                                                {/* <Box className="right-panel-header-wrapper">
                                                    <Button id='toggleSliderPanelChildren_Effects' className='right-panel-header-button' onClick={(e: any) => toggleSliderPanelChildren('effects')}>Effects View</Button>
                                                    <Button id='toggleSliderPanelChildren_Pattern' className='right-panel-header-button' onClick={(e: any) => toggleSliderPanelChildren('pattern')}>Patterns View</Button>
                                                </Box> */}
                                            </Box>
                                            <Box sx={{ maxHeight: 'calc(100% - 6rem)', display: rightPanelOptions[0] === 'effects' ? "flex" : "none" }}>
                                                <FXRouting
                                                    key={fXChainKey + fxRadioValue}
                                                    fxData={universalSources.current || defaultSources}
                                                    width={440}
                                                    height={440}
                                                    // handleFXGroupChange={handleFXGroupChange}
                                                    updateCheckedFXList={handleUpdateCheckedFXList}
                                                    fxGroupsArrayList={fxGroupOptions}
                                                    checkedFXList={checkedFXList.current}
                                                    fxFX={[]}
                                                    handleClickName={handleClickName}
                                                    setClickFXChain={setClickFXChain}
                                                    clickFXChain={clickFXChain}
                                                    updateFXInputRadio={updateFXInputRadio}
                                                    fxRadioValue={fxRadioValue}
                                                    // updateStkKnobs={updateStkKnobs}
                                                    setStkValues={setStkValues}
                                                    stkValues={stkValues}
                                                    currentScreen={currentScreen.current}
                                                    playUploadedFile={playUploadedFile}
                                                    lastFileUpload={lastFileUpload}
                                                    updateFileUploads={updateFileUploads}
                                                    handleCheckedFXToShow={handleCheckedFXToShow}
                                                    checkedEffectsListHook={checkedEffectsListHook}
                                                    setCheckedEffectsListHook={setCheckedEffectsListHook}
                                                />
                                                <Box id={'reactDiagramsPedalboardWrapper'}>
                                                    <ReactDiagramsPedalboard
                                                        currentChain={currentChain}
                                                        sourceName={getConvertedRadio(fxRadioValue)}
                                                    />
                                                </Box>
                                            </Box>
                                            {/* <div id="modal-root"></div> */}
                                            <Box sx={{display: rightPanelOptions[0] !== 'effects' ? "flex" : "none" }}>
                                                <NotesQuickDash
                                                    featuresLegendData={[]}
                                                    universalSources={universalSources.current}
                                                    handleSourceToggle={handleSourceToggle}
                                                    vizSource={vizSource}
                                                    currentNumerCount={currentNumerCount}
                                                    currentBeatSynthCount={currentBeatSynthCount}
                                                    handleMasterFastestRate={handleMasterRateUpdate}
                                                    handleOsc1RateUpdate={handleOsc1RateUpdate}
                                                    handleOsc2RateUpdate={handleOsc2RateUpdate}
                                                    handleStkRateUpdate={handleStkRateUpdate}
                                                    handleSamplerRateUpdate={handleSamplerRateUpdate}
                                                    handleAudioInRateUpdate={handleAudioInRateUpdate}
                                                    currentNoteVals={currentNoteVals}
                                                    filesToProcess={filesToProcess.current}
                                                    numeratorSignature={numeratorSignature}
                                                    denominatorSignature={denominatorSignature}
                                                    editPattern={editPattern}
                                                    masterPatternsHashHook={masterPatternsHashHook}
                                                    masterPatternsHashHookUpdated={masterPatternsHashUpdated}
                                                    inPatternEditMode={inPatternEditMode}
                                                    selectFileForAssignment={selectFileForAssignment}
                                                    handleChangeCellSubdivisions={((num: number) => {
                                                        console.log("NUMMMMM ", num) 
                                                        setCellSubdivisions(cellSubdivisions + 1);
                                                    })}
                                                    cellSubdivisions={cellSubdivisions}
                                                    resetCellSubdivisionsCounter={resetCellSubdivisionsCounter}
                                                    handleClickUploadedFiles={handleClickUploadedFiles}
                                                    parentDiv={parentDivRef.current}

                                                    masterFastestRate={masterFastestRate}

                                                    currentBeatCountToDisplay={currentBeatCountToDisplay}
                                                    currentNumerCountColToDisplay={currentNumerCountColToDisplay}
                                                    currentDenomCount={currentDenomCount} 
                                                    currentPatternCount={currentPatternCount}

                                                    exitEditMode={exitEditMode}

                                                    clickHeatmapCell={clickHeatmapCell}

                                                    isInPatternEditMode={isInPatternEditMode.current}
                                                    handleLatestSamples={handleLatestSamples}
                                                    handleLatestNotes={handleLatestNotes}

                                                    mTFreqs={mTFreqs}
                                                    mTMidiNums={mTMidiNums}
                                                    updateKeyScaleChord={updateKeyScaleChord}
                                                    testChord={testChord}
                                                    testScale={testScale}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>




            {/* WTF is current screen??? {currentScreen.current} */}
            {/* {...Object(visibleFXKnobs).values().map((i: any)=>i).toString()} */}



                                    {/* BABYLON LAYER */}
                                    <Box 
                                        sx={{
                                            boxSizing: 'border-box',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        key={babylonKey}
                                    >
{currentScreen.current !== "synth" && <ArrowBack 
    onClick={() => {
        currentScreen.current = "synth";
        visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
        setFxKnobsCount(moogGrandmotherEffects.current.length);
        updateCurrentFXScreen(
            setFxKnobsCount,
            setBabylonKey,
            babylonKey,
        );
    }}
    sx={{
    display: "flex", 
    flexDirection: "column", 
    marginLeft: "140px", 
    position: "absolute",
    cursor: "pointer",
    top: "96px",
    zIndex: "9999",
    background: "purple",
}}></ArrowBack>}
{/* <span style={{zIndex: "9999", color: 'white', position: "absolute", top: "68px", right: "148px"}}>
    {currentScreen.current.includes("_") ? currentScreen.current.replace("stk_", "") : `${currentScreen.current.charAt(0).toUpperCase()}${currentScreen.current.slice(1)} `}
</span> */}
                                        {babylonReady && babylonReady && <BabylonLayer
                                            currentBeatCountToDisplay={{currentBeatCountToDisplay}}
                                            bpm={bpm}
                                            handleUpdateSliderVal={handleUpdateSliderVal}
                                            fxKnobsCount={fxKnobsCount}
                                            needsUpdate={needsUpdate}
                                            handleResetNeedsUpdate={() => setNeedsUpdate(false)}
                                            effects={currentFX.current}
                                            visibleFXKnobs={visibleFXKnobs.current}
                                            chuckUpdateNeeded={chuckUpdateNeeded}
                                            chuckHook={chuckHook}
                                            hasHexKeys={hasHexKeys}
                                            showFX={{ showFX }}
                                            programIsOn={programIsOn}
                                            microTonalArr={newMicroTonalArr}
                                            updateHasHexKeys={updateHasHexkeys}
                                            fxRadioValue={fxRadioValue || "osc1"}
                                        />}
                                    </Box>

                                    {/* LEFT CONTAINER */}
                                    <Box id="leftContainerWrapper">
                                        {
                                            showBPM && (
                                                <Box sx={{
                                                    position: "relative",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    paddingTop: "12px",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    paddingBottom: "32px",
                                                    
                                                }}>
                                                    <BPMModule
                                                        bpm={bpm}
                                                        setBpm={setBpm}
                                                        beatsNumerator={beatsNumerator}
                                                        beatsDenominator={beatsDenominator} 
                                                        setChuckUpdateNeeded={setChuckUpdateNeeded}
                                                        setBeatsNumerator={setBeatsNumerator} 
                                                        setBeatsDenominator={setBeatsDenominator} 
                                                        setNumeratorSignature={setNumeratorSignature} 
                                                        setDenominatorSignature={setDenominatorSignature}                                                    
                                                    />
                                                </Box>
                                            )
                                        }

                                        <FileManager 
                                            handleSubmit={handleSubmit}
                                            onSubmit={onSubmit}
                                            chuckHook={chuckHook}
                                            register={register}
                                            handleFileChange={handleFileChange}
                                            handleButtonClick={handleButtonClick}
                                            FileUploadIcon={FileUploadIcon}
                                            inputRef={inputRef}
                                        />


                                        <Box sx={{ position: "relative" }}>
                                            <Box sx={{
                                                position: 'relative',
                                                background: 'rgba(0,0,0,0.78)',
                                                color: 'rgba(255,255,255,0.78)',
                                            }}>
                                                <Box sx={{
                                                    backgroundColor: 'rgba(0,0,0,0.78)',
                                                    // width:'100%', 
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    minHeight: 'calc(100vh-13rem)',
                                                }} key={'handleClickUploadedFilesWrapper'}>

                                                    {filesToProcess.current.map((file: any) => {
                                                        return <Button
                                                            sx={{
                                                                // left: '24px'
                                                                border: '1px solid rgba(0,0,0,0.78)',
                                                                width: '100%',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                            }}
                                                            key={`handleClickUploadedFilesBtn_${file.filename}`}
                                                            onClick={handleClickUploadedFiles}>{
                                                                file.filename
                                                            }</Button>
                                                    })}
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <InstrumentsAndMicrotones
                                            // updateStkKnobs={updateStkKnobs}
                                            stkValues={stkValues}
                                            setStkValues={setStkValues}
                                            tune={tune}
                                            currentMicroTonalScale={currentMicroTonalScale}
                                            setFxKnobsCount={setFxKnobsCount}
                                            setBabylonKey={setBabylonKey}
                                            babylonKey={babylonKey}
                                            setNeedsUpdate={setNeedsUpdate}
                                            currentScreen={currentScreen}
                                            currentFX={currentFX}
                                            currentStkTypeVar={currentStkTypeVar}
                                            universalSources={universalSources}
                                            updateCurrentFXScreen={updateCurrentFXScreen}
                                            getSTK1Preset={getSTK1Preset} 
                                            universalSourcesRef={universalSources}                                            />
                                        </Box>

                                        {/* <Box>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                borderRight: '0.5px solid rgba(255,255,255,0.78)', 
                                            
                                            }}><MingusPopup 
                                                updateKeyScaleChord={updateKeyScaleChord}
                                            /> </Box>
                                        </Box> */}
                                    </Box>
                                </>
                            }
                        </Box>
                    </Box>
                )}
                <Box
                    sx={{
                        width: 'calc(100vw - 140px)',
                        position: 'absolute',
                        zIndex: "9999",
                        bottom: '0px',
                        left: '140px',
                    }}
                >                                        
                    <KeyboardControls
                        selectRef={selectRef}
                        tune={tune}
                        chuckHook={chuckHook}
                        stkValues={stkValues}
                        checkedEffectsListHook={checkedEffectsListHook}
                        handleChange={handleFXRadioChange}
                        currentMicroTonalScale={currentMicroTonalScale}
                        handleCheckedFXToShow={handleCheckedFXToShow}
                        setStkValues={setStkValues}
                        updateStkKnobs={updateStkKnobs}
                        handleMingusKeyboardData={handleMingusKeyboardData}
                        handleMingusChordsData={handleMingusChordsData}
                    />

                    <Keyboard
                        chuckHook={chuckHook}
                        keysVisible={keysVisible}
                        keysReady={keysReady}
                        notesAddedDetails={notesAddedDetails}
                        organizeRows={organizeRows}
                        organizeLocalStorageRows={organizeLocalStorageRows}
                        noteOnPlay={noteOnPlay}
                        compare={compare}
                        updateKeyScaleChord={updateKeyScaleChord}
                    />
                </Box>
            </Box>
        </Box>
    )
};
