import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Button, CardHeader, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import React from "react";
import FileWrapper from "@/app/components/FileWrapper";
import SubdivisionsPicker from "@/app/components/SubdivisionsPicker";
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'


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
  rebuildHeatmap: () => void;
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
  resetCellSubdivisionsCounter,
  rebuildHeatmap
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
      
      const isFill = el.id.includes("fill");
      
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_", "").split("_");

      const xVal = num;
      const yVal = vals[1];
      const zVal = vals[2];
      console.log("HEYO HEYO EL ", isFill, xVal, yVal);
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


    // MODIFY THIS TO ENABLE FILLS / ROLLS / POLYRHYTHMS / HOOKS ETC
    return (
      <>
        {
          !showPatternEditorPopup && (
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
                  new Array(patternsHash[`${d.y}`][`${d.x}`].subdivisions)).map(
                    (x, i) => {
                      // console.log("whhhhhhhhhat is i? ", x, i) 
                      return x; 
                    }
                  ).map((i, idx) => {
                    const incrementorX: number = xScale.bandwidth() / Object.values(cellData.current)[8] || 0;



                    return (
                      <rect
                        key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
                        r={4}
                        id={`fill_${d.x}_${d.y}`}
                        x={(xScale(d.x)! + (xScale.bandwidth() * idx) / patternsHash[d.y][d.x].subdivisions)}
                        y={yScale(d.y)}
                        width={
                          cellData.current && 
                          Object.values(cellData.current)[0].length > 5 
                          ? 
                            (xScale.bandwidth() / Object.values(cellData.current)[8]) 
                          : 
                            (xScale.bandwidth() / patternsHash[d.y][d.x].subdivisions)
                        }
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
        </React.Fragment>
          )
        }
      </>
      );
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

    // const onReady = (ws:any) => {
    useEffect(() => {
      console.log("HERE! ");


      // Initialize the Regions plugin
      const regions = RegionsPlugin.create()
      if(containerRef.current && filesToProcess && filesToProcess.length > 0) {
        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#4F4A85',
          progressColor: '#383351',
          // url: '/audio.mp3',
          plugins: [regions],
        })
      
        surferBlob.current = new window.Blob([new Uint8Array(filesToProcess[0].data)]);
        wavesurfer && surferBlob.current && filesToProcess.length > 0 && wavesurfer.loadBlob(surferBlob.current).then((data: any) => console.log("yeehaw ", data))


// Play on click
wavesurfer.on('interaction', () => {
  wavesurfer.play()
})

// Rewind to the beginning on finished playing
wavesurfer.on('finish', () => {
  wavesurfer.setTime(0)
})


regions.enableDragSelection({
  color: 'rgb(27, 191, 202, 0.2)',
})

regions.on('region-updated', (region) => {
  console.log('Updated region', region)
})

// Loop a region on click
let loop = true
// Toggle looping with a checkbox
// document.querySelector('input[type="checkbox"]')!.addEventListener("click", (e: any) => {
//   loop = e.target.checked
// })
loop = true;

{
  let activeRegion: any = null
  regions.on('region-in', (region) => {
    console.log('region-in', region)
    activeRegion = region
  })
  regions.on('region-out', (region) => {
    console.log('region-out', region)
    if (activeRegion === region) {
      if (loop) {
        region.play()
      } else {
        activeRegion = null
      }
    }
  })
  regions.on('region-clicked', (region, e) => {
    e.stopPropagation() // prevent triggering a click on the waveform
    activeRegion = region
    region.play()
    region.setOptions({
      color: '#aaf',
      start: 0
    })
  })
  // Reset the active region when the user clicks anywhere in the waveform
  wavesurfer.on('interaction', () => {
    activeRegion = null
  })
}

// Update the zoom level on slider change
  wavesurfer.once('decode', () => {
    document.querySelector('input[type="range"]')?.addEventListener('input', (e: any) => {
      const minPxPerSec = Number(e.target.value)
      wavesurfer.zoom(minPxPerSec)
    })
  });

   
        setWavesurfer(wavesurfer)
        setIsPlaying(false)
    }

    },[containerRef.current])
      // loadBlobToWaveSurfer.then((data: any) => console.log("YEEHAW DATA: ", data));
      


  const onPlayPause = () => {
      if(wavesurfer){
          wavesurfer.playPause()
      }
  }

  return (
    <Box
      style={{
        display: "flex",
        width: 'calc(100% - 200px)',
        flexDirection: "column",
        textAlign: "center",
        // paddingTop: window.innerHeight < 650 ? "30px" : "92px"
      }}>
      {showPatternEditorPopup && (
        <Box
          key={"patternEditorPopupCloseButtonWrapper"}
          sx={{
            // padding: '24px',
            paddingBottom: '8px',
            position: "relative",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            height: "46%",
            width: "100%%",
            // left: "4%",
            top: "16%",
            background: theme.palette.black,
            zIndex: "1001",
          }}>
          {/* <CardHeader style={{
            textAlign: 'left',
            fontSize: '16px',
            width: '100%',
            height: '24px',
            background: theme.palette.primaryB,
            color: theme.palette.white
          }}>Pattern Editor */}
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
          {/* </CardHeader>   */}
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
              <Box sx={{padding: '4px', background: theme.palette.white}}>{instrument}</Box><Box sx={{padding: '4px', background: theme.palette.primaryA}}> Cell {parseInt(Object.values(cellData.current)[0])}</Box>
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
              <Box sx={{
                  padding: '4px', 
                  background: theme.palette.primaryA
                }}>{instrument}
              </Box> 
              <Box sx={{
                padding: '4px', 
                background: theme.palette.primaryB
              }}> Cell {parseInt(Object.values(cellData.current)[0])}
              </Box>
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
                    background: theme.palette.primaryB,
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
                  pointerEvents: 'all',
                  cursor: 'pointer',
                  zIndex: '9999',
                  position: 'absolute',
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

          <div style={{width: "100%"}} ref={containerRef} id={"wavesurfer-wrapper"}>

          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: '100',
              marginLeft: '10px',
              textAlign: 'left',
              width: '100vw',
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

                  <FileWrapper
                    filesToProcess={filesToProcess}
                    selectFileForAssignment={selectFileForAssignment}
                    sortFileItemUp={sortFileItemUp}
                    sortFileItemDown={sortFileItemDown}

                  />
                </Box>
            }
          </Box>

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
