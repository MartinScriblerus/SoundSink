import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import BPMModule from './BPMModule';
import Button from '@mui/material/Button';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

interface ControlProps {
    bpm: number;
    handleChangeBPM: (newBpm: number) => void;
    beatsNumerator: number;
    beatsDenominator: number;
    handleChangeBeatsNumerator: (npmBpm: number) => void; 
    handleChangeBeatsDenominator: (npmBpm: number) => void;
}

export default function ControlPopup(props: ControlProps) {
  const {
    bpm, 
    handleChangeBPM, 
    beatsNumerator, 
    beatsDenominator, 
    handleChangeBeatsNumerator,
    handleChangeBeatsDenominator} = props;
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick} endIcon={<CalendarViewMonthIcon />}>
        Beats View
      </Button>
      <BasePopup id={id} open={open} anchor={anchor}>
        <BPMModule 
            bpm={bpm} 
            handleChangeBPM={handleChangeBPM}
            beatsNumerator={beatsNumerator}
            beatsDenominator={beatsDenominator}
            handleChangeBeatsNumerator={handleChangeBeatsNumerator}
            handleChangeBeatsDenominator={handleChangeBeatsDenominator}
        />
      </BasePopup>
    </div>
  );
}
