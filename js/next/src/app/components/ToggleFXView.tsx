import * as React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';

type Props = {
    stkCount: number;
    fxCount: number;
    handleReturnToSynth: () => void;
    programIsOn: boolean;
    handleToggleStkArpeggiator: () => void;
    handleToggleArpeggiator: () => void;
    stkFX: any;
    checkedFXList: any;
    keysVisible: boolean;
    analysisPopupOpen: boolean;
};

const ToggleFXView = ({
    stkCount, 
    fxCount, 
    handleReturnToSynth, 
    programIsOn, 
    analysisPopupOpen,
}: Props) => {

    const stkCountHandler = stkCount ? stkCount : 0;
    const fxCountHandler = fxCount? fxCount : 0;

    const theme = useTheme();

    return (

            <Button 
                sx={{
                    // minWidth: '208px', 
                    minWidth: '60px',
                    maxWidth: '60px',
                    height: '40px',
                    borderRadius: '50% !important',
                    transform: 'scale(0.7)',
                    minHeight: '60px',
                    border: theme.palette.primaryB,
                    background: theme.palette.black,
                    color: `${theme.palette.white} important!`,
                    display: programIsOn ? "flex" : "none",
                    marginLeft: '0px',
                    marginBottom: '4px',
                    zIndex: analysisPopupOpen ? '0' : '99',
                    pointerEvents: "all",
                    cursor: "pointer",
                    '&:hover': {
                        color: theme.palette.white,
                        background: theme.palette.black,
                        border: `1px solid ${theme.palette.primaryB}`,
                    },
                    // pointerEvents: fxCountHandler+stkCountHandler === 0 ? 'none': 'auto'
                }} 
                onClick={handleReturnToSynth} 
                variant="outlined" 
                // endIcon={<PianoIcon />}
                >
                {/* FX View */}View
            </Button>
    //     </Stack>
    );
};
export default ToggleFXView;