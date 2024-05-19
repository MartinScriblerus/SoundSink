import { Box, Button, FormLabel } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { useForm } from "react-hook-form";
import FileUploadIcon from '@mui/icons-material/FileUpload';


interface Props {
    onSubmit: (files: any) => Promise<void>;
    register: any;
    handleSubmit: any;
    watch: any;
}

const FileManager = (props: Props) => {
    // console.log("AYO AYO PROPS: ", props);
    // const { register, handleSubmit, watch } = useForm();
    const {onSubmit, handleSubmit, register, watch} = props;


    return (
        <>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Button
                component="label"
                sx={{ 
                    borderColor: 'rgba(228,225,209,1)', 
                    color: 'rgba(0,0,0,.98)',
                    backgroundColor: 'rgba(158, 210, 162, 1)',
                    position: 'absolute', 
                    minWidth: '104px',
                    background: 'rbga(0,0,0,.91)', 
                    left: '12px', 
                    top: '188px',
                    zIndex: 1000,
                    '&:hover': {
                        color: '#f5f5f5'
                    }
                }} 
                variant="outlined" 
                endIcon={<FileUploadIcon />}
            >
                File

               
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
