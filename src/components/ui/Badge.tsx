import React from "react";
import { CheckCircle2, AlertTriangle, HeartHandshake, Info } from "lucide-react";
import type { WellnessSignal } from "@/types";

export type BadgeTone = WellnessSignal | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = "neutral",
  showIcon = true,
  className = "",
  children,
  ...props
}) => {
  const toneStyles = {
    steady: "bg-steady/15 text-steady border-steady/30",
    notice: "bg-notice/15 text-notice border-notice/30",
    reach_out: "bg-reach-out/15 text-reach-out border-reach-out/30",
    neutral: "bg-text-muted/15 text-text-muted border-text-muted/30",
  };

  const getToneLabel = (t: BadgeTone) => {
    switch (t) {
      case "steady":
        return "Steady";
      case "notice":
        return "Notice & Care";
      case "reach_out":
        return "Reach Out";
      default:
        return "Info";
    }
  };

  const getToneIcon = (t: BadgeTone) => {
    switch (t) {
      case "steady":
        return <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "notice":
        return <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "reach_out":
        return <HeartHandshake className="w-4 h-4 shrink-0" aria-hidden="true" />;
      default:
        return <Info className="w-4 h-4 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border ${toneStyles[tone]} ${className}`}
      {...props}
    >
      {showIcon && getToneIcon(tone)}
      <span>{children || getToneLabel(tone)}</span>
    </span>
  );
};
