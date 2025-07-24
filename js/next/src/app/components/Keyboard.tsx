import { flatToSharp } from '@/utils/chuckHelper';
import { Box } from '@mui/material';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
    chuckHook: any;
    keysVisible: boolean;
    keysReady: boolean;
    organizeRows: (rowNum: number, note: string) => Promise<void>;
    organizeLocalStorageRows: (theNote: any) => Promise<void>;
    noteOnPlay: (midiNote: number, midiVelocity: number, midiHz?: number) => any;
    noteOffPlay: (midiNote: number) => any;
    compare: (a: any, b: any) => number;
    noteBuilderFocus?: string;
    notesAddedDetails: any;
    // updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any) => void;
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
    noteBuilderFocus,
    notesAddedDetails,
    // updateKeyScaleChord,
    mingusKeyboardData,
    mingusChordsData
}: Props) => {
    const [keysToDisplay, setKeysToDisplay] = useState<any>([]);
    const addedDetails = useRef<any>(notesAddedDetails);
    const [updateKeysScale, setUpdateKeysScale] = useState<any>([]);

    useEffect(() => {
        if (notesAddedDetails && notesAddedDetails.length > 0) {
            console.log("NOTES ADDED DETAILS??? : ", notesAddedDetails);
            const noDupesAddedDetails: any = Array.from(
                new Map(notesAddedDetails.map((note: any) => [note.midiNote, note])).values()
              );
            addedDetails.current = noDupesAddedDetails;
        }
    }, [notesAddedDetails]);

    // useEffect(() => {
    //     setKeysToDisplay([]);
    // }, [mingusKeyboardData])


    const tryPlayChuckNote = useCallback((e: any) => {
        e.preventDefault();
    
        const removeHyphen = e.target.id.replace('-', '');
        const convertPoundTheNote = removeHyphen.replace('♯', '#');
    
        // console.log("A D D E D * D E T A I L S ! ", addedDetails.current.length, addedDetails.current);
    
        const match:any = Array.from(addedDetails.current).find((d: any) => convertPoundTheNote === d.name);
        if (match) {
            // console.log("about to noteOnPlay... CHUCK NOTE match: ", match);
            noteOnPlay(match.midiNote, match.midiHz, match.midiHz);
        }
    }, [addedDetails, noteOnPlay]);


    useEffect(() => {

        const createKeys = async () => {
            if (keysReady) {
                return;
            }

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
                        <li id={`A-${i}`} key={`A-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset">{`A${i}`}</li>
                        <li id={`A♯-${i}`} key={`A♯-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey black">{`A♯${i}`}</li>
                        <li id={`B-${i}`} key={`B-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="vizKey white offset half">{`B${i}`}</li>
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
        keysReady,
        compare,
        // noteOnPlay,
        // noteOffPlay,
        updateKeysScale,
        mingusKeyboardData,
        organizeRows,
        organizeLocalStorageRows,
        tryPlayChuckNote,
    ]);

    useEffect(() => {
        // console.log("@@@ MINGUS KEYBOARD DATA: ", mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]);
        // console.log("@@@ MINGUS CHORDS DATA: ", mingusChordsData && typeof mingusChordsData === "string" ? JSON.parse(mingusChordsData) : mingusChordsData);

        if (mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]) {
            const allKeyz = document.querySelectorAll(`.vizKey`);
            // console.log("ALLKYZ ", allKeyz);
            let normalizedKeyId: any;
            allKeyz.forEach((key: any) => {
                normalizedKeyId = key.id;
                key.classList.remove('activeVizKey');
                // console.log("FUQIN KEY!!! ", key);
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

            // console.log("THIS IS A SANITY CHECK ON MINGUS DATA IN updateKeysScale: ", mingusKeyboardData && mingusKeyboardData.data && mingusKeyboardData.data[0]);

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