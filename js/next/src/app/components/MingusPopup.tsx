import { MIDDLE_FONT_SIZE, MUTED_OLIVE } from '@/utils/constants';
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
// import '../page.module.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
// import microtoneDescsData from '../microtone_descriptions.json'; 
import { StylesConfig } from 'react-select';

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

    const styles: StylesConfig<any, true> = {
        container: (provided: any) => ({
            ...provided,
            flexGrow: 1,
            width: '180px',
            maxWidth: '180px'
        }),
        control: (provided: any) => ({
            ...provided,
            background: 'rgba(0,0,0,0.78)',
            borderColor: '#9e9e9e',
            minHeight: '24px',
            width: '180px',
            maxWidth: '180px'
        }),
        option: (styles, {isFocused, isSelected}) => ({
            ...styles,
            color: 'rgba(255,255,255,0.78)',
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
            background: 'rgba(0,0,0,0.78)',
            maxHeight: '32px',
            marginTop: 0,
            color: 'rgba(255,255,255,0.78)',
            width: '180px',
            backgroundColor: 'rgba(0,0,0,0.78)',
        }),
        menuList: base => ({
            ...base,
            padding: 0,
            color: 'rgba(255,255,255,0.78)',
            backgroundColor: 'rgba(0,0,0,0.78)',
            background: 'rgba(0,0,0,0.78)',
        })
    }
  
    // React.useMemo(() => {
    //   setMicrotoneDescs(
    //     microtoneDescsData.map((i: any, idx: number) => {
    //         if (microtoneDescs && microtoneDescs.map((i:any) => i.description).indexOf(i.description) === -1) {
    //             return {
    //                 index: idx,
    //                 label: i.name,
    //                 value: i.name,
    //                 name: i.name,
    //                 description: i.description,
    //             }
    //         }}));
    // }, []); 
    const defaultProps = {
        options: microtoneDescs,
        getOptionLabel: (option: any) => `${option.name}: ${option.description}`,
    };

    const handleUpdateMicrotones = (e: any) => {
        currentMicroTonalScale(e.target.innerText.split(":")[0]);
    }

    return (
        <Box 
            sx={{
                display: 'flex', 
                // width: '122px',
                width: '100%',
                outline: 'none',
            }}>    
    

            <Box sx={{
                flexDirection:'column', 
                outline: 'none',
                width: '100%',
                left: '-13px',
            }}>    
                <Box sx={{
                    display:'flex',  
                    flexDirection:'row', 
                    width: '100%',
                }}>
                    <FormControl 
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
                            width: '100%',
                        }}
                        // fullWidth
                    >
                        <Select
                            sx={{                             
                                fontWeight: 'bold', 
                                fontSize: MIDDLE_FONT_SIZE, 
                                fontFamily: 'monospace',
                                color: 'rgba(255,255,255,0.78)',
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
                    display:'flex', 
                    flexDirection:'row', 
                    color: 'rgba(255,255,255,0.78)',
                    outline: 'none',
                }}>
                    <FormControl 
                        sx={{
                            width: '120px', 
                            outline: 'none', 
                            color: 'rgba(255,255,255,0.78)',
                        }}
                    >
                        <Select
                            sx={{fontWeight: 'bold', fontSize: MIDDLE_FONT_SIZE}}
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
                    display: 'flex', 
                    flexDirection:'row', 
                }}>
                    <FormControl 
                        // fullWidth
                        sx={{
                            color: 'rgba(255,255,255,0.78)',
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
                    
                                fontWeight: 'bold', 
                                fontSize: MIDDLE_FONT_SIZE,
                                '& .MuiList-root': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: MUTED_OLIVE,
                                    color: 'rgba(255,255,255,0.78)',
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
    
                </Box>
            </Box>

        </Box>
    );
};
export default MingusPopup;