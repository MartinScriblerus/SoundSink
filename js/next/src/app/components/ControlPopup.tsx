import React, {useEffect} from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import BPMModule from './BPMModule';
import Button from '@mui/material/Button';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Heatmap } from '@/utils/VizHelpers/Heatmap';
import { heatmapData } from '@/utils/VizHelpers/heatmapData';
import MingusPopup from './MingusPopup';
import { Box, SelectChangeEvent } from '@mui/material';
import { Inter } from 'next/font/google'
 
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
    handleShowFX: (msg?: any) => void,
    showFX: boolean
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
    showFX
  } = props;
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
    // handleShowFX(true);
  };

  useEffect(() => {
    if (showFX) {
      setAnchor(null);
    }
  }, [showFX]);

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  return (
    <Box sx={{height: '100%', width: '100%', bottom: '60px'}}>
      <Button 
        sx={{
          color: 'rgba(228,225,209,1)', 
          borderColor: 'rgba(228,225,209,1)', 
          position: 'absolute', 
          minWidth: '48px', 
          left: '12px', 
          top: '104px'
        }} 
        aria-describedby={id} 
        variant="outlined" 
        onClick={handleClick} 
        endIcon={<CalendarViewMonthIcon />}
      >
        PT
      </Button>
      <BasePopup style={{display: "flex", transform: 'translate(0px,0px)', flexDirection: "column", left: '94px', right: '94px', top: '56px', position: 'absolute'}} width={window.innerWidth}  id={id} open={open} anchor={anchor}>
        <Box>
          <Box sx={{display: "flex", flexDirection: "row", width: "100%"}}>
            <BPMModule 
                bpm={bpm} 
                handleChangeBPM={handleChangeBPM}
                beatsNumerator={beatsNumerator}
                beatsDenominator={beatsDenominator}
                handleChangeBeatsNumerator={handleChangeBeatsNumerator}
                handleChangeBeatsDenominator={handleChangeBeatsDenominator}
            />
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
          </Box>
          
          <Heatmap 
            width={window.innerWidth - 128} 
            height={window.innerHeight / 2} 
            data={heatmapData}
          />
        </Box>
        {/* <BPMModule 
              bpm={bpm} 
              handleChangeBPM={handleChangeBPM}
              beatsNumerator={beatsNumerator}
              beatsDenominator={beatsDenominator}
              handleChangeBeatsNumerator={handleChangeBeatsNumerator}
              handleChangeBeatsDenominator={handleChangeBeatsDenominator}
          />
        <Box sx={{backgroundColor: 'brown', display:'flex', flexDirection: 'row'}}>
            <MingusPopup 
              submitMingus={submitMingus}
              audioKey={audioKey}
              octave={octave}
              audioScale={audioScale}
              audioChord={audioChord}
              handleChangeScale={handleChangeScale}
              handleChangeChord={handleChangeChord}
          />
        </Box> */}

      </BasePopup>
    </Box>
  );
}
