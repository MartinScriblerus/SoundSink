import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}°C`;
}

const marks = [
    {
        value: 4,
        label: '4',
    },
    {
        value: 8,
        label: '8',
    },
    {
        value: 16,
        label: '16',
    },
    {
        value: 32,
        label: '32',
    },
    {
        value: 64,
        label: '64',
    }
  ];

interface SliderProps {
    handleOscRateUpdate: (val: any) => void;
    handleStkRateUpdate: (val: any) => void;
    handleSamplerRateUpdate: (val: any) => void;
    handleAudioInRateUpdate: (val: any) => void;

    filesToProcess: any[];
    currentNoteVals: any;
}

export default function DiscreteSlider(props: SliderProps) {
    const {
        handleOscRateUpdate, 
        handleStkRateUpdate, 
        handleSamplerRateUpdate, 
        handleAudioInRateUpdate,
        currentNoteVals,
        filesToProcess
    } = props;

    if (currentNoteVals.length > 0) {
        console.log("CURRENT NOTE VALS! ", currentNoteVals);
    }
    if (filesToProcess.length > 0) {
        console.log("FILES TO PROCESS: ", filesToProcess);
    }


    return (
    <>
        <Box sx={{ 
            maxHeight: '40px', 
            width: '100%', 
            display: window.innerHeight > 800 ? 'flex' : 'none', 
            flexDirection: 'row',
            paddingTop: '12px', 
            marginLeft: '-12px',
            textAlign: 'center',
            justifyContent: 'center',
            fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: '300' 
        }}>
            <Box sx={{ 
                maxHeight: '40px', 
                width: '40%', 
                paddingRight: '5%', 
                paddingLeft: '5%',
            }}>
                Osc Rate:
                <Slider
                    aria-label="OscRate"
                    defaultValue={currentNoteVals.oscs[0]}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={null}
                    sx={{color: 'white'}}
                    onChange={handleOscRateUpdate}
                    marks={marks}
                    min={1}
                    max={64}
                    color="secondary"
                />
            </Box>
            <Box sx={{ 
                maxHeight: '40px',
                width: '40%', 
                paddingRight: '5%', 
                paddingLeft: '5%' 
            }}>
                STK Rate:
                <Slider
                    aria-label="StkRate"
                    defaultValue={currentNoteVals.stks[0]} //
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={null}
                    sx={{color: 'white'}}
                    onChange={handleStkRateUpdate}
                    marks={marks}
                    min={1}
                    max={64}
                />
            </Box>
        </Box>
        <Box sx={{
                fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif', 
                fontWeight: '300', 
                maxHeight: '40px', 
                width: '100%', 
                display: window.innerHeight > 680 ? 'flex' : 'none', 
                flexDirection: 'row',
                marginLeft: '-12px', 
                textAlign: 'center',
                justifyContent: 'center',
            }}
        >
            
            <Box sx={{ 
                    paddingTop: '48px', 
                    maxHeight: '40px', 
                    width: '40%', 
                    paddingRight: '5%', 
                    paddingLeft: '5%' 
                }}
            >
                Sampler Rate: 
                <Slider
                    aria-label="SamplerRate"
                    defaultValue={currentNoteVals.samples[0]}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={null}
                    sx={{color: 'white'}}
                    onChange={handleSamplerRateUpdate}
                    marks={marks}
                    min={1}
                    max={64}
                />
            </Box>
            <Box sx={{ 
                paddingTop: '48px',
                maxHeight: '40px', 
                width: '40%', 
                paddingRight: '5%', 
                paddingLeft: '5%' 
                }}
            >
                Audio In Rate: 
                <Slider
                    aria-label="AudioInRate"
                    defaultValue={4}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={null}
                    sx={{color: 'white'}}
                    onChange={handleAudioInRateUpdate}
                    marks={marks}
                    min={1}
                    max={64}
                />
            </Box>
        </Box>
    </>
  );
}
