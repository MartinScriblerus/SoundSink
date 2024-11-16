import { useEffect, useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { Box, useTheme } from "@mui/material";
import ArpSpeedSliders from "@/app/components/ArpSpeedSliders";

type HeatmapProps = {
  width: number;
  height: number;
  currentNumerCount: number;
  handleOscRateUpdate: (val: any) => void;
  handleStkRateUpdate: (val: any) => void;
  handleSamplerRateUpdate: (val: any) => void;
  handleAudioInRateUpdate: (val: any) => void;
  updateCellColor: (val: any) => void;
  updateCellColorBool: boolean; 
  currentBeatSynthCount: number;
  filesToProcess: any[];
  currentNoteVals: any;
  numeratorSignature: number;
  denominatorSignature: number;
  editPattern: any;
  patternsHash: any;
  patternsHashUpdated: boolean;
  inPatternEditMode:(state: boolean) => void;
  selectFileForAssignment: (e: Event) => void;
  sortFileItemUp: (e: Event) => void;
  sortFileItemDown: (e: Event) => void;
  handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
  cellSubdivisions: number;
  resetCellSubdivisionsCounter: (x: number, y: number) => void;
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
  instrument: string;
};

export const Heatmap = ({ 
  width, 
  height, 
  currentBeatSynthCount,
  currentNumerCount,
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
  updateCellColorBool,
  // data
  inPatternEditMode,
  selectFileForAssignment, 
  sortFileItemUp, 
  sortFileItemDown,
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter
}: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
  const [doRebuildHeatmap, setDoRebuildHeatmap] = useState<boolean>(false);

  const theme = useTheme();

  const nCol = numeratorSignature;
  const nRow = 4;
  const patternarr: Array<any> = [];
  let counter = 0;
  Array.from(Array(numeratorSignature * 2 - 1)).forEach(()=>{
    counter += 1;
    patternarr.push(counter);
  });
    
useEffect(() => {
  setDoRebuildHeatmap(true);
}, [doRebuildHeatmap])

  useEffect(() => {
    console.log("patterns hash updated: ", patternsHashUpdated);
  },[patternsHashUpdated])


  useEffect(() => {
    console.log("phash: ", patternsHash);
  }, [patternsHash.length])

  useEffect(() => {
    if (updateCellColorBool) {
      updateCellColor(false);
    }
  }, [updateCellColorBool])

  
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

  const rebuildHeatmap = () => {
    setDoRebuildHeatmap(true);
  }

  return (
    <Box sx={{ 
      background: theme.palette.secondaryB,
      position: "relative", 
      // height: "100vh",
      // paddingTop: "8vh",
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: '40',
      textAlign: 'center',
      justifyContent: 'center',
      paddingLeft: '24px'
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
{
// !patternsHashUpdated && (
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
        inPatternEditMode={inPatternEditMode}
        filesToProcess = {filesToProcess}
        selectFileForAssignment = {selectFileForAssignment}
        sortFileItemUp={sortFileItemUp}
        sortFileItemDown={sortFileItemDown}
        handleChangeCellSubdivisions={handleChangeCellSubdivisions}
        cellSubdivisions={cellSubdivisions}
        resetCellSubdivisionsCounter={resetCellSubdivisionsCounter}
        rebuildHeatmap={rebuildHeatmap}
      />
  // )
}
      <Tooltip 
        interactionData={hoveredCell} 
        width={width} 
        height={height}
        patternsHash={patternsHash}
      />
    </Box>
  );
};
