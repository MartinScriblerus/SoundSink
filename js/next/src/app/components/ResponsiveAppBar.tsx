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
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
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
  runChuck: () => void;
  stopChuckInstance: () => void;
}

function ResponsiveAppBar(props: KeysAppBarProps) {

  const {chuckHook, stopChuckInstance, runChuck} = props;
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
    <AppBar style={{zIndex: '10000'}} position="static">
      <Container sx={{height: "48px"}} maxWidth="xl">
        <Toolbar disableGutters sx={{height: '48px !important', minHeight: '48px !important'}}>
          <Box sx={{  flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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

          
          <Box sx={{ marginTop: '0px', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{
              display: "flex", 
              flexDirection: "row",
              marginRight: "40px"
            }}
          >
            {/* PLAY CHUCK */}
            <Box sx={{
                display: "flex", 
                flexDirection: "column",
                borderRadius: "50%"
                }}
            >
              <Box sx={{display: "flex", flexDirection: "row"}}>
                  {chuckHook && (
                      <Button 
                          // style={{ 
                          //     background: 'rbga(0,0,0,0.8)', 
                          //     minWidth: '140px',
                          //     color: 'rgba(0,0,0,1)',
                          //     marginLeft: '0px'      
                          // }} 
                          sx={{ 
                              minWidth: '140px', 
                              opacity: '0.8',
                              paddingLeft: '24px', 
                              maxHeight: '40px',
                              border: '0.5px solid #b2b2b2',
                              pointerEvents: 'all',
                              backgroundColor: '0,0,0,0.4 !important',
                              background: '0,0,0,0.4 !important',
                              cursor: 'pointer',
                              zIndex: '9999',
                              '&:hover': {
                                  color: '#f5f5f5 !important',
                                  background: 'rgba(0,0,0,.98)',
                                  border: 'solid 1px #1976d2',
                                  }
                          }} 
                          variant="contained" 
                          id="runChuckButton" 
                          onClick={runChuck} 
                          endIcon={
                              <PlayCircleFilledIcon />
                          }>
                              Play
                      </Button>
                  )}
              </Box>
                
            </Box>

            {/* STOP CHUCK */}
            <Box sx={{
                display: "flex", 
                flexDirection: "column",
                borderRadius: "50%"
              }}>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    {chuckHook && (
                        <Button 
                            // style={{ 
                            //     minWidth: '140px',
                            //     color: 'rgba(0,0,0,1)',
                            //     marginLeft: '0px' 
                            // }} 
                            sx={{ 
                                minWidth: '140px', 
                                paddingLeft: '24px',
                                opacity: '0.8', 
                                maxHeight: '40px', 
                                marginLeft: '8px', 
                                background: '0,0,0,0.4',
                                pointerEvents: 'all',
                                cursor: 'pointer',
                                zIndex: '9999',
                                border: '0.5px solid #b2b2b2',
                                '&:hover': {
                                    color: '#f5f5f5 !important',
                                    background: 'rgba(0,0,0,.98)',
                                    border: '1px solid #1976d2',
                                }
                            }} 
                            variant="contained" 
                            id="stopChuckButton" 
                            onClick={stopChuckInstance} 
                            endIcon={<StopCircleIcon />}>
                            Stop
                        </Button>
                    )}
                </Box>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0, paddingTop: '4px' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginTop: "0px" }}>
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