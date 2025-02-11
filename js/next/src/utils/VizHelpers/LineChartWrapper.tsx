import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart } from "./LineChart";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LegendVizx from "@/app/components/VizxHelpers/Legend";
import BrushChart from "@/app/components/VizxHelpers/BrushChart";
import Steamgraph from "@/app/components/VizxHelpers/Steamgraph";
export interface VizDataProps {

  analysisObject: any;
  timeNow: number;
  closeAnalysisPopup: () => void;

  analysisSourceRadioValue: string;
  filesToProcess: any[];

  handleLegendClicked: (label:any) => void;
  inFileAnalysisMode: boolean;
  handleFileAnalysisMode:() => void;
  meydaData: any;
  meydaFeatures: any;
  meydaParam: string;
  meydaNeedsUpdate: boolean;
}

export const LineChartWrapper = (props:VizDataProps, {width = 700, height = 400}) => {
  const {
    analysisObject,
    timeNow, 
    closeAnalysisPopup, 
    analysisSourceRadioValue,
    filesToProcess,
    handleLegendClicked,
    inFileAnalysisMode,
    handleFileAnalysisMode,
    meydaData,
    meydaFeatures,
    meydaParam,
    meydaNeedsUpdate
  } = props;
  
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [mockData, setMockData] = useState<Array<any>>([]);
  const [currentVisualization, setCurrentVisualization] = useState<string>('centroid');
  const [isInFileMode, setIsInFileMode] = useState<boolean>(true);
  const fileTime = useRef<number | undefined | false>();
  
  const theme = useTheme();

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
  console.log("curr viz! ", currentVisualization);

  const bruteHandleIsInFileMode = () => {
    setIsInFileMode(!isInFileMode);
  }

  const getAudioDuration = (arrayBuffer:any, numChannels: number, sampleRate: number, isFloatingPoint: boolean) => {
    // PCM 16 or Float32
    const bytesPerSample = (isFloatingPoint ? Float32Array : Uint16Array).BYTES_PER_ELEMENT
    // total samples/frames
    const totalSamples = arrayBuffer.byteLength / bytesPerSample / numChannels 
    // total seconds
    return totalSamples / sampleRate
  }

  useEffect(() => {
    fileTime.current = filesToProcess && filesToProcess.length > 0 && getAudioDuration(filesToProcess[filesToProcess.length -1].data, 2, 44100, true);
    console.log("CHECK FILE TIME!!! ", fileTime);
    console.log("FILES TO PROCESS: ", filesToProcess);
    console.log("Files Data! ",  filesToProcess[filesToProcess.length - 1] &&  filesToProcess[filesToProcess.length - 1].length && filesToProcess[filesToProcess.length - 1].data.map((i: any, idx: number) => {return {x: idx, y: i}}))
  }, [filesToProcess.length, isInFileMode]);

  useEffect(() => {
    if (meydaFeatures) {
      console.log("WHAT ARE MEYDA FEATURES? ", meydaFeatures);
    }
  }, [filesToProcess.length, meydaNeedsUpdate]);
  

  return (
    <>
      <Box
        sx={{
          top: "0px",
          pointerEvents: "none",
          borderRadius: "24px",
          width: "100%",
          height: "calc(100vh - 13rem)",
          display: "inline-flex",
          position: "relative",
        }}
      >      
        <Box 
          sx={{
            pointerEvents: "none", 
            position: "relative", 
            display: "flex", 
            height: "100%",
            background: "rgba(0,0,0,0.78)",
            justifyContent: "right",
            alignItems: "right",
            borderRadius: "16px",
            padding: "12px",
            fontSize: "16px",
            width: "100%"
          }}
        >


          <Box sx={{
            // width: "100%", 
            position: "relative", 
            boxSizing: "border-box", 
            justifyContent: "center",
            alignItems: "center", 
            borderRadius: "8px", 
            padding: "12px", 
            fontSize: "16px",
            left: "0px",
            width: "calc(100vw - 142px);",
            top: "12px",
            right: "0",
            // left: "142px"
            }}>
              {
                meydaData && 
                <div style={{display: "flex", width: "100%" }}>
                
                <LegendVizx 
                  handleLegendClicked={handleLegendClicked}  
                  inFileAnalysisMode={inFileAnalysisMode}
                  handleFileAnalysisMode={handleFileAnalysisMode}
                />
                <span style={{
                  // position: "relative",
                  // top: '142px',
                  // width: "100%",
                  height: "auto",
                  left: "152px",
                }}>
                  {/* {
                    !meydaParam.includes("chroma") 
                    ?
                      <BrushChart height={window.innerHeight - 350} width={(window.innerWidth - 400) > 500 ? window.innerWidth - 450 : 500 } meydaData={meydaFeatures}></BrushChart>
                    : 
                      <Steamgraph height={window.innerHeight - 350} width={(window.innerWidth - 400) > 500 ? window.innerWidth - 450 : 500 } meydaData={meydaFeatures}></Steamgraph>
                  } */}
                </span>
                </div>
              }
          </Box>
          <Box sx={{
            display: 'flex', 
            flexDirection: 'column',
            position: 'absolute',
            top: '112px',
            left: '52px',
            width: '524px',
          }}>

          </Box>
          <CloseIcon 
            onClick={closeAnalysisPopup} 
            sx={{ 
              pointerEvents: "auto", 
              position: "relative", 
              display: "flex", 
              flexDirection: "column", 
              alignText: "right", 
              zIndex: 120, 
              justifyContent: "right" 
            }} />
        </Box>
        <Box>
          <Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
