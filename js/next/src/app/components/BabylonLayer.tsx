'use client'

import React, { useState, useRef, useEffect } from "react";

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import '../page.module.css';
import MoogGrandmotherEffects from "../../interfaces/audioInterfaces";
import { ThemeProvider, useTheme } from '@mui/material/styles';

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
    runChuck: () => void;
}) {
    const {game, handleUpdateSliderVal, fxKnobsCount, needsUpdate, handleResetNeedsUpdate, effects, visibleFXKnobs, chuckUpdateNeeded, handleTurnKnob, runChuck} = props;

    const theme = useTheme();

    useEffect(() => {
        if (needsUpdate) {
            handleResetNeedsUpdate();
        }
    }, [needsUpdate])

    const prevKnobValue = useRef<number>(0);
    const prevKnobVals = useRef<any>({});

    const rot_state = useRef<any>();
    const pivot = useRef<any>({});
    const knobPosition = useRef<any>();

    // useEffect(() => {
    //     // if (visibleFXKnobs.length > 0) {
    //     //     setvisibleFXKnobs(effects);
    //     // }
        
    //     console.log('visibleKnobs: ', visibleFXKnobs);
    //     console.log('(current) effects: ', effects);
    // }, [effects])

    if (game && game.engine && !game.scene) {
        game.scene = new BABYLON.Scene(game.engine);
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

            for(let i = 0; i < squareRoot; i++) {
                for (let j = 0; j < squareRoot; j++) {
                    const effectsIndex = j + squareRoot * i;
                    console.log('viz idx: ', effectsIndex, visibleFXKnobs[effectsIndex]);

                    if (effectsIndex < Object.keys(visibleFXKnobs).length) {
                            if(Object.keys(prevKnobVals.current).indexOf(`${i}`) === -1) {
                                prevKnobVals.current.i = prevKnobVals.current.i || {};
                                prevKnobVals.current.i.j = prevKnobVals.current.i.j ? prevKnobVals.current.i.j : 0;
                            };
                            // // create a totally static camera 
                            if (i === 0 && j === 0) {   
                                game.camera[i] = {};
                                game.camera[i][j] = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene); 
                                game.camera[i][j].setTarget(BABYLON.Vector3.Zero());
                                game.camera[i][j].attachControl(game.scene, false);
                                game.camera[i][j].position = new BABYLON.Vector3(0, 0, 12);
                                game.camera[i][j].inputs.attached.keyboard.detachControl();
                                game.camera[i][j].inputs.attached.mousewheel.detachControl();
                                game.camera[i][j].inputs.attached.pointers.detachControl();
                                game.camera[i][j].multiTouchPanAndZoom = false;
                                game.camera[i][j].multiTouchPanning = false;
                                game.camera[i][j].pinchInwards = false;
                                game.camera[i][j].pinchZoom = false;
                                game.camera[i][j].inputs.removeByType("ArcRotationCameraInputs");
                                game.camera[i][j].wheelDeltaPercentage = 0.0;
                                game.camera[i][j].panningSensibility = 0.0;
                                rot_state.current = {};
                                rot_state.current[i] = {};
                                rot_state.current[i][j] = {x:game.camera[i][j].alpha, y:game.camera[i][j].beta};
                            }

                            // create a light for each knob
                            game.light[i] = {};
                            game.light[i][j] = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, game.scene);
                            game.light[i][j].intensity = 0.010;
                                
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
                            game.slider[i][j].height = "80px";
                            game.slider[i][j].paddingTop = "20px";
                            game.slider[i][j].width = "100px";
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
                                game.header[i][j].text = `${visibleFXKnobs[effectsIndex][0]}: ${parseConvertScale.toFixed(2)}`;
                                
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
                                    newMeshes[0].position.y = 6.5 + ((-((i % squareRoot) / 2)) + (i % squareRoot) * -3.2);
                                    newMeshes[0].position.x = 7.8 + ((-((j % squareRoot) / 2)) + (j % squareRoot) * -3.2);
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
        game.engine.runRenderLoop(function () {
            if (game.camera.length > 0 && rot_state.current.length > 0) {
                game.camera[0].rotation.x = rot_state.current.x;
                game.camera[0].rotation.y = rot_state.current.y;
                game.camera[0].setTarget(BABYLON.Vector3.Zero());
                game.camera[0].inputs.attached.mouse.detachControl();
                game.camera[0].position = new BABYLON.Vector3(0, 0, 12);
            }
            game.scene.render();
            if (chuckUpdateNeeded) {
                runChuck();
            }
        });
    }

    const handleDebugLayer = (event: any) => {
        game.scene.debugLayer.show({
            embedMode: true,
        });
        const embedHost: any = document.querySelector(`#embed-host`)
        if (embedHost) embedHost.style.position = "absolute";
    }

    return (
    <ThemeProvider theme={theme}>
        <div style={{position: 'absolute', left: '0', bottom: '0', zIndex: '6', width: '4rem', height: '4rem'}}>
            <button id="one" onClick={handleDebugLayer}> Babylon DevTools </button>
        </div>
        <canvas style={{background: 'transparent', width:'100vw', height:'100vh', overflow: 'hidden'}} id={`babylonCanvas`} ref={elem => game.canvas = elem}></canvas>
    </ThemeProvider>)
}

export default BabylonScene;