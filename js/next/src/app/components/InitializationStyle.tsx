"use client"

import React, { useMemo } from 'react';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

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
    interface ThemeOptions {
        colors?: {
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
    return (
        <Box 
            sx={{ 
                width: "100%", 
                height: "100%",
                display: "flex", 
                flexDirection: "column", 
            }}
        >
            <div id="modal-root"></div>
            <DynamicComponentWithNoSSR 
            />
        </Box>
    )
};