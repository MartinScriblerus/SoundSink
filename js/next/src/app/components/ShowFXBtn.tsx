import * as React from 'react';
import Button from '@mui/material/Button';
import InputIcon from '@mui/icons-material/Input';
import '../page.module.css';
import Stack from '@mui/material/Stack';

type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    handleShowFX: () => void;
};

const ShowFXView = ({handleShowFX}: Props) => {
    return (
        <Stack direction="row" spacing={2}>
            <Button sx={{color: 'rgba(228,225,209,1)', borderColor: 'rgba(228,225,209,1)', minWidth: '48px', left: '12px'}} onClick={handleShowFX} variant="outlined" endIcon={<InputIcon />}>
                {/* Show FX */} FX
            </Button>
        </Stack>
    );
};
export default ShowFXView;