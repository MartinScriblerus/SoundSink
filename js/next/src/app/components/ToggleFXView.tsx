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
            <Button sx={{color: 'rgba(228,225,209,1)', borderColor: 'rgba(228,225,209,1)'}} onClick={handleReturnToSynth} variant="outlined" endIcon={<KeyboardTabIcon />}>
                {/* FX View */}SY
            </Button>
        </Stack>
    );
};
export default ToggleFXView;