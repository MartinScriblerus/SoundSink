"use client"

import { Box, Button, SelectChangeEvent, Slider } from '@mui/material';
import React, { useState, useEffect, useRef, useMemo, SetStateAction, useCallback } from 'react'
import BabylonLayer from './BabylonLayer';
import { Chuck, HID } from 'webchuck';
import { Note } from "tonal";
import moogGMPresets from '../../utils/moogGMPresets';

import { STKOption, fxGroupOptions, stkOptions } from '../../utils/fixedOptionsDropdownData';
import { getSTK1Preset, getFX1Preset } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useForm } from "react-hook-form";
import { convertEnvSetting } from '@/utils/FXHelpers/winFuncEnvHelper';

import BPMModule from './BPMModule';
import ResponsiveAppBar from './ResponsiveAppBar';
import { Tune } from '../../tune';
import Keyboard from './Keyboard'
import { useMingusData } from '@/hooks/useMingusData';
import KeyboardControls from './KeyboardControls';
import Meyda from 'meyda';
import { AllSoundSourcesObject, QueryResponse } from '@/utils/interfaces';
import { defaultNoteVals, getChord, lenMarks } from '@/utils/FXHelpers/helperDefaults';
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
import { NEON_PINK, CORDUROY_RUST, OBERHEIM_TEAL } from '@/utils/constants';
import serverFilesToPreload from '../../utils/serverFilesToPreload';
import axios from 'axios';
import MingusPopup from './MingusPopup';
import InstrumentsAndMicrotones from './InstrumentsAndMicrotones';
import { createEmptyTargets, getAllSignalData, getChuckCode, noteToFreq, processSourceFX, SignalChainTargets } from '@/utils/chuckHelper';
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
import ClockCounter from './ClockCounter';
import AudioMixer from './AudioMixer';

interface Note {
    frequency: number;
    midiNumber: number;
    name: string;
}

export default function InitializationComponent() {

    const [programIsOn, setProgramIsOn] = useState<boolean>(false);
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const [babylonReady, setBabylonReady] = useState(false);
    const [formats, setFormats] = React.useState<any>(() => []);
    const [checkedEffectsListHook, setCheckedEffectsListHook] = useState<Array<any>>([]);

    const [currentNoteVals, setCurrentNoteVals] = useState<AllSoundSourcesObject>(defaultNoteVals)

    const [notesAddedDetails, setNotesAddedDetails] = useState<any>([]);

    // NEEDS WORK (after samples)...
    const [masterVolumeValsUpdated, setMasterVolumeValsUpdated] = useState<any>(false);
    const [keysVisible, setKeysVisible] = useState(false);
    const [keysReady, setKeysReady] = useState(false);
    const [vizSource, setVizSource] = useState<string>('');

    const [newMicroTonalArr, setNewMicroTonalArr] = useState<any>([])//

    // const [chuckIsReady, setChuckIsReady] = useState(false);
    const [screenView, setScreenView] = useState<number>(1);

    const [clickedFile, setClickedFile] = useState<any>(null);

    // const [singleNoteLengthValue, setSingleNoteLengthValue] = useState<number | undefined>();


    const [doAutoAssignPatternNum, setDoAutoAssignPatternNum] = useState<number>(2);

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

    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(120.0);
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
    // const [currentChain, setCurrentChain] = useState<any>();

    const [currentChain, setCurrentChain] = useState<{
        osc1: string[];
        stk1: string[];
        sampler: string[];
        audioin: string[];
        }>({
        osc1: [],
        stk1: [],
        sampler: [],
        audioin: [],
        });


    // const [meydaNeedsUpdate, setMeydaNeedsUpdate] = useState<boolean>(false);
    const [lastFileUpload, setLastFileUpload] = useState<any>('');
    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);
    const [currentBeatSynthCount, setCurrentBeatSynthCount] = useState<number>(0);

    const [patternsPerCycle, setPatternsPerCycle] = useState<number>(4);
    const [masterFastestRate, setMasterFastestRate] = useState<number>(4);

    const [masterPatternsHashHook, setPatternsHashHook] = useState<any>({});
    const [masterPatternsHashUpdated, setPatternsHashUpdated] = useState<boolean>(false);
    const [mTFreqs, setMTFreqs] = useState<any>([]);
    const [mTNames, setMTNames] = useState<any>([]);
    const [currentSelectedCell, setCurrentSelectedCell] = useState<any>({ x: 0, y: 0 });

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

    const [isChuckRunning, setIsChuckRunning] = useState<boolean>(false);

    const [selectedSTKs, setSelectedSTKs] = useState<any[]>([]);
    const [selectedEffects, setSelectedEffects] = useState<any[]>([]);
    const [isManagingEffects, setIsManagingFX] = useState<boolean>(false);

    const [expandedMixerSource, setExpandedMixerSource] = useState<string>('');


    const [singleNoteLengthValue, setSingleNoteLengthValue] = useState<number | undefined>();

    const updateBPM = () => {
        (async() => {
            // Calculate beat length (in milliseconds)
            const beatInMilliseconds = (60000 / (bpm || 120)); // 1 beat = 60_000 ms / BPM
            const beatInt = beatInMilliseconds / numeratorSignature;
            const beatSeconds = beatInt / 1000;
            const beatFactor = numeratorSignature / denominatorSignature;
            const quarterNote = beatSeconds; // in seconds
            const adjustedBeat = quarterNote * beatFactor; // also in seconds
            const beat = adjustedBeat;
            const whole = beat * numeratorSignature;
            const measure = whole;

            // Set values in ChucK using WebChucK
            chuckRef.current && await chuckRef.current.setFloat("beatMS", (measure * 1000 * beatFactor) / masterFastestRate);
            chuckRef.current && await chuckRef.current.setInt("numeratorSignature", numeratorSignature);
            chuckRef.current && await chuckRef.current.setInt("denominatorSignature", denominatorSignature);
        })();
    }

    const handleUpdateVolumes = async (source: string, newValue: number) => {
        if (chuckRef.current && universalSources.current) {
            // universalSources.current[source as keyof Sources].masterVolume = newValue;
            if (source.toLowerCase().includes('osc1')) {
                universalSources.current!.osc1.masterVolume = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Osc1", "gain", universalSources.current!.osc1.masterVolume / 100);
            } else if (source.toLowerCase().toLowerCase().includes('sampler')) {
                universalSources.current!.sampler.masterVolume = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Sampler", "gain", universalSources.current!.sampler.masterVolume / 100);
            } else if (source.toLowerCase().includes('audioin')) {
                universalSources.current!.audioin.masterVolume = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_AudioIn", "gain", universalSources.current!.audioin.masterVolume / 100);
            } else if (source.toLowerCase().includes('stk1')) {
                universalSources.current!.stk1.masterVolume = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Stk1", "gain", universalSources.current!.stk1.masterVolume / 100);
            } else {
                console.log("tried to update volume without a source match");
            }
        }
    }
    const handleToggleMutes = (source: string) => {
        if (universalSources.current) universalSources.current[source as keyof Sources].isMuted = !universalSources.current[source as keyof Sources].isMuted;
    }
    const handleToggleSolos = (source: string) => {
        if (universalSources.current) universalSources.current[source as keyof Sources].isSolo = !universalSources.current[source as keyof Sources].isSolo;
    }
    const handleUpdatePans = async (source: string, newValue: number) => {
        if (chuckRef.current && universalSources.current) {
            // console.log("????? ", universalSources.current[source as keyof Sources]);
            // universalSources.current[source as keyof Sources] && (universalSources.current[source as keyof Sources].masterPan = newValue);

            if (source.toLowerCase().includes('osc')) {
                console.log("ERR WTF -- YUP! ", source);
                universalSources.current!.osc1.masterPan = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Osc1", "pan", universalSources.current!.osc1.masterPan);
            } else if(source.includes('sampler')) {
                universalSources.current!.sampler.masterPan = newValue;
                await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Sampler", "pan", universalSources.current!.sampler.masterPan);
            } else if (source.toLowerCase().includes('audioin')) {
                    universalSources.current!.audioin.masterPan = newValue;
                    await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_AudioIn", "pan", universalSources.current!.audioin.masterPan);
            } else if (source.toLowerCase().includes('stk1')) {
                    universalSources.current!.stk1.masterPan = newValue;
                    await chuckRef.current.setAssociativeFloatArrayValue("audioMixer_Stk1", "pan", universalSources.current!.stk1.masterPan);
            } else {
                console.log("tried to update pan without a source match");
            }
        }
    }

    useEffect(() => {
        updateBPM();
    }, [bpm, numeratorSignature, denominatorSignature, isChuckRunning]);



    const [showNotesAscending, setShowNotesAscending] = useState<boolean>(true);

    const [maxMinFreq, setMaxMinFreq] = useState<any>({});

    const [scaleHook, setScaleHook] = useState<any>(null);
    const [invertedScaleHook, setInvertedScaleHook] = useState<any>(null);
    const [chordHook, setChordHook] = useState<QueryResponse | null>(null);

    const [clockCounterKey, setClockCounterKey] = useState<string>('');

    const finalMicroToneNotesRef = useRef<any>([]);

    const chain = useRef<any>(null);


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

    const signalChain = useRef<any>([]);
    const signalChainDeclarations = useRef<any[]>([]);
    const valuesReadout = useRef<any>({});
    const valuesReadoutDeclarations = useRef<any>({});

    const signalChainSampler = useRef<any[]>([]);
    const signalChainSamplerDeclarations = useRef<any[]>([]);
    const valuesReadoutSampler = useRef<any>({});
    const valuesReadoutSamplerDeclarations = useRef<any>({});

    const signalChainSTK = useRef<any[]>([]);
    const signalChainSTKDeclarations = useRef<any[]>([]);
    const valuesReadoutSTK = useRef<any>({});
    const valuesReadoutSTKDeclarations = useRef<any>({});

    const signalChainAudioIn = useRef<any[]>([]);
    const signalChainAudioInDeclarations = useRef<any[]>([]);
    const valuesReadoutAudioIn = useRef<any>({});
    const valuesReadoutAudioInDeclarations = useRef<any[]>([]);

    const allTargetsRef = useRef<AllTargets | null | undefined>(null);
    if (!allTargetsRef.current) {
        allTargetsRef.current = createAllTargets();
    }

    const handleChangeBeatsNumerator = (newBeatsNumerator: number) => {
        console.log('@@@@ newBeatsNumerator: ', newBeatsNumerator)
        if (newBeatsNumerator) {
            setBeatsNumerator(Number(newBeatsNumerator));
            setNumeratorSignature(Number(newBeatsNumerator));
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsDenominator = (newDenominator: number) => {
        if (newDenominator) {
            setBeatsDenominator(Number(newDenominator));
            setDenominatorSignature(Number(newDenominator));
        }
        setChuckUpdateNeeded(true);
    }

    const handleNoteBuilder = (val: any) => {
        console.log("notebuilder val? ", val);
        val && setNoteBuilderFocus(val);
        const test = updateKeyScaleChord(keyScaleChord.key, keyScaleChord.scale, keyScaleChord.chord, keyScaleChord.chordLabel, keyScaleChord.octaveMax, keyScaleChord.octaveMin, val);
        console.log("TEST RETURNED: ", test);
    };

    // const consistentNotes = useRef<any>();
    // consistentNotes.current = consistentNotes.current || [];

    // const [doAutoAssignPatternNum, setDoAutoAssignPatternNum] = useState<number>(2);

    resetHeatmapCell.current = false;

    const babylonKeyRef = useRef<string>(`babylonKey_`);

    const persistLastMidiNote = useRef<any>(null);
    if (midiData && midiData.triggerArgs && midiData.triggerArgs.length > 1) {
        persistLastMidiNote.current = midiData.triggerArgs[1]
    }

const pressedNotes = useRef<Set<number>>(new Set());
const pressedVelocities = useRef<Set<number>>(new Set());
const [pressed, setPressed] = useState<any>(new Set());


useEffect(() => {
    console.log("PRESSED: ", pressed);
}, [pressed]);



    const noteOnPlay = useCallback(
        async (theMidiNum: number, theMidiVelocity: number, theMidiHz?: any) => {
            await chuckRef.current;
            currNotesHash.current[`${theMidiNum}`] = [theMidiNum, theMidiVelocity];
            currNotes.current = Object.values(currNotesHash.current)
                .map((i: any) => i[0])
                .filter((i: any) => i);

            const currentVelocities = Object.values(currNotesHash.current)
                .map((i: any) => i[1])
                .filter((i: any) => i);
            // console.log("@@@@ notes in onplay: ", currNotes.current);

            currNotes.current.forEach((note: any, idx: number) => {
                pressedNotes.current.add(note);
                pressedVelocities.current.add(currentVelocities[idx] || 0.5);
                setPressed(Array.from(pressedNotes.current));
                // triggerNote(note)
            });
            chuckRef.current && chuckRef.current.setFloatArray("chuckNotes", pressedNotes.current);
            chuckRef.current && chuckRef.current.setFloatArray("chuckVelocities", pressedVelocities.current);
            // chuckRef.current && chuckRef.current.broadcastEvent("playSingleNote");
        },
        // [chuckRef, currNotesHash, currNotes] // Only if these are not refs!
        []
    );

    const noteOffPlay = useCallback(
        async (theMidiNum: number) => {
            // await chuckRef.current && await chuckHook;
            console.log("****** noteOffPlay theMidiNum: ", theMidiNum);
            console.log("pressedNotes before: ", [...pressedNotes.current]);
            const ind = [...pressedNotes.current].indexOf(theMidiNum);
            pressedNotes.current.delete(theMidiNum);
            const newVelocities = [...pressedVelocities.current];
            newVelocities.splice(ind, 1);
            pressedVelocities.current = new Set(newVelocities);
            setPressed(Array.from(pressedNotes.current));
            chuckRef.current && chuckRef.current.setFloatArray("chuckNotes", pressedNotes.current);
            chuckRef.current && chuckRef.current.setFloatArray("chuckVelocities", pressedVelocities.current);
            currNotesHash.current[`${theMidiNum}`] = false;
            delete currNotesHash.current[`${theMidiNum}`];
            // chuckRef.current && chuckRef.current.broadcastEvent("releaseSingleNote");
        },
        []
    );

    useEffect(() => {
        // console.log("MIDI DATA: ", midiData);
        if (midiData && Object.values(midiData).length > 0) {
            if (midiData.triggerArgs && midiData.triggerArgs[0] === 144) {
                persistLastMidiNote.current = midiData.triggerArgs[1];
                chuckHook && noteOnPlay(midiData.triggerArgs[1], midiData.triggerArgs[2], 440.0 * Math.pow(2, (midiData.triggerArgs[1] - 69) / 12.0));
            } else if (midiData.triggerArgs && midiData.triggerArgs[0] === 128) {
                chuckHook && pressedNotes.current.has(persistLastMidiNote.current) && noteOffPlay(persistLastMidiNote.current);
                chuckHook && pressedNotes.current.has(midiData.triggerArgs[1]) && noteOffPlay(midiData.triggerArgs[1]);
                console.log("what is this? ", pressedNotes.current.has(persistLastMidiNote.current));
                console.log("what is this2? ", pressedNotes.current.has(midiData.triggerArgs[1]));
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
            console.log("WHAT IS IT? ", midiBPMClockIncoming);
            setBpm(midiBPMClockIncoming);
        }
        return () => {
        };
    }, [midiBPMClockIncoming]);

    const handleAssignPatternNumber = (e: any) => {
        const newPatternNumber = e.target.value;
        console.log("check auto assign pattern number is now... ", newPatternNumber);
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

                const cell = masterPatternsRef.current[rowKey][stepKey];
                if (!cell) {
                    masterPatternsRef.current[rowKey][stepKey] = {
                        on: true,
                        step,
                        color: 'blue',

                        colorR: 0 / 255,
                        colorG: 168 / 255,
                        colorB: 168 / 255,
                        colorA: 1.0,
                        colorIntensity: 0,

                        // SAFE DEFAULTS — keep cells editable:
                        // *** SHOULDN'T NOTE AND NOTEHZ BE SWAPPED???? 
                        noteHz: mTFreqs[step] !== undefined ? [mTFreqs[step]] : [0.0],
                        note: mTMidiNums[step] !== undefined ? [mTMidiNums[step]] : [0.0], // [69.0], <<<< problem!!! these are getting read as freqs!!!!
                        noteName: mTNames[step] ? [mTNames[step].filter((i: any) => i)] : [''],
                        fileNums: [],
                        length: 1 / 16,
                        velocity: 0.9,
                        midiInfo: {
                            noteOnLength: 1000,
                            pitch: mTMidiNums[step] !== undefined ? mTMidiNums[step] : 69.0, // 69.0,
                            velocity: 0.9,
                        },
                        subdivisions: 1
                    };
                    // console.log("CHACHECK THIS OUT: ",  masterPatternsRef.current[rowKey][stepKey]);
                } else {
                    // merge defaults only if missing
                    // cell.length ??= 1/16;
                    cell.velocity ??= 0.9;
                    cell.subdivisions ??= 1;
                    cell.fileNums ??= [];
                }
            }
        }
        // // Update React state to trigger render
        // setPatternsHashHook(masterPatternsRef.current);
        // setPatternsHashHook(JSON.parse(JSON.stringify(masterPatternsRef.current)));
        // setPatternsHashUpdated(true);
    }, [
        numeratorSignature,
        masterFastestRate,
        mTFreqs,
        mTMidiNums,
        mTNames
    ]);

    useEffect(() => {
        setPatternsHashHook(JSON.parse(JSON.stringify(masterPatternsRef.current)));
        setPatternsHashUpdated(true);
    }, [rightPanelOptions]);

    allOctaveMidiFreqs.current = {};

    const selectRef: any = React.useCallback((selectedMicrotone: string, i: any) => {
        if (selectedMicrotone) {
            console.log('&&&selected microtone: ', selectedMicrotone);
        }
        if (i) {
            console.log('&&&selected microtone::: what is i???? ', i);
        }
        setFxKnobsCount(Object.keys(moogGrandmotherEffects.current).length);
        updateBPM();
    }, []);

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
        setMTFreqs(finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).length > 0 ? finalMicroToneNotesRef.current.sort((a: any, b: any) => a - b).map((i: any) => Number(1.0 * (i).toFixed(2))) : '9999.2');

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
    // const [currentNoteVals, setCurrentNoteVals] = useState<AllSoundSourcesObject>(defaultNoteVals)

    const inPatternEditMode = (state: boolean) => {
        console.log("SETTING PATTERN EDIT MODE: ", state);
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

    // const handleOsc2RateUpdate = async (val: any) => {
    //     const valOscRate = await val.target.value;
    //     setCurrentNoteVals({ ...currentNoteVals, osc2: [valOscRate] });
    //     handleMasterRateUpdate();
    // }

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

    const handleAutoAssignLength = (xVal: string | number, yVal: string | number, noteLengths: number) => {
        if (doAutoAssignPatternNum.toString() === "0") {
            masterPatternsRef.current[yVal][xVal].length = notes;
        } else if (
            doAutoAssignPatternNum.toString() === "1"
        ) {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {

                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (((x1 === currentSelectedCell.x) || (currentSelectedCell.x + Math.floor((numeratorSignature * masterFastestRate) / 2)) === x1) && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1 + 1][x1].length = noteLengths; // e.target.value;
                    }
                }
            }
        } else if (doAutoAssignPatternNum.toString() === "2") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (x1 % numeratorSignature === currentSelectedCell.x && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1 + 1][x1].length = noteLengths; // e.target.value;
                    }
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "3") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1 += 2) {
                    if (masterPatternsRef.current[y1 + 1] && masterPatternsRef.current[y1 + 1][x1]) masterPatternsRef.current[y1 + 1][x1].length = noteLengths; // e.target.value;
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "4") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1++) {
                    if (masterPatternsRef.current[y1 + 1] && masterPatternsRef.current[y1 + 1][x1]) masterPatternsRef.current[y1 + 1][x1].length = noteLengths; // e.target.value;
                };
            }
        }
        setPatternsHashHook(masterPatternsRef.current);
    }

    const handleAutoAssignVelocity = (xVal: string | number, yVal: string | number, velocity: number) => {
        if (doAutoAssignPatternNum.toString() === "0") {
            masterPatternsRef.current[yVal][xVal].noteLengths = notes;
        } else if (
            doAutoAssignPatternNum.toString() === "1"
        ) {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {

                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (((x1 === currentSelectedCell.x) || (currentSelectedCell.x + Math.floor((numeratorSignature * masterFastestRate) / 2)) === x1) && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1 + 1][x1].velocity = velocity; // e.target.value;
                    }
                }

            }
        } else if (doAutoAssignPatternNum.toString() === "2") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (x1 % numeratorSignature === currentSelectedCell.x && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1 + 1][x1].velocity = velocity; // e.target.value;
                    }
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "3") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1 += 2) {
                    if (masterPatternsRef.current[y1 + 1] && masterPatternsRef.current[y1 + 1][x1]) masterPatternsRef.current[y1][x1].velocity = velocity; // e.target.value;
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "4") {
            for (let y1 = 0; y1 < denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1++) {
                    if (masterPatternsRef.current[y1 + 1] && masterPatternsRef.current[y1 + 1][x1]) masterPatternsRef.current[y1][x1].velocity = velocity; // e.target.value;
                };
            }
        }
        setPatternsHashHook(masterPatternsRef.current);
    }

    const handleNoteLengthUpdate = async (e: any, cellData: any, newValue: any) => {
        // console.log("THANKS HANDLE NOTELENGTH UPDATE: ", lenMarks[newValue]);
        if (!isChuckRunning && masterPatternsRef.current[cellData.yVal][cellData.xVal]) {
            if (!e || !e.target || !e.target.value) return;
            const fraction = lenMarks[(e && e.target && e.target.value)].label;
            const parts = fraction.indexOf('/') > -1 ? fraction.split('/').map(Number) : [Number(fraction)];

            console.log('fraction?? ', fraction, 'parts?? ', parts);

            const result = parts.length > 1 ? parts[0] / parts[1] : parts[0];
            console.log('result~!!! ' + Number(+result), masterPatternsRef.current);
            // setSingleNoteLengthValue(Number(+result));
            masterPatternsRef.current[cellData.yVal][cellData.xVal].length = Number(+result); // Number(+lenMarks[newValue].label); // e.target.value;
            handleAutoAssignLength(cellData.xVal, cellData.yVal, result);
            setPatternsHashHook(masterPatternsRef.current);
            setPatternsHashUpdated(!masterPatternsHashUpdated);

            console.log("midiLengthsArray?>>> ", chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                Object.values(masterPatternsRef.current)
                    .slice(1)
                    .map((i: any) =>
                        Object.values(i).map(
                            (j: any) =>
                                Object.values(j).map(
                                    (h: any) => Number(h) * 1.0
                                )[12]
                        )
                    ).flat())

            chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                await chuckRef.current.setFloatArray(
                    "midiLengthsArray",
                    Object.values(masterPatternsRef.current)
                        .slice(1) // skip first row
                        .map((i: any) =>
                            Object.values(i).map(
                                (j: any) =>
                                    Object.values(j).map(
                                        (h: any) => Number(h) * 1.0
                                    )[12]
                            )
                        ).flat()
                );
        }
    };

    const handleNoteVelocityUpdate = (e: any, cellData: any) => {
        if (masterPatternsRef.current[cellData.current.yVal][cellData.current.xVal]) {
            masterPatternsRef.current[cellData.current.yVal][cellData.current.xVal].velocity = e.target.value;
            handleAutoAssignVelocity(cellData.xVal, cellData.yVal, e.target.value);
            setPatternsHashHook(masterPatternsRef.current);
            setPatternsHashUpdated(true);
            setPatternsHashUpdated(!masterPatternsHashUpdated);
        }
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
            console.log("MEYDA DATA of File(I presume...)??? ", meydaDat);
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
            const getSelEffs: any = [];
            Object.entries(universalSources.current).map((i: any) => i[1].effects && Object.values(i[1].effects).filter((j: any) => j.On && j)) &&
                Object.entries(universalSources.current).map((i: any) => i[1].effects && Object.values(i[1].effects).filter((j: any) => j.On && j)).map((f: any, idx: number) => {
                    f.map((x: any) => getSelEffs.push(`${['osc1', 'stk', 'sampler', 'audioin'][idx]}_${x.Type}`))
                })
            setSelectedEffects(getSelEffs);
            if (doReturnToSynth.current !== true) {
                // **** THIS IS WHERE THE ISSUE MAY BE HAPPENING => WHATEVER GETS PASSED INTO VISIBLESTKSANDFX ALWAYS WINS 
                visibleStkAndFX = Object.entries(universalSources.current).filter(
                    (i: any) => i[0].toLowerCase() === getConvertedRadio(fxRadioValue).toLowerCase()
                        && Object.values(i[1].effects).filter(
                            (j: any) => j));
                visibleStkAndFX.forEach((eff: any) => {
                    let fxString = `${eff[0]}_`;
                    let onEffs = Object.values(eff[1].effects).filter((i: any) => i.On && i.Type)
                    let onEffsNames = [...new Set(onEffs)].map((i: any) => `${fxString}${i.Type}`);
                    setSelectedEffects([...new Set(onEffsNames)]);
                });

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
                                        return [i[1].label, i[1]];
                                    })
                    :
                    Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i])

            setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);

        }
        if (initialNodes.current && initialEdges.current) {
            setInitialNodesHook(initialNodes.current.filter((i: any) => i));
            setInitialEdgesHook(initialEdges.current.filter((i: any) => i));
        }
    }, [checkedFXUpdating]);

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
        // fxRadioValue,
        markUpdated,
        tune,
        initFX,
    ]);

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
        if (!universalSources.current) return;

        const pedalChain = Object.entries(universalSources.current).map(
            ([, source]) => Object.values(source.effects).filter(eff => eff.On)
        );

        setCurrentChain({
            osc1: pedalChain[0]?.map(i => i.VarName) ?? [],
            stk1: pedalChain[1]?.map(i => i.VarName) ?? [],
            sampler: pedalChain[2]?.map(i => i.VarName) ?? [],
            audioin: pedalChain[3]?.map(i => i.VarName) ?? [],
        });  
    };


    const oscDatas = useRef<any>();
    const stkDatas = useRef<any>();
    const samplerDatas = useRef<any>();
    const audioinDatas = useRef<any>();    

    ////////////////////////////////////////////////////////////////
    // WE WANT ONLY ONE LOOP THROUGH WHATEVER OBJECT HOLDS THE SOURCES RIGHT HERE... 
    ////////////////////////////////////////////////////////////////

    const genericFXToString = (sources: Sources) => {
        // WE SHOULD BE UPDATING PRETTY MAJORLY HERE TO KEEP DATA AND UI IN SYNC...
        // ***** THIS IS THE PLACE TO DO IT, SINCE THE DATA WILL REFLECT BETTER THAN THE KNOBS ARE SHOWING WHEN WE TOGGLE LATERALLY BETW FX

        // ****** WE ALSO WANT TO SHIFT BACK TO GENERIC SYNTH WHEN WE TOGGLE SOURCES... LEAVING THIS UNCOMMENTED TO BEGIN HERE AFTER LUNCH...

        console.log("S O U R C E S: ", sources);
        console.log("check instruments ", sources && sources.stk1 && sources.stk1.instruments && Object.entries(sources.stk1.instruments).filter((i: any) => i[1].On && i) && Object.entries(sources.stk1.instruments).filter((i: any) => i[1].VarName && i[1].VarName.length && i));


        const { osc1, stk, sampler, audioin } = getAllSignalData();

        // sampler
        oscDatas.current = osc1;
        stkDatas.current = stk;
        samplerDatas.current = sampler;
        audioinDatas.current = audioin;



        if (!sources) return;

        Object.entries(sources).forEach((i: [string, Source]) => {
            
            const theSource: string = i[0];

            const newWinFuncEnv = { ...winFuncEnvFinalHelper.current[theSource] };
            const newPowerADSR = { ...powerADSRFinalHelper.current[theSource] };

            const newExpEnv = { ...expEnvFinalHelper.current[theSource] };
            const newWpDiodeLadder = { ...wpDiodeLadderFinalHelper.current[theSource] };
            const newWpKorg35 = { ...wpKorg35FinalHelper.current[theSource] };
            // const newModulate = { ...modulateFinalHelper.current[theSource] };
            const newDelay = { ...delayFinalHelper.current[theSource] };
            const newDelayA = { ...delayAFinalHelper.current[theSource] };
            const newDelayL = { ...delayLFinalHelper.current[theSource] };
            const newExpDelay = expDelayFinalHelper.current[`${theSource}`];
            const newElliptic = ellipticFinalHelper.current[`${theSource}`]
            const newSpectacle = spectacleFinalHelper.current[`${theSource}`];



            i[1] && i[1].effects && Object.values(i[1].effects).forEach((eS: EffectsSettings) => {
                // console.log("AND WHAT is eS / i[1].effects???1 ", eS.Type, "cET??? ", currentEffectType.current);
                if (
                    eS?.Type.toLowerCase() === currentEffectType.current.toLowerCase()
                ) {
                    // console.log("BADABING... ", eS);
                    // console.log("AND WHAT is sources[i] / i? ", i)
                    if (i[0].toLowerCase() === getConvertedRadio(fxRadioValue).toLowerCase()) {
                        console.log("BADABOOM!!! ", i);

                        // console.log("AND WHAT is targetsRef??? ", targetsRef.current);
                        // console.log("AND WHAT is allTargetsRef??? ", allTargetsRef.current);
                    }
                }



                const theEffectsSettings = eS;

                // THIS FIRST MAPPING HANDLES THE DAC DECLARATION CHAINING
                // =================================================================
                Object.values(theEffectsSettings.presets).length > 0 &&
                    Object.values(theEffectsSettings.presets).map((preset: Preset) => {


                        
                        const varNamesArr = Object.values(i[1].effects).filter((i: any) => i.On).map(i => i.VarName);
                        if (varNamesArr.includes(preset.name)) {
                            console.log("AND WHAT is preset...??? ", preset, " >>>>> ", varNamesArr);
                        }

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
                                    newPowerADSR.attackTime = thePreset.value;
                                } else if (thePreset.name === "attackCurve") {
                                    newPowerADSR.attackCurve = thePreset.value;
                                } else if (thePreset.name === "releaseTime") {
                                    newPowerADSR.releaseTime = thePreset.value;
                                } else if (thePreset.name === "releaseCurve") {
                                    newPowerADSR.releaseCurve = thePreset.value;
                                }

                                else if (thePreset.name === "decayTime") {
                                    newPowerADSR.decayTime = thePreset.value;
                                }
                                else if (thePreset.name === "decayCurve") {
                                    newPowerADSR.decayCurve = thePreset.value;
                                }
                                else if (thePreset.name === "sustainLevel") {
                                    newPowerADSR.sustainLevel = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_expEnv")) {
                                if (thePreset.name === "T60") {
                                    newExpEnv.T60 = thePreset.value;
                                } else if (thePreset.name === "radius") {
                                    newExpEnv.radius = thePreset.value;
                                } else if (thePreset.name === "value") {
                                    newExpEnv.value = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_diodeladder")) {
                                if (thePreset.name === "cutoff") {
                                    newWpDiodeLadder.cutoff = thePreset.value;
                                } else if (thePreset.name === "nlp_type") {
                                    newWpDiodeLadder.nlp_type = thePreset.value;
                                } else if (thePreset.name === "nonlinear") {
                                    newWpDiodeLadder.nonlinear = thePreset.value;
                                } else if (thePreset.name === "saturation") {
                                    newWpDiodeLadder.saturation = thePreset.value;
                                } else if (thePreset.name === "resonance") {
                                    newWpDiodeLadder.resonance = thePreset.value;
                                }
                            }
                            if (thePreset.type.includes("_wpkorg35")) {
                                if (thePreset.name === "cutoff") {
                                    newWpKorg35.cutoff = thePreset.value;
                                } else if (thePreset.name === "resonance") {
                                    newWpKorg35.resonance = thePreset.value;
                                } else if (thePreset.name === "nonlinear") {
                                    newWpKorg35.nonlinear = thePreset.value;
                                } else if (thePreset.name === "saturation") {
                                    newWpKorg35.saturation = thePreset.value;
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
                                    newDelay.delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    newDelay.lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    newDelay.syncDelay = thePreset.value;
                                }
                            }
                            if ((thePreset.type === "DelayA")) {
                                if (thePreset.name === "delay") {
                                    newDelayA.delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    newDelayA.lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    newDelayA.syncDelay = thePreset.value;
                                }
                            }
                            if ((thePreset.type === "DelayL")) {
                                if (thePreset.name === "delay") {
                                    newDelayL.delay = thePreset.value;
                                } else if (thePreset.name === "lines") {
                                    newDelayL.lines = thePreset.value;
                                } else if (thePreset.name === "syncDelay") {
                                    newDelayL.syncDelay = thePreset.value;
                                }
                            }
                            if (thePreset.type === "ExpDelay") {
                                if (thePreset.name === "ampcurve") {
                                    newExpDelay.ampcurve = thePreset.value;
                                } else if (thePreset.name === "durcurve") {
                                    newExpDelay.durcurve = thePreset.value;
                                } else if (thePreset.name === "delay") {
                                    newExpDelay.delay = thePreset.value;
                                } else if (thePreset.name === "mix") {
                                    newExpDelay.mix = thePreset.value;
                                } else if (thePreset.name === "reps") {
                                    newExpDelay.reps = thePreset.value;
                                }
                            }
                            if (thePreset.type === "Elliptic") {
                                if (thePreset.name === "lowFilter") {
                                    newElliptic.lowFilter = thePreset.value;
                                } else if (thePreset.name === "midFilter") {
                                    newElliptic.midFilter = thePreset.value;
                                } else if (thePreset.name === "highFilter") {
                                    newElliptic.highFilter = thePreset.value;
                                } else if (thePreset.name === "atten") {
                                    newElliptic.atten = thePreset.value;
                                } else if (thePreset.name === "ripple") {
                                    newElliptic.ripple = thePreset.value;
                                } else if (thePreset.name === "filterMode") {
                                    newElliptic.filterMode = thePreset.value;
                                }
                            }
                            if (thePreset.type === "Spectacle") {
                                console.log('OY SPECTACLE PRESET ', thePreset)
                                if (thePreset.name === "bands") {
                                    newSpectacle.bands = thePreset.value;
                                } else if (thePreset.name === "delay") {
                                    newSpectacle.delay = thePreset.value;
                                } else if (thePreset.name === "eq") {
                                    newSpectacle.eq = thePreset.value;
                                } else if (thePreset.name === "feedback") {
                                    newSpectacle.feedback = thePreset.value;
                                } else if (thePreset.name === "fftlen") {
                                    newSpectacle.fftlen = thePreset.value;
                                } else if (thePreset.name === "freqMax") {
                                    newSpectacle.freqMax = thePreset.value;
                                } else if (thePreset.name === "freqMin") {
                                    newSpectacle.freqMin = thePreset.value;
                                } else if (thePreset.name === "mix") {
                                    newSpectacle.mix = thePreset.value;
                                } else if (thePreset.name === "overlap") {
                                    newSpectacle.overlap = thePreset.value;
                                } else if (thePreset.name === "table") {
                                    newSpectacle.table = thePreset.value;
                                }
                            }
                            else {
                            }
                        }

                        winFuncEnvFinalHelper.current = {
                            ...winFuncEnvFinalHelper.current,
                            [theSource]: newWinFuncEnv
                        };
                        powerADSRFinalHelper.current = {
                            ...powerADSRFinalHelper.current,
                            [theSource]: newPowerADSR
                        };
                        expEnvFinalHelper.current = {
                            ...expEnvFinalHelper.current,
                            [theSource]: newExpEnv
                        };
                        wpDiodeLadderFinalHelper.current = {
                            ...wpDiodeLadderFinalHelper.current,
                            [theSource]: newWpDiodeLadder
                        };
                        wpKorg35FinalHelper.current = {
                            ...wpKorg35FinalHelper.current,
                            [theSource]: newWpKorg35
                        };
                        // modulateFinalHelper.current = {
                        //     ...modulateFinalHelper.current,
                        //     [theSource]: newModulate
                        //     };
                        delayFinalHelper.current = {
                            ...delayFinalHelper.current,
                            [theSource]: newDelay
                        };
                        delayAFinalHelper.current = {
                            ...delayAFinalHelper.current,
                            [theSource]: newDelayA
                        };
                        delayLFinalHelper.current = {
                            ...delayLFinalHelper.current,
                            [theSource]: newDelayL
                        };
                        expDelayFinalHelper.current = {
                            ...expDelayFinalHelper.current,
                            [theSource]: newExpDelay
                        };
                        ellipticFinalHelper.current = {
                            ...ellipticFinalHelper.current,
                            [theSource]: newElliptic
                        };
                        spectacleFinalHelper.current = {
                            ...spectacleFinalHelper.current,
                            [theSource]: newSpectacle
                        };

                        return null;

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


    const notesDetailsRef = useRef<any>();
    notesDetailsRef.current = notesDetailsRef.current || [];

    const organizeRows = async (rowNum: number, note: string) => {
        await note;
        // console.log("AND WHAT IS ... in organize rows // note: ", note, "rowNum: ", rowNum); <<<< THIS WORKS GREAT
        const noteReady = {
            midiNote: undefined,
            midiHz: undefined,
            name: '',
        };
        note = note.replace("♯", "#");
        const getNote: any = Note.get(note);
        // console.log("AND WHAT IS GETNOTE? ", getNote); <<<< THIS WORKS GREAT
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
            console.log("meyda processor: ", processor);
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
            // chuckRef.current && chuckRef.current.setString("currentSrc", getConvertedRadio(fxRadioValue));

            if (universalSources.current) {
                // console.log("!@#*** updating generic string... ", moogGrandmotherEffects.current);

                Object.values(moogGrandmotherEffects.current).forEach((value: any) => {
                    (async () => {
                        try {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("moogGMDefaults", value.name, value.value);
                        } catch (e) {
                            alert("ERR:" + e)
                        }
                    })();
                });

                const safeSources = Object.fromEntries(
                    Object.entries(universalSources.current).map(([srcName, src]) => [
                        srcName,
                        {
                            ...src,
                            effects: JSON.parse(JSON.stringify(src.effects)) // deep copy only effects
                        }
                    ])
                );
                genericFXToString(safeSources as Sources);   
            }

            (async () => {
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
        console.log("Stopping ChucK instance... ", chuckRef.current);
        chuckRef.current && await chuckRef.current.runCode(`Machine.removeAllShreds();`);
        chuckRef.current && await chuckRef.current.runCode(`Machine.resetShredID();`);
        setChuckUpdateNeeded(true);
        setMTFreqs([]);
        setMTMidiNums([]);
        initialRun.current = true;
        setIsChuckRunning(false);
        return;
    }

    const clickHeatmapCell = (x: number, y: number) => {
        currentHeatmapXY.current = { x, y };
        setCurrentSelectedCell({ x, y });
    };






    const handleCheckedFXToShow = (msg: any) => {
        console.log("effect to show message: " + msg.target.value);
        console.log("effect to show sanity?? ", msg);
        msg?.target.length > 0 && setShowNotesOrder(msg.target.value)
        // setCheckedEffectToShow(msg);
    }


    const getSourceFX = (thisSource: string) => {
        // alert(thisSource);
        if (thisSource === "stk") thisSource = "stk1";

        const checkFX = universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects;


        console.log("&*&* thisSource ----> ", thisSource, "checkFX ----> ", checkFX, "fxRadioValue ----> ", fxRadioValue);



        return `
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.PowerADSR && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.PowerADSR.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.PowerADSR.Code(powerADSRFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WinFuncEnv && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WinFuncEnv.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WinFuncEnv.Code(winFuncEnvFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpEnv && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpEnv.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpEnv.Code(expEnvFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Elliptic && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Elliptic.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Elliptic.Code(ellipticFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Spectacle && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Spectacle.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Spectacle.Code(spectacleFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPDiodeLadder && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPDiodeLadder.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPDiodeLadder.Code(wpDiodeLadderFinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPKorg35 && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPKorg35.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.WPKorg35.Code(wpKorg35FinalHelper.current) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpDelay && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpDelay.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.ExpDelay.Code(expDelayFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Modulate && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Modulate.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Modulate.Code(modulateFinalHelper.current, currentNoteVals) : ''}

            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Delay && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Delay.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.Delay.Code(delayFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayA && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayA.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayA.Code(delayAFinalHelper.current, currentNoteVals) : ''}
            ${universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources] && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayL && universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayL.On ? universalSources.current[getConvertedRadio(thisSource) as keyof Sources].effects.DelayL.Code(delayLFinalHelper.current, currentNoteVals) : ''}
        `;
    };

    const newChuckCode = useRef<any>("");

    type SourceTargets = {
        signalChain: string[];
        signalChainDeclarations: string[];
        valuesReadout: string[];
        valuesReadoutDeclarations: string[];
    };

    type AllTargets = {
        osc1: SourceTargets;
        stk1: SourceTargets;
        sampler: SourceTargets;
        audioin: SourceTargets;
    };

    function createAllTargets(): AllTargets {
        return {
            osc1: createEmptyTargets(),
            stk1: createEmptyTargets(),
            sampler: createEmptyTargets(),
            audioin: createEmptyTargets(),
        };
    }
    const targetsRef = useRef<AllTargets | null | undefined>(null);
    if (!targetsRef.current) {
        targetsRef.current = createAllTargets();
    }

    const runChuck = async (isTestingChord?: number | undefined) => {
        if (typeof window === 'undefined') return;
        console.log("running chuck now... ", chuckUpdateNeeded);

        if (chuckRef.current) {

            const fxRadio = getConvertedRadio(fxRadioValue).toLowerCase();
            const osc1FX = universalSources.current && Object.values(universalSources.current.osc1.effects).filter(fx => fx.On);
            const samplerFX = universalSources.current && Object.values(universalSources.current.sampler.effects).filter(fx => fx.On);
            const audioInFX = universalSources.current && Object.values(universalSources.current.audioin.effects).filter(fx => fx.On);
            const stkFX = universalSources.current && Object.values(universalSources.current.stk1.effects).filter(fx => fx.On);


            const targets = targetsRef.current!;

                await processSourceFX(
                    'osc1',
                    osc1FX as any,
                    chuckRef,
                    // fxRadioValue,
                    'osc1',
                    {
                        signalChain: signalChain.current,
                        signalChainDeclarations: signalChainDeclarations.current,
                        valuesReadout: valuesReadout.current,
                        valuesReadoutDeclarations: valuesReadoutDeclarations.current
                    },
                    universalSources.current
                    // targets.osc1
                );

                await processSourceFX(
                    'sampler',
                    samplerFX as any,
                    chuckRef,
                    'sampler',
                    {
                        signalChain: signalChainSampler.current,
                        signalChainDeclarations: signalChainSamplerDeclarations.current,
                        valuesReadout: valuesReadoutSampler.current,
                        valuesReadoutDeclarations: valuesReadoutSamplerDeclarations.current
                    },
                    universalSources.current
                    // targets.sampler
                );

                await processSourceFX(
                    'audioin',
                    audioInFX as any,
                    chuckRef,
                    'audioin',
                    {
                        signalChain: signalChainAudioIn.current,
                        signalChainDeclarations: signalChainAudioInDeclarations.current,
                        valuesReadout: valuesReadoutAudioIn.current,
                        valuesReadoutDeclarations: valuesReadoutAudioInDeclarations.current
                    },
                    universalSources.current
                    // targets.audioin
                );

                await processSourceFX(
                    'stk1',
                    stkFX as any,
                    chuckRef,
                    'stk1',
                    {
                        signalChain: signalChainSTK.current,
                        signalChainDeclarations: signalChainSTKDeclarations.current,
                        valuesReadout: valuesReadoutSTK.current,
                        valuesReadoutDeclarations: valuesReadoutSTKDeclarations.current
                    },
                    universalSources.current
                    // targets.stk1
                );
 


            console.log("stk instruments: ", universalSources.current && universalSources.current.stk1.instruments && universalSources.current.stk1.instruments)
            console.log("masterPatternsRef.current: ", masterPatternsRef.current)


            activeSTKDeclarations.current = '';
            activeSTKSettings.current = '';
            activeSTKs.map((s: any) => {
                activeSTKDeclarations.current = activeSTKDeclarations.current.concat(`${s.Type} ${s.VarName} => stk_FxChain => Dyno stk_Dyno_${s.VarName} => dac; `);
                activeSTKPlayOn.current = activeSTKPlayOn.current.concat(`allFreqs[stk_f] => ${s.VarName}.freq; 1 => ${s.VarName}.noteOn; `);
                activeSTKPlayOff.current = activeSTKPlayOff.current.concat(`1 => ${s.VarName}.noteOff; `);
            });

            activeSTKs.map((s_outer: any) => {
                s_outer.presets.map((s: any) => {
                    // >>> used to be in block below... ${s.value} 
                    if (s.type.includes("int")) {
                        activeSTKSettings.current = activeSTKSettings.current.concat(`allSTKFXDynamicInts["${currentStkTypeVar.current.split("#")[0]}_${s_outer.VarName}_stk_${s.name}"] => ${s_outer.VarName}.${s.name}; `);
                    } else if (s.type.includes("float")) {
                        activeSTKSettings.current = activeSTKSettings.current.concat(`allSTKFXDynamicFloats["${currentStkTypeVar.current.split("#")[0]}_${s_outer.VarName}_stk_${s.name}"] => ${s_outer.VarName}.${s.name}; `);
                    }
                })
            });

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
                signalChain.current,
                signalChainDeclarations.current,
                signalChainSampler.current,
                signalChainSamplerDeclarations.current,
                signalChainSTK.current,
                signalChainSTKDeclarations.current,
                signalChainAudioIn.current,
                signalChainAudioInDeclarations.current,
                valuesReadout.current,
                valuesReadoutSampler.current,
                valuesReadoutSTK.current,
                valuesReadoutAudioIn.current,
                valuesReadoutDeclarations.current,
                valuesReadoutSamplerDeclarations.current,
                valuesReadoutSTKDeclarations.current,
                valuesReadoutAudioInDeclarations.current,
                getSourceFX,
                mTFreqs,
                activeSTKDeclarations.current,
                activeSTKSettings.current,
                activeSTKPlayOn.current,
                activeSTKPlayOff.current,
                selectedChordScaleOctaveRange,
                { maxFreq, minFreq },
                notesHolder,
                hid,
            );

            await chuckRef.current && chuckRef.current.runCode(newChuckCode.current);

            setIsChuckRunning(true);

            console.log("HERE IS CHUCK CODE: ", newChuckCode.current);



            // THIS BLOCK IS CAUSING RED ERROR (BUT ALSO WORKS!!!)
            // FIX THIS & MOVE OTHER 3 HERE...
            chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                await chuckRef.current.setFloatArray(
                    "midiNotesArray",
                    Object.values(masterPatternsRef.current).map((i: any) =>
                        Object.values(i).map(
                            (j: any) =>
                                Object.values(j).map(
                                    (h: any) => Number(h) * 1.0
                                )[9]
                        )
                    ).flat()
                );


            // console.log("KRIKES 0 ", masterPatternsRef.current);
            // console.log("KRIKES 1 ", Object.values(masterPatternsRef.current).map((i: any) =>
            //     Object.values(i).map(
            //         (j: any) =>
            //             Object.values(j).map(
            //                 (h: any) => Number(h) * 1.0
            //             )[8]
            //     )
            // ).flat())

            // THE BELOW LOOPS ARE CONTROLLING NOTES (AND PROBABLY A WHOLE LOT MORE)...
            chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                await chuckRef.current.setFloatArray(
                    "midiFreqsArray",
                    Object.values(masterPatternsRef.current).map((i: any) =>
                        Object.values(i).map(
                            (j: any) =>
                                Object.values(j).map(
                                    (h: any) => Number(h) * 1.0
                                )[8]
                        )
                    ).flat()
                );

            chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                await chuckRef.current.setFloatArray(
                    "midiLengthsArray",
                    Object.values(masterPatternsRef.current)
                        // .slice(1) // skip first row
                        .map((i: any) =>
                            Object.values(i).map(
                                (j: any) =>
                                    Object.values(j).map(
                                        (h: any) => Number(h) * 1.0
                                    )[12]
                            )
                        ).flat()
                );

            chuckHook &&
                chuckRef.current &&
                masterPatternsRef.current &&
                Object.values(masterPatternsRef.current).length > 0 &&
                await chuckRef.current.setFloatArray(
                    "midiVelocitiesArray",
                    Object.values(masterPatternsRef.current).map((i: any) =>
                        Object.values(i).map(
                            (j: any) =>
                                Object.values(j).map(
                                    (h: any) => Number(h) * 1.0
                                )[13]
                        )
                    ).flat()
                );

        } else {
            alert("NO aChuck!");
            console.log("NO aChuck!");
        }
    }



    // AUDIO IN
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++


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
        // chuckRef.current && chuckRef.current.broadcastEvent("playAudioIn");

    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================


    const handleMingusKeyboardData = useCallback((data: any) => {
        // console.log("MINGUS KEYBOARD DATA *** : ", data);

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

        // console.log("updateKeyScaleChord &^& called with: ", key, scale, chord, chordLabel, octaveMax, octaveMin);

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

        setKeyScaleChord({ key: key, scale: scale, chord: chord, octaveMax: octaveMax, octaveMin: octaveMin });

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
                Object.values(universalSources.current.stk1.instruments[currStkType.toString() as keyof STKInstruments].presets).filter(async (i: any) => {
                    if (i.name === obj.name) {
                        i.value = value;
                        const vN = universalSources.current &&
                            universalSources.current.stk1 &&
                            universalSources.current.stk1.instruments &&
                            universalSources.current.stk1.instruments[currStkType as keyof STKInstruments].VarName;

                        if (i.type.includes("int")) {
                            chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allSTKFXDynamicInts", `${currStkType}_${vN}_stk_${i.name}`, value);
                            // console.log("BLAM!INT ", `${currStkType}_${vN}_stk_${i.name}`, value);
                        } else if (i.type.includes("float")) {
                            chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allSTKFXDynamicFloats", `${currStkType}_${vN}_stk_${i.name}`, value);
                            //console.log("BLAM!FLOAT ", `${currStkType}_${vN}_stk_${i.name}`, value);
                        }
                    }
                });
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

                    // console.log("****? ", value, "&&&&? ", chuckRef.current && await chuckRef.current.getAssociativeIntArrayValue("allFXDynamicInts", `${universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects[currentEffectType.current as keyof Effects].VarName}_${getConvertedRadio(fxRadioValue)}_${obj.name}`));
                }
            }
        } else if (obj.fxType === 'default') {
            moogGrandmotherEffects.current[`${obj.name}`].value = value;
            Object.values(moogGrandmotherEffects.current).forEach((value: any) => {
                (async () => {
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

    }, [fxRadioValue, markUpdated]); // valuesReadout causes Babylon to rerender & flicker, which is both bad and possibly good if we can harness the updates... 
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
        currentHeatmapXY.current = { x: Number(x), y: Number(y) };
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
                    : mingusKeyboardData.data[0] ? mingusKeyboardData.data[0] : ['no notes found']
            ;
        setMTNames(newFreqs);
    };

    const editPattern = (x: any, y: any, group: any) => {
        console.log("PATTERNS HASH GENERAL", masterPatternsRef.current[y][x], group);
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
    }

    const doUpdateBabylonKey = (value: any) => {
        babylonKeyRef.current = value;
    }

    const handleSourceToggle = (name: string, val: any) => {

        currentScreen.current = "synth";
        currentEffectType.current = getConvertedRadio(val)
        visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);

        // setFxKnobsCount(visibleFXKnobs.current && visibleFXKnobs.current.length > 0 ? visibleFXKnobs.current.length : 0);
        setFxKnobsCount(moogGrandmotherEffects.current.length);
        updateCurrentFXScreen(setFxKnobsCount, doUpdateBabylonKey, babylonKeyRef.current);

        setFxRadioValue(val);


        if(universalSources.current && Object.values(Object.entries(universalSources.current).filter(i => i[0] === val)[0][1].effects).filter(i => i.On ).length > 0)
        {
            const effects = universalSources.current &&
            Object.values(
                Object.entries(universalSources.current)
                .find(([key]) => key === val)?.[1].effects || {}
            ).filter(i => i.On);

            setCurrentChain(prev => ({
            ...prev,
            [val]: effects.map(i => i.VarName),
            }));

            setCheckedEffectsListHook(
            effects.map(i => i.VarName) // only keep VarNames
            );

        } else {

        }
    };

    const exitEditMode = () => {
        isInPatternEditMode.current = false;
        setPatternsHashUpdated(true);
    }

    const currentBeatCountToDisplayRef = useRef<number>(0);
    currentBeatCountToDisplayRef.current = currentBeatCountToDisplayRef.current || 0;
    const currentNumerCountColToDisplayRef = useRef<number>(0);
    currentNumerCountColToDisplayRef.current = currentNumerCountColToDisplayRef.current || 0;
    const currentDenomCountRef = useRef<number>(0);
    currentDenomCountRef.current = currentDenomCountRef.current || 0;
    const currentPatternCountRef = useRef<number>(0);
    currentPatternCountRef.current = currentPatternCountRef.current || 0;

    const handleChuckMsg = (chuckMsg: string) => {
        let isMounted = true;
        // const parsedNumbers = chuckMsg.match(/\d+/g) || [];  

        // const bC = parsedNumbers.length > 0 && parsedNumbers[parsedNumbers.length - 1] 
        //     ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
        //     : currentBeatCountToDisplayRef.current;  // Keep previous value if no valid number found

        // const beatDisplay = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
        // const numerCount = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
        // const denomCount = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
        // const patternCount = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;

        // // setCurrentBeatCountToDisplay(beatDisplay);
        // // setCurrentNumerCountColToDisplay(numerCount);
        // // setCurrentDenomCount(denomCount);
        // // setCurrentPatternCount(patternCount);
        // currentBeatCountToDisplayRef.current = beatDisplay;
        // currentNumerCountColToDisplayRef.current = numerCount;
        // currentDenomCountRef.current = denomCount;
        // currentPatternCountRef.current = patternCount;

        if (chuckMsg.includes("MAX_MIN:")) {
            try {
                let maxFreq = '440';
                let minFreq = '0';
                maxFreq = chuckMsg.split("::::")[0].trim();
                minFreq = chuckMsg.split("::::")[1].trim();
                setMaxMinFreq([Number(+maxFreq), Number(+minFreq)]);
            } catch (e) {
                console.log("error getting max min freq from chuck... ", e);
            }
        } else {
            const parsedNumbers = chuckMsg.match(/\d+/g) || [];
            const bC = parsedNumbers.length > 0 && parsedNumbers[parsedNumbers.length - 1]
                ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
                : currentBeatCountToDisplayRef.current;  // Keep previous value if no valid number found

            const beatDisplay = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
            const numerCount = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
            const denomCount = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
            const patternCount = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;

            // setCurrentBeatCountToDisplay(beatDisplay);
            // setCurrentNumerCountColToDisplay(numerCount);
            // setCurrentDenomCount(denomCount);
            // setCurrentPatternCount(patternCount);
            currentBeatCountToDisplayRef.current = beatDisplay;
            currentNumerCountColToDisplayRef.current = numerCount;
            currentDenomCountRef.current = denomCount;
            currentPatternCountRef.current = patternCount;
            setClockCounterKey(currentBeatCountToDisplayRef.current + '-' + currentNumerCountColToDisplayRef.current + '-' + currentDenomCountRef.current + '-' + currentPatternCountRef.current);


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
            // const DEV_CHUCK_SRC = "https://chuck.stanford.edu/webchuck/dev/"; // dev webchuck src
            // const PROD_CHUCK_SRC = "https://chuck.stanford.edu/webchuck/src/"; // prod webchuck src
            // let whereIsChuck: string =
            //     localStorage.getItem("chuckVersion") === "dev"
            //         ? DEV_CHUCK_SRC
            //         : PROD_CHUCK_SRC;

            const LOCAL_CHUCK_SRC = "/webchuck/";

            // console.log("WHERE IS CHUCK111111? ", whereIsChuck);
            // Create theChuck
            const theChuck = await Chuck.init(
                serverFilesToPreload,
                audioContext,
                audioContext.destination.maxChannelCount,
                // whereIsChuck
                LOCAL_CHUCK_SRC
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

            chuckRef.current.chuckPrint = (message: string) => {
                if (message.includes("TICK: ")) {
                    const parsedMsg = message.split(":")[1].trim();

                    // setChuckMsg(parsedMsg); 
                    handleChuckMsg(parsedMsg)
                } else {
                    // (async () => {
                    //     const osc1OutLevel = chuckRef.current && await chuckRef.current.getFloat("samplerOutputRMS");
                    //     console.log("OSC1 OUT LEVEL: ", osc1OutLevel);
                    // })();
                    // if (message.includes("OSC1OUT")) {
                    //     console.log("OSC1OUT ", message)
                    // }

                    if (message.includes("SHREDCOUNT: ")) {
                        console.log("SHREDCOUNT ", message)
                    }

                    if (message.includes("KEY_VAL2")) { 
                        console.log("GOT NOTES!>!>!>! ", message)
                    }

                    // if (message.includes("TICK TIMER: ")) {
                    //     console.log("TICK TIMER: ", message)
                    // }

                    // if (message.includes("ADSR IN HERE >>> ")) {
                    //     console.log("ADSR IN HERE >>>  ", message);
                    // }

                    // if (message.includes("PROGRAMMATIC")) {
                    //     console.log("PLAYING PROGRAMMATIC NOTE", message);
                    // }

                    // if (message.includes("PROGLEN")) {
                    //     console.log("PLAYING PROGLEN", message);
                    // }
                    // if (message.includes("DURSTEPTEST")) {
                    //     console.log("DURSTEPTEST: ", message);
                    // }


                    // console.log("CHUCK MESSAGE: ", message);     

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

        // ***1 HANDLE TABLE AND DROPDOWN VISUAL UPDATES HERE... 

        const indices = fileNames.map((fileName: string) => filesToProcess.current.map((i: any) => i.filename).indexOf(fileName));

        const selectedCell = masterPatternsRef.current[yVal]?.[xVal];
        const dynamicN = selectedCell?.subdivisions || 1;

        const assignEveryOtherReferenceNumber = xVal % 2;


        // PULL UP THE AUDIO DATA HERE!!!!
        // DATA TO WAVESURFER HERE...

        if (masterPatternsRef.current[yVal] && masterPatternsRef.current[yVal][xVal]) {
            console.log("AUTOASSIGN NUMBER: ", doAutoAssignPatternNum);
            //*tk1
            if (doAutoAssignPatternNum.toString() === "0") {
                masterPatternsRef.current[yVal][xVal].fileNums = indices;
            } else if (
                doAutoAssignPatternNum.toString() === "1"
            ) {
                const selectedX = Number(currentSelectedCell.x);
                const rowLength = numeratorSignature * masterFastestRate;  // or masterPatternsRef.current[0]?.length
                const otherX = (selectedX + rowLength / 2) % rowLength;

                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    if (masterPatternsRef.current[y1]?.[selectedX]) {
                        masterPatternsRef.current[y1][selectedX].fileNums = indices;
                    }
                    if (masterPatternsRef.current[y1]?.[otherX]) {
                        masterPatternsRef.current[y1][otherX].fileNums = indices;
                    }
                }
            } else if (doAutoAssignPatternNum.toString() === "2") {
                const selectedX = Number(currentSelectedCell.x);

                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                        const hitX = x1 % numeratorSignature;

                        if (
                            (hitX === selectedX) && // TWO hits per row
                            masterPatternsRef.current[y1]?.[x1]
                        ) {
                            masterPatternsRef.current[y1][x1].fileNums = indices;
                        }
                    }
                }
            } else if (doAutoAssignPatternNum.toString() === "3") {
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1 += 2) {
                        if (masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) masterPatternsRef.current[y1][x1].fileNums = indices;
                    };
                }
            } else if (doAutoAssignPatternNum.toString() === "4") {
                for (let y1 = 0; y1 < denominatorSignature; y1++) {
                    for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1++) {
                        if (masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) masterPatternsRef.current[y1][x1].fileNums = indices;
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
        masterPatternsRef.current[yVal] = masterPatternsRef.current[yVal] || {};


        console.log("WHAT ARE NOTES??? ", notes, Number(yVal), xVal, masterPatternsRef.current);


        masterPatternsRef.current[Number(yVal)][xVal].noteName = notes.map(n => n)
        masterPatternsRef.current[Number(yVal)][xVal].noteHz = notes.map((i: any) => noteToFreq(i.split("-")[0], Number(i.split("-")[1])));
        masterPatternsRef.current[Number(yVal)][xVal].noteMidi = notes.map((i: any) => noteToMidi(i.split("-")[0], Number(i.split("-")[1])));

        masterPatternsRef.current[Number(yVal)][xVal].midiInfo.pitch = notes.map((i: any) => noteToMidi(i.split("-")[0], Number(i.split("-")[1])));
        masterPatternsRef.current[Number(yVal)][xVal].noteOnLength = notes.map((i: any) => i.length);

        if (noteBuilderFocus.includes("chord")) {
            setMTNames([...keyScaleChord.chord]);
        } else if (noteBuilderFocus.includes("scale")) {
            setMTNames([...keyScaleChord.scale]);
        }
        console.log("WHAT IS HANDLE LATEST NOTES???  ", "X: ", xVal, "Y: ", yVal, "NOTES: ", notes, "CHORD: ", ...keyScaleChord.chord, "SCALE: ", ...keyScaleChord.scale);


        notes.map((n: any) => {
            const noteLetter = n.split("-")[0];
            const noteOctave = n.split("-")[1];
            const newFreq = 1.0 * noteToFreq(noteLetter, Number(+noteOctave));
            const newMidi = 1.0 * noteToMidi(noteLetter, Number(+noteOctave));
            setMTFreqs((prev: any) => [...prev, 1.0 * newFreq]);
            setMTMidiNums((prev: any) => [...prev, 1.0 * newMidi]);
        });


        if (doAutoAssignPatternNum.toString() === "0") {
            masterPatternsRef.current[yVal][xVal].noteName = notes;
        } else if (
            doAutoAssignPatternNum.toString() === "1"
        ) {
            for (let y1 = 0; y1 <= denominatorSignature; y1++) {

                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (((x1 === currentSelectedCell.x) || (currentSelectedCell.x + Math.floor((numeratorSignature * masterFastestRate) / 2)) === x1) && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1][x1].noteName = notes;
                        masterPatternsRef.current[y1][x1].noteHz = notes.map((i: any) => 1.0 * noteToFreq(i.split("-")[0], Number(i.split("-")[1])));
                        masterPatternsRef.current[y1][x1].noteMidi = notes.map((i: any) => 1.0 * noteToMidi(i.split("-")[0], Number(i.split("-")[1])));
                    }
                }

            }
        } else if (doAutoAssignPatternNum.toString() === "2") {
            for (let y1 = 0; y1 <= denominatorSignature; y1++) {
                for (let x1 = 0; x1 < numeratorSignature * masterFastestRate; x1++) {
                    if (x1 % numeratorSignature === currentSelectedCell.x && masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1][x1].noteName = notes;

                        masterPatternsRef.current[y1][x1].noteHz = notes.map((i: any) => 1.0 * noteToFreq(i.split("-")[0], Number(i.split("-")[1])));
                        masterPatternsRef.current[y1][x1].noteMidi = notes.map((i: any) => 1.0 * noteToMidi(i.split("-")[0], Number(i.split("-")[1])));
                    }
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "3") {
            for (let y1 = 0; y1 <= denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1 += 2) {
                    if (masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1][x1].noteName = notes;
                        masterPatternsRef.current[y1][x1].noteHz = notes.map((i: any) => 1.0 * noteToFreq(i.split("-")[0], Number(i.split("-")[1])));
                        masterPatternsRef.current[y1][x1].noteMidi = notes.map((i: any) => 1.0 * noteToMidi(i.split("-")[0], Number(i.split("-")[1])));
                    }
                };
            }
        } else if (doAutoAssignPatternNum.toString() === "4") {
            for (let y1 = 0; y1 <= denominatorSignature; y1++) {
                for (let x1 = 0; x1 <= numeratorSignature * masterFastestRate; x1++) {
                    if (masterPatternsRef.current[y1] && masterPatternsRef.current[y1][x1]) {
                        masterPatternsRef.current[y1][x1].noteName = notes;
                        masterPatternsRef.current[y1][x1].noteHz = notes.map((i: any) => 1.0 * noteToFreq(i.split("-")[0], Number(i.split("-")[1])));
                        masterPatternsRef.current[y1][x1].noteMidi = notes.map((i: any) => 1.0 * noteToMidi(i.split("-")[0], Number(i.split("-")[1])));
                    }
                };
            }
        }
        setPatternsHashHook(masterPatternsRef.current);
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


    const updateStkKnobs = async (knobValsArg: STKOption[]) => {
        const knobVals: STKOption[] = knobValsArg || [];
        console.log("yup knobs: ", knobVals)

        chuckHook && chuckRef.current && await chuckRef.current.setInt("stkInstsInUse", knobVals.length)

        stkKnobValsRef.current = [];
        if (knobVals[0] && knobVals[0].color === "") {
            console.log("knob vals: ", knobVals);
            const match = stkOptions.filter((i: any) => i.label === knobVals[0].label);
            const fullMatch = {
                color: match[0].color,
                label: match[0].label,
                value: match[0].value,
            }
            stkKnobValsRef.current.push(fullMatch);
        } else {
            stkKnobValsRef.current.push(...knobVals);
        }
        console.log("chuggit!!: ", stkKnobValsRef.current)

        if (!stkKnobValsRef.current[stkKnobValsRef.current.length - 1]) {

            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(moogGrandmotherEffects.current.length);
            updateCurrentFXScreen(
                setFxKnobsCount,
                doUpdateBabylonKey,
                babylonKeyRef.current);

            return;
        } else {
            const getSTKVal: any = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value);
            currentStkTypeVar.current = (`${getSTKVal.type}#${getSTKVal.var}`)
            if (universalSources.current) {
                console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', getSTKVal);
                console.log('@@@@@@@@@@@ STK PRESETS ', getSTKVal.presets);

                setSelectedSTKs((x) => [...x, getSTKVal]);
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
                    console.log("YOHEYHOYYO ", stk.instruments);
                    const instruments = Object.values(stk.instruments).filter((i: any) => i.On);
                    console.log("INSTRUMENTS>>> ", instruments);
                    instruments.forEach((j: any) => {
                        const instType = currentStkTypeVar.current.split("#")[0];
                        const instVarName = currentStkTypeVar.current.split("#")[1];
                        console.log("HEYAHEYAHEYA JJJJJJ ", j);
                        console.log("INST TYPE: ", instType, "INST VAR NAME: ", instVarName);
                        j.presets.map(async (i: any) => {
                            if (i.type.includes("int")) {
                                chuckRef.current && await chuckRef.current.setAssociativeIntArrayValue("allSTKFXDynamicInts", `${instType}_${instVarName}_stk_${i.name}`, i.value);
                                console.log("BLAM!INT ", `${instType}_${instVarName}_stk_${i.name}`, i.value);
                            } else if (i.type.includes("float")) {
                                chuckRef.current && await chuckRef.current.setAssociativeFloatArrayValue("allSTKFXDynamicFloats", `${instType}_${instVarName}_stk_${i.name}`, i.value);
                                console.log("BLAM!FLOAT ", `${instType}_${instVarName}_stk_${i.name}`, i.value);
                            }
                            markUpdated();
                            setChuckUpdateNeeded(true);
                        })
                    })
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
    }

    const updateMicroTonalScale = (scale: any) => {
        console.log("OY SCALE! ", scale)
        setMicrotonalScale(scale.value);
    };

    const updateMingusData = (data: any) => {
        console.log("**** WHAT IS DATA HERE????: ", data)
    }

    useEffect(() => {
        if (!parentDivRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // console.log('Parent size changed:', width, height);

                setParentSize({ width, height });
            }
        });

        observer.observe(parentDivRef.current);

        // Cleanup
        return () => observer.disconnect();
    }, [chuckHook]);



    const handleViewSTK = (e: any) => {
        updateStkKnobs([{ label: e.target.value, value: e.target.value, color: "" }]);
    }

    const handleViewEffect = (e: any) => {
        console.log("WTF IN HANDLE VIEW EFFECT ?!?! ", e.target.textContent, "e is what??>> ", e);
        handleCheckedFXToShow({ target: { value: e.target.value.split("_")[1] } });
        currentFX.current = moogGrandmotherEffects.current;
        visibleFXKnobs.current = visibleFXKnobs.current || Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
        setFxKnobsCount(visibleFXKnobs.current.length);
        doReturnToSynth.current = false;
        handleUpdateCheckedFXList(e);
        // markUpdated(); <<< TK!
    }

    const handleManageFX = () => {
        // alert("Manage FX button clicked:" + e.target.value);
        setIsManagingFX(!isManagingEffects);
    }

    const getNewFX = (fx: string | undefined) => {

        const varNames: any = universalSources.current && Object.values(universalSources.current?.osc1?.effects).map(i => [`${i.VarName}`, i]);
        console.log("UNIVERSAL SOURCES ", varNames && Object.values(varNames).length > 0 && varNames.map((i: any) => i[0]), "?!?! ", fx?.split("_"));
        const idx = varNames && Object.values(varNames).length > 0 && varNames.map((i: any) => i[0]).indexOf(fx?.split("_")[0]);
        const item = idx !== -1 && varNames && varNames.length > 0 ? varNames[idx][1] : null;
        if (item && item.Type) {
            handleViewEffect({ target: { value: `${item.Type}` } });
        }
    }

    // THIS IS AUDIO DATA OBJECT --->
    // console.log("masterPatternsHashHook keys!@#$: ", masterPatternsHashHook);

    const switchSourceChain = () => {
        const sourceName = getConvertedRadio(fxRadioValue);
        switch (sourceName) {
            case 'osc1':
                // Handle osc1 case
                return currentChain.osc1;
            case 'stk1':
                return currentChain.stk1;
            case 'sampler':
                return currentChain.sampler;
            case 'audio': 
                return currentChain.audioin; 
            default:
                // Handle default case
                break;
        }
    }

    return (
        <Box
            id={'frontendOuterWrapper'}
        >

            <Box id={'relativeFrontendWrapper'}>
                {/* RESPONSIVE APP BAR */}
                {/* {chuckHook && */}
                {clickedBegin && chuckHook && isChuckRunning &&
                    <Box
                        sx={{
                            position: "absolute",
                            width: "calc(100% - 140px)",
                            left: '140px'
                        }}
                    >
                        <ClockCounter
                            chuckHook={chuckHook}
                            currentPatternCount={currentPatternCountRef.current}
                            currentDenomCount={currentDenomCountRef.current}
                            currentNumerCountColToDisplay={currentNumerCountColToDisplayRef.current}
                            currentBeatCountToDisplay={currentBeatCountToDisplayRef.current}
                            numeratorSignature={numeratorSignature}
                            clockCounterKey={clockCounterKey}
                        />
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
                                    <Box sx={{ width: "100%",  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <AnimatedTitle clickedBegin={clickedBegin} />
                                        <Button
                                            sx={{
                                                width: '160px',
                                                height: '90px',
                                                fontFamily: 'monospace',
                                                fontSize: '1em !important',
                                                background: OBERHEIM_TEAL,
                                                padding: '24px',
                                                margin: '16px',
                                                color: 'rgba(255,255,255,0.78)',
                                                border: 'rgba(255,255,255,0.78)',
                                                '&:hover': {
                                                    color: '#f5f5f5 !important',
                                                    // border: `1px solid ${SEAFOAM_TEAL}`,
                                                    border: 'transparent',
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

                                            {
                                                universalSources.current &&
                                                Object.keys(universalSources.current).length > 0 &&
                                                <GroupToggle
                                                    name={"test name"}
                                                    options={Object.keys(universalSources.current).map(i => i)}
                                                    handleSourceToggle={handleSourceToggle}
                                                />
                                            }

                                            <Box
                                                className="right-panel-header-wrapper"
                                                sx={{
                                                    // border: `1px solid ${SEAFOAM_TEAL}`,
                                                    border: `1px solid rgba(0,0,0,0.78)`,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
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

                                        </Box>
                                        <Box
                                            sx={{
                                                maxHeight: 'calc(100% - 6rem)',
                                                display: rightPanelOptions[0] === 'effects' ? "flex" : "none"
                                            }}
                                        >
                                            <Box id={'reactDiagramsPedalboardWrapper'}>
                                                <ReactDiagramsPedalboard
                                                    universalSources={universalSources}
                                                    // currentChain={currentChain}
                                                    currentChain={switchSourceChain()}
                                                    sourceName={fxRadioValue}
                                                    width={parentSize.width}
                                                    height={parentSize.height}
                                                    handleCheckedEffectsToShow={handleCheckedFXToShow}
                                                    getNewFX={getNewFX}
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: rightPanelOptions[0] !== 'effects' ? "flex" : "none" }}>
                                            <NotesQuickDash
                                                isChuckRunning={isChuckRunning}
                                                featuresLegendData={[]}
                                                universalSources={universalSources.current}
                                                handleSourceToggle={handleSourceToggle}
                                                vizSource={vizSource}
                                                currentBeatSynthCount={currentBeatSynthCount}
                                                handleMasterFastestRate={handleMasterRateUpdate}
                                                handleOsc1RateUpdate={handleOsc1RateUpdate}
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
                                                currentBeatCountToDisplay={currentBeatCountToDisplayRef.current}
                                                currentNumerCountColToDisplay={currentNumerCountColToDisplayRef.current}
                                                currentDenomCount={currentDenomCountRef.current}
                                                currentPatternCount={currentPatternCountRef.current}
                                                exitEditMode={exitEditMode}
                                                clickHeatmapCell={clickHeatmapCell}
                                                isInPatternEditMode={isInPatternEditMode.current}
                                                handleLatestSamples={handleLatestSamples}
                                                handleLatestNotes={handleLatestNotes}
                                                mTFreqs={mTFreqs}
                                                mTMidiNums={mTMidiNums}
                                                updateKeyScaleChord={updateKeyScaleChord}
                                                handleAssignPatternNumber={handleAssignPatternNumber}
                                                doAutoAssignPatternNumber={doAutoAssignPatternNum}
                                                setStkValues={setStkValues}
                                                tune={tune}
                                                currentMicroTonalScale={currentMicroTonalScale}
                                                setFxKnobsCount={setFxKnobsCount}
                                                doUpdateBabylonKey={doUpdateBabylonKey}
                                                babylonKey={babylonKeyRef.current}
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
                                                currentSelectedCell={currentSelectedCell}
                                                octaveMax={selectedChordScaleOctaveRange.octaveMax}
                                                octaveMin={selectedChordScaleOctaveRange.octaveMin}
                                                uploadedBlob={uploadedBlob}
                                                getMeydaData={getMeydaData}
                                                clickedFile={clickedFile}
                                                chuckRef={chuckRef}
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
                                            <Box sx={{ top: "54px", width: "100%", height: "100%", boxSizing: "border-box", padding: "0px", margin: "0px" }}>
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
                                                {
                                                    <Box
                                                        sx={{
                                                            display: "inline-flex",
                                                            flexDirection: "row",
                                                            position: "absolute",
                                                            cursor: "pointer",
                                                            bottom: "40px",
                                                            right: "180px",
                                                            zIndex: "99999",
                                                            pointerEvents: "auto",
                                                            whiteSpace: "nowrap",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {


                                                            ((selectedSTKs.length > 0 ||
                                                                selectedEffects.length > 0) ||
                                                                currentScreen.current !== "synth") &&




                                                            <ArrowBack
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
                                                            />}</Box>
                                                }

                                                {/* {
                                    (selectedSTKs.length > 0 ||
                                    selectedEffects.length > 0) || currentScreen.current !== "synth" ?
                                    <Button 
                                        sx={{
                                            position: "absolute",
                                            top: "32px",
                                            left: "330px",
                        
                                            cursor: "pointer",
                                            zIndex: "99999",
                                        }}
                                        onClick={handleManageFX}>Manage Effects</Button> : <></>}                                */}
                                                {isManagingEffects &&
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: "60px",
                                                            left: "32px",
                                                            width: "300px",
                                                            backgroundColor: "rgba(0,0,0,0.78)",
                                                            padding: "8px",
                                                            borderRadius: "4px",
                                                            zIndex: "9999",
                                                            display: "flex",
                                                            flexDirection: "row",
                                                        }}
                                                    >
                                                        <Box
                                                            id={`activeSTKsManagerDropdown`}
                                                            sx={{
                                                                width: "140px",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                marginRight: "4px",
                                                                overflowY: "auto",
                                                                maxHeight: "200px",
                                                                boxSizing: "border-box",
                                                                backgroundColor: "rgba(28,28,28,0.78)",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    fontSize: "12px",
                                                                    color: "rgba(255,255,255,0.78)",
                                                                    backgroundColor: OBERHEIM_TEAL,
                                                                    padding: "4px",
                                                                    borderRadius: "4px",
                                                                    // marginBottom: "4px",
                                                                }}
                                                                key={`manage_fx_wrapper_STKS_${stkValues.length}`}
                                                            >Instruments</Box>
                                                            {
                                                                stkValues.length > 0 && [...new Set(stkValues.map(i => i.label))].map((stkBtn: any) => {
                                                                    return <Button
                                                                        onClick={handleViewSTK}
                                                                        value={`${stkBtn}`}
                                                                        key={`singleSelectSTK_${stkBtn}`}
                                                                        sx={{
                                                                            backgroundColor: CORDUROY_RUST,
                                                                            color: "white",
                                                                            fontSize: "14px",
                                                                            marginTop: "4px",
                                                                            marginBottom: "4px",
                                                                        }}
                                                                    >
                                                                        {stkBtn}
                                                                    </Button>
                                                                })
                                                            }
                                                        </Box>
                                                        <Box
                                                            id={`activeEffectsManagerDropdown`}
                                                            sx={{
                                                                width: "140px",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                            }}
                                                        >
                                                            <Box
                                                                style={{
                                                                    fontSize: "12px",
                                                                    color: "rgba(255,255,255,0.78)",
                                                                    backgroundColor: OBERHEIM_TEAL,
                                                                    padding: "4px",
                                                                    borderRadius: "4px",
                                                                }}
                                                                key={`manage_fx_wrapper_effects_${checkedEffectsListHook.length}`}
                                                            >Effects</Box>
                                                            {
                                                                selectedEffects.length > 0 && <Box
                                                                    key={`${selectedEffects.toString()}`}
                                                                    sx={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        overflowY: "auto",
                                                                        maxHeight: "200px",
                                                                        width: "100%",
                                                                        // padding: "4px",
                                                                        boxSizing: "border-box",
                                                                        backgroundColor: "rgba(28,28,28,0.78)",
                                                                        borderRadius: "4px",
                                                                    }}>

                                                                    {
                                                                        selectedEffects.map((effect: any) => (
                                                                            <Button
                                                                                key={`checkedEffect_${effect}`}
                                                                                onClick={handleViewEffect}
                                                                                value={
                                                                                    effect.split("_")[1]
                                                                                }
                                                                                sx={{
                                                                                    backgroundColor: NEON_PINK,
                                                                                    color: "white",
                                                                                    fontSize: "14px",
                                                                                    marginTop: "4px",
                                                                                    marginBottom: "4px",
                                                                                }}
                                                                            >

                                                                                {effect}
                                                                            </Button>
                                                                        ))
                                                                    }
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </Box>
                                                }
                                                {babylonReady && babylonReady && <BabylonLayer
                                                    currentBeatCountToDisplay={currentBeatCountToDisplayRef.current}
                                                    bpm={bpm}
                                                    handleUpdateSliderVal={handleUpdateSliderVal}
                                                    fxKnobsCount={fxKnobsCount}


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
                                <Box
                                    // sx={{
                                    //     borderRight: `solid 1px ${HERITAGE_GOLD}`
                                    // }}
                                    id="leftContainerWrapper">
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
                                        currentBeatCountToDisplay={currentBeatCountToDisplayRef.current}
                                        // currentNumerCountColToDisplay={currentNumerCountColToDisplay}
                                        // currentDenomCount={currentDenomCount}
                                        currentPatternCount={currentPatternCountRef.current}
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
                                                    // setBeatsNumerator={setBeatsNumerator} 
                                                    // setBeatsDenominator={setBeatsDenominator} 
                                                    // setNumeratorSignature={setNumeratorSignature} 
                                                    // setDenominatorSignature={setDenominatorSignature} 
                                                    handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                                                    handleChangeBeatsDenominator={handleChangeBeatsDenominator}
                                                />
                                            </Box>
                                        )
                                    }

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
                        // top: '64px',
                        bottom: '0px',
                        left: '140px',
                        // background: 'yellow',
                        pointerEvents: keysVisible ? 'none' : 'auto'
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

                    {clickedBegin && chuckHook && <AudioMixer
                        universalSources={universalSources.current}
                        handleUpdateVolumes={handleUpdateVolumes}
                        handleUpdatePans={handleUpdatePans}
                        handleToggleMutes={handleToggleMutes}
                        handleToggleSolos={handleToggleSolos}
                        expandedMixerSource={expandedMixerSource}
                        setExpandedMixerSource={setExpandedMixerSource}
                    />}

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
                        pressedNotes={pressedNotes.current}
                    />
                </Box>
            </Box>
        </Box>
    )
};

