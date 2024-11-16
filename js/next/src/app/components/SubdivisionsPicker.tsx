import { Box, FormControl, TextField, useTheme } from '@mui/material';
import React from 'react';

interface SubdivisionsPickerProps {
    xVal: number;
    yVal: number;
    patternsHash: any;
    cellSubdivisions: number;
    handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
}

const SubdivisionsPicker = (props: SubdivisionsPickerProps) => {
    const {  xVal, yVal, patternsHash, cellSubdivisions, handleChangeCellSubdivisions } = props;
    
    const theme = useTheme();
    
    return (
        <Box sx={{display: "flex", flexDirection: "row", }}>
            <FormControl
                sx={{
                    margin: '8px', 
                    padding: '0px !important', 
                    // maxWidth: '100px', 
                    color:'rgba(228,225,209,1)',
                    maxWidth: '76px',
                    width: '50%',
                    paddingTop: '0px',
                    height: '0px',
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                }
            }>
                <TextField
                    focused
                    inputProps={{ 
                        style: { 
                            color: 'primary.contrastText',
                            // fontFamily: notoSans,
                            fontSize: '24px',
                            width:'100%'
                        } 
                    }}
                    sx={{
                        input: { color: 'primary.contrastText' },
                        // minWidth: "2rem",
                        backgroundColor: theme.palette.secondaryA,
                        color: 'status.text',
                        // paddingTop: 0,
                        fontFamily: 'sans-serif',
                        display: 'flex',
                        fontSize: '32px',
                        alignItems: 'center',
                        // paddingBottom: 0,
                        // margin: "1rem",
                        // maxWidth: "6rem",
                        height: "100%",
                        width: '72px',
                    }}
                    // label={"Subdivisions"}
                    // placeholder="Subdivisions"
                    // InputLabelProps={{
                    //     shrink: true,
                    //   }}
                    type="number"
                    id="standard-textarea"
                    className="inputSampleInfo"
                    variant="outlined"
                    defaultValue={cellSubdivisions}
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            const inputCellDivisions: any = parseInt(event.target.value);
                            // alert(`${inputCellDivisions} _ ${xVal} _ ${yVal}`);
                            if (inputCellDivisions && inputCellDivisions > 0 ) {
                                handleChangeCellSubdivisions(inputCellDivisions, xVal, yVal);
                                    patternsHash[`${yVal}`][`${Number(xVal)}`].subdivisions = inputCellDivisions;
                            }
                        }
                    }
                />
            </FormControl>
        {/* </Box> */}
    </Box>
    )
}
export default SubdivisionsPicker;