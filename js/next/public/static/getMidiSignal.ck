// Set up MidiIn to listen for MIDI messages
MidiIn min;
min.open(0); // Replace 0 with your device number

MidiOut mout;
mout.open(0);


if( !min.open(0) ) { me.exit(); }

Std.atoi(me.arg(0)) => int numerator;

// Create an Event to synchronize clock ticks
Event clockEvent;
time clockLast;
dur clockElapsed;

// Create a MidiMsg object to hold incoming messages
MidiMsg msg;
Event time; 


0 => int count;
// Define a function to handle MIDI clock messages
fun void listenForClock() {
    while (true) {
        // Wait for incoming MIDI message
        if (min.recv(msg)) {
            count + 1 => count;
            // Check if the message is a MIDI Clock message (0xF8)
            if (msg.data1 == 0xF8 & count % 24 * numerator == 0) {
                <<< "MIDI Clock Tick Received!", ((count / 24) % 4) >>>;
                if (clockLast) {
                    now - clockLast => clockElapsed;
                    now => clockLast;
                }
                clockEvent.broadcast(); // Broadcast event to sync with the clock
            }
        }
        // Yield to prevent CPU overload
        1::ms => now;
    }
}

// Start listening for MIDI clock in a sporked shred
spork ~ listenForClock();

// Sync with the clock event (optional usage example)
while (true) {
    clockEvent => now;
    <<< "Synchronized with MIDI clock tick",  ((count / 24) % 4) >>>;
}