class MidiAudioNode extends AudioWorkletNode {
  constructor(context) {
    super(context, 'midi-audio-processor', {
      outputChannelCount: [2], // Ensure proper audio processing setup
      processorOptions: {} // Can be used to pass config later
    });

    this.port.onmessage = (event) => {
      console.log("Processor responded: ", event.data);
    };
  }

  sendMidiData(midiData) {
    this.port.postMessage(midiData);
  }
}

export default MidiAudioNode;




