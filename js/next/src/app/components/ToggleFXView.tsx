import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Stack from '@mui/material/Stack';
import PianoIcon from '@mui/icons-material/Piano';

type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    stkCount: number;
    fxCount: number;
    handleReturnToSynth: () => void;
    programIsOn: boolean;
};

const ToggleFXView = ({stkCount, fxCount, handleReturnToSynth, programIsOn}: Props) => {

    const stkCountHandler = stkCount ? stkCount : 0;
    const fxCountHandler = fxCount? fxCount : 0;

    return (
        // <Stack direction="row" spacing={2} style={{
        //     position:"relative", 
        //     left: "12px", 
        //     top: "0px"}}>
            <Button 
                sx={{
                    minWidth: '208px', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(219, 230, 161, 0.8)', 
                    border: '0.5px solid #b2b2b2',
                    display: programIsOn ? "flex" : "none",
                    marginLeft: '0px',
                    '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                        border: '1px solid #1976d2',
                    },
                    // pointerEvents: fxCountHandler+stkCountHandler === 0 ? 'none': 'auto'
                }} 
                onClick={handleReturnToSynth} 
                variant="outlined" 
                endIcon={<PianoIcon />}>
                {/* FX View */}Toggle View
            </Button>
    //     </Stack>
    );
};
export default ToggleFXView;