import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Slider, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import React from "react";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";
import { FOREST_GREEN, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE } from "../constants";
import InsetCheckboxDropdown from "@/app/components/InsetCheckboxDropdowns";
import { PortalCenterModal } from "@/app/components/PortalCenterModal";
import InsetNotesDropdown from "@/app/components/InsetNotesDropdowns";
import { Tune } from "@/tune";
import MingusPopup from "@/app/components/MingusPopup";
import InstrumentsAndMicrotones from "@/app/components/InstrumentsAndMicrotones";
import GenericRadioButtons from "@/app/components/GenericRadioButtons";
import ArpSpeedSliders from "@/app/components/ArpSpeedSliders";
import { valuetext } from "../knobsHelper";
import NoteBuilderToggle from "@/app/components/NoteBuilderToggle";
import { masterPatternsRef } from "@/app/state/refs";
import VelocityLengthSliders from "@/app/components/VelocityLengthSliders";
import StepRadioButtons from "@/app/components/StepRadioButtons";



const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

interface CellData {
  note: number[] | any,
  notesHz: number[] | any,
  velocity: number[] | any,
  subdivisions: number;
  length: number[] | any;
  on: boolean;
  xVal?: number | null;
  yVal?: number | null;
  zVal?: number | null;
}

type RendererProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: number }[];
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  editPattern: (x: any, y: any, group: any) => void;
  masterPatternsHashHook: any;
  masterPatternsHashHookUpdated: boolean;
  updateCellColor: (msg: boolean, xVal: number | null, yVal: number | null, zVal: number | null, elToChange: Element) => void;
  updateCellColorBool: boolean;
  inPatternEditMode: (state: boolean) => void;
  filesToProcess: any;
  selectFileForAssignment: (e: Event) => void;
  handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
  cellSubdivisions: number;
  resetCellSubdivisionsCounter: (x: number, y: number) => void;
  rebuildHeatmap: () => void;

  currentBeatCountToDisplay: number;
  currentNumerCountColToDisplay: number;
  currentDenomCount: number;
  currentPatternCount: number;
  clickHeatmapCell: any;
  handleLatestSamples: (
    fileNames: string[],
    xVal: number,
    yVal: number
  ) => void;
  handleLatestNotes: (
    notes: any[],
    xVal: number,
    yVal: number
  ) => void;
  mTFreqs:number[];
  mTMidiNums:number[];
  updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any, f: any, g: any) => void;
  userInteractionUpdatedScore: (x: number) => void;
  handleAssignPatternNumber: (e: any) => void;
  doAutoAssignPatternNumber: number;

  setStkValues: React.Dispatch<React.SetStateAction<any>>; 
  tune: Tune;
  currentMicroTonalScale: (scale: any) => void;
  setFxKnobsCount: React.Dispatch<React.SetStateAction<number>>;
  doUpdateBabylonKey: any;
  // setBabylonKey={setBabylonKey}
  babylonKey: string;
  // setNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  currentScreen: React.MutableRefObject<string>;
  currentFX: React.MutableRefObject<any>;
  currentStkTypeVar: React.MutableRefObject<string>;
  // universalSources={universalSources}
  updateCurrentFXScreen: any;

  getSTK1Preset: (x: string) => any; 
  universalSources: React.MutableRefObject<any>;
  updateMicroTonalScale: (scale: any) => void;

  mingusKeyboardData: any;
  mingusChordsData: any;
  updateMingusData: (data: any) => void;
  handleChangeNotesAscending: (order: string) => void;
  mTNames: string[];
  fxRadioValue: string;

  handleOsc1RateUpdate: (val: any) => void;
  handleOsc2RateUpdate: (val: any) => void;
  handleMasterFastestRate: (val: any) => void;
  handleStkRateUpdate: (val: any) => void;
  handleSamplerRateUpdate: (val: any) => void;
  handleAudioInRateUpdate: (val: any) => void;
  currentNoteVals: any;
  vizSource: string;
  noteBuilderFocus: string;
  handleNoteBuilder: (focus: string) => void; 
  exitEditMode: () => void;
  handleNoteLengthUpdate: (e: any, cellData: any) => void;
  handleNoteVelocityUpdate: (e: any, cellData: any) => void;
  currentSelectedCell: { x: number; y: number };
  octaveMax: number;
  octaveMin: number;
  xLabels?: any;
  yLabels?: any;
};

export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
  editPattern,
  masterPatternsHashHook,
  masterPatternsHashHookUpdated,
  updateCellColor,
  updateCellColorBool,
  inPatternEditMode,
  filesToProcess,
  selectFileForAssignment,
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter,
  rebuildHeatmap,
  currentBeatCountToDisplay,
  currentNumerCountColToDisplay,
  currentDenomCount,
  currentPatternCount,
  clickHeatmapCell,
  handleLatestSamples,
  handleLatestNotes,
  mTFreqs,
  mTMidiNums,
  updateKeyScaleChord,
  userInteractionUpdatedScore,
  handleAssignPatternNumber,
  doAutoAssignPatternNumber,


  setStkValues,
  tune,
  currentMicroTonalScale,
  setFxKnobsCount,
  doUpdateBabylonKey,

  getSTK1Preset,
  universalSources,
  updateMicroTonalScale,
  mingusKeyboardData,
  mingusChordsData,
  updateMingusData,
  handleChangeNotesAscending,
  mTNames,
  fxRadioValue,
  handleOsc1RateUpdate,
  handleOsc2RateUpdate,
  handleMasterFastestRate,
  handleStkRateUpdate,
  handleSamplerRateUpdate,
  handleAudioInRateUpdate,
  currentNoteVals,
  vizSource,
  noteBuilderFocus,
  handleNoteBuilder,
  exitEditMode,
  handleNoteLengthUpdate,
  handleNoteVelocityUpdate,
  currentSelectedCell,
  octaveMax,
  octaveMin,
  xLabels,
  yLabels
}: RendererProps) => {

  // const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [showPatternEditorPopup, setShowPatternEditorPopup] = useState<boolean>(false);
  const [wavesurfer, setWavesurfer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const theme = useTheme();
  const containerRef = useRef<any>();
  const currentXVal = useRef<number>(0);
  const currentYVal = useRef<number>(0);
  const surferBlob = useRef<any>();
  const cellData = useRef<CellData[]>();
  const [instrument, setInstrument] = useState<string>('');
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const [boundsWidth, setBoundsWidth] = useState<number>(width - MARGIN.right - MARGIN.left || 0);
  const [boundsHeight, setBoundsHeight] = useState<number>(height - MARGIN.top - MARGIN.bottom || 0);
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);
  const [min = 0, max = 0] = d3.extent(data.map((d) => d.value)); // extent can return [undefined, undefined], default to [0,0] to fix types

  const transposeValue = useRef<number>(0);
  const transposeMax = 12;

  useEffect(() => {
    console.log("YO MT FREQS!!! ", mTFreqs)
    if (width > 0 && height > 0) {
      width > 0 && width !== boundsWidth && setBoundsWidth(width - MARGIN.right - MARGIN.left);
      height > 0 && height !== boundsHeight && setBoundsHeight(height - MARGIN.top - MARGIN.bottom);
    }
    return () => {
    };
  }, [width, height, boundsHeight, boundsWidth, mTFreqs]);

  const xScale = useMemo(() => {
    
    return d3
      .scaleBand()
      .domain(xLabels.map((d: any) => d.toString()))
      .range([0, boundsWidth])
      // .domain(allXGroups)
      .padding(0.01);
  }, [allXGroups, boundsWidth]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(yLabels.map((d: any) => d.toString()))
      .range([boundsHeight, 0])
      // .domain(allYGroups)
      .padding(0.01);
  }, [allYGroups, boundsHeight]);

  // ... avoid .value here. use x and y .... console.log("CHECK WHAT IS THE DATA HERE? ", data); 64 items fields of x, y, value ... z === value + 1 usually but value has weird stuff... y is 1-2-3-4

  // var colorScale = d3
  //   .scaleSequential()
  //   .interpolator(d3.interpolateCool)
  //   .domain([min, max]);

  // THE X AND Y HERE MAP ONTO THE X AND Y AXIS OF THE HEATMAP

  // Build the rectangles
  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.value === null || !x || !y) {
      return;
    }

    const getInstrumentName = (yVal: number) => {
      switch (yVal) {
        case 0:
          return setInstrument("Sample 1");
        case 1:
          return setInstrument("Sample 1");
        case 2:
          return setInstrument("Sample 2");
        case 3:
          return setInstrument("Sample 3");
        case 4:
          return setInstrument("Sample 4");
        case 5:
          return setInstrument("Osc 1");
        case 6:
          return setInstrument("Osc 2");
        case 7:
          return setInstrument("STK");
      }
    }

    const triggerEditPattern = async (e: any, num: any) => {
      const el: any = Object.values(e.target)[1];

      inPatternEditMode(true);

      const isFill = el.id.includes("fill");
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_", "").split("_");
      const xVal = Number(num);

      const yVal = Number(vals[1]) || null;

      clickHeatmapCell(xVal, yVal);
      const zVal = vals[2] || null;
      xVal && yVal && resetCellSubdivisionsCounter(xVal, yVal);
      currentXVal.current = Number(xVal);
      currentYVal.current = Number(yVal);
      cellData.current = { xVal: Number(xVal), yVal: Number(yVal), zVal: zVal, ...masterPatternsHashHook[`${Number(yVal)}`][`${Number(xVal)}`] }
      yVal && getInstrumentName(yVal);
      console.log("DOES THIS CAUSE ALL CELL DATA PROBLEMS? ", Number(yVal),Number(xVal), masterPatternsHashHook );
      console.log("%cCELL DATA!!!!!: ", isFill, cellData.current);
      setShowPatternEditorPopup(true);
      document.getElementById(`fill_${xVal}_${yVal}`);
      const elToChange: any = 
        document.getElementById(`fill_${xVal}_${yVal}`);
        if (elToChange && elToChange !== null && elToChange.style.fill !== "black") {
          return elToChange.style.fill = "black";
        } else if (elToChange) {
          return elToChange.style.fill = FOREST_GREEN;
      }
    }

    const patOptions = [0,2,4,8,16];

    // MODIFY THIS TO ENABLE FILLS / ROLLS / POLYRHYTHMS / HOOKS ETC
    return (
      <React.Fragment key={`rectFillsWrapper_${d.x}_${d.y}`}>
        {masterPatternsHashHook && masterPatternsHashHook[`${d.y}`] && masterPatternsHashHook[`${d.y}`][`${d.x}`] &&
          Array.from(
            {
              length: masterPatternsHashHook[`${d.y}`][`${d.x}`].subdivisions
            }
          ).map(
            (x) => {
              return x; 
            }
          ).map(
            (i, idx) => {
              return (
                <React.Fragment key={`overlay_note_${idx}_${d.x}_${d.y}`}>
                  
                  <rect
                    width={(xScale.bandwidth() / masterPatternsHashHook[`${d.y}`][d.x].subdivisions) * (masterPatternsHashHook[`${d.y}`][d.x].length * currentNumerCountColToDisplay)}
                    height={yScale.bandwidth() / 3}
                    key={`main_cell_noteEl_${d.x}_${d.y}`}
                    r={4}
                    opacity={1}
                    fill={masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName?.join().length > 0 ? MUTED_OLIVE : "transparent"}
                    id={`fill_noteEl_${d.x}_${d.y}`}
                    x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[d.y][d.x].subdivisions)}
                    y={yScale(d.y)}
                    style={{
                      background: MUTED_OLIVE, 
                      zIndex: 9999,
                      width:`${(xScale.bandwidth() / masterPatternsHashHook[`${d.y}`][d.x].subdivisions) * (masterPatternsHashHook[`${d.y}`][d.x].length * 12)}px`,
                    }}
                    >
                  </rect>

                  <rect
                    width={(xScale.bandwidth() / masterPatternsHashHook[Number(d.y) - 1][d.x].subdivisions) * (masterPatternsHashHook[Number(d.y) - 1][d.x].length * currentNumerCountColToDisplay)}
                    height={yScale.bandwidth() / 3}
                    key={`main_cell_sampleEl_${d.x}_${Number(d.y) - 1}`}
                    r={4}
                    opacity={1}
                    fill={masterPatternsHashHook[`${Number(d.y) - 1}`][`${d.x}`].fileNums?.join().length > 0 ? PALE_BLUE : "transparent"}
                    id={`fill_sampleEl_${d.x}_${Number(d.y) - 1}`}
                    x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[Number(d.y) - 1][d.x].subdivisions)}
                    y={(yScale(d.y) || 0) + yScale.bandwidth() / 3}
                    style={{
                      background: PALE_BLUE, 
                      zIndex: 9999,
                      width:`${(xScale.bandwidth() / masterPatternsHashHook[Number(d.y) - 1][d.x].subdivisions) * (masterPatternsHashHook[Number(d.y) - 1][d.x].length * 12)}px`,
                    }}
                    >
                  </rect>

                    {masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName?.join().length > 0 && <text
                      x={x! + 2}
                      y={y! + 10 + idx * 10}
                      key={`${masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName}_text1_${d.x}_${d.y}`}
                      fontSize={8}
                      fill={'white'}
                    >{masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName}</text>}

                    {masterPatternsHashHook[`${Number(d.y) - 1}`][`${d.x}`].fileNums?.join().length > 0 && <text
                      x={x! + 2}
                      y={y! + 10 + idx * 10  + yScale.bandwidth() / 3}
                      key={`${masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName}_text2_${d.x}_${d.y}`}
                      fontSize={8}
                      fill={'white'}
                    >{1 / masterPatternsHashHook[`${Number(d.y) - 1}`][`${d.x}`].length}</text>}





                  <rect
                    // key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
                    key={`main_cell_${d.x}_${d.y}`}
                    r={4}
                    id={`fill_${d.x}_${d.y}`}
                    x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[d.y][d.x].subdivisions)}
                    y={yScale(d.y)}
                    width={
                      (xScale.bandwidth() / masterPatternsHashHook[d.y][d.x].subdivisions)
                    }
                    height={yScale.bandwidth()}
                    opacity={
                      (patOptions[doAutoAssignPatternNumber] > 0 && ((16 * (Number(d.y) - 1) + Number(d.x)) - (16 * currentSelectedCell.y + currentSelectedCell.x)) % (16 / patOptions[doAutoAssignPatternNumber]) === 0) ||
                      (patOptions[doAutoAssignPatternNumber] === 0 && currentSelectedCell.x === Number(d.x) && currentSelectedCell.y === Number(d.y)) ||
                      currentBeatCountToDisplay === Number(d.x) && currentNumerCountColToDisplay === Number(d.y)
                      ? 
                        0.8 
                      :
                        0.5 
                    }
                    fill={
                        currentBeatCountToDisplay === Number(d.x) && currentNumerCountColToDisplay === Number(d.y) ||
                        currentSelectedCell.x === Number(d.x) && currentSelectedCell.y === Number(d.y) 
                        ?
                            RUSTY_ORANGE  
                        :   
                            currentBeatCountToDisplay === Number(d.x)
                            ?
                              FOREST_GREEN
                            :
                              (Number(d.y) > 0) 
                              ? 
                                PALE_BLUE 
                              : 
                                RUSTY_ORANGE}
                    stroke={'rgba(245,245,245,0.78)'}
                    onClick={(e: any) => triggerEditPattern(e, d.x)}
                    onMouseEnter={(e) => {
                      setHoveredCell({
                        xLabel: d.x,
                        yLabel: d.y,
                        xPos: x,
                        yPos: y,
                        value: Math.round(d.value * 100) / 100,
                        instrument: d.y && getInstrumentName(parseInt(d.y)) || "None",
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    cursor="pointer"
                    style={{ zIndex: 1, pointerEvents: "auto" }}
                  > 
                    <text>{d.x} {d.y}</text>
                  </rect>
                </React.Fragment>
              )
            }
          )
        }
      </React.Fragment>
      );
  });
  
  // const xLabels = allXGroups.map((name, i) => {
  //   const x = xScale(name);

  //   if (!x) {
  //     return null;
  //   }

  //   return (
  //     <text
  //       key={`middle_text_anchor_${i}_${x}_${name}`}
  //       x={x + xScale.bandwidth() / 2}
  //       y={boundsHeight + 10}
  //       textAnchor="middle"
  //       dominantBaseline="middle"
  //       fontSize={10}
  //       style={{ pointerEvents: "none" }}
  //     >
  //       {name}
  //     </text>
  //   );
  // });

  // const yLabels = allYGroups.map((name, i) => {
  //   const y = yScale(name);

  //   if (!y) {
  //     return null;
  //   }

  //   return (
  //     <text
  //       key={`${i}_text_middle_${y}_${name}`}
  //       x={-5}
  //       y={y + yScale.bandwidth() / 2}
  //       textAnchor="end"
  //       dominantBaseline="middle"
  //       fontSize={10}
  //       style={{ pointerEvents: "none" }}
  //     >
  //       {name}
  //     </text>
  //   );
  // });

  const handleCloseEditorPopup = () => {
    setShowPatternEditorPopup(false);
    rebuildHeatmap();
    exitEditMode();

  }

  const handleFillEdit = (e: any) => {
    console.log("FILL: ", e);
  }

  const removeExistingNote = (e: any) => {
    console.log("WHAT IS E TARGET FOR NOTE TO REMOVE? ", e.target.id.split('_'));
  }

  const onPlayPause = () => {
    if (wavesurfer) {
          wavesurfer.playPause()
      }
  }

  const subdivisionCount = cellSubdivisions;

  function handleLatestSamplesFinal(selected: any) {
    console.log("WHAT IS THE FILE NAME? ", currentXVal.current, currentYVal.current, selected);
    handleLatestSamples(selected.map((i:any)=>i.value), currentXVal.current, currentYVal.current - 1);
    // userInteractionUpdatedScore(masterPatternsHashHook);
  }

  function handleLatestNotesFinal (selected: any) {
    console.log("WHAT ARE THE NOTES? ", selected && selected.length > 0 ? selected : [], mTNames);
    // const theIndex = selected && selected.length > 0 ? mTNames.indexOf(selected[0].value) : -1;
    // console.log("WHAT IS MTNAMES??? ", theIndex);
    handleLatestNotes(selected.map((i:any)=>i.value), currentXVal.current, currentYVal.current);
  };

  function getFileNumsPreselected() {
    const getNumsAcrossGrid = Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].fileNums);
    // console.log("WHAT ARE THE FILE NUMBERS ACROSS GRID? ", getNumsAcrossGrid);
    const fileNumsPreselected = new Set(getNumsAcrossGrid);
    console.log("*** WHAT ARE getNumsAcrossGrid? ", getNumsAcrossGrid);
    // console.log("OOOF ", fileNumsPreselected);
    //console.log("AAAF ", currentXVal.current, currentYVal.current, masterPatternsRef.current[currentXVal.current][currentYVal.current])
    
    return fileNumsPreselected;
  }

  function getNotesPreselected() {

    const notesObj = {
      notesMidi: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].note),
      notesHz: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].noteHz),
      notesNames: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].noteName).filter((i: any) => i),
    }

    // return noteNumsPreselected;
    return notesObj;
  }

  // console.log("AYAYAY MingusKeyboardsData ", mingusKeyboardData.data);

  // mingusChordsData && mingusChordsData.length > 0 && console.log("AYAYAY MingusChordsData ", JSON.parse(mingusChordsData));
  
  const handleTransposeUpdate = (e: any) => { 
    console.log("WHAT IS THE TRANSPOSE VALUE? ", e.target.value);
  };

  return (
    <Box
      key={`outerbox__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
      style={{
        display: "flex",
        width: '100%',
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        // alignItems: "center",
      }}
    >
      {showPatternEditorPopup && (

        // <PortalCenterModal onClose={()=>handleCloseEditorPopup}>
          <Box
            key={`patternEditorPopupCloseButtonWrapper__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              background: 'rgba(28,28,28,0.78)',
              borderRadius: '8px',
            }}>

            <Box>
              {mingusKeyboardData && mingusKeyboardData.length > 0 && mingusKeyboardData.data[0].toString()}
              {mingusKeyboardData && mingusKeyboardData.length > 0 && mingusKeyboardData.data[2].toString()}
            </Box>

            <Box
              key={`wrapnewvals__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: 'monospace',
                fontWeight: "100",
                // marginLeft: "32px",                
                textAlign: 'left',
                borderRadius: '5px',
                padding: '4px',
                width: '100%',
                // maxWidth: '320px',
                color: 'rgba(245,245,245,0.78)',

              }}
            >
                <Box 
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: '100',
                    color: 'rgba(245,245,245,0.78)',
                    fontSize: '22px',
                    paddingLeft: '8px',
                    width: '100%',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'rgba(245,245,245,0.078)',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{
                    marginRight: "12px",

                  }}>
                    Cell: {
                      `${currentXVal.current} | ${currentYVal.current}`
                    }  
                  </span>  
                  <Box 
                    sx={{
                      display: "inline-flex",
                      flexDirection: "row",
                      justifyContent: "stretch",
                      alignItems: "center",
                      paddingTop: "8px",
                      fontSize: '16px',
                      borderRadius: '5px',
                      blur: "8px",
                    }}
                  >
                    Subdivs: <SubdivisionsPicker
                      xVal={currentXVal.current}
                      yVal={currentYVal.current}
                      masterPatternsHashHook={masterPatternsHashHook}
                      handleChangeCellSubdivisions={handleChangeCellSubdivisions}
                      cellSubdivisions={cellSubdivisions}
                    />
                    <Box 
                      key={`wrapCloseBtn__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                      sx={{
                        textAlign: 'right',
                        justifyContent: "stretch",
                        alignItems: "stretch",
                        display: "flex",
                        flexDirection: "row-reverse",
                        width: "100%",
                        padding: "0",
                        margin: "0",
                        cursor: "pointer",
                      }}
                    >
                      <CloseIcon
                        sx={{
                          zIndex: '9999',
                          display: "flex",
                          color: 'rgba(245,245,245,0.78)',
                          textAlign: 'right',
                          // width: '100%',
                        }}
                        key={`patternEditorPopupCloseButton__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                        onClick={handleCloseEditorPopup}
                      />
                    </Box>
                  </Box>
                </Box>

                {fxRadioValue && fxRadioValue.toLowerCase().includes("sample") && (           
                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "space-between",
                    // alignItems: "center",
                    // width: "50%",
                    alignItems: "top",
                    border: 'solid 1px rgba(245,245,245,0.78)',
                    borderRadius: '5px',
                    padding: '8px',
                    // maxWidth: '320px',
                  }}
                >        
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      justifyContent: "stretch",
                      alignItems: "left",
                      width: "100%",
                      height: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "8px",
                      }}
                    >
                      {/* Samples: */}
                      
                    </span>
                    <InsetCheckboxDropdown
                      key={`${currentSelectedCell.x}_${currentSelectedCell.y}_files`} 
                      files={new Set(filesToProcess.map((f: any) => f.filename))} 
                      handleLatestSamplesFinal={handleLatestSamplesFinal} 
                      fileNumsPreselected={getFileNumsPreselected()} />
                  </Box>
          
                    <StepRadioButtons 
                      doAutoAssignPatternNumber={doAutoAssignPatternNumber}
                      handleAssignPatternNumber={handleAssignPatternNumber}
                    />

                    <Slider
                        aria-label="TransposeSlider"
                        value={transposeValue.current}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={null}
                        sx={{color: 'rgba(245,245,245,0.78)'}}
                        onChange={handleTransposeUpdate}
                        // marks={marks}
                        min={1}
                        max={transposeMax}
                        color="secondary"
                    />
                </Box>)}
      
                {fxRadioValue && fxRadioValue.toLowerCase().includes("osc") && (          
                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // width: "50%",
                    border: 'solid 1px rgba(245,245,245,0.78)',
                    borderRadius: '5px',
                    padding: '8px',
                    height: "100% !important",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      justifyContent: "stretch",
                      alignItems: "left",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "8px",
                        display: "inline-flex",
                        flexDirection: "row",
                      }}
                    >
                      {/* Notes: */}
                      {/* <GenericRadioButtons label={"ascending"} options={["asc", "desc"]} callback={handleChangeNotesAscending} /> */}
                    </span>          
                    {masterPatternsHashHook && masterPatternsHashHook[`${currentYVal.current}`] && masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`] && 
                    (<Box sx={{
                      display: "grid",
                      // flexDirection: "row",
                      gridTemplateColumns: "2fr 1fr",
                      width: "100%",
                    }}>
                      <span key={`notesDropdown_${mTFreqs}`}>
                        <InsetNotesDropdown
                          key={`${currentSelectedCell.x}_${currentSelectedCell.y}_notes`}  
                          notes={mTNames} 
                          handleLatestNotesFinal={handleLatestNotesFinal} 
                          notesPreselected={getNotesPreselected()}
                          max={octaveMax}
                          min={octaveMin}
                        />
                      </span>                          
                      <GenericRadioButtons label={"ascending"} options={["asc", "desc"]} callback={handleChangeNotesAscending} />
                    </Box>)}
                    <StepRadioButtons 
                      doAutoAssignPatternNumber={doAutoAssignPatternNumber}
                      handleAssignPatternNumber={handleAssignPatternNumber}
                    />
                    <VelocityLengthSliders 
                      handleNoteLengthUpdate={handleNoteLengthUpdate}
                      handleNoteVelocityUpdate={handleNoteVelocityUpdate}
                      cellData={cellData.current}
                    />
                  </Box>
                  <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "top",
                  }}>
                    <NoteBuilderToggle 
                        noteBuilderFocus={noteBuilderFocus}
                        handleNoteBuilderToggle={handleNoteBuilder}
                    />                        
                    <MingusPopup 
                      updateKeyScaleChord={updateKeyScaleChord}
                      noteBuilderFocus={noteBuilderFocus}

                      tune={tune}
                      currentMicroTonalScale={currentMicroTonalScale}
                      setFxKnobsCount={setFxKnobsCount}
                      doUpdateBabylonKey={doUpdateBabylonKey}
                      getSTK1Preset={getSTK1Preset}   
                      updateMicroTonalScale={updateMicroTonalScale}  
                    />  
                  </Box>
                </Box>)}
            </Box>
          </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "8px",
        }}
      >
      <ArpSpeedSliders 
        handleOsc1RateUpdate={handleOsc1RateUpdate} 
        handleOsc2RateUpdate={handleOsc2RateUpdate}
        handleMasterFastestRate={handleMasterFastestRate}
        handleStkRateUpdate={handleStkRateUpdate} 
        handleSamplerRateUpdate={handleSamplerRateUpdate} 
        handleAudioInRateUpdate={handleAudioInRateUpdate}
        filesToProcess={filesToProcess}
        currentNoteVals={currentNoteVals}
        vizSource={vizSource}
      />  

      {width && height && boundsWidth && boundsHeight && <svg
        key={`heatmapSVG_${currentXVal.current}_${currentYVal.current}`}
        width={width || 0}
        height={height}
        style={{ pointerEvents: "none" }}
      >

        <g
          key={`heatmapGelement_${currentXVal.current}_${currentYVal.current}`}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          style={{ pointerEvents: "none" }}
        >
          {allShapes}

          {xLabels}
          {yLabels}
        </g>
      </svg>}
      </Box>
    </Box>
  );
};
