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
        <FixedOptionsDropdown 
            updateStkKnobs={
                (e: any) => updateStkKnobs(e)
            } 
            stkValues={stkValues} 
            setStkValues={setStkValues} 
        />
    )
}
export default STKManagerDropdown;