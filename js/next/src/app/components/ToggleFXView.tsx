import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Stack from '@mui/material/Stack';


type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    updateCurrentFXScreen: () => void;
};

const ToggleFXView = ({updateCurrentFXScreen}: Props) => {
    return (
        <Stack direction="row" spacing={2}>
            <Button sx={{color: 'rgba(228,225,209,1)', borderColor: 'rgba(228,225,209,1)'}} onClick={updateCurrentFXScreen} variant="outlined" startIcon={<KeyboardTabIcon />}>
                {/* FX View */}FX Back
            </Button>
        </Stack>
    );
};
export default ToggleFXView;