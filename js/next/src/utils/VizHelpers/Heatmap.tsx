import { useEffect, useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { Box, useTheme } from "@mui/material";
import ArpSpeedSliders from "@/app/components/ArpSpeedSliders";

type HeatmapProps = {
  width: number;
  height: number;
  currentNumerCount: number;
  handleOsc1RateUpdate: (val: any) => void;
  handleOsc2RateUpdate: (val: any) => void;
  handleMasterFastestRate: (val: any) => void;
  handleStkRateUpdate: (val: any) => void;
  handleSamplerRateUpdate: (val: any) => void;
  handleAudioInRateUpdate: (val: any) => void;
  updateCellColor: (val: any) => void;
  updateCellColorBool: boolean; 
  currentBeatSynthCount: number;
  currentNoteVals: any;
  numeratorSignature: number;
  filesToProcess: File[];
  denominatorSignature: number;
  editPattern: any;
  masterPatternsHashHook: any;
  masterPatternsHashHookUpdated: boolean;
  inPatternEditMode:(state: boolean) => void;
  selectFileForAssignment: (e: Event) => void;
  handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
  cellSubdivisions: number;
  resetCellSubdivisionsCounter: (x: number, y: number) => void;
  handleClickUploadedFiles: (x: any) => void;
  vizSource: string;

  currentBeatCountToDisplay: number;
  currentNumerCountColToDisplay: number;
  currentDenomCount: number;
  currentPatternCount: number;

  masterFastestRate: number;

  clickHeatmapCell: any;

  exitEditMode: () => void;
  isInPatternEditMode: boolean;

  handleLatestSamples: (    
    fileNames: string[],
    xVal: number,
    yVal: number
  ) => void;
  handleLatestNotes: (  
    notes: string[],
    xVal: number,
    yVal: number,
) => void;

  mTFreqs:number[];
  mTMidiNums:number[];
  updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any) => void;
  testChord: () => void;
  testScale: () => void;
  userInteractionUpdatedScore: (x: number) => void;
  handleAssignPatternNumber: (e: any) => void;
  doAutoAssignPatternNumber: number;
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
  handleOsc1RateUpdate,
  handleOsc2RateUpdate,
  handleMasterFastestRate,
  handleStkRateUpdate,
  handleSamplerRateUpdate,
  handleAudioInRateUpdate,
  numeratorSignature,
  denominatorSignature,
  editPattern,
  masterPatternsHashHook,
  masterPatternsHashHookUpdated,
  updateCellColor,
  updateCellColorBool,
  inPatternEditMode,
  selectFileForAssignment, 
  handleChangeCellSubdivisions,
  cellSubdivisions,
  resetCellSubdivisionsCounter,
  vizSource,

  currentBeatCountToDisplay,
  currentNumerCountColToDisplay,
  currentDenomCount,
  currentPatternCount,

  masterFastestRate,
  exitEditMode,
  clickHeatmapCell,
  isInPatternEditMode,

  handleLatestSamples,
  handleLatestNotes,

  mTFreqs,
  mTMidiNums,
  updateKeyScaleChord,
  testChord,
  testScale,
  userInteractionUpdatedScore,
  handleAssignPatternNumber,
  doAutoAssignPatternNumber,
}: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
  const [doRebuildHeatmap, setDoRebuildHeatmap] = useState<boolean>(false);

  const theme = useTheme();

  const nCol = numeratorSignature * denominatorSignature;
  const nRow = 4;
  const patternarr: Array<any> = [];
  let counter = 0;
  Array.from(Array(numeratorSignature * denominatorSignature * masterFastestRate)).forEach(()=>{
    counter += 1;
    patternarr.push(counter);
  });
    
useEffect(() => {
  setDoRebuildHeatmap(true);
  // exitEditMode();
}, [doRebuildHeatmap]);


  // useEffect(() => {
  //   console.log("patterns hash updated: ", masterPatternsHashHookUpdated);
  // },[masterPatternsHashHookUpdated])

  // useEffect(() => {
  //   console.log("phash: ", masterPatternsHashHook);
  // }, [masterPatternsHashHook.length])


  // useEffect(() => {
  //   if (updateCellColorBool) {
  //     updateCellColor(false);
  //   }
  // }, [updateCellColorBool])

  
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
      background: 'rgba(0,0,0,0.78)',
      // position: "relative", 
      left: '0',
      right: '0',
      zIndex: '40',
      textAlign: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
      height: '100%',
      width: '100%',
    }}>

      <Box sx={{
        width:'100%',
        justifyContent: 'center',
      }}>
        <ArpSpeedSliders 
          handleOsc1RateUpdate={handleOsc1RateUpdate} 
          handleOsc2RateUpdate={handleOsc2RateUpdate}
          handleMasterFastestRate={handleMasterFastestRate}
          handleStkRateUpdate={handleStkRateUpdate} 
          handleSamplerRateUpdate={handleSamplerRateUpdate} 
          handleAudioInRateUpdate={handleAudioInRateUpdate}
          filesToProcess={filesToProcess}
          currentNoteVals={currentNoteVals}
          vizSource={vizSource}
        />  
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          {
            <Renderer
              width={400}
              height={270}
              data={heatmapData}
              setHoveredCell={setHoveredCell}
              editPattern={editPattern}
              masterPatternsHashHook={masterPatternsHashHook}
              masterPatternsHashHookUpdated={masterPatternsHashHookUpdated}
              updateCellColorBool={updateCellColorBool}
              updateCellColor={updateCellColor}
              inPatternEditMode={inPatternEditMode}
              filesToProcess = {filesToProcess}
              selectFileForAssignment = {selectFileForAssignment}
              handleChangeCellSubdivisions={handleChangeCellSubdivisions}
              cellSubdivisions={cellSubdivisions}
              resetCellSubdivisionsCounter={resetCellSubdivisionsCounter}
              rebuildHeatmap={rebuildHeatmap}

              currentBeatCountToDisplay={currentBeatCountToDisplay}
              currentNumerCountColToDisplay={currentNumerCountColToDisplay}
              currentDenomCount={currentDenomCount}
              currentPatternCount={currentPatternCount}
              clickHeatmapCell={clickHeatmapCell}
              handleLatestSamples={handleLatestSamples}
              handleLatestNotes={handleLatestNotes}
              mTFreqs={mTFreqs}
              mTMidiNums={mTMidiNums}
              updateKeyScaleChord={updateKeyScaleChord}
              testChord={testChord}
              testScale={testScale}
              userInteractionUpdatedScore={userInteractionUpdatedScore}
              handleAssignPatternNumber={handleAssignPatternNumber}
              doAutoAssignPatternNumber={doAutoAssignPatternNumber}
              
            />
          }
          <Tooltip 
            interactionData={hoveredCell} 
            width={width || 0} 
            height={height || 0}
            masterPatternsHashHook={masterPatternsHashHook}
            isInPatternEditMode={isInPatternEditMode}
          />
        </Box>
      </Box>
    </Box>
  );
};
