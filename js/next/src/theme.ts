// import { CREAM_WHITE, RUSTY_ORANGE, MATTE_BLACK, GOLDEN_YELLOW, PERRIWINKLE, HOT_PINK, STEEL_GRAY } from "@/utils/constants";
// // doesn't seem to work...
// const theme = {
//     colors: {
//         forestGreen: RUSTY_ORANGE,
//         matteBlack: MATTE_BLACK,
//         creamWhite: CREAM_WHITE,
//         mutedOlive: GOLDEN_YELLOW,
//         steelGray: STEEL_GRAY,
//         rustyOrange: HOT_PINK,
//         paleBlue: PERRIWINKLE,
//       },      
// };

// export default theme;

'use client';
import { createTheme } from '@mui/material/styles';
import { CREAM_WHITE, RUSTY_ORANGE, GOLDEN_YELLOW, PERRIWINKLE, HOT_PINK, STEEL_GRAY } from './utils/constants';


const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primaryA: RUSTY_ORANGE,
    primaryB: GOLDEN_YELLOW,
    secondaryA: PERRIWINKLE,
    secondaryB: HOT_PINK,
    black: '#000000',
    white: CREAM_WHITE,
    gray: STEEL_GRAY,
},
});

export default theme;