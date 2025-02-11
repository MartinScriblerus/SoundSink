// import React, {useState} from "react";
// import {Box, Button, ButtonGroup, useTheme} from "@mui/material";
// import 'src/app/page.module.css'

// const GroupedButtons = () => {
//     const [counter, setCounter] = useState<number>(0);

//     const theme = useTheme();

//     const handleIncrement = () => {
//         if (counter < 4) {
//             setCounter(counter + 1);
//         }
//     };

//     const handleDecrement = () => {
//         if (counter > 0) {
//             setCounter(counter - 1);
//         }
//     };

//     return (
//     <Box className="increment_decrement_signals">
//         <Button 
//             sx={{
//                 color: theme.palette.black, 
//                 borderColor: theme.palette.secondaryB,
//                 '&:hover': {
//                     color: theme.palette.white,
//                     background: theme.palette.primaryB,
//                 }
//             }}  
//             onClick={handleIncrement}>+</Button>
//         <Button 
//             sx={{
//                 color: theme.palette.black, 
//                 borderColor: theme.palette.secondaryB,
//                 '&:hover': {
//                     color: theme.palette.white,
//                     background: theme.palette.primaryB,
//                 }
//             }}  
//             onClick={handleDecrement}>-</Button>
//     </Box>
//     );

// }

// export default GroupedButtons;