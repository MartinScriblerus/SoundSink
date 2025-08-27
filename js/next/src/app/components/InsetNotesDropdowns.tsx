import { RUSTY_ORANGE } from '@/utils/constants';
import { Box, FormControl, FormLabel, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

type NoteOption = { value: string; label: string };

interface Props {
  notes: string[];
  handleLatestNotesFinal: (selected: NoteOption[]) => void;
  notesPreselected: any; // assumed to be indices of `notes`
  max: number;
  min: number;
  
}

const InsetNotesDropdown: React.FC<Props> = ({
  notes,
  handleLatestNotesFinal,
  notesPreselected,
  max,
  min
}) => {
  const [selectedOptions, setSelectedOptions] = useState<NoteOption[]>([]);
  const [optionsHook, setOptionsHook] = useState<NoteOption[]>([]);

  const handleChange = (selected: any) => {
    handleLatestNotesFinal(selected);
    setSelectedOptions(selected);
  };

  const colorStyles: StylesConfig<NoteOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', maxWidth: '320px' }),
    option: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: 'white',
      color: 'black',
      minWidth: '180px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
      padding: '4px',
      margin: '4px',
      paddingLeft: '8px',
      paddingRight: '8px',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':hover': { backgroundColor: 'lightgray' },
      ':active': { backgroundColor: 'green' },
    }),
  };

  useEffect(() => {
    const minOctave = Number(min);
    const maxOctave = Number(max);

    const options = Array.from({ length: maxOctave - minOctave + 1 }, (_, i) => i + minOctave)
      .flatMap((octave) =>
        notes.map((note) => {
          const noteWithOctave = `${note}-${octave}`;
          return { value: noteWithOctave, label: noteWithOctave };
        })
      );

    setOptionsHook(options);

    if (Array.isArray(notesPreselected?.notesNames)) {
      const preSelected = notesPreselected.notesNames
        .map((name: any) => options.find((opt) => opt.value === name))
        .filter(Boolean); // remove unmatched ones
      setSelectedOptions(preSelected);
    }
  }, [notes, notesPreselected, min, max]);


  return (
  <FormControl
    fullWidth
    sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
      px: 1, // shorthand for paddingLeft/paddingRight
      m: 0.5,
    }}
  >
    <FormLabel
      sx={{
        color: 'rgba(245,245,245,0.78)',
        fontSize: '11px',
        px: 1,
        mb: 0.5, // spacing between label and select
      }}
      id="notes-input-select-label"
    >
      Notes (in Active Cell)
    </FormLabel>

    <Box sx={{ height: 40 }}>
      <Select
        key={`${selectedOptions.length}_insetNotesDropdownKey`}
        isMulti
        options={optionsHook}
        onChange={handleChange}
        value={selectedOptions}
        styles={{
          ...colorStyles,
          control: (base, state) => ({
            ...base,
            minHeight: 'unset',
            height: '100%',
            boxShadow: state.isFocused ? '0 0 0 1px #90caf9' : base.boxShadow,
          }),
          valueContainer: (base) => ({
            ...base,
            height: '100%',
            padding: '0 4px',
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            width: '240px',
          }),
          option: (base, state) => ({
            ...base,
            textAlign: 'left',  
            paddingLeft: '8px',
            color: state.isSelected ? 'white' : 'black',
          }),
          singleValue: (base) => ({
            ...base,
            textAlign: 'left',
          }),
          multiValueLabel: (base) => ({
            ...base,
            textAlign: 'left',
          }),
          placeholder: (base) => ({
            ...base,
            textAlign: 'left',
          }),
        }}
      />
    </Box>
  </FormControl>
  );
};

export default InsetNotesDropdown;
