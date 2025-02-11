"use client"

// import Image from 'next/image'
// import styles from './page.module.css'
import React, { useMemo } from 'react';


import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
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

interface AudioNode {
    destinationNode: AudioNode,
    output?: number | undefined,
    input?: number | undefined;
    destinationParam?: AudioParam;
}




export default function InitializationStyle() {

    // const headerDict = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Headers': 'Content-Type',
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS"
    // }
    // const requestOptions = {                                                                                                                                                                                 
    //     headers: headerDict,
    //     params: {
    //         key: 'A'
    //     }
    // };

    return (
        <Box 
            sx={{ 
                width: "100%", 
                height: "100%",
                display: "flex", 
                flexDirection: "column", 
            }}
        >
            <DynamicComponentWithNoSSR 
            />
        </Box>
    )
};