import { Box, Typography } from "@mui/material";

type ClockCounterProps = {
    chuckHook: any;
    currentPatternCount: number;
    currentDenomCount: number;
    currentNumerCountColToDisplay: number;
    currentBeatCountToDisplay: number;
    numeratorSignature: number;
}
const ClockCounter = (props: ClockCounterProps) => {
    const { chuckHook, currentPatternCount, currentDenomCount, currentNumerCountColToDisplay, currentBeatCountToDisplay, numeratorSignature } = props;
    
    
    
    return (
        <Box
            id="clockCounterWrapper"
            sx={{
                top: '64px',
                position: 'absolute',
                right: '12px',
                zIndex: 9999,
            }}
        >
            <Box
            className="countWrapper"
            sx={{
                color: "rgba(245,245,245,0.78)",
                position: "relative",
                pointerEvents: "none",
                display: "flex",
                flexDirection: "row",
                textAlign: "center",
                justifyContent: "center",
                top: "8px",
            }}
            >
            <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                {currentPatternCount}
            </Typography>

            <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                {currentDenomCount}
            </Typography>

            <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                {currentNumerCountColToDisplay}
            </Typography>

            <Typography sx={{ marginLeft: "12px", marginRight: "12px", fontSize: "24px !important" }}>
                {Math.floor(Math.ceil(currentBeatCountToDisplay / numeratorSignature))}
            </Typography>
            </Box>
        </Box>
    )
};
export default ClockCounter;