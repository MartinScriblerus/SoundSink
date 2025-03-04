export const stkHelper = (stkFX: any) => {
    if (stkFX.type === "Sitar") {
        return `                                    
            
        for (1 => int i; i < notesToPlay.cap(); i++) {


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
