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
}

export default function DiscreteSlider(props: SliderProps) {
    const {handleOscRateUpdate, handleStkRateUpdate, handleSamplerRateUpdate, handleAudioInRateUpdate} = props;
  return (
    <>
    <Box sx={{ maxHeight: '40px', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ maxHeight: '40px', width: '50%', paddingRight: '10%', paddingLeft: '10%' }}>
            Osc Rate:
            <Slider
                aria-label="OscRate"
                defaultValue={4}
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
        <Box sx={{ maxHeight: '40px',width: '50%', paddingRight: '10%', paddingLeft: '10%' }}>
            STK Rate:
            <Slider
                aria-label="StkRate"
                defaultValue={4}
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
    <Box sx={{ maxHeight: '40px', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ maxHeight: '40px', width: '50%', paddingRight: '10%', paddingLeft: '10%' }}>
            Sampler Rate: 
            <Slider
                aria-label="SamplerRate"
                defaultValue={4}
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
        <Box sx={{ maxHeight: '40px', width: '50%', paddingRight: '10%', paddingLeft: '10%' }}>
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
