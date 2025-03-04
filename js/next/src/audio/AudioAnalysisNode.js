// class AudioAnalysisNode extends AudioWorkletNode {
//     constructor(context) {
//       super(context, 'audio-analysis-processor', {
//         outputChannelCount: [2], // Ensure proper audio processing setup
//         processorOptions: {} // Can be used to pass config later
//       });
  
//       this.port.onmessage = (event) => {
//         console.log("Processor responded: ", event.data);
//       };
//     }
  
//     sendMeydaData(meydaData) {
//       this.port.postMessage(meydaData);
//     }
//   }
  
//   export default AudioAnalysisNode;
  
  
  
  
  
class MeydaAudioWorkletNode extends AudioWorkletNode {
  constructor(context) {
      super(context, 'meyda-audio-processor');
      this.data = [];
  }

  setMeydaData(audioData) {
      // Send audio data to Web Worker for analysis
      console.log("AUD DATA? ", audioData);
      this.port.postMessage(audioData);
  }
}

export default MeydaAudioWorkletNode;