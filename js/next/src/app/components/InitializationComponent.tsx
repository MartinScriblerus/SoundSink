"use client"

import Image from 'next/image'
import styles from './page.module.css'
import React, { useState, useDeferredValue } from 'react'
import Button from '@mui/material/Button';
import { Chuck } from 'webchuck'

interface AudioDestinationNode {
    state: string;
    close: () => void;
    createMediaStreamSource: (e: any) => MediaStreamAudioSourceNode;
    createMediaStreamDestination: () => any;
    resume: () => void;
    suspend: () => void;
    connect: (x: any, y: any, z: any) => void;
}

interface MediaStream {
    id: string;
    active: boolean;
}

interface AudioNode {
    destinationNode: AudioNode,
    output?: number | undefined,
    input?: number | undefined;
    destinationParam?: AudioParam;
}

interface MediaStreamAudioSourceNode extends AudioNode {
    createMediaStreamSource: (e: any) => MediaStreamAudioSourceNode | void;
}

interface MediaStreamAudioDestinationNode extends AudioNode {
    stream: MediaStream;
}

interface InitializationComponentProps {
    res:Response,
}


export default function InitializationComponent({res}: InitializationComponentProps) {
    const [chuckHook, setChuckHook] = useState<Chuck | undefined>();
    const aChuck: Chuck | undefined = useDeferredValue(chuckHook);


    const serverFilesToPreload = [
      {
        serverFilename: '/vocoder.ck',
        virtualFilename: 'vocoder.ck'
      },
      {
        serverFilename: '/AmbPan.chug.wasm',
        virtualFilename: 'chugins/AmbPan.chug.wasm'
      },
    ];
    
    const initChuck = async () => {
        if(typeof window === 'undefined') return;
        const theChuck = await Chuck.init(serverFilesToPreload, undefined, 2);
        console.log("The Chuck: ", theChuck);
        if (!theChuck) return;
        if (theChuck.context.state === "suspended") {
            const theChuckContext: any = theChuck.context;
            theChuckContext.resume();
        }
        setChuckHook(theChuck);
        console.log('OYYY ', res);

        await theChuck.loadChugin('chugins/AmbPan.chug.wasm');
        // await theChuck.runFile('/vocoder.ck');
    };

    const playChuck = async () => {
        if(typeof window === 'undefined') return;
        if (!aChuck) return;
        await aChuck.runCode(`

        adc => Gain g => NRev r => dac;
        0.4 => g.gain;
        0.9 => r.mix;

        while( true )
        {
            100::ms => now;
        }
        `);
    };

    const chuckMicButton = function () {
        console.log('chuckMicButton');
        if(typeof window === 'undefined') return;
        navigator.mediaDevices
            .getUserMedia({
                video: false,
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                },
            })
            .then(async (stream: MediaStream) => {
                console.log('aCHUCK ', aChuck);
                const ctx: any = aChuck?.context;
                const adc = ctx.createMediaStreamSource(stream);
                adc.connect(aChuck);
                micButton.disabled = true;
            })
        const micButton: any = document.querySelector(`#micButton`)
        micButton && (micButton.disabled = true)
    };
    
    return (
        <>
        {typeof window !== 'undefined' && window && (
            <>
            {!chuckHook && (<Button variant="contained" onClick={initChuck}>Start Chuck</Button>)}
            {chuckHook && (<Button variant="contained" onClick={playChuck}>Play Chuck</Button>)}
            {chuckHook && (<Button id="micButton" onClick={chuckMicButton}>Is it this easy?</Button>)}
            </>
        )}
        </>
    )
};
