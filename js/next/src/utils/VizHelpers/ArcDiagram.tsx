import { Box } from "@mui/material";
import * as d3 from "d3";

import React, {useState, useEffect, useRef} from "react";
import D3DraggableTree from "./D3DraggableTree";
const COLORS = ["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"];
const MARGIN = { top: 20, right: 100, bottom: 20, left: 160 };
const TEXT_TO_NODE_PADDING = -16;

type Data = {
  nodes: { id: string; group: string, name: string }[];
  links: { source: string; target: string; value: number }[];
};

type ArcDiagramProps = {
  width: number;
  height: number;
  data: Data;
  handleClickName: (e: string, op: string) => void;
  updateCheckedFXList: (e: any) => void;
  handleUpdateFXChain: (e: any) => void;
  fxRadioValue: string;
};

export const ArcDiagram = ({ handleClickName, width, height, data, updateCheckedFXList, fxRadioValue, handleUpdateFXChain }: ArcDiagramProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom - 64;
  const [isHoveringToClose, setIsHoveringToClose] = useState<boolean>(false);
  const [hoverOnId, setHoverOnId] = useState<any>(null);
  const [fxChainsSelected, setFxChainsSelected] = useState<string>('Osc1');
  //
  // Compute the nodes
  //
  const d3FxChainSvg = useRef<any>(0);
  const parentContainer = useRef<any>(0) as any;

  const allNodeNames = data.nodes.map((node: any) => {
    node.key =`${node.id}_nodeNames`;
    return node.id
  });

  useEffect(() => {
      handleUpdateFXChain(fxRadioValue)
  }, [fxRadioValue]);

  const allNodeGroups = [...new Set(data.nodes.map((node) => node.group))];

  const yScale = d3.scalePoint().range([0, boundsHeight]).domain(allNodeNames);
  const xScale = d3.scalePoint().range([0, boundsWidth]).domain(allNodeNames);
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(allNodeGroups)
    .range(COLORS);

  const handleMouseOver = (e: any, id: any) => {
      setIsHoveringToClose(true);
      setHoverOnId(id);
  };

  const handleMouseOut = (e: any, id: any) => {
      setIsHoveringToClose(false);
      setHoverOnId(null);
  };

  const handleClickNameTriggerOpenFX = (e: any) => {
    console.log('wtf e OPEN FX?? ', e.target)
    handleClickName(e.target.id.split('_')[0], 'openfx');
  }
  const handleClickNameTriggerClose = (e: any) => {
     console.log('wtf e TRIGGER CLOSE? ', e.target.id)
    handleClickName(e.target.id.split('_')[0], 'remove');
  }
  const handleSwitchFX = (id: any) => {
    console.log("handle FX switch (ID): ", id);
    updateCheckedFXList({target: {value: id}});
  };

  // console.log('DATA NODES LENGTH! ', data.nodes);
  const allNodes = data.nodes.map((node: any, idx: number) => {

    return (
      // <>
        <g style={{
          marginTop: '48px', 
          height: `${height - 48}px`,
          width: `${2 * boundsWidth}px`,
          // borderRight: '1px solid rgba(147, 206, 214, 1)'
        }} 
          key={node.id}>

          
          <React.Fragment key={`${fxChainsSelected}`}>
          <circle
            cx={-TEXT_TO_NODE_PADDING * 5}
            cy={yScale(node.id)}
            key={`${node.id}_circle_remove`}
            r={16}
            fill={'rgba(255, 255, 255, 0.01)'}
            style={{padding: "2px"}}
            onMouseOut={(e: any) => handleMouseOut(e, node.id)}
            onMouseEnter={(e: any) => handleMouseOver(e, node.id)} 
          />
            <text
              x={-TEXT_TO_NODE_PADDING * 5}
              y={yScale(node.id)}
              fontSize={22}
              fill={'rgb(228, 225, 209)'}
              textAnchor={"middle"}
              alignmentBaseline={"middle"}
              id={`${node.id}_Xremove`}
              key={`${node.id}_text_remove`}
              onClick={handleClickNameTriggerClose}   
              onMouseOut={(e: any) => handleMouseOut(e, node.id)}
              onMouseEnter={(e: any) => handleMouseOver(e, node.id)}  
            >X</text>

          <circle
            cx={-TEXT_TO_NODE_PADDING * 8}
            cy={yScale(node.id)}
            key={`${node.id}_circle_edit`}
            r={16}
            // fill={'rgb(0, 0, 0, 1)'}
            fill={'rgba(255, 255, 255, 0.01)'}
            style={{padding: "2px"}}
            onMouseOut={(e: any) => handleMouseOut(e, node.id)}
            onMouseEnter={(e: any) => handleMouseOver(e, node.id)} 
          />
          
          <text
              x={-TEXT_TO_NODE_PADDING * 8}
              y={yScale(node.id)}
              fontSize={16}
              fill={'rgb(228, 225, 209)'}
              textAnchor={"middle"}
              id={`${node.id}_edit`}
              alignmentBaseline={"middle"}
              key={`${node.id}_textedit`}
              onClick={handleClickNameTriggerOpenFX}   
              onMouseOut={(e: any) => handleMouseOut(e, node.id)}
              onMouseEnter={(e: any) => handleMouseOver(e, node.id)}  
            >Edit</text>

          <circle
            cx={-TEXT_TO_NODE_PADDING * 2}
            cy={yScale(node.id)}
            id={node.id}
            key={`${node.id}_circle`}
            r={16}
            fill={isHoveringToClose && hoverOnId === node.id ? "#aaf" : colorScale(node.group)}
            style={{padding: "2px"}}
            onClick={() => handleSwitchFX(node.id)}
            onMouseOut={(e: any) => handleMouseOut(e, node.id)}
            onMouseEnter={(e: any) => handleMouseOver(e, node.id)} 
          />

          <text
            key={`${node.id}_text1`}
            onClick={handleClickNameTriggerOpenFX}
            id={`${node.id}_edit`}   
            x={TEXT_TO_NODE_PADDING}
            y={yScale(node.id)}
            textAnchor="end"
            fontSize={24}
            fill="rgba(223, 234,155, 1)"
            alignmentBaseline="middle"
            onMouseOut={(e: any) => handleMouseOut(e, node.id)}
            onMouseEnter={(e: any) => handleMouseOver(e, node.id)} 
          >
            {node.id}
          </text></React.Fragment>

        </g>

    );
  });

  //
  // Compute the links
  //
  const allLinks = data.links.map((link, i) => {
    // console.log('%cLINK!!!! ', 'color: #EE4B2B', link);
    const yStart = yScale(link.source);
    const xStart = 0;
    const yEnd = yScale(link.target);
    const xEnd: any = xScale(link.target);
    // console.log('XSTART/END! ', xStart, xEnd)
    if (typeof yStart === "undefined" || typeof yEnd === "undefined") {
      return;
    }

    return (
      <path
        key={i}
        // d={verticalArcGenerator(0, yStart, 0, yEnd)}
        d={verticalArcGenerator(-TEXT_TO_NODE_PADDING * 2, yStart, -TEXT_TO_NODE_PADDING * 2, yEnd)}
        stroke="rgba(158, 210, 162, 1)"
        fill="none"
      />
    );
  });

  const svgFXChain = <svg key={'fxSvg'} ref={d3FxChainSvg} width={width} height={height - 48}>
    <g 
      key={'fxG'}
      width={boundsWidth}
      height={boundsHeight - 48}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    >
      {allNodes}
      {allLinks}
    </g>
  </svg>

  useEffect(() => {
    if (fxRadioValue !== fxChainsSelected) {
      setFxChainsSelected(fxRadioValue);
    }
  }, [fxRadioValue])  

  return (
    <Box ref={parentContainer}>
      {/* {svgFXChain} */}
      <D3DraggableTree />
    </Box>
  );
};

/**
 * Get the d attribute of a SVG path element for an arc
 * that joins 2 points vertically
 * using an Elliptical Arc Curve
 * @returns {string} The d attribute of the path.
 */
const verticalArcGenerator = (
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number
) => {
  return [
    // the arc starts at the coordinate xStart, yStart
    "M",
    xStart,
    yStart,
    // A means we're gonna build an Elliptical Arc Curve
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#elliptical_arc_curve
    "A",
    ((yStart - yEnd) / 2) * 2, // rx: first radii of the ellipse (inflexion point)
    (yStart - yEnd) / 2, // ry: second radii of the ellipse  (inflexion point)
    90, // angle: rotation (in degrees) of the ellipse relative to the x-axis
    0, // large-arc-flag: large arc (1) or small arc (0)
    yStart < yEnd ? 1 : 0, // sweep-flag: the clockwise turning arc (1) or counterclockwise turning arc (0)
    // Position of the end of the arc
    xEnd,
    ",",
    yEnd,
  ].join(" ");
};
