import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { MUTED_OLIVE, RUSTY_ORANGE } from '@/utils/constants';


const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    // transition: theme.transitions.create(['width'], {
    //   duration: 200,
    // }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

type ViewToggleProps = {
    // isAudioView: boolean;
    handleSwitchToggle: () => void;
    programIsOn: boolean;
    handleToggleArpeggiator: () => void;
    handleToggleStkArpeggiator: () => void;
}

export default function GenericToggle({
  handleSwitchToggle,
  programIsOn,
  handleToggleArpeggiator,
  handleToggleStkArpeggiator,
}: ViewToggleProps) {

    const theme = useTheme();

    return (
        <FormGroup sx={{right: '96px', position: 'absolute', zIndex: '60'}}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Button
              sx={{
                border: MUTED_OLIVE,
                background: 'rgba(255,255,255,0.78)',
                color: `rgba(255,255,255,0.78) important!`,
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
                zIndex: '99',
                pointerEvents: "auto",
                cursor: "pointer",
                '&:hover': {
                  color: 'rgba(255,255,255,0.78)',
                  background: MUTED_OLIVE,
                  border: `1px solid ${RUSTY_ORANGE}`,
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
                border: MUTED_OLIVE,
                // background: 'rgba(0,0,0,0.78)',
                color: `rgba(255,255,255,0.78) important!`,
                minWidth: '60px',
                maxWidth: '60px',
                maxHeight: '40px',
                marginLeft: '0px',
                borderRadius: '50% !important',
                transform: 'scale(0.7)',
                marginBottom: '4px',
                minHeight: '60px',
                display: programIsOn ? "flex" : "none",
                zIndex: '99',
                pointerEvents: "auto",
                cursor: "pointer",
                '&:hover': {
                  color: 'rgba(255,255,255,0.78)',
                  background: 'rgba(0,0,0,0.78)',
                  border: `1px solid ${RUSTY_ORANGE}`,
                }
              }}
              variant="outlined"
              className="ui_SynthLayerButton"
              onClick={handleToggleStkArpeggiator}
            // endIcon={<AnimationIcon />}
            >
              Arp2
            </Button>
            {/* <Typography>Audio</Typography>
            <Switch 
                defaultChecked 
                inputProps={{ 
                    'aria-label': 'ant design' 
                }} 
                // checked={checked}
                onChange={handleSwitchToggle}
                // inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography>Sequencer</Typography> */}
        </Stack>
        </FormGroup>
    );
}
