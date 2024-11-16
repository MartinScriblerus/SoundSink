import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
type BeginScreenProps = {
    programIsOn: boolean;
    initChuck: () => void;
}
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const BeginScreen = (props: BeginScreenProps) => {
    const {programIsOn, initChuck} = props;
    const theme = useTheme();

    return (
        <>
            <Box
                // className={styles.card}
                sx={{
                    top: '48px', 
                    height: "100vh",
                    textAlign: "center",
                    background: theme.palette.black,
                }}
            >
            <Box sx={{
                paddingTop: '20%',
                fontFamily: ' "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '2em !important',
                
            }}>
                {/* <h1 style={{
                    fontSize: '2em !important', 
                    fontWeight: 100}}>Sound Sink</h1> */}
            </Box>

            <Button                                    
                sx={{ 
                    minWidth: '160px',
                    minHeight: '90px', 
                    top: "0%",
                    width: programIsOn ? "104px" : "25vw",
                    height: programIsOn ? "90px" : "90px",
                    paddingLeft: '24px',
                    // maxHeight: '40px',
                    fontSize: programIsOn ? "16px" : "32px",
                    color: theme.palette.white,
                    background: theme.palette.black, 
                    backgroundColor: theme.palette.black,
                    border: theme.palette.white,
                    '&:hover': {
                        color: '#f5f5f5 !important',
                        border: '1px solid #1976d2',
                        background: theme.palette.secondaryA,
                    }
                }} 
                variant="contained" 
                id="initChuckButton" 
                onClick={initChuck} 
                endIcon={<PlayArrowIcon
                style={{height: '100%', pointerEvents: "none"}} />}
                >
                    Begin
            </Button>
        </Box>
        </>
    )
};
export default BeginScreen;