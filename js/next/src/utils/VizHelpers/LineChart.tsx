import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "react-spring";
import {VizDataProps} from "./LineChartWrapper";
const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type DataPoint = { 
  x: number; 
  y: number; 
  y_flux: number;
  y_rms: number;
  y_rollOff50: number;
  y_rollOff85: number;
  y_xCross: number;
};
type LineChartProps = {
  selectedViz: string;
  width: number;
  height: number;
  data: DataPoint[];
  color: string;
  cursorPosition: number | null;
  setCursorPosition: (position: number | null) => void;
  centroid:  {
    source: string;
    value: number;
  };
  flux: {
    source: string;
    value: number;
  }; 
  rms: {
    source: string;
    value: number;
  };
  mfccEnergy: {
    source: string;
    value: number;
  }; 
  mfccVals: {
    source: string;
    value: Array<any>;
  }; 
  rollOff50: {
    source: string;
    value: number;
  }; 
  rollOff85: {
    source: string;
    value: number;
  }; 
  chroma: {
    source: string;
    value: number[];
  }; 
  xCross: number; 
  dct: Array<any>; 
  featureFreq: {
    source: string;
    value: number;
  };
  featureGain: {
    source: string;
    value: number;
  };
  kurtosis: {
    source: string;
    value: number;
  };
  sfm: {
    source: string;
    value: number[];
  };
  sampleRate: number;
  timeNow: number;
};

export const LineChart = ({
  selectedViz,
  width,
  height,
  data,
  cursorPosition,
  setCursorPosition,
  color,
  centroid,
  flux, 
  rms,
  mfccEnergy,
  mfccVals,
  rollOff50, 
  rollOff85, 
  chroma, 
  xCross, 
  dct, 
  featureFreq, 
  featureGain, 
  kurtosis, 
  sfm,
  sampleRate,
  timeNow,
}: LineChartProps) => {

  if (!data || data.length === 0) return;
 
  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width && width - MARGIN.right - MARGIN.left;
  const boundsHeight = height && height - MARGIN.top - MARGIN.bottom;

  const normalizeMax = data.length > 70 ? data.length - 70 : data ? (data.length * 3)/4 : 1;
  // Y axis
  const [min, max] = d3.extent(data.slice(normalizeMax, data.length), (d) => d.y);
  const handleMinVariation: any = min && min >= 0 ? 0 : min ? min - min/4 : 0;
  const handleMaxVariation: any = max && max + (max/4) || 0;

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([handleMinVariation, handleMaxVariation])
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      // .domain([0, xMax || 0])
      .domain([xMax ? xMax - 10 : 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);
    svgElement.append("clipPath")  
    .attr("id", "clip")
    .append("rect")
    .attr("width", width-20)
    .attr("height", height);
    

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g")
      .attr("transform", "translate(" + boundsWidth + ", 0)") 
      .call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
  
  const fluxLineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y_flux));
  
  const rmsLineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y_rms));
  
  const rollOff50LineBuilder = d3
   .line<DataPoint>()
   .x((d) => xScale(d.x))
   .y((d) => yScale(d.y_rollOff50));

  const rollOff85LineBuilder = d3
   .line<DataPoint>()
   .x((d) => xScale(d.x))
   .y((d) => yScale(d.y_rollOff85));
  
  const xCrossLineBuilder = d3
   .line<DataPoint>()
   .x((d) => xScale(d.x))
   .y((d) => yScale(d.y_xCross));
  
  const linePath = lineBuilder(data);
  const fluxLinePath = fluxLineBuilder(data);
  const rmsLinePath = rmsLineBuilder(data);
  const rollOff50LinePath = rollOff50LineBuilder(data);
  const rollOff85LinePath = rollOff85LineBuilder(data);
  const xCrossLinePath = xCrossLineBuilder(data);


  if (!linePath || !fluxLinePath || !rmsLinePath || !rollOff50LinePath || !rollOff85LinePath || !xCrossLinePath) {
    return null;
  }

  //
  const getClosestPoint = (cursorPixelPosition: number) => {
    const x = xScale.invert(cursorPixelPosition);

    let minDistance = Infinity;
    let closest: DataPoint | null = null;

    for (const point of data) {
      const distance = Math.abs(point.x - x);
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    }

    return closest;
  };

  //
  const onMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const closest = getClosestPoint(mouseX);

    closest && setCursorPosition(xScale(closest.x));
  };

  return (
    <div style={{width: "100%"}}>
      <svg width={width} height={height} style={{background: "rgba(0,0,0,.91)", minHeight: "100%", flexDirection: "row-reverse", overflowX: "scroll"}}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <path
            d={linePath}
            opacity={1}
            stroke={color}
            fill="none"
            strokeWidth={2}
            clipPath={"url(#clip)"}
            width={boundsWidth}
          />
          {/* <path
            d={fluxLinePath}
            opacity={1}
            stroke={"orange"}
            fill="none"
            strokeWidth={2}
          />
          <path
            d={rmsLinePath}
            opacity={1}
            stroke={"red"}
            fill="none"
            strokeWidth={2}
          />
          <path
            d={rollOff50LinePath}
            opacity={1}
            stroke={"green"}
            fill="none"
          />
          <path
            d={rollOff85LinePath}
            opacity={1}
            stroke={"blue"}
            fill="none"
          />
          <path
            d={xCrossLinePath}
            opacity={1}
            stroke={"purple"}
            fill="none"
          /> */}

          {cursorPosition && (
            <Cursor
              height={boundsHeight}
              x={cursorPosition}
              y={yScale(getClosestPoint(cursorPosition)?.y as d3.NumberValue)}
              color={color}
            />
          )}
          <rect
            x={0}
            y={0}
            width={boundsWidth}
            height={boundsHeight}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setCursorPosition(null)}
            visibility={"hidden"}
            pointerEvents={"all"}
          />
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};

type CursorProps = {
  x: number | undefined;
  y: number;
  height: number;
  color: string;
};

const Cursor = ({ x, y, height, color }: CursorProps) => {
  const springProps: any = useSpring({
    to: {
      x,
      y,
    },
  });

  if (!springProps.x) {
    return null;
  }

  return (
    <>
      <animated.line
        x1={springProps.x}
        x2={springProps.x}
        y1={0}
        y2={height}
        stroke="black"
        strokeWidth={1}
      />
      <circle cx={x} cy={y} r={5} fill={color} />
    </>
  );
};
