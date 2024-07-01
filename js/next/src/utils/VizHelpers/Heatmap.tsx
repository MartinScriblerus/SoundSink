import { useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { Box } from "@mui/material";

type HeatmapProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: number }[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const Heatmap = ({ width, height, data }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    <Box sx={{ 
      background: "rgba(30,34,26,0.96)",
      position: "relative", 
      // height: "100vh",
      paddingTop: "8vh",
      left: '0px',
      width: '100%',
      height: `calc(100vh - 272px)`
    }}>
      <Renderer
        width={width - 60}
        height={height}
        data={data}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip 
        interactionData={hoveredCell} 
        width={width} 
        height={height} />
    </Box>
  );
};
