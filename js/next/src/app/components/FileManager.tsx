import { Box, Button, FormLabel } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { useForm } from "react-hook-form";
import FileUploadIcon from '@mui/icons-material/FileUpload';


interface Props {
    onSubmit: (files: any) => Promise<void>;
}

const FileManager = (props: Props) => {
    const { register, handleSubmit, watch } = useForm();
    const {onSubmit} = props;
    const [recordedFileToLoad, setRecordedFileToLoad] = useState(false);
    const [rtAudio, setRtAudio] = useState<any>(null);
    const [deviceLabelsOpen, setDeviceLabelsOpen] = useState<boolean>(false);
    const [uploadedFileName, setUploadedFileName] = useState<string>('')
    const uploadedFilesRef: any = useRef([]);
    const suggestedNameRef = useRef<string>("");
// console.log('HEEEEEERE')
      useEffect(() => {
        console.log('HERE! ')
        const subscription = watch(() => handleSubmit(onSubmit)())
        return () => subscription.unsubscribe();
    }, [handleSubmit, watch, register]);
    
    // const createFileFormCurrentRecordedData = async (recordedData: Array<any>) => {
    //     const blob = new Blob(recordedData , {type: "audio/wav"});
    //     const file = new File( [ blob ], suggestedNameRef.current, { type: "audio/wav"} );
    //     let url = URL.createObjectURL(blob);
    //     let a: any = await document.createElement("a");
    //     a.style = "z-index: 1000; position: absolute; top: 0px; left: 0px; background: green";
    //     a.href = url;
    //     document.body.appendChild(a);
    
    //     uploadedFilesRef.current.push(file);
    //     setRecordedFileToLoad(true);
    //     a.download = file;
    // }

    return (
        <>
            <Button
                component="label"
                sx={{
                    color: 'rgba(228,225,209,1)', 
                    borderColor: 'rgba(228,225,209,1)', 
                    position: 'absolute', 
                    minWidth: '74px', 
                    left: '12px', 
                    top: '188px',
                    zIndex: 1000,
                    
                }} 
                variant="outlined" 
                endIcon={<FileUploadIcon />}
            >
                Fl

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type={"file"}
                        {...register("file") } 
                        hidden={true}
                    />
                </form>
            </Button>
        </>
    )
}

export default FileManager;
