import { Box, Button } from "@mui/material"
import { clippedDuration, ffmpegRef, filesToProcess, messageRef, regionEnd, regionStart, totalDuration, wavesurferRef } from "../state/refs";
import { toBlobURL } from "@ffmpeg/util";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions";
import wavesurfer from "wavesurfer.js";
import WaveSurferPlayer from '@wavesurfer/react';
import { useEffect, useState } from "react";

type FileWindowProps = {
    uploadedBlob: React.MutableRefObject<Blob | MediaSource >;
    // setWavesurfer: React.Dispatch<React.SetStateAction<any>>;
    getMeydaData: (arrayBuffer: ArrayBuffer) => Promise<any>;
}
const FileWindow = (props: FileWindowProps) => {
    const { uploadedBlob, getMeydaData } = props;
    const [isPlaying, setIsPlaying] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [wavesurfer, setWavesurfer] = useState<any>(null);

    const load = async () => {
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
            ),
        });
        setLoaded(true);
        setIsLoading(false);
    }; 
        
    function readArrayBufferAsFile(arrayBuffer: ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        const fileContent = decoder.decode(arrayBuffer);
        return fileContent;
    };

    async function uploadAudioFile(blob: Blob, name: string) {
        if (!name.endsWith('.wav')) {
            console.error('Only WAV files are supported ', name, "BLOB: ", blob);
            return;
        }
    
            const formData = new FormData();
            formData.append('file', blob, name);
        
        const response = await fetch('http://localhost:8000/analyze_audio/', {
            method: 'POST',
            body: formData,
        });
        
        try {
            const result = await response.json();
            console.log(result);
        } catch (e) {
            console.error('Error parsing JSON response:', e);
        }
    }

    async function clipAudio() {
        const start: number | any = regionStart.current; 
        const end: number | any = regionEnd.current;
                
        if (!start ||!end ) return;
        
        const ffmpeg = ffmpegRef.current;
        
        const audioFile = filesToProcess.current[filesToProcess.current.length - 1];
                
        try {
            // Write the audio file to the FFmpeg wasm file system
            await ffmpeg.writeFile(
            audioFile.filename,
            audioFile.data
            );
            
            // Run the FFmpeg command
            await ffmpeg.exec([
            '-i', audioFile.filename,
            '-ss', start.toString(), // Start time
            '-t', (end - start).toString(), // Duration
            '-c', 'copy',
            '-f','wav',
            // 'clipped_audio.mp3'
            `clipped_${audioFile.filename}`
            ]);
        
            // Read the clipped audio file
            const clippedAudio = (await ffmpeg.readFile(`clipped_${audioFile.filename}`, 'binary')) as Uint8Array;
                
            if (clippedAudio) {
            // Create a blob from the clipped audio
            const blob = new Blob([clippedAudio], { type: 'audio/wav' });
            
            // Create a URL for the clipped audio
            const url = URL.createObjectURL(blob);

            const response = await fetch(URL.createObjectURL(blob));
            const arrayBuffer = await response.arrayBuffer();

            const newClippedFile = readArrayBufferAsFile(arrayBuffer);
            
            uploadAudioFile(blob, `clipped_${audioFile.filename}`);

            ///// remove below if causing troubles
            filesToProcess.current.push({
                data: newClippedFile,
                name: `${audioFile.filename}_clipped.mp3`
            });
            ////////////////////////////////////////
            const clippedAudioMeydaData = await getMeydaData(arrayBuffer);
            console.log("CLIPPED AUDIO MEYDA DATA: ", clippedAudioMeydaData);
            
            // Save the clipped audio or play it
            const a = document.createElement('a');
            a.href = url;
            a.download = `clipped_${audioFile.filename}`;
            a.click();
            } else {
            console.error('Error: clipped audio is null or undefined');
            }
        } catch (error) {
            console.error('Error clipping audio:', error);
        }
    }
    
    const onReady = (ws: any) => {
        console.log("WAVESURFER READY: ", ws);
        if (ws) {        
            const region = ws.plugins[0].addRegion({
                start: 0,
                end: 10,
                color: 'rgba(0, 255, 0, 0.5)',
            });
    
            region.on("update", (e: any) => {
                console.log('Region clicked!', e);
            });
    
            region.on("update-end", () => {
                regionStart.current = region.start;
                regionEnd.current = region.end;
                totalDuration.current = region.totalDuration;
                clippedDuration.current = region.end - region.start;
                // clipAudio(region.start, region.end);
                console.log('Finished dragging/resizing!', region);
            });

            region.on("play", function(this: Region) {
                console.log('PLAY WORKS!!', this as any);
                setIsPlaying(true);
            });
    
            console.log("Region listeners (for info):", region);
        
        }
        wavesurferRef.current = ws;

        if ((wavesurferRef.current !== wavesurfer) && wavesurferRef.current && !wavesurfer) {
            setWavesurfer(wavesurferRef.current)
        }
        // setIsPlaying(false)
    }
    
    const onPlayPause = () => {
        console.log("YOOO!!! ", wavesurferRef.current);
        wavesurferRef.current && wavesurferRef.current.playPause()
    }
    
    useEffect(() => {
        load();
    }, []);

    return (
         
            <Box
                id="waveSurferContainer"
                sx={{
                    display: "block",
                    zIndex: 9999,
                    position: "relative",
                    top: "0px",
                    left: "0px",
                    width: "calc(100% - 396px)",
                    justifyContent: "stretch",
                    background: "rgba(0,0,0,0.98)",
                }}
            >
                <Button style={{zIndex: 9999}} onClick={onPlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button style={{zIndex: 9999}} onClick={() => clipAudio()}>
                    Clip
                </Button>
                <WaveSurferPlayer
                    height={100}
                    waveColor="#4d91ff"
                    progressColor="#4d91ff"
                    // url="/my-server/audio.wav"
                    url={URL.createObjectURL(uploadedBlob.current)}
                    onReady={onReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onPlayPause={onPlayPause}
                    plugins={[RegionsPlugin.create()]}
                />

            </Box>
    );
}
export default FileWindow;