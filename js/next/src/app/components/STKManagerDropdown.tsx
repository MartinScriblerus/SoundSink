import { Box, FormLabel } from '@mui/material';
import React from 'react';
import FixedOptionsDropdown from './FixedOptionsSelect';
import { STKOption } from '@/utils/fixedOptionsDropdownData';

interface Props {
    updateStkKnobs: (e: any) => void;
    stkValues: any[];
    setStkValues: React.Dispatch<React.SetStateAction<any>>;

}

const STKManagerDropdown = (
    props : Props
) => {
    const {updateStkKnobs, stkValues, setStkValues} = props;
    return (
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
                (e: any) => updateStkKnobs(e)
            } 
            stkValues={stkValues} 
            setStkValues={setStkValues} 
        />}
    </Box>
    )
}
export default STKManagerDropdown;