// import { CREAM_WHITE, FOREST_GREEN, MATTE_BLACK, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE, STEEL_GRAY } from "@/utils/constants";
// // doesn't seem to work...
// const theme = {
//     colors: {
//         forestGreen: FOREST_GREEN,
//         matteBlack: MATTE_BLACK,
//         creamWhite: CREAM_WHITE,
//         mutedOlive: MUTED_OLIVE,
//         steelGray: STEEL_GRAY,
//         rustyOrange: RUSTY_ORANGE,
//         paleBlue: PALE_BLUE,
//       },      
// };

// export default theme;

'use client';
import { createTheme } from '@mui/material/styles';
import { CREAM_WHITE, FOREST_GREEN, MATTE_BLACK, MUTED_OLIVE, PALE_BLUE, RUSTY_ORANGE, STEEL_GRAY } from './utils/constants';


const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
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

export default theme;