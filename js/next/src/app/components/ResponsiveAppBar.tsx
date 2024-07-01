import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import CustomAriaLive from './MicrotonesSearch';
import KeyboardControls from './KeyboardControls';
import { SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PianoIcon from '@mui/icons-material/Piano';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { useEffect } from 'react';
import { Chuck } from 'webchuck';

const pages = ['Instructions', 'Experimental'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export interface KeysAppBarProps {
  selectRef: any; 
  tune: any;
  currentMicroTonalScale: any;

  submitMingus: () => void;
  audioKey: string;
  octave: string;
  audioScale: string;
  audioChord: string;
  handleChangeScale: (event: SelectChangeEvent) => void;
  handleChangeChord: (event: SelectChangeEvent) => void;
  programIsOn: boolean;
  updateHasHexKeys: (msg: boolean) => void;
  handleFormat: any;
  formats: string[];
  chuckHook: Chuck | undefined;
}

function ResponsiveAppBar(props: KeysAppBarProps) {
  const {
    selectRef, 
    tune, 
    currentMicroTonalScale,
    submitMingus,
    audioKey,
    octave,
    audioScale,
    audioChord,
    handleChangeScale,
    handleChangeChord,
    programIsOn,
    updateHasHexKeys,
    handleFormat,
    formats,
    chuckHook
  } = props;
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  // const [formats, setFormats] = React.useState(() => ['tradKey']);


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container sx={{height: "48px"}} maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ marginTop: '-12px', flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="medium"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            

{chuckHook !== undefined && (
            <ToggleButtonGroup
              value={formats}
              onChange={handleFormat}                                                                     
              aria-label="text formatting"
              sx={{color: "#f5f5f5"}} 
            >
              <ToggleButton sx={{color: "#f5f5f5"}} value="hexKey" aria-label="hexKey">
                <PianoIcon sx={{color: "#f5f5f5"}} /> 
                <>
                  Keys
                </>
              </ToggleButton>
            </ToggleButtonGroup>
)}


            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
            
    
          </Box>



          
          <Box sx={{ marginTop: '-12px', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}

          {chuckHook !== undefined && (

            <ToggleButtonGroup
              value={formats}
              onChange={handleFormat}                                                                     
              aria-label="text formatting"
            >
              <ToggleButton sx={{color: "#f5f5f5"}} value="hexKey" aria-label="hexKey">
                <PianoIcon sx={{color: "#f5f5f5"}}  /> 
                <>
                  Keys
                </>
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          </Box>


{chuckHook !== undefined && (
<>
          {formats && formats.length > 0 && formats.indexOf('hexKey') !== -1 && formats[0] === 'hexKey' ? (
            <Box sx={{
                zIndex: 9999, 
                width: '140px', 
              }}>
              <CustomAriaLive selectRef={selectRef} tune={tune} currentMicroTonalScale={currentMicroTonalScale} />

            </Box>)
          // )}

          // {formats && formats.length > 0 && formats.indexOf('tradKey') !== -1 && (
          :
              <KeyboardControls 
                submitMingus={submitMingus}
                audioKey={audioKey}
                octave={octave}
                audioScale={audioScale}
                audioChord={audioChord}
                handleChangeChord={handleChangeChord}
                handleChangeScale={handleChangeScale}
                programIsOn={programIsOn}
              />
        
          }
</>)}


          <Box sx={{ flexGrow: 0, paddingTop: '4px' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginTop: "-18px" }}>
                <Avatar alt="Remy Sharp" src={"/static/reilly_portfolio_small.jpg"} />
              </IconButton>
            </Tooltip>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;