import { useEffect, useState } from "react";
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
  updateCellColor: (val: any) => void;
  updateCellColorBool: boolean; 
  // data: { x: string; y: string; value: number }[];

  filesToProcess: any[];
  currentNoteVals: any;
  numeratorSignature: number;
  denominatorSignature: number;
  editPattern: any;
  patternsHash: any;
  patternsHashUpdated: boolean;
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
  currentNoteVals,
  filesToProcess,
  handleOscRateUpdate,
  handleStkRateUpdate,
  handleSamplerRateUpdate,
  handleAudioInRateUpdate,
  numeratorSignature,
  denominatorSignature,
  editPattern,
  patternsHash,
  patternsHashUpdated,
  updateCellColor,
  updateCellColorBool
  // data
}: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  const nCol = numeratorSignature;
  const nRow = 4;
  const patternarr: Array<any> = [];
  let counter = 0;
  Array.from(Array(numeratorSignature * 2 - 1)).forEach(()=>{
    counter += 1;
    patternarr.push(counter);
  });
    
  useEffect(() => {
    if (updateCellColorBool) {
      updateCellColor(false);
    }
  }, [updateCellColorBool])

  // useEffect(() => {
  //   alert(`HEY HEY ${numeratorSignature}`);
  // }, [numeratorSignature])
  
  type HeatmapData = { x: string; y: string; value: number }[];
  
  let heatmapData: HeatmapData = [];
  
  for (let x = 0; x < nCol; x++) {
    for (let y = 0; y < nRow; y++) {
      heatmapData.push({
        x: patternarr[x],
        y: patternarr[y],
        value: y !== 0 && x === (currentNumerCount % numeratorSignature) ? 9 : (y === 0 && x === (currentBeatSynthCount)) ? 18 : x,
  
      });
    }
  }

  // const sayHello = (x: any, y: any, group: any) => {
  //   alert(`Hello!_${x}_${y}_${group}`);
  //   // X & Y VALS ARE 1-INDEXED!
  //   if (x === "undefined") {
  //     x = 8;
  //   }
  // }

  return (
    <Box sx={{ 
      background: "rgba(30,34,26,0.96)",
      position: "relative", 
      // height: "100vh",
      // paddingTop: "8vh",
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: '40',
      // height: `calc(100vh - 272px)`
    }}>
      <ArpSpeedSliders 
        handleOscRateUpdate={handleOscRateUpdate} 
        handleStkRateUpdate={handleStkRateUpdate} 
        handleSamplerRateUpdate={handleSamplerRateUpdate} 
        handleAudioInRateUpdate={handleAudioInRateUpdate}

        filesToProcess={filesToProcess}
        currentNoteVals={currentNoteVals}
      />    
      <Renderer
        width={width - 60}
        height={height}
        // data={data}
        data={heatmapData}
        setHoveredCell={setHoveredCell}
        editPattern={editPattern}
        patternsHash={patternsHash}
        patternsHashUpdated={patternsHashUpdated}
        updateCellColorBool={updateCellColorBool}
        updateCellColor={updateCellColor}
      />
      <Tooltip 
        interactionData={hoveredCell} 
        width={width} 
        height={height} />
    </Box>
  );
};
