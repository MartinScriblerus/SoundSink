import React, { useEffect, useState } from 'react';
import Select, { GroupBase, StylesConfig } from 'react-select';

const options: any =
    {
      label: 'All Samples',
      options: new Array(),
    };

const InsetCheckboxDropdown = ({
  files,
  handleLatestSamplesFinal,
  fileNumsPreselected,
}: {
  files: any;
  handleLatestSamplesFinal: (x: any) => void;
  fileNumsPreselected: any;
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionsHook, setOptionsHook] = useState<any>([]);

  const handleChange = (selected: any) => {
    handleLatestSamplesFinal(selected);
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
    files.forEach((f: any) => {
      if (options.options && options.options.map((o: any) => o.value).indexOf(f) === -1) {
        options.options.push({ value: f, label: f });
      }
    });
    setOptionsHook(options.options);

    const preSelOpts = fileNumsPreselected && Array.from(fileNumsPreselected).length > 0 && Array.from(fileNumsPreselected).map((i: any) => options.options[i]);
    setSelectedOptions(preSelOpts);
  }, [files, files.length])

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

export default InsetCheckboxDropdown;