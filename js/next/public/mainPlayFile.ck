class LowpassDelay extends Chugraph 
{
    inlet => LPF lpf => Delay delay => outlet;
    500 => lpf.freq;
    1::second => delay.max;
    0.5 => delay.gain;
    1::second / 2  => delay.delay;
    delay => delay;

    lpf => outlet;
}

SawOsc osc => LowpassDelay graph[2] => dac;

0.5 => osc.gain;
220.0 => osc.freq;

1::second / 4 => graph[1].delay.delay;

48 => int offset;
[0,4,7,11] @=> int notes[];
while (true) 
{
    for(0 => int i; i < notes.cap(); i++) 
    {
        Std.mtof(offset + notes[i]) => osc.freq;
        1::second / 4 => now;
    }
}




// //------------------------------------------------------------------
// // name: oscillatronx (oscillator demo)
// // desc: playing all of the different types of oscillator UGens
// //       mixing together different timbres to create a sonic texture
// //
// // author: philipd
// //------------------------------------------------------------------

// // scale degrees in semi-tones
// [ 0, 2, 4, 7, 9 ] @=> int f[];

// // various oscialltors
// SinOsc s => dac;
// SawOsc saw => dac;
// TriOsc tri => dac;
// PulseOsc pul => dac;
// SqrOsc sqr => dac;
// // FM modulator and carrier
// TriOsc trictrl => SinOsc sintri => dac;
// // interpret input as frequency modulation
// 2 => sintri.sync;
// 100  => trictrl.gain;

// // array of Oscs
// [ s, saw, tri, pul, sqr, trictrl ] @=> Osc oscillators[];

// // set gains
// 0.2 => s.gain;
// 0.1 => saw.gain;
// 0.1 => tri.gain;
// 0.1 => pul.gain;
// 0.1 => sqr.gain;
// 0.1 => sintri.gain;

// // infinite time-loop
// while( true )
// { 
//     // randomize
//     Math.random2(0,7) => int select;
//     // clamp (giving more weight to 5)
//     if( select > 5 ) 5 => select;
//     // generate new frequenc value
//     Std.mtof( f[Math.random2( 0, 4 )] + 60 ) => float newnote;
//     // set frequency
//     newnote => oscillators[select].freq;
//     // wait a bit
//     0.25::second => now;
//     // 10 times
//     repeat(10)
//     {
//         Math.random2f( 0.2, 0.8 ) => trictrl.width;
//         // <<< "trictrl width:", trictrl.width() >>>;
//         0.05::second => now;
//     }
// }