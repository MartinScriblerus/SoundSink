import { Chuck } from 'webchuck';
import { Sources, EffectsSettings } from '@/types/audioTypes';
import WaveSurfer from 'wavesurfer.js';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import MoogGrandmotherEffects from '@/interfaces/audioInterfaces';
import moogGMPresets from '@/utils/moogGMPresets';
import { FXOption, STKOption } from '@/utils/fixedOptionsDropdownData';
import {
  delayADefault,
  delayDefault,
  delayLDefault,
  ellipticDefault,
  expDelayDefault,
  expEnvDefault,
  korg35Default,
  modulateDefault,
  powerADSRDefault,
  spectacleDefault,
  winFuncEnvDefault,
  wpDiodeDefault
} from '@/utils/FXHelpers/helperDefaults';

export const workerRef: { current: Worker | null } = { current: null };

export const chuckRef = { current: undefined as Chuck | undefined };
export const currNotes = { current: [0] as any };
export const currNotesHash = { current: {} as any };
export const universalSources = { current: undefined as Sources | undefined };
export const currentFX = { current: undefined as any };
export const filesToProcess = {current: [
  { filename: "DR-55Kick.wav", data: [] },
  { filename: "DR-55Snare.wav", data: []  },
  { filename: "DR-55Hat.wav", data: [] },
  { filename: "Conga.wav", data: [] }
] as any};

export const visibleFXKnobs = { current: undefined as any };
export const testArrBuffFile = { current: undefined as any };
export const currentScreen = { current: 'synth' };
export const doReturnToSynth = { current: false };
export const isInPatternEditMode = { current: false };
export const currentStkTypeVar = { current: '' };
export const currentEffectType = { current: '' };
export const masterPatternsRef = { current: {} as any };
export const parentDivRef = { current: null as any };
export const allOctaveMidiFreqs = { current: {} as any };
export const uploadedBlob = { current: undefined as any };
export const currentHeatmapXY = { current: undefined as any };
export const midiAccess = { current: undefined as WebMidi.MIDIAccess | undefined };
export const resetHeatmapCell = { current: undefined as boolean | undefined };
export const lastFileUploadMeydaData = { current: [] as any[] };
export const wavesurferRef = { current: null as WaveSurfer | null };

export const regionStart = { current: undefined as any };
export const regionEnd = { current: undefined as any };
export const totalDuration = { current: undefined as any };
export const clippedDuration = { current: undefined as any };

export const ffmpegRef = { current: new FFmpeg() };
export const messageRef = { current: null as HTMLParagraphElement | null };

export const moogGrandmotherEffects: any = { current: moogGMPresets as MoogGrandmotherEffects };

export const fxValsRef = { current: [] as FXOption[] };
export const checkedFXList = { current: [] as FXOption[] };

export const winFuncEnvFinalHelper = { current: winFuncEnvDefault as any  };
export const powerADSRFinalHelper = { current: powerADSRDefault as any  };
export const expEnvFinalHelper = { current: expEnvDefault as any  };
export const wpDiodeLadderFinalHelper = { current: wpDiodeDefault as any  };
export const wpKorg35FinalHelper = { current: korg35Default as any  };
export const modulateFinalHelper = { current: modulateDefault as any  };
export const delayFinalHelper = { current: delayDefault as any  };
export const delayAFinalHelper = { current: delayADefault as any  };
export const delayLFinalHelper = { current: delayLDefault as any  };
export const expDelayFinalHelper = { current: expDelayDefault as any  };
export const ellipticFinalHelper = { current: ellipticDefault as any  };
export const spectacleFinalHelper = { current: spectacleDefault as any  };

export const initialNodes = { current: undefined as any };
export const initialEdges = { current: undefined as any };
export const keysAndTuneDone = { current: undefined as any };

export const inputRef = { current: undefined as any };

export const stkKnobValsRef = { current: [] as STKOption[] };
export const activeSTKDeclarations = { current: '' as string };
export const activeSTKSettings = { current: '' as string };
export const activeSTKPlayOn = { current: '' as string };
export const activeSTKPlayOff = { current: '' as string };

export const NOTES_SET_REF = { current: undefined as any };
export const initialRun = { current: true as any };

export const isSubmitting = { current: false as any };
