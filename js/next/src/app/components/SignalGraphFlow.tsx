// import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
// import {
//   ReactFlow,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Controls,
//   Background,
//   applyNodeChanges,
//   applyEdgeChanges,
//   getIncomers,
//   getOutgoers,
//   getConnectedEdges,
//   reconnectEdge,
//   Connection,
// } from '@xyflow/react';
 

// import '@xyflow/react/dist/style.css';
// import { Box, useTheme } from '@mui/material';
 
// type SignalGraphFlowProps = {
//     initialNodes: any;
//     initialEdges: any;
// }
 
// export default function SignalGraphFlow(props: SignalGraphFlowProps) {
//     const theme = useTheme();
//     const { initialNodes, initialEdges } = props;
    
//     const [nodes, setNodes] = useState(initialNodes);
//     const [edges, setEdges] = useState(initialEdges);
//     const [nodesEdgesLength, setNodesEdgesLength] = useState(0);

//     useMemo(() => {
      
//       setNodes(initialNodes);
//       setEdges(initialEdges);
      
//     }, [initialNodes.length, initialEdges.length]);
   
//     const onNodesChange = useCallback(
//       (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
//       [],
//     );
//     const onEdgesChange = useCallback(
//       (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
//       [],
//     );
   
//     const onReconnect = useCallback(
//         (oldEdge: any, newConnection: Connection) =>
//           setEdges((els: any[]) => reconnectEdge(oldEdge, newConnection, els)),
//         [],
//       );

//     const onConnect = useCallback(
//       (params: any) => setEdges((eds: any) => addEdge(params, eds)),
//       [],
//     );

//     const onNodesDelete = useCallback(
//         (deleted: any) => {
//           setEdges(
//             deleted.reduce((acc: any[], node: any) => {
//               const incomers = getIncomers(node, nodes, edges);
//               const outgoers = getOutgoers(node, nodes, edges);
//               const connectedEdges = getConnectedEdges([node], edges);
     
//               const remainingEdges = acc.filter(
//                 (edge) => !connectedEdges.includes(edge),
//               );
     
//               const createdEdges = incomers.flatMap(({ id: source }) =>
//                 outgoers.map(({ id: target }) => ({
//                   id: `${source}->${target}`,
//                   source,
//                   target,
//                 })),
//               );
     
//               return [...remainingEdges, ...createdEdges];
//             }, edges),
//           );
//         },
//         [nodes, edges],
//       );
   
//     useEffect(() => {
//       console.log("heya chck nodes >>> ", nodes);
//       console.log("heya chck edges: ", edges);
//     }, [nodes, edges]);

//     return (
//         <Box sx={{
//             top: '54px',
//             height: "calc(100% - 16rem)",
//             textAlign: "center",
//             background: "rgba(0,0,0,0.7)",
//             color: theme.palette.black,
//             position: "absolute",
//             zIndex: "1",
//             right: "420px",
//             width: "280px",
//             fontFamily: 'monospace',
//           }}
//           key={`reactWrapperKey${nodesEdgesLength}`}
//         >
//             <ReactFlow
//                 nodes={nodes}
//                 // key={`flow_component_${nodes.length}`}
//                 onNodesChange={onNodesChange}
//                 edges={edges}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 onNodesDelete={onNodesDelete}
//                 snapToGrid
//                 onReconnect={onReconnect}
//                 fitView
//             >
//             <Background />
//             <Controls 
//                 orientation={'horizontal'}
//              />
//             </ReactFlow>
//         </Box>
//     );
// }