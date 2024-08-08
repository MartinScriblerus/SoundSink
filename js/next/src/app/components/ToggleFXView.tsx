import * as React from 'react';
import Button from '@mui/material/Button';

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
};

const ToggleFXView = ({
    stkCount, 
    fxCount, 
    handleReturnToSynth, 
    programIsOn, 
}: Props) => {

    const stkCountHandler = stkCount ? stkCount : 0;
    const fxCountHandler = fxCount? fxCount : 0;

    return (
        // <Stack direction="row" spacing={2} style={{
        //     position:"relative", 
        //     left: "12px", 
        //     top: "0px"}}>
            <Button 
                sx={{
                    // minWidth: '208px', 
                    minWidth: '60px',
                    maxWidth: '60px',
                    height: '40px',
                    borderRadius: '50% !important',
                    transform: 'scale(0.7)',
                    minHeight: '60px',
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(219, 230, 161, 0.97)', 
                    border: '0.5px solid #b2b2b2',
                    display: programIsOn ? "flex" : "none",
                    marginLeft: '0px',
                    marginBottom: '4px',
                    '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                        border: '1px solid #1976d2',
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