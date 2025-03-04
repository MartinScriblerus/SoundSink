// import React, {useEffect, useState} from 'react';
// import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

// import { Box, useTheme } from '@mui/material';
// import { Inter } from 'next/font/google'

// import { LineChartWrapper } from '@/utils/VizHelpers/LineChartWrapper';


// // If loading a variable font, you don't need to specify the font weight
// const inter = Inter({ subsets: ['latin'] })
 
// interface ControlProps {

//     handleChangeBeatsNumerator: (npmBpm: number) => void; 
//     showFX: boolean;
//     // filesToProcess: string[];
//     programIsOn: boolean;
//     handleOscRateUpdate: (val: any) => void;
//     handleStkRateUpdate: (val: any) => void;
//     handleSamplerRateUpdate: (val: any) => void;
//     handleAudioInRateUpdate: (val: any) => void;
//     currentBeatSynthCount: number;
//     currentNumerCount: number;
//     currentNoteVals: any;
//     // sortFileItemUp: (e: Event) => void;
//     // sortFileItemDown: (e: Event) => void;
//     selectFileForAssignment: (e: Event) => void;
//     numeratorSignature: number;
//     denominatorSignature: number;
//     editPattern: (x:number,y:number,group: number) => void;
//     masterPatternsHashHook: any;
//     masterPatternsHashHookUpdated: boolean;
//     adjustToFullScreenKey: (val: boolean) => void;
//     keysFullscreen: boolean;
//     inPatternEditMode:(state: boolean) => void;
//     handleChangeCellSubdivisions: (num: number, x: number, y: number) => void;
//     cellSubdivisions: number;
//     resetCellSubdivisionsCounter: (x: number, y: number) => void;
//     hideCircularArpBtns: (boolVal: boolean) => void;
//     handleClickUploadedFiles: (x:any) => void;
//     analysisObject: any;
//     timeNow: number;
//     closeAnalysisPopup: () => void;
//     analysisSourceRadioValue: string;
//     filesToProcess: File[];
//     handleLegendClicked: (label:any) => void;
//     inFileAnalysisMode: boolean;
//     handleFileAnalysisMode:() => void;
//     lastFileUploadMeydaData: any;
//     meydaData: any;
//     meydaFeatures: any;
//     meydaParam: string;
//     meydaNeedsUpdate: boolean;
//     handleSwitchToggle: () => void; 
//     isAudioView: boolean;
// }



// export default function ControlPopup(props: ControlProps) {
//   const {
//     handleChangeBeatsNumerator,
//     showFX,
//     filesToProcess,
//     numeratorSignature,
//     adjustToFullScreenKey,
//     keysFullscreen,
//     hideCircularArpBtns,
//     analysisObject,
//     timeNow,
//     closeAnalysisPopup,
//     analysisSourceRadioValue,
//     inFileAnalysisMode,
//     lastFileUploadMeydaData,
//     handleLegendClicked,
//     meydaData,
//     meydaParam,
//     meydaFeatures,
//     handleFileAnalysisMode,
//     meydaNeedsUpdate,
//     isAudioView
//   } = props;
//   const [anchor, setAnchor] = useState<null | HTMLElement>(null);

//   const theme = useTheme();

//   // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//   //   if (keysFullscreen) {
//   //     adjustToFullScreenKey(false);
//   //   } else {
//   //     const target: any = event.target;
//   //     if (target && target.innerText && target.innerText.toLowerCase() !== "pattern") {
//   //       adjustToFullScreenKey(true);
//   //     }
//   //   }
//   //   setAnchor(anchor ? null : event.currentTarget);
//   // };

//   useEffect(() => {
//     if (keysFullscreen) {
//       adjustToFullScreenKey(false);
//     }
//     if (showFX) {
//       setAnchor(null);
//     }
//   }, [showFX]);

//   const open = Boolean(anchor);
//   const id = open ? 'simple-popup' : undefined;

//   useEffect(()=>{
//     console.log("Num Sig Changed ", numeratorSignature);
//     handleChangeBeatsNumerator(numeratorSignature)
//   }, [numeratorSignature]);

//   useEffect(() => {
//     if (open) {
//       hideCircularArpBtns(true);
//     } else {
//       hideCircularArpBtns(false);
//     }
//   }, [open]);
  
//   // const updateCellColor = (msg: any) => {
//   //   setUpdateCellColorBool(msg);
//   // }
//   return (
//     <Box 
//       key={numeratorSignature} 
//       sx={{
//         height: '100%', 
//         width: '100%',
//       }}
//       >
//       <BasePopup 
//         style={{
//           zIndex: 40, 
//           display: "flex", 
//           transform: 'translate(0px,0px)', 
//           left: '142px',
//           height: '100vh',      
//         }} 
//         id={id} 
//         open={open} 
//         anchor={anchor}
//       >
//         <Box sx={{
//             zIndex:40, 
//             textAlign: 'center',
//             width: '100%',
//             height: '100%',
//             justifyContent: 'center',
//           }}
//         >
//           {!isAudioView ?
//           <></>
//         :
//           <Box 
//             sx={{ 
//                 left: "140px",
//                 width: "100%",
//                 pointerEvents: 'none',
//                 zIndex: '99',
//                 height: 'calc(100vh - 13rem)'
//             }}
//             className="popupAnalysisBox"
//           >
//             {/* <LineChartWrapper
//                 analysisObject={analysisObject}
//                 timeNow={timeNow}
//                 closeAnalysisPopup={closeAnalysisPopup}
//                 analysisSourceRadioValue={analysisSourceRadioValue.toLowerCase()}
//                 filesToProcess={filesToProcess}
//                 handleLegendClicked={handleLegendClicked}
//                 inFileAnalysisMode={inFileAnalysisMode}
//                 handleFileAnalysisMode={handleFileAnalysisMode}
//                 meydaData={lastFileUploadMeydaData.current}
//                 meydaFeatures={meydaFeatures}
//                 meydaParam={meydaParam}
//                 meydaNeedsUpdate={meydaNeedsUpdate}
//             /> */}
//           </Box>}
//         </Box>
//       </BasePopup>
//     </Box>
//   );
// }
