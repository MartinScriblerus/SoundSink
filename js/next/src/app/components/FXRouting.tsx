import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import { Box, styled } from '@mui/system';
import * as d3 from "d3";
import { LineChartWrapper } from '@/utils/VizHelpers/LineChartWrapper';
import { ArcDiagram } from '@/utils/VizHelpers/ArcDiagram';
// import { data } from '@/utils/VizHelpers/arcDiagramMockData';
import { Heatmap } from '@/utils/VizHelpers/Heatmap';
import { heatmapData } from '../../utils/VizHelpers/heatmapData';
import HexBin from './HexbinGenerator';
import SelectInputSourceRadioButtons from './SelectInputSourceRadioButtons';
import ShowFXView from './ShowFXBtn';
import FXCheckboxLabels from './FXCheckboxes';
import { STKOption } from '@/utils/fixedOptionsDropdownData';

interface PedalboardNode {
    id: string;
    name: string;
    group: string;
}

interface PedalboardLink {
}

interface PedalboardNodesObj {
  Osc1: PedalboardNode[] | [],
  Osc2: PedalboardNode[] | [],
  STK: PedalboardNode[] | [],
  Sampler: PedalboardNode[] | [],
  AudioIn: PedalboardNode[] | []
}

interface PedalboardLinksObj {
  Osc1: PedalboardLink[] | [],
  Osc2: PedalboardLink[] | [],
  STK: PedalboardLink[] | [],
  Sampler: PedalboardLink[] | [],
  AudioIn: PedalboardLink[] | []
}

interface PedalboardData {
  nodes: [PedalboardNodesObj] | [];
  links: [PedalboardLinksObj] | [];
}

interface Props {
  fxData: any;
  width: number;
  height: number;
  fxChainNeedsUpdate: (msg: any) => void;
  handleShowFX: () => void;
  showFX: boolean;
  fxValsRef: any;
  handleFXGroupChange: (e:any) => void;
  updateCheckedFXList: (e:any) => void;
  fxGroupsArrayList: Array<any>;
  checkedFXList: Array<any>;
  fxFX: any;
  handleClickName: (e:string, op: string) => void;
  setClickFXChain: React.Dispatch<any>;
  clickFXChain: boolean;
  updateFXInputRadio: (value: any) =>  void;
  fxRadioValue: string;
  playUploadedFile: () => void;
  updateStkKnobs: (knobVals: any) => void;
  setStkValues: React.Dispatch<SetStateAction<any>>;
  stkValues: STKOption[] | [];
  updateCurrentFXScreen: () => void;
  currentScreen: string;
  lastFileUpload: string;
  updateFileUploads: (e: any) => void;
  babylonGame: any;
}

export default function FXRouting(props: Props) {
  const {
    fxData, 
    width, 
    height, 
    fxChainNeedsUpdate, 
    handleShowFX, 
    showFX,
    fxValsRef,
    handleFXGroupChange,
    updateCheckedFXList,
    fxGroupsArrayList,
    checkedFXList,
    fxFX,
    handleClickName,
    clickFXChain,
    setClickFXChain,
    updateFXInputRadio,
    fxRadioValue,
    updateStkKnobs,
    setStkValues,
    stkValues,
    updateCurrentFXScreen,
    currentScreen,
    playUploadedFile,
    lastFileUpload,
    updateFileUploads,
    babylonGame
  } = props;

  // const [visibleFXCols, setVisibleFXCols] = useState<number>(0);
  const [arcDiagramKey, setArcDiagramKey] = useState<string>(`${fxRadioValue}_arcKey`);
  // const [fxRadioValue, setFxRadioValue] = React.useState('Osc1');
  const data = useRef<PedalboardData | any>({
    nodes: {},
    links: {}
  });

  const nodesRef = useRef<any>({
    Osc1: [],
    Osc2: [],
    STK: [],
    Sampler: [],
    AudioIn: []
  });
  
  const linksRef = useRef<any>({
    Osc1: [],
    Osc2: [],
    STK: [],
    Sampler: [],
    AudioIn: []
  });

  const handleFXRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFXInputRadio((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    console.log("what is fxData in FXRouting??: ", fxData);
    fxData.length > 0 && Object.entries(fxData.filter((f:any) => f.visible === true && f)).map(([k, v]: Array<any>, idx: number) => {
      console.log("gosh: ", k, v, idx);
      // v.length > 0 && v.map((fx: any, idx: number) => {
        if (nodesRef.current[k].map((i: any) => i.id).indexOf(v.var) === -1) {
          
          console.log("what the hell ", v);

          if (k === fxRadioValue) {
            nodesRef.current[k].push({
              id: v.var,
              name: v.type,
              group: `${idx}`
            });
            linksRef.current[k].push({
              source: v.var || fxRadioValue,
              target: 'DAC Out',
              value: 1
            })
            if (clickFXChain) {
              fxChainNeedsUpdate(linksRef.current[fxRadioValue]);
            }
          }
          // if (clickFXChain) {
          //   fxChainNeedsUpdate(linksRef.current[fxRadioValue]);
          // }
        } else if (idx > 0) {
          console.log("???????*** ", linksRef.current[idx] && linksRef.current[idx - 1].source && Object.values(linksRef.current[idx]), linksRef.current[idx - 1]);
          // Object.values(linksRef.current[idx]) && linksRef.current[idx - 1].length > 0 && linksRef.current[idx - 1].source;
          console.log("LINKS REF WTF: ", linksRef.current);
          // Object.values(linksRef.current[idx]).target = linksRef.current[idx] && linksRef.current[idx - 1] 
          if (clickFXChain) {
            fxChainNeedsUpdate(linksRef.current);
          }
        }
      // });
    });
    data.current = Object({nodes: nodesRef.current, links: linksRef.current});
  }, [nodesRef, fxData, fxRadioValue]);

  const handleUpdateFXChain = (inputVal: any)=> {
    setArcDiagramKey(`${inputVal}_arcDiagramKey`);
  };

console.log("links ref is broken! ", linksRef.current);
  return (
    <Box sx={{
      background: "black", 
      // width: "100vw", 
      position: "absolute", 
      height: "100%",
      // zIndex: showFX ? 9999 : -1
    }}>
      <Box style={{position: 'absolute', top: '56px', zIndex: 1200}}>
        <ShowFXView handleShowFX={handleShowFX}/>
      </Box>
      {showFX && <Box
        key={`arcDiagramOuterWrapper_${Object.values(linksRef.current).map((l:any) => l.source + "_")}`}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          zIndex: 0,
          background: 'rgba(30,34,26,0.96)',
          position: 'absolute',
          left: '142px',
          top: '56px',
          bottom: '56px',
          width: `calc(100vw - ${2 * 96}px)`,    
          overflow: 'hidden',
          boxSizing: 'border-box',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      > 
        <Box sx={{
          display:'flex',
          flexDirection:'row',
          width: '100%', 
          height: '100%',
          color: 'rgba(147, 206, 214, 1)'
        }}>
          <SelectInputSourceRadioButtons 
            handleChange={handleFXRadioChange} 
            value={fxRadioValue}
            updateStkKnobs={updateStkKnobs}
            setStkValues={setStkValues}
            stkValues={stkValues}
            updateCurrentFXScreen={updateCurrentFXScreen}
            currentScreen={currentScreen}
            playUploadedFile={playUploadedFile}
            lastFileUpload={lastFileUpload}
            // updateFileUploads={updateFileUploads}
          />
          <Box 
            // key={`${fxRadioValue}_arcDiagramInnerWrapper`} 
            sx={{
              display: 'flex', 
              width: `${width}px`, 
              height:`${height}px`,
              position: "relative",
              maxHeight: "100%",
              overflow: "scroll",
              // marginTop: '48px', 
              flexDirection: 'column',
              // borderRight: '1px solid rgba(147, 206, 214, 1)',
              borderLeft: '1px solid rgba(147, 206, 214, 1)'
            }}
          > 
            <ArcDiagram 
              // key={arcDiagramKey} 
              width={width / 3 + 48} 
              height={height - 48} 
              data={data.current}
              fxRadioValue={fxRadioValue}
              handleClickName={handleClickName}
              updateCheckedFXList={updateCheckedFXList}
              handleUpdateFXChain={handleUpdateFXChain}

            />
          </Box>
        </Box>

          {/* <HexBin widthProp={width} heightProp={height} /> */}
          {
          // currentScreen.current === 'stk' && 
          showFX &&
          <FXCheckboxLabels 
              fxValsRef={fxFX} 
              handleFXGroupChange={handleFXGroupChange}
              updateCheckedFXList={updateCheckedFXList} 
              fxGroupsArrayList={fxGroupsArrayList} 
              checkedFXList={checkedFXList}
          />
      }
      </Box>}
    </Box>
  );
}

