import { Box, Button, FormLabel, useTheme } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { useForm } from "react-hook-form";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import theme from "../styles/theme";


interface Props {
    onSubmit: (files: any) => Promise<void>;
    register: any;
    handleSubmit: any;
    watch: any;
    programIsOn: boolean;
    beginProgram: (val: boolean) => void;
}

const FileManager = (props: Props) => {

    const {onSubmit, handleSubmit, register, watch, beginProgram, programIsOn} = props;

    const theme = useTheme();

    return (
        <Box sx={{
            display: programIsOn ? "flex" : "none",
            flexDirection: "row",
            width: "100%",
        }}>
         <form
         style={{
            display: programIsOn ? "flex" : "none",
            flexDirection: "row",
            width: "100%",
         }} 
            onSubmit={handleSubmit(onSubmit)}>
            <Button
                component="label"
                sx={{ 
                    display: programIsOn ? "flex" : "none",
                    flexDirection: "row",
                    width: "100%",
                    cursor: "pointer",
                    border: theme.palette.primaryB,
                    background: theme.palette.black,
                    color: theme.palette.white,
                    position: 'relative', 
                    minWidth: '140px',
                    marginLeft: '0px', 
                    zIndex: 15,
                    maxHeight: '40px',
                    '&:hover': {
                        color: theme.palette.primaryA,
                        background: theme.palette.secondaryA,
                    }
                }}
                // className="ui_SynthLayerButton"

                endIcon={<FileUploadIcon />}
            >
                {window.innerWidth < 900 ? <>File</> : <>File</>}

               
                    <input
                        type={"file"}
                        {...register("file") } 
                        hidden={true}
                    />
             
          
            </Button>
            </form>
        </Box>
    )
}

export default FileManager;
