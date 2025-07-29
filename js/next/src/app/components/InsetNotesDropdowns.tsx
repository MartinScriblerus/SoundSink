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
    <Select
      key={`${selectedOptions.length}_insetNotesDropdownKey`}
      isMulti
      options={optionsHook}
      onChange={handleChange}
      value={selectedOptions}
      styles={colorStyles}
    />
  );
};

export default InsetNotesDropdown;
