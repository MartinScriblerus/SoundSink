'use client'

import React, { useState, useRef, useEffect } from "react";

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import '../page.module.css';
import MoogGrandmotherEffects from "../../interfaces/audioInterfaces";
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import { getHexKeyboard } from "./hexKeyboard";
import { Chuck } from "webchuck";
import { BabylonGame } from "@/interfaces/gameInterfaces";
import HydraInit from "./HydraInit";


function BabylonScene(props: {
    bpm: number,
    currentBeatCountToDisplay: number | any,
    handleUpdateSliderVal: (x:string, index: number, value: any) => void,
    fxKnobsCount: number,
    needsUpdate: boolean,
    handleResetNeedsUpdate: () => void,
    effects: any,
    visibleFXKnobs: any,
    chuckUpdateNeeded: boolean; 
    // handleTurnKnob: () => void;
    chuckHook: Chuck | undefined;
    showFX: any;
    programIsOn:boolean;
    microTonalArr: any[];
    updateHasHexKeys: (msg: boolean) => void;
    hasHexKeys: boolean;
    fxRadioValue: string;
    // windowListenerRef: any;
}) {
    const {
        bpm,
        currentBeatCountToDisplay,
        handleUpdateSliderVal, 
        fxKnobsCount,
        needsUpdate, 
        handleResetNeedsUpdate,
        visibleFXKnobs, 
        // handleTurnKnob, 
        chuckHook,
        hasHexKeys,
        // showFX,
        // programIsOn,
        microTonalArr,
        // updateHasHexKeys,
        fxRadioValue,
        // windowListenerRef
    } = props;

    const theme = useTheme();

    const [babylonGameHook, setBabylonGameHook] = useState<any>('');



    // const game = useRef<BabylonGame>();
    // game = game || {
    //     canvas:  document.querySelector(`#babylonCanvas`),
    //     engine: undefined,
    //     scene: undefined,
    //     camera: [],
    //     light: [],
    //     gui: [],
    //     advancedTexture: [],
    //     panel: [], //GUI.StackPanel[] | undefined;
    //     header: [], // GUI.TextBlock[];
    //     slider: [], // GUI.Slider[] | undefined;
    //     knob: [],
    //     meshes: [],
    //     camera1: {},
    //     camera2: {},
    //     // runRenderLoop: undefined,
    // } as BabylonGame;

    useEffect(() => {
        if (needsUpdate) {
            //console.log("################################ WE CAN UPDATE")
            setBabylonGameHook('ready');
            handleResetNeedsUpdate();
        }
    }, [needsUpdate])

    const canvasRef = useRef<HTMLCanvasElement | null>(null);



    // const game: BabylonGame = {
    //     canvas:  undefined,
    //     engine: undefined,
    //     scene: undefined,
    //     camera: [],
    //     light: [],
    //     gui: [],
    //     advancedTexture: [],
    //     panel: [], //GUI.StackPanel[] | undefined;
    //     header: [], // GUI.TextBlock[];
    //     slider: [], // GUI.Slider[] | undefined;
    //     knob: [],
    //     meshes: [],
    //     camera1: {},
    //     camera2: {},
    //     // runRenderLoop: undefined,
    // } as BabylonGame;


    const prevKnobValue = useRef<number>(0);
    const prevKnobVals = useRef<any>({});

    const rot_state = useRef<any>();
    
    const pivot = useRef<any>({});
    const knobPosition = useRef<any>();

    // const rot_state2 = useRef<any>();
    // const hasHexKeys = useRef<boolean>(false);
    // const isEditingHextiles = useRef<boolean>(false);

    // const myScrollViewer = new GUI.ScrollViewer();

    // useEffect(() => {
    //     if (!hasHexKeys && game && game.scene) {
    //         game.scene.activeCamera = game.scene.cameras[0];
    //     }
    // }, [hasHexKeys])

    // useEffect(() => {
 
        // alert(hasHexKeys)
        // if (!hasHexKeys) {
        // if (!isEditingHextiles.current) {
        //     while(game.scene && Object.keys(game.scene).length > 0 && game.scene.meshes.length && game.scene.getMeshByName("hexTile") && game.scene.getMeshByName("hexTile").length > 0) {
        //         game.scene.getMeshByName("hexTile").dispose();
        //     }
        //     // game.scene && game.scene.meshes.forEach((i: any) => i.name === "hexTile" && i.dispose() && i === null);
        // } else {
        //     isEditingHextiles.current = false;
        // }
        // const hexTiles = game.scene && game.scene.meshes.filter((i: any) => i.name === "hexTile" && i);

        // while(game.scene && Object.keys(game.scene).length > 0 && game.scene.meshes.length && game.scene.getMeshByName("hexTile")){
        //     game.scene.getMeshByName("hexTile").dispose();
        // }
        // // console.log("ERR HEXTILES 1", game.scene && game.scene.meshes.filter((i: any) => i.name === "hexTile" && i));
        // // console.log("check sane: ", game.scene && game.scene.meshes && game.scene.meshes.filter((m: any) => m.name === "hexTile"))
        // console.log("MICRO ARR??? ", microTonalArr);
        // if (chuckHook && 
        //     game.scene && game.scene.meshes && 
        //     // game.scene.meshes.filter((m: any) => m.name === "hexTile").length < 1 &&
        //     microTonalArr && microTonalArr.length > 0 && 
        //     hexTiles.length === 0) {
        //         isEditingHextiles.current = true;
        //         getHexKeyboard(game, chuckHook, microTonalArr);
        //         alert("updating has hex keys to true");
        //         updateHasHexKeys(true);
        // }
    // }, [hasHexKeys, microTonalArr])



    let previousMesh: BABYLON.AbstractMesh[] = [];

// const runOnce = useRef<any>();
// runOnce.current = false;

        useEffect(() => {
            // if (runOnce.current === true) return;
            const game: BabylonGame = {
                canvas:  undefined,
                engine: undefined,
                scene: undefined,
                camera: [],
                light: [],
                gui: [],
                advancedTexture: [],
                panel: [], //GUI.StackPanel[] | undefined;
                header: [], // GUI.TextBlock[];
                slider: [], // GUI.Slider[] | undefined;
                knob: [],
                meshes: [],
                camera1: {},
                camera2: {},
                // runRenderLoop: undefined,
            } as BabylonGame;
        
        
            console.log("*** OUTER");
            if (game) game.canvas = document.querySelector(`#babylonCanvas`);
            if (!game || !game.canvas) return;
                console.log("*** WITHIN");
                // console.log("WTF IS GAME?? ", game);
                // console.log('in useeffect getting canvas');
                //  game.canvas = document.querySelector(`#babylonCanvas`);  
                // if (babylongame && !babylongame.canvas2) {
                //     babylongame.canvas2 = document.querySelector('visualizer');
                // }
                // const engine = new BABYLON.Engine(
                //     game.canvas,
                //     true, // antialias
                // );

                // if (game.engine) return;

                game.engine = new BABYLON.Engine(
                    game.canvas,
                    true, // antialias
                );
                // babylongame.scene = new BABYLON.Scene(babylongame.engine);
                game.knob = {};
                game.header = {};
                game.scene = new BABYLON.Scene(game.engine);
     
                game.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, game.scene);
                              
                const squareRoot = Math.ceil(Math.sqrt(fxKnobsCount));
                const zPos = -12;
                // console.log('babylon game gui ', game.gui);
                
                
                game.scene.materials.greenMat = new BABYLON.StandardMaterial("greenMat", game.scene);
                game.scene.materials.greenMat.emissiveColor = new BABYLON.Color3(158/255, 210/255, 162/255);
                
                game.scene.materials.blueMat = new BABYLON.StandardMaterial("blueMat", game.scene);
                // blueMat.emissiveColor = new BABYLON.Color3(219/255, 230/255, 151/255);
                game.scene.materials.blueMat.emissiveColor = new BABYLON.Color3(219/255, 230/255, 151/255);
                // (0.056, 0.199, 1.0)
        
                game.scene.materials.blackMat = new BABYLON.StandardMaterial("blackMat", game.scene);
                game.scene.materials.blackMat.diffuseColor = new BABYLON.Color3(0/255, 0/255, 0/255);
                
                game.scene.materials.whiteMat = new BABYLON.StandardMaterial("whiteMat", game.scene);
                game.scene.materials.whiteMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        
                game.scene.materials.purpleMat = new BABYLON.StandardMaterial("purpleMat", game.scene);
                // purpleMat.emissiveColor = new BABYLON.Color3(0.056, 0.199, 1.0);
                game.scene.materials.purpleMat.emissiveColor = new BABYLON.Color3(144/255, 204/255, 212/255);
        
                game.scene.materials.greyMat = new BABYLON.StandardMaterial("greyMat", game.scene);
                game.scene.materials.greyMat.emissiveColor = new BABYLON.Color3(90/255, 99/255, 111/255);
        
                game.scene.materials.redMat = game.scene.materials.purpleMat;
                
                const pbr = new BABYLON.PBRMaterial("pbr", game.scene);
        
                game.camera1 = {};
                game.camera1 = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene); 
                // game.camera1.setTarget(new BABYLON.Vector3(-2.6,-1.8,0.0));
                game.camera1.setTarget(new BABYLON.Vector3(-2.6,-1.8,0.0));
                game.camera1.attachControl(game.scene, false);            
                game.camera1.position = new BABYLON.Vector3(0, 0, 12);
                game.camera1.inputs.attached.keyboard.detachControl();
                game.camera1.inputs.attached.mousewheel.detachControl();
                game.camera1.inputs.attached.pointers.detachControl();
                game.camera1.multiTouchPanAndZoom = false;
                game.camera1.multiTouchPanning = false;
                game.camera1.pinchInwards = false;
                game.camera1.pinchZoom = false;
                game.camera1.inputs.removeByType("ArcRotationCameraInputs");
                game.camera1.wheelDeltaPercentage = 0.0;
                game.camera1.panningSensibility = 0.0;
                // game.camera1.fov = 0.99;
                // game.camera1.fov = 1.06;
                game.camera1.fov = 0.98;
                game.camera1.alpha = 1.553;
                game.camera1.beta = 1.532;
                game.camera1.id = "camera1";
                game.camera1.viewport = new BABYLON.Viewport(0.0, 0.0, 1.0, 1.0);
        
                // if(hasHexKeys) {
                //     game.scene.activeCamera = game.scene.cameras[1]
                // } else {
                    game.scene.activeCamera = game.scene.cameras[0]
                // }
        
                rot_state.current = {x:game.camera1.alpha, y:game.camera1.beta};
        
        
                if (game.scene.cameras.map((i: any) => i && i).length < 1) {
                    game.scene.cameras.push(game.camera1);
                }
            
                // const camera2 = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene); 
                
                // let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };
            
            
                // camera2.setTarget(new BABYLON.Vector3(camera2TargetPosition.x, camera2TargetPosition.y, camera2TargetPosition.z));
            
                // camera2.attachControl(game.scene, false);
                
                // camera2.position = new BABYLON.Vector3(0, 0, 12);
                // camera2.inputs.attached.keyboard.detachControl();
                // camera2.inputs.attached.mousewheel.detachControl();
                // camera2.inputs.attached.pointers.detachControl();
                
                // // camera2.multiTouchPanAndZoom = false;
                // // camera2.multiTouchPanning = false;
                // // camera2.pinchInwards = false;
                // // camera2pinchZoom = false;
                // camera2.inputs.removeByType("ArcRotationCameraInputs");
                // camera2.wheelDeltaPercentage = 0.0;
                // camera2.panningSensibility = 0.0;
                // camera2.fov = 1.05;
                // camera2.id = "camera2";
                // // camera2.alpha = camera2TargetPosition.alpha;
                // camera2.alpha = 1.5685;
                // camera2.beta = camera2TargetPosition.beta;
                // camera2.radius = camera2TargetPosition.radius;
                // camera2.viewport = new BABYLON.Viewport(0.0, 0.0, 1.0, 1.0);
            
                // rot_state2.current = {x:camera2.alpha, y:camera2.beta};
                // if (game.scene.cameras.length < 2 && camera2.id === "camera2") {
                //     game.scene.cameras.push(camera2);
                // }
                        
                for(let i = 0; i < squareRoot; i++) {
                    for (let j = 0; j < squareRoot; j++) {
        
                    // console.log("I??? ", i);
                    // console.log("J??? ", j);

                    const effectsIndex = j + squareRoot * i;
                    // console.log('viz idx: ', effectsIndex, visibleFXKnobs[effectsIndex]);
                        if (visibleFXKnobs[effectsIndex] && effectsIndex < fxKnobsCount) {
                            if(Object.keys(prevKnobVals.current).indexOf(`${i}`) === -1) {
                                    prevKnobVals.current.i = prevKnobVals.current.i || {};
                                    prevKnobVals.current.i.j = prevKnobVals.current.i.j ? prevKnobVals.current.i.j : 0;
                                };
                                // create a light for each knob
                                game.light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, game.scene);
                                game.light.intensity = 0.07;
                                    
                                
                                
                                
                                
                                
                                
                                // create a stack panel GUI for each knob
                                const paneL = new GUI.StackPanel();
                                paneL.width = "220px";
                                // build columns off of a center row
                                paneL.horizontalAlignment = i === 0 
                                ? 
                                    GUI.Control.HORIZONTAL_ALIGNMENT_CENTER 
                                : 
                                    i === 1 
                                    ? 
                                        GUI.Control.HORIZONTAL_ALIGNMENT_LEFT 
                                    : 
                                        GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                                paneL.verticalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                game.panel[i] = game.panel[i] || {};
                                game.panel[i][j] = game.panel[i][j] ? game.panel[i][j] : paneL;
                                game.gui.addControl(game.panel[i][j]);
        
                                // create a text field for each knob
                                game.header[i] = game.header[i] || {}; 
        
                                game.header[i][j] = game.header[i][j] ? game.header[i][j] : new GUI.TextBlock();
        
                                game.header[i][j].height = "60px";
                                game.header[i][j].paddingTop = "20px";
                                game.header[i][j].fontFamily = "monospace";
                                game.header[i][j].fontSizeInPixels = 11;
                                game.header[i][j].color = "rgba(255,255,255,0.78)";
                                // console.log('WHAT IS KNOB FOR THIS EFFECT?: ', visibleFXKnobs[effectsIndex])
                                // create a slider for each knob
                                const slid = new GUI.Slider();
                                game.slider[i] = game.slider[i] || {};
                                game.slider[i][j] = game.slider[i][j] ? game.slider[i][j] : slid;
                                game.slider[i][j].minimum = 0;
                                game.slider[i][j].name = `slider_${i}`;
                                game.slider[i][j].maximum = 2 * Math.PI;
                                game.slider[i][j].value = 2 * Math.PI * (visibleFXKnobs[effectsIndex][1].value / (visibleFXKnobs[effectsIndex][1].max - visibleFXKnobs[effectsIndex][1].min));
                                game.slider[i][j].isVertical = false;
                                game.slider[i][j].height = "70px";
                                game.slider[i][j].paddingTop = "20px";
                                game.slider[i][j].width = "80px";
                                game.slider[i][j]._background = "transparent";
                                game.panel[i][j].addControl(game.slider[i][j]); 
                                game.panel[i][j].addControl(game.header[i][j]); 
        
                                game.slider[i][j].onValueChangedObservable.add(function(value: any) {
                                    const getDegrees: any = +(BABYLON.Tools.ToDegrees(value));
                                    const getDegreesToFixed: any = parseFloat(getDegrees);
                                    const convertScale = +visibleFXKnobs[effectsIndex][1].min + ((visibleFXKnobs[effectsIndex][1].max - visibleFXKnobs[effectsIndex][1].min) * (getDegreesToFixed / 360));
                                    const typeNormalizedNum = +(visibleFXKnobs[effectsIndex][1].screenInterface === 'knob') ? Number(0 + convertScale) : Math.ceil(Number(0 + convertScale));
                                    const handleExponentialVal = +(visibleFXKnobs[effectsIndex][1].screenInterface === 'exponentialintspinner') ? 2 ** +Number(typeNormalizedNum) : +Number(typeNormalizedNum);
                                    
                    
                                    // const parseConvertScale:number = +Number(typeNormalizedNum);
                                    const parseConvertScale:number = +Number(handleExponentialVal);

                                    if (game && game.header && game.header[i] && game.header[i][j] && game.header[i][j] && game.header[i][j].text) game.header[i][j].text = `${visibleFXKnobs[effectsIndex][0]}: ${parseConvertScale.toFixed(4)}`;
                                    
                                    // handleUpdateSliderVal(visibleFXKnobs[effectsIndex][1], parseConvertScale);
                                    handleUpdateSliderVal(fxRadioValue, visibleFXKnobs[effectsIndex][1], parseConvertScale);
                                    if (!prevKnobVals.current.i.j) value = parseConvertScale;
                                    if (prevKnobVals.current.i.j || prevKnobVals.current.i.j < 2 * Math.PI && prevKnobVals.current.i.j > -2 * Math.PI ) {
                                        if (game) {
                                            game.knob[i][j][0].rotation = game.knob[i][j][0].rotation && game.knob[i][j][0].rotation === new BABYLON.Vector3(0,Math.PI,-value) ? game.knob[i][j][0].rotation : new BABYLON.Vector3(0,Math.PI,-value);
                                        }
                                    }                        
                                    prevKnobValue.current = value;
                                    prevKnobVals.current.i.j = value;
                                    return;
                                });
 
                                game.slider[i][j].onValueChangedObservable.remove();
       
                                let effectLen = 1;
                                if (visibleFXKnobs[effectsIndex][0] && visibleFXKnobs[effectsIndex][0][1] && Object.keys(visibleFXKnobs[effectsIndex][0][1])) {
                                    effectLen = Object.keys(visibleFXKnobs[effectsIndex][0][1]).length;
                                }
        
                                // console.log('VIZ EFFECTS KNOB Value Value Value Value CHECK ', visibleFXKnobs[effectsIndex][1].value);
                                game.header[i][j].text = !prevKnobVals.current.i.j 
                                    ?   visibleFXKnobs[effectsIndex][1] && 
                                        visibleFXKnobs[effectsIndex][1].value && 
                                        visibleFXKnobs[effectsIndex][0].length > 0 &&
                                        typeof visibleFXKnobs[effectsIndex][0][1] && 
                                        typeof visibleFXKnobs[effectsIndex][0][1].value === 'number'
                                        ?
                                            `${visibleFXKnobs[effectsIndex][0][0]}: ${visibleFXKnobs[effectsIndex][0][1].value.toFixed(2)}`    
                                        :
                                            `${visibleFXKnobs[effectsIndex][0]}: ${visibleFXKnobs[effectsIndex][1].value ? visibleFXKnobs[effectsIndex][1].value.toFixed(2) : 0.00}`
        
                                    : 
                                        `${visibleFXKnobs[effectsIndex][0]}: ${game.slider[i][j].value.toFixed(2)}`;
                                console.log("SANITY??? ", game.header[i][j].text)
                                // handleResetNeedsUpdate();
                                if (game.scene && game.engine && game.engine !== undefined && game.engine.scenes.length > 0 && game.engine.scenes[0].meshes.length < 1) {
                                    game.scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);
        
                                    // This is the effects knob: use this to handle "amount" based values (eg. 0.0–1.0 / 1–100)
                                    BABYLON.SceneLoader.ImportMesh("", "/", "knob3.glb", game.scene, function (newMeshes: any) {
                                        
                                        
                                        // previousMesh.forEach((mesh) => mesh.dispose()); // Dispose old model
                                        // // previousMesh = newMeshes;
                                        // IF THERE ARE
                                        newMeshes[0].alwaysSelectAsActiveMesh = false;  // Reduce processing overhead
                                        newMeshes[0].doNotSyncBoundingInfo = true;  // Disable bounding box sync if unnecessary
                                        newMeshes[0].position.y = 5.5 + ((-((i % squareRoot) / 2)) + (i % squareRoot) * -3);
                                        newMeshes[0].position.x = 15 + ((-((j % squareRoot) / 2)) + (j % squareRoot) * -3.0);
                                        // newMeshes[0].position.y = 7  + (i % 2) * -4;          
                                        // newMeshes[0].position.x = ((-((i) * -10)) + (j * -4)) + ((i + 1) % 2) * (10) + -16; // Add offset for alternate rows
                                        newMeshes[0].position.z = zPos;
                
                                        if (!prevKnobVals.current.i.j) {
                                            const getVal = (visibleFXKnobs[effectsIndex][1].value - visibleFXKnobs[effectsIndex][1].min) / (visibleFXKnobs[effectsIndex][1].max - visibleFXKnobs[effectsIndex][1].min)
                                            newMeshes[0].rotation = newMeshes[0].rotation && newMeshes[0].rotation === new BABYLON.Vector3(0,Math.PI,-getVal * 2 * Math.PI) ? newMeshes[0].rotation : new BABYLON.Vector3(0,Math.PI,-getVal * 2 * Math.PI);
                                        }
 
                                        game && game.panel[i][j].linkWithMesh(newMeshes[0]);
                                        
                                        pivot.current.i = pivot.current.i || {};
                                        pivot.current.i.j = pivot.current.i.j ? prevKnobVals.current.i.j : 0;
                                        pivot.current.i.j = new BABYLON.TransformNode("root_test");
                                        pivot.current.i.j.position = new BABYLON.Vector3(newMeshes[0].position.x, newMeshes[0].position.y, newMeshes[0].position.z); 
                                                                
                                        knobPosition.current = knobPosition.current && knobPosition.current === new BABYLON.Vector3(newMeshes[0].position) ? knobPosition.current : new BABYLON.Vector3(newMeshes[0].position) ;
        
                                        const texture = game && game.scene.textures[1];
                                        newMeshes[0].getChildMeshes().forEach((childMesh: any, index: any) => {
                                            childMesh.material.albedoTexture = texture;
                                            childMesh.material.diffuseTexture = texture;
                                            childMesh.material.specularTexture = texture;
                                            childMesh.material.emissiveTexture = texture;
                                            childMesh.materialambientTexture = texture;
                                            if(game && game.scene && childMesh.name === "Circle_primitive0") {
                                                childMesh.material = game.scene.materials.blackMat;
                                            }
                                            if(game && childMesh.name === "Circle_primitive1") {
                                                switch (i) {
                                                    case 0:
                                                        childMesh.material = game.scene.materials.blueMat;
                                                        break;
                                                    case 1:
                                                        childMesh.material = game.scene.materials.greenMat;
                                                        break;
                                                    case 2:
                                                        childMesh.material = game.scene.materials.redMat;
                                                        break;
                                                    case 3:
                                                        childMesh.material = game.scene.materials.purpleMat;
                                                        break;
                                                    case 4:
                                                        childMesh.material = game.scene.materials.greyMat;
                                                        break;
                                                    default:
                                                        childMesh.material = game.scene.materials.greyMat;
                                                        break;
                                                } 
                                            }
                                        if(game && childMesh.name === "Cube") {
                                            childMesh.material = game.scene.materials.whiteMat;
                                        }
                                        });
                                        if (game && game.knob ) {
                                            game.knob[i] = game.knob[i] || {};
                                            game.knob[i][j] = [];
                                            game.knob[i][j].push(newMeshes[0]);
                                        } else {
                                            console.log("no game currently")
                                        }
                                    });
                                    // return () => {
                                    //     game?.scene?.meshes.forEach((mesh: any) => {
                                    //         mesh.dispose();
                                    //         mesh = null;
                                    //     });
                                    // };
                                // SEE / ADD STARTER CODE FOR SWITCH HERE! (***see switchKnob file***)
                                }   
                                // return;
                        }
                    } 
                }
 
        

                // let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };
                game && game.engine && game.engine.runRenderLoop(function () {
                    if (game && game.scene && game.scene.cameras.length > 0 && rot_state.current && rot_state.current.length > 0) {
                        if (game.scene.cameras && game.scene.cameras.length > 0) {
                            game.scene.cameras[0].rotation.x = rot_state.current.x;
                            game.scene.cameras[0].rotation.y = rot_state.current.y;
                            game.scene.cameras[0].setTarget(BABYLON.Vector3.Zero());
                            game.scene.cameras[0].inputs.attached.mouse.detachControl();
                            game.scene.cameras[0].position = new BABYLON.Vector3(0, 0, 12);
                        }

                        // game.scene.cameras[1].setTarget(new BABYLON.Vector3(0, 0, 0));
                        // game.scene.cameras[1].rotation.x = rot_state2.current.x;
                        // game.scene.cameras[1].rotation.y = rot_state2.current.y;
                        // // let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };

                        // game.scene.cameras[1].inputs.attached.mouse.detachControl();
                        // game.scene.cameras[1].position = new BABYLON.Vector3(0, 0, 12);
                    }
                    game && game.scene && game.scene.render();
          
                });
                return () => {
                    if (game && game.scene) {

                        game.scene.meshes && game.scene.meshes.forEach((mesh:any) => mesh.dispose());
                        game.scene.materials && game.scene.materials.forEach((material:any) => material.dispose());
                        game.scene.textures && game.scene.textures.forEach((texture:any) => texture.dispose());
                        game.scene.lights && game.scene.lights.forEach((light:any) => light.dispose());
                    
                        
           
                        game.scene.cameras && game.scene.cameras.forEach((camera:any) => camera.dispose());
                        game.gui && game.gui.dispose();
                  
                        game.scene.dispose();
                        game.engine.dispose();
                        game.engine.stopRenderLoop();
                        game.engine.clearInternalTexturesCache(); 
                        game.gui.dispose();
                        game.scene = null;
                        game.engine = null;
                        game.gui = null;
                        
                    }
                    // game.engine.stopRenderLoop();
                };

        //    runOnce.current = true; 
        },[]);


    // useEffect(() => {
    //     // updateHasHexKeys(false);
    //     // try {
    //     //     game.scene.meshes.map((i:any) => i.name === "hexTile" && i.dispose());
    //     // } catch (e) {
            
    //     // }
    //     // if(game.scene && game.scene.cameras && game.scene.cameras.length > 0 &&  game.scene.activeCamera !== game.scene.cameras[0]) {
    //     //     game.scene.activeCamera = game.scene.cameras[0];
    //     // // } else {
    //     //     if (game.scene && game.scene.cameras.length > 0) {
    //     //         game.scene.activeCamera = game.scene.cameras[1];
    //     //     }
    //     //     const hexTiles = game.scene && game.scene.meshes.filter((m: any) => m.name === "hexTile");
    //     //     console.log("ERR HEXTILES ", hexTiles);
    //     //     hexTiles && hexTiles.length > 0 && hexTiles.forEach((h: any) => {
    //     //         h.getChildMeshes().forEach((m: any) => {
    //     //             m.dispose();
    //     //         });
    //     //         h.dispose();
    //     //     });
    //         if (chuckHook) {
    //             getHexKeyboard(game, chuckHook, microTonalArr, hasHexKeys);
    //         }
    //     // }
    // }, [microTonalArr, microTonalArr.length])


    // if (game && 
    //     game.scene && 
    //     hasHexKeys === true && 
    //     chuckHook && 
    //     microTonalArr.length > 0 && 
    //     game.scene.cameras[1]
    // ) {
    //     game.scene.activeCamera = game.scene.cameras[1];
    // }


    const embedHost: any = document.querySelector(`#embed-host`)
    if (embedHost) embedHost.style.position = "absolute";


    return (      
        <Box 
            sx={{
                visibility: "visible", 
                alignItems: "left",
            }}
        >
            <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <canvas
                style={{
                    minWidth: "1200px", 
                    minHeight: "800px", 
                    display: "visible",
                    position: 'relative', 
                }} 
                id={`babylonCanvas`} 
                ref={canvasRef}
            // }
            />
            </div>
            <HydraInit 
                bpm={bpm}
                currentBeatCountToDisplay={
                    currentBeatCountToDisplay}
                fxRadioValue={fxRadioValue}
            />
        </Box>

    )
        }

export default BabylonScene;










