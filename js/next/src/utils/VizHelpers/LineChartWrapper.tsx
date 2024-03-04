import { useState } from "react";
import { LineChart } from "./LineChart";

export const LineChartWrapper = ({ width = 700, height = 400 }) => {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    const mockData = [
        { x: 1, y: 40 },
        { x: 2, y: 12 },
        { x: 3, y: 34 },
        { x: 4, y: 33 },
        { x: 5, y: 22 },
        { x: 6, y: 9 },
        { x: 7, y: 18 },
        { x: 8, y: 78 },
        { x: 9, y: 28 },
        { x: 10, y: 34 },
    ]

  return (
    // <div style={{ display: "flex", zIndex: "9999" }}>
    //     SHIT
    <LineChart
        data={mockData}
        width={width}
        height={height}
        cursorPosition={cursorPosition}
        setCursorPosition={setCursorPosition}
        color={"#e85252"}
      />
    // </div>
  );
};
