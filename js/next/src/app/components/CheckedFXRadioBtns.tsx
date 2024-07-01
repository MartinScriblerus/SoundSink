import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface Props {
    checkedEffectsListHook: Array<string> | any;
    handleCheckedFXToShow: (msg:any) => void;
}

const CheckedFXRadioBtns = (props: Props) => {
    const {checkedEffectsListHook, handleCheckedFXToShow} = props;

    

    return (
        <FormControl>
            {/* <FormLabel id="demo-row-radio-buttons-group-label-selfx">Selected Effects</FormLabel> */}
            <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label-checkedFX"
            name="row-radio-buttons-group-checkedFX"
            onChange={handleCheckedFXToShow}
            sx={{color: "white", zIndex: 9999}}
            >
                {
                    checkedEffectsListHook && checkedEffectsListHook.length > 0 && checkedEffectsListHook.forEach((cFX: any) => {
                        <FormControlLabel 
                        key={`${cFX}_fx_radio_btn`}
                            sx={{color: 'white'}}
                            value={`${cFX}`} 
                            control={<Radio />} 
                            label={`YOO${cFX}`} />
                    })
                }
            {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="other"
            /> */}
            </RadioGroup>
      </FormControl>
    )
};
export default CheckedFXRadioBtns; 