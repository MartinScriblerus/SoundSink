import { ROYALBLUE } from '@/utils/constants';
import { Box, Button, FormControl, Input } from '@mui/material';
import React, { useEffect } from 'react';
// import '../page.module.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
// import microtoneDescsData from '../microtone_descriptions.json'; 
import { StylesConfig } from 'react-select';

interface Props {
    updateKeyScaleChord: (key: string, scale: string, chord: string, octaveMax:any, octaveMin:any) => void;
    testChord: () => void;
    testScale: () => void;
};

const MingusPopup = ({
    updateKeyScaleChord,
    testChord,
    testScale,
}: Props) => {
    const [isKeySelectOpen, setIsKeySelectOpen] = React.useState(false);
    const [isScaleSelectOpen, setIsScaleSelectOpen] = React.useState(false);
    const [isChordSelectOpen, setIsChordSelectOpen] = React.useState(false);
    const [isOctaveMaxSelectOpen, setIsOctaveMaxSelectOpen] = React.useState(false);
    const [isOctaveMinSelectOpen, setIsOctaveMinSelectOpen] = React.useState(false);
    const [selectedKey, setSelectedKey] = React.useState<string | null>('C');
    const [selectedScale, setSelectedScale] = React.useState<string | null>('Diatonic');
    const [selectedChord, setSelectedChord] = React.useState<any>({
        label: 'Major Triad', value: 'M'});
    const [selectedOctaveMax, setSelectedOctaveMax] = React.useState<string | null>('4');
    const [selectedOctaveMin, setSelectedOctaveMin] = React.useState<string | null>('3');

    const [searchKeyTerm, setSearchKeyTerm] = React.useState('');
    const [searchScaleTerm, setSearchScaleTerm] = React.useState('');
    const [searchChordTerm, setSearchChordTerm] = React.useState('');
    const [searchOctaveMaxTerm, setSearchOctaveMaxTerm] = React.useState('');
    const [searchOctaveMinTerm, setSearchOctaveMinTerm] = React.useState('');

    const selectKeyRef = React.useRef<HTMLDivElement | null>(null);
    const selectScaleRef = React.useRef<HTMLDivElement | null>(null);
    const selectChordRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownOctaveMaxSelectRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownOctaveMinSelectRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownKeySelectRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownScaleSelectRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownChordSelectRef = React.useRef<HTMLDivElement | null>(null);
    const selectOctaveMaxRef = React.useRef<HTMLDivElement | null>(null);
    const selectOctaveMinRef = React.useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
        selectedKey && 
        selectedScale && 
        selectedChord && 
        selectedOctaveMax && 
        selectedOctaveMin &&
        updateKeyScaleChord(selectedKey, selectedScale, selectedChord.value, selectedOctaveMax, selectedOctaveMin);
    }, [selectedKey, selectedScale, selectedChord, selectedOctaveMax, selectedOctaveMin]);



    const handleKeySelect = (option: any) => {
        setSelectedKey(option.label);
        setIsKeySelectOpen(false);
    };

    const handleScaleSelect = (option: any) => {
        setSelectedScale(option.label);
        setIsScaleSelectOpen(false);
    };

    const handleChordSelect = (option: any) => {
        setSelectedChord(option);
        setIsChordSelectOpen(false);
        console.log("Selected Chord: ", option.label);
    };

    const handleOctaveMaxSelect = (option: any) => {
        setSelectedOctaveMax(option.label);
        setIsOctaveMaxSelectOpen(false);
    };

    const handleOctaveMinSelect = (option: any) => {
        setSelectedOctaveMin(option.label);
        setIsOctaveMinSelectOpen(false);
    };

    const keyOptions = [
        {value: 'C', label: 'C'},
        {value: 'C♯', label: 'C♯'},
        {value: 'D', label: 'D'},
        {value: 'D♯', label: 'D♯'},
        {value: 'E', label: 'E'},
        {value: 'F', label: 'F'},
        {value: 'F♯', label: 'F♯'},
        {value: 'G', label: 'G'},
        {value: 'G♯', label: 'G♯'},
        {value: 'A', label: 'A'},
        {value: 'A♯', label: 'A♯'},
        {value: 'B', label: 'B'},
    ];

    const scaleOptions = [
        {value: 'Diatonic', label: 'Diatonic'},
        {value: 'Major', label: 'Major'},
        {value: 'Harmonic Major', label: 'Harmonic Major'},
        {value: 'Natural Minor', label: 'Natural Minor'},
        {value: 'Harmonic Minor', label: 'Harmonic Minor'},
        {value: 'Melodic Minor', label: 'Melodic Minor'},
        {value: 'Bachian', label: 'Bachian'},
        {value: 'MinorNeapolitan', label: 'Minor Neapolitan'},
        {value: 'Chromatic', label: 'Chromatic'},
        {value: 'WholeTone', label: 'Whole Tone'},
        {value: 'Octatonic', label: 'Octatonic'},
        {value: 'Ionian', label: 'Ionian'},
        {value: 'Dorian', label: 'Dorian'},
        {value: 'Phrygian', label: 'Phrygian'},
        {value: 'Lydian', label: 'Lydian'},
        {value: 'Mixolydian', label: 'Mixolydian'},
        {value: 'Aeolian', label: 'Aeolian'},
        {value: 'Locrian', label: 'Locrian'},
        {value: 'Fifths', label: 'Fifths'},
    ];

    const chordOptions = [
        {value: 'M', label: 'Major Triad'},
        {value: 'm', label: 'Minor Triad'},
        {value: 'aug', label: 'Augmented Triad'},
        {value: 'dim', label: 'Diminished Triad'},
        {value: 'dim7', label: 'Diminished Seventh'},
        {value:'sus2', label: 'Suspended Second Triad'},
        {value:'sus', label: 'Suspended Fourth Triad'},
        {value:'madd4', label: 'Minor Add Fourth'},
        {value:'5', label: 'Perfect Fifth'},
        {value:'7b5', label: 'Dominant Flat Five'},
        {value:'6', label: 'Major Sixth'},
        {value:'67', label: 'Dominant Sixth'},
        {value:'69', label: 'Sixth Ninth'},
        {value:'m6', label: 'Minor Sixth'},
        {value:'M7', label: 'Major Seventh'},
        {value:'m7', label: 'Minor Seventh'},
        {value:'M7+', label: 'Augmented Major Seventh'},
        {value:'m7+', label: 'Augmented Minor Seventh'},
        {value:'sus47', label: 'Suspended Seventh'},
        {value:'m7b5', label: 'Half Diminished Seventh'},
        {value:'mM7', label: 'Minor Major Seventh'},
        {value:'dom7', label: 'Dominant Seventh'},
        {value:'7+', label: 'Augmented Major Seventh'},
        {value:'7#5', label: 'Augmented Minor Seventh'},
        {value:'7#11', label: 'Lydian Dominant Seventh'},
        {value:'m/M7', label: 'Minor Major Seventh'},
        {value:'7sus4', label: 'Suspended Seventh'},
        {value:'M9', label: 'Major Ninth'},
        {value:'m9', label: 'Minor Ninth'},
        {value:'add9', label: 'Dominant Ninth'},
        {value:'susb9', label: 'Suspended Fourth Ninth 1'},
        {value:'sus4b9', label: 'Suspended Fourth Ninth 2'},
        {value:'9', label: 'Dominant Ninth'},
        {value:'m9b5', label: 'Minor Ninth Flat Five'},
        {value:'7_#9', label: 'Dominant Sharp Ninth'},
        {value:'7b9', label: 'Dominant Flat Ninth'},
        {value:'9#', label: 'Dominant Sharp Ninth'},
        {value:'11', label: 'Dominant Eleventh'},
        {value:'m11', label: 'Minor Eleventh'},
        {value:'add11', label: 'Dominant Eleventh'},
        {value:'hendrix', label: 'Hendrix Chord 2'},
        {value:'M13', label: 'Major Thirteenth'},
        {value:'m13', label: 'Minor Thirteenth'},
        {value:'13', label: 'Dominant Thirteenth'},
    ];

    const octaveMaxOptions = [
        {value: '1', label: '1'},
        {value: '2', label: '2'},
        {value: '3', label: '3'},
        {value: '4', label: '4'},
        {value: '5', label: '5'},
        {value: '6', label: '6'},
        {value: '7', label: '7'},
        {value: '8', label: '8'},
    ];

    const octaveMinOptions = [
        {value: '1', label: '1'},
        {value: '2', label: '2'},
        {value: '3', label: '3'},
        {value: '4', label: '4'},
        {value: '5', label: '5'},
        {value: '6', label: '6'},
        {value: '7', label: '7'},
        {value: '8', label: '8'},
    ];

    return (
        <Box 
            sx={{
                display: 'flex',
                height: 'fit-content',
                outline: 'none',
                flexDirection: 'column',
                minWidth: '128px',
                width: '100%',
                fontSize: '12px',
                padding: '0px !important',
                margin: '0px !important',
                border: '1px solid rgba(255,255,255,0.3)',
            }}
        >    

<Box sx={{
                    width: '100%', 
                    padding: '0px !important',
                    margin: '0px !important', 
                    display: 'flex', 
                    flexDirection: 'row-reverse', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '32px !important',
                    maxHeight: '32px !important',
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.3)',   
                    color: 'rgba(255,255,255,0.78)',           
                }}>
                    <FormControl sx={{ 
                        width: '50% !important', 
                        position: 'relative',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        display: 'flex',
                        // alignItems: 'right', 
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOctaveMaxSelectOpen(!isOctaveMaxSelectOpen)}
                    >
                        <span style={{
                            width: "50%",
                            pointerEvents:"none"
                        }}>Max:</span>
                        <div
                        ref={selectOctaveMaxRef}
                        style={{
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            width: '50%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            marginLeft: '50% !important', 
                            position: 'relative',
                            padding: '0px',
                            margin: '0px',
                        }}
                        
                        >
                        {selectedOctaveMax} 
                        </div>
                        {isOctaveMaxSelectOpen && (
                        <div
                            ref={dropdownOctaveMaxSelectRef}
                            style={{
                            position: 'absolute',
                            top: '100%',
                            width: '100%',
                            fontSize: '12px',
                            maxHeight: '12rem',
                            overflowY: 'auto',
                            backgroundColor: ROYALBLUE,
                            color: 'rgba(255,255,255,0.78)',
                            zIndex: 9999,
                            }}
                        >
                            <Input
                                placeholder="Search..."
                                value={searchOctaveMaxTerm}
                                onChange={(e) => setSearchOctaveMaxTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    marginBottom: '8px',
                                    background: 'rgba(0,0,0,1)',
                                    color: 'rgba(255,255,255,0.78)',
                                }}
                            />
                            {( 
                                searchOctaveMaxTerm.length > 0 
                                ? 
                                    octaveMaxOptions.filter((x: any) => x.label.includes(searchOctaveMaxTerm)) 
                                : 
                                    octaveMaxOptions).map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => handleOctaveMaxSelect(option)}
                                            style={{
                                            borderTop: '1px solid rgba(255,255,255,0.4)',
                                            padding: '5px',
                                            cursor: 'pointer',
                                            fontFamily: 'monospace',
                                            background: ROYALBLUE,
                                            color: 'rgba(255,255,255,0.78)',
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    )
                                )
                            }
                        </div>
                        )}
                    </FormControl>


                    <FormControl sx={{ 
                        color: 'rgba(255,255,255,0.78)', 
                        position: 'relative', 
                        flexDirection: 'row',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',  
                        width: '50% !important',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOctaveMinSelectOpen(!isOctaveMinSelectOpen)}
                    > 
                    <span 
                    style={{
                        pointerEvents: 'none',
                        width: '50%',
                    }}
                    >Min: </span>
                        <div
                        ref={selectOctaveMinRef}
                        style={{
                            // background: 'rgba(0,0,0,0.6)',
                            height: '32px !important',
                            color: 'rgba(255,255,255,0.78)',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            width: '50%',
                            // minWidth: '60px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0px',

                        }}
                        >
                        {selectedOctaveMin}
                        </div>
                        {isOctaveMinSelectOpen && (
                        <div
                            ref={dropdownOctaveMinSelectRef}
                            style={{
                            position: 'absolute',
                            top: '100%',
                            width: '100%',
                            maxHeight: '12rem',
                            overflowY: 'auto',
                            backgroundColor: ROYALBLUE,
                            color: 'rgba(255,255,255,0.78)',
                            zIndex: 9999,
                            }}
                        >
                            <Input
                                placeholder="Search..."
                                value={searchOctaveMinTerm}
                                onChange={(e) => setSearchOctaveMinTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginBottom: '8px',
                                    background: 'rgba(0,0,0,1)',
                                    color: 'rgba(255,255,255,0.78)',
                                }}
                            />
                            {
                                ( 
                                searchOctaveMinTerm.length > 0 
                                ? 
                                    octaveMinOptions.filter((x: any) => x.label.includes(searchOctaveMinTerm)) 
                                : 
                                    octaveMinOptions).map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => handleOctaveMinSelect(option)}
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
                                    )
                                )
                            }
                        </div>
                        )}
                    </FormControl>
                </Box>
            <Box
                style={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0px !important', 
                    margin: '0px !important' 
                }}
            >
                <FormControl sx={{ 
                    // width: '60px', 
                    width: '50%',
                    color: 'rgba(255,255,255,0.78)', 
                    position: 'relative',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',  
                    height: '32px !important',
                    border: '1px solid rgba(255,255,255,0.8)',
                    background: 'rgba(0,0,0,0.3)', 
                }}
                onClick={() => setIsKeySelectOpen(!isKeySelectOpen)}
                ><span style={{
                    pointerEvents:"none",
                    width: "50%",
                }}>Key:</span>
                    <div
                        ref={selectKeyRef}
                        style={{
                            // background: 'rgba(0,0,0,0.6)',
                            color: 'rgba(255,255,255,0.78)',
                            // height: '60px',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            width: '100%',
                            minWidth: '60px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '32px !important',
                        }}
                        // onClick={() => setIsKeySelectOpen(!isKeySelectOpen)}
                        >
                        {selectedKey}
                    </div>
                    {isKeySelectOpen && (
                    <div
                        ref={dropdownKeySelectRef}
                        style={{
                        position: 'absolute',
                        top: '100%',
                        width: '100%',
                        maxHeight: '12rem',
                        overflowY: 'auto',
                        color: 'rgba(255,255,255,0.78)',
                        zIndex: 9999,
                        }}
                    >
                        {/* Search Input */}
                        <Input
                            placeholder="Search..."
                            value={searchKeyTerm}
                            onChange={(e) => setSearchKeyTerm(e.target.value)}
                            style={{
                                width: '100%',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                marginBottom: '8px',
                                background: 'rgba(0,0,0,1)',
                                color: 'rgba(255,255,255,0.78)',
                                overflow: 'hidden',
                            }}
                        />
                        {/* Dropdown Options */}
                        {( searchKeyTerm.length > 0 ? keyOptions.filter((x: any) => x.label.includes(searchKeyTerm)) : keyOptions).map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleKeySelect(option)}
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
                <FormControl sx={{ 
                    // width: '60px', 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    color: 'rgba(255,255,255,0.78)', 
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',  
                    height: '32px !important',
                    border: '1px solid rgba(255,255,255,0.8)',
                    background: 'rgba(0,0,0,0.3)', 
                    cursor: 'pointer',
                }}
                onClick={() => setIsChordSelectOpen(!isChordSelectOpen)}
                ><span style={{
                    pointerEvents: "none",
                    width: "50%",
                }}>Chordz:</span>
                    <div
                        ref={selectChordRef}
                        style={{
                            color: 'rgba(255,255,255,0.78)',
                        
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            width: '100%',
                            minWidth: '60px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '1040px !important',
                        }}
                        onClick={() => setIsChordSelectOpen(!isChordSelectOpen)}
                    >   
                        {selectedChord.label}
                    </div>
                    {
                        isChordSelectOpen && (
                            <div
                                ref={dropdownChordSelectRef}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    width: '100%',
                                    maxHeight: '12rem',
                                    overflowY: 'auto',
                                    backgroundColor: ROYALBLUE,
                                    color: 'rgba(255,255,255,0.78)',
                                    zIndex: 9999,
                                }}
                            >
                                <Input
                                    placeholder="Search..."
                                    value={searchChordTerm}
                                    onChange={(e) => setSearchChordTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        marginBottom: '8px',
                                        background: 'rgba(0,0,0,1)',
                                        color: 'rgba(255,255,255,0.78)',
                                    }}
                                />
                                {
                                    ( searchChordTerm.length > 0 
                                    ? 
                                        chordOptions.filter((x: any) => x.label.includes(searchChordTerm)) 
                                    : 
                                        chordOptions).map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleChordSelect(option)}
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
                                        )
                                    )
                                }
                            </div>
                        )
                    }           
                </FormControl>
                {/* <Box 
                sx={{
                    display: 'flex', 
                    flexDirection: 'row'
                }}> */}
                <FormControl 
                    sx={{ 
                        width: '60px', 
                        color: 'rgba(255,255,255,0.78)', 
                        position: 'relative',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        
                        display: 'flex',
                        alignItems: 'center',  
                        height: '32px !important',
                        border: '1px solid rgba(255,255,255,0.8)',
                        background: 'rgba(0,0,0,0.3)', 
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsScaleSelectOpen(!isScaleSelectOpen)}
                >
                    <span style={{
                        pointerEvents: 'none',
                        width: '50%',
                    }}>Scale:</span>
                    <div
                        ref={selectScaleRef}
                        style={{
                            // background: 'rgba(0,0,0,0.6)',
                            color: 'rgba(255,255,255,0.78)',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            width: '100%',
                            minWidth: '60px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',

                            }}
                        >
                        {selectedScale}
                    </div>
                    {isScaleSelectOpen && (
                        <div
                            ref={dropdownScaleSelectRef}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                width: '100%',
                                maxHeight: '12rem',
                                overflowY: 'auto',
                                backgroundColor: ROYALBLUE,
                                color: 'rgba(255,255,255,0.78)',
                                zIndex: 9999,
                            }}
                        >
                            <Input
                                placeholder="Search..."
                                value={searchScaleTerm}
                                onChange={(e) => setSearchScaleTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    background: 'rgba(0,0,0,1)',
                                    color: 'rgba(255,255,255,0.78)',
                                }}
                            />
                            {( searchScaleTerm.length > 0 
                                ? 
                                    scaleOptions.filter((x: any) => x.label.includes(searchScaleTerm)) 
                                : 
                                    scaleOptions).map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => handleScaleSelect(option)}
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
                                    )
                                )
                            }
                        </div>
                    )}
                </FormControl>
            {/* </Box>  */}
            </Box>
<Button onClick={testChord}>Test Chord</Button>

   
<Button onClick={testScale}>Test Scale</Button>



        </Box>
    );
};
export default MingusPopup;