import React, { SetStateAction, useState } from 'react';

import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';

import { STKOption, stkOptions } from '../../utils/fixedOptionsDropdownData';
import { useTheme } from '@mui/material';


type Props = {
    stkValues: STKOption[] | undefined;
    setStkValues: React.Dispatch<SetStateAction<any>>;
    updateStkKnobs: (e: STKOption[]) => void;
};


const FixedOptionsDropdown = ({stkValues, setStkValues, updateStkKnobs}: Props) => {
    
    // const [value, setValue] = useState<readonly STKOption[] | Array<any>>([]);
    const theme = useTheme();

    const styles: StylesConfig<any, true> = {
        container: (provided: any) => ({
            ...provided,
            flexGrow: 1,
        }),
        control: (provided: any) => ({
            ...provided,
            background: theme.palette.black,
            // borderColor: theme.palette.black,
            minHeight: '24px',
        }),
        option: (styles, {isFocused, isSelected}) => ({
            ...styles,
            background: isFocused
                ? theme.palette.black
                : isSelected
                    ? theme.palette.primaryB
                    : undefined,
            zIndex: 1
        }),
        menu: base => ({
            ...base,
            borderRadius: 0,
            background: theme.palette.black,
            marginTop: 0
        }),
        menuList: base => ({
            ...base,
            padding: 0
        })
    }
    
    const orderOptions = (values: readonly STKOption[]) => {
        return values
            .filter((v) => v.isFixed)
            .concat(values.filter((v) => !v.isFixed));
    };
    
    const onChange = (
    newValue: OnChangeValue<STKOption, true>,
    actionMeta: ActionMeta<STKOption>
) => {
    switch (actionMeta.action) {
        case 'remove-value':
        case 'pop-value':
            if (actionMeta.removedValue.isFixed) {
                return;
            }
            break;
        case 'clear':
            newValue = stkOptions.filter((v) => v.isFixed);
            break;
        }
        if (orderOptions(newValue).length > 0) {
            let newOpts;
            if (orderOptions(newValue).length > 2) {
                Object.entries(orderOptions(newValue)[0]).slice(0,1);
                newOpts = orderOptions(newValue).filter((opt: any, index: number) => (index > 0) && (opt));
                console.log('IF NEW OPS! ', newOpts);
            } else {
                newOpts = orderOptions(newValue);
                console.log('ELSE NEW OPS! ', newOpts);
            }
            setStkValues(newOpts);
            updateStkKnobs(newOpts);
        }
    };

    return (
        <Select
            value={stkValues}
            isMulti
            styles={styles}
            isClearable={stkValues?.some((v) => !v.isFixed)}
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={onChange}
            options={stkOptions}
        />
    );
};
export default FixedOptionsDropdown