import { useTheme } from '@mui/material';
import * as GUI from 'babylonjs-gui';
import { useRef } from 'react';
import { Chuck } from 'webchuck';

let snippets: any = [];

export const getHexKeyboard = (game: any, chuckHook: Chuck | undefined, microTonalLetters: any[], key = "C") => {
    
    const theme = useTheme();
    
    (async() => {
        console.log("$$$ ARE WE GETTING MICRO LETTS IN HEXKEY? ", microTonalLetters)
        let octaveLen: number | undefined = undefined;
        
        for (let x = 0; x < microTonalLetters.length; x++) {
            if (microTonalLetters && 
                microTonalLetters.length > 0 && 
                microTonalLetters[x].noteName 
                && 
                microTonalLetters[x].noteName.length > 0) 
                {
                    octaveLen = x;
                    break;
                }
        }
        await octaveLen;
        console.log("WHAT IS OCTAVE LEN??? ", octaveLen);


        //load an asset container for the hex tile
        // this works whenever we want to edit it...
        // edit here: https://nme.babylonjs.com/#TD23TV/#57
        const hexTileImport = await BABYLON.SceneLoader.LoadAssetContainerAsync("https://assets.babylonjs.com/meshes/", "hexTile.glb", game.scene);
        //The math and properties for creating the hex grid.
        let gridSize = 5;
        let hexLength = 1;
        let hexWidthDistance = Math.sqrt(3) * hexLength;
        let hexHeightDistance = (2 * hexLength);
        let rowlengthAddition = 0;
    
        //Create and load a node material for the top water surface.    
        let waterMaterialTop: any;
        let waterMaterialBottom: any;
        
        // BABYLON.NodeMaterial.ParseFromSnippetAsync
        // 57 - 69
        snippets = [];
        // for (let i = 57; i < 69; i++) {
        //     let temp = BABYLON.NodeMaterial.ParseFromSnippetAsync(`TD23TV#${i}`);
        //     snippets.push(temp);
        // }
        console.log("SNIPPETS: ", snippets.length, snippets);
        let randTest = Math.random() * (69 - 57) + 57;
        let randTestCeil = Math.ceil(randTest);
        let randTestFloor = Math.floor(randTestCeil);
        let randTestRound = Math.round(randTestFloor);
        let randTestTrunc = Math.trunc(randTestRound);
        console.log("RAND TEST: ", randTest);
        // TD23TV#41, 43 - 56 (#41 == #56)
        // BABYLON.NodeMaterial.ParseFromSnippetAsync("TD23TV#48", game.scene).then(nodeMaterial => {
        BABYLON.NodeMaterial.ParseFromSnippetAsync(`TD23TV#${randTestTrunc}`, game.scene).then(nodeMaterial => {
            // waterMaterialTop = nodeMaterial;
            // waterMaterialTop.name = "waterMaterialTop"
            // BABYLON.NodeMaterial.ParseFromSnippetAsync("BS6C1U#1", game.scene).then(nodeMaterial => {
            //     waterMaterialBottom = nodeMaterial;
            //     waterMaterialBottom.name = "waterMaterialBottom";
                // alert("NEW")
                // chuckHook && createHexGrid(gridSize, hexWidthDistance, hexHeightDistance, rowlengthAddition, hexTileImport, waterMaterialTop, game.scene.activeCameras[1], game.scene, key, chuckHook);
                chuckHook && createHexGrid(microTonalLetters, gridSize, hexWidthDistance, hexHeightDistance, rowlengthAddition, hexTileImport, snippets, game.scene.activeCamera, game.scene, key, chuckHook);
            // });
        });
    
        //Factor is the width and height of the texure you'd like to create, must be a factor of 2.
        let factor = 512;
    
        //Resolution is the number of actual grid points that you'll have. width x height. Then add 1 to make it an odd number of grid points.
        let resolution = (2*factor)+1;
        let multiplier = 1;
    
        //create a flat texture for non-island tiles
        let flatArray = new Uint8Array(factor*4);;
        for(let i = 0; i<flatArray.length; i++){
            flatArray[i] = 0;
        }

        let flatNoiseTexture: any = BABYLON.RawTexture.CreateRGBTexture(flatArray, factor*2, factor*2, game.scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        flatNoiseTexture.name = "flatNoiseTexture";
        game.scene.activeCamera = game.scene.cameras[1]
        //handling of hex tile picking
        game.scene.onPointerDown = function (evt: any, pickResult: any) {
            if(pickResult.pickedMesh){
                console.log("PICK RESULT: ", pickResult.pickedMesh, "parent: ", pickResult.pickedMesh.parent.parent);
                // let animGroups = game.scene.animationGroups;
                // for(let i=0; i<animGroups.length; i++){
                //     if(animGroups[i].targetedAnimations && 
                //         animGroups[i].targetedAnimations.length > 0 && 
                //         animGroups[i].targetedAnimations[0].target === pickResult.pickedMesh.parent){
                //         let siblingMeshes = pickResult.pickedMesh.parent.getChildMeshes();
                //         // for(let j = 0; j<siblingMeshes.length; j++){
                //         //     if(siblingMeshes[j].name === "bottom" && siblingMeshes[j].material !== waterMaterialBottom){
                //         //         siblingMeshes[j].material = waterMaterialBottom;
                //         //     }
                //         // }
    
                //         animGroups[i].play();
                //     }
                // }
    
                let noiseTexture = flatNoiseTexture;
    
                //set all meshes in this hex tile to no longer be pickable
                let siblingMeshes = pickResult.pickedMesh.parent.getChildMeshes()

                // BABYLON.NodeMaterial.ParseFromSnippetAsync(("UM4R4N#2"), game.scene).then(nodeMaterial => {
                //     nodeMaterial.name = "terrainMaterial"+ pickResult.pickedMesh.parent.parent.name.slice(7);
                //     for (let i = 0; i<siblingMeshes.length; i++){
                //         if(siblingMeshes[i].name === "terrain" && siblingMeshes[i].visibility !== 1){
                //             siblingMeshes[i].visibility = 1;
                //             siblingMeshes[i].material = nodeMaterial;
                //             siblingMeshes[i].hasVertexAlpha = false;
                //         }
                //     }
                //     let block: any = nodeMaterial.getBlockByPredicate((b) => b.name === "noiseTexture1");
                //     block.texture = noiseTexture;    
                //     block = nodeMaterial.getBlockByPredicate((b) => b.name === "noiseTexture2");
                //     block.texture = noiseTexture;
                //     block.texture.wAng = BABYLON.Tools.ToRadians(Math.min(360, Math.max(0, (Math.random()*360))));
                //     block.texture.uScale = 0.75;
                //     block.texture.vScale = 0.75;
                // });
            } 
        };
    
    function createHexGrid(
        microTonalLetters: any, 
        gridSize: any, 
        hexWidthDistance: any, 
        hexHeightDistance: any, 
        rowlengthAddition: any, 
        hexTileImport: any, 
        waterMaterialTop: any, 
        camera: any, 
        scene: any, 
        key: string, 
        chuckHook: Chuck | undefined
    ){
        console.log("fmicrotonal: ",  microTonalLetters);
        // microTonalLetters.forEach((i:any) => i.name.includes('hexTile') && i.dispose());
        gridSize = Math.log(microTonalLetters.length);
        let gridStart = new BABYLON.Vector3(
            (hexWidthDistance / 2) * (gridSize - 1),
            0,
            (-hexHeightDistance * 0.75) * (gridSize - 1)
        );

        for (let i = 0; i < gridSize * 2 - 1; i++) {
            for (let y = 0; y < gridSize + rowlengthAddition; y++) {
                console.log("hexTile"+`_${i}`+`_${y}`, "microTonalLetters: ", microTonalLetters);
                
                const existingMesh = scene.getMeshById("hexTile_" + i + "_" + y);

                if (existingMesh) {
                    existingMesh.dispose();
                }

                
                const arrNum = i + y;

                let hexTile = hexTileImport.instantiateModelsToScene();
                let hexTileRoot = hexTile.rootNodes[0];

                hexTileRoot.id = "hexTile_" + i + "_" + y;
                hexTileRoot.name = "hexTile";
                
                hexTileRoot.data = microTonalLetters[(i) + (y*microTonalLetters.length)]
                
                hexTileRoot.position.copyFrom(gridStart);
                hexTileRoot.position.x -= hexWidthDistance * y;
    
                // console.log("hex tile root: ", hexTileRoot);

                const noteIndex = (i * gridSize + y) % microTonalLetters.length;
                const noteName = microTonalLetters[noteIndex]?.noteName || "";

                // Add GUI Plane for Text
                const plane = BABYLON.MeshBuilder.CreatePlane(
                    `notePlane_${i}_${y}`,
                    { width: 0.8, height: 0.8 },
                    scene
                );
                plane.parent = hexTileRoot;
                plane.position = new BABYLON.Vector3(0, 0.1, 0); // Adjust position to hover above the hex tile

                // Create AdvancedDynamicTexture
                const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
                const textBlock = new BABYLON.GUI.TextBlock();
                textBlock.text = noteName;
                textBlock.color = 'rgba(255,255,255,0.78)';
                textBlock.fontSize = 100;
                advancedTexture.addControl(textBlock);


                let hexChildren = hexTileRoot.getDescendants();
                for(let k=0; k<hexChildren.length; k++){
                    hexChildren[k].name = hexChildren[k].name.slice(9);
                    if(hexChildren[k].name === "terrain"){
                        hexChildren[k].visibility = 0;
                    }
                }
    
                let hexTileChildMeshes = hexTileRoot.getChildMeshes();

                console.log("WHAT THE... 1 HEXTILE MESHES: ", hexTileChildMeshes);
                console.log("WHAT THE... 2 HEXTILE LETTERS  ", )

                for (let j = 0; j < hexTileChildMeshes.length; j++){
                    
                    console.log("sanity... ", i, j, y)
                
                    const theNoteNum: any = i * j * (y+1);
                    const theFreq: number = 440 * Math.pow(2, ((theNoteNum - 69)/ 12))
                    // console.log("THE FREQ: ", theFreq);
                    // console.log("THE CULPRIT? ", waterMaterialTop[0])

                    const topMaterial: any = Promise.resolve(waterMaterialTop[arrNum]).then((result: any) => {

                    // waterMaterialTop = nodeMaterial;
                    topMaterial.name = "waterMaterialTop"

                    if(hexTileChildMeshes[j].name === "top"){
                        // hexTileChildMeshes[j].material = waterMaterialTop[0];
                        hexTileChildMeshes[j].material = result;
                        hexTileChildMeshes[j].hasVertexAlpha = false;
                        hexTileChildMeshes[j].name = `pickableTop_${i}_${j}`; // i is the col & j is the row
                    }



                    });
                    // }
        
                    let hexTileAnimGroup = hexTile.animationGroups[0];
                    hexTileAnimGroup.name = "AnimGroup"+hexTileRoot.name;
                }
            };
    
            if(i >= gridSize-1){
                rowlengthAddition -= 1;
                gridStart.x -= hexWidthDistance / 2;
                gridStart.z += hexHeightDistance * 0.75;
            }
            else{
                rowlengthAddition += 1;
                gridStart.x += hexWidthDistance / 2;
                gridStart.z += hexHeightDistance * 0.75;
            }
        };
        camera.radius = gridSize * 2.3; // <<<< CHANGES SIZE OF HEXGRID IN CAMERA
        camera.upperRadiusLimit = camera.radius + 5;
    
        let allAnimGroups = scene.animationGroups;
        for(let i=0; i<allAnimGroups.length; i++){
            allAnimGroups[i].reset();
        }
    }
    

    
    return () => {
        game.scene.animationGroups.dispose();
        game.scene.animationGroups = null;
        game.scene.dispose();
    }
    })();
}