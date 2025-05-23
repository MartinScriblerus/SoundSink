import createEngine, { 
    DefaultLinkModel, 
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import { Box, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import React from 'react';
import { MUTED_OLIVE, PALE_BLUE } from '@/utils/constants';

type PedalboardProps = {
    currentChain: any;
    sourceName: string;
};

const ReactDiagramsPedalboard = (props: PedalboardProps) => {
    const {currentChain, sourceName} = props;

    const theme = useTheme();


    // // intermediate connector nodes
    // const getNewNodes = ((source: string, nodeVarNames: string[]) => {
    //     const userAddedNodeNames = nodeVarNames.filter(nodeName => !nodeName.includes('source') && !nodeName.includes('outlet'));
    //     const nodesArr = [
    //         {
    //             id: `${sourceName}_source`,
    //             target: [''],
    //             source: ['']
    //         },
    //         {
    //             id: `${sourceName}_outlet`,
    //             target: [''],
    //             source: [''],
    //         }
    //     ];
     
    //     if (userAddedNodeNames.length > 0) {
    //         userAddedNodeNames.map((nodeName: string, idx: number) => {  
    //             if (userAddedNodeNames.length - 1 === idx ) {
    //                 console.log("this will likely send to outlet: ", idx, nodeName)
    //             } 
    //             //add in an override here for editing the order of pedals in chain...
    //             nodesArr.splice(nodesArr.length - 1, 0,
    //             {
    //                 id: `${nodeName}`,
    //                 target: [userAddedNodeNames.length - 1 === idx ? `${sourceName}_outlet` : `${sourceName}_${userAddedNodeNames[idx + 1]}`],
    //                 source: [idx < 1 ? `${sourceName}_source` : `${sourceName}_${userAddedNodeNames[idx - 1]}`] 
    //             });
    //         });
    //     } else {
    //         nodesArr[0].target = [`${sourceName}_outlet`];
    //         nodesArr[1].source = [`${sourceName}_source`];
    //     }
    //     nodesArr[0].target = [...nodesArr[0].target, `${sourceName}_${userAddedNodeNames[0]}`]; 
    //     nodesArr[nodesArr.length - 1].source = [...nodesArr[nodesArr.length - 1].source, `${sourceName}_${userAddedNodeNames[userAddedNodeNames.length - 1]}`];
    //     return nodesArr;
    // });

    const engine = useMemo(() => {
        const engine = createEngine();

        // intermediate connector nodes
        
        const getNewNodes = ((source: string, nodeVarNames: string[]) => {
            const userAddedNodeNames = nodeVarNames.filter(nodeName => !nodeName.includes('source') && !nodeName.includes('outlet'));
            const nodesArr = [
                {
                    id: `${sourceName}_source`,
                    target: [''],
                    source: ['']
                },
                {
                    id: `${sourceName}_outlet`,
                    target: [''],
                    source: [''],
                }
            ];
        
            if (userAddedNodeNames.length > 0) {
                userAddedNodeNames.map((nodeName: string, idx: number) => {  
                    if (userAddedNodeNames.length - 1 === idx ) {
                        console.log("this will likely send to outlet: ", idx, nodeName)
                    } 
                    //add in an override here for editing the order of pedals in chain...
                    nodesArr.splice(nodesArr.length - 1, 0,
                    {
                        id: `${nodeName}`,
                        target: [userAddedNodeNames.length - 1 === idx ? `${sourceName}_outlet` : `${sourceName}_${userAddedNodeNames[idx + 1]}`],
                        source: [idx < 1 ? `${sourceName}_source` : `${sourceName}_${userAddedNodeNames[idx - 1]}`] 
                    });
                });
            } else {
                nodesArr[0].target = [`${sourceName}_outlet`];
                nodesArr[1].source = [`${sourceName}_source`];
            }
            nodesArr[0].target = [...nodesArr[0].target, `${sourceName}_${userAddedNodeNames[0]}`]; 
            nodesArr[nodesArr.length - 1].source = [...nodesArr[nodesArr.length - 1].source, `${sourceName}_${userAddedNodeNames[userAddedNodeNames.length - 1]}`];
            return nodesArr;
        });

        // Node Inlet
        const node1 = new DefaultNodeModel({
            name: `${sourceName} source`,
            color: PALE_BLUE,
        });
        node1.setPosition(0, 180);
  
        // Node Outlet
        const node2 = new DefaultNodeModel({
            name: `${sourceName} outlet`,
            color: PALE_BLUE,
        });
        // node2.setPosition(140, 280);
        node2.setPosition(140, 12);
        
        const newNodesFodder = currentChain && currentChain.length > 0 ? getNewNodes(sourceName, currentChain) : [];
        const newNodes: any = [];
        const newLinks: any = [];

        // Add nodes to the engine
        newNodesFodder.forEach((node: any, idx: number) => {
            if (node.id.includes("_source") || node.id.includes("_outlet")) return;
            const newNode = new DefaultNodeModel({
                name: `${node.id}_${sourceName}`,
                color: MUTED_OLIVE,
            });
            newNode.setPosition(40, (idx) * 70);
            newNode.addOutPort('Out');
            newNode.addInPort('In');
            newNodes.push(newNode);
        });

        let portOut_Inlet = node1.addOutPort('Out');
        let portIn_Outlet = newNodes.length > 0 ? newNodes[0].getPort('In') : node2.addInPort('In');
        const initialLink = portOut_Inlet.link<DefaultLinkModel>(portIn_Outlet);
        
        newNodes.length > 0 && newNodes.map((newNode: DefaultNodeModel, idx: number) => {
            if (idx > 0) {
                const previousNode = newNodes[idx - 1];
                const currentNode = newNodes[idx];
                const outgoingPort = previousNode.getPort('Out') as DefaultPortModel || previousNode.addOutPort('Out') as DefaultPortModel;
                const incomingPort = currentNode.getPort('In') as DefaultPortModel || currentNode.addInPort('In') as DefaultPortModel;
                if (outgoingPort && incomingPort) {
                    const link = outgoingPort.link<DefaultLinkModel>(incomingPort);
                    newLinks.push(link);
                }
            } else if (idx === 0 && newNodes.length === 1) {
                const outgoingPort = newNodes[0].getPort('Out') as DefaultPortModel || newNodes[0].addOutPort('Out') as DefaultPortModel;
                const incomingPort = node2.getPort('In') as DefaultPortModel || node2.addInPort('In') as DefaultPortModel;
                if (outgoingPort && incomingPort) {
                    const link = outgoingPort.link<DefaultLinkModel>(incomingPort);
                    newLinks.push(link);
                }
            } else {
                const outgoingPort = newNodes[newNodes.length - 1].getPort('Out') as DefaultPortModel || newNodes[newNodes.length - 1].addOutPort('Out') as DefaultPortModel;
                const incomingPort = node2.getPort('In') as DefaultPortModel || node2.addInPort('In') as DefaultPortModel;
                if (outgoingPort && incomingPort) {
                    const link = outgoingPort.link<DefaultLinkModel>(incomingPort);
                    newLinks.push(link);
                }
            }
        })
        let newLinkIn;
        let newLinkOut;
        newLinks.push(newLinkIn);
        newLinks.push(newLinkOut);
        // link.addLabel('Link between nodes');
        const model = new DiagramModel();
        model.addAll(node1, node2, ...newNodes, initialLink, ...newLinks);
        engine.setModel(model);
        return engine;
    }, [currentChain, sourceName]);

    
    return(
        <CanvasWidget engine={engine} className={'pedalboard-canvas'} />
    )
};

export default ReactDiagramsPedalboard;