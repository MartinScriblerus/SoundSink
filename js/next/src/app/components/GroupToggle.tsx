import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@mui/material';

type GroupToggleProps = {
    name: string;
    options: string[],
    handleSourceToggle: (name: string, val: any) => void;
}

export default function GroupToggle(props: GroupToggleProps) {
  const {name, options, handleSourceToggle} = props;
  const [alignment, setAlignment] = React.useState('osc1');

  const theme = useTheme();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
    handleSourceToggle(name, newAlignment);
  };

  return (
    <>
    <ToggleButtonGroup
      id="toggleSourceGroup"
      key={`toggleWrapper_${name.trim().replace(" ", '')}`}
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      HELLO!
      {options.map((option: string, idx: number) => {
          return <ToggleButton 
            key={`toggleWrapper_${idx}`}
            className={`option-button-source-toggle`}
            value={`${option.toLowerCase()}`}>{
              option.toLowerCase().includes('osc1') ? 'Poly' : 
              option.toLowerCase().includes('osc2') ? 'Mono' :
              option.toLowerCase().includes('stk') ? 'Samp' :
              option.toLowerCase().includes('sampler') ? 'Inst' :
              option.toLowerCase().includes('audioin') ? 'Line' : option
            }</ToggleButton>
        })
      }
    </ToggleButtonGroup></>
  );
}