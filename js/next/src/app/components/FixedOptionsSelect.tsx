import React, { useState } from 'react';

import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';

import { STKOption, stkOptions } from '../../utils/fixedOptionsDropdownData';

const styles: StylesConfig<any, true> = {
    container: (provided: any) => ({
        ...provided,
        flexGrow: 1,
    }),
    control: (provided: any) => ({
        ...provided,
        background: '#000000',
        borderColor: '#9e9e9e',
        minHeight: '24px',
    }),
    option: (styles, {isFocused, isSelected}) => ({
        ...styles,
        background: isFocused
            ? 'hsla(291, 64%, 42%, 0.5)'
            : isSelected
                ? 'hsla(291, 64%, 42%, 1)'
                : undefined,
        zIndex: 1
    }),
    menu: base => ({
        ...base,
        borderRadius: 0,
        background: 'black',
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

const FixedOptionsDropdown = () => {
    
    const [value, setValue] = useState<readonly STKOption[] | Array<any>>([]);

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
            setValue(newOpts);
        }
    };

    return (
        <Select
            value={value}
            isMulti
            styles={styles}
            isClearable={value.some((v) => !v.isFixed)}
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={onChange}
            options={stkOptions}
        />
    );
};
export default FixedOptionsDropdown