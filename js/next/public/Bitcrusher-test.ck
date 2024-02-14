
SinOsc sin => Bitcrusher bc => dac;

220.0 => sin.freq;

0.2 => bc.gain;
5 => bc.bits;
8 => bc.downsampleFactor;

<<< "bits:", bc.bits(), "downsampling:", bc.downsampleFactor() >>>;

while(true)
{
    1::second => now;
}
