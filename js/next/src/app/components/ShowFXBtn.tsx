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
            <Button 
                sx={{
                    minWidth: '104px', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(147, 206, 214, 1)',
                    left: '12px',
                    border: '0.5px solid #b2b2b2',
                    '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                        border: '1px solid #1976d2',
                    }
                }} 
                onClick={handleShowFX} 
                variant="outlined" 
                endIcon={<InputIcon />}>
                {/* Show FX */} FX
            </Button>
        </Stack>
    );
};
export default ShowFXView;