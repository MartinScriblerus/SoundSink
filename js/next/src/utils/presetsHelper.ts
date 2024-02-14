import bandedWGPresets, {stkVariableBandedWg, stkIdentifierBandedWg} from '@/utils/STKPresets/bandedWGPresets';
import beeThreePresets, {stkVariableBeeThree, stkIdentifierBeeThree} from '@/utils/STKPresets/beeThreePresets';
import blowBotlPresets, {stkVariableBlowBotl, stkIdentifierBlowBotl} from '@/utils/STKPresets/blowBottlePresets';
import blowHolePresets, {stkVariableBlowHole, stkIdentifierBlowHole} from '@/utils/STKPresets/blowHolePresets';
import bowedPresets, {stkVariableBowed, stkIdentifierBowed} from '@/utils/STKPresets/bowedPresets';
import brassPresets, {stkVariableBrass, stkIdentifierBrass} from '@/utils/STKPresets/brassPresets';
import chorusPresets, {
    stkVariableChorus, 
    stkIdentifierChorus, 
    stkVariableModulate, 
    stkIdentifierModulate, 
    modulatePresets, 
    pitShiftPresets, 
    stkVariablePitShift, 
    stkIdentifierPitShift} from '@/utils/FXPresets/chorusModPitchPresets';
import jcRevPresets, {
    gainPresets,
    nRevPresets,
    pcRevPresets,
    stkIdentifierGain, 
    stkIdentifierJCRev, 
    stkIdentifierNRev, 
    stkIdentifierPCRev,
    stkIdentifierGVerb, 
    stkVariableGVerb, 
    stkVariableGain, 
    stkVariableJCRev, 
    stkVariableNRev, 
    stkVariablePCRev,
    gVerbPresets} from './FXPresets/reverbGainPresets';
import clarinetPresets, {stkVariableClarinet, stkIdentifierClarinet} from '@/utils/STKPresets/clarinetPresets';
import delayAPresets, {stkVariableDelayA, stkIdentifierDelayA} from '@/utils/STKPresets/delayAPreset';
import delayLPresets, {stkVariableDelayL, stkIdentifierDelayL} from '@/utils/STKPresets/delayLPresets';
import delayPresets, {stkVariableDelay, stkIdentifierDelay} from '@/utils/STKPresets/delayPresets';
import echoPresets, {stkVariableEcho, stkIdentifierEcho} from '@/utils/FXPresets/echoPresets';
import flutePresets, {stkVariableFlute, stkIdentifierFlute} from '@/utils/STKPresets/flutePresets';

import fmVoicesPresets, {stkVariableFMVoices, stkIdentifierFMVoices} from '@/utils/STKPresets/fmVoices';
import frencHrnPresets, {stkVariableFrencHrn, stkIdentifierFrencHrn} from '@/utils/STKPresets/frenchHornPresets';
import krstlChrPresets, {stkVariableKrstlChr, stkIdentifierKrstlChr} from '@/utils/STKPresets/krstlChrPresets';
import mandolinPresets, {stkVariableMandolin, stkIdentifierMandolin} from '@/utils/STKPresets/mandolinPresets';
import modalBarPresets, {stkVariableModalBar, stkIdentifierModalBar} from '@/utils/STKPresets/modalBarPresets';
// import modulatePresets, {stkVariableModulate, stkIdentifierModulate} from '@/utils/FXPresets/modulatePresets';
import moogPresets, {stkVariableMoog, stkIdentifierMoog} from '@/utils/STKPresets/moogPresets';
import percFlutPresets, {stkVariablePercFlut, stkIdentifierPercFlut} from '@/utils/STKPresets/percFlutPresets';
// import pitShiftPresets, {stkVariablePitShift, stkIdentifierPitShift} from '@/utils/FXPresets/pitchShiftPresets';
import rhodeyPresets, {stkVariableRhodey, stkIdentifierRhodey} from '@/utils/STKPresets/rhodesPresets';
import saxofonyPresets, {stkIdentifierSaxofony, stkVariableSaxofony} from '@/utils/STKPresets/saxPresets';
import sitarPresets, {stkVariableSitar, stkIdentifierSitar} from '@/utils/STKPresets/sitarPresets';
import stifKarpPresets, {stkVariableStifKarp, stkIdentifierStifKarp} from '@/utils/STKPresets/stifKarpPresets';
import shakersPresets, {stkVariableShakers, stkIdentifierShakers} from '@/utils/STKPresets/shakersPresets';
import tubeBellPresets, {stkVariableTubeBell, stkIdentifierTubeBell} from '@/utils/STKPresets/tubeBell';
import voicFormPresets, {stkVariableVoiceForm, stkIdentifierVoiceForm} from '@/utils/STKPresets/voicFormPresets';
import wurleyPresets, {stkVariableWurley, stkIdentifierWurley} from '@/utils/STKPresets/wurleyPresets';
import ambPan3Presets, { stkIdentifierAmbPan3, stkVariableAmbPan3 } from './FXPresets/ambPanPresets';
import bitcrusherPresets, { stkIdentifierBitcrusher, stkVariableBitcrusher } from './FXPresets/bitcrusherPresets';
import ellipticPresets, { stkIdentifierElliptic, stkVariableElliptic } from './FXPresets/ellipticPresets';
import expDelayPresets, { stkIdentifierExpDelay, stkVariableExpDelay } from './FXPresets/expDelayPresets';
import expEnvPresets, { stkIdentifierExpEnv, stkVariableExpEnv } from './FXPresets/expEnvPresets';
import foldbackSaturatorPresets, { stkIdentifierFoldbackSaturator, stkVariableFoldbackSaturator } from './FXPresets/foldbackSaturatorPresets';
import kasFilterPresets, { stkIdentifierKasFilter, stkVariableKasFilter } from './FXPresets/kasFilterPresets';
import multicombPresets, { stkIdentifierMulticomb, stkVariableMulticomb } from './FXPresets/MulticombPresets';
import pitchTrackPresets, { stkIdentifierPitchTrack, stkVariablePitchTrack } from './FXPresets/pitchTrackPresets';
import powerADSRPresets, { stkIdentifierPowerADSR, stkVariablePowerADSR } from './FXPresets/powerADSR';
import sigmundPresets, { stkIdentifierSigmund, stkVariableSigmund } from './FXPresets/sigmundPresets';
import spectaclePresets, { stkIdentifierSpectacle, stkVariableSpectacle } from './FXPresets/spectaclePresets';
import winFuncEnvPresets, { stkIdentifierWinFuncEnv, stkVariableWinFuncEnv } from './FXPresets/winFuncEnv';
import wpDiodeLadderPresets, { stkIdentifierWPDiodeLadder, stkVariableWPDiodeLadder } from './FXPresets/wpDiodeLadder';
import wpKorg35Presets, { stkIdentifierWPKorg35, stkVariableWPKorg35 } from './FXPresets/WPKorg35';
import adsrPresets, { stkIdentifierADSR, stkVariableADSR } from './FXPresets/adsrPresets';



export const getSTK1Preset = (stkVal: string) => {
    let theStk1Fx;
    if (stkVal === 'saxofony') {
        theStk1Fx = {
            presets: saxofonyPresets,
            type: stkIdentifierSaxofony,
            var: stkVariableSaxofony
        };
    } else if (stkVal === 'clarinet') {
        theStk1Fx = {
            presets: clarinetPresets,
            type: stkIdentifierClarinet,
            var: stkVariableClarinet
        };
    } else if (stkVal === 'stifkrp') {
        theStk1Fx = {
            presets: stifKarpPresets,
            type: stkIdentifierStifKarp,
            var: stkVariableStifKarp
        };
    } else if (stkVal === 'sitar') {
        theStk1Fx = {
            presets: sitarPresets,
            type: stkIdentifierSitar,
            var: stkVariableSitar
        };
    } else if (stkVal === 'moog') {
        theStk1Fx = {
            presets: moogPresets,
            type: stkIdentifierMoog,
            var: stkVariableMoog
        };
    } else if (stkVal === 'frenchhorn') {
        theStk1Fx = {
            presets: frencHrnPresets,
            type: stkIdentifierFrencHrn,
            var: stkVariableFrencHrn
        };
    } else if (stkVal === 'rhodey') {
        theStk1Fx = {
            presets: rhodeyPresets,
            type: stkIdentifierRhodey,
            var: stkVariableRhodey
        };
    } else if (stkVal === 'mandolin') {
        theStk1Fx = {
            presets: mandolinPresets,
            type: stkIdentifierMandolin,
            var: stkVariableMandolin
        };
    } else if (stkVal === 'bandedWg') {
        theStk1Fx = {
            presets: bandedWGPresets,
            type: stkIdentifierBandedWg,
            var: stkVariableBandedWg
        };
    } else if (stkVal === 'blowbotl') {
        theStk1Fx = {
            presets: blowBotlPresets,
            type: stkIdentifierBlowBotl,
            var: stkVariableBlowBotl
        };
    } else if (stkVal === 'blowhole') {
        theStk1Fx = {
            presets: blowHolePresets,
            type: stkIdentifierBlowHole,
            var: stkVariableBlowHole
        };
    } else if (stkVal === 'bowed') {
        theStk1Fx = {
            presets: bowedPresets,
            type: stkIdentifierBowed,
            var: stkVariableBowed
        };
    } else if (stkVal === 'brass') {
        theStk1Fx = {
            presets: brassPresets,
            type: stkIdentifierBrass,
            var: stkVariableBrass
        };
    } else if (stkVal === 'flute') {
        theStk1Fx = {
            presets: flutePresets,
            type: stkIdentifierFlute,
            var: stkVariableFlute
        };
    } else if (stkVal === 'modalBar') {
        theStk1Fx = {
            presets: modalBarPresets,
            type: stkIdentifierModalBar,
            var: stkVariableModalBar
        };
    } else if (stkVal === 'shakers') {
        theStk1Fx = {
            presets: shakersPresets,
            type: stkIdentifierShakers,
            var: stkVariableShakers
        };
    } else if (stkVal === 'voiceForm') {
        theStk1Fx = {
            presets: voicFormPresets,
            type: stkIdentifierVoiceForm,
            var: stkVariableVoiceForm
        };
    } else if (stkVal === 'beeThree') {
        theStk1Fx = {
            presets: beeThreePresets,
            type: stkIdentifierBeeThree,
            var: stkVariableBeeThree
        };
    } else if (stkVal === 'fmVoices') {
        theStk1Fx = {
            presets: fmVoicesPresets,
            type: stkIdentifierFMVoices,
            var: stkVariableFMVoices
        };
    } else if (stkVal === 'krstlChr') {
        theStk1Fx = {
            presets: krstlChrPresets,
            type: stkIdentifierKrstlChr,
            var: stkVariableKrstlChr
        };
    } else if (stkVal === 'percFlute') {
        theStk1Fx = {
            presets: percFlutPresets,
            type: stkIdentifierPercFlut,
            var: stkVariablePercFlut
        };
    } else if (stkVal === 'tubeBell') {
        theStk1Fx = {
            presets: tubeBellPresets,
            type: stkIdentifierTubeBell,
            var: stkVariableTubeBell
        };
    } else if (stkVal === 'wurley') {
        theStk1Fx = {
            presets: wurleyPresets,
            type: stkIdentifierWurley,
            var: stkVariableWurley
        };
    }
    // else if (stkVal === 'delay') {
    //     theStk1Fx = {
    //         presets: delayPresets,
    //         type: stkIdentifierDelay,
    //         var: stkVariableDelay
    //     };
    // } else if (stkVal === 'delayA') {
    //     theStk1Fx = {
    //         presets: delayAPresets,
    //         type: stkIdentifierDelayA,
    //         var: stkVariableDelayA
    //     };
    // } else if (stkVal === 'delayL') {
    //     theStk1Fx = {
    //         presets: delayLPresets,
    //         type: stkIdentifierDelayL,
    //         var: stkVariableDelayL
    //     };
    // } else if (stkVal === 'echo') {
    //     theStk1Fx = {
    //         presets: echoPresets,
    //         type: stkIdentifierEcho,
    //         var: stkVariableEcho
    //     };
    // } else if (stkVal === 'modulate') {
    //     theStk1Fx = {
    //         presets: modulatePresets,
    //         type: stkIdentifierModulate,
    //         var: stkVariableModulate
    //     };
    // } else if (stkVal === 'pitShift') {
    //     theStk1Fx = {
    //         presets: pitShiftPresets,
    //         type: stkIdentifierPitShift,
    //         var: stkVariablePitShift
    //     };
    // } 
    else {
        console.log("******** WHY IN THE ELSE??? *********")
        theStk1Fx = {
            presets: frencHrnPresets,
            type: stkIdentifierFrencHrn,
            var: stkVariableFrencHrn
        };
    }
    return theStk1Fx;
}

export const getSTK2Preset = (stkVal: string) => {
    let theStk2Fx;
    if (stkVal === 'saxofony') {
        theStk2Fx = {
            presets: saxofonyPresets,
            type: stkIdentifierSaxofony,
            var: stkVariableSaxofony
        };
    } else if (stkVal === 'clarinet') {
        theStk2Fx = {
            presets: clarinetPresets,
            type: stkIdentifierClarinet,
            var: stkVariableClarinet
        };
    } else if (stkVal === 'stifkrp') {
        theStk2Fx = {
            presets: stifKarpPresets,
            type: stkIdentifierStifKarp,
            var: stkVariableStifKarp
        };
    } else if (stkVal === 'sitar') {
        theStk2Fx = {
            presets: sitarPresets,
            type: stkIdentifierSitar,
            var: stkVariableSitar
        };
    } else if (stkVal === 'moog') {
        theStk2Fx = {
            presets: moogPresets,
            type: stkIdentifierMoog,
            var: stkVariableMoog
        };
    } else if (stkVal === 'frenchhorn') {
        theStk2Fx = {
            presets: frencHrnPresets,
            type: stkIdentifierFrencHrn,
            var: stkVariableFrencHrn
        };
    } else if (stkVal === 'rhodey') {
        theStk2Fx = {
            presets: rhodeyPresets,
            type: stkIdentifierRhodey,
            var: stkVariableRhodey
        };
    } else if (stkVal === 'mandolin') {
        theStk2Fx = {
            presets: mandolinPresets,
            type: stkIdentifierMandolin,
            var: stkVariableMandolin
        };
    } else if (stkVal === 'bandedWg') {
        theStk2Fx = {
            presets: bandedWGPresets,
            type: stkIdentifierBandedWg,
            var: stkVariableBandedWg
        };
    } else if (stkVal === 'blowbotl') {
        theStk2Fx = {
            presets: blowBotlPresets,
            type: stkIdentifierBlowBotl,
            var: stkVariableBlowBotl
        };
    } else if (stkVal === 'blowhole') {
        theStk2Fx = {
            presets: blowHolePresets,
            type: stkIdentifierBlowHole,
            var: stkVariableBlowHole
        };
    } else if (stkVal === 'bowed') {
        theStk2Fx = {
            presets: bowedPresets,
            type: stkIdentifierBowed,
            var: stkVariableBowed
        };
    } else if (stkVal === 'brass') {
        theStk2Fx = {
            presets: brassPresets,
            type: stkIdentifierBrass,
            var: stkVariableBrass
        };
    } else if (stkVal === 'flute') {
        theStk2Fx = {
            presets: flutePresets,
            type: stkIdentifierFlute,
            var: stkVariableFlute
        };
    } else if (stkVal === 'modalBar') {
        theStk2Fx = {
            presets: modalBarPresets,
            type: stkIdentifierModalBar,
            var: stkVariableModalBar
        };
    } else if (stkVal === 'shakers') {
        theStk2Fx = {
            presets: shakersPresets,
            type: stkIdentifierShakers,
            var: stkVariableShakers
        };
    } else if (stkVal === 'voiceForm') {
        theStk2Fx = {
            presets: voicFormPresets,
            type: stkIdentifierVoiceForm,
            var: stkVariableVoiceForm
        };
    } else if (stkVal === 'beeThree') {
        theStk2Fx = {
            presets: beeThreePresets,
            type: stkIdentifierBeeThree,
            var: stkVariableBeeThree
        };
    } else if (stkVal === 'krstlChr') {
        theStk2Fx = {
            presets: krstlChrPresets,
            type: stkIdentifierKrstlChr,
            var: stkVariableKrstlChr
        };
    } else if (stkVal === 'percFlute') {
        theStk2Fx = {
            presets: percFlutPresets,
            type: stkIdentifierPercFlut,
            var: stkVariablePercFlut
        };
    } else if (stkVal === 'tubeBell') {
        theStk2Fx = {
            presets: tubeBellPresets,
            type: stkIdentifierTubeBell,
            var: stkVariableTubeBell
        };
    } else if (stkVal === 'wurley') {
        theStk2Fx = {
            presets: wurleyPresets,
            type: stkIdentifierWurley,
            var: stkVariableWurley
        };
    } else {
        console.log("******** WHY IN THE ELSE??? *********")
        theStk2Fx = {
            presets: frencHrnPresets,
            type: stkIdentifierFrencHrn,
            var: stkVariableFrencHrn
        };
    }
    return theStk2Fx;
}

export const getFX1Preset = (fxVal: string) => {
    const theFX1Fx = [];
    if (fxVal === 'modulate') {
        theFX1Fx.push({
            presets: modulatePresets,
            type: stkIdentifierModulate,
            var: stkVariableModulate,
        });
    } else if (fxVal === 'pitShift') {
        theFX1Fx.push({
            presets: pitShiftPresets,
            type: stkIdentifierPitShift,
            var: stkVariablePitShift,
        });
    } else if (fxVal === 'chor') {
        theFX1Fx.push({
            presets: chorusPresets,
            type: stkIdentifierChorus,
            var: stkVariableChorus,
        });
    } else if (fxVal === 'g') {
        theFX1Fx.push({
            presets: gainPresets,
            type: stkIdentifierGain,
            var: stkVariableGain,
        });
    } else if (fxVal === 'pcr') {
        theFX1Fx.push({
            presets: pcRevPresets,
            type: stkIdentifierPCRev,
            var: stkVariablePCRev,
        });
    } else if (fxVal === 'nr') {
        theFX1Fx.push({
            presets: nRevPresets,
            type: stkIdentifierNRev,
            var: stkVariableNRev,
        });
    } else if (fxVal === 'jcr') {
        theFX1Fx.push({
            presets: jcRevPresets,
            type: stkIdentifierJCRev,
            var: stkVariableJCRev
        });
    }
    else if (fxVal === 'gverb') {
        theFX1Fx.push({
            presets: gVerbPresets,
            type: stkIdentifierGVerb, //
            var: stkVariableGVerb
        });
    }  
    else if (fxVal === 'delay') {
        theFX1Fx.push({
            presets: delayPresets,
            type: stkIdentifierDelay,
            var: stkVariableDelay
        });
    } else if (fxVal === 'delayA') {
        theFX1Fx.push({
            presets: delayAPresets,
            type: stkIdentifierDelayA,
            var: stkVariableDelayA
        });
    } else if (fxVal === 'delayL') {
        theFX1Fx.push({
            presets: delayLPresets,
            type: stkIdentifierDelayL,
            var: stkVariableDelayL
        });
    } else if (fxVal === 'echo') {
        theFX1Fx.push({
            presets: echoPresets,
            type: stkIdentifierEcho,
            var: stkVariableEcho
        });
    } 
    else if (fxVal === 'ambPan3') {
        theFX1Fx.push({
            presets: ambPan3Presets,
            type: stkIdentifierAmbPan3,
            var: stkVariableAmbPan3
        });
    } 
    else if (fxVal === 'bitcrusher') {
        theFX1Fx.push({
            presets: bitcrusherPresets,
            type: stkIdentifierBitcrusher,
            var: stkVariableBitcrusher
        });
    } 
    else if (fxVal === 'elliptic') {
        theFX1Fx.push({
            presets: ellipticPresets,
            type: stkIdentifierElliptic, //
            var: stkVariableElliptic
        });
    } 
    else if (fxVal === 'expdelay') {
        theFX1Fx.push({
            presets: expDelayPresets,
            type: stkIdentifierExpDelay, //
            var: stkVariableExpDelay
        });
    } 
    else if (fxVal === 'expenv') {
        theFX1Fx.push({
            presets: expEnvPresets,
            type: stkIdentifierExpEnv, //
            var: stkVariableExpEnv
        });
    } 
    else if (fxVal === 'foldbacksaturator') {
        theFX1Fx.push({
            presets: foldbackSaturatorPresets,
            type: stkIdentifierFoldbackSaturator, //
            var: stkVariableFoldbackSaturator
        });
    } 
    else if (fxVal === 'kasfilter') {
        theFX1Fx.push({
            presets: kasFilterPresets,
            type: stkIdentifierKasFilter, //
            var: stkVariableKasFilter
        });
    } 
    else if (fxVal === 'multicomb') {
        theFX1Fx.push({
            presets: multicombPresets,
            type: stkIdentifierMulticomb, //
            var: stkVariableMulticomb
        });
    } 
    else if (fxVal === 'pittrack') {
        theFX1Fx.push({
            presets: pitchTrackPresets,
            type: stkIdentifierPitchTrack, //
            var: stkVariablePitchTrack
        });
    } 
    else if (fxVal === 'adsr') {
        theFX1Fx.push({
            presets: adsrPresets,
            type: stkIdentifierADSR, //
            var: stkVariableADSR
        });
    } 
    else if (fxVal === 'poweradsr') {
        theFX1Fx.push({
            presets: powerADSRPresets,
            type: stkIdentifierPowerADSR, //
            var: stkVariablePowerADSR
        });
    } 
    else if (fxVal === 'sigmund') {
        theFX1Fx.push({
            presets: sigmundPresets,
            type: stkIdentifierSigmund, //
            var: stkVariableSigmund
        });
    } 
    else if (fxVal === 'spectacle') {
        theFX1Fx.push({
            presets: spectaclePresets,
            type: stkIdentifierSpectacle, //
            var: stkVariableSpectacle
        });
    } 
    else if (fxVal === 'winfuncenv') {
        theFX1Fx.push({
            presets: winFuncEnvPresets,
            type: stkIdentifierWinFuncEnv, //
            var: stkVariableWinFuncEnv
        });
    }
    else if (fxVal === 'wpdiodeladder') {
        theFX1Fx.push({
            presets: wpDiodeLadderPresets,
            type: stkIdentifierWPDiodeLadder, //
            var: stkVariableWPDiodeLadder
        });
    }
    else if (fxVal === 'wpkorg35') {
        theFX1Fx.push({
            presets: wpKorg35Presets,
            type: stkIdentifierWPKorg35, //
            var: stkVariableWPKorg35
        });
    } 
    else {
        console.log('in the else');
    }
    return theFX1Fx;
}