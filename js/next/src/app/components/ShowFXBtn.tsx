import * as React from 'react';
import Button from '@mui/material/Button';
import InputIcon from '@mui/icons-material/Input';
import '../page.module.css';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';

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
                background: theme.palette.black
            }} 
            direction="row" spacing={2}>
            <Button 
                sx={{
                    minWidth: '140px', 
                    display: programIsOn ? "flex" : "none",
                    flexDirection: "row",
                    width: "100%",
                    border: theme.palette.primaryB,
                    background: theme.palette.black,
                    color: `${theme.palette.white} important!`,
                    marginLeft: '0px',              
                    '&:hover': {
                        color: theme.palette.white,
                        background: theme.palette.black,
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