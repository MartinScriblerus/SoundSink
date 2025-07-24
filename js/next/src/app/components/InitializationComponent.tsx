"use client"

import { Box, Button, SelectChangeEvent, Slider } from '@mui/material';
import React, { useState, useEffect, useRef, useMemo, SetStateAction, useCallback } from 'react'
import BabylonLayer from './BabylonLayer';
import { Chuck, HID } from 'webchuck';
import { Note } from "tonal";
import moogGMPresets from '../../utils/moogGMPresets';

import { STKOption, fxGroupOptions } from '../../utils/fixedOptionsDropdownData';
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
import { defaultNoteVals, getChord } from '@/utils/FXHelpers/helperDefaults';
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
import { getChuckCode, noteToFreq } from '@/utils/chuckHelper';
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
    masterPatternsRef, 
    messageRef, 
    midiAccess, 
    modulateFinalHelper, 
    moogGrandmotherEffects, 
    NOTES_SET_REF, 
    parentDivRef, 
    powerADSRFinalHelper, 
    regionEnd, 
    regionStart, 
    resetHeatmapCell, 
    spectacleFinalHelper, 
    stkKnobValsRef, 
    testArrBuffFile, 
    totalDuration, 
    universalSources, 
    uploadedBlob, 
    visibleFXKnobs, 
    wavesurferRef, 
    winFuncEnvFinalHelper, 
    workerRef, 
    wpDiodeLadderFinalHelper, 
    wpKorg35FinalHelper 
} from '../state/refs';
import FileWindow from './FileWindow';
import FileManager from './FileManager';
import { handleFXGroupChange, handleReturnToSynth, updateCheckedFXList, updateCurrentFXScreen, updateStkKnobs, valuetext } from '@/utils/knobsHelper';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ControlValsView from './ControlValsView';
import HydraInit from './HydraInit';
import STKManagerDropdown from './STKManagerDropdown';
import { noteToMidi } from '@/utils/siteHelpers';
import { AnimatedTitle } from './AnimatedTitle';

interface Note {
    frequency: number;
    midiNumber: number;
    name: string;
}

export default function InitializationComponent() {
    
    const [programIsOn, setProgramIsOn] = useState<boolean>(false);
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const [babylonReady, setBabylonReady] = useState(false);
    const [formats, setFormats] = React.useState<any>(() => []);
    const [checkedEffectsListHook, setCheckedEffectsListHook] = useState<Array<any>>([]);
    
    // NEEDS WORK (after samples)...
    const [masterVolumeValsUpdated, setMasterVolumeValsUpdated] = useState<any>(false);
    const [keysVisible, setKeysVisible] = useState(false);
    const [keysReady, setKeysReady] = useState(false);
    const [vizSource, setVizSource] = useState<string>('');

    const [chuckIsReady, setChuckIsReady] = useState(false);
    const [screenView, setScreenView] = useState<number>(1);

    const [noteBuilderFocus, setNoteBuilderFocus] = useState<string>("Scale");

    const [selectedChordScaleOctaveRange, setSelectedChordScaleOctaveRange] = useState<any>({
        key: 'C',
        scale: 'Diatonic',
        octaveMin: '1',
        octaveMax: '4',
        chord: 'Major Triad',
    });

    const [midiData, setMidiData] = useState<any>(null);
    const [meydaData, setMeydaData] = useState(null);
    const [pedalChainNeedsUpdate, setPedalChainNeedsUpdate] = useState<boolean>(false);
    const [initialNodesHook, setInitialNodesHook] = useState<any>();
    const [initialEdgesHook, setInitialEdgesHook] = useState<any>();
    const [keyScaleChord, setKeyScaleChord] = useState<any>({
        octaveMax: '4',
        octaveMin: '1',
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
    const [clickedBegin, setClickedBegin] = useState<boolean>(false);
    const [stkValues, setStkValues] = useState<STKOption[]>([]);
    const [midiBPMClockIncoming, setMidiBPMClockIncoming] = useState<any>([]);
    const [fxRadioValue, setFxRadioValue] = React.useState<any>('Osc1'); 
    // const [analysisSourceRadioValue, setAnalysisSourceRadioValue] = React.useState<any>('Osc');
    const [showBPM, setShowBPM] = useState<boolean>(true);
    // const [showSTKManager, setShowSTKManager] = useState<boolean>(false);
    const [octave, setOctave] = useState('4'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioKey, setAudioKey] = useState('C'); // ** THESE SHOULD EXIST AS NEW OBJECT
    // const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);
    const [controlView, setControlView] = useState<string>("knobsView");
    const [activeSTKs, setActiveSTKs] = useState<any[]>([]);
    const [arpeggiatorOn, setArpeggiatorOn] = useState<number>(0);
    const [stkArpeggiatorOn, setStkArpeggiatorOn] = useState<number>(0);
    const [cellSubdivisions, setCellSubdivisions] = useState<number>(1);
    const [hideCircularArpBtnsHook, setHideCircularArpBtnsHook] = useState<boolean>(false);
    const [hasHexKeys, setHasHexKeys] = useState<boolean>(false);
    const [tune, setTune] = useState<any>(null);
    const [mingusKeyboardData, setMingusKeyboardData] = useState<any>([]);
    const [mingusChordsData, setMingusChordsData] = useState<any>([]);
    const [currentChain, setCurrentChain] = useState<any>();
    // const [meydaNeedsUpdate, setMeydaNeedsUpdate] = useState<boolean>(false);
    const [lastFileUpload, setLastFileUpload] = useState<any>('');
    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);
    const [currentBeatSynthCount, setCurrentBeatSynthCount] = useState<number>(0);
    const [currentBeatCountToDisplay, setCurrentBeatCountToDisplay] = useState<number>(0);
    const [currentNumerCount, setCurrentNumerCount] = useState<number>(0);
    const [currentNumerCountColToDisplay, setCurrentNumerCountColToDisplay] = useState<number>(0);
    const [currentDenomCount, setCurrentDenomCount] = useState<number>(1);
    const [currentPatternCount, setCurrentPatternCount] = useState<number>(0);
    const [patternsPerCycle, setPatternsPerCycle] = useState<number>(4);
    const [masterFastestRate, setMasterFastestRate] = useState<number>(4);
    // const [estimatedMidiClockBpm, setEstimatedMidiClockBpm] = useState<any>();
    // const [keysFullscreen, setKeysFullscreen] = useState<boolean>(false);
    const [masterPatternsHashHook, setPatternsHashHook] = useState<any>({});
    const [masterPatternsHashUpdated, setPatternsHashUpdated] = useState<boolean>(false);
    const [mTFreqs, setMTFreqs] = useState<any>([]);
    const [mTNames, setMTNames] = useState<any>([]);
    
    const [notes, setNotes] = useState<Note[]>([]);
    const [mTMidiNums, setMTMidiNums] = useState<any>([]);
    const [showNotesOrder, setShowNotesOrder] = useState<string>('asc');
    const mTScaleLen = useRef<number>(0);
    isInPatternEditMode.current = isInPatternEditMode.current || false;
    const [hold, setHold] = useState<any>(0);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [updated, markUpdated] = useUpdatedNeeded();
    const [isAudioView, setIsAudioView] = React.useState<boolean>(false);
    const [microtonalScale, setMicrotonalScale] = useState<string>('');
    const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState<boolean>(true);
    const [checkedFXUpdating, setCheckedFXUpdating] = useState<boolean>(false);
    const [showFX, setShowFX] = useState<boolean>(false);

    const [showNotesAscending, setShowNotesAscending] = useState<boolean>(true);

    const [maxMinFreq, setMaxMinFreq] = useState<any>({});

    const [scaleHook, setScaleHook] = useState<any>(null);
    const [invertedScaleHook, setInvertedScaleHook] = useState<any>(null);
    const [chordHook, setChordHook] = useState<QueryResponse | null>(null);

    const finalMicroToneNotesRef = useRef<any>([]);

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

    const notesRef = useRef<Note[]>([]);

    const signalChain: any = [];
    const signalChainDeclarations: any = [];
    const valuesReadout: any = {};
    const valuesReadoutDeclarations: any = {};
    
    const signalChainSampler: any = [];
    const signalChainSamplerDeclarations: any = [];
    const valuesReadoutSampler: any = {};
    const valuesReadoutSamplerDeclarations: any = {};

    const signalChainSTK: any = [];
    const signalChainSTKDeclarations: any = [];
    const valuesReadoutSTK: any = {};
    const valuesReadoutSTKDeclarations: any = {};

    const signalChainAudioIn: any = [];
    const signalChainAudioInDeclarations: any = [];
    const valuesReadoutAudioIn: any = {};
    const valuesReadoutAudioInDeclarations: any = {};

    const handleNoteBuilder = (val: any) => {
        console.log("notebuilder val? ", val);
        val && setNoteBuilderFocus(val);
        const test = updateKeyScaleChord(keyScaleChord.key, keyScaleChord.scale, keyScaleChord.chord, keyScaleChord.chordLabel, keyScaleChord.octaveMax, keyScaleChord.octaveMin, val);
        console.log("TEST RETURNED: ", test);  
    };

    const consistentNotes = useRef<any>();
    consistentNotes.current = consistentNotes.current || [];

    // const doAutoAssignPatternNumber = useRef<number>(0);
    const [doAutoAssignPatternNum, setDoAutoAssignPatternNum] = useState<number>(0);

    resetHeatmapCell.current = false;

    const babylonKeyRef = useRef<string>(`babylonKey_`);

    const persistLastMidiNote = useRef<any>(null);
    if (midiData && midiData.triggerArgs && midiData.triggerArgs.length > 1) {
        persistLastMidiNote.current = midiData.triggerArgs[1]
    }

    const noteOnPlay = useCallback(
        async (theMidiNum: number, theMidiVelocity: number, theMidiHz?: any) => {
          await chuckRef.current;
          currNotesHash.current[`${theMidiNum}`] = [theMidiNum, theMidiVelocity];
          currNotes.current = Object.values(currNotesHash.current)
            .map((i: any) => i[0])
            .filter((i: any) => i);
      
          currNotes.current.forEach((note: any) => triggerNote(note));
        },
        // [chuckRef, currNotesHash, currNotes] // Only if these are not refs!
        []
    );

    const noteOffPlay = useCallback(
        async (theMidiNum: number) => {
          await chuckRef.current && await chuckHook;
      
          const noteOffIndex = consistentNotes.current.indexOf(theMidiNum);
          const currentNotesIndex = currNotesHash.current[theMidiNum];
          if (noteOffIndex !== -1 || currentNotesIndex) {
            console.log("do we have a noteOff Index? ", noteOffIndex, " consistentNotes: ", consistentNotes.current, "theMidiNum: ", theMidiNum, "currNotesHash: ", currNotesHash.current);
      
            chuckHook &&
              chuckRef.current &&
              await chuckRef.current.setFloatArray(
                "testNotesArr",
                consistentNotes.current.map((i: any) =>
                  i !== theMidiNum ? Number(parseFloat(i).toFixed(2)) : null
                ).filter((i: any) => i !== null)
              );
      
            let floatArr;
            try {
              floatArr =
                chuckHook &&
                chuckRef.current &&
                (await chuckRef.current.getFloatArray("chuckNotesOff"));
            } catch (e) {
              // ignore
            }
      
            const newArr: number[] = floatArr ? [...floatArr, theMidiNum] : [];
            chuckHook &&
              chuckRef.current &&
              await chuckRef.current.setFloatArray("chuckNotesOff", newArr);
      
            currNotesHash.current[`${theMidiNum}`] = false;
            delete currNotesHash.current[`${theMidiNum}`];
            consistentNotes.current = consistentNotes.current.filter(
              (i: any) => i !== theMidiNum
            );
            triggerNoteOff(theMidiNum);
          }
        },
        [chuckHook, consistentNotes] // Only if not refs
      );

    useEffect(() => {
        // console.log("MIDI DATA: ", midiData);
        if (midiData && Object.values(midiData).length > 0) {
            if (midiData.triggerArgs && midiData.triggerArgs[0] === 144) {
                persistLastMidiNote.current = midiData.triggerArgs[1];
                chuckHook && noteOnPlay(midiData.triggerArgs[1], midiData.triggerArgs[2], 440.0 * Math.pow(2, (midiData.triggerArgs[1] - 69) / 12.0));
            } else if (midiData.triggerArgs && midiData.triggerArgs[0] === 128) {
                chuckHook && noteOffPlay(persistLastMidiNote.current);
            }
        }
    }, [midiData, chuckHook, noteOffPlay, noteOnPlay]);

    useEffect(() => {
        if (masterPatternsHashUpdated === true) {
            setPatternsHashUpdated(false);
        }
    }, [masterPatternsHashUpdated]);

    useEffect(() => {
        if (typeof midiBPMClockIncoming === "number") {
            setBpm(midiBPMClockIncoming);
        }
        return () => {
        };
    }, [midiBPMClockIncoming]);

    const handleAssignPatternNumber = (e: any) => {
        const newPatternNumber = e.target.value;
        console.log("check auto assign pattern number is now... ",  newPatternNumber);
        setDoAutoAssignPatternNum(newPatternNumber);
    };


    useEffect(() => {
        const beatsPerMeasure = numeratorSignature;               // e.g., 4
        const beatSubdivision = masterFastestRate;                // e.g., 4 → sixteenth notes if quarter note base
        const totalSteps = beatsPerMeasure * beatSubdivision;     // total columns / cells in a row
        const numRows = 4;                                        // total tracks (row "0" → row "3")

        // Ensure masterPatternsRef initialized
        if (!masterPatternsRef.current) masterPatternsRef.current = {};

        // Loop to create each row (starting at "0" so first row aligns to buffer[0])
        for (let rowIdx = 0; rowIdx <= numRows; rowIdx++) {
            const rowKey = `${rowIdx}`; // e.g., "0", "1", "2", "3"

            // Initialize row if missing (keep existing so user edits persist)
            masterPatternsRef.current[rowKey] = masterPatternsRef.current[rowKey] || {};

            // Loop to create each step / cell in this row
            for (let step = 0; step < totalSteps; step++) {
            const stepKey = `${step}`;

            // ⚡ Only initialize cell if missing → keeps dynamic edits safe
            if (!masterPatternsRef.current[rowKey][stepKey]) {
                masterPatternsRef.current[rowKey][stepKey] = {
                on: true,
                step,
                color: 'blue',

                // SAFE DEFAULTS — keep cells editable:
                // *** SHOULDN'T NOTE AND NOTEHZ BE SWAPPED???? 
                note: mTFreqs[step] !== undefined ? mTFreqs[step] : 440.0,
                noteHz: mTMidiNums[step] !== undefined ? mTMidiNums[step] : 69,
                noteName: mTNames[step] || 'A4',
                fileNums: [],
                length: '1/16',
                velocity: 0.9,
                midiInfo: {
                    noteOnLength: 1000,
                    pitch: mTMidiNums[step] !== undefined ? mTMidiNums[step] : 69,
                    velocity: 0.9,
                },
                subdivisions: 1
                };
            }
            }
        }
        // Update React state to trigger render
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
    }, [
    numeratorSignature,
    masterFastestRate,
    mTFreqs,
    mTMidiNums,
    mTNames
    ]);



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

        const getFreqVals: any = noteToFreq(selectedChordScaleOctaveRange.key, Number(+selectedChordScaleOctaveRange.octaveMax));

        tune.tonicize(getFreqVals);

        mTScaleLen.current = tune.scale.length;

        const microtonalFreqs: any[] = [];
        const microFreqsObj: any = {};
        const microtonalMidiNums: any[] = [];

        if (!tune.scale) return;

        for (let i = -3; i < 6; i++) {
            for (let j = 0; j < tune.scale.length; j++) {
                tune.mode.output = "frequency";
                microtonalFreqs.push(tune.note(j, i).toFixed(2));
                microFreqsObj[`${i + 3}`] = microFreqsObj[`${i + 3}`] || {};
                microFreqsObj[`${i + 3}`][`${j}`] = tune.note(j, i).toFixed(2);
                tune.mode.output = "MIDI";
                microtonalMidiNums.push(tune.note(j, i).toFixed(4));

                if (!allOctaveMidiFreqs.current[`${i + 3}`]) {
                    allOctaveMidiFreqs.current[`${i + 3}`] = {};
                }
                allOctaveMidiFreqs.current[`${i + 3}`][`${j}`] = [microtonalFreqs[microtonalFreqs.length - 1] || 'r1', microtonalMidiNums[microtonalMidiNums.length - 1] || 'r2'];
            }
        }
        console.log("micro freqs obj: ", microFreqsObj);
        const flattenFreqsInRange = (
            obj: Record<number, Record<number, number>>,
            minOctave: number,
            maxOctave: number
          ): number[] => {
            const result: number[] = [];
          
            for (let octave = minOctave; octave <= maxOctave; octave++) {
              const scale = obj[octave];
              if (!scale) continue;
          
              const positions = Object.keys(scale).map(Number).sort((a, b) => a - b);
              for (const pos of positions) {
                result.push(scale[pos]);
              }
            }
          
            return result;
        };
        finalMicroToneNotesRef.current = flattenFreqsInRange(microFreqsObj, +selectedChordScaleOctaveRange.octaveMin, +selectedChordScaleOctaveRange.octaveMax)
        setMTFreqs([]);
        setMTFreqs(finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).length > 0 ? finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).map((i: any) => Number(parseFloat(i).toFixed(2))) : '9999.2');

        masterPatternsRef.current = {};
        microtonalMidiNums.length && setMTMidiNums(microtonalMidiNums);

        setHasHexKeys(true);

        theScale = scale && scale.length > 0 && scale.value && scale.value;
        console.log("have we got the scale? ", theScale);
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

    const handleNoteLengthUpdate = (e: any, cellData: any) => {
        console.log("NOTE LENGTH UPDATE: ", e && e.target && e.target.value);
        console.log("CELL DATA NOTE LEN ", cellData);
        console.log("MASTER PATTERNS REF: ", masterPatternsRef.current);
    };

    const handleNoteVelocityUpdate = (e: any, cellData: any) => {
        console.log("NOTE VELOCITY UPDATE: ", e && e.target && e.target.value);
        console.log("CELL DATA NOTE VEL ", cellData);
        console.log("MASTER PATTERNS REF: ", masterPatternsRef.current);
    };

    const onSubmit = async (files: any) => {
        if (files.length === 0) return;
        if (isSubmitting.current) {
            console.log("Already submitting, aborting...");
            isSubmitting.current = false; // UNLOCK
            return;
        }
        if (!files.file || files.file.length === 0) {
            console.log('No file uploaded.');
            return;
        }
        console.log("FILE??? : ", files);
        const file = files.file[0];
        isSubmitting.current = true;
        const fileDataBuffer: any = await file.arrayBuffer();
        console.log("GOT FILEDATABUFFER?  ", fileDataBuffer);
        const fileData: any = new Uint8Array(fileDataBuffer);
        const blob = new Blob([fileDataBuffer], { type: "audio/wav" });
        console.log("GETTING BLOB?? ", blob, "HAVE UP CURR??? ", uploadedBlob.current);
        if (blob && (!uploadedBlob.current || blob.size !== uploadedBlob.current.size || blob.type !== uploadedBlob.current.type)) {
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
            if (filesToProcess.current.map((i: any) => i.name).indexOf(formattedName) === -1 
            ) {       
                filesToProcess.current.push({ 'filename': formattedName, 'data': fileData, 'processed': false }); 
                console.log("FILES TO PROCESS: ", filesToProcess.current);
                chuckRef.current && chuckRef.current.createFile("", formattedName, fileData);
            } 
     
            const meydaDat = await getMeydaData(arrayBuffer);
            if (chuckHook) {
                setChuckUpdateNeeded(true);
            }
            isSubmitting.current = false; // UNLOCK
            // setValue("", []);
        }
        fileReader.readAsArrayBuffer(fileBlob);
    }

    const handleClickName = (e: any, op: string) => {
        console.log('TEST CLICK ', e, op);
    };

    useEffect(() => {
        let isMounted = true;
        if (!microtonalScale || !tune) return;
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
                console.log("!@#$-MICROTONAL FREQS: ", "j: ", j, "i: ", i, "array: ", tune.note(j, i).toFixed(4));
                microtonalMidiNums.includes(tune.note(j, i).toFixed(4)) && microtonalMidiNums.push(tune.note(j, i).toFixed(4));
            }
        }
        console.log("Gosh microtonal freqs ", microtonalFreqs);
        console.log("Gosh microtonal midi nums ", microtonalMidiNums);
        return () => {
            isMounted = false;
        };
    }, [microtonalScale, tune]);

    const convertMicrotonalChord = () => {
        // DEFINITELY DO THIS!!! HERE IS A MICROTONAL TUNING MODE FOR REGULAR KEYBOARD
    }

    const { getMingusData } = useMingusData();

    initialNodes.current = initialNodesDefaults && initialNodesDefaults;

    initialEdges.current = initialEdgesDefaults && initialEdgesDefaults;

    keysAndTuneDone.current = keysAndTuneDone.current || false;

    const initFX = useCallback((updateCurrentFXScreen: any) => {
        let visibleStkAndFX: Array<any>;
        if (universalSources.current) {
            console.log('current screen: ', currentScreen.current, doReturnToSynth.current, checkedFXUpdating);

            if (doReturnToSynth.current !== true) {
                // **** THIS IS WHERE THE ISSUE MAY BE HAPPENING => WHATEVER GETS PASSED INTO VISIBLESTKSANDFX ALWAYS WINS 
                visibleStkAndFX = Object.entries(universalSources.current).filter(
                    (i: any) => i[0].toLowerCase() === getConvertedRadio(fxRadioValue).toLowerCase()
                        && Object.values(i[1].effects).filter(
                            (j: any) => j));
                 console.log('visible stk and fx: ', visibleStkAndFX);
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
                                    && i[1] && Object.values(i[1])))[0][1]).map((i: any) => { 
                                        console.log("I've set label as: ", [i[1].label, i[1]]); 
                                        return[i[1].label, i[1]];
                                    })  
                    :
                    Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i])

            setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);
            setNeedsUpdate(true);
        }
        if (initialNodes.current && initialEdges.current) {
            setInitialNodesHook(initialNodes.current.filter((i: any) => i));
            setInitialEdgesHook(initialEdges.current.filter((i: any) => i));
        }        
    }, [fxRadioValue, checkedFXUpdating]);

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
        tune,
        initFX,
    ]);

    useEffect(() => {
        let isMounted = true;
        currentFX.current = [];
        checkedFXList.current = [];
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
        console.log("CHAIN AUDIO IN: ", chain.audioin);
        console.log("CHECK AUDIO IN ON Z CHAIN: ", `${getConvertedRadio(fxRadioValue).toLowerCase()}`)

        const currentInst: any[] = chain[`${getConvertedRadio(fxRadioValue).toLowerCase()}`]
        currentInst && setCurrentChain(currentInst);
    };


    ////////////////////////////////////////////////////////////////
    // WE WANT ONLY ONE LOOP THROUGH WHATEVER OBJECT HOLDS THE SOURCES RIGHT HERE... 
    ////////////////////////////////////////////////////////////////

    const genericFXToString = (sources: Sources) => {
        console.log("S O U R C E S: ", sources);

        if (
            universalSources.current && 
            universalSources.current.stk1.instruments
        ) {
            console.log("*S R C s: ", Object.values(Object.values(universalSources.current.stk1.instruments).filter((i: any) => i.On).map(i => [i.Type, i.VarName, i.presets.map((i: any) => [i.name, i.value])])));
        }

        if (sources && Object.keys(sources).length > 0 && sources.osc1) {
            console.log("!@!@!@!@ ",  Object.values(sources.osc1.effects).filter((i: any) => i.On).map(i => i));
            const osc1NewVals = Object.values(sources.osc1.effects).filter((i: any) => i.On).map(i => [i.Type, i.VarName, Object.values(i.presets).map((i: any) => [i.name, i.value])]);

            osc1NewVals && osc1NewVals.length > 0 && osc1NewVals.map((i: any) => {
                const effectPart = i[1];
                const effectNom = `${i[1]}_osc1`;
                i[2].map((preset: any) => {
                    const presetName = preset[0];
                });

            });
            const osc2NewVals = Object.values(sources.osc2.effects).filter((i: any) => i.On).map(i => [i.Type, i.VarName, Object.values(i.presets).map((i: any) => [i.name, i.value])]);
            const stkNewVals = Object.values(sources.stk1.effects).filter((i: any) => i.On).map(i => [i.Type, i.VarName, Object.values(i.presets).map((i: any) => [i.name, i.value])]);
            const samplerNewVals = Object.values(sources.sampler.effects).filter((i: any) => i.On).map(i => [i.Type, i.VarName, Object.values(i.presets).map((i: any) => [i.name, i.value])]);
            const audioInNewVals = Object.values(sources.audioin.effects).filter((i: any) => i.On).map(i => [i.Type, i.VarName, Object.values(i.presets).map((i: any) => [i.name, i.value])]);
        }

        if (!sources) return;

        Object.entries(sources).forEach((i: [string, Source]) => { 
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
                            }
                        } else {
                        }
                    })
            });           
        });
        universalSources.current && 
        universalSources.current.stk1.instruments &&
        setActiveSTKs(
            Object.values(universalSources.current.stk1.instruments).filter((i: any) => i.On)
        )
        setChuckUpdateNeeded(true);
    };

    //////////////////////////////////////////////////////////////////

    type NoteHolderItem = {
        octave: number;
        pitch: number;
        midiNum: number;
        name: string;
    }
    type NoteHolder = {
        [key: string]: NoteHolderItem;
    }
    
    const notesHolder = useRef<any>({});

    const [notesAddedDetails, setNotesAddedDetails] = useState<any>([]);

    const notesDetailsRef = useRef<any>();
    notesDetailsRef.current = notesDetailsRef.current || [];

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
            notesHolder.current[`${noteReady.name}`] = {
                midiNote: noteReady.midiNote,
                midiHz: noteReady.midiHz,
                name: noteReady.name,
            }
            notesDetailsRef.current.indexOf(`${noteReady.name}`) === -1 && notesAddedDetails.length < 1 && setNotesAddedDetails((m: any) => [...m, noteReady]);
                setKeysReady(true);
                setKeysVisible(true);
        } else {
            alert("baby steps!");
            setKeysReady(false);
            setKeysVisible(false);
            return;
        }
        notesDetailsRef.current.push(`${noteReady.name}`)
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
            // const processor = audioContext.createScriptProcessor(512, 1, 1);
            const processor = new AudioWorkletNode(audioContext, 'meyda-audio-processor');
            // console.log("meyda processor: ", processor);
            if (!workerRef.current) {
                workerRef.current = new Worker("/workers/meydaWorker.js", { type: 'module' });
                workerRef.current.onmessage = (e) => {
                    console.log("Extracted Features:", e.data);
                };
            }
            processor.port.onmessage = (event) => {
                if (event.data.audioData) {
                    const clonedBuffer = event.data.audioData.slice(0); 
                    event.data.audioData && workerRef.current?.postMessage({
                        audioData: clonedBuffer,
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

        // Create a function for setting up MIDI access asynchronously
        const setupMIDI = async () => {
            if (!chuckRef.current || !chuckRef.current.context) return;
            console.log("chuck audio ctx: ", chuckRef.current.context);
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

        return () => {
            if (isMounted) {
                workerRef.current && workerRef.current.terminate();
                isMounted = false;
            }
            if (midiAccess.current) {
                for (const input of midiAccess.current.inputs.values()) {
                    input.onmidimessage = null; // Clean up MIDI event listeners
                }
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
                console.log("!@#*** updating generic string... ", moogGrandmotherEffects.current);
                
                Object.values(moogGrandmotherEffects.current).forEach((value: any) => {
                    (async() => {
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("moogGMDefaults", value.name, value.value);
                        } catch (e) {
                            alert("shit err")
                            console.log("ERR:", e)
                        }
                    })();                    
                });
                genericFXToString(universalSources.current);     
            }

            (async() => {
                chuckRef.current && await chuckRef.current.broadcastEvent('fxUpdate');
            })()

            setChuckUpdateNeeded(false);

        }
        return () => {
            isMounted = false;
        };
    }, [
        chuckUpdateNeeded,
        fxRadioValue  
    ]) // if there are problems, switch back to [${chuckUpdateNeeded}]

    const stopChuckInstance = async () => {
        chuckRef.current && await chuckRef.current.runCode(`Machine.removeAllShreds();`);
        chuckRef.current && await chuckRef.current.runCode(`Machine.resetShredID();`);
        setChuckUpdateNeeded(true);
        setMTFreqs([]);
        setMTMidiNums([]);
        initialRun.current = true;
        return;
    }

    const clickHeatmapCell = (x: number, y: number) => {
        currentHeatmapXY.current = { x, y };
    };


    const triggerNoteOff = async(note: any) => {
        await chuckRef.current;
        let currNotesOffArray: any = chuckRef.current && chuckRef.current.getFloatArray("chuckNotesOff");
        
        await currNotesOffArray;
        
        if (!currNotesOffArray || currNotesOffArray.length < 1) {
            currNotesOffArray = [];
        }
        try {
            const result = await currNotesOffArray;
         
            if (result.length > 0 && !result.toString().includes('9999')) {
                console.log("ummm ", result, "note: ", note);
            }
            const newNotesOff = [note];
            chuckRef.current && await chuckRef.current.setFloatArray("chuckNotesOff", newNotesOff);
            consistentNotes.current = consistentNotes.current.filter((i: any) => i !== note);
            chuckRef.current && await chuckRef.current.setFloatArray("testNotesArr", consistentNotes.current.map((i:any) => Number(parseFloat(i)).toFixed(2)));
            chuckRef.current && await chuckRef.current.broadcastEvent('playSingleNoteOff');
            consistentNotes.current = [];
        } catch (e) {
            console.log("Error in triggerNoteOff: ", e);
        }
    }

    const triggerNote = async (note: any) => {
        await chuckRef.current;

        // chuckRef.current && chuckRef.current.broadcastEvent('playSingleNote');
        consistentNotes.current && consistentNotes.current.indexOf(note) === -1 && consistentNotes.current.push(note);

        setMTMidiNums(consistentNotes.current);
        setMTFreqs(consistentNotes.current.map((i: any) => 440 * Math.pow(2, (i - 69) / 12)));

        if (chuckRef.current) {
          const freqNote = (midiNoteIn: any) => 440 * Math.pow(2, (midiNoteIn - 69) / 12)
          try {
            await chuckRef.current.setFloatArray("testNotesArr", consistentNotes.current.map((i: any) => freqNote(i))); 
            consistentNotes.current = [];
          } catch (e) {

          }
        } 
        chuckRef.current && chuckRef.current.broadcastEvent('playSingleNote');
        
        NOTES_SET_REF.current = Object.values(currNotesHash.current)
        .map((i: any) => {
          const parsed = parseFloat(i[0]);
          return !isNaN(parsed) ? parsed : null;
        })
        .filter(i => i !== null)
        .map(i => {
          return i % 1 === 0 ? i + 0.0 : i; // Ensure it's a float (even if it's an integer)
        });

        console.log("NOTES_SET_REF???: ", NOTES_SET_REF.current);

        chuckRef.current && 
        chuckRef.current.broadcastEvent('playNote');
        currNotesHash.current = {};
        
    };

    const handleCheckedFXToShow = (msg: any) => {
        console.log("effect to show message: " + msg.target.value);
        setShowNotesOrder(msg.target.value)
        // setCheckedEffectToShow(msg);
    }


    const getSourceFX = (thisSource: string) => {
        if (thisSource === "stk") thisSource = "stk1";

        const checkFX = universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects;
        console.log("checkFX_forThisSource ----> ", thisSource, "FX ----> ", checkFX);

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

    const newChuckCode = useRef<any>(""); 

    const runChuck = async (isTestingChord?: number | undefined) => {
        if (typeof window === 'undefined') return;
        console.log("running chuck now... ", chuckUpdateNeeded);

        if (chuckRef.current) {
            const getOsc1FX = universalSources.current && Object.values(universalSources.current.osc1.effects).filter(i => i.On);
            const getOsc2FX = universalSources.current && Object.values(universalSources.current.osc2.effects).filter(i => i.On);
            const getSamplerFX = universalSources.current && Object.values(universalSources.current.sampler.effects).filter(i => i.On);
            const getAudioInFX = universalSources.current && Object.values(universalSources.current.audioin.effects).filter(i => i.On);
            const getSTKFX = universalSources.current && Object.values(universalSources.current.stk1.effects).filter(i => i.On);

            getConvertedRadio(fxRadioValue).toLowerCase().includes("osc") && getOsc1FX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${varName} => ` : `${varName}[${fx.presets.lines.value}] => `;
                const addedEffectDeclaration =  (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName}; ` : `${type} ${varName}[${fx.presets.lines.value}]; `;
                signalChain.indexOf(addedEffect) === -1 && signalChain.push(addedEffect);
                signalChainDeclarations.indexOf(addedEffectDeclaration) === -1 && signalChainDeclarations.push(addedEffectDeclaration);
                Object.values(fx.presets).map(async (preset: any) => {
                    if (preset.type.includes("int")) { 
                        const placeHolder = `allFXDynamicInts["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicInts["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadout[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allFXDynamicInts", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } else if (preset.type.includes("float")) { 
                        const placeHolder = `allFXDynamicFloats["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicFloats["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadout[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allFXDynamicFloats", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } 
                });
            });

            getConvertedRadio(fxRadioValue).toLowerCase() === "sampler" && getSamplerFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                const addedEffectDeclaration =  (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName}; ` : `${type} ${varName}[${fx.presets.lines.value}]; `;
                signalChainSampler.indexOf(addedEffect) === -1 && signalChainSampler.push(addedEffect);
                signalChainSamplerDeclarations.indexOf(addedEffectDeclaration) === -1 && signalChainSamplerDeclarations.push(addedEffectDeclaration);
                Object.values(fx.presets).map(async (preset: any) => {
                    if (preset.type.includes("int")) { 
                        const placeHolder = `allFXDynamicInts["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicInts["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutSampler[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutSamplerDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            console.log("great! 1 key: ", `${varName}_${preset.name}`, "value:", preset.value);
                            chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allFXDynamicInts", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } else if (preset.type.includes("float")) { 
                        const placeHolder = `allFXDynamicFloats["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicFloats["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutSampler[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutSamplerDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allFXDynamicFloats", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } 
                });
            });

            getConvertedRadio(fxRadioValue).toLowerCase() === "audioin" && getAudioInFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                const addedEffectDeclaration =  (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName}; ` : `${type} ${varName}[${fx.presets.lines.value}]; `;
                signalChainAudioIn.indexOf(addedEffect) === -1 && signalChainAudioIn.push(addedEffect);
                signalChainAudioInDeclarations.indexOf(addedEffectDeclaration) === -1 && signalChainAudioInDeclarations.push(addedEffectDeclaration);
                

                Object.values(fx.presets).map(async (preset: any) => {
                    if (preset.type.includes("int")) { 
                        const placeHolder = `allFXDynamicInts["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicInts["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutAudioIn[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutAudioInDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allFXDynamicInts", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } else if (preset.type.includes("float")) { 
                        const placeHolder = `allFXDynamicFloats["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicFloats["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutAudioIn[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutAudioInDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allFXDynamicFloats", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } 
                });
            });

            getConvertedRadio(fxRadioValue).toLowerCase().includes("stk") && getSTKFX?.map((fx: any) => {
                const type = fx.Type;
                const varName = fx.VarName + '_' + getConvertedRadio(fxRadioValue);
                const addedEffect = (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${varName} => ` : `${type} ${varName}[${fx.presets.lines.value}] => `;
                const addedEffectDeclaration =  (type !== 'Delay' && type !== 'DelayL' && type !== 'DelayA') ? `${type} ${varName}; ` : `${type} ${varName}[${fx.presets.lines.value}]; `;
                signalChainSTK.indexOf(addedEffect) === -1 && signalChainSTK.push(addedEffect);
                signalChainSTKDeclarations.indexOf(addedEffectDeclaration) === -1 && signalChainSTKDeclarations.push(addedEffectDeclaration);

                Object.values(fx.presets).map(async (preset: any) => {
                    if (preset.type.includes("int")) { 
                        const placeHolder = `allFXDynamicInts["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicInts["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutSTK[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutSTKDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allFXDynamicInts", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } else if (preset.type.includes("float")) { 
                        const placeHolder = `allFXDynamicFloats["${varName}_${preset.name}"]`

                        const latestValue = `allFXDynamicFloats["${varName}_${preset.name}"] => ${varName}.${preset.name}; `;
                    
                        if (!fx.Code) valuesReadoutSTK[preset.name] = latestValue;
                        if (!fx.Code) {
                            valuesReadoutSTKDeclarations[preset.name] = `(${preset.value})${preset.type.includes('dur') ? '::ms' : ''} => ${placeHolder};`;
                        }
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allFXDynamicFloats", `${varName}_${preset.name}`, preset.value);
                        } catch (e) {
                            alert(e)
                        }
                    } 
                });
            });

            console.log("stk instruments: ", universalSources.current && universalSources.current.stk1.instruments && universalSources.current.stk1.instruments)
            console.log("masterPatternsRef.current: ", masterPatternsRef.current)


            activeSTKDeclarations.current = '';
            activeSTKSettings.current = ''; 
            activeSTKs.map((s: any) => {
                activeSTKDeclarations.current = activeSTKDeclarations.current.concat(`${s.Type} ${s.VarName} => stk_FxChain => Dyno stk_Dyno => dac; `);
                activeSTKPlayOn.current = activeSTKPlayOn.current.concat(`allFreqs[stk_f] => ${s.VarName}.freq; 1 => ${s.VarName}.noteOn; `);
                activeSTKPlayOff.current = activeSTKPlayOff.current.concat(`1 => ${s.VarName}.noteOff; `);
            });

            activeSTKs.map((s_outer: any) => {
                s_outer.presets.map((s: any) => {
                    activeSTKSettings.current = activeSTKSettings.current.concat(`${s.value} => ${s_outer.VarName}.${s.name}; `);
                })
            });

            console.log("active stks, declarations, and settings: ", activeSTKs, activeSTKDeclarations.current, activeSTKSettings.current);

            setChuckUpdateNeeded(!chuckUpdateNeeded);

            console.log("files to process (current) ", filesToProcess.current);

            const filesArray = filesToProcess.current.map(
                (f: any) => `me.dir() + "${f.filename}"`
            ).join(', ');


            const maxFreq = noteToMidi(selectedChordScaleOctaveRange.key, selectedChordScaleOctaveRange.octaveMax);
            const minFreq = noteToMidi(selectedChordScaleOctaveRange.key, selectedChordScaleOctaveRange.octaveMin);
            newChuckCode.current = getChuckCode(
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
                signalChainDeclarations,
                signalChainSampler,
                signalChainSamplerDeclarations,
                signalChainSTK,
                signalChainSTKDeclarations,
                signalChainAudioIn,
                signalChainAudioInDeclarations,
                valuesReadout,
                valuesReadoutSampler,
                valuesReadoutSTK,
                valuesReadoutAudioIn,
                valuesReadoutDeclarations,
                valuesReadoutSamplerDeclarations,
                valuesReadoutSTKDeclarations,
                valuesReadoutAudioInDeclarations,
                getSourceFX,
                mTFreqs,
                activeSTKDeclarations.current,
                activeSTKSettings.current,
                activeSTKPlayOn.current,
                activeSTKPlayOff.current,
                selectedChordScaleOctaveRange,
                {maxFreq, minFreq},
                notesHolder,
                hid,
            );

            chuckRef.current.runCode(newChuckCode.current);
  
            console.log("HERE IS CHUCK CODE: ", newChuckCode.current);
        } else {
            alert("NO aChuck!");
            console.log("NO aChuck!");
        }
    }

    useEffect(() => {
        console.log("We should update chuck now...");
    }, [needsUpdate])

    // AUDIO IN
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const [clickedFile, setClickedFile] = useState<any>(null);
    const handleClickUploadedFiles = (e: any) => {
        console.log("CLICKED FILES: ", e.target.innerText);
        const theClickedFile = filesToProcess.current.filter((f: any) => f.filename.toLowerCase() === e.target.innerText.toLowerCase()); 
        console.log("CLICKED FILE: ", theClickedFile);
        setClickedFile(theClickedFile[0]);
        if (isInPatternEditMode) {
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


    const handleMingusKeyboardData = useCallback((data: any) => {
        console.log("MINGUS KEYBOARD DATA *** : ", data);
      
        const microtones = finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b);
        const formattedMicrotones = microtones.length > 0
          ? microtones.map((i: any) => +Number(i).toFixed(2))
          : data.data[0];
      
        const noteData = showNotesOrder === "asc"
          ? data.data[0]
          : showNotesOrder === "desc"
            ? data.data[1]
            : showNotesOrder === "microtonal"
              ? formattedMicrotones
              : data.data[0];
        if (noteBuilderFocus.toLowerCase().includes("scale")) {
            setMTNames(noteData);
        }
        setMingusKeyboardData(data);
    }, [showNotesOrder, setMTNames, setMingusKeyboardData]);

    // FOR CHORDS
    const handleMingusChordsData = (data: any) => {
        console.log("MINGUS CHORDS INCOMING ARG DATA *** : ", data);
        setMingusChordsData(data);
        if (noteBuilderFocus.toLowerCase().includes("chord")) {
            const chordsVal = data && data.length > 0 ? JSON.parse(data) : [];
            console.log("&*&* CHORDS VAL 1 LABEL : ", keyScaleChord.chordLabel);
            const gc2 = chordsVal[0].progs_nums && chordsVal[0].progs_nums.length > 0 ? getChord(keyScaleChord.chordLabel, chordsVal[0].progs_nums) : [];
            // setMTNames(chordsVal);
        }
    }

    const updateKeyScaleChord = useCallback((key: string, scale: string, chord: string, chordLabel: string, octaveMax: string, octaveMin: string, noteBuilderFoc: string) => {
        
        console.log("updateKeyScaleChord &^& called with: ", key, scale, chord, chordLabel, octaveMax, octaveMin);

        const dataToReturn = {
            scaleData: null,
            chordData: null
        };
        
        setSelectedChordScaleOctaveRange({
            key: key,
            scale: scale,
            chord: chord,
            octaveMax: octaveMax,
            octaveMin: octaveMin
        })
        
        setKeyScaleChord({key: key, scale: scale, chord: chord, octaveMax: octaveMax, octaveMin: octaveMin});
        
        if (noteBuilderFoc.toLowerCase().includes("scale")) {    
            axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, { 
                audioKey: key || selectedChordScaleOctaveRange.key, 
                audioScale: scale.replace(/ /g, "") || selectedChordScaleOctaveRange.scale.replace(/ /g, ""), 
                octave: octaveMax || selectedChordScaleOctaveRange.octaveMax,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                console.log("TEST SCALES HERE 1# ", data);
                setScaleHook([Object.values(data)[0], Object.values(data)[2]]);
                setInvertedScaleHook([Object.values(data)[1], Object.values(data)[3]]);
                if (noteBuilderFoc === "scale" && showNotesOrder === "asc") {
                    setMTNames(Object.values(data)[0])
                } else if (noteBuilderFoc === "scale" && showNotesOrder === "desc") {
                    setMTNames(Object.values(data)[1]);
                }
                handleMingusKeyboardData(data);
                dataToReturn.scaleData = data;
            });
            console.log("WHAT IS KEY / SCALE / CHORD? ", key, scale, chord);
        } else if (noteBuilderFoc.toLowerCase().includes("chord")) {
            axios.post(
                `${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, 
                { 
                    audioChord: chord, 
                    audioKey: key.replace('♯', '#'),
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
            }).then(({ data }) => {    
                const chordsVal = JSON.parse(data); 
                const gc = getChord(chordLabel, chordsVal[0].progs_nums);
                if (gc && gc.length > 0) {
                    setMTNames(gc[0]);
                }
                setChordHook(chordsVal);
                handleMingusChordsData(data);
                dataToReturn.chordData = data && typeof data === "string" ? JSON.parse(data) : data;
                return data;
            });
        }
        return dataToReturn;
    }, [
        handleMingusKeyboardData,
        selectedChordScaleOctaveRange.chord,
        selectedChordScaleOctaveRange.key,
        selectedChordScaleOctaveRange.octaveMax,
        selectedChordScaleOctaveRange.scale,
    ]);

    // SLIDER CONTROL KNOB
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleUpdateSliderVal = useCallback(async (radioVal: string, obj: any, value: any) => {       
       

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
            ) {
                if (universalSources.current && universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources]) {
                    universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any].value = value;
                    markUpdated();
                    if (universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any].type?.includes("int")) {
                        chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allFXDynamicInts", `${universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].VarName}_${getConvertedRadio(fxRadioValue)}_${obj.name}`, value);
                    } else if (universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].presets[`${obj.name}` as any].type?.includes("float")) {
                        chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allFXDynamicFloats", `${universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].VarName}_${getConvertedRadio(fxRadioValue)}_${obj.name}`, value);
                    }

                    console.log("****? ", value, "&&&&? ", chuckRef.current && await chuckRef.current.getAssociativeIntArrayValue("allFXDynamicInts", `${ universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].VarName}_${getConvertedRadio(fxRadioValue)}_${obj.name}`));
                }
            }
        } else if (obj.fxType === 'default') {
            moogGrandmotherEffects.current[`${obj.name}`].value = value;
            Object.values(moogGrandmotherEffects.current).forEach((value: any) => {
                (async() => {
                    try {
                        chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("moogGMDefaults", value.name, value.value);
                    } catch (e) {
                        console.log("ERR:", e)
                    }
                })();                    
            });
        }
        setChuckUpdateNeeded(true);

        // console.log("sanity values readout osc1 in parent: ", Object.values(valuesReadout))

    },[fxRadioValue, markUpdated]); // valuesReadout causes Babylon to rerender & flicker, which is both bad and possibly good if we can harness the updates... 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    const updateFXInputRadio = (value: any) => {
        if (value && value !== fxRadioValue) {
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

    const handleChangeNotesAscending = (msg: any) => {
        const newFreqs = msg.target.value === "asc" 
        ? mingusKeyboardData.data[0] 
        : msg.target.value === "desc" 
            ? mingusKeyboardData.data[1] 
            : (showNotesOrder === "microtonal") && finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).length > 0 
                        ? finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).map(
                            (i: any) => +Number(i).toFixed(2)
                        ) 
                        : mingusKeyboardData.data[0];
        setMTNames(newFreqs);
    };

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


        console.log("PATTERNS HASH GENERAL", masterPatternsRef.current);
        alert("serious edit check needed 2");
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
    }

    const doUpdateBabylonKey = (value: any) => {
        babylonKeyRef.current = value;
    }

    const handleSourceToggle = (name: string, val: any) => {
        updateFXInputRadio(val);
        setVizSource(val);
        visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);

        setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);
        updateCurrentFXScreen(setFxKnobsCount, doUpdateBabylonKey, babylonKeyRef.current);
        setNeedsUpdate(true);
    };


    const userInteractionUpdatedScore = (newScore: any) => {
        console.log("WHAT IS NEW SCORE in userInteractionUpdatedScore method?? ", newScore);
        setPatternsHashHook(newScore);
        setPatternsHashUpdated(true);
    }

    const exitEditMode = () => {
        isInPatternEditMode.current = false;
        setPatternsHashUpdated(true);    
    }

    const handleChuckMsg = (chuckMsg: string) => {
        let isMounted = true;
        const parsedNumbers = chuckMsg.match(/\d+/g) || [];  
        
        const bC = parsedNumbers.length > 0 && parsedNumbers[parsedNumbers.length - 1] 
            ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
            : currentBeatCountToDisplay;  // Keep previous value if no valid number found
        
        const beatDisplay = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
        const numerCount = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
        const denomCount = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
        const patternCount = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;
        
        setCurrentBeatCountToDisplay(beatDisplay);
        setCurrentNumerCountColToDisplay(numerCount);
        setCurrentDenomCount(denomCount);
        setCurrentPatternCount(patternCount);

        if (chuckMsg.includes("MAX_MIN:")) {
            try {
                let maxFreq = '440'; 
                let minFreq = '0';
                maxFreq = chuckMsg.split("::::")[0].trim();
                minFreq = chuckMsg.split("::::")[1].trim();
                setMaxMinFreq([Number(+maxFreq), Number(+minFreq)]);
            } catch(e) {
                console.log("error getting max min freq from chuck... ", e);
            }
        } 
        return () => {
            isMounted = false;
        }
    }

    let hid: HID | null = null;

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
            try {
                hid = await HID.init(theChuck, false, true);
                 
                console.log("heya get HID... ", hid);
            } catch (e) {

            }
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
          
                    if (message.includes("SHREDCOUNT: ")) {
                        console.log("SHREDCOUNT ", message)
                    }

                    // THIS SHOULD BE CHECKING THE ADSR...
                    // if (message.includes("ADSR")) {
                    //     console.log("ADSR MESSAGE: ", message)
                    // }

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
            return rightPanelOptions;
        }
        setRightPanelOptions([panel, ...rightPanelOptions.slice(0, index), ...rightPanelOptions.slice(index + 1)]);
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

        const assignEveryOtherReferenceNumber = xVal % 2;

        if (masterPatternsRef.current[yVal] && masterPatternsRef.current[yVal][xVal]) {
            console.log("AUTOASSIGN NUMBER: ", doAutoAssignPatternNum);
            if (doAutoAssignPatternNum.toString() === "0") {
                masterPatternsRef.current[yVal][xVal].fileNums = indices;
            } else if (
                doAutoAssignPatternNum.toString() === "1"
            ) {
                console.log("in doAssignSampleToGrid...");
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    masterPatternsRef.current[y1][xVal].fileNums = indices;
                }
            } else if (doAutoAssignPatternNum.toString() === "2" ) {
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                        if (x1 % numeratorSignature === 0 && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                            masterPatternsRef.current[y1][x1].fileNums = indices;
                        }
                    };
                }
            } else if (doAutoAssignPatternNum.toString() === "3") {
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 =  0; x1 <= numeratorSignature * masterFastestRate; x1 += 2) {
                        if(masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) masterPatternsRef.current[y1][x1].fileNums = indices;
                    };
                }
            } else if (doAutoAssignPatternNum.toString() === "4") {
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1++) {
                        if(masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) masterPatternsRef.current[y1][x1].fileNums = indices;
                    };
                }
            } 
        } else {
            console.log("LATEST SAMPLES IN THE ELSE HERE... ", xVal, yVal, masterPatternsRef.current)
        }
        setPatternsHashHook(masterPatternsRef.current);
    };

    const handleLatestNotes = (
        notes: any[],
        xVal: number,
        yVal: number
    ) => {
        masterPatternsRef.current[yVal] =  masterPatternsRef.current[yVal] || {}; 
        masterPatternsRef.current[yVal][xVal].notes = notes;
        setPatternsHashHook(masterPatternsRef.current);
        if (noteBuilderFocus.includes("chord")) {
            setMTNames([...keyScaleChord.chord]);
        } else if (noteBuilderFocus.includes("scale")) {
            setMTNames([...keyScaleChord.scale]);
        }
        console.log("WHAT IS HANDLE LATEST NOTES???  ", "X: ", xVal, "Y: ", yVal, "NOTES: ", notes, "CHORD: ", ...keyScaleChord.chord, "SCALE: ", ...keyScaleChord.scale);  
    };

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

    const switchControlView = (e: any) => {
        const val = e.target.value;
        setScreenView(val);
        if (controlView === 'knobsView' || val === 2) {
            setControlView('itemizedValuesView')
        } else {
            setControlView('knobsView')
        }
    }


    const updateStkKnobs = (knobVals: STKOption[]) => {
        console.log("yup knobs: ", knobVals)
        stkKnobValsRef.current = [];
        stkKnobValsRef.current.push(...knobVals);
        if (!stkKnobValsRef.current[stkKnobValsRef.current.length - 1]) {
            
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(moogGrandmotherEffects.current.length);
            updateCurrentFXScreen(        
                setFxKnobsCount,
                doUpdateBabylonKey,
                babylonKeyRef.current, );
            setNeedsUpdate(true);
            return;
        }
        const getSTKVal: any = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value);
        currentStkTypeVar.current = (`${getSTKVal.type}#${getSTKVal.var}`)
        if (universalSources.current) {
            console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', getSTKVal);
            const stk: any = universalSources.current.stk1
            visibleFXKnobs.current = Object.values(getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).presets).map((i: any) => [i.label, i]);
            const instType = getSTKVal.type
            currentFX.current = getSTKVal.value;
            if (universalSources.current.stk1.instruments) {
                Object.entries(universalSources.current.stk1.instruments).map((i: [string, EffectsSettings | any]) => {
                    if (i && i.length > 0 && i[0] === instType) {
                        i[1].Visible = true;
                        i[1].On = true;
                        if (i[1].presets) i[1].presets = Object.values(getSTKVal.presets);
                    } else {
                        i[1].Visible = false
                    }
                })
            }
            setFxKnobsCount(visibleFXKnobs.current.length);
            currentFX.current = getSTKVal;


            currentScreen.current = `stk_${currentFX.current.type}`;

            if (Object.values(stk.instruments).filter((inst: any) => inst.On).length > 0) {

                stk.instruments[`${getSTKVal.type}`].Type = getSTKVal.type;
                stk.instruments[`${getSTKVal.type}`].VarName = getSTKVal.var;
                stk.instruments[`${getSTKVal.type}`].On = true;

                currentFX.current = stkKnobValsRef.current;

                const knobsCountTemp = Object.values(stk.instruments).filter((i: any) => i.Visible).map((i: any) => i.presets).length;

                setFxKnobsCount(knobsCountTemp);
                updateCurrentFXScreen(
                    setFxKnobsCount,
                    doUpdateBabylonKey,
                    babylonKeyRef.current,
                );
            }
        }
    }

    const updateMicroTonalScale = (scale: any) => {
    console.log("OY SCALE! ", scale)
    setMicrotonalScale(scale.value);
    };

    const updateMingusData = (data: any) => {
        console.log("**** WHAT IS DATA HERE????: ", data)
    }

    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!parentDivRef.current) return;

        const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            console.log('Parent size changed:', width, height);
            
            setParentSize({ width, height });
        }
        });

        observer.observe(parentDivRef.current);

        // Cleanup
        return () => observer.disconnect();
    }, [chuckHook]);

    // THIS IS AUDIO DATA OBJECT --->
    // console.log("masterPatternsHashHook keys!@#$: ", masterPatternsHashHook);

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
                        {clickedBegin && <ResponsiveAppBar
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
                            updateStkKnobs={updateStkKnobs}
                            handleSwitchToggle={handleSwitchToggle}
                            handleChange={handleFXRadioChange}
                            handleReturnToSynth={handleReturnToSynth}
                            handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                            handleToggleArpeggiator={handleToggleArpeggiator}
                            runChuck={runChuck}
                            stopChuckInstance={stopChuckInstance}
                            chuckMicButton={chuckMicButton}
                            numeratorSignature={numeratorSignature}
                            denominatorSignature={denominatorSignature}
                        />}
                        {
                            uploadedBlob.current && 
                            <FileWindow 
                                uploadedBlob={uploadedBlob}
                                // setWavesurfer={setWavesurfer}
                                getMeydaData={getMeydaData}
                                clickedFile={clickedFile}
                                chuck={chuckRef.current}
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
                            display: "flex",
                            justifyContent: "stretch",
                            flexDirection: "column",
                            fontFamily: "monospace",
                            fontSize: "1.5em",
                            padding: clickedBegin ? "0%" : "10%",
                        }}
                    >
                        {
                            clickedBegin ? 
                            (
                                <>
                                </>
                            ) :
                            (
                                <Box sx={{width: "100%", height: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <AnimatedTitle clickedBegin={clickedBegin} />
                                    <Button
                                        sx={{
                                            width: '160px',
                                            height: '90px',
                                            fontFamily: 'monospace',
                                            fontSize: '1em !important',
                                            background: PALE_BLUE,
                                            padding: '24px',
                                            margin: '16px',
                                            color: 'rgba(255,255,255,0.78)',
                                            border: 'rgba(255,255,255,0.78)',
                                            '&:hover': {
                                                color: '#f5f5f5 !important',
                                                border: `1px solid ${PALE_BLUE}`,
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
                                </Box>
                            )
                        }

                        <Box
                            // key={babylonKey}
                            sx={{
                                left: '0',
                                display: 'flex',
                                flexDirection: 'row',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: '100%',
                            }}
                        >                            
                            {chuckHook && <>                     
                                <Box id="rightPanelWrapper">
                                    <Box
                                        ref={parentDivRef}
                                        sx={{
                                            display: controlView !== 'knobsView' ? 'none' : 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                        }} 
                                    >
                                        <Box id="rightPanelHeader">
                                            <Box className="right-panel-header-wrapper">
                                                <Button 
                                                    id='toggleSliderPanelChildren_Effects' 
                                                    className='right-panel-header-button'
                                                    sx={{ backgroundColor: rightPanelOptions[0] === 'effects' ? 'rgba(255,255,255,0.278)' : 'transparent' }}
                                                    onClick={(e: any) => toggleSliderPanelChildren('effects')}
                                                >
                                                        Effects View
                                                </Button>
                                                <Button 
                                                    id='toggleSliderPanelChildren_Pattern' 
                                                    className='right-panel-header-button'
                                                    sx={{ backgroundColor: rightPanelOptions[0] !== 'effects' ? 'rgba(255,255,255,0.278)' : 'transparent' }}
                                                    onClick={(e: any) => toggleSliderPanelChildren('pattern')}
                                                >
                                                    Patterns View
                                                </Button>
                                            </Box>
                                            {
                                                universalSources.current && 
                                                Object.keys(universalSources.current).length > 0 && 
                                                <GroupToggle
                                                    name={"test name"}
                                                    options={Object.keys(universalSources.current).map(i => i)}
                                                    handleSourceToggle={handleSourceToggle}
                                                />
                                            }
                                        </Box>
                                        <Box  sx={{ maxHeight: 'calc(100% - 6rem)', display: rightPanelOptions[0] === 'effects' ? "flex" : "none" }}>
                                            <Box id={'reactDiagramsPedalboardWrapper'}>
                                                <ReactDiagramsPedalboard
                                                    currentChain={currentChain}
                                                    sourceName={getConvertedRadio(fxRadioValue)}
                                                    width={parentSize.width}
                                                    height={parentSize.height}
                                                />
                                            </Box>
                                        </Box>
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
                                                userInteractionUpdatedScore={userInteractionUpdatedScore}
                                                handleAssignPatternNumber={handleAssignPatternNumber}
                                                doAutoAssignPatternNumber={doAutoAssignPatternNum}
                                                setStkValues={setStkValues}
                                                tune={tune}
                                                currentMicroTonalScale={currentMicroTonalScale}
                                                setFxKnobsCount={setFxKnobsCount}
                                                doUpdateBabylonKey={doUpdateBabylonKey}
                                                babylonKey={babylonKeyRef.current}
                                                setNeedsUpdate={setNeedsUpdate}
                                                currentScreen={currentScreen}
                                                currentFX={currentFX}
                                                currentStkTypeVar={currentStkTypeVar}
                                                updateCurrentFXScreen={updateCurrentFXScreen}
                                                getSTK1Preset={getSTK1Preset} 
                                                universalSourcesRef={universalSources}   
                                                updateMicroTonalScale={updateMicroTonalScale}  
                                                mingusKeyboardData={mingusKeyboardData}
                                                mingusChordsData={mingusChordsData}
                                                updateMingusData={updateMingusData}
                                                handleChangeNotesAscending={handleChangeNotesAscending}
                                                mTNames={mTNames}
                                                fxRadioValue={fxRadioValue}
                                                noteBuilderFocus={noteBuilderFocus}
                                                handleNoteBuilder={handleNoteBuilder}
                                                handleNoteLengthUpdate={handleNoteLengthUpdate}
                                                handleNoteVelocityUpdate={handleNoteVelocityUpdate}
                                            />
                                        </Box>
                                    </Box>
                                </Box>                   
                            
                                {/* // MIDDLE CONTAINER (KNOBS) */}
                                <Box 
                                    id={"middleKnobsContainer"}
                                    sx={{
                                        position: 'relative',
                                        marginLeft: '140px',
                                    }}
                                >{
                                    controlView !== 'knobsView' 
                                    ?
                                        <Box sx={{top: "54px", width: "100%", height: "100%", boxSizing: "border-box", padding: "0px", margin: "0px"}}> 
                                            <ControlValsView
                                                updateKeyScaleChord={updateKeyScaleChord}
                                                files={filesToProcess.current}
                                            /> 
                                        </Box>
                                    :   
                                        <Box 
                                            sx={{
                                                boxSizing: 'border-box',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                            key={babylonKeyRef.current}
                                        >
                                    {<ArrowBack 
                                        onClick={() => {
                                            currentScreen.current = "synth";
                                            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
                                            setFxKnobsCount(moogGrandmotherEffects.current.length);
                                            updateCurrentFXScreen(
                                                setFxKnobsCount,
                                                doUpdateBabylonKey,
                                                babylonKeyRef.current,
                                            );
                                        }}
                                        sx={{
                                            display: "flex", 
                                            flexDirection: "column", 
                                            position: "absolute",
                                            cursor: "pointer",
                                            top: "104px",
                                            left: "8px",
                                            zIndex: "9999",
                                        }}
                                        >
                                </ArrowBack>
                                }<span 
                                    style={{
                                        color:"green",
                                        position: "absolute",
                                        left: "8px",
                                        top: "72px"
                                    }}
                                >{
                                    checkedFXList.current.toString()
                                }</span>

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
                                }</Box>

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
                                    <Box
                                        sx={{
                                            padding: '8px',
                                            backgroundColor: 'rgba(28,28,28,0.78)',
                                        }}
                                    >
                                        <STKManagerDropdown
                                            updateStkKnobs={updateStkKnobs}
                                            stkValues={stkValues}
                                            setStkValues={setStkValues}
                                        ></STKManagerDropdown>
                                    </Box>
        
                                    <Box sx={{ position: "relative" }}>
                                        <Box sx={{
                                            position: 'relative',
                                            color: 'rgba(255,255,255,0.78)',
                                        }}>
            
                                            <FXRouting
                                                key={fXChainKey + fxRadioValue}
                                                fxData={universalSources.current || defaultSources}
                                                width={440}
                                                height={440}
                                                updateCheckedFXList={handleUpdateCheckedFXList}
                                                fxGroupsArrayList={fxGroupOptions}
                                                checkedFXList={checkedFXList.current}
                                                fxFX={[]}
                                                handleClickName={handleClickName}
                                                setClickFXChain={setClickFXChain}
                                                clickFXChain={clickFXChain}
                                                updateFXInputRadio={updateFXInputRadio}
                                                fxRadioValue={fxRadioValue}
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
                                        </Box>
                                    </Box>
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
                        noteOffPlay={noteOffPlay}
                        compare={compare}
                        noteBuilderFocus={noteBuilderFocus}
                        mingusKeyboardData={mingusKeyboardData}
                        mingusChordsData={mingusChordsData}
                    />
                </Box>
            </Box>
        </Box>
    )
};
