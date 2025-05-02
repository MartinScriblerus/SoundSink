import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Button, CardHeader, Grid, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import React from "react";
import FileWrapper from "@/app/components/FileWrapper";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";
import WaveSurfer from 'wavesurfer.js'
import { FOREST_GREEN, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE } from "../constants";
import InsetCheckboxDropdown from "@/app/components/InsetCheckboxDropdowns";
import { PortalCenterModal } from "@/app/components/PortalCenterModal";
import { background } from "@/app/components/VizxHelpers/BrushChart";
import InsetNotesDropdown from "@/app/components/InsetNotesDropdowns";
// import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
// import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'


const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

interface CellData {
  note: number[] | any,
  notesHz: number[] | any,
  velocity: number[] | any,
  subdivisions: number;
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

  useEffect(() => {
    if (width > 0 && height > 0) {
      width > 0 && width !== boundsWidth && setBoundsWidth(width - MARGIN.right - MARGIN.left);
      height > 0 && height !== boundsHeight && setBoundsHeight(height - MARGIN.top - MARGIN.bottom);
    }
    return () => {
    };
  }, [width, height]);

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth + 1])
      .domain(allXGroups)
      .padding(0.01);
  }, [data]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data]);

  // var colorScale = d3
  //   .scaleSequential()
  //   .interpolator(d3.interpolateCool)
  //   .domain([min, max]);

  // Build the rectangles
  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.value === null || !x || !y) {
      return;
    }

    const getInstrumentName = (yVal: number) => {
      switch (yVal) {
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
      console.log('WTF EL??? ', el);

      inPatternEditMode(true);

      const isFill = el.id.includes("fill");
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_", "").split("_");
      const xVal = Number(num) || null;
      const yVal = Number(vals[1]) || null;

      clickHeatmapCell(xVal, yVal);
      const zVal = vals[2] || null;
      xVal && yVal && resetCellSubdivisionsCounter(xVal, yVal);
      currentXVal.current = Number(xVal);
      currentYVal.current = Number(yVal);
      cellData.current = { xVal: Number(xVal), yVal: Number(yVal), zVal: zVal, ...masterPatternsHashHook[`${Number(yVal)}`][`${Number(xVal)}`] }
      yVal && getInstrumentName(yVal);
      console.log("DOES THIS CAUSE ALL CELL DATA PROBLEMS? ", Number(yVal),Number(xVal), masterPatternsHashHook );
      console.log("%cCELL DATA!!!!!: ", isFill, xVal, yVal, "color: magenta;", cellData.current);
      setShowPatternEditorPopup(true);
      document.getElementById(`fill_${xVal}_${yVal}`);
      const elToChange: any = 
        document.getElementById(`fill_${xVal}_${yVal}`);
        if (elToChange && elToChange !== null && elToChange.style.fill !== "black") {
          return elToChange.style.fill = "black";
        } else {
          return elToChange.style.fill = FOREST_GREEN;
      }
    }

    // useEffect(() => {
    //   console.log("OYOYOYOY ", filesToProcess.map((f: any) => f.filename));
    // }, []);

    // MODIFY THIS TO ENABLE FILLS / ROLLS / POLYRHYTHMS / HOOKS ETC
    return (
      <React.Fragment key={`rectFillsWrapper_${d.x}_${d.y}`}>
        {Array.from(
            {
              length: masterPatternsHashHook[`${d.y}`][`${d.x}`].subdivisions
            }
          ).map(
            (x) => {
              return x; 
            }
          ).map(
            (i, idx) => {
              // const incrementorX: number = xScale.bandwidth() / Object.values(cellData.current)[8] || 0;
              return (
                <rect
                  key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
                  r={4}
                  id={`fill_${d.x}_${d.y}`}
                  x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[d.y][d.x].subdivisions)}
                  y={yScale(d.y)}
                  width={
                    (xScale.bandwidth() / masterPatternsHashHook[d.y][d.x].subdivisions)
                        }
                        height={yScale.bandwidth()}
                        opacity={1}
                        fill={
                          currentBeatCountToDisplay === Number(d.x)
                          ?
                            FOREST_GREEN
                          :
                            (Number(d.y) > 0) 
                            ? 
                              PALE_BLUE 
                            : 
                              RUSTY_ORANGE}
                  stroke={'rgba(255,255,255,0.78)'}
                  onClick={(e: any) => triggerEditPattern(e, d.x)}
                  onMouseEnter={(e) => {
                    setHoveredCell({
                      xLabel: d.x,
                      yLabel: d.y,
                      xPos: x + xScale.bandwidth() + MARGIN.left,
                      yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
                      value: Math.round(d.value * 100) / 100,
                      instrument: d.y && getInstrumentName(parseInt(d.y)) || "None",
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  cursor="pointer"
                  style={{ zIndex: 100, pointerEvents: "auto" }}
                />
              )
            }
          )
        }
      </React.Fragment>
      );
  });
  
  const xLabels = allXGroups.map((name, i) => {
    const x = xScale(name);

    if (!x) {
      return null;
    }

    return (
      <text
        key={`middle_text_anchor_${i}_${x}_${name}`}
        x={x + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        style={{ pointerEvents: "none" }}
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const y = yScale(name);

    if (!y) {
      return null;
    }

    return (
      <text
        key={`${i}_text_middle_${y}_${name}`}
        x={-5}
        y={y + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={10}
        style={{ pointerEvents: "none" }}
      >
        {name}
      </text>
    );
  });

  // const handleEditMode = () => {
  //   setIsInEditMode(!isInEditMode);
  // };

  const handleCloseEditorPopup = () => {
    setShowPatternEditorPopup(false);
    rebuildHeatmap();
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
    console.log("WHAT IS THE FILE NAME? ", selected);
    handleLatestSamples(selected.map((i:any)=>i.value), currentXVal.current, currentYVal.current);
  }

  function handleLatestNotesFinal (selected: any) {
    console.log("WHAT ARE THE NOTES? ", selected);
    handleLatestNotes(selected.map((i:any)=>i.value), currentXVal.current, currentYVal.current);
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
        alignItems: "center",

      }}>
      {showPatternEditorPopup && (

        <PortalCenterModal onClose={()=>handleCloseEditorPopup}>
          <Box
            key={`patternEditorPopupCloseButtonWrapper__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              background: 'rgba(0,0,0,0.78)',
              borderRadius: '8px',
            }}>
            <Box 
              key={`wrapCloseBtn__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
              sx={{
                textAlign: 'right',
                justifyContent: "stretch",
                alignItems: "stretch",
                display: "flex",
                flexDirection: "row-reverse",
                width: "50vw",
                padding: "0",
                margin: "0",
                cursor: "pointer",
              }}
            >
              <CloseIcon
                sx={{
                  zIndex: '9999',
                  display: "flex",
                  color: 'rgba(255,255,255,0.78)',
                  textAlign: 'right',
                  // width: '100%',
                }}
                key={`patternEditorPopupCloseButton__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                onClick={handleCloseEditorPopup}
              />
            </Box>

            <Box 
              key={`wrap_edit_popup__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}_${currentYVal.current}_${currentXVal.current}`}>


              <Box
                key={`wrapnewvals__${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: 'monospace',
                  fontWeight: '100',
                  // marginRight: '100px',
                  textAlign: 'left',
                  minWidth: '144px',
                  minHeight: "320px",
                  border: 'solid 0.5px rgb(175, 240, 91)',
                  borderRadius: '5px',
                  padding: '4px',
                  margin: '4px',
                  color: 'rgba(255,255,255,0.78)',
                }}
              >
                  <Box 
                    key={`wrap_new_details_${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                    sx={{ 
                      padding: '4px', 
                    }}>
                      <Box>
                        Cell: {
                          `${currentXVal.current} | ${currentYVal.current}`
                        }  
                      </Box>
                      <Box>
                        {/* Samples: {
                          new Set(Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].fileNums)) 
                        } */}


                        Samples:
                        <InsetCheckboxDropdown 
                          files={new Set(filesToProcess.map((f: any) => f.filename))} 
                          handleLatestSamplesFinal={handleLatestSamplesFinal} 
                          fileNumsPreselected={new Set(Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].fileNums)) } />
                      </Box>
                      <Box>              
                        Velocity: {
                          masterPatternsHashHook && 
                          masterPatternsHashHook.length > 0 &&
                          masterPatternsHashHook[`${currentYVal.current}`] &&
                          masterPatternsHashHook[`${currentYVal.current}`].length &&
                          Object.values(masterPatternsHashHook[`${currentYVal.current}`]).map((i: any) => i.velocity) || "No notes"
                        }
                      </Box>
                      <Box>
                        Notes: 
                        {/* {
                          masterPatternsHashHook && 
                          masterPatternsHashHook.length > 0 &&
                          masterPatternsHashHook[`${currentYVal.current}`] &&
                          masterPatternsHashHook[`${currentYVal.current}`].length &&
                          Object.values(masterPatternsHashHook[`${currentYVal.current}`]).map((i: any) => i.note) || "No notes"
                        } */}
                        
                        {masterPatternsHashHook && masterPatternsHashHook[`${currentYVal.current}`] && masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`] && 
                        (<InsetNotesDropdown 
                          notes={mTMidiNums} 
                          handleLatestNotesFinal={handleLatestNotesFinal} 
                          notesPreselected={Object.values(masterPatternsHashHook[`${currentYVal.current}`][`${currentXVal.current}`].notes || []) } 
                        />)}

                      </Box>
                  </Box>
                <span

                    style={{ 
                      display: "flex", 
                      flexDirection: "row",
                      justifyContent: "stretch", 
                    }}
                      key={`noteEditDisplaySpanWrapper_${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}>

                    Subdivisions:
                    <SubdivisionsPicker
                      xVal={currentXVal.current}
                      yVal={currentYVal.current}
                        masterPatternsHashHook={masterPatternsHashHook}
                      handleChangeCellSubdivisions={handleChangeCellSubdivisions}
                      cellSubdivisions={cellSubdivisions}
                    />
                  </span>
                </Box>
              <Box 
                key={`testanotherwrapperkey_${currentBeatCountToDisplay}_${currentNumerCountColToDisplay}_${currentDenomCount}_${currentPatternCount}`}
                sx={{
                  display: "flex", 
                  flexDirection: "row",
                  width: "calc(100% - 200px)",
                  height: "100%",
                  position: "relative",
                  boxSizing: "border-box"
                }}
              >
              </Box>
            </Box>
          </Box>
        </PortalCenterModal>
      )}

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
  );
};
