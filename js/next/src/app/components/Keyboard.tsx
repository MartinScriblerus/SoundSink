import { Box } from '@mui/material';
import React, {useState, useEffect, SetStateAction} from 'react';
// import { store } from '../app/store';

interface Props {
    chuckHook: any;
    keysVisible: boolean;
    keysReady: boolean;
    // setKeyboard: React.Dispatch<SetStateAction<any>>;
    organizeRows: (rowNum: number, note: string) => Promise<void>;
    organizeLocalStorageRows: (theNote: any) => Promise<void>;
    playChuckNote: (note:any) => any;
    compare: (a: any, b: any) => number;
    keyWid: string;
    // is17EqualTemperament: boolean;
};

const Keyboard = ({chuckHook, keysVisible, keysReady, organizeRows, organizeLocalStorageRows, playChuckNote, compare, keyWid}:Props) => {
    console.log("CHUCK HOOK IN KEYBOARD: ", chuckHook);

    const [keysToDisplay, setKeysToDisplay] = useState<any>([]);
    
    const createKeys = async () => {
        
        if (keysReady) {
            console.log('keys are ready');
            return;
        }

        // const rData = store.getState();
        const storedNamesUnparsed = localStorage.getItem("keyboard");
        const storedNames = storedNamesUnparsed ? JSON.parse(storedNamesUnparsed) : {};
        console.log("GOT STORED NAMES? ", storedNames);
        
        const octaves: Array<any> = [];


        // range from 0 to 10
        for (let i = 0; i < 9; i++) {
            
            // NEEED A CONDITIONAL ON DIFF 4LOOPS
            if (storedNames && storedNames.length === 108) {
                storedNames.sort( compare );
                [`C${i}`, `C♯${i}`, `D${i}`, `D♯${i}`, `E${i}`, `F${i}`, `F♯${i}`, `G${i}`, `G♯${i}`, `A${i}`, `A♯${i}`, `B${i}`].forEach((note) => {
                    organizeLocalStorageRows(storedNames.find((n: any) => n.note === note));
                });
            } else {
                
                [`C${i}`, `C♯${i}`, `D${i}`, `D♯${i}`, `E${i}`, `F${i}`, `F♯${i}`, `G${i}`, `G♯${i}`, `A${i}`, `A♯${i}`, `B${i}`].forEach((note) => {
                    console.log("WHAT IS NOTE? ", i, note);
                    organizeRows(i, note);
                });
            }
    
            const octave: any = i &&

                    
                    <React.Fragment key={`octSpanWrapper-${i}`}>
                        <li id={`C-${i}`} key={`C-${i}`} onClick={(e) => playChuckNote(e)} className="white">{`C${i}`} </li>
                        <li id={`C♯-${i}`} key={`C♯-${i}`} onClick={(e) => playChuckNote(e)} className="black">{`C♯${i}`}</li>
                        <li id={`D-${i}`} key={`D-${i}`} onClick={(e) => playChuckNote(e)} className="white offset">{`D${i}`}</li>
                        <li id={`D♯-${i}`} key={`D♯-${i}`} onClick={(e) => playChuckNote(e)} className="black">{`D♯${i}`}</li>
                        <li id={`E-${i}`} key={`E-${i}`} onClick={(e) => playChuckNote(e)} className="white offset half">{`E${i}`}</li>
                        <li id={`F-${i}`} key={`F-${i}`} onClick={(e) => playChuckNote(e)} className="white">{`F${i}`}</li>
                        <li id={`F♯-${i}`} key={`F♯-${i}`} onClick={(e) => playChuckNote(e)} className="black">{`F♯${i}`}</li>
                        <li id={`G-${i}`} key={`G-${i}`} onClick={(e) => playChuckNote(e)} className="white offset">{`G${i}`}</li>
                        <li id={`G♯-${i}`} key={`G♯-${i}`} onClick={(e) => playChuckNote(e)} className="black">{`G♯${i}`}</li>
                        <li id={`A-${i + 1}`} key={`A-${i + 1}`} onClick={(e) => playChuckNote(e)} className="white offset">{`A${i + 1}`}</li>
                        <li id={`A♯-${i + 1}`} key={`A♯-${i + 1}`} onClick={(e) => playChuckNote(e)} className="black">{`A♯${i + 1}`}</li>
                        <li id={`B-${i + 1}`}  key={`B-${i + 1}`} onClick={(e) => playChuckNote(e)} className="white offset half">{`B${i + 1}`}</li>
                    
                    
        
                    {/* </span> */}
                </React.Fragment>

            const addBreak = <span className="break" key={`octaveBreakWrapper_${i}`}><br key={`octaveBreak_${i}`} /></span>;
            console.log("WTF OCTAVE? ", octave);
            octaves.push(octave);
            const isOdd = i % 2;
            console.log("GETTING OCTAVE? ", octave);
            if (isOdd > 0 && window.innerWidth < 900) {
                octaves.push(addBreak);
                octaves.map((o: any) => {
                    if (o.className === "break") {
                        // o.style.display = "flex";
                        o.removeChild();
                    }
                });
                
            } else {
                // const breaks = document.getElementsByClassName("break")
                octaves.map((o: any) => {
                    if (o.className === "break") {
                        // o.style.display = "none";
                        o.removeChild();
                    }
                });

            }
        }



        return octaves;
    }

    useEffect(() => {
        (async() => {
            console.log("KEYS VISIBLE IN CHILD: ", keysVisible)
            const theKeys = !keysReady && await createKeys();
            
            if(theKeys && keysToDisplay.length < 1) {
                console.log("THE KEYS ", theKeys);
                setKeysToDisplay(theKeys);
            }
        })();
    }, [keysVisible])

    useEffect(() => {
        console.log("KEYS TO DISPLAY: ", keysToDisplay);
    }, [keysToDisplay]);
    let key = 1;
    return (
        <div id="keyboardWrapper" key="keyboardWrapper" style={{overflowX: "scroll"}}>
            {
                // chuckHook && Object.values(chuckHook).length && keysVisible
                chuckHook && Object.values(chuckHook).length 
                && keysVisible
                &&
                    <Box 
                    key={Math.random()}
                      sx={{
                        position: 'relative', 
                        display: 'inline-block', 
                        // left: "208px",
                        bottom: "0px",
                        // width: 'calc(100% - 200px)', 
                        right: 0, 
                        zIndex: '100'}}
                    >
                        <ul id="keyboard" key={"keyboard"} >
                            {keysToDisplay && keysToDisplay.length > 0 && keysToDisplay.map((data: any, idx: number) => {
                                console.log("OY DATA: ", data);
                                if (data === 0) {
                                    return;
                                }
                                
                                return (
                                   idx && <span key={idx.toString()}>{data}</span>
                                )
                            })}
                        </ul>
                    </Box>
  
            }
        </div>
    )
};
export default Keyboard;