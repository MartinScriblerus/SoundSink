import * as React from 'react';
import Button from '@mui/material/Button';
import InputIcon from '@mui/icons-material/Input';
import '../page.module.css';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import { MUTED_OLIVE } from '@/utils/constants';

type Props = {
    // currentFXScreen: string;
    // setCurrentFXScreen: React.Dispatch<React.SetStateAction<string>>;
    handleShowFX: () => void;
    programIsOn: boolean;
};

const ShowFXView = ({handleShowFX, programIsOn}: Props) => {
    
    const theme = useTheme();

    return (
        <Stack 
            sx={{
                display: programIsOn ? "flex" : "none",
                flexDirection: "row",
                width: "100% !important",
                background: 'rgba(0,0,0,0.78)',
            }} 
            direction="row" spacing={2}>
            <Button 
                sx={{
                    minWidth: '140px', 
                    display: programIsOn ? "flex" : "none",
                    flexDirection: "row",
                    width: "100%",
                    border: MUTED_OLIVE,
                    background: 'rgba(0,0,0,0.78)',
                    color: `rgba(0,0,0,0.78) important!`,
                    marginLeft: '0px',              
                    '&:hover': {
                        color: 'rgba(255,255,255,0.78)',
                        background: 'rgba(0,0,0,0.78)',
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