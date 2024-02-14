"use client"

import Image from 'next/image'
import styles from './page.module.css'
import React, { useEffect, useState, useDeferredValue } from 'react'
import Button from '@mui/material/Button';
import { Chuck } from 'webchuck'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./InitializationComponent'),
  { ssr: false }
);


declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
            text: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
            text?: string;
        };
    }
}

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


export default async function InitializationStyle(
    // props: {preloadedFiles: any}
    ) {

    // const {preloadedFiles} = props;

    const theme = createTheme({
        status: {
            danger: 'rgba(0,0,0,0.68)',
            text: 'rgba(255,255,255,0.87)',
        },
    });
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LOCAL; // start creating variables for envs
    // const res: any = await axios.get(`${baseUrl}/api/preloadedFiles`, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // }); <<< bring this back eventually
    console.log('baseURL ', baseUrl);

    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Box sx={{ 
                width: "100vw", 
                height: "100vh", 
                boxSizing: "border-box", 
                display: "flex", 
                flexDirection: "column", 
                border: "solid 5px green",
                backgroundColor: "rgba(255,255,255, 0.1",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <DynamicComponentWithNoSSR />
            </Box>
        </ThemeProvider>
    )
};