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
                fontFamily: notoSans,
                fontSize: '24px',
                marginRight: '0vw',
                backgroundColor: 'rgba(0,0,0,1)',
                border: '1px solid rgba(255,255,255,.5)',
                display: 'flex',
                flexDirection: 'row',
                // padding: '12px',
                justifyContent: 'center',
                width: '108%',
                height: '100%'
            }}>
                <FormControl
                    sx={{
                        margin: '8px', 
                        padding: '0', 
                        maxWidth: '100px', 
                        color:'rgba(228,225,209,1)'
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
                            display: 'block',
                            fontSize: '32px',
                            alignItems: 'center',
                            paddingBottom: 0,
                            // margin: "1rem",
                            // maxWidth: "6rem",
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
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <FormControl
                        hiddenLabel
                        sx={{margin: '4px', padding: '0', maxWidth: '40px',}}
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
                                    textAlign: 'center',
                                    color: 'primary.contrastText'
                                } 
                            }}
                            sx={{
                                input: { color: 'primary.contrastText' },
                                minWidth: "1rem",
                                backgroundColor: 'status.danger',
                                color: 'status.text',
                                paddingTop: 0,
                                alignItems: 'center',
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
                                    textAlign: 'center',
                                    color: 'primary.contrastText'
                                } 
                            }}
                            sx={{
                                input: { color: 'primary.contrastText' },
                                minWidth: "1rem",
                                backgroundColor: 'status.danger',
                                color: 'status.text',
                                paddingTop: 0,
                                alignItems: 'center',
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

                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Button 
                            sx={{ 
                                color: 'rgba(0,0,0,.98) !important',
                                backgroundColor: 'rgba(219, 230, 161, 0.97)', 
                                marginLeft: '0px', 
                                // maxWidth: '28px',
                                minWidth: '60px',
                                maxWidth: '60px',
                                maxHeight: '40px',
                                display: programIsOn ? "flex" : "none",
                                border: '0.5px solid #b2b2b2',
                                '&:hover': {
                                    color: '#f5f5f5 !important',
                                    background: 'rgba(0,0,0,.98)',
                                    border: '1px solid #1976d2',
                                }
                            }} 
                            variant="outlined" 
                            className="ui_SynthLayerButton"
                            onClick={handleToggleArpeggiator} 
                            // endIcon={<AnimationIcon />}
                            >
                                Arp1
                        </Button>
    {/* S-ARP */}
                        <Button 
                            sx={{ 
                                color: 'rgba(0,0,0,.98) !important',
                                backgroundColor: 'rgba(219, 230, 161, 0.97)', 
                                minWidth: '60px',
                                maxWidth: '60px',
                                maxHeight: '40px',
                    
                                // background: 'rgba(232, 82,82, 1)', 
                                // background: 'rgba(147, 206, 214, 1)', 
                                // minWidth: '208px', 
                                marginLeft: '0px', 
                                border: '0.5px solid #b2b2b2',
                                display: programIsOn ? "flex" : "none",
                                '&:hover': {
                                    color: '#f5f5f5 !important',
                                    background: 'rgba(0,0,0,.98)',
                                    border: '1px solid #1976d2',
                                }
                            }} 
                            variant="outlined" 
                            className="ui_SynthLayerButton"
                            onClick={handleToggleStkArpeggiator} 
                            // endIcon={<AnimationIcon />}
                            >
                                Arp2
                        </Button>

                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Box sx={{display: "flex", flexDirection: "row"}}>
                                <ToggleFXView 
                                    stkCount={stkFX.current.length}
                                    fxCount={checkedFXList.length}
                                    handleReturnToSynth={handleReturnToSynth} 
                                    programIsOn={programIsOn}
                                    handleToggleStkArpeggiator={handleToggleStkArpeggiator}
                                    handleToggleArpeggiator={handleToggleArpeggiator}
                                    stkFX={stkFX.current}
                                    checkedFXList={checkedFXList}
                                    keysVisible={keysVisible}
                                />
                            </Box>
                        </Box>   

                    </Box>
                </Box>
            </Box>

    )
}
export default BPMModuleFun;