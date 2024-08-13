import { Box, Button } from '@mui/material';
import React from 'react';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

interface FileWrapperProps {
    filesToProcess: any;
    selectFileForAssignment: (e: Event) => void;
    sortFileItemUp: (e: Event) => void;
    sortFileItemDown: (e: Event) => void;
}

const FileWrapper = (props: FileWrapperProps) => {
    const {filesToProcess, selectFileForAssignment, sortFileItemUp, sortFileItemDown} = props;
    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* <>    
                <Box 
                  sx={{
                    backgroundColor: 'rgba(30,34,26,0.96)', 
                    width:'100%', 
                    display:'flex', 
                    flexDirection: 'column',
                    minHeight:'100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Button sx={{
                      color: 'rgba(228,225,209,1)', 
                      borderColor: 'rgba(228,225,209,1)', 
                      position: 'absolute', 
                      minWidth: '48px', 
                      zIndex: 1001,
                      top: "70px",
                      right: '12px', 
                      '&:hover': {
                        color: '#f5f5f5',
                        background: 'rgba(0,0,0,.98)',
                      }
                    }} 
                    id="findme"
                    aria-describedby={id} 
                    variant="outlined" 
                    onClick={handleShowBPM} 
                    // startIcon={<Inventory2Icon />}
                  >
                <Inventory2Icon />
              </Button> */}
            <Box
                id="lookhere"
                key="fileNameWrapper"
                style={{
                    position: "relative",
                    top: "112px",
                    right: "12px",
                    zIndex: 1000,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                {
                    filesToProcess.length > 0 && (
                        filesToProcess.map((file: any, idx: number) => {
                            return (
                                <Box
                                    key={`selector_wrapper_${file.name}_${idx}`}
                                >
                                    <Button
                                        id={`fileChoice_${idx}`}
                                        key={`selector_${file.name}_${idx}`}
                                        onClick={((e: any) => selectFileForAssignment(e))}>
                                        <p>{file.name}</p>
                                        {/* <Button onClick={handleClickUploadedFiles} variant="contained" color="primary">
                            Upload
                          </Button> */}
                                    </Button>
                                    <Button
                                        key={`selector_up_${file.name}_${idx}`}
                                        sx={{ maxWidth: '12px', pointerEvents: 'all' }}
                                        id={`${idx}_${file.name}_up`}
                                        onClick={(e: any) => sortFileItemUp(e)}
                                    >
                                        <KeyboardDoubleArrowUpIcon sx={{ cursor: "pointer", pointerEvents: "none" }} key={`selector_up_icon_${file.name}_${idx}`} fontSize="small" />
                                    </Button>
                                    <Button
                                        key={`selector_down_${file.name}_${idx}`}
                                        sx={{ maxWidth: '12px', pointerEvents: 'all' }}
                                        id={`${idx}_${file.name}_down`}
                                        onClick={(e: any) => sortFileItemDown(e)}
                                    >
                                        <KeyboardDoubleArrowDownIcon sx={{ cursor: "pointer", pointerEvents: "none" }} key={`selector_down_icon_${file.name}_${idx}`} fontSize="small" />
                                    </Button>
                                </Box>
                            )
                        })
                    )
                }
            </Box>
        </Box>
        // </>  
        //   </Box>
    )
}
export default FileWrapper;