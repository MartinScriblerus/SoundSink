import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";


import { Heatmap } from "@/utils/VizHelpers/Heatmap";

type QuickDashProps = {
    featuresLegendData: any[];
    universalSources: any;
    handleSourceToggle: (name: string, val: any) => void;
    vizSource: string;
    currentNumerCount: any;
    currentBeatSynthCount: any;
    handleOsc1RateUpdate: any;
    handleOsc2RateUpdate: any;
    handleMasterFastestRate: any;
    handleStkRateUpdate: any;
    handleSamplerRateUpdate: any;
    handleAudioInRateUpdate: any;
    currentNoteVals: any;
    filesToProcess: any;
    numeratorSignature: any;
    denominatorSignature: any;
    editPattern: any;
    masterPatternsHashHook: any;
    masterPatternsHashHookUpdated: any;
    inPatternEditMode: any;
    selectFileForAssignment: any;
    handleChangeCellSubdivisions: any;
    cellSubdivisions: any;
    resetCellSubdivisionsCounter: any;
    handleClickUploadedFiles: any;
    parentDiv: any;
    masterFastestRate: number;

    currentBeatCountToDisplay: number;
    currentNumerCountColToDisplay: number;
    currentDenomCount: number;
    currentPatternCount: number;

    clickHeatmapCell: any;

    exitEditMode: () => void;
    isInPatternEditMode: boolean;

    handleLatestSamples: (  
        fileNames: string[],
        xVal: number,
        yVal: number,
    ) => void;
    handleLatestNotes: (  
        notes: string[],
        xVal: number,
        yVal: number,
    ) => void;

    mTFreqs:number[];
    mTMidiNums:number[];
    updateKeyScaleChord: (a:any, b:any, c: any, d: any, e: any) => void;
    testChord: () => void;
    testScale: () => void;
}

const NotesQuickDash = (props:QuickDashProps) => {
    // const theme = useTheme();
    const {
        featuresLegendData, 
        vizSource,
        currentNumerCount,
        currentBeatSynthCount,
        handleOsc1RateUpdate,
        handleOsc2RateUpdate,
        handleMasterFastestRate,
        handleStkRateUpdate,
        handleSamplerRateUpdate,
        handleAudioInRateUpdate,
        currentNoteVals,
        filesToProcess,
        numeratorSignature,
        denominatorSignature,
        editPattern,
        masterPatternsHashHook,
        masterPatternsHashHookUpdated,
        inPatternEditMode,
        selectFileForAssignment,
        handleChangeCellSubdivisions,
        cellSubdivisions,
        resetCellSubdivisionsCounter,
        handleClickUploadedFiles,
        parentDiv,
        currentBeatCountToDisplay,
        currentNumerCountColToDisplay,
        currentDenomCount,
        currentPatternCount,
        masterFastestRate,
        exitEditMode,
        isInPatternEditMode,
        clickHeatmapCell,

        handleLatestSamples,
        handleLatestNotes,

        mTFreqs,
        mTMidiNums,
        updateKeyScaleChord,
        testChord,
        testScale,
    } = props;
    const [updateCellColorBool, setUpdateCellColorBool] = useState<boolean>(false);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [height, setHeight] = useState<number | undefined>(undefined);

    const updateCellColor = (msg: any) => {
        setUpdateCellColorBool(msg);
    }

    const parentDivRef = useRef<any>(null);

    useEffect(() => {
        let mounted = true;
        try {
            if (parentDiv && parentDiv.getBoundingClientRect()) {
                setWidth(parentDiv.getBoundingClientRect().width);
                setHeight(parentDiv.getBoundingClientRect().height);
            }
        } catch (error) {
            console.error("Error getting parent div dimensions: ", error);
        }
        return () => {
            mounted = false;
        }
    }, [parentDiv]);


    return (
        <Box 
            sx={{
                top: '36px',
                textAlign: "center",
                background: 'rgba(0,0,0,0.78)',
                color: 'rgba(255,255,255,0.78)',
                zIndex: "1",
                right: "0",
                width: "100%",
            }}
        >
            <Box>
                <Box sx={{
                    top: '0px !important',
                    left: '0px !important',
                    background: 'rgba(0,0,0,0.78)',
                    color: 'rgba(255,255,255,0.78)',
                    zIndex: 9001,
                    width: "-webkit-fill-available",

                }}>
                    <div
                        style={{
                            width: "fit-content",
                            maxWidth: "100%",
                            overflowX: "auto"
                        }}
                    >
                    </div>

                    {
                        // parentDivRef.current !== 0 && parentDivRef.current.getBoundingClientRect() &&
                        width && height &&
                        <Heatmap 
                            width={
                                parentDivRef.current 
                                ? 
                                    parentDivRef.current.getBoundingClientRect().width 
                                : 
                                    0
                            } 
                            height={
                                parentDivRef.current 
                                ? 
                                    parentDivRef.current.getBoundingClientRect().height / 2 
                                : 
                                    0
                            } 
                            currentNumerCount={currentNumerCount}
                            currentBeatSynthCount={currentBeatSynthCount}
                            handleOsc1RateUpdate={handleOsc1RateUpdate}
                            handleOsc2RateUpdate={handleOsc2RateUpdate} 
                            handleStkRateUpdate={handleStkRateUpdate} 
                            handleSamplerRateUpdate={handleSamplerRateUpdate} 
                            handleAudioInRateUpdate={handleAudioInRateUpdate}
                            handleMasterFastestRate={handleMasterFastestRate}
                            currentNoteVals={currentNoteVals}
                            filesToProcess={filesToProcess}
                            numeratorSignature={numeratorSignature}
                            denominatorSignature={denominatorSignature}
                            editPattern={editPattern}
                            masterPatternsHashHook={masterPatternsHashHook}
                            masterPatternsHashHookUpdated={masterPatternsHashHookUpdated}
                            updateCellColor={updateCellColor}
                            updateCellColorBool={updateCellColorBool}
                            inPatternEditMode={inPatternEditMode}
                            selectFileForAssignment={selectFileForAssignment}
                            handleChangeCellSubdivisions={handleChangeCellSubdivisions}
                            cellSubdivisions={cellSubdivisions}
                            resetCellSubdivisionsCounter={resetCellSubdivisionsCounter}
                            handleClickUploadedFiles={handleClickUploadedFiles}
                            vizSource={vizSource}
                            masterFastestRate={masterFastestRate}
                            currentBeatCountToDisplay={currentBeatCountToDisplay}
                            currentNumerCountColToDisplay={currentNumerCountColToDisplay}
                            currentDenomCount={currentDenomCount}
                            currentPatternCount={currentPatternCount}
                            exitEditMode={exitEditMode}
                            isInPatternEditMode={isInPatternEditMode}

                            clickHeatmapCell={clickHeatmapCell}
                            handleLatestSamples={handleLatestSamples}
                            handleLatestNotes={handleLatestNotes}
                            mTFreqs={mTFreqs}
                            mTMidiNums={mTMidiNums}
                            updateKeyScaleChord={updateKeyScaleChord}
                            testChord={testChord}
                            testScale={testScale}
                        />
                    }
                </Box>

                {Object.entries(featuresLegendData).map((f) => (
                    <div key={`${f[0]}`}>{f[0] + f[1]}</div>
                ))}
            </Box>
        </Box>
    )
}
export default NotesQuickDash;