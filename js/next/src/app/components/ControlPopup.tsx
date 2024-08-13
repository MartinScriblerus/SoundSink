import React, {useEffect, useState} from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
// import BPMModule from './BPMModule';
import Button from '@mui/material/Button';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Heatmap } from '@/utils/VizHelpers/Heatmap';
import { heatmapData } from './../../utils/VizHelpers/heatmapData';
// utils/VizHelpers/';
import MingusPopup from './MingusPopup'
import { Box, SelectChangeEvent } from '@mui/material';
import { Inter } from 'next/font/google'
import CloseIcon from '@mui/icons-material/Close';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
 
interface ControlProps {
    bpm: number;
    handleChangeBPM: (newBpm: number) => void;
    beatsNumerator: number;
    beatsDenominator: number;
    handleChangeBeatsNumerator: (npmBpm: number) => void; 
    handleChangeBeatsDenominator: (npmBpm: number) => void;
    submitMingus: () => void;
    audioKey: string;
    octave: string;
    audioScale: string;
    audioChord: string;
    handleChangeScale: (event: SelectChangeEvent) => void;
    handleChangeChord: (event: SelectChangeEvent) => void;
    handleShowFX: (msg?: any) => void;
    showFX: boolean;
    showBPM: boolean;
    handleShowBPM: (e: any) => void;
    filesToProcess: string[];
    programIsOn: boolean;
    handleOscRateUpdate: (val: any) => void;
    handleStkRateUpdate: (val: any) => void;
    handleSamplerRateUpdate: (val: any) => void;
    handleAudioInRateUpdate: (val: any) => void;
    currentBeatCount: number;
    currentBeatSynthCount: number;
    currentNumerCount: number;
    currentDenomCount: number;
    currentNoteVals: any;
    sortFileItemUp: (e: Event) => void;
    sortFileItemDown: (e: Event) => void;
    selectFileForAssignment: (e: Event) => void;
    numeratorSignature: number;
    denominatorSignature: number;
    editPattern: (x:number,y:number,group: number) => void;
    patternsHash: any;
    patternsHashUpdated: boolean;
    adjustToFullScreenKey: (val: boolean) => void;
    keysFullscreen: boolean;
    inPatternEditMode:(state: boolean) => void;
    handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
    cellSubdivisions: number;
    resetCellSubdivisionsCounter: (x: number, y: number) => void;
    hideCircularArpBtns: (boolVal: boolean) => void;
}



export default function ControlPopup(props: ControlProps) {
  const {
    bpm, 
    handleChangeBPM, 
    beatsNumerator, 
    beatsDenominator, 
    handleChangeBeatsNumerator,
    handleChangeBeatsDenominator,
    submitMingus,
    audioKey,
    octave,
    audioScale,
    audioChord,
    handleChangeScale,
    handleChangeChord,
    handleShowFX,
    showFX,
    showBPM,
    handleShowBPM,
    filesToProcess,
    programIsOn,
    handleOscRateUpdate,
    handleStkRateUpdate,
    handleSamplerRateUpdate,
    handleAudioInRateUpdate,
    currentBeatCount,
    currentBeatSynthCount,
    currentNumerCount,
    currentDenomCount,
    currentNoteVals,
    sortFileItemDown,
    sortFileItemUp,
    selectFileForAssignment,
    denominatorSignature,
    numeratorSignature,
    editPattern,
    patternsHash,
    patternsHashUpdated,
    adjustToFullScreenKey,
    keysFullscreen,
    inPatternEditMode,
    handleChangeCellSubdivisions,
    cellSubdivisions,
    resetCellSubdivisionsCounter,
    hideCircularArpBtns
  } = props;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [updateCellColorBool, setUpdateCellColorBool] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (keysFullscreen) {
      adjustToFullScreenKey(false);
    } else {
      const target: any = event.target;
      if (target && target.innerText && target.innerText.toLowerCase() !== "pattern") {
        adjustToFullScreenKey(true);
      }
    }
    setAnchor(anchor ? null : event.currentTarget);
  };

  useEffect(() => {
    if (keysFullscreen) {
      adjustToFullScreenKey(false);
    }
    if (showFX) {
      setAnchor(null);
    }
  }, [showFX]);

  useEffect(() => {
    console.log('showBPM is ', showBPM);
  }, [showBPM])

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  useEffect(()=>{
    console.log("Num Sig Changed ", numeratorSignature);
    handleChangeBeatsNumerator(numeratorSignature)
  }, [numeratorSignature]);

  useEffect(() => {
    if (open) {
      hideCircularArpBtns(true);
    } else {
      hideCircularArpBtns(false);
    }
  }, [open]);

  // useEffect(() => {
  //   console.log("READY TO PASS DOWN: ", patternsHash);
  // }, [patternsHashUpdated]);
  
  const updateCellColor = (msg: any) => {
    setUpdateCellColorBool(msg);
  }
  return (
    <Box 
      key={numeratorSignature} 
      sx={{
        height: '100%', 
        width: '100%',
      }}>
      <Button 
        sx={{
          // borderColor: 'rgba(228,225,209,1)', 
          position: 'relative', 
          minWidth: '140px',
          color: 'rgba(0,0,0,.98)',
          backgroundColor: 'rgba(147, 206, 214, 0.8)', 
          background: 'rbga(0,0,0,.0.8)', 
          marginLeft: '0px', 
          // top: '100px',
          display: programIsOn ? "flex" : "none",
          '&:hover': {
            color: '#f5f5f5',
            background: 'rgba(0,0,0,.98)',
          }
        }} 
        aria-describedby={id} 
        className="ui_SynthLayerButton"
        // variant="outlined" 
        onClick={handleClick} 
        endIcon={<CalendarViewMonthIcon />}
      >
        Pattern
      </Button>

      <BasePopup 
        style={{
          zIndex: 40, 
          display: "flex", 
          transform: 'translate(0px,0px)', 
          flexDirection: "column",
          left: '142px',
          // left: '94px', 
          // right: '94px', 
          top: '50px', 
          // width: '100%',
          width: 'calc(100% - 140px)',
          height: '100%',
          position: 'absolute',         
        }} 
        width={window.innerWidth}  
        id={id} 
        open={open} 
        anchor={anchor}>

        <Box sx={{
            zIndex:40, 
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          <span 
            style={{
              position: "absolute",
              top: "12px",
              right: "8px",
              zIndex: 50,
              cursor: "pointer"
            }}
            onClick={handleClick}> <CloseIcon/> 
          </span>


          <Heatmap 
            width={window.innerWidth - 128} 
            height={window.innerHeight / 2} 
            // data={heatmapData}
            currentBeatCount={currentBeatCount}
            currentNumerCount={currentNumerCount}
            currentDenomCount={currentDenomCount}
            currentBeatSynthCount={currentBeatSynthCount}
            handleOscRateUpdate={handleOscRateUpdate} 
            handleStkRateUpdate={handleStkRateUpdate} 
            handleSamplerRateUpdate={handleSamplerRateUpdate} 
            handleAudioInRateUpdate={handleAudioInRateUpdate}
            currentNoteVals={currentNoteVals}
            filesToProcess={filesToProcess}
            numeratorSignature={numeratorSignature}
            denominatorSignature={denominatorSignature}
            editPattern={editPattern}
            patternsHash={patternsHash}
            patternsHashUpdated={patternsHashUpdated}
            updateCellColor={updateCellColor}
            updateCellColorBool={updateCellColorBool}
            inPatternEditMode={inPatternEditMode}
            selectFileForAssignment={selectFileForAssignment}
            sortFileItemDown={sortFileItemDown}
            sortFileItemUp={sortFileItemUp}
            handleChangeCellSubdivisions={handleChangeCellSubdivisions}
            cellSubdivisions={cellSubdivisions}
            resetCellSubdivisionsCounter={resetCellSubdivisionsCounter}
          />
          
        </Box>

      </BasePopup>
    </Box>
  );
}
