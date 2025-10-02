import { Box, FormControl, TextField } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { BPMModule } from '@/interfaces/audioInterfaces';

const BPMModuleFun = (props: BPMModule) => {
    const {
        bpm,
        setBpm,
        beatsNumerator,
        setChuckUpdateNeeded,
        handleChangeBeatsNumerator,
        handleChangeBeatsDenominator,
        beatsDenominator,
    } = props;
    const theme = useTheme();

    // ========================================================
    // HANDLE BPM
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleChangeBPM = (newBpm: number) => {
        if (newBpm) {
            setBpm(Number(newBpm));
        }
        setChuckUpdateNeeded(true);
    }

    return (
        <Box sx={{
            display: "contents",
            flexDirection: "column",
            paddingBottom: "12px",
            paddingTop: "32px",
            minWidth: "140px",
            width: "100%",
            justifyContent: "stretch",
            alignItems: "center",
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
                    justifySelf: 'center',
                    paddingBottom: "24px",
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                }
                }>
                <TextField
                    // focused
                    inputProps={{
                        style: {
                            color: 'rgba(245,245,245,0.94)',
                            fontSize: '24px',
                            fontFamily: 'monospace',
                            border: '0px',
                            borderRadius: '0px',
                            padding: '0px',
                        }
                    }}
                    sx={{
                        input: { color: 'rgba(245,245,245,0.78)' },
                        color: 'rgba(245,245,245,0.78)',
                        display: 'inline-flex',
                        fontSize: '36px',
                        alignItems: 'center',
                        height: "100%",
                        width: '100%',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'rgba(245,245,245,0.28)',
                        background: 'rgba(245,245,245,0.28)',
                        border: '0px',
                        fontFamily: 'monospace',
                        borderRadius: '0px',
                        padding: '0px',
                    }}
                    label={"BPM"}
                    placeholder="BPM"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type="number"
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
                paddingBottom: "8px",
                // paddingTop: "12px",
            }}>
                <FormControl
                    hiddenLabel
                    sx={{
                        margin: '4px',
                        padding: '0',
                        maxWidth: '100%',
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
                                fontSize: '24px',
                                textAlign: 'center',
                                color: 'primary.contrastText',
                                fontFamily: 'monospace',
                                border: '0px',
                                borderRadius: '0px',
                                padding: '0px',
                            }
                        }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "1rem",
                            color: 'rgba(245,245,245,0.78)',
                            paddingTop: 0,
                            alignItems: 'right',
                            paddingBottom: 0,
                            width: '100%',
                            paddingRight: '10%',
                            paddingLeft: '10%',
                            fontSize: '24px',
                            fontFamily: 'monospace',
                            border: '0px',
                            borderRadius: '0px',
                            padding: '0px',
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
                    sx={{ margin: '4px', padding: '0', maxWidth: '100%', }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                    }>
                    <TextField
                        hiddenLabel
                        inputProps={{
                            style: {
                                fontSize: '24px',
                                textAlign: 'center',
                                color: 'primary.contrastText',
                                fontFamily: 'monospace',
                                border: '0px',
                                borderRadius: '0px',
                                padding: '0px',
                            }
                        }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            minWidth: "1rem",
                            color: 'rgba(245,245,245,0.78)',
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