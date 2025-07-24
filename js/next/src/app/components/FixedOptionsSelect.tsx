import React, { useEffect, useState } from 'react';
import { STKOption, stkOptions } from '../../utils/fixedOptionsDropdownData';

import { PALE_BLUE, RUSTY_ORANGE } from '@/utils/constants';
import { Box } from '@mui/material';

type Props = {
    stkValues: STKOption[] | undefined;
    setStkValues: React.Dispatch<React.SetStateAction<STKOption[]>>;
    updateStkKnobs: (e: STKOption[]) => void;
};

const FixedOptionsDropdown: React.FC<Props> = ({ stkValues, setStkValues, updateStkKnobs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        // If modal is open, add event listener to detect outside clicks
        if (isOpen) {
          const handleClickOutside = (event: any) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
              setIsOpen(false); // Close the modal if clicked outside
            }
          };
    
          // Add the event listener
          document.addEventListener('mousedown', handleClickOutside);
    
          // Clean up the event listener when the component unmounts or when modal closes
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
        }
      }, [isOpen]);

    return (
        <div className="dropdown-container" style={{ minHeight: '100%', height: '100%', background: '', width: '100%', position: 'relative' }}>
            <button id={"toggleDropdown"} className="dropdown-button" onClick={toggleDropdown} 
            >
                Select Instrument
            </button>
            {isOpen && (
                <Box ref={modalRef}>
                    <ul className="dropdown-menu" style={{
                        width: '100%',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        background: 'rgba(28,28,28,0.78)',
                        color: 'rgba(245,245,245,0.78)',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        zIndex: 99999,
                        left: '140px',
                        top: '-154px',
                    }}>
                        {stkOptions.map((option) => (
                            <li key={option.value} onClick={() => handleSelect(option)}
                                style={{
                                    borderTop: '1px solid rgba(245,245,245,0.4)',
                                    padding: '5px',
                                    cursor: 'pointer',
                                    background: stkValues?.some((v) => v.value === option.value) ? RUSTY_ORANGE : PALE_BLUE,
                                }}>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
        </div>
    );
};

export default FixedOptionsDropdown;
