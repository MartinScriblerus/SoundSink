import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const D3DraggableTree = () => {

    const [treeExists, setTreeExists] = useState<boolean>(false);
    interface NodeData {
        name: string;
        children?: NodeData[];
      }
      
    function setupD3(container: HTMLElement) {
      const width = 928;
    
      async function fetch_json(filepath: string) {
        let response = (await d3.json(filepath) as NodeData);
        console.log({ response });
        const mockJsonStructure = {"name": "root", "children": [
          {
            "name": "Oscillator",  
              "children": [
                { 
                  "name": "effect1", 
                  "size": 1
                }
              ]
            },
            {
              "name": "Sampler", "children": [
                { 
                  "name": "effect2", 
                  "children": [
                    { 
                      "name": "effect3", 
                      "size": 1
                    }
                  ]
                }
              ]
            },
          ]
        }
        render_data(mockJsonStructure);
        // render_data(response);
      }
    
      fetch_json("./flare.json");
    
      function render_data(data: NodeData) {
        const root = d3.hierarchy(data);
        // const dy = 10;
        // const dx = width / (root.height + 1);
        const dy = 50;
        const dx = width / 2;
    
        const tree = d3.tree<NodeData>().nodeSize([dx, dy]);
    
        root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
        tree(root);
    
        let x0 = Infinity;
        let x1 = -x0;
        tree(root).each((d: d3.HierarchyPointNode<NodeData>) => {
          if (d.x > x1) x1 = d.x;
          if (d.x < x0) x0 = d.x;
        });
    
        const height = x1 - x0 + dx * 2;
    
        const svg = d3.create("svg")
          .attr("width", width/2)
          .attr("height", height / 2)
          .attr("id","treeNodes")
          // .attr("viewBox", [dy, x0 - dx, width,height])
          .attr("viewBox", [0, x0 - dx, width,height])
          .attr("style", `font-size: 64px; max-width: 100%; width: ${width}px; height: ${height/3}px;`);
    
        const link = svg.append("g")
        .attr("width", width)
        .attr("height", height)
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 3.5)
          // .attr("viewBox", [x0 - dx, -dy, width, height])
          .attr("viewBox", [0, 0, width, height])
          .selectAll()
          .data(root.links())
          .join("path")
          .attr("style", `background: "yellow";max-width: 100%; width: ${width}px; height: ${height}px; font: 10px sans-serif;`)
          .attr("d", (d) => {
            const linkGenerator = d3
              .linkVertical<d3.HierarchyPointLink<NodeData>, [number, number]>()
              .source((d) => [d.source.y, d.source.x])
              .target((d) => [d.target.y, d.target.x]);
            return linkGenerator(d as d3.HierarchyPointLink<NodeData>);
          });
    
        const node = svg.append("g")
          .attr("width", width * 20)
          .attr("height", height)
          .style("background-color", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .selectAll()
          .data(tree(root).descendants())
          .join("g")
          .attr("transform", d => `translate(${d.y},${d.x})`);
    
        node.append("circle")
          .attr("fill", d => d.children ? "#555" : "#999")
          .attr("r", 12.5);
    
        node.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d.children ? -6 : 6)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name)
          .attr("style", `font-size: 64px;`)
          // .clone(true).lower()
          .attr("stroke", "white")
          .attr("fill", "white");
    
        const treeLen: any = document.getElementById("treeNodes");
        if (!treeLen || treeLen.length < 1) {
          container.append(svg.node()!);
        }
      }
    }
    
    const treeRef = useRef<any>()
    
    useEffect(() => {
      setTreeExists(true);
      if (!treeExists) {
        setupD3(treeRef.current)
      }
    }, []);
    return (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }} ref={treeRef}></Box>
    );
};

export default D3DraggableTree;