class MidiAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.midiData = []; // Initialize midiData as an empty array
    this.midiFrame = 0;

    this.bpmHistory = { current: [] };
    this.triggerType = '';
    this.triggerArgs = [];
    this.quarterNoteBeatStart = { current: undefined };
   
    this.noteWeights = { current: [] };
    this.lastClockTime = { current: Date.now()};
    this.quarterLengthNumPriorEstimates = { current: 0 };

    this.bpmSmoothingTooLarge = { current: 0 };
    this.bpmSmoothingIsFine = { current: 0 };

    this.midiBPMClockIncoming = { current: [] };

    this.port.onmessage = (event) => {
      //console.log("Received message in Worklet:", event.data);
      // Store received MIDI data here, if needed
      this.midiData = event.data; // Assuming event.data contains MIDI messages
    };

    this.quarterLengthEstimate = { current: 0 }; // Default quarter note length estimate in milliseconds

    this.handleObserveQuarterLength = (observedLength) => {
      // if (observedLength !== quarterLengthEstimate.current) {
      this.quarterLengthEstimate.current = (this.quarterLengthEstimate.current * (this.quarterLengthNumPriorEstimates.current - 1) + observedLength) / (this.quarterLengthNumPriorEstimates.current);
      // }
      // console.log("NEW QUARTER LENGTH ESTIMATE: ", quarterLengthEstimate.current);
      // console.log("NEW BPM ESTIMATE?? ", 60000/quarterLengthEstimate.current);
    }
  }

  process(inputs, outputs, parameters) {
    // const this.bpmHistory = null;

    

    // Example MIDI data processing
    if (this.midiData && this.midiData.length > 0) {
      // this.midiData.forEach(message => {
        console.log('CHECK MSG: ', this.midiData[0], this.midiData[1], this.midiData[2]);
        const statusByte = this.midiData[0] & 0xf0;

        const statusByteClock = this.midiData[0] & 0xf8;

        console.log('CHECK status byte: ', statusByte);
        console.log('CHECK status byte clock: ', statusByteClock);
        
        if(this.midiData.length > 0 && this.midiData[0] >= 144 && this.midiData[0] < 160 && statusByte !== 0xf8)
        {
            if( this.midiData[2] > 0 )
            {
                // noteOnPlay( message[1], message[2] );
              this.triggerType = 'noteOnPlay';
              this.triggerArgs = [this.midiData[0], this.midiData[1], this.midiData[2]];
              console.log("press play on!!! ", this.midiData[0], this.midiData[1], this.midiData[2], this.midiData[2]);
            } else
            {
              this.triggerType = 'noteOffPlay';
              this.triggerArgs = [this.midiData[0]];
              // noteOffPlay( this.midiData[1] );
            }
        }
        else if(
          this.midiData.length > 0 && 
          this.midiData && this.midiData.length > 0 && 
          this.midiData[0] >= 128 && this.midiData[0] < 144 )
        {
          this.triggerType = 'noteOffPlay';
          this.triggerArgs = [this.midiData[0]];
          // noteOffPlay( this.midiData[1] );
        }

        // Smoothing settings
        const BPM_SMOOTHING_WINDOW = 50;  // Number of past BPM values to average
        const MIN_CLOCK_PULSE_INTERVAL = 5;  // Minimum time between clock pulses to consider for BPM estimate
        const MAX_CLOCK_PULSE_INTERVAL = 500; // Maximum reasonable gap between pulses (in milliseconds)

        if (statusByteClock) {
          // console.log("Midi Msg Clock In: ", this.midiData.data[0])
          if (this.midiData[0] === 250) {
              this.quarterNoteBeatStart.current = Date.now();
              // console.log("Midi Msg Start from External Clock In")
          } else {
              // if (Number(Date.now()) - quarterNoteBeatStart.current < 1000) {
              if (this.quarterNoteBeatStart.current) {
                  this.quarterLengthNumPriorEstimates.current = this.quarterLengthNumPriorEstimates.current + 1;
                  this.quarterNoteBeatLength.current = 24 * ((Number(Date.now()) - this.quarterNoteBeatStart.current) / this.quarterLengthNumPriorEstimates.current);
                  // console.log("Quarter Note Length: ", quarterNoteBeatLength.current);
                  this.handleObserveQuarterLength(quarterNoteBeatLength.current);
                  // this.quarterNoteBeatStart.current = undefined;
              } 
          }

          if (this.midiData[0] === 248) {
              this.midiFrame = this.midiFrame + 1;
              const currentTime = Date.now();
              console.log("MIDI FRAME??? ", this.midiFrame)
              console.log("Midi Msg Clock In CURR: ", currentTime);
              console.log("MIDI MSG LAST TIME: ", this.lastClockTime.current);
              // Calculate the time since the last clock pulse
              if (this.lastClockTime.current) {
                  const timeBetweenPulses = currentTime - this.lastClockTime.current;  // in milliseconds
                  // If time between pulses is too large, we assume we missed pulses
                  if (timeBetweenPulses > MAX_CLOCK_PULSE_INTERVAL) {
                      this.bpmSmoothingTooLarge.current = this.bpmSmoothingTooLarge.current + 1;
                      // console.log(`Warning: Large gap between pulses! Time difference: ${timeBetweenPulses}ms`);
                      return;  // Skip this message to avoid incorrect BPM calculations
                  } else {
                      this.bpmSmoothingIsFine.current = this.bpmSmoothingIsFine.current + 1;
                  }
                  if (timeBetweenPulses > MIN_CLOCK_PULSE_INTERVAL && timeBetweenPulses < MAX_CLOCK_PULSE_INTERVAL) {
                      const timePerQuarterNote = timeBetweenPulses * 24;  // 24 pulses per quarter note
                      const secondsPerQuarterNote = timePerQuarterNote / 1000;  // Convert to seconds
                      const bpm = 60 / secondsPerQuarterNote;
                      if (bpm && bpm !== Infinity && bpm > 0 && !isNaN(bpm)) {
                          this.bpmHistory.current.push(bpm);
                          if (this.bpmHistory.current.length > BPM_SMOOTHING_WINDOW) {
                              this.bpmHistory.current.shift();
                          }
                          const smoothedBPM = this.bpmHistory.current.reduce((sum, bpm) => sum + bpm, 0) / this.bpmHistory.current.length;
                          if (smoothedBPM && typeof smoothedBPM === "number" && (Number(+smoothedBPM) !== this.midiBPMClockIncoming.current.toString())) { 
                            // setMidiBPMClockIncoming(smoothedBPM)
                            this.midiBPMClockIncoming.current = smoothedBPM;
                          }
                      }
                  }
              }
              // Update last clock time
              if (currentTime) this.lastClockTime.current = currentTime;
          } 

          if (this.midiFrame % (96) == 0) {
            //  console.log("Whole Note! at ", Date.now());
             if (!this.noteWeights.current.includes('Whole')) this.noteWeights.current.push('Whole');   
          } 
          else if (this.midiFrame % 48 == 0) {
              // console.log("Half Note! at ", Date.now()); 
              if (!this.noteWeights.current.includes('Half')) this.noteWeights.current.push('Half');  
          } 
          else if (this.midiFrame % 24 == 0) {
              // console.log("Quarter Note! at ", Date.now()); 
              if (!this.noteWeights.current.includes('Quarter')) this.noteWeights.current.push('Quarter');  
          }
          else if (this.midiFrame % 12 == 0) {
              // console.log("Eighth Note! at ", Date.now()); 
              if (!this.noteWeights.current.includes('Eighth')) this.noteWeights.current.push('Eighth');  
          }
          else if (this.midiFrame % 6 == 0) {
              // console.log("Sixteenth Note! at ", Date.now()); 
              if (!this.noteWeights.current.includes('Sixteenth')) this.noteWeights.current.push('Sixteenth');  
          }
      }

        const eventData = {
          // type: message.type, // e.g., 'noteOn', 'noteOff', etc.
          // value: message.value, // Note number, velocity, etc.
          // timestamp: currentTime, // Relative to audio context
          triggerType: this.triggerType, // noteOn / noteOff
          triggerArgs: this.triggerArgs, // args to pass into trigger type
          quarterStartTimestamp: this.quarterNoteBeatStart.current, // Relative to audio context start
          noteType: this.noteWeights.current, // Whole, half, quarter, etc.
          noteTimestamp: Date.now(),
          bpmHistory: this.bpmHistory.current, // this needs to be passed into any function here
          bpmGuess: this.midiBPMClockIncoming
        };

        console.log("CHECK FOR EVENT DATA??? ", eventData);

        // console.log("BOOM EVENT: ", eventData);
        // Send to main thread
        this.port.postMessage(eventData);
      // });

      this.midiData = []; // Clear after processing
    }
    return true;
  }
}

registerProcessor('midi-audio-processor', MidiAudioProcessor);