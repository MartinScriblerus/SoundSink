import { MIDDLE_FONT_SIZE } from '@/utils/constants';
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
import '../page.module.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import microtoneDescsData from '../microtone_descriptions.json'; 

interface MicrotonalSearchProps {
    selectRef: any; 
    tune: any;
    currentMicroTonalScale: any;
}
interface Props {
    submitMingus: () => any;
    audioKey: string;
    octave: string;
    audioScale: string;
    audioChord: string;
    handleChangeScale: (event: SelectChangeEvent) => void;
    handleChangeChord: (event: SelectChangeEvent) => void;
    selectRef: any;
    tune: any;
    currentMicroTonalScale: any;
};

const MingusPopup = ({
    submitMingus, 
    audioKey, 
    octave, 
    audioScale, 
    audioChord, 
    handleChangeScale, 
    handleChangeChord,
    selectRef,
    tune,
    currentMicroTonalScale,
}: Props) => {
    const theme = useTheme();
    // const {selectRef, tune, currentMicroTonalScale} = props;
    const [microtoneDescs, setMicrotoneDescs] = React.useState<any>([]);
    // console.log("PPPROPS? ", selectRef, currentMicroTonalScale.current);
  
    React.useMemo(() => {
      setMicrotoneDescs(
        microtoneDescsData.map((i: any, idx: number) => {
            if (microtoneDescs && microtoneDescs.map((i:any) => i.description).indexOf(i.description) === -1) {
                return {
                    index: idx,
                    label: i.name,
                    value: i.name,
                    name: i.name,
                    description: i.description,
                }
            }}));
    }, []); 
    const defaultProps = {
        options: microtoneDescs,
        getOptionLabel: (option: any) => `${option.name}: ${option.description}`,
    };

    const handleUpdateMicrotones = (e: any) => {
        currentMicroTonalScale(e.target.innerText.split(":")[0]);
    }

    return (
        <ThemeProvider theme={theme}>
            {/* Notes */}
            <Box 
                sx={{
                    display: window.innerHeight > 520 ? 'flex' : 'none', 
                    width: '122px',
                    outline: 'none',
                }}>    
       

                <Box sx={{
                    // display: 'flex', 
                    
                    flexDirection:'column', 
                    outline: 'none',
                    left: '-13px',
                }}>
                    
                    <Box sx={{
                        display: window.innerHeight > 760 ? 'flex' : 'none',  
                        flexDirection:'row', 
                    }}>
                        <FormControl 
                            sx={{width: '120px',color:'rgba(228,225,209,1)'}}
                            // fullWidth
                        >
                            <Select
                                sx={{
                                    color: 'white', 
                                    // minWidth: '80px', 
                                    fontWeight: 'bold', 
                                    fontSize: MIDDLE_FONT_SIZE, 
                                    fontFamily: 'typography.fontFamily',
                                }}
                                labelId="audioKey-simple-select-label"
                                id="audioKey-simple-select"
                                value={audioKey}

                                // onChange={handleChangeAudioKey}
                            >
                                <MenuItem sx={{fontFamily: 'monospace'}} value={'C'}>C</MenuItem>
                                <MenuItem sx={{fontFamily: 'monospace'}} value={'C♯'}>C♯</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'D'}>D</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'D♯'}>D♯</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'E'}>E</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'F'}>F</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'F♯'}>F♯</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'G'}>G</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'G♯'}>G♯</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'A'}>A</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'A♯'}>A♯</MenuItem>
                                <MenuItem sx={{fontFamily: 'typography.fontFamily'}} value={'B'}>B</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                    <Box sx={{
                        display: window.innerHeight > 670 ? 'flex' : 'none', 
                        flexDirection:'row', 
                        // width: '160px', 
                        // paddingRight: '6px',
                        // paddingLeft: '6px'
                    }}>
                        <FormControl 
                            sx={{width: '120px',color:'rgba(228,225,209,1)'}}
                            // fullWidth
                        >
                            {/* <InputLabel
                                id={"octave-simple-select-label"} 
                                sx={{ 
                                    minWidth: '80px', 
                                    color: 'white !important',
                                    fontFamily: 'text.primary'}}>
                                        Octave
                            </InputLabel> */}
                            <Select
                                sx={{
                                    color: 'white', 
                                    fontWeight: 'bold', 
                                    fontSize: '14px'
                                }}
                                labelId="octave-simple-select-label"
                                id="octave-simple-select"
                                value={octave}
                                label="Octave"
                                // onChange={handleChangeOctave}
                            >
                                <MenuItem value={'0'}>0</MenuItem>
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                                <MenuItem value={'3'}>3</MenuItem>
                                <MenuItem value={'4'}>4</MenuItem>
                                <MenuItem value={'5'}>5</MenuItem>
                                <MenuItem value={'6'}>6</MenuItem>
                                <MenuItem value={'7'}>7</MenuItem>
                                <MenuItem value={'8'}>8</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: window.innerHeight > 620 ? 'flex' : 'none', 
                        flexDirection:'row', 
                        // width: '160px', 
                        // paddingRight: '6px',
                        // paddingLeft: '6px',
                        outline: 'none',
                    }}>
                        <FormControl 
                            sx={{width: '120px', outline: 'none', color:'rgba(228,225,209,1)'}}
                            // fullWidth
                            
                        >
                            {/* <InputLabel
                                id={"scale-simple-select-label"} 
                                sx={{ 
                                    minWidth: '60px', 
                                    color: 'white !important', 
                                    fontFamily: 'text.primary'
                                }}>
                                    Scale
                            </InputLabel> */}
                            <Select
                                sx={{color: 'white', fontWeight: 'bold', fontSize: MIDDLE_FONT_SIZE}}
                                labelId="scale-simple-select-label"
                                id="scale-simple-select"
                                value={audioScale}
                                label="Scale"
                                onChange={handleChangeScale}
                            >
                                <MenuItem value={'Diatonic'}>Diatonic</MenuItem>
                                <MenuItem value={'Major'}>Major</MenuItem>
                                <MenuItem value={'HarmonicMajor'}>Harmonic Major</MenuItem>
                                <MenuItem value={'NaturalMinor'}>Natural Minor</MenuItem>
                                <MenuItem value={'HarmonicMinor'}>Harmonic Minor</MenuItem>
                                <MenuItem value={'MelodicMinor'}>Melodic Minor</MenuItem>
                                <MenuItem value={'Bachian'}>Bachian</MenuItem>
                                <MenuItem value={'MinorNeapolitan'}>Minor Neapolitan</MenuItem>
                                <MenuItem value={'Chromatic'}>Chromatic</MenuItem>
                                <MenuItem value={'WholeTone'}>Whole Tone</MenuItem>
                                <MenuItem value={'Octatonic'}>Octatonic</MenuItem>
                                <MenuItem value={'Ionian'}>Ionian</MenuItem>
                                <MenuItem value={'Dorian'}>Dorian</MenuItem>
                                <MenuItem value={'Phyrygian'}>Phrygian</MenuItem>
                                <MenuItem value={'Lydian'}>Lydian</MenuItem>
                                <MenuItem value={'Mixolydian'}>Mixolydian</MenuItem>
                                <MenuItem value={'Aeolian'}>Aeolian</MenuItem>
                                <MenuItem value={'Locrian'}>Locrian</MenuItem>
                                <MenuItem value={'Fifths'}>Fifths</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: window.innerHeight > 580 ? 'flex' : 'none', 
                        flexDirection:'row', 
                        // width: '160px', 
                        // paddingRight: '6px',
                        // paddingLeft: '6px'
                    }}>
                        <FormControl 
                            // fullWidth
                            sx={{
                                color:'rgba(228,225,209,1)',
                                width: '120px'
                            }}
                        >
      
                            <Select
                                labelId="chord-simple-select-label"
                                id="chord-simple-select"
                                value={audioChord}
                                label="Chord"
                                onChange={handleChangeChord}
                                sx={{
                                    color: 'white', 
                                    fontWeight: 'bold', 
                                    fontSize: MIDDLE_FONT_SIZE,
                                    '& .MuiList-root': {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'rgba(30,34,26,0.96)',
                                        color: '#f5f5f5',
                                    }
                                }}
                            >
                                <MenuItem value={'M'}>Major Triad</MenuItem>
                                <MenuItem value={'m'}>Minor Triad</MenuItem>
                                <MenuItem value={'aug'}>Augmented Triad</MenuItem>
                                <MenuItem value={'dim'}>Diminished Triad</MenuItem>
                                <MenuItem value={'dim7'}>Diminished Seventh</MenuItem>
                                <MenuItem value={'sus2'}>Suspended Second Triad</MenuItem>
                                <MenuItem value={'sus'}>Suspended Fourth Triad</MenuItem>
                                <MenuItem value={'madd4'}>Minor Add Fourth</MenuItem>
                                <MenuItem value={'5'}>Perfect Fifth</MenuItem>
                                <MenuItem value={'7b5'}>Dominant Flat Five</MenuItem>
                                <MenuItem value={'6'}>Major Sixth</MenuItem>
                                <MenuItem value={'67'}>Dominant Sixth</MenuItem>
                                <MenuItem value={'69'}>Sixth Ninth</MenuItem>
                                <MenuItem value={'m6'}>Minor Sixth</MenuItem>
                                <MenuItem value={'M7'}>Major Seventh</MenuItem>
                                <MenuItem value={'m7'}>Minor Seventh</MenuItem>
                                <MenuItem value={'M7+'}>Augmented Major Seventh</MenuItem>
                                <MenuItem value={'m7+'}>Augmented Minor Seventh</MenuItem>
                                <MenuItem value={'sus47'}>Suspended Seventh</MenuItem>
                                <MenuItem value={'m7b5'}>Half Diminished Seventh</MenuItem>
                                <MenuItem value={'mM7'}>Minor Major Seventh</MenuItem>
                                <MenuItem value={'dom7'}>Dominant Seventh</MenuItem>

                                <MenuItem value={'7+'}>Augmented Major Seventh</MenuItem>
                                <MenuItem value={'7#5'}>Augmented Minor Seventh</MenuItem>
                                <MenuItem value={'7#11'}>Lydian Dominant Seventh</MenuItem>
                                <MenuItem value={'m/M7'}>Minor Major Seventh</MenuItem>
                                <MenuItem value={'7sus4'}>Suspended Seventh</MenuItem>
                                <MenuItem value={'M9'}>Major Ninth</MenuItem>
                                <MenuItem value={'m9'}>Minor Ninth</MenuItem>
                                <MenuItem value={'add9'}>Dominant Ninth</MenuItem>
                                <MenuItem value={'susb9'}>Suspended Fourth Ninth 1</MenuItem>
                                <MenuItem value={'sus4b9'}>Suspended Fourth Ninth 2</MenuItem>
                                <MenuItem value={'9'}>Dominant Ninth</MenuItem>
                                <MenuItem value={'m9b5'}>Minor Ninth Flat Five</MenuItem>
                                <MenuItem value={'7_#9'}>Dominant Sharp Ninth</MenuItem>
                                <MenuItem value={'7b9'}>Dominant Flat Ninth</MenuItem>
                                <MenuItem value={'6/9'}>Sixth Ninth</MenuItem>
                                <MenuItem value={'11'}>Eleventh</MenuItem>
                                <MenuItem value={'m11'}>Minor Eleventh</MenuItem>
                                <MenuItem value={'add11'}>Add Eleventh</MenuItem>
        
                                <MenuItem value={'hendrix'}>Hendrix Chord 2</MenuItem>
                                <MenuItem value={'M13'}>Major Thirteenth</MenuItem>
                                <MenuItem value={'m13'}>Minor Thirteenth</MenuItem>
                                <MenuItem value={'13'}>Dominant Thirteenth</MenuItem>
                                <MenuItem value={'add13'}>Dominant Thirteenth</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: 'flex', 
                        flexDirection:'row', 
                        outline: 'none',
                    }}>
                    <Autocomplete
                        {...defaultProps}
                        id="auto-complete"
                        autoComplete
                        includeInputInList
                        onChange={handleUpdateMicrotones}
                        sx={{
                            color: "white !important", 
                            width: "120px !important", 
                            // maxWidth: "120px !important", 
                            overflow: "visible", 
                            // background: "pink",
                            outline: 'none',
                            // maxWidth: '80px'
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                        <TextField {...params} sx={{
                                color: "white", 
                                width: "300px", 
                                fontSize: "12px"
                            }} 
                            key={params.id}
                            label="Microtones" />
                        )}
                    />
                    </Box>
                </Box>

            </Box>
        </ThemeProvider>
    );
};
export default MingusPopup;