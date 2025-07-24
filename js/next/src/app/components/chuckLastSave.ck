// SAVING PLAYSTKON

    // // BE SURE TO ADD DURATION DIVISIONS (AND ALSO ELSEWHERE)
    // const playSTKOn = () => {
    //     let allSTKs: any = {}; // ALL STKs ARE STRINGS OF INSTs
    //     // try {
    //     const stkInstsHolder: [string, EffectsSettings][] | undefined = universalSources.current &&
    //         universalSources.current.stk1.instruments &&
    //         Object.entries(universalSources.current.stk1.instruments).filter((i: any) => i[1].On);

    //     console.log("insts holder??? ", stkInstsHolder);

    //     stkInstsHolder && stkInstsHolder.map((stkInsts: [string, EffectsSettings]) => {
    //         if (stkInsts[1].VarName) {
    //             // console.log("getFXOnly_var: ", stkInst.VarName);
    //             const presets: Preset[] | undefined | "" = universalSources.current &&
    //                 universalSources.current.stk1.instruments &&
    //                 universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments] &&
    //                 universalSources.current.stk1.instruments[stkInsts[1].Type as keyof STKInstruments].presets;


    //             if (presets && presets.length > 0 && stkInsts[1].VarName === "sit") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `                     
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].noteOn;  
    //                     0.01/notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         // duration * ${numeratorSignature} - (now % duration  * ${numeratorSignature} )  => now;
    //                         duration - (now % duration)  => now;
    //                         1 =>  ${stkInsts[1].VarName}[i-1].noteOff; 
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bow") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'bowPressure')[0].value} => ${stkInsts[1].VarName}[i-1].bowPressure;
    //                     ${presets.filter(p => p.name === 'bowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].bowPosition;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wg") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     // ${presets.filter(p => p.name === 'bowMotion')[0].value} => ${stkInsts[1].VarName}[i-1].bowMotion;
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'strikePosition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
    //                     ${presets.filter(p => p.name === 'gain')[0].value} => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'bowRate')[0].value} => ${stkInsts[1].VarName}[i-1].bowRate;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     ${presets.filter(p => p.name === 'startBowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBowing;
                
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwbtl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "brs") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     notesToPlay[i] + 36 => Std.mtof => ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;    
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;    
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
    //                     ${presets.filter(p => p.name === 'lip')[0].value} => ${stkInsts[1].VarName}[i-1].lip;
    //                     ${presets.filter(p => p.name === 'slide')[0].value} => ${stkInsts[1].VarName}[i-1].slide;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
                        
    //                     ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
                            
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "shak") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'energy')[0].value} => ${stkInsts[1].VarName}[i-1].energy;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'objects')[0].value} => ${stkInsts[1].VarName}[i-1].objects;
    //                     ${presets.filter(p => p.name === 'decay')[0].value} => ${stkInsts[1].VarName}[i-1].decay;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mdlbr") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'stickHardness')[0].value} => ${stkInsts[1].VarName}[i-1].stickHardness;
    //                     ${presets.filter(p => p.name === 'strikePOsition')[0].value} => ${stkInsts[1].VarName}[i-1].strikePosition;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'directGain')[0].value} => ${stkInsts[1].VarName}[i-1].directGain;
    //                     ${presets.filter(p => p.name === 'masterGain')[0].value} => ${stkInsts[1].VarName}[i-1].masterGain;
    //                     ${presets.filter(p => p.name === 'preset')[0].value} => ${stkInsts[1].VarName}[i-1].preset;
    //                     ${presets.filter(p => p.name === 'volume')[0].value} => ${stkInsts[1].VarName}[i-1].volume;
    //                     ${presets.filter(p => p.name === 'strike')[0].value} => ${stkInsts[1].VarName}[i-1].strike;
    //                     ${presets.filter(p => p.name === 'damp')[0].value} => ${stkInsts[1].VarName}[i-1].damp;


    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }
    //                 `;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "flut") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'jetDelay')[0].value} => ${stkInsts[1].VarName}[i-1].jetDelay;
    //                     ${presets.filter(p => p.name === 'jetReflection')[0].value} => ${stkInsts[1].VarName}[i-1].jetReflection;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;


    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;
    //                     ${presets.filter(p => p.name === 'endReflection')[0].value} => ${stkInsts[1].VarName}[i-1].endReflection;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "clair") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;

    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;


    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "f") {
    //                 console.log("IN FRENCH HORN::: ", presets);
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "m") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'pickupPosition')[0].value} => ${stkInsts[1].VarName}[i-1].pickupPosition;
    //                     ${presets.filter(p => p.name === 'sustain')[0].value} => ${stkInsts[1].VarName}[i-1].sustain;
    //                     ${presets.filter(p => p.name === 'stretch')[0].value} => ${stkInsts[1].VarName}[i-1].stretch;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;
    //                     ${presets.filter(p => p.name === 'baseLoopGain')[0].value} => ${stkInsts[1].VarName}[i-1].baseLoopGain;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "percFlut") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "man") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'bodySize')[0].value} => ${stkInsts[1].VarName}[i-1].bodySize;
    //                     ${presets.filter(p => p.name === 'pluckPos')[0].value} => ${stkInsts[1].VarName}[i-1].pluckPos;
    //                     ${presets.filter(p => p.name === 'stringDamping')[0].value} => ${stkInsts[1].VarName}[i-1].stringDamping;
    //                     ${presets.filter(p => p.name === 'stringDetune')[0].value} => ${stkInsts[1].VarName}[i-1].stringDetune;
    //                     ${presets.filter(p => p.name === 'pluck')[0].value} => ${stkInsts[1].VarName}[i-1].pluck;

    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "tubbl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 48 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "blwhl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
    //                     ${presets.filter(p => p.name === 'reed')[0].value} => ${stkInsts[1].VarName}[i-1].reed;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;
    //                     ${presets.filter(p => p.name === 'tonehole')[0].value} => ${stkInsts[1].VarName}[i-1].tonehole;
    //                     ${presets.filter(p => p.name === 'vent')[0].value} => ${stkInsts[1].VarName}[i-1].vent;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;                                

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.size() => ${stkInsts[1].VarName}[i-1].gain;
                        

    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'speak')[0].value} => ${stkInsts[1].VarName}[i-1].speak;
    //                     ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
    //                     duration - (now % duration)  => now;
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;

    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "sax") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                        
    //                     ${presets.filter(p => p.name === 'stiffness')[0].value} => ${stkInsts[1].VarName}[i-1].stiffness;
    //                     ${presets.filter(p => p.name === 'aperture')[0].value} => ${stkInsts[1].VarName}[i-1].aperture;
    //                     ${presets.filter(p => p.name === 'pressure')[0].value} => ${stkInsts[1].VarName}[i-1].pressure;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'rate')[0].value} => ${stkInsts[1].VarName}[i-1].rate;              
    //                     ${presets.filter(p => p.name === 'blowPosition')[0].value} => ${stkInsts[1].VarName}[i-1].blowPosition;
    //                     ${presets.filter(p => p.name === 'noiseGain')[0].value} => ${stkInsts[1].VarName}[i-1].noiseGain;                  

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
    //                     ${presets.filter(p => p.name === 'startBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].startBlowing;  

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInsts[1].VarName}[i-1].stopBlowing;  
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "bthree") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 12 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;

    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "fmVoic") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'vowel')[0].value} => ${stkInsts[1].VarName}[i-1].vowel;
    //                     ${presets.filter(p => p.name === 'spectralTilt')[0].value} => ${stkInsts[1].VarName}[i-1].spectralTilt;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             }

    //             else if (presets && presets.length > 0 && stkInsts[1].VarName === "voic") { // is this a dupe?? see above
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                                
    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     ${presets.filter(p => p.name === 'phonemeNum')[0].value} => ${stkInsts[1].VarName}[i-1].phonemeNum;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'quiet')[0].value} => ${stkInsts[1].VarName}[i-1].quiet;
                        
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                 }`;
    //             }

    //             else if (presets && presets.length > 0 && stkInsts[1].VarName === "krstl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
            
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;

    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "rod") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "wur") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;
                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "mog") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'filterQ')[0].value} => ${stkInsts[1].VarName}[i-1].filterQ;
    //                     ${presets.filter(p => p.name === 'filterSweepRate')[0].value} => ${stkInsts[1].VarName}[i-1].filterSweepRate;
    //                     ${presets.filter(p => p.name === 'vibratoFreq')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoFreq;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'vibratoGain')[0].value} => ${stkInsts[1].VarName}[i-1].vibratoGain;
    //                     ${presets.filter(p => p.name === 'afterTouch')[0].value} => ${stkInsts[1].VarName}[i-1].afterTouch;
    //                     ${presets.filter(p => p.name === 'modDepth')[0].value} => ${stkInsts[1].VarName}[i-1].modDepth;
    //                     ${presets.filter(p => p.name === 'modSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].modSpeed;

    //                     notesToPlay[i] + 36 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hevyMetl") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             } else if (presets && presets.length > 0 && stkInsts[1].VarName === "hnkytonk") {
    //                 allSTKs[`${stkInsts[1].VarName}`] = `
    //                     ${presets.filter(p => p.name === 'gain')[0].value} / notesToPlay.cap() => ${stkInsts[1].VarName}[i-1].gain;
                            
    //                     ${presets.filter(p => p.name === 'controlOne')[0].value} => ${stkInsts[1].VarName}[i-1].controlOne;
    //                     ${presets.filter(p => p.name === 'controlTwo')[0].value} => ${stkInsts[1].VarName}[i-1].controlTwo;
    //                     ${presets.filter(p => p.name === 'lfoSpeed')[0].value} => ${stkInsts[1].VarName}[i-1].lfoSpeed;
    //                     ${presets.filter(p => p.name === 'lfoDepth')[0].value} => ${stkInsts[1].VarName}[i-1].lfoDepth;

    //                     notesToPlay[i] + 24 => Std.mtof =>  ${stkInsts[1].VarName}[i-1].freq;
    //                     1 => ${stkInsts[1].VarName}[i-1].noteOn;

                        
    //                     if (${stkArpeggiatorOn} == 1) {
    //                         duration - (now % duration)  => now;
    //                         1 => ${stkInsts[1].VarName}[i-1].noteOff;
    //                     }`;
    //             }
    //             else {
    //                 console.log("why in the else??? ", stkInsts);
    //             }
    //             return Object.values(allSTKs);
    //             // } else if (name === "voic") { // <-- buggy ... needs another look            
    //         }
    //     });
    //     console.log("RETURNING STKS... ", Object.values(allSTKs));
    //     return Object.values(allSTKs);
    // }

    // // useEffect(() => {
    // //     console.log("******************************* BAM ----> ", mingusChordsData, "//** ", mingusKeyboardData);
    // // }, [mingusChordsData, mingusKeyboardData]);

    // // TODO: CONVERT THIS TO A HELPER!!!
    // const playSTKOff = () => {

    //     // const [currStkType, currStkVar] = currentStkTypeVar.current;
    //     let stkInsts = universalSources.current && universalSources.current.stk1.instruments;
    //     const presets: Preset[] | undefined | "" =
    //         universalSources.current &&
    //         universalSources.current.stk1.instruments &&
    //         Object.entries(universalSources.current.stk1.instruments)
    //             .filter((i: any) => i.On)
    //             .map((i: any) => i[1] &&
    //             {
    //                 [i[0]]: i[1].presets.filter((i: Preset) => i)
    //             });

    //     presets && Object.entries(presets).map((preset: [string, Preset], idx: number) => {
    //         if (presets && stkInsts && Object.values(stkInsts).length > 0) {
    //             Object.values(stkInsts) && Object.values(stkInsts).length > 0 && Object.values(stkInsts).map((stkInst: EffectsSettings) => {
    //                 if (stkInst.VarName === "sit" && stkInst.Type === preset[0]) {
    //                     return `1 =>  ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "bow" && stkInst.Type === preset[0]) {
    //                     return `
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInst.VarName}[i-1].stopBowing;
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "wg" && stkInst.Type === preset[0]) {
    //                     return `
    //                         ${presets.filter(p => p.name === 'stopBowing')[0].value} => ${stkInst.VarName}[i-1].stopBowing;
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "blwbtl" && stkInst.Type === preset[0]) {
    //                     return `
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
    //                     `;
    //                 } else if (stkInst.VarName === "brs" && stkInst.Type === preset[0]) {
    //                     return `
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "shak" && stkInst.Type === preset[0]) {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "mdlbr" && stkInst.Type === preset[0]) {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "flut" && stkInst.Type === preset[0]) {
    //                     return `                            
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "clair" && stkInst.Type === preset[0]) {
    //                     return `                            
    //                         ${presets.filter(p => p.name === 'stopBlowing')[0].value} => ${stkInst.VarName}[i-1].stopBlowing;
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "f" && stkInst.Type === preset[0]) {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "m") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "percFlut") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "man") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "tubbl") {
    //                     return `                                
    //                             1 => ${stkInst.VarName}[i-1].noteOff;
    //                         `;
    //                 } else if (stkInst.VarName === "blwhl") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 }
    //                 else if (stkInst.VarName === "voic") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 }
    //                 else if (stkInst.VarName === "sax") {
    //                     return `                                
    //                         ${stkInst.presets.filter((i: any) => i.name === "stopBlowing")[0].value} => ${stkInst.VarName}[i-1].stopBlowing;  
    //                         1 => ${stkInst.VarName}[i-1].noteOff;
    //                     `;
    //                 } else if (stkInst.VarName === "bthree") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;

    //                 } else if (stkInst.VarName === "fmVoic") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`
    //                 }
    //                 else if (stkInst.VarName === "voic") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 }
    //                 else if (stkInst.VarName === "krstl") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "rod") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "wur") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "mog") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "hevyMetl") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 } else if (stkInst.VarName === "hnkytonk") {
    //                     return `1 => ${stkInst.VarName}[i-1].noteOff;`;
    //                 }
    //             })
    //             return ``;
    //         }
    //     })
    // }






























//  GrainStretch:
//     m_stretching = 0
//     m_grains = 32
//     m_rate = 1.0
//     m_bufferLength = 1.0::second
//     m_maxBufferLength = 8::second
//     m_stretching = 0
//     attackTime = 100::ms
//     releaseTime = 10::ms
 
// Tape:    
//     nRA mix=0.1;
//     delay 
//     attackTime(0::ms);
//     decayTime(100::ms);
//     sustainLevel(0.75);
//     releaseTime(10::ms); 

// RandomReverse:
//     m_maxBufferLength = 2::second;
//     m-influence = 0.5;
//     m_attackTime = 100::ms;
//     m_releaseTime = 100::ms;
//     m_maxTimeBetween = 5::second;
//     m_reverseGain = 0.5;
//     m_playPos = 0::samp;
//     m_rampUp = 0::ms;
//     m_rampDown = 0::ms;
//     m_rate = -1.0;

// Reich:
// m_length = 0::samp;
// m_voices = 0;
// m_speed = 1.0;
// m_random = false;
// m_spread = false;
// m_bi = false;
// m_playPos = 0::samp;

// LiSaTrigger:
//     m_rampUp = 0::ms;
//     m_rampDown = 0::ms;
//     m_playPos = 0::samp;
//     m_rate = 1.0;
//     m_bufferLength = 0::samp;
//     m_envLength = 0::samp;

// Asymptotic Chopper
// rampDown: 0::ms;
// rampUp: 0::ms;
// platPos: 0::samp; 

 class GrainStretch extends Chugraph {

    LiSa mic[2];
    ADSR env;

    inlet => mic[0] => env => outlet;
    inlet => mic[1] => env => outlet;

    0 => int m_stretching;
    32 => int m_grains;
    1.0 => float m_rate;

    1.0::second => dur m_bufferLength;
    maxLength(8::second);

    fun void stretch(int s) {
        if (s == 1) {
            1 => m_stretching;
            spork ~ stretching();
        }
        else {
            0 => m_stretching;
        }
    }

    fun void maxLength(dur m) {
        mic[0].duration(m);
        mic[1].duration(m);
    }

    fun void length(dur l) {
        l => m_bufferLength;
    }

    fun void rate(float r) {
        r => m_rate;
    }

    fun void grains(int g) {
        g => m_grains;
    }

    fun void stretching() {
        0 => int idx;

        recordVoice(mic[idx], m_bufferLength);

        // switches between audio buffers, ensuring a constant processed signal
        while (m_stretching) {
            spork ~ recordVoice(mic[(idx + 1) % 2], m_bufferLength);
            (idx + 1) % 2 => idx;
            stretchVoice(mic[idx], m_bufferLength, m_rate, m_grains);
        }
    }

    fun void recordVoice(LiSa mic, dur bufferLength) {
        mic.clear();
        mic.recPos(0::samp);
        mic.record(1);
        bufferLength => now;
        mic.record(0);
    }

    // all the sound stuff we're doing
    fun void stretchVoice(LiSa mic, dur duration, float rate, int grains) {
        (duration * 1.0/rate)/grains => dur grain;
        grain/32.0 => dur grainEnv;
        grain * 0.5 => dur halfGrain;

        // for some reason if you try to put a sample
        // at a fraction of samp, it will silence ChucK
        // but not crash it?
        if (halfGrain < samp) {

            return;
        }

        // envelope parameters
        env.attackTime(grainEnv);
        env.releaseTime(grainEnv);

        halfGrain/samp => float halfGrainSamples;
        ((duration/samp)$int)/grains=> int sampleIncrement;

        mic.play(1);

        // bulk of the time stretching
        for (0 => int i; i < grains; i++) {
            mic.playPos((i * sampleIncrement)::samp);
            (i * sampleIncrement)::samp + grain => dur end;

            // only fade if there will be no discontinuity errors
            if (duration > end) {
                env.keyOn();
                halfGrain => now;
                env.keyOff();
                halfGrain - grainEnv => now;
            }
            else {
                (grain - (end - duration)) => dur endGrain;
                env.keyOn();
                endGrain * 0.5 => now;
                env.keyOff();
                endGrain * 0.5 - grainEnv => now;
            }
        }
        mic.play(0);
    }
}

class Tape extends Chugraph {
    inlet => NRev nRA => Delay del => ADSR env => Gain g => outlet;
    g => del;

    nRA.mix(0.1);

    env.set(0::ms, 100::ms, 0.75, 10::ms);
    delayLength(whole);

    0 => int m_loop;

    fun void delayLength(dur d) {
        del.max(d);
        del.delay(d);
    }

    fun void loop(int l) {
        if (l) {
            1 => m_loop;
            spork ~ looping();
        }
        if (l == 0) {
            0 => m_loop;
        }
    }

    fun void looping() {
        env.keyOn();
        while (m_loop) {
            1::samp => now;
        }
        env.keyOff();
    }
}

class RandomReverse extends Chugraph {

    inlet => LiSa mic => Gain r => outlet;
    inlet => Gain g => ADSR env => outlet;

    0 => int m_listen;
    2::second => dur m_maxBufferLength;
    2::second => dur m_bufferLength;
    0.5 => float m_influence;
    100::ms => dur m_envDuration;
    5::second => dur m_maxTimeBetween;

    // envelope
    env.attackTime(m_envDuration);
    env.releaseTime(m_envDuration);
    env.keyOn();

    fun void listen(int l) {
        if (l == 1) {
            1 => m_listen;
            spork ~ listening();
        }
        if (l == 0) {
            0 => m_listen;
        }
    }

    fun void setInfluence(float i) {
        i => m_influence;
    }

    fun void setReverseGain(float g) {
        r.gain(g);
    }

    fun void setMaxBufferLength(dur l) {
        l => m_maxBufferLength;
    }

    fun void listening() {
        mic.duration(m_maxBufferLength);
        while (m_listen) {
            if (m_influence >= 0.01) {
                Math.random2f(0.1, m_influence * 0.75) => float scale;
                scale * m_bufferLength => dur bufferLength;
                record(bufferLength);
                playInReverse(bufferLength);
                m_maxTimeBetween * Math.fabs(1.0 - m_influence) => now;
            }
            1::samp => now;
        }
    }

    fun void record(dur bufferLength) {
        mic.playPos(0::samp);
        mic.record(1);
        bufferLength => now;
        mic.record(0);
    }

    fun void playInReverse(dur bufferLength) {
        if (bufferLength < m_envDuration) {
            m_envDuration * 2 => bufferLength;
        }
        env.keyOff();
        mic.play(1);
        mic.playPos(bufferLength);
        mic.rate(-1.0);
        mic.rampUp(m_envDuration);
        bufferLength - m_envDuration => now;
        mic.rampDown(m_envDuration);
        env.keyOn();
        m_envDuration => now;
        mic.play(0);
    }
}

class Reich extends Chugraph {

    inlet => LiSa mic => outlet;

    0 => int m_record;
    0 => int m_play;

    0::ms => dur m_length;
    4     => int m_voices;
    1.001 => float m_speed;

    false => int m_bi;
    false => int m_random;
    false => int m_spread;

    maxBufferLength(8::second);

    fun void maxBufferLength(dur l) {
        mic.duration(l);
    }

    fun void record(int r) {
        if (r == 1) {
            1 => m_record;
            spork ~ recording();
        }
        if (r == 0) {
            0 => m_record;
        }
    }

    fun void recording() {
        mic.clear();

        mic.recPos(0::samp);
        mic.record(1);

        while (m_record == 1) {
            1::samp => now;
        }

        mic.record(0);
        mic.recPos() => m_length;
    }

    fun void play(int p) {
        if (p == 1) {
            1 => m_play;
            spork ~ playing();
        }
        if (p == 0) {
            0 => m_play;
        }

    }

    fun void playing() {
        m_voices => int numVoices;
        for (int i; i < numVoices; i++) {
            0::ms => dur pos;
            if (m_random) {
                Math.random2f(0.5,1.0) * m_length => pos;
            } else if (m_spread) {
                i/(numVoices$float) * m_length => pos;
            }
            mic.playPos(i, pos);

            // set parameters
            mic.bi(i, m_bi);
            mic.rate(i, (m_speed - 1.0) * i + 1);
            mic.loop(i, 1);
            mic.loopEnd(i, m_length);

            mic.play(i, 1);
        }
        while (m_play == 1) {
            samp => now;
        }
        for (int i; i < numVoices; i++) {
            mic.play(i, 0);
        }
    }

    // spreads the initial voices randomly
    // throughout the record buffer
    fun void random(int r) {
        r => m_random;
    }

    // spreads the initial voices equally
    // throughout the record buffer
    fun void spread(int r) {
        r => m_spread;
    }

    // plays a voice backwards when reaching
    // the end of the buffer, otherwise
    // it will loop from the beginning
    fun void bi(int b) {
        b => m_bi;
    }

    // the number of voices to be played back
    fun void voices(int n) {
        n => m_voices;
    }

    // speed offset for the voices
    fun void speed(float s) {
        s => m_speed;
    }
}

class LisaTrigger extends Chugraph {
    inlet => LiSa mic => outlet;
    mic.bi(1);

    0 => int m_listen;
    whole => dur m_bufferLength;
    whole => dur m_maxBufferLength;
    whole / (numeratorSignature) => dur m_minimumLength;
    m_minimumLength * 4 => dur m_envLength;

    fun void listen(int lstn) {
        if (lstn == 1) {
            1 => m_listen;
            spork ~ listening();
        }
        if (lstn == 0) {
            0 => m_listen;
        }
    }

    fun void length(dur l) {
        l => m_bufferLength;
    }

    fun void maxLength(dur l) {
        l => m_maxBufferLength;
    }

    fun void minimumLength(dur l) {
        m_minimumLength;
        l => m_envLength;
    }

    fun void listening() {
        mic.duration(m_maxBufferLength);
        while (m_listen) {
            mic.clear();
            mic.recPos(0::samp);
            mic.record(1);
            m_bufferLength => now;
            mic.record(0);
            lisaTrig(m_bufferLength);
        }
    }

    fun void lisaTrig(dur bufferLength) {
        dur bufferStart;
        m_bufferLength => dur bufferLength;
        mic.play(1);
        while (bufferLength > m_minimumLength) {
            bufferLength * 0.5 => bufferLength;
            0::ms => bufferStart;
            mic.playPos(bufferLength);
            mic.rampUp(m_envLength * 2);
            mic.rate(-1.25);
            bufferLength - m_envLength => now;
            mic.rampDown(m_envLength * 2);
            m_envLength * 2 => now;
        }
        mic.play(0);
    }
}

// Asymptotic Chopper
// rampDown: 0::ms;
// rampUp: 0::ms;
// platPos: 0::samp;     

class AsymptopicChopper extends Chugraph {
    inlet => LiSa mic => outlet;
    0 => int m_listen;
    3::second => dur m_bufferLength;
    10::second => dur m_maxBufferLength;
    100::ms => dur m_minimumLength;
    m_minimumLength * 0.5 => dur m_envLength;
    fun void listen(int lstn) {
        if (lstn == 1) {
            1 => m_listen;
            spork ~ listening();
        }
        if (lstn == 0) {
            0 => m_listen;
        }
    }
    fun void length(dur l) {
        l => m_bufferLength;
    }
    fun void maxLength(dur l) {
        l => m_maxBufferLength;
    }
    fun void minimumLength(dur l) {
        m_minimumLength;
        l * 0.5 => m_envLength;
    }
    fun void listening() {
        mic.duration(m_maxBufferLength);
        while (m_listen) {
            mic.clear();
            mic.recPos(0::samp);
            mic.record(1);
            m_bufferLength => now;
            mic.record(0);
            asymptopChop(m_bufferLength);
        }
    }
    fun void asymptopChop(dur bufferLength) {
        dur bufferStart;
        m_bufferLength => dur bufferLength;
        mic.play(1);
        while (bufferLength > m_minimumLength) {
            Math.random2(0, 1) => int which;
            bufferLength * 0.5 => bufferLength;
            bufferLength * which => bufferStart;
            mic.playPos(bufferStart);
            mic.rampUp(m_envLength);
            bufferLength - m_envLength => now;
            mic.rampDown(m_envLength);
            m_envLength => now;
        }
        mic.play(0);
    }
}