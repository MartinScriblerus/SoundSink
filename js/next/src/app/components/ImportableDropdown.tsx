import { OBERHEIM_TEAL } from "@/utils/constants";
import { Box, FormControl, Input } from "@mui/material";
import React, {useRef, useState, useMemo} from "react";

interface DropdownOption {
    value: string;
    label: string;
    name: string;
    description?: string;
}

interface Props {
    // selectRef: any; // possibly not needed???  
    currentData: DropdownOption[]; // options to pass in (could likely refactor hardcoded opts in MingusTable)
    dropLabel: string;
    onChangeTrigger: () => void; // <<<< callback to update shared value
    currentValue: any; // <<<< selected value
}

const ImportableDropdown = (
    {currentData, dropLabel}: Props
) => {

    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 
    // const selectRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const filteredOptions = useMemo(() => {
    return currentData.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    }, [searchTerm, currentData]);
    
    const BATCH_SIZE = 30;
    // Paginate the filtered options
    const paginatedOptions = useMemo(() => {
        return filteredOptions.slice(0, page * BATCH_SIZE).map((i: any) => ({
        label: `${i.name} - ${i.description}`,
        value: i.name,
        name: i.name,
        description: i.description,
        }));
    }, [filteredOptions, page]);

    const handleSelect = (option: DropdownOption) => {
        // currentData(option); // <<<< shouldn't this actually be currentValue?
        setIsOpen(false);
    };
    

    return (
        <Box sx={{ flexDirection: 'row', outline: 'none', position: 'relative' }}>
        <FormControl sx={{ width: '180px', color: 'rgba(245,245,245,0.78)' }}>
          <div
            // ref={selectRef}
            style={{
              background: 'rgba(28,28,28,0.3)',
              border: '1px solid #9e9e9e',
              padding: '8px',
              color: 'rgba(245,245,245,0.78)',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '12px',
              width: '100%',
              minWidth: '180px',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {dropLabel || 'test placeholder'}
          </div>
          {isOpen && (
            <div
              ref={dropdownRef}
              onScroll={handleScroll}
              style={{
                position: 'absolute',
                top: '100%',
                width: '100%',
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: OBERHEIM_TEAL,
                color: 'rgba(245,245,245,0.78)',
                zIndex: 9999,
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
                  background: 'rgba(28,28,28,1)',
                  color: 'rgba(245,245,245,0.78)',
                }}
              />
              {/* Dropdown Options */}
              {paginatedOptions.map((option: any) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  style={{
                    borderTop: '1px solid rgba(245,245,245,0.4)',
                    padding: '5px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    background: OBERHEIM_TEAL,
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </FormControl>
      </Box>
    )
}
export default ImportableDropdown;