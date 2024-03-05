import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '../globals.css';
import { Box, Button } from '@mui/material';
import FixedOptionsDropdown from './FixedOptionsSelect';
import { STKOption } from '@/utils/fixedOptionsDropdownData';
import ToggleFXView from './ToggleFXView';

interface Props {
    value: string;
    handleChange: (msg: any) => void;
    updateStkKnobs: (knobVals: any) => void;
    setStkValues: React.Dispatch<React.SetStateAction<any>>;
    stkValues: STKOption[] | [];
    updateCurrentFXScreen: () => void;
    currentScreen: string;
}

const SelectInputSourceRadioButtons = (props: Props) => {
    const {
        value, 
        handleChange,
        updateStkKnobs,
        setStkValues,
        stkValues,
        updateCurrentFXScreen,
        currentScreen
    } = props;

    return (
        <Box 
            className="side-nav"
            sx={{
                display:'flex', 
                flexDirection: 'column', 
                // color: 'rgba(228,225,209,1)', 
                justifyContent: 'top !important',
                alignItems: 'top',
                padding: '24px',
                color: 'rgba(147, 206, 214, 1)',
                height: '100%',
            }}>


            <Box sx={{borderBottom: 'solid 1px rgba(147, 206, 214, 1)'}} className={'fx-popup-left-row'}>
                <FormLabel 
                    sx={{
                        fontSize:'28px',
                        fontWeight:'300',
                        color: 'rgba(147, 206, 214, 1) !important',
                        borderBottom: 'solid 1px rgba(147, 206, 214, 1)'
                    }} 
                    id="stk-controlled-dropdown-label"
                >
                    STK Manager
                </FormLabel>
            
                {<FixedOptionsDropdown 
                    updateStkKnobs={
                        (e: STKOption[]) => updateStkKnobs(e)
                    } 
                    stkValues={stkValues} 
                    setStkValues={setStkValues} 
                />}
                {/* {stkValues.length > 0 ? */}
                   {currentScreen !== '' && <ToggleFXView updateCurrentFXScreen={updateCurrentFXScreen}/>}
                {/* } */}
            </Box>
            
            {/* /////// FX to INPUT */}
            <Box sx={{borderBottom: 'solid 1px rgba(147, 206, 214, 1)'}} className={'fx-popup-left-row'}>
                <FormLabel 
                    sx={{
                        fontSize:'28px',
                        fontWeight:'300',
                        color: 'rgba(147, 206, 214, 1) !important',
                    }} 
                    id="demo-controlled-radio-buttons-group"
                >
                    FX to Input
                </FormLabel>
            
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    sx={{color: "rgba(147, 206, 214, 1)"}}
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

            {/* /////// FILE MANAGER */}
            <Box className={'fx-popup-left-row'}>
                <FormLabel 
                    sx={{
                        fontSize:'28px',
                        fontWeight:'300',
                        color: 'rgba(147, 206, 214, 1) !important'
                    }} 
                    id="file-manager-controlled-radio-buttons-group"
                >
                    File Manager
                </FormLabel>

                <Button
                    variant="contained"
                    component="label"
                    sx={{marginTop: '4px', marginBottom: '8px'}}
                    >
                    Upload File
                    <input
                        type="file"
                        hidden
                    />
                </Button>

                <Box>No File Found</Box>
            </Box>
        </Box>
    );
}
export default SelectInputSourceRadioButtons;