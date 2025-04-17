import { Box } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import ShowFXView from './ShowFXBtn';
import MingusPopup from './MingusPopup';

interface Props {
    chuckHook: any;
    keysVisible: boolean;
    keysReady: boolean;
    organizeRows: (rowNum: number, note: string) => Promise<void>;
    organizeLocalStorageRows: (theNote: any) => Promise<void>;
    noteOnPlay: (midiNote: number, midiVelocity: number, midiHz?: number) => any;
    compare: (a: any, b: any) => number;
    notesAddedDetails: any;
    updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any) => void;
};

const Keyboard = ({
    chuckHook,
    keysVisible,
    keysReady,
    organizeRows,
    organizeLocalStorageRows,
    noteOnPlay,
    compare,
    notesAddedDetails,
    updateKeyScaleChord
}: Props) => {
    const [keysToDisplay, setKeysToDisplay] = useState<any>([]);
    const addedDetails = useRef<any>(notesAddedDetails);

    useEffect(() => {
        if (notesAddedDetails && notesAddedDetails.length > 0) {
            addedDetails.current = notesAddedDetails;
        }
    }, [notesAddedDetails]);

    useEffect(() => {
        if (chuckHook && chuckHook.length > 0 && keysToDisplay.length > 0) return;
        (async () => {
            const theKeys = !keysReady && (await createKeys());
            if (theKeys && keysToDisplay.length < 1) {
                setKeysToDisplay(theKeys);
            }
        })();
    }, [chuckHook]);

    const tryPlayChuckNote = (e: any) => {
        e.preventDefault();

        const removeHyphen = e.target.id.replace('-', '');
        const convertPoundTheNote = removeHyphen.replace('♯', '#');
        console.log("A D D E D * D E T A I L S ! ", addedDetails);
        addedDetails.current && addedDetails.current.length > 0 &&
        addedDetails.current.forEach(async (d: any) => {
            if (convertPoundTheNote === d.name) {
                noteOnPlay(d.midiNote, d.midiHz, d.midiNote);
            }
        });
    };

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
                    <li id={`B-${i + 1}`} key={`B-${i + 1}`} onClick={(e) => tryPlayChuckNote(e)} className="white offset half">{`B${i + 1}`}</li>
                </span>
            );

            if (!document.querySelector(`#octSpanWrapper-${i}`)) {
                octaves.push(octave);
            }
        }
        return octaves;
    };

    return (
        <div
            id="keyboardWrapper"
            key="keyboardWrapper"
            // style={{
            //     overflowX: 'hidden',
            //     zIndex: '9999',
            //     // borderBottom: '1px solid #eee',
            //     transform: 'rotateX(13deg)',
            //     // width: '90vw',
            //     paddingLeft: '8px',
            //     bottom: '0px'
            // }}
        >
            {chuckHook && Object.values(chuckHook).length && keysVisible && (
                <Box
                    id="keyboardBox"
                >
                    {/* <Box sx={{ 
                        // width: 'calc(100vw - 560px)', 
                        display: 'flex', 
                        flexDirection: 'row', 
                        marginLeft: '-6px',
                        // position: 'absolute',
                        // left: '400px'
                    }}><MingusPopup 
                        updateKeyScaleChord={updateKeyScaleChord}
                    /> </Box> */}
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