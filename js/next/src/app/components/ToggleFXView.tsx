import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Stack from '@mui/material/Stack';


type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    handleReturnToSynth: () => void;
};

const ToggleFXView = ({handleReturnToSynth}: Props) => {
    return (
        <Stack direction="row" spacing={2} style={{position:"absolute", left: "12px", top: "144px"}}>
            <Button 
                sx={{
                    minWidth: '104px', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(147, 206, 214, 1)',
                    background: 'rbga(0,0,0,.91)', 
                    borderColor: 'rgba(228,225,209,1)',
                    '&:hover': {
                        color: '#f5f5f5'
                    }
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