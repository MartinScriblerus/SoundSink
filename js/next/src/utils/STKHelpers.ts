export const stkHelper = (stkFX: any) => {
    console.log("@@@@@ WHAT STKsss FX ARE WE LOOKING AT? ", stkFX);
    if (stkFX.type === "Sitar") {
        return `                                    
            
        for (1 => int i; i < notesToPlay.cap(); i++) {
            // <<< notesToPlay[i] >>>;

            if (notesToPlay.cap() > 0) {
                if (${stkFX.length} > 0 && notesToPlay[i] > 20 && notesToPlay[i] < 127) {
      
                notesToPlay[i] + 24 => Std.mtof => ${stkFX.var}[i-1].freq;
                notesToPlay[i] + 24 => Std.mtof =>  ${stkFX.var}[i-1].noteOn;
                ${stkFX.presets.pluck.value} => ${stkFX.var}[i-1].pluck;
                0.2/notesToPlay.cap() => ${stkFX.var}[i-1].gain;
                
            } else {
                // notesToPlay.erase(i);
            }
        }
    }
    duration - (now % duration)  => now;
    for (1 => int i; i < notesToPlay.cap(); i++) {

        1 => ${stkFX.current.var}[i-1].noteOff;

}

me.yield();
            
            
            `;
    }
}

// export const checkSTKNames = (name: string) => {
//     if (
//         name === "sit" ||
//         name === "wg" ||
//         name === "bthree" ||
//         name === "blwbtl" ||
//         name === "bow" ||
//         name === "brs" ||
//         name === "clair" ||
//         name === "flut" ||
//         name === "fmVoic" ||
//         name === "f" ||
//         name === "krstl" ||
//         name === "man" ||
//         name === "mdlbr" ||
//         name === "mog" ||
//         name === "prcflt" ||
//         name === "rod" ||
//         name === "sax" ||
//         name === "shak" ||
//         name === "m" ||
//         name === "tubbl" ||
//         name === "voic" ||
//         name === "wur"
//     ) {
//         return 'stk';
//     } else if (
//         name === "lfoVoice" ||
//         name === "offset" ||
//         name === "cutoff" ||
//         name === "rez" ||
//         name === "env" ||
//         name === "oscType1" ||
//         name === "oscType2" ||
//         name === "detune" ||
//         name === "oscOffset" ||
//         name === "noise" ||
//         name === "adsrAttack" ||
//         name === "adsrDecay" ||
//         name === "adsrSustain" ||
//         name === "adsrRelease" ||
//         name === "limiterAttack" ||
//         name === "limiterThreshold" ||
//         name === "lfoFreq" ||
//         name === "pitchMod" ||
//         name === "cutoffMod" ||
//         name === "highPassFreq"
//     ) {
//         return 'default';
//     }
//     else {
//         return 'fx';
//     }
// }