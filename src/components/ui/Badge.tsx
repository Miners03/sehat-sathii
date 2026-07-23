import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { TriageLevel } from "@/types";

export type BadgeTone = TriageLevel | "neutral";

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
    self_care: "bg-self-care/15 text-self-care border-self-care/30",
    monitor: "bg-monitor/15 text-monitor border-monitor/30",
    escalate: "bg-escalate/15 text-escalate border-escalate/30",
    neutral: "bg-text-muted/15 text-text-muted border-text-muted/30",
  };

  const getToneLabel = (t: BadgeTone) => {
    switch (t) {
      case "self_care":
        return "Self-care";
      case "monitor":
        return "Monitor";
      case "escalate":
        return "Escalate";
      default:
        return "Info";
    }
  };

  const getToneIcon = (t: BadgeTone) => {
    switch (t) {
      case "self_care":
        return <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "monitor":
        return <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "escalate":
        return <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />;
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
