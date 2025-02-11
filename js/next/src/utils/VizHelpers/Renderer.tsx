import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Button, CardHeader, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import React from "react";
import FileWrapper from "@/app/components/FileWrapper";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";
import WaveSurfer from 'wavesurfer.js'
import { FOREST_GREEN, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE } from "../constants";
// import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
// import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'


const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

interface CellData {
  note: string[],
  velocity: number,
  subdivisions: number;
  on: boolean;
  xVal?: number;
  yVal?: number;
  zVal?: number;
  
}

type RendererProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: number }[];
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  editPattern: (x: any, y: any, group: any) => void;
  masterPatternsHashHook: any;
  masterPatternsHashHookUpdated: boolean;
  updateCellColor: (msg: boolean, xVal: number, yVal: number, zVal: number, elToChange: Element) => void;
  updateCellColorBool: boolean;
  inPatternEditMode: (state: boolean) => void;
  filesToProcess: any;
  selectFileForAssignment: (e: Event) => void;
  // sortFileItemUp: (e: Event) => void;
  // sortFileItemDown: (e: Event) => void;
  handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
  cellSubdivisions: number;
  resetCellSubdivisionsCounter: (x: number, y: number) => void;
  rebuildHeatmap: () => void;

  currentBeatCountToDisplay: number;
  currentNumerCountColToDisplay: number;
  currentDenomCount: number;
  currentPatternCount: number;

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
  // sortFileItemUp,
  // sortFileItemDown,
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter,
  rebuildHeatmap,
  currentBeatCountToDisplay,
  currentNumerCountColToDisplay,
  currentDenomCount,
  currentPatternCount,
}: RendererProps) => {

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [showPatternEditorPopup, setShowPatternEditorPopup] = useState<boolean>(false);
  const [wavesurfer, setWavesurfer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const theme = useTheme();

  const containerRef = useRef<any>();

  const currentXVal = useRef<number>(0);
  const currentYVal = useRef<number>(0);

  const surferBlob = useRef<any>();

  const cellData = useRef<CellData>({
    note: [""],
    velocity: 0,
    subdivisions: 1,
    on: true,
  });
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
        }
    }

    const triggerEditPattern = async (e: any, num: any) => {
      const el: any = Object.values(e.target)[1];
      const isFill = el.id.includes("fill");
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_", "").split("_");
      const xVal = num;
      const yVal = vals[1];
      const zVal = vals[2];
      resetCellSubdivisionsCounter(xVal, yVal);
      currentXVal.current = xVal;
      currentYVal.current = yVal;
      cellData.current = { 'xVal': xVal, 'yVal': yVal, 'zVal': zVal, ...masterPatternsHashHook[`${yVal}`][`${parseInt(xVal)}`] }
      getInstrumentName(yVal);
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
              const incrementorX: number = xScale.bandwidth() / Object.values(cellData.current)[8] || 0;
              return (
                <rect
                  key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
                  r={4}
                  id={`fill_${d.x}_${d.y}`}
          x={(xScale(d.x)! + (xScale.bandwidth() * idx) / masterPatternsHashHook[d.y][d.x].subdivisions)}
                  y={yScale(d.y)}
                  width={
                    cellData.current && 
                    Object.values(cellData.current)[0].length > 5 
                    ? 
                      (xScale.bandwidth() / Object.values(cellData.current)[8]) 
                    : 
              (xScale.bandwidth() / masterPatternsHashHook[d.y][d.x].subdivisions)
                  }
                  height={yScale.bandwidth()}
                  opacity={1}
          // fill={colorScale(d.value)}

          // currentBeatCountToDisplay,
          // currentNumerCountColToDisplay,
          // currentDenomCount,
          // currentPatternCount,

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
                  // rx={5}
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

  const handleEditMode = () => {
    setIsInEditMode(!isInEditMode);
  };

  const handleCloseEditorPopup = () => {
    setShowPatternEditorPopup(false);
    rebuildHeatmap();
  }

  const handleFillEdit = (e: any) => {
    console.log("FILL: ", e);
  }

  const handlePatternEditMode = () => {
    inPatternEditMode(true)
  }

  const removeExistingNote = (e: any) => {
    console.log("WHAT IS E TARGET FOR NOTE TO REMOVE? ", e.target.id.split('_'));
  }

  const onPlayPause = () => {
    if (wavesurfer) {
          wavesurfer.playPause()
      }
  }

  const subdivisionCount = cellData.current.subdivisions;

  const buttons = Array.from({ length: subdivisionCount }, (_, i) => (
    <Button key={`fillBtn_${i}_${i}`} id={`${i}`} onClick={handleFillEdit} />
  ));
  
  return (
    <Box
      key={`outerbox__${Object.values(cellData.current)[1]}`}
      style={{
        display: "flex",
        width: '100%',
        flexDirection: "row",
        textAlign: "center",
      }}>
      {showPatternEditorPopup && (
        <Box
          key={`patternEditorPopupCloseButtonWrapper_${Object.values(cellData.current)[1]}`}
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            textAlign: "left",
            background: 'rgba(0,0,0,0.78)',
            zIndex: "1001",
            width: "inherit",
          }}>
          <Box 
            key={`wrapCloseBtn__${Object.values(cellData.current)[1]}`}
            sx={{
            textAlign: 'right',
              width: "100vw",
            }}
          >
            <CloseIcon
              sx={{
                right: "0px",
                position: "absolute",
                top: "0px",
                zIndex: '1002'
              }}
              key={`patternEditorPopupCloseButton_${Object.values(cellData.current)[1]}`}
              onClick={handleCloseEditorPopup}
            />
          </Box>

          <Box key={`wrap_edit_popup_${Object.values(cellData.current)[1]}`}>
            <Box 
              key={`inner_wrap_edit_${Object.values(cellData.current)[1]}`}
              sx={{ 
                width: "inherit", 
                display: 'flex', 
                flexDirection: "row" 
              }}
            >
            <Box
              key={`content_wrap_${Object.values(cellData.current)[1]}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'monospace',
                fontWeight: '100',
                marginLeft: '10px',
                textAlign: 'left',
                minWidth: '4px',
                // width: '25%',
                border: 'solid 0.5px rgb(175, 240, 91)',
                borderRadius: '5px',
                // overflow: 'auto',
                padding: '4px',
                margin: '4px',
              }}
            >
              <span><b>Original Values</b></span>
                <Box 
                  key={`wrap_inst_name_${Object.values(cellData.current)[1]}`}
                  sx={{ 
                  padding: '4px', 
                  background: 'rgba(255,255,255,0.78)'
                }}>
                  {instrument}
                </Box>
                <Box 
                  key={`wrapcelldetails_${Object.values(cellData.current)[1]}`}
                  sx={{ 
                    padding: '4px', background: FOREST_GREEN
                  }}
                >
                  Cell {parseInt(Object.values(cellData.current)[0])}                
                    Velocity:{cellData.current.velocity}
                    Notes: {cellData.current.note}
                    Subdivisions: {cellData.current.subdivisions}
                </Box>
            </Box>
            <Box
              key={`wrapnewvals__${Object.values(cellData.current)[1]}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: 'monospace',
                fontWeight: '100',
                marginLeft: '10px',
                textAlign: 'left',
                minWidth: '144px',
                // width: '25%',
                border: 'solid 0.5px rgb(175, 240, 91)',
                borderRadius: '5px',
                // overflow: 'auto',
                padding: '4px',
                margin: '4px',
              }}
            >
                New Values
                <Box 
                  key={`wrap_new_inst__${Object.values(cellData.current)[1]}`}
                  sx={{ 
                    padding: '4px', 
                    background: 'rgba(255,255,255,0.78)'
                  }}>
                  {instrument}
                </Box>
                <Box 
                  key={`wrap_new_details_${Object.values(cellData.current)[1]}`}
                  sx={{ 
                  padding: '4px', 
                  background: FOREST_GREEN
                  }}>
                  Cell {parseInt(Object.values(cellData.current)[0])}                
                  Velocity: {cellData.current.velocity}
                  Notes: {cellData.current.note}
              </Box>
              <span

                  style={{ 
                    display: "flex", 
                    flexDirection: "row" 
                  }}
                    key={`noteEditDisplaySpanWrapper_${Object.values(cellData.current)[1]}`}>

                  Subdivisions:
                  <SubdivisionsPicker
                    xVal={parseInt(Object.values(cellData.current)[0])}
                    yVal={currentYVal.current}
                      masterPatternsHashHook={masterPatternsHashHook}
                    handleChangeCellSubdivisions={handleChangeCellSubdivisions}
                    cellSubdivisions={cellSubdivisions}
                  />
                </span>
              </Box>
            </Box>
            <Box 
              key={`testanotherwrapperkey_${Object.values(cellData.current)[1]}`}
              sx={{
                display: "flex", 
                flexDirection: "row",
                width: "calc(100% - 200px)",
                position: "relative",
                boxSizing: "border-box"
              }}
            >
              {cellData.current && cellData.current.note.length > 0 && (cellData.current.note).map((n: any, idx: number) => {
                return (
                  <Box 
                    key={`testanotherwrapperkey_${Object.values(cellData.current)[1]}_wrapper_${idx}`}
                    sx={{
                    position: 'relative',
                    display: 'flex',
                    boxSizing: 'border-box'
                  }}>
                <Button 
                  id={`noteEditDisp${idx}`} 
                  key={`noteEditDisp${idx}`} 
                  sx={{
                    fontSize: '20px',
                    border: 'solid 1px black',
                    background: MUTED_OLIVE,
                        color: FOREST_GREEN,
                    borderRadius: '40%',
                        pointerEvents: 'auto',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: '9999',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                  }}
                >
                 TESSSST {n}
                </Button>
                <CloseIcon
                  sx={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.78)',
                    right: '2px',
                    top: '2px',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: '9999',
                    position: 'absolute',
                  }}
                  key={`noteEditDisplayCloseIcon_${Object.values(cellData.current)[1]}`}
                  id={`${Object.values(cellData.current)[1]}_noteToRemove`}
                  onClick={(removeExistingNote)}
                />
              </Box>
              )})}
            </Box>
          </Box>
          <Box 
            sx={{ 
              width: "100%", 
              background: RUSTY_ORANGE, 
            }} 
            ref={containerRef} 
            key={`wavesurfer_${Object.values(cellData.current)[1]}_wrapper`}
            id={"wavesurfer-wrapper"}
          >

          </Box>
          <Box
            key={`testanotherfilewrapperkey_${Object.values(cellData.current)[1]}_wrapper2`}
            sx={{
              display: "flex",
              flexDirection: "row",
              fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: '100',
              marginLeft: '10px',
              textAlign: 'left',
              width: '100vw',
              fontSize: '12px',

            }}
          >
            {
              cellData.current.subdivisions > 1
                ?
                  <>{buttons}</>
                  :
                <></>
            }
          </Box>

        </Box>
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
