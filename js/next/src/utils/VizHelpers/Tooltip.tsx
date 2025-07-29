import { InteractionData } from "./Heatmap";
import styles from "./tooltip.module.css";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
  masterPatternsHashHook: any;
  isInPatternEditMode: boolean;
};

export const Tooltip = ({ 
  interactionData, 
  width, 
  height, 
  masterPatternsHashHook, 
  isInPatternEditMode
}: TooltipProps) => {

  if (!interactionData) {
    return null;
  }

  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        // top: 140,
              top: 240,
        fontFamily: "monospace",
        // left: !isInPatternEditMode ? -80 : 20,
        // zIndex: !isInPatternEditMode ? 9999 : 1,
        left: -80,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "464px",
          //left: interactionData.xPos * .7 : 200 + (parseInt(interactionData.xLabel) * 5),
          // top: interactionData.yPos * 1,
          width: 200,
          top: 180,
          background: "rgba(0, 0, 0, 0.78)",
        }}
      >
        <TooltipRow label={"x"} value={interactionData.xLabel} />
        <TooltipRow label={"y"} value={interactionData.yLabel} />
        <TooltipRow label={"subdivisions"} value={String(masterPatternsHashHook[interactionData.yLabel][interactionData.xLabel].subdivisions)} />
      </div>
    </div>
  );
};

type TooltipRowProps = {
  label: string;
  value: string;
};

const TooltipRow = ({ label, value }: TooltipRowProps) => (
  <div>
    <b>{label}</b>
    <span>: </span>
    <span>{value}</span>
  </div>
);
