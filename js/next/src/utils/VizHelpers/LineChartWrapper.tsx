import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart } from "./LineChart";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
export interface VizDataProps {
  centroid: {
    source: string;
    value: number;
  }
  flux: {
    source: string;
    value: number;
  }
  rms: {
    source: string;
    value: number;
  }
  mfccEnergy: {
    source: string;
    value: number;
  }
  mfccVals: {
    source: string;
    value: Array<number>;
  }
  rollOff50: {
    source: string;
    value: number;
  };
  rollOff85: {
    source: string;
    value: number;
  };
  chroma: {
    source: string;
    value: number[];
  };
  xCross: number;
  dct: Array<number>;
  featureFreq: {
    source: string;
    value: number;
  };
  featureGain: {
    source: string;
    value: number;
  };
  kurtosis: {
    source: string;
    value: number;
  };
  sfm: {
    source: string;
    value: number[];
  };
  sampleRate: number;
  timeNow: number;
  closeAnalysisPopup: () => void;
  handleChangeAnalysisSource: (e: any) => void;
  analysisSourceRadioValue: string;
}

export const LineChartWrapper = (props:VizDataProps, {width = 700, height = 400}) => {
  const {
    centroid, 
    flux, 
    rms, 
    mfccEnergy, 
    mfccVals, 
    rollOff50, 
    rollOff85, 
    chroma, 
    xCross, 
    dct, 
    featureFreq, 
    featureGain, 
    kurtosis, 
    sfm, 
    sampleRate, 
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
    // console.log('EEEESH PROPS: ', props);

    // EFFECTS W TIME ON X-AXIS
    if (currentVisualization === "centroid") {
      console.log('$$$ ', centroid);
      setMockData((data: any) => [...data, {x: timeNow, 
        y: centroid.value, 
        y_flux: flux.value,
        y_rms: rms.value,
        y_rolloff50: rollOff50.value,
        y_rolloff85: rollOff85.value,
        // y_mfccEnergy: mfccEnergy.value,
        // y_mfccVals: mfccVals.value,
        // y_chroma: chroma.value,
        y_xCross: xCross,
      }]);
    } else if (currentVisualization === "flux") {
      const dataParsedForNaN = typeof flux !== "number" && 0;
      setMockData((data: any) => [...data, {x: timeNow, y: flux.value || 0}]);
    } else if (currentVisualization === "rms") {
      setMockData((data: any) => [...data, {x: timeNow, y: rms.value || 0}]);
    }  else if (currentVisualization === "rollOff50") {
      setMockData((data: any) => [...data, {x: timeNow, y: rollOff50.value || 0}]);
    }  else if (currentVisualization === "rollOff85") {
      setMockData((data: any) => [...data, {x: timeNow, y: rollOff85.value || 0}]);
    }  else if (currentVisualization === "xCross") {
      setMockData((data: any) => [...data, {x: timeNow, y: xCross || 0}]);
    }  else if (currentVisualization === "freq") {
      console.log("YOYOYO: ", featureFreq);
      setMockData((data: any) => [...data, {x: timeNow, y: featureFreq.value}]);
    }  else if (currentVisualization === "gain") {
      setMockData((data: any) => [...data, {x: timeNow, y: featureGain.value}]);
    }  else if (currentVisualization === "kurtosis") {
      setMockData((data: any) => [...data, {x: timeNow, y: kurtosis.value}]);
    }  else if (currentVisualization === "sfm") {
      setMockData((data: any) => [...data, {x: timeNow, y: sfm.value}]);
    } 

    
  },[timeNow])

  const handleChange = (selectedViz: any) => {
    console.log("SELECTED VIZ: ", selectedViz.target.value);
    setCurrentVisualization(selectedViz.target.value);
  };

  return (
    <Box>

      <Box sx={{position: "relative", flexDirection: "row-reverse", width: "100%", display: "flex", background: "rgba(0,0,0,0.98)"}}>
        
        <CloseIcon onClick={closeAnalysisPopup} sx={{ position: "relative", display: "flex", flexDirection: "column", alignText: "right", justifyContent: "right" }} />
        
        <Box sx={{ position: "relative", display: "flex", flexDirection: "row" }}>
          <LineChart
              key={`${currentVisualization}`}
              data={mockData}
              width={width}
              height={height}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
              color={"rgba(228,225,209,1)"}          
              centroid={centroid} 
              flux={flux} 
              rms={rms} 
              mfccEnergy={mfccEnergy} 
              mfccVals={mfccVals} 
              rollOff50={rollOff50} 
              rollOff85={rollOff85} 
              chroma={chroma} 
              xCross={xCross} 
              dct={dct} 
              featureFreq={featureFreq} 
              featureGain={featureGain} 
              kurtosis={kurtosis} 
              sfm={sfm}
              sampleRate={sampleRate}
              selectedViz={`${currentVisualization}`}
              timeNow={timeNow}
          />

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
            {/* <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="sfm" 
                control={<Radio />} 
                label="SFM" /> */}
          </RadioGroup>
        </Box>

      </Box>

      <Box>
        <Box>
        
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            minHeight: '60px',
            marginRight: '80px',
            backgroundColor: "rgba(0, 0, 0,1)",
          }}
        >
          <RadioGroup
            aria-labelledby="demo2-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group2"
            value={analysisSourceRadioValue}
            sx={{
              color: "rgba(147, 206, 214, 1)", 
              pointerEvents: "all", 
              display: "flex", 
              flexDirection: "row", 
              backgroundColor: "rgba(0, 0, 0,1)",
              minHeight: "60px",
            }}
            onChange={handleChangeAnalysisSource}
          >
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="Osc" 
                control={<Radio />} 
                label="Osc" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="STK" 
                control={<Radio />} 
                label="STK" />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="Sampler" 
                control={<Radio />} 
                label="Sampler" 
            />
            <FormControlLabel 
                sx={{
                    color: 'rgba(228,225,209,1)'
                }} 
                value="AudioIn" 
                control={<Radio />} 
                label="Audio In" />
            </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};
