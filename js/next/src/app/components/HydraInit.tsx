// components/HydraInit.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Hydra from 'hydra-synth'

type HydraProps = {
    currentBeatCountToDisplay: number | any;
    fxRadioValue: string;
    bpm: number;  
}

export default function HydraInit(props: HydraProps) {
    const { currentBeatCountToDisplay, fxRadioValue, bpm } = props;
    const hydraRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // const [hydraTick, setHydraTick] = useState(0);
    const hydraTickRef = useRef<number>(0);

    useEffect(() => {
        let destroyed = false
    
        const initHydra = async () => {
          // Prevent double init
          if (hydraRef.current) return
    
          const hydraCanvas = document.querySelector('#hydraCanvas') as unknown as HTMLCanvasElement
          const babylonCanvas = document.querySelector('#babylonCanvas') as unknown as HTMLCanvasElement
          if (!hydraCanvas || !babylonCanvas) return
    
          const hydra = new Hydra({
            detectAudio: false,
            canvas: hydraCanvas,
            width: 320,
            height: 180,
          })
    
          hydraRef.current = hydra
    
          //const stream = babylonCanvas.captureStream()
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          const video = document.createElement('video')
    
          video.srcObject = stream
          video.autoplay = true
          video.muted = true
          video.playsInline = true
          video.style.display = 'none'
          document.body.appendChild(video)
          videoRef.current = video
    
          video.onloadedmetadata = () => {
            if (destroyed) return
            video.play()
            hydraRef.current.s[0].init({ src: video })
        //     const { synth } = hydraRef.current
        //     console.log('synth#### ', synth);
        //     console.log('hydra#### ', hydraRef.current);
        //     console.log('hydraTick#### ', hydraTick % 4);
        //     // synth.initCam();
        //     // synth.src(hydra.s[0]).modulate(synth.osc(10)).out()
            
       
        //     synth.osc(5, 0.09, 0.001)
        //     .kaleid([3,4,5,7,8,9,10])
        //     .color(0.5, 0.3)
        //     .colorama(0.4)
        //     .rotate(0.009,()=>Math.sin(synth.time)* -0.001 )
        //     .modulateRotate(synth.o0,()=>Math.sin(synth.time) * 0.003)
        //     .modulate(synth.o0, 0.09)
        //     .scale(0.9)
        // .blend(synth.src(hydraRef.current.s[0]))
        //     .out(synth.o0)


          }
        }
    
        initHydra()
    
        return () => {
          // Cleanup: stop video, remove DOM node, nullify refs
          destroyed = true
          if (videoRef.current) {
            const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks()
            tracks?.forEach(track => track.stop())
            videoRef.current.remove()
            videoRef.current = null
          }
    
          if (hydraRef.current) {
            // No built-in destroy method, but you can null the canvas context
            hydraRef.current = null
          }
        }
      }, [])
    
      // FX updates
      useEffect(() => {
        if (fxRadioValue && hydraRef.current) {
          console.log(`Selected FX: ${fxRadioValue}`)
          // You could re-route to different Hydra chains here
        }
      }, [fxRadioValue])
    
      // Beat tick updates
      useEffect(() => {
        if (
          currentBeatCountToDisplay && 
          hydraRef.current
        ) {
      
          // console.log(`Beat: ${Object.values(currentBeatCountToDisplay)}`)
          // setHydraTick(() => hydraTick+1);
          hydraTickRef.current = hydraTickRef.current + 1;
        
          const { synth } = hydraRef.current
          // console.log('synth#### ', synth);
          // console.log('hydra#### ', hydraRef.current);
          // console.log('hydraTick#### ', hydraTick % 4);
          // synth.initCam();
          // synth.src(hydra.s[0]).modulate(synth.osc(10)).out()
          
     
          synth.osc(5, 0.09, 0.001)
          .kaleid([hydraTickRef.current % 16 === 0 ? 3 : 40])
          .color(0.5, 0.3)
          .colorama(0.4)
          .rotate(0.009, hydraTickRef.current % 16 ? ()=>Math.sin(synth.time)* -0.001 : ()=>Math.sin(synth.time)* 0.01 )
          .modulateRotate(synth.o0,()=>Math.sin(synth.time) * 0.003)
          .modulate(synth.o0, hydraTickRef.current % 4 !== 0 ? 0.29 : 0.89)
          .scale(0.9)
      // .blend(synth.src(hydraRef.current.s[0]))
          .out(synth.o0)


          // Consider using beat to modulate synth params (osc freq, etc.)
        }
      }, [currentBeatCountToDisplay])
    
      return (
        <canvas
          id="hydraCanvas"
          style={{
            position: 'relative',
            // top: '50vh',
            // right: '400px',
            top: '0px',
            left: '0px',
            zIndex: 9999,
            pointerEvents: 'none',
            width: `140px`,
            height: '80px',
          }}
        />
      )
}