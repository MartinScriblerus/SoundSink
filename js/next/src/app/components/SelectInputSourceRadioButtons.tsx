import React, {useEffect, useRef, useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import '../globals.css';
import { Box, Button } from '@mui/material';
import FixedOptionsDropdown from './FixedOptionsSelect';
import { STKOption } from '@/utils/fixedOptionsDropdownData';

interface Props {
    value: string;
    handleChange: (msg: any) => void;
    updateStkKnobs: (knobVals: any) => void;
    setStkValues: React.Dispatch<React.SetStateAction<any>>;
    stkValues: STKOption[] | [];
    updateCurrentFXScreen: () => void;
    currentScreen: string;
    playUploadedFile: (name: string) => void;
    lastFileUpload: string;
    // updateFileUploads: (e: any) => void;
}

const SelectInputSourceRadioButtons = (props: Props) => {
    const {
        value, 
        handleChange,
        updateStkKnobs,
        setStkValues,
        stkValues,
    } = props;

    return (
        <Box 
            className="side-nav"
            sx={{
                display: window.innerHeight > 480 ? 'flex' : 'none', 
                flexDirection: 'column', 
                // color: 'rgba(228,225,209,1)', 
                justifyContent: 'top !important',
                alignItems: 'top',
                // padding: '24px',
                // color: 'rgba(147, 206, 214, 1)',
                color: 'white',
                height: '100%',
                maxWidth: '122px',
                borderRight: 'rgba(0,0,0,0.7) 1px solid',
                backgroundColor: 'transparent',
                background: "rgba(0,0,0,0.9)",
                left: "0PX",
                position: "relative",
                border: "0px",
                width: "100%",
                zIndex: "99",
                paddingLeft: "4px",
            }}>
                <FormLabel 
                    sx={{
                        fontSize:'20px',
                        fontWeight:'300',
                        width: '100%',
                        textAlign: 'center',
                        color: 'rgba(147, 206, 214, 1) !important',
                        display: 'flex',
                        flexDirection: 'row',
                        
                    }} 
                    id="demo-controlled-radio-buttons-group"
                >
                    FX Input
                </FormLabel>

            {/* /////// FX to INPUT */}
            <Box sx={{
                    borderTop: 'solid 1px rgba(147, 206, 214, 1)'
                }} 
                className={'fx-popup-left-row'}>           
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    // sx={{color: "rgba(147, 206, 214, 1)"}}
                    sx={{color: "rgba(255,255,255,1)"}}
                    onChange={handleChange}
                >
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(228,225,209,1)'
                        }} 
                        value="Osc1" 
                        control={<Radio />} 
                        label="Osc1" />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(228,225,209,1)'
                        }} 
                        value="Osc2" 
                        control={<Radio />} 
                        label="Osc2" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(228,225,209,1)'
                        }} 
                        value="STK" 
                        control={<Radio />} 
                        label="STK" />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(228,225,209,1)'
                        }} 
                        value="Sampler" 
                        control={<Radio />} 
                        label="Sampler" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: 'rgba(228,225,209,1)'
                        }} 
                        value="AudioIn" 
                        control={<Radio />} 
                        label="Audio In" />
                </RadioGroup>
            </Box>
        </Box>
    );
}
export default SelectInputSourceRadioButtons;