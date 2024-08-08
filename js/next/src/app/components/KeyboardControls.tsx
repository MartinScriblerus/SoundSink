import { Box, FormLabel, SelectChangeEvent } from '@mui/material';
import React from 'react';
import MingusPopup from './MingusPopup'
import { Chuck } from 'webchuck';

interface KeyboardProps {
    submitMingus: () => void;
    audioKey: string;
    octave: string;
    audioScale: string;
    audioChord: string;
    handleChangeScale: (event: SelectChangeEvent) => void;
    handleChangeChord: (event: SelectChangeEvent) => void;
    programIsOn: boolean;
    selectRef: any;
    tune: any;
    currentMicroTonalScale: any;
    chuckHook: Chuck | undefined;
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
        programIsOn,
        selectRef,
        tune,
        currentMicroTonalScale,
        chuckHook,
    }
    : KeyboardProps
) => {

    return (
        <Box 
            sx={{
                backgroundColor: 'rgba(30,34,26,0.96)', 
                // width:'100%', 
                // display:'flex', 
                flexDirection: 'row',
                // minHeight:'100%',
                justifyContent: 'center',
                alignItems: 'center',
                // position: 'absolute',
                left: '0px',
                bottom: 0,
                display: chuckHook && window.innerHeight > 520 ? 'flex': 'none',
                fontFamily: 'Menlo',
            }}>

            <Box 
                sx={{
                    borderTop: 'solid 1px rgba(255, 255, 255, 0.78)',
                    display: chuckHook && window.innerHeight > 520 ? 'flex': 'none',
                }} 
                className={'fx-popup-left-row'}
            >    
                <MingusPopup 
                    submitMingus={submitMingus}
                    audioKey={audioKey}
                    octave={octave}
                    audioScale={audioScale}
                    audioChord={audioChord}
                    handleChangeScale={handleChangeScale}
                    handleChangeChord={handleChangeChord}
                    selectRef={selectRef}
                    tune={tune}
                    currentMicroTonalScale={currentMicroTonalScale}
                />
            </Box>
        </Box>
    )
}
export default KeyboardControls;