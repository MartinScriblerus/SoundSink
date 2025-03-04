import { Box, Button } from '@mui/material';
import React from 'react';


interface FileWrapperProps {
    filesToProcess: any;
    selectFileForAssignment: (e: Event) => void;
}

const FileWrapper = (props: FileWrapperProps) => {
    const {filesToProcess, selectFileForAssignment} = props;
  
    return (
        
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>              
            <Box
                id="lookhere"
                key="fileNameWrapper"
                style={{
                    position: "relative",
                    zIndex: 1000,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>YOYOYOYOYOYO
                {
                    filesToProcess && filesToProcess.length > 0 && (
                        filesToProcess.map((file: any, idx: number) => {
                            return (
                                <Box
                                    key={`selector_wrapper_${file.name}_${idx}`}
                                >
                                    <Button
                                        id={`fileChoice_${idx}`}
                                        key={`selector_${file.filename}_${idx}`}
                                        onClick={((e: any) => selectFileForAssignment(e))}>
                                        <p>{file.name}</p>
                                    </Button>

                                </Box>
                            )
                        })
                    )
                }
            </Box>
        </Box>
    )
}
export default FileWrapper;