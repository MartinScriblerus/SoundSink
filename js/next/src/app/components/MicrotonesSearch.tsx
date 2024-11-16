import React, { CSSProperties, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Select, { AriaOnFocus } from 'react-select';
import microtoneDescsData from '../microtone_descriptions.json'; 
import { useTheme } from '@mui/material/styles';
import { Box, FormControl } from '@mui/material';

export interface MicrotoneOption {
  readonly value: string;
  readonly label: string;
  readonly name: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
  readonly description?: string;
}



// const tune = new Tune();
interface Props {
  selectRef: any;
  tune: any;
  currentMicroTonalScale: any;
}

export default function CustomAriaLive({selectRef, tune, currentMicroTonalScale}:Props) {
  const [ariaFocusMessage, setAriaFocusMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [microtoneDescs, setMicrotoneDescs] = useState<any>([]);
  const chosenNameRef = useRef<any>('');
  const chosenDescRef = useRef<any>('');

  const theme = useTheme();

  const style: { [key: string]: CSSProperties } = {
    blockquote: {
      // fontStyle: 'italic',
      fontSize: '.75rem',
      // margin: '1rem 0',
      color:'#f6f6f6',
      minHeight: "2rem",
      left: '3vh',
      minWidth: "100%",
      display: isMenuOpen ? 'block' : 'none',
      background: theme.palette.black
    },
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
      background: 'rgba(0,0,0,1)',
      width: '100%'
    },
      menu: {
    // override border radius to match the box
    borderRadius: 0,
    marginTop: 0,
    background: 'rgba(0,0,0,1'
  },
  menuList: {
    // kill the white space on first and last option
    padding: 0
  }};

  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      paddingTop: 0, 
      paddingBottom: 0, 
      color: "$fff", background:  "rgba(30,34,26,0.96)", width: '200px',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      bottom: "8px"
    },
  });

  const colorStyles = {
    control: (styles: any) => ({ ...styles, width: "140px", maxWidth: "140px", color: "rgba(255,255,255,0.7)", background:  "rgba(30,34,26,0.96)", bottom: "5px"}),
    input: (styles: any) => ({ ...styles, width: "140px", maxWidth: "140px", color: "rgba(255,255,255,0.7)", background:  "rgba(30,34,26,0.96)", marginRight: "24px",                                                                                                                                                                                                                                                                                                                                                                                                                                    minWidth: "1040px" }),
    
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
        ...styles,
        backgroundColor: "rgba(30,34,26,0.96)",
        background: "rgba(30,34,26,0.96)",
        color: "rgba(255,255,255,0.7)",
        height: "100%",
        width: '140px',
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
    menuList: (styles: any) => ({ ...styles, paddingTop: 0, paddingBottom: 0, color: "rgba(255,255,255,0.7)", background:  "rgba(30,34,26,0.96)", width: '140px', }),

    placeholder: (styles:any) => ({ ...styles, color: 'rgba(255,255,255,0.78)' }),
    singleValue: (styles:any, { data }:any) => ({ ...styles, ...dot(data.color) }),
  };

  const focusIndexRef = useRef<any>(-1);

  useEffect(() => {
    setAriaFocusMessage(chosenNameRef.current);
  }, [chosenNameRef])

  useMemo(() => {
    setMicrotoneDescs(microtoneDescsData.map((i: any) => {return {
      label: i.name,
      value: i.name,
      name: i.name,
      description: i.description,
    }
    }));
  }, []); 

  const onFocus: AriaOnFocus<MicrotoneOption> = ({ focused, isDisabled, }) => {
    focusIndexRef.current = focused && focused;
    const msg = `${focused.label}: ${focused.description} - ${
      isDisabled ? ', disabled' : ''
    }`;
    chosenNameRef.current = focused.label;
    chosenDescRef.current = focused.description;
    tune.loadScale(focused.label);
    console.log('%cTUNE!!! ', 'color:green;', tune);
    console.log('%cMSG** ', 'color:aqua;', focused.value, focused.description);
    return msg;
  };
  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  const handleInputChange = (value: any) => {
    console.log("YO TEST HERE! ", value)
    setValue(value);
  };

  return (
    <>
      <div style={{maxWidth: "140px", width: "140px"}}>
        <span id='aria-live-region' style={{maxWidth: '140px'}}></span>
      {/* <form style={{background: "rgba(30,34,26,0.96)"}}>
        <label style={style.label} id="aria-label" htmlFor="aria-example-input">
          Select a microtone
        </label> */}
                    <Box sx={{
                      display: window.innerHeight > 620 ? 'flex' : 'none', 
                      flexDirection:'row', 
                      outline: 'none',
                    }}>
                        <FormControl 
                            sx={{
                                width: '120px', 
                                outline: 'none', 
                                color:'rgba(228,225,209,1)'
                            }}
                        >
        <Select
          aria-labelledby="aria-label"
          ariaLiveMessages={{
            onFocus,
          }}
          styles={colorStyles}
          inputId="aria-example-input"
          name="aria-live-color"
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          options={microtoneDescs}
          ref={selectRef}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isRtl={isRtl}
          isSearchable={isSearchable}
          onInputChange={handleInputChange}
          onChange={currentMicroTonalScale}
          value={
            selectedValue && 
            typeof(selectedValue) === "string" && 
            selectedValue.length > 0 
              ? 
                selectedValue as any
              : 
                ''
          }
        />

</FormControl></Box>

      {/* </form> */}
      </div>
    </>
  );
}