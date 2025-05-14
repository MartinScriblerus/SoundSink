export interface AudioDestinationNode {
    state: string;
    close: () => void;
    createMediaStreamSource: (e: any) => MediaStreamAudioSourceNode;
    createMediaStreamDestination: () => any;
    resume: () => void;
    suspend: () => void;
    connect: (x: any, y: any, z: any) => void;
}

export interface MediaStream {
    id: string;
    active: boolean;
}

export interface AudioNode {
    destinationNode: AudioNode,
    output?: number | undefined,
    input?: number | undefined;
    destinationParam?: AudioParam;
}

export interface MediaStreamAudioSourceNode extends AudioNode {
    createMediaStreamSource: (e: any) => MediaStreamAudioSourceNode | void;
}

export interface MediaStreamAudioDestinationNode extends AudioNode {
    stream: MediaStream;
}

export interface BPMModule {
    bpm: number;
    setBpm: React.Dispatch<React.SetStateAction<number>>;
    beatsNumerator: number;
    beatsDenominator: number;
    
    // handleChangeBeatsNumerator: (beatspm: number) => void; 
    // handleChangeBeatsDenominator: (mpb: number) => void;
    setChuckUpdateNeeded: React.Dispatch<React.SetStateAction<boolean>>;
    setBeatsNumerator: React.Dispatch<React.SetStateAction<number>>;
    setBeatsDenominator: React.Dispatch<React.SetStateAction<number>>;
    setNumeratorSignature: React.Dispatch<React.SetStateAction<number>>;
    setDenominatorSignature: React.Dispatch<React.SetStateAction<number>>;
};


export interface MoogGrandmotherEffectsItem {
    name?: string;
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    screenInterface?: string;
    fxType: string;
}

export default interface MoogGrandmotherEffects {
    lfoGain: MoogGrandmotherEffectsItem;
    lfoPitch: MoogGrandmotherEffectsItem;
    lfoVoice: MoogGrandmotherEffectsItem;
    filterEnv: MoogGrandmotherEffectsItem;
    syncMode: MoogGrandmotherEffectsItem;
    offset: MoogGrandmotherEffectsItem;
    cutoff: MoogGrandmotherEffectsItem;
    rez: MoogGrandmotherEffectsItem;
    env: MoogGrandmotherEffectsItem;
    oscType1: MoogGrandmotherEffectsItem;
    oscType2: MoogGrandmotherEffectsItem;
    detune: MoogGrandmotherEffectsItem;
    oscOffset: MoogGrandmotherEffectsItem;
    adsrAttack: MoogGrandmotherEffectsItem;
    adsrDecay: MoogGrandmotherEffectsItem;
    adsrSustain: MoogGrandmotherEffectsItem;
    adsrRelease: MoogGrandmotherEffectsItem;
    limiterAttack: MoogGrandmotherEffectsItem;
    limiterThreshold: MoogGrandmotherEffectsItem;
    lfoFreq: MoogGrandmotherEffectsItem;
    highPassFreq: MoogGrandmotherEffectsItem;
    pitchMod: MoogGrandmotherEffectsItem;
    cutoffMod: MoogGrandmotherEffectsItem;
    noise: MoogGrandmotherEffectsItem;
    reverb: MoogGrandmotherEffectsItem;
}

export interface FixedSimpleLabel {
    label: string;
    value: number;
    effects: Array<{effectLabel: string, effectVar: string}>;
}

export interface FXGroupsArray {
    fxGroupsArrayList: Array<FixedSimpleLabel>;
    handleFXGroupChange: (e: any, f: any) => void;
    updateCheckedFXList: any;
    fxValsRef: any;
    checkedFXList: Array<any>;
    handleCheckedFXToShow: (x:any) => void;
    checkedEffectsListHook: any;
    setCheckedEffectsListHook: React.Dispatch<React.SetStateAction<any>>;
}