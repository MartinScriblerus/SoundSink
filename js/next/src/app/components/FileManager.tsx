import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { PALE_BLUE } from "@/utils/constants";



interface Props {
    onSubmit: (files: any) => Promise<void>;
    register: any;
    handleSubmit: any;
    watch: any;
    programIsOn: boolean;
    // beginProgram: (val: boolean) => void;
}

const FileManager = (props: Props) => {

    const {onSubmit, handleSubmit, register, watch} = props;

    const theme = useTheme();

    // useEffect(() => {
    //     const subscription = watch(() => handleSubmit(onSubmit)())
    //     console.log('SUBSCRIPTION: ', subscription); // what is this for???qw2e3
    //     return () => subscription.unsubscribe();
    // }, [handleSubmit, watch, register]);

    return (
        // <Box sx={{
        //     display: "flex",
        //     flexDirection: "row",
        //     width: "100%",
        // }}>
         <form
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
            }} 
            onSubmit={handleSubmit(onSubmit)}>
                <Button
                    component="label"
                    sx={{ 
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        cursor: "pointer",
                        // border: 'rgba(0,0,0,0.78)',
                        // background: 'rgba(0,0,0,0.78)',
                        color: 'rgba(255,255,255,0.78)',
                        position: 'relative', 
                        minWidth: '140px',
                        marginLeft: '0px', 
                        // zIndex: 15,
                        maxHeight: '40px',
                        '&:hover': {
                            background: PALE_BLUE,
                        }
                    }}
                    // className="ui_SynthLayerButton"

                    endIcon={<FileUploadIcon />}
                >
                    {<>File</>}
                    <input
                        type={"file"}
                        {...register("file") } 
                        hidden={true}
                    />
                </Button>
            </form>
        // {/* </Box> */}
    )
}

export default FileManager;
