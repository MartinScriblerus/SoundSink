import { Box, Button } from "@mui/material"
import { clippedDuration, ffmpegRef, filesToProcess, messageRef, regionEnd, regionStart, totalDuration, wavesurferRef } from "../state/refs";
import { toBlobURL } from "@ffmpeg/util";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions";
import WaveSurferPlayer from '@wavesurfer/react';
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Chuck } from "webchuck";

type FileWindowProps = {
    uploadedBlob: React.MutableRefObject<Blob | MediaSource >;
    // setWavesurfer: React.Dispatch<React.SetStateAction<any>>;
    getMeydaData: (arrayBuffer: ArrayBuffer) => Promise<any>;
    clickedFile: React.MutableRefObject<string | null>;
    chuck: Chuck | undefined;
}
const FileWindow = (props: FileWindowProps) => {
    const { uploadedBlob, getMeydaData, clickedFile, chuck } = props;
    const [isPlaying, setIsPlaying] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [wavesurfer, setWavesurfer] = useState<any>(null);

    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useMemo(() => {
        if (uploadedBlob.current) {
            const url = URL.createObjectURL(uploadedBlob.current);
            url && setAudioUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [uploadedBlob]);

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
            console.log("UPLOAD FILE RESPONSE: ", response, "RESULT: ", result);
        } catch (e) {
            console.error('Error parsing JSON response in upload file:', e);
        }
    }

    async function transposeAudio() {
        const filename = filesToProcess.current[filesToProcess.current.length - 1].filename;

        const response = await fetch('http://localhost:8000/transpose_sample', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_path: filename,
                pitch_shift: 2,     // semitone steps (e.g. +2 or -3)
                rate_shift: 0.5     // playback speed factor (e.g. 1.0 = no change)
            }),
        });

        const result = await response.json();
        console.log("TRANSPOSE RESPONSE?: ", response, "RESULT: ", result);
    }

    async function testAudio() {
        const start: number | any = regionStart.current; 
        const end: number | any = regionEnd.current;
        // alert("TEST AUDIO: " + [start, end].toString());
        regionsPlugin[0].getRegions().forEach((region: Region) => {
            (region as any).play({ loop: true });
            console.log("REGION PLAYED: ", region);

        });
    };

    async function clipAudio() {
        const start: number | any = regionStart.current; 
        const end: number | any = regionEnd.current;
                
        if (!start ||!end ) return;
        
        const ffmpeg = ffmpegRef.current;
        console.log("File to proc 1?: ", filesToProcess.current);
        const audioFile = filesToProcess.current[filesToProcess.current.length - 1];
        console.log("trying to clip audio: ", audioFile, "START: ", start, "END: ", end);
        const clonedBuffer = audioFile.data.slice(0); 
        try {
            // Write the audio file to the FFmpeg wasm file system
            await ffmpeg.writeFile(
                audioFile.filename,
                clonedBuffer
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
                console.log("CLIPPED AUDIO: ", clippedAudio);
            if (clippedAudio) {
            // Create a blob from the clipped audio
            const blob = new Blob([clippedAudio], { type: 'audio/wav' });
            
            // Create a URL for the clipped audio
            const url = URL.createObjectURL(blob);

            const response = await fetch(URL.createObjectURL(blob));
            const arrayBuffer = await response.arrayBuffer();

            const newClippedFile = readArrayBufferAsFile(arrayBuffer);
            await uploadAudioFile(blob, `${audioFile.filename.split('.').slice(0,-1).join(',')}_clipped.wav`);
            ///// remove below if causing troubles
            filesToProcess.current.push({
                data: clippedAudio,
                filename: `${audioFile.filename.split('.').slice(0,-1).join(',')}_clipped.wav`,
                processed: false,
            });
            chuck && chuck.createFile("", `${audioFile.filename.split('.').slice(0,-1).join(',')}_clipped.wav`, clippedAudio);
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
                end: .1,
                drag: true,
                resize: true,
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

        if ((
            wavesurferRef.current !== wavesurfer) && 
            wavesurferRef.current && 
            !wavesurfer
        ) {
            setWavesurfer(wavesurferRef.current)
        }
        // setIsPlaying(false)
    }
    
    const onPlayPause = () => {
        console.log("wavesurfer ref current: ", wavesurferRef.current);
        wavesurferRef.current && wavesurferRef.current.playPause()
    }
    
    const regionsPlugin = useMemo(() => [RegionsPlugin.create()], []);
    useEffect(() => {
        load();
        // const regionsPlugin = useMemo(() => [RegionsPlugin.create()], []);
    }, []);

    useEffect(() => {
        if (!clickedFile) return;
        const theFile: any = Object.values(clickedFile).map((i:any) => i[0]);
        console.log("clicked file: ", theFile);
        theFile && fetch(theFile)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const uint8Array = new Uint8Array(buffer);
                console.log("CLICKED FILE BUFFER: ", uint8Array);
                // WebChucK.FS_createDataFile('/', 'my_audio.wav', uint8Array, true, true);
       });
    }, [clickedFile]);

    return (
         
            <Box
                id="waveSurferContainer"
                sx={{
                    display: "block",
                    zIndex: 9999,
                    position: "relative",
                    background: "rgba(28,28,28,0.98)",
                    pointerEvents: "auto",
                    overflow: "hidden",
                }}
            >
                <Button style={{zIndex: 9999}} onClick={testAudio}>
                    Play
                </Button>
                <Button style={{zIndex: 9999}} onClick={clipAudio}>
                    Clip
                </Button>
                <Button style={{zIndex: 9999}} onClick={transposeAudio}>
                    Transpose
                </Button>
                <WaveSurferPlayer
                    height={100}
                    waveColor="#4d91ff"
                    progressColor="#4D91ff"
                    // url="/my-server/audio.wav"
                    url={audioUrl}
                    onReady={onReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onPlayPause={onPlayPause}
                    // plugins={[RegionsPlugin.create()]}
                    plugins={regionsPlugin}
                />

            </Box>
    );
}
export default React.memo(FileWindow);;