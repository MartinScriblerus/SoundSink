import bandedWGPresets, {stkVariableBandedWg, stkIdentifierBandedWg} from '@/utils/bandedWGPresets';
import beeThreePresets, {stkVariableBeeThree, stkIdentifierBeeThree} from '@/utils/beeThreePresets';
import blowBotlPresets, {stkVariableBlowBotl, stkIdentifierBlowBotl} from '@/utils/blowBottlePresets';
import blowHolePresets, {stkVariableBlowHole, stkIdentifierBlowHole} from '@/utils/blowHolePresets';
import bowedPresets, {stkVariableBowed, stkIdentifierBowed} from '@/utils/bowedPresets';
import brassPresets, {stkVariableBrass, stkIdentifierBrass} from '@/utils/brassPresets';
import chorusPresets, {stkVariableChorus, stkIdentifierChorus} from '@/utils/chorusPresets';
import clarinetPresets, {stkVariableClarinet, stkIdentifierClarinet} from '@/utils/clarinetPresets';
import delayAPresets, {stkVariableDelayA, stkIdentifierDelayA} from '@/utils/delayAPreset';
import delayLPresets, {stkVariableDelayL, stkIdentifierDelayL} from '@/utils/delayLPresets';
import delayPresets, {stkVariableDelay, stkIdentifierDelay} from '@/utils/delayPresets';
import echoPresets, {stkVariableEcho, stkIdentifierEcho} from '@/utils/echoPresets';
import flutePresets, {stkVariableFlute, stkIdentifierFlute} from '@/utils/flutePresets';
import fmPresets, {stkVariableFM, stkIdentifierFM} from '@/utils/fmPresets';
import fmVoicesPresets, {stkVariableFMVoices, stkIdentifierFMVoices} from '@/utils/fmVoices';
import frencHrnPresets, {stkVariableFrencHrn, stkIdentifierFrencHrn} from '@/utils/frenchHornPresets';
import krstlChrPresets, {stkVariableKrstlChr, stkIdentifierKrstlChr} from '@/utils/krstlChrPresets';
import mandolinPresets, {stkVariableMandolin, stkIdentifierMandolin} from '@/utils/mandolinPresets';
import modalBarPresets, {stkVariableModalBar, stkIdentifierModalBar} from '@/utils/modalBarPresets';
import modulatePresets, {stkVariableModulate, stkIdentifierModulate} from '@/utils/modulatePresets';
import moogPresets, {stkVariableMoog, stkIdentifierMoog} from '@/utils/moogPresets';
import percFlutPresets, {stkVariablePercFlut, stkIdentifierPercFlut} from '@/utils/percFlutPresets';
import pitShiftPresets, {stkVariablePitShift, stkIdentifierPitShift} from '@/utils/pitchShiftPresets';
import rhodeyPresets, {stkVariableRhodey, stkIdentifierRhodey} from '@/utils/rhodesPresets';
import saxofonyPresets, {stkIdentifierSaxofony, stkVariableSaxofony} from '@/utils/saxPresets';
import sitarPresets, {stkVariableSitar, stkIdentifierSitar} from '@/utils/sitarPresets';
import stifKarpPresets, {stkVariableStifKarp, stkIdentifierStifKarp} from '@/utils/stifKarpPresets';
import shakersPresets, {stkVariableShakers, stkIdentifierShakers} from '@/utils/shakersPresets';
import tubeBellPresets, {stkVariableTubeBell, stkIdentifierTubeBell} from '@/utils/tubeBell';
import voicFormPresets, {stkVariableVoiceForm, stkIdentifierVoiceForm} from '@/utils/voicFormPresets';
import wurleyPresets, {stkVariableWurley, stkIdentifierWurley} from '@/utils/wurleyPresets';



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
    } else if (stkVal === 'fm') {
        theStk1Fx = {
            presets: fmPresets,
            type: stkIdentifierFM,
            var: stkVariableFM
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
    } else if (stkVal === 'delay') {
        theStk1Fx = {
            presets: delayPresets,
            type: stkIdentifierDelay,
            var: stkVariableDelay
        };
    } else if (stkVal === 'delayA') {
        theStk1Fx = {
            presets: delayAPresets,
            type: stkIdentifierDelayA,
            var: stkVariableDelayA
        };
    } else if (stkVal === 'delayL') {
        theStk1Fx = {
            presets: delayLPresets,
            type: stkIdentifierDelayL,
            var: stkVariableDelayL
        };
    } else if (stkVal === 'echo') {
        theStk1Fx = {
            presets: echoPresets,
            type: stkIdentifierEcho,
            var: stkVariableEcho
        };
    } else if (stkVal === 'modulate') {
        theStk1Fx = {
            presets: modulatePresets,
            type: stkIdentifierModulate,
            var: stkVariableModulate
        };
    } else if (stkVal === 'pitShift') {
        theStk1Fx = {
            presets: pitShiftPresets,
            type: stkIdentifierPitShift,
            var: stkVariablePitShift
        };
    } else {
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
    } else if (stkVal === 'fm') {
        theStk2Fx = {
            presets: fmPresets,
            type: stkIdentifierFM,
            var: stkVariableFM
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
    } else if (stkVal === 'delay') {
        theStk2Fx = {
            presets: delayPresets,
            type: stkIdentifierDelay,
            var: stkVariableDelay
        };
    } else if (stkVal === 'delayA') {
        theStk2Fx = {
            presets: delayAPresets,
            type: stkIdentifierDelayA,
            var: stkVariableDelayA
        };
    } else if (stkVal === 'delayL') {
        theStk2Fx = {
            presets: delayLPresets,
            type: stkIdentifierDelayL,
            var: stkVariableDelayL
        };
    } else if (stkVal === 'echo') {
        theStk2Fx = {
            presets: echoPresets,
            type: stkIdentifierEcho,
            var: stkVariableEcho
        };
    } else if (stkVal === 'modulate') {
        theStk2Fx = {
            presets: modulatePresets,
            type: stkIdentifierModulate,
            var: stkVariableModulate
        };
    } else if (stkVal === 'pitShift') {
        theStk2Fx = {
            presets: pitShiftPresets,
            type: stkIdentifierPitShift,
            var: stkVariablePitShift
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
