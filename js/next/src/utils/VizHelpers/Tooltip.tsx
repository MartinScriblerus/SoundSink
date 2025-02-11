import { InteractionData } from "./Heatmap";
import styles from "./tooltip.module.css";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
  masterPatternsHashHook: any;
};

export const Tooltip = ({ interactionData, width, height, masterPatternsHashHook }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 100,
        left: -80,
        pointerEvents: "none",
      }}
    >
      {/* The actual box with dark background */}
      <div
        className={styles.tooltip}
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <TooltipRow label={"x"} value={interactionData.xLabel} />
        <TooltipRow label={"y"} value={interactionData.yLabel} />
        {/* <TooltipRow label={"value"} value={String(interactionData.value)} /> */}
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
