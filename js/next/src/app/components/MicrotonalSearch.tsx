import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import microtoneDescsData from '../microtone_descriptions.json'; 

interface MicrotonalSearchProps {
    selectRef: any; 
    tune: any;
    currentMicroTonalScale: any;
}

export default function Playground(props: MicrotonalSearchProps) {
    const {selectRef, tune, currentMicroTonalScale} = props;
    const [microtoneDescs, setMicrotoneDescs] = React.useState<any>([]);
    console.log("PPPROPS? ", selectRef, tune, currentMicroTonalScale);
  
    React.useMemo(() => {
      setMicrotoneDescs(microtoneDescsData.map((i: any) => {return {
        label: i.name,
        value: i.name,
        name: i.name,
        description: i.description,
      }
      }));
    }, []); 
  const defaultProps = {
    options: microtoneDescs,
    getOptionLabel: (option: FilmOptionType) => option.description,
  };
  // const flatProps = {
  //   options: microtoneDescs.map((option) => option.),
  // };
  const [value, setValue] = React.useState<FilmOptionType | null>(null);

  const chosenNameRef = React.useRef<any>('');
  const chosenDescRef = React.useRef<any>('');


  const updateMicro = (e: any) => {
    console.log("In update micro in microtonal search: ", e.target.name);
    setValue(e.target.name)
  };

  const hoverMicro = (e: any) => {
    console.log("Hovering micro and should get description ", e.target.description);
  }

  return (
    <Stack id="MicroSearch" spacing={1} sx={{ zIndex: 9999, color: "white"}}>




      <Autocomplete
        {...defaultProps}
        id="auto-complete"
        autoComplete
        includeInputInList
        sx={{color: "white"}}
        renderInput={(params) => (
          <TextField {...params} label="autoComplete" variant="standard" />
        )}
      />
    </Stack>
  );
}

interface FilmOptionType {
  name: string;
  description: string;
  label: string;
  value: string;
}


