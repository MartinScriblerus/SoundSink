import React, { useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';
import { lenMarks } from '@/utils/FXHelpers/helperDefaults';

const lenVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function valuetext(value: number) {
  return `${value}`;
}

type VelocityLengthSlidersProps = {
    handleNoteLengthUpdate: (event: any, cellData: any) => void;
    cellData?: any;
}

const VelocityLengthSliders = (props: VelocityLengthSlidersProps) => {

    const { handleNoteLengthUpdate, cellData } = props;

    const [noteLengthValue, setNoteLengthValue] = useState<number>(3);


    useEffect(() => {
        if (cellData) {
            console.log("Cell Data Updated in Velocity Length Sliders: ", cellData);
        }
    }, [cellData]);

    const handleNoteLengthUpdateLocal = (e: any, newValue: number | number[]) => {
        setNoteLengthValue(newValue as number);
        console.log("Note Length Value Updated!!!!: ", cellData, newValue);
        handleNoteLengthUpdate(e, cellData);
    }

    // const handleNoteVelocityUpdateLocal = (e: any, newValue: number | number[]) => {
    //     setNoteVelocityValue(newValue as number);
    //     handleNoteVelocityUpdate(e, cellData);
    // }

    return (
        <Box sx={{ 
            padding: '4px', 
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box className={'note-len-title'}>
                <Slider
                    aria-label="Note Length"
                    value={noteLengthValue}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={1}
                    sx={{
                        color: 'rgba(245,245,245,0.78)',
                        backgroundColor: 'rgba(28,28,28,0.78)'
                    }}
                    onChange={handleNoteLengthUpdateLocal}
                    marks={lenMarks}
                    min={0}
                    max={10}
                />
            </Box>

        </Box>
    )
};
export default VelocityLengthSliders;