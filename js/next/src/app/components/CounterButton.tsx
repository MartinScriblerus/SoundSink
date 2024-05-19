import React, {useState} from "react";
import {Box, Button, ButtonGroup} from "@mui/material";
import 'src/app/page.module.css'

const GroupedButtons = () => {
        const [counter, setCounter] = useState<number>(0);

    const handleIncrement = () => {
        if (counter < 4) {
            setCounter(counter + 1);
        }
    };

    const handleDecrement = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };

    return (
    <Box className="increment_decrement_signals">
        <Button 
            sx={{
                color: 'rgba(228,225,209,1)', 
                borderColor: 'rgba(147,206,214, 1)',
                '&:hover': {
                    color: '#f5f5f5'
                  }
            }}  
            onClick={handleIncrement}>+</Button>
        <Button 
            sx={{
                color: 'rgba(228,225,209,1)', 
                borderColor: 'rgba(147,206,214, 1)',
                '&:hover': {
                    color: '#f5f5f5'
                  }
            }}  
            onClick={handleDecrement}>-</Button>
    </Box>
    );

}

export default GroupedButtons;