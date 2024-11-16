import React, {useEffect, useRef, useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import '../globals.css';
import { Box, Button, useTheme } from '@mui/material';
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
    } = props;

    const theme = useTheme();

    return (
        <Box 
            className="side-nav"
            sx={{
                display: window.innerHeight > 480 ? 'flex' : 'none', 
                // display:'none', // <<<<<< TODO --> return display styling above when ready
                flexDirection: 'row', 
                justifyContent: 'top !important',
                alignItems: 'top',
                fontFamily: '12px',

                
                height: '100%',
                maxWidth: '122px',
                color: theme.palette.white,
                backgroundColor: theme.palette.black,
                // background: "transparent !important",
                left: "0PX",
                // position: "absolute",
                border: "0px",
                width: "100%",
                zIndex: "99",
                paddingLeft: "4px",
            }}>
                {/* <FormLabel 
                    sx={{
                        fontSize:'20px',
                        fontWeight:'300',
                        width: '100%',
                        textAlign: 'center',
                        color: theme.palette.white,
                        display: 'flex',
                        flexDirection: 'row',
                        
                    }} 
                    id="demo-controlled-radio-buttons-group"
                >
                    FX Input
                </FormLabel> */}

            {/* /////// FX to INPUT */}
            <Box sx={{
                    color: theme.palette.white,
                    zIndex:'0'
                }} 
                className={'fx-popup-left-row'}>           
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    sx={{
                        color: theme.palette.white,
                    }}
                    onChange={handleChange}
                >
                    <FormControlLabel 
                        sx={{
                            color: theme.palette.white,
                        }} 
                        value="Osc1" 
                        control={<Radio />} 
                        label="Osc1" />
                    <FormControlLabel 
                        sx={{
                            color: theme.palette.white,
                        }} 
                        value="Osc2" 
                        control={<Radio />} 
                        label="Osc2" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: theme.palette.white,
                        }} 
                        value="STK" 
                        control={<Radio />} 
                        label="STK" />
                    <FormControlLabel 
                        sx={{
                            color: theme.palette.white,
                        }} 
                        value="Sampler" 
                        control={<Radio />} 
                        label="Sampler" 
                    />
                    <FormControlLabel 
                        sx={{
                            color: theme.palette.white,
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