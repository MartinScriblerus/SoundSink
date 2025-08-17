import { PERRIWINKLE } from '@/utils/constants';
import { Box, FormControl, TextField, useTheme } from '@mui/material';
import React from 'react';

interface SubdivisionsPickerProps {
    xVal: number;
    yVal: number;
    masterPatternsHashHook: any;
    cellSubdivisions: number;
    handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
}

const SubdivisionsPicker = (props: SubdivisionsPickerProps) => {
    const {  xVal, yVal, masterPatternsHashHook, cellSubdivisions, handleChangeCellSubdivisions } = props;
    
    const theme = useTheme();
    
    return (
        <Box 
            sx={{
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "flex-end",
            }}
        >
            <FormControl
                sx={{
                    // margin: '8px',
                    padding: '0px',
                    color: 'rgba(228,225,209,1)',
                    maxWidth: '76px',
                    width: '50%',
                    // height: 'auto', // ✅
                }}
            >
            <TextField
                type="number"
                value={cellSubdivisions}
                onChange={(event) => {
                    const val = Number(event.target.value);
                    if (val > 0) {
                        handleChangeCellSubdivisions(val, xVal, yVal);
                        masterPatternsHashHook[`${yVal}`][`${Number(xVal)}`].subdivisions = val;
                    }
                }}
                inputProps={{
                style: {
                    color: 'primary.contrastText',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    width: '100%',
                },
                }}
                sx={{
                    input: { color: 'primary.contrastText' },
                    backgroundColor: PERRIWINKLE,
                    maxWidth: "6rem",
                    width: '72px',
                }}
            />
            </FormControl>
        </Box>
    )
}
export default SubdivisionsPicker;