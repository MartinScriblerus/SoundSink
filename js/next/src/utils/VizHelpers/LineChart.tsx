import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "react-spring";
import {VizDataProps} from "./LineChartWrapper";
const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
import {select, line} from 'd3';
import { useTheme } from "@mui/material";

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
  data: DataPoint[] | any;
  color: string;
  cursorPosition: number | null;
  setCursorPosition: (position: number | null) => void;
  timeNow: number;
  secLenBeat: number;
  beatCount: number;

  isInFileMode: boolean;
  fileTime: number | undefined | false;
  filesToProcess: any;
  graphNeedsUpdate: boolean;
  setGraphNeedsUpdate: any;
};

export const LineChart = ({
  width,
  height,
  data,
  cursorPosition,
  setCursorPosition,
  color,
  timeNow,
  secLenBeat,
  beatCount,
  isInFileMode,
  fileTime,
  filesToProcess,
  graphNeedsUpdate,
}: LineChartProps) => {

const theme = useTheme();

  // if (!data || data.length === 0) return;

  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width && width - MARGIN.right - MARGIN.left;
  const boundsHeight = height && height - MARGIN.top - MARGIN.bottom;

  const normalizeMax = data.length > 70 ? data.length - 70 : data ? (data.length * 3)/4 : 1;

  const pathRef = useRef(null);

  const staticLineGenerator = line(data)
    .x((d: any, idx: number) => xScale(idx))
    .y((d:any, idx: number) => yScale(d))


  useEffect(()=> {
    const thePath = select(pathRef.current);
    
    console.log("HEY HEY HEY HEY HEY THE PATH! ", thePath);
    console.log("DATA!@ ", data);
    if (data.length > 0 && thePath && filesToProcess.length > 0 && filesToProcess[0].data.length > 0) {
      console.log("mapped test: ", filesToProcess[0].data);
      thePath.selectAll('path')
      .data(data.map((i:any) => parseFloat(i)))
      .attr('d', staticLineGenerator(data))
      // thePath.data(mappedData(filesToProcess[0].data))
      console.log("WHAT IS DATA IN LINECHART? ", thePath);
      // setGraphNeedsUpdate(false);
    
    }
    
  }, [filesToProcess.length, graphNeedsUpdate, data, filesToProcess, staticLineGenerator]);



  // Y axis
  const [min, max]: any = data && data.length > 0 && d3.extent(data.slice(normalizeMax, data.length), (d: any) => d.y);
  const handleMinVariation: any = min && min >= 0 ? 0 : min ? min - min/4 : 0;
  const handleMaxVariation: any = max && max + (max/4) || 0;

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([handleMinVariation, handleMaxVariation])
      .range([boundsHeight, 0]);
  }, [boundsHeight, handleMinVariation, handleMaxVariation]);

  // X axis
  const [xMin, xMax]: any = d3.extent(data, (d: any) => d.x);

  const currTime = useRef<number>(0);

  // // const getDomain: any = [xMax ? xMax - 10 : xMin, xMax || 0];
  // const getDomain: any = [Math.floor(timeNow-10), Math.floor(timeNow)];

  useEffect(() => {
    currTime.current += secLenBeat;
  }, [beatCount, secLenBeat]);

  useEffect(() => {
    console.log("CHECK FILE TIME!!! ", fileTime);
    console.log("FILES TO PROCESS: ", filesToProcess);
    console.log("WTF IS DAT IN LINE CHART>?? ", data);
    
  }, [filesToProcess.length, isInFileMode, data, fileTime, filesToProcess]);

  // const getDomain: any = [0, Math.ceil(currTime.current)];

  // const getDomain: any = Math.ceil(currTime.current) > 10.0 ? [Math.ceil(currTime.current - 10.0), Math.ceil(currTime.current)]: [0, Math.ceil(currTime.current)];
  // const getStaticDomain: any = [0,Math.ceil(fileTime || 1)];

  // console.log("check get domain: ", getDomain);
  const xScale = useMemo(() => {
    const getDomain: any = Math.ceil(currTime.current) > 10.0 ? [Math.ceil(currTime.current - 10.0), Math.ceil(currTime.current)]: [0, Math.ceil(currTime.current)];
    const getStaticDomain: any = [0,Math.ceil(fileTime || 1)];
    if (isInFileMode ) {
    return d3
      .scaleTime()
      // .domain([0, xMax || 0])
      .domain(getDomain)
      .range([0, boundsWidth]);
    } else {
      return d3
      .scaleTime()
      // .domain([0, xMax || 0])
      .domain(getStaticDomain)
      .range([0, boundsWidth]);
    }
  }, [boundsWidth, isInFileMode, fileTime]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);
    svgElement
    .append("clipPath")  
    .attr("id", "clip")
    .append("rect")
    .attr("width", width-20)
    .attr("height", height);
    

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g")
      .attr("transform", "translate(" + boundsWidth + ", 0)") 
      .call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight, timeNow, boundsWidth, height, width]);

  // Build the line
  const lineBuilder = d3
    .line<any>()
    .x((d: any) => xScale(d.x))
    .y((d: any) => yScale(d.y));
  
  
  
  const linePath = lineBuilder(isInFileMode && filesToProcess && filesToProcess.length > 0 ? filesToProcess[0].data.map((i:any) => Number(parseFloat(i))) : data);
  console.log("LINEPATH: ", linePath);
  if (!linePath) {
    return null;
  }

  const getClosestPoint = (cursorPixelPosition: number) => {
    const x: any = xScale.invert(cursorPixelPosition);

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
    <div style={{width: "100%", backgroundColor: "transparent",}}>
      <svg 
        width={"100%"} 
        height={height} 
        style={{
          background: 'rgba(28,28,28,0.78)', 
          minHeight: "100%",  
          flexDirection: "row-reverse", 
          overflowX: "auto"}}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={pathRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <path
            id="pathEl"
            d={linePath}
            opacity={1}
            stroke={color}
            fill="purple"
            strokeWidth={2}
            clipPath={"url(#clip)"}
            width={boundsWidth}
          />


          {cursorPosition && (
            <Cursor
              height={boundsHeight}
              x={cursorPosition}
              y={yScale(getClosestPoint(cursorPosition)?.y as d3.NumberValue)}
              color={color}
            />
          )}
          {/* <rect
            x={0}
            y={0}
            width={boundsWidth}
            height={boundsHeight}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setCursorPosition(null)}
            visibility={"hidden"}
            pointerEvents={"all"}
          /> */}
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
