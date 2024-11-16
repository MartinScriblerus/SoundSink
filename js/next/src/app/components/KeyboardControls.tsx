import { Box, FormLabel, SelectChangeEvent, useTheme } from '@mui/material';
import React, { useState } from 'react';
import MingusPopup from './MingusPopup'
import { KeyboardProps } from '@/types/audioTypes';
import STKManagerDropdown from './STKManagerDropdown';
import CustomAriaLive from './MicrotonesSearch';
import axios from 'axios';
import CheckedFXRadioBtns from './CheckedFXRadioBtns';
import SelectInputSourceRadioButtons from './SelectInputSourceRadioButtons';

const KeyboardControls = (
   {        
        programIsOn,
        selectRef,
        tune,
        currentMicroTonalScale,
        chuckHook,
        updateStkKnobs,
        stkValues,
        setStkValues,
        handleCheckedFXToShow,
        checkedEffectsListHook,


        handleChange,
        value,
        updateCurrentFXScreen,
        currentScreen,
        playUploadedFile,
        lastFileUpload,
    }
    : KeyboardProps
) => {
    const [octave, setOctave] = useState('4'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioKey, setAudioKey] = useState('C'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioScale, setAudioScale] = useState('Major'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const [audioChord, setAudioChord] = useState('M'); // ** THESE SHOULD EXIST AS NEW OBJECT
    const handleChangeAudioKey = (key: string) => {
        console.log('ALL GOOD ON KEY ', key);
        setAudioKey(key as string);
    };

    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    const requestOptions = {                                                                                                                                                                                 
        headers: headerDict,
        params: {
            key: audioKey || 'A',
        }
    };

    const theme = useTheme();

    const submitMingus = async () => {
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_scales`, { audioKey, audioScale, octave }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST SCALES HERE 1# ", data);
            //return setMingusKeyboardData(data);
        });
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/mingus_chords`, { audioChord, audioKey }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            console.log("TEST CHORDS 1# ", data);
            // return mingusChordsData.current = data;
            return data;
        });
    }

    const handleChangeOctave = (octave: string) => {
        console.log('ALL GOOD ON OCTAVE ', octave);
        setOctave(octave);
    };

    const handleChangeScale = (event: SelectChangeEvent) => {
        console.log('WHAT IS EVENT IN HANDLECHANNGESCALE? ', event);
        setAudioScale(event.target.value as string);
        submitMingus();
    };

    const handleChangeChord = (event: SelectChangeEvent) => {
        console.log('WHAT IS EVENT IN HANDLECHANNGECHORD? ', event);
        setAudioChord(event.target.value as string);
        submitMingus();
    };

    return (
        <Box 
            sx={{
                backgroundColor: theme.palette.black,
                color: theme.palette.white, 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                top: '120px',
                left: '172px',
                position: 'absolute',
                display: chuckHook && window.innerHeight > 520 ? 'flex': 'none',
                fontFamily: 'monospace',
                width: '140px'
            }}>

            <Box 
                sx={{
                    display: 'none', // TODO --> return the above styling when ready...                  
                }} 
                // className={'fx-popup-left-row'}
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
                <STKManagerDropdown
                    updateStkKnobs={updateStkKnobs}
                    stkValues={stkValues}
                    setStkValues={setStkValues}
                ></STKManagerDropdown>
                <CustomAriaLive 
                    selectRef={selectRef} 
                    tune={tune} 
                    currentMicroTonalScale={currentMicroTonalScale} 
                />
                    <CheckedFXRadioBtns 
                        handleCheckedFXToShow={handleCheckedFXToShow} 
                        checkedEffectsListHook={checkedEffectsListHook}
                    >
                    </CheckedFXRadioBtns>
                    {
                (<SelectInputSourceRadioButtons 
                    handleChange={handleChange} 
                    value={value}
                    updateStkKnobs={updateStkKnobs}
                    setStkValues={setStkValues}
                    stkValues={stkValues}
                    updateCurrentFXScreen={updateCurrentFXScreen}
                    currentScreen={currentScreen.current}
                    playUploadedFile={playUploadedFile}
                    lastFileUpload={lastFileUpload}
                />)
            }
            </Box>
        </Box>
    )
}
export default KeyboardControls;