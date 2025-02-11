import { Box, FormControl, TextField, Input, Button, } from '@mui/material';
import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { BPMModule } from '@/interfaces/audioInterfaces';
import InputField from './InputField';
import ToggleFXView from './ToggleFXView';


const BPMModuleFun = (props: BPMModule) => {
    const {
        bpm,
        handleChangeBPM,
        handleChangeBeatsNumerator,
        beatsNumerator,
        handleChangeBeatsDenominator,
        beatsDenominator,
    } = props;
    const theme = useTheme();

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            // border: "0.5px solid #b2b2b2",
            paddingBottom: "12px",
            paddingTop: "24px",
            paddingRight: "12px",
            paddingLeft: "12px",
            minWidth: "140px",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            // borderRadius: "solid .5px rgba(255,255,255,0.78)",
        }}>
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                    color: 'rgba(228,225,209,1)',
                    textAlign: 'center',
                    // border: "solid .5px rgba(255,255,255,0.78)",
                    // maxWidth: '86px',
                    // paddingTop: '18px',
                    // top: "20px",
                    // left: "0px",
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                }
                }>
                <TextField
                    // focused
                    inputProps={{
                        style: {
                            color: 'rgba(255,255,255,0.78)',
                            fontSize: '24px',
                            textAlign: 'center',
                            width: '100%'
                        }
                    }}
                    sx={{
                        input: { color: 'rgba(255,255,255,0.78)' },
                        // backgroundColor: 'rgba(0,0,0,0.78)',
                        color: 'rgba(255,255,255,0.78)',
                        display: 'inline-flex',
                        fontSize: '32px',
                        alignItems: 'center',
                        height: "100%",
                        // background: "rgba(255,255,255,0.78)",
                        border: 'solid 1px red'
                        // width: '84px',
                    }}
                    label={"BPM"}
                    placeholder="BPM"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type="number"
                    // id="standard-textarea-inputSampleInfo"
                    // className="inputSampleInfo"
                    // variant="outlined"
                    value={bpm}
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
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                alignItems: 'center',
            }}>
                <FormControl
                    hiddenLabel
                    sx={{
                        margin: '4px',
                        padding: '0',
                        maxWidth: '40px',
                        marginTop: '8px !important'
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                    }>
                    <TextField
                        hiddenLabel
                        focused
                        inputProps={{
                            style: {
                                fontSize: '18px',
                                textAlign: 'right',
                                color: 'primary.contrastText'
                            }
                        }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "1rem",
                            backgroundColor: 'rgba(0,0,0,0.78)',
                            color: 'rgba(255,255,255,0.78)',
                            paddingTop: 0,
                            alignItems: 'right',
                            paddingBottom: 0,
                            width: '100%',
                            fontSize: '24px',
                        }}
                        placeholder="Numerator"
                        type="number"
                        id="standard-textarea-standard"
                        variant="standard"
                        value={beatsNumerator}
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
                    hiddenLabel
                    sx={{ margin: '4px', padding: '0', maxWidth: '40px', }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                    }>
                    <TextField
                        hiddenLabel
                        inputProps={{
                            style: {
                                fontSize: '18px',
                                textAlign: 'right',
                                color: 'primary.contrastText'
                            }
                        }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "1rem",
                            backgroundColor: 'rgba(0,0,0,0.78)',
                            color: 'rgba(255,255,255,0.78)',
                            paddingTop: 0,
                            alignItems: 'right',
                            paddingBottom: 0,
                            width: '100%',
                        }}
                        placeholder="Denominator"
                        type="number"
                        id="standard-textarea-beatDenominator"
                        className="inputSampleInfo"
                        value={beatsDenominator}
                        variant="standard"
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
        </Box>
    )
}
export default BPMModuleFun;