import React, { useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, useTheme } from '@mui/material';
import { FOREST_GREEN } from '@/utils/constants';

interface Props {
    checkedEffectsListHook: Array<string> | any;
    handleCheckedFXToShow: (msg:any) => void;
}

const CheckedFXRadioBtns = (props: Props) => {
    const {checkedEffectsListHook, handleCheckedFXToShow} = props;
    const theme = useTheme();
        
    // useEffect(() => {
    //     console.log("checked effects list hook: ", checkedEffectsListHook);
    // }, [])

    return (
        <Box sx={{position: 'relative'}}>
            <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label-selfx">Selected Effects</FormLabel> */}
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label-checkedFX"
                    name="row-radio-buttons-group-checkedFX"
                    onChange={handleCheckedFXToShow}
                    sx={{
                        color: FOREST_GREEN, 
                        zIndex: 9999, 
                        fontSize: '13px'
                    }}
                >
                    {
                        checkedEffectsListHook && checkedEffectsListHook.length > 0 && checkedEffectsListHook.forEach((cFX: any) => {
                            <FormControlLabel 
                            key={`${cFX}_fx_radio_btn`}
                                sx={{color: 'rgba(245,245,245,0.78)'}}
                                value={`${cFX}`} 
                                control={<Radio />} 
                                label={`YOO${cFX}`} />
                        })
                    }
                </RadioGroup>
        </FormControl>
      </Box>
    )
};
export default CheckedFXRadioBtns; 