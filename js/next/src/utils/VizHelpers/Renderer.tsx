import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, FormLabel, Slider, useTheme } from "@mui/material";
import React from "react";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";
import { CORDUROY_RUST, HERITAGE_GOLD, OBERHEIM_TEAL, NEON_PINK } from "../constants";
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
import VelocityLengthSliders from "@/app/components/VelocityLengthSliders";
import StepRadioButtons from "@/app/components/StepRadioButtons";
import FileWindow from "@/app/components/FileWindow";
import { samplesToTimeHMSS } from "../time";



const MARGIN = { top: 10, right: 30, bottom: 30, left: 30 };

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
  isChuckRunning: boolean;
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
  mTFreqs: number[];
  mTMidiNums: number[];
  updateKeyScaleChord: (a: any, b: any, c: any, d: any, e: any, f: any, g: any) => void;
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
  // handleOsc2RateUpdate: (val: any) => void;
  handleMasterFastestRate: (val: any) => void;
  handleStkRateUpdate: (val: any) => void;
  handleSamplerRateUpdate: (val: any) => void;
  handleAudioInRateUpdate: (val: any) => void;
  currentNoteVals: any;
  vizSource: string;
  noteBuilderFocus: string;
  handleNoteBuilder: (focus: string) => void;
  exitEditMode: () => void;
  handleNoteLengthUpdate: (e: any, cellData: any, newValue: any) => void;
  handleNoteVelocityUpdate: (e: any, cellData: any) => void;
  currentSelectedCell: { x: number; y: number };
  octaveMax: number;
  octaveMin: number;
  xLabels?: any;
  yLabels?: any;
  uploadedBlob: React.MutableRefObject<any>;
  getMeydaData: (fileData: ArrayBuffer) => Promise<any>;
  clickedFile: React.MutableRefObject<string | null>;
  chuckRef: React.MutableRefObject<any>;
};

export const Renderer = ({
  isChuckRunning,
  width,
  height,
  data,
  setHoveredCell,
  masterPatternsHashHook,
  inPatternEditMode,
  filesToProcess,
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter,
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
  handleAssignPatternNumber,
  doAutoAssignPatternNumber,

  tune,
  currentMicroTonalScale,
  setFxKnobsCount,
  doUpdateBabylonKey,

  getSTK1Preset,
  updateMicroTonalScale,
  mingusKeyboardData,
  mingusChordsData,
  handleChangeNotesAscending,
  mTNames,
  fxRadioValue,
  // handleOsc1RateUpdate,
  // // handleOsc2RateUpdate,
  // handleMasterFastestRate,
  // handleStkRateUpdate,
  // handleSamplerRateUpdate,
  // handleAudioInRateUpdate,
  // currentNoteVals,
  // vizSource,
  noteBuilderFocus,
  handleNoteBuilder,
  handleNoteLengthUpdate,
  handleNoteVelocityUpdate,
  currentSelectedCell,
  octaveMax,
  octaveMin,
  xLabels,
  yLabels,
  uploadedBlob,
  getMeydaData,
  clickedFile,
  chuckRef
}: RendererProps) => {



  // const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [showPatternEditorPopup, setShowPatternEditorPopup] = useState<boolean>(false);
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [noteVelocityValue, setNoteVelocityValue] = useState<number>(0.5);
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
  const transposeValueHook = useState<number>(0);
  const transposeMax = 12;

  useEffect(() => {
    console.log("YO MT FREQS!!! ", mTFreqs)
    if (width > 0 && height > 0) {
      width > 0 && width !== boundsWidth && setBoundsWidth(width - MARGIN.right - MARGIN.left);
      height > 0 && height !== boundsHeight && setBoundsHeight(height - MARGIN.top - MARGIN.bottom);
    }
    return () => {
    };
  }, [width, height, boundsHeight, boundsWidth, mTFreqs, doAutoAssignPatternNumber]);

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

  const handleNoteVelocityUpdateLocal = (e: any, newValue: number | number[]) => {
    setNoteVelocityValue(newValue as number);
    handleNoteVelocityUpdate(e, cellData);
  }
  // ... avoid .value here. use x and y .... console.log("CHECK WHAT IS THE DATA HERE? ", data); 64 items fields of x, y, value ... z === value + 1 usually but value has weird stuff... y is 1-2-3-4

  // var colorScale = d3
  //   .scaleSequential()
  //   .interpolator(d3.interpolateCool)
  //   .domain([min, max]);

  // THE X AND Y HERE MAP ONTO THE X AND Y AXIS OF THE HEATMAP
  const didSetupHeatmap = useRef<boolean>(false);
  // Build the rectangles
  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

      // Hooks must be called unconditionally


  useEffect(() => {
    if (!currentXVal.current && !didSetupHeatmap.current) {
      triggerEditPattern(null, 0);
      didSetupHeatmap.current = true;
    }
  }, []);

  // Conditional rendering of JSX should happen AFTER hooks
  if (d.value === null || !x || !y) {
    return null; // better than `return;`
  }

    // if (d.value === null || !x || !y) {
    //   return;
    // }

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

      // console.log("DEFAULT! E: ", e, "NUM: ", num)
      const el: any = e && e.length > 0 && Object.values(e.target)[1];

      inPatternEditMode(true);
      // samplesToTimeHMSS
      const string: any = e && Object.values(e.target)[1] || null;
      // const isFill = e && el.id.includes("fill");
      const isFill = e && string && string.id && string.id.includes("fill");

      // const vals = !e ? ["1","1"] : !isFill ? e.target.split("_") : el.id.replace("fill_", "").split("_");
      const vals = !e || (string.length < 1) || (string && !string.id) ? ["1", "1"] : !isFill ? string.id.split("_") : string.id.replace("fill_", "").split("_");
      const xVal = Number(num);

      const yVal = Number(vals[1]) || 1;

      clickHeatmapCell(xVal, yVal);
      const zVal = vals[2] || null;

      xVal && yVal && resetCellSubdivisionsCounter(xVal, yVal);
      currentXVal.current = Number(xVal);
      currentYVal.current = Number(yVal);
      // console.log("GET IT!!! 1 ", masterPatternsHashHook[`${Number(yVal)}`][`${Number(xVal)}`]);
      // console.log("GET IT!!! 2 ", currentXVal.current, currentYVal.current);
      // console.log("GET IT!!! 3 ", masterPatternsHashHook);
      cellData.current = { xVal: Number(xVal), yVal: Number(yVal), zVal: zVal, ...masterPatternsHashHook[`${Number(yVal)}`][`${Number(xVal)}`] }

      yVal && getInstrumentName(yVal);
      console.log("%cCELL DATA!!!!!: ", "color: green;", Number(yVal), Number(xVal), isFill, cellData.current);
      setShowPatternEditorPopup(true);
      document.getElementById(`fill_${xVal}_${yVal}`);
      const elToChange: any =
        document.getElementById(`fill_${xVal}_${yVal}`);
      if (elToChange && elToChange !== null && elToChange.style.fill !== "black") {
        return elToChange.style.fill = "black";
      } else if (elToChange) {
        return elToChange.style.fill = CORDUROY_RUST;
      }
    }

    // const didSetupHeatmap = useRef<boolean>(false);

    useEffect(() => {
      if (!currentXVal.current && !didSetupHeatmap.current) {
        console.log("!!! ", didSetupHeatmap.current === false);

        didSetupHeatmap.current === false && triggerEditPattern(null, 0);
        didSetupHeatmap.current = true;
      }
    }, []);

    const patOptions = [0, 2, 4, 8, 16];

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
                    width={xScale.bandwidth() / (masterPatternsHashHook[`${d.y}`][d.x].subdivisions * (1 / (masterPatternsHashHook[`${d.y}`][d.x].length)))}
                    height={yScale.bandwidth() / 2.5}
                    key={`main_cell_noteEl_${d.x}_${d.y}`}
                    r={4}
                    opacity={masterPatternsHashHook[`${d.y}`][`${d.x}`].velocity}
                    fill={masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName?.join().length > 0 ? HERITAGE_GOLD : "transparent"}
                    id={`fill_noteEl_${d.x}_${d.y}`}
                    x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[d.y][d.x].subdivisions)}
                    y={yScale(d.y)}
                  >
                  </rect>

                  <rect
                    width={(xScale.bandwidth() / masterPatternsHashHook[Number(d.y) - 1][d.x].subdivisions) * (masterPatternsHashHook[Number(d.y) - 1][d.x].length * currentNumerCountColToDisplay)}
                    height={yScale.bandwidth() / 2.5}
                    key={`main_cell_sampleEl_${d.x}_${d.y}`}
                    r={4}
                    opacity={masterPatternsHashHook[`${Number(d.y) - 1}`][`${d.x}`].velocity * 2}
                    fill={masterPatternsHashHook[`${Number(d.y) - 1}`][`${d.x}`].fileNums.join().length > 0 ? OBERHEIM_TEAL : "transparent"}
                    id={`fill_sampleEl_${d.x}_${d.y}`}
                    x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[`${Number(d.y) - 1}`][d.x].subdivisions)} //  * (masterPatternsHashHook[d.y][d.x].length * 12)
                    y={(yScale(d.y) || 0) + yScale.bandwidth() / 3}
                    style={{
                      background: OBERHEIM_TEAL,
                      zIndex: 9999,
                      width: `${(xScale.bandwidth() / masterPatternsHashHook[d.y][d.x].subdivisions)}px`,
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
                    y={y! + 10 + idx * 10 + yScale.bandwidth() / 3}
                    key={`${masterPatternsHashHook[`${d.y}`][`${d.x}`].noteName}_text2_${d.x}_${d.y}`}
                    fontSize={8}
                    fill={'white'}
                  >{1 / masterPatternsHashHook[`${Number(d.y)}`][`${d.x}`].length}</text>}


                  {/* // *tk3 */}
                  <rect
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
                        NEON_PINK
                        :
                        currentBeatCountToDisplay === Number(d.x)
                          ?
                          CORDUROY_RUST
                          :
                          (Number(d.y) > 0)
                            ?
                            OBERHEIM_TEAL
                            :
                            NEON_PINK}
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
    handleLatestSamples(selected.map((i: any) => i.value), currentXVal.current, currentYVal.current - 1);
  }

  function handleLatestNotesFinal(selected: any) {
    console.log("WHAT ARE THE NOTES? ", selected && selected.length > 0 ? selected : [], mTNames);
    handleLatestNotes(selected.map((i: any) => i.value), currentXVal.current, currentYVal.current);
  };

  function getFileNumsPreselected() {
    const getNumsAcrossGrid = Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].fileNums);
    const fileNumsPreselected = new Set(getNumsAcrossGrid);
    return fileNumsPreselected;
  }

  function getNotesPreselected() {

    const notesObj = {
      notesMidi: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].note),
      notesHz: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].noteHz),
      notesNames: Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].noteName).filter((i: any) => i),
    }

    return notesObj;
  }

  const handleTransposeUpdate = (e: any) => {
    console.log("WHAT IS THE TRANSPOSE VALUE? ", e.target.value);
  };

  return (
    <Box
      key={`outerbox__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
      style={{
        display: "flex",
        width: '100%',
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
      }}
    >

      {showPatternEditorPopup && (
        <>
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
              textAlign: 'left',
              padding: "8px",
            }}
          >
            <Box
              style={{
                fontFamily: 'monospace',
                fontWeight: '100',
                color: 'rgba(245,245,245,0.78)',
                paddingLeft: '8px',
                width: '100%',
                height: '100%',
                background: 'rgba(245,245,245,0.078)',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                // border: `1px solid ${HOT_PINK}`,
                border: `1px solid rgba(0,0,0,0.78)`,
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
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxHeight: "180px",
                border: '1px solid rgba(0,0,0,0.78)',
              }}
            >
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
            {fxRadioValue && fxRadioValue.toLowerCase().includes("sample") && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "top",
                }}
              >
                <Box sx={{
                  display: 'inline-flex',
                }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      justifyContent: "stretch",
                      alignItems: "left",
                      width: "100%",
                      padding: "16px",
                      height: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "8px",
                      }}
                    >
                      {
                        uploadedBlob.current &&
                        fxRadioValue.includes("sample") &&  // is SAMPLE source
                        // or... TODO... is Sample AND transposing
                        <FileWindow
                          uploadedBlob={uploadedBlob}
                          // setWavesurfer={setWavesurfer}
                          getMeydaData={getMeydaData}
                          clickedFile={clickedFile}
                          chuck={chuckRef.current}
                        />
                      }
                    </span>
                    <InsetCheckboxDropdown
                      key={`${currentSelectedCell.x}_${currentSelectedCell.y}_files`}
                      files={new Set(filesToProcess.map((f: any) => f.filename))}
                      handleLatestSamplesFinal={handleLatestSamplesFinal}
                      fileNumsPreselected={getFileNumsPreselected()}
                    />
                  </Box>

                </Box>
                <Box sx={{
                  display: "inline-flex",
                  width: '100%',
                  flexDirecton: "row"
                }}>
                  <Box sx={{
                    width: "58%",
                    margin: "4px",
                    marginLeft: "16px",
                    border: `1px solid ${NEON_PINK}`,
                    borderRadius: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: "16px",
                    paddingTop: "8px",
                    height: "100%",
                  }}>
                    <StepRadioButtons
                      doAutoAssignPatternNumber={doAutoAssignPatternNumber}
                      handleAssignPatternNumber={handleAssignPatternNumber}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      justifyContent: "stretch",
                      alignItems: "right",
                      width: "34%",
                      border: `1px solid ${OBERHEIM_TEAL}`,
                      borderRadius: "5px",
                      margin: "4px",
                      height: "100%",
                    }}
                  >
                    <FormLabel
                      sx={{
                        color: 'rgba(245,245,245,0.78)',
                        fontSize: '11px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        marginRight: '32px',
                        paddingTop: '8px',
                        scrollPaddingLeft: '16px',
                      }}
                      id="sample-velocity-select-label"
                    >Velocity</FormLabel>
                    <Slider
                      // className="note-vel-title"
                      aria-label="TransposeSlider"
                      value={transposeValue.current}
                      getAriaValueText={valuetext}
                      valueLabelDisplay="auto"
                      step={.01}
                      sx={{
                        backgroundColor: 'black',
                        color: 'rgba(0,245,245,0.78)',

                      }}
                      onChange={handleTransposeUpdate}
                      // marks={marks}
                      min={0}
                      max={transposeMax}
                      color="secondary"
                    />
                  </Box>
                </Box>

              </Box>)}

            {fxRadioValue && fxRadioValue.toLowerCase().includes("osc") && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                  <NoteBuilderToggle
                    noteBuilderFocus={noteBuilderFocus}
                    handleNoteBuilderToggle={handleNoteBuilder}
                  />
                  <Box sx={{
                    width: "100%",
                    height: "82px",
                    // display: "grid",
                    display: "flex",                                   
                    flexDirection: "row",
                    // gridTemplateColumns: "1fr 2fr",
                    gap: 0.5,
                    justifyContent: "space-between",
                    alignItems: "top",
                  }}>
                    {masterPatternsHashHook && masterPatternsHashHook[`${currentYVal.current}`] && masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`] &&
                      (
                        <Box
                          sx={{
                            padding: "2px 8px 2px 8px",
                            borderRadius: "5px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: "100%",
                            //
                            minWidth: "50%",
                            border: `1px solid ${noteBuilderFocus !== "MIDI" ? CORDUROY_RUST : OBERHEIM_TEAL}`,
                            // marginLeft: "4px",
                          }} key={`notesDropdown_${mTFreqs}`}>
                          {!isChuckRunning ? <InsetNotesDropdown
                            key={`${currentSelectedCell.x}_${currentSelectedCell.y}_notes`}
                            notes={mTNames}
                            handleLatestNotesFinal={handleLatestNotesFinal}
                            notesPreselected={getNotesPreselected()}
                            max={octaveMax}
                            min={octaveMin}
                          /> : <Box sx={{ height: "100%" }} />}
                        </Box>

                      )}
                    <Box
                      sx={{
                        width: "50%",
                      }}
                    >
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
                  </Box>
                  <Box sx={{ display: "inline-flex", flexDirecton: "row", width: "100%" }}>
                    <Box
                      sx={{
                        borderRadius: "5px",
                        border: `1px solid ${noteBuilderFocus !== "Chord" ? NEON_PINK : OBERHEIM_TEAL}`,
                        padding: "2px 2px 2px 2px",
                        marginTop: "4px",
                        marginBottom: "4px",
                        marginRight: "4px",
                        // marginRight: "8px"
                      }}
                    >
                      <StepRadioButtons
                        doAutoAssignPatternNumber={doAutoAssignPatternNumber}
                        handleAssignPatternNumber={handleAssignPatternNumber}
                      />
                    </Box>
                    <Box
                      sx={{
                        border: `1px solid ${noteBuilderFocus !== "Micro" ? HERITAGE_GOLD : OBERHEIM_TEAL}`,
                        borderRadius: "5px",
                        padding: "2px 4px",
                        margin: "4px 0px 4px 0",
                        justifyContent: "right",
                        width: "fit-content",
                        flex: "1 1 auto",
                      }}
                    >
                      <GenericRadioButtons label={"ascending"} options={["asc", "desc"]} callback={handleChangeNotesAscending} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      maxWidth: "100%",
                      width: "100%",
                      whiteSpace: "nowrap",
                      // paddingLeft: "4px",
                    }}
                  >
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "50%",
                      justifyContent: "space-between",
                      borderRadius: "5px",
                      border: `1px solid ${OBERHEIM_TEAL}`,
                      height: "100%",
                      padding: "12px",
                      marginRight: "4px"
                    }}>
                      <FormLabel
                        sx={{
                          color: 'rgba(245,245,245,0.78)',
                          fontSize: '11px',
                          paddingLeft: '0px',
                          paddingRight: '8px',
                        }}
                        id="notes-input-select-label"
                      >
                        Note Velocity
                      </FormLabel>
                      <Slider
                        aria-label="Note Velocity"
                        value={noteVelocityValue}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        sx={{
                          width: "80%",
                          color: 'rgba(245,245,245,0.78)',
                          backgroundColor: 'rgba(28,28,28,0.78)'
                        }}
                        onChange={handleNoteVelocityUpdateLocal}
                        step={0.01}
                        min={0}
                        max={1}
                      />
                    </Box>
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                      borderRadius: "5px",
                      border: `1px solid ${CORDUROY_RUST}`,
                      padding: "0 16px 0 16px",
                    }}>
                      <VelocityLengthSliders
                        handleNoteLengthUpdate={handleNoteLengthUpdate}
                        cellData={cellData.current}
                        maxLen={Number(+doAutoAssignPatternNumber) !== 0 ? Number(+doAutoAssignPatternNumber) : 1}
                        chuckIsRunning={isChuckRunning}
                        masterPatterns={masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`]}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>)}
          </Box>
        </>
      )}








      {/* <ArpSpeedSliders 
        handleOsc1RateUpdate={handleOsc1RateUpdate} 
        // handleOsc2RateUpdate={handleOsc2RateUpdate}
        handleMasterFastestRate={handleMasterFastestRate}
        handleStkRateUpdate={handleStkRateUpdate} 
        handleSamplerRateUpdate={handleSamplerRateUpdate} 
        handleAudioInRateUpdate={handleAudioInRateUpdate}
        filesToProcess={filesToProcess}
        currentNoteVals={currentNoteVals}
        vizSource={vizSource}
      />   */}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "180px",
          border: '1px solid rgba(0,0,0,0.78)',
        }}
      >
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
      </Box> */}
    </Box>
  );
};
