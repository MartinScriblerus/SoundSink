
SinOsc sin => AmbPan3 pan => dac;

// 0.1 => noise.gain;
// "pink" => noise.mode;
220.0 => sin.freq;

pi/2 => pan.elevation;

while(true)
{
    pan.azimuth()+pi/1024 => pan.azimuth;
    pan.elevation() + pi/512 => pan.elevation;
    5::ms => now;
}

