import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PianoIcon from '@mui/icons-material/Piano';
import { Chuck } from 'webchuck';
import ToggleFXView from './ToggleFXView';
import { useTheme } from '@mui/material';

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
  stkFX: any;
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
}

function ResponsiveAppBar(props: KeysAppBarProps) {

  const {
    stkFX,
    checkedFXList,
    handleReturnToSynth,
    programIsOn,
    keysVisible,
    handleToggleArpeggiator,
    handleToggleStkArpeggiator,
    isAnalysisPopupOpen,
    hideCircularArpBtnsHook,
    hasHexKeys,
    handleFormat,
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
    setChuckIsRunning(true);
    runChuck();
  };

  return (
    <Box style={{ zIndex: '10000', width: '100vw', display: "block" }} position="static">
      <Box sx={{ height: "54px" }} maxWidth="xl">
        <Box 
          sx={{ 
            // height: '54px !important', 
            minHeight: '54px !important', 
            // minWidth: 'calc(100% -180px)', 
            alignSelf: 'stretch',
            display: 'flex',
            float: 'inline-start',
            marginLeft: '240px',
            width: 'calc(100vw - 240px)'
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "row",
          }}
          >

          {/* PLAY CHUCK */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column",
              padding: '4px !important', 
              marginRight: "8px"
            }}
          >
            {chuckHook && (
              <Button
                sx={{
                  border:`solid 1.5px ${!chuckIsRunning ? theme.palette.primaryA : theme.palette.black}`,
                  backgroundColor: theme.palette.black,
                  color: theme.palette.white,
                  height: '60px',
                  width: '100px',
                  // borderRadius: '50% !important',
                  // transform: 'scale(0.7)',
                  marginBottom: '4px',
                  minHeight: '60px',
                  display: programIsOn ? "flex" : "none",
                  zIndex: isAnalysisPopupOpen ? '0' : '99',
                  pointerEvents: "all",
                  cursor: "pointer",
                  '&:hover': {
                    color: theme.palette.black,
                    background:theme.palette.primaryB,
                    border: `1px solid ${theme.palette.primaryB}`,
                  }
                }}
                variant="outlined"
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
                variant="outlined"
                sx={{
                  color: theme.palette.white,
                  borderColor: chuckIsRunning ? theme.palette.secondaryB : theme.palette.black,
                  backgroundColor: theme.palette.black,
                  height: '60px',
                  width: '100px',
                  // borderRadius: '50% !important',
                  // transform: 'scale(0.7)',
                  padding: '4px !important',
                  marginBottom: '4px',
                  marginRight: '8px',
                  minHeight: '60px',
                  border: '1.5px solid',
                  display: programIsOn ? "flex" : "none",
                  zIndex: isAnalysisPopupOpen ? '0' : '99',
                  pointerEvents: "all",
                  cursor: "pointer",
                  '&:hover': {
                    color: theme.palette.black,
                    background: theme.palette.primaryB,
                    border: `1.5px solid ${theme.palette.primaryB}`,
                  }
                }}
                id="stopChuckButton"
                onClick={stopChuckInstance}
                endIcon={<StopCircleIcon />}>

                Stop

              </Button>
            )}
          </Box>

          {/* ARPS */}
          <Box
            sx={{
              display: hideCircularArpBtnsHook ? 'none' : 'flex',
              flexDirection: 'row',
              right: '0px',
              // left: '4px',
              position: 'relative'
            }}
          >
            <Button
              sx={{
                border: theme.palette.primaryB,
                background: theme.palette.black,
                color: `${theme.palette.white} important!`,
                marginLeft: '0px',
                // maxWidth: '28px',
                minWidth: '60px',
                maxWidth: '60px',
                maxHeight: '40px',
                borderRadius: '50% !important',
                transform: 'scale(0.7)',
                marginBottom: '4px',
                minHeight: '60px',
                display: hasHexKeys ? "flex" : "none",
                zIndex: '9999',
                '&:hover': {
                  color: theme.palette.white,
                  background: theme.palette.black,
                  border: `1px solid ${theme.palette.secondaryB}`,
                }
              }}
              variant="outlined"
              className="ui_SynthLayerButton"
              onClick={(e: any) => handleFormat(e, ['key'])}
            // endIcon={<AnimationIcon />}
            >
              <PianoIcon style={{ pointerEvents: 'none' }} />
            </Button>
            <Button
              sx={{
                border: theme.palette.primaryB,
                background: theme.palette.black,
                color: `${theme.palette.white} important!`,
                marginLeft: '0px',
                // maxWidth: '28px',
                minWidth: '60px',
                maxWidth: '60px',
                maxHeight: '40px',
                borderRadius: '50% !important',
                transform: 'scale(0.7)',
                marginBottom: '4px',
                minHeight: '60px',
                display: programIsOn ? "flex" : "none",
                zIndex: isAnalysisPopupOpen ? '0' : '99',
                pointerEvents: "all",
                cursor: "pointer",
                '&:hover': {
                  color: theme.palette.white,
                  background: theme.palette.primaryB,
                  border: `1px solid ${theme.palette.secondaryB}`,
                }
              }}
              variant="outlined"
              className="ui_SynthLayerButton"
              onClick={handleToggleArpeggiator}
            // endIcon={<AnimationIcon />}
            >
              Arp1
            </Button>
            <Button
              sx={{
                border: theme.palette.primaryB,
                background: theme.palette.black,
                color: `${theme.palette.white} important!`,
                minWidth: '60px',
                maxWidth: '60px',
                maxHeight: '40px',
                marginLeft: '0px',
                borderRadius: '50% !important',
                transform: 'scale(0.7)',
                marginBottom: '4px',
                minHeight: '60px',
                display: programIsOn ? "flex" : "none",
                zIndex: isAnalysisPopupOpen ? '0' : '99',
                pointerEvents: "all",
                cursor: "pointer",
                '&:hover': {
                  color: theme.palette.white,
                  background: theme.palette.black,
                  border: `1px solid ${theme.palette.secondaryB}`,
                }
              }}
              variant="outlined"
              className="ui_SynthLayerButton"
              onClick={handleToggleStkArpeggiator}
            // endIcon={<AnimationIcon />}
            >
              Arp2
            </Button>
            <ToggleFXView
              stkCount={stkFX.length}
              fxCount={checkedFXList.length}
              handleReturnToSynth={handleReturnToSynth}
              programIsOn={programIsOn}
              handleToggleStkArpeggiator={handleToggleStkArpeggiator}
              handleToggleArpeggiator={handleToggleArpeggiator}
              stkFX={stkFX.current}
              checkedFXList={checkedFXList}
              keysVisible={keysVisible}
              analysisPopupOpen={isAnalysisPopupOpen}
            />
          </Box>
        </Box>

          <Box sx={{ 
            // flexGrow: 0, 
            zIndex: 100,
            position: 'absolute',
            right: '12px',
            top: '12px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
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
                }}>
                  <Avatar alt="Remy Sharp" src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAARVBMVEXw8PBpfN3y8vBfdNz29vFmet2GlODY2+yMmeHT1uvW2ezc3u1bcdx/jt+EkuBjd9zr7O9Ta9v8+/KbpuN1ht5vgd6/xehcBCHdAAACJUlEQVR4nO3cSW4bURBEQao5ikNT1uD7H9Xy0t50fqCaKELxDvCRQRFaEbXZSJIkSZL0U5uinvipt/Mx6JI81vOp6fxru9z1tnvWpzbTcfuy3P6QzGr5VNNZhIT9ZxES9p9FSNh/FiFh/1mEhP1nERL2n0VI2H8WIWH/WYSE/WcREvafRUjYf1at8Lpf7n543y13yWZFT0Wr5kh4uR2CPk9Bh30gfPlKnpqTVfNHItxMwSe6ez/dg880An7/FYOux2RWBMzancL1VW1fs18DERISEhISEhISEhISEhISEhISEhISEhISEhISEhL+U3Kd4fHC84OvRlyyHyHcg0MI2+yl3w++GpHOOr8udpzLPqzKqxFZ0Ver8Atf+ZuorOjfA+FAhITjERKORkg4HiHhaISE4xESjkZIOB4h4WiEhOMREo5GSDgeIeFohIT/vVZ1JqDweEGp8Cs5LXGbk4MQn9FTCbH2tknduY7KIyKut/SdRUjYfxYhYf9ZhIT9ZxES9p9FSNh/FiFh/1mEhP1nERL2n0VI2H8WIWH/WYSE/Wd1FUbnGaJDCF2Fb8s3I/6ejQh+dNNUGF1JyQ6SdBXWRUi41lt1ERKu9VZdhIRrvVUXIeFab9VFSLjWW3UREq71Vl2EhGu9VRch4Vpv1UVIuNZbdRESrvVWXYSEa71VV60wOhMwP1pYt2q63IIjDvPHg4WVq6bghsN3a5ueYpUkSZIkSW36A9+/m8h7H2QPAAAAAElFTkSuQmCC"} />
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
    </Box>
  );
}
export default ResponsiveAppBar;