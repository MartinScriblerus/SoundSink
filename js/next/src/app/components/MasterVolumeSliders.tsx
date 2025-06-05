import * as React from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';


type SliderProps = {
  files: File[];
}

export default function VerticalSlider(props: SliderProps) {
    const { files } = props;
  return (
    <Stack sx={{ height: 300 }} spacing={1} direction="row">
    { 
    files.map((f: File, idx: number) => <Slider
        aria-label="Temperature"
        orientation="vertical"
        key={`MasterVal_${idx}`}
        getAriaValueText={(value: number) => getAriaValueText(value, idx)}
        valueLabelDisplay="auto"
        defaultValue={30}
      />)
    }
    </Stack>
  );
}

function getAriaValueText(value: number, idx: number) {
    console.log("getAriaValueText called with value: ", value, " and idx: ", idx);
    return `${value}`;
}

