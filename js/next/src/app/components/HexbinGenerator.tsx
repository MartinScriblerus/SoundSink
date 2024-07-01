import { Box } from "@mui/material";
import * as d3 from "d3";
import * as d3Hexbin from 'd3-hexbin'

import React, {useRef} from "react";

interface Props {
    widthProp: number;
    heightProp: number;
}

const HexBin = (props: Props) => {
    const {widthProp, heightProp} = props;
    const hexbinWrapper = useRef<any>(null)

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = widthProp - margin.left - margin.right,
        height = widthProp - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(hexbinWrapper.current)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // read data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_for_density2d.csv").then( function(data: any) {

    // Add X axis
    const x = d3.scaleLinear()
        .domain([5, 18])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([5, 20])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Reformat the data: d3.hexbin() needs a specific format
    const inputForHexbinFun: any = []
    data.forEach(function(d: any) {
        inputForHexbinFun.push( [x(d.x), y(d.y)] )  // Note that we had the transform value of X and Y !
    })

    // Prepare a color palette
    const color = d3.scaleLinear<string, number>()
        .domain([0, 0]) // Number of points in the bin?
        .range(["transparent",  "red", "blue"])

    // Compute the hexbin data
    const hexbin = d3Hexbin.hexbin()
        .radius(width/(4 * 6)) //size of the bin in px
        .extent([ [0, 0], [width, height] ])

    // Plot the hexbins
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data( hexbin(inputForHexbinFun) )
        .join("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d: any) { return `translate(${d.x}, ${d.y})`})
        .attr("fill", function(d: any, idx: number) { return color(idx % 2); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.5")
    })

    return (
        <Box sx={{
            position: 'absolute',
            // display: 'flex',
            // flexDirection: 'column',
            // background: 'beige',
            // zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
        }} ref={hexbinWrapper}></Box>
    )
}
export default HexBin;
