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

function BabylonScene(props: {
    game: any,
    handleUpdateSliderVal: (index: number, value: any) => void,
    fxKnobsCount: number,
    needsUpdate: boolean,
    handleResetNeedsUpdate: () => void,
    effects: any,
    visibleFXKnobs: any,
    chuckUpdateNeeded: boolean; 
    handleTurnKnob: () => void;
    // runChuck: () => void;
    showFX: any;
    programIsOn:boolean;
    microTonalArr: any[];
    chuckHook: Chuck | undefined;
    updateHasHexKeys: (msg: boolean) => void;
    hasHexKeys: boolean;
}) {
    const {game, 
        handleUpdateSliderVal, 
        fxKnobsCount, 
        needsUpdate, 
        handleResetNeedsUpdate, 
        effects, 
        visibleFXKnobs, 
        chuckUpdateNeeded, 
        handleTurnKnob, 
        // runChuck,
        showFX,
        programIsOn,
        microTonalArr,
        chuckHook,
        updateHasHexKeys,
        hasHexKeys
    } = props;

    const theme = useTheme();

    useEffect(() => {
        if (needsUpdate) {
            handleResetNeedsUpdate();
        }
    }, [needsUpdate])

    const prevKnobValue = useRef<number>(0);
    const prevKnobVals = useRef<any>({});

    const rot_state = useRef<any>();
    const rot_state2 = useRef<any>();
    const pivot = useRef<any>({});
    const knobPosition = useRef<any>();
    // const hasHexKeys = useRef<boolean>(false);
    const isEditingHextiles = useRef<boolean>(false);

    useEffect(() => {
        if (!hasHexKeys && game.scene) {
            game.scene.activeCamera = game.scene.cameras[0];
        }
    }, [hasHexKeys])

    useEffect(() => {
 
        // alert(hasHexKeys)
        // if (!hasHexKeys) {
        if (!isEditingHextiles.current) {
            while(game.scene && Object.keys(game.scene).length > 0 && game.scene.meshes.length && game.scene.getMeshByName("hexTile")){
                game.scene.getMeshByName("hexTile").dispose();
            }
            // game.scene && game.scene.meshes.forEach((i: any) => i.name === "hexTile" && i.dispose() && i === null);
        } else {
            isEditingHextiles.current = false;
        }
        const hexTiles = game.scene && game.scene.meshes.filter((i: any) => i.name === "hexTile" && i);

        while(game.scene && Object.keys(game.scene).length > 0 && game.scene.meshes.length && game.scene.getMeshByName("hexTile")){
            game.scene.getMeshByName("hexTile").dispose();
        }
        // console.log("ERR HEXTILES 1", game.scene && game.scene.meshes.filter((i: any) => i.name === "hexTile" && i));
        // console.log("check sane: ", game.scene && game.scene.meshes && game.scene.meshes.filter((m: any) => m.name === "hexTile"))
        console.log("MICRO ARR??? ", microTonalArr);
        if (chuckHook && 
            game.scene && game.scene.meshes && 
            // game.scene.meshes.filter((m: any) => m.name === "hexTile").length < 1 &&
            microTonalArr && microTonalArr.length > 0 && 
            hexTiles.length === 0) {
                isEditingHextiles.current = true;
                getHexKeyboard(game, chuckHook, microTonalArr);
                updateHasHexKeys(true);
        }
    }, [hasHexKeys, microTonalArr])


    if (game && game.engine && !game.scene) {
        game.scene = !game.scene ? new BABYLON.Scene(game.engine) : game.scene;
        if (game.scene.isReady()) {
            console.log('scene is ready')
            game.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, game.scene);
            // ******************************** 
            // change Name and Behavior of this fxKnobsCount hook
            const squareRoot = Math.ceil(Math.sqrt(Object.keys(visibleFXKnobs).length));
            const zPos = -12;
            console.log('babylon game gui ', game.gui);
            
            // CREATE MATERIALS
            // create colors
            const redMat = new BABYLON.StandardMaterial("redMat", game.scene);
            redMat.emissiveColor = new BABYLON.Color3(236/255, 128/255, 139/255);
            
            const greenMat = new BABYLON.StandardMaterial("greenMat", game.scene);
            greenMat.emissiveColor = new BABYLON.Color3(158/255, 210/255, 162/255);
            
            const blueMat = new BABYLON.StandardMaterial("blueMat", game.scene);
            blueMat.emissiveColor = new BABYLON.Color3(219/255, 230/255, 151/255);

            const blackMat = new BABYLON.StandardMaterial("blackMat", game.scene);
            blackMat.diffuseColor = new BABYLON.Color3(0/255, 0/255, 0/255);
            
            const whiteMat = new BABYLON.StandardMaterial("whiteMat", game.scene);
            whiteMat.emissiveColor = new BABYLON.Color3(1, 1, 1);

            const purpleMat = new BABYLON.StandardMaterial("purpleMat", game.scene);
            purpleMat.emissiveColor = new BABYLON.Color3(144/255, 204/255, 212/255);

            const greyMat = new BABYLON.StandardMaterial("greyMat", game.scene);
            greyMat.emissiveColor = new BABYLON.Color3(90/255, 99/255, 111/255);

            const pbr = new BABYLON.PBRMaterial("pbr", game.scene);


            game.camera1 = {};
            game.camera1 = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene); 
            game.camera1.setTarget(new BABYLON.Vector3(-2.6,-0.8,0.0));
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
            game.camera1.fov = 0.89;
            game.camera1.alpha = 1.553;
            game.camera1.beta = 1.532;
            game.camera1.id = "camera1";
            game.camera1.viewport = new BABYLON.Viewport(0.0, 0.0, 1.0, 1.0);

            if(hasHexKeys) {
                game.scene.activeCamera = game.scene.cameras[1]
            } else {
                game.scene.activeCamera = game.scene.cameras[0]
            }

            rot_state.current = {x:game.camera1.alpha, y:game.camera1.beta};


        


        if (game.scene.cameras.map((i: any) => i && i).length < 1) {
            game.scene.cameras.push(game.camera1);
        }

        const camera2 = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene); 
        
        let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };


        camera2.setTarget(new BABYLON.Vector3(camera2TargetPosition.x, camera2TargetPosition.y, camera2TargetPosition.z));

        camera2.attachControl(game.scene, false);
        
        camera2.position = new BABYLON.Vector3(0, 0, 12);
        camera2.inputs.attached.keyboard.detachControl();
        camera2.inputs.attached.mousewheel.detachControl();
        camera2.inputs.attached.pointers.detachControl();
        
        // camera2.multiTouchPanAndZoom = false;
        // camera2.multiTouchPanning = false;
        // camera2.pinchInwards = false;
        // camera2pinchZoom = false;
        camera2.inputs.removeByType("ArcRotationCameraInputs");
        camera2.wheelDeltaPercentage = 0.0;
        camera2.panningSensibility = 0.0;
        camera2.fov = 0.75;
        camera2.id = "camera2";
        // camera2.alpha = camera2TargetPosition.alpha;
        camera2.alpha = 1.5685;
        camera2.beta = camera2TargetPosition.beta;
        camera2.radius = camera2TargetPosition.radius;
        camera2.viewport = new BABYLON.Viewport(0.0, 0.0, 1.0, 1.0);

        rot_state2.current = {x:camera2.alpha, y:camera2.beta};
        if (game.scene.cameras.length < 2 && camera2.id === "camera2") {
            game.scene.cameras.push(camera2);
        }

        console.log("GAME SCENE ", game.scene);

        for(let i = 0; i < squareRoot; i++) {
            for (let j = 0; j < squareRoot; j++) {
                const effectsIndex = j + squareRoot * i;
                // console.log('viz idx: ', effectsIndex, visibleFXKnobs[effectsIndex]);

                if (effectsIndex < Object.keys(visibleFXKnobs).length) {
                        if(Object.keys(prevKnobVals.current).indexOf(`${i}`) === -1) {
                            prevKnobVals.current.i = prevKnobVals.current.i || {};
                            prevKnobVals.current.i.j = prevKnobVals.current.i.j ? prevKnobVals.current.i.j : 0;
                        };
                        // create a light for each knob
                        game.light[i] = {};
                        game.light[i][j] = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, game.scene);
                        game.light[i][j].intensity = 0.040;
                            
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
                        game.panel[i][j] = paneL;
                        game.gui.addControl(game.panel[i][j]);

                        // create a text field for each knob
                        game.header[i] = game.header[i] || {}; 

                        game.header[i][j] = new GUI.TextBlock();
                        game.header[i][j].height = "60px";
                        game.header[i][j].paddingTop = "40px";
                        game.header[i][j].fontSizeInPixels = 14;
                        game.header[i][j].color = "white";
                        // console.log('WHAT IS KNOB FOR THIS EFFECT?: ', visibleFXKnobs[effectsIndex])
                        // create a slider for each knob
                        const slid = new GUI.Slider();
                        game.slider[i] = game.slider[i] || {};
                        game.slider[i][j] = slid;
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
                            game.header[i][j].text = `${visibleFXKnobs[effectsIndex][0]}: ${parseConvertScale.toFixed(4)}`;
                            
                            handleUpdateSliderVal(visibleFXKnobs[effectsIndex][1], parseConvertScale);
                            if (!prevKnobVals.current.i.j) value = parseConvertScale;
                            if (prevKnobVals.current.i.j || prevKnobVals.current.i.j < 2 * Math.PI && prevKnobVals.current.i.j > -2 * Math.PI ) {
                                game.knob[i][j][0].rotation = new BABYLON.Vector3(0,Math.PI,-value);
                                // game.knob[i][j][0].rotate(BABYLON.Axis.Z, -(value), BABYLON.Space.LOCAL);
                            }                        
                            prevKnobValue.current = value;
                            prevKnobVals.current.i.j = value;
                        });
                        game.slider[i][j].onPointerUpObservable.add(function (e: any) {
                            handleTurnKnob();
                        });

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
                
                        // handleResetNeedsUpdate();
                        if (game.scene && game.engine?.scenes[0] && game.engine?.scenes[0].meshes.length < 1) {
                            game.scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);

                            // This is the effects knob: use this to handle "amount" based values (eg. 0.0–1.0 / 1–100)
                            BABYLON.SceneLoader.ImportMesh("", "/", "knob3.glb", game.scene, function (newMeshes: any) {
                                newMeshes[0].position.y = 6.8 + ((-((i % squareRoot) / 2)) + (i % squareRoot) * -2.7);
                                newMeshes[0].position.x = 6.5 + ((-((j % squareRoot) / 2)) + (j % squareRoot) * -3.0);
                                newMeshes[0].position.z = zPos;


                                if (!prevKnobVals.current.i.j) {
                                    const getVal = (visibleFXKnobs[effectsIndex][1].value - visibleFXKnobs[effectsIndex][1].min) / (visibleFXKnobs[effectsIndex][1].max - visibleFXKnobs[effectsIndex][1].min)
                                    newMeshes[0].rotation = new BABYLON.Vector3(0,Math.PI,-getVal * 2 * Math.PI);
                                }

                                game.panel[i][j].linkWithMesh(newMeshes[0]);
                                
                                pivot.current.i = pivot.current.i || {};
                                pivot.current.i.j = pivot.current.i.j ? prevKnobVals.current.i.j : 0;
                                pivot.current.i.j = new BABYLON.TransformNode("root_test");
                                pivot.current.i.j.position = new BABYLON.Vector3(newMeshes[0].position.x, newMeshes[0].position.y, newMeshes[0].position.z); 
                                                        
                                knobPosition.current = new BABYLON.Vector3(newMeshes[0].position);

                                const texture = game.scene.textures[1];
                                newMeshes[0].getChildMeshes().forEach((childMesh: any, index: any) => {
                                    childMesh.material.albedoTexture = texture;
                                    childMesh.material.diffuseTexture = texture;
                                    childMesh.material.specularTexture = texture;
                                    childMesh.material.emissiveTexture = texture;
                                    childMesh.materialambientTexture = texture;
                                    if(childMesh.name === "Circle_primitive0") {
                                        childMesh.material = blackMat;
                                    }
                                    if(childMesh.name === "Circle_primitive1") {
                                        switch (i) {
                                            case 0:
                                                childMesh.material = blueMat;
                                                break;
                                            case 1:
                                                childMesh.material = greenMat;
                                                break;
                                            case 2:
                                                childMesh.material = redMat;
                                                break;
                                            case 3:
                                                childMesh.material = purpleMat;
                                                break;
                                            case 4:
                                                childMesh.material = greyMat;
                                                break;
                                            default:
                                                childMesh.material = greyMat;
                                                break;
                                        } 
                                    }
                                if(childMesh.name === "Cube") {
                                    childMesh.material = whiteMat;
                                }
                                });
                                game.knob[i] = game.knob[i] || {};
                                game.knob[i][j] = [];
                                game.knob[i][j].push(newMeshes[0]);
                            });

                        // SEE / ADD STARTER CODE FOR SWITCH HERE! (***see switchKnob file***)
                        }   


                }
            } 
        }
    }



    if (chuckUpdateNeeded) {
        // runChuck();
    }



        let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };
        game.engine.runRenderLoop(function () {
            if (game.camera.length > 0 && rot_state.current.length > 0) {
                game.scene.cameras[0].rotation.x = rot_state.current.x;
                game.scene.cameras[0].rotation.y = rot_state.current.y;
                game.scene.cameras[0].setTarget(BABYLON.Vector3.Zero());
                game.scene.cameras[0].inputs.attached.mouse.detachControl();
                game.scene.cameras[0].position = new BABYLON.Vector3(0, 0, 12);


                game.scene.cameras[1].setTarget(new BABYLON.Vector3(0, 0, 0));
                game.scene.cameras[1].rotation.x = rot_state2.current.x;
                game.scene.cameras[1].rotation.y = rot_state2.current.y;
                // let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };

                game.scene.cameras[1].inputs.attached.mouse.detachControl();
                game.scene.cameras[1].position = new BABYLON.Vector3(0, 0, 12);
            }
            game.scene.render();
            // if (chuckUpdateNeeded) {
            //     runChuck();
            // }
        });
    }

    const handleDebugLayer = (event: any) => {
        game.scene.debugLayer.show({
            embedMode: true,
        });
        const embedHost: any = document.querySelector(`#embed-host`)
        if (embedHost) embedHost.style.position = "absolute";
    }



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


    if (game.scene && hasHexKeys === true && chuckHook && microTonalArr.length > 0) {
        (async() => {
            // updateHasHexKeys(true);
            // if (!hasHexKeys) {
            //     game.scene.activeCamera = game.scene.cameras[0];
            //     return;
            // }
            game.scene.activeCamera = game.scene.cameras[1];
           // return await getHexKeyboard(game, chuckHook, microTonalArr, hasHexKeys);
        })();
    }








    return (
    <ThemeProvider theme={theme}>
        {/* <div style={{position: 'absolute', right: '0', top: '54px', zIndex: '6', width: '4rem', height: '4rem'}}>
            <button id="one" onClick={handleDebugLayer}> Babylon DevTools </button>
        </div> */}
        <Box sx={{
                visibility: programIsOn ? "visible" : "hidden", 
                marginLeft: "140px", 
                width: "100vw", 
                minWidth: window.innerWidth,
                display: "flex",
                flexDirection: "column",
                background: "rgba(56, 60, 84, .1)",
                alignItems: "center",
                // paddingLeft: "140px !important"
            }}
        >
            <canvas 
                style={{
                    minWidth: "800px", 
                    minHeight: "800px", 
                    // maxWidth: "600px", 
                    // maxHeight: "600px", 
                    display: showFX  ? "visible":"none",
                    background: 'transparent', 
                    width:'800px', 
                    height:'800px', 
                    position: 'relative', 
                    // maxHeight: `calc(100% - 12rem)`,
                    // overflow: 'hidden',
                    // top: '0px',

                }} id={`babylonCanvas`} 
                ref={elem => game.canvas = elem}></canvas>
        </Box>
    </ThemeProvider>)
}

export default BabylonScene;










