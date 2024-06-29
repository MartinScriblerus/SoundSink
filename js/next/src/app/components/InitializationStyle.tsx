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
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('./InitializationComponent'),
  { ssr: false }
);


declare module '@mui/material/styles' {
    interface Theme {
        palette: {
            primary: {
              main: "blue",
            }, 
            secondary: {
                main: "red",
              }, 
            background: {
                main: "#000000",
            }
        },
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



// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })


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

    // const baseUrl = getBaseUrl(); // start creating variables for envs
    // const res: any = await axios.get(`${baseUrl}/api/preloadedFiles`, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });
    // const awaitNote = async (note: string) => {
    //     return new Promise((resolve) => {
    //         const getVals = axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}api/note/${note}`, requestOptions);
    //         console.log('get vals? ',getVals);
    //         resolve(getVals);
    //     }).then(async (res: any) => {
    //         return await res.data;
    //         // setKeysReady(true);
    //     });
    // };

    // console.log('baseURL ', baseUrl);

    // useEffect(() => {
        // awaitNote('A4');
    // }, []);


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
                border: "solid 1px #000000",
                backgroundColor: "rgba(255,255,255, 0.1",
                alignItems: "center",
                justifyContent: "center",

                padding: 0,
                margin: 0,
                fontFamily: "Lobster"
            }}>
                <DynamicComponentWithNoSSR />
            </Box>
        </ThemeProvider>
    )
};