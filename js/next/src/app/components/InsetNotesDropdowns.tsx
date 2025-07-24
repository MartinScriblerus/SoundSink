import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

type NoteOption = { value: string; label: string };

interface Props {
  notes: string[];
  handleLatestNotesFinal: (selected: NoteOption[]) => void;
  notesPreselected: any; // assumed to be indices of `notes`
}

const InsetNotesDropdown: React.FC<Props> = ({
  notes,
  handleLatestNotesFinal,
  notesPreselected,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<NoteOption[]>([]);
  const [optionsHook, setOptionsHook] = useState<NoteOption[]>([]);

  const handleChange = (selected: any) => {
    handleLatestNotesFinal(selected);
    setSelectedOptions(selected);
  };

  const colorStyles: StylesConfig<NoteOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
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
    const options = notes.map((note) => ({
      value: note,
      label: note,
    }));

    console.log("^^ NOTE options: ", options);
    setOptionsHook(options);

    if (Array.isArray(notesPreselected)) {
      const preSelected = notesPreselected
        .map((i) => options[i])
        .filter(Boolean);
      preSelected.length < 1 && setSelectedOptions(preSelected);
    }
  }, [notes, notesPreselected]);

  return (
    <Select
      isMulti
      options={optionsHook}
      onChange={handleChange}
      value={selectedOptions}
      styles={colorStyles}
    />
  );
};

export default InsetNotesDropdown;
