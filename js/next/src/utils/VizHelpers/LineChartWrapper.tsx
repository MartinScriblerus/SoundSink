import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart } from "./LineChart";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
export interface VizDataProps {

  analysisObject: any;
  timeNow: number;
  closeAnalysisPopup: () => void;
  handleChangeAnalysisSource: (e: any) => void;
  analysisSourceRadioValue: string;
  secLenBeat:number;
  beatCount: number;
  numerCount: number;
  denomCount: number;
  patternCount: number;
  filesToProcess: any[];
  bufferStepLength: number;
  graphNeedsUpdate: boolean;
  setGraphNeedsUpdate: any;
}

export const LineChartWrapper = (props:VizDataProps, {width = 700, height = 400}) => {
  const {
    analysisObject,
    timeNow, 
    closeAnalysisPopup, 
    handleChangeAnalysisSource,
    analysisSourceRadioValue,
    secLenBeat,
    beatCount,
    numerCount,
    denomCount,
    patternCount,
    filesToProcess,
    bufferStepLength,
    graphNeedsUpdate,
    setGraphNeedsUpdate,
  } = props;
  
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [mockData, setMockData] = useState<Array<any>>([]);
  const [currentVisualization, setCurrentVisualization] = useState<string>('centroid');
  const [isInFileMode, setIsInFileMode] = useState<boolean>(true);
  const fileTime = useRef<number | undefined | false>();
  
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

  return (
    <Box
      className="findme"
      sx={{
        top: "26px",
        pointerEvents: "none",
        borderRadius: "24px",
        width: "100%",
        height: "100%",
      }}
    >
      <Button 
        onClick={bruteHandleIsInFileMode}
        sx={{
          border: 'solid 1px #000000',
          backgroundColor: isInFileMode ? '#000000' : 'orange',
          color: isInFileMode? '#ffffff' : '#000000',
          fontSize: "14px",
          padding: "8px 16px",
          position: "absolute",
          zIndex: "99",
          pointerEvents: "all",
          cursor: "pointer",
          marginLeft: "16px",
          borderRadius: "4px",

        }}
      >
        File Mode
      </Button>
      <Box 
        sx={{
          pointerEvents: "none", 
          position: "relative", 
          // flexDirection: "row-reverse", 
          // width: "calc(100% - 240px)",
          width: "calc(100% - 146px)",
          // left: "240px", 
          display: "flex", 
          // background: "rgba(0,0,0,0.98)",
          height: "100%",
          background: "rgba(0,0,0,0.9)"
        }}
      >
        

        <Box sx={{ 
          position: "relative",
          display: "flex", 
          flexDirection: "column" }}>
          {
          mockData && 
          (<LineChart
              key={`${currentVisualization}`}
              // data={analysisObject.current[analysisSourceRadioValue][`${currentVisualization}`]}
              // data={mockData.map((i: any) => {return {x: i.x, y: i[`${currentVisualization}`]}})}
              data={isInFileMode && 
                filesToProcess.length > 0 && 
                filesToProcess[filesToProcess.length - 1].data 
                ? 
                  filesToProcess[filesToProcess.length - 1].data
                :
                // filesToProcess[filesToProcess.length - 1].data.map((i: any, idx: number) => {return {x: idx * ((fileTime.current || 1)/filesToProcess[filesToProcess.length - 1].data.length), y: i[`${currentVisualization}`]}})} : 
                  mockData.map((i: any) => {return {x: i.x, y: i[`${currentVisualization}`]}})
                

              }
              width={width}
              height={height}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
              color={"rgba(228,225,209,1)"}          
              // analysisObject={analysisObject}
              // analysisSourceRadioValue={analysisSourceRadioValue}
              selectedViz={`${currentVisualization}`}
              timeNow={timeNow}
              secLenBeat={secLenBeat}
              beatCount={beatCount}
              numerCount={numerCount}
              denomCount={denomCount}
              patternCount={patternCount}
              isInFileMode={isInFileMode} 
              fileTime={fileTime.current}
              filesToProcess={filesToProcess}
              graphNeedsUpdate={graphNeedsUpdate}
              setGraphNeedsUpdate={setGraphNeedsUpdate}
          />)}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              // minHeight: '60px',
              // marginRight: '80px',
              // backgroundColor: "rgba(0, 0, 0,1)",
              color: 'rgba(228,225,209,1)',
              // position: 'absolute',
              maxWidth: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              // padding: '12px',
              // marginLeft: '12px',
              // marginRight: '12px'
        
              // left: '208px',
              // zIndex: 9999,
              // background: 'transparent',

            }}
          >
          {['Osc', 'STK', 'Sampler', 'AudioIn'].map((i) => {
            return (
              <Button
                id={`${i}_analysis_btn_setter`}
                key={`${i}_analysis_btn_setter`}
                onClick={(e) => handleChangeAnalysisSource(e)}
                value={i}
                sx={{
                  width: '60px', 
                  height: '60px', 
                  // marginRight: '12px', 
                  pointerEvents: 'all',
                  zIndex: '99',
                  cursor: 'pointer',
                  border: "solid 1px transparent",
                  borderRadius: "50% !important", 
                  background: analysisSourceRadioValue === i.toLowerCase() ? 'rgba(219, 230, 161, 0.97)' : 'rgba(147, 206, 214, 0.8)',
                  fontSize: '14px',
                  color: "black",
                  transform: 'scale(0.75)',
                  '&:hover': {
                    color: "#f6f6f6",
                    background: 'rgba(0,0,0,0.7)',
                    borderColor: '#f6f6f6',
                  }
                }}
              >{i === "Osc" ? "osc": i === "STK" ? "stk": i === "Sampler" ? "sam" : "in"}</Button>)
            })
          }
        </Box>

        <Box sx={{display: 'flex', width: '100%', flexDirection: 'row'}}>
          {['Centroid', 'Flux', 'RMS', 'Rolloff 50', 'Rolloff 85', 'XCrossings', 'Freq', 'Gain', 'Kurtosis', 'SFM', 'MFCC'].map((j: any, idx: number) => {
            return (
              <Button
                id={`${j}_analysis_btn_setter_features`}
                key={`${j}_analysis_btn_setter_features`}
                onClick={(e) => handleChange(e)}
                value={j}
                sx={{
                  width: '60px', 
                  height: '60px',
                  pointerEvents: 'all',
                  display: 'flex',
                  flexDirection: 'row',
                  zIndex: 9999,
                  cursor: 'pointer',
                  // marginRight: '12px', 
                  border: "solid 1px transparent",
                  borderRadius: "50% !important", 
                  background: currentVisualization === j ? 'rgba(236, 128, 139, 1)' : 'rgba(158, 210, 162, 0.8)',
                  fontSize: '14px',
                  color: "black",
                  transform: 'scale(0.75)',
                  '&:hover': {
                    color: "#f6f6f6",
                    background: 'rgba(0,0,0,0.7)',
                    borderColor: '#f6f6f6',
                  }
                }}
              >{j === "Centroid" ? "cen" : 
                j === "Flux" ? "flx": 
                j === "RMS" ? "rms" :
                j === "Rolloff 50" ? "rl5" :
                j === "Rolloff 85" ? "rl8" : 
                j === "XCrossings" ? "xcr" : 
                j === "Freq" ? "frq" :
                j === "Kurtosis" ? "kur" :
                j === "SFM" ? "sfm" :
                // i === "MFCC" ? "mfc" :
                'mfcc'   
                }</Button>)
            })
          }
        </Box>
        </Box>
        <CloseIcon onClick={closeAnalysisPopup} sx={{ pointerEvents: "all", position: "relative", display: "flex", flexDirection: "column", alignText: "right", zIndex: 120, justifyContent: "right" }} />
        
      </Box>

      <Box>
        <Box>
        
        </Box>

      </Box>
    </Box>
  );
};
