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
        top: 140,
        fontFamily: "monospace",
        left: -80,
        zIndex: !isInPatternEditMode ? 9999 : 1,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: parseInt(interactionData.xLabel) > 5 ? interactionData.xPos * 1.5 : 200 + (parseInt(interactionData.xLabel) * 5),
          top: interactionData.yPos * 1,
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
