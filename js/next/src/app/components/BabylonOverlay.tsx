import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import '../page.module.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import { getHexKeyboard } from "./hexKeyboard";
import { Chuck } from "webchuck";
import { useEffect, useRef } from 'react';
import NewHexbin from './NewHexbin';

const BabylonOverlay = (props: {
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
    programIsOn:boolean;
    microTonalArr: any[];
    chuckHook: Chuck | undefined;
    updateHasHexKeys: (msg: boolean) => void;
    hasHexKeys: boolean;
}) => {
    const {
        game, 
        microTonalArr,
        chuckHook,
        updateHasHexKeys,
    } = props;

    const rot_state2 = useRef<any>();
    // game.scene2 = !game.scene2 && game.engine2 ? new BABYLON.Scene(game.engine2) : game.scene2;

    useEffect(() => {
        alert("yup")
        // alert(hasHexKeys)
        // // if (!hasHexKeys) {
        // if (!isEditingHextiles.current) {
            while(game.scene2 && Object.keys(game.scene2).length > 0 && game.scene2.meshes.length && game.scene2.getMeshByName("hexTile")){
                game.scene2.getMeshByName("hexTile").dispose();
            }
            // game.scene && game.scene.meshes.forEach((i: any) => i.name === "hexTile" && i.dispose() && i === null);
        // } else {
        //     isEditingHextiles.current = false;
        // }
        const hexTiles = game.scene2 && game.scene2.meshes.filter((i: any) => i.name === "hexTile" && i);

        while(game.scene2 && Object.keys(game.scene2).length > 0 && game.scene2.meshes.length && game.scene2.getMeshByName("hexTile")){
            game.scene2.getMeshByName("hexTile").dispose();
        }
        // console.log("ERR HEXTILES 1", game.scene && game.scene.meshes.filter((i: any) => i.name === "hexTile" && i));
        // console.log("check sane: ", game.scene && game.scene.meshes && game.scene.meshes.filter((m: any) => m.name === "hexTile"))
        console.log("MICRO ARR??? ", microTonalArr);
        if (chuckHook && 
            game.scene2 && game.scene2.meshes && 
            // game.scene.meshes.filter((m: any) => m.name === "hexTile").length < 1 &&
            microTonalArr && microTonalArr.length > 0 && 
            hexTiles.length === 0) {
                // isEditingHextiles.current = true;
                getHexKeyboard(game, chuckHook, microTonalArr);
                updateHasHexKeys(true);
        }
    }, [microTonalArr])

        useEffect(() => {
        // updateHasHexKeys(false);
        // try {
        //     game.scene.meshes.map((i:any) => i.name === "hexTile" && i.dispose());
        // } catch (e) {
            
        // }
        // if(game.scene && game.scene.cameras && game.scene.cameras.length > 0 &&  game.scene.activeCamera !== game.scene.cameras[0]) {
        //     game.scene.activeCamera = game.scene.cameras[0];
        // // } else {
        //     if (game.scene && game.scene.cameras.length > 0) {
        //         game.scene.activeCamera = game.scene.cameras[1];
        //     }
        //     const hexTiles = game.scene && game.scene.meshes.filter((m: any) => m.name === "hexTile");
        //     console.log("ERR HEXTILES ", hexTiles);
        //     hexTiles && hexTiles.length > 0 && hexTiles.forEach((h: any) => {
        //         h.getChildMeshes().forEach((m: any) => {
        //             m.dispose();
        //         });
        //         h.dispose();
        //     });
            if (chuckHook) {
                getHexKeyboard(game, chuckHook, microTonalArr);
            }
        // }
    }, [microTonalArr, chuckHook, microTonalArr.length])


    const createHexGrid = (scene: any) => {
        const hexRadius = 0.6; // Radius of each hexagon
        const hexWidth = hexRadius * Math.sqrt(3); // Width between centers of hexes
        const hexHeight = hexRadius * 1.5; // Height between rows of hexes

        // Generate a grid of hexagons
        for (let i = 0; i < microTonalArr.length; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;

            // Staggered grid positioning
            const xPos = col * hexWidth;
            const yPos = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);

            const hex = BABYLON.MeshBuilder.CreateDisc(
            `hex-${i}`,
            { radius: hexRadius, tessellation: 6 },
            scene
            );
            hex.position = new BABYLON.Vector3(xPos, yPos, 0);
            let hexMat = new BABYLON.StandardMaterial(`mat-${i}`, scene);
            
            hexMat.diffuseColor = new BABYLON.Color3(0/255, 0/255, 0/255);
            hex.material = hexMat;
            // Add a click action to each hex
            hex.actionManager = new BABYLON.ActionManager(scene);
            hex.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                onHexClick(microTonalArr[i] || `Hex ${i + 1}`);
            })
            );
        }
    };

    useEffect(() => {
        
        // game && game.engine2 && game.engine2.initAsync();
        if (!game || !game.engine2) return;
        const scene2: any = game && game.engine2 && new BABYLON.Scene(game.engine2);
        
        console.log("ENGINE2: ", game.engine2);
        
        // const camera2: any = game && game.engine2 && new BABYLON.ArcRotateCamera('cameraOverlay', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene2);
        // camera2.attachControl(document.getElementById('canvasOverlay'), true);
          
        const camera2 = new BABYLON.ArcRotateCamera("ArcRotCamera", 0, -1, 10.1762, BABYLON.Vector3.Zero(), game.scene2); 
        
        let camera2TargetPosition = { alpha: 1.6, beta: 0, radius: 12, x: 0, y: 0, z: 0 };


        camera2.setTarget(new BABYLON.Vector3(camera2TargetPosition.x, camera2TargetPosition.y, camera2TargetPosition.z));

        camera2.attachControl(game.scene, false);
        
        camera2.position = new BABYLON.Vector3(0, 0, 12);
        camera2.inputs.attached.keyboard.detachControl();
        camera2.inputs.attached.mousewheel.detachControl();
        camera2.inputs.attached.pointers.detachControl();
        camera2.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        camera2.orthoLeft = -20;
        camera2.orthoRight = 20;
        camera2.orthoTop = 20;
        camera2.orthoBottom = -20;
        camera2.attachControl(game.canvas2, true);
    
        // Disable rotation and enable panning (dragging)
        camera2.lowerRadiusLimit = camera2.upperRadiusLimit = camera2.radius; // Prevent zooming
        camera2.panningSensibility = 50; // Adjust this value for desired drag speed
        camera2.allowUpsideDown = false; // Keep camera right side up
    
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

        game.camera2 = camera2;
        game.scene2 = scene2;
        game.scene2.activeCamera = camera2;

        if (game.scene2 && game.scene2!== undefined) {
            // Create hex grid
            createHexGrid(game.scene2);

        }
        // Render loop
        game.engine2.runRenderLoop(() => {
            game.scene2.render();
        });

        // // Resize the engine when the window is resized
        // window.addEventListener("resize", () => engine.resize());

        

        rot_state2.current = {x:camera2.alpha, y:camera2.beta};
        // if (game.scene.cameras.length < 2 && camera2.id === "camera2") {
        //     game.scene.cameras.push(camera2);
        // }

        // const sphere2 = BABYLON.MeshBuilder.CreateSphere('sphereOverlay', {}, scene2);
        // console.log("SPHERE 2 ---------->  ", sphere2);
        // game.engine2.runRenderLoop(() => scene2.render());
      //  if (game.scene && hasHexKeys === true && chuckHook && microTonalArr.length > 0) {
            (async() => {
                updateHasHexKeys(true);
                // if (!hasHexKeys) {
                //     game.scene.activeCamera = game.camera2;
                //     return;
                // }
                // game.scene.activeCamera = game.scene.cameras[1];
               return await getHexKeyboard(game, chuckHook, microTonalArr);
            })();
        // }
        return () => {
            game.engine2.dispose();
          };
    }, [game])

    const onHexClick = (val: any) => {
        console.log("HEY CHECK THIS VAL: ", val);
    }

    useEffect(() => {
        console.log("WHAT THE FUCK IS GAME: ", game);
    });
    
    return (
        <>
        {
            game && game.length > 0 && game.scene2 && Object.values(game.scene2).length > 0 && (
                <NewHexbin 
                    game={game} 
                    numHexes={microTonalArr.length}
                    values={microTonalArr}
                    onHexClick={onHexClick}
                />
            )
        }  
        </>
    )
}
export default BabylonOverlay;