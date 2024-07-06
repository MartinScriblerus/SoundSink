import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart } from "./LineChart";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
export interface VizDataProps {

  analysisObject: any;
  timeNow: number;
  closeAnalysisPopup: () => void;
  handleChangeAnalysisSource: (e: any) => void;
  analysisSourceRadioValue: string;
}

export const LineChartWrapper = (props:VizDataProps, {width = 700, height = 400}) => {
  const {
    analysisObject,
    timeNow, 
    closeAnalysisPopup, 
    handleChangeAnalysisSource,
    analysisSourceRadioValue
  } = props;
  
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [mockData, setMockData] = useState<Array<any>>([]);
  const [currentVisualization, setCurrentVisualization] = useState<string>('centroid');
  

  const value = ""

  useMemo(() => {

    if (analysisObject.current[analysisSourceRadioValue.toLowerCase()].length === 0) return;

      setMockData((data: any) => [...data, {
        x: timeNow, 
        centroid: analysisObject.current[analysisSourceRadioValue.toLowerCase()].centroid, 
        flux: analysisObject.current[analysisSourceRadioValue.toLowerCase()].flux,
        rms: analysisObject.current[analysisSourceRadioValue.toLowerCase()].rms,
        rolloff50: analysisObject.current[analysisSourceRadioValue.toLowerCase()].rolloff50,
        rolloff85: analysisObject.current[analysisSourceRadioValue.toLowerCase()].rolloff85,
        mfccEnergy: analysisObject.current[analysisSourceRadioValue.toLowerCase()].mfccEnergy,
        mfccVals: analysisObject.current[analysisSourceRadioValue.toLowerCase()].mfccVals,
        chroma: analysisObject.current[analysisSourceRadioValue.toLowerCase()].chroma,
        xCross: analysisObject.current[analysisSourceRadioValue.toLowerCase()].xcross,
        dct: analysisObject.current[analysisSourceRadioValue.toLowerCase()].dct,
        featureFreq: analysisObject.current[analysisSourceRadioValue.toLowerCase()].featureFreq,
        featureGain: analysisObject.current[analysisSourceRadioValue.toLowerCase()].featureGain,
        kurtosis: analysisObject.current[analysisSourceRadioValue.toLowerCase()].kurtosis,
    }]);
  },[analysisObject.current, timeNow]); 

  const handleChange = (selectedViz: any) => {
    setCurrentVisualization(selectedViz.target.value);

  };

  return (
    <Box
      className="findme"
      sx={{
        top: "26px",
        pointerEvents: "none",
        borderRadius: "24px",
        width: "100%"
      }}
    >

      <Box sx={{
        pointerEvents: "none", 
        position: "relative", 
        flexDirection: "row-reverse", 
        width: "calc(100% - 240px)",
        left: "240px", 
        display: "inline-flex", 
        background: "rgba(0,0,0,0.98)"}}>
        
        <CloseIcon onClick={closeAnalysisPopup} sx={{ pointerEvents: "all", position: "relative", display: "flex", flexDirection: "column", alignText: "right", zIndex: 120, justifyContent: "right" }} />
        
        <Box sx={{ position: "relative", display: "flex", flexDirection: "row" }}>
          {
          mockData && 
          (<LineChart
              key={`${currentVisualization}`}
              // data={analysisObject.current[analysisSourceRadioValue][`${currentVisualization}`]}
              data={mockData.map((i: any) => {return {x: i.x, y: i[`${currentVisualization}`]}})}
              width={width}
              height={height}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
              color={"rgba(228,225,209,1)"}          
              // analysisObject={analysisObject}
              // analysisSourceRadioValue={analysisSourceRadioValue}
              selectedViz={`${currentVisualization}`}
              timeNow={timeNow}
          />)}

<Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            // minHeight: '60px',
            // marginRight: '80px',
            // backgroundColor: "rgba(0, 0, 0,1)",
            color: 'rgba(228,225,209,1)',
            position: 'absolute',
            maxWidth: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px',
            left: '208px',
            zIndex: 9999,
            background: 'transparent',
            backgroundColor: 'transparent'
          }}
        >
          
          <RadioGroup
            aria-labelledby="demo2-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group2"
            value={analysisSourceRadioValue}
            sx={{
              // color: "rgba(147, 206, 214, 1)", 
   
              color: 'rgba(228,225,209,1)',
              pointerEvents: "all", 
              display: "flex", 
              flexDirection: "row", 
              backgroundColor: "transparent",
              background: "transparent",
              minHeight: "60px",
            }}
            onChange={handleChangeAnalysisSource}
          >
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)',
                    background: 'transparent',
                    backgroundColor: "transparent",
                }} 
                value="Osc" 
                control={<Radio />} 
                label="Osc" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)',
                    background: 'transparent',
                    backgroundColor: "transparent",
                }} 
                value="STK" 
                control={<Radio />} 
                label="STK" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)',
                    background: 'transparent',
                    backgroundColor: "transparent",
                }} 
                value="Sampler" 
                control={<Radio />} 
                label="Sampler" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)',
                    background: 'transparent',
                    backgroundColor: "transparent",
                }} 
                value="AudioIn" 
                control={<Radio />} 
                label="Audio In" />
            </RadioGroup>
        </Box>

          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group-feature-viz"
            name="controlled-radio-buttons-group-feature-viz"
            value={currentVisualization}
            sx={{color: "rgba(147, 206, 214, 1)", width: "100%", pointerEvents: "all"}}
            onChange={(e: any) => handleChange(e)}
          >
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="centroid" 
                control={<Radio />} 
                label="Centroid" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="flux" 
                control={<Radio />} 
                label="Flux" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="rms" 
                control={<Radio />} 
                label="RMS" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="rollOff50" 
                control={<Radio />} 
                label="Rolloff 50" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="rollOff85" 
                control={<Radio />} 
                label="Rolloff 85" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="xCross" 
                control={<Radio />} 
                label="X-Crossings" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="freq" 
                control={<Radio />} 
                label="Freq" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="gain" 
                control={<Radio />} 
                label="Gain" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="kurtosis" 
                control={<Radio />} 
                label="Kurtosis" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="sfm" 
                control={<Radio />} 
                label="SFM" />
          </RadioGroup>
        </Box>

      </Box>

      <Box>
        <Box>
        
        </Box>

      </Box>
    </Box>
  );
};
