import { useEffect, useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { Box, useTheme } from "@mui/material";
import ArpSpeedSliders from "@/app/components/ArpSpeedSliders";
import { Tune } from "@/tune";

type HeatmapProps = {
  isChuckRunning: boolean; 
  width: number;
  height: number;
  currentNumerCount: number;
  handleOsc1RateUpdate: (val: any) => void;
  // handleOsc2RateUpdate: (val: any) => void;
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

  updateMicroTonalScale: (scale: any) => void;

  mTFreqs:number[];
  mTMidiNums:number[];
  updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any, f: any, g: any) => void;
  userInteractionUpdatedScore: (x: number) => void;
  handleAssignPatternNumber: (e: any) => void;
  doAutoAssignPatternNumber: number;



  setStkValues: React.Dispatch<React.SetStateAction<any>>; 
  tune: Tune;
  currentMicroTonalScale: (scale: any) => void;
  setFxKnobsCount: React.Dispatch<React.SetStateAction<number>>;
  doUpdateBabylonKey: any;
  // setBabylonKey={setBabylonKey}
  babylonKey: string;
  // setNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  currentScreen: React.MutableRefObject<string>;
  currentFX: React.MutableRefObject<any>;
  currentStkTypeVar: React.MutableRefObject<string>;
  // universalSources={universalSources}
  updateCurrentFXScreen: any;

  getSTK1Preset: (x: string) => any; 
  universalSources: React.MutableRefObject<any>;
  mingusKeyboardData: any;
  mingusChordsData: any;
  updateMingusData: (data: any) => void;
  handleChangeNotesAscending: (order: string) => void;
  mTNames: string[];
  fxRadioValue: string;
  noteBuilderFocus: string;
  handleNoteBuilder: (focus: string) => void;
  exitEditMode: () => void;
  handleNoteLengthUpdate: (e: any, cellData: any) => void;
  handleNoteVelocityUpdate: (e: any, cellData: any) => void;
  currentSelectedCell: { x: number; y: number };
  octaveMax: number;
  octaveMin: number;
  uploadedBlob: React.MutableRefObject<any>;
  getMeydaData: (fileData: ArrayBuffer) => Promise<any>;
  clickedFile: React.MutableRefObject<string | null>;
  chuckRef: React.MutableRefObject<any>;
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
  isChuckRunning,
  width, 
  height, 
  currentBeatSynthCount,
  currentNumerCount,
  currentNoteVals,
  filesToProcess,
  handleOsc1RateUpdate,
  // handleOsc2RateUpdate,
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
  clickHeatmapCell,
  isInPatternEditMode,

  handleLatestSamples,
  handleLatestNotes,

  mTFreqs,
  mTMidiNums,
  updateKeyScaleChord,
  userInteractionUpdatedScore,
  handleAssignPatternNumber,
  doAutoAssignPatternNumber,

  setStkValues,
  tune,
  currentMicroTonalScale,
  setFxKnobsCount,
  doUpdateBabylonKey,
  // setBabylonKey,
  babylonKey,
  // setNeedsUpdate,
  currentScreen,
  currentFX,
  currentStkTypeVar,
  // universalSources,
  updateCurrentFXScreen,
  getSTK1Preset,
  universalSources,
  updateMicroTonalScale,
  mingusKeyboardData,
  mingusChordsData,
  updateMingusData,
  handleChangeNotesAscending,
  mTNames,
  fxRadioValue,
  noteBuilderFocus,
  handleNoteBuilder,
  exitEditMode,
  handleNoteLengthUpdate,
  handleNoteVelocityUpdate,
  currentSelectedCell,
  octaveMax,
  octaveMin,
  uploadedBlob,
  getMeydaData,
  clickedFile,
  chuckRef
}: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
  const [doRebuildHeatmap, setDoRebuildHeatmap] = useState<boolean>(false);

  const theme = useTheme();

  useEffect(() => {
    setDoRebuildHeatmap(true);
  }, [doRebuildHeatmap]);

  type HeatmapData = { x: string; y: string; value: number }[];
    
  const nCol = numeratorSignature * denominatorSignature;
  const nRow = denominatorSignature;  // if that's your row count

  const xLabels = Array.from({ length: nCol }, (_, i) => i);
  const yLabels = Array.from({ length: nRow }, (_, i) => i + 1);

  let heatmapData: HeatmapData = [];

  for (let x of xLabels) {
    for (let y of yLabels) {
      heatmapData.push({
        x: x.toString(),
        y: y.toString(),
        value: x,  // or whatever makes sense
      });
    }
  }

  const rebuildHeatmap = () => {
    setDoRebuildHeatmap(true);
  }

  return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
            {
              <Renderer
                isChuckRunning={isChuckRunning}
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
                userInteractionUpdatedScore={userInteractionUpdatedScore}
                handleAssignPatternNumber={handleAssignPatternNumber}
                doAutoAssignPatternNumber={doAutoAssignPatternNumber}
                setStkValues={setStkValues}
                tune={tune}
                currentMicroTonalScale={currentMicroTonalScale}
                setFxKnobsCount={setFxKnobsCount}
                doUpdateBabylonKey={doUpdateBabylonKey}
                // setBabylonKey={setBabylonKey}
                babylonKey={babylonKey}
                // setNeedsUpdate={setNeedsUpdate}
                currentScreen={currentScreen}
                currentFX={currentFX}
                currentStkTypeVar={currentStkTypeVar}
                // universalSources={universalSources}
                updateCurrentFXScreen={updateCurrentFXScreen}
                getSTK1Preset={getSTK1Preset} 
                universalSources={universalSources} 
                updateMicroTonalScale={updateMicroTonalScale}
                mingusKeyboardData={mingusKeyboardData}
                mingusChordsData={mingusChordsData}
                updateMingusData={updateMingusData}
                handleChangeNotesAscending={handleChangeNotesAscending}
                mTNames={mTNames}
                fxRadioValue={fxRadioValue}
                handleOsc1RateUpdate={handleOsc1RateUpdate} 
                // handleOsc2RateUpdate={handleOsc2RateUpdate}
                handleMasterFastestRate={handleMasterFastestRate}
                handleStkRateUpdate={handleStkRateUpdate} 
                handleSamplerRateUpdate={handleSamplerRateUpdate} 
                handleAudioInRateUpdate={handleAudioInRateUpdate}
                currentNoteVals={currentNoteVals}
                vizSource={vizSource}
                noteBuilderFocus={noteBuilderFocus}
                handleNoteBuilder={handleNoteBuilder}
                exitEditMode={exitEditMode}
                handleNoteLengthUpdate={handleNoteLengthUpdate}
                handleNoteVelocityUpdate={handleNoteVelocityUpdate}
                currentSelectedCell={currentSelectedCell}
                octaveMax={octaveMax}
                octaveMin={octaveMin}
                xLabels={xLabels}
                yLabels={yLabels}
                uploadedBlob={uploadedBlob}
                getMeydaData={getMeydaData}
                clickedFile={clickedFile}
                chuckRef={chuckRef}
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
  );
};
