import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';

type NoteBuilderToggleProps = {
    noteBuilderFocus: string;
    handleNoteBuilderToggle: (e: any) => void;
}

export default function NoteBuilderToggle(props: NoteBuilderToggleProps) {
  const {noteBuilderFocus, handleNoteBuilderToggle} = props;
  const [alignment, setAlignment] = React.useState('Scale');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {console.log("new alignment: ", newAlignment);
    setAlignment(newAlignment);
    handleNoteBuilderToggle(newAlignment);
  };

  return (
    <Box sx={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // padding: '8px',
        paddingBottom: '4px',
    }}>
        <ToggleButtonGroup
            id="toggleNoteBuilderGroup"
            key={`toggleNoteBuilderWrapper_${noteBuilderFocus}`}
            sx={{
              maxHeight: "32px"
            }}
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Note Builder Options"
        >
        {['Scale', 'Chord', 'Micro', 'MIDI'].map((option: string, idx: number) => {
            return <ToggleButton 
                key={`toggleWrapper_${idx}`}
                className={`option-button-source-toggle`}
                value={`${option}`}>
                {
                option.includes('Scale') ? 'Scale' : 
                option.includes('Chord') ? 'Chord' :
                option.includes('Micro') ? 'Micro' : 
                option.includes('MIDI') ? 'MIDI' : option
                }
                </ToggleButton>
            })
        }
        </ToggleButtonGroup>
    </Box>
  );
}