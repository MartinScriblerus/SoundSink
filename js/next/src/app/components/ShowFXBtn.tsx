import * as React from 'react';
import Button from '@mui/material/Button';
import InputIcon from '@mui/icons-material/Input';

import Stack from '@mui/material/Stack';

type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    handleShowFX: () => void;
};

const ShowFXView = ({handleShowFX}: Props) => {
    return (
        <Stack direction="row" spacing={2}>
            <Button onClick={handleShowFX} variant="outlined" endIcon={<InputIcon />}>
                Show FX
            </Button>
        </Stack>
    );
};
export default ShowFXView;