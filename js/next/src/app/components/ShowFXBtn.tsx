import * as React from 'react';
import Button from '@mui/material/Button';
import InputIcon from '@mui/icons-material/Input';
import '../page.module.css';
import Stack from '@mui/material/Stack';

type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    handleShowFX: () => void;
    programIsOn: boolean;
};

const ShowFXView = ({handleShowFX, programIsOn}: Props) => {
    return (
        <Stack direction="row" spacing={2}>
            <Button 
                sx={{
                    minWidth: '140px', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(158, 210, 162, 0.8)', 
                    background: 'rbga(0,0,0,.7)', 
                    marginLeft: '0px',
                    border: '0.5px solid #b2b2b2',
                    display: programIsOn ? "flex" : "none",
                    '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                    }
                }} 
                className={"ui_SynthLayerButton"}
                onClick={handleShowFX} 
                endIcon={<InputIcon />}>
                {/* Show FX */} Effects
            </Button>
        </Stack>
    );
};
export default ShowFXView;