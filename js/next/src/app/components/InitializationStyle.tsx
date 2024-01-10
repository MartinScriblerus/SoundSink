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
import axios from 'axios';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./InitializationComponent'),
  { ssr: false }
);


declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
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

interface InitializationStyleProps {
};

export default async function InitializationComponent({}: InitializationStyleProps) {

    const theme = createTheme({
        status: {
            danger: 'rgba(0,0,0,0.68)',
        },
    });

    const baseUrl = 'http://localhost:3000';
    const res: any = await axios.get(`${baseUrl}/api/preloadedFiles`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('res in gsp: ', res);
    
    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Box sx={{ border: "solid 5px green" }}>
                <DynamicComponentWithNoSSR res={res} />
            </Box>
        </ThemeProvider>
    )
};