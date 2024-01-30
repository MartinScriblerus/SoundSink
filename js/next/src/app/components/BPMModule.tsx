import { Box, FormControl, TextField, Input } from '@mui/material';
import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { BPMModule } from '@/interfaces/audioInterfaces';
import InputField from './InputField';

const BPMModule = (props: BPMModule) => {
    const { 
        bpm, 
        handleChangeBPM, 
        handleChangeBeatsNumerator, 
        beatsNumerator, 
        handleChangeBeatsDenominator, 
        beatsDenominator} = props;
    const theme = useTheme();

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                marginTop: '10vh',
                marginBottom: '20vh',
                width: '60vw',
                height: '70vh',
                marginLeft: '20vw',
                marginRight: '20vw',
                backgroundColor: 'rgba(0,0,0,1)',
                border: '1px solid rgba(255,255,255,.5)',
            }}>
                <FormControl
                    sx={{margin: '12px', maxWidth: '100px',}}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                }>
                    <TextField
                        inputProps={{ style: { color: 'primary.contrastText'} }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "2rem",
                            backgroundColor: 'status.danger',
                            color: 'status.text',
                            paddingTop: 0,
                            alignItems: 'center',
                            paddingBottom: 0,
                            // margin: "1rem",
                            // maxWidth: "6rem",
                            width: '100%',
                        }}
                        label={"BPM"}
                        placeholder="BPM"
                        type="number"
                        id="outlined-textarea"
                        className="inputSampleInfo"
                        defaultValue={bpm}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                                event.preventDefault();
                                const inputBpm: any = parseInt(event.target.value);
                                if (inputBpm) {
                                    handleChangeBPM(inputBpm);
                                }
                            }
                        }
                    />
                </FormControl>

                <FormControl
                    sx={{margin: '12px', maxWidth: '100px',}}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                }>
                    <TextField
                        inputProps={{ style: { color: 'primary.contrastText'} }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "2rem",
                            backgroundColor: 'status.danger',
                            color: 'status.text',
                            paddingTop: 0,
                            alignItems: 'center',
                            paddingBottom: 0,
                            width: '100%',
                        }}
                        label={"Numerator"}
                        placeholder="Numerator"
                        type="number"
                        id="outlined-textarea"
                        className="inputSampleInfo"
                        defaultValue={beatsNumerator}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                                event.preventDefault();
                                const inputBpmeasure: any = parseInt(event.target.value);
                                console.log('@@@@', inputBpmeasure)
                                if (inputBpmeasure) {
                                    handleChangeBeatsNumerator(inputBpmeasure);
                                }
                            }
                        }
                    />
                </FormControl>


                <FormControl
                    sx={{margin: '12px', maxWidth: '100px',}}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                }>
                    <TextField
                        inputProps={{ style: { color: 'primary.contrastText'} }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "2rem",
                            backgroundColor: 'status.danger',
                            color: 'status.text',
                            paddingTop: 0,
                            alignItems: 'center',
                            paddingBottom: 0,
                            width: '100%',
                        }}
                        label={"Denominator"}
                        placeholder="Denominator"
                        type="number"
                        id="outlined-textarea"
                        className="inputSampleInfo"
                        defaultValue={beatsDenominator}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                                event.preventDefault();
                                const mpb: any = parseInt(event.target.value);

                                if (mpb) {
                                    handleChangeBeatsDenominator(mpb);
                                }
                            }
                        }
                    />
                </FormControl>
            </Box>
        </ThemeProvider>
    )
}
export default BPMModule;