'use client';
import { createTheme } from '@mui/material/styles';
import { IVORY_WHITE, CORDUROY_RUST, HERITAGE_GOLD, OBERHEIM_TEAL, NEON_PINK, SLATE_GRAY } from './utils/constants';


const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primaryA: CORDUROY_RUST,
    primaryB: HERITAGE_GOLD,
    secondaryA: OBERHEIM_TEAL,
    secondaryB: NEON_PINK,
    black: '#000000',
    white: IVORY_WHITE,
    gray: SLATE_GRAY,
},
});

export default theme;