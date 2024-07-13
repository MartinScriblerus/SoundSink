import { useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { Box } from "@mui/material";
import ArpSpeedSliders from "@/app/components/ArpSpeedSliders";

type HeatmapProps = {
  width: number;
  height: number;
  currentBeatCount: number;
  currentBeatSynthCount: number;
  currentNumerCount: number;
  currentDenomCount: number;
  handleOscRateUpdate: (val: any) => void;
  handleStkRateUpdate: (val: any) => void;
  handleSamplerRateUpdate: (val: any) => void;
  handleAudioInRateUpdate: (val: any) => void;
  // data: { x: string; y: string; value: number }[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const Heatmap = ({ 
  width, 
  height, 
  currentBeatCount,
  currentBeatSynthCount,
  currentNumerCount,
  currentDenomCount,
  handleOscRateUpdate,
  handleStkRateUpdate,
  handleSamplerRateUpdate,
  handleAudioInRateUpdate,
  // data
}: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);



  const nCol = 8;
  const nRow = 4;
  const patternarr: Array<any> = [];
  let counter = 0;
  Array.from(Array(7)).forEach(()=>{
    counter += 1;
    patternarr.push(counter);
  });
  
  
  type HeatmapData = { x: string; y: string; value: number }[];
  
  let heatmapData: HeatmapData = [];
  
  for (let x = 0; x < nCol; x++) {
    for (let y = 0; y < nRow; y++) {
      heatmapData.push({
        x: patternarr[x],
        y: patternarr[y],
        value: y !== 0 && x === (currentBeatCount % 8) ? 9 : (y === 0 && x === (currentBeatSynthCount % 2)) ? 18 : x,
  
      });
    }
  }

  return (
    <Box sx={{ 
      background: "rgba(30,34,26,0.96)",
      position: "relative", 
      // height: "100vh",
      // paddingTop: "8vh",
      left: '0px',
      width: '100%',
      zIndex: '40',
      height: `calc(100vh - 272px)`
    }}>
      <ArpSpeedSliders 
        handleOscRateUpdate={handleOscRateUpdate} 
        handleStkRateUpdate={handleStkRateUpdate} 
        handleSamplerRateUpdate={handleSamplerRateUpdate} 
        handleAudioInRateUpdate={handleAudioInRateUpdate}
      />    
      <Renderer
        width={width - 60}
        height={height}
        // data={data}
        data={heatmapData}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip 
        interactionData={hoveredCell} 
        width={width} 
        height={height} />
    </Box>
  );
};
