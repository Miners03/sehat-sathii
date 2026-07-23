import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "flat";
}

export const Card: React.FC<CardProps> = ({ variant = "default", className = "", children, ...props }) => {
  const baseStyles = "bg-surface rounded-2xl p-6 transition-all";

  const variantStyles = {
    default: "shadow-sm border border-text-muted/10",
    outlined: "border border-text-muted/20",
    flat: "bg-bg border-none",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
