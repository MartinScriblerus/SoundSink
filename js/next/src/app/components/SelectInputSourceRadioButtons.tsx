import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import '../globals.css';
import { Box, useTheme } from '@mui/material';


interface Props {
    value: string;
    handleChange: (msg: any) => void;
}

const SelectInputSourceRadioButtons = (props: Props) => {
    const {
        value, 
        handleChange,
    } = props;

    const theme = useTheme();

    return (
        <Box 
            className="side-nav"
            // id="toggleSourceGroup"
        >

            {/* /////// FX to INPUT */}
            <Box 
                // sx={{
                //     color: theme.palette.white,
                //     zIndex:'0',
                //     fontSize: "13px"
                // }} 
                className={'fx-popup-left-row'}
            >           
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    sx={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: 'red',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        // width:'252px',
                        height: '100%',
                        paddingLeft:'4px',

                        paddingRight: '4px' // paddingTop: '10px',
                    }}
                    onChange={handleChange}
                >
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                        }} 
                        value="Osc1" 
                        control={<Radio />} 
                        label="Osc1" />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                        }} 
                        value="Osc2" 
                        control={<Radio />} 
                        label="Osc2" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                        }} 
                        value="STK" 
                        control={<Radio />} 
                        label="Inst" />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                        }} 
                        value="Sampler" 
                        control={<Radio />} 
                        label="Samp" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                        }} 
                        value="AudioIn" 
                        control={<Radio />} 
                        label="Line In" />
                </RadioGroup>
            </Box>
        </Box>
    );
}
export default SelectInputSourceRadioButtons;