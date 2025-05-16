import { SelectChangeEvent } from "@mui/material";
import { Chuck } from "webchuck";

export interface Osc1ToChuck {
    name: string;
    string: string;
}

/// THIS SHOULD BE CONVERTED TO SOMETHING IN AUDIOTYPES PATTERN
export interface AllSoundSourcesObject {
    master: Array<any>;
    osc1: Array<any>;
    osc2: Array<any>;
    stks: Array<any>;
    samples: Array<any>;
    linesIn: Array<any>;
}

export interface FlowEdge {
    id: string;
    source: string,
    target: string,
}

export interface FlowNode {
    id: string; 
    data: { 
        label: string; 
    }; 
    position: { 
        x: number; 
        y: number; 
    }; 
    type: string; 
    style: { 
        height: number; 
        width: number; 
        backgroundColor: string; 
    };
    ports: { 
        input: Array<string>; 
        output: Array<string>; 
    };
}

export type Chord = string[];
export type ChordGroup = Chord[][] | Chord[];

export interface Progs {
  [degree: string]: string[];
}

export interface ProgsNumsEntry {
  [chordType: string]: ChordGroup;
}

export interface ProgsNums {
  [degree: string]: ProgsNumsEntry;
}

export interface QueryResponse {
  progs: Progs;
  progs_nums: ProgsNums;
}