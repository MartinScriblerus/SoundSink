import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import VerticalSlider from "./MasterVolumeSliders";

type ControlsProps = {
    testChord: any;
    testScale: any;
    updateKeyScaleChord: (a: any, b: any, c: any, d: any, e: any) => void;
    files: File[];
}

const ControlValsView = (props: ControlsProps) => {
    const { testChord, testScale, updateKeyScaleChord, files } = props;
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '16px', marginTop: "64px", background: 'black' }}>

            <VerticalSlider files={files} />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Poly Synth
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Min / Max
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>



                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Mono Synth
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Min / Max
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Software Instrument
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Min / Max
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Audio In
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Min / Max
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Sampler 1
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Pattern
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Sampler 2
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Pattern
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Sampler 3
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Pattern
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>

                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Sampler 4
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Pattern
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>


                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the second section */}
                        Sampler 5
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Effects
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Pattern
                    </Grid>
                    <Grid sx={{border: '1px solid #f6f6f6'}} item xs={12} md={3}>
                        {/* Content for the first section */}
                        Active Scales
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
};
export default ControlValsView;