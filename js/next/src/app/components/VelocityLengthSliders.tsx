import React, { useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';

const lenVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const marks = [
    {
        value: 0,
        label: '/128',
    },
    {
        value: 1,
        label: '/64',
    },
    {
        value: 2,
        label: '/32',
    },
    {
        value: 3,
        label: '/16',
    },
    {
        value: 4,
        label: '/8',
    },
    {
        value: 5,
        label: '/4',
    },
    {
        value: 6,
        label: '/2',
    },
    {
        value: 7,
        label: '1',
    },
    {
        value: 8,
        label: '2',
    },
    {
        value: 9,
        label: '4',
    }
]

function valuetext(value: number) {
  return `${value}`;
}

type VelocityLengthSlidersProps = {
    handleNoteLengthUpdate: (event: any, cellData: any) => void;
    handleNoteVelocityUpdate: (event: Event, cellData: any) => void;
    cellData?: any;
}

const VelocityLengthSliders = (props: VelocityLengthSlidersProps) => {

    const { handleNoteLengthUpdate, handleNoteVelocityUpdate, cellData } = props;

    useEffect(() => {
        if (cellData) {
            console.log("Cell Data Updated in Velocity Length Sliders: ", cellData);
        }
    }, [cellData]);

    const handleNoteLengthUpdateLocal = (e: any) => {
        handleNoteLengthUpdate(e, cellData);
    }

    const handleNoteVelocityUpdateLocal = (e: any) => {
        handleNoteVelocityUpdate(e, cellData);
    }

    return (
        <Box sx={{ 
            padding: '4px', 
    
        }}>
            <Box className={'note-len-title'}
            >
                {/* Length:  */}
                <Slider
                    aria-label="Note Length"
                    value={lenVals[3]}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={null}
                    sx={{
                        color: 'rgba(245,245,245,0.78)',
                        backgroundColor: 'rgba(28,28,28,0.78)'
                    }}
                    onChange={handleNoteLengthUpdateLocal}
                    marks={marks}
                    min={0}
                    max={9}
                />
            </Box>
                        <Box className={'note-len-title'}
            >
                {/* Velocity:  */}
                <Slider
                    aria-label="Note Velocity"
                    value={0.5}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    sx={{
                        color: 'rgba(245,245,245,0.78)',
                        backgroundColor: 'rgba(28,28,28,0.78)'
                    }}
                    onChange={handleNoteVelocityUpdateLocal}
                    min={0}
                    max={1}
                />
            </Box>
        </Box>
    )
};
export default VelocityLengthSliders;