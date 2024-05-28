import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Stack from '@mui/material/Stack';


type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    stkCount: number;
    fxCount: number;
    handleReturnToSynth: () => void;
};

const ToggleFXView = ({stkCount, fxCount, handleReturnToSynth}: Props) => {

    const stkCountHandler = stkCount ? stkCount : 0;
    const fxCountHandler = fxCount? fxCount : 0;

    return (
        <Stack direction="row" spacing={2} style={{position:"absolute", left: "12px", top: "144px"}}>
            <Button 
                sx={{
                    minWidth: '104px', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(147, 206, 214, 1)',
                    background: 'rbga(0,0,0,.91)', 
                    borderColor: fxCountHandler+stkCountHandler === 0 ? 'rgba(228,225,209,.2)' : 'rgba(228,225,209,1)',
                    '&:hover': {
                        color: '#f5f5f5'
                    },
                    pointerEvents: fxCountHandler+stkCountHandler === 0 ? 'none': 'auto'
                }} 
                onClick={handleReturnToSynth} 
                variant="outlined" 
                endIcon={<KeyboardTabIcon />}>
                {/* FX View */}Synth
            </Button>
        </Stack>
    );
};
export default ToggleFXView;