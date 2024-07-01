import { Box, SelectChangeEvent } from '@mui/material';
import React from 'react';
import MingusPopup from './MingusPopup'

interface KeyboardProps {
    submitMingus: () => void;
    audioKey: string;
    octave: string;
    audioScale: string;
    audioChord: string;
    handleChangeScale: (event: SelectChangeEvent) => void;
    handleChangeChord: (event: SelectChangeEvent) => void;
    programIsOn: boolean;
}

const KeyboardControls = (
   {        
        submitMingus,
        audioKey,
        octave,
        audioScale,
        audioChord,
        handleChangeScale,
        handleChangeChord,
        programIsOn
    }
    : KeyboardProps
) => {
    // const {
    //     submitMingus,
    //     audioKey,
    //     octave,
    //     audioScale,
    //     audioChord,
    //     handleChangeScale,
    //     handleChangeChord
    // } = props;
    return (
        <Box 
            sx={{
                backgroundColor: 'rgba(30,34,26,0.96)', 
                // width:'100%', 
                display:'flex', 
                flexDirection: 'column',
                // minHeight:'100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <MingusPopup 
                submitMingus={submitMingus}
                audioKey={audioKey}
                octave={octave}
                audioScale={audioScale}
                audioChord={audioChord}
                handleChangeScale={handleChangeScale}
                handleChangeChord={handleChangeChord}
            />
        </Box>
    )
}
export default KeyboardControls;