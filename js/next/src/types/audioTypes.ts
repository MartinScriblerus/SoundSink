import { SelectChangeEvent } from "@mui/material";
import { Chuck } from "webchuck";

export type KeyboardProps = {
    submitMingus: () => void;
    audioKey: string;
    octave: string;
    audioScale: string;
    audioChord: string;
    handleChangeScale: (event: SelectChangeEvent) => void;
    handleChangeChord: (event: SelectChangeEvent) => void;
    programIsOn: boolean;
    selectRef: any;
    tune: any;
    currentMicroTonalScale: any;
    chuckHook: Chuck | undefined;
}

export type RampEffects = {
    effectName: string;
    value: number[];
    times: number[];
} 

export type AutomationParams = {
    fadeInVolume: number;
    fadeOutVolume: number;
    fadeInType: string[];
    fadeOutType: string[];
    rampEffects: RampEffects[];
}

export type PatternCell = {
    notes: string[] | number[];
    duration: number;
    volume: number;
    effects: string[];
    automationParams: AutomationParams[];
    subpattern: PatternCell[];
}

export type Pattern = {
    time: {
        bpm: number;
        numerator: number;
        denominator: number;
        sequencerRate: number;
        listenToMidiClock: boolean;
    },
    patternArr: PatternCell[]; 
    patternArrName: string;
    scaleIntervalName?: string;
    microtoneIntervalName?: string; 
    intervalArr?: string[];
    microtoneArr?: string[]; 
}

export type PresetNameVal = {
    name: string; 
    value: any;
}

export type STKSettings = {
    VarName: string;
    Type: string;
    On: boolean;
    Visible: boolean;
    stkFXPresets: PresetNameVal[]; 
}

export type STKInstruments = {
    Clarinet: STKSettings;
    Karplus: STKSettings;
    Sitar: STKSettings;
    FrenchHorn: STKSettings;
    Moog: STKSettings;
    Rhodey: STKSettings;
    Saxofony: STKSettings;
    Mandolin: STKSettings;
    BandedWaveGuide: STKSettings;
    Bottle: STKSettings;
    Blowhole: STKSettings;
    Bowed: STKSettings;
    Brass: STKSettings;
    Flute: STKSettings;
    ModalBar: STKSettings;
    Shakers: STKSettings;
    VoiceForm: STKSettings;
    B3: STKSettings;
    ElectricGuitar: STKSettings;
    HonkeyTonk: STKSettings;
    FMVoices: STKSettings;
    ChrystalChoir: STKSettings;
    PercFlute: STKSettings;
    TubeBell: STKSettings;
    Wurley: STKSettings;
}

export type Sources = {
    osc1: {
        masterVolume: number;
        detune: number;
        effects: Effects;
        pattern: Pattern;
        arpeggiateOn: boolean;
    };
    osc2: string;
    stk1: string;
    sampler: string;
    audioIn: string;
}

export type SndBufObj = {
    src: string;
}

export type LiSaObj = {
    src: string;
}

export type EffectsSettings = {
    VarName: string;
    On: boolean;
    Declaration: string;
    presets: PresetNameVal[]
    Type: string;
    Visible: boolean;
    Code?: string;
    EnvSetting?: number | string;
    ConnectionIn?: string;
    ConnectionOut?: string;
}

export type Effects = {
    WinEnv: EffectsSettings;
    PowerADSR: EffectsSettings;
    ExpEnv: EffectsSettings;
    WPDiodeLadder: EffectsSettings;
    WPKorg35: EffectsSettings;
    Modulate: EffectsSettings;
    Delay: EffectsSettings;
    DelayA: EffectsSettings;
    DelayL: EffectsSettings;
    ExpDelay: EffectsSettings;
    Elliptic: EffectsSettings;
    Spectacle: EffectsSettings;

    Gain: EffectsSettings;
    Bitcrusher: EffectsSettings;
    FoldbackSaturation: EffectsSettings;
    Echo: EffectsSettings;
    Chorus: EffectsSettings;
    PitShift: EffectsSettings;
    AmbPan3: EffectsSettings;
    JCRev: EffectsSettings;
    NRev: EffectsSettings;
    PRCRev: EffectsSettings;
    GVerb: EffectsSettings;
    ASDR: EffectsSettings;
    PowerASDR: EffectsSettings;
    KasFilter: EffectsSettings;
    Multicomb: EffectsSettings;
    PitchTracker: EffectsSettings;
    Sigmund: EffectsSettings;
    SndBuf: SndBufObj;
    LiSa: LiSaObj;
}

export type TimeDomainNode = {
    time: number;
    value: number;
}

export type ChaiFeatures = {
    RMS: TimeDomainNode;
    ZCR: TimeDomainNode;
    Energy: TimeDomainNode;
    Chroma: number[];
    MFCC: number[];
    AmplitudeSpectrum: number;
    PowerSpectrum: number;
    SpectralCentroid: number;
    SpectralFlatness: number;
    SpectralFlux: number;
    SpectralScope: number;
    SpectralRollOff: number;
    SpectralSpread: number;
    SpectralSkewness: number;
    SpectralCrest: number;
}