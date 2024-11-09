import { SelectChangeEvent } from "@mui/material";
import { Chuck } from "webchuck";

export interface Osc1ToChuck {
    name: string;
    string: string;
}
export interface AllFXPersistent {
    Osc1: Array<any>;
    Osc2: Array<any>;
    STK: Array<any>;
    Sampler: Array<any>;
    AudioIn: Array<any>;
}

export interface AllSoundSourcesObject {
    master: Array<any>;
    oscs: Array<any>;
    stks: Array<any>;
    samples: Array<any>;
    linesIn: Array<any>;
}

