import React, { useEffect, useState } from 'react';
import Select, { GroupBase, StylesConfig } from 'react-select';

const options: any =
    {
      label: 'All Samples',
      options: new Array(),
    };

const InsetNotesDropdown = ({
  notes,
  handleLatestNotesFinal,
  notesPreselected,
}: {
  notes: any;
  handleLatestNotesFinal: (x: any) => void;
  notesPreselected: any;
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionsHook, setOptionsHook] = useState<any>([]);

  const handleChange = (selected: any) => {
    handleLatestNotesFinal(selected);
    console.log("selected notes????: ", selected);
    setSelectedOptions(selected);
  };

  const colorStyles: StylesConfig<any, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: 'white',
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':hover': {
          backgroundColor: 'lightgray',
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: 'green'
        },
      };
    }
  };

  useEffect(() => {
    notes.forEach((f: any) => {
      if (options.options && options.options.map((o: any) => o.value).indexOf(f) === -1) {
        options.options.push({ value: f, label: f });
      }
    });
    console.log("notes options: ", options);
    setOptionsHook(options.options);

    const preSelOpts = notesPreselected && Array.from(notesPreselected).length > 0 && Array.from(notesPreselected).map((i: any) => options.options[i]);
    setSelectedOptions(preSelOpts);
  }, [notes, notes.length])

  return (
    <>{optionsHook && <Select
      isMulti
      options={optionsHook}
      onChange={handleChange}
      value={selectedOptions}
      styles={colorStyles}
    />}</>
  );
};

export default InsetNotesDropdown;