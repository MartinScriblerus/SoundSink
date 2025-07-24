import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type GroupToggleProps = {
    name: string;
    options: string[],
    handleSourceToggle: (name: string, val: any) => void;
}

export default function GroupToggle(props: GroupToggleProps) {
  const {name, options, handleSourceToggle} = props;
  const [alignment, setAlignment] = React.useState('osc1');

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
      {options.map((option: string, idx: number) => {
          return <ToggleButton 
            key={`toggleWrapper${option.toLowerCase()}_${idx}`}
            sx={{
              width: '20%',
            }}
            // key={`toggleWrapper_${idx}`}
            className={`option-button-source-toggle`}
            value={`${option.toLowerCase()}`}>{
              option.toLowerCase().includes('osc1') ? 'Poly' : 
              option.toLowerCase().includes('osc2') ? 'Mono' :
              option.toLowerCase().includes('stk') ? 'Inst' :
              option.toLowerCase().includes('sampler') ? 'Samp' :
              option.toLowerCase().includes('audioin') ? 'AudioIn' : option
            }</ToggleButton>
        })
      }
    </ToggleButtonGroup></>
  );
}