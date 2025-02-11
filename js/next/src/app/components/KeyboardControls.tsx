import { Box, FormLabel, SelectChangeEvent, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { KeyboardProps } from '@/types/audioTypes';
import axios from 'axios';

const KeyboardControls = (
   {        
        chuckHook,
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
                color: `rgba(0,0,0,0.78) !important`, 
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'left',
                display: chuckHook ? 'flex': 'none',
                fontFamily: 'monospace',
            }}>


        </Box>
    )
}
export default KeyboardControls;