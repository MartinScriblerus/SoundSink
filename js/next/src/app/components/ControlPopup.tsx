import React, {useEffect, useState} from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import Button from '@mui/material/Button';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Heatmap } from '@/utils/VizHelpers/Heatmap';
import { Box, useTheme } from '@mui/material';
import { Inter } from 'next/font/google'
import CloseIcon from '@mui/icons-material/Close';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
 
interface ControlProps {

    handleChangeBeatsNumerator: (npmBpm: number) => void; 
    showFX: boolean;
    filesToProcess: string[];
    programIsOn: boolean;
    handleOscRateUpdate: (val: any) => void;
    handleStkRateUpdate: (val: any) => void;
    handleSamplerRateUpdate: (val: any) => void;
    handleAudioInRateUpdate: (val: any) => void;
    currentBeatSynthCount: number;
    currentNumerCount: number;
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


    handleChangeBeatsNumerator,
    showFX,
    filesToProcess,
    programIsOn,
    handleOscRateUpdate,
    handleStkRateUpdate,
    handleSamplerRateUpdate,
    handleAudioInRateUpdate,
    currentBeatSynthCount,
    currentNumerCount,
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

  const theme = useTheme();

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
        id={"patternOpenBtn"}
        sx={{
          position: 'relative', 
          minWidth: '140px',
          display: programIsOn ? "flex" : "none",
          flexDirection: "row",
          width: "100%",
          border: theme.palette.primaryB,
          background: theme.palette.black,
          color: `${theme.palette.white}`,
          marginLeft: '0px', 
          '&:hover': {
            color: theme.palette.primaryA,
            background: theme.palette.secondaryA,
        }
        }} 
        aria-describedby={id} 
        className="ui_SynthLayerButton"
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
          left: '142px',
          // left: '94px', 
          // right: '94px', 
          // bottom: '13rem',
          top: '50px', 
          // width: 'calc(100% - 140px)',
          // height: '100%',
          position: 'absolute',         
        }} 
        width={window.innerWidth}  
        id={id} 
        open={open} 
        anchor={anchor}>

        <Box sx={{
            zIndex:40, 
            // height: '100%',
            textAlign: 'center',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <span 
            style={{
              position: "absolute",
              top: "12px",
              right: "8px",
              // width: "100%",
              flex: "flex-end",
              zIndex: 50,
              cursor: "pointer"
            }}
            onClick={handleClick}> HI!<CloseIcon/> 
          </span>


          <Heatmap 
            width={window.innerWidth - 128} 
            height={window.innerHeight / 2} 
            currentNumerCount={currentNumerCount}
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
