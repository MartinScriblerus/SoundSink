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
import STKManagerDropdown from './STKManagerDropdown';
import CustomAriaLive from './MicrotonesSearch';
import { FOREST_GREEN, PALE_BLUE, RUSTY_ORANGE } from '@/utils/constants';
import InstrumentsAndMicrotones from './InstrumentsAndMicrotones';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export interface KeysAppBarProps {
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
  hideCircularArpBtnsHook: any;
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
  currentNumerCountColToDisplay: number;
  currentDenomCount: number;
  currentPatternCount: number;
  chuckMicButton: () => void;
}

function ResponsiveAppBar(props: KeysAppBarProps) {

  const {
    programIsOn,
    handleToggleArpeggiator,
    handleToggleStkArpeggiator,
    hideCircularArpBtnsHook,
    hasHexKeys,
    handleFormat,
    handleSwitchToggle,
    updateStkKnobs,
    stkValues,
    setStkValues,
    selectRef,
    tune,
    currentMicroTonalScale,
    currentBeatCountToDisplay,
    currentNumerCountColToDisplay,
    currentDenomCount,
    currentPatternCount,
    chuckMicButton,
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
    // <Box style={{ zIndex: '10000', width: '100vw', display: "block", background: "black" }} position="static">
      <Box sx={{ height: "64px", borderBottom: "solid 0.5px rgba(255,255,255,0.78)" }}>
        <Box 
          sx={{ 
            minHeight: '54px !important', 
            alignSelf: 'stretch',
            display: 'flex',
            float: 'inline-start',
            minWidth: '100%',
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "row",
          }}
          >
            {/* COUNT WRAPPER */}
            <Box sx={{
                display: "block",
                left: '24px',
                top: '0px',
                // backgroundColor: 'pink',
                width: '240px',
                position: 'relative',
            }}>
                {chuckHook && (
                    <Box sx={{
                        // position: "absolute",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        flexDirection: "column",
                        textAlign: "center",
                        pointerEvents: "none",
                        top: '0px'
                    }}>
                        <Box
                          className="countWrapper"
                          sx={{
                              color: "rgba(255,255,255,0.78)",
                              position: "relative",
                              pointerEvents: "none",
                              display: "flex",
                              flexDirection: "row",
                              textAlign: "center",
                              justifyContent: "center",
                              // width: "280px",
                              marginLeft: "8px",
                              top: "8px",
                          }}
                        >
                          <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                              {currentPatternCount}
                          </Typography>

                          <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                              {currentDenomCount}
                          </Typography>

                          <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                              {currentNumerCountColToDisplay}
                          </Typography>

                          <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                              {currentBeatCountToDisplay}
                          </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
<Box sx={{display: "flex", flexDirection: "row", position: "absolute", right: "96px", marginRight: "8px"}}>
            {/* RECORD */}
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column",
                padding: '4px !important',
              }}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "row" 
                }}>
                {chuckHook && (
                    <Button
                    sx={{
                      border:'rgba(255,255,255,0.78)',
                      backgroundColor: chuckHook && 'rgba(0,0,0,0.78)',
                      color: 'rgba(255,255,255,0.78)',
                      height: '48px',
                  
                      width: '100px',
                      marginBottom: '4px',
                      minHeight: '48px',
                      display: "flex",
                      zIndex: '99',
                      pointerEvents: "auto",
                      cursor: "pointer",
                      '&:hover': {
                        color: 'rgba(255,255,255,0.78)',
                        background: RUSTY_ORANGE,
                      }
                    }}
                    className="ui_SynthLayerButton"
                        id="micStartRecordButton"
                        onClick={chuckMicButton}
                        endIcon={<KeyboardVoiceIcon />}>
                        Rec
                    </Button>
                    )
                  }
                </Box>
            </Box>
            {/* PLAY CHUCK */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column",
                padding: '4px !important', 
              }}
            >
            {chuckHook && (
              <Button
                sx={{
                  border:'rgba(255,255,255,0.78)',
                  backgroundColor: chuckHook && 'rgba(0,0,0,0.78)',
                  color: 'rgba(255,255,255,0.78)',
                  height: '48px',
              
                  width: '100px',
                  marginBottom: '4px',
                  minHeight: '48px',
                  display: "flex",
                  zIndex: '99',
                  pointerEvents: "auto",
                  cursor: "pointer",
                  '&:hover': {
                    color: 'rgba(255,255,255,0.78)',
                    background: FOREST_GREEN,
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
              padding: '4px !important', 
            }}>
              {chuckHook && (
                <Button
                  sx={{
                    color: 'rgba(255,255,255,0.78)',
                    border: `solid 1px rgba(0,0,0,0.78)`,
                    backgroundColor: 'rgba(0,0,0,0.78)',
                    height: '48px',
                    width: '100px',
                    marginRight: '8px',
                    display: 'flex',
                    zIndex: '99',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'rgba(255,255,255,0.78)',
                      background: PALE_BLUE,
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
          </Box>
          <GenericToggle 
            handleSwitchToggle={handleSwitchToggle}
            programIsOn={programIsOn}
            handleToggleArpeggiator={handleToggleArpeggiator}
            handleToggleStkArpeggiator={handleToggleStkArpeggiator}
          />
          <Box sx={{ 
            zIndex: 20,
            right: '0px',
            left: '0px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: "100%",
          }}>

            {chuckHook && (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ 
                  p: 0, 
                  marginTop: "0px",
                  pointerEvents: "auto",
                  cursor: "hover",
                  zIndex: "9999",
                  paddingRight: "12px",
                  width: "60px",
                  height: "60px"
                }}>
                  <Avatar sx={{
                    width: "60px",
                    height: "60px"
                  }} alt="Remy Sharp" src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAARVBMVEXw8PBpfN3y8vBfdNz29vFmet2GlODY2+yMmeHT1uvW2ezc3u1bcdx/jt+EkuBjd9zr7O9Ta9v8+/KbpuN1ht5vgd6/xehcBCHdAAACJUlEQVR4nO3cSW4bURBEQao5ikNT1uD7H9Xy0t50fqCaKELxDvCRQRFaEbXZSJIkSZL0U5uinvipt/Mx6JI81vOp6fxru9z1tnvWpzbTcfuy3P6QzGr5VNNZhIT9ZxES9p9FSNh/FiFh/1mEhP1nERL2n0VI2H8WIWH/WYSE/WcREvafRUjYf1at8Lpf7n543y13yWZFT0Wr5kh4uR2CPk9Bh30gfPlKnpqTVfNHItxMwSe6ez/dg880An7/FYOux2RWBMzancL1VW1fs18DERISEhISEhISEhISEhISEhISEhISEhISEhISEhL+U3Kd4fHC84OvRlyyHyHcg0MI2+yl3w++GpHOOr8udpzLPqzKqxFZ0Ver8Atf+ZuorOjfA+FAhITjERKORkg4HiHhaISE4xESjkZIOB4h4WiEhOMREo5GSDgeIeFohIT/vVZ1JqDweEGp8Cs5LXGbk4MQn9FTCbH2tknduY7KIyKut/SdRUjYfxYhYf9ZhIT9ZxES9p9FSNh/FiFh/1mEhP1nERL2n0VI2H8WIWH/WYSE/Wd1FUbnGaJDCF2Fb8s3I/6ejQh+dNNUGF1JyQ6SdBXWRUi41lt1ERKu9VZdhIRrvVUXIeFab9VFSLjWW3UREq71Vl2EhGu9VRch4Vpv1UVIuNZbdRESrvVWXYSEa71VV60wOhMwP1pYt2q63IIjDvPHg4WVq6bghsN3a5ueYpUkSZIkSW36A9+/m8h7H2QPAAAAAElFTkSuQmCC"} />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
            </Menu>
          </Box>
        </Box>
      </Box>
  );
}
export default ResponsiveAppBar;