import * as React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';
import { GOLDEN_YELLOW } from '@/utils/constants';

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
                // border: GOLDEN_YELLOW,
                border: 'transparent',
                background: 'rgba(28,28,28,0.78)',
                color: `rgba(245,245,245,0.78) important!`,
                display: programIsOn ? "flex" : "none",
                marginLeft: '0px',
                marginBottom: '4px',
                zIndex: '99',
                pointerEvents: "auto",
                cursor: "pointer",
                '&:hover': {
                    color: 'rgba(245,245,245,0.78)',
                    background: 'rgba(28,28,28,0.78)',
                    // border: `1px solid ${GOLDEN_YELLOW}`,
                    border: 'transparent',
                },
                // pointerEvents: fxCountHandler+stkCountHandler === 0 ? 'none': 'auto'
            }} 
            onClick={handleReturnToSynth} 
            variant="outlined" 
            // endIcon={<PianoIcon />}
            >
            {/* FX View */}View
        </Button>
    );
};
export default ToggleFXView;