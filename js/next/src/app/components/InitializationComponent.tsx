"use client"

import { Box, Button, SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect, useRef, useMemo } from 'react'
import BabylonLayer from './BabylonLayer';
import { Chuck } from 'webchuck';
import { Note } from "tonal";
import moogGMPresets from '../../utils/moogGMPresets';
import MoogGrandmotherEffects from '../../interfaces/audioInterfaces';
import { useTheme } from '@mui/material/styles';
import { FXOption, STKOption, fxGroupOptions } from '../../utils/fixedOptionsDropdownData';
import { getSTK1Preset, getFX1Preset } from '@/utils/presetsHelper';
import FXRouting from './FXRouting';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useForm } from "react-hook-form";
import { convertEnvSetting } from '@/utils/FXHelpers/winFuncEnvHelper';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BPMModule from './BPMModule';
import ResponsiveAppBar from './ResponsiveAppBar';
import {Tune} from '../../tune';
import Keyboard from './Keyboard'
import { useMingusData } from '@/hooks/useMingusData';
import { notefreqchart } from '../../utils//notefreqchart';
import KeyboardControls from './KeyboardControls';
import Meyda from 'meyda';
import { AllSoundSourcesObject } from '@/utils/interfaces';
import { convertFrequency } from '@/utils/siteHelpers';
import { defaultNoteVals, delayADefault, delayLDefault, delayDefault, ellipticDefault, expDelayDefault, expEnvDefault, korg35Default, modulateDefault, powerADSRDefault, spectacleDefault, winFuncEnvDefault, wpDiodeDefault } from '@/utils/FXHelpers/helperDefaults';
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
import { NAVY, PALE_BLUE, ROYALBLUE } from '@/utils/constants';
import serverFilesToPreload from '../../utils/serverFilesToPreload';
import axios from 'axios';
import MingusPopup from './MingusPopup';

import WaveSurferPlayer from '@wavesurfer/react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions';
import WaveSurfer from 'wavesurfer.js';
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { InferenceClient } from '@huggingface/inference';



export default function InitializationComponent() {
    
    const [programIsOn, setProgramIsOn] = useState<boolean>(false);
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const [babylonReady, setBabylonReady] = useState(false);
    const [formats, setFormats] = React.useState<any>(() => []); // ** UNCLEAR VARNAME => WHAT ARE FORMATS?
    // const [currNotes, setCurrNotes] = useState<any>([]);
    const currNotes = useRef<any>([0]);
    const currNotesHash = useRef<any>({}); // ** MISSING TYPE (THIS ONE WOULD BE USEFUL)
    const [notesNeedUpdate, setNotesNeedUpdate] = useState<boolean>(false);
    const [midiAccessHook, setMidiAccessHook] = useState<any>({}); // do we do anything with this value?
    const [wavesurfer, setWavesurfer] = useState<any>(null)
    const [isPlaying, setIsPlaying] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    
    // NEEDS WORK (after samples)...
    const [resetNotes, setResetNotes] = useState<any>([0]);
    
    
    const lastMidiNote: any = useRef('');
    lastMidiNote.current = '';
    const lastMidiCommand: any = useRef('');

    // const stkOn = useRef<any>();
    // const stkPolyKeyOff = useRef<any>(false);

    const [keysVisible, setKeysVisible] = useState(false);
    const [keysReady, setKeysReady] = useState(false);
    const [vizSource, setVizSource] = useState<string>('');

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
        chord: 'M',
    });

    const [rightPanelOptions, setRightPanelOptions] = useState<any>(['effects', 'pattern']);

    const finalFxCode = useRef<any>({
        osc1: "",
        osc2: "",
        stk1: "",
        audioin: "",
        sampler: ""
    })

    const moogGrandmotherEffects = useRef<MoogGrandmotherEffects | any>(moogGMPresets);


    const [fxKnobsCount, setFxKnobsCount] = useState<number>(0);
    const [fxRoutingNeedsUpdate, setFxRoutingNeedsUpdate] = useState<number>(0);
    const [fXChainKey, setFXChainKey] = useState<string>('');
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [chuckUpdateNeeded, setChuckUpdateNeeded] = useState(false);
    const [bpm, setBpm] = useState<number>(120.00);
    const [beatsNumerator, setBeatsNumerator] = useState(4);
    const [beatsDenominator, setBeatsDenominator] = useState(4);
    const { register, handleSubmit, watch } = useForm();
    const currentHeatmapXY = useRef<any>();
    // currentHeatmapXY.current = { };
    const [clickedBegin, setClickedBegin] = useState<any>(false);

    const [stkValues, setStkValues] = useState<STKOption[]>([]);

    const [midiBPMClockIncoming, setMidiBPMClockIncoming] = useState<any>([]);

    const [fxRadioValue, setFxRadioValue] = React.useState<any>('Osc1'); // ** NEEDS UI RETHINKING
    const [analysisSourceRadioValue, setAnalysisSourceRadioValue] = React.useState<any>('Osc');
    const [showBPM, setShowBPM] = useState<boolean>(true);
    const [showSTKManager, setShowSTKManager] = useState<boolean>(false);

    const [octave, setOctave] = useState('4'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioKey, setAudioKey] = useState('C'); // ** THESE SHOULD EXIST AS NEW OBJECT
    
    const [babylonKey, setBabylonKey] = useState<string>('babylonKey_');
    // const [recreateBabylon, setRecreateBabylon] = useState<boolean>(false)
    const [clickFXChain, setClickFXChain] = useState<boolean>(false);


    const [activeSTKs, setActiveSTKs] = useState<any[]>([]);

    const currentNotesDownDisplay = useRef<Array<number | any>>([]);
    const currentNotesKeyValDownDisplay = useRef<Array<number | any>>([]);
    const [arpeggiatorOn, setArpeggiatorOn] = useState<number>(0);
    const [stkArpeggiatorOn, setStkArpeggiatorOn] = useState<number>(0);

    const [cellSubdivisions, setCellSubdivisions] = useState<number>(1);

    const [hideCircularArpBtnsHook, setHideCircularArpBtnsHook] = useState<boolean>(false);

    const doReturnToSynth = useRef<boolean>(false);
    const virtualKeyMapDown = useRef<string>("");
    const virtualKeyMapUp = useRef<string>("");

    const [hasHexKeys, setHasHexKeys] = useState<boolean>(false);

    const [tune, setTune] = useState<any>(null);
    const [mingusKeyboardData, setMingusKeyboardData] = useState<any>([]);
    const [mingusChordsData, setMingusChordsData] = useState<any>([]);
    const [keyBoard, setKeyBoard] = useState<any>();

    const [currentChain, setCurrentChain] = useState<any>();

    // const [stk1Code, setStk1Code] = useState<string>('');
    // const [osc1Code, setOsc1Code] = useState<string>('');

    const [meydaNeedsUpdate, setMeydaNeedsUpdate] = useState<boolean>(false);

    const [lastFileUpload, setLastFileUpload] = useState<any>('');

    const uploadedBlob = useRef<any>();

    const [numeratorSignature, setNumeratorSignature] = useState(4);
    const [denominatorSignature, setDenominatorSignature] = useState(4);

    const [osc1NoteNum, setOsc1NoteNum] = useState<number>(0);

    const [currentBeatCount, setCurrentBeatCount] = useState<number>(0);
    const [currentBeatSynthCount, setCurrentBeatSynthCount] = useState<number>(0);
    const [currentBeatCountToDisplay, setCurrentBeatCountToDisplay] = useState<number>(0);
    const [currentNumerCount, setCurrentNumerCount] = useState<number>(0);
    const [currentNumerCountColToDisplay, setCurrentNumerCountColToDisplay] = useState<number>(0);

    const [currentDenomCount, setCurrentDenomCount] = useState<number>(1);
    const [currentPatternCount, setCurrentPatternCount] = useState<number>(0);
    const [patternsPerCycle, setPatternsPerCycle] = useState<number>(4);
    const [patternCount, setPatternCount] = useState<number>(0);

    const [masterFastestRate, setMasterFastestRate] = useState<number>(4);

    const [estimatedMidiClockBpm, setEstimatedMidiClockBpm] = useState<any>();

    const [keysFullscreen, setKeysFullscreen] = useState<boolean>(false);
    const masterPatternsRef = useRef<any>({
        // 1: {},
        // 2: {},
        // 3: {},
        // 4: {},
        // 5: {},
        // 6: {},
        // 7: {},
    });
    const parentDivRef = useRef<any>(null);
    const [masterPatternsHashHook, setPatternsHashHook] = useState<any>({});
    const [masterPatternsHashUpdated, setPatternsHashUpdated] = useState<boolean>(false);

    // const [currentMidiMsg, setCurrentMidiMsg] = useState<any>({ data: [0, 0, 0] });
    const [mTFreqs, setMTFreqs] = useState<any>([]);
    const [mTMidiNums, setMTMidiNums] = useState<any>([]);
    // const [inFileAnalysisMode, setInFileAnalysisMode] = useState<boolean>(false);

    const [chuckMsg, setChuckMsg] = useState<string>('');

    const isInPatternEditMode = useRef<boolean>(false);
    isInPatternEditMode.current = isInPatternEditMode.current || false;

    const [filesToProcessArrayHook, setFilesToProcessArrayHook] = useState<any>(
        [
            {
                filename: "DR-55Kick.wav",
                data: [],
            },
            {
                filename: "DR-55Snare.wav",
                data: [],
            },
            {
                filename: "DR-55Hat.wav",
                data: [],
            },
            {
                filename: "Conga.wav",
                data: [],
            }
        ]
    );

    const load = async () => {
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
          if (messageRef.current) messageRef.current.innerHTML = message;
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });
        setLoaded(true);
        setIsLoading(false);
    };

    // const [featuresLegendParam, setFeaturesLegendParam] = useState<string>('rms');
    // const [featuresLegendData, setFeaturesLegendData] = useState<any>([]);
    // const [centroid, setCentroid] = useState<any>([
    //     { source: "", value: "" }
    // ]);
    // const [flux, setFlux] = useState<any>([{ source: "", value: "" }]);
    // const [rMS, setRMS] = useState<any>({ source: "", value: "" });
    // const [mFCCEnergy, setMFCCEnergy] = useState<any>({ source: "", value: "" });
    // const [mFCCVals, setMFCCVals] = useState<any>({ source: "", value: [] });
    // const [rollOff50, setRollOff50] = useState<any>({ source: "", value: "" });
    // const [rollOff85, setRollOff85] = useState<any>({ source: "", value: "" });
    // const [chroma, setChroma] = useState<any>({ source: "", value: [] });
    // const [xCross, setXCross] = useState<any>({ source: "", value: "" });
    // const [dct, setDCT] = useState<any>({ source: "", value: [] });
    // const [featureFreq, setFeatureFreq] = useState<any>({ source: "", value: "" });
    // const [featureGain, setFeatureGain] = useState<any>({ source: "", value: "" });
    // const [kurtosis, setKurtosis] = useState<any>({ source: "", value: "" });
    // const [sFM, setSFM] = useState<any>({ source: "", value: "" });
    // const [sampleRate, setSampleRate] = useState<any>(0);
    // const [amplitude, setAmplitude] = useState<any>({ source: "", value: "" });
    // const [timeNow, setTimeNow] = useState<any>(0);
    const [hold, setHold] = useState<any>(0);
    const [showLoader, setShowLoader] = useState<boolean>(false);

    const wavesurferRef: WaveSurfer = useRef(null);

    const regionStart = useRef<any>();
    const regionEnd = useRef<any>();
    const totalDuration = useRef<any>();
    const clippedDuration = useRef<any>();


    function readArrayBufferAsFile(arrayBuffer: ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        const fileContent = decoder.decode(arrayBuffer);
        return fileContent;
      }


    async function uploadAudioFile(blob: Blob, name: string) {
        if (!name.endsWith('.wav')) {
            console.error('Only WAV files are supported ', name, "BBLLOOBB: ", blob);
            return;
          }
        
          const formData = new FormData();
          formData.append('file', blob, name);
      
        const response = await fetch('http://localhost:8000/analyze_audio/', {
          method: 'POST',
          body: formData,
        });
      
        const result = await response.json();
        console.log(result);
    }

      
    async function clipAudio() {
        const start: number | any = regionStart.current; 
        const end: number | any = regionEnd.current;
                
        if (!start ||!end ) return;
        
        const ffmpeg = ffmpegRef.current;
        
        const audioFile = filesToProcess.current[filesToProcess.current.length - 1];
                
        console.log("sanity audiofile: ", audioFile);

        try {
          // Write the audio file to the FFmpeg wasm file system
          await ffmpeg.writeFile(
            audioFile.name,
            audioFile.data
          );
          
          

          // Run the FFmpeg command
          await ffmpeg.exec([
            '-i', audioFile.name,
            '-ss', start.toString(), // Start time
            '-t', (end - start).toString(), // Duration
            '-c', 'copy',
            '-f','wav',
            // 'clipped_audio.mp3'
            `clipped_${audioFile.name}`
          ]);
      
          // Read the clipped audio file
          const clippedAudio = (await ffmpeg.readFile(`clipped_${audioFile.name}`, 'binary')) as Uint8Array;
          
          console.log("CLIPPED AUDIO... ", clippedAudio);
      
          if (clippedAudio) {
            // Create a blob from the clipped audio
            const blob = new Blob([clippedAudio], { type: 'audio/wav' });
            
            // Create a URL for the clipped audio
            const url = URL.createObjectURL(blob);

            const response = await fetch(URL.createObjectURL(blob));
            const arrayBuffer = await response.arrayBuffer();

            const newClippedFile = readArrayBufferAsFile(arrayBuffer);
            
            uploadAudioFile(blob, `clipped_${audioFile.name}`);


            


//             const HF_API_TOKEN = process.env.NEXT_PUBLIC_HUGGING_INFERENCE_API_KEY

//             console.log('sanity newly clipped file: ', newClippedFile);
// //             const formData = new FormData();
// //             formData.append("inputs", newClippedFile);
          
//             const apiToken: any = process.env.NEXT_PUBLIC_HUGGING_INFERENCE_API_KEY;

// const client = new InferenceClient(apiToken);


// const responseHf = client.audioToAudio({
//     model: "ddPn08/onsets-and-frames", 
//     inputs: blob,
//   });


                // console.log('Separated stems$$$$$$$$$$$$$$$$:', responseHf);
 
            
//             if (!response.ok) {
//               throw new Error(`Hugging Face API error: ${response.statusText}`);
//             }











            // filesToProcess.current.push({
            //     data: newClippedFile,
            //     name: `${audioFile.name}_clipped.mp3`
            // });

            const newMeydaData = getMeydaData(arrayBuffer);
            console.log("NEW MEYDA DATA: ", lastFileUploadMeydaData.current);
            
            
            // Save the clipped audio or play it
            const a = document.createElement('a');
            a.href = url;
            a.download = `clipped_${audioFile.name}`;
            a.click();
          } else {
            console.error('Error: clipped audio is null or undefined');
          }
        } catch (error) {
          console.error('Error clipping audio:', error);
        }
    }
  



    const onReady = (ws: any) => {
        console.log("WAVESURFER READY: ", ws);
        if (ws) {        
            const region = ws.plugins[0].addRegion({
                start: 0,
                end: 10,
                color: 'rgba(0, 255, 0, 0.5)',
            });
    
            region.on("update", (e: any) => {
                console.log('Region clicked!', e);
            });
    
            region.on("update-end", () => {
                regionStart.current = region.start;
                regionEnd.current = region.end;
                totalDuration.current = region.totalDuration;
                clippedDuration.current = region.end - region.start;
                // clipAudio(region.start, region.end);
                console.log('Finished dragging/resizing!', region);
            });

            region.on("play", function(this: Region) {
                console.log('PLAY WORKS!!', this as any);
                setIsPlaying(true);
            });
    
            // console.log("Region listeners (for info):", region);
        
        }
        wavesurferRef.current = ws;

        if ((wavesurferRef.current !== wavesurfer) && wavesurferRef.current && !wavesurfer) {
            setWavesurfer(wavesurferRef.current)
        }
        // setIsPlaying(false)
    }
    
    const onPlayPause = () => {
        console.log("YOOO!!! ", wavesurferRef.current);
        wavesurferRef.current && wavesurferRef.current.playPause()
    }

    



    const [updated, markUpdated] = useUpdatedNeeded();
    const universalSources = useRef<Sources | undefined>();
    const [isAudioView, setIsAudioView] = React.useState<boolean>(false);
    const [microtonalScale, setMicrotonalScale] = useState<string>('');
    const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState<boolean>(true);
    const filesChuckToDac = useRef<string>('');
    const filesGenericCodeString = useRef<any>('');
    const currentScreen = useRef<string>('synth');
    const [checkedFXUpdating, setCheckedFXUpdating] = useState<boolean>(false);
    const [showFX, setShowFX] = useState<boolean>(false);
    const stkKnobValsRef = useRef<STKOption[]>([]);
    const currentStkTypeVar = useRef<string>('') // # sign separates type#var
    const currentEffectType = useRef<string>('')
    const filesToProcess = useRef<Array<any>>([
        {
            filename: "DR-55Kick.wav",
            data: [],
        },
        {
            filename: "DR-55Snare.wav",
            data: [],
        },
        {
            filename: "DR-55Hat.wav",
            data: [],
        },
        {
            filename: "Conga.wav",
            data: [],
        }
    ]);
    const fxValsRef = useRef<FXOption[]>([]);
    const checkedFXList = useRef<FXOption[]>([]);
    const [checkedEffectsListHook, setCheckedEffectsListHook] = useState<Array<any>>([]);
    const winFuncEnvFinalHelper = useRef<any>(winFuncEnvDefault);
    const powerADSRFinalHelper = useRef<any>(powerADSRDefault);
    const expEnvFinalHelper = useRef<any>(expEnvDefault);
    const wpDiodeLadderFinalHelper = useRef<any>(wpDiodeDefault);
    const wpKorg35FinalHelper = useRef<any>(korg35Default);
    const modulateFinalHelper = useRef<any>(modulateDefault);
    const delayFinalHelper = useRef<any>(delayDefault);
    const delayAFinalHelper = useRef<any>(delayADefault);
    const delayLFinalHelper = useRef<any>(delayLDefault);
    const expDelayFinalHelper = useRef<any>(expDelayDefault);
    const ellipticFinalHelper = useRef<any>(ellipticDefault);
    const spectacleFinalHelper = useRef<any>(spectacleDefault);
    const chuckRef = useRef<Chuck>();
    const quarterLengthEstimate = useRef<number>(0);
    const quarterLengthNumPriorEstimates = useRef<number>(0);
    quarterLengthEstimate.current = 0;
    quarterLengthNumPriorEstimates.current = 0;
    const bpmSmoothingTooLarge = useRef(0);
    const bpmSmoothingIsFine = useRef(0);
    bpmSmoothingTooLarge.current = 0;
    bpmSmoothingIsFine.current = 0;
    const visibleFXKnobs = useRef<any>();
    const testArrBuffFile = useRef<any>();

    // currentFX are the ones we are actively editing
    const currentFX = useRef<any>();


    // const headerDict = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Headers': 'Content-Type',
    // }
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

    interface NoteHzAndNum {
        isRest: boolean,
        midiHz?: number;
        midiNum?: number;
        fileItemNum?: any;
        volume: number;
    }

    // NEEDS WORK!!!!
    const notesToAssign = useRef<NoteHzAndNum[]>([
        {
            isRest: false,
            midiHz: 0.0,
            midiNum: 0,
            fileItemNum: 1,
            volume: 0.5,
        },
        {
            isRest: true,
            midiHz: 0.0,
            midiNum: 0,
            fileItemNum: 1,
            volume: 0.5,
        },
        {
            isRest: true,
            midiHz: 0.0,
            midiNum: 0,
            fileItemNum: 1,
            volume: 0.5,
        },
        {
            isRest: true,
            midiHz: 0.0,
            midiNum: 0,
            fileItemNum: 1,
            volume: 0.5,
        }
    ]);

    const midiAccess = useRef<WebMidi.MIDIAccess>();

    const resetHeatmapCell = useRef<boolean>();
    resetHeatmapCell.current = false;


    useEffect(() => {

        let isMounted = true;
        // const bC: number = parseInt(chuckMsg.match(/\d+/)?.[0] || "0", 10);
        const parsedNumbers = chuckMsg.match(/\d+/g) || [];  // Ensure it's always an array
        const bC = parsedNumbers.length > 0  
            ? parseInt(parsedNumbers[parsedNumbers.length - 1], 10)  // Use last number if available
            : currentBeatCountToDisplay;  // Keep previous value if no valid number found
        
        console.log("BC: ", bC);
        console.log("chuckMsg: ", chuckMsg);

        const beatDisplay = Math.floor(bC % (masterFastestRate * numeratorSignature)) + 1;
        const numerCount = Math.floor(bC / (masterFastestRate * numeratorSignature)) % numeratorSignature + 1;
        const denomCount = Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature)) % denominatorSignature + 1;
        const patternCount = Math.floor(Math.floor(bC / (masterFastestRate * numeratorSignature * denominatorSignature * patternsPerCycle))) % patternsPerCycle;
        
        console.log("Beat display: ", beatDisplay);

        setCurrentBeatCountToDisplay(beatDisplay);
        setCurrentNumerCountColToDisplay(numerCount);
        setCurrentDenomCount(denomCount);
        setCurrentPatternCount(patternCount);
        
        return () => {
            isMounted = false;
        }
    }, [chuckMsg]);

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


    const fillHashSlot = (x: number, y: number, z: number, inst: string) => {
        // console.log("Boom")
        if (!masterPatternsRef.current[`${z}`]) {
            masterPatternsRef.current[`${z}`] = {};
        }

        let col;
        if (z === 9) {
            col = "white"
        } else if (z === 8) {
            col = "black"
        } else if (z === 7) {
            col = "yellow"
        } else if (z === 6) {
            col = "red"
        } else if (z === 5) {
            col = "pink"
        } else if (z === 4) {
            col = "brown"
        } else if (z === 3) {
            col = "limegreen"
        } else if (z === 2) {
            col = "aqua"
        } else if (z === 1) {
            col = "maroon"
        } else {
            col = "blue"
        }

        // masterPatternsRef.current[`${z}`][`${x}`] = {};
        masterPatternsRef.current[`${z}`][`${x}`] = masterPatternsRef.current[`${z}`][`${x}`] 
            ?  masterPatternsRef.current[`${z}`][`${x}`] 
            // : (x % masterFastestRate < 1) ? {
            : (x === 0 ) ? {
            on: true,
            note: mTFreqs[x + (x * y) + (x * y * z)] || 0.0,
            noteHz: mTMidiNums[x + (x * y) + (x * y * z)] || 0.0,
            velocity: 0.9,
            color: col,
            fileNums: [2],
            subdivisions: cellSubdivisions
        } : (x === 2) ? {
            on: false,
            note: mTFreqs[x + (x * y) + (x * y * z)] || 0.0,
            noteHz: mTMidiNums[x + (x * y) + (x * y * z)] || 0.0,
            velocity: 0.9,
            color: col,
            fileNums: [0],
            subdivisions: cellSubdivisions
        } : {
            on: false,
            note: mTFreqs[x + (x * y) + (x * y * z)] || 0.0,
            noteHz: mTMidiNums[x + (x * y) + (x * y * z)] || 0.0,
            velocity: 0.9,
            color: col,
            fileNums: [9999],
            subdivisions: cellSubdivisions
        };    
    }

    useEffect(() => {
        for (let x = 1; x < (numeratorSignature * masterFastestRate) + 1; x++) {
            for (let y = 1; y < denominatorSignature + 1; y++) {
                for (let z = 1; z < (9); z++) {
                    if (z % 5 === 0) {
                        // console.log("Z MORE THAN OR EQUAL TO 5 ... x: ", x, "y: ", y, "z: ", z);
                        // assign osc pattern values below
                        fillHashSlot(x, y, z, `osc1`);
                    }
                    else if (z % 6 === 0) {
                        // console.log("Z MORE THAN OR EQUAL TO 5 ... x: ", x, "y: ", y, "z: ", z);
                        // assign osc pattern values below
                        fillHashSlot(x, y, z, `osc2`);
                    }
                    else if (z % 7 === 0) {
                        // console.log("Z MORE THAN OR EQUAL TO 5 ... x: ", x, "y: ", y, "z: ", z);
                        // assign osc pattern values below
                        fillHashSlot(x, y, z, `stk1`);
                    }
                    else if (z % 8 === 0) {
                        // console.log("Z MORE THAN OR EQUAL TO 5 ... x: ", x, "y: ", y, "z: ", z);
                        // assign osc pattern values below
                        fillHashSlot(x, y, z, `audioin`);
                    }
                    else {
                        // console.log("Z LESS THAN 5 ... x: ", x, "y: ", y, "z: ", z);
                        // assign sample pattern values below
                        fillHashSlot(x, y, z, `sample`);
                    }
                }
            }
        }
        setPatternsHashHook(masterPatternsRef.current);
        setPatternsHashUpdated(true);
        return () => {
        };
    }, [numeratorSignature, denominatorSignature, mTMidiNums]);

    const allOctaveMidiFreqs = useRef<any>({});
    allOctaveMidiFreqs.current = {};

    const selectRef: any = React.useCallback((selectedMicrotone: string, i: any) => {
        if (selectedMicrotone) {
            console.log('&&&selected microtone: ', selectedMicrotone);
        }
        if (i) {
            console.log('&&&selected microtone::: what is i???? ', i);
        }
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
        // console.log(
        //     'HEYO CHECK STATE??? ', state
        // );
        isInPatternEditMode.current = true;
    }

    const handleMasterRateUpdate = async () => {
        const fastestRate = Math.max(...Object.values(currentNoteVals).map((i) => i[0]));
        
        console.log("WHAT IS FASTEST RATE??? ", masterFastestRate);
        
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

    const lastFileUploadMeydaData = useRef<any>([])




    const getMeydaData = (fileData: ArrayBuffer) => {
        // WE DOOOO WANT TO USE OFFLINE CONTEXT FOR FILE ANALYSIS (not realtime)
        Promise.resolve(fileData).then((arrayBuffer) => {
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

                // const meydaFileArray = lastFileUploadMeydaData.current.map((i: any) => i[featuresLegendParam.toLowerCase()]);

                // for (var i in meydaFileArray) {
                //     indexedFileFeatureArray.current[i] = { 'date': ((parseFloat(i))), 'close': parseFloat(meydaFileArray[i]) };
                // }
                // console.log("BADABOOM! ", indexedFileFeatureArray.current);
                // setMeydaNeedsUpdate(true)
                // setFeaturesLegendData([]);
            });
    }

    const onSubmit = async (files: any) => {
        if (files.length === 0) return;
        const file = files.file[0];
        const fileDataBuffer: any = await file.arrayBuffer();
        const fileData: any = new Uint8Array(fileDataBuffer);
        const blob = new Blob([fileDataBuffer], { type: "audio/wav" });
        if (blob && !uploadedBlob.current) {
            uploadedBlob.current = blob;
        }
        testArrBuffFile.current = fileData;

        const fileBlob = new File([blob], `${file.name.replace(' ', '_')}`, { type: "audio/wav" });
        let arrayBuffer;
        const fileReader = new FileReader();
        fileReader.onload = async function (event: any) {
            arrayBuffer = event.target.result;
            const formattedName = file.name.replaceAll(' ', '_').replaceAll('-', '');
            if (filesToProcess.current.map((i: any) => i.name).indexOf(formattedName) === -1) {
                filesToProcess.current.push({ 'name': formattedName, 'data': fileData, 'processed': false })
                // tk look here
                setFilesToProcessArrayHook((x: any) => [...x, { 'filename': formattedName, 'data': fileData, 'processed': false }])
            }
            await getMeydaData(arrayBuffer);
            if (chuckHook) {
                setChuckUpdateNeeded(true);
            }
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
    }, [microtonalScale]);

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

    const initialNodes = useRef<any>();
    const initialEdges = useRef<any>();
    initialNodes.current = initialNodesDefaults && initialNodesDefaults;

    initialEdges.current = initialEdgesDefaults && initialEdgesDefaults;

    const keysAndTuneDone = useRef<boolean>();

    keysAndTuneDone.current = keysAndTuneDone.current || false;

    useEffect(() => {

        load();
       // if (tune || keysAndTuneDone.current === true) return;
        keysAndTuneDone.current = true;
        let isMounted = true;

        const allFx: any = [];

        fxGroupOptions.map((i: any) => {
            if (allFx.indexOf(i.effects) === -1) {
                allFx.push(i.effects);
            }
        });

        // console.log("DOES ALLFX DO WHAT WE WANT? ", allFx.flat().map((i:any)=>i));
        // const indexADSRExtra = allFx.flat().filter((i: any) => i.effectLabel === "ADSR");
        // console.log("WTF ALL FX??? ", allFx, "CHECKED: ", checkedFXList.current);
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

                // console.log("check inst here: ", defaultSources.stk1.instruments && Object.values(defaultSources.stk1.instruments).filter((i:any) => i.On));
                if (!universalSources.current) {
                    // console.log("HOW MANY TIMES ARE WE HERE>?? ", universalSources.current)
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

    }, []);

    // useEffect(() => {
    //     console.log("CURRENT HEATMAP X AND Y HERE... ", currentHeatmapXY);
    //     setIsInPatternEditMode(true);
    // }, [currentHeatmapXY]);

    // CHANGE THIS USEEFFECT TO A FUNCTION!
    useEffect(() => {
        let isMountd = true;
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
            updateCurrentFXScreen();
            setNeedsUpdate(true);
        }
        if (initialNodes.current && initialEdges.current) {
            setInitialNodesHook(initialNodes.current.filter((i: any) => i));
            setInitialEdgesHook(initialEdges.current.filter((i: any) => i));
        }
        return () => {
            isMountd = false;
        }
    }, [checkedFXUpdating]);

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
        console.log("yup knobs: ", knobVals)
        stkKnobValsRef.current = [];
        stkKnobValsRef.current.push(...knobVals);
        if (!stkKnobValsRef.current[stkKnobValsRef.current.length - 1]) {
            
            visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(moogGrandmotherEffects.current.length);
            updateCurrentFXScreen();
            setNeedsUpdate(true);
            return;
        }
        currentStkTypeVar.current = (`${getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type}#${getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).var}`)
        if (universalSources.current) {
            console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value));
            const stk: any = universalSources.current.stk1
            visibleFXKnobs.current = Object.values(getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).presets).map((i: any) => [i.label, i]);
            const instType = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type
            currentFX.current = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value);
            if (universalSources.current.stk1.instruments) {
                Object.entries(universalSources.current.stk1.instruments).map((i: [string, EffectsSettings]) => {
                    if (i[0] === instType) {
                        i[1].Visible = true;
                        i[1].On = true;
                        if (i[1].presets) i[1].presets = Object.values(getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).presets);
                    } else {
                        i[1].Visible = false
                    }
                })
            }
            setFxKnobsCount(visibleFXKnobs.current.length);
            currentFX.current = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value);


            currentScreen.current = `stk_${currentFX.current.type}`;

            if (Object.values(stk.instruments).filter((inst: any) => inst.On).length > 0) {

                stk.instruments[`${getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type}`].Type = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type; ///// LOOK HERE!!!!
                stk.instruments[`${getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type}`].VarName = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).var;
                stk.instruments[`${getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).type}`].On = true;

                currentFX.current = stkKnobValsRef.current;

                const knobsCountTemp = Object.values(stk.instruments).filter((i: any) => i.Visible).map((i: any) => i.presets).length;

                setFxKnobsCount(knobsCountTemp);
                updateCurrentFXScreen();
            }
        }
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

    const handleReturnToSynth = () => {
        if (currentScreen.current === "stk") {
        } else if (currentScreen.current !== "fx") {
            doReturnToSynth.current = !doReturnToSynth.current;
            currentScreen.current = "synth";
        }
    }

    const updateCurrentFXScreen = () => {
        if (visibleFXKnobs.current && currentScreen.current.includes('stk') || currentScreen.current === 'fx_' || doReturnToSynth.current === true) {
            setFxKnobsCount(visibleFXKnobs.current.length);
        } else if (currentScreen.current === 'synth') {
            currentFX.current = [];
            currentFX.current = moogGrandmotherEffects.current;
            visibleFXKnobs.current = visibleFXKnobs.current || Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(visibleFXKnobs.current.length);
        }
        setBabylonKey(`${babylonKey}1`);
    };

    const updateCheckedFXList = async (e: any) => {

        console.log("CHECK E ", e.target.id);

        currentEffectType.current = e.target.id && e.target.id;

        if (checkedFXList.current.indexOf(e.target.value) === -1) {
            checkedFXList.current.push(e.target.value);
            setCheckedEffectsListHook((x: any) => [...x, e.target.value]);
        } else {
            doReturnToSynth.current = true;
            console.log("returning to synth in the else...");
            const index = checkedFXList.current.indexOf(e.target.value);
            checkedFXList.current.splice(index, 1);
            setCheckedEffectsListHook((x: any) => x.filter((y: any) => y !== e.target.value && y));

            currentFX.current = moogGrandmotherEffects.current;
            visibleFXKnobs.current = visibleFXKnobs.current || Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            setFxKnobsCount(visibleFXKnobs.current.length);


            // // console.log("look good 2? ",  Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]))
            // visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
            // currentFX.current = moogGrandmotherEffects.current;
            // setFxKnobsCount(visibleFXKnobs.current.length);
        }

        universalSources.current &&
            universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources] &&
            Object.values(universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources]).length > 0 &&
            Object.values(universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects).map((effect: any) => {
                if (effect.VarName === e.target.value && effect.On !== true) effect.On = true;
                else if (effect.VarName === e.target.value && effect.On === true) effect.On = false;
            })


        console.log("Checked List Current in Update: ", checkedFXList.current);

        // tk
        console.log("Nodes and edges updated successfully.");

        setCheckedFXUpdating(!checkedFXUpdating);
        updateFlowNodesAndEdges();
        setFxKnobsCount(visibleFXKnobs.current.length);
        return;
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


    }

    useEffect(() => {
        let isMounted = true;
        setFxKnobsCount(Object.keys(moogGrandmotherEffects.current).length);
        return () => {
            isMounted = false;
        };
    }, [moogGrandmotherEffects])


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

    const [notesAddedDetails, setNotesAddedDetails] = useState<any>([])

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

    }

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
    }

    function compare(a: any, b: any) {
        if (a.midiNote < b.midiNote) {
            return -1;
        }
        if (a.midiNote > b.midiNote) {
            return 1;
        }
        return 0;
    };






    const workerRef = useRef<Worker | null>(null);
    /// >>> in useEffect(() => {



    useEffect(() => {

        let isMounted = true;


        // let analyzer: Meyda.MeydaAnalyzer | null = null;

        // if (!chuckRef.current?.context) return;

        // const audioContext = chuckRef.current.context;

        // // Initialize worker
        // workerRef.current = new Worker("/workers/meydaWorker.ts");
        // analyzer = Meyda.createMeydaAnalyzer({
        //     audioContext,
        //     source: chuckRef.current,
        //     bufferSize: 512,
        //     featureExtractors: [
        //         "rms",
        //         "mfcc",
        //         "chroma",
        //         "zcr",
        //         "energy",
        //         "amplitudeSpectrum",
        //         "powerSpectrum",
        //         "spectralCentroid",
        //         "spectralFlatness",
        //         "spectralRolloff",
        //         // "spectralFlux",
        //         "spectralSlope",
        //         "spectralFlatness",
        //         "spectralSpread",
        //         "spectralSkewness",
        //         "spectralKurtosis",
        //         "spectralCrest",
        //         "loudness",
        //         "perceptualSpread",
        //         "perceptualSharpness",
        //         "complexSpectrum",
        //         "buffer"
        //     ],
        //     callback: (features: any) => {
        //         if (features && workerRef.current) {
        //             workerRef.current.postMessage(features);
        //         }
        //     },
        // });
        // analyzer.start();

        // // Receive processed features from the worker
        // workerRef.current.onmessage = (e) => {
        //     console.log("Processed Features from Worker:", e.data);
        // };
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
            // audioContext.destination.connect(analyzer);
            // processor.connect(audioContext.destination);


            //chuckRef.current && chuckRef.current.connect(analyzer);  // Connect the source to the analyzer
            analyzer.connect(audioContext.destination);  // Directly connect the analyzer to the destination
            return () => {
                // if (isMounted) {
                workerRef.current?.terminate();
                processor.disconnect();
                // isMounted = false;
                // }
            };

        })
        // .catch((err: any) => {
        //     console.error("Failed to load AudioWorkletModule:", err);
        // });

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
    }, [chuckUpdateNeeded]) // if there are problems, switch back to [${chuckUpdateNeeded}]


    // NEEDS WORK...
    const NOTES_SET_REF = useRef<any>();


    useEffect(() => {
        const subscription = watch(() => handleSubmit(onSubmit)())
        console.log('SUBSCRIPTION: ', subscription); // what is this for???qw2e3
        return () => {
            subscription.unsubscribe();
        }
    }, [handleSubmit, watch, register]);

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
        // Object.entries(currNotesHash.current).map((note: any) => {
        //     chuckRef.current && chuckRef.current.setAssociativeFloatArrayValue(`na_${getConvertedRadio(fxRadioValue)}`, "innerNotes", parseFloat(note[1]));
        // });


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
            // if (resetHeatmapCell.current === true) {
            //     masterPatternsRef.current[currentHeatmapXY.x][currentHeatmapXY.y].note = 0;
            //     masterPatternsRef.current[currentHeatmapXY.x][currentHeatmapXY.y].noteHz = 0;
            //     resetHeatmapCell.current = false;
            // }

            console.log("WHAT IS CURR NOTES HASH? ", currNotesHash.current);

            const baseHashCurrNotes: any = Object.values(currNotesHash.current)[0];

            console.log("dang shit and fuck: ", currentHeatmapXY.current);

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

    const initialRun = useRef<boolean>(true);

    const lastNotesPlayed = useRef<number[]>([]);

    

    const getSourceFX = (thisSource: string) => {
        if (thisSource === "stk") thisSource = "stk1";
        console.log("AYYY ", thisSource);
        console.log("OYYY ", getConvertedRadio(fxRadioValue));
        console.log("UYYY ", universalSources.current);
        console.log("DAFUQ? ", universalSources.current && universalSources.current[getConvertedRadio(thisSource) as keyof Sources])
        console.log("SANITY??? ", universalSources.current && 
            universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources] && 
            universalSources.current[getConvertedRadio(fxRadioValue) as keyof Sources].effects);
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



    const activeSTKDeclarations = useRef<string>('');
    const activeSTKSettings = useRef<string>('');
    const activeSTKPlayOn = useRef<string>('');
    const activeSTKPlayOff = useRef<string>('');


    const runChuck = async () => {
        if (typeof window === 'undefined') return;

        console.log("good so far w/ aChuck... ")
        console.log("running chuck now... ", chuckUpdateNeeded);

        console.log("NOTES SET REF??? ", NOTES_SET_REF.current);

        // setResetNotes(NOTES_SET_REF.current)

        if (chuckRef.current) {
            // SHOULD WE PICK UP HERE & FOCUS ON REFACTORING AS A GENERAL (TO GET CURRENT RADIOFX SELECTED)?
            const getOsc1FX = universalSources.current && Object.values(universalSources.current.osc1.effects).filter(i => i.On);

            const getSamplerFX = universalSources.current && Object.values(universalSources.current.sampler.effects).filter(i => i.On);

            const getAudioInFX = universalSources.current && Object.values(universalSources.current.audioin.effects).filter(i => i.On);

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

            // console.log("HEYO CHECK MASTER PATTERNS BEFORE CHUCK START: ", masterPatternsRef.current);
            // console.log("heyo rate update sanity (mfr): ", masterFastestRate);
            // console.log("bpm sanity: ", 60000/bpm);
            // console.log('what is sig chain? ', signalChain);

            console.log("what are stk instruments? ", universalSources.current && universalSources.current.stk1.instruments && universalSources.current.stk1.instruments)
            // const shredCount = chuckHook && await chuckHook.runCode(`Machine.numShreds();`);

            // console.log("Shred Count: ", shredCount);
            console.log("WHAT ARE PATTERNS? ", masterPatternsRef.current)
            console.log("what is alloctavemidifreqs? ", allOctaveMidiFreqs.current);
            console.log("what is masterpatternref??? ", Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.note > 0 ? i.note : 999.0 ) ) );


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


            console.log("WHAT IS MISSING HERE?? ", Object.values(masterPatternsRef.current).map((i: any) => Object.values(i[1])))

            const newChuckCode = `
                "" => global string currentSrc;

                // Global variables and events
                global Event playNote;
                global Event startMeasure;
                global Event playAudioIn;

                0 => global int arpeggiatorOn;

                ${(60000 / bpm) / masterFastestRate * 2} => float beatInt;

                (beatInt)::ms => dur beat;
                ${numeratorSignature} => global int numeratorSignature;
                ${denominatorSignature} => global int denominatorSignature;

                beat * numeratorSignature => dur whole;
                whole * denominatorSignature => dur measure;



                // Number of voices for polyphony
                8 => global int numVoices;
                global float NOTES_SET[0];
                ${currentNoteVals.osc1[0]} => global int fastestRateUpdate;

                SawOsc saw1[numVoices];
                SawOsc saw2[numVoices];
                LPF lpf[numVoices];
                ADSR adsr[numVoices];
                Dyno limiter[numVoices];
                NRev rev[numVoices];
                Noise noiseSource[numVoices];
                Gain pitchLfo[numVoices];
                Gain filterLfo[numVoices];
                TriOsc tri1[numVoices], tri2[numVoices];
                SqrOsc sqr1[numVoices], sqr2[numVoices];
                SinOsc SinLfo[numVoices];
                SawOsc SawLfo[numVoices];
                SqrOsc SqrLfo[numVoices];

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


                // BEGIN SYNTH VOICE DEFAULTS
                class SynthVoice extends Chugraph
                {
                    int id;
                    // Constructor to initialize id
                    fun void setId(int newId) {
                        newId => id;
                    }

                    saw1[id] => lpf[id] => adsr[id] => limiter[id] => outlet;
                    saw2[id] => lpf[id];
                    noiseSource[id] => lpf[id];
                    0 => noiseSource[id].gain;

                    SinLfo[id] => pitchLfo[id] => blackhole;
                    SinLfo[id] => filterLfo[id] => blackhole;

                    fun void SetLfoFreq(float frequency) 
                    {
                        frequency => SinLfo[id].freq => SawLfo[id].freq => SqrLfo[id].freq;
                    }
                    6.0 => SetLfoFreq; // what is this???
                    0.05 => filterLfo[id].gain;
                    0.05 => pitchLfo[id].gain;            
                    2 => saw1[id].sync => saw2[id].sync => tri1[id].sync => tri2[id].sync => sqr1[id].sync => sqr2[id].sync;

                    pitchLfo[id] => saw1[id];
                    pitchLfo[id] => saw2[id];
                    pitchLfo[id] => tri1[id];
                    pitchLfo[id] => tri2[id];
                    pitchLfo[id] => sqr1[id];
                    pitchLfo[id] => sqr2[id];

                    ${moogGrandmotherEffects.current.limiterAttack.value}::ms => limiter[id].attackTime; // can we hardcode these???
                    ${moogGrandmotherEffects.current.limiterThreshold.value} => limiter[id].thresh; // can we hardcode these???

                    
                    // rethink volume when creating a master panel....
                    0.06/numVoices => saw1[id].gain => saw2[id].gain;
                    0.28/numVoices => tri1[id].gain => tri2[id].gain;
                    0.08/numVoices => sqr1[id].gain => sqr2[id].gain;

                    ${moogGrandmotherEffects.current.cutoff.value} => float filterCutoff; // again... why hardcode this???
                    filterCutoff => lpf[id].freq;

                    // moogGrandmotherEffects["offset"] => float offset;
                    ${moogGrandmotherEffects.current.offset.value} => float offset; // why are we hardcoding these???
                    880 => float filterEnv;
                    1.0 => float osc2Detune;
                    ${moogGrandmotherEffects.current.oscOffset.value} => float oscOffset;

                    fun void SetOsc1Freq(float frequency)
                    {
                        frequency => tri1[id].freq => sqr1[id].freq => saw1[id].freq; 
                    }

                    fun void SetOsc2Freq(float frequency)
                    {
                        frequency => tri2[id].freq => sqr2[id].freq => saw2[id].freq; 
                    }

                    fun void keyOn(float noteNumber)
                    {
                     
                        Std.mtof(offset + noteNumber) => SetOsc1Freq;
                        Std.mtof(offset + noteNumber + oscOffset) - osc2Detune => SetOsc2Freq;
                        1 => adsr[id].keyOn;
                        ${moogGrandmotherEffects.current.adsrAttack.value}::ms => adsr[id].attackTime; // FIX NUM HERE!!!
                        ${moogGrandmotherEffects.current.adsrDecay.value}::ms => adsr[id].decayTime; // FIX NUM HERE!!!
                        ${moogGrandmotherEffects.current.adsrSustain.value} => adsr[id].sustainLevel; // FIX NUM HERE!!!
                        ${moogGrandmotherEffects.current.adsrRelease.value}::ms => adsr[id].releaseTime; // FIX NUM HERE!!!

     
                        spork ~ filterEnvelope();
                        me.yield();
                    }

                    fun void ChooseOsc1(int oscType)
                    {
                        if(oscType == 0)
                        {
                            tri1[id] =< lpf[id];
                            saw1[id] =< lpf[id];
                            sqr1[id] =< lpf[id];
                        }
                        if(oscType == 1)
                        {
                            tri1[id] => lpf[id];
                            saw1[id] =< lpf[id];
                            sqr1[id] =< lpf[id];
                        }
                        if(oscType == 2)
                        {
                            tri1[id] =< lpf[id];
                            saw1[id] => lpf[id];
                            sqr1[id] =< lpf[id];
                        }
                        if(oscType == 3)
                        {
                            tri1[id] =< lpf[id];
                            saw1[id] =< lpf[id];
                            sqr1[id] => lpf[id];
                        }
                    }
                    fun void ChooseOsc2(int oscType)
                    {
                        if(oscType == 0)
                        {
                            tri2[id] =< lpf[id];
                            saw2[id] =< lpf[id];
                            sqr2[id] =< lpf[id];
                        }
                        if(oscType == 1)
                        {
                            tri2[id] => lpf[id];
                            saw2[id] =< lpf[id];
                            sqr2[id] =< lpf[id];
                        }
                        if(oscType == 2)
                        {
                            tri2[id] =< lpf[id];
                            saw2[id] => lpf[id];
                            sqr2[id] =< lpf[id];
                        }
                        if(oscType == 3)
                        {
                            tri2[id] =< lpf[id];
                            saw2[id] =< lpf[id];
                            sqr2[id] => lpf[id];
                        }
                        if(oscType == 4)
                        {
                            tri2[id] =< lpf[id];
                            saw2[id] =< lpf[id];
                            sqr2[id] =< lpf[id];
                        }
                    }
                    fun void ChooseLfo(int oscType)
                    {
                        if(oscType == 0)
                        {
                            SinLfo[id] =< filterLfo[id];
                            SinLfo[id] =< pitchLfo[id];
                            SawLfo[id] =< filterLfo[id];
                            SawLfo[id] =< pitchLfo[id];
                            SqrLfo[id] =< filterLfo[id];
                            SqrLfo[id] =< pitchLfo[id];
                        }
                        if(oscType == 1)
                        {
                            SinLfo[id] => filterLfo[id];
                            SinLfo[id] => pitchLfo[id];
                            SawLfo[id] =< filterLfo[id];
                            SawLfo[id] =< pitchLfo[id];
                            SqrLfo[id] =< filterLfo[id];
                            SqrLfo[id] =< pitchLfo[id];
                        }
                        if(oscType == 2)
                        {
                            SinLfo[id] =< filterLfo[id];
                            SinLfo[id] =< pitchLfo[id];
                            SawLfo[id] => filterLfo[id];
                            SawLfo[id] => pitchLfo[id];
                            SqrLfo[id] =< filterLfo[id];
                            SqrLfo[id] =< pitchLfo[id];
                        }
                        if(oscType == 3)
                        {
                            SinLfo[id] =< filterLfo[id];
                            SinLfo[id] =< pitchLfo[id];
                            SawLfo[id] =< filterLfo[id];
                            SawLfo[id] =< pitchLfo[id];
                            SqrLfo[id] => filterLfo[id];
                            SqrLfo[id] => pitchLfo[id];
                        }
                    }
                    fun void keyOff(int noteNumber) {
                        noteNumber => adsr[id].keyOff;
                        // Wait for the envelope to fully release
                        while (adsr[id].state() != 0) {
                            adsr[id].releaseTime() => now;
                        }
                    }
                    fun void filterEnvelope()
                    {
                        filterCutoff => float startFreq;
                        while((adsr[id].state() != 0 && adsr[id].value() == 0) == false)
                        {
                            1 => adsr[id].keyOn;
                            Std.fabs((filterEnv * adsr[id].value()) + startFreq + filterLfo[id].last()) => lpf[id].freq;                     
                            adsr[id].releaseTime() => now;
                            1 => adsr[id].keyOff;
                            me.yield();
                        }
                        // me.exit();
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
                            (whole)/numVoices - (now % (whole)/numVoices) => now;
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
                        20 * (amount / 100) + 0.3 => lpf[id].Q;
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
                        84 * (amount / 100) => pitchLfo[id].gain;
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
                        5000 * (amount / 100) => filterLfo[id].gain;
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
                        1.0 * (amount / 100) => noiseSource[id].gain;
                    }            
                }
                SynthVoice voice;

                for (0 => int i; i < numVoices; i++) {
                    ${moogGrandmotherEffects.current.cutoff.value} => voice.cutoff;
                    ${moogGrandmotherEffects.current.rez.value} => voice.rez;
                    ${moogGrandmotherEffects.current.env.value} => voice.env;
                    Std.ftoi(${moogGrandmotherEffects.current.oscType1.value}) => voice.ChooseOsc1;
                    Std.ftoi(${moogGrandmotherEffects.current.oscType2.value}) => voice.ChooseOsc2;
                    ${moogGrandmotherEffects.current.detune.value} => voice.detune;
                    Std.ftoi(${moogGrandmotherEffects.current.oscOffset.value}) => voice.oscOffset;
                    ${moogGrandmotherEffects.current.cutoffMod.value} => voice.cutoffMod;
                    ${moogGrandmotherEffects.current.pitchMod.value} => voice.pitchMod;
                    Std.ftoi(${moogGrandmotherEffects.current.lfoVoice.value}) => voice.ChooseLfo; // Lfo Voc
                    // 0.5 => voice.filterLfo.gain;
                    ${moogGrandmotherEffects.current.offset.value} => voice.offset;
                    ${moogGrandmotherEffects.current.lfoFreq.value} => voice.filterEnv;
                    ${moogGrandmotherEffects.current.noise.value} => voice.noise;
                }

                voice => Osc1_EffectsChain osc1_FxChain => Dyno osc1_Dyno => dac;
                0.6 => voice.gain;












                LisaTrigger lisaTrigger; 
                GrainStretch grain;
                Tape t;
                RandomReverse rr; 
                Reich rei;
                AsymptopicChopper achop;
                NRev rev_audioin;
                NRev rev_sampler;


                class AudioIn_SpecialEffectsChain extends Chugraph
                {
                    inlet => achop => LPF lpf_audioin => outlet;
                    0.8 => rev_audioin.mix;

                    t.gain(1.0);
                    t.delayLength(whole / (numeratorSignature / denominatorSignature));
                    t.loop(1);

                    grain.stretch(1);
                    grain.rate(0.1);
                    grain.length(whole/(numeratorSignature * denominatorSignature));
                    grain.grains(8);

                    rr.setInfluence(1.0);
                    rr.listen(1);

                    achop.listen(1);
                    achop.length(whole);
                    achop.minimumLength(whole/(numeratorSignature * denominatorSignature));

                    lisaTrigger.listen(1);
                    lisaTrigger.length(whole);
                    lisaTrigger.minimumLength(whole/(numeratorSignature * denominatorSignature));


                }
                AudioIn_SpecialEffectsChain audioin_SpecialFxChain;




                class GrainStretch extends Chugraph {

                    LiSa mic[2];
                    ADSR env;

                    inlet => mic[0] => env => outlet;
                    inlet => mic[1] => env => outlet;

                    0 => int m_stretching;
                    32 => int m_grains;
                    1.0 => float m_rate;

                    1.0::second => dur m_bufferLength;
                    maxLength(8::second);

                    fun void stretch(int s) {
                        if (s == 1) {
                            1 => m_stretching;
                            spork ~ stretching();
                        }
                        else {
                            0 => m_stretching;
                        }
                    }

                    fun void maxLength(dur m) {
                        mic[0].duration(m);
                        mic[1].duration(m);
                    }

                    fun void length(dur l) {
                        l => m_bufferLength;
                    }

                    fun void rate(float r) {
                        r => m_rate;
                    }

                    fun void grains(int g) {
                        g => m_grains;
                    }

                    fun void stretching() {
                        0 => int idx;

                        recordVoice(mic[idx], m_bufferLength);

                        // switches between audio buffers, ensuring a constant processed signal
                        while (m_stretching) {
                            spork ~ recordVoice(mic[(idx + 1) % 2], m_bufferLength);
                            (idx + 1) % 2 => idx;
                            stretchVoice(mic[idx], m_bufferLength, m_rate, m_grains);
                        }
                    }

                    fun void recordVoice(LiSa mic, dur bufferLength) {
                        mic.clear();
                        mic.recPos(0::samp);
                        mic.record(1);
                        bufferLength => now;
                        mic.record(0);
                    }

                    // all the sound stuff we're doing
                    fun void stretchVoice(LiSa mic, dur duration, float rate, int grains) {
                        (duration * 1.0/rate)/grains => dur grain;
                        grain/32.0 => dur grainEnv;
                        grain * 0.5 => dur halfGrain;

                        // for some reason if you try to put a sample
                        // at a fraction of samp, it will silence ChucK
                        // but not crash it?
                        if (halfGrain < samp) {
             
                            return;
                        }

                        // envelope parameters
                        env.attackTime(grainEnv);
                        env.releaseTime(grainEnv);

                        halfGrain/samp => float halfGrainSamples;
                        ((duration/samp)$int)/grains=> int sampleIncrement;

                        mic.play(1);

                        // bulk of the time stretching
                        for (0 => int i; i < grains; i++) {
                            mic.playPos((i * sampleIncrement)::samp);
                            (i * sampleIncrement)::samp + grain => dur end;

                            // only fade if there will be no discontinuity errors
                            if (duration > end) {
                                env.keyOn();
                                halfGrain => now;
                                env.keyOff();
                                halfGrain - grainEnv => now;
                            }
                            else {
                                (grain - (end - duration)) => dur endGrain;
                                env.keyOn();
                                endGrain * 0.5 => now;
                                env.keyOff();
                                endGrain * 0.5 - grainEnv => now;
                            }
                        }
                        mic.play(0);
                    }
                }

                class Tape extends Chugraph {
                    inlet => NRev nRA => Delay del => ADSR env => Gain g => outlet;
                    g => del;

                    nRA.mix(0.1);

                    env.set(0::ms, 100::ms, 0.75, 10::ms);
                    delayLength(whole);

                    0 => int m_loop;

                    fun void delayLength(dur d) {
                        del.max(d);
                        del.delay(d);
                    }

                    fun void loop(int l) {
                        if (l) {
                            1 => m_loop;
                            spork ~ looping();
                        }
                        if (l == 0) {
                            0 => m_loop;
                        }
                    }

                    fun void looping() {
                        env.keyOn();
                        while (m_loop) {
                            1::samp => now;
                        }
                        env.keyOff();
                    }
                }

                class RandomReverse extends Chugraph {

                    inlet => LiSa mic => Gain r => outlet;
                    inlet => Gain g => ADSR env => outlet;

                    0 => int m_listen;
                    2::second => dur m_maxBufferLength;
                    2::second => dur m_bufferLength;
                    0.5 => float m_influence;
                    100::ms => dur m_envDuration;
                    5::second => dur m_maxTimeBetween;

                    // envelope
                    env.attackTime(m_envDuration);
                    env.releaseTime(m_envDuration);
                    env.keyOn();

                    fun void listen(int l) {
                        if (l == 1) {
                            1 => m_listen;
                            spork ~ listening();
                        }
                        if (l == 0) {
                            0 => m_listen;
                        }
                    }

                    fun void setInfluence(float i) {
                        i => m_influence;
                    }

                    fun void setReverseGain(float g) {
                        r.gain(g);
                    }

                    fun void setMaxBufferLength(dur l) {
                        l => m_maxBufferLength;
                    }

                    fun void listening() {
                        mic.duration(m_maxBufferLength);
                        while (m_listen) {
                            if (m_influence >= 0.01) {
                                Math.random2f(0.1, m_influence * 0.75) => float scale;
                                scale * m_bufferLength => dur bufferLength;
                                record(bufferLength);
                                playInReverse(bufferLength);
                                m_maxTimeBetween * Math.fabs(1.0 - m_influence) => now;
                            }
                            1::samp => now;
                        }
                    }

                    fun void record(dur bufferLength) {
                        mic.playPos(0::samp);
                        mic.record(1);
                        bufferLength => now;
                        mic.record(0);
                    }

                    fun void playInReverse(dur bufferLength) {
                        if (bufferLength < m_envDuration) {
                            m_envDuration * 2 => bufferLength;
                        }
                        env.keyOff();
                        mic.play(1);
                        mic.playPos(bufferLength);
                        mic.rate(-1.0);
                        mic.rampUp(m_envDuration);
                        bufferLength - m_envDuration => now;
                        mic.rampDown(m_envDuration);
                        env.keyOn();
                        m_envDuration => now;
                        mic.play(0);
                    }
                }

                class Reich extends Chugraph {

                    inlet => LiSa mic => outlet;

                    0 => int m_record;
                    0 => int m_play;

                    0::ms => dur m_length;
                    4     => int m_voices;
                    1.001 => float m_speed;

                    false => int m_bi;
                    false => int m_random;
                    false => int m_spread;

                    maxBufferLength(8::second);

                    fun void maxBufferLength(dur l) {
                        mic.duration(l);
                    }

                    fun void record(int r) {
                        if (r == 1) {
                            1 => m_record;
                            spork ~ recording();
                        }
                        if (r == 0) {
                            0 => m_record;
                        }
                    }

                    fun void recording() {
                        mic.clear();

                        mic.recPos(0::samp);
                        mic.record(1);

                        while (m_record == 1) {
                            1::samp => now;
                        }

                        mic.record(0);
                        mic.recPos() => m_length;
                    }

                    fun void play(int p) {
                        if (p == 1) {
                            1 => m_play;
                            spork ~ playing();
                        }
                        if (p == 0) {
                            0 => m_play;
                        }

                    }

                    fun void playing() {
                        m_voices => int numVoices;
                        for (int i; i < numVoices; i++) {
                            0::ms => dur pos;
                            if (m_random) {
                                Math.random2f(0.5,1.0) * m_length => pos;
                            } else if (m_spread) {
                                i/(numVoices$float) * m_length => pos;
                            }
                            mic.playPos(i, pos);

                            // set parameters
                            mic.bi(i, m_bi);
                            mic.rate(i, (m_speed - 1.0) * i + 1);
                            mic.loop(i, 1);
                            mic.loopEnd(i, m_length);

                            mic.play(i, 1);
                        }
                        while (m_play == 1) {
                            samp => now;
                        }
                        for (int i; i < numVoices; i++) {
                            mic.play(i, 0);
                        }
                    }

                    // spreads the initial voices randomly
                    // throughout the record buffer
                    fun void random(int r) {
                        r => m_random;
                    }

                    // spreads the initial voices equally
                    // throughout the record buffer
                    fun void spread(int r) {
                        r => m_spread;
                    }

                    // plays a voice backwards when reaching
                    // the end of the buffer, otherwise
                    // it will loop from the beginning
                    fun void bi(int b) {
                        b => m_bi;
                    }

                    // the number of voices to be played back
                    fun void voices(int n) {
                        n => m_voices;
                    }

                    // speed offset for the voices
                    fun void speed(float s) {
                        s => m_speed;
                    }
                }

                class LisaTrigger extends Chugraph {
                    inlet => LiSa mic => outlet;
                    mic.bi(1);

                    0 => int m_listen;
                    whole => dur m_bufferLength;
                    whole => dur m_maxBufferLength;
                    whole / (numeratorSignature) => dur m_minimumLength;
                    m_minimumLength * 4 => dur m_envLength;

                    fun void listen(int lstn) {
                        if (lstn == 1) {
                            1 => m_listen;
                            spork ~ listening();
                        }
                        if (lstn == 0) {
                            0 => m_listen;
                        }
                    }

                    fun void length(dur l) {
                        l => m_bufferLength;
                    }

                    fun void maxLength(dur l) {
                        l => m_maxBufferLength;
                    }

                    fun void minimumLength(dur l) {
                        m_minimumLength;
                        l => m_envLength;
                    }

                    fun void listening() {
                        mic.duration(m_maxBufferLength);
                        while (m_listen) {
                            mic.clear();
                            mic.recPos(0::samp);
                            mic.record(1);
                            m_bufferLength => now;
                            mic.record(0);
                            lisaTrig(m_bufferLength);
                        }
                    }

                    fun void lisaTrig(dur bufferLength) {
                        dur bufferStart;
                        m_bufferLength => dur bufferLength;
                        mic.play(1);
                        while (bufferLength > m_minimumLength) {
                            bufferLength * 0.5 => bufferLength;
                            0::ms => bufferStart;
                            mic.playPos(bufferLength);
                            mic.rampUp(m_envLength * 2);
                            mic.rate(-1.25);
                            bufferLength - m_envLength => now;
                            mic.rampDown(m_envLength * 2);
                            m_envLength * 2 => now;
                        }
                        mic.play(0);
                    }
                }

                class AsymptopicChopper extends Chugraph {
                    inlet => LiSa mic => outlet;
                    0 => int m_listen;
                    3::second => dur m_bufferLength;
                    10::second => dur m_maxBufferLength;
                    100::ms => dur m_minimumLength;
                    m_minimumLength * 0.5 => dur m_envLength;
                    fun void listen(int lstn) {
                        if (lstn == 1) {
                            1 => m_listen;
                            spork ~ listening();
                        }
                        if (lstn == 0) {
                            0 => m_listen;
                        }
                    }
                    fun void length(dur l) {
                        l => m_bufferLength;
                    }
                    fun void maxLength(dur l) {
                        l => m_maxBufferLength;
                    }
                    fun void minimumLength(dur l) {
                        m_minimumLength;
                        l * 0.5 => m_envLength;
                    }
                    fun void listening() {
                        mic.duration(m_maxBufferLength);
                        while (m_listen) {
                            mic.clear();
                            mic.recPos(0::samp);
                            mic.record(1);
                            m_bufferLength => now;
                            mic.record(0);
                            asymptopChop(m_bufferLength);
                        }
                    }
                    fun void asymptopChop(dur bufferLength) {
                        dur bufferStart;
                        m_bufferLength => dur bufferLength;
                        mic.play(1);
                        while (bufferLength > m_minimumLength) {
                            Math.random2(0, 1) => int which;
                            bufferLength * 0.5 => bufferLength;
                            bufferLength * which => bufferStart;
                            mic.playPos(bufferStart);
                            mic.rampUp(m_envLength);
                            bufferLength - m_envLength => now;
                            mic.rampDown(m_envLength);
                            m_envLength => now;
                        }
                        mic.play(0);
                    }
                }

                AudioIn_EffectsChain audioin_FxChain;


                adc => audioin_SpecialFxChain => audioin_FxChain => Dyno audInDyno => dac;


            




                // // SAMPLER
                // ////////////////////////////////////////////////////////////////
                fun void handlePlayMeasure(int tickCount) {
                    string files[4]; // Specify size

                    me.dir() + "${filesToProcess.current[0].filename}" => files[0];
                    me.dir() + "${filesToProcess.current[1].filename}" => files[1];
                    me.dir() + "${filesToProcess.current[2].filename}" => files[2];
                    me.dir() + "${filesToProcess.current[3].filename}" => files[3];

                    (fastestTickCounter % (numeratorSignature * denominatorSignature)) + 1 % fastestRateUpdate => int masterTick;


                    [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => i.fileNums.length > 0 ? `[${i.fileNums}]` : `['999.0']` ) )}] @=> int testArr2[][]; 

                    [${Object.values(masterPatternsRef.current).map((i: any) =>  Object.values(i).map( (i:any) => parseFloat(i.note) > 0 ?  parseFloat(i.note) : `999.0` ) )}] @=> float testNotesArr2[]; 


                    [${mTFreqs.filter((f: any) => Math.round(f) < 880).length > 0 ? mTFreqs.filter((f: any) => Math.round(f) < 880) : `0.0`}] @=> float allFreqs[];


                    int recurringTickCount;

                    if (tickCount > ${numeratorSignature * masterFastestRate * denominatorSignature}) {
                        tickCount % ${numeratorSignature * masterFastestRate * denominatorSignature} => recurringTickCount;
                    } else {
                        tickCount => recurringTickCount;
                    }







                    STK_EffectsChain stk_FxChain;



                    ${activeSTKDeclarations.current}

                    ${activeSTKSettings.current}


                    if (recurringTickCount >= testArr2.size()) return; // Prevent out-of-bounds access
                    
                    
                        for (0 => int x; x < testArr2[recurringTickCount].size(); x++) {
                            0 => buffers[x].pos;
                            if (testArr2[recurringTickCount][0] != 999.0 && (testArr2[recurringTickCount][x] < files.size())) {
                                files[testArr2[recurringTickCount][x]] => buffers[x].read;
                            }

                            // Calculate the exact time for this note within the measure
                            (recurringTickCount * (whole / ${masterFastestRate})) => dur noteTimeOffset;

                            // Wait until the correct time to play the note
                            noteTimeOffset => now;


                            // Play the note
                            tickCount % testNotesArr2.size() => int notesCount;

                            if (recurringTickCount < allFreqs.size()) {
                                allFreqs[recurringTickCount] => voice.keyOn;
                            }

                            

                            ${activeSTKPlayOn.current} 

                            buffers[x].samples() => buffers[x].pos;
                            if (testArr2[recurringTickCount][0] != 999.0) {
                                0 => buffers[x].pos;
                            } 
                            buffers[x].length() => now;
                            ${activeSTKPlayOff.current} 
                            me.yield();
                        }
                    
                    me.yield();
                }

                string result[];

                fun string[] splitString(string input, string delimiter ) {
                    int startIndex, endIndex;
                    
                    [""] @=> string strArr[];

                    while (true) {
                        input.find(delimiter, startIndex);
                        if (startIndex == -1) {
                            // No more delimiters, add the remaining string
                            result << input;
                            break;
                        }
         
                        input.substring(0, startIndex) => result[result.size()];
            
                        input.substring(startIndex + delimiter.length(), input.length()) => input;
                        <<< "FR &*&*: ", input.toString() >>>;
                        strArr << input; 
                    }
                    return strArr;
                }

                
                // REALTIME NOTES (POLY)
                ////////////////////////////////////////////////////////////////
                fun void handlePlayNote(){
                    while (false) {
                        playNote => now;
                        [${resetNotes}] @=> int nts[];

                        // 220 => testSin.freq;
                
                        
                    }
                }
               
                fun void playSTK1() {


                    me.yield();
                }
              
                now => time startTimeMeasureLoop;
                
                while(true)
                {
                    if (now >= startTimeMeasureLoop + (beat / fastestRateUpdate) ) {
                        fastestTickCounter + 1 => fastestTickCounter;
                        <<< fastestTickCounter >>>;
                        <<< "FR: !!!! ",  "${Object.values(masterPatternsRef.current).map((i: any) => Object.values(i[1]) ? Object.values(i[1]) : 'SKIP' ).toString()}" >>>;

                        
                    "${Object.values(masterPatternsRef.current).map((i: any) => Object.values(i[1]) ? Object.values(i[1]) : 'SKIP' ).toString()}" => string myString;



 



                [""] @=> string parts[];
                if (myString.length() > 0) {
                    splitString(myString, ",") @=> parts;
                } 

                // Print results
        
                    <<< "FR: HEY FUCKERZ!: ", parts.toString() >>>;









                        
                    }
                    if (now >= startTimeMeasureLoop + beat) {
                        tickCounter + 1 => tickCounter;
                        spork ~ handlePlayMeasure(tickCounter);
                        now => startTimeMeasureLoop;
                    }
                    whole / ${masterFastestRate} => now;

                }
            `;

     
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
        if (isInPatternEditMode) {
            const cellObjToEdit = masterPatternsRef.current[currentHeatmapXY.current.y][currentHeatmapXY.current.x];
            cellObjToEdit.fileNums.push(e.target.innerText);
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
        setKeyScaleChord({key: key, scale: scale, chord: chord, octaveMax: octaveMax, octaveMin: octaveMin});
        // const submitMingus = async () => {
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, { audioKey: key, audioScale: scale, octave: octaveMax }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST SCALES HERE 1# ", data);
            // return 
            handleMingusKeyboardData(data);
        });
        axios.post(
            `${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, 
            { audioChord: chord, audioKey: key }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                console.log("TEST CHORDS 1# ", data);
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

    // TIMING (BPM / SIGNATURE)
    // ========================================================
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleChangeBPM = (newBpm: number) => {
        if (newBpm) {
            setBpm(Number(newBpm));
            chuckRef.current && chuckRef.current.setInt("beatInt", 500);
        }
        setChuckUpdateNeeded(true);
    }

    const handleChangeBeatsNumerator = (newBeatsNumerator: number) => {
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
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ========================================================

    const handleShowFX = (closeOnly?: boolean) => {
        currentScreen.current = "";
        setShowFX(!showFX);
    };

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
        updateCurrentFXScreen();
        setNeedsUpdate(true);
    };


    // BE SURE TO ADD DURATION DIVISIONS (AND ALSO ELSEWHERE)
    // const playSTKOn = () => {
    //     let allSTKs: any = {}; // ALL STKs ARE STRINGS OF INSTs
    //     // try {
    //     const stkInstsHolder: [string, EffectsSettings][] | undefined = universalSources.current &&
    //         universalSources.current.stk1.instruments &&
    //         Object.entries(universalSources.current.stk1.instruments).filter((i: any) => i[1].On);

    //     console.log("insts holder??? ", stkInstsHolder);

    //     stkInstsHolder && stkInstsHolder.map((stkInsts: [string, EffectsSettings]) => {
    //         if (stkInsts[1].VarName) {
    //             // console.log("getFXOnly_var: ", stkInst.VarName);
    //             const presets: Preset[] | undefined | "" = universalSources.current &&
    //                 universalSources.current.stk1.instruments &&
    //                 universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments] &&
    //                 universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments].presets;


    //             if (presets && presets.length > 0 && stkInsts[1].VarName === "sit") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `                     
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].noteOn;  
    //                     0.01/notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         // duration * ${numeratorSignature} - (now % duration  * ${numeratorSignature} )  => now;
    //                         duration - (now % duration)  => now;
    //                         1 =>  ${stkInsts[1].VarName}[i-1].noteOff; 
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bow") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'bowPressure')[0].value} => ${stkInsts[1].VarName}[i-1].bowPressure;
    //                     ${presets.filter(p => p.name === 'bowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].bowPosition;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wg") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     // ${presets.filter(p => p.name === 'bowMotion')[0].value} => ${stkInsts[1].VarName}[i-1].bowMotion;
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'strikePosition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
    //                     ${presets.filter(p => p.name === 'gain')[0].value} => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'bowRate')[0].value} => ${stkInsts[1].VarName}[i-1].bowRate;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwbtl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "brs") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;    
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;    
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
    //                     ${presets.filter(p => p.name === 'lip')[0].value} => ${stkInsts[1].VarName}[i-1].lip;
    //                     ${presets.filter(p => p.name === 'slide')[0].value} => ${stkInsts[1].VarName}[i-1].slide;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
    //                     ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
                            
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "shak") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'energy')[0].value} => ${stkInsts[1].VarName}[i-1].energy;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'objects')[0].value} => ${stkInsts[1].VarName}[i-1].objects;
    //                     ${presets.filter(p => p.name === 'decay')[0].value} => ${stkInsts[1].VarName}[i-1].decay;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mdlbr") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'stickHardness')[0].value} => ${stkInsts[1].VarName}[i-1].stickHardness;
    //                     ${presets.filter(p => p.name === 'strikePOsition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'directGain')[0].value} => ${stkInsts[1].VarName}[i-1].directGain;
    //                     ${presets.filter(p => p.name === 'masterGain')[0].value} => ${stkInsts[1].VarName}[i-1].masterGain;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
    //                     ${presets.filter(p => p.name === 'strike')[0].value} => ${stkInsts[1].VarName}[i-1].strike;
    //                     ${presets.filter(p => p.name === 'damp')[0].value} => ${stkInsts[1].VarName}[i-1].damp;


    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "flut") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'jetDelay')[0].value} => ${stkInsts[1].VarName}[i-1].jetDelay;
    //                     ${presets.filter(p => p.name === 'jetReflection')[0].value} => ${stkInsts[1].VarName}[i-1].jetReflection;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;


    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'endReflection')[0].value} => ${stkInsts[1].VarName}[i-1].endReflection;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "clair") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;

    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;


    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "f") {
    //                 console.log("IN FRENCH HORN::: ", presets);
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "m") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'pickupPosition')[0].value} => ${stkInsts[1].VarName}[i-1].pickupPosition;
    //                     ${presets.filter(p => p.name === 'sustain')[0].value} => ${stkInsts[1].VarName}[i-1].sustain;
    //                     ${presets.filter(p => p.name === 'stretch')[0].value} => ${stkInsts[1].VarName}[i-1].stretch;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     ${presets.filter(p => p.name === 'baseLoopGain')[0].value} => ${stkInsts[1].VarName}[i-1].baseLoopGain;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "percFlut") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "man") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'bodySize')[0].value} => ${stkInsts[1].VarName}[i-1].bodySize;
    //                     ${presets.filter(p => p.name === 'pluckPos')[0].value} => ${stkInsts[1].VarName}[i-1].pluckPos;
    //                     ${presets.filter(p => p.name === 'stringDamping')[0].value} => ${stkInsts[1].VarName}[i-1].stringDamping;
    //                     ${presets.filter(p => p.name === 'stringDetune')[0].value} => ${stkInsts[1].VarName}[i-1].stringDetune;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;

    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "tubbl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 48 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwhl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'tonehole')[0].value} => ${stkInsts[1].VarName}[i-1].tonehole;
    //                     ${presets.filter(p => p.name === 'vent')[0].value} => ${stkInsts[1].VarName}[i-1].vent;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;                                

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        

    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'speak')[0].value} => ${stkInsts[1].VarName}[i-1].speak;
    //                     ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
    //                     duration - (now % duration)  => now;
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;

    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "sax") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     ${presets.filter(p => p.name === 'stiffness')[0].value} => ${stkInsts[1].VarName}[i-1].stiffness;
    //                     ${presets.filter(p => p.name === 'aperture')[0].value} => ${stkInsts[1].VarName}[i-1].aperture;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;              
    //                     ${presets.filter(p => p.name === 'blowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].blowPosition;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;                  

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;  

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;  
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bthree") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 12 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;

    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "fmVoic") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'vowel')[0].value} => ${stkInsts[1].VarName}[i-1].vowel;
    //                     ${presets.filter(p => p.name === 'spectralTilt')[0].value} => ${stkInsts[1].VarName}[i-1].spectralTilt;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             }

    //             else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") { // is this a dupe?? see above
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                                
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
                        
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                 }`;
    //             }

    //             else if (presets && presets.length > 0 && stkInsts[1].VarName === "krstl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
            
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;

    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "rod") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wur") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mog") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'filterQ')[0].value} => ${stkInsts[1].VarName}[i-1].filterQ;
    //                     ${presets.filter(p => p.name === 'filterSweepRate')[0].value} => ${stkInsts[1].VarName}[i-1].filterSweepRate;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'afterTouch')[0].value} => ${stkInsts[1].VarName}[i-1].afterTouch;
    //                     ${presets.filter(p => p.name === 'modDepth')[0].value} => ${stkInsts[1].VarName}[i-1].modDepth;
    //                     ${presets.filter(p => p.name === 'modSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].modSpeed;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hevyMetl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hnkytonk") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             }
    //             else {
    //                 console.log("why in the else??? ", stkInsts);
    //             }
    //             console.log("WHATTTT IS GOING ON? ", allSTKs);
    //             return Object.values(allSTKs);
    //             // } else if (name === "voic") { // <-- buggy ... needs another look            
    //         }
    //     });
    //     console.log("RETURNING STKS... ", Object.values(allSTKs));
    //     return Object.values(allSTKs);
    // }

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
                if (message.includes("LOG") || message.includes("FR:")) {
                    console.log("here is log... ", message);
                } else {
                    setChuckMsg(message); 
                }
            }

            setBabylonReady(true);
        })();
    }

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


    return (
        <Box 
            id={'frontendOuterWrapper'}
        >
            
            <Box id={'relativeFrontendWrapper'}>
                {/* RESPONSIVE APP BAR */}
                {chuckHook &&
                    <Box 
                        sx={{
                            position: "absolute",
                            width: "calc(100% - 140px)",
                            left: '140px'
                        }} 
                        // id="centerRoot"
                    >
                        <ResponsiveAppBar
                            selectRef={selectRef}
                            tune={tune}
                            currentMicroTonalScale={currentMicroTonalScale}
                            // handleChangeChord={handleChangeChord}
                            // handleChangeScale={handleChangeScale}
                            programIsOn={programIsOn}
                            formats={formats}
                            chuckHook={chuckHook}
                            stkFX={universalSources.current && universalSources.current.stk1.instruments && currentStkTypeVar.current && currentStkTypeVar.current[0] ? universalSources.current.stk1.instruments[currentStkTypeVar.current[0] as keyof STKInstruments] : []}
                            fxCount={checkedFXList.current.length}
                            checkedFXList={checkedFXList.current}
                            keysVisible={keysVisible}
                            isAnalysisPopupOpen={isAnalysisPopupOpen}
                            hideCircularArpBtnsHook={hideCircularArpBtnsHook}
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
                                        <Box
                                            id="waveSurferContainer"
                                            sx={{
                                                display: "block",
                                                zIndex: 9999,
                                                position: "relative",
                                                top: "0px",
                                                left: "0px",
                                                width: "calc(100% - 524px)",
                                                justifyContent: "stretch",
                                                background: "rgba(0,0,0,0.98)",
                                                
                                                // flexDirection: "column",
                                                // justifyContent: "center",
                                                // alignItems: "center",
                                                // width: "100%",
                                                // height: "100%",
                                            }}
                                        >
                                            <Button style={{zIndex: 9999}} onClick={onPlayPause}>
                                                {isPlaying ? 'Pause' : 'Play'}
                                            </Button>
                                            <Button style={{zIndex: 9999}} onClick={() => clipAudio()}>
                                                Clip
                                            </Button>
                                            <WaveSurferPlayer
                                                height={100}
                                                waveColor="#4d91ff"
                                                progressColor="#4d91ff"
                                                // url="/my-server/audio.wav"
                                                url={URL.createObjectURL(uploadedBlob.current)}
                                                onReady={onReady}
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                                onPlayPause={onPlayPause}
                                                plugins={[RegionsPlugin.create()]}
                                            />

                                        </Box>
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
                                    <p style={{lineHeight: '1.5rem', margin: '32px'}}> Build, bend, and break audio and MIDI with our revolutionary micro-DAW, featuring AI-driven audio separation, DSP sound generation, and MIDI and Hardware Control.</p>
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

                                        <Box sx={{ 
                                            // width: 'calc(100vw - 560px)', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            borderRight: '0.5px solid rgba(255,255,255,0.78)', 
                                         
                                            // marginLeft: '-6px',
                                            // position: 'absolute',
                                            // left: '400px'
                                        }}><MingusPopup 
                                            updateKeyScaleChord={updateKeyScaleChord}
                                        /> </Box>

                                        <Box
                                        
                                            ref={parentDivRef}
                                        >
                                            <Box id="rightPanelHeader">
                                                {
                                                    universalSources.current && Object.keys(universalSources.current).length > 0 &&
                                                    <GroupToggle
                                                        name={"test name"}
                                                        options={Object.keys(universalSources.current).map(i => i)}
                                                        handleSourceToggle={handleSourceToggle}
                                                    />
                                                }
                                                <br />
                                                <Box className="right-panel-header-wrapper">
                                                    <Button id='toggleSliderPanelChildren_Effects' className='right-panel-header-button' onClick={(e: any) => toggleSliderPanelChildren('effects')}>Effects View</Button>
                                                    <Button id='toggleSliderPanelChildren_Pattern' className='right-panel-header-button' onClick={(e: any) => toggleSliderPanelChildren('pattern')}>Patterns View</Button>
                                                </Box>
                                            </Box>
                                            <Box sx={{ maxHeight: 'calc(100% - 6rem)', display: rightPanelOptions[0] === 'effects' ? "flex" : "none" }}>
                                                <FXRouting
                                                    key={fXChainKey + fxRadioValue}
                                                    fxData={universalSources.current || defaultSources}
                                                    width={440}
                                                    height={440}
                                                    handleFXGroupChange={handleFXGroupChange}
                                                    updateCheckedFXList={updateCheckedFXList}
                                                    fxGroupsArrayList={fxGroupOptions}
                                                    checkedFXList={checkedFXList.current}
                                                    fxFX={[]}
                                                    handleClickName={handleClickName}
                                                    setClickFXChain={setClickFXChain}
                                                    clickFXChain={clickFXChain}
                                                    updateFXInputRadio={updateFXInputRadio}
                                                    fxRadioValue={fxRadioValue}
                                                    updateStkKnobs={updateStkKnobs}
                                                    setStkValues={setStkValues}
                                                    stkValues={stkValues}
                                                    currentScreen={currentScreen.current}
                                                    playUploadedFile={playUploadedFile}
                                                    lastFileUpload={lastFileUpload}
                                                    updateFileUploads={updateFileUploads}
                                                    handleCheckedFXToShow={handleCheckedFXToShow}
                                                    checkedEffectsListHook={checkedEffectsListHook}
                                                />
                                                <Box id={'reactDiagramsPedalboardWrapper'}>
                                                    <ReactDiagramsPedalboard
                                                        currentChain={currentChain}
                                                        sourceName={getConvertedRadio(fxRadioValue)}
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
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* BABYLON LAYER */}
                                    <Box 
                                        sx={{
                                            boxSizing: 'border-box',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        key={babylonKey}
                                    >
                                        {babylonReady && babylonReady && <BabylonLayer
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
                                                        handleChangeBPM={handleChangeBPM}
                                                        beatsNumerator={beatsNumerator}
                                                        beatsDenominator={beatsDenominator}
                                                        handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                                                        handleChangeBeatsDenominator={handleChangeBeatsDenominator}
                                                    />
                                                </Box>
                                            )
                                        }

                                        {/* FILES */}
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                        >
                                            <Box sx={{
                                                display: chuckHook ? "flex" : "none",
                                                flexDirection: "row",
                                                width: "100%",
                                            }}
                                            >
                                                <form
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        width: "100%",
                                                    }}
                                                    onSubmit={handleSubmit(onSubmit)}>
                                                    <Button
                                                        component="label"
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            width: "100%",
                                                            cursor: "pointer",
                                                            border: 'rgba(0,0,0,0.78)',
                                                            background: 'rgba(0,0,0,0.78)',
                                                            color: 'rgba(255,255,255,0.78)',
                                                            position: 'relative',
                                                            minWidth: '140px',
                                                            marginLeft: '0px',
                                                            zIndex: 15,
                                                            maxHeight: '40px',
                                                            '&:hover': {
                                                                // color: theme.palette.primaryA,
                                                                background: PALE_BLUE,
                                                            }
                                                        }}
                                                        // className="ui_SynthLayerButton"

                                                        endIcon={<FileUploadIcon />}
                                                    >
                                                        {<>File</>}
                                                        <input
                                                            type={"file"}
                                                            {...register("file")}
                                                            hidden={true}
                                                        />
                                                    </Button>
                                                </form>
                                            </Box>
                                        </Box>


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

                                                    {filesToProcessArrayHook.length > 0 && filesToProcessArrayHook.map((file: any) => {
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
                                    </Box>
                                </>
                            }
                        </Box>
                    </Box>
                )}
                <Box
                    sx={{
                        width: '100vw',
                        position: 'absolute',
                        zIndex: "9999",
                        bottom: '0px',
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
