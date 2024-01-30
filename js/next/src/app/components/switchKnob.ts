                            // This is starter code for the switch (it is hardcoded off, but it appears properly aside from some awkwardness in its rotation states)
                            // if (i === 10000 && j === 0) {
                            //     BABYLON.SceneLoader.ImportMesh("", "/", "switch.glb", game.scene, function (newMeshes: any) {
                            //         newMeshes[0].position.x = 1;
                            //         newMeshes[0].position.y = 0;
                            //         newMeshes[0].position.z = -10;
                            //         newMeshes[0].scaling.x = .5;
                            //         newMeshes[0].scaling.y = .5;
                            //         newMeshes[0].scaling.z = .5;
                            //         newMeshes[0].rotation.y = 0;
                            //         console.log('N E W M E S H: ', newMeshes[0]._children[1]);
                            //         // newMeshes[0].rotation.y = 0;
                            //         newMeshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
                                    
                            //         newMeshes[0].material = pbr;

                            //         // pbr.roughness = 1.0;
                            //         // pbr.albedoColor = new BABYLON.Color3(1.0, 0.766, 0.336);
                            //         pbr.metallic = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
                            //         pbr.roughness = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
                            //         pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", game.scene);
                            //         pbr.metallicTexture = new BABYLON.Texture("/textures/mr.jpg", game.scene);
                            //         pbr.useRoughnessFromMetallicTextureAlpha = false;
                            //         pbr.useRoughnessFromMetallicTextureGreen = true;
                            //         pbr.useMetallnessFromMetallicTextureBlue = true;

                            //         const texture = game.scene.textures[1];

                            //         const pivot = new BABYLON.TransformNode("root_test_switch");
                            //         pivot.position = new BABYLON.Vector3(newMeshes[0].position.x, newMeshes[0].position.y, newMeshes[0].position.z); 
                            //         let switchPosition = new BABYLON.Vector3(newMeshes[0].position);
                            //         pivot.rotate(switchPosition, 2, BABYLON.Space.WORLD);
                            //         newMeshes[0]._children[2].scaling.y = 0.6;
                            //         newMeshes[0]._children[2].rotate(BABYLON.Axis.Y, 1, BABYLON.Space.WORLD);
                            //         console.log('game scene textures: ', game.scene.textures);

                            //         newMeshes[0].getChildMeshes().forEach((childMesh: any, index: any) => {
                            //             childMesh.material.albedoTexture = texture;
                            //             childMesh.material.diffuseTexture = texture;
                            //             childMesh.material.specularTexture = texture;
                            //             childMesh.material.emissiveTexture = texture;
                            //             childMesh.materialambientTexture = texture;
                            //             // childMesh.material = greyMat;
                            //             childMesh.material = pbr;
                            //             pbr.metallic = 0;
                            //             pbr.roughness = 1.0;
                            //             pbr.albedoColor = new BABYLON.Color3(90/255, 99/255, 111/255);
                            //             pbr.metallic = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
                            //             pbr.roughness = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
                            //             pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/environment.dds", game.scene);
                            //             pbr.metallicTexture = new BABYLON.Texture("/reflectivity.png", game.scene);
                            //             pbr.useRoughnessFromMetallicTextureAlpha = false;
                            //             pbr.useRoughnessFromMetallicTextureGreen = true;
                            //             pbr.useMetallnessFromMetallicTextureBlue = true;
                            //         });
    
                            //         // game.panel[i][j].linkWithMesh(newMeshes[0]);
                                                            
                            //         // const pivot = new BABYLON.TransformNode("root_test");
                            //         // pivot.position = new BABYLON.Vector3(newMeshes[0].position.x, newMeshes[0].position.y, newMeshes[0].position.z); 
                            //         // let knobPosition = new BABYLON.Vector3(newMeshes[0].position);
                            //         // pivot.rotate(knobPosition, rotationRadians.current, BABYLON.Space.WORLD);
                            //     });
                            // }
export default {};