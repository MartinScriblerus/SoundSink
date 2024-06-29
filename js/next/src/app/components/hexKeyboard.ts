import * as GUI from 'babylonjs-gui';
import { useRef } from 'react';
import { Chuck } from 'webchuck';

const snippets: any = [];

export const getHexKeyboard = (game: any, chuckHook: Chuck | undefined, microTonalLetters: any[], hasHexKeys: boolean, key = "C") => {
    
    (async() => {
        console.log("ARE WE GETTING MICRO LETTS IN HEXKEY? ", microTonalLetters)
        let octaveLen: number | undefined = undefined;
        
        for (let x = 0; x < microTonalLetters.length; x++) {
            if (microTonalLetters[x].noteName.charAt(microTonalLetters[x].noteName.length - 1) > 0) {
                octaveLen = x;
                break;
            }
        }
        await octaveLen;
        console.log("WHAT IS OCTAVE LEN??? ", octaveLen);


        //load an asset container for the hex tile
        const hexTileImport = await BABYLON.SceneLoader.LoadAssetContainerAsync("https://assets.babylonjs.com/meshes/", "hexTile.glb", game.scene);
        //The math and properties for creating the hex grid.
        let gridSize = 6;
        let hexLength = 1;
        let hexWidthDistance = Math.sqrt(3) * hexLength;
        let hexHeightDistance = (2 * hexLength);
        let rowlengthAddition = 0;
    
        //Create and load a node material for the top water surface.    
        let waterMaterialTop: any;
        let waterMaterialBottom: any;
        
// BABYLON.NodeMaterial.ParseFromSnippetAsync
    // 57 - 
        for (let i = 57; i < 69; i++) {
            let temp = BABYLON.NodeMaterial.ParseFromSnippetAsync(`TD23TV#${i}`);
            snippets.push(temp);
        }
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
            BABYLON.NodeMaterial.ParseFromSnippetAsync("BS6C1U#1", game.scene).then(nodeMaterial => {
                waterMaterialBottom = nodeMaterial;
                waterMaterialBottom.name = "waterMaterialBottom";
                
                // chuckHook && createHexGrid(gridSize, hexWidthDistance, hexHeightDistance, rowlengthAddition, hexTileImport, waterMaterialTop, game.scene.activeCameras[1], game.scene, key, chuckHook);
                chuckHook && createHexGrid(gridSize, hexWidthDistance, hexHeightDistance, rowlengthAddition, hexTileImport, snippets, game.scene.activeCamera, game.scene, key, chuckHook);
            });
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

        // console.log("WHAT IS FLAT ARRAY? ", flatArray);
        let flatNoiseTexture: any = BABYLON.RawTexture.CreateRGBTexture(flatArray, factor*2, factor*2, game.scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        flatNoiseTexture.name = "flatNoiseTexture";
    
        //handling of hex tile picking
        game.scene.onPointerDown = function (evt: any, pickResult: any) {
            if(pickResult.pickedMesh){
                console.log("PICK RESULT: ", pickResult.pickedMesh.name, pickResult.pickedMesh.parent.parent.name.replace("hexTile", ""));
                let animGroups = game.scene.animationGroups;
                for(let i=0; i<animGroups.length; i++){
                    if(animGroups[i].targetedAnimations[0].target === pickResult.pickedMesh.parent){
                        let siblingMeshes = pickResult.pickedMesh.parent.getChildMeshes();
                        for(let j = 0; j<siblingMeshes.length; j++){
                            if(siblingMeshes[j].name === "bottom" && siblingMeshes[j].material !== waterMaterialBottom){
                                siblingMeshes[j].material = waterMaterialBottom;
                            }
                        }
    
                        animGroups[i].play();
                    }
                }
    
                let noiseTexture = flatNoiseTexture;
    
                //set all meshes in this hex tile to no longer be pickable
                let siblingMeshes = pickResult.pickedMesh.parent.getChildMeshes()
                // for (let i = 0; i<siblingMeshes.length; i++){
                //     siblingMeshes[i].isPickable = false;
                // }
    
                // //randomly determine if this hex tile has an island or not and process the island components
                // if(Math.random()>0.5){
                //     let noiseArray = diamondSquare(resolution, multiplier);
    
                //     let scaledArray = scaleNoise(noiseArray);
                    
                //     //This creates a texture, pixel by pixel using the influenced random values from the noiseArray.
                //     noiseTexture = BABYLON.RawTexture.CreateRGBTexture(scaledArray, factor*2, factor*2, game.scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                //     noiseTexture.name = "noiseTexture"
                // }
                BABYLON.NodeMaterial.ParseFromSnippetAsync(("UM4R4N#2"), game.scene).then(nodeMaterial => {
                    nodeMaterial.name = "terrainMaterial"+ pickResult.pickedMesh.parent.parent.name.slice(7);
                    for (let i = 0; i<siblingMeshes.length; i++){
                        if(siblingMeshes[i].name === "terrain" && siblingMeshes[i].visibility !== 1){
                            siblingMeshes[i].visibility = 1;
                            siblingMeshes[i].material = nodeMaterial;
                            siblingMeshes[i].hasVertexAlpha = false;
                        }
                    }
                    let block: any = nodeMaterial.getBlockByPredicate((b) => b.name === "noiseTexture1");
                    block.texture = noiseTexture;    
                    block = nodeMaterial.getBlockByPredicate((b) => b.name === "noiseTexture2");
                    block.texture = noiseTexture;
                    block.texture.wAng = BABYLON.Tools.ToRadians(Math.min(360, Math.max(0, (Math.random()*360))));
                    block.texture.uScale = 0.75;
                    block.texture.vScale = 0.75;
                });
            } 
        };
    

    
    
    function createHexGrid(gridSize: any, hexWidthDistance: any, hexHeightDistance: any, rowlengthAddition: any, hexTileImport: any, waterMaterialTop: any, camera: any, scene: any, key: string, chuckHook: Chuck | undefined){
        let gridStart = new BABYLON.Vector3((hexWidthDistance/2)*(gridSize-1),0,(-hexHeightDistance*0.75)*(gridSize-1));
        for(let i = 0; i < (gridSize*2)-1; i++){
            for(let y = 0; y < gridSize + rowlengthAddition; y++){
                
                console.log("hex num check: ", i + y, "microTonalLeters: ", microTonalLetters);
                 
                const existingMesh = scene.getMeshByName("hexTile"+i+y);

                if(existingMesh){
                    // existingMesh.remove();
                    console.log("EXISTING MESH: ", existingMesh);
                    existingMesh.dispose();
                    // activeCameras
                    // scene.activeCameras = scene.activeCameras[0];
                } else {                
                    const arrNum = i + y;
                    console.log("arrnum: ", arrNum);
                    console.log("IF WE HAVE MICROFREQS HERE WE ARE GOOD: ", microTonalLetters.length > 0 && microTonalLetters[arrNum]);
                    let hexTile = hexTileImport.instantiateModelsToScene();
                    let hexTileRoot = hexTile.rootNodes[0];
                    // hexTileRoot.name = "hexTile"+i+y;
                    hexTileRoot.id = "hexTile"+i+y;
                    hexTileRoot.name = "hexTile";

                    hexTileRoot.position.copyFrom(gridStart);
                    hexTileRoot.position.x -= hexWidthDistance * y;
        






                    
                    let hexChildren = hexTileRoot.getDescendants();
                    for(let k=0; k<hexChildren.length; k++){
                        hexChildren[k].name = hexChildren[k].name.slice(9);
                        if(hexChildren[k].name === "terrain"){
                            hexChildren[k].visibility = 0;
                        }
                    }
        
                    let hexTileChildMeshes = hexTileRoot.getChildMeshes();
                    for (let j = 0; j < hexTileChildMeshes.length; j++){
                        console.log("sanity... ", i, j, y)
                    
                        const theNoteNum: any = i * j * (y+1);
                        const theFreq: number = 440 * Math.pow(2, ((theNoteNum - 69)/ 12))
                        console.log("THE FREQ: ", theFreq);
                        console.log("THE CULPRIT? ", waterMaterialTop[0])

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
                    }
        
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
    
    //This is the main method that builds a randomly influenced noise data array by running the "diamond-square algorithm." https://en.wikipedia.org/wiki/Diamond-square_algorithm
    // function diamondSquare(resolution: any, multiplier: any){
    //     let gridSize = resolution-1;
    //     let rows = [];
    //     let columns = [];
    //     let subdivisions = 1;
    
    //     //initialize the grid
    //     for(let y=0; y<resolution; y++){
    //         for(let x=0; x<resolution; x++){
    //             columns[x] = 0;
    //         }
    //         rows[y] = columns;
    //         columns = [];
    //     }
    
    //     //set corner values
    //     rows[0][0] = Math.random()/multiplier;
    //     rows[0][gridSize] = Math.random()/multiplier;
    //     rows[gridSize][0] = Math.random()/multiplier;
    //     rows[gridSize][gridSize] = Math.random()/multiplier;
    
    //     let loopBreak = 0;
    //     while(loopBreak != 1){
    //         subdivisions = subdivisions*2;
    //         let distance = gridSize/subdivisions;
    
    //         //diamond step
    //         for(let rowNumber=distance; rowNumber<resolution; rowNumber+=(distance*2)){
    //             for(let columnNumber=distance; columnNumber<resolution; columnNumber+=(distance*2)){
    //                 rows[rowNumber][columnNumber] = diamond(rows, distance, rowNumber, columnNumber, subdivisions, multiplier);
    //             }
    //         }
    
    //         //square step
    //         for(let rowNumber=0; rowNumber<resolution; rowNumber += distance){
    //             for(let columnNumber=0; columnNumber<resolution; columnNumber += distance){
    //                 if(rows[rowNumber][columnNumber] == 0){
    //                     rows[rowNumber][columnNumber] = square(rows, distance, rowNumber, columnNumber, subdivisions, multiplier);
    //                 }
    //             }
    //         }
    
    //         loopBreak = 1;
    //         for(let y=0; y<resolution; y++){
    //             for(let x=0; x<resolution; x++){
    //                 if(rows[y][x] == 0){
    //                     loopBreak = 0;
    //                 }
    //             }
    //         }
    //     }
    //     //Create a Uint8Array, convert nested row/column array to Uint8Array, multiply by 255 for color.
    //     let dataArray = new Uint8Array((resolution-1)*(resolution-1)*3);
    //     let rowCounter = 0;
    //     let columnCounter = 0;
    //     let adjustedNoiseValue = 0;
    //     for (let i=0; i<dataArray.length; i+=3){
    //         adjustedNoiseValue = rows[rowCounter][columnCounter]*255;
    //         adjustedNoiseValue = Math.min(255, Math.max(0, adjustedNoiseValue));
    //         dataArray[i] = adjustedNoiseValue;
    //         dataArray[i+1] = adjustedNoiseValue;
    //         dataArray[i+2] = adjustedNoiseValue;
    //         columnCounter ++;
    //         if(columnCounter == resolution-1){
    //             columnCounter = 0;
    //             rowCounter ++;
    //         }
    //     };
    
    //     return dataArray;
    // }
    
    // function diamond(rows: any, distance: any, rowNumber: any, columnNumber: any, subdivisions: any, multiplier: any){
    
    //     let diamondAverageArray = [];
    //     if(rows[rowNumber-distance][columnNumber-distance] != null){
    //         diamondAverageArray.push(rows[rowNumber-distance][columnNumber-distance]);
    //     }
    //     if(rows[rowNumber-distance][columnNumber+distance] != null){
    //         diamondAverageArray.push(rows[rowNumber-distance][columnNumber+distance]);
    //     }
    //     if(rows[rowNumber+distance][columnNumber-distance] != null){
    //         diamondAverageArray.push(rows[rowNumber+distance][columnNumber-distance]);
    //     }
    //     if(rows[rowNumber+distance][columnNumber+distance] != null){
    //         diamondAverageArray.push(rows[rowNumber+distance][columnNumber+distance]);
    //     }
    //     let diamondValue = 0;
    //     for(let i = 0; i<diamondAverageArray.length; i++){
    //         diamondValue += diamondAverageArray[i];
    //     }
    
    //     diamondValue = (diamondValue/diamondAverageArray.length) + ((Math.random()-0.5)/multiplier)/subdivisions;
        
    //     return diamondValue;
    // }
    
    // function square(rows: any, distance: any, rowNumber: any, columnNumber: any, subdivisions: any, multiplier: any){
    
    //     let squareAverageArray = [];
    //     if(rows[rowNumber-distance] != null && rows[rowNumber-distance][columnNumber] != null){
    //         squareAverageArray.push(rows[rowNumber-distance][columnNumber]);
    //     }
    //     if(rows[rowNumber][columnNumber+distance] != null){
    //         squareAverageArray.push(rows[rowNumber][columnNumber+distance]);
    //     }
    //     if(rows[rowNumber+distance] != null && rows[rowNumber+distance][columnNumber] != null){
    //         squareAverageArray.push(rows[rowNumber+distance][columnNumber]);
    //     }
    //     if(rows[rowNumber][columnNumber-distance] != null){
    //         squareAverageArray.push(rows[rowNumber][columnNumber-distance]);
    //     }
    //     let squareValue = 0;
    //     for(let i = 0; i<squareAverageArray.length; i++){
    //         squareValue += squareAverageArray[i];
    //     }
    
    //     squareValue = (squareValue/squareAverageArray.length) + ((Math.random()-0.5)/multiplier)/subdivisions;
        
    //     return squareValue;
    // }
    
    // function scaleNoise(noiseArray: any){
    //     //Scale the noise to always produce an island
    //     let max = 0;
    //     let min = 255;
    //     let desiredMin = 80;
    //     let desiredMax = 110;
    //     let scaledNoiseArray = new Uint8Array(noiseArray.length);
    
    //     for(let i=0; i<noiseArray.length; i++){
    //         if(noiseArray[i]>max){
    //             max = noiseArray[i];
    //         }
    //         if(noiseArray[i]<min){
    //             min = noiseArray[i];
    //         }
    //     }
    
    //     for(let i=0; i<noiseArray.length; i++){
    //         let adjustedValue = desiredMax * (noiseArray[i]-min) / (max - min) + desiredMin;
    //         scaledNoiseArray[i] = adjustedValue;
    //     }
    
    //     return scaledNoiseArray;
    // }

    

})();
}