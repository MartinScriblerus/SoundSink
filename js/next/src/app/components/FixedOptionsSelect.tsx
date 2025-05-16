import React, { useState } from 'react';
import { STKOption, stkOptions } from '../../utils/fixedOptionsDropdownData';

import { NAVY, PEACH, ROYALBLUE } from '@/utils/constants';

type Props = {
    stkValues: STKOption[] | undefined;
    setStkValues: React.Dispatch<React.SetStateAction<STKOption[]>>;
    updateStkKnobs: (e: STKOption[]) => void;
};

const FixedOptionsDropdown: React.FC<Props> = ({ stkValues, setStkValues, updateStkKnobs }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: STKOption) => {
        let newValues = stkValues ? [...stkValues] : [];
        if (newValues.some((v) => v.value === option.value)) {
            newValues = newValues.filter((v) => v.value !== option.value);
        } else {
            newValues.push(option);
        }
        setStkValues(newValues);
        updateStkKnobs(newValues);
    };

    return (
        <div className="dropdown-container" style={{ minHeight: '100%', height: '100%', background: '', width: '100%', position: 'relative' }}>
            <button id={"toggleDropdown"} className="dropdown-button" onClick={toggleDropdown} 
            >
                Select Instrument
            </button>
            {isOpen && (
                <ul className="dropdown-menu" style={{
                    width: '100%',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.78)',
                    color: 'rgba(255,255,255,0.78)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    zIndex: 99999,
                    left: '120px',
                    top: '-300px',
                }}>
                    {stkOptions.map((option) => (
                        <li key={option.value} onClick={() => handleSelect(option)}
                            style={{
                                borderTop: '1px solid rgba(255,255,255,0.4)',
                                padding: '5px',
                                cursor: 'pointer',
                                background: stkValues?.some((v) => v.value === option.value) ? PEACH : ROYALBLUE,
                            }}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FixedOptionsDropdown;
