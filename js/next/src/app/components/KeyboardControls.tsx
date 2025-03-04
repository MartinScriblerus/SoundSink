import { Box, FormLabel, SelectChangeEvent, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { KeyboardProps } from '@/types/audioTypes';

const KeyboardControls = (
   {        
        chuckHook,
    }
    : KeyboardProps
) => {


    return (
        <Box 
            sx={{
                color: `rgba(0,0,0,0.78) !important`, 
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'left',
                display: chuckHook ? 'flex': 'none',
                fontFamily: 'monospace',
            }}>
        </Box>
    )
}
export default KeyboardControls;