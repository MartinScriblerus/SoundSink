import { Box } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface Props {
    chuckHook: any;
    keysVisible: boolean;
    keysReady: boolean;
    organizeRows: (rowNum: number, note: string) => Promise<void>;
    organizeLocalStorageRows: (theNote: any) => Promise<void>;
    noteOnPlay: (midiNote: number, midiVelocity: number, midiHz?: number) => any;
    noteOffPlay: (midiNote: number) => any;
    compare: (a: any, b: any) => number;
    notesAddedDetails: any;
    updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any) => void;
    mingusKeyboardData: any;
    mingusChordsData: any;
};

const Keyboard = ({
    chuckHook,
    keysVisible,
    keysReady,
    organizeRows,
    organizeLocalStorageRows,
    noteOnPlay,
    noteOffPlay,
    compare,
    notesAddedDetails,
    updateKeyScaleChord,
    mingusKeyboardData,
    mingusChordsData
}: Props) => {
    const [keysToDisplay, setKeysToDisplay] = useState<any>([]);
    const addedDetails = useRef<any>(notesAddedDetails);
    const [updateKeysScale, setUpdateKeysScale] = useState<any>([]);

    useEffect(() => {
        if (notesAddedDetails && notesAddedDetails.length > 0) {
            addedDetails.current = notesAddedDetails;
        }
    }, [notesAddedDetails]);

    // useEffect(() => {
    //     setKeysToDisplay([]);
    // }, [mingusKeyboardData])

    useEffect(() => {

        const tryPlayChuckNote = (e: any) => {
            e.preventDefault();
    
            const removeHyphen = e.target.id.replace('-', '');
            const convertPoundTheNote = removeHyphen.replace('♯', '#');
            console.log("A D D E D * D E T A I L S ! ", addedDetails);
            addedDetails.current && addedDetails.current.length > 0 &&
            addedDetails.current.forEach(async (d: any) => {
                // console.log("CAN WE PLAY CHUCK NOTE??: ", d, "convertPoundTheNote ", convertPoundTheNote);
                if (convertPoundTheNote === d.name) {
                    console.log("TRYING TO PLAY CHUCK NOTE: ", d);
                    noteOnPlay(d.midiNote, d.midiHz, d.midiHz); 
                }
                noteOffPlay(d.midiNote);
            });
        };



        const createKeys = async () => {
            if (keysReady) {
                return;
            }
            console.log("HEYA TEST UPDATE NOW???!!!*** ", updateKeysScale);
            const storedNamesUnparsed = localStorage.getItem('keyboard');
            const storedNames = storedNamesUnparsed ? JSON.parse(storedNamesUnparsed) : {};

            const octaves: Array<any> = [];
            for (let i = 0; i < 9; i++) {
                if (storedNames && storedNames.length === 108) {
                    storedNames.sort(compare);
                    [`C${i}`, `C♯${i}`, `D${i}`, `D♯${i}`, `E${i}`, `F${i}`, `F♯${i}`, `G${i}`, `G♯${i}`, `A${i}`, `A♯${i}`, `B${i}`].forEach((note) => {
                        organizeLocalStorageRows(storedNames.find((n: any) => n.note === note));
                    });
                } else {
                    [`C${i}`, `C♯${i}`, `D${i}`, `D♯${i}`, `E${i}`, `F${i}`, `F♯${i}`, `G${i}`, `G♯${i}`, `A${i}`, `A♯${i}`, `B${i}`].forEach((note) => {
                        organizeRows(i, note);
                    });
                }

                console.log("@@@#### MINGUS KEYBOARD DATA: ", mingusKeyboardData && mingusKeyboardData.length > 0 && [...mingusKeyboardData[0], ...mingusKeyboardData[0]]);
                
                const octave: any = i && (
                    <span id={`octSpanWrapper-${i}`} key={`octSpanWrapper-${i}`}>
                        <li 
                        style={{
                            background: mingusKeyboardData && mingusKeyboardData.length > 1 && mingusKeyboardData[0].includes(`C`) 
                            ? 'blue' 
                            : mingusKeyboardData && mingusKeyboardData.length > 1 && mingusKeyboardData[1].includes(`C`) 
                                ? 
                                'green'
                                : 
                                ''
                        }} id={`C-${i}`} key={`C-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white">{`C${i}`} </li>
                        <li id={`C♯-${i}`} key={`C♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`C♯${i}`}</li>
                        <li id={`D-${i}`} key={`D-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset">{`D${i}`}</li>
                        <li id={`D♯-${i}`} key={`D♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`D♯${i}`}</li>
                        <li id={`E-${i}`} key={`E-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset half">{`E${i}`}</li>
                        <li id={`F-${i}`} key={`F-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white">{`F${i}`}</li>
                        <li id={`F♯-${i}`} key={`F♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`F♯${i}`}</li>
                        <li id={`G-${i}`} key={`G-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset">{`G${i}`}</li>
                        <li id={`G♯-${i}`} key={`G♯-${i}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`G♯${i}`}</li>
                        <li id={`A-${i + 1}`} key={`A-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset">{`A${i + 1}`}</li>
                        <li id={`A♯-${i + 1}`} key={`A♯-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`A♯${i + 1}`}</li>
                        <li id={`B-${i + 1}`} key={`B-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset half">{`B${i + 1}`}</li>
                    </span>
                );

                if (!document.querySelector(`#octSpanWrapper-${i}`)) {
                    octaves.push(octave);
                }
            }
            return octaves;
        };
        if (chuckHook && chuckHook.length > 0 && keysToDisplay.length > 0) return;
        (async () => {
            const theKeys = !keysReady && (await createKeys());
            if (theKeys && keysToDisplay.length < 1) {
                setKeysToDisplay(theKeys);
            }
        })();
    }, [
        chuckHook,
        keysToDisplay.length,
        keysReady,compare,
        noteOnPlay,
        noteOffPlay,
        organizeRows,
        organizeLocalStorageRows
    ]);

    const flatToSharp = (oldKeyId: string) => {

        let newKeyId;

        if (oldKeyId.includes('b')) {
            if (oldKeyId.includes('A')) {
               newKeyId = 'G#'; 
            } else if (oldKeyId.includes('B')) {
                newKeyId = 'A#';
            } else if (oldKeyId.includes('D')) {
                newKeyId = 'C#';
            } else if (oldKeyId.includes('E')) {
                newKeyId = 'D#';
            } else if (oldKeyId.includes('G')) {
                newKeyId = 'F#';
            } else if (oldKeyId) {
                newKeyId = oldKeyId;
                if (oldKeyId !== "F" && oldKeyId !== "C") {
                    console.log("what is this key?? ", oldKeyId);
                }
            }        
            console.log("FLAT TO SHARP: ", oldKeyId, "/// ", newKeyId);
        } else {
            newKeyId = oldKeyId;
        }


        return newKeyId;
    };

    useEffect(() => {
        console.log("@@@ MINGUS KEYBOARD DATA: ", mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]);
        console.log("@@@ MINGUS CHORDS DATA: ", mingusChordsData);

        if (mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]) {
            const allKeyz = document.querySelectorAll(`.vizKey`);
            // console.log("ALLKYZ ", allKeyz);
            let normalizedKeyId: any;
            allKeyz.forEach((key: any) => {
                normalizedKeyId = key.id;
                key.classList.remove('activeVizKey');
                console.log("FUQIN KEY!!! ", key);
                normalizedKeyId = flatToSharp(key.id);

                const hasMatch = normalizedKeyId && mingusKeyboardData.data[0].map((i: any) => i && i.toLowerCase()).indexOf(normalizedKeyId[0].toLowerCase())
                const keyIsNotSharp = normalizedKeyId && !normalizedKeyId.includes("♯") && !normalizedKeyId.includes("#")

                const matchIsNotSharp = mingusKeyboardData.data[0] && mingusKeyboardData.data[0][hasMatch] && !mingusKeyboardData.data[0][hasMatch].includes("♯") && !mingusKeyboardData.data[0][hasMatch].includes("#");
                const bothSharpOrNot = mingusKeyboardData.data[0] && mingusKeyboardData.data[0][hasMatch] && (matchIsNotSharp === keyIsNotSharp);

                if (hasMatch >= 0 && bothSharpOrNot) {
                    mingusKeyboardData.data[0][hasMatch] && bothSharpOrNot &&
                    key.classList.add('activeVizKey');
                }
                if (!keyIsNotSharp && !matchIsNotSharp) {
                    key.classList.add('activeVizKey');
                }
            });

            setUpdateKeysScale(mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]);
        }
    }, [mingusKeyboardData, mingusChordsData]);

    return (
        <div
            id="keyboardWrapper"
            key="keyboardWrapper"
        >
            {chuckHook && Object.values(chuckHook).length && keysVisible && (
                <Box
                    id="keyboardBox"
                >
                    <ul id="keyboard" key={'keyboard'}>
                        {keysToDisplay &&
                            keysToDisplay.length > 0 &&
                            keysToDisplay.map((data: any, idx: number) => {
                                if (data === 0) {
                                    return;
                                }
                                return <span key={idx.toString()}>{data}</span>;
                            })}
                    </ul>
                </Box>
            )}
        </div>
    );
};
export default Keyboard;