"use client"

import Image from 'next/image'
import styles from './page.module.css'
import React, { useDeferredValue } from 'react'
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
import { Inter } from 'next/font/google'
import { getBaseUrl } from '@/utils/siteHelpers';
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { CREAM_WHITE, FOREST_GREEN, MATTE_BLACK, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE, STEEL_GRAY } from '@/utils/constants';
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('./InitializationComponent'),
  { ssr: false }
);


declare module '@mui/material/styles' {
    
    interface PaletteOptions {
        primaryA: string;
        primaryB: string;
        secondaryA: string;
        secondaryB: string;
        black: string;
        white: string;
        gray: string;
    }
        
    interface Theme {
        palette: {
            primaryA: string;
            secondaryA:string; 
            primaryB: string;
            secondaryB: string;
            black: string;
            gray: string;
            white: string;
        },
        status: {
            danger: string;
            text: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        colors?: {
            // danger?: string;
            // text?: string;
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


// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

type StyleProps = {
    onChuckScreen:()=>void;
} 

export default async function InitializationStyle(
    // props: {preloadedFiles: any}
    ) {
    // const {preloadedFiles} = props;

    const theme = createTheme({
        palette: {
            primaryA: FOREST_GREEN,
            primaryB: MUTED_OLIVE,
            secondaryA: PALE_BLUE,
            secondaryB: RUSTY_ORANGE,
            black: MATTE_BLACK,
            white: CREAM_WHITE,
            gray: STEEL_GRAY,
        },
            
    });
    
    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS"
    }
    const requestOptions = {                                                                                                                                                                                 
        headers: headerDict,
        params: {
            key: 'A'
        }
    };


    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Box 
            sx={{ 
                width: "100vw", 
                height: "100vh", 
                boxSizing: "border-box", 
                display: "flex", 
                flexDirection: "column", 
                border: theme.palette.primaryB,
                backgroundColor: theme.palette.white,
                alignItems: "center",
                justifyContent: "center",

                padding: 0,
                margin: 0,
                fontFamily: "Lobster"
            }}>
                <style jsx global>{`
                    html {
                    font-family: ${inter.style.fontFamily};
                    }
                `}</style>
                <DynamicComponentWithNoSSR 
                />
            </Box>
        </ThemeProvider>
    )
};