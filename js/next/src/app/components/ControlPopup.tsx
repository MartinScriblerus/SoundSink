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

import Inventory2Icon from '@mui/icons-material/Inventory2';
 
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
  } = props;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  // const handleClickUploadedFiles = (e: any) => {
  //   console.log("WHY IS THIS NOT WORKING?: ", e.target.innerText);
  // }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
    // handleShowFX(true);
  };

  useEffect(() => {
    if (showFX) {
      setAnchor(null);
    }
  }, [showFX]);

  useEffect(() => {
    console.log('showBPM is ', showBPM);
  }, [showBPM])

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  return (
    <Box sx={{height: '100%', width: '100%'}}>
      <Button 
        sx={{
          borderColor: 'rgba(228,225,209,1)', 
          position: 'relative', 
          minWidth: window.innerWidth < 900 ? '140px' : '208px',
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
        variant="outlined" 
        onClick={handleClick} 
        endIcon={<CalendarViewMonthIcon />}
      >
        Pattern
      </Button>

      <BasePopup style={{display: "flex", transform: 'translate(0px,0px)', flexDirection: "column", left: '94px', right: '94px', top: '56px', position: 'absolute'}} width={window.innerWidth}  id={id} open={open} anchor={anchor}>
        <Box>

          <Box sx={{display: "flex", flexDirection: "row", width: "100%"}}>
            <>    
                <Box 
                  sx={{
                    backgroundColor: 'rgba(30,34,26,0.96)', 
                    width:'100%', 
                    display:'flex', 
                    flexDirection: 'column',
                    minHeight:'100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <MingusPopup 
                      submitMingus={submitMingus}
                      audioKey={audioKey}
                      octave={octave}
                      audioScale={audioScale}
                      audioChord={audioChord}
                      handleChangeScale={handleChangeScale}
                      handleChangeChord={handleChangeChord}
                  />
                </Box>
                {/* } */}
                {filesToProcess.length > 0 && <Button sx={{
                  color: 'rgba(228,225,209,1)', 
                  borderColor: 'rgba(228,225,209,1)', 
                  position: 'absolute', 
                  minWidth: '48px', 
                  right: '0px', 
                  '&:hover': {
                    color: '#f5f5f5',
                    background: 'rgba(0,0,0,.98)',
                  }
                  // top: '232px'
                }} 
                aria-describedby={id} 
                variant="outlined" 
                onClick={handleShowBPM} 
                // startIcon={<Inventory2Icon />}
              >
                <Inventory2Icon />
              </Button>}
            </>  
          </Box>

          <Heatmap 
            width={window.innerWidth - 128} 
            height={window.innerHeight / 2} 
            data={heatmapData}
          />
        </Box>
      </BasePopup>
    </Box>
  );
}
