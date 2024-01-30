SynthVoice voice => dac;

[0,4,7,11,14,16,19,23,24] @=> int notes[];
0 => voice.cutoff;
2 => voice.ChooseOsc1;
2 => voice.ChooseOsc2;
0 => voice.detune;
7 => voice.oscOffset;
0 => voice.pitchMod;
50 => voice.cutoffMod;
3 => voice.ChooseLfo;
3 => voice.SetLfoFreq;
10 => voice.noise;
1000::ms => voice.adsr.attackTime;
1000::ms => voice.adsr.decayTime;

while(true)
{
    Math.random2(1,3) => int nextOsc;
    nextOsc => voice.ChooseOsc1;
    nextOsc => voice.ChooseOsc2;
    // Math.random2(1, 100) => voice.cutoff;
    Math.random2(1,10) => voice.SetLfoFreq;
    Math.random2(1, 25) => voice.rez;
    Math.random2(1, 25) => voice.env;
    10 => voice.cutoff;
    // 1 => voice.rez;
    // 1 => voice.env;
    notes[Math.random2(0, notes.cap()-1)] + 12 => voice.keyOn;
    2::second => now;
    1 => voice.keyOff;

}