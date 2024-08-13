import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import React from "react";
import FileWrapper from "@/app/components/FileWrapper";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";

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
  patternsHash: any;
  patternsHashUpdated: boolean;
  updateCellColor: (msg: boolean, xVal: number, yVal: number, zVal: number, elToChange: Element) => void;
  updateCellColorBool: boolean;
  inPatternEditMode: (state: boolean) => void;
  filesToProcess: any;
  selectFileForAssignment: (e: Event) => void;
  sortFileItemUp: (e: Event) => void;
  sortFileItemDown: (e: Event) => void;
  handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
  cellSubdivisions: number;
  resetCellSubdivisionsCounter: (x: number, y: number) => void;
};

export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
  editPattern,
  patternsHash,
  patternsHashUpdated,
  updateCellColor,
  updateCellColorBool,
  inPatternEditMode,
  filesToProcess,
  selectFileForAssignment,
  sortFileItemUp,
  sortFileItemDown,
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter

}: RendererProps) => {

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [showPatternEditorPopup, setShowPatternEditorPopup] = useState<boolean>(false);
  const currentXVal = useRef<number>(0);
  const currentYVal = useRef<number>(0);

  const cellData = useRef<CellData>({
    note: [""],
    velocity: 0,
    subdivisions: 1,
    on: true,
  });
  const [instrument, setInstrument] = useState<string>('');
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const [min = 0, max = 0] = d3.extent(data.map((d) => d.value)); // extent can return [undefined, undefined], default to [0,0] to fix types

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth + 1])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

  var colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([min, max]);

  // Build the rectangles
  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.value === null || !x || !y) {
      return;
    }

    const getInstrumentName = (yVal: number) => {
      if (yVal === 1) {
        return setInstrument("Sample 1");
      } else if (yVal === 2) {
        return setInstrument("Sample 2");
      } else if (yVal === 3) {
        return setInstrument("Sample 3");
      } else if (yVal === 4) {
        return setInstrument("Sample 4");
      } else if (yVal === 5) {
        return setInstrument("Osc 1");
      } else if (yVal === 6) {
        return setInstrument("Osc 2");
      }
    }

    const triggerEditPattern = async (e: any,num: any) => {
      
      console.log("eeee ", num);
      // const el: any = Object.values(e.target)[1];
      const el: any = Object.values(e.target)[1];
      console.log("HEYO HEYO EL ", el);
      const isFill = el.id.includes("fill");
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_", "").split("_");

      const xVal = num;
      const yVal = vals[1];
      const zVal = vals[2];
      resetCellSubdivisionsCounter(xVal, yVal);
      currentXVal.current = xVal;
      currentYVal.current = yVal;

      cellData.current = { 'xVal': xVal, 'yVal': yVal, 'zVal': zVal, ...patternsHash[`${yVal}`][`${parseInt(xVal)}`] }
      
      getInstrumentName(yVal);

      console.log("%cCELL DATA!!!!!: ", "color: magenta;", cellData.current);

      setShowPatternEditorPopup(true);
      document.getElementById(`fill_${xVal}_${yVal}`);
      const elToChange: any = 
      // !isFill 
      // ? 
      // document.getElementById(`${xVal}_${yVal}`) 
      // : 
      document.getElementById(`fill_${xVal}_${yVal}`);
      if (elToChange && elToChange !== null && elToChange.style.fill !== "black") {
        return elToChange.style.fill = "black";
      } else {
        return elToChange.style.fill = colorScale(d.value);
      }
    }

    useEffect(() => {
      console.log("rerender");
    }, [updateCellColorBool]);
    console.log("Pattern hash updated? ", patternsHash);


    // MODIFY THIS TO ENABLE FILLS / ROLLS / POLYRHYTHMS / HOOKS ETC
    return (
      <React.Fragment key={`cellRectWrapper_${d.x}_${d.y}_${patternsHashUpdated}`}>
        {/* {(false == true)
          ?
          <rect
            key={`rectCellWrapper_${d.x}_${d.y}`}
            r={4}
            id={`${d.x}_${d.y}`}
            x={xScale(d.x)}
            y={yScale(d.y)}
            width={xScale.bandwidth()}
            height={yScale.bandwidth()}
            opacity={1}
            fill={colorScale(d.value)}
            // rx={5}
            stroke={"white"}
            onClick={(e: any) => triggerEditPattern(e, d.x)}
            onMouseEnter={(e) => {
              setHoveredCell({
                xLabel: "group " + d.x,
                yLabel: "group " + d.y,
                instrument: d.y && getInstrumentName(parseInt(d.y)) || "None",
                xPos: x + xScale.bandwidth() + MARGIN.left - 140,
                yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
                value: Math.round(d.value * 100) / 100,
              });
            }}
            onMouseLeave={() => setHoveredCell(null)}
            cursor="pointer"
            style={{ zIndex: 100, pointerEvents: "all" }}
          />
          : */}
          <React.Fragment 
            key={`rectFillsWrapper_${d.x}_${d.y}`}>
              {Array.apply(null, 
                // (new Array(Object.values(cellData.current)[2]))).map(
                (new Array(patternsHash[`${d.y}`][`${d.x}`]))).map(
                  (x, i) => { 
                    return i; 
                  }
                ).map((i, idx) => {
                  const incrementorX: number = xScale.bandwidth() / Object.values(cellData.current)[2] || 0;

                  return (
                    <rect
                      key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
                      r={4}
                      id={`fill_${d.x}_${d.y}`}
                      x={xScale(d.x)! + ((xScale.bandwidth() / parseFloat(d.x)) * idx)}
                      y={yScale(d.y)}
                      width={cellData.current && Object.values(cellData.current)[0].length > 5 ? xScale.bandwidth() / Object.values(cellData.current)[8] : xScale.bandwidth()  }
                      height={yScale.bandwidth()}
                      opacity={1}
                      fill={colorScale(d.value)}
                      // rx={5}
                      stroke={"white"}
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
                      style={{ zIndex: 100, pointerEvents: "all" }}
                    />
                  )
          })}</React.Fragment>
{/* 
        } */}
        </React.Fragment>);
  });

  const xLabels = allXGroups.map((name, i) => {
    const x = xScale(name);

    if (!x) {
      return null;
    }

    return (
      <text
        key={`middle_text_anchor_${i}`}
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
        key={`${i}_text_middle`}
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
    alert("good");
    setShowPatternEditorPopup(false);
  }

  const handleFillEdit = (e: any) => {
    console.log("AYEAYEAYE FILLLLLLL: ", e);
  }

  const handlePatternEditMode = () => {
    inPatternEditMode(true)
  }

  const removeExistingNote = (e: any) => {
    console.log("WHAT IS E TARGET FOR NOTE TO REMOVE? ", e.target.id.split('_'));
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: "80px"
      }}>
      {showPatternEditorPopup && (
        <Box
          key={"patternEditorPopupCloseButtonWrapper"}
          sx={{
            paddingTop: '24px',
            paddingBottom: '8px',
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            height: "60%",
            width: "92%",
            left: "4%",
            top: "0%",
            background: "rgba(0,0,0,0.9)",
            zIndex: "1001",
          }}>
          <Box sx={{
            textAlign: 'right',
            width: "100vw"
          }}>
            <CloseIcon
              sx={{
                right: "0px",
                position: "absolute",
                top: "0px",
              }}
              key={"patternEditorPopupCloseButton"}
              onClick={handleCloseEditorPopup}
            />
          </Box>
          <Box sx={{ width: "100%", display: 'flex', flexDirection: "row" }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: '100',
                marginLeft: '10px',
                textAlign: 'left',
                width: '25%',
                border: 'solid 0.5px rgb(175, 240, 91)',
                borderRadius: '5px',
                overflow: 'auto',
                padding: '8px',
                margin: '8px',
  
              }}
            >
              <span><b>Original Values</b></span>
              <Box sx={{padding: '4px', background: 'rgb(110, 64, 170)'}}>{instrument}</Box><Box sx={{padding: '4px', background: 'rgb(93, 89, 204)'}}> Cell {parseInt(Object.values(cellData.current)[0])}</Box>
              <span>Velocity:{cellData.current.velocity}</span>
              <span>Notes: {cellData.current.note}</span>
              <span>Subdivisions: {cellData.current.subdivisions}</span>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: '100',
                marginLeft: '10px',
                textAlign: 'left',
                width: '25%',
                border: 'solid 0.5px rgb(175, 240, 91)',
                borderRadius: '5px',
                // overflow: 'auto',
                padding: '8px',
                margin: '8px',
              }}
            >
              <span><b>New Values</b></span>
              <Box sx={{padding: '4px', background: 'rgb(110, 64, 170)'}}>{instrument}</Box> <Box sx={{padding: '4px', background: 'rgb(93, 89, 204)'}}> Cell {parseInt(Object.values(cellData.current)[0])}</Box>
              <span>Velocity: {cellData.current.velocity}</span>
              <span>Notes: {cellData.current.note}</span>

              <span
                key={`noteEditDisplaySpanWrapper_${Object.values(cellData.current)[1]}`}>
                <span 
                  style={{ 
                    display: "flex", 
                    flexDirection: "row" 
                  }}
                >
                  Subdivisions:
                  <SubdivisionsPicker
                    xVal={parseInt(Object.values(cellData.current)[0])}
                    yVal={currentYVal.current}
                    patternsHash={patternsHash}
                    handleChangeCellSubdivisions={handleChangeCellSubdivisions}
                    cellSubdivisions={cellSubdivisions}
                  />
                </span>
              </span>
            </Box>
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column",
                width: "calc(%50 - 64px)",
                position: "relative",
                boxSizing: "border-box"
              }}
            >
              {(cellData.current.note).map((n: any, idx: number) => {
                return (
                  <Box sx={{
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
                    background: 'rgb(27, 191, 202)',
                    color: '#ffffff',
                    borderRadius: '40%',
                    pointerEvents: 'all',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: '9999',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                  }}
                >
                  {n}
                </Button>
                <CloseIcon
                sx={{
                  fontSize: '16px',
                  color: 'white',
                  right: '2px',
                  top: '2px',
                  // top: '-8px', 
                  pointerEvents: 'all',
                  cursor: 'pointer',
                  zIndex: '9999',
                  position: 'absolute',
                  // height: '24px',
                  // width: '24px',
                }}
                key={`noteEditDisplayCloseIcon_${Object.values(cellData.current)[1]}`}
                id={`${Object.values(cellData.current)[1]}_noteToRemove`}
                onClick={(removeExistingNote)}
              />
              </Box>
                )
              })}


            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: '100',
              marginLeft: '10px',
              textAlign: 'left',
              width: '100%',
              background: "rgba(255,255,255,0.78)"
            }}
          >
            {
              cellData.current.subdivisions > 1
                ?
                Array.apply(null, (new Array(cellData.current.subdivisions))).map(function (x, i) { return i; })
                  .map((i: any, idx: number) => {
                    return (
                      <Button key={`fillBtn_${i[1]}_${idx}`} id={i[1]} onClick={handleFillEdit} />
                    )
                  }) :
                <Box
                  sx={{ 
                    fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif', 
                    fontWeight: '300' 
                  }}
                >
  
                  <Box
                    sx={{ display: "flex", width: "100vw" }}
                  >
                    <Button
                      style={{
                        background: "rgba(255,255,255,0.078)",
                        minWidth: "80px",
                        maxWidth: "30%",
                        justifyContent: "center",
                        width: "100%",
                      }}
                      onClick={handleEditMode}>{
                        isInEditMode ? "Edit Mode Off" : "Edit Mode On"
                      }
                    </Button>
                  </Box>

                  <FileWrapper
                    filesToProcess={filesToProcess}
                    selectFileForAssignment={selectFileForAssignment}
                    sortFileItemUp={sortFileItemUp}
                    sortFileItemDown={sortFileItemDown}

                  />
                </Box>
            }
          </Box>




          <Button
            key={"patternEnterEditMode"}
            onClick={handlePatternEditMode}
          >

          </Button>
        </Box>)}
      <svg
        key={"heatmapSVG"}
        width={width}
        height={height}
        style={{ pointerEvents: "none" }}
      >
        <g
          key={"heatmapGelement"}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          style={{ pointerEvents: "none" }}
        >
          {allShapes}
          {xLabels}
          {yLabels}
        </g>
      </svg>
    </Box>
  );
};
