import { Box } from '@mui/material';
import React, {useState, useEffect, SetStateAction, ReactElement, useRef} from 'react';
// import { store } from '../app/store';

interface Props {
    chuckHook: any;
    keysVisible: boolean;
    keysReady: boolean;
    // setKeyboard: React.Dispatch<SetStateAction<any>>;
    organizeRows: (rowNum: number, note: string) => Promise<void>;
    organizeLocalStorageRows: (theNote: any) => Promise<void>;
    playChuckNote: (note:any, idString: string, midiHz: any, midiNote: any) => any;
    compare: (a: any, b: any) => number;
    keyWid: string;
    notesAddedDetails: any;
};

const Keyboard = ({
    chuckHook, 
    keysVisible, 
    keysReady, 
    organizeRows, 
    organizeLocalStorageRows, 
    playChuckNote, 
    compare, 
    keyWid, 
    notesAddedDetails
}:Props) => {

    const [keysToDisplay, setKeysToDisplay] = useState<any>([]);
    const addedDetails = useRef<any>([]);
    
    useEffect(() => {
        (async() => {
            const theKeys = !keysReady && await createKeys();
            
            if(theKeys && keysToDisplay.length < 1) {
                setKeysToDisplay(theKeys);
            }
        })();
    }, [keysVisible])

    useEffect(() => {
        if (notesAddedDetails.length > 0) {
            addedDetails.current = notesAddedDetails;
        } else {
            return;
        }
    }, [chuckHook]);

    const tryPlayChuckNote = (e: any) => {
        console.log("HEY E! ", e.target);
        e.preventDefault();

        const removeHyphen = e.target.id.replace('-','');
        const convertPound_theNote = removeHyphen.replace('♯','#');

        console.log('what are added deails??? ', addedDetails.current);

        addedDetails.current && addedDetails.current.length > 0 && addedDetails.current.forEach(async (d: any, idx: number) => {
            if (convertPound_theNote === d.name) {
                playChuckNote(e, e.target.id, d.midiHz, d.midiNote);
            }
        });
    }

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
                    // console.log("WHAT IS NOTE? ", i, note);
                    organizeRows(i, note);
                });
            }
    
            const octave: any = i &&

                    
                    <span id={`octSpanWrapper-${i}`} key={`octSpanWrapper-${i}`}>
                        <li id={`C-${i}`} key={`C-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="white">{`C${i}`} </li>
                        <li id={`C♯-${i}`} key={`C♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="black">{`C♯${i}`}</li>
                        <li id={`D-${i}`} key={`D-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset">{`D${i}`}</li>
                        <li id={`D♯-${i}`} key={`D♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="black">{`D♯${i}`}</li>
                        <li id={`E-${i}`} key={`E-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset half">{`E${i}`}</li>
                        <li id={`F-${i}`} key={`F-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="white">{`F${i}`}</li>
                        <li id={`F♯-${i}`} key={`F♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="black">{`F♯${i}`}</li>
                        <li id={`G-${i}`} key={`G-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset">{`G${i}`}</li>
                        <li id={`G♯-${i}`} key={`G♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="black">{`G♯${i}`}</li>
                        <li id={`A-${i + 1}`} key={`A-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset">{`A${i + 1}`}</li>
                        <li id={`A♯-${i + 1}`} key={`A♯-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="black">{`A♯${i + 1}`}</li>
                        <li id={`B-${i + 1}`}  key={`B-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset half">{`B${i + 1}`}</li>
                    
                    
        
                    {/* </span> */}
                </span>

            const addBreak = <span className="break" key={`octaveBreakWrapper_${i}`}><br key={`octaveBreak_${i}`} /></span>;
       if (!document.querySelector(`#octSpanWrapper-${i}`)) {
            octaves.push(octave);
       
            const isOdd = i % 2;
            // console.log("GETTING OCTAVE? ", octave);
            // if (isOdd > 0 && window.innerWidth < 900) {
            //     octaves.push(addBreak);
            //     octaves.map((o: any) => {
            //         if (o.className === "break") {
            //             // o.style.display = "flex";
            //             o.removeChild();
            //         }
            //     });
                
            // } else {
                // const breaks = document.getElementsByClassName("break")
                octaves.map((o: any) => {
                    if (o.className === "break") {
                        // o.style.display = "none";
                        o.removeChild();
                    }
                });
            }
            // }
        }



        return octaves;
    }

  
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
                    // key={Math.random()}
                    key="keyboardInnerWrapper"
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