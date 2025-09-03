import React, { useEffect, useState } from 'react';
import { Box, FormLabel, Slider } from '@mui/material';
import { lenMarks } from '@/utils/FXHelpers/helperDefaults';

const lenVals = [0, 1, 2, 3, 4, 5, 6, 7];

function valuetext(value: number) {
  return `${value}`;
}

type VelocityLengthSlidersProps = {
    handleNoteLengthUpdate: (event: any, cellData: any, newValue: any) => void;
    cellData?: any;
    maxLen?: number;
    chuckIsRunning?: boolean;
    masterPatterns?: any;
}

const VelocityLengthSliders = (props: VelocityLengthSlidersProps) => {

    const { handleNoteLengthUpdate, cellData, maxLen, chuckIsRunning, masterPatterns } = props;
    const idx = lenMarks.map(i => Number(+i.label)).indexOf(masterPatterns?.length);
    const [noteLengthValue, setNoteLengthValue] = useState<number>(idx);



    return (
        <Box sx={{ 
            padding: '4px', 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginRight: '8px',
        }}>
            {/* <Box className={'note-len-title'}> */}
                <FormLabel
                    sx={{
                        color: 'rgba(245,245,245,0.78)',
                        fontSize: '11px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                    }}
                    id="velocities-select-label"
                >Note Length</FormLabel>
                <Slider
                    aria-label="Note Length"
                    // value={noteLengthValue}
                    value={noteLengthValue}
                    onChange={(e, newValue) => {
                        console.log("NV! ", newValue);
                        if (!chuckIsRunning) {
                            !chuckIsRunning && setNoteLengthValue(newValue as number);
                            handleNoteLengthUpdate(e, cellData, newValue);
                        }
                    }}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={1}
                    sx={{
                        color: 'rgba(245,245,245,0.78)',
                        backgroundColor: 'rgba(28,28,28,0.78)',
                        width: '100%',
                    }}
                    // onChange={(e) => !chuckIsRunning && handleNoteLengthUpdateLocal(e)}
                    marks={lenMarks}
                    min={0}
                    max={8}
                />
            {/* </Box> */}

        </Box>
    )
};
export default VelocityLengthSliders;