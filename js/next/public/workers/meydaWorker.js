import Meyda from "meyda";

export {};

const ctx = self;

ctx.onmessage = async (event) => {
    console.log(event.data);
    const { audioData, sampleRate } = event.data;

    try {
        // Create an OfflineAudioContext for processing
        const offlineContext = new OfflineAudioContext(1, audioData.length, sampleRate);
        const buffer = offlineContext.createBuffer(1, audioData.length, sampleRate);
        buffer.copyToChannel(audioData, 0);

        // Create a buffer source and connect it to the destination
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        source.connect(offlineContext.destination);

        // Resume and process audio
        await offlineContext.resume();
        source.start();
        await offlineContext.startRendering();

        // Extract features from the processed buffer
        const features = Meyda.extract(
            [
                "rms",
                "mfcc",
                "chroma",
                "zcr",
                "energy",
                "amplitudeSpectrum",
                "powerSpectrum",
                "spectralCentroid",
                "spectralFlatness",
                "spectralRolloff",
                "spectralSlope",
                "spectralSpread",
                "spectralSkewness",
                "spectralKurtosis",
                "spectralCrest",
                "loudness",
                "perceptualSpread",
                "perceptualSharpness",
                "complexSpectrum",
                "buffer",
            ],
            buffer.getChannelData(0)
        );

        // Send features back to the main thread
        ctx.postMessage(features);
    } catch (error) {
        console.error("Worker Error:", error);
        ctx.postMessage({ error: error });
    }
};