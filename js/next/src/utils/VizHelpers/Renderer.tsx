import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { Box, Button } from "@mui/material";
import React from "react";

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
}: RendererProps) => {

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const showPatternEditorPopup = useRef<boolean>(false);
  const cellData = useRef<CellData>({
    note: [""],
    velocity: 0,
    subdivisions: 0,
    on: true,
  });

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



    const triggerEditPattern = async (e: any) => {
      const el: any = Object.values(e.target)[1];
      const isFill =  el.id.includes("fill");
      const vals = !isFill ? el.id.split("_") : el.id.replace("fill_","").split("_");
      // const vals = el.id.split("_");
      // console.log("PARSED DATA! ", JSON.parse(el.key));
      // editPattern(vals[0], vals[1], vals[2]);
      const xVal = vals[0];
      const yVal = vals[1];
      const zVal = vals[2];
      console.log("X Y Z : ", xVal, yVal, zVal);
      console.log("PATTERNS HASH! ", patternsHash);


      cellData.current = {...patternsHash[`sample_${yVal}`][`${xVal}_${yVal}`], 'xVal': xVal, 'yVal': yVal, 'zVal': zVal}
      console.log("%cCELL DATA!!!!!: ", "color: magenta;", cellData.current);
      // const triviallyParsedCellData = await JSON.parse(cellData);
      showPatternEditorPopup.current = true;
      const editDone = new Promise(async (resolve: any) => {
        const loop = () => {
          
          setTimeout(() => {
            console.log("in setTimeout outer");
            // Your logic here
            if (showPatternEditorPopup.current === false) {
              resolve(true);
              // clearTimeout(this);
              // console.log("cleared timeout");
              return;
            } else {
              loop();
            }
          }, 500);
        };
        loop();
      });
          
      editDone.then(() => {
        // =>>> THIS NEXT METHOD DOES THE TURNING OFF AND ON (could or should do other things, given its name)
        // The following method handles updates to patternHash.current
        editPattern(vals[0], vals[1], vals[2]);
        // The following methods handle updates to d3 heatmap elements on the dom
        const elToChange: any = !isFill ? document.getElementById(`${xVal}_${yVal}_${zVal}`) : document.getElementById(`fill_${xVal}_${yVal}_${zVal}`);
        if (elToChange && elToChange !== null && elToChange.style.fill !== "black") {
          return elToChange.style.fill = "black";
        } else {
          return elToChange.style.fill = colorScale(d.value);
        }
      });

      // // =>>> THIS NEXT METHOD DOES THE TURNING OFF AND ON (could or should do other things, given its name)
      // // The following method handles updates to patternHash.current
      // editPattern(vals[0], vals[1], vals[2]);
      // // The following methods handle updates to d3 heatmap elements on the dom
      // const elToChange: any = await document.getElementById(`${xVal}_${yVal}_${zVal}`);
      // if (elToChange && elToChange.style.fill !== "black") {
      //   return elToChange.style.fill = "black";
      // } else {
      //   return elToChange.style.fill = colorScale(d.value);
      // }
    }

    useEffect(() => {
      console.log("rerender");
    },[updateCellColorBool]);

    // MODIFY THIS TO ENABLE FILLS / ROLLS / POLYRHYTHMS / HOOKS ETC
    return (
     <React.Fragment key={`cellRectWrapper_${d.x}_${d.y}`}>
      { (i % 2 === 0) 
      ? 
      <rect
        key={`rectCellWrapper_${d.x}_${d.y}`}
        r={4}
        id={`${d.x}_${d.y}_${d.value}`}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        // rx={5}
        stroke={"white"}
        onClick={triggerEditPattern}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: "group " + d.x,
            yLabel: "group " + d.y,
            xPos: x + xScale.bandwidth() + MARGIN.left,
            yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
            value: Math.round(d.value * 100) / 100,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        cursor="pointer"
        style={{zIndex: 100, pointerEvents: "all"}}
      />
  : 
  <React.Fragment key={`rectFillsWrapper_${d.x}_${d.y}`}>{[1,2,3,4].map((i, idx) => {
    const incrementorX: number = xScale.bandwidth() / 4 || 0;
    return (
      <rect
        key={i + "_rectFills_" + idx + "_sequencer" + d.y + d.x}
        r={4}
        id={`fill_${idx}_${d.y}_${d.value}`}
        x={xScale(d.x)! + ((xScale.bandwidth()/4) * idx)}
        y={yScale(d.y)}
        width={xScale.bandwidth()/4}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        // rx={5}
        stroke={"white"}
        onClick={triggerEditPattern}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: "group " + d.x,
            yLabel: "group " + d.y,
            xPos: x + xScale.bandwidth() + MARGIN.left,
            yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
            value: Math.round(d.value * 100) / 100,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        cursor="pointer"
        style={{zIndex: 100, pointerEvents: "all"}}
      />
    )
  })}</React.Fragment>
    
  }</React.Fragment>);});

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
        style={{pointerEvents:"none"}}
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
        style={{pointerEvents:"none"}}
      >
        {name}
      </text>
    );
  });

  const handleEditMode = () => {
    setIsInEditMode(!isInEditMode);
  };

  const handleCloseEditorPopup = () => {
    showPatternEditorPopup.current = false;
  }

  const handleFillEdit = (e: any) => {
    console.log("AYEAYEAYE FILLLLLLL: ", e);
  }

  return (
    <Box 
      style={{
        display:"flex", 
        flexDirection: "column", 
        textAlign: "center"
      }}>
      {showPatternEditorPopup.current && (
        <Box 
          key={"patternEditorPopupCloseButtonWrapper"} 
          sx={{
            position: "absolute", 
            display:"flex", 
            flexDirection: "column", 
            textAlign: "center", 
            height: "60%", 
            width: "80%", 
            left: "10%",
            background: "rgba(0,0,0,1)"
          }}>
            {
              cellData.current.subdivisions > 0 
              ? cellData.current.note.map((i: any) => {
                return (
                  <Button key={`fillBtn_${i}`} id={i} onClick={handleFillEdit}/>
                )
              }) :
                <>
                  <h3><b>Note:</b> {cellData.current.note.toString()}</h3>
                  <h3><b>Velocity:</b> {cellData.current.velocity.toString()}</h3>
                  <h3><b>Count:</b> {cellData.current.xVal}</h3>
                  <h3><b>Instrument:</b> {cellData.current.yVal}</h3>
                </>
            }


        <Button 
          key={"patternEditorPopupCloseButton"}
          onClick={handleCloseEditorPopup}
        >
          Close Editor
        </Button>
      </Box>)}
      <svg key={"heatmapSVG"} width={width} height={height} style={{pointerEvents:"none"}}>
        <g
          key={"heatmapGelement"}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          style={{pointerEvents:"none"}}
        >
          {allShapes}
          {xLabels}
          {yLabels}
        </g>
      </svg>
      <Button style={{background: "rgba(255,255,255,0.078)", minWidth: "80px", marginLeft: "48px", maxWidth: "30%", justifyContent:"center"}} onClick={handleEditMode}>{isInEditMode ? "Exit" : "Edit"}</Button>
    </Box>
  );
};
