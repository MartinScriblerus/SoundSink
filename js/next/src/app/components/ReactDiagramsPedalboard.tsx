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
import { HERITAGE_GOLD, OBERHEIM_TEAL } from '@/utils/constants';
import { getConvertedRadio } from '@/utils/utils';

type PedalboardProps = {
    universalSources: React.MutableRefObject<any>;
    currentChain: any;
    sourceName: string;
    width: number;
    height: number;
    handleCheckedEffectsToShow: (e: any) => void;
    getNewFX: (fxName: string) => void;
};

const ReactDiagramsPedalboard = (props: PedalboardProps) => {
    const {universalSources, currentChain, sourceName, width, height, handleCheckedEffectsToShow, getNewFX} = props;

    const theme = useTheme();

    const engine = useMemo(() => {

        const engine = createEngine();

        
        const getNewNodes = ((source: string, nodeVarNames: string[]) => {

            const userAddedNodeNames = nodeVarNames.filter((nodeName: any) => typeof nodeName === 'string' && nodeName.indexOf(source) === -1 && nodeName.indexOf('outlet') === -1);
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
            color: OBERHEIM_TEAL,
        });
        const normalizedHeight = height > 200 ? height - 200 : 48;
        node1.setPosition(32, normalizedHeight);
  
        // Node Outlet
        const node2 = new DefaultNodeModel({
            name: `${sourceName} outlet`,
            color: OBERHEIM_TEAL,
        });
        // node2.setPosition(140, 280);
        node2.setPosition(width - 100, 48);

        // console.log("CURRENT CHAIN**: ", currentChain, sourceName );
        const newNodesFodder = currentChain && currentChain.length > 0 ? getNewNodes(sourceName, currentChain) : [];
        const newNodes: any = [];
        const newLinks: any = [];

        // Add nodes to the engine
        newNodesFodder.forEach((node: any, idx: number) => {
            if (node.id.includes("_source") || node.id.includes("_outlet")) return;
            handleCheckedEffectsToShow({target: {value: node.id}}); 

            console.log("ADDING NODE: ", node.id);

            const newNode = new DefaultNodeModel({
                name: `${node.id}_${sourceName}`,
                color: HERITAGE_GOLD,
            });
            newNode.setPosition((idx) * 80, (idx) * 48);
            newNode.addOutPort('Out');
            newNode.addInPort('In');
            newNodes.push(newNode);
        });

        let portOut_Inlet = node1.addOutPort('Out');
        let portIn_Outlet = newNodes.length > 0 ? newNodes[0].getPort('In') : node2.addInPort('In');
        const initialLink = portOut_Inlet.link<DefaultLinkModel>(portIn_Outlet);
        
        newNodes.length > 0 && newNodes.map((newNode: DefaultNodeModel, idx: number) => {

            newNode.registerListener({
                selectionChanged: () => {
                    console.log("IDX ", idx)
                    const nm: any = newNode.getOptions().name;
                    getNewFX(nm);
                    console.log("NODE SELECTED: ", newNode.getOptions().name, newNode);
                }
            });

            if (idx > 0) {
                const previousNode = newNodes[idx - 1];
                const currentNode = newNodes[idx];

                const outgoingPort = previousNode.getPort('Out') as DefaultPortModel || previousNode.addOutPort('Out') as DefaultPortModel;
                const incomingPort = currentNode.getPort('In') as DefaultPortModel || currentNode.addInPort('In') as DefaultPortModel;

                console.log("AYAYAY CURRENT NODE: ", currentNode);

                

                handleCheckedEffectsToShow({target: {value: currentNode}});

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
    }, [currentChain, sourceName, width, height]);

    
    return(
        <Box 
            sx={{ width:width, height:height }}
        >
            <CanvasWidget engine={engine} className={'pedalboard-canvas'} />
        </Box>
    )
};

export default ReactDiagramsPedalboard;