import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Box, styled, useTheme } from '@mui/system';
import FXCheckboxLabels from './FXCheckboxes';
import { STKOption } from '@/utils/fixedOptionsDropdownData';
import "../../app/page.module.css"
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

interface FXRoutingProps {
  fxData: any;
  width: number;
  height: number;
  fxChainNeedsUpdate: (msg: any) => void;
  fxValsRef: any;
  handleFXGroupChange: (e: any) => void;
  updateCheckedFXList: (e: any) => void;
  fxGroupsArrayList: Array<any>;
  checkedFXList: Array<any>;
  fxFX: any;
  handleClickName: (e: string, op: string) => void;
  setClickFXChain: React.Dispatch<any>;
  clickFXChain: boolean;
  updateFXInputRadio: (value: any) => void;
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
  handleCheckedFXToShow: (x:any) => void;
  checkedEffectsListHook: any;
}

export default function FXRouting(props: FXRoutingProps) {
  const {
    fxData,
    fxChainNeedsUpdate,
    handleFXGroupChange,
    updateCheckedFXList,
    fxGroupsArrayList,
    checkedFXList,
    fxFX,
    clickFXChain,
    fxRadioValue,
    handleCheckedFXToShow,
    checkedEffectsListHook,
  } = props;

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

  const theme = useTheme();

  useEffect(() => {
    fxData.length > 0 && Object.entries(fxData.filter((f: any) => f.visible === true && f)).map(([k, v]: Array<any>, idx: number) => {
      if (nodesRef.current[k].map((i: any) => i.id).indexOf(v.var) === -1) {
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
      } else if (idx > 0) {
        console.log("LINKS REF: ", linksRef.current);
        if (clickFXChain) {
          fxChainNeedsUpdate(linksRef.current);
        }
      }
    });
    data.current = Object({ nodes: nodesRef.current, links: linksRef.current });
  }, [nodesRef, fxData, fxRadioValue]);

  return (
    <Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        maxHeight: "calc(100vh - 240px)",
        paddingBottom: '60px',
        overflowY: "auto",
      }}>             
          <FXCheckboxLabels
            fxValsRef={fxFX}
            handleFXGroupChange={handleFXGroupChange}
            updateCheckedFXList={updateCheckedFXList}
            fxGroupsArrayList={fxGroupsArrayList}
            checkedFXList={checkedFXList}
            handleCheckedFXToShow={handleCheckedFXToShow} 
            checkedEffectsListHook={checkedEffectsListHook}
          />
        <Box
          key={`arcDiagramOuterWrapper_${Object.values(linksRef.current).map((l: any) => l.source + "_")}`}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            zIndex: 0,
            background: theme.palette.black,
            overflow: 'hidden',
            boxSizing: 'border-box',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            color: 'rgba(147, 206, 214, 1)'
          }}>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

