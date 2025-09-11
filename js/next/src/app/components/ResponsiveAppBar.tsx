import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import StopCircleIcon from '@mui/icons-material/StopCircle';
// import PianoIcon from '@mui/icons-material/Piano';
import { Chuck } from 'webchuck';
import { useTheme } from '@mui/material';
import GenericToggle from './GenericToggle';
import { Sources } from '@/types/audioTypes';
import { CORDUROY_RUST, OBERHEIM_TEAL, NEON_PINK } from '@/utils/constants';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
interface KeysAppBarProps {
  selectRef: any;
  tune: any;
  currentMicroTonalScale: any;
  programIsOn: boolean;
  updateHasHexKeys: (msg: boolean) => void;
  formats: string[];
  chuckHook: Chuck | undefined;
  runChuck: () => void;
  stopChuckInstance: () => void;
  stkFX?: any;
  fxCount: number;
  handleReturnToSynth: () => void;
  handleToggleStkArpeggiator: () => void;
  handleToggleArpeggiator: () => void;
  checkedFXList: any[];
  keysVisible: boolean;
  isAnalysisPopupOpen: any;
  hasHexKeys: boolean;
  handleFormat: any;
  handleChange: any;
  value: any;
  universalSources: Sources | undefined;
  vizSource: string;
  handleSwitchToggle: () => void;
  updateStkKnobs: any;
  stkValues: any;
  setStkValues: any;
  currentBeatCountToDisplay: number;
  // currentNumerCountColToDisplay: number;
  // currentDenomCount: number;
  currentPatternCount: number;
  chuckMicButton: () => void;
  numeratorSignature: number;
  denominatorSignature: number;
}

function ResponsiveAppBar(props: KeysAppBarProps) {

  const {
    programIsOn,
    handleToggleArpeggiator,
    handleToggleStkArpeggiator,
    handleSwitchToggle,
    currentBeatCountToDisplay,
    // currentNumerCountColToDisplay,
    // currentDenomCount,
    currentPatternCount,
    chuckMicButton,
    numeratorSignature,
    denominatorSignature,
  } = props;

  const theme = useTheme();

  const { chuckHook, stopChuckInstance, runChuck } = props;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [chuckIsRunning, setChuckIsRunning] = React.useState<boolean>(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRunChuck = () => {
    if (!chuckIsRunning) {
      runChuck();
      setChuckIsRunning(true);
    } else {
      console.log("Chuck is already running");
    }
  };

  const handleStopChuckInstance = () => { 
    stopChuckInstance();
    setChuckIsRunning(false);
  };

  return (
      <Box sx={{
          display: "flex", 
          flexDirection: "column", 
          //position: "absolute", 
          // right: "96px", 
          right: "0px",
          padding: "2px",
        }}>
        {/* RECORD */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          //padding: '4px !important',
        }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: "row" 
          }}>
            {chuckHook && (
              <Button
              sx={{
                border: `solid 1px ${NEON_PINK}`,
                backgroundColor: chuckHook && 'rgba(28,28,28,0.78)',
                color: 'rgba(245,245,245,0.78)',
                height: '48px',
            
                width: '100%',
               // marginBottom: '4px',
                minHeight: '48px',
                display: "flex",
                zIndex: '99',
                pointerEvents: "auto",
                cursor: "pointer",
                '&:hover': {
                  color: 'rgba(245,245,245,0.78)',
                  background: NEON_PINK,
                }
              }}
              className="ui_SynthLayerButton"
                  id="micStartRecordButton"
                  onClick={chuckMicButton}
                  endIcon={<KeyboardVoiceIcon />}>
                  Rec
              </Button>
            )}
          </Box>
        </Box>
        {/* PLAY CHUCK */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column",
           // padding: '4px !important', 
          }}
        >
        {chuckHook && (
          <Button
            sx={{
              // border:'rgba(245,245,245,0.78)',
              backgroundColor: chuckHook && 'rgba(28,28,28,0.78)',
              color: 'rgba(245,245,245,0.78)',
              height: '48px',
          
             // width: '100px',
              //marginBottom: '4px',
              border: `1px solid ${OBERHEIM_TEAL}`,
              minHeight: '48px',
              display: "flex",
              zIndex: '99',
              pointerEvents: "auto",
              cursor: "pointer",
              '&:hover': {
                color: 'rgba(245,245,245,0.78)',
                background: OBERHEIM_TEAL,
                // border: `1px solid ${theme.palette.black}`,
              }
            }}
            className="ui_SynthLayerButton"
            id="runChuckButton"
            onClick={handleRunChuck}
            endIcon={
              <PlayCircleFilledIcon />
            }>
            Play
          </Button>
        )}
        </Box>
        {/* STOP CHUCK */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          //padding: '4px !important', 
        }}>
          {chuckHook && (
            <Button
              sx={{
                color: 'rgba(245,245,245,0.78)',
                // border: `solid 1px rgba(28,28,28,0.78)`,
                backgroundColor: 'rgba(5, 2, 2, 0.78)',
                height: '48px',
                //width: '100px',
                //marginRight: '8px',
                border: `solid 1px ${CORDUROY_RUST}`,
                display: 'flex',
                zIndex: '99',
                pointerEvents: 'auto',
                cursor: 'pointer',
                '&:hover': {
                  color: 'rgba(245,245,245,0.78)',
                  background: CORDUROY_RUST,
                  // border: `1.5px solid ${theme.palette.black}`,
                }
              }}
              id="stopChuckButton"
              onClick={handleStopChuckInstance}
              endIcon={<StopCircleIcon />}>

              Stop

            </Button>
          )}
        </Box>
      </Box>
 
      

  );
}
export default ResponsiveAppBar;