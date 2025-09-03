import { HERITAGE_GOLD } from "@/utils/constants";
import { Box, Button } from "@mui/material";
import { Chuck } from "webchuck";


type FileManagerProps = {
    handleSubmit: (callback: (data: any) => void) => (event: React.FormEvent<HTMLFormElement>) => void;
    chuckHook: Chuck;
    register: (name: string) => { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void };
    onSubmit: (data: any) => Promise<void>;
    handleButtonClick: () => void;
    FileUploadIcon: any;
    inputRef: any;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileManager = (props: FileManagerProps) => {
    const { handleSubmit, chuckHook, register, onSubmit, handleButtonClick, FileUploadIcon, inputRef, handleFileChange } = props;
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
        }}
        >
            <Box sx={{
                display: chuckHook ? "flex" : "none",
                flexDirection: "row",
                width: "100%",
            }}
            >
                <form
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={(e) => {
                            register("file");
                            inputRef.current = e;
                        }}
                        onChange={handleFileChange}
                    />              
                        
                    <Button
                        component="label"
                        sx={{
               border: `solid 1px ${HERITAGE_GOLD}`,
                backgroundColor: chuckHook && 'rgba(28,28,28,0.78)',
                color: 'rgba(245,245,245,0.78)',
                height: '48px',
            
                width: '100%',
               // marginBottom: '4px',
                minHeight: '48px',
                display: "flex",
                zIndex: '99',
                pointerEvents: "auto",
                cursor: "pointer",
                '&:hover': {
                  color: 'rgba(245,245,245,0.78)',
                  background: HERITAGE_GOLD,
                }
              }}
              className="ui_SynthLayerButton"

           
                        // className="ui_SynthLayerButton"
                        onClick={handleButtonClick}
                        endIcon={<FileUploadIcon />}
                    >
                        <>FILE</>
                    </Button>
                </form>
            </Box>
        </Box>

    )
};
export default FileManager;
