import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, Input } from '@mui/material';
import microtoneDescsData from '../microtone_descriptions.json';
import { ROYALBLUE } from '@/utils/constants';

interface MicrotoneOption {
  value: string;
  label: string;
  name: string;
  description?: string;
}

interface Props {
  // selectRef: any;
  tune: any;
  currentMicroTonalScale: any;
}

const BATCH_SIZE = 30;

export default function CustomDropdown({ 
  // selectRef, 
  tune, currentMicroTonalScale }: Props) {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Filter microtones based on search term
  const filteredOptions = useMemo(() => {
    return microtoneDescsData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  // Paginate the filtered options
  const paginatedOptions = useMemo(() => {
    return filteredOptions.slice(0, page * BATCH_SIZE).map((i) => ({
      label: `${i.name} - ${i.description}`,
      value: i.name,
      name: i.name,
      description: i.description,
    }));
  }, [filteredOptions, page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSelect = (option: MicrotoneOption) => {
    currentMicroTonalScale(option);
    setIsOpen(false);
  };

    useEffect(() => {
        // If modal is open, add event listener to detect outside clicks
        if (isOpen) {
          const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <Box sx={{ flexDirection: 'row', width: '100%', outline: 'none', position: 'relative' }}>
      <FormControl sx={{ width: '100%', color: 'rgba(255,255,255,0.78)' }}>
        <div
          // ref={selectRef}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid #9e9e9e',
            paddingTop: '8px',
            paddingBottom: '8px',
            color: 'rgba(255,255,255,0.78)',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '12px',
            width: '100%',
            // minWidth: '180px',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          Microtonal Scales
        </div>
        {isOpen && (
          <div
            ref={dropdownRef}
            onScroll={handleScroll}
            style={{
              position: 'absolute',
              // top: '100%',
              // width: '100%',
              // maxHeight: '300px',
              // overflowY: 'auto',
              // backgroundColor: ROYALBLUE,
              // color: 'rgba(255,255,255,0.78)',
              // zIndex: 9999,
              width: '100%',
              maxHeight: '450px',
              minWidth: '200px',
              fontSize: '12px',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.78)',
              color: 'rgba(255,255,255,0.78)',
              fontFamily: 'monospace',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 99999,
              left: '140px',
              top: '-128px',
            }}
          >
            {/* Search Input */}
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '8px',
                // background: 'rgba(0,0,0,0.3)',
                background: 'rgba(0,0,0,1)',
                color: 'rgba(255,255,255,0.78)',
              }}
            />
            {/* Dropdown Options */}
            {paginatedOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.4)',
                  padding: '5px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  background: ROYALBLUE,
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </FormControl>
    </Box>
  );
}


