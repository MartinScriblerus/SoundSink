import { Box, Button, FormLabel } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { useForm } from "react-hook-form";
import FileUploadIcon from '@mui/icons-material/FileUpload';


interface Props {
    onSubmit: (files: any) => Promise<void>;
    register: any;
    handleSubmit: any;
    watch: any;
    programIsOn: boolean;
    beginProgram: (val: boolean) => void;
}

const FileManager = (props: Props) => {
    // console.log("AYO AYO PROPS: ", props);
    // const { register, handleSubmit, watch } = useForm();
    const {onSubmit, handleSubmit, register, watch, beginProgram, programIsOn} = props;


    return (
        <>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Button
                component="label"
                sx={{ 
                    border: '0.5px solid #b2b2b2',
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(158, 210, 162, 0.8)',
                    position: 'relative', 
                    width: '140px',
                    background: 'rbga(0,0,0,.91)', 
                    marginLeft: '0px', 
                    // top: '188px',
                    zIndex: 15,
                    display: programIsOn ? "flex" : "none",
                    maxHeight: '40px',
                    '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                        // border: 'solid 1px #1976d2'
                    }
                }}
                className="ui_SynthLayerButton"
                // variant="outlined" 
                endIcon={<FileUploadIcon />}
            >
                {window.innerWidth < 900 ? <>File</> : <>File Upload</>}

               
                    <input
                        type={"file"}
                        {...register("file") } 
                        hidden={true}
                    />
             
          
            </Button>
            </form>
        </>
    )
}

export default FileManager;
