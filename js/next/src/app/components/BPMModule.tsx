import { Box, FormControl, TextField, Input, Button, } from '@mui/material';
import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { BPMModule } from '@/interfaces/audioInterfaces';
import InputField from './InputField';
import { Noto_Sans } from 'next/font/google'
import ToggleFXView from './ToggleFXView';

// If loading a variable font, you don't need to specify the font weight
const notoSans = Noto_Sans({ subsets: ['latin'] })


const BPMModuleFun = (props: BPMModule) => {
    const { 
        bpm, 
        handleChangeBPM, 
        handleChangeBeatsNumerator, 
        beatsNumerator, 
        handleChangeBeatsDenominator, 
        beatsDenominator,
        programIsOn,
        handleToggleArpeggiator,
        handleToggleStkArpeggiator,
        handleReturnToSynth,
        checkedFXList,
        stkFX,
        keysVisible,
    } = props;
    const theme = useTheme();

    return (
        <Box sx={{
            display: "flex", 
            flexDirection: "row",
            border: "0.5px solid #b2b2b2", 
            paddingBottom: "12px",

            width: "100%"
        }}>
            {/* <Box sx={{
                fontFamily: notoSans,
                fontSize: '24px',
                marginRight: '0vw',
                backgroundColor: 'rgba(0,0,0,1)',
                border: '1px solid rgba(255,255,255,.5)',
                display: 'inline-flex',
                flexDirection: 'row',
                // padding: '12px',
                justifyContent: 'center',
                width: '140px',
                // height: 'auto',
                // minHeight: '136px'
            }}> */}
                <FormControl
                    sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        width: '50%',
                        // backgroundColor: 'pink',
                        alignItems: 'center',
                        // margin: '18px', 
                        // padding: '8px', 
                        // maxWidth: '100px', 
                        color:'rgba(228,225,209,1)',
                        maxWidth: '86px',
                        // width: '100%',
                        paddingTop: '18px',
                        top: "20px",
                        left: "16px",
                        // background: "pink"
                        // justifyContent: 'space-evenly !important'
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }
                }>
                    <TextField
                        focused
                        inputProps={{ 
                            style: { 
                                color: 'primary.contrastText',
                                // fontFamily: notoSans,
                                fontSize: '24px',
                                width:'100%'
                            } 
                        }}
                        sx={{
                            input: { color: 'primary.contrastText' },
                            // minWidth: "2rem",
                            backgroundColor: 'status.danger',
                            color: 'status.text',
                            // paddingTop: 0,
                            fontFamily: notoSans,
                            display: 'flex',
                            fontSize: '32px',
                            alignItems: 'center',
                            // paddingBottom: 0,
                            // margin: "1rem",
                            // maxWidth: "6rem",
                            height: "100%",
                            width: '84px',
                        }}
                        label={"BPM"}
                        placeholder="BPM"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        type="number"
                        id="standard-textarea"
                        className="inputSampleInfo"
                        variant="outlined"
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
                <Box sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    width: '50%',
                    // backgroundColor: 'pink',
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
                                backgroundColor: 'status.danger',
                                color: 'status.text',
                                paddingTop: 0,
                                alignItems: 'right',
                                paddingBottom: 0,
                                width: '100%',
                                fontFamily: notoSans,
                                fontSize: '24px',
                            }}
                            placeholder="Numerator"
                            type="number"
                            id="standard-textarea"
                            variant="standard"
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
                        hiddenLabel
                        sx={{margin: '4px', padding: '0', maxWidth: '40px',}}
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
                                backgroundColor: 'status.danger',
                                color: 'status.text',
                                paddingTop: 0,
                                alignItems: 'right',
                                paddingBottom: 0,
                                width: '100%',
                            }}
                            placeholder="Denominator"
                            type="number"
                            id="standard-textarea"
                            className="inputSampleInfo"
                            defaultValue={beatsDenominator}
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
           

            {/* </Box> */}
        </Box>
    )
}
export default BPMModuleFun;